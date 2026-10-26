"use client";

import { ChevronDown, Download, Plus, Undo2 } from "lucide-react";
import type { ReactNode } from "react";
import type { Reconciliation } from "@/lib/reconciliation/types";
import { toolButtonClass } from "@/components/tools/ToolWorkspace";
import { reconciliationPrimaryButton } from "./ReconciliationDownloadComplete";

export type ReviewSection = "suggested" | "unmatched" | "matched" | "invalid";
export const reconciliationTextButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:text-slate-950 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40";

export function ReconciliationSummary({ result, bankMatched, ledgerMatched, suggested, unmatched, canUndo, stale, activeSection, children, onReview, onDownload, onNew, onEditFiles, onUndo }: {
  result: Reconciliation;
  bankMatched: number;
  ledgerMatched: number;
  suggested: number;
  unmatched: number;
  canUndo: boolean;
  stale: boolean;
  activeSection: ReviewSection | null;
  children: ReactNode;
  onReview: (section: ReviewSection) => void;
  onDownload: () => void;
  onNew: () => void;
  onEditFiles: () => void;
  onUndo: () => void;
}) {
  const invalid = result.bank.invalid.length + result.ledger.invalid.length;
  const format = (cents: number) => new Intl.NumberFormat("en-MY", { style: "currency", currency: result.options.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
  const tasks: Array<{ section: ReviewSection; count: number; label: string; hint: string }> = [
    { section: "invalid", count: invalid, label: invalid === 1 ? "excluded row" : "excluded rows", hint: "These rows could not be compared." },
    { section: "suggested", count: suggested, label: suggested === 1 ? "suggested match" : "suggested matches", hint: "Confirm these are the same payments." },
    { section: "unmatched", count: unmatched, label: unmatched === 1 ? "unmatched transaction" : "unmatched transactions", hint: "Check entries found in only one file." },
    { section: "matched", count: bankMatched, label: bankMatched === 1 ? "matched bank transaction" : "matched bank transactions", hint: "Matched to your cashbook entries." }
  ];
  return <section aria-labelledby="reconciliation-results-title" className="min-w-0" id="reconciliation-results">
    <h1 className="scroll-mt-28 text-2xl font-semibold tracking-tight text-slate-950 outline-none sm:text-3xl" id="reconciliation-results-title" tabIndex={-1}>Your comparison is ready</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600" aria-live="polite">{bankMatched} of {result.bank.transactions.length} bank transactions matched to {ledgerMatched} of {result.ledger.transactions.length} cashbook entries.</p>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button className={reconciliationPrimaryButton} onClick={onDownload} type="button"><Download aria-hidden="true" className="h-4 w-4" />{stale ? "Download previous report" : "Download report"}</button>
      <button className={toolButtonClass} onClick={onNew} type="button"><Plus aria-hidden="true" className="h-4 w-4" />New comparison</button>
    </div>
    <div className="mt-7 border-y border-slate-200">
      {!invalid && !suggested && !unmatched ? <p className="pt-5 text-sm leading-6 text-slate-700">All imported transactions are matched. Verify closing balances separately.</p> : null}
      <ul className="divide-y divide-slate-200">{tasks.filter(task => task.count || task.section === activeSection).map(task => {
        const expanded = task.section === activeSection;
        return <li className="min-w-0 py-3" key={task.section}>
          <h2>
            <button aria-controls={`review-panel-${task.section}`} aria-expanded={expanded} className="inline-flex min-h-11 max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded text-left text-base font-semibold text-slate-950 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" id={`review-toggle-${task.section}`} onClick={() => onReview(task.section)} type="button">
              <span>{task.count} {task.label}</span><ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-slate-500 ${expanded ? "rotate-180" : ""}`} />
            </button>
          </h2>
          {expanded ? <div aria-labelledby={`review-toggle-${task.section}`} className="min-w-0 pb-3 pt-3" id={`review-panel-${task.section}`} role="region">{children}</div> : <p className="pb-2 text-sm leading-6 text-slate-600">{task.hint}</p>}
        </li>;
      })}</ul>
    </div>
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      <button className={reconciliationTextButton} onClick={onEditFiles} type="button">Edit files or settings</button>
      {canUndo ? <button className={reconciliationTextButton} disabled={stale} onClick={onUndo} type="button"><Undo2 aria-hidden="true" className="h-4 w-4" />Undo last match</button> : null}
    </div>
    <details className="mt-5"><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Files, totals and matching details</summary>
      <p className="mt-2 break-words text-sm leading-6 text-slate-600">{result.bank.name}<br />{result.ledger.name}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{result.options.currency}. Dates up to {result.options.days} days apart.</p>
      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">{[["Bank net movement", result.bank.totalCents], ["Cashbook net movement", result.ledger.totalCents], ["Movement difference", result.bank.totalCents - result.ledger.totalCents]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold tabular-nums text-slate-950">{format(Number(value))}</dd></div>)}</dl>
      <p className="mt-3 text-xs leading-5 text-slate-500">Transaction totals exclude invalid rows and are not closing balances.</p>
      {result.notices.map(notice => <p className="mt-3 text-sm leading-6 text-slate-600" key={notice}>{notice}</p>)}
    </details>
  </section>;
}
