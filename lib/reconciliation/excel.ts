// Excel processing runs only in the local worker, loaded on demand.
import readExcelFile from "read-excel-file/universal";
import writeExcelFile, { type CellObject, type Sheet } from "write-excel-file/universal";
import { strFromU8, unzipSync } from "fflate";
import { MAX_CSV_BYTES, MAX_HEADER_ROWS, MAX_TRANSACTIONS, type CsvDocument, type CsvRecord, type Match, type Reconciliation } from "./types";
import { reportRows } from "./report";

/** Bound compressed input and expanded ZIP contents before parsing OOXML. */
export function validateWorkbookArchive(bytes: ArrayBuffer) {
  if (bytes.byteLength > MAX_CSV_BYTES) throw new Error("Choose an Excel file up to 5 MB.");
  const view = new DataView(bytes);
  if (bytes.byteLength < 22 || view.getUint32(0, true) !== 0x04034b50) throw new Error("Choose a standard .xlsx workbook. Password-protected files and older .xls files are not supported.");
  let end = bytes.byteLength - 22;
  const lower = Math.max(0, end - 65535);
  while (end >= lower && view.getUint32(end, true) !== 0x06054b50) end--;
  if (end < lower) throw new Error("This Excel file is incomplete. Save it again as .xlsx.");
  const count = view.getUint16(end + 10, true);
  const size = view.getUint32(end + 12, true);
  let cursor = view.getUint32(end + 16, true);
  if (count > 1000 || cursor + size > end || view.getUint16(end + 4, true) || view.getUint16(end + 6, true)) throw new Error("This workbook is too complex. Export just the bank or cashbook worksheet.");
  const directoryEnd = cursor + size;
  let expanded = 0;
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > directoryEnd || view.getUint32(cursor, true) !== 0x02014b50) throw new Error("The workbook archive could not be read.");
    if (view.getUint16(cursor + 8, true) & 1) throw new Error("Remove the workbook password before importing.");
    expanded += view.getUint32(cursor + 24, true);
    if (expanded > 25 * 1024 * 1024) throw new Error("This workbook expands beyond 25 MB. Export a shorter period or fewer worksheets.");
    cursor += 46 + view.getUint16(cursor + 28, true) + view.getUint16(cursor + 30, true) + view.getUint16(cursor + 32, true);
    if (cursor > directoryEnd) throw new Error("The workbook archive could not be read.");
  }
  const files = unzipSync(new Uint8Array(bytes));
  let hasFormulas = false;
  for (const [name, data] of Object.entries(files)) {
    if (!/^xl\/worksheets\/[^/]+\.xml$/.test(name)) continue;
    const xml = strFromU8(data);
    hasFormulas ||= /<f(?:\s|>)/.test(xml);
    for (const match of xml.matchAll(/<row\b[^>]*\br="(\d+)"/g)) {
      if (Number(match[1]) > MAX_TRANSACTIONS + MAX_HEADER_ROWS + 1) throw new Error("Use a worksheet within 10,000 transaction rows. Remove unused formatted rows or export a shorter period.");
    }
    // Sparse cell coordinates can allocate huge arrays even in a small ZIP.
    for (const match of xml.matchAll(/\br="([A-Z]+)(\d+)"/g)) {
      let column = 0;
      for (const letter of match[1]) column = column * 26 + letter.charCodeAt(0) - 64;
      if (column > 200 || Number(match[2]) > MAX_TRANSACTIONS + MAX_HEADER_ROWS + 1) throw new Error("Use a worksheet within 200 columns and 10,000 transaction rows. Export a shorter period or remove unused formatted rows.");
    }
  }
  return { hasFormulas };
}

export async function readWorkbook(bytes: ArrayBuffer, sheetName?: string): Promise<{ document: CsvDocument; sheets: string[] }> {
  const { hasFormulas } = validateWorkbookArchive(bytes);
  let workbook;
  try { workbook = await readExcelFile(bytes, { trim: false }); }
  catch { throw new Error("This workbook could not be read. Remove any password and save it again as .xlsx."); }
  if (!workbook.length || workbook.length > 30) throw new Error("Choose a workbook with 1 to 30 worksheets.");
  const sheet = workbook.find(sheet => sheet.sheet === (sheetName ?? workbook[0].sheet));
  if (!sheet) throw new Error("Choose an available worksheet.");
  const records: CsvRecord[] = [];
  const width = Math.max(0, ...sheet.data.map(row => row.length));
  if (width > 200) throw new Error("Use up to 200 columns per worksheet.");
  sheet.data.forEach((row, index) => {
    const cells = Array.from({ length: width }, (_, column) => {
      const value = row[column];
      const text = value instanceof Date ? value.toISOString().slice(0, 10) : value === null || value === undefined ? "" : String(value);
      if (text.length > 20_000) throw new Error("A worksheet cell exceeds 20,000 characters.");
      return text;
    });
    if (cells.some(value => value.trim())) records.push({ line: index + 1, cells });
  });
  if (records.length > MAX_TRANSACTIONS + MAX_HEADER_ROWS + 1) throw new Error("Use up to 10,000 transaction rows. Export a shorter period.");
  return { document: { records, delimiter: ",", sheet: sheet.sheet, hasFormulas }, sheets: workbook.map(sheet => sheet.sheet) };
}

const base: CellObject = { fontFamily: "Arial", fontSize: 11, textColor: "#1e293b", alignVertical: "top", wrap: true };
const literal = (value: string | number): CellObject => ({ ...base, value, type: typeof value === "number" ? Number : String });

/** Imported text is always a literal String cell; it cannot become a formula. */
export async function createWorkbookReport(result: Reconciliation, matches: Match[], notes: Record<string, string>): Promise<ArrayBuffer> {
  const rows = reportRows(result, matches, notes);
  const sheets: Sheet<Blob>[] = [{
    sheet: "Summary", columns: [{ width: 48 }, { width: 85 }], stickyRowsCount: 3, showGridLines: false,
    data: [
      [{ ...base, value: "Bank reconciliation working paper", fontSize: 20, fontWeight: "bold", columnSpan: 2, height: 38 }],
      [{ ...base, value: "Transaction comparison · closing balances require separate verification", textColor: "#64748b", columnSpan: 2, height: 28 }],
      [],
      ...[["Bank file", result.bank.name], ["Cashbook file", result.ledger.name], ...rows.filter(row => row[0] === "Summary").map(row => [row[1], row[8]])].map(values => values.map(value => ({ ...literal(value), height: Math.max(26, Math.ceil(String(values[1]).length / 85) * 15 + 8), bottomBorderColor: "#e2e8f0", bottomBorderStyle: "hair" as const })))
    ]
  }];
  const headers = ["Source", "Source file / worksheet", "Source row", "Transaction ID", "Date", "Description", "Reference", "Amount", "Currency", "Status", "Match ID", "Method", "Reason / possible cause", "Reviewer note", "Original cells"];
  for (const name of ["Matched", "Needs review", "Excluded rows"]) {
    const data = rows.filter(row => name === "Excluded rows" ? row[0] === "Invalid row" : row[0] === "Transaction" && ((name === "Matched") === ["automatic", "accepted", "manual"].includes(String(row[10]))));
    if (name === "Excluded rows" && !data.length) continue;
    sheets.push({
      sheet: name, orientation: "landscape", stickyRowsCount: 4, showGridLines: false,
      columns: [14, 40, 12, 18, 17, 42, 22, 19, 12, 17, 24, 18, 65, 55, 65].map(width => ({ width })),
      data: [
        [{ ...base, value: name, fontSize: 18, fontWeight: "bold", columnSpan: headers.length, height: 34 }],
        [{ ...base, value: `${data.length} source rows · ${result.options.currency} · Snapshot of your review`, columnSpan: headers.length, textColor: "#64748b", height: 26 }],
        [], headers.map(value => ({ ...base, value, fontWeight: "bold", backgroundColor: "#f1f5f9", height: 30 })),
        ...data.map(row => row.slice(1).map((value, index): CellObject => ({
          ...literal(value),
          ...(index === 4 && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? { type: Date, value: new Date(`${value}T00:00:00Z`), format: "dd mmm yyyy" } : {}),
          ...(index === 7 && typeof value === "number" ? { format: "#,##0.00;(#,##0.00)" } : {}),
          height: Math.min(180, Math.max(32, Math.ceil(Math.max(String(row[6]).length / 42, String(row[13]).length / 65, String(row[14]).length / 55)) * 15 + 8)),
          bottomBorderColor: "#e2e8f0", bottomBorderStyle: "hair"
        })))
      ]
    });
  }
  return (await writeExcelFile(sheets).toBlob()).arrayBuffer();
}
