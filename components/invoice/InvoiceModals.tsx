"use client";

import { useEffect, useRef } from "react";
import { trapModalFocus } from "@/components/invoice/modal-focus";

type InvoiceModalsProps = {
  documentKind?: "invoice" | "receipt";
  isClearEverythingModalOpen: boolean;
  onCancelClearEverything: () => void;
  onConfirmClearEverything: () => void;
};

export function InvoiceModals({
  documentKind = "invoice",
  isClearEverythingModalOpen,
  onCancelClearEverything,
  onConfirmClearEverything
}: InvoiceModalsProps) {
  const confirmClearEverythingButtonRef = useRef<HTMLButtonElement>(null);
  const clearEverythingDialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const isAnyModalOpen = isClearEverythingModalOpen;

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
              Clear this {documentKind} and your business details?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {documentKind === "receipt"
                ? "This clears the current receipt and your saved receipt business details and logo. Other saved receipts and your last used receipt number are kept."
                : "This clears the invoice you are working on and the saved business details, logo, and payment information. Your other saved invoices are not affected, and your last used invoice number stays the same."}
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

    </>
  );
}
