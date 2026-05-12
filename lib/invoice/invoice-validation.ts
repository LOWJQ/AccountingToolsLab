import { calculateInvoiceTotals, parseInvoiceNumber } from "./invoice-calculations";
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

function parseDateInput(value: string): number | null {
  if (isBlank(value)) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  const parsedTime = parsedDate.getTime();

  return Number.isFinite(parsedTime) ? parsedTime : null;
}

function parseRequiredFiniteNumber(
  errors: InvoiceValidationError[],
  field: string,
  label: string,
  value: string
): number | null {
  const parsedValue = parseInvoiceNumber(value);

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

  validateRequiredText(errors, "businessName", "Business name", invoice.businessName);
  validateRequiredText(errors, "customerName", "Customer name", invoice.customerName);
  validateRequiredText(errors, "invoiceNumber", "Invoice number", invoice.invoiceNumber);
  validateRequiredText(errors, "invoiceDate", "Invoice date", invoice.invoiceDate);
  validateTextLength(errors, "businessName", "Business name", invoice.businessName, 120);
  validateTextLength(errors, "customerName", "Customer name", invoice.customerName, 120);
  validateTextLength(errors, "invoiceNumber", "Invoice number", invoice.invoiceNumber, 60);
  validateTextLength(errors, "notes", "Notes", invoice.notes, 800);

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
      180
    );

    const quantity = parseRequiredFiniteNumber(
      errors,
      `items.${index}.quantity`,
      `Line item ${itemNumber} quantity`,
      item.quantity
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
      item.unitPrice
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
      invoice.discount.value
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
    const taxRate = parseRequiredFiniteNumber(errors, "tax.rate", "Tax rate", invoice.tax.rate);

    if (taxRate !== null && (taxRate < 0 || taxRate > 100)) {
      errors.push({
        field: "tax.rate",
        message: "Tax rate must be between 0 and 100."
      });
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
