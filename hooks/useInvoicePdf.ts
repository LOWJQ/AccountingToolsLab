"use client";

import { useCallback, useState } from "react";
import {
  generateInvoicePdf,
  type InvoicePdfParams
} from "@/lib/invoice/invoice-pdf-generator";

type UseInvoicePdfInput = {
  hasValidInvoice: boolean;
  invoiceNumber: string;
  onDownloadComplete: () => void;
  pdfParams: InvoicePdfParams;
  saveUsedInvoiceNumber: (invoiceNumber: string) => void;
};

export function useInvoicePdf({
  hasValidInvoice,
  invoiceNumber,
  onDownloadComplete,
  pdfParams,
  saveUsedInvoiceNumber
}: UseInvoicePdfInput) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const downloadInvoicePdf = useCallback(async () => {
    if (!hasValidInvoice) {
      return;
    }

    setIsGeneratingPdf(true);

    try {
      await generateInvoicePdf(pdfParams);
      saveUsedInvoiceNumber(invoiceNumber);
      onDownloadComplete();
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    hasValidInvoice,
    invoiceNumber,
    onDownloadComplete,
    pdfParams,
    saveUsedInvoiceNumber
  ]);

  return {
    downloadInvoicePdf,
    isGeneratingPdf
  };
}
