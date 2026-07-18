import {
  assertValidNumber,
  roundToTwoDecimals as roundAmount
} from "./number-utils";

export type AccountingEquationSolveFor = "assets" | "liabilities" | "equity";

export type AccountingEquationInput = {
  solveFor: AccountingEquationSolveFor;
  assets?: number | null;
  liabilities?: number | null;
  equity?: number | null;
};

export type AccountingEquationResult = {
  solveFor: AccountingEquationSolveFor;
  value: number;
  formula: string;
};

export function calculateAccountingEquation(
  input: AccountingEquationInput
): AccountingEquationResult {
  if (input.solveFor === "assets") {
    const liabilities = assertValidNumber(input.liabilities, "Liabilities");
    const equity = assertValidNumber(input.equity, "Equity");

    return {
      solveFor: "assets",
      value: roundAmount(liabilities + equity),
      formula: "Assets = Liabilities + Equity"
    };
  }

  if (input.solveFor === "liabilities") {
    const assets = assertValidNumber(input.assets, "Assets");
    const equity = assertValidNumber(input.equity, "Equity");

    return {
      solveFor: "liabilities",
      value: roundAmount(assets - equity),
      formula: "Liabilities = Assets - Equity"
    };
  }

  const assets = assertValidNumber(input.assets, "Assets");
  const liabilities = assertValidNumber(input.liabilities, "Liabilities");

  return {
    solveFor: "equity",
    value: roundAmount(assets - liabilities),
    formula: "Equity = Assets - Liabilities"
  };
}
