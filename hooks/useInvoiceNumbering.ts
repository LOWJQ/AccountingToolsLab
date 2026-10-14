"use client";

import { useCallback } from "react";
import { getNextInvoiceNumber, getUnusedInvoiceNumber } from "@/lib/invoice/invoice-numbering";
import { DEFAULT_INVOICE_NUMBER } from "@/lib/invoice/invoice-defaults";
import { listInvoices } from "@/lib/invoice/invoice-library";
import {
  loadLastInvoiceNumber,
  saveLastInvoiceNumber
} from "@/lib/invoice/invoice-storage";

export function useInvoiceNumbering() {
  const getNextInvoiceNumberSuggestion = useCallback(() => {
    const lastInvoiceNumber = loadLastInvoiceNumber();
    return getUnusedInvoiceNumber(
      (lastInvoiceNumber ? getNextInvoiceNumber(lastInvoiceNumber) : null) ?? DEFAULT_INVOICE_NUMBER,
      listInvoices().map((invoice) => invoice.invoiceNumber)
    );
  }, []);

  const saveUsedInvoiceNumber = useCallback((invoiceNumber: string) => {
    saveLastInvoiceNumber(invoiceNumber);
  }, []);

  return {
    getNextInvoiceNumberSuggestion,
    saveUsedInvoiceNumber
  };
}
