"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, FolderOpen, Trash2, Upload, X } from "lucide-react";
import { trapModalFocus } from "@/components/invoice/modal-focus";
import {
  ATL_MAX_SAVED_INVOICES,
  ATL_SAVED_INVOICE_WARN_AT,
  getInvoiceLabel,
  type InvoiceIndexEntry
} from "@/lib/invoice/invoice-library";

export type BackupStatus = { ok: boolean; message: string };

type SavedInvoicesModalProps = {
  currentInvoiceId: string;
  invoices: InvoiceIndexEntry[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExportBackup: () => BackupStatus;
  onImportBackup: (file: File) => Promise<BackupStatus>;
  onOpenInvoice: (id: string) => void;
};

function formatTotal(total: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      currency: currency || "MYR",
      style: "currency"
    }).format(total);
  } catch {
    return total.toFixed(2);
  }
}

function formatSavedAt(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

export function SavedInvoicesModal({
  currentInvoiceId,
  invoices,
  isOpen,
  onClose,
  onDelete,
  onDuplicate,
  onExportBackup,
  onImportBackup,
  onOpenInvoice
}: SavedInvoicesModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  /** Delete confirms inline on the row, so no dialog opens on top of a dialog. */
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPendingDeleteId("");
      setBackupStatus(null);
      return;
    }

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const previousActiveElement = previousActiveElementRef.current;

      if (previousActiveElement && document.contains(previousActiveElement)) {
        previousActiveElement.focus();
      }

      previousActiveElementRef.current = null;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isNearLimit = invoices.length >= ATL_SAVED_INVOICE_WARN_AT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        aria-labelledby="saved-invoices-title"
        aria-modal="true"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => trapModalFocus(event, dialogRef.current)}
        ref={dialogRef}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950" id="saved-invoices-title">
              My invoices
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Saved on this device only, not synced to your other devices.
            </p>
          </div>
          <button
            aria-label="Close saved invoices"
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {invoices.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">
              No saved invoices yet. Whatever you type is saved here automatically.
            </p>
          ) : (
            <>
              {isNearLimit ? (
                <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                  You have {invoices.length} of {ATL_MAX_SAVED_INVOICES} saved invoices. Delete
                  a few to make room for new ones.
                </p>
              ) : null}

              <ul className="flex flex-col gap-2">
                {invoices.map((invoice) => {
                  const isCurrent = invoice.id === currentInvoiceId;
                  const isPendingDelete = invoice.id === pendingDeleteId;

                  return (
                    <li
                      className="rounded-lg border border-slate-200 p-3 sm:p-4"
                      key={invoice.id}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {getInvoiceLabel(invoice)}
                            {isCurrent ? (
                              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                Open now
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-600">
                            {invoice.customerName.trim() || "No customer name"} ·{" "}
                            {formatTotal(invoice.total, invoice.currency)}
                            {formatSavedAt(invoice.updatedAt)
                              ? ` · ${formatSavedAt(invoice.updatedAt)}`
                              : ""}
                          </p>
                        </div>

                        {isPendingDelete ? (
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-sm text-slate-700">Delete this invoice?</span>
                            <button
                              className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                              onClick={() => setPendingDeleteId("")}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="inline-flex h-10 items-center rounded-lg bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                              onClick={() => {
                                setPendingDeleteId("");
                                onDelete(invoice.id);
                              }}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <button
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:opacity-50"
                              disabled={isCurrent}
                              onClick={() => onOpenInvoice(invoice.id)}
                              type="button"
                            >
                              <FolderOpen aria-hidden="true" className="h-4 w-4" />
                              Open
                            </button>
                            <button
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                              onClick={() => onDuplicate(invoice.id)}
                              type="button"
                            >
                              <Copy aria-hidden="true" className="h-4 w-4" />
                              Duplicate
                            </button>
                            <button
                              aria-label={`Delete ${getInvoiceLabel(invoice)}`}
                              className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                              onClick={() => setPendingDeleteId(invoice.id)}
                              type="button"
                            >
                              <Trash2 aria-hidden="true" className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 p-5">
          <p className="text-sm leading-6 text-slate-600">
            Clearing your browser data deletes these invoices. Keep a backup file if they
            matter.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={() => setBackupStatus(onExportBackup())}
              type="button"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Export backup
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={() => importInputRef.current?.click()}
              type="button"
            >
              <Upload aria-hidden="true" className="h-4 w-4" />
              Import backup
            </button>
            <input
              accept="application/json,.json"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                // Reset first, so choosing the same file twice still fires.
                event.target.value = "";

                if (file) {
                  setBackupStatus(await onImportBackup(file));
                }
              }}
              ref={importInputRef}
              type="file"
            />
          </div>
          {backupStatus ? (
            <p
              className={`mt-3 rounded-md border p-3 text-sm leading-6 ${
                backupStatus.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
              role="status"
            >
              {backupStatus.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
