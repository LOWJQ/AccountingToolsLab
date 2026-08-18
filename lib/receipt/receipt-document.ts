import type { PdfDocumentLabels } from "../invoice/invoice-pdf-generator";
import { DEFAULT_INVOICE_PAYMENT_DETAILS } from "../invoice/invoice-types";
import type { InvoiceData } from "../invoice/invoice-types";
import { describeReceiptPaymentMethod, type ReceiptData } from "./receipt-types";

/**
 * Bridges a receipt to the invoice pipeline. The totals maths and the PDF
 * renderer both already handle line items, discounts, and taxes correctly, so a
 * receipt is expressed as an invoice-shaped document rather than growing a
 * parallel implementation that could drift.
 *
 * Fields that only apply before payment are blanked: a due date, payment terms,
 * and bank details for the buyer to pay into. The renderer skips each of them
 * when empty.
 */
export function toInvoiceDocument(receipt: ReceiptData): InvoiceData {
  return {
    businessName: receipt.businessName,
    businessContact: receipt.businessContact,
    businessAddress: receipt.businessAddress,
    businessLogoDataUrl: receipt.businessLogoDataUrl,
    customerName: receipt.receivedFrom,
    customerContact: receipt.receivedFromContact,
    customerAddress: receipt.receivedFromAddress,
    invoiceNumber: receipt.receiptNumber,
    invoiceDate: receipt.receiptDate,
    dueDate: "",
    currency: receipt.currency,
    items: receipt.items,
    discount: receipt.discount,
    tax: receipt.tax,
    shipping: receipt.shipping,
    payment: DEFAULT_INVOICE_PAYMENT_DETAILS,
    notes: receipt.notes,
    terms: ""
  };
}

/** Receipt wording for the shared PDF renderer. */
export function createReceiptPdfLabels(receipt: ReceiptData): PdfDocumentLabels {
  return {
    title: "RECEIPT",
    numberLabel: "Receipt #:",
    numberPlaceholder: "Receipt number",
    partyLabel: "RECEIVED FROM",
    dateLabel: "Date paid:",
    datePlaceholder: "Payment date",
    documentName: "Receipt",
    extraMetaRows: [
      { label: "Paid by:", value: describeReceiptPaymentMethod(receipt) },
      { label: "Invoice ref:", value: receipt.invoiceReference }
    ]
  };
}
