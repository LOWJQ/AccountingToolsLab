export const currencyOptions = ["MYR", "USD", "SGD", "EUR", "GBP", "AUD"] as const;

export type CurrencyCode = (typeof currencyOptions)[number];

export const defaultCurrency: CurrencyCode = "MYR";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return currencyOptions.includes(value as CurrencyCode);
}

export function formatCurrency(value: number, currency: CurrencyCode = defaultCurrency): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency
  }).format(value);
}
