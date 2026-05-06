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
