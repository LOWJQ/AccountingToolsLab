"use client";

import { Check, Download, Pencil, Plus } from "lucide-react";
import { toolButtonClass } from "@/components/tools/ToolWorkspace";
import type { Reconciliation } from "@/lib/reconciliation/types";

export const reconciliationPrimaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:opacity-40";

export function ReconciliationDownloadComplete({ result, openCount, onEdit, onNew, onDownload }: {
  result: Reconciliation;
  openCount: number;
  onEdit: () => void;
  onNew: () => void;
  onDownload: () => void;
}) {
  return <section aria-labelledby="reconciliation-complete-title" className="mx-auto max-w-2xl py-8 sm:py-12">
    <div className="flex items-center gap-3">
      <Check aria-hidden="true" className="h-6 w-6 shrink-0 text-slate-700" />
      <h1 className="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 outline-none sm:text-3xl" id="reconciliation-complete-title" tabIndex={-1}>Your report is ready</h1>
    </div>
    <p className="mt-3 text-sm leading-6 text-slate-600">Your CSV download has started. Open it in Excel or your spreadsheet app.</p>
    <dl className="mt-7 space-y-3 border-y border-slate-200 py-5 text-sm">
      <div className="grid min-w-0 gap-1 sm:grid-cols-[6rem_minmax(0,1fr)]"><dt className="text-slate-500">Bank file</dt><dd className="break-words font-medium text-slate-950">{result.bank.name}</dd></div>
      <div className="grid min-w-0 gap-1 sm:grid-cols-[6rem_minmax(0,1fr)]"><dt className="text-slate-500">Cashbook file</dt><dd className="break-words font-medium text-slate-950">{result.ledger.name}</dd></div>
    </dl>
    <p className="mt-4 text-sm leading-6 text-slate-600">{openCount ? `${openCount} ${openCount === 1 ? "transaction still needs" : "transactions still need"} follow-up. ` : "All valid transactions are matched. "}Check account closing balances separately.</p>
    {result.bank.invalid.length + result.ledger.invalid.length > 0 ? <p className="mt-2 text-sm leading-6 text-slate-600">Invalid CSV rows are included in the report too.</p> : null}
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <button className={toolButtonClass} onClick={onEdit} type="button"><Pencil aria-hidden="true" className="h-4 w-4" />Back to results</button>
      <button className={reconciliationPrimaryButton} onClick={onNew} type="button"><Plus aria-hidden="true" className="h-4 w-4" />New comparison</button>
    </div>
    <button className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" onClick={onDownload} type="button"><Download aria-hidden="true" className="h-4 w-4" />Download again</button>
    <p className="mt-3 text-xs leading-5 text-slate-500">Keep the report private. This comparison stays in this tab only.</p>
  </section>;
}
