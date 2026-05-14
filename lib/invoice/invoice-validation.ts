import {
  calculateInvoiceTotals,
  parseInvoiceMoneyAmount,
  parseInvoicePercentage,
  parseInvoiceQuantity
} from "./invoice-calculations";
import { INVOICE_TEXT_MAX_LENGTHS } from "./invoice-limits";
import type { InvoiceData, InvoiceLineItem } from "./invoice-types";

export type InvoiceValidationError = {
  field: string;
  message: string;
};

function isBlank(value: string): boolean {
  return value.trim() === "";
}

function validateRequiredText(
  errors: InvoiceValidationError[],
  field: string,
  label: string,
  value: string
) {
  if (isBlank(value)) {
    errors.push({
      field,
      message: `${label} is required.`
    });
  }
}

function validateTextLength(
  errors: InvoiceValidationError[],
  field: string,
  label: string,
  value: string,
  maxLength: number
) {
  if (value.trim().length > maxLength) {
    errors.push({
      field,
      message: `${label} must be ${maxLength} characters or less.`
    });
  }
}

function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    const isLeapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    return isLeapYear ? 29 : 28;
  }

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function parseDateInput(value: string): number | null {
  if (isBlank(value)) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12) {
    return null;
  }

  if (day < 1 || day > getDaysInMonth(year, month)) {
    return null;
  }

  return year * 10000 + month * 100 + day;
}

function parseRequiredFiniteNumber(
  errors: InvoiceValidationError[],
  field: string,
  label: string,
  value: string,
  parser: (value: string) => number | null
): number | null {
  const parsedValue = parser(value);

  if (parsedValue === null) {
    errors.push({
      field,
      message: `${label} must be a valid number.`
    });
    return null;
  }

  return parsedValue;
}

function isActiveLineItem(item: InvoiceLineItem): boolean {
  return !isBlank(item.description) || !isBlank(item.quantity) || !isBlank(item.unitPrice);
}

function hasValidHttpUrl(value: string): boolean {
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateInvoice(invoice: InvoiceData): InvoiceValidationError[] {
  const errors: InvoiceValidationError[] = [];
  const limits = INVOICE_TEXT_MAX_LENGTHS;

  validateRequiredText(errors, "businessName", "Business name", invoice.businessName);
  validateRequiredText(errors, "customerName", "Customer name", invoice.customerName);
  validateRequiredText(errors, "invoiceNumber", "Invoice number", invoice.invoiceNumber);
  validateRequiredText(errors, "invoiceDate", "Invoice date", invoice.invoiceDate);
  validateTextLength(errors, "businessName", "Business name", invoice.businessName, limits.businessName);
  validateTextLength(
    errors,
    "businessContact",
    "Business email or phone",
    invoice.businessContact,
    limits.businessContact
  );
  validateTextLength(
    errors,
    "businessAddress",
    "Business address",
    invoice.businessAddress,
    limits.businessAddress
  );
  validateTextLength(errors, "customerName", "Customer name", invoice.customerName, limits.customerName);
  validateTextLength(
    errors,
    "customerContact",
    "Customer email or phone",
    invoice.customerContact,
    limits.customerContact
  );
  validateTextLength(
    errors,
    "customerAddress",
    "Customer address",
    invoice.customerAddress,
    limits.customerAddress
  );
  validateTextLength(errors, "invoiceNumber", "Invoice number", invoice.invoiceNumber, limits.invoiceNumber);
  validateTextLength(errors, "notes", "Notes", invoice.notes, limits.notes);
  validateTextLength(errors, "terms", "Terms and conditions", invoice.terms, limits.terms);
  validateTextLength(
    errors,
    "payment.bankName",
    "Bank name",
    invoice.payment.bankName,
    limits.bankName
  );
  validateTextLength(
    errors,
    "payment.accountName",
    "Account holder name",
    invoice.payment.accountName,
    limits.accountName
  );
  validateTextLength(
    errors,
    "payment.accountNumber",
    "Account number",
    invoice.payment.accountNumber,
    limits.accountNumber
  );
  validateTextLength(
    errors,
    "payment.duitNowId",
    "DuitNow ID",
    invoice.payment.duitNowId,
    limits.duitNowId
  );
  validateTextLength(
    errors,
    "payment.paymentLink",
    "Payment link",
    invoice.payment.paymentLink,
    limits.paymentLink
  );
  validateTextLength(
    errors,
    "payment.notes",
    "Payment notes",
    invoice.payment.notes,
    limits.paymentNotes
  );

  const parsedInvoiceDate = parseDateInput(invoice.invoiceDate);

  if (!isBlank(invoice.invoiceDate) && parsedInvoiceDate === null) {
    errors.push({
      field: "invoiceDate",
      message: "Invoice date must be a valid date."
    });
  }

  if (!isBlank(invoice.dueDate)) {
    const parsedDueDate = parseDateInput(invoice.dueDate);

    if (parsedDueDate === null) {
      errors.push({
        field: "dueDate",
        message: "Due date must be a valid date."
      });
    } else if (parsedInvoiceDate !== null && parsedDueDate < parsedInvoiceDate) {
      errors.push({
        field: "dueDate",
        message: "Due date cannot be before the invoice date."
      });
    }
  }

  if (invoice.items.length === 0) {
    errors.push({
      field: "items",
      message: "At least one line item is required."
    });
  }

  const activeItems = invoice.items.filter(isActiveLineItem);

  if (invoice.items.length > 0 && activeItems.length === 0) {
    errors.push({
      field: "items",
      message: "At least one line item is required."
    });
  }

  invoice.items.forEach((item, index) => {
    if (!isActiveLineItem(item)) {
      return;
    }

    const itemNumber = index + 1;

    if (isBlank(item.description)) {
      errors.push({
        field: `items.${index}.description`,
        message: `Line item ${itemNumber} description is required.`
      });
    }

    validateTextLength(
      errors,
      `items.${index}.description`,
      `Line item ${itemNumber} description`,
      item.description,
      limits.lineItemDescription
    );

    const quantity = parseRequiredFiniteNumber(
      errors,
      `items.${index}.quantity`,
      `Line item ${itemNumber} quantity`,
      item.quantity,
      parseInvoiceQuantity
    );

    if (quantity !== null && quantity <= 0) {
      errors.push({
        field: `items.${index}.quantity`,
        message: `Line item ${itemNumber} quantity must be greater than zero.`
      });
    }

    if (quantity !== null && quantity > 1000000) {
      errors.push({
        field: `items.${index}.quantity`,
        message: `Line item ${itemNumber} quantity must be 1,000,000 or less.`
      });
    }

    const unitPrice = parseRequiredFiniteNumber(
      errors,
      `items.${index}.unitPrice`,
      `Line item ${itemNumber} unit price`,
      item.unitPrice,
      parseInvoiceMoneyAmount
    );

    if (unitPrice !== null && unitPrice < 0) {
      errors.push({
        field: `items.${index}.unitPrice`,
        message: `Line item ${itemNumber} unit price must be zero or greater.`
      });
    }

    if (unitPrice !== null && unitPrice > 1000000000) {
      errors.push({
        field: `items.${index}.unitPrice`,
        message: `Line item ${itemNumber} unit price must be 1,000,000,000 or less.`
      });
    }

    if (quantity !== null && unitPrice !== null && quantity * unitPrice > 1000000000000) {
      errors.push({
        field: `items.${index}.unitPrice`,
        message: `Line item ${itemNumber} total is too large for the PDF layout.`
      });
    }
  });

  if (invoice.discount.enabled) {
    const discountValue = parseRequiredFiniteNumber(
      errors,
      "discount.value",
      "Discount value",
      invoice.discount.value,
      invoice.discount.type === "percentage" ? parseInvoicePercentage : parseInvoiceMoneyAmount
    );

    if (discountValue !== null) {
      if (invoice.discount.type === "percentage" && (discountValue < 0 || discountValue > 100)) {
        errors.push({
          field: "discount.value",
          message: "Discount percentage must be between 0 and 100."
        });
      }

      if (invoice.discount.type === "fixed") {
        if (discountValue < 0) {
          errors.push({
            field: "discount.value",
            message: "Discount amount cannot be negative."
          });
        }

        if (discountValue > calculateInvoiceTotals(invoice).subtotal) {
          errors.push({
            field: "discount.value",
            message: "Discount amount cannot be greater than the subtotal."
          });
        }
      }
    }
  }

  if (invoice.tax.enabled) {
    const taxRate = parseRequiredFiniteNumber(
      errors,
      "tax.rate",
      "Tax rate",
      invoice.tax.rate,
      parseInvoicePercentage
    );

    if (taxRate !== null && (taxRate < 0 || taxRate > 100)) {
      errors.push({
        field: "tax.rate",
        message: "Tax rate must be between 0 and 100."
      });
    }
  }

  if (invoice.shipping?.enabled === true) {
    const shippingAmount = parseRequiredFiniteNumber(
      errors,
      "shipping.amount",
      "Shipping amount",
      invoice.shipping.amount,
      parseInvoiceMoneyAmount
    );

    if (shippingAmount !== null) {
      if (shippingAmount < 0) {
        errors.push({
          field: "shipping.amount",
          message: "Shipping amount cannot be negative."
        });
      }

      if (shippingAmount > 1000000000) {
        errors.push({
          field: "shipping.amount",
          message: "Shipping amount must be 1,000,000,000 or less."
        });
      }
    }
  }

  const paymentLink = invoice.payment.paymentLink.trim();

  if (paymentLink !== "" && !hasValidHttpUrl(paymentLink)) {
    errors.push({
      field: "payment.paymentLink",
      message: "Payment link must start with http:// or https://."
    });
  }

  return errors;
}
