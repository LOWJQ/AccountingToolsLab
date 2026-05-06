export const currencyOptions = [
  {
    code: "MYR",
    label: "Malaysia (RM)",
    locale: "en-MY",
    symbol: "RM"
  },
  {
    code: "SGD",
    label: "Singapore (S$)",
    locale: "en-SG",
    symbol: "S$"
  },
  {
    code: "USD",
    label: "US Dollar ($)",
    locale: "en-US",
    symbol: "$"
  },
  {
    code: "EUR",
    label: "Europe (€)",
    locale: "de-DE",
    symbol: "€"
  },
  {
    code: "CNY",
    label: "China Yuan (¥)",
    locale: "zh-CN",
    symbol: "¥"
  },
  {
    code: "TWD",
    label: "Taiwan (NT$)",
    locale: "zh-TW",
    symbol: "NT$"
  },
  {
    code: "KRW",
    label: "Korea (₩)",
    locale: "ko-KR",
    symbol: "₩"
  },
  {
    code: "JPY",
    label: "Japan (¥)",
    locale: "ja-JP",
    symbol: "¥"
  },
  {
    code: "THB",
    label: "Thailand Baht (฿)",
    locale: "th-TH",
    symbol: "฿"
  },
  {
    code: "IDR",
    label: "Indonesia (Rp)",
    locale: "id-ID",
    symbol: "Rp"
  }
] as const;

export type CurrencyCode = (typeof currencyOptions)[number]["code"];

export const defaultCurrency: CurrencyCode = "MYR";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return currencyOptions.some((option) => option.code === value);
}

export function formatCurrency(value: number, currency: CurrencyCode = defaultCurrency): string {
  const config =
    currencyOptions.find((option) => option.code === currency) ?? currencyOptions[0];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    currencyDisplay: "narrowSymbol"
  })
    .formatToParts(value)
    .map((part) => (part.type === "currency" ? config.symbol : part.value))
    .join("");
}
