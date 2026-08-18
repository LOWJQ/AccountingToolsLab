import type {
  InvoiceDiscount,
  InvoiceLineItem,
  InvoiceShipping,
  InvoiceTax
} from "../invoice/invoice-types";

/**
 * A receipt is proof that money has already been paid, so it deliberately drops
 * the parts of an invoice that only make sense before payment: no due date, no
 * payment terms, and no bank details for the buyer to pay into. Everything it
 * does share with an invoice reuses the invoice primitives rather than
 * redeclaring them, so the line item and tax maths stay in one place.
 */

export type ReceiptPaymentMethod =
  | "cash"
  | "bank-transfer"
  | "card"
  | "e-wallet"
  | "cheque"
  | "other";

export const RECEIPT_PAYMENT_METHODS: {
  id: ReceiptPaymentMethod;
  label: string;
}[] = [
  { id: "cash", label: "Cash" },
  { id: "bank-transfer", label: "Bank transfer" },
  { id: "card", label: "Card" },
  { id: "e-wallet", label: "E-wallet" },
  { id: "cheque", label: "Cheque" },
  { id: "other", label: "Other" }
];

export type ReceiptData = {
  businessName: string;
  businessContact: string;
  businessAddress: string;
  businessLogoDataUrl?: string;
  /** Who paid. The receipt equivalent of an invoice's customer. */
  receivedFrom: string;
  receivedFromContact: string;
  receivedFromAddress: string;
  receiptNumber: string;
  receiptDate: string;
  /** Optional invoice this receipt settles. */
  invoiceReference: string;
  paymentMethod: ReceiptPaymentMethod;
  /** Free text used only when paymentMethod is "other". */
  paymentMethodOther: string;
  currency: string;
  items: InvoiceLineItem[];
  discount: InvoiceDiscount;
  tax: InvoiceTax[];
  shipping: InvoiceShipping;
  notes: string;
};

/** Human label for the method, falling back to the free-text "other" value. */
export function describeReceiptPaymentMethod(receipt: ReceiptData): string {
  if (receipt.paymentMethod === "other") {
    return receipt.paymentMethodOther.trim();
  }

  return (
    RECEIPT_PAYMENT_METHODS.find((method) => method.id === receipt.paymentMethod)?.label ?? ""
  );
}
