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
      validationErrors.filter((error) =>
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
        return getFallbackLineItemError(lineItems[index], index, key);
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
