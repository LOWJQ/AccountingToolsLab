import {
  assertValidNumber,
  roundToTwoDecimals as roundAmount
} from "./number-utils";

export type DepreciationInput = {
  assetCost: number | null | undefined;
  salvageValue: number | null | undefined;
  usefulLifeYears: number | null | undefined;
};

export type DepreciationResult = {
  assetCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciableAmount: number;
  annualDepreciation: number;
  monthlyDepreciation: number;
  explanation: string;
};

export function calculateDepreciation(input: DepreciationInput): DepreciationResult {
  const assetCost = assertValidNumber(input.assetCost, "Asset cost");
  const salvageValue = assertValidNumber(input.salvageValue, "Salvage value");
  const usefulLifeYears = assertValidNumber(input.usefulLifeYears, "Useful life");

  if (assetCost <= 0) {
    throw new Error("Asset cost must be greater than zero.");
  }

  if (salvageValue < 0) {
    throw new Error("Salvage value cannot be negative.");
  }

  if (usefulLifeYears <= 0) {
    throw new Error("Useful life must be greater than zero.");
  }

  if (salvageValue > assetCost) {
    throw new Error("Salvage value cannot be greater than asset cost.");
  }

  const depreciableAmount = roundAmount(assetCost - salvageValue);
  const annualDepreciation = roundAmount(depreciableAmount / usefulLifeYears);
  const monthlyDepreciation = roundAmount(annualDepreciation / 12);

  return {
    assetCost,
    salvageValue,
    usefulLifeYears,
    depreciableAmount,
    annualDepreciation,
    monthlyDepreciation,
    explanation: `The depreciable amount is ${depreciableAmount.toFixed(
      2
    )}, spread evenly over ${usefulLifeYears} year${
      usefulLifeYears === 1 ? "" : "s"
    } using straight-line depreciation.`
  };
}
