export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

export type InvoiceDiscount = {
  enabled: boolean;
  type: "percentage" | "fixed";
  value: string;
};

export const DEFAULT_INVOICE_DISCOUNT: InvoiceDiscount = {
  enabled: false,
  type: "percentage",
  value: "0"
};

export type InvoiceTax = {
  enabled: boolean;
  rate: string;
  label?: string;
};

export type InvoiceShipping = {
  enabled: boolean;
  amount: string;
};

export const DEFAULT_INVOICE_SHIPPING: InvoiceShipping = {
  enabled: false,
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

export const DEFAULT_INVOICE_TERMS =
  "Payment is due within 30 days of the invoice date.\nPlease include the invoice number as the payment reference.";

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
  tax: InvoiceTax;
  shipping?: InvoiceShipping;
  payment: InvoicePaymentDetails;
  notes: string;
  terms: string;
};
