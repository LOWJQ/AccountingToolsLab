"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef
} from "react";
import type { InvoicePdfStatus } from "@/hooks/useInvoicePdf";

type InvoiceModalsProps = {
  hasValidInvoice: boolean;
  isClearEverythingModalOpen: boolean;
  isDownloadModalOpen: boolean;
  isGeneratingPdf: boolean;
  onCancelClearEverything: () => void;
  onCancelDownload: () => void;
  onConfirmClearEverything: () => void;
  onConfirmDownload: () => void;
  pdfStatus?: InvoicePdfStatus | null;
};

function getFocusableElements(container: HTMLElement) {
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
    }
  );
}

function trapModalFocus(
  event: ReactKeyboardEvent<HTMLElement>,
  container: HTMLElement | null
) {
  if (event.key !== "Tab" || !container) {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

export function InvoiceModals({
  hasValidInvoice,
  isClearEverythingModalOpen,
  isDownloadModalOpen,
  isGeneratingPdf,
  onCancelClearEverything,
  onCancelDownload,
  onConfirmClearEverything,
  onConfirmDownload,
  pdfStatus
}: InvoiceModalsProps) {
  const confirmDownloadButtonRef = useRef<HTMLButtonElement>(null);
  const confirmClearEverythingButtonRef = useRef<HTMLButtonElement>(null);
  const downloadDialogRef = useRef<HTMLDivElement>(null);
  const clearEverythingDialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const isAnyModalOpen = isClearEverythingModalOpen || isDownloadModalOpen;

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
    if (!isDownloadModalOpen) {
      return;
    }

    confirmDownloadButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isGeneratingPdf) {
        onCancelDownload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDownloadModalOpen, isGeneratingPdf, onCancelDownload]);

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
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoice Draft</p>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
              id="clear-invoice-draft-title"
            >
              Clear all invoice details?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              This will remove the current draft from this device and reset the form. Your last
              used invoice number will not be reset.
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

      {isDownloadModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
          onClick={() => {
            if (!isGeneratingPdf) {
              onCancelDownload();
            }
          }}
        >
          <div
            aria-labelledby="download-invoice-pdf-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-6"
            onKeyDown={(event) => trapModalFocus(event, downloadDialogRef.current)}
            onClick={(event) => event.stopPropagation()}
            ref={downloadDialogRef}
            role="dialog"
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoice PDF</p>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
              id="download-invoice-pdf-title"
            >
              Download invoice PDF?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Your invoice will be generated as a PDF file using the details in the preview.
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
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isGeneratingPdf}
                onClick={onCancelDownload}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-80"
                disabled={isGeneratingPdf || !hasValidInvoice}
                onClick={onConfirmDownload}
                ref={confirmDownloadButtonRef}
                type="button"
              >
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
