"use client";

import { useCallback, useMemo } from "react";
import {
  calculateInvoiceLineItems,
  calculateInvoiceTotals,
  parseInvoiceMoneyAmount,
  parseInvoiceQuantity
} from "@/lib/invoice/invoice-calculations";
import {
  shouldShowInvoiceValidationError,
  type InvoiceValidationDisplayOptions
} from "@/lib/invoice/invoice-validation-display";
import type { InvoiceData, InvoiceLineItem } from "@/lib/invoice/invoice-types";
import { validateInvoice } from "@/lib/invoice/invoice-validation";

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
  const calculation = useMemo(() => calculateInvoiceTotals(invoiceData), [invoiceData]);
  const validationErrors = useMemo(() => validateInvoice(invoiceData), [invoiceData]);
  const visibleValidationErrors = useMemo(
    () =>
      validationErrors.filter((error) =>
        shouldShowInvoiceValidationError(error.field, displayOptions)
      ),
    [displayOptions, validationErrors]
  );
  const lineItemPreviewTotals = useMemo(
    () => calculateInvoiceLineItems(lineItems).map((item) => item.lineTotal),
    [lineItems]
  );
  const lineItemsMessage = useMemo(() => {
    const lineItemError = visibleValidationErrors.find((error) => error.field === "items");
    return lineItemError?.message ?? "";
  }, [visibleValidationErrors]);
  const hasValidInvoice = validationErrors.length === 0;
  const getValidationMessage = useCallback(
    (field: string) => visibleValidationErrors.find((error) => error.field === field)?.message ?? "",
    [visibleValidationErrors]
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
    lineItemsMessage,
    visibleValidationErrors,
    validationErrors
  };
}
