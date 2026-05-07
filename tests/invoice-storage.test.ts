import assert from "node:assert/strict";
import {
  ATL_INVOICE_DRAFT_KEY,
  ATL_INVOICE_DRAFT_VERSION,
  clearInvoiceDraft,
  loadInvoiceDraft,
  saveInvoiceDraft
} from "../lib/invoice/invoice-storage";
import type { InvoiceData } from "../lib/invoice/invoice-types";

type TestStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

type TestGlobal = typeof globalThis & {
  window?: {
    localStorage: TestStorage;
  };
};

function test(name: string, run: () => void) {
  Reflect.deleteProperty(globalThis as TestGlobal, "window");
  run();
  Reflect.deleteProperty(globalThis as TestGlobal, "window");
  console.log(`PASS ${name}`);
}

function createInvoice(overrides: Partial<InvoiceData> = {}): InvoiceData {
  const baseInvoice: InvoiceData = {
    businessName: "Bright Ledger Studio",
    businessContact: "",
    businessAddress: "",
    customerName: "Acme Trading Co.",
    customerContact: "",
    customerAddress: "",
    invoiceNumber: "INV-001",
    invoiceDate: "2026-05-08",
    dueDate: "",
    currency: "MYR",
    items: [
      {
        id: "item-1",
        description: "Consulting",
        quantity: "2",
        unitPrice: "100"
      }
    ],
    discount: {
      enabled: false,
      type: "percentage",
      value: "0"
    },
    tax: {
      enabled: false,
      rate: "0"
    },
    paymentDetails: "",
    notes: ""
  };

  return {
    ...baseInvoice,
    ...overrides,
    discount: {
      ...baseInvoice.discount,
      ...overrides.discount
    },
    tax: {
      ...baseInvoice.tax,
      ...overrides.tax
    },
    items: overrides.items ?? baseInvoice.items
  };
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

function installStorage(storage: TestStorage) {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: storage
    }
  });
}

test("loadInvoiceDraft returns null when localStorage is unavailable", () => {
  assert.equal(loadInvoiceDraft(), null);
});

test("loadInvoiceDraft returns null for missing draft", () => {
  installStorage(createStorage().storage);

  assert.equal(loadInvoiceDraft(), null);
});

test("loadInvoiceDraft returns null for invalid JSON", () => {
  installStorage(createStorage({ [ATL_INVOICE_DRAFT_KEY]: "not json" }).storage);

  assert.equal(loadInvoiceDraft(), null);
});

test("loadInvoiceDraft returns null for unsupported version", () => {
  installStorage(
    createStorage({
      [ATL_INVOICE_DRAFT_KEY]: JSON.stringify({
        version: ATL_INVOICE_DRAFT_VERSION + 1,
        savedAt: "2026-05-08T00:00:00.000Z",
        invoice: createInvoice()
      })
    }).storage
  );

  assert.equal(loadInvoiceDraft(), null);
});

test("saveInvoiceDraft saves a valid draft payload", () => {
  const { entries, storage } = createStorage();
  installStorage(storage);

  const result = saveInvoiceDraft(createInvoice());

  assert.deepEqual(result, { ok: true });
  assert.equal(typeof entries[ATL_INVOICE_DRAFT_KEY], "string");
});

test("saved payload includes version, savedAt, and invoice", () => {
  const { entries, storage } = createStorage();
  const invoice = createInvoice({ invoiceNumber: "INV-900" });
  installStorage(storage);

  saveInvoiceDraft(invoice);
  const payload = JSON.parse(entries[ATL_INVOICE_DRAFT_KEY]);

  assert.equal(payload.version, ATL_INVOICE_DRAFT_VERSION);
  assert.equal(typeof payload.savedAt, "string");
  assert.deepEqual(payload.invoice, invoice);
});

test("clearInvoiceDraft removes the draft", () => {
  const { entries, storage } = createStorage({ [ATL_INVOICE_DRAFT_KEY]: "draft" });
  installStorage(storage);

  const result = clearInvoiceDraft();

  assert.deepEqual(result, { ok: true });
  assert.equal(entries[ATL_INVOICE_DRAFT_KEY], undefined);
});

test("storage helper does not throw when localStorage methods throw", () => {
  const throwingStorage: TestStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    }
  };
  installStorage(throwingStorage);

  assert.doesNotThrow(() => loadInvoiceDraft());
  assert.doesNotThrow(() => saveInvoiceDraft(createInvoice()));
  assert.doesNotThrow(() => clearInvoiceDraft());
});

test("storage helper handles quota and security errors gracefully", () => {
  const quotaStorage: TestStorage = {
    getItem: () => null,
    setItem: () => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    },
    removeItem: () => {
      throw new DOMException("Blocked", "SecurityError");
    }
  };
  installStorage(quotaStorage);

  assert.equal(saveInvoiceDraft(createInvoice()).ok, false);
  assert.equal(clearInvoiceDraft().ok, false);
});
