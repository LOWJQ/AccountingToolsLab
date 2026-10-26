import type { Match, Reconciliation, Transaction } from "./types";

export const isConfirmed = (match: Match) => match.state === "automatic" || match.state === "accepted" || match.state === "manual";

export function getReview(result: Reconciliation, matches: Match[]) {
  const confirmed = matches.filter(isConfirmed);
  const suggested = matches.filter(match => match.state === "suggested");
  const confirmedIds = new Set(confirmed.flatMap(match => [...match.bankIds, ...match.ledgerIds]));
  const reservedIds = new Set([...confirmed, ...suggested].flatMap(match => [...match.bankIds, ...match.ledgerIds]));
  const rows = [...result.bank.transactions, ...result.ledger.transactions];
  return {
    confirmed,
    suggested,
    confirmedIds,
    reservedIds,
    unmatched: rows.filter(row => !reservedIds.has(row.id)),
    open: rows.filter(row => !confirmedIds.has(row.id)),
    bankMatched: result.bank.transactions.filter(row => confirmedIds.has(row.id)).length,
    ledgerMatched: result.ledger.transactions.filter(row => confirmedIds.has(row.id)).length
  };
}

function assertGroup(result: Reconciliation, matches: Match[], bankIds: string[], ledgerIds: string[], exceptId?: string) {
  if (!bankIds.length || !ledgerIds.length) throw new Error("Select at least one bank transaction and one cashbook transaction.");
  const ids = [...bankIds, ...ledgerIds];
  if (new Set(ids).size !== ids.length) throw new Error("A transaction cannot be used twice in one match.");
  const bank = bankIds.map(id => result.bank.transactions.find(row => row.id === id));
  const ledger = ledgerIds.map(id => result.ledger.transactions.find(row => row.id === id));
  if (bank.some(row => !row) || ledger.some(row => !row)) throw new Error("A selected transaction is no longer available.");
  const rows = [...bank, ...ledger] as Transaction[];
  const used = new Set(matches.filter(match => match.id !== exceptId && match.state !== "rejected").flatMap(match => [...match.bankIds, ...match.ledgerIds]));
  if (ids.some(id => used.has(id))) throw new Error("A selected transaction already belongs to a match or suggestion. Undo or reject that match first.");
  if (!rows.every(row => Math.sign(row.cents) === Math.sign(rows[0].cents))) throw new Error("Match money in and money out separately.");
  const bankSum = (bank as Transaction[]).reduce((sum, row) => sum + row.cents, 0);
  const ledgerSum = (ledger as Transaction[]).reduce((sum, row) => sum + row.cents, 0);
  if (!Number.isSafeInteger(bankSum) || bankSum !== ledgerSum) throw new Error("The selected bank and cashbook amounts must total exactly the same value.");
}

export function acceptMatch(result: Reconciliation, matches: Match[], id: string): Match[] {
  const target = matches.find(match => match.id === id);
  if (!target || target.state !== "suggested") throw new Error("This suggestion is no longer available.");
  assertGroup(result, matches, target.bankIds, target.ledgerIds, id);
  return matches.map(match => match.id === id ? { ...match, state: "accepted" } : match);
}

export function releaseMatch(matches: Match[], id: string): Match[] {
  if (!matches.some(match => match.id === id && match.state !== "rejected")) throw new Error("This match is no longer available.");
  return matches.map(match => match.id === id ? { ...match, state: "rejected" } : match);
}

export function manualMatch(result: Reconciliation, matches: Match[], bankIds: string[], ledgerIds: string[]): Match[] {
  assertGroup(result, matches, bankIds, ledgerIds);
  const id = `manual:${bankIds.join(",")}|${ledgerIds.join(",")}:${matches.length}`;
  return [...matches, { id, bankIds: [...bankIds], ledgerIds: [...ledgerIds], method: "manual", state: "manual", reason: "Manually matched by the user. The selected amounts total exactly the same value." }];
}
