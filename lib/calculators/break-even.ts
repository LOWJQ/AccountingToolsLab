export type BreakEvenInput = {
  fixedCosts: number | null | undefined;
  sellingPricePerUnit: number | null | undefined;
  variableCostPerUnit: number | null | undefined;
};

export type BreakEvenResult = {
  fixedCosts: number;
  sellingPricePerUnit: number;
  variableCostPerUnit: number;
  contributionMarginPerUnit: number;
  breakEvenUnits: number;
  breakEvenSales: number;
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

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixedCosts = assertValidNumber(input.fixedCosts, "Fixed costs");
  const sellingPricePerUnit = assertValidNumber(
    input.sellingPricePerUnit,
    "Selling price per unit"
  );
  const variableCostPerUnit = assertValidNumber(
    input.variableCostPerUnit,
    "Variable cost per unit"
  );

  if (fixedCosts < 0) {
    throw new Error("Fixed costs must be zero or greater.");
  }

  if (sellingPricePerUnit <= 0) {
    throw new Error("Selling price per unit must be greater than zero.");
  }

  if (variableCostPerUnit < 0) {
    throw new Error("Variable cost per unit must be zero or greater.");
  }

  if (sellingPricePerUnit <= variableCostPerUnit) {
    throw new Error("Selling price per unit must be greater than variable cost per unit.");
  }

  const contributionMarginPerUnit = roundAmount(sellingPricePerUnit - variableCostPerUnit);
  const rawBreakEvenUnits = fixedCosts / contributionMarginPerUnit;
  const breakEvenUnits = roundAmount(rawBreakEvenUnits);
  const breakEvenSales = roundAmount(rawBreakEvenUnits * sellingPricePerUnit);

  return {
    fixedCosts,
    sellingPricePerUnit,
    variableCostPerUnit,
    contributionMarginPerUnit,
    breakEvenUnits,
    breakEvenSales,
    explanation: `The business needs to sell ${breakEvenUnits.toFixed(
      2
    )} unit${breakEvenUnits === 1 ? "" : "s"} to cover fixed and variable costs.`
  };
}
