export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

export type InvoiceDiscount = {
  enabled: boolean;
  label: string;
  type: "percentage" | "fixed";
  value: string;
};

export const DEFAULT_INVOICE_DISCOUNT: InvoiceDiscount = {
  enabled: false,
  label: "Discount",
  type: "percentage",
  value: "0"
};

export type InvoiceTax = {
  id: string;
  enabled: boolean;
  label: string;
  type: "percentage" | "fixed";
  value: string;
};

export const DEFAULT_INVOICE_TAX: InvoiceTax = {
  id: "tax-1",
  enabled: false,
  label: "Tax",
  type: "percentage",
  value: "0"
};

export type InvoiceShipping = {
  enabled: boolean;
  label: string;
  amount: string;
};

export const DEFAULT_INVOICE_SHIPPING: InvoiceShipping = {
  enabled: false,
  label: "Shipping",
  amount: "0"
};

export type InvoicePaymentDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  duitNowId: string;
  paymentLink: string;
  notes: string;
  paymentQrDataUrl?: string;
};

export const DEFAULT_INVOICE_PAYMENT_DETAILS: InvoicePaymentDetails = {
  bankName: "",
  accountName: "",
  accountNumber: "",
  duitNowId: "",
  paymentLink: "",
  notes: "",
  paymentQrDataUrl: undefined
};

export const DEFAULT_INVOICE_TERMS = "";

export type InvoiceData = {
  businessName: string;
  businessContact: string;
  businessAddress: string;
  businessLogoDataUrl?: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceLineItem[];
  discount: InvoiceDiscount;
  tax: InvoiceTax[];
  shipping?: InvoiceShipping;
  payment: InvoicePaymentDetails;
  notes: string;
  terms: string;
};
