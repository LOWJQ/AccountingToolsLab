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
