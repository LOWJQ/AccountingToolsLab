"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createInvoiceId, loadBusinessProfile } from "@/lib/invoice/invoice-library";
import { getLocalStorage } from "@/lib/invoice/invoice-storage";
import { downloadBlob } from "@/lib/utils/download-blob";
import { createEmptyReceipt } from "@/lib/receipt/receipt-defaults";
import {
  emptyReceiptLibrary, MAX_RECEIPT_BACKUP_BYTES, mergeReceiptBackup, nextReceipt,
  parseReceiptBackup, recordReceiptNumber, RECEIPT_LIBRARY_KEY, receiptFromLibrary, saveReceipt, writeReceiptLibrary,
  type ReceiptLibrary
} from "@/lib/receipt/receipt-library";
import type { ReceiptData } from "@/lib/receipt/receipt-types";
import type { BackupStatus } from "@/components/invoice/SavedInvoicesModal";

type Workspace = { library: ReceiptLibrary; receipt: ReceiptData; ready: boolean; writable: boolean };

export function useReceiptLibrary(currency: string, setCurrency: (value: string) => void) {
  const [state, setState] = useState<Workspace>(() => ({ library: emptyReceiptLibrary(), receipt: createEmptyReceipt(), ready: false, writable: false }));
  const [saveError, setSaveError] = useState("");
  const latest = useRef(state);
  latest.current = state;

  useEffect(() => {
    const storage = getLocalStorage();
    try {
      const raw = storage?.getItem(RECEIPT_LIBRARY_KEY);
      let library = raw ? parseReceiptBackup(raw) : emptyReceiptLibrary();
      if (!raw) {
        const existingBusiness = loadBusinessProfile();
        const receipt = { ...createEmptyReceipt(), currency, ...(existingBusiness ? { businessName: existingBusiness.businessName, businessContact: existingBusiness.businessContact, businessAddress: existingBusiness.businessAddress, businessLogoDataUrl: existingBusiness.businessLogoDataUrl } : {}) };
        library = saveReceipt(library, createInvoiceId(), receipt);
      }
      let receipt = receiptFromLibrary(library);
      if (!receipt) {
        receipt = { ...createEmptyReceipt(), ...library.profile, currency };
        library = saveReceipt(library, createInvoiceId(), receipt);
      }
      setCurrency(receipt.currency);
      setState({ receipt, library, ready: true, writable: true });
    } catch {
      setSaveError("Saved receipts could not be read. They have been left untouched. You can still download a PDF or restore a valid receipt backup.");
      setState(current => ({ ...current, ready: true }));
    }
    // Initial load only: currency changes subsequently belong to the active receipt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.ready || !state.writable) return;
    const timer = window.setTimeout(() => setSaveError(writeReceiptLibrary(getLocalStorage(), state.library)), 350);
    return () => window.clearTimeout(timer);
  }, [state.library, state.ready, state.writable]);

  useEffect(() => {
    function flush() {
      const current = latest.current;
      if (current.ready && current.writable) writeReceiptLibrary(getLocalStorage(), current.library);
    }
    window.addEventListener("pagehide", flush);
    return () => { window.removeEventListener("pagehide", flush); flush(); };
  }, []);

  const updateReceipt = useCallback((patch: Partial<ReceiptData>) => {
    setState(current => {
      const receipt = { ...current.receipt, ...patch };
      return { ...current, receipt, library: saveReceipt(current.library, current.library.activeId || createInvoiceId(), receipt) };
    });
  }, []);

  useEffect(() => {
    if (state.ready && currency !== state.receipt.currency) updateReceipt({ currency });
  }, [currency, state.ready, state.receipt.currency, updateReceipt]);

  function startReceipt(duplicateId?: string): boolean {
    try {
      const receipt = nextReceipt(state.library, currency, duplicateId);
      const library = saveReceipt(state.library, createInvoiceId(), receipt);
      setCurrency(receipt.currency);
      setState(current => ({ ...current, library, receipt }));
      return true;
    } catch (error) { setSaveError(error instanceof Error ? error.message : "The receipt could not be created."); return false; }
  }

  function openReceipt(id: string) {
    const receipt = receiptFromLibrary(state.library, id);
    if (!receipt) { setSaveError("This receipt could not be found."); return; }
    setCurrency(receipt.currency);
    setState(current => ({ ...current, receipt, library: { ...current.library, activeId: id } }));
  }

  function deleteReceipt(id: string) {
    let library = { ...state.library, receipts: state.library.receipts.filter(entry => entry.id !== id) };
    if (id === library.activeId) {
      library.activeId = library.receipts[0]?.id ?? "";
      let receipt = receiptFromLibrary(library);
      if (!receipt) {
        receipt = { ...createEmptyReceipt(), ...library.profile, currency };
        library = saveReceipt(library, createInvoiceId(), receipt);
      }
      setCurrency(receipt.currency);
      setState(current => ({ ...current, receipt, library }));
    } else setState(current => ({ ...current, library }));
  }

  function resetReceipt() {
    const receipt = { ...createEmptyReceipt(), tax: [], currency };
    setState(current => ({ ...current, receipt, library: saveReceipt(current.library, current.library.activeId || createInvoiceId(), receipt) }));
  }

  const markNumberUsed = useCallback((number: string) => {
    setState(current => ({ ...current, library: recordReceiptNumber(current.library, number) }));
  }, []);

  function exportBackup(): BackupStatus {
    try {
      const backup = JSON.stringify(state.library, null, 2);
      parseReceiptBackup(backup);
      downloadBlob(new Blob([backup], { type: "application/json" }), `AccountingToolsLab-receipts-${new Date().toISOString().slice(0, 10)}.json`);
      return { ok: true, message: "Receipt backup downloaded." };
    } catch { return { ok: false, message: "The backup could not be downloaded. Try again." }; }
  }

  async function importBackup(file: File): Promise<BackupStatus> {
    try {
      if (file.size > MAX_RECEIPT_BACKUP_BYTES) throw new Error("Receipt backups must be 4MB or smaller.");
      const incoming = parseReceiptBackup(await file.text());
      // Read the latest draft after the file operation finishes, rather than a stale render.
      const current = latest.current;
      let library = mergeReceiptBackup(current.writable ? current.library : emptyReceiptLibrary(), incoming, createInvoiceId);
      let receipt = receiptFromLibrary(library);
      if (!receipt) {
        receipt = { ...createEmptyReceipt(), ...library.profile, currency };
        library = saveReceipt(library, createInvoiceId(), receipt);
      }
      const error = writeReceiptLibrary(getLocalStorage(), library);
      if (error) throw new Error(error);
      setCurrency(receipt.currency);
      setState({ library, receipt, ready: true, writable: true });
      setSaveError("");
      return { ok: true, message: "Receipt backup restored. Existing receipts were kept." };
    } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "The receipt backup could not be restored." }; }
  }

  return { ...state, saveError, updateReceipt, startReceipt, openReceipt, deleteReceipt, resetReceipt, markNumberUsed, exportBackup, importBackup };
}
