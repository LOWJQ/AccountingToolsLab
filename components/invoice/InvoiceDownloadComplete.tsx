"use client";

import { useEffect, useRef } from "react";
import { Check, Download, FolderOpen, Pencil, Plus } from "lucide-react";
import type { InvoicePdfStatus } from "@/hooks/useInvoicePdf";

type Props = {
  invoiceNumber: string;
  customerName: string;
  total: string;
  autosaveError: string;
  pdfStatus: InvoicePdfStatus | null;
  onDownload: () => void;
  onEdit: () => void;
  onNewInvoice: () => void;
  onHistory: () => void;
};

const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2";

export function InvoiceDownloadComplete(props: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <section aria-labelledby="invoice-complete-title" className="mx-auto max-w-2xl py-10 sm:py-14">
      <div className="flex items-center gap-3">
        <Check aria-hidden="true" className="h-6 w-6 shrink-0 text-slate-700" />
        <h1 id="invoice-complete-title" ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 outline-none sm:text-3xl">Your invoice is ready</h1>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">Your PDF download has started.</p>
      <dl className="mt-7 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-y border-slate-200 py-5">
        <div className="min-w-0">
          <dt className="text-sm text-slate-500">Invoice {props.invoiceNumber || "(no number)"}</dt>
          <dd className="mt-1 break-words font-medium text-slate-950">{props.customerName.trim() || "Customer name"}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Total</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-950">{props.total}</dd>
        </div>
      </dl>
      {props.pdfStatus ? <p className="mt-4 text-sm leading-6 text-amber-800" role="status">{props.pdfStatus.message}</p> : null}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button className={secondaryButton} onClick={props.onEdit} type="button"><Pencil aria-hidden="true" className="h-4 w-4" />Edit this invoice</button>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-800 px-5 text-sm font-semibold text-white hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2" onClick={props.onNewInvoice} type="button"><Plus aria-hidden="true" className="h-4 w-4" />New invoice</button>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">New invoices keep your business and payment details.</p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        <button className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300" onClick={props.onDownload} type="button"><Download aria-hidden="true" className="h-4 w-4" />Download again</button>
        <button className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300" onClick={props.onHistory} type="button"><FolderOpen aria-hidden="true" className="h-4 w-4" />My invoices</button>
      </div>
      <p className={`mt-2 text-xs leading-5 ${props.autosaveError ? "text-amber-800" : "text-slate-500"}`} role={props.autosaveError ? "status" : undefined}>{props.autosaveError || "Saved in this browser."}</p>
    </section>
  );
}
