import assert from "node:assert/strict";
import writeExcelFile from "write-excel-file/universal";
import readExcelFile from "read-excel-file/universal";
import { unzipSync, zipSync, strFromU8, strToU8 } from "fflate";
import { createWorkbookReport, readWorkbook, validateWorkbookArchive } from "../lib/reconciliation/excel";
import { hasShortYear, inferDateFormat, parseDate } from "../lib/reconciliation/dates";
import { inferHeaderRow, inferMapping, normalizeImport, parseCsv, tableFromDocument } from "../lib/reconciliation/csv";
import { reconcile } from "../lib/reconciliation/matcher";
import { sampleBankCsv, sampleLedgerCsv } from "../lib/reconciliation/sample";
import type { ImportInput, Source } from "../lib/reconciliation/types";

function input(text: string, source: Source): ImportInput {
  const table = tableFromDocument(parseCsv(text), 0);
  return { name: `${source}.csv`, table, mapping: inferMapping(table, source) };
}

async function main() {
  for (const value of ["05 May 26", "5-MAY-2026", "May 5, 2026", "05 Mei 26", "5.5.26"]) assert.equal(parseDate(value, "dmy")?.iso, "2026-05-05", value);
  assert.equal(parseDate("05/06/26", "mdy")?.iso, "2026-05-06");
  assert.equal(parseDate("05/06/26", "dmy")?.iso, "2026-06-05");
  assert.equal(parseDate("05 May 95", "named", 1900)?.iso, "1995-05-05");
  assert.equal(parseDate("05 May 95", "named")?.iso, "2095-05-05");
  for (const value of ["31 Apr 26", "29 Feb 26", "05 NotAMonth 26", "32/01/26"]) assert.equal(parseDate(value, "dmy"), null, value);
  assert.equal(parseDate("29 Feb 24", "named")?.iso, "2024-02-29");
  assert.equal(inferDateFormat(["05 May 26", "06 Jun 26"]), "named");
  assert.equal(inferDateFormat(["2026-05-05", "03/04/26"]), "");
  assert.equal(inferDateFormat(["13/04/26", "04/13/26"]), "");
  assert.equal(inferDateFormat(["13/04/26", "05 May 26", "2026-06-01"]), "dmy");
  assert.equal(hasShortYear("05 May 26"), true);
  assert.equal(hasShortYear("2026-05-05"), false);
  console.log("PASS flexible dates keep ambiguity, century choice and real calendar validation");

  const data = [["Export for testing"], ["Date", "Description", "Amount", "Reference"], [new Date("2026-05-05T00:00:00Z"), "Customer", 1250.5, "00012"], [null, null, null, null], ["06 May 26", "Fee", -10, "FEE"]];
  const bytes = await (await writeExcelFile(data, { sheet: "Transactions", dateFormat: "dd mmm yyyy" }).toBlob()).arrayBuffer();
  const imported = await readWorkbook(bytes);
  assert.deepEqual(imported.sheets, ["Transactions"]);
  assert.equal(imported.document.records[2].cells[0], "2026-05-05");
  assert.equal(imported.document.records[3].line, 5);
  const headerRow = inferHeaderRow(imported.document);
  assert.equal(headerRow, 1);
  const table = tableFromDocument(imported.document, headerRow);
  const normalized = normalizeImport({ name: "sample.xlsx — Transactions", table, mapping: inferMapping(table, "bank") }, "bank", "MYR");
  assert.equal(normalized.invalid.length, 0);
  assert.equal(normalized.totalCents, 124050);
  assert.equal(normalized.transactions[0].reference, "00012");
  assert.equal(normalized.transactions[1].line, 5);
  console.log("PASS Excel date cells, blank rows, preamble headers, reference text and source rows survive import");

  const multi = await (await writeExcelFile([{ sheet: "Cover", data: [["Choose Transactions"]] }, { sheet: "Transactions", data, dateFormat: "dd mmm yyyy" }]).toBlob()).arrayBuffer();
  assert.equal((await readWorkbook(multi)).document.records.length, 1);
  assert.equal((await readWorkbook(multi, "Transactions")).document.records[2].cells[2], "1250.5");
  await assert.rejects(readWorkbook(multi, "Missing"), /available worksheet/);
  console.log("PASS workbooks expose worksheet selection even when the first sheet has no transactions");

  const files = unzipSync(new Uint8Array(bytes));
  const sheetPath = Object.keys(files).find(name => /^xl\/worksheets\/[^/]+\.xml$/.test(name))!;
  const sheetXml = strFromU8(files[sheetPath]);
  const macFiles = unzipSync(new Uint8Array(bytes));
  macFiles["xl/workbook.xml"] = strToU8(strFromU8(macFiles["xl/workbook.xml"]).replace(/<workbookPr\b[^>]*\/>/, '<workbookPr date1904="1"/>'));
  assert.match(strFromU8(macFiles["xl/workbook.xml"]), /date1904="1"/);
  macFiles[sheetPath] = strToU8(sheetXml.replace(/(<c\b[^>]*r="A3"[^>]*>[\s\S]*?<v>)([\d.]+)(<\/v>)/, (_, start, serial, end) => start + (Number(serial) - 1462) + end));
  assert.equal((await readWorkbook(zipSync(macFiles).buffer as ArrayBuffer)).document.records[2].cells[0], "2026-05-05", "1904 Excel date system must preserve the calendar date");
  assert.match(sheetXml, /r="C3"/);
  files[sheetPath] = strToU8(sheetXml.replace(/(<c\b[^>]*r="C3"[^>]*>)([\s\S]*?)(<\/c>)/, '$1<f>1250+0.5</f>$2$3'));
  const formulaImport = await readWorkbook(zipSync(files).buffer as ArrayBuffer);
  assert.equal(formulaImport.document.hasFormulas, true);
  assert.equal(formulaImport.document.records[2].cells[2], "1250.5");
  files[sheetPath] = strToU8(sheetXml.replace('r="C3"', 'r="XFD1000000"'));
  await assert.rejects(readWorkbook(zipSync(files).buffer as ArrayBuffer), /200 columns/);
  assert.throws(() => validateWorkbookArchive(new ArrayBuffer(10)), /standard .xlsx/);
  const oversized = new Uint8Array(bytes.slice(0));
  const oversizedView = new DataView(oversized.buffer);
  for (let i = 0; i < oversized.length - 46; i++) if (oversizedView.getUint32(i, true) === 0x02014b50) { oversizedView.setUint32(i + 24, 26 * 1024 * 1024, true); break; }
  assert.throws(() => validateWorkbookArchive(oversized.buffer), /25 MB/);
  console.log("PASS formula saved values, corrupt files, excessive expansion and sparse coordinate bounds are checked");

  const result = reconcile(input(sampleBankCsv + '\ninvalid,Bad,BAD,1.001', "bank"), input(sampleLedgerCsv, "ledger"), { days: 3, combined: true, currency: "MYR", statementEnd: "2026-09-30" });
  const report = await createWorkbookReport(result, result.matches, { "bank:6": '=HYPERLINK("https://example.invalid","not executable")' });
  const reportSheets = await readExcelFile(report);
  assert.deepEqual(reportSheets.map(sheet => sheet.sheet), ["Summary", "Matched", "Needs review", "Excluded rows"]);
  assert.equal(reportSheets[1].data.length - 4, 6);
  assert.equal(reportSheets[2].data.length - 4, 13);
  assert.equal(reportSheets[3].data.length - 4, 1);
  assert.equal(reportSheets[2].data.find(row => row[3] === "bank:6")?.[13], '=HYPERLINK("https://example.invalid","not executable")');
  assert.equal(typeof reportSheets[1].data[4][7], "number");
  assert.ok(reportSheets[1].data[4][4] instanceof Date);
  const reportXml = unzipSync(new Uint8Array(report));
  for (const [name, bytes] of Object.entries(reportXml)) if (name.startsWith("xl/worksheets/")) assert.doesNotMatch(strFromU8(bytes), /<f(?:\s|>)/, "Imported notes must never become workbook formulas");
  assert.ok(Object.entries(reportXml).some(([name, bytes]) => name.includes("worksheets/") && strFromU8(bytes).includes('state="frozen"')));
  console.log("PASS Excel working paper preserves every source row, review notes, numbers, dates and literal text safely");
}
void main().catch(error => { console.error(error); process.exitCode = 1; });
