import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_SHIPPING,
  DEFAULT_INVOICE_TAX
} from "../invoice/invoice-types";
import type { ReceiptData } from "./receipt-types";

/** ISO date (YYYY-MM-DD) for today, in the visitor's own timezone. */
export function todayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createEmptyReceiptLineItem(id: string) {
  return { id, description: "", quantity: "1", unitPrice: "" };
}

/**
 * A blank receipt. The date defaults to today because a receipt records a
 * payment that has just happened, which is the opposite of an invoice where the
 * useful default is a future due date.
 */
export function createEmptyReceipt(now: Date = new Date()): ReceiptData {
  return {
    businessName: "",
    businessContact: "",
    businessAddress: "",
    businessLogoDataUrl: undefined,
    receivedFrom: "",
    receivedFromContact: "",
    receivedFromAddress: "",
    receiptNumber: "REC-001",
    receiptDate: todayIsoDate(now),
    invoiceReference: "",
    paymentMethod: "cash",
    paymentMethodOther: "",
    currency: "MYR",
    items: [createEmptyReceiptLineItem("receipt-item-1")],
    discount: { ...DEFAULT_INVOICE_DISCOUNT },
    tax: [{ ...DEFAULT_INVOICE_TAX }],
    shipping: { ...DEFAULT_INVOICE_SHIPPING },
    notes: ""
  };
}
