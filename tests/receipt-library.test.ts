import assert from "node:assert/strict";
import { createEmptyReceipt } from "../lib/receipt/receipt-defaults";
import { emptyReceiptLibrary, MAX_RECEIPT_BACKUP_BYTES, mergeReceiptBackup, nextReceipt, parseReceiptBackup, RECEIPT_LIBRARY_KEY, receiptFromLibrary, recordReceiptNumber, saveReceipt, writeReceiptLibrary } from "../lib/receipt/receipt-library";

function test(name: string, run: () => void) { run(); console.log(`PASS ${name}`); }
const logo = "data:image/png;base64,aGVsbG8=";
const receipt = { ...createEmptyReceipt(), businessName: "Example Studio", businessLogoDataUrl: logo, receivedFrom: "Example Client", receiptNumber: "REC-009", invoiceReference: "INV-041", paymentMethod: "other" as const, paymentMethodOther: "Payment voucher", currency: "SGD", items: [{ id: "item-1", description: "Services", quantity: "2", unitPrice: "150.50" }] };
const library = saveReceipt(emptyReceiptLibrary(), "receipt-1", receipt);

test("receipt backup restores payment metadata, currency, logo, and line items", () => {
  const restored = receiptFromLibrary(parseReceiptBackup(JSON.stringify(library)))!;
  assert.equal(restored.paymentMethod, "other");
  assert.equal(restored.paymentMethodOther, "Payment voucher");
  assert.equal(restored.invoiceReference, "INV-041");
  assert.equal(restored.currency, "SGD");
  assert.equal(restored.businessLogoDataUrl, logo);
  assert.deepEqual(restored.items, receipt.items);
});
test("new receipt retains business details, clears customer and payment details, and advances number", () => {
  const next = nextReceipt(library, "MYR");
  assert.equal(next.receiptNumber, "REC-010");
  assert.equal(next.businessName, receipt.businessName);
  assert.equal(next.businessLogoDataUrl, logo);
  assert.equal(next.receivedFrom, "");
  assert.equal(next.invoiceReference, "");
  assert.equal(next.paymentMethod, "cash");
  assert.equal(next.currency, "MYR");
});
test("duplicate receipt copies customer, items, payment method, and currency under a new number", () => {
  const duplicate = nextReceipt(library, "MYR", "receipt-1");
  assert.equal(duplicate.receiptNumber, "REC-010");
  assert.equal(duplicate.currency, "SGD");
  assert.equal(duplicate.receivedFrom, receipt.receivedFrom);
  assert.equal(duplicate.paymentMethodOther, receipt.paymentMethodOther);
  duplicate.items[0].unitPrice = "1";
  assert.equal(library.receipts[0].fields.items[0].unitPrice, "150.50");
});
test("saved receipts and loaded drafts do not alias mutable editor rows", () => {
  const loaded = receiptFromLibrary(library)!;
  loaded.items[0].description = "Changed";
  assert.equal(receiptFromLibrary(library)!.items[0].description, "Services");
});
test("receipt sequence skips existing numbers", () => {
  const two = saveReceipt(library, "receipt-2", { ...receipt, receiptNumber: "REC-010" });
  assert.equal(nextReceipt({ ...two, activeId: "receipt-1" }, "MYR").receiptNumber, "REC-011");
});
test("resetting a draft and previewing an older receipt cannot regress the used sequence", () => {
  const used = recordReceiptNumber(library, "REC-020");
  const oldPreview = recordReceiptNumber(used, "REC-009");
  const reset = saveReceipt(oldPreview, "receipt-1", createEmptyReceipt());
  assert.equal(nextReceipt(reset, "MYR").receiptNumber, "REC-021");
});
test("receipt storage uses its own key and cannot modify invoice records", () => {
  const values = new Map([["atl-invoice-index", "existing invoices"]]);
  assert.equal(writeReceiptLibrary({ setItem: (key, value) => { values.set(key, value); } }, library), "");
  assert.equal(values.get("atl-invoice-index"), "existing invoices");
  assert.equal(parseReceiptBackup(values.get(RECEIPT_LIBRARY_KEY)!).receipts.length, 1);
});
test("blocked storage reports a recoverable error", () => {
  assert.match(writeReceiptLibrary(null, library), /unavailable/);
  assert.match(writeReceiptLibrary({ setItem: () => { throw new Error("QuotaExceededError"); } }, library), /full or blocked/);
});
test("malformed, invoice, and unsupported-version backups are rejected", () => {
  assert.throws(() => parseReceiptBackup("not json"), /valid/);
  assert.throws(() => parseReceiptBackup(JSON.stringify({ version: 1, invoices: [] })), /Invoice backups/);
  assert.throws(() => parseReceiptBackup(JSON.stringify({ ...library, version: 2 })), /receipt backup/);
});
test("oversized backups and invalid images are rejected", () => {
  assert.throws(() => parseReceiptBackup(" ".repeat(MAX_RECEIPT_BACKUP_BYTES + 1)), /4MB/);
  assert.throws(() => parseReceiptBackup(JSON.stringify({ ...library, profile: { ...library.profile, businessLogoDataUrl: "https://example.com/logo.png" } })), /invalid or oversized logo/);
});
test("invalid methods, duplicate IDs, excessive entries, and invalid dates are rejected", () => {
  const invalid = structuredClone(library);
  (invalid.receipts[0].fields as unknown as { paymentMethod: string }).paymentMethod = "invalid";
  assert.throws(() => parseReceiptBackup(JSON.stringify(invalid)), /payment method/);
  assert.throws(() => parseReceiptBackup(JSON.stringify({ ...library, receipts: [library.receipts[0], library.receipts[0]] })), /identifiers/);
  assert.throws(() => parseReceiptBackup(JSON.stringify({ ...library, receipts: Array(51).fill(library.receipts[0]) })), /50 receipts/);
  assert.throws(() => parseReceiptBackup(JSON.stringify({ ...library, receipts: [{ ...library.receipts[0], updatedAt: "invalid" }] })), /dates/);
});
test("restore preserves existing receipts, resolves conflicting IDs, and selects the restored receipt", () => {
  const incoming = saveReceipt(emptyReceiptLibrary(), "receipt-1", { ...receipt, receivedFrom: "Different Client" });
  const merged = mergeReceiptBackup(library, incoming, () => "receipt-imported");
  assert.equal(merged.receipts.length, 2);
  assert.equal(merged.activeId, "receipt-imported");
  assert.equal(receiptFromLibrary(merged, "receipt-1")!.receivedFrom, "Example Client");
  assert.equal(receiptFromLibrary(merged)!.receivedFrom, "Different Client");
});
test("restoring the same backup twice does not duplicate matching records", () => {
  assert.equal(mergeReceiptBackup(library, library, () => "unused").receipts.length, 1);
});
test("a fresh browser adopts restored business details, even with an empty draft", () => {
  const fresh = saveReceipt(emptyReceiptLibrary(), "blank", createEmptyReceipt());
  const restored = mergeReceiptBackup(fresh, library, () => "new");
  assert.equal(restored.profile.businessName, "Example Studio");
  assert.equal(restored.profile.businessLogoDataUrl, logo);
});
test("receipt library limit rejects additions without changing existing data", () => {
  const full = { ...library, receipts: Array.from({ length: 50 }, (_, index) => ({ ...library.receipts[0], id: `receipt-${index}` })) };
  assert.throws(() => saveReceipt(full, "new", receipt), /50 saved receipts/);
  assert.equal(full.receipts.length, 50);
  assert.equal(saveReceipt(full, "receipt-0", receipt).receipts.length, 50);
  assert.throws(() => mergeReceiptBackup(full, saveReceipt(emptyReceiptLibrary(), "extra", receipt), () => "new"), /exceed 50/);
});

test("restoring an exported blank draft ignores JSON property order and preserves empty values", () => {
  const blank = createEmptyReceipt();
  blank.discount.value = "";
  let original = saveReceipt(emptyReceiptLibrary(), "blank-receipt", blank);
  original = saveReceipt(original, "filled-receipt", receipt);
  const incoming = parseReceiptBackup(JSON.stringify(original));
  const merged = mergeReceiptBackup(original, incoming, () => "must-not-duplicate");
  assert.equal(merged.receipts.length, 2);
  assert.equal(receiptFromLibrary(merged, "blank-receipt")!.discount.value, "");
});
test("disabled default tax rows stay hidden until the user adds a tax", () => {
  const saved = saveReceipt(emptyReceiptLibrary(), "blank-receipt", createEmptyReceipt());
  assert.deepEqual(receiptFromLibrary(saved)!.tax, []);
  assert.deepEqual(nextReceipt(saved, "MYR").tax, []);
});

test("a full 50-receipt backup restores into a fresh browser without its initial blank draft using a slot", () => {
  const fresh = saveReceipt(emptyReceiptLibrary(), "blank", createEmptyReceipt());
  const full = { ...library, receipts: Array.from({ length: 50 }, (_, index) => ({ ...library.receipts[0], id: `restored-${index}` })), activeId: "restored-0" };
  const restored = mergeReceiptBackup(fresh, full, () => "unused");
  assert.equal(restored.receipts.length, 50);
  assert.equal(restored.activeId, "restored-0");
});
