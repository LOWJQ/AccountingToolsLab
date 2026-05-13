import assert from "node:assert/strict";
import {
  calculateSstInvoiceMalaysia,
  calculateSstMalaysia,
  getSuggestedSstRateForCategory,
  getSstCategoryById,
  isFixedSstCategory,
  isPercentageSstCategory,
  SST_MALAYSIA_CATEGORIES
} from "../lib/calculators/sst-malaysia";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("add SST calculates SST amount", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 100,
    sstRate: 8
  });

  assert.equal(result.sstAmount, 8);
});

test("add SST calculates total including SST", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 100,
    sstRate: 8
  });

  assert.equal(result.totalIncludingSst, 108);
});

test("remove SST calculates amount before SST", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 108,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 100);
});

test("remove SST calculates SST amount", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 108,
    sstRate: 8
  });

  assert.equal(result.sstAmount, 8);
});

test("handles 0 percent rate", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 100,
    sstRate: 0
  });

  assert.equal(result.sstAmount, 0);
  assert.equal(result.totalIncludingSst, 100);
});

test("handles 5, 6, 8, and 10 percent rates", () => {
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 5 }).sstAmount, 5);
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 6 }).sstAmount, 6);
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 8 }).sstAmount, 8);
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 10 }).sstAmount, 10);
});

test("handles custom rates", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 200,
    sstRate: 7.5
  });

  assert.equal(result.sstAmount, 15);
  assert.equal(result.totalIncludingSst, 215);
});

test("handles custom rates with awkward decimals", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 123.45,
    sstRate: 7.25
  });

  assert.equal(result.sstAmount, 8.95);
  assert.equal(result.totalIncludingSst, 132.4);
});

test("handles decimals", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 99.99,
    sstRate: 8
  });

  assert.equal(result.sstAmount, 8);
  assert.equal(result.totalIncludingSst, 107.99);
});

test("add SST mode rounds awkward decimals", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 123.456,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 123.46);
  assert.equal(result.sstAmount, 9.88);
  assert.equal(result.totalIncludingSst, 133.34);
});

test("remove SST mode rounds awkward decimals", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 133.34,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 123.46);
  assert.equal(result.sstAmount, 9.88);
  assert.equal(result.totalIncludingSst, 133.34);
});

test("handles zero amount", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 0,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 0);
  assert.equal(result.sstAmount, 0);
  assert.equal(result.totalIncludingSst, 0);
});

test("rejects invalid amount", () => {
  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: Number.NaN,
        sstRate: 8
      }),
    /Amount is required/
  );

  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: -100,
        sstRate: 8
      }),
    /Amount must be zero or greater/
  );
});

test("rejects invalid custom rate", () => {
  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: 100,
        sstRate: null
      }),
    /SST rate is required/
  );

  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: 100,
        sstRate: -1
      }),
    /SST rate must be zero or greater/
  );

  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: 100,
        sstRate: 101
      }),
    /SST rate must be 100% or less/
  );
});

test("category lookup returns expected service and goods categories", () => {
  const serviceCategory = getSstCategoryById("service_general_taxable");
  const goodsCategory = getSstCategoryById("goods_sales_tax_10");

  assert.equal(serviceCategory?.group, "service");
  assert.equal(serviceCategory?.label, "General taxable services");
  assert.equal(goodsCategory?.group, "goods");
  assert.equal(goodsCategory?.label, "Goods with 10% sales tax");
  assert.equal(getSstCategoryById("missing"), undefined);
  assert.equal(SST_MALAYSIA_CATEGORIES.length >= 11, true);
});

test("percentage and fixed category helpers identify category type", () => {
  const serviceCategory = getSstCategoryById("service_general_taxable");
  const cardCategory = getSstCategoryById("service_credit_charge_card");

  assert.equal(isPercentageSstCategory(serviceCategory), true);
  assert.equal(isFixedSstCategory(serviceCategory), false);
  assert.equal(isFixedSstCategory(cardCategory), true);
  assert.equal(isPercentageSstCategory(cardCategory), false);
});

test("service categories expose expected suggested rates", () => {
  assert.equal(getSuggestedSstRateForCategory("service_general_taxable"), 8);
  assert.equal(getSuggestedSstRateForCategory("service_food_beverage"), 6);
  assert.equal(getSuggestedSstRateForCategory("service_logistics"), 6);
  assert.equal(getSuggestedSstRateForCategory("service_telecommunications"), 6);
  assert.equal(getSuggestedSstRateForCategory("service_parking"), 6);
});

test("goods categories expose expected suggested rates", () => {
  assert.equal(getSuggestedSstRateForCategory("goods_exempt_or_zero"), 0);
  assert.equal(getSuggestedSstRateForCategory("goods_sales_tax_5"), 5);
  assert.equal(getSuggestedSstRateForCategory("goods_sales_tax_10"), 10);
  assert.equal(getSuggestedSstRateForCategory("goods_specific_or_unsure"), null);
});

test("custom and uncertain goods categories require manual rates", () => {
  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [
          {
            categoryId: "custom",
            quantity: 1,
            unitPrice: 100
          }
        ]
      }),
    /Custom manual percentage requires a valid manual SST rate/
  );

  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [
          {
            categoryId: "goods_specific_or_unsure",
            quantity: 1,
            unitPrice: 100
          }
        ]
      }),
    /Goods with specific rate or unsure treatment requires a valid manual SST rate/
  );
});

test("invoice-style add SST calculation supports multiple line items", () => {
  const result = calculateSstInvoiceMalaysia({
    mode: "add",
    items: [
      {
        id: "service",
        description: "Consulting",
        categoryId: "service_general_taxable",
        quantity: 2,
        unitPrice: 100
      },
      {
        id: "goods",
        description: "Taxable goods",
        categoryId: "goods_sales_tax_5",
        quantity: 3,
        unitPrice: 50
      }
    ]
  });

  assert.equal(result.lineItems.length, 2);
  assert.equal(result.lineItems[0].amountBeforeSst, 200);
  assert.equal(result.lineItems[0].sstAmount, 16);
  assert.equal(result.lineItems[0].totalIncludingSst, 216);
  assert.equal(result.lineItems[1].amountBeforeSst, 150);
  assert.equal(result.lineItems[1].sstAmount, 7.5);
  assert.equal(result.lineItems[1].totalIncludingSst, 157.5);
  assert.equal(result.subtotalBeforeSst, 350);
  assert.equal(result.totalSst, 23.5);
  assert.equal(result.grandTotalIncludingSst, 373.5);
});

test("invoice-style remove SST calculation supports multiple line items", () => {
  const result = calculateSstInvoiceMalaysia({
    mode: "remove",
    items: [
      {
        categoryId: "service_general_taxable",
        quantity: 1,
        unitPrice: 108
      },
      {
        categoryId: "goods_sales_tax_5",
        quantity: 1,
        unitPrice: 105
      }
    ]
  });

  assert.equal(result.lineItems[0].amountBeforeSst, 100);
  assert.equal(result.lineItems[0].sstAmount, 8);
  assert.equal(result.lineItems[1].amountBeforeSst, 100);
  assert.equal(result.lineItems[1].sstAmount, 5);
  assert.equal(result.subtotalBeforeSst, 200);
  assert.equal(result.totalSst, 13);
  assert.equal(result.grandTotalIncludingSst, 213);
});

test("invoice-style calculation groups SST totals by rate and category", () => {
  const result = calculateSstInvoiceMalaysia({
    mode: "add",
    items: [
      {
        categoryId: "service_food_beverage",
        quantity: 1,
        unitPrice: 100
      },
      {
        categoryId: "service_food_beverage",
        quantity: 2,
        unitPrice: 50
      },
      {
        categoryId: "goods_sales_tax_10",
        quantity: 1,
        unitPrice: 80
      }
    ]
  });

  assert.equal(result.groupedSst.length, 2);
  assert.deepEqual(
    result.groupedSst.map((group) => ({
      categoryId: group.categoryId,
      rate: group.sstRatePercent,
      amountBeforeSst: group.amountBeforeSst,
      sstAmount: group.sstAmount
    })),
    [
      {
        categoryId: "service_food_beverage",
        rate: 6,
        amountBeforeSst: 200,
        sstAmount: 12
      },
      {
        categoryId: "goods_sales_tax_10",
        rate: 10,
        amountBeforeSst: 80,
        sstAmount: 8
      }
    ]
  );
});

test("custom rate line item uses manual percentage", () => {
  const result = calculateSstInvoiceMalaysia({
    mode: "add",
    items: [
      {
        categoryId: "custom",
        manualRatePercent: 7.5,
        quantity: 2,
        unitPrice: 100
      }
    ]
  });

  assert.equal(result.lineItems[0].sstRatePercent, 7.5);
  assert.equal(result.lineItems[0].sstAmount, 15);
  assert.match(result.warnings.join(" "), /Manual SST rate of 7.5%/);
});

test("zero-rated or exempt line item keeps SST at zero", () => {
  const result = calculateSstInvoiceMalaysia({
    mode: "add",
    items: [
      {
        categoryId: "goods_exempt_or_zero",
        quantity: 4,
        unitPrice: 25
      }
    ]
  });

  assert.equal(result.lineItems[0].amountBeforeSst, 100);
  assert.equal(result.lineItems[0].sstAmount, 0);
  assert.equal(result.lineItems[0].totalIncludingSst, 100);
});

test("invalid invoice line values are rejected", () => {
  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [{ categoryId: "service_general_taxable", quantity: 0, unitPrice: 100 }]
      }),
    /Line 1 quantity must be greater than zero/
  );

  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [{ categoryId: "service_general_taxable", quantity: 1, unitPrice: -1 }]
      }),
    /Line 1 unit price must be zero or greater/
  );

  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [
          {
            categoryId: "custom",
            manualRatePercent: 101,
            quantity: 1,
            unitPrice: 100
          }
        ]
      }),
    /Manual SST rate must be 100% or less/
  );
});

test("invoice calculation rejects NaN and Infinity", () => {
  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [
          {
            categoryId: "service_general_taxable",
            quantity: Number.NaN,
            unitPrice: 100
          }
        ]
      }),
    /Line 1 quantity is required/
  );

  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [
          {
            categoryId: "service_general_taxable",
            quantity: 1,
            unitPrice: Number.POSITIVE_INFINITY
          }
        ]
      }),
    /Line 1 unit price is required/
  );

  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "add",
        items: [
          {
            categoryId: "custom",
            manualRatePercent: Number.NEGATIVE_INFINITY,
            quantity: 1,
            unitPrice: 100
          }
        ]
      }),
    /Manual SST rate is required/
  );
});

test("fixed credit or charge card category uses special RM25 handling", () => {
  const addResult = calculateSstInvoiceMalaysia({
    mode: "add",
    items: [
      {
        categoryId: "service_credit_charge_card",
        quantity: 2,
        unitPrice: 100
      }
    ]
  });

  assert.equal(addResult.lineItems[0].rateType, "fixed");
  assert.equal(addResult.lineItems[0].fixedAmount, 25);
  assert.equal(addResult.lineItems[0].sstAmount, 50);
  assert.equal(addResult.lineItems[0].totalIncludingSst, 250);
  assert.match(addResult.warnings.join(" "), /special handling/i);

  const removeResult = calculateSstInvoiceMalaysia({
    mode: "remove",
    items: [
      {
        categoryId: "service_credit_charge_card",
        quantity: 1,
        unitPrice: 125
      }
    ]
  });

  assert.equal(removeResult.lineItems[0].amountBeforeSst, 100);
  assert.equal(removeResult.lineItems[0].sstAmount, 25);
});

test("fixed credit or charge card remove mode rejects impossible inclusive amount", () => {
  assert.throws(
    () =>
      calculateSstInvoiceMalaysia({
        mode: "remove",
        items: [
          {
            categoryId: "service_credit_charge_card",
            quantity: 2,
            unitPrice: 20
          }
        ]
      }),
    /Fixed SST amount cannot be greater/
  );
});
