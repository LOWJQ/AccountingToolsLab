import assert from "node:assert/strict";
import { buildInvoicePdfFileName, sanitizePdfFileNamePart } from "../lib/invoice/invoice-pdf";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
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
