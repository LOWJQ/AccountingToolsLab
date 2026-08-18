import assert from "node:assert/strict";
import { calculateInvoiceTotals } from "../lib/invoice/invoice-calculations";
import { buildInvoicePdfFileName } from "../lib/invoice/invoice-pdf";
import { createEmptyReceipt, todayIsoDate } from "../lib/receipt/receipt-defaults";
import { createReceiptPdfLabels, toInvoiceDocument } from "../lib/receipt/receipt-document";
import { describeReceiptPaymentMethod } from "../lib/receipt/receipt-types";
import type { ReceiptData } from "../lib/receipt/receipt-types";
import { validateReceipt } from "../lib/receipt/receipt-validation";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

function createReceipt(overrides: Partial<ReceiptData> = {}): ReceiptData {
  return {
    ...createEmptyReceipt(new Date("2026-08-18T00:00:00Z")),
    businessName: "Bright Ledger Studio",
    receivedFrom: "Acme Trading",
    receiptNumber: "REC-001",
    receiptDate: "2026-08-18",
    items: [{ id: "item-1", description: "Consulting", quantity: "2", unitPrice: "150" }],
    ...overrides
  };
}

// --- defaults ---------------------------------------------------------------

test("a blank receipt dates itself today", () => {
  const now = new Date(2026, 7, 18);

  assert.equal(createEmptyReceipt(now).receiptDate, "2026-08-18");
});

test("todayIsoDate zero-pads month and day", () => {
  assert.equal(todayIsoDate(new Date(2026, 0, 5)), "2026-01-05");
});

test("a blank receipt starts with one empty line item", () => {
  const receipt = createEmptyReceipt();

  assert.equal(receipt.items.length, 1);
  assert.equal(receipt.items[0].description, "");
});

test("a blank receipt does not share mutable defaults between calls", () => {
  const first = createEmptyReceipt();
  const second = createEmptyReceipt();

  first.discount.enabled = true;
  first.tax[0].enabled = true;

  assert.equal(second.discount.enabled, false);
  assert.equal(second.tax[0].enabled, false);
});

// --- payment method ---------------------------------------------------------

test("a known payment method resolves to its label", () => {
  assert.equal(describeReceiptPaymentMethod(createReceipt({ paymentMethod: "bank-transfer" })), "Bank transfer");
});

test("the other method uses the free-text value", () => {
  const receipt = createReceipt({ paymentMethod: "other", paymentMethodOther: "Barter" });

  assert.equal(describeReceiptPaymentMethod(receipt), "Barter");
});

// --- adapter ----------------------------------------------------------------

test("a receipt maps onto the invoice document shape", () => {
  const document = toInvoiceDocument(createReceipt());

  assert.equal(document.customerName, "Acme Trading");
  assert.equal(document.invoiceNumber, "REC-001");
  assert.equal(document.invoiceDate, "2026-08-18");
});

test("a receipt carries no due date or payment terms", () => {
  const document = toInvoiceDocument(createReceipt());

  assert.equal(document.dueDate, "");
  assert.equal(document.terms, "");
});

test("shipping passes through but is off until switched on", () => {
  assert.equal(toInvoiceDocument(createReceipt()).shipping?.enabled, false);

  const withShipping = createReceipt({
    shipping: { enabled: true, label: "Delivery", amount: "25" }
  });

  assert.equal(toInvoiceDocument(withShipping).shipping?.amount, "25");
});

test("shipping is added to the total", () => {
  const receipt = createReceipt({
    items: [{ id: "a", description: "Goods", quantity: "1", unitPrice: "100" }],
    shipping: { enabled: true, label: "Delivery", amount: "25" }
  });

  const totals = calculateInvoiceTotals(toInvoiceDocument(receipt));

  assert.equal(totals.shippingAmount, 25);
  assert.equal(totals.total, 125);
});

test("a receipt carries no bank details to pay into", () => {
  const { payment } = toInvoiceDocument(createReceipt());

  assert.equal(payment.bankName, "");
  assert.equal(payment.accountNumber, "");
  assert.equal(payment.duitNowId, "");
});

test("receipt totals reuse the invoice maths", () => {
  const receipt = createReceipt({
    items: [
      { id: "a", description: "Consulting", quantity: "2", unitPrice: "150" },
      { id: "b", description: "Setup", quantity: "1", unitPrice: "200" }
    ],
    tax: [{ id: "tax-1", enabled: true, label: "SST", type: "percentage", value: "8" }]
  });

  const totals = calculateInvoiceTotals(toInvoiceDocument(receipt));

  assert.equal(totals.subtotal, 500);
  assert.equal(totals.taxAmount, 40);
  assert.equal(totals.total, 540);
});

test("a receipt discount reduces the taxable amount", () => {
  const receipt = createReceipt({
    items: [{ id: "a", description: "Consulting", quantity: "1", unitPrice: "1000" }],
    discount: { enabled: true, label: "Discount", type: "percentage", value: "10" },
    tax: [{ id: "tax-1", enabled: true, label: "SST", type: "percentage", value: "8" }]
  });

  const totals = calculateInvoiceTotals(toInvoiceDocument(receipt));

  assert.equal(totals.discountAmount, 100);
  assert.equal(totals.taxableAmount, 900);
  assert.equal(totals.total, 972);
});

// --- pdf labels -------------------------------------------------------------

test("receipt PDF labels replace the invoice wording", () => {
  const labels = createReceiptPdfLabels(createReceipt());

  assert.equal(labels.title, "RECEIPT");
  assert.equal(labels.numberLabel, "Receipt #:");
  assert.equal(labels.partyLabel, "RECEIVED FROM");
  assert.equal(labels.documentName, "Receipt");
});

test("receipt PDF labels carry the payment method and invoice reference", () => {
  const labels = createReceiptPdfLabels(
    createReceipt({ paymentMethod: "e-wallet", invoiceReference: "INV-042" })
  );

  assert.deepEqual(labels.extraMetaRows, [
    { label: "Paid by:", value: "E-wallet" },
    { label: "Invoice ref:", value: "INV-042" }
  ]);
});

test("the PDF file name defaults to Invoice but accepts Receipt", () => {
  assert.match(buildInvoicePdfFileName("INV-1", "Acme", "2026-08-18"), /^Invoice-INV-1-Acme/);
  assert.match(
    buildInvoicePdfFileName("REC-1", "Acme", "2026-08-18", "Receipt"),
    /^Receipt-REC-1-Acme/
  );
});

// --- validation -------------------------------------------------------------

test("a complete receipt passes validation", () => {
  assert.deepEqual(validateReceipt(createReceipt()), []);
});

test("missing business name fails validation", () => {
  const errors = validateReceipt(createReceipt({ businessName: "  " }));

  assert.ok(errors.some((error) => error.field === "businessName"));
});

test("missing received from fails validation", () => {
  assert.ok(
    validateReceipt(createReceipt({ receivedFrom: "" })).some(
      (error) => error.field === "receivedFrom"
    )
  );
});

test("missing receipt number fails validation", () => {
  assert.ok(
    validateReceipt(createReceipt({ receiptNumber: "" })).some(
      (error) => error.field === "receiptNumber"
    )
  );
});

test("a malformed payment date fails validation", () => {
  assert.ok(
    validateReceipt(createReceipt({ receiptDate: "18-08-2026" })).some(
      (error) => error.field === "receiptDate"
    )
  );
});

test("a date that does not exist fails validation", () => {
  assert.ok(
    validateReceipt(createReceipt({ receiptDate: "2026-02-31" })).some(
      (error) => error.field === "receiptDate"
    )
  );
});

test("choosing other without describing it fails validation", () => {
  const errors = validateReceipt(
    createReceipt({ paymentMethod: "other", paymentMethodOther: "" })
  );

  assert.ok(errors.some((error) => error.field === "paymentMethodOther"));
});

test("a receipt with no items fails validation", () => {
  assert.ok(validateReceipt(createReceipt({ items: [] })).some((error) => error.field === "items"));
});

test("a line item without a description fails validation", () => {
  const errors = validateReceipt(
    createReceipt({ items: [{ id: "a", description: "", quantity: "1", unitPrice: "10" }] })
  );

  assert.ok(errors.some((error) => error.field === "items.0.description"));
});

test("a zero or negative quantity fails validation", () => {
  for (const quantity of ["0", "-1", "abc"]) {
    const errors = validateReceipt(
      createReceipt({
        items: [{ id: "a", description: "Consulting", quantity, unitPrice: "10" }]
      })
    );

    assert.ok(
      errors.some((error) => error.field === "items.0.quantity"),
      `quantity ${quantity} should fail`
    );
  }
});

test("a negative unit price fails validation", () => {
  const errors = validateReceipt(
    createReceipt({
      items: [{ id: "a", description: "Consulting", quantity: "1", unitPrice: "-5" }]
    })
  );

  assert.ok(errors.some((error) => error.field === "items.0.unitPrice"));
});

test("a zero unit price is allowed", () => {
  const errors = validateReceipt(
    createReceipt({
      items: [{ id: "a", description: "Free gift", quantity: "1", unitPrice: "0" }]
    })
  );

  assert.deepEqual(errors, []);
});

test("errors report the position of the failing line item", () => {
  const errors = validateReceipt(
    createReceipt({
      items: [
        { id: "a", description: "Consulting", quantity: "1", unitPrice: "10" },
        { id: "b", description: "", quantity: "1", unitPrice: "10" }
      ]
    })
  );

  assert.ok(errors.some((error) => error.message.includes("Item 2")));
});
