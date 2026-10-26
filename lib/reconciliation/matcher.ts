import { normalizeImport, parseDate } from "./csv";
import type { Flag, ImportInput, Match, MatchOptions, NormalizedImport, Reconciliation, Transaction } from "./types";

export function referenceKey(text: string): string {
  const value = text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return /^(?:0+|na|none|null|notavailable)$/.test(value) ? "" : value;
}

function descriptionKey(text: string): string {
  const value = referenceKey(text);
  return value.length < 6 || /^(?:payment|transfer|deposit|withdrawal|receipt|banktransfer)$/.test(value) ? "" : value;
}

type Index = Map<string, Transaction[]>;
function makeIndex(rows: Transaction[], key: (row: Transaction) => string): Index {
  const index: Index = new Map();
  for (const row of rows) {
    const value = key(row);
    if (!value) continue;
    const bucket = index.get(value);
    if (bucket) bucket.push(row);
    else index.set(value, [row]);
  }
  for (const bucket of index.values()) bucket.sort((a, b) => a.day - b.day || a.line - b.line);
  return index;
}

function lowerBound(rows: Transaction[], day: number): number {
  let low = 0;
  let high = rows.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (rows[mid].day < day) low = mid + 1;
    else high = mid;
  }
  return low;
}

function nearby(index: Index, key: string, day: number, days: number) {
  const rows = index.get(key) ?? [];
  const start = lowerBound(rows, day - days);
  const end = lowerBound(rows, day + days + 1);
  return { count: end - start, rows: rows.slice(start, Math.min(start + 12, end)) };
}

const amountKey = (row: Transaction) => String(row.cents);
const refAmountKey = (row: Transaction) => referenceKey(row.reference) ? `${row.cents}|${referenceKey(row.reference)}` : "";
const descAmountKey = (row: Transaction) => descriptionKey(row.description) ? `${row.cents}|${descriptionKey(row.description)}` : "";

export function isTransposition(left: number, right: number): boolean {
  if (Math.sign(left) !== Math.sign(right) || left === right) return false;
  const a = String(Math.abs(left)).padStart(3, "0");
  const b = String(Math.abs(right)).padStart(3, "0");
  if (a.length !== b.length) return false;
  const differences = [...a].map((digit, index) => digit === b[index] ? -1 : index).filter(index => index >= 0);
  return differences.length === 2 && a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]];
}

function newMatch(bank: Transaction[], ledger: Transaction[], method: Match["method"], state: Match["state"], reason: string): Match {
  return { id: `${method}:${bank.map(row => row.id).join(",")}|${ledger.map(row => row.id).join(",")}`, bankIds: bank.map(row => row.id), ledgerIds: ledger.map(row => row.id), method, state, reason };
}

// Search only 2- or 3-row groups, with at most 12 candidates. A unique result
// is returned only when the whole bounded search finished. A partial search
// must never be mistaken for proof that a combination is unique.
function combinations(pool: Transaction[], target: number, budget: { remaining: number }): { groups: Transaction[][]; complete: boolean } {
  const groups: Transaction[][] = [];
  if (pool.length > 12) return { groups, complete: false };
  for (let a = 0; a < pool.length; a++) {
    for (let b = a + 1; b < pool.length; b++) {
      if (--budget.remaining < 0) return { groups: [], complete: false };
      const sum = pool[a].cents + pool[b].cents;
      if (sum === target) groups.push([pool[a], pool[b]]);
      for (let c = b + 1; c < pool.length; c++) {
        if (--budget.remaining < 0) return { groups: [], complete: false };
        if (sum + pool[c].cents === target) groups.push([pool[a], pool[b], pool[c]]);
        if (groups.length > 1) return { groups, complete: true };
      }
      if (groups.length > 1) return { groups, complete: true };
    }
  }
  return { groups, complete: true };
}

export function matchTransactions(bank: NormalizedImport, ledger: NormalizedImport, options: MatchOptions): Reconciliation {
  if (!Number.isInteger(options.days) || options.days < 0 || options.days > 31) throw new Error("Choose a date window from 0 to 31 days.");
  if (!/^[A-Z]{3}$/.test(options.currency)) throw new Error("Choose one currency for both files.");
  if (!bank.transactions.length || !ledger.transactions.length) throw new Error("Each file needs at least one valid transaction. Check the column settings and preview.");
  if (!Number.isSafeInteger(bank.totalCents - ledger.totalCents)) throw new Error("The difference is too large to compare safely. Use a shorter period.");
  const all = [...bank.transactions, ...ledger.transactions];
  const end = options.statementEnd ? parseDate(options.statementEnd, "iso") : null;
  if (options.statementEnd && !end) throw new Error("Choose a valid statement end date.");
  if (end && all.some(row => row.day > end.day)) throw new Error("Some transactions are after the statement end date. Update that date or export the matching period.");
  const flags: Reconciliation["flags"] = {};
  const notices = new Set<string>();
  const flag = (id: string, item: Flag) => {
    const existing = flags[id] ?? (flags[id] = []);
    if (!existing.some(value => value.kind === item.kind)) existing.push(item);
  };
  const matches: Match[] = [];
  const used = new Set<string>();

  for (const input of [bank, ledger]) {
    const duplicates = makeIndex(input.transactions, row => `${row.date}|${row.cents}|${referenceKey(row.reference) || descriptionKey(row.description) || row.description.trim().toLowerCase()}`);
    for (const rows of duplicates.values()) if (rows.length > 1) {
      for (const row of rows) flag(row.id, { kind: "duplicate", reason: "Possible duplicate: the same date, amount, and reference or description occur more than once in this file. Confirm against the original records.", relatedIds: rows.slice(0, 6).filter(other => other.id !== row.id).slice(0, 5).map(other => other.id) });
    }
  }

  function automaticPass(method: "reference" | "description", key: (row: Transaction) => string) {
    const bankRows = bank.transactions.filter(row => !used.has(row.id));
    const ledgerRows = ledger.transactions.filter(row => !used.has(row.id));
    const bankIndex = makeIndex(bankRows, key);
    const ledgerIndex = makeIndex(ledgerRows, key);
    for (const row of bankRows) {
      const value = key(row);
      if (!value || used.has(row.id)) continue;
      const candidates = nearby(ledgerIndex, value, row.day, options.days);
      if (candidates.count !== 1) continue;
      const other = candidates.rows[0];
      if (used.has(other.id) || nearby(bankIndex, key(other), other.day, options.days).count !== 1) continue;
      if (method === "description" && referenceKey(row.reference) && referenceKey(other.reference) && referenceKey(row.reference) !== referenceKey(other.reference)) continue;
      // Repeated source records need a human even if a date-window boundary
      // happens to make one of their potential partners unique.
      if (flags[row.id]?.some(item => item.kind === "duplicate") || flags[other.id]?.some(item => item.kind === "duplicate")) continue;
      const gap = Math.abs(row.day - other.day);
      matches.push(newMatch([row], [other], method, "automatic", `Same ${method}, amount, and money direction; ${gap === 0 ? "same date" : `${gap} day${gap === 1 ? "" : "s"} apart`}. The candidate is unique on both sides.`));
      used.add(row.id);
      used.add(other.id);
    }
  }
  automaticPass("reference", refAmountKey);
  automaticPass("description", descAmountKey);

  const banks = bank.transactions.filter(row => !used.has(row.id));
  const ledgers = ledger.transactions.filter(row => !used.has(row.id));
  const bankAmounts = makeIndex(banks, amountKey);
  const ledgerAmounts = makeIndex(ledgers, amountKey);
  const proposals: Match[] = [];
  for (const row of banks) {
    const candidates = nearby(ledgerAmounts, amountKey(row), row.day, options.days);
    if (candidates.count === 1 && nearby(bankAmounts, amountKey(row), candidates.rows[0].day, options.days).count === 1) {
      const other = candidates.rows[0];
      proposals.push(newMatch([row], [other], "amount-date", "suggested", "Same amount and money direction within the date window. Check the reference and description before accepting."));
    } else if (candidates.count > 0) {
      flag(row.id, { kind: "ambiguous", reason: "More than one transaction could satisfy an amount/date match. No candidate was chosen.", relatedIds: candidates.rows.slice(0, 5).map(other => other.id) });
      for (const other of candidates.rows) flag(other.id, { kind: "ambiguous", reason: "This amount/date could match more than one transaction. Review the original references.", relatedIds: [row.id] });
    }
  }

  if (options.combined) {
    const budget = { remaining: 200_000 };
    function groupedPass(singles: Transaction[], many: Transaction[], singleIsBank: boolean) {
      const sorted = [...many].sort((a, b) => a.day - b.day || a.line - b.line);
      for (const row of singles) {
        if (budget.remaining < 0) break;
        const start = lowerBound(sorted, row.day - options.days);
        const pool: Transaction[] = [];
        for (let i = start; i < sorted.length && sorted[i].day <= row.day + options.days; i++) {
          if (--budget.remaining < 0) break;
          const other = sorted[i];
          if (Math.sign(other.cents) === Math.sign(row.cents) && Math.abs(other.cents) < Math.abs(row.cents)) pool.push(other);
          if (pool.length > 12) break;
        }
        if (budget.remaining < 0) {
          notices.add("The combined-match search reached its work limit. Some groups were not checked; try a shorter period or match them manually.");
          break;
        }
        if (pool.length < 2) continue;
        const found = combinations(pool, row.cents, budget);
        if (!found.complete) {
          notices.add("Combined matching is limited to 3 transactions from at most 12 nearby candidates, with a bounded search. Some groups were not checked; you can match those rows manually.");
          continue;
        }
        if (found.groups.length === 1) {
          const group = found.groups[0];
          proposals.push(newMatch(singleIsBank ? [row] : group, singleIsBank ? group : [row], "combined", "suggested", `${group.length} ${singleIsBank ? "cashbook" : "bank"} transactions total exactly the ${singleIsBank ? "bank" : "cashbook"} amount, in the same money direction and date window. Review the underlying payment before accepting.`));
        } else if (found.groups.length > 1) {
          const related = [...new Set(found.groups.flat().map(other => other.id))];
          flag(row.id, { kind: "ambiguous", reason: "Several combinations total this amount. No group was chosen.", relatedIds: related.slice(0, 5) });
          for (const id of related) flag(id, { kind: "ambiguous", reason: "This transaction appears in more than one possible combined match.", relatedIds: [row.id] });
        }
      }
    }
    groupedPass(banks, ledgers, true);
    groupedPass(ledgers, banks, false);
  }

  const appearances = new Map<string, number>();
  for (const proposal of proposals) for (const id of [...proposal.bankIds, ...proposal.ledgerIds]) appearances.set(id, (appearances.get(id) ?? 0) + 1);
  for (const proposal of proposals) {
    const ids = [...proposal.bankIds, ...proposal.ledgerIds];
    if (ids.every(id => appearances.get(id) === 1 && !flags[id]?.some(item => item.kind === "duplicate" || item.kind === "ambiguous"))) matches.push(proposal);
    else for (const id of ids) flag(id, { kind: "ambiguous", reason: "This row is shared by competing match candidates. Match it manually after checking the evidence.", relatedIds: ids.filter(other => other !== id).slice(0, 5) });
  }

  // Generate nearby swapped-amount candidates via amount indexes rather than
  // comparing every bank row with every cashbook row.
  for (const row of banks) {
    const digits = String(Math.abs(row.cents)).padStart(3, "0");
    const swapped = new Set<number>();
    for (let a = 0; a < digits.length; a++) for (let b = a + 1; b < digits.length; b++) {
      if (digits[a] === digits[b]) continue;
      const chars = [...digits];
      [chars[a], chars[b]] = [chars[b], chars[a]];
      const value = Number(chars.join("")) * Math.sign(row.cents);
      if (isTransposition(row.cents, value)) swapped.add(value);
    }
    for (const amount of swapped) for (const other of nearby(ledgerAmounts, String(amount), row.day, options.days).rows) {
      const ref = referenceKey(row.reference);
      const desc = descriptionKey(row.description);
      if (!(ref && ref === referenceKey(other.reference)) && !(desc && desc === descriptionKey(other.description))) continue;
      flag(row.id, { kind: "transposition", reason: "Possible transposed digits: the nearby cashbook transaction has the same reference or description but two amount digits are swapped. Amounts were not changed.", relatedIds: [other.id] });
      flag(other.id, { kind: "transposition", reason: "Possible transposed digits in a nearby bank amount. Check the source documents before changing the books.", relatedIds: [row.id] });
    }
  }
  for (const row of banks) if (row.cents < 0 && /\b(fees?|charges?|commission|caj|bankchg)\b/i.test(row.description)) flag(row.id, { kind: "bank-fee", reason: "Possible unrecorded bank charge, based on the description. Confirm the charge and whether it is already booked." });
  if (end) for (const row of ledgers) if (row.day <= end.day && end.day - row.day <= options.days) flag(row.id, { kind: "timing", reason: "Possible timing difference: a cashbook entry near statement end has no confirmed bank match. Check the next statement to confirm clearance." });

  return { bank, ledger, matches, flags, notices: [...notices], options };
}

export function reconcile(bank: ImportInput, ledger: ImportInput, options: MatchOptions): Reconciliation {
  return matchTransactions(normalizeImport(bank, "bank", options.currency), normalizeImport(ledger, "ledger", options.currency), options);
}
