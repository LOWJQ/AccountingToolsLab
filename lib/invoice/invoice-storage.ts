import {
  DEFAULT_INVOICE_DISCOUNT,
  type InvoiceData,
  type InvoiceDiscount,
  type InvoiceLineItem,
  type InvoicePaymentDetails,
  type InvoiceTax
} from "./invoice-types";

export const ATL_INVOICE_DRAFT_KEY = "atl-invoice-draft";
export const ATL_INVOICE_LAST_NUMBER_KEY = "atl-invoice-last-number";
export const ATL_INVOICE_DRAFT_VERSION = 1;

export type StoredInvoiceDraft = {
  version: number;
  savedAt: string;
  invoice: InvoiceData;
};

type StorageResult = { ok: true } | { ok: false; error: string };

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeLineItem(value: unknown, index: number): InvoiceLineItem {
  const item = isRecord(value) ? value : {};

  return {
    id: readString(item.id) || `item-${index + 1}`,
    description: readString(item.description),
    quantity: readString(item.quantity),
    unitPrice: readString(item.unitPrice)
  };
}

function normalizeDiscount(value: unknown): InvoiceDiscount {
  const discount = isRecord(value) ? value : {};
  const type = discount.type === "fixed" ? "fixed" : "percentage";

  return {
    enabled: discount.enabled === true,
    type,
    value: readString(discount.value) || DEFAULT_INVOICE_DISCOUNT.value
  };
}

function normalizeTax(value: unknown): InvoiceTax {
  const tax = isRecord(value) ? value : {};

  return {
    enabled: tax.enabled === true,
    rate: readString(tax.rate) || "0",
    label: typeof tax.label === "string" ? tax.label : undefined
  };
}

function normalizePayment(value: unknown, legacyPaymentDetails: unknown): InvoicePaymentDetails {
  const payment = isRecord(value) ? value : {};

  return {
    bankName: readString(payment.bankName),
    accountName: readString(payment.accountName),
    accountNumber: readString(payment.accountNumber),
    duitNowId: readString(payment.duitNowId),
    paymentLink: readString(payment.paymentLink),
    notes: readString(payment.notes) || readString(legacyPaymentDetails),
    paymentQrDataUrl: readString(payment.paymentQrDataUrl) || undefined
  };
}

function normalizeInvoice(value: unknown): InvoiceData | null {
  if (!isRecord(value)) {
    return null;
  }

  const rawItems = Array.isArray(value.items) ? value.items : [];
  const items =
    rawItems.length > 0
      ? rawItems.map((item, index) => normalizeLineItem(item, index))
      : [normalizeLineItem({}, 0)];

  return {
    businessName: readString(value.businessName),
    businessContact: readString(value.businessContact),
    businessAddress: readString(value.businessAddress),
    businessLogoDataUrl: readString(value.businessLogoDataUrl) || undefined,
    customerName: readString(value.customerName),
    customerContact: readString(value.customerContact),
    customerAddress: readString(value.customerAddress),
    invoiceNumber: readString(value.invoiceNumber),
    invoiceDate: readString(value.invoiceDate),
    dueDate: readString(value.dueDate),
    currency: readString(value.currency),
    items,
    discount: normalizeDiscount(value.discount),
    tax: normalizeTax(value.tax),
    payment: normalizePayment(value.payment, value.paymentDetails),
    notes: readString(value.notes),
    terms: readString(value.terms)
  };
}

export function loadInvoiceDraft(): StoredInvoiceDraft | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  try {
    const rawDraft = storage.getItem(ATL_INVOICE_DRAFT_KEY);

    if (!rawDraft) {
      return null;
    }

    const parsedDraft: unknown = JSON.parse(rawDraft);

    if (!isRecord(parsedDraft) || parsedDraft.version !== ATL_INVOICE_DRAFT_VERSION) {
      return null;
    }

    const invoice = normalizeInvoice(parsedDraft.invoice);

    if (!invoice) {
      return null;
    }

    return {
      version: ATL_INVOICE_DRAFT_VERSION,
      savedAt: readString(parsedDraft.savedAt),
      invoice
    };
  } catch {
    return null;
  }
}

export function saveInvoiceDraft(invoice: InvoiceData): StorageResult {
  const storage = getLocalStorage();

  if (!storage) {
    return { ok: false, error: "localStorage is unavailable." };
  }

  try {
    const draft: StoredInvoiceDraft = {
      version: ATL_INVOICE_DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      invoice
    };

    storage.setItem(ATL_INVOICE_DRAFT_KEY, JSON.stringify(draft));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to save invoice draft."
    };
  }
}

export function clearInvoiceDraft(): StorageResult {
  const storage = getLocalStorage();

  if (!storage) {
    return { ok: false, error: "localStorage is unavailable." };
  }

  try {
    storage.removeItem(ATL_INVOICE_DRAFT_KEY);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to clear invoice draft."
    };
  }
}

export function loadLastInvoiceNumber(): string | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  try {
    const value = storage.getItem(ATL_INVOICE_LAST_NUMBER_KEY)?.trim() ?? "";
    return value === "" ? null : value;
  } catch {
    return null;
  }
}

export function saveLastInvoiceNumber(invoiceNumber: string): StorageResult {
  const storage = getLocalStorage();
  const trimmedInvoiceNumber = invoiceNumber.trim();

  if (!storage) {
    return { ok: false, error: "localStorage is unavailable." };
  }

  if (trimmedInvoiceNumber === "") {
    return { ok: false, error: "Invoice number is empty." };
  }

  try {
    storage.setItem(ATL_INVOICE_LAST_NUMBER_KEY, trimmedInvoiceNumber);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to save invoice number."
    };
  }
}

export function clearLastInvoiceNumber(): StorageResult {
  const storage = getLocalStorage();

  if (!storage) {
    return { ok: false, error: "localStorage is unavailable." };
  }

  try {
    storage.removeItem(ATL_INVOICE_LAST_NUMBER_KEY);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unable to clear invoice number."
    };
  }
}
