export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense"
  | "dividends";

export type AccountEffect = "increase" | "decrease";
export type DebitCreditAnswer = "Debit" | "Credit";
export type NormalBalance = "Debit" | "Credit";

export type DebitCreditInput = {
  accountType?: AccountType | null;
  effect?: AccountEffect | null;
};

export type DebitCreditResult = {
  accountType: AccountType;
  effect: AccountEffect;
  answer: DebitCreditAnswer;
  normalBalance: NormalBalance;
  explanation: string;
};

const accountLabels: Record<AccountType, string> = {
  asset: "Assets",
  liability: "Liabilities",
  equity: "Equity",
  revenue: "Revenue",
  expense: "Expenses",
  dividends: "Dividends/Drawings"
};

const normalBalances: Record<AccountType, NormalBalance> = {
  asset: "Debit",
  expense: "Debit",
  dividends: "Debit",
  liability: "Credit",
  equity: "Credit",
  revenue: "Credit"
};

function isAccountType(value: unknown): value is AccountType {
  return (
    value === "asset" ||
    value === "liability" ||
    value === "equity" ||
    value === "revenue" ||
    value === "expense" ||
    value === "dividends"
  );
}

function isAccountEffect(value: unknown): value is AccountEffect {
  return value === "increase" || value === "decrease";
}

export function checkDebitCredit(input: DebitCreditInput): DebitCreditResult {
  if (!isAccountType(input.accountType)) {
    throw new Error("Choose an account type.");
  }

  if (!isAccountEffect(input.effect)) {
    throw new Error("Choose whether the account increases or decreases.");
  }

  const normalBalance = normalBalances[input.accountType];
  const answer =
    input.effect === "increase"
      ? normalBalance
      : normalBalance === "Debit"
        ? "Credit"
        : "Debit";
  const accountLabel = accountLabels[input.accountType];
  const effectLabel = input.effect === "increase" ? "increasing" : "decreasing";

  return {
    accountType: input.accountType,
    effect: input.effect,
    answer,
    normalBalance,
    explanation: `${accountLabel} has a normal ${normalBalance.toLowerCase()} balance, so ${effectLabel.toLowerCase()} this account means recording a ${answer.toLowerCase()}.`
  };
}

export { accountLabels, normalBalances };
