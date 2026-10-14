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

/** Suggest a fresh number even when an older invoice was downloaded again. */
export function getUnusedInvoiceNumber(suggestion: string, usedNumbers: string[]): string | null {
  const used = new Set(usedNumbers.map((number) => number.trim()));
  let candidate: string | null = suggestion.trim();
  for (let attempt = 0; candidate && attempt <= used.size; attempt += 1) {
    if (!used.has(candidate)) return candidate;
    candidate = getNextInvoiceNumber(candidate);
  }
  return null;
}
