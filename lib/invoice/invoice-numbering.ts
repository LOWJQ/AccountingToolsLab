export function getNextInvoiceNumber(current: string): string | null {
  const invoiceNumber = current.trim();

  if (invoiceNumber === "") {
    return null;
  }

  const match = invoiceNumber.match(/^(.*?)(\d+)$/);

  if (!match) {
    return null;
  }

  const [, prefix, numericSuffix] = match;
  const parsedSuffix = Number(numericSuffix);

  if (!Number.isSafeInteger(parsedSuffix)) {
    return null;
  }

  const nextSuffix = String(parsedSuffix + 1).padStart(numericSuffix.length, "0");
  return `${prefix}${nextSuffix}`;
}

export function canAutoIncrementInvoiceNumber(value: string): boolean {
  return getNextInvoiceNumber(value) !== null;
}
