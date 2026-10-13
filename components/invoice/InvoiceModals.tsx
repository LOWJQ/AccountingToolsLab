"use client";

import { useEffect, useRef } from "react";
import { trapModalFocus } from "@/components/invoice/modal-focus";
import type { InvoicePdfStage, InvoicePdfStatus } from "@/hooks/useInvoicePdf";

type InvoiceModalsProps = {
  isClearEverythingModalOpen: boolean;
  isGeneratingPdf: boolean;
  onCancelClearEverything: () => void;
  onClosePdfDialog: () => void;
  onConfirmClearEverything: () => void;
  onDownloadPdf: () => void;
  onStartNewInvoice: () => void;
  pdfStage: InvoicePdfStage;
  pdfStatus?: InvoicePdfStatus | null;
  previewUrl: string;
};

export function InvoiceModals({
  isClearEverythingModalOpen,
  isGeneratingPdf,
  onCancelClearEverything,
  onClosePdfDialog,
  onConfirmClearEverything,
  onDownloadPdf,
  onStartNewInvoice,
  pdfStage,
  pdfStatus,
  previewUrl
}: InvoiceModalsProps) {
  const primaryPdfButtonRef = useRef<HTMLButtonElement>(null);
  const confirmClearEverythingButtonRef = useRef<HTMLButtonElement>(null);
  const pdfDialogRef = useRef<HTMLDivElement>(null);
  const clearEverythingDialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const isPdfDialogOpen = pdfStage !== "closed";
  const isAnyModalOpen = isClearEverythingModalOpen || isPdfDialogOpen;

  useEffect(() => {
    if (!isAnyModalOpen) {
      return;
    }

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;

      const previousActiveElement = previousActiveElementRef.current;

      if (previousActiveElement && document.contains(previousActiveElement)) {
        previousActiveElement.focus();
      }

      previousActiveElementRef.current = null;
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    if (!isPdfDialogOpen) {
      return;
    }

    primaryPdfButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isGeneratingPdf) {
        onClosePdfDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGeneratingPdf, isPdfDialogOpen, onClosePdfDialog, pdfStage]);

  useEffect(() => {
    if (!isClearEverythingModalOpen) {
      return;
    }

    confirmClearEverythingButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancelClearEverything();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClearEverythingModalOpen, onCancelClearEverything]);

  return (
    <>
      {isClearEverythingModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
          onClick={onCancelClearEverything}
        >
          <div
            aria-labelledby="clear-invoice-draft-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-6"
            onKeyDown={(event) => trapModalFocus(event, clearEverythingDialogRef.current)}
            onClick={(event) => event.stopPropagation()}
            ref={clearEverythingDialogRef}
            role="dialog"
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoice</p>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
              id="clear-invoice-draft-title"
            >
              Clear this invoice and your business details?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              This clears the invoice you are working on and the saved business details, logo,
              and payment information. Your other saved invoices are not affected, and your last
              used invoice number stays the same.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                onClick={onCancelClearEverything}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800"
                onClick={onConfirmClearEverything}
                ref={confirmClearEverythingButtonRef}
                type="button"
              >
                Clear everything
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isPdfDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
          onClick={() => {
            if (!isGeneratingPdf) {
              onClosePdfDialog();
            }
          }}
        >
          <div
            aria-labelledby="invoice-pdf-dialog-title"
            aria-modal="true"
            className={`flex max-h-[90vh] w-full flex-col rounded-2xl border border-stone-200 bg-white shadow-2xl ${
              pdfStage === "preview" ? "max-w-4xl" : "max-w-md"
            }`}
            onKeyDown={(event) => trapModalFocus(event, pdfDialogRef.current)}
            onClick={(event) => event.stopPropagation()}
            ref={pdfDialogRef}
            role="dialog"
          >
            <div className="p-5 sm:p-6">
              <p className="text-sm font-medium tracking-wide text-slate-500">Invoice PDF</p>
              <h2
                className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
                id="invoice-pdf-dialog-title"
              >
                {pdfStage === "preparing" ? "Creating your invoice..." : null}
                {pdfStage === "preview" ? "Check your invoice" : null}
                {pdfStage === "downloaded" ? "Invoice downloaded" : null}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {pdfStage === "preparing"
                  ? "This only takes a moment."
                  : null}
                {pdfStage === "preview"
                  ? "This is the exact file that will be saved. Go back and edit if anything looks wrong."
                  : null}
                {pdfStage === "downloaded"
                  ? "The PDF has been saved to your device. This invoice stays in My invoices."
                  : null}
              </p>
              {pdfStatus ? (
                <p
                  className={`mt-4 rounded-xl border p-3 text-sm font-medium leading-6 ${
                    pdfStatus.type === "error"
                      ? "border-red-100 bg-red-50 text-red-700"
                      : "border-amber-100 bg-amber-50 text-amber-800"
                  }`}
                  role="status"
                >
                  {pdfStatus.message}
                </p>
              ) : null}
            </div>

            {pdfStage === "preview" && previewUrl ? (
              <div className="min-h-0 flex-1 border-y border-stone-200 bg-stone-100">
                <iframe
                  className="h-full min-h-[45vh] w-full"
                  src={previewUrl}
                  title="Invoice PDF preview"
                />
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isGeneratingPdf}
                onClick={onClosePdfDialog}
                type="button"
              >
                Keep editing
              </button>

              {pdfStage !== "preparing" ? (
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-800 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  onClick={onStartNewInvoice}
                  ref={pdfStage === "downloaded" ? primaryPdfButtonRef : undefined}
                  type="button"
                >
                  New invoice
                </button>
              ) : null}

              {pdfStage === "preview" ? (
                <button
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-80"
                  disabled={isGeneratingPdf}
                  onClick={onDownloadPdf}
                  ref={primaryPdfButtonRef}
                  type="button"
                >
                  Download PDF
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
