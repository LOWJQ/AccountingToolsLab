import { getReview } from "./review";
import type { Match, Reconciliation } from "./types";

// Text from imported files is untrusted. Quote every cell and neutralize
// spreadsheet formula prefixes, including leading whitespace/full-width forms.
// Numeric cells are generated from validated integer hundredths, not raw input.
export function csvCell(value: string | number): string {
  let text = String(value);
  if (typeof value !== "number" && (/^[\t\r\n]/.test(text) || /^\s*[=+\-@＝＋－＠]/.test(text))) text = `\t${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function reportRows(result: Reconciliation, matches: Match[], notes: Record<string, string>, openOnly = false): Array<Array<string | number>> {
  const review = getReview(result, matches);
  const matchByRow = new Map(matches.filter(match => match.state !== "rejected").flatMap(match => [...match.bankIds, ...match.ledgerIds].map(id => [id, match] as const)));
  const rows: Array<Array<string | number>> = [["Record type", "Source", "Source file", "Source row", "Transaction ID", "Date", "Description", "Reference", "Amount", "Currency", "Status", "Match ID", "Method", "Reason / possible cause", "User note", "Original cells"]];
  const info = (label: string, value: string | number) => rows.push(["Summary", label, "", "", "", "", "", "", value, result.options.currency]);
  info("Report scope", openOnly ? "Open items, including unaccepted suggestions and invalid rows" : "All imported transactions and invalid rows");
  info("Bank net movement (valid rows)", result.bank.totalCents / 100);
  info("Cashbook net movement (valid rows)", result.ledger.totalCents / 100);
  info("Net movement difference (not a closing balance)", (result.bank.totalCents - result.ledger.totalCents) / 100);
  info("Date window (days)", result.options.days);
  info("Statement end", result.options.statementEnd || "Not supplied");
  info("Bank rows", result.bank.transactions.length + result.bank.invalid.length);
  info("Cashbook rows", result.ledger.transactions.length + result.ledger.invalid.length);
  info("Confirmed matched transactions", review.confirmedIds.size);
  info("Unconfirmed transactions", review.open.length);
  info("Invalid rows", result.bank.invalid.length + result.ledger.invalid.length);
  info("Scope note", "Transaction matching only. Closing balances, prior outstanding items and accounting adjustments require separate verification. Possible causes are not confirmed facts.");
  for (const notice of result.notices) info("Search limit", notice);
  for (const input of [result.bank, result.ledger]) {
    for (const row of input.transactions) {
      if (openOnly && review.confirmedIds.has(row.id)) continue;
      const match = matchByRow.get(row.id);
      const reasons = (result.flags[row.id] ?? []).map(flag => flag.reason).join(" ");
      rows.push(["Transaction", input.source === "bank" ? "Bank" : "Cashbook", input.name, row.line, row.id, row.date, row.description, row.reference, row.cents / 100, result.options.currency, match?.state ?? "unmatched", match?.id ?? "", match?.method ?? "", [match?.reason, reasons].filter(Boolean).join(" "), notes[row.id] ?? "", JSON.stringify(row.originalCells)]);
    }
    for (const row of input.invalid) rows.push(["Invalid row", input.source === "bank" ? "Bank" : "Cashbook", input.name, row.line, row.id, "", "", "", "", result.options.currency, "invalid", "", "", row.reason, notes[row.id] ?? "", JSON.stringify(row.cells)]);
  }
  return rows;
}

export function createReport(result: Reconciliation, matches: Match[], notes: Record<string, string>, openOnly = false): string {
  return "\uFEFF" + reportRows(result, matches, notes, openOnly).map(row => Array.from({ length: 16 }, (_, index) => csvCell(row[index] ?? "")).join(",")).join("\r\n");
}
