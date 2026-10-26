"use client";

import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ImportFilePanel, emptyImport, type ImportState } from "./ImportFilePanel";
import { ReconciliationResults } from "./ReconciliationResults";
import { ReconciliationDownloadComplete, reconciliationPrimaryButton } from "./ReconciliationDownloadComplete";
import { downloadBlob, downloadCsv } from "@/lib/reconciliation/download";
import { createReport } from "@/lib/reconciliation/report";
import { getReview } from "@/lib/reconciliation/review";
import { toolButtonClass, toolInputClass } from "@/components/tools/ToolWorkspace";
import { useReconciliationWorker } from "@/hooks/useReconciliationWorker";
import { inferHeaderRow, inferMapping, mappingError, tableFromDocument } from "@/lib/reconciliation/csv";
import { MAX_CSV_BYTES, type CsvDocument, type ImportInput, type Match, type MatchOptions, type Reconciliation, type Source } from "@/lib/reconciliation/types";

function createImport(document: CsvDocument, name: string, source: Source): ImportState {
  const headerRow = inferHeaderRow(document);
  return { name, document, headerRow, mapping: inferMapping(tableFromDocument(document, headerRow), source), error: "", loading: false };
}
function importInput(state: ImportState): ImportInput {
  if (!state.document || !state.mapping) throw new Error("Choose both files first.");
  return { name: state.document.sheet ? `${state.name} — ${state.document.sheet}` : state.name, table: tableFromDocument(state.document, state.headerRow), mapping: state.mapping };
}
function decodeFile(bytes: ArrayBuffer): string {
  const prefix = new Uint8Array(bytes, 0, Math.min(3, bytes.byteLength));
  const encoding = prefix[0] === 0xff && prefix[1] === 0xfe ? "utf-16le" : prefix[0] === 0xfe && prefix[1] === 0xff ? "utf-16be" : "utf-8";
  try { return new TextDecoder(encoding, { fatal: true }).decode(bytes); }
  catch { throw new Error("The file encoding could not be read. Save it as CSV UTF-8 and try again."); }
}

type ConfirmAction = "clear" | "compare" | null;

export type ReconciliationStage = "files" | "review" | "download";

export function BankReconciliationMatcher({ onStageChange }: { onStageChange?: (stage: ReconciliationStage) => void } = {}) {
  const [bank, setBank] = useState<ImportState>(emptyImport);
  const [ledger, setLedger] = useState<ImportState>(emptyImport);
  const [days, setDays] = useState("3");
  const [combined, setCombined] = useState(true);
  const [statementEnd, setStatementEnd] = useState("");
  const { currency } = useCurrency();
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportFormat, setReportFormat] = useState<"Excel" | "CSV">("Excel");
  const [result, setResult] = useState<Reconciliation | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Match[][]>([]);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [stage, setStage] = useState<ReconciliationStage>("files");
  const [unsaved, setUnsaved] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [comparisonId, setComparisonId] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const settings = useRef<HTMLDetailsElement>(null);
  const version = useRef(0);
  const readVersions = useRef({ bank: 0, ledger: 0 });
  const { request, cancel } = useReconciliationWorker();
  const stale = dirty || Boolean(result && result.options.currency !== currency);

  useEffect(() => {
    onStageChange?.(stage);
    const frame = window.requestAnimationFrame(() => {
      const heading = document.getElementById(stage === "files" ? "bank-choose" : stage === "download" ? "reconciliation-complete-title" : "reconciliation-results-title");
      if (stage !== "files" || comparisonId > 0) {
        heading?.focus({ preventScroll: true });
        document.getElementById("reconciliation-workflow")?.scrollIntoView({ block: "start" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stage, comparisonId, onStageChange]);
  useEffect(() => {
    if (confirm) { dialog.current?.showModal(); cancelButton.current?.focus(); }
    else dialog.current?.close();
  }, [confirm]);
  useEffect(() => {
    if (!unsaved) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  async function loadFile(source: Source, file: File) {
    const setter = source === "bank" ? setBank : setLedger;
    const readVersion = ++readVersions.current[source];
    if (!/\.(xlsx|csv|tsv|txt)$/i.test(file.name) || file.size > MAX_CSV_BYTES) {
      setter(current => ({ ...current, loading: false, error: file.size > MAX_CSV_BYTES ? "Choose a file up to 5 MB." : "Choose CSV or Excel (.xlsx). PDF and older .xls files are not supported." }));
      return;
    }
    setter(current => ({ ...current, loading: true, error: "" }));
    try {
      const bytes = await file.arrayBuffer();
      if (readVersions.current[source] === readVersion) await readFile(source, file.name, bytes, undefined, readVersion);
    } catch { if (readVersions.current[source] === readVersion) setter(current => ({ ...current, loading: false, error: "The file could not be read. Choose it again." })); }
  }
  async function readFile(source: Source, name: string, bytes: ArrayBuffer, sheet?: string, expectedVersion?: number) {
    const setter = source === "bank" ? setBank : setLedger;
    const readVersion = expectedVersion ?? ++readVersions.current[source];
    setter(current => ({ ...current, loading: true, error: "" }));
    try {
      const response = /\.xlsx$/i.test(name) ? await request({ type: "excel", bytes, sheet }) : await request({ type: "parse", text: decodeFile(bytes) });
      if ((response.type !== "parsed" && response.type !== "workbook") || readVersions.current[source] !== readVersion) return;
      const imported = response.document.records.length < 2 ? { ...emptyImport(), name, error: "This worksheet needs a header and at least one transaction. Choose another worksheet." } : createImport(response.document, name, source);
      setter(response.type === "workbook" ? { ...imported, workbook: { bytes, sheets: response.sheets, selected: response.document.sheet! } } : imported);
      setDirty(Boolean(result));
      setError("");
    } catch (cause) {
      if (readVersions.current[source] === readVersion) setter(current => ({ ...current, loading: false, error: cause instanceof Error ? cause.message : "The file could not be read." }));
    }
  }

  async function compareInputs(bankInput: ImportInput, ledgerInput: ImportInput, options: MatchOptions) {
    const runVersion = ++version.current;
    setBusy(true);
    setError("");
    try {
      const response = await request({ type: "match", bank: bankInput, ledger: ledgerInput, options });
      if (response.type !== "matched" || runVersion !== version.current) return;
      setResult(response.result);
      setMatches(response.result.matches);
      setNotes({});
      setHistory([]);
      setUnsaved(false);
      setDirty(false);
      setStage("review");
      setComparisonId(current => current + 1);

    } catch (cause) {
      if (runVersion === version.current) setError(cause instanceof Error ? cause.message : "The files could not be compared.");
    } finally {
      if (runVersion === version.current) setBusy(false);
    }
  }
  function compare() {
    try {
      if (bank.loading || ledger.loading) throw new Error("Wait for the files to finish loading.");
      if (!bank.document || !ledger.document) {
        document.getElementById(!bank.document ? "bank-choose" : "ledger-choose")?.focus();
        throw new Error("Choose a bank statement and cashbook file first.");
      }
      const inputs = { bank: importInput(bank), ledger: importInput(ledger) };
      for (const source of ["bank", "ledger"] as const) {
        const problem = mappingError(inputs[source].mapping, inputs[source].table);
        if (problem) {
          document.getElementById(`${source}-${problem.includes("format") ? "date-format" : "date"}`)?.focus();
          throw new Error(`${source === "bank" ? "Bank statement" : "Cashbook"}: ${problem}`);
        }
      }
      if (days.trim() === "" || !Number.isInteger(Number(days)) || Number(days) < 0 || Number(days) > 31) {
        if (settings.current) settings.current.open = true;
        document.getElementById("match-days")?.focus();
        throw new Error("Choose a date difference from 0 to 31 days.");
      }
      void compareInputs(inputs.bank, inputs.ledger, { days: Number(days), combined, currency, statementEnd });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Check the files and settings."); }
  }
  function clear() {
    cancel();
    version.current++;
    readVersions.current.bank++;
    readVersions.current.ledger++;
    setBank(emptyImport());
    setLedger(emptyImport());
    setResult(null);
    setMatches([]);
    setNotes({});
    setHistory([]);
    setStatementEnd("");
    setError("");
    setDirty(false);
    setStage("files");
    setUnsaved(false);
    setBusy(false);
    setExporting(false);
  }
  const note = useCallback((id: string, value: string) => { setNotes(current => ({ ...current, [id]: value })); setUnsaved(true); }, []);
  function updateMatches(next: Match[]) { setHistory(current => [...current.slice(-19), matches]); setMatches(next); setUnsaved(true); }

  function downloadReport(openOnly: boolean) {
    if (!result) return;
    try {
      downloadCsv(createReport(result, matches, notes, openOnly), openOnly ? "bank-reconciliation-open-items.csv" : "bank-reconciliation-report.csv");
      if (!openOnly) { setReportFormat("CSV"); setUnsaved(false); setStage("download"); }
      setError("");
      return true;
    } catch { setError("The report could not be downloaded. Try again in this browser."); return false; }
  }
  async function downloadExcel() {
    if (!result || exporting) return;
    const runVersion = version.current;
    setExporting(true);
    setError("");
    try {
      const response = await request({ type: "report", result, matches, notes });
      if (response.type !== "report" || runVersion !== version.current) return;
      downloadBlob(new Blob([response.bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "bank-reconciliation-working-paper.xlsx");
      setReportFormat("Excel");
      setUnsaved(false);
      setStage("download");
    } catch (cause) { if (runVersion === version.current) setError(cause instanceof Error ? cause.message : "The Excel report could not be created. Try CSV instead."); }
    finally { if (runVersion === version.current) setExporting(false); }
  }

  return <div className="min-w-0 scroll-mt-24" id="reconciliation-workflow">
    <ol aria-label="Comparison progress" className="mb-8 flex flex-wrap gap-x-3 gap-y-3 border-b border-slate-200 pb-5 text-sm sm:gap-x-10">
      {([['files', 'Choose files'], ['review', 'Review results'], ['download', 'Download']] as const).map(([step, label], index) => <li aria-current={stage === step ? "step" : undefined} className={stage === step ? "whitespace-nowrap font-semibold text-slate-950" : "whitespace-nowrap text-slate-500"} key={step}><span aria-hidden="true" className="mr-2 tabular-nums">{index + 1}.</span>{label}</li>)}
    </ol>
    {error ? <p className="mb-5 text-sm font-medium leading-6 text-slate-900" role="alert">{error}</p> : null}
    {stage === "files" ? <>
      {result ? <button className={`${toolButtonClass} mb-5`} disabled={busy} onClick={() => setStage("review")} type="button">{stale ? "View previous results" : "Back to results"}</button> : null}
      <div className="rounded-lg border border-slate-200 bg-white">
        <fieldset className="min-w-0" disabled={busy}>
          <legend className="sr-only">Choose files and matching settings</legend>
          <div className="grid min-w-0 lg:grid-cols-2">
            <div className="min-w-0 p-5 sm:p-6 lg:p-8"><ImportFilePanel currency={currency} onChange={state => { setBank(state); setDirty(Boolean(result)); }} onFile={file => void loadFile("bank", file)} onSheet={sheet => { if (bank.workbook) void readFile("bank", bank.name, bank.workbook.bytes, sheet); }} source="bank" state={bank} /></div>
            <div className="min-w-0 border-t border-slate-200 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8"><ImportFilePanel currency={currency} onChange={state => { setLedger(state); setDirty(Boolean(result)); }} onFile={file => void loadFile("ledger", file)} onSheet={sheet => { if (ledger.workbook) void readFile("ledger", ledger.name, ledger.workbook.bytes, sheet); }} source="ledger" state={ledger} /></div>
          </div>
          <div className="border-t border-slate-200 px-5 py-5 sm:px-6 lg:px-8">
            <details ref={settings}>
              <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                Matching settings (optional)
              </summary>
              <div className="mt-3 grid min-w-0 gap-5 sm:grid-cols-2">
                <div className="max-w-sm">
                  <label className="grid min-w-0 gap-2 text-sm font-medium text-slate-900" htmlFor="match-days">Allow date difference (days)<input aria-describedby="match-days-hint" autoComplete="off" className={toolInputClass} id="match-days" name="match-days" inputMode="numeric" max="31" min="0" onChange={event => { setDays(event.target.value); setDirty(Boolean(result)); }} step="1" type="number" value={days} /></label>
                  <p className="mt-2 text-xs leading-5 text-slate-500" id="match-days-hint">All rows are checked. Matches must fall within this date gap.</p>
                </div>
                <div className="max-w-sm">
                <label className="grid gap-2 text-sm font-medium text-slate-900" htmlFor="statement-end">
                  Statement end date (optional)
                  <input aria-describedby="statement-end-hint" className={toolInputClass} id="statement-end" name="statement-end" onChange={event => { setStatementEnd(event.target.value); setDirty(Boolean(result)); }} type="date" value={statementEnd} />
                </label>
                <p className="mt-2 text-sm leading-6 text-slate-600" id="statement-end-hint">
                  Helps spot entries that may not have cleared by this date.
                </p>
                </div>
                <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-slate-700 sm:col-span-2"><input checked={combined} className="h-4 w-4 shrink-0 accent-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" onChange={event => { setCombined(event.target.checked); setDirty(Boolean(result)); }} type="checkbox" />Suggest combined payments (up to 3 transactions)</label>
              </div>
            </details>
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:px-6 lg:px-8">
          <p className="max-w-xl text-xs leading-5 text-slate-500">{busy ? "Comparing locally. Your transaction data is not uploaded." : "Check dates and money direction in the previews, then compare."}</p>
          <div className="flex flex-wrap gap-3">{busy ? <button className={toolButtonClass} onClick={() => { version.current++; cancel(); setBusy(false); setError("Comparison cancelled. Your selected files are still available."); }} type="button">Cancel</button> : null}<button className={reconciliationPrimaryButton} disabled={busy || bank.loading || ledger.loading} onClick={() => unsaved ? setConfirm("compare") : compare()} type="button">{busy ? "Comparing…" : "Compare transactions"}<ArrowRight aria-hidden="true" className="h-4 w-4" /></button></div>
        </div>
      </div>
    </> : null}
    {stage === "review" && result ? <>
      {stale ? <p className="mb-5 border-l-2 border-slate-300 pl-4 text-sm leading-6 text-slate-700" role="status">These results use the previous files and settings. <button className="min-h-11 font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2" onClick={() => setStage("files")} type="button">Return to files</button> to compare again.</p> : null}
      <fieldset className="min-w-0" disabled={exporting} aria-busy={exporting}><legend className="sr-only">Comparison results</legend>{exporting ? <p role="status" className="mb-4 text-sm text-slate-600">Preparing Excel working paper…</p> : null}<ReconciliationResults onDownloadExcel={() => void downloadExcel()} canUndo={history.length > 0} key={comparisonId} matches={matches} notes={notes} onChange={updateMatches} onDownload={downloadReport} onNew={() => setConfirm("clear")} onEditFiles={() => setStage("files")} onNote={note} onUndo={() => { const previous = history[history.length - 1]; if (previous) { setMatches(previous); setHistory(current => current.slice(0, -1)); setUnsaved(true); } }} result={result} stale={stale} /></fieldset>
    </> : null}
    {stage === "download" && result ? <ReconciliationDownloadComplete downloading={exporting} format={reportFormat} result={result} openCount={getReview(result, matches).open.length} onEdit={() => setStage("review")} onNew={clear} onDownload={() => reportFormat === "Excel" ? void downloadExcel() : downloadReport(false)} /> : null}
    <dialog aria-labelledby="reconciliation-confirm-title" className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 text-slate-950 backdrop:bg-slate-950/35" onCancel={() => setConfirm(null)} ref={dialog}>
      <h2 className="text-xl font-semibold" id="reconciliation-confirm-title">{confirm === "clear" ? "Start a new comparison?" : "Replace this comparison?"}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Download your current report first if you need to keep it. Your original files stay on your device.</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3"><button className={toolButtonClass} onClick={() => setConfirm(null)} ref={cancelButton} type="button">Keep this comparison</button><button className={toolButtonClass} onClick={() => { const action = confirm; setConfirm(null); if (action === "clear") clear(); else compare(); }} type="button">{confirm === "clear" ? "Choose new files" : "Replace comparison"}</button></div>
    </dialog>
  </div>;
}
