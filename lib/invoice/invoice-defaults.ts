import { defaultCurrency } from "../currency";
import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  DEFAULT_INVOICE_SHIPPING,
  DEFAULT_INVOICE_TAX,
  DEFAULT_INVOICE_TERMS,
  type InvoiceData,
  type InvoiceLineItem,
  type InvoiceTax
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

function normalizeInvoiceTaxRows(taxRows: InvoiceTax[] | undefined): InvoiceTax[] {
  return (taxRows ?? []).map((tax, index) => ({
    ...DEFAULT_INVOICE_TAX,
    ...tax,
    id: tax.id || `tax-${index + 1}`,
    enabled: tax.enabled === true,
    label: tax.label || DEFAULT_INVOICE_TAX.label,
    type: tax.type === "fixed" ? "fixed" : "percentage",
    value: tax.value || "0"
  }));
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
    tax: [],
    shipping: DEFAULT_INVOICE_SHIPPING,
    payment: DEFAULT_INVOICE_PAYMENT_DETAILS,
    notes: "",
    terms: DEFAULT_INVOICE_TERMS
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
    tax: normalizeInvoiceTaxRows(invoice.tax),
    shipping: {
      ...DEFAULT_INVOICE_SHIPPING,
      ...invoice.shipping,
      label: invoice.shipping?.label || DEFAULT_INVOICE_SHIPPING.label
    },
    payment: {
      ...DEFAULT_INVOICE_PAYMENT_DETAILS,
      ...invoice.payment
    },
    notes: invoice.notes || "",
    terms: invoice.terms || ""
  };
}
