import assert from "node:assert/strict";
import {
  calculateInvoiceTotals,
  parseInvoiceMoneyAmount,
  parseInvoicePercentage,
  parseInvoiceQuantity
} from "../lib/invoice/invoice-calculations";
import { formatLineItemErrorForDisplay } from "../lib/invoice/invoice-line-item-error-display";
import { INVOICE_TEXT_MAX_LENGTHS } from "../lib/invoice/invoice-limits";
import type { InvoiceData } from "../lib/invoice/invoice-types";
import { shouldShowInvoiceValidationError } from "../lib/invoice/invoice-validation-display";
import { validateInvoice } from "../lib/invoice/invoice-validation";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

type InvoiceTaxOverride = Partial<InvoiceData["tax"][number]>;
type InvoiceTestOverrides = Partial<Omit<InvoiceData, "discount" | "payment" | "shipping" | "tax">> & {
  discount?: Partial<InvoiceData["discount"]>;
  payment?: Partial<InvoiceData["payment"]>;
  shipping?: Partial<InvoiceData["shipping"]>;
  tax?: InvoiceTaxOverride | InvoiceTaxOverride[];
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
  const baseShipping = baseInvoice.shipping ?? { enabled: false, label: "Shipping", amount: "0" };
  const taxOverrides = overrides.tax
    ? Array.isArray(overrides.tax)
      ? overrides.tax
      : [overrides.tax]
    : undefined;

  return {
    ...baseInvoice,
    ...overrides,
    discount: {
      ...baseInvoice.discount,
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
      : baseInvoice.tax,
    shipping: {
      enabled: overrides.shipping?.enabled ?? baseShipping.enabled,
      label: overrides.shipping?.label ?? baseShipping.label,
      amount: overrides.shipping?.amount ?? baseShipping.amount
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

function fieldMessagesFor(invoice: InvoiceData): Record<string, string> {
  return Object.fromEntries(validateInvoice(invoice).map((error) => [error.field, error.message]));
}

test("calculates no tax and no discount", () => {
  const result = calculateInvoiceTotals(createInvoice());

  assert.deepEqual(result, {
    subtotal: 200,
    discountAmount: 0,
    taxableAmount: 200,
    taxAmount: 0,
    taxLines: [],
    shippingAmount: 0,
    total: 200
  });
});

test("calculates tax enabled and no discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({ tax: { enabled: true, type: "percentage", value: "6" } })
  );

  assert.equal(result.subtotal, 200);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.taxableAmount, 200);
  assert.equal(result.taxAmount, 12);
  assert.equal(result.total, 212);
});

test("calculates multiple percentage and fixed tax rows", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      tax: [
        { enabled: true, label: "SST", type: "percentage", value: "6" },
        { enabled: true, label: "Service tax", type: "percentage", value: "2" },
        { enabled: true, label: "Additional tax", type: "fixed", value: "5" }
      ]
    })
  );

  assert.equal(result.taxAmount, 21);
  assert.deepEqual(
    result.taxLines.map((taxLine) => ({
      label: taxLine.label,
      type: taxLine.type,
      amount: taxLine.amount
    })),
    [
      { label: "SST", type: "percentage", amount: 12 },
      { label: "Service tax", type: "percentage", amount: 4 },
      { label: "Additional tax", type: "fixed", amount: 5 }
    ]
  );
  assert.equal(result.total, 221);
});

test("calculates 10 percent discount before tax", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "percentage", value: "10" },
      tax: { enabled: true, type: "percentage", value: "6" }
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
      tax: { enabled: true, type: "percentage", value: "8" }
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
      tax: { enabled: true, type: "percentage", value: "6" }
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
      tax: { enabled: true, type: "percentage", value: "6" }
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
      tax: { enabled: true, type: "percentage", value: "6" }
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
      tax: { enabled: true, type: "percentage", value: "Infinity" }
    })
  );

  Object.values(result).filter((value) => typeof value === "number").forEach((value) => {
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

test("calculates shipping after tax and discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "20" },
      shipping: { enabled: true, label: "Shipping", amount: "15.50" },
      tax: { enabled: true, type: "percentage", value: "10" }
    })
  );

  assert.equal(result.subtotal, 200);
  assert.equal(result.discountAmount, 20);
  assert.equal(result.taxableAmount, 180);
  assert.equal(result.taxAmount, 18);
  assert.equal(result.shippingAmount, 15.5);
  assert.equal(result.total, 213.5);
});

test("tax applies after discount", () => {
  const result = calculateInvoiceTotals(
    createInvoice({
      discount: { enabled: true, type: "fixed", value: "25" },
      tax: { enabled: true, type: "percentage", value: "10" }
    })
  );

  assert.equal(result.taxableAmount, 175);
  assert.equal(result.taxAmount, 17.5);
  assert.equal(result.total, 192.5);
});

test("money parser accepts normal currency amounts and rejects unsafe formats", () => {
  assert.equal(parseInvoiceMoneyAmount("100"), 100);
  assert.equal(parseInvoiceMoneyAmount("100.50"), 100.5);
  assert.equal(parseInvoiceMoneyAmount(".50"), 0.5);
  assert.equal(parseInvoiceMoneyAmount("100.555"), null);
  assert.equal(parseInvoiceMoneyAmount("1e2"), null);
  assert.equal(parseInvoiceMoneyAmount("Infinity"), null);
  assert.equal(parseInvoiceMoneyAmount("NaN"), null);
  assert.equal(parseInvoiceMoneyAmount(""), null);
  assert.equal(parseInvoiceMoneyAmount("1,000.00"), null);
});

test("quantity parser allows practical decimal quantities and rejects unsafe formats", () => {
  assert.equal(parseInvoiceQuantity("1"), 1);
  assert.equal(parseInvoiceQuantity("1.2345"), 1.2345);
  assert.equal(parseInvoiceQuantity(".25"), 0.25);
  assert.equal(parseInvoiceQuantity("1.23456"), null);
  assert.equal(parseInvoiceQuantity("1e2"), null);
  assert.equal(parseInvoiceQuantity("Infinity"), null);
  assert.equal(parseInvoiceQuantity(""), null);
});

test("percentage parser allows decimal percentages and rejects unsafe formats", () => {
  assert.equal(parseInvoicePercentage("6"), 6);
  assert.equal(parseInvoicePercentage("6.1234"), 6.1234);
  assert.equal(parseInvoicePercentage(".5"), 0.5);
  assert.equal(parseInvoicePercentage("6.12345"), null);
  assert.equal(parseInvoicePercentage("6e0"), null);
  assert.equal(parseInvoicePercentage("NaN"), null);
  assert.equal(parseInvoicePercentage(""), null);
});

test("valid minimal invoice passes validation", () => {
  assert.deepEqual(validateInvoice(createInvoice()), []);
});

test("invoice UI validation display waits for touched fields or an attempted action", () => {
  const touchedFields = new Set(["items.0.description"]);

  assert.equal(
    shouldShowInvoiceValidationError("items.0.description", { touchedFields }),
    true
  );
  assert.equal(
    shouldShowInvoiceValidationError("items.0.unitPrice", { touchedFields }),
    false
  );
  assert.equal(
    shouldShowInvoiceValidationError("items.0.unitPrice", {
      showAllErrors: true,
      touchedFields
    }),
    true
  );
  assert.equal(shouldShowInvoiceValidationError("items", { touchedFields }), true);
  assert.equal(
    shouldShowInvoiceValidationError("businessName", { touchedFields }),
    false
  );
});

test("line item UI errors use short field-level messages", () => {
  assert.equal(
    formatLineItemErrorForDisplay("Line item 1 description is required.", "description"),
    "Enter a description."
  );
  assert.equal(
    formatLineItemErrorForDisplay("Line item 1 quantity must be a valid number.", "quantity"),
    "Enter a valid quantity."
  );
  assert.equal(
    formatLineItemErrorForDisplay("Line item 1 unit price must be a valid number.", "unitPrice"),
    "Enter a valid price."
  );
  assert.equal(formatLineItemErrorForDisplay("", "quantity"), "");
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

test("strict valid date is accepted", () => {
  assert.deepEqual(validateInvoice(createInvoice({ dueDate: "2026-05-15" })), []);
  assert.deepEqual(validateInvoice(createInvoice({ invoiceDate: "2028-02-29" })), []);
});

test("impossible invoice and due dates fail validation", () => {
  assert.ok(
    messagesFor(createInvoice({ invoiceDate: "2026-02-30" })).includes(
      "Invoice date must be a valid date."
    )
  );
  assert.ok(
    messagesFor(createInvoice({ dueDate: "2026-13-01" })).includes(
      "Due date must be a valid date."
    )
  );
});

test("malformed invoice and due dates fail validation", () => {
  assert.ok(
    messagesFor(createInvoice({ invoiceDate: "05/08/2026" })).includes(
      "Invoice date must be a valid date."
    )
  );
  assert.ok(
    messagesFor(createInvoice({ dueDate: "2026-5-8" })).includes(
      "Due date must be a valid date."
    )
  );
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

test("shipping amount validation rejects invalid values", () => {
  assert.ok(
    messagesFor(createInvoice({ shipping: { enabled: true, amount: "NaN" } })).includes(
      "Shipping amount must be a valid number."
    )
  );
  assert.ok(
    messagesFor(createInvoice({ shipping: { enabled: true, amount: "-1" } })).includes(
      "Shipping amount cannot be negative."
    )
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
    messagesFor(createInvoice({ tax: { enabled: true, type: "percentage", value: "101" } })).includes(
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
      tax: { enabled: true, type: "percentage", value: "Infinity" }
    })
  );

  assert.ok(messages.includes("Line item 1 quantity must be a valid number."));
  assert.ok(messages.includes("Line item 1 unit price must be a valid number."));
  assert.ok(messages.includes("Discount value must be a valid number."));
  assert.ok(messages.includes("Tax rate must be a valid number."));
});

test("exponent notation is rejected for invoice money and quantity fields", () => {
  const messages = messagesFor(
    createInvoice({
      items: [
        { id: "item-1", description: "Service", quantity: "1e2", unitPrice: "1e3" }
      ],
      discount: { enabled: true, type: "fixed", value: "2e1" },
      tax: { enabled: true, type: "percentage", value: "6e0" }
    })
  );

  assert.ok(messages.includes("Line item 1 quantity must be a valid number."));
  assert.ok(messages.includes("Line item 1 unit price must be a valid number."));
  assert.ok(messages.includes("Discount value must be a valid number."));
  assert.ok(messages.includes("Tax rate must be a valid number."));
});

test("comma-formatted money and quantity fields are rejected", () => {
  const messages = messagesFor(
    createInvoice({
      items: [
        { id: "item-1", description: "Service", quantity: "1,000", unitPrice: "2,500.00" }
      ],
      discount: { enabled: true, type: "fixed", value: "1,000" }
    })
  );

  assert.ok(messages.includes("Line item 1 quantity must be a valid number."));
  assert.ok(messages.includes("Line item 1 unit price must be a valid number."));
  assert.ok(messages.includes("Discount value must be a valid number."));
});

test("money fields reject more than two decimal places", () => {
  const messages = messagesFor(
    createInvoice({
      items: [
        { id: "item-1", description: "Service", quantity: "1", unitPrice: "100.555" }
      ],
      discount: { enabled: true, type: "fixed", value: "1.234" }
    })
  );

  assert.ok(messages.includes("Line item 1 unit price must be a valid number."));
  assert.ok(messages.includes("Discount value must be a valid number."));
});

test("quantity and percentage fields keep practical decimal support", () => {
  assert.deepEqual(
    validateInvoice(
      createInvoice({
        items: [
          { id: "item-1", description: "Service", quantity: "1.2345", unitPrice: "100.55" }
        ],
        discount: { enabled: true, type: "percentage", value: "12.3456" },
        tax: { enabled: true, type: "percentage", value: "6.1234" }
      })
    ),
    []
  );
});

test("oversized invoice text fields fail validation", () => {
  const limits = INVOICE_TEXT_MAX_LENGTHS;
  const errors = fieldMessagesFor(
    createInvoice({
      businessName: "B".repeat(limits.businessName + 1),
      businessContact: "C".repeat(limits.businessContact + 1),
      businessAddress: "A".repeat(limits.businessAddress + 1),
      customerName: "N".repeat(limits.customerName + 1),
      customerContact: "E".repeat(limits.customerContact + 1),
      customerAddress: "D".repeat(limits.customerAddress + 1),
      invoiceNumber: "I".repeat(limits.invoiceNumber + 1),
      notes: "N".repeat(limits.notes + 1),
      terms: "T".repeat(limits.terms + 1),
      items: [
        {
          id: "item-1",
          description: "L".repeat(limits.lineItemDescription + 1),
          quantity: "1",
          unitPrice: "100"
        }
      ],
      payment: {
        bankName: "B".repeat(limits.bankName + 1),
        accountName: "A".repeat(limits.accountName + 1),
        accountNumber: "1".repeat(limits.accountNumber + 1),
        duitNowId: "D".repeat(limits.duitNowId + 1),
        paymentLink: "https://example.com/" + "p".repeat(limits.paymentLink),
        notes: "P".repeat(limits.paymentNotes + 1)
      }
    })
  );

  assert.equal(errors.businessName, `Business name must be ${limits.businessName} characters or less.`);
  assert.equal(
    errors.businessContact,
    `Business email or phone must be ${limits.businessContact} characters or less.`
  );
  assert.equal(
    errors.businessAddress,
    `Business address must be ${limits.businessAddress} characters or less.`
  );
  assert.equal(errors.customerName, `Customer name must be ${limits.customerName} characters or less.`);
  assert.equal(
    errors.customerContact,
    `Customer email or phone must be ${limits.customerContact} characters or less.`
  );
  assert.equal(
    errors.customerAddress,
    `Customer address must be ${limits.customerAddress} characters or less.`
  );
  assert.equal(errors.invoiceNumber, `Invoice number must be ${limits.invoiceNumber} characters or less.`);
  assert.equal(errors.notes, `Notes must be ${limits.notes} characters or less.`);
  assert.equal(errors.terms, `Terms and conditions must be ${limits.terms} characters or less.`);
  assert.equal(
    errors["items.0.description"],
    `Line item 1 description must be ${limits.lineItemDescription} characters or less.`
  );
  assert.equal(errors["payment.bankName"], `Bank name must be ${limits.bankName} characters or less.`);
  assert.equal(
    errors["payment.accountName"],
    `Account holder name must be ${limits.accountName} characters or less.`
  );
  assert.equal(
    errors["payment.accountNumber"],
    `Account number must be ${limits.accountNumber} characters or less.`
  );
  assert.equal(errors["payment.duitNowId"], `DuitNow ID must be ${limits.duitNowId} characters or less.`);
  assert.equal(
    errors["payment.paymentLink"],
    `Payment link must be ${limits.paymentLink} characters or less.`
  );
  assert.equal(
    errors["payment.notes"],
    `Payment notes must be ${limits.paymentNotes} characters or less.`
  );
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

test("unsupported payment link protocol fails validation", () => {
  assert.ok(
    messagesFor(createInvoice({ payment: { paymentLink: "javascript:alert(1)" } })).includes(
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
