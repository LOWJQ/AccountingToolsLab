"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyInvoiceDefaults } from "@/lib/invoice/invoice-defaults";
import {
  EMPTY_BUSINESS_PROFILE,
  clearBusinessProfile,
  createInvoiceId,
  deleteInvoice,
  exportAllData,
  importAllData,
  listInvoices,
  loadBusinessProfile,
  loadInvoice,
  mergeInvoice,
  migrateLegacyDraft,
  saveBusinessProfile,
  saveInvoice,
  splitInvoice,
  type InvoiceIndexEntry,
  type LibraryResult,
  type SavedInvoiceFields
} from "@/lib/invoice/invoice-library";
import { getNextInvoiceNumber, getUnusedInvoiceNumber } from "@/lib/invoice/invoice-numbering";
import { clearInvoiceDraft } from "@/lib/invoice/invoice-storage";
import { downloadBlob } from "@/lib/utils/download-blob";
import type { InvoiceData } from "@/lib/invoice/invoice-types";

type UseInvoiceDraftInput = {
  invoiceData: InvoiceData;
  restoreInvoiceState: (invoice: InvoiceData) => void;
};

type DuplicateOverrides = {
  /** Used when the source number has no trailing digits to count up from. */
  fallbackInvoiceNumber: string;
  invoiceDate: string;
};

function getSaveErrorMessage(result: Extract<LibraryResult, { ok: false }>): string {
  if (result.reason === "quota") {
    return "This device is out of storage. Delete a saved invoice to keep saving this one.";
  }

  if (result.reason === "limit") {
    return result.error;
  }

  if (result.reason === "unavailable") {
    return "Saving is turned off in this browser. Your invoice is still here for this session.";
  }

  return "Invoice could not be saved to this device. It is still available this session.";
}

function persistInvoice(id: string, invoice: InvoiceData): LibraryResult {
  const { fields, profile } = splitInvoice(invoice);
  const result = saveInvoice(id, fields);
  return result.ok ? saveBusinessProfile(profile) : result;
}

export function useInvoiceDraft({ invoiceData, restoreInvoiceState }: UseInvoiceDraftInput) {
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const [autosaveError, setAutosaveError] = useState("");
  const [savedInvoices, setSavedInvoices] = useState<InvoiceIndexEntry[]>([]);
  /** Mirrors the ref below so the dialog can mark which row is open. */
  const [currentInvoiceId, setCurrentInvoiceId] = useState("");
  const hasLoadedDraftRef = useRef(false);
  const skipNextAutosaveRef = useRef(false);
  const autosaveTimerRef = useRef<number | null>(null);
  /** Which saved invoice the autosave writes to. */
  const currentInvoiceIdRef = useRef("");
  const pendingSaveRef = useRef(false);
  const latestDraftRef = useRef({ invoiceData, isDraftHydrated });
  latestDraftRef.current = { invoiceData, isDraftHydrated };

  const refreshSavedInvoices = useCallback(() => {
    setSavedInvoices(listInvoices());
  }, []);

  const setCurrentId = useCallback((id: string) => {
    currentInvoiceIdRef.current = id;
    setCurrentInvoiceId(id);
  }, []);

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

  // Flush before downloading or switching invoices, so a fast click on
  // "New invoice" cannot cancel the last edits waiting in the debounce.
  const saveCurrentInvoice = useCallback(() => {
    if (!isDraftHydrated) return false;
    clearAutosaveTimer();
    const result = persistInvoice(currentInvoiceIdRef.current, invoiceData);
    pendingSaveRef.current = !result.ok;
    setAutosaveError(result.ok ? "" : getSaveErrorMessage(result));
    refreshSavedInvoices();
    return result.ok;
  }, [invoiceData, isDraftHydrated, refreshSavedInvoices]);

  useEffect(() => {
    if (hasLoadedDraftRef.current) {
      return;
    }

    hasLoadedDraftRef.current = true;

    // Safe on every load: a no-op once the library holds anything.
    const migration = migrateLegacyDraft();

    const profile = loadBusinessProfile();
    const [mostRecent] = listInvoices();
    const fields = mostRecent ? loadInvoice(mostRecent.id) : null;

    setCurrentId(mostRecent?.id ?? createInvoiceId());

    // Only drop the old single draft once its contents are provably readable
    // from the new structure, so a failed migration never loses the original.
    if (migration.migrated && loadInvoice(migration.id)) {
      clearInvoiceDraft();
    }

    if (fields || profile) {
      const blankFields = splitInvoice(createEmptyInvoiceDefaults({ invoiceDate: "" })).fields;

      restoreInvoiceState(
        mergeInvoice(profile ?? EMPTY_BUSINESS_PROFILE, fields ?? blankFields)
      );
    }

    refreshSavedInvoices();
    skipNextAutosaveRef.current = true;
    setIsDraftHydrated(true);
  }, [refreshSavedInvoices, restoreInvoiceState, setCurrentId]);

  useEffect(() => {
    if (!isDraftHydrated) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      pendingSaveRef.current = false;
      return;
    }

    pendingSaveRef.current = true;
    const timer = window.setTimeout(saveCurrentInvoice, 1000);

    autosaveTimerRef.current = timer;

    return () => {
      window.clearTimeout(timer);
    };
  }, [invoiceData, isDraftHydrated, saveCurrentInvoice]);

  // Save the latest render, not the value captured when the listener mounted.
  // Keep lifecycle persistence free of React state updates during unmount.
  useEffect(() => {
    function flush() {
      const latest = latestDraftRef.current;
      if (!latest.isDraftHydrated || !pendingSaveRef.current) return;
      clearAutosaveTimer();
      const result = persistInvoice(currentInvoiceIdRef.current, latest.invoiceData);
      pendingSaveRef.current = !result.ok;
    }
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") flush();
    }
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      flush();
    };
  }, []);

  /**
   * Points the autosave at a fresh record. The invoice on screen has already
   * been written under the previous id, so it stays in the saved list.
   */
  const beginNewInvoice = useCallback(() => {
    setCurrentId(createInvoiceId());
  }, [setCurrentId]);

  /** Loads a saved invoice, keeping the business details already on screen. */
  const openSavedInvoice = useCallback(
    (id: string) => {
      if (pendingSaveRef.current && !saveCurrentInvoice()) return false;
      const fields = loadInvoice(id);

      if (!fields) {
        setAutosaveError("That invoice could not be opened. It may have been deleted.");
        refreshSavedInvoices();
        return false;
      }

      // Order matters: stop any pending write and repoint the id before the
      // form changes, or the debounced save lands on the previous invoice.
      clearAutosaveTimer();
      setCurrentId(id);
      skipNextAutosave();
      restoreInvoiceState(mergeInvoice(splitInvoice(invoiceData).profile, fields));
      return true;
    },
    [invoiceData, refreshSavedInvoices, restoreInvoiceState, saveCurrentInvoice, setCurrentId]
  );

  /** Copies a saved invoice into a new one and opens it. */
  const duplicateSavedInvoice = useCallback(
    (id: string, overrides: DuplicateOverrides) => {
      if (pendingSaveRef.current && !saveCurrentInvoice()) return false;
      const fields = loadInvoice(id);

      if (!fields) {
        setAutosaveError("That invoice could not be copied. It may have been deleted.");
        refreshSavedInvoices();
        return false;
      }

      const invoiceNumber = getUnusedInvoiceNumber(
        getNextInvoiceNumber(fields.invoiceNumber) ?? overrides.fallbackInvoiceNumber,
        listInvoices().map((entry) => entry.invoiceNumber)
      );
      if (!invoiceNumber) {
        setAutosaveError("Enter a new invoice number before duplicating this invoice.");
        return false;
      }

      const copy: SavedInvoiceFields = {
        ...fields,
        invoiceDate: overrides.invoiceDate,
        invoiceNumber,
        dueDate: ""
      };
      const newId = createInvoiceId();
      const result = saveInvoice(newId, copy);

      if (!result.ok) {
        setAutosaveError(getSaveErrorMessage(result));
        return false;
      }

      clearAutosaveTimer();
      setCurrentId(newId);
      skipNextAutosave();
      restoreInvoiceState(mergeInvoice(splitInvoice(invoiceData).profile, copy));
      refreshSavedInvoices();
      return true;
    },
    [invoiceData, refreshSavedInvoices, restoreInvoiceState, saveCurrentInvoice, setCurrentId]
  );

  /**
   * Deletes a saved invoice. Reports whether it was the one on screen, so the
   * caller can decide what to put in front of the user next.
   */
  const removeSavedInvoice = useCallback(
    (id: string) => {
      const wasCurrent = id === currentInvoiceIdRef.current;
      const result = deleteInvoice(id);

      if (!result.ok && result.reason !== "not-found") {
        setAutosaveError(result.error);
        return { wasCurrent: false };
      }

      if (wasCurrent) {
        clearAutosaveTimer();
        pendingSaveRef.current = false;
        setCurrentId(createInvoiceId());
      }

      refreshSavedInvoices();
      return { wasCurrent };
    },
    [refreshSavedInvoices, setCurrentId]
  );

  /**
   * Writes everything in this browser out as a JSON file. Invoices live in one
   * browser only, so this is the sole way to move them or survive clearing
   * browsing data.
   */
  const exportBackup = useCallback(() => {
    const data = exportAllData();

    if (data.invoices.length === 0 && !data.profile) {
      return { ok: false, message: "There is nothing to back up yet." };
    }

    downloadBlob(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      `accountingtoolslab-invoices-${new Date().toISOString().slice(0, 10)}.json`
    );

    return { ok: true, message: "Backup downloaded." };
  }, []);

  /** Adds the invoices from a backup file; never replaces what is already here. */
  const importBackup = useCallback(
    async (file: File) => {
      const hadProfileBefore = loadBusinessProfile() !== null;

      let parsed: unknown;

      try {
        parsed = JSON.parse(await file.text());
      } catch {
        return {
          ok: false,
          message: "That file could not be read. Choose a backup file exported from this tool."
        };
      }

      const result = importAllData(parsed);
      refreshSavedInvoices();

      if (!result.ok) {
        return { ok: false, message: result.error };
      }

      // If the browser had no business details and the backup supplied some,
      // show them straight away rather than waiting for the next page load.
      const importedProfile = loadBusinessProfile();

      if (!hadProfileBefore && importedProfile) {
        if (!pendingSaveRef.current) skipNextAutosave();
        restoreInvoiceState(mergeInvoice(importedProfile, splitInvoice(latestDraftRef.current.invoiceData).fields));
      }

      return { ok: true, message: "Backup imported. Your invoices are in the list above." };
    },
    [refreshSavedInvoices, restoreInvoiceState]
  );

  /**
   * Reset throws away the invoice being worked on and the saved business
   * details, but deliberately leaves every other saved invoice alone.
   */
  const resetEverything = useCallback(() => {
    pendingSaveRef.current = false;
    deleteInvoice(currentInvoiceIdRef.current);
    const cleared = clearBusinessProfile();
    setCurrentId(createInvoiceId());
    refreshSavedInvoices();

    return cleared;
  }, [refreshSavedInvoices, setCurrentId]);

  return {
    autosaveError,
    beginNewInvoice,
    clearAutosaveTimer,
    currentInvoiceId,
    duplicateSavedInvoice,
    exportBackup,
    importBackup,
    openSavedInvoice,
    removeSavedInvoice,
    resetEverything,
    savedInvoices,
    saveCurrentInvoice,
    setAutosaveError,
    skipNextAutosave
  };
}
