export function sanitizePdfFileNamePart(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "invoice";
}

export function buildInvoicePdfFileName(
  invoiceNumber: string,
  customerName: string,
  invoiceDate: string
): string {
  const parts = [
    "Invoice",
    sanitizePdfFileNamePart(invoiceNumber || "preview"),
    customerName.trim() ? sanitizePdfFileNamePart(customerName) : "",
    invoiceDate.trim() ? sanitizePdfFileNamePart(invoiceDate) : ""
  ].filter(Boolean);

  return `${parts.join("-").slice(0, 120)}.pdf`;
}
