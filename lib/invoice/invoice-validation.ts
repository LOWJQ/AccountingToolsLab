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

export function validateInvoice(invoice: InvoiceData): InvoiceValidationError[] {
  const errors: InvoiceValidationError[] = [];

  validateRequiredText(errors, "businessName", "Business name", invoice.businessName);
  validateRequiredText(errors, "customerName", "Customer name", invoice.customerName);
  validateRequiredText(errors, "invoiceNumber", "Invoice number", invoice.invoiceNumber);
  validateRequiredText(errors, "invoiceDate", "Invoice date", invoice.invoiceDate);

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
          message: "Percentage discount must be between 0 and 100."
        });
      }

      if (invoice.discount.type === "fixed") {
        if (discountValue < 0) {
          errors.push({
            field: "discount.value",
            message: "Fixed discount must be zero or greater."
          });
        }

        if (discountValue > calculateInvoiceTotals(invoice).subtotal) {
          errors.push({
            field: "discount.value",
            message: "Fixed discount must not exceed the subtotal."
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

  return errors;
}
