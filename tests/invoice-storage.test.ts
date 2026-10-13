import assert from "node:assert/strict";
import {
  ATL_INVOICE_DRAFT_KEY,
  ATL_INVOICE_LAST_NUMBER_KEY,
  clearInvoiceDraft,
  loadLastInvoiceNumber,
  normalizeInvoice,
  saveLastInvoiceNumber
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

type InvoiceTaxOverride = Partial<InvoiceData["tax"][number]>;
type InvoiceTestOverrides = Partial<Omit<InvoiceData, "discount" | "payment" | "shipping" | "tax">> & {
  discount?: Partial<InvoiceData["discount"]>;
  payment?: Partial<InvoiceData["payment"]>;
  shipping?: Partial<InvoiceData["shipping"]>;
  tax?: InvoiceTaxOverride | InvoiceTaxOverride[];
};

function createInvoice(overrides: InvoiceTestOverrides = {}): InvoiceData {
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
      label: "Discount",
      type: "percentage",
      value: "0"
    },
    tax: [],
    shipping: {
      enabled: false,
      label: "Shipping",
      amount: "0"
    },
    payment: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      duitNowId: "",
      paymentLink: "",
      notes: ""
    },
    notes: "",
    terms: ""
  };
  const baseShipping = baseInvoice.shipping ?? { enabled: false, label: "Shipping", amount: "0" };
  const taxOverrides = overrides.tax
    ? Array.isArray(overrides.tax)
      ? overrides.tax
      : [overrides.tax]
    : undefined;

  return {
    ...baseInvoice,
    ...overrides,
    discount: {
      ...baseInvoice.discount,
      ...overrides.discount
    },
    tax: taxOverrides
      ? taxOverrides.map((tax, index) => ({
          id: `tax-${index + 1}`,
          enabled: false,
          label: "Tax",
          type: "percentage" as const,
          value: "0",
          ...tax
        }))
      : baseInvoice.tax,
    shipping: {
      enabled: overrides.shipping?.enabled ?? baseShipping.enabled,
      label: overrides.shipping?.label ?? baseShipping.label,
      amount: overrides.shipping?.amount ?? baseShipping.amount
    },
    payment: {
      ...baseInvoice.payment,
      ...overrides.payment
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

test("clearInvoiceDraft removes the draft", () => {
  const { entries, storage } = createStorage({ [ATL_INVOICE_DRAFT_KEY]: "draft" });
  installStorage(storage);

  const result = clearInvoiceDraft();

  assert.deepEqual(result, { ok: true });
  assert.equal(entries[ATL_INVOICE_DRAFT_KEY], undefined);
});

test("clearInvoiceDraft does not clear last used invoice number", () => {
  const { entries, storage } = createStorage({
    [ATL_INVOICE_DRAFT_KEY]: "draft",
    [ATL_INVOICE_LAST_NUMBER_KEY]: "INV-001"
  });
  installStorage(storage);

  assert.deepEqual(clearInvoiceDraft(), { ok: true });
  assert.equal(entries[ATL_INVOICE_DRAFT_KEY], undefined);
  assert.equal(entries[ATL_INVOICE_LAST_NUMBER_KEY], "INV-001");
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

  assert.equal(clearInvoiceDraft().ok, false);
  assert.equal(saveLastInvoiceNumber("INV-001").ok, false);
});

test("loadLastInvoiceNumber returns null when missing", () => {
  installStorage(createStorage().storage);

  assert.equal(loadLastInvoiceNumber(), null);
});

test("saveLastInvoiceNumber saves trimmed invoice number", () => {
  const { entries, storage } = createStorage();
  installStorage(storage);

  assert.deepEqual(saveLastInvoiceNumber("  INV-001  "), { ok: true });
  assert.equal(entries[ATL_INVOICE_LAST_NUMBER_KEY], "INV-001");
});

test("saveLastInvoiceNumber rejects empty invoice number", () => {
  const { entries, storage } = createStorage();
  installStorage(storage);

  assert.equal(saveLastInvoiceNumber("   ").ok, false);
  assert.equal(entries[ATL_INVOICE_LAST_NUMBER_KEY], undefined);
});

test("last invoice number helpers do not throw when localStorage is unavailable", () => {
  assert.doesNotThrow(() => loadLastInvoiceNumber());
  assert.doesNotThrow(() => saveLastInvoiceNumber("INV-001"));
});

test("last invoice number helpers do not throw when localStorage throws", () => {
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

  assert.doesNotThrow(() => loadLastInvoiceNumber());
  assert.doesNotThrow(() => saveLastInvoiceNumber("INV-001"));
});

test("old draft with paymentDetails string migrates to payment notes", () => {
  const storedInvoice = {
    ...createInvoice(),
    payment: undefined,
    paymentDetails: "Use invoice number as reference."
  };

  const normalizedInvoice = normalizeInvoice(storedInvoice);

  assert.equal(normalizedInvoice?.payment.notes, "Use invoice number as reference.");
  assert.equal(normalizedInvoice?.payment.bankName, "");
  assert.equal(normalizedInvoice?.payment.accountName, "");
  assert.equal(normalizedInvoice?.payment.accountNumber, "");
  assert.equal(normalizedInvoice?.payment.duitNowId, "");
  assert.equal(normalizedInvoice?.payment.paymentLink, "");
  assert.equal(normalizedInvoice?.payment.paymentQrDataUrl, undefined);
});

test("old draft missing optional text fields still loads safely", () => {
  const storedInvoice = {
    ...createInvoice(),
    businessContact: undefined,
    businessAddress: undefined,
    customerContact: undefined,
    customerAddress: undefined,
    notes: undefined,
    payment: {
      bankName: undefined,
      accountName: undefined,
      accountNumber: undefined,
      duitNowId: undefined,
      paymentLink: undefined,
      notes: undefined
    }
  };

  const invoice = normalizeInvoice(storedInvoice);

  assert.equal(invoice?.businessContact, "");
  assert.equal(invoice?.businessAddress, "");
  assert.equal(invoice?.customerContact, "");
  assert.equal(invoice?.customerAddress, "");
  assert.equal(invoice?.notes, "");
  assert.deepEqual(invoice?.payment, {
    bankName: "",
    accountName: "",
    accountNumber: "",
    duitNowId: "",
    paymentLink: "",
    notes: "",
    paymentQrDataUrl: undefined
  });
});

test("new draft with structured payment fields loads correctly without persisted QR image", () => {
  const invoice = createInvoice({
    payment: {
      bankName: "Maybank",
      accountName: "Bright Ledger Studio",
      accountNumber: "1234567890",
      duitNowId: "0123456789",
      paymentLink: "https://example.com/pay",
      notes: "Please include invoice number.",
      paymentQrDataUrl: "data:image/png;base64,qr"
    }
  });
  const storedInvoice = invoice;

  assert.deepEqual(normalizeInvoice(storedInvoice)?.payment, {
    ...invoice.payment,
    paymentQrDataUrl: undefined
  });
});

test("normalizeInvoice strips old business logo data URLs", () => {
  const storedInvoice = {
    ...createInvoice(),
    businessLogoDataUrl: "data:image/png;base64,old-logo"
  };

  assert.equal(normalizeInvoice(storedInvoice)?.businessLogoDataUrl, undefined);
});

test("normalizeInvoice strips old payment QR data URLs", () => {
  const storedInvoice = createInvoice({
    payment: {
      paymentQrDataUrl: "data:image/png;base64,old-qr"
    }
  });

  assert.equal(normalizeInvoice(storedInvoice)?.payment.paymentQrDataUrl, undefined);
});

test("missing payment object defaults to empty payment fields", () => {
  const storedInvoice = {
    ...createInvoice(),
    payment: undefined
  };

  assert.deepEqual(normalizeInvoice(storedInvoice)?.payment, {
    bankName: "",
    accountName: "",
    accountNumber: "",
    duitNowId: "",
    paymentLink: "",
    notes: "",
    paymentQrDataUrl: undefined
  });
});

test("malformed payment object does not crash loading", () => {
  const storedInvoice = {
    ...createInvoice(),
    payment: "not an object"
  };

  assert.deepEqual(normalizeInvoice(storedInvoice)?.payment, {
    bankName: "",
    accountName: "",
    accountNumber: "",
    duitNowId: "",
    paymentLink: "",
    notes: "",
    paymentQrDataUrl: undefined
  });
});

test("clearInvoiceDraft removes a draft with structured payment fields", () => {
  const { entries, storage } = createStorage({
    [ATL_INVOICE_DRAFT_KEY]: JSON.stringify({
      version: 1,
      savedAt: "2026-05-08T00:00:00.000Z",
      invoice: createInvoice({ payment: { bankName: "Maybank" } })
    })
  });
  installStorage(storage);

  assert.deepEqual(clearInvoiceDraft(), { ok: true });
  assert.equal(entries[ATL_INVOICE_DRAFT_KEY], undefined);
});

test("old draft without terms loads safely", () => {
  const storedInvoice = {
    ...createInvoice(),
    terms: undefined
  };

  assert.equal(normalizeInvoice(storedInvoice)?.terms, "");
});

test("new draft with terms loads correctly", () => {
  const invoice = createInvoice({ terms: "Payment is due within 30 days." });
  const storedInvoice = invoice;

  assert.equal(normalizeInvoice(storedInvoice)?.terms, invoice.terms);
});

test("missing terms defaults to a safe string", () => {
  const storedInvoice = {
    ...createInvoice(),
    terms: undefined
  };

  assert.equal(typeof normalizeInvoice(storedInvoice)?.terms, "string");
});

test("malformed terms value does not crash loading", () => {
  const storedInvoice = {
    ...createInvoice(),
    terms: { text: "not a string" }
  };

  assert.equal(normalizeInvoice(storedInvoice)?.terms, "");
});

test("clearInvoiceDraft removes a draft with terms", () => {
  const { entries, storage } = createStorage({
    [ATL_INVOICE_DRAFT_KEY]: JSON.stringify({
      version: 1,
      savedAt: "2026-05-08T00:00:00.000Z",
      invoice: createInvoice({ terms: "Payment is due within 30 days." })
    })
  });
  installStorage(storage);

  assert.deepEqual(clearInvoiceDraft(), { ok: true });
  assert.equal(entries[ATL_INVOICE_DRAFT_KEY], undefined);
});

test("old draft without discount loads with discount disabled", () => {
  const storedInvoice = {
    ...createInvoice(),
    discount: undefined
  };

  assert.deepEqual(normalizeInvoice(storedInvoice)?.discount, {
    enabled: false,
    label: "Discount",
    type: "percentage",
    value: "0"
  });
});

test("new draft with percentage discount loads correctly", () => {
  const invoice = createInvoice({
    discount: { enabled: true, type: "percentage", value: "10" }
  });
  const storedInvoice = invoice;

  assert.deepEqual(normalizeInvoice(storedInvoice)?.discount, invoice.discount);
});

test("new draft with fixed discount loads correctly", () => {
  const invoice = createInvoice({
    discount: { enabled: true, type: "fixed", value: "50" }
  });
  const storedInvoice = invoice;

  assert.deepEqual(normalizeInvoice(storedInvoice)?.discount, invoice.discount);
});

test("malformed discount object does not crash loading", () => {
  const storedInvoice = {
    ...createInvoice(),
    discount: "not an object"
  };

  assert.deepEqual(normalizeInvoice(storedInvoice)?.discount, {
    enabled: false,
    label: "Discount",
    type: "percentage",
    value: "0"
  });
});

test("clearInvoiceDraft removes a draft with discount fields", () => {
  const { entries, storage } = createStorage({
    [ATL_INVOICE_DRAFT_KEY]: JSON.stringify({
      version: 1,
      savedAt: "2026-05-08T00:00:00.000Z",
      invoice: createInvoice({ discount: { enabled: true, type: "fixed", value: "50" } })
    })
  });
  installStorage(storage);

  assert.deepEqual(clearInvoiceDraft(), { ok: true });
  assert.equal(entries[ATL_INVOICE_DRAFT_KEY], undefined);
});

test("old draft with single enabled tax migrates to one tax row", () => {
  const storedInvoice = {
    ...createInvoice(),
    tax: {
      enabled: true,
      label: "SST 6%",
      rate: "6",
      type: "percentage"
    }
  };

  assert.deepEqual(normalizeInvoice(storedInvoice)?.tax, [
    {
      id: "tax-1",
      enabled: true,
      label: "Tax",
      type: "percentage",
      value: "6"
    }
  ]);
});

test("new draft with multiple tax rows loads correctly", () => {
  const invoice = createInvoice({
    tax: [
      { id: "tax-sst", enabled: true, label: "SST", type: "percentage", value: "8" },
      { id: "tax-service", enabled: true, label: "Service tax", type: "fixed", value: "25" }
    ]
  });
  const storedInvoice = invoice;

  assert.deepEqual(normalizeInvoice(storedInvoice)?.tax, invoice.tax);
});
