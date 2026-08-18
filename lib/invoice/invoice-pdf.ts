export function sanitizePdfFileNamePart(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "invoice";
}

export function buildInvoicePdfFileName(
  invoiceNumber: string,
  customerName: string,
  invoiceDate: string,
  /** Prefix for the file name. Defaults to "Invoice" so existing callers keep
   *  producing the same name; the receipt generator passes "Receipt". */
  documentName: string = "Invoice"
): string {
  const parts = [
    documentName,
    sanitizePdfFileNamePart(invoiceNumber || "preview"),
    customerName.trim() ? sanitizePdfFileNamePart(customerName) : "",
    invoiceDate.trim() ? sanitizePdfFileNamePart(invoiceDate) : ""
  ].filter(Boolean);

  return `${parts.join("-").slice(0, 120)}.pdf`;
}
