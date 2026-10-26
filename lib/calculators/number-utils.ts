export function assertValidNumber(
  value: number | null | undefined,
  label: string
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Debit/credit editors treat a blank cell as zero and reject negative amounts. */
export function parseDebitCreditAmount(value: string): number | null {
  if (value.trim() === "") return 0;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}
