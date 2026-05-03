export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency
  }).format(value);
}
