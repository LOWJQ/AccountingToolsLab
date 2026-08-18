"use client";

import { useCallback, useMemo } from "react";
import {
  calculateInvoiceWithLineItems,
  parseInvoiceMoneyAmount,
  parseInvoiceQuantity
} from "@/lib/invoice/invoice-calculations";
import {
  shouldShowInvoiceValidationError,
  type InvoiceValidationDisplayOptions
} from "@/lib/invoice/invoice-validation-display";
import type { InvoiceData, InvoiceLineItem } from "@/lib/invoice/invoice-types";
import { validateInvoiceWithSubtotal } from "@/lib/invoice/invoice-validation";

function getFallbackLineItemError(
  item: InvoiceLineItem | undefined,
  index: number,
  key: "description" | "quantity" | "unitPrice"
) {
  if (!item) {
    return "";
  }

  const itemNumber = index + 1;

  if (key === "description" && item.description.trim() === "") {
    return `Line item ${itemNumber} description is required.`;
  }

  if (key === "quantity") {
    const quantity = parseInvoiceQuantity(item.quantity);

    if (quantity === null || quantity <= 0 || quantity > 1000000) {
      return `Line item ${itemNumber} quantity must be a valid number.`;
    }
  }

  if (key === "unitPrice") {
    const unitPrice = parseInvoiceMoneyAmount(item.unitPrice);

    if (unitPrice === null || unitPrice < 0 || unitPrice > 1000000000) {
      return `Line item ${itemNumber} unit price must be a valid number.`;
    }
  }

  return "";
}

/**
 * "X is required" errors are not surfaced. The invoice downloads with whatever
 * has been filled in, so nagging about blanks would flag something that is not
 * actually a problem. Errors about wrong values, such as an impossible date or
 * a tax rate over 100, are still shown.
 *
 * validateInvoice itself is left intact: it is the shared correctness contract
 * covered by the test suite, and only the display layer filters.
 */
function isRequiredFieldError(message: string): boolean {
  return message.trim().endsWith("is required.");
}

export function useInvoiceValidation(
  invoiceData: InvoiceData,
  lineItems: InvoiceLineItem[],
  displayOptions: InvoiceValidationDisplayOptions = {}
) {
  const invoiceCalculation = useMemo(
    () => calculateInvoiceWithLineItems(invoiceData),
    [invoiceData]
  );
  const { calculation, lineItems: calculatedLineItems } = invoiceCalculation;
  const validationErrors = useMemo(
    () => validateInvoiceWithSubtotal(invoiceData, calculation.subtotal),
    [calculation.subtotal, invoiceData]
  );
  const visibleValidationErrors = useMemo(
    () =>
      validationErrors.filter(
        (error) =>
          !isRequiredFieldError(error.message) &&
          shouldShowInvoiceValidationError(error.field, displayOptions)
      ),
    [displayOptions, validationErrors]
  );
  const lineItemPreviewTotals = useMemo(
    () => calculatedLineItems.map((item) => item.lineTotal),
    [calculatedLineItems]
  );
  const validationMessageByField = useMemo(() => {
    const messages = new Map<string, string>();

    visibleValidationErrors.forEach((error) => {
      if (!messages.has(error.field)) {
        messages.set(error.field, error.message);
      }
    });

    return messages;
  }, [visibleValidationErrors]);
  const lineItemsMessage = validationMessageByField.get("items") ?? "";
  const hasValidInvoice = validationErrors.length === 0;
  const getValidationMessage = useCallback(
    (field: string) => validationMessageByField.get(field) ?? "",
    [validationMessageByField]
  );
  const getLineItemError = useCallback(
    (index: number, key: "description" | "quantity" | "unitPrice") => {
      const field = `items.${index}.${key}`;
      const validationMessage = getValidationMessage(field);

      if (validationMessage) {
        return validationMessage;
      }

      if (shouldShowInvoiceValidationError(field, displayOptions)) {
        const fallback = getFallbackLineItemError(lineItems[index], index, key);

        // Same rule as above: an empty line item is allowed to stay empty.
        return isRequiredFieldError(fallback) ? "" : fallback;
      }

      return "";
    },
    [displayOptions, getValidationMessage, lineItems]
  );

  return {
    calculation,
    getLineItemError,
    getValidationMessage,
    hasValidInvoice,
    lineItemPreviewTotals,
    lineItemsMessage
  };
}
