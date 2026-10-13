"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  InvoicePdfGenerationResult,
  InvoicePdfParams
} from "@/lib/invoice/invoice-pdf-generator";
import { calculateInvoiceLineItems } from "@/lib/invoice/invoice-calculations";
import { downloadBlob } from "@/lib/utils/download-blob";

type UseInvoicePdfInput = {
  invoiceNumber: string;
  pdfParams: Omit<InvoicePdfParams, "output" | "previewItems">;
  saveUsedInvoiceNumber: (invoiceNumber: string) => void;
};

export type InvoicePdfStatus = {
  message: string;
  type: "error" | "warning";
};

/** What the preview dialog is currently showing. */
export type InvoicePdfStage = "closed" | "downloaded" | "preparing" | "preview";

function getPdfWarningMessage(result: InvoicePdfGenerationResult): string {
  const hasLogoWarning = result.warnings.includes("business-logo-skipped");
  const hasQrWarning = result.warnings.includes("payment-qr-skipped");

  if (hasLogoWarning && hasQrWarning) {
    return "The invoice was created, but the uploaded logo and payment QR image could not be added. Try re-uploading the images if needed.";
  }

  if (hasLogoWarning) {
    return "The invoice was created, but the uploaded logo could not be added. Try re-uploading the logo if needed.";
  }

  return "The invoice was created, but the payment QR image could not be added. Try re-uploading the QR image if needed.";
}

/**
 * Phones do not reliably render a PDF inside an iframe — iOS Safari in
 * particular shows a blank panel — so small screens skip the preview and
 * download straight away instead of being shown an empty box.
 */
function canPreviewPdfInline(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
}

export function useInvoicePdf({
  invoiceNumber,
  pdfParams,
  saveUsedInvoiceNumber
}: UseInvoicePdfInput) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<InvoicePdfStatus | null>(null);
  const [pdfStage, setPdfStage] = useState<InvoicePdfStage>("closed");
  const [previewUrl, setPreviewUrl] = useState("");
  const previewBlobRef = useRef<Blob | null>(null);
  const previewFileNameRef = useRef("");
  const previewUrlRef = useRef("");

  const releasePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    previewBlobRef.current = null;
    previewFileNameRef.current = "";
    setPreviewUrl("");
  }, []);

  // Object URLs are held by the browser until revoked, so a preview that is
  // never opened again would leak the whole PDF.
  useEffect(() => releasePreview, [releasePreview]);

  const buildPreviewItems = useCallback(
    () =>
      calculateInvoiceLineItems(pdfParams.invoiceData.items).map((item, index) => ({
        ...item,
        description:
          pdfParams.invoiceData.items[index]?.description.trim() || `Item ${index + 1}`
      })),
    [pdfParams.invoiceData.items]
  );

  /**
   * Builds the PDF once. On a large screen it is held for preview; on a phone
   * it downloads immediately, since there is nothing useful to show first.
   * Deliberately no completeness gate: blank fields print as placeholders.
   */
  const prepareInvoicePdf = useCallback(async () => {
    setIsGeneratingPdf(true);
    setPdfStatus(null);
    setPdfStage("preparing");
    releasePreview();

    try {
      const { generateInvoicePdf } = await import("@/lib/invoice/invoice-pdf-generator");
      const result = await generateInvoicePdf({
        ...pdfParams,
        output: "blob",
        previewItems: buildPreviewItems()
      });

      if (!result.blob || !result.fileName) {
        throw new Error("The invoice PDF could not be created.");
      }

      if (result.warnings.length > 0) {
        setPdfStatus({ message: getPdfWarningMessage(result), type: "warning" });
      }

      previewBlobRef.current = result.blob;
      previewFileNameRef.current = result.fileName;

      if (canPreviewPdfInline()) {
        const url = URL.createObjectURL(result.blob);
        previewUrlRef.current = url;
        setPreviewUrl(url);
        setPdfStage("preview");
      } else {
        downloadBlob(result.blob, result.fileName);
        saveUsedInvoiceNumber(invoiceNumber);
        setPdfStage("downloaded");
      }
    } catch {
      setPdfStatus({
        message:
          "Invoice PDF could not be generated. Please try again, or remove uploaded images and download again.",
        type: "error"
      });
      setPdfStage("closed");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    buildPreviewItems,
    invoiceNumber,
    pdfParams,
    releasePreview,
    saveUsedInvoiceNumber
  ]);

  /** Saves the PDF already generated for the preview — no second render. */
  const downloadPreparedPdf = useCallback(() => {
    const blob = previewBlobRef.current;

    if (!blob) {
      return;
    }

    downloadBlob(blob, previewFileNameRef.current);
    saveUsedInvoiceNumber(invoiceNumber);
    setPdfStage("downloaded");
  }, [invoiceNumber, saveUsedInvoiceNumber]);

  const closePdfDialog = useCallback(() => {
    releasePreview();
    setPdfStage("closed");
  }, [releasePreview]);

  const clearPdfStatus = useCallback(() => {
    setPdfStatus(null);
  }, []);

  return {
    clearPdfStatus,
    closePdfDialog,
    downloadPreparedPdf,
    isGeneratingPdf,
    pdfStage,
    pdfStatus,
    prepareInvoicePdf,
    previewUrl
  };
}
