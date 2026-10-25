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
  documentKind?: "invoice" | "receipt";
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

const rowActionClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-default disabled:text-slate-400 disabled:hover:bg-transparent";

export function SavedInvoicesModal({
  documentKind = "invoice",
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
  const getDocumentLabel = (entry: InvoiceIndexEntry) => {
    const label = getInvoiceLabel(entry);
    return documentKind === "receipt" && label === "Untitled invoice" ? "Untitled receipt" : label;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        aria-labelledby="saved-invoices-title"
        aria-modal="true"
        className="flex max-h-[85dvh] w-full min-w-0 max-w-2xl flex-col rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => trapModalFocus(event, dialogRef.current)}
        ref={dialogRef}
        role="dialog"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-5 pb-4 pt-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950" id="saved-invoices-title">
              My {documentKind}s
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Saved in this browser.
            </p>
          </div>
          <button
            aria-label={`Close saved ${documentKind}s`}
            className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-1">
          {invoices.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">
              No {documentKind}s yet. Edits save automatically.
            </p>
          ) : (
            <>
              {isNearLimit ? (
                <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                  You have {invoices.length} of {ATL_MAX_SAVED_INVOICES} saved {documentKind}s. Delete
                  a few to make room for new ones.
                </p>
              ) : null}

              <ul className="divide-y divide-slate-200">
                {invoices.map((invoice) => {
                  const isCurrent = invoice.id === currentInvoiceId;
                  const isPendingDelete = invoice.id === pendingDeleteId;

                  return (
                    <li
                      className="py-5 first:pt-0 last:pb-0"
                      key={invoice.id}
                    >
                      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-5">
                        <div className="min-w-0">
                          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                            <p className="min-w-0 break-words text-sm font-semibold text-slate-950 [overflow-wrap:anywhere]">
                              {getDocumentLabel(invoice)}
                            </p>
                            {isCurrent ? (
                              <span className="text-xs text-slate-500">
                                Open now
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 break-words text-sm text-slate-600 [overflow-wrap:anywhere]">
                            {invoice.customerName.trim() || "No customer name"}
                          </p>
                          <div className="mt-1 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-slate-500">
                            <span className="break-words font-medium tabular-nums text-slate-700 [overflow-wrap:anywhere]">
                              {formatTotal(invoice.total, invoice.currency)}
                            </span>
                            {formatSavedAt(invoice.updatedAt) ? (
                              <time dateTime={invoice.updatedAt}>{formatSavedAt(invoice.updatedAt)}</time>
                            ) : null}
                          </div>
                        </div>

                        {isPendingDelete ? (
                          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:max-w-[16rem] sm:justify-end sm:self-start">
                            <span className="w-full text-sm text-slate-700 sm:text-right">Delete this {documentKind}?</span>
                            <button
                              className={rowActionClassName}
                              onClick={() => setPendingDeleteId("")}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="inline-flex min-h-11 items-center rounded-md bg-red-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
                          <div className="-ml-2 flex flex-wrap items-center gap-1 sm:ml-0 sm:self-start">
                            <button
                              aria-label={`Open ${getDocumentLabel(invoice)}`}
                              className={rowActionClassName}
                              disabled={isCurrent}
                              onClick={() => onOpenInvoice(invoice.id)}
                              type="button"
                            >
                              <FolderOpen aria-hidden="true" className="h-4 w-4" />
                              Open
                            </button>
                            <button
                              aria-label={`Duplicate ${getDocumentLabel(invoice)}`}
                              className={rowActionClassName}
                              onClick={() => onDuplicate(invoice.id)}
                              type="button"
                            >
                              <Copy aria-hidden="true" className="h-4 w-4" />
                              Duplicate
                            </button>
                            <button
                              aria-label={`Delete ${getDocumentLabel(invoice)}`}
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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

        <div className="mx-5 shrink-0 border-t border-slate-200 pb-5 pt-3">
          <div className="flex flex-wrap gap-2">
            <button
              className={`${rowActionClassName} -ml-2`}
              onClick={() => setBackupStatus(onExportBackup())}
              type="button"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Export backup
            </button>
            <button
              className={rowActionClassName}
              aria-describedby="invoice-backup-hint"
              onClick={() => importInputRef.current?.click()}
              type="button"
            >
              <Upload aria-hidden="true" className="h-4 w-4" />
              Restore backup
            </button>
            <input
              accept="application/json,.json"
              aria-label={`Choose ${documentKind} backup`}
              aria-describedby="invoice-backup-hint"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                // Reset first, so choosing the same file twice still fires.
                event.target.value = "";

                if (file) {
                  setBackupStatus(await onImportBackup(file));
                }
              }}
              ref={importInputRef}
              tabIndex={-1}
              type="file"
            />
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500" id="invoice-backup-hint">
            Use the .json file from Export backup in My {documentKind}s. Keep backups private.
          </p>
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
