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

export type InvoiceTax = {
  enabled: boolean;
  rate: string;
  label?: string;
};

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
  paymentDetails: string;
  notes: string;
};
