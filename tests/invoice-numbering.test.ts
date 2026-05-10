import assert from "node:assert/strict";
import { canAutoIncrementInvoiceNumber, getNextInvoiceNumber } from "../lib/invoice/invoice-numbering";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("increments INV-001 to INV-002", () => {
  assert.equal(getNextInvoiceNumber("INV-001"), "INV-002");
});

test("increments INV-007 to INV-008", () => {
  assert.equal(getNextInvoiceNumber("INV-007"), "INV-008");
});

test("increments INV-099 to INV-100", () => {
  assert.equal(getNextInvoiceNumber("INV-099"), "INV-100");
});

test("increments INV-999 to INV-1000", () => {
  assert.equal(getNextInvoiceNumber("INV-999"), "INV-1000");
});

test("increments INV-2026-001 to INV-2026-002", () => {
  assert.equal(getNextInvoiceNumber("INV-2026-001"), "INV-2026-002");
});

test("increments 2026-001 to 2026-002", () => {
  assert.equal(getNextInvoiceNumber("2026-001"), "2026-002");
});

test("increments 001 to 002", () => {
  assert.equal(getNextInvoiceNumber("001"), "002");
});

test("increments 0009 to 0010", () => {
  assert.equal(getNextInvoiceNumber("0009"), "0010");
});

test("increments INV001 to INV002", () => {
  assert.equal(getNextInvoiceNumber("INV001"), "INV002");
});

test("unsupported INV returns null", () => {
  assert.equal(getNextInvoiceNumber("INV"), null);
});

test("unsupported ABC returns null", () => {
  assert.equal(getNextInvoiceNumber("ABC"), null);
});

test("unsupported Invoice One returns null", () => {
  assert.equal(getNextInvoiceNumber("Invoice One"), null);
});

test("empty string returns null", () => {
  assert.equal(getNextInvoiceNumber(""), null);
});

test("whitespace-only string returns null", () => {
  assert.equal(getNextInvoiceNumber("   "), null);
});

test("preserves prefix exactly after trimming surrounding whitespace", () => {
  assert.equal(getNextInvoiceNumber("  Custom Prefix-009  "), "Custom Prefix-010");
});

test("canAutoIncrementInvoiceNumber reports supported values", () => {
  assert.equal(canAutoIncrementInvoiceNumber("INV-001"), true);
  assert.equal(canAutoIncrementInvoiceNumber("INV"), false);
});
