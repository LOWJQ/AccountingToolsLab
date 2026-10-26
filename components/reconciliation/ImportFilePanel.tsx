"use client";

import { FileUp } from "lucide-react";
import { useMemo, useRef } from "react";
import { inferMapping, mappingError, normalizeImport, tableFromDocument } from "@/lib/reconciliation/csv";
import { MAX_HEADER_ROWS, type ColumnMapping, type CsvDocument, type Source } from "@/lib/reconciliation/types";
import { toolButtonClass, toolInputClass } from "@/components/tools/ToolWorkspace";

export type ImportState = { name: string; document: CsvDocument | null; headerRow: number; mapping: ColumnMapping | null; error: string; loading: boolean };
export const emptyImport = (): ImportState => ({ name: "", document: null, headerRow: 0, mapping: null, error: "", loading: false });

export function MappingSelect({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <div className="grid min-w-0 gap-2">
      <label className="text-sm font-medium text-slate-900" htmlFor={id}>{label}</label>
      <select className={`${toolInputClass} pr-7`} id={id} name={id} onChange={event => onChange(event.target.value)} value={value}>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

export function ImportFilePanel({ source, state, currency, onFile, onChange }: {
  source: Source;
  state: ImportState;
  currency: string;
  onFile: (file: File) => void;
  onChange: (state: ImportState) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const label = source === "bank" ? "Bank statement" : "Cashbook / bank ledger";
  const table = useMemo(() => state.document ? tableFromDocument(state.document, state.headerRow) : null, [state.document, state.headerRow]);
  const mapping = state.mapping;
  const error = table && mapping ? mappingError(mapping, table) : "";
  const preview = useMemo(() => table && mapping && !error ? normalizeImport({ name: state.name, table: { ...table, records: table.records.slice(0, 3) }, mapping }, source, currency) : null, [table, mapping, error, source, currency, state.name]);
  const format = (cents: number) => new Intl.NumberFormat("en-MY", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
  function update<K extends keyof ColumnMapping>(key: K, value: ColumnMapping[K]) {
    if (mapping) onChange({ ...state, mapping: { ...mapping, [key]: value }, error: "" });
  }
  function column(key: "date" | "description" | "reference" | "amount" | "moneyIn" | "moneyOut" | "currency", title: string, optional = false) {
    if (!table || !mapping) return null;
    return <MappingSelect id={`${source}-${key}`} label={title} value={String(mapping[key])} options={[{ value: "-1", label: optional ? "Not included" : "Choose column" }, ...table.headers.map((header, index) => ({ label: `${header} (${index + 1})`, value: String(index) }))]} onChange={value => update(key, Number(value))} />;
  }
  return (
    <section className="min-w-0" aria-labelledby={`${source}-heading`}>
      <h3 className="text-base font-semibold text-slate-950" id={`${source}-heading`}>{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{source === "bank" ? "Choose the transaction CSV exported by your bank." : "Choose entries for this bank account from your books."}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values" className="hidden" id={`${source}-file`} onChange={event => { const file = event.target.files?.[0]; if (file) onFile(file); event.target.value = ""; }} ref={fileInput} type="file" />
        <button className={toolButtonClass} disabled={state.loading} id={`${source}-choose`} onClick={() => fileInput.current?.click()} type="button"><FileUp aria-hidden="true" className="h-4 w-4" />{state.loading ? "Reading CSV…" : `${state.document ? "Replace" : "Choose"} ${source === "bank" ? "bank" : "cashbook"} CSV`}</button>
      </div>
      {state.error ? <p className="mt-3 text-sm font-medium leading-6 text-slate-900" role="alert">{state.error}</p> : null}
      {table && mapping ? <>
        <p className="mt-4 break-words text-sm font-medium text-slate-900">{state.name}</p>
        <p className="mt-1 text-sm text-slate-500">{table.records.length.toLocaleString("en-MY")} transaction rows</p>
        <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
          {column("date", "Date column")}
          <MappingSelect id={`${source}-date-format`} label="Date format" value={mapping.dateFormat} onChange={value => update("dateFormat", value as ColumnMapping["dateFormat"])} options={[{ value: "", label: "Choose date format" }, { value: "iso", label: "YYYY-MM-DD" }, { value: "dmy", label: "DD/MM/YYYY" }, { value: "mdy", label: "MM/DD/YYYY" }]} />
          <MappingSelect id={`${source}-amount-mode`} label="Amount layout" value={mapping.amountMode} onChange={value => update("amountMode", value as ColumnMapping["amountMode"])} options={[{ value: "signed", label: "One signed amount column" }, { value: "separate", label: "Separate money in / out" }]} />
          {mapping.amountMode === "signed" ? column("amount", "Amount column") : <>{column("moneyIn", "Money in column")}{column("moneyOut", "Money out column")}</>}
        </div>
        <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-slate-700"><input className="h-4 w-4 shrink-0 accent-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" checked={mapping.invert} onChange={event => update("invert", event.target.checked)} type="checkbox" />Reverse money in and out</label>
        <p className="text-xs leading-5 text-slate-500">Check the preview: positive amounts mean money in, negative amounts mean money out.</p>
        <details className="mt-3">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">More column settings</summary>
          <div className="mt-2 grid min-w-0 gap-4 sm:grid-cols-2">
            {column("description", "Description column", true)}
            {column("reference", "Reference column", true)}
            {column("currency", "Currency column", true)}
            <MappingSelect id={`${source}-number-format`} label="Number format" value={mapping.numberFormat} options={[{ value: "dot", label: "1,234.56" }, { value: "comma", label: "1.234,56" }]} onChange={value => update("numberFormat", value as ColumnMapping["numberFormat"])} />
            <MappingSelect id={`${source}-header-row`} label="Header row" value={String(state.headerRow)} options={state.document!.records.slice(0, Math.min(MAX_HEADER_ROWS, state.document!.records.length - 1)).map((record, index) => ({ value: String(index), label: `Row ${index + 1}: ${record.cells.join(" / ").slice(0, 65)}` }))} onChange={value => { const headerRow = Number(value); onChange({ ...state, headerRow, mapping: inferMapping(tableFromDocument(state.document!, headerRow), source) }); }} />
          </div>
        </details>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-900">First 3 rows</p>
          {error ? <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p> : null}
          <ul className="mt-2 divide-y divide-slate-100">
            {table.records.slice(0, 3).map(record => {
              const transaction = preview?.transactions.find(row => row.line === record.line);
              const invalid = preview?.invalid.find(row => row.line === record.line);
              return <li className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-3 text-sm" key={record.line}>
                <div className="min-w-0"><p className="break-words text-slate-900">{record.cells[mapping.description] || record.cells[mapping.reference] || `CSV line ${record.line}`}</p><p className="mt-1 text-xs text-slate-500">{transaction?.date || record.cells[mapping.date] || "Date column not selected"}</p></div>
                <p className="max-w-full break-words text-right font-medium tabular-nums text-slate-900">{transaction ? format(transaction.cents) : "—"}</p>
                {invalid ? <p className="col-span-2 mt-1 text-xs leading-5 text-slate-600">Line {record.line}: {invalid.reason}</p> : null}
              </li>;
            })}
          </ul>
        </div>
      </> : null}
    </section>
  );
}
