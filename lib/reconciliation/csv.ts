import { MAX_CSV_BYTES, MAX_HEADER_ROWS, MAX_TRANSACTIONS, type ColumnMapping, type CsvDocument, type CsvRecord, type CsvTable, type DateFormat, type ImportInput, type NormalizedImport, type Source } from "./types";

function detectDelimiter(text: string): string {
  const counts = [0, 0, 0];
  const separators = [",", ";", "\t"];
  let quoted = false;
  let lines = 0;
  for (let i = 0; i < Math.min(text.length, 30_000) && lines < 12; i++) {
    if (text[i] === '"') {
      if (quoted && text[i + 1] === '"') i++;
      else quoted = !quoted;
    } else if (!quoted) {
      if (text[i] === "\n") lines++;
      const index = separators.indexOf(text[i]);
      if (index >= 0) counts[index]++;
    }
  }
  return separators[counts.indexOf(Math.max(...counts))];
}

/** Bounded RFC-style CSV reader. Quoted delimiters/newlines and escaped quotes
 * remain data; original physical line numbers follow every record. */
export function parseCsv(input: string): CsvDocument {
  if (new TextEncoder().encode(input).byteLength > MAX_CSV_BYTES) throw new Error("This CSV is larger than 5 MB. Export a shorter period and try again.");
  const text = input.replace(/^\uFEFF/, "");
  if (!text.trim()) throw new Error("This CSV is empty.");
  if (/[\u0000\uFFFD]/.test(text)) throw new Error("The file encoding could not be read. Save it as CSV UTF-8 and try again.");
  const delimiter = detectDelimiter(text);
  const records: CsvRecord[] = [];
  let cells: string[] = [];
  let cell = "";
  let quoted = false;
  let closed = false;
  let line = 1;
  let recordLine = 1;
  function endCell() {
    if (cell.length > 20_000) throw new Error("A CSV cell exceeds 20,000 characters. Check the export and try again.");
    cells.push(cell);
    if (cells.length > 200) throw new Error("This file has more than 200 columns. Export only the bank or cashbook account.");
    cell = "";
    closed = false;
  }
  function endRecord() {
    endCell();
    if (cells.some(value => value.trim() !== "")) records.push({ line: recordLine, cells });
    cells = [];
    if (records.length > MAX_TRANSACTIONS + MAX_HEADER_ROWS + 1) throw new Error("This file has more than 10,000 transactions. Export a shorter period and try again.");
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { quoted = false; closed = true; }
      } else {
        cell += char;
        if (char === "\n" || (char === "\r" && text[i + 1] !== "\n")) line++;
      }
    } else if (char === delimiter) endCell();
    else if (char === "\r" || char === "\n") {
      endRecord();
      if (char === "\r" && text[i + 1] === "\n") i++;
      line++;
      recordLine = line;
    } else if (char === '"') {
      if (cell.trim() || closed) throw new Error(`Unexpected quote on CSV line ${line}. Check the CSV export.`);
      cell = "";
      quoted = true;
    } else if (closed) {
      if (char !== " " && char !== "\t") throw new Error(`Unexpected text after a closing quote on CSV line ${line}.`);
    } else cell += char;
  }
  if (quoted) throw new Error(`A quoted field starting near CSV line ${recordLine} is not closed.`);
  if (cell !== "" || cells.length || closed) endRecord();
  if (records.length < 2) throw new Error("The CSV needs a header row and at least one transaction.");
  return { records, delimiter };
}

const headerKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
export function inferHeaderRow(document: CsvDocument): number {
  const index = document.records.slice(0, MAX_HEADER_ROWS).findIndex(row => row.cells.some(value => /^(date|transactiondate|postingdate|valuedate)$/.test(headerKey(value))) && row.cells.some(value => /^(amount|transactionamount|debit|credit|moneyin|moneyout|withdrawal|deposit|receipts|payments)$/.test(headerKey(value))));
  return index >= 0 ? index : 0;
}

export function tableFromDocument(document: CsvDocument, headerRow: number): CsvTable {
  if (!Number.isInteger(headerRow) || headerRow < 0 || headerRow >= Math.min(document.records.length - 1, MAX_HEADER_ROWS)) throw new Error("Choose a header row followed by transaction rows.");
  const headers = document.records[headerRow].cells.map((value, index) => value.trim() || `Column ${index + 1}`);
  return { headers, records: document.records.slice(headerRow + 1) };
}

export function inferMapping(table: CsvTable, source: Source): ColumnMapping {
  const keys = table.headers.map(headerKey);
  const find = (names: string[]) => keys.findIndex(key => names.includes(key));
  const amount = find(["amount", "transactionamount", "signedamount", "netamount"]);
  const moneyIn = find(["moneyin", "deposit", "deposits", "receipt", "receipts", "paidin", source === "bank" ? "credit" : "debit"]);
  const moneyOut = find(["moneyout", "withdrawal", "withdrawals", "payment", "payments", "paidout", source === "bank" ? "debit" : "credit"]);
  const date = find(["date", "transactiondate", "postingdate", "valuedate"]);
  const dates = table.records.slice(0, 100).map(row => row.cells[date]?.trim() ?? "").filter(Boolean);
  let dateFormat: DateFormat = dates.length && dates.every(value => /^\d{4}[-/]\d{2}[-/]\d{2}$/.test(value)) ? "iso" : "";
  if (!dateFormat) {
    const parts = dates.map(value => value.match(/^(\d{1,2})[-/](\d{1,2})[-/]\d{4}$/));
    const dayFirst = parts.some(part => part && Number(part[1]) > 12);
    const monthFirst = parts.some(part => part && Number(part[2]) > 12);
    if (dayFirst && !monthFirst) dateFormat = "dmy";
    if (monthFirst && !dayFirst) dateFormat = "mdy";
  }
  return { date, description: find(["description", "details", "narration", "particulars", "payee", "transactiondescription"]), reference: find(["reference", "ref", "transactionreference", "chequenumber", "chequeno", "invoicenumber"]), currency: find(["currency", "currencycode", "ccy"]), amountMode: amount >= 0 ? "signed" : "separate", amount, moneyIn, moneyOut, invert: false, dateFormat, numberFormat: "dot" };
}

export function parseDate(value: string, format: DateFormat): { iso: string; day: number } | null {
  const text = value.trim();
  const parts = format === "iso" ? text.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/) : text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (!parts || !format) return null;
  const year = Number(parts[format === "iso" ? 1 : 3]);
  const month = Number(parts[format === "iso" ? 2 : format === "dmy" ? 2 : 1]);
  const date = Number(parts[format === "iso" ? 3 : format === "dmy" ? 1 : 2]);
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || date < 1 || date > 31) return null;
  const timestamp = Date.UTC(year, month - 1, date);
  const parsed = new Date(timestamp);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== date) return null;
  return { iso: parsed.toISOString().slice(0, 10), day: timestamp / 86_400_000 };
}

/** Convert to whole hundredths without binary-decimal rounding. Reject rather
 * than guess at separators, excess precision, or an unexpected currency. */
export function parseMoney(value: string, format: "dot" | "comma", currency: string): number | null {
  let text = value.trim();
  if (!text) return null;
  let negative = false;
  if (/^\(.*\)$/.test(text)) { negative = true; text = text.slice(1, -1).trim(); }
  const prefix = text.match(/^([A-Za-z]{2,3}|[$€£¥])\s*/);
  if (prefix) {
    const code = prefix[1].toUpperCase();
    if (/^[A-Z]+$/.test(code) && code !== currency && !(code === "RM" && currency === "MYR")) return null;
    text = text.slice(prefix[0].length);
  }
  if (/^[+-]/.test(text)) {
    if (negative) return null;
    negative = text[0] === "-";
    text = text.slice(1);
  }
  const pattern = format === "dot" ? /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/ : /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/;
  if (!pattern.test(text)) return null;
  text = text.replace(format === "dot" ? /,/g : /\./g, "");
  const [whole, fraction = ""] = text.split(format === "dot" ? "." : ",");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents > 100_000_000_000_000) return null;
  return negative ? -cents : cents;
}

export function mappingError(mapping: ColumnMapping, table: CsvTable): string {
  const valid = (index: number) => Number.isInteger(index) && index >= 0 && index < table.headers.length;
  if (!valid(mapping.date)) return "Choose the transaction date column.";
  if (!mapping.dateFormat) return "Choose a date format. Dates such as 03/04/2026 are ambiguous.";
  const amounts = mapping.amountMode === "signed" ? [mapping.amount] : [mapping.moneyIn, mapping.moneyOut];
  if (!amounts.every(valid)) return mapping.amountMode === "signed" ? "Choose the amount column." : "Choose both money-in and money-out columns.";
  if (new Set([mapping.date, ...amounts]).size !== amounts.length + 1) return "Date and amount fields must use different columns.";
  for (const index of [mapping.description, mapping.reference, mapping.currency]) if (index !== -1 && !valid(index)) return "A selected column is no longer available. Check the column settings.";
  return "";
}

export function normalizeImport(input: ImportInput, source: Source, currency: string): NormalizedImport {
  const error = mappingError(input.mapping, input.table);
  if (error) throw new Error(`${source === "bank" ? "Bank statement" : "Cashbook"}: ${error}`);
  if (input.table.records.length > MAX_TRANSACTIONS) throw new Error("Use up to 10,000 transaction rows per file. Export a shorter period.");
  const result: NormalizedImport = { source, name: input.name, transactions: [], invalid: [], totalCents: 0 };
  const mapping = input.mapping;
  let grossCents = 0;
  for (const record of input.table.records) {
    const id = `${source}:${record.line}`;
    const get = (column: number) => record.cells[column]?.trim() ?? "";
    const date = parseDate(get(mapping.date), mapping.dateFormat);
    let cents: number | null;
    if (mapping.amountMode === "signed") cents = parseMoney(get(mapping.amount), mapping.numberFormat, currency);
    else {
      const moneyIn = get(mapping.moneyIn) === "" ? 0 : parseMoney(get(mapping.moneyIn), mapping.numberFormat, currency);
      const moneyOut = get(mapping.moneyOut) === "" ? 0 : parseMoney(get(mapping.moneyOut), mapping.numberFormat, currency);
      cents = moneyIn === null || moneyOut === null || moneyIn < 0 || moneyOut < 0 || (moneyIn > 0 && moneyOut > 0) ? null : moneyIn - moneyOut;
    }
    const rawCurrency = get(mapping.currency).toUpperCase();
    const rowCurrency = rawCurrency === "RM" ? "MYR" : rawCurrency;
    const reason = record.cells.length !== input.table.headers.length ? `Expected ${input.table.headers.length} columns; found ${record.cells.length}. Check the CSV export.` : !date ? "The date does not fit the selected format or is not a real date." : rowCurrency && rowCurrency !== currency ? `Currency ${rowCurrency} does not match ${currency}. Use one currency per run.` : cents === null ? "The amount is invalid. Check separators, two-decimal precision, and money-in/out columns." : cents === 0 ? "Zero amount: this row has no cash movement." : "";
    if (reason || !date || cents === null) result.invalid.push({ id, source, line: record.line, cells: record.cells, reason });
    else {
      if (mapping.invert) cents = -cents;
      result.totalCents += cents;
      grossCents += Math.abs(cents);
      if (!Number.isSafeInteger(result.totalCents) || !Number.isSafeInteger(grossCents)) throw new Error("The total is too large to compare safely. Use a shorter period.");
      result.transactions.push({ id, source, line: record.line, date: date.iso, day: date.day, description: get(mapping.description), reference: get(mapping.reference), cents, originalCells: record.cells });
    }
  }
  return result;
}
