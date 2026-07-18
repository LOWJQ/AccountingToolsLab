import { roundToTwoDecimals as roundAmount } from "./number-utils";

export type JournalEntryLine = {
  id?: string;
  accountName: string;
  debit: number;
  credit: number;
};

export type JournalEntryResult = {
  totalDebit: number;
  totalCredit: number;
  difference: number;
  isBalanced: boolean;
  explanation: string;
};

const BALANCE_TOLERANCE = 0.000001;

function assertValidAmount(value: number, label: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be a valid number.`);
  }

  if (value < 0) {
    throw new RangeError(`${label} cannot be negative.`);
  }
}

export function checkJournalEntry(lines: JournalEntryLine[]): JournalEntryResult {
  if (lines.length === 0) {
    throw new Error("Add at least one journal entry line.");
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const accountName = line.accountName.trim();

    assertValidAmount(line.debit, `Line ${lineNumber} debit`);
    assertValidAmount(line.credit, `Line ${lineNumber} credit`);

    if (!accountName && line.debit === 0 && line.credit === 0) {
      throw new Error(`Line ${lineNumber} is empty. Add an account or remove the line.`);
    }

    if (line.debit > 0 && line.credit > 0) {
      throw new Error(`Line ${lineNumber} cannot have both debit and credit amounts.`);
    }
  });

  const totals = lines.reduce(
    (accumulator, line) => ({
      totalDebit: accumulator.totalDebit + line.debit,
      totalCredit: accumulator.totalCredit + line.credit
    }),
    {
      totalDebit: 0,
      totalCredit: 0
    }
  );

  const rawDifference = Math.abs(totals.totalDebit - totals.totalCredit);
  const isBalanced = rawDifference <= BALANCE_TOLERANCE;
  const difference = isBalanced ? 0 : roundAmount(rawDifference);
  const totalDebit = roundAmount(totals.totalDebit);
  const totalCredit = roundAmount(totals.totalCredit);

  let explanation = "Your journal entry balances. Total debits equal total credits.";

  if (!isBalanced) {
    const higherSide = totalDebit > totalCredit ? "Debits" : "Credits";
    explanation = `Your journal entry does not balance. ${higherSide} are higher by ${difference.toFixed(
      2
    )}.`;
  }

  return {
    totalDebit,
    totalCredit,
    difference,
    isBalanced,
    explanation
  };
}
