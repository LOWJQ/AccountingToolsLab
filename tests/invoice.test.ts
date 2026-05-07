import assert from "node:assert/strict";
import { calculateInvoice } from "../lib/calculators/invoice";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("calculates one line item total", () => {
  const result = calculateInvoice([
    {
      description: "Consulting",
      quantity: 2,
      unitPrice: 100
    }
  ]);

  assert.equal(result.items[0].lineTotal, 200);
});

test("calculates multiple line item totals", () => {
  const result = calculateInvoice([
    {
      description: "Design",
      quantity: 2,
      unitPrice: 150
    },
    {
      description: "Support",
      quantity: 3,
      unitPrice: 50
    }
  ]);

  assert.equal(result.items[0].lineTotal, 300);
  assert.equal(result.items[1].lineTotal, 150);
});

test("calculates subtotal", () => {
  const result = calculateInvoice([
    {
      description: "Design",
      quantity: 2,
      unitPrice: 150
    },
    {
      description: "Support",
      quantity: 3,
      unitPrice: 50
    }
  ]);

  assert.equal(result.subtotal, 450);
});

test("calculates total", () => {
  const result = calculateInvoice([
    {
      description: "Design",
      quantity: 2,
      unitPrice: 150
    },
    {
      description: "Support",
      quantity: 3,
      unitPrice: 50
    }
  ]);

  assert.equal(result.total, 450);
});

test("invoice without tax still calculates total as subtotal", () => {
  const result = calculateInvoice([
    {
      description: "Design",
      quantity: 2,
      unitPrice: 150
    }
  ]);

  assert.equal(result.subtotal, 300);
  assert.equal(result.taxRate, 0);
  assert.equal(result.taxAmount, 0);
  assert.equal(result.total, 300);
});

test("calculates invoice with 6 percent tax", () => {
  const result = calculateInvoice(
    [
      {
        description: "Service",
        quantity: 1,
        unitPrice: 100
      }
    ],
    { taxRate: 6 }
  );

  assert.equal(result.taxRate, 6);
  assert.equal(result.taxAmount, 6);
  assert.equal(result.total, 106);
});

test("calculates invoice with 8 percent tax", () => {
  const result = calculateInvoice(
    [
      {
        description: "Service",
        quantity: 1,
        unitPrice: 250
      }
    ],
    { taxRate: 8 }
  );

  assert.equal(result.taxRate, 8);
  assert.equal(result.taxAmount, 20);
  assert.equal(result.total, 270);
});

test("calculates invoice with custom tax rate", () => {
  const result = calculateInvoice(
    [
      {
        description: "Service",
        quantity: 3,
        unitPrice: 99.99
      }
    ],
    { taxRate: 7.5 }
  );

  assert.equal(result.subtotal, 299.97);
  assert.equal(result.taxRate, 7.5);
  assert.equal(result.taxAmount, 22.5);
  assert.equal(result.total, 322.47);
});

test("tax rate 0 keeps tax amount at zero", () => {
  const result = calculateInvoice(
    [
      {
        description: "Service",
        quantity: 1,
        unitPrice: 100
      }
    ],
    { taxRate: 0 }
  );

  assert.equal(result.taxRate, 0);
  assert.equal(result.taxAmount, 0);
  assert.equal(result.total, 100);
});

test("negative tax rate throws an error", () => {
  assert.throws(
    () =>
      calculateInvoice(
        [
          {
            description: "Service",
            quantity: 1,
            unitPrice: 100
          }
        ],
        { taxRate: -1 }
      ),
    /Tax rate cannot be negative/
  );
});

test("tax rate above 100 throws an error", () => {
  assert.throws(
    () =>
      calculateInvoice(
        [
          {
            description: "Service",
            quantity: 1,
            unitPrice: 100
          }
        ],
        { taxRate: 101 }
      ),
    /Tax rate cannot be above 100/
  );
});

test("handles decimals", () => {
  const result = calculateInvoice([
    {
      description: "Hours",
      quantity: 2.5,
      unitPrice: 80.25
    }
  ]);

  assert.equal(result.items[0].lineTotal, 200.63);
  assert.equal(result.subtotal, 200.63);
});

test("trims line item descriptions", () => {
  const result = calculateInvoice([
    {
      description: "  Bookkeeping support  ",
      quantity: 1,
      unitPrice: 75
    }
  ]);

  assert.equal(result.items[0].description, "Bookkeeping support");
});

test("uses a fallback description for empty line item names", () => {
  const result = calculateInvoice([
    {
      description: "   ",
      quantity: 1,
      unitPrice: 75
    }
  ]);

  assert.equal(result.items[0].description, "Item 1");
});

test("handles zero-total invoice lines when unit price is zero", () => {
  const result = calculateInvoice([
    {
      description: "No charge item",
      quantity: 3,
      unitPrice: 0
    }
  ]);

  assert.equal(result.items[0].lineTotal, 0);
  assert.equal(result.subtotal, 0);
  assert.equal(result.total, 0);
});

test("handles large invoice values", () => {
  const result = calculateInvoice([
    {
      description: "Enterprise implementation",
      quantity: 1000000,
      unitPrice: 1234.56
    },
    {
      description: "Support package",
      quantity: 250000,
      unitPrice: 78.9
    }
  ]);

  assert.equal(result.items[0].lineTotal, 1234560000);
  assert.equal(result.items[1].lineTotal, 19725000);
  assert.equal(result.subtotal, 1254285000);
  assert.equal(result.total, 1254285000);
});

test("rounds each invoice line before subtotal", () => {
  const result = calculateInvoice([
    {
      description: "Rounded line one",
      quantity: 3,
      unitPrice: 0.335
    },
    {
      description: "Rounded line two",
      quantity: 3,
      unitPrice: 0.335
    }
  ]);

  assert.equal(result.items[0].lineTotal, 1.01);
  assert.equal(result.items[1].lineTotal, 1.01);
  assert.equal(result.subtotal, 2.02);
});

test("rejects quantity of zero or less", () => {
  assert.throws(
    () =>
      calculateInvoice([
        {
          description: "Service",
          quantity: 0,
          unitPrice: 100
        }
      ]),
    /quantity must be greater than zero/
  );

  assert.throws(
    () =>
      calculateInvoice([
        {
          description: "Service",
          quantity: -1,
          unitPrice: 100
        }
      ]),
    /quantity must be greater than zero/
  );
});

test("rejects negative unit price", () => {
  assert.throws(
    () =>
      calculateInvoice([
        {
          description: "Service",
          quantity: 1,
          unitPrice: -100
        }
      ]),
    /unit price must be zero or greater/
  );
});

test("handles empty or invalid input safely", () => {
  assert.throws(
    () =>
      calculateInvoice([
        {
          description: "Service",
          quantity: null,
          unitPrice: 100
        }
      ]),
    /quantity is required/
  );

  assert.throws(
    () =>
      calculateInvoice([
        {
          description: "Service",
          quantity: 1,
          unitPrice: Number.NaN
        }
      ]),
    /unit price is required/
  );
});

test("rounds awkward decimal quantities and prices per line", () => {
  const result = calculateInvoice([
    {
      description: "Fractional hours",
      quantity: 1.333,
      unitPrice: 19.995
    },
    {
      description: "Fractional add-on",
      quantity: 2.667,
      unitPrice: 4.335
    }
  ]);

  assert.equal(result.items[0].lineTotal, 26.65);
  assert.equal(result.items[1].lineTotal, 11.56);
  assert.equal(result.subtotal, 38.21);
});
