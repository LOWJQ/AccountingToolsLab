export type SstCalculationMode = "add" | "remove";

export type SstMalaysiaInput = {
  mode: SstCalculationMode;
  amount: number | null | undefined;
  sstRate: number | null | undefined;
};

export type SstMalaysiaResult = {
  mode: SstCalculationMode;
  amountBeforeSst: number;
  sstRate: number;
  sstAmount: number;
  totalIncludingSst: number;
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

export function calculateSstMalaysia(input: SstMalaysiaInput): SstMalaysiaResult {
  const amount = assertValidNumber(input.amount, "Amount");
  const sstRate = assertValidNumber(input.sstRate, "SST rate");

  if (amount < 0) {
    throw new Error("Amount must be zero or greater.");
  }

  if (sstRate < 0) {
    throw new Error("SST rate must be zero or greater.");
  }

  if (sstRate > 100) {
    throw new Error("SST rate must be 100% or less.");
  }

  const rateDecimal = sstRate / 100;

  if (input.mode === "add") {
    const amountBeforeSst = roundAmount(amount);
    const sstAmount = roundAmount(amountBeforeSst * rateDecimal);
    const totalIncludingSst = roundAmount(amountBeforeSst + sstAmount);

    return {
      mode: input.mode,
      amountBeforeSst,
      sstRate,
      sstAmount,
      totalIncludingSst,
      explanation: `Adding ${sstRate}% SST gives an estimated total including SST of ${totalIncludingSst.toFixed(
        2
      )}.`
    };
  }

  if (input.mode === "remove") {
    const totalIncludingSst = roundAmount(amount);
    const amountBeforeSst = roundAmount(totalIncludingSst / (1 + rateDecimal));
    const sstAmount = roundAmount(totalIncludingSst - amountBeforeSst);

    return {
      mode: input.mode,
      amountBeforeSst,
      sstRate,
      sstAmount,
      totalIncludingSst,
      explanation: `Removing ${sstRate}% SST gives an estimated amount before SST of ${amountBeforeSst.toFixed(
        2
      )}.`
    };
  }

  throw new Error("Choose whether to add or remove SST.");
}
