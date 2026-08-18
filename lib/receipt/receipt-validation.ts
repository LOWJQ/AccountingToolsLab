import { INVOICE_TEXT_MAX_LENGTHS } from "../invoice/invoice-limits";
import { parseInvoiceMoneyAmount, parseInvoiceQuantity } from "../invoice/invoice-calculations";
import type { ReceiptData } from "./receipt-types";

export type ReceiptValidationError = {
  field: string;
  message: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value: string): boolean {
  if (!ISO_DATE.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/**
 * Checks a receipt is complete enough to hand to a customer as proof of
 * payment. Deliberately narrower than the invoice validator: a receipt has no
 * due date to compare against and no bank details to check.
 */
export function validateReceipt(receipt: ReceiptData): ReceiptValidationError[] {
  const errors: ReceiptValidationError[] = [];

  const requiredText: {
    field: keyof ReceiptData & string;
    label: string;
    max: number;
    value: string;
  }[] = [
    {
      field: "businessName",
      label: "Business name",
      max: INVOICE_TEXT_MAX_LENGTHS.businessName,
      value: receipt.businessName
    },
    {
      field: "receivedFrom",
      label: "Received from",
      max: INVOICE_TEXT_MAX_LENGTHS.customerName,
      value: receipt.receivedFrom
    },
    {
      field: "receiptNumber",
      label: "Receipt number",
      max: INVOICE_TEXT_MAX_LENGTHS.invoiceNumber,
      value: receipt.receiptNumber
    }
  ];

  for (const entry of requiredText) {
    if (entry.value.trim() === "") {
      errors.push({ field: entry.field, message: `${entry.label} is required.` });
    } else if (entry.value.length > entry.max) {
      errors.push({
        field: entry.field,
        message: `${entry.label} must be ${entry.max} characters or fewer.`
      });
    }
  }

  if (receipt.receiptDate.trim() === "") {
    errors.push({ field: "receiptDate", message: "Payment date is required." });
  } else if (!isRealDate(receipt.receiptDate)) {
    errors.push({ field: "receiptDate", message: "Payment date must be a real date." });
  }

  if (receipt.paymentMethod === "other" && receipt.paymentMethodOther.trim() === "") {
    errors.push({
      field: "paymentMethodOther",
      message: "Describe the payment method."
    });
  }

  if (receipt.items.length === 0) {
    errors.push({ field: "items", message: "Add at least one item." });
  }

  receipt.items.forEach((item, index) => {
    const position = index + 1;

    if (item.description.trim() === "") {
      errors.push({
        field: `items.${index}.description`,
        message: `Item ${position} needs a description.`
      });
    } else if (item.description.length > INVOICE_TEXT_MAX_LENGTHS.lineItemDescription) {
      errors.push({
        field: `items.${index}.description`,
        message: `Item ${position} description is too long.`
      });
    }

    const quantity = parseInvoiceQuantity(item.quantity);

    if (quantity === null || quantity <= 0) {
      errors.push({
        field: `items.${index}.quantity`,
        message: `Item ${position} needs a quantity greater than zero.`
      });
    }

    const unitPrice = parseInvoiceMoneyAmount(item.unitPrice);

    if (unitPrice === null || unitPrice < 0) {
      errors.push({
        field: `items.${index}.unitPrice`,
        message: `Item ${position} needs a unit price of zero or more.`
      });
    }
  });

  if (receipt.notes.length > INVOICE_TEXT_MAX_LENGTHS.notes) {
    errors.push({ field: "notes", message: "Notes are too long." });
  }

  return errors;
}
