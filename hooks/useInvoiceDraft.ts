"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadInvoiceDraft,
  saveInvoiceDraft
} from "@/lib/invoice/invoice-storage";
import type { InvoiceData } from "@/lib/invoice/invoice-types";

type UseInvoiceDraftInput = {
  invoiceData: InvoiceData;
  restoreInvoiceState: (invoice: InvoiceData) => void;
};

export function useInvoiceDraft({
  invoiceData,
  restoreInvoiceState
}: UseInvoiceDraftInput) {
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const [autosaveError, setAutosaveError] = useState("");
  const hasLoadedDraftRef = useRef(false);
  const skipNextAutosaveRef = useRef(false);
  const autosaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasLoadedDraftRef.current) {
      return;
    }

    hasLoadedDraftRef.current = true;
    const storedDraft = loadInvoiceDraft();

    if (storedDraft) {
      restoreInvoiceState(storedDraft.invoice);
    }

    skipNextAutosaveRef.current = true;
    setIsDraftHydrated(true);
  }, [restoreInvoiceState]);

  useEffect(() => {
    if (!isDraftHydrated) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      const result = saveInvoiceDraft(invoiceData);

      if (!result.ok) {
        setAutosaveError("Draft could not be saved. Your invoice is still available this session.");
      } else {
        setAutosaveError("");
      }

      autosaveTimerRef.current = null;
    }, 1000);

    autosaveTimerRef.current = timer;

    return () => {
      window.clearTimeout(timer);
    };
  }, [invoiceData, isDraftHydrated]);

  function clearAutosaveTimer() {
    if (!autosaveTimerRef.current) {
      return;
    }

    window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = null;
  }

  function skipNextAutosave() {
    skipNextAutosaveRef.current = true;
  }

  return {
    autosaveError,
    clearAutosaveTimer,
    setAutosaveError,
    skipNextAutosave
  };
}
