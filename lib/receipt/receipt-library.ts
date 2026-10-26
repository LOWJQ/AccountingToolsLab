import { isCurrencyCode } from "../currency";
import { getNextInvoiceNumber } from "../invoice/invoice-numbering";
import { INVOICE_LOGO_MAX_DATA_URL_BYTES } from "../invoice/invoice-logo";
import { createEmptyReceipt } from "./receipt-defaults";
import type { ReceiptData } from "./receipt-types";
import { RECEIPT_PAYMENT_METHODS } from "./receipt-types";

export const RECEIPT_LIBRARY_KEY = "atl-receipt-library-v1";
const MAX_SAVED_RECEIPTS = 50;
export const MAX_RECEIPT_BACKUP_BYTES = 4 * 1024 * 1024;
type ProfileKeys = "businessName" | "businessContact" | "businessAddress" | "businessLogoDataUrl";
export type ReceiptProfile = Pick<ReceiptData, ProfileKeys>;
export type SavedReceipt = { id: string; updatedAt: string; fields: Omit<ReceiptData, ProfileKeys> };
export type ReceiptLibrary = {
  kind: "accountingtoolslab-receipts";
  version: 1;
  activeId: string;
  lastNumber: string;
  profile: ReceiptProfile;
  receipts: SavedReceipt[];
};

export function emptyReceiptLibrary(): ReceiptLibrary {
  return { kind: "accountingtoolslab-receipts", version: 1, activeId: "", lastNumber: "", profile: { businessName: "", businessContact: "", businessAddress: "" }, receipts: [] };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, limit = 2000): string {
  if (typeof value !== "string" || value.length > limit) throw new Error("This receipt backup contains an invalid field.");
  return value;
}

function profileFrom(value: unknown): ReceiptProfile {
  if (!record(value)) throw new Error("Business details are missing from this backup.");
  const logo = value.businessLogoDataUrl;
  if (logo !== undefined && (typeof logo !== "string" || logo.length > Math.ceil(INVOICE_LOGO_MAX_DATA_URL_BYTES * 4 / 3) + 128 || !/^data:image\/(png|jpeg);base64,[a-z0-9+/]+={0,2}$/i.test(logo))) {
    throw new Error("The backup contains an invalid or oversized logo.");
  }
  return { businessName: text(value.businessName, 120), businessContact: text(value.businessContact, 160), businessAddress: text(value.businessAddress, 500), businessLogoDataUrl: logo as string | undefined };
}

/** Restore only recognised fields; receipt-specific payment metadata never enters invoice storage. */
function receiptFieldsFrom(value: unknown): SavedReceipt["fields"] {
  if (!record(value) || !Array.isArray(value.items) || value.items.length < 1 || value.items.length > 100 || !Array.isArray(value.tax) || value.tax.length > 20) throw new Error("This receipt backup has invalid items or taxes.");
  if (typeof value.currency !== "string" || !isCurrencyCode(value.currency) || !RECEIPT_PAYMENT_METHODS.some(method => method.id === value.paymentMethod)) throw new Error("This receipt backup has an invalid currency or payment method.");
  const items = value.items.map(item => {
    if (!record(item)) throw new Error("Invalid receipt item.");
    return { id: text(item.id, 120), description: text(item.description, 180), quantity: text(item.quantity, 100), unitPrice: text(item.unitPrice, 100) };
  });
  const tax = value.tax.map(row => {
    if (!record(row) || typeof row.enabled !== "boolean" || !["percentage", "fixed"].includes(String(row.type))) throw new Error("Invalid receipt tax.");
    return { id: text(row.id, 120), enabled: row.enabled, label: text(row.label, 80), type: row.type as "percentage" | "fixed", value: text(row.value, 100) };
  });
  if (!record(value.discount) || typeof value.discount.enabled !== "boolean" || !["percentage", "fixed"].includes(String(value.discount.type)) || !record(value.shipping) || typeof value.shipping.enabled !== "boolean") throw new Error("Invalid receipt totals.");
  const discount = { enabled: value.discount.enabled, label: text(value.discount.label, 80), type: value.discount.type as "percentage" | "fixed", value: text(value.discount.value, 100) };
  const shipping = { enabled: value.shipping.enabled, label: text(value.shipping.label, 80), amount: text(value.shipping.amount, 100) };
  return {
    receivedFrom: text(value.receivedFrom, 120), receivedFromContact: text(value.receivedFromContact, 160), receivedFromAddress: text(value.receivedFromAddress, 500),
    receiptNumber: text(value.receiptNumber, 60), receiptDate: text(value.receiptDate, 40), invoiceReference: text(value.invoiceReference, 60),
    paymentMethod: value.paymentMethod as ReceiptData["paymentMethod"], paymentMethodOther: text(value.paymentMethodOther, 160), currency: value.currency,
    items, tax, discount, shipping, notes: text(value.notes, 800)
  };
}

export function parseReceiptBackup(raw: string): ReceiptLibrary {
  if (new TextEncoder().encode(raw).byteLength > MAX_RECEIPT_BACKUP_BYTES) throw new Error("Receipt backups must be 4MB or smaller.");
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("Choose a valid .json file from Export backup in My receipts."); }
  if (!record(value) || value.kind !== "accountingtoolslab-receipts" || value.version !== 1 || !Array.isArray(value.receipts)) throw new Error("Choose a receipt backup from My receipts. Invoice backups cannot be restored here.");
  if (value.receipts.length > MAX_SAVED_RECEIPTS) throw new Error("A backup can contain up to 50 receipts.");
  const ids = new Set<string>();
  const receipts = value.receipts.map(entry => {
    if (!record(entry)) throw new Error("Invalid saved receipt.");
    const id = text(entry.id, 120);
    const updatedAt = text(entry.updatedAt, 40);
    if (!id || ids.has(id) || !Number.isFinite(Date.parse(updatedAt))) throw new Error("This backup contains invalid receipt identifiers or dates.");
    ids.add(id);
    return { id, updatedAt, fields: receiptFieldsFrom(entry.fields) };
  });
  const activeId = text(value.activeId, 120);
  return { kind: "accountingtoolslab-receipts", version: 1, profile: profileFrom(value.profile), lastNumber: text(value.lastNumber, 60), activeId: ids.has(activeId) ? activeId : receipts[0]?.id ?? "", receipts };
}

export function receiptFromLibrary(library: ReceiptLibrary, id = library.activeId): ReceiptData | null {
  const saved = library.receipts.find(entry => entry.id === id);
  return saved ? structuredClone({ ...library.profile, ...saved.fields, tax: saved.fields.tax.filter(row => row.enabled) }) : null;
}

export function saveReceipt(library: ReceiptLibrary, id: string, receipt: ReceiptData, now = new Date()): ReceiptLibrary {
  if (!library.receipts.some(entry => entry.id === id) && library.receipts.length >= MAX_SAVED_RECEIPTS) throw new Error("You have 50 saved receipts. Export a backup, then delete a receipt to make room.");
  const { businessName, businessContact, businessAddress, businessLogoDataUrl, ...fields } = receipt;
  return { ...library, activeId: id, profile: { businessName, businessContact, businessAddress, businessLogoDataUrl }, receipts: [{ id, updatedAt: now.toISOString(), fields: structuredClone({ ...fields, tax: fields.tax.filter(row => row.enabled) }) }, ...library.receipts.filter(entry => entry.id !== id)] };
}

export function nextReceipt(library: ReceiptLibrary, currency: string, duplicateId?: string): ReceiptData {
  const previous = receiptFromLibrary(library, duplicateId ?? library.activeId);
  const receipt = duplicateId && previous ? previous : { ...createEmptyReceipt(), ...library.profile, currency };
  let previousNumber = previous?.receiptNumber || library.lastNumber;
  const previousParts = previousNumber.match(/^(.*?)(\d+)$/);
  const lastParts = library.lastNumber.match(/^(.*?)(\d+)$/);
  if (previousParts && lastParts && previousParts[1] === lastParts[1] && Number(lastParts[2]) > Number(previousParts[2])) previousNumber = library.lastNumber;
  let number = getNextInvoiceNumber(previousNumber) || "REC-001";
  const used = new Set(library.receipts.map(entry => entry.fields.receiptNumber));
  while (used.has(number)) number = getNextInvoiceNumber(number) || "REC-001";
  return { ...receipt, tax: receipt.tax.filter(row => row.enabled), receiptNumber: number };
}

/** Preserve existing records. Conflicting IDs become separate receipts rather than overwriting a draft. */
export function mergeReceiptBackup(current: ReceiptLibrary, incoming: ReceiptLibrary, createId: () => string): ReceiptLibrary {
  const only = current.receipts.length === 1 ? current.receipts[0] : null;
  const fields = only?.fields;
  const isInitialBlank = fields && fields.receiptNumber === "REC-001" && fields.receiptDate === createEmptyReceipt().receiptDate &&
    !fields.receivedFrom && !fields.receivedFromContact && !fields.receivedFromAddress && !fields.notes && !fields.invoiceReference &&
    fields.paymentMethod === "cash" && !fields.paymentMethodOther && !fields.discount.enabled && !fields.shipping.enabled && !fields.tax.some(row => row.enabled) &&
    fields.items.length === 1 && !fields.items[0].description && !fields.items[0].unitPrice && fields.items[0].quantity === "1";
  const receipts = incoming.receipts.length && isInitialBlank ? [] : [...current.receipts];
  let activeId = current.activeId;
  for (const entry of incoming.receipts) {
    const same = receipts.find(saved => saved.id === entry.id);
    if (same && JSON.stringify(receiptFieldsFrom(same.fields)) === JSON.stringify(receiptFieldsFrom(entry.fields))) {
      if (entry.id === incoming.activeId) activeId = same.id;
      continue;
    }
    const id = same ? createId() : entry.id;
    receipts.push(structuredClone({ ...entry, id }));
    if (entry.id === incoming.activeId) activeId = id;
  }
  if (receipts.length > MAX_SAVED_RECEIPTS) throw new Error("Restoring this backup would exceed 50 receipts. Remove some saved receipts first.");
  return recordReceiptNumber({ ...current, activeId, profile: Object.values(current.profile).some(Boolean) ? current.profile : incoming.profile, receipts }, incoming.lastNumber || current.lastNumber);
}

export function writeReceiptLibrary(storage: Pick<Storage, "setItem"> | null, library: ReceiptLibrary): string {
  if (!storage) return "Saving is unavailable in this browser. You can still download PDFs and export a backup.";
  try {
    const raw = JSON.stringify(library);
    parseReceiptBackup(raw);
    storage.setItem(RECEIPT_LIBRARY_KEY, raw);
    return "";
  } catch { return "Receipts could not be saved. Browser storage may be full or blocked. Export a backup to keep your work."; }
}

/** Keep the sequence from moving backwards when an older receipt is previewed again. */
export function recordReceiptNumber(library: ReceiptLibrary, number: string): ReceiptLibrary {
  const previous = library.lastNumber.match(/^(.*?)(\d+)$/);
  const next = number.match(/^(.*?)(\d+)$/);
  const lastNumber = previous && next && previous[1] === next[1] && Number(previous[2]) > Number(next[2]) ? library.lastNumber : number;
  return { ...library, lastNumber };
}
