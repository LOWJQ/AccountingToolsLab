export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

export type NormalBalance = "debit" | "credit";

export type Account = {
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
};
