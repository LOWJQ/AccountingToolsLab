import assert from "node:assert/strict";
import { calculateInvoiceTotals } from "../lib/invoice/invoice-calculations";
import type { InvoiceData } from "../lib/invoice/invoice-types";
import { validateInvoice } from "../lib/invoice/invoice-validation";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

type InvoiceTestOverrides = Partial<Omit<InvoiceData, "discount" | "payment" | "tax">> & {
  discount?: Partial<InvoiceData["discount"]>;
  payment?: Partial<InvoiceData["payment"]>;
  tax?: Partial<InvoiceData["tax"]>;
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
      type: "percentage",
      value: "0"
    },
    tax: {
      enabled: false,
      rate: "0"
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

  return {
    ...baseInvoice,
    ...overrides,
    discount: {
      ...baseInvoice.discount,
      ...overrides.discount
    },
    tax: {
      ...baseInvoice.tax,
      ...overrides.tax
    },
    payment: {
      ...baseInvoice.payment,
      ...overrides.payment
    },
    items: overrides.items ?? baseInvoice.items
  };
}

function messagesFor(invoice: InvoiceData): string[] {
  return validateInvoice(invoice).map((error) => error.message);
}

test("calculates no tax and no discount", () => {
  const result = calculateInvoiceTotals(createInvoice());

  assert.deepEqual(result, {
    subtotal: 200,
    discountAmount: 0,
    taxableAmount: 200,
    taxAmount: 0,
    total: 200
  });
});

test("calculates tax enabled and no discount", () => {
  const result = calculateInvoiceTotals(createInvoice({ tax: { enabled: true, rate: "6" } }));

  assert.equal(result.subtotal, 200);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.taxableAmount, 200);
  assert.equal(result.taxAmount, 12);
  assert.equal(result.total, 212);
});

test("calculates 10 percent discount before tax", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "percentage", value: "10" },
      tax: { enabled: true, rate: "6" }
    })
  );

  assert.equal(result.subtotal, 200);
  assert.equal(result.discountAmount, 20);
  assert.equal(result.taxableAmount, 180);
  assert.equal(result.taxAmount, 10.8);
  assert.equal(result.total, 190.8);
});

test("calculates 10 percent discount with no tax", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "percentage", value: "10" }
    })
  );

  assert.equal(result.subtotal, 200);
  assert.equal(result.discountAmount, 20);
  assert.equal(result.taxableAmount, 180);
  assert.equal(result.taxAmount, 0);
  assert.equal(result.total, 180);
});

test("calculates fixed discount before tax", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "50" },
      tax: { enabled: true, rate: "8" }
    })
  );

  assert.equal(result.discountAmount, 50);
  assert.equal(result.taxableAmount, 150);
  assert.equal(result.taxAmount, 12);
  assert.equal(result.total, 162);
});

test("calculates fixed discount with no tax", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "50" }
    })
  );

  assert.equal(result.discountAmount, 50);
  assert.equal(result.taxableAmount, 150);
  assert.equal(result.taxAmount, 0);
  assert.equal(result.total, 150);
});

test("calculates fixed discount with SST 6%", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "50" },
      tax: { enabled: true, rate: "6" }
    })
  );

  assert.equal(result.discountAmount, 50);
  assert.equal(result.taxableAmount, 150);
  assert.equal(result.taxAmount, 9);
  assert.equal(result.total, 159);
});

test("calculates 100 percent discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "percentage", value: "100" },
      tax: { enabled: true, rate: "6" }
    })
  );

  assert.equal(result.discountAmount, 200);
  assert.equal(result.taxableAmount, 0);
  assert.equal(result.taxAmount, 0);
  assert.equal(result.total, 0);
});

test("calculates fixed discount equal to subtotal", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "200" },
      tax: { enabled: true, rate: "6" }
    })
  );

  assert.equal(result.discountAmount, 200);
  assert.equal(result.taxableAmount, 0);
  assert.equal(result.total, 0);
});

test("calculates decimal quantity", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      items: [{ id: "item-1", description: "Hours", quantity: "2.5", unitPrice: "80" }]
    })
  );

  assert.equal(result.subtotal, 200);
});

test("calculates decimal unit price", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      items: [{ id: "item-1", description: "Hours", quantity: "2", unitPrice: "80.25" }]
    })
  );

  assert.equal(result.subtotal, 160.5);
});

test("empty line item values do not produce NaN", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      items: [{ id: "item-1", description: "", quantity: "", unitPrice: "" }]
    })
  );

  assert.equal(Number.isNaN(result.subtotal), false);
  assert.equal(Number.isNaN(result.total), false);
  assert.equal(result.total, 0);
});

test("invalid numeric values do not produce NaN", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      items: [{ id: "item-1", description: "Service", quantity: "abc", unitPrice: "Infinity" }],
      discount: { enabled: true, type: "fixed", value: "NaN" },
      tax: { enabled: true, rate: "Infinity" }
    })
  );

  Object.values(result).forEach((value) => {
    assert.equal(Number.isNaN(value), false);
    assert.equal(Number.isFinite(value), true);
  });
});

test("calculates decimal percentage discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "percentage", value: "12.5" }
    })
  );

  assert.equal(result.discountAmount, 25);
  assert.equal(result.taxableAmount, 175);
  assert.equal(result.total, 175);
});

test("calculates decimal fixed discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "12.34" }
    })
  );

  assert.equal(result.discountAmount, 12.34);
  assert.equal(result.taxableAmount, 187.66);
  assert.equal(result.total, 187.66);
});

test("tax applies after discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "25" },
      tax: { enabled: true, rate: "10" }
    })
  );

  assert.equal(result.taxableAmount, 175);
  assert.equal(result.taxAmount, 17.5);
  assert.equal(result.total, 192.5);
});

test("valid minimal invoice passes validation", () => {
  assert.deepEqual(validateInvoice(createInvoice()), []);
});

test("missing business name fails validation", () => {
  assert.ok(messagesFor(createInvoice({ businessName: "" })).includes("Business name is required."));
});

test("missing customer name fails validation", () => {
  assert.ok(messagesFor(createInvoice({ customerName: "" })).includes("Customer name is required."));
});

test("missing invoice number fails validation", () => {
  assert.ok(messagesFor(createInvoice({ invoiceNumber: "" })).includes("Invoice number is required."));
});

test("missing invoice date fails validation", () => {
  assert.ok(messagesFor(createInvoice({ invoiceDate: "" })).includes("Invoice date is required."));
});

test("missing line item description fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        items: [{ id: "item-1", description: "", quantity: "1", unitPrice: "100" }]
      })
    ).includes("Line item 1 description is required.")
  );
});

test("quantity must be greater than 0", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        items: [{ id: "item-1", description: "Service", quantity: "0", unitPrice: "100" }]
      })
    ).includes("Line item 1 quantity must be greater than zero.")
  );
});

test("unit price must be greater than or equal to 0", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        items: [{ id: "item-1", description: "Service", quantity: "1", unitPrice: "-1" }]
      })
    ).includes("Line item 1 unit price must be zero or greater.")
  );
});

test("percentage discount over 100 fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "percentage", value: "101" }
      })
    ).includes("Discount percentage must be between 0 and 100.")
  );
});

test("valid percentage discount passes validation", () => {
  assert.deepEqual(
    validateInvoice(createInvoice({ discount: { enabled: true, type: "percentage", value: "10" } })),
    []
  );
});

test("percentage discount below 0 fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "percentage", value: "-1" }
      })
    ).includes("Discount percentage must be between 0 and 100.")
  );
});

test("percentage discount NaN fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "percentage", value: "NaN" }
      })
    ).includes("Discount value must be a valid number.")
  );
});

test("percentage discount Infinity fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "percentage", value: "Infinity" }
      })
    ).includes("Discount value must be a valid number.")
  );
});

test("valid fixed discount passes validation", () => {
  assert.deepEqual(
    validateInvoice(createInvoice({ discount: { enabled: true, type: "fixed", value: "50" } })),
    []
  );
});

test("fixed discount below 0 fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "fixed", value: "-1" }
      })
    ).includes("Discount amount cannot be negative.")
  );
});

test("fixed discount larger than subtotal fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "fixed", value: "201" }
      })
    ).includes("Discount amount cannot be greater than the subtotal.")
  );
});

test("fixed discount equal to subtotal passes validation", () => {
  assert.deepEqual(
    validateInvoice(createInvoice({ discount: { enabled: true, type: "fixed", value: "200" } })),
    []
  );
});

test("fixed discount NaN fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "fixed", value: "NaN" }
      })
    ).includes("Discount value must be a valid number.")
  );
});

test("fixed discount Infinity fails validation", () => {
  assert.ok(
    messagesFor(
      createInvoice({
        discount: { enabled: true, type: "fixed", value: "Infinity" }
      })
    ).includes("Discount value must be a valid number.")
  );
});

test("tax rate over 100 fails validation", () => {
  assert.ok(
    messagesFor(createInvoice({ tax: { enabled: true, rate: "101" } })).includes(
      "Tax rate must be between 0 and 100."
    )
  );
});

test("NaN, Infinity, and -Infinity values fail validation", () => {
  const messages = messagesFor(
    createInvoice({
      items: [
        { id: "item-1", description: "Service", quantity: "NaN", unitPrice: "Infinity" }
      ],
      discount: { enabled: true, type: "fixed", value: "-Infinity" },
      tax: { enabled: true, rate: "Infinity" }
    })
  );

  assert.ok(messages.includes("Line item 1 quantity must be a valid number."));
  assert.ok(messages.includes("Line item 1 unit price must be a valid number."));
  assert.ok(messages.includes("Discount value must be a valid number."));
  assert.ok(messages.includes("Tax rate must be a valid number."));
});

test("empty payment fields pass validation", () => {
  assert.deepEqual(validateInvoice(createInvoice()), []);
});

test("valid https payment link passes validation", () => {
  assert.deepEqual(
    validateInvoice(createInvoice({ payment: { paymentLink: "https://example.com/pay" } })),
    []
  );
});

test("valid http payment link passes validation", () => {
  assert.deepEqual(
    validateInvoice(createInvoice({ payment: { paymentLink: "http://example.com/pay" } })),
    []
  );
});

test("payment link without protocol fails validation", () => {
  assert.ok(
    messagesFor(createInvoice({ payment: { paymentLink: "example.com/pay" } })).includes(
      "Payment link must start with http:// or https://."
    )
  );
});

test("invalid payment link fails validation", () => {
  assert.ok(
    messagesFor(createInvoice({ payment: { paymentLink: "https://exa mple.com" } })).includes(
      "Payment link must start with http:// or https://."
    )
  );
});

test("bank name is not required", () => {
  assert.deepEqual(validateInvoice(createInvoice({ payment: { bankName: "" } })), []);
});

test("account holder name is not required", () => {
  assert.deepEqual(validateInvoice(createInvoice({ payment: { accountName: "" } })), []);
});

test("account number is not required", () => {
  assert.deepEqual(validateInvoice(createInvoice({ payment: { accountNumber: "" } })), []);
});

test("DuitNow ID is not required", () => {
  assert.deepEqual(validateInvoice(createInvoice({ payment: { duitNowId: "" } })), []);
});

test("payment notes are not required", () => {
  assert.deepEqual(validateInvoice(createInvoice({ payment: { notes: "" } })), []);
});

test("empty terms passes validation", () => {
  assert.deepEqual(validateInvoice(createInvoice({ terms: "" })), []);
});

test("filled terms passes validation", () => {
  assert.deepEqual(validateInvoice(createInvoice({ terms: "Payment is due in 30 days." })), []);
});

test("long terms passes validation", () => {
  assert.deepEqual(validateInvoice(createInvoice({ terms: "Terms ".repeat(200) })), []);
});

test("multiline terms passes validation", () => {
  assert.deepEqual(
    validateInvoice(
      createInvoice({
        terms: "Payment is due within 30 days.\nPlease include the invoice number."
      })
    ),
    []
  );
});

test("missing terms from old draft shape does not fail validation", () => {
  const invoice = createInvoice();
  Reflect.deleteProperty(invoice as Partial<InvoiceData>, "terms");

  assert.deepEqual(validateInvoice({ ...invoice, terms: "" }), []);
});
