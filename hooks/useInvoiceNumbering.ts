"use client";

import { useCallback } from "react";
import { getNextInvoiceNumber } from "@/lib/invoice/invoice-numbering";
import {
  loadLastInvoiceNumber,
  saveLastInvoiceNumber
} from "@/lib/invoice/invoice-storage";

export function useInvoiceNumbering() {
  const getNextInvoiceNumberSuggestion = useCallback(() => {
    const lastInvoiceNumber = loadLastInvoiceNumber();
    return lastInvoiceNumber ? getNextInvoiceNumber(lastInvoiceNumber) : null;
  }, []);

  const saveUsedInvoiceNumber = useCallback((invoiceNumber: string) => {
    saveLastInvoiceNumber(invoiceNumber);
  }, []);

  return {
    getNextInvoiceNumberSuggestion,
    saveUsedInvoiceNumber
  };
}
