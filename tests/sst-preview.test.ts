import assert from "node:assert/strict";
import { calculateSstPreview } from "../lib/calculators/sst-preview";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("blank prices stay unfinished while completed items retain their subtotal", () => {
  const preview = calculateSstPreview({ mode: "add", items: [
    { categoryId: "service_general_taxable", quantity: 1, unitPrice: 1000 },
    { categoryId: "service_general_taxable", quantity: 1, unitPrice: null }
  ] });
  assert.equal(preview.incompleteCount, 1);
  assert.equal(preview.canExport, false);
  assert.equal(preview.result?.subtotalBeforeSst, 1000);
  assert.equal(preview.result?.totalSst, 80);
  assert.equal(preview.result?.grandTotalIncludingSst, 1080);
  assert.match(preview.items[1].message, /^Item 2: unit price is required/);
});

test("an explicitly entered zero price is completed and can be exported", () => {
  const preview = calculateSstPreview({ mode: "add", items: [
    { categoryId: "service_general_taxable", quantity: 1, unitPrice: 0 }
  ] });
  assert.equal(preview.canExport, true);
  assert.equal(preview.incompleteCount, 0);
  assert.equal(preview.result?.grandTotalIncludingSst, 0);
});

test("blank fixed-tax items do not add a charge to the completed subtotal", () => {
  const preview = calculateSstPreview({ mode: "add", items: [
    { categoryId: "service_general_taxable", quantity: 1, unitPrice: 100 },
    { categoryId: "service_credit_charge_card", quantity: 2, unitPrice: null }
  ] });
  assert.equal(preview.result?.totalSst, 8);
  assert.equal(preview.result?.grandTotalIncludingSst, 108);
  assert.equal(preview.canExport, false);
});

test("invalid quantities and missing manual rates prevent exporting", () => {
  const preview = calculateSstPreview({ mode: "add", items: [
    { categoryId: "service_general_taxable", quantity: 0, unitPrice: 100 },
    { categoryId: "custom", quantity: 1, unitPrice: 100, manualRatePercent: null }
  ] });
  assert.equal(preview.result, null);
  assert.equal(preview.incompleteCount, 2);
  assert.equal(preview.canExport, false);
});

test("remove-SST previews retain correct amounts and original row identity", () => {
  const preview = calculateSstPreview({ mode: "remove", items: [
    { id: "unfinished", categoryId: "service_general_taxable", quantity: 1, unitPrice: null },
    { id: "completed", description: "Item 2", categoryId: "goods_sales_tax_5", quantity: 3, unitPrice: 52.5 }
  ] });
  assert.equal(preview.result?.subtotalBeforeSst, 150);
  assert.equal(preview.result?.totalSst, 7.5);
  assert.equal(preview.result?.grandTotalIncludingSst, 157.5);
  assert.equal(preview.result?.lineItems[0].id, "completed");
  assert.equal(preview.result?.lineItems[0].description, "Item 2");
  assert.equal(preview.canExport, false);
});

test("an empty list has no subtotal and cannot be exported", () => {
  const preview = calculateSstPreview({ mode: "add", items: [] });
  assert.equal(preview.result, null);
  assert.equal(preview.canExport, false);
});

test("foreign-currency fixed rows cannot be exported or enter mixed subtotals", () => {
  const items = [
    { categoryId: "service_general_taxable", quantity: 1, unitPrice: 100 },
    { categoryId: "service_credit_charge_card", quantity: 2, unitPrice: 100 }
  ];
  const foreign = calculateSstPreview({ mode: "add", currency: "USD", items });
  assert.equal(foreign.canExport, false);
  assert.equal(foreign.incompleteCount, 1);
  assert.equal(foreign.items[1].line, null);
  assert.match(foreign.items[1].message, /Fixed RM25 SST requires MYR/);
  assert.equal(foreign.result?.totalSst, 8);
  assert.equal(foreign.result?.grandTotalIncludingSst, 108);

  const myr = calculateSstPreview({ mode: "add", currency: "MYR", items });
  assert.equal(myr.canExport, true);
  assert.equal(myr.incompleteCount, 0);
  assert.equal(myr.result?.totalSst, 58);
  assert.equal(myr.result?.grandTotalIncludingSst, 358);
});
