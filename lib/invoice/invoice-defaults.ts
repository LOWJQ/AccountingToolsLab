import { defaultCurrency } from "../currency";
import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  DEFAULT_INVOICE_SHIPPING,
  DEFAULT_INVOICE_TERMS,
  type InvoiceData,
  type InvoiceLineItem
} from "./invoice-types";

export const DEFAULT_INVOICE_NUMBER = "INV-001";

export function createDefaultInvoiceLineItem(id = "item-1"): InvoiceLineItem {
  return {
    id,
    description: "",
    quantity: "1",
    unitPrice: ""
  };
}

export function createEmptyInvoiceDefaults({
  currency = defaultCurrency,
  invoiceDate,
  invoiceNumber = DEFAULT_INVOICE_NUMBER,
  lineItemId
}: {
  currency?: string;
  invoiceDate: string;
  invoiceNumber?: string;
  lineItemId?: string;
}): InvoiceData {
  return {
    businessName: "",
    businessContact: "",
    businessAddress: "",
    businessLogoDataUrl: undefined,
    customerName: "",
    customerContact: "",
    customerAddress: "",
    invoiceNumber,
    invoiceDate,
    dueDate: "",
    currency,
    items: [createDefaultInvoiceLineItem(lineItemId)],
    discount: DEFAULT_INVOICE_DISCOUNT,
    tax: {
      enabled: false,
      rate: "0"
    },
    shipping: DEFAULT_INVOICE_SHIPPING,
    payment: DEFAULT_INVOICE_PAYMENT_DETAILS,
    notes: "",
    terms: DEFAULT_INVOICE_TERMS
  };
}

export function createNewInvoiceFromCurrent(
  currentInvoice: InvoiceData,
  {
    invoiceDate,
    invoiceNumber = DEFAULT_INVOICE_NUMBER,
    lineItemId
  }: {
    invoiceDate: string;
    invoiceNumber?: string;
    lineItemId?: string;
  }
): InvoiceData {
  return {
    ...currentInvoice,
    customerName: "",
    customerContact: "",
    customerAddress: "",
    invoiceNumber,
    invoiceDate,
    dueDate: "",
    items: [createDefaultInvoiceLineItem(lineItemId)],
    discount: DEFAULT_INVOICE_DISCOUNT,
    shipping: DEFAULT_INVOICE_SHIPPING,
    notes: ""
  };
}

export function prepareInvoiceForFormRestore(
  invoice: InvoiceData,
  {
    invoiceDate,
    invoiceNumber = DEFAULT_INVOICE_NUMBER,
    lineItemId
  }: {
    invoiceDate: string;
    invoiceNumber?: string;
    lineItemId?: string;
  }
): InvoiceData {
  return {
    ...invoice,
    invoiceNumber: invoice.invoiceNumber || invoiceNumber,
    invoiceDate: invoice.invoiceDate || invoiceDate,
    dueDate: invoice.dueDate || "",
    items:
      invoice.items.length > 0 ? invoice.items : [createDefaultInvoiceLineItem(lineItemId)],
    discount: {
      ...DEFAULT_INVOICE_DISCOUNT,
      ...invoice.discount
    },
    tax: {
      enabled: invoice.tax.enabled === true,
      rate: invoice.tax.rate || "0",
      label: invoice.tax.label
    },
    shipping: {
      ...DEFAULT_INVOICE_SHIPPING,
      ...invoice.shipping
    },
    payment: {
      ...DEFAULT_INVOICE_PAYMENT_DETAILS,
      ...invoice.payment
    },
    notes: invoice.notes || "",
    terms: invoice.terms || ""
  };
}
