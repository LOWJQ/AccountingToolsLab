export type TrialBalanceRow = {
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

export function calculateTrialBalance(rows: TrialBalanceRow[]): TrialBalanceResult {
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

  const difference = Math.abs(totals.totalDebit - totals.totalCredit);

  return {
    totalDebit: totals.totalDebit,
    totalCredit: totals.totalCredit,
    difference,
    isBalanced: difference === 0
  };
}
