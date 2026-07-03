import assert from "node:assert/strict";
import {
  calculateInvoiceLineItems,
  calculateInvoiceTotals
} from "../lib/invoice/invoice-calculations";
import { generateInvoicePdf } from "../lib/invoice/invoice-pdf-generator";
import { buildInvoicePdfFileName, sanitizePdfFileNamePart } from "../lib/invoice/invoice-pdf";
import type { InvoiceData } from "../lib/invoice/invoice-types";

const tests: Array<[string, () => Promise<void> | void]> = [];

function test(name: string, run: () => Promise<void> | void) {
  tests.push([name, run]);
}

type InvoiceTaxOverride = Partial<InvoiceData["tax"][number]>;
type InvoiceTestOverrides = Partial<Omit<InvoiceData, "discount" | "payment" | "shipping" | "tax">> & {
  discount?: Partial<InvoiceData["discount"]>;
  payment?: Partial<InvoiceData["payment"]>;
  shipping?: Partial<InvoiceData["shipping"]>;
  tax?: InvoiceTaxOverride | InvoiceTaxOverride[];
};

function createInvoice(overrides: InvoiceTestOverrides = {}): InvoiceData {
  const invoice: InvoiceData = {
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
  const baseShipping = invoice.shipping ?? { enabled: false, label: "Shipping", amount: "0" };
  const taxOverrides = overrides.tax
    ? Array.isArray(overrides.tax)
      ? overrides.tax
      : [overrides.tax]
    : undefined;

  return {
    ...invoice,
    ...overrides,
    discount: {
      ...invoice.discount,
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
      : invoice.tax,
    shipping: {
      enabled: overrides.shipping?.enabled ?? baseShipping.enabled,
      label: overrides.shipping?.label ?? baseShipping.label,
      amount: overrides.shipping?.amount ?? baseShipping.amount
    },
    payment: {
      ...invoice.payment,
      ...overrides.payment
    }
  };
}

test("sanitizes unsafe PDF filename characters", () => {
  assert.equal(sanitizePdfFileNamePart("INV/001: Test?"), "INV-001-Test");
});

test("uses a safe fallback for blank filename parts", () => {
  assert.equal(sanitizePdfFileNamePart("   "), "invoice");
});

test("builds invoice PDF filename with invoice number, customer, and date", () => {
  assert.equal(
    buildInvoicePdfFileName("INV-001", "Acme Trading Co.", "2026-05-08"),
    "Invoice-INV-001-Acme-Trading-Co-2026-05-08.pdf"
  );
});

test("omits missing customer name from PDF filename", () => {
  assert.equal(
    buildInvoicePdfFileName("INV-001", "", "2026-05-08"),
    "Invoice-INV-001-2026-05-08.pdf"
  );
});

test("keeps PDF filename reasonably short", () => {
  const fileName = buildInvoicePdfFileName("INV-001", "Customer ".repeat(40), "2026-05-08");

  assert.ok(fileName.endsWith(".pdf"));
  assert.ok(fileName.length <= 124);
});

test("PDF generation gracefully skips when browser APIs are unavailable", async () => {
  Reflect.deleteProperty(globalThis as { window?: unknown }, "window");

  const invoice = createInvoice();
  const previewItems = calculateInvoiceLineItems(invoice.items);

  const result = await generateInvoicePdf({
    calculation: calculateInvoiceTotals(invoice),
    formatCurrency: (value) => `MYR ${value.toFixed(2)}`,
    invoiceData: invoice,
    previewItems
  });

  assert.deepEqual(result, { warnings: [] });
});

test("PDF generation does not throw for invalid logo or QR data when browser APIs are unavailable", async () => {
  Reflect.deleteProperty(globalThis as { window?: unknown }, "window");

  const invoice = createInvoice({
    businessLogoDataUrl: "not-a-data-url",
    payment: {
      paymentQrDataUrl: "data:image/png;base64,not-valid-image-data"
    }
  });
  const previewItems = calculateInvoiceLineItems(invoice.items);

  const result = await generateInvoicePdf({
    calculation: calculateInvoiceTotals(invoice),
    formatCurrency: (value) => `MYR ${value.toFixed(2)}`,
    invoiceData: invoice,
    previewItems
  });

  assert.deepEqual(result, { warnings: [] });
});

async function runTests() {
  for (const [name, run] of tests) {
    await run();
    console.log(`PASS ${name}`);
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
