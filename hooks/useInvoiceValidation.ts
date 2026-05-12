"use client";

import { useCallback, useMemo } from "react";
import {
  calculateInvoiceLineItems,
  calculateInvoiceTotals
} from "@/lib/invoice/invoice-calculations";
import type { InvoiceData, InvoiceLineItem } from "@/lib/invoice/invoice-types";
import { validateInvoice } from "@/lib/invoice/invoice-validation";

export function useInvoiceValidation(invoiceData: InvoiceData, lineItems: InvoiceLineItem[]) {
  const calculation = useMemo(() => calculateInvoiceTotals(invoiceData), [invoiceData]);
  const validationErrors = useMemo(() => validateInvoice(invoiceData), [invoiceData]);
  const lineItemPreviewTotals = useMemo(
    () => calculateInvoiceLineItems(lineItems).map((item) => item.lineTotal),
    [lineItems]
  );
  const lineItemsMessage = useMemo(() => {
    const lineItemError = validationErrors.find((error) => error.field === "items");
    return lineItemError?.message ?? "";
  }, [validationErrors]);
  const hasValidInvoice = validationErrors.length === 0;
  const getValidationMessage = useCallback(
    (field: string) => validationErrors.find((error) => error.field === field)?.message ?? "",
    [validationErrors]
  );
  const getLineItemError = useCallback(
    (index: number, key: "description" | "quantity" | "unitPrice") =>
      getValidationMessage(`items.${index}.${key}`),
    [getValidationMessage]
  );

  return {
    calculation,
    getLineItemError,
    getValidationMessage,
    hasValidInvoice,
    lineItemPreviewTotals,
    lineItemsMessage,
    validationErrors
  };
}
