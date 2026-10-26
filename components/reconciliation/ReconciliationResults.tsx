"use client";

import { Check } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { acceptMatch, getReview, manualMatch, releaseMatch } from "@/lib/reconciliation/review";
import { ReconciliationSummary, reconciliationTextButton } from "./ReconciliationSummary";
import type { FlagKind, Match, Reconciliation, Transaction } from "@/lib/reconciliation/types";
import { toolButtonClass, toolInputClass } from "@/components/tools/ToolWorkspace";
import { MappingSelect } from "./ImportFilePanel";

type Tab = "suggested" | "unmatched" | "matched" | "invalid";
const PAGE_SIZE = 20;
const causeLabels: Record<FlagKind, string> = { ambiguous: "Competing matches", duplicate: "Possible duplicate", transposition: "Possible amount typo", "bank-fee": "Possible bank charge", timing: "Possibly not cleared" };

export function ReconciliationResults({ result, matches, notes, onChange, onNote, onUndo, canUndo, stale, onDownload, onDownloadExcel, onNew, onEditFiles }: {
  result: Reconciliation;
  matches: Match[];
  notes: Record<string, string>;
  onChange: (matches: Match[]) => void;
  onNote: (id: string, value: string) => void;
  onUndo: () => void;
  canUndo: boolean;
  stale: boolean;
  onDownload: (openOnly: boolean) => boolean | undefined;
  onDownloadExcel: () => void;
  onNew: () => void;
  onEditFiles: () => void;
}) {
  const review = useMemo(() => getReview(result, matches), [result, matches]);
  const allRows = useMemo(() => new Map([...result.bank.transactions, ...result.ledger.transactions].map(row => [row.id, row])), [result]);
  const [tab, setTab] = useState<Tab | null>(null);
  const [manual, setManual] = useState(false);
  const [page, setPage] = useState(1);
  const [cause, setCause] = useState("all");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.toLowerCase().trim());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [exported, setExported] = useState(false);
  const invalid = useMemo(() => [...result.bank.invalid, ...result.ledger.invalid], [result]);
  const filtered = useMemo(() => review.unmatched.filter(row => {
    const hasCause = cause === "all" || row.source === cause || result.flags[row.id]?.some(flag => flag.kind === cause);
    return hasCause && (!search || `${row.description} ${row.reference} ${row.date} ${row.cents / 100}`.toLowerCase().includes(search));
  }), [review.unmatched, result.flags, cause, search]);
  const format = (cents: number) => new Intl.NumberFormat("en-MY", { style: "currency", currency: result.options.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
  const selectedRows = [...selected].map(id => allRows.get(id)).filter((row): row is Transaction => Boolean(row) && !review.reservedIds.has(row!.id));
  const bankSelected = selectedRows.filter(row => row.source === "bank");
  const ledgerSelected = selectedRows.filter(row => row.source === "ledger");
  const bankSum = bankSelected.reduce((sum, row) => sum + row.cents, 0);
  const ledgerSum = ledgerSelected.reduce((sum, row) => sum + row.cents, 0);
  const sameDirection = selectedRows.every(row => Math.sign(row.cents) === Math.sign(selectedRows[0]?.cents));
  const canMatch = bankSelected.length > 0 && ledgerSelected.length > 0 && bankSum === ledgerSum && sameDirection && !stale;
  const bankOnly = filtered.filter(row => row.source === "bank");
  const ledgerOnly = filtered.filter(row => row.source === "ledger");
  const items = tab === "suggested" ? review.suggested : tab === "matched" ? review.confirmed : tab === "invalid" ? invalid : filtered;
  const pageSize = tab === "suggested" ? 1 : PAGE_SIZE;
  const pages = Math.max(1, Math.ceil((tab === "unmatched" ? Math.max(bankOnly.length, ledgerOnly.length) : items.length) / pageSize));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * pageSize;

  function edit(action: () => Match[]) {
    try { onChange(action()); setError(""); setExported(false); if (tab === "suggested") window.requestAnimationFrame(() => document.getElementById("reconciliation-review-status")?.focus({ preventScroll: true })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "The match could not be updated."); }
  }
  function changeTab(next: Tab) {
    setTab(current => current === next ? null : next);
    setPage(1);
    setManual(false);
    setSelected(new Set());
    setCause("all");
    setQuery("");
    setError("");
    setExported(false);
  }
  function collapseReview() {
    const previous = tab;
    setTab(null);
    setSelected(new Set());
    window.requestAnimationFrame(() => (document.getElementById(`review-toggle-${previous}`) ?? document.getElementById("reconciliation-results-title"))?.focus({ preventScroll: true }));
  }
  function selectRow(id: string) {
    setSelected(current => {
      const next = new Set([...current].filter(value => !review.reservedIds.has(value)));
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function matchSelection() {
    edit(() => manualMatch(result, matches, bankSelected.map(row => row.id), ledgerSelected.map(row => row.id)));
    if (canMatch) setSelected(new Set());
  }
  function exportReport(openOnly: boolean) {
    if (onDownload(openOnly) && openOnly) setExported(true);
  }

  function transaction(row: Transaction, showSelection = false) {
    return <div className={`grid min-w-0 items-start gap-3 ${showSelection && manual ? "grid-cols-[2.75rem_minmax(0,1fr)]" : "grid-cols-1"}`} key={row.id}>
      {showSelection && manual ? <label className="flex h-11 w-11 cursor-pointer items-center justify-center"><input aria-label={`Select ${row.source === "bank" ? "bank" : "cashbook"} source row ${row.line}: ${row.description || row.reference}`} checked={selected.has(row.id)} className="h-4 w-4 accent-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" disabled={stale} onChange={() => selectRow(row.id)} type="checkbox" /></label> : null}
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1"><p className="min-w-0 break-words text-sm font-medium text-slate-950">{row.description || row.reference || "No description"}</p><p className="max-w-full break-words text-sm font-semibold tabular-nums text-slate-950">{format(row.cents)}</p></div>
        <p className="mt-1 break-words text-xs leading-5 text-slate-500">{row.date}{row.reference ? ` / ${row.reference}` : ""}</p>
        {result.flags[row.id]?.length ? <p className="mt-2 text-xs font-medium leading-5 text-slate-700">{result.flags[row.id].map(flag => causeLabels[flag.kind]).join(" · ")}</p> : null}
        {showSelection ? <details className="mt-1">
          <summary className="min-h-11 cursor-pointer py-3 text-xs font-medium text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Details and note{notes[row.id] ? " (note added)" : ""}</summary>
          <p className="break-words text-xs leading-5 text-slate-500">Source: {row.source === "bank" ? result.bank.name : result.ledger.name}, source row {row.line}.</p>
          {(result.flags[row.id] ?? []).map(flag => <p className="mt-2 text-sm leading-6 text-slate-600" key={flag.kind}>{flag.reason}{flag.relatedIds?.length ? ` Related ${flag.relatedIds.map(id => id.replace("ledger:", "cashbook line ").replace("bank:", "bank line ")).join(", ")}.` : ""}</p>)}
          {!result.flags[row.id]?.length ? <p className="mt-2 text-sm leading-6 text-slate-600">{row.source === "bank" ? "Bank only. Check for a missing cashbook entry, a different reference, or an import issue." : "Cashbook only. Check whether the transaction has cleared, belongs to another period, or is missing from the statement export."}</p> : null}
          <label className="mt-3 grid gap-2 text-sm text-slate-700" htmlFor={`note-${row.id}`}>Your note<textarea className="min-h-20 w-full min-w-0 rounded-lg border border-stone-300 p-3 text-base outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100 disabled:bg-slate-50" disabled={stale} id={`note-${row.id}`} name={`note-${row.id}`} autoComplete="off" maxLength={2000} onChange={event => { onNote(row.id, event.target.value); setExported(false); }} placeholder="What you checked or what needs follow-up…" value={notes[row.id] ?? ""} /></label>
        </details> : null}
      </div>
    </div>;
  }
  function matchRow(match: Match) {
    const bankRows = match.bankIds.map(id => allRows.get(id)!);
    const ledgerRows = match.ledgerIds.map(id => allRows.get(id)!);
    return <li className="py-6 first:pt-0" key={match.id}>
      <div className="grid min-w-0 gap-5 md:grid-cols-2 md:gap-8">
        <div className="min-w-0"><h3 className="mb-3 text-xs font-medium text-slate-500">Bank statement</h3><div className="space-y-3">{bankRows.map(row => transaction(row))}</div></div>
        <div className="min-w-0"><h3 className="mb-3 text-xs font-medium text-slate-500">Cashbook{ledgerRows.length > 1 ? ` (${ledgerRows.length} transactions)` : ""}</h3><div className="space-y-3">{ledgerRows.map(row => transaction(row))}</div></div>
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="max-w-2xl"><p className="text-sm leading-6 text-slate-600">{match.method === "combined" ? "These entries add up to the same amount. Check the payment details." : match.state === "suggested" ? "The amounts agree. Check these are the same payment." : "These transactions are matched."}</p><details><summary className="min-h-11 cursor-pointer py-3 text-xs font-medium text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Why this match?</summary><p className="text-sm leading-6 text-slate-600">{match.reason}</p><p className="mt-2 text-xs text-slate-500">Bank source rows {bankRows.map(row => row.line).join(", ")}; cashbook source rows {ledgerRows.map(row => row.line).join(", ")}.</p></details></div>
        <div className="flex flex-wrap items-center gap-2">
          {match.state === "suggested" ? <>
            <button aria-label={`Accept match for bank source row ${bankRows[0].line}`} className={toolButtonClass} disabled={stale} onClick={() => edit(() => acceptMatch(result, matches, match.id))} type="button"><Check aria-hidden="true" className="h-4 w-4" />Accept match</button>
            <button className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40" disabled={stale} onClick={() => edit(() => releaseMatch(matches, match.id))} type="button">Leave unmatched</button>
          </> : <button aria-label={`Unmatch bank source row ${bankRows[0].line}`} className="min-h-11 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40" disabled={stale} onClick={() => edit(() => releaseMatch(matches, match.id))} type="button">Unmatch</button>}
        </div>
      </div>
    </li>;
  }

  return <ReconciliationSummary result={result} bankMatched={review.bankMatched} ledgerMatched={review.ledgerMatched} suggested={review.suggested.length} unmatched={review.unmatched.length} canUndo={canUndo} stale={stale} activeSection={tab} onReview={changeTab} onDownload={onDownloadExcel} onDownloadCsv={() => exportReport(false)} onNew={onNew} onEditFiles={onEditFiles} onUndo={onUndo}>
    {tab === "suggested" ? <p aria-live="polite" className="mb-4 rounded text-sm leading-6 text-slate-600 focus-visible:outline focus-visible:outline-2" id="reconciliation-review-status" tabIndex={-1}>{review.suggested.length ? `Check the payment details before accepting. ${review.suggested.length} ${review.suggested.length === 1 ? "suggestion left" : "suggestions left"}.` : "All suggestions reviewed. You can check unmatched entries or download the report."}</p> : null}
    {tab === "invalid" ? <div className="mb-4"><p className="max-w-2xl text-sm leading-6 text-slate-600">Correct these rows in your source file, then replace it. They remain in the downloaded report.</p><button className={reconciliationTextButton} onClick={onEditFiles} type="button">Edit files or columns</button></div> : null}
    {error ? <p className="mt-4 text-sm font-medium text-slate-900" role="alert">{error}</p> : null}
    {exported ? <p className="mt-4 text-sm text-slate-600" role="status">Open-items CSV download started.</p> : null}
    <div className="min-w-0">
      {tab === "unmatched" ? <>
        {(review.unmatched.length > 6 || query || cause !== "all") ? <div className="mb-4 grid gap-4 sm:grid-cols-2"><label className="grid min-w-0 gap-2 text-sm font-medium text-slate-900" htmlFor="unmatched-search">Search unmatched<input autoComplete="off" className={toolInputClass} id="unmatched-search" name="unmatched-search" onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Description, reference, date…" type="search" value={query} /></label><MappingSelect id="unmatched-cause" label="Show" onChange={value => { setCause(value); setPage(1); }} options={[{ value: "all", label: "All unmatched" }, { value: "bank", label: "Bank only" }, { value: "ledger", label: "Cashbook only" }, ...Object.entries(causeLabels).map(([value, label]) => ({ value, label }))]} value={cause} /></div> : null}
        <button aria-pressed={manual} className={`${reconciliationTextButton} mb-3 px-0`} disabled={stale} onClick={() => { setManual(value => !value); setSelected(new Set()); }} type="button">{manual ? "Stop selecting rows" : "Match rows manually"}</button>
        {manual ? <p className="mb-5 text-sm leading-6 text-slate-600">Select bank and cashbook rows for the same payment. Their totals must agree.</p> : null}
        {selectedRows.length ? <div className="mb-5 border-y border-slate-200 py-4"><p className="text-sm leading-6 text-slate-700">Bank: {bankSelected.length} selected, {format(bankSum)}. Cashbook: {ledgerSelected.length} selected, {format(ledgerSum)}.</p><p className="mt-1 text-sm font-medium tabular-nums text-slate-900">Difference: {format(bankSum - ledgerSum)}{!sameDirection ? " — select the same money direction." : ""}</p><div className="mt-3 flex flex-wrap gap-2"><button className={toolButtonClass} disabled={!canMatch} onClick={matchSelection} type="button">Match selected</button><button className={toolButtonClass} onClick={() => setSelected(new Set())} type="button">Clear selection</button></div></div> : null}
      </> : null}
      {(tab === "suggested" || tab === "matched") ? <ul className="divide-y divide-slate-200">{(items as Match[]).slice(start, start + pageSize).map(matchRow)}</ul> : tab === "unmatched" ? <div className="grid min-w-0 gap-8 md:grid-cols-2 md:gap-10">{([{ label: "Bank only", rows: bankOnly }, { label: "Cashbook only", rows: ledgerOnly }]).map(({ label, rows }) => <div className="min-w-0" key={label}><h3 className="border-b border-slate-200 pb-3 text-sm font-semibold text-slate-800">{label} <span className="ml-1 font-normal tabular-nums text-slate-500">{rows.length}</span></h3><ul className="divide-y divide-slate-200">{rows.slice(start, start + PAGE_SIZE).map(row => <li className="py-5" key={row.id}>{transaction(row, true)}</li>)}</ul>{rows.length === 0 ? <p className="py-5 text-sm text-slate-500">No transactions in this view.</p> : null}</div>)}</div> : <ul className="divide-y divide-slate-200">{invalid.slice(start, start + PAGE_SIZE).map(row => <li className="py-5 first:pt-0" key={row.id}><p className="text-sm font-semibold text-slate-900">{row.source === "bank" ? "Bank" : "Cashbook"} source row {row.line}</p><p className="mt-2 text-sm leading-6 text-slate-600">{row.reason}</p><details className="mt-2"><summary className="min-h-11 cursor-pointer py-3 text-sm text-slate-600">Original row</summary><p className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">{row.cells.join(" | ")}</p></details></li>)}</ul>}
      {items.length === 0 && tab !== "suggested" ? <p className="py-4 text-sm leading-6 text-slate-600">{tab === "matched" ? "No confirmed matches yet." : tab === "invalid" ? "No invalid rows were found." : "No unmatched rows fit this view."}</p> : null}
      {pages > 1 ? <nav aria-label="Result pages" className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4"><button className={toolButtonClass} disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} type="button">Previous</button><p className="text-sm tabular-nums text-slate-600">{currentPage} of {pages}</p><button className={toolButtonClass} disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} type="button">Next</button></nav> : null}
      {tab === "unmatched" && selectedRows.length ? <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4"><button className={toolButtonClass} disabled={!canMatch} onClick={matchSelection} type="button">Match selected ({selectedRows.length})</button><button className={toolButtonClass} onClick={() => setSelected(new Set())} type="button">Clear selection</button></div> : null}
    </div>
    <div className="mt-4 flex flex-wrap gap-3">
      <button className={reconciliationTextButton} onClick={collapseReview} type="button">Collapse details</button>
      {tab === "unmatched" ? <button className={reconciliationTextButton} onClick={() => exportReport(true)} type="button">Download open items only</button> : null}
    </div>
  </ReconciliationSummary>;
}
