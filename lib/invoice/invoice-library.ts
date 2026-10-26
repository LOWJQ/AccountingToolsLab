import {
  calculateInvoiceTotals,
  roundMoney
} from "./invoice-calculations";
import { INVOICE_LOGO_MAX_DATA_URL_BYTES } from "./invoice-logo";
import { INVOICE_PAYMENT_QR_MAX_DATA_URL_BYTES } from "./invoice-payment-qr";
import {
  ATL_INVOICE_DRAFT_KEY,
  getLocalStorage,
  normalizeInvoice
} from "./invoice-storage";
import {
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  type InvoiceData,
  type InvoiceDiscount,
  type InvoiceLineItem,
  type InvoicePaymentDetails,
  type InvoiceShipping,
  type InvoiceTax
} from "./invoice-types";

export const ATL_BUSINESS_PROFILE_KEY = "atl-business-profile";
export const ATL_INVOICE_INDEX_KEY = "atl-invoice-index";
const ATL_INVOICE_ITEM_KEY_PREFIX = "atl-invoice-item-";
export const ATL_INVOICE_LIBRARY_VERSION = 1;

/** Hard ceiling on saved invoices, so a browser quota error stays unlikely. */
export const ATL_MAX_SAVED_INVOICES = 50;
/** Warn from here, giving people room to tidy up before they are blocked. */
export const ATL_SAVED_INVOICE_WARN_AT = 45;

/**
 * The parts of an invoice that are the same every time: who is sending it.
 * Stored once rather than copied onto every invoice, which is what makes the
 * logo and payment QR affordable to keep at all — a 500KB logo on 50 invoices
 * would exhaust the browser's storage on its own.
 */
export type InvoiceBusinessProfile = {
  businessName: string;
  businessContact: string;
  businessAddress: string;
  businessLogoDataUrl?: string;
  payment: InvoicePaymentDetails;
  terms: string;
};

/** The parts that change per invoice: who it is for and what is on it. */
export type SavedInvoiceFields = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  items: InvoiceLineItem[];
  discount: InvoiceDiscount;
  tax: InvoiceTax[];
  shipping?: InvoiceShipping;
  notes: string;
};

/**
 * One row in the saved list. Deliberately small: the list renders from the
 * index alone, so opening "My invoices" never parses every invoice body.
 */
export type InvoiceIndexEntry = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  currency: string;
  total: number;
  updatedAt: string;
};

export type LibraryFailureReason = "unavailable" | "quota" | "limit" | "not-found" | "error";

export type LibraryResult =
  | { ok: true }
  | { ok: false; reason: LibraryFailureReason; error: string };

export const EMPTY_BUSINESS_PROFILE: InvoiceBusinessProfile = {
  businessName: "",
  businessContact: "",
  businessAddress: "",
  businessLogoDataUrl: undefined,
  payment: { ...DEFAULT_INVOICE_PAYMENT_DETAILS },
  terms: ""
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isQuotaError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  // Browsers disagree on the name, so match the shapes all of them use.
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    /quota/i.test(error.message)
  );
}

function failure(error: unknown, fallback: string): LibraryResult {
  if (isQuotaError(error)) {
    return {
      ok: false,
      reason: "quota",
      error: "Storage is full. Delete a saved invoice and try again."
    };
  }

  return {
    ok: false,
    reason: "error",
    error: error instanceof Error ? error.message : fallback
  };
}

const UNAVAILABLE: LibraryResult = {
  ok: false,
  reason: "unavailable",
  error: "Saving is unavailable in this browser."
};

/** Keeps oversized or non-image strings out of storage. */
function readImageDataUrl(value: unknown, maxBytes: number): string | undefined {
  const dataUrl = readString(value);

  if (!dataUrl.startsWith("data:image/")) {
    return undefined;
  }

  // Rough byte count; base64 payloads are ASCII so length is a close enough
  // proxy without decoding the whole string.
  return dataUrl.length > maxBytes ? undefined : dataUrl;
}

export function createInvoiceId(): string {
  const globalCrypto = typeof globalThis === "undefined" ? undefined : globalThis.crypto;

  if (globalCrypto && typeof globalCrypto.randomUUID === "function") {
    return globalCrypto.randomUUID();
  }

  return `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function invoiceKey(id: string): string {
  return `${ATL_INVOICE_ITEM_KEY_PREFIX}${id}`;
}

/**
 * Splits the editor's working shape into the two things that get stored.
 * The editor keeps using InvoiceData throughout; only storage sees the split.
 */
export function splitInvoice(invoice: InvoiceData): {
  fields: SavedInvoiceFields;
  profile: InvoiceBusinessProfile;
} {
  return {
    profile: {
      businessName: invoice.businessName,
      businessContact: invoice.businessContact,
      businessAddress: invoice.businessAddress,
      businessLogoDataUrl: invoice.businessLogoDataUrl,
      payment: { ...invoice.payment },
      terms: invoice.terms
    },
    fields: {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      customerName: invoice.customerName,
      customerContact: invoice.customerContact,
      customerAddress: invoice.customerAddress,
      items: invoice.items.map((item) => ({ ...item })),
      discount: { ...invoice.discount },
      tax: invoice.tax.map((row) => ({ ...row })),
      shipping: invoice.shipping ? { ...invoice.shipping } : undefined,
      notes: invoice.notes
    }
  };
}

/** Puts the two halves back together for the editor and the PDF generator. */
export function mergeInvoice(
  profile: InvoiceBusinessProfile,
  fields: SavedInvoiceFields
): InvoiceData {
  return {
    businessName: profile.businessName,
    businessContact: profile.businessContact,
    businessAddress: profile.businessAddress,
    businessLogoDataUrl: profile.businessLogoDataUrl,
    payment: { ...profile.payment },
    terms: profile.terms,
    invoiceNumber: fields.invoiceNumber,
    invoiceDate: fields.invoiceDate,
    dueDate: fields.dueDate,
    currency: fields.currency,
    customerName: fields.customerName,
    customerContact: fields.customerContact,
    customerAddress: fields.customerAddress,
    items: fields.items.map((item) => ({ ...item })),
    discount: { ...fields.discount },
    tax: fields.tax.map((row) => ({ ...row })),
    shipping: fields.shipping ? { ...fields.shipping } : undefined,
    notes: fields.notes
  };
}

/**
 * Reuses normalizeInvoice so stored invoice fields get exactly the same
 * defensive parsing as the legacy draft, rather than a second copy of it.
 */
function normalizeFields(value: unknown): SavedInvoiceFields | null {
  const invoice = normalizeInvoice(value);

  if (!invoice) {
    return null;
  }

  return splitInvoice(invoice).fields;
}

function normalizeProfile(value: unknown): InvoiceBusinessProfile {
  const raw = isRecord(value) ? value : {};
  // Run the payment block through normalizeInvoice so its rules stay in one
  // place, then restore the images, which that path deliberately drops.
  const normalized = normalizeInvoice({ ...raw, items: [] });
  const payment = normalized ? normalized.payment : { ...DEFAULT_INVOICE_PAYMENT_DETAILS };
  const rawPayment = isRecord(raw.payment) ? raw.payment : {};

  return {
    businessName: readString(raw.businessName),
    businessContact: readString(raw.businessContact),
    businessAddress: readString(raw.businessAddress),
    businessLogoDataUrl: readImageDataUrl(
      raw.businessLogoDataUrl,
      INVOICE_LOGO_MAX_DATA_URL_BYTES
    ),
    payment: {
      ...payment,
      paymentQrDataUrl: readImageDataUrl(
        rawPayment.paymentQrDataUrl,
        INVOICE_PAYMENT_QR_MAX_DATA_URL_BYTES
      )
    },
    terms: readString(raw.terms)
  };
}

/** What the saved list shows for an invoice that has no number typed yet. */
export function getInvoiceLabel(entry: Pick<InvoiceIndexEntry, "invoiceNumber" | "customerName">) {
  return entry.invoiceNumber.trim() || entry.customerName.trim() || "Untitled invoice";
}

export function loadBusinessProfile(): InvoiceBusinessProfile | null {
  const storage = getLocalStorage();

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(ATL_BUSINESS_PROFILE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed) || parsed.version !== ATL_INVOICE_LIBRARY_VERSION) {
      return null;
    }

    return normalizeProfile(parsed.profile);
  } catch {
    return null;
  }
}

export function saveBusinessProfile(profile: InvoiceBusinessProfile): LibraryResult {
  const storage = getLocalStorage();

  if (!storage) {
    return UNAVAILABLE;
  }

  try {
    storage.setItem(
      ATL_BUSINESS_PROFILE_KEY,
      JSON.stringify({
        version: ATL_INVOICE_LIBRARY_VERSION,
        savedAt: new Date().toISOString(),
        profile: normalizeProfile(profile)
      })
    );

    return { ok: true };
  } catch (error) {
    return failure(error, "Unable to save business details.");
  }
}

export function clearBusinessProfile(): LibraryResult {
  const storage = getLocalStorage();

  if (!storage) {
    return UNAVAILABLE;
  }

  try {
    storage.removeItem(ATL_BUSINESS_PROFILE_KEY);
    return { ok: true };
  } catch (error) {
    return failure(error, "Unable to clear business details.");
  }
}

export function loadInvoiceIndex(): InvoiceIndexEntry[] {
  const storage = getLocalStorage();

  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(ATL_INVOICE_INDEX_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed) || parsed.version !== ATL_INVOICE_LIBRARY_VERSION) {
      return [];
    }

    const entries = Array.isArray(parsed.invoices) ? parsed.invoices : [];

    return entries
      .filter(isRecord)
      .map((entry) => ({
        id: readString(entry.id),
        invoiceNumber: readString(entry.invoiceNumber),
        customerName: readString(entry.customerName),
        currency: readString(entry.currency),
        total: typeof entry.total === "number" && Number.isFinite(entry.total) ? entry.total : 0,
        updatedAt: readString(entry.updatedAt)
      }))
      .filter((entry) => entry.id !== "");
  } catch {
    return [];
  }
}

/** Saved invoices, newest first. */
export function listInvoices(): InvoiceIndexEntry[] {
  return [...loadInvoiceIndex()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function writeIndex(storage: Storage, entries: InvoiceIndexEntry[]) {
  storage.setItem(
    ATL_INVOICE_INDEX_KEY,
    JSON.stringify({ version: ATL_INVOICE_LIBRARY_VERSION, invoices: entries })
  );
}

export function loadInvoice(id: string): SavedInvoiceFields | null {
  const storage = getLocalStorage();

  if (!storage || id === "") {
    return null;
  }

  try {
    const raw = storage.getItem(invoiceKey(id));

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed) || parsed.version !== ATL_INVOICE_LIBRARY_VERSION) {
      return null;
    }

    return normalizeFields(parsed.invoice);
  } catch {
    return null;
  }
}

/**
 * Writes one invoice and updates its index row. The invoice body is written
 * first: if the index write then fails, the body is recoverable rather than
 * the row pointing at nothing.
 */
export function saveInvoice(id: string, fields: SavedInvoiceFields): LibraryResult {
  const storage = getLocalStorage();

  if (!storage) {
    return UNAVAILABLE;
  }

  if (id === "") {
    return { ok: false, reason: "error", error: "Invoice id is required." };
  }

  const index = loadInvoiceIndex();
  const existing = index.findIndex((entry) => entry.id === id);

  if (existing === -1 && index.length >= ATL_MAX_SAVED_INVOICES) {
    return {
      ok: false,
      reason: "limit",
      error: `You can save up to ${ATL_MAX_SAVED_INVOICES} invoices. Delete one to make room.`
    };
  }

  try {
    const safeFields = normalizeFields(fields) ?? fields;
    const totals = calculateInvoiceTotals(mergeInvoice(EMPTY_BUSINESS_PROFILE, safeFields));

    storage.setItem(
      invoiceKey(id),
      JSON.stringify({
        version: ATL_INVOICE_LIBRARY_VERSION,
        savedAt: new Date().toISOString(),
        invoice: safeFields
      })
    );

    const entry: InvoiceIndexEntry = {
      id,
      invoiceNumber: safeFields.invoiceNumber,
      customerName: safeFields.customerName,
      currency: safeFields.currency,
      total: roundMoney(totals.total),
      updatedAt: new Date().toISOString()
    };

    const nextIndex = existing === -1 ? [...index, entry] : index.map((row, i) => (i === existing ? entry : row));

    writeIndex(storage, nextIndex);
    return { ok: true };
  } catch (error) {
    return failure(error, "Unable to save invoice.");
  }
}

export function deleteInvoice(id: string): LibraryResult {
  const storage = getLocalStorage();

  if (!storage) {
    return UNAVAILABLE;
  }

  try {
    const index = loadInvoiceIndex();

    if (!index.some((entry) => entry.id === id)) {
      return { ok: false, reason: "not-found", error: "That invoice no longer exists." };
    }

    storage.removeItem(invoiceKey(id));
    writeIndex(
      storage,
      index.filter((entry) => entry.id !== id)
    );

    return { ok: true };
  } catch (error) {
    return failure(error, "Unable to delete invoice.");
  }
}

export type MigrationOutcome =
  | { migrated: false; reason: "no-storage" | "already-migrated" | "nothing-to-migrate" }
  | { migrated: true; id: string };

/**
 * Moves the single legacy draft into the new structure.
 *
 * Deliberately does NOT delete the old key: until the editor reads from the
 * library, removing it would orphan someone's only saved invoice. The caller
 * clears it once the new path is actually in use.
 */
export function migrateLegacyDraft(): MigrationOutcome {
  const storage = getLocalStorage();

  if (!storage) {
    return { migrated: false, reason: "no-storage" };
  }

  if (loadInvoiceIndex().length > 0 || storage.getItem(ATL_BUSINESS_PROFILE_KEY)) {
    return { migrated: false, reason: "already-migrated" };
  }

  let legacy: unknown;

  try {
    const raw = storage.getItem(ATL_INVOICE_DRAFT_KEY);

    if (!raw) {
      return { migrated: false, reason: "nothing-to-migrate" };
    }

    legacy = JSON.parse(raw);
  } catch {
    return { migrated: false, reason: "nothing-to-migrate" };
  }

  const invoice = normalizeInvoice(isRecord(legacy) ? legacy.invoice : null);

  if (!invoice) {
    return { migrated: false, reason: "nothing-to-migrate" };
  }

  const { fields, profile } = splitInvoice(invoice);
  const id = createInvoiceId();

  const savedInvoice = saveInvoice(id, fields);

  if (!savedInvoice.ok) {
    return { migrated: false, reason: "nothing-to-migrate" };
  }

  saveBusinessProfile(profile);

  return { migrated: true, id };
}

export type InvoiceLibraryExport = {
  version: number;
  exportedAt: string;
  profile: InvoiceBusinessProfile | null;
  invoices: { entry: InvoiceIndexEntry; fields: SavedInvoiceFields }[];
};

/** Everything the browser holds, as JSON, so people can keep their own backup. */
export function exportAllData(): InvoiceLibraryExport {
  const invoices = listInvoices()
    .map((entry) => {
      const fields = loadInvoice(entry.id);
      return fields ? { entry, fields } : null;
    })
    .filter((row): row is { entry: InvoiceIndexEntry; fields: SavedInvoiceFields } => row !== null);

  return {
    version: ATL_INVOICE_LIBRARY_VERSION,
    exportedAt: new Date().toISOString(),
    profile: loadBusinessProfile(),
    invoices
  };
}

/** Adds imported invoices alongside existing ones; never wipes what is there. */
export function importAllData(value: unknown): LibraryResult {
  const storage = getLocalStorage();

  if (!storage) {
    return UNAVAILABLE;
  }

  if (!isRecord(value) || value.version !== ATL_INVOICE_LIBRARY_VERSION) {
    return { ok: false, reason: "error", error: "That file is not a valid invoice backup." };
  }

  const rows = Array.isArray(value.invoices) ? value.invoices : [];

  for (const row of rows) {
    if (!isRecord(row)) {
      continue;
    }

    const fields = normalizeFields(row.fields);

    if (!fields) {
      continue;
    }

    const result = saveInvoice(createInvoiceId(), fields);

    if (!result.ok) {
      return result;
    }
  }

  if (isRecord(value.profile) && !loadBusinessProfile()) {
    saveBusinessProfile(normalizeProfile(value.profile));
  }

  return { ok: true };
}
