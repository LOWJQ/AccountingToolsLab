export type CashFlowInput = {
  beginningCashBalance: number | null | undefined;
  cashInflows: number | null | undefined;
  cashOutflows: number | null | undefined;
};

export type CashFlowStatus = "positive" | "negative" | "neutral";

export type CashFlowResult = {
  beginningCashBalance: number;
  cashInflows: number;
  cashOutflows: number;
  netCashFlow: number;
  endingCashBalance: number;
  status: CashFlowStatus;
  explanation: string;
};

function assertValidNumber(value: number | null | undefined, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function roundAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getCashFlowStatus(netCashFlow: number): CashFlowStatus {
  if (netCashFlow > 0) {
    return "positive";
  }

  if (netCashFlow < 0) {
    return "negative";
  }

  return "neutral";
}

export function calculateCashFlow(input: CashFlowInput): CashFlowResult {
  const beginningCashBalance = assertValidNumber(
    input.beginningCashBalance,
    "Beginning cash balance"
  );
  const cashInflows = assertValidNumber(input.cashInflows, "Cash inflows");
  const cashOutflows = assertValidNumber(input.cashOutflows, "Cash outflows");

  if (beginningCashBalance < 0) {
    // This beginner calculator models available cash for a simple period, so
    // beginning cash is kept non-negative. Overdrafts or bank facilities should
    // be modeled separately instead of as cash on hand.
    throw new Error("Beginning cash balance must be zero or greater.");
  }

  if (cashInflows < 0) {
    throw new Error("Cash inflows must be zero or greater.");
  }

  if (cashOutflows < 0) {
    throw new Error("Cash outflows must be zero or greater.");
  }

  const netCashFlow = roundAmount(cashInflows - cashOutflows);
  const endingCashBalance = roundAmount(beginningCashBalance + netCashFlow);
  const status = getCashFlowStatus(netCashFlow);

  return {
    beginningCashBalance,
    cashInflows,
    cashOutflows,
    netCashFlow,
    endingCashBalance,
    status,
    explanation: `Net cash flow is ${status}, so the ending cash balance is ${endingCashBalance.toFixed(
      2
    )}.`
  };
}
