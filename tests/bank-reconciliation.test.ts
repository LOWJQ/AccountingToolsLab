import assert from "node:assert/strict";
import { inferHeaderRow, inferMapping, mappingError, normalizeImport, parseCsv, parseDate, parseMoney, tableFromDocument } from "../lib/reconciliation/csv";
import { isTransposition, matchTransactions, reconcile, referenceKey } from "../lib/reconciliation/matcher";
import { acceptMatch, getReview, manualMatch, releaseMatch } from "../lib/reconciliation/review";
import { createReport, csvCell } from "../lib/reconciliation/report";
import { isPrivateToolUrl } from "../lib/reconciliation/privacy";
import { sampleBankCsv, sampleLedgerCsv } from "../lib/reconciliation/sample";
import { MAX_CSV_BYTES, type ImportInput, type MatchOptions, type NormalizedImport, type Source, type Transaction } from "../lib/reconciliation/types";

function test(name: string, run: () => void) { run(); console.log(`PASS ${name}`); }
const options: MatchOptions = { days: 3, combined: true, currency: "MYR", statementEnd: "" };
function input(text: string, source: Source): ImportInput {
  const document = parseCsv(text);
  const table = tableFromDocument(document, inferHeaderRow(document));
  return { name: `${source}.csv`, table, mapping: inferMapping(table, source) };
}
function row(source: Source, line: number, cents: number, reference = "", day = 20000, description = ""): Transaction {
  return { id: `${source}:${line}`, source, line, cents, reference, day, date: new Date(day * 86_400_000).toISOString().slice(0, 10), description, originalCells: [reference, String(cents / 100)] };
}
function source(rows: Transaction[], name: Source): NormalizedImport {
  return { name: `${name}.csv`, source: name, transactions: rows, invalid: [], totalCents: rows.reduce((sum, item) => sum + item.cents, 0) };
}
function match(bank: Transaction[], ledger: Transaction[], settings = options) {
  return matchTransactions(source(bank, "bank"), source(ledger, "ledger"), settings);
}

test("CSV handles BOM, CRLF, quoted commas, quotes and multiline source lines", () => {
  const parsed = parseCsv('\uFEFFDate,Description,Amount\r\n2026-09-01,"Customer, \"\"A\"\"\nsecond line",100.00\r\n2026-09-02,Fee,-1.00');
  assert.equal(parsed.records[1].cells[1], 'Customer, "A"\nsecond line');
  assert.equal(parsed.records[1].line, 2);
  assert.equal(parsed.records[2].line, 4);
});
test("semicolon and tab exports are detected without splitting quoted amounts", () => {
  assert.equal(parseCsv('Date;Description;Amount\n14/09/2026;Invoice;1.234,56').delimiter, ";");
  assert.equal(parseCsv('Date\tDescription\tAmount\n2026-09-14\tInvoice\t100.00').delimiter, "\t");
});
test("CSV rejects empty, malformed, binary and oversized input", () => {
  for (const text of ["", "Date,Amount", 'Date,Amount\n"broken,100', 'Date,Amount\n"value"junk,100', "Date,Amount\n\u0000,100"]) assert.throws(() => parseCsv(text));
  assert.throws(() => parseCsv("x".repeat(MAX_CSV_BYTES + 1)), /5 MB/);
});
test("preamble header detection preserves physical line numbers", () => {
  const document = parseCsv('Company bank export\n\nDate,Description,Amount\n2026-09-14,Sale,100');
  assert.equal(inferHeaderRow(document), 1);
  const table = tableFromDocument(document, 1);
  assert.equal(table.records[0].line, 4);
});
test("blank optional columns and header selection remain explicit", () => {
  const document = parseCsv('Date,,Amount\n2026-09-14,Sale,100');
  const table = tableFromDocument(document, 0);
  assert.equal(table.headers[1], "Column 2");
  assert.equal(inferMapping(table, "bank").reference, -1);
  assert.throws(() => tableFromDocument(document, 1));
});
test("money parsing uses exact hundredths and strict selected separators", () => {
  assert.equal(parseMoney("1,250.10", "dot", "MYR"), 125010);
  assert.equal(parseMoney("1.250,10", "comma", "EUR"), 125010);
  assert.equal(parseMoney("(RM 1,250.10)", "dot", "MYR"), -125010);
  assert.equal(parseMoney("+0.29", "dot", "MYR"), 29);
  for (const value of ["1,25.10", "1.250,10", "0.001", "1e3", "Infinity", "NaN", "USD 100", "=100+1", "--100"]) assert.equal(parseMoney(value, "dot", "MYR"), null, value);
});
test("dates are real calendar dates and ambiguous formats require a choice", () => {
  assert.equal(parseDate("03/04/2026", "dmy")?.iso, "2026-04-03");
  assert.equal(parseDate("03/04/2026", "mdy")?.iso, "2026-03-04");
  assert.equal(parseDate("03/04/2026", ""), null);
  assert.equal(parseDate("2024-02-29", "iso")?.iso, "2024-02-29");
  for (const value of ["2026-02-29", "2026-13-01", "26-09-01", "2026-04-31"]) assert.equal(parseDate(value, "iso"), null);
  assert.equal(input('Date,Amount\n03/04/2026,100\n04/04/2026,200', "bank").mapping.dateFormat, "");
});
test("bank credit/debit and cashbook debit/credit normalize to the same cash direction", () => {
  const bank = input('Date,Credit,Debit\n2026-09-14,100,\n2026-09-15,,20', "bank");
  const ledger = input('Date,Debit,Credit\n2026-09-14,100,\n2026-09-15,,20', "ledger");
  assert.deepEqual(normalizeImport(bank, "bank", "MYR").transactions.map(item => item.cents), [10000, -2000]);
  assert.deepEqual(normalizeImport(ledger, "ledger", "MYR").transactions.map(item => item.cents), [10000, -2000]);
  bank.mapping.invert = true;
  assert.deepEqual(normalizeImport(bank, "bank", "MYR").transactions.map(item => item.cents), [-10000, 2000]);
});
test("invalid amounts, dates, currencies, zero movements and extra cells stay in invalid rows", () => {
  const imported = normalizeImport(input('Date,Amount,Currency\n2026-09-14,10,MYR\n2026-09-15,0,MYR\n2026-09-31,20,MYR\n2026-09-16,30,USD\n2026-09-17,1.001,MYR\n2026-09-18,50,MYR,extra', "bank"), "bank", "MYR");
  assert.equal(imported.transactions.length, 1);
  assert.equal(imported.invalid.length, 5);
  assert.equal(imported.totalCents, 1000);
  assert.equal(imported.invalid[4].line, 7);
});
test("separate amounts reject two populated sides, negative sides and blank movements", () => {
  const imported = normalizeImport(input('Date,Debit,Credit\n2026-09-14,10,20\n2026-09-15,-10,\n2026-09-16,,', "ledger"), "ledger", "MYR");
  assert.equal(imported.transactions.length, 0);
  assert.equal(imported.invalid.length, 3);
});
test("mapping cannot reuse the date as an amount or choose an unavailable column", () => {
  const imported = input('Date,Amount\n2026-09-14,100', "bank");
  imported.mapping.amount = imported.mapping.date;
  assert.match(mappingError(imported.mapping, imported.table), /different columns/);
  imported.mapping.amount = 99;
  assert.match(mappingError(imported.mapping, imported.table), /amount column/);
});
test("unique reference and exact amount matches are automatic within the date window", () => {
  const result = match([row("bank", 2, 125000, "INV-007")], [row("ledger", 2, 125000, "inv 007", 20002)]);
  assert.equal(result.matches[0].state, "automatic");
  assert.equal(result.matches[0].method, "reference");
  assert.equal(referenceKey("007"), "007");
  assert.notEqual(referenceKey("007"), referenceKey("7"));
});
test("references cannot override a different amount, direction or date window", () => {
  for (const other of [row("ledger", 2, 126000, "INV"), row("ledger", 2, -125000, "INV"), row("ledger", 2, 125000, "INV", 20004)]) {
    assert.equal(match([row("bank", 2, 125000, "INV")], [other]).matches.length, 0);
  }
});
test("same description is automatic only when references do not conflict", () => {
  const bank = row("bank", 2, -500, "", 20000, "Acme supplies");
  assert.equal(match([bank], [row("ledger", 2, -500, "", 20000, "Acme supplies")]).matches[0].state, "automatic");
  bank.reference = "A";
  assert.equal(match([bank], [row("ledger", 2, -500, "B", 20000, "Acme supplies")]).matches[0].state, "suggested");
});
test("amount/date alone creates a suggestion rather than a confirmed match", () => {
  const result = match([row("bank", 2, 10000)], [row("ledger", 2, 10000)]);
  assert.equal(result.matches[0].state, "suggested");
  assert.equal(getReview(result, result.matches).confirmedIds.size, 0);
});
test("duplicates and competing same-amount candidates are never chosen arbitrarily", () => {
  const result = match([row("bank", 2, 10000, "A"), row("bank", 3, 10000, "A")], [row("ledger", 2, 10000, "A")]);
  assert.equal(result.matches.length, 0);
  assert.ok(result.flags["bank:2"].some(flag => flag.kind === "duplicate"));
  assert.ok(result.flags["ledger:2"].some(flag => flag.kind === "ambiguous"));
});
test("one deposit can suggest three exact cashbook components", () => {
  const result = match([row("bank", 2, 60000)], [row("ledger", 2, 10000), row("ledger", 3, 20000), row("ledger", 4, 30000)]);
  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0].method, "combined");
  assert.equal(result.matches[0].state, "suggested");
  assert.equal(result.matches[0].ledgerIds.length, 3);
});
test("many bank payments can suggest one cashbook payment", () => {
  const result = match([row("bank", 2, -4000), row("bank", 3, -6000)], [row("ledger", 2, -10000)]);
  assert.equal(result.matches[0].bankIds.length, 2);
  assert.equal(result.matches[0].method, "combined");
});
test("grouped matching can be switched off and never nets opposite directions", () => {
  const bank = [row("bank", 2, 10000)];
  assert.equal(match(bank, [row("ledger", 2, 4000), row("ledger", 3, 6000)], { ...options, combined: false }).matches.length, 0);
  assert.equal(match(bank, [row("ledger", 2, 15000), row("ledger", 3, -5000)]).matches.length, 0);
});
test("multiple sum combinations and shared candidates stay unmatched", () => {
  const result = match([row("bank", 2, 10000)], [row("ledger", 2, 4000), row("ledger", 3, 6000), row("ledger", 4, 3000), row("ledger", 5, 7000)]);
  assert.equal(result.matches.length, 0);
  assert.ok(result.flags["bank:2"].some(flag => flag.kind === "ambiguous"));
  const shared = match([row("bank", 2, 6000), row("bank", 3, 7000)], [row("ledger", 2, 1000), row("ledger", 3, 5000), row("ledger", 4, 6000)]);
  const ids = shared.matches.flatMap(item => [...item.bankIds, ...item.ledgerIds]);
  assert.equal(ids.length, new Set(ids).size);
});
test("large candidate pools disclose bounded search rather than inventing certainty", () => {
  const result = match([row("bank", 2, 10000)], Array.from({ length: 13 }, (_, index) => row("ledger", index + 2, 1000 + index)));
  assert.equal(result.matches.length, 0);
  assert.ok(result.notices.some(notice => notice.includes("limited")));
});
test("transposition flags require supporting identity and never alter or match the amounts", () => {
  assert.equal(isTransposition(125000, 152000), true);
  assert.equal(isTransposition(125000, 125000), false);
  assert.equal(isTransposition(125000, -152000), false);
  const result = match([row("bank", 2, 125000, "PINE")], [row("ledger", 2, 152000, "PINE")]);
  assert.equal(result.matches.length, 0);
  assert.ok(result.flags["bank:2"].some(flag => flag.kind === "transposition"));
  assert.equal(result.bank.transactions[0].cents, 125000);
  assert.equal(match([row("bank", 2, 125000, "A")], [row("ledger", 2, 152000, "B")]).flags["bank:2"], undefined);
});
test("fee flags use withdrawal descriptions and do not treat coffee as a fee", () => {
  const result = match([row("bank", 2, -1000, "", 20000, "Monthly bank fee"), row("bank", 3, -1500, "", 20000, "Coffee shop")], [row("ledger", 2, 20000)]);
  assert.ok(result.flags["bank:2"].some(flag => flag.kind === "bank-fee"));
  assert.equal(result.flags["bank:3"], undefined);
});
test("timing clues require a statement end date and never assert confirmed clearance", () => {
  const bank = [row("bank", 2, 10000)];
  const ledger = [row("ledger", 2, -20000, "", 20002)];
  assert.equal(match(bank, ledger).flags["ledger:2"], undefined);
  const end = new Date(20003 * 86_400_000).toISOString().slice(0, 10);
  assert.match(match(bank, ledger, { ...options, statementEnd: end }).flags["ledger:2"][0].reason, /Possible timing difference/);
  assert.throws(() => match(bank, ledger, { ...options, statementEnd: bank[0].date }), /after the statement end/);
});
test("accept, reject and manual matching preserve one-use-only transaction ownership", () => {
  const result = match([row("bank", 2, 10000)], [row("ledger", 2, 10000)]);
  const accepted = acceptMatch(result, result.matches, result.matches[0].id);
  assert.equal(getReview(result, accepted).confirmedIds.size, 2);
  assert.throws(() => manualMatch(result, accepted, ["bank:2"], ["ledger:2"]), /already belongs/);
  const released = releaseMatch(accepted, accepted[0].id);
  assert.equal(getReview(result, released).unmatched.length, 2);
  const manual = manualMatch(result, released, ["bank:2"], ["ledger:2"]);
  assert.equal(getReview(result, manual).confirmedIds.size, 2);
  assert.equal(manual[1].state, "manual");
  assert.equal(result.matches[0].state, "suggested");
});
test("manual matching rejects duplicate IDs, wrong sources, unequal totals and mixed signs", () => {
  const result = match([row("bank", 2, 10000), row("bank", 3, -2000)], [row("ledger", 2, 8000), row("ledger", 3, -1000)]);
  assert.throws(() => manualMatch(result, [], ["bank:2", "bank:2"], ["ledger:2"]), /twice/);
  assert.throws(() => manualMatch(result, [], ["ledger:2"], ["bank:2"]), /no longer available/);
  assert.throws(() => manualMatch(result, [], ["bank:2"], ["ledger:2"]), /exactly/);
  assert.throws(() => manualMatch(result, [], ["bank:2", "bank:3"], ["ledger:2"]), /money in and money out/);
});
test("fictional example covers automatic, suggested, grouped and unmatched causes", () => {
  const result = reconcile(input(sampleBankCsv, "bank"), input(sampleLedgerCsv, "ledger"), { ...options, statementEnd: "2026-09-30" });
  assert.equal(result.matches.filter(item => item.state === "automatic").length, 3);
  assert.equal(result.matches.filter(item => item.state === "suggested").length, 2);
  assert.equal(getReview(result, result.matches).unmatched.length, 7);
  assert.equal(result.bank.totalCents - result.ledger.totalCents, -9500);
  for (const kind of ["duplicate", "bank-fee", "transposition", "timing"]) assert.ok(Object.values(result.flags).flat().some(flag => flag.kind === kind), kind);
});
test("working paper accounts for every valid and invalid row with source lines and notes", () => {
  const bank = input(sampleBankCsv + '\nnot-a-date,Bad,BAD,1.001', "bank");
  bank.mapping.dateFormat = "iso";
  const result = reconcile(bank, input(sampleLedgerCsv, "ledger"), options);
  const output = parseCsv(createReport(result, result.matches, { "bank:7": "Check with bookkeeper" }));
  assert.ok(output.records.every(item => item.cells.length === 16));
  assert.equal(output.records.filter(item => item.cells[0] === "Transaction").length, 19);
  assert.equal(output.records.filter(item => item.cells[0] === "Invalid row").length, 1);
  assert.ok(output.records.some(item => item.cells[14] === "Check with bookkeeper"));
  assert.ok(output.records.some(item => item.cells[15].includes("Oak Studio")));
});

test("oversized cells and unsafe comparison differences are rejected", () => {
  assert.throws(() => parseCsv('Date,Amount\n' + 'x'.repeat(20_001) + ',100'), /20,000/);
  assert.throws(() => match([row("bank", 2, Number.MAX_SAFE_INTEGER)], [row("ledger", 2, -Number.MAX_SAFE_INTEGER)]), /too large/);
});
test("open-items download includes pending suggestions but excludes confirmed matches", () => {
  const result = reconcile(input(sampleBankCsv, "bank"), input(sampleLedgerCsv, "ledger"), options);
  const output = parseCsv(createReport(result, result.matches, {}, true));
  assert.equal(output.records.filter(item => item.cells[0] === "Transaction").length, getReview(result, result.matches).open.length);
});
test("spreadsheet exports quote delimiters and neutralize untrusted formula prefixes", () => {
  for (const value of ['=HYPERLINK("https://example.test")', '+SUM(1,2)', '-1+2', '@SUM(A1)', '  =1+1', '\t=1', '＝1+1']) assert.ok(csvCell(value).startsWith('"\t'), value);
  assert.equal(csvCell(-12.5), '"-12.5"');
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
});
test("private-route analytics exclusion covers query strings and trailing slashes", () => {
  for (const url of ["/tools/bank-reconciliation", "/tools/bank-reconciliation/?view=matched", "https://www.accountingtoolslab.com/tools/bank-reconciliation#result"]) assert.equal(isPrivateToolUrl(url), true);
  assert.equal(isPrivateToolUrl("/tools/cash-flow-calculator"), false);
});
test("ten thousand ambiguous same-day transactions remain bounded and never auto-match", () => {
  const rows = Array.from({ length: 10_000 }, (_, index) => row("bank", index + 2, 10000, "REPEAT"));
  const other = Array.from({ length: 10_000 }, (_, index) => row("ledger", index + 2, 10000, "REPEAT"));
  const result = match(rows, other);
  assert.equal(result.matches.length, 0);
  assert.equal(getReview(result, result.matches).unmatched.length, 20_000);
  assert.ok(result.notices.length);
});
