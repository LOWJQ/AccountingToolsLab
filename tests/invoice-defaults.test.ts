import assert from "node:assert/strict";
import {
  createEmptyInvoiceDefaults,
  createNewInvoiceFromCurrent
} from "../lib/invoice/invoice-defaults";
import type { InvoiceData } from "../lib/invoice/invoice-types";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

function createReusableInvoice(): InvoiceData {
  return {
    businessName: "Bright Ledger Studio",
    businessContact: "hello@example.com",
    businessAddress: "Kuala Lumpur",
    businessLogoDataUrl: "data:image/png;base64,logo",
    customerName: "Acme Trading Co.",
    customerContact: "customer@example.com",
    customerAddress: "Customer address",
    invoiceNumber: "INV-001",
    invoiceDate: "2026-05-01",
    dueDate: "2026-05-31",
    currency: "USD",
    items: [
      {
        id: "item-old",
        description: "Consulting",
        quantity: "2",
        unitPrice: "100"
      }
    ],
    discount: {
      enabled: true,
      type: "fixed",
      value: "50"
    },
    tax: {
      enabled: true,
      rate: "6",
      label: "SST 6%"
    },
    payment: {
      bankName: "Maybank",
      accountName: "Bright Ledger Studio",
      accountNumber: "1234567890",
      duitNowId: "0123456789",
      paymentLink: "https://example.com/pay",
      notes: "Use invoice number as reference."
    },
    notes: "Thank you.",
    terms: "Payment is due within 30 days."
  };
}

test("new invoice keeps reusable business fields", () => {
  const currentInvoice = createReusableInvoice();
  const nextInvoice = createNewInvoiceFromCurrent(currentInvoice, {
    invoiceDate: "2026-05-11",
    invoiceNumber: "INV-002",
    lineItemId: "item-new"
  });

  assert.equal(nextInvoice.businessName, currentInvoice.businessName);
  assert.equal(nextInvoice.businessContact, currentInvoice.businessContact);
  assert.equal(nextInvoice.businessAddress, currentInvoice.businessAddress);
  assert.equal(nextInvoice.businessLogoDataUrl, currentInvoice.businessLogoDataUrl);
  assert.equal(nextInvoice.currency, currentInvoice.currency);
  assert.deepEqual(nextInvoice.payment, currentInvoice.payment);
  assert.equal(nextInvoice.terms, currentInvoice.terms);
  assert.deepEqual(nextInvoice.tax, currentInvoice.tax);
});

test("new invoice resets customer and invoice-specific fields", () => {
  const nextInvoice = createNewInvoiceFromCurrent(createReusableInvoice(), {
    invoiceDate: "2026-05-11",
    invoiceNumber: "INV-002",
    lineItemId: "item-new"
  });

  assert.equal(nextInvoice.customerName, "");
  assert.equal(nextInvoice.customerContact, "");
  assert.equal(nextInvoice.customerAddress, "");
  assert.equal(nextInvoice.dueDate, "");
  assert.equal(nextInvoice.notes, "");
  assert.deepEqual(nextInvoice.discount, {
    enabled: false,
    type: "percentage",
    value: "0"
  });
  assert.deepEqual(nextInvoice.items, [
    {
      id: "item-new",
      description: "",
      quantity: "1",
      unitPrice: ""
    }
  ]);
});

test("new invoice sets invoice date and provided next invoice number", () => {
  const nextInvoice = createNewInvoiceFromCurrent(createReusableInvoice(), {
    invoiceDate: "2026-05-11",
    invoiceNumber: "INV-002"
  });

  assert.equal(nextInvoice.invoiceDate, "2026-05-11");
  assert.equal(nextInvoice.invoiceNumber, "INV-002");
});

test("clear everything defaults reset all reusable fields", () => {
  const emptyInvoice = createEmptyInvoiceDefaults({
    invoiceDate: "2026-05-11",
    lineItemId: "item-new"
  });

  assert.equal(emptyInvoice.businessName, "");
  assert.equal(emptyInvoice.businessContact, "");
  assert.equal(emptyInvoice.businessAddress, "");
  assert.equal(emptyInvoice.businessLogoDataUrl, undefined);
  assert.equal(emptyInvoice.customerName, "");
  assert.equal(emptyInvoice.currency, "MYR");
  assert.deepEqual(emptyInvoice.payment, {
    bankName: "",
    accountName: "",
    accountNumber: "",
    duitNowId: "",
    paymentLink: "",
    notes: "",
    paymentQrDataUrl: undefined
  });
  assert.equal(emptyInvoice.terms.includes("Payment is due within 30 days"), true);
  assert.deepEqual(emptyInvoice.discount, {
    enabled: false,
    type: "percentage",
    value: "0"
  });
  assert.deepEqual(emptyInvoice.tax, {
    enabled: false,
    rate: "0"
  });
});

test("clear everything defaults fall back to the default invoice number", () => {
  const emptyInvoice = createEmptyInvoiceDefaults({
    invoiceDate: "2026-05-11"
  });

  assert.equal(emptyInvoice.invoiceNumber, "INV-001");
});

test("clear everything defaults use a provided invoice number", () => {
  const emptyInvoice = createEmptyInvoiceDefaults({
    invoiceDate: "2026-05-11",
    invoiceNumber: "INV-006"
  });

  assert.equal(emptyInvoice.invoiceNumber, "INV-006");
});
