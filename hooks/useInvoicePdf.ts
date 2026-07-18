"use client";

import { useCallback, useState } from "react";
import type {
  InvoicePdfGenerationResult,
  InvoicePdfParams
} from "@/lib/invoice/invoice-pdf-generator";
import { calculateInvoiceLineItems } from "@/lib/invoice/invoice-calculations";

type UseInvoicePdfInput = {
  hasValidInvoice: boolean;
  invoiceNumber: string;
  onDownloadComplete: () => void;
  pdfParams: Omit<InvoicePdfParams, "previewItems">;
  saveUsedInvoiceNumber: (invoiceNumber: string) => void;
};

export type InvoicePdfStatus = {
  message: string;
  type: "error" | "warning";
};

function getPdfWarningMessage(result: InvoicePdfGenerationResult): string {
  const hasLogoWarning = result.warnings.includes("business-logo-skipped");
  const hasQrWarning = result.warnings.includes("payment-qr-skipped");

  if (hasLogoWarning && hasQrWarning) {
    return "Invoice PDF downloaded, but the uploaded logo and payment QR image could not be added. Try re-uploading the images if needed.";
  }

  if (hasLogoWarning) {
    return "Invoice PDF downloaded, but the uploaded logo could not be added. Try re-uploading the logo if needed.";
  }

  return "Invoice PDF downloaded, but the payment QR image could not be added. Try re-uploading the QR image if needed.";
}

export function useInvoicePdf({
  hasValidInvoice,
  invoiceNumber,
  onDownloadComplete,
  pdfParams,
  saveUsedInvoiceNumber
}: UseInvoicePdfInput) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<InvoicePdfStatus | null>(null);

  const downloadInvoicePdf = useCallback(async () => {
    if (!hasValidInvoice) {
      return;
    }

    setIsGeneratingPdf(true);
    setPdfStatus(null);

    try {
      const previewItems = calculateInvoiceLineItems(pdfParams.invoiceData.items).map(
        (item, index) => ({
          ...item,
          description:
            pdfParams.invoiceData.items[index]?.description.trim() || `Item ${index + 1}`
        })
      );
      const { generateInvoicePdf } = await import("@/lib/invoice/invoice-pdf-generator");
      const result = await generateInvoicePdf({
        ...pdfParams,
        previewItems
      });
      saveUsedInvoiceNumber(invoiceNumber);
      onDownloadComplete();
      if (result.warnings.length > 0) {
        setPdfStatus({
          message: getPdfWarningMessage(result),
          type: "warning"
        });
      }
    } catch {
      setPdfStatus({
        message:
          "Invoice PDF could not be generated. Please try again, or remove uploaded images and download again.",
        type: "error"
      });
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

  const clearPdfStatus = useCallback(() => {
    setPdfStatus(null);
  }, []);

  return {
    clearPdfStatus,
    downloadInvoicePdf,
    isGeneratingPdf,
    pdfStatus
  };
}
