import assert from "node:assert/strict";
import {
  ATL_BUSINESS_PROFILE_KEY,
  ATL_INVOICE_INDEX_KEY,
  ATL_INVOICE_LIBRARY_VERSION,
  ATL_MAX_SAVED_INVOICES,
  EMPTY_BUSINESS_PROFILE,
  createInvoiceId,
  deleteInvoice,
  exportAllData,
  getInvoiceLabel,
  importAllData,
  listInvoices,
  loadBusinessProfile,
  loadInvoice,
  loadInvoiceIndex,
  mergeInvoice,
  migrateLegacyDraft,
  saveBusinessProfile,
  saveInvoice,
  splitInvoice,
  type SavedInvoiceFields
} from "../lib/invoice/invoice-library";
import { ATL_INVOICE_DRAFT_KEY } from "../lib/invoice/invoice-storage";
import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  DEFAULT_INVOICE_TAX,
  type InvoiceData
} from "../lib/invoice/invoice-types";

type TestStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

type TestGlobal = typeof globalThis & {
  window?: { localStorage: TestStorage };
};

function test(name: string, run: () => void) {
  Reflect.deleteProperty(globalThis as TestGlobal, "window");
  run();
  Reflect.deleteProperty(globalThis as TestGlobal, "window");
  console.log(`PASS ${name}`);
}

function createStorage(initialEntries: Record<string, string> = {}): {
  entries: Record<string, string>;
  storage: TestStorage;
} {
  const entries = { ...initialEntries };

  return {
    entries,
    storage: {
      getItem: (key) => entries[key] ?? null,
      setItem: (key, value) => {
        entries[key] = value;
      },
      removeItem: (key) => {
        delete entries[key];
      }
    }
  };
}

/** Storage that refuses writes the way a browser does when it is full. */
function createFullStorage(): TestStorage {
  const base = createStorage().storage;

  return {
    ...base,
    setItem: () => {
      const error = new Error("The quota has been exceeded.");
      error.name = "QuotaExceededError";
      throw error;
    }
  };
}

function installStorage(storage: TestStorage) {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage }
  });
}

function createFields(overrides: Partial<SavedInvoiceFields> = {}): SavedInvoiceFields {
  return {
    invoiceNumber: "INV-0042",
    invoiceDate: "2026-05-12",
    dueDate: "2026-05-26",
    currency: "MYR",
    customerName: "Example Customer",
    customerContact: "customer@example.com",
    customerAddress: "Kuala Lumpur",
    items: [{ id: "item-1", description: "Consultation", quantity: "2", unitPrice: "600" }],
    discount: { ...DEFAULT_INVOICE_DISCOUNT },
    tax: [{ ...DEFAULT_INVOICE_TAX }],
    shipping: undefined,
    notes: "",
    ...overrides
  };
}

function createInvoiceData(): InvoiceData {
  return {
    businessName: "Accounting Tools Lab",
    businessContact: "+60 3-1234 5678",
    businessAddress: "Kuala Lumpur",
    businessLogoDataUrl: "data:image/png;base64,AAAA",
    payment: { ...DEFAULT_INVOICE_PAYMENT_DETAILS, bankName: "Maybank" },
    terms: "Pay within 14 days.",
    ...createFields()
  };
}

// --- split / merge ---------------------------------------------------------

test("splitInvoice separates business details from invoice details", () => {
  const { fields, profile } = splitInvoice(createInvoiceData());

  assert.equal(profile.businessName, "Accounting Tools Lab");
  assert.equal(profile.payment.bankName, "Maybank");
  assert.equal(fields.customerName, "Example Customer");
  assert.equal("businessName" in fields, false);
});

test("mergeInvoice rebuilds the editor shape from both halves", () => {
  const original = createInvoiceData();
  const { fields, profile } = splitInvoice(original);

  assert.deepEqual(mergeInvoice(profile, fields), original);
});

test("splitInvoice copies nested values instead of sharing them", () => {
  const original = createInvoiceData();
  const { fields } = splitInvoice(original);

  fields.items[0].description = "Changed";

  assert.equal(original.items[0].description, "Consultation");
});

// --- labels ----------------------------------------------------------------

test("getInvoiceLabel prefers the invoice number", () => {
  assert.equal(getInvoiceLabel({ invoiceNumber: "INV-1", customerName: "Ali" }), "INV-1");
});

test("getInvoiceLabel falls back to the customer name", () => {
  assert.equal(getInvoiceLabel({ invoiceNumber: "  ", customerName: "Ali" }), "Ali");
});

test("getInvoiceLabel falls back to Untitled invoice", () => {
  assert.equal(getInvoiceLabel({ invoiceNumber: "", customerName: "" }), "Untitled invoice");
});

// --- business profile ------------------------------------------------------

test("loadBusinessProfile returns null without storage", () => {
  assert.equal(loadBusinessProfile(), null);
});

test("business profile round-trips including the logo", () => {
  installStorage(createStorage().storage);

  const profile = splitInvoice(createInvoiceData()).profile;
  assert.deepEqual(saveBusinessProfile(profile), { ok: true });

  const loaded = loadBusinessProfile();
  assert.equal(loaded?.businessName, "Accounting Tools Lab");
  assert.equal(loaded?.businessLogoDataUrl, "data:image/png;base64,AAAA");
  assert.equal(loaded?.payment.bankName, "Maybank");
});

test("business profile drops a logo that is not an image data url", () => {
  installStorage(createStorage().storage);

  saveBusinessProfile({ ...EMPTY_BUSINESS_PROFILE, businessLogoDataUrl: "javascript:alert(1)" });

  assert.equal(loadBusinessProfile()?.businessLogoDataUrl, undefined);
});

test("loadBusinessProfile ignores an unsupported version", () => {
  installStorage(
    createStorage({
      [ATL_BUSINESS_PROFILE_KEY]: JSON.stringify({
        version: ATL_INVOICE_LIBRARY_VERSION + 1,
        profile: {}
      })
    }).storage
  );

  assert.equal(loadBusinessProfile(), null);
});

// --- saving and listing ----------------------------------------------------

test("saveInvoice stores the invoice and an index row", () => {
  const { entries, storage } = createStorage();
  installStorage(storage);

  const id = createInvoiceId();
  assert.deepEqual(saveInvoice(id, createFields()), { ok: true });

  const index = loadInvoiceIndex();
  assert.equal(index.length, 1);
  assert.equal(index[0].id, id);
  assert.equal(index[0].invoiceNumber, "INV-0042");
  assert.equal(index[0].customerName, "Example Customer");
  assert.equal(index[0].total, 1200);
  assert.equal(typeof entries[ATL_INVOICE_INDEX_KEY], "string");
});

test("saveInvoice updates an existing row instead of adding a second", () => {
  installStorage(createStorage().storage);

  const id = createInvoiceId();
  saveInvoice(id, createFields());
  saveInvoice(id, createFields({ customerName: "New Customer" }));

  const index = loadInvoiceIndex();
  assert.equal(index.length, 1);
  assert.equal(index[0].customerName, "New Customer");
});

test("loadInvoice returns the saved fields", () => {
  installStorage(createStorage().storage);

  const id = createInvoiceId();
  saveInvoice(id, createFields());

  assert.equal(loadInvoice(id)?.customerName, "Example Customer");
});

test("loadInvoice returns null for an unknown id", () => {
  installStorage(createStorage().storage);

  assert.equal(loadInvoice("missing"), null);
});

test("listInvoices returns newest first", () => {
  installStorage(createStorage().storage);

  const older = createInvoiceId();
  const newer = createInvoiceId();
  saveInvoice(older, createFields({ customerName: "Older" }));
  saveInvoice(newer, createFields({ customerName: "Newer" }));

  const listed = listInvoices();
  assert.equal(listed.length, 2);
  assert.ok(listed[0].updatedAt >= listed[1].updatedAt);
});

test("deleteInvoice removes the invoice and its index row", () => {
  installStorage(createStorage().storage);

  const id = createInvoiceId();
  saveInvoice(id, createFields());

  assert.deepEqual(deleteInvoice(id), { ok: true });
  assert.equal(loadInvoice(id), null);
  assert.equal(loadInvoiceIndex().length, 0);
});

test("deleteInvoice reports a missing invoice", () => {
  installStorage(createStorage().storage);

  const result = deleteInvoice("missing");
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "not-found");
});

// --- limits and failures ---------------------------------------------------

test("saveInvoice blocks a new invoice past the limit", () => {
  installStorage(createStorage().storage);

  for (let i = 0; i < ATL_MAX_SAVED_INVOICES; i += 1) {
    assert.deepEqual(saveInvoice(createInvoiceId(), createFields()), { ok: true });
  }

  const result = saveInvoice(createInvoiceId(), createFields());
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "limit");
});

test("saveInvoice still updates an existing invoice at the limit", () => {
  installStorage(createStorage().storage);

  const first = createInvoiceId();
  saveInvoice(first, createFields());

  for (let i = 1; i < ATL_MAX_SAVED_INVOICES; i += 1) {
    saveInvoice(createInvoiceId(), createFields());
  }

  assert.deepEqual(saveInvoice(first, createFields({ customerName: "Edited" })), { ok: true });
});

test("saveInvoice reports a full browser store", () => {
  installStorage(createFullStorage());

  const result = saveInvoice(createInvoiceId(), createFields());
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "quota");
});

test("saveInvoice reports unavailable storage", () => {
  const result = saveInvoice("id", createFields());
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "unavailable");
});

// --- migration -------------------------------------------------------------

test("migrateLegacyDraft moves the old draft into the library", () => {
  const { entries, storage } = createStorage({
    [ATL_INVOICE_DRAFT_KEY]: JSON.stringify({
      version: 1,
      savedAt: "2026-05-08T00:00:00.000Z",
      invoice: createInvoiceData()
    })
  });
  installStorage(storage);

  const outcome = migrateLegacyDraft();

  assert.equal(outcome.migrated, true);
  assert.equal(loadInvoiceIndex().length, 1);
  assert.equal(loadBusinessProfile()?.businessName, "Accounting Tools Lab");
  assert.equal(outcome.migrated === true && loadInvoice(outcome.id)?.customerName, "Example Customer");
  // The old key must survive: nothing reads the library yet.
  assert.equal(typeof entries[ATL_INVOICE_DRAFT_KEY], "string");
});

test("migrateLegacyDraft does nothing when there is no old draft", () => {
  installStorage(createStorage().storage);

  assert.deepEqual(migrateLegacyDraft(), { migrated: false, reason: "nothing-to-migrate" });
});

test("migrateLegacyDraft does not run twice", () => {
  installStorage(
    createStorage({
      [ATL_INVOICE_DRAFT_KEY]: JSON.stringify({
        version: 1,
        savedAt: "2026-05-08T00:00:00.000Z",
        invoice: createInvoiceData()
      })
    }).storage
  );

  assert.equal(migrateLegacyDraft().migrated, true);
  assert.deepEqual(migrateLegacyDraft(), { migrated: false, reason: "already-migrated" });
  assert.equal(loadInvoiceIndex().length, 1);
});

test("migrateLegacyDraft ignores a corrupt old draft", () => {
  installStorage(createStorage({ [ATL_INVOICE_DRAFT_KEY]: "not json" }).storage);

  assert.deepEqual(migrateLegacyDraft(), { migrated: false, reason: "nothing-to-migrate" });
});

// --- export / import -------------------------------------------------------

test("exportAllData includes the profile and every invoice", () => {
  installStorage(createStorage().storage);

  saveBusinessProfile(splitInvoice(createInvoiceData()).profile);
  saveInvoice(createInvoiceId(), createFields());
  saveInvoice(createInvoiceId(), createFields({ customerName: "Second" }));

  const exported = exportAllData();

  assert.equal(exported.version, ATL_INVOICE_LIBRARY_VERSION);
  assert.equal(exported.profile?.businessName, "Accounting Tools Lab");
  assert.equal(exported.invoices.length, 2);
});

test("importAllData restores invoices into an empty browser", () => {
  installStorage(createStorage().storage);
  saveBusinessProfile(splitInvoice(createInvoiceData()).profile);
  saveInvoice(createInvoiceId(), createFields());
  const exported = exportAllData();

  installStorage(createStorage().storage);
  assert.deepEqual(importAllData(exported), { ok: true });

  assert.equal(loadInvoiceIndex().length, 1);
  assert.equal(loadBusinessProfile()?.businessName, "Accounting Tools Lab");
});

test("importAllData adds to existing invoices rather than replacing them", () => {
  installStorage(createStorage().storage);
  saveInvoice(createInvoiceId(), createFields());
  const exported = exportAllData();

  importAllData(exported);

  assert.equal(loadInvoiceIndex().length, 2);
});

test("importAllData rejects a file that is not a backup", () => {
  installStorage(createStorage().storage);

  const result = importAllData({ nope: true });
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.reason, "error");
});
