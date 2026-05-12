export type TrialBalanceRow = {
  id: string;
  accountName: string;
  debit: number;
  credit: number;
};

export type TrialBalanceResult = {
  totalDebit: number;
  totalCredit: number;
  difference: number;
  isBalanced: boolean;
};

const BALANCE_TOLERANCE = 0.000001;

function roundAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertValidAmount(value: number, label: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be a valid number.`);
  }

  if (value < 0) {
    throw new RangeError("Debit and credit amounts must be non-negative.");
  }
}

export function calculateTrialBalance(rows: TrialBalanceRow[]): TrialBalanceResult {
  rows.forEach((row, index) => {
    const rowNumber = index + 1;

    assertValidAmount(row.debit, `Row ${rowNumber} debit`);
    assertValidAmount(row.credit, `Row ${rowNumber} credit`);

    if (row.debit > 0 && row.credit > 0) {
      throw new Error("A row cannot have both debit and credit amounts.");
    }
  });

  const totals = rows.reduce(
    (accumulator, row) => ({
      totalDebit: accumulator.totalDebit + row.debit,
      totalCredit: accumulator.totalCredit + row.credit
    }),
    {
      totalDebit: 0,
      totalCredit: 0
    }
  );

  const rawDifference = Math.abs(totals.totalDebit - totals.totalCredit);
  const isBalanced = rawDifference <= BALANCE_TOLERANCE;
  const difference = isBalanced ? 0 : roundAmount(rawDifference);

  return {
    totalDebit: roundAmount(totals.totalDebit),
    totalCredit: roundAmount(totals.totalCredit),
    difference,
    isBalanced
  };
}
