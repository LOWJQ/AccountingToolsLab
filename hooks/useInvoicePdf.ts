"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  InvoicePdfGenerationResult,
  InvoicePdfParams
} from "@/lib/invoice/invoice-pdf-generator";
import { calculateInvoiceLineItems } from "@/lib/invoice/invoice-calculations";
import { downloadBlob } from "@/lib/utils/download-blob";
import { openInvoicePdfPreview } from "@/lib/invoice/invoice-pdf-preview";

type UseInvoicePdfInput = {
  invoiceNumber: string;
  pdfParams: Omit<InvoicePdfParams, "output" | "previewItems">;
  saveUsedInvoiceNumber: (invoiceNumber: string) => void;
};

export type InvoicePdfStatus = {
  message: string;
  type: "error" | "warning";
};

export type InvoicePdfStage = "closed" | "downloaded";

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

export function useInvoicePdf({
  invoiceNumber,
  pdfParams,
  saveUsedInvoiceNumber
}: UseInvoicePdfInput) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<InvoicePdfStatus | null>(null);
  const [pdfStage, setPdfStage] = useState<InvoicePdfStage>("closed");
  const [completedPdf, setCompletedPdf] = useState<{
    blob: Blob; fileName: string; invoiceNumber: string; customerName: string; total: string;
  } | null>(null);
  const previewTabsRef = useRef<Array<{ tab: Window; url: string }>>([]);
  const generatingRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      previewTabsRef.current = previewTabsRef.current.filter((preview) => {
        if (!preview.tab.closed) return true;
        URL.revokeObjectURL(preview.url);
        return false;
      });
    }, 1000);
    return () => {
      window.clearInterval(timer);
      previewTabsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
      previewTabsRef.current = [];
    };
  }, []);

  const buildPreviewItems = useCallback(
    () =>
      calculateInvoiceLineItems(pdfParams.invoiceData.items).map((item, index) => ({
        ...item,
        description:
          pdfParams.invoiceData.items[index]?.description.trim() || `Item ${index + 1}`
      })),
    [pdfParams.invoiceData.items]
  );

  const generatePdf = useCallback(async () => {
    const { generateInvoicePdf } = await import("@/lib/invoice/invoice-pdf-generator");
    return generateInvoicePdf({ ...pdfParams, output: "blob", previewItems: buildPreviewItems() });
  }, [buildPreviewItems, pdfParams]);

  const createInvoicePdf = useCallback(async (action: "preview" | "download") => {
    if (generatingRef.current) return;
    generatingRef.current = true;
    setIsGeneratingPdf(true);
    setPdfStatus(null);
    try {
      let result: InvoicePdfGenerationResult;
      if (action === "preview") {
        const preview = await openInvoicePdfPreview(generatePdf);
        if (preview.status !== "opened") {
          setPdfStatus({ type: "warning", message: preview.status === "blocked"
            ? "Allow popups to preview, or use Download PDF."
            : "Preview closed. You can open it again." });
          return;
        }
        previewTabsRef.current.push({ tab: preview.tab, url: preview.url });
        result = preview.pdf;
      } else {
        result = await generatePdf();
      }

      if (!result.blob || !result.fileName) {
        throw new Error("The invoice PDF could not be created.");
      }

      if (result.warnings.length > 0) {
        setPdfStatus({ message: getPdfWarningMessage(result), type: "warning" });
      }

      if (action === "download") {
        downloadBlob(result.blob, result.fileName);
        setCompletedPdf({
          blob: result.blob, fileName: result.fileName, invoiceNumber,
          customerName: pdfParams.invoiceData.customerName,
          total: pdfParams.formatCurrency(pdfParams.calculation.total)
        });
        setPdfStage("downloaded");
      }
      // The native viewer can download or print without notifying the editor.
      saveUsedInvoiceNumber(invoiceNumber);
    } catch {
      setPdfStatus({
        message:
          "Invoice PDF could not be generated. Please try again, or remove uploaded images and download again.",
        type: "error"
      });
      setPdfStage("closed");
    } finally {
      generatingRef.current = false;
      setIsGeneratingPdf(false);
    }
  }, [
    generatePdf,
    invoiceNumber,
    pdfParams,
    saveUsedInvoiceNumber
  ]);

  const prepareInvoicePdf = useCallback(() => createInvoicePdf("preview"), [createInvoicePdf]);
  const downloadInvoicePdf = useCallback(() => createInvoicePdf("download"), [createInvoicePdf]);

  const returnToEditor = useCallback(() => {
    setPdfStage("closed");
    setCompletedPdf(null);
    setPdfStatus(null);
  }, []);

  const downloadCompletedPdf = useCallback(() => {
    if (completedPdf) downloadBlob(completedPdf.blob, completedPdf.fileName);
  }, [completedPdf]);

  const clearPdfStatus = useCallback(() => {
    setPdfStatus(null);
  }, []);

  return {
    clearPdfStatus,
    returnToEditor,
    completedPdf,
    downloadCompletedPdf,
    downloadInvoicePdf,
    isGeneratingPdf,
    pdfStage,
    pdfStatus,
    prepareInvoicePdf
  };
}
