export const MAX_CSV_BYTES = 5 * 1024 * 1024;
export const MAX_TRANSACTIONS = 10_000;
export const MAX_HEADER_ROWS = 50;

export type Source = "bank" | "ledger";
export type CsvRecord = { line: number; cells: string[] };
export type CsvDocument = { records: CsvRecord[]; delimiter: string };
export type CsvTable = { headers: string[]; records: CsvRecord[] };
export type DateFormat = "iso" | "dmy" | "mdy" | "";
export type ColumnMapping = {
  date: number;
  description: number;
  reference: number;
  currency: number;
  amountMode: "signed" | "separate";
  amount: number;
  moneyIn: number;
  moneyOut: number;
  invert: boolean;
  dateFormat: DateFormat;
  numberFormat: "dot" | "comma";
};
export type ImportInput = { name: string; table: CsvTable; mapping: ColumnMapping };
export type Transaction = {
  id: string;
  source: Source;
  line: number;
  date: string;
  day: number;
  description: string;
  reference: string;
  cents: number;
  originalCells: string[];
};
export type InvalidRow = { id: string; source: Source; line: number; cells: string[]; reason: string };
export type NormalizedImport = { source: Source; name: string; transactions: Transaction[]; invalid: InvalidRow[]; totalCents: number };
export type MatchMethod = "reference" | "description" | "amount-date" | "combined" | "manual";
export type MatchState = "automatic" | "suggested" | "accepted" | "manual" | "rejected";
export type Match = { id: string; bankIds: string[]; ledgerIds: string[]; method: MatchMethod; state: MatchState; reason: string };
export type FlagKind = "ambiguous" | "duplicate" | "transposition" | "bank-fee" | "timing";
export type Flag = { kind: FlagKind; reason: string; relatedIds?: string[] };
export type MatchOptions = { days: number; combined: boolean; currency: string; statementEnd: string };
export type Reconciliation = { bank: NormalizedImport; ledger: NormalizedImport; matches: Match[]; flags: Record<string, Flag[]>; notices: string[]; options: MatchOptions };

export type WorkerRequest =
  | { id: number; type: "parse"; text: string }
  | { id: number; type: "match"; bank: ImportInput; ledger: ImportInput; options: MatchOptions };
export type WorkerResponse =
  | { id: number; type: "parsed"; document: CsvDocument }
  | { id: number; type: "matched"; result: Reconciliation }
  | { id: number; type: "progress"; message: string }
  | { id: number; type: "error"; message: string };
