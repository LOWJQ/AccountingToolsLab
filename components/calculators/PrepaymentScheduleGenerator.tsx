"use client";

import { Download } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolResultRows, ToolSelectField, ToolWorkspace, toolButtonClass, toolInputClass } from "@/components/tools/ToolWorkspace";
import { calculatePrepaymentSchedule, getPrepaymentErrors, prepaymentScheduleCsv, type PrepaymentField, type PrepaymentInput } from "@/lib/calculators/prepayment";
import { downloadCsv } from "@/lib/utils/download-blob";

const EMPTY_INPUT: PrepaymentInput = { amount: "", startDate: "", endDate: "", method: "monthly" };
const PAGE_SIZE = 12;
const monthFormatter = new Intl.DateTimeFormat("en-MY", { month: "short", year: "numeric", timeZone: "UTC" });
const methodOptions = [
  { label: "Monthly (prorate partial months)", value: "monthly" as const },
  { label: "Daily", value: "daily" as const }
];

function monthLabel(month: string): string {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}

export function PrepaymentScheduleGenerator() {
  const [input, setInput] = useState<PrepaymentInput>(EMPTY_INPUT);
  const [touched, setTouched] = useState<ReadonlySet<PrepaymentField>>(new Set());
  const [page, setPage] = useState(0);
  const [downloadError, setDownloadError] = useState("");
  const { currency, formatCurrency } = useCurrency();
  const startId = useId();
  const endId = useId();
  const errors = getPrepaymentErrors(input);
  const complete = Boolean(input.amount.trim() && input.startDate && input.endDate);
  const result = useMemo(() => {
    if (Object.keys(getPrepaymentErrors(input)).length) return null;
    return calculatePrepaymentSchedule(input);
  }, [input]);
  const rows = result?.periods.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) ?? [];
  const pageCount = Math.ceil((result?.periods.length ?? 0) / PAGE_SIZE);
  const money = (cents: number) => formatCurrency(cents / 100);
  const fieldError = (field: PrepaymentField) => touched.has(field) || complete ? errors[field] : undefined;

  function update<K extends keyof PrepaymentInput>(key: K, value: PrepaymentInput[K]) {
    setInput(previous => ({ ...previous, [key]: value }));
    setPage(0);
    setDownloadError("");
  }

  function touch(field: PrepaymentField) {
    setTouched(previous => new Set([...previous, field]));
  }

  function download() {
    if (!result) return;
    try {
      downloadCsv(prepaymentScheduleCsv(result, currency), `prepayment-schedule-${input.startDate}-${input.endDate}.csv`);
      setDownloadError("");
    } catch {
      setDownloadError("The download could not start. Please try again.");
    }
  }

  return (
    <div className="grid min-w-0 gap-8">
      <ToolWorkspace title="Prepayment details" inputs={<>
        <ToolNumberField label={`Prepaid amount (${currency})`} name="prepaymentAmount" type="text" value={input.amount} placeholder="e.g. 12000.00" onChange={event => update("amount", event.target.value)} onBlur={() => touch("amount")} error={fieldError("amount")} />
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          {([
            ["startDate", "Coverage start", startId],
            ["endDate", "Coverage end", endId]
          ] as const).map(([field, label, id]) => <div className="grid min-w-0 content-start gap-2" key={field}>
            <label className="text-sm font-medium text-slate-950" htmlFor={id}>{label}</label>
            <input autoComplete="off" className={toolInputClass} type="date" id={id} name={field} min="1900-01-01" max="9999-12-31" value={input[field]} onChange={event => update(field, event.target.value)} onBlur={() => touch(field)} aria-invalid={Boolean(fieldError(field)) || undefined} aria-describedby={fieldError(field) ? `${id}-error` : undefined} />
            {fieldError(field) ? <p className="text-sm font-medium leading-6 text-slate-900" id={`${id}-error`}>{fieldError(field)}</p> : null}
          </div>)}
        </div>
        <details className="group">
          <summary className="w-fit cursor-pointer rounded text-sm font-medium text-slate-600 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500">Calculation options</summary>
          <div className="mt-4 grid gap-2">
            <ToolSelectField label="Allocation method" value={input.method} options={methodOptions} onChange={value => update("method", value)} />
            <p className="text-sm leading-6 text-slate-600">Monthly gives full months equal weight and prorates partial months. Daily gives each covered day equal weight. Both coverage dates are included.</p>
          </div>
        </details>
        <ToolReset onClick={() => { setInput(EMPTY_INPUT); setTouched(new Set()); setPage(0); setDownloadError(""); }} />
      </>}>
        <ToolPrimaryResult label="First month expense" value={result ? money(result.periods[0].expenseCents) : "—"} />
        {result ? <>
          <ToolResultRows rows={[["Total prepaid", money(result.amountCents)], ["Schedule", `${result.periods.length} ${result.periods.length === 1 ? "month" : "months"}`]]} />
          <ToolNote>{result.method === "monthly" ? "Monthly allocation. Partial months are prorated by days." : "Daily allocation. Monthly charges follow the number of covered days."}</ToolNote>
        </> : <ToolNote>{complete ? "Check the highlighted fields to see your schedule." : "Enter the amount and coverage dates to see your schedule."}</ToolNote>}
      </ToolWorkspace>

      {result ? <section aria-labelledby="prepayment-schedule-heading" className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950" id="prepayment-schedule-heading">Monthly schedule</h2>
          <button className={toolButtonClass} type="button" onClick={download}><Download aria-hidden="true" className="h-4 w-4" />Download CSV</button>
        </div>
        {downloadError ? <p className="mt-3 text-sm text-slate-900" role="alert">{downloadError}</p> : null}
        <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm tabular-nums">
            <caption className="sr-only">Monthly expense and remaining prepaid balance in {currency}. {result.method === "monthly" ? "Monthly allocation with partial months prorated." : "Daily allocation."}</caption>
            <thead className="bg-slate-50 text-slate-600"><tr>
              <th scope="col" className="px-4 py-3 text-left font-medium">Month</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Expense</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Remaining prepaid</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-200 text-slate-950">{rows.map(row => <tr key={row.month}>
              <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium">{monthLabel(row.month)}</th>
              <td className="whitespace-nowrap px-4 py-3 text-right">{money(row.expenseCents)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">{money(row.remainingCents)}</td>
            </tr>)}</tbody>
            <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-950"><tr><th scope="row" className="px-4 py-3 text-left">{pageCount > 1 ? "Total (all months)" : "Total"}</th><td className="whitespace-nowrap px-4 py-3 text-right">{money(result.amountCents)}</td><td className="whitespace-nowrap px-4 py-3 text-right">{money(0)}</td></tr></tfoot>
          </table>
        </div>
        {pageCount > 1 ? <nav aria-label="Schedule pages" className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-slate-600">Months {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, result.periods.length)} of {result.periods.length}</p>
          <div className="flex gap-2"><button className={toolButtonClass} type="button" disabled={page === 0} onClick={() => setPage(previous => previous - 1)}>Previous</button><button className={toolButtonClass} type="button" disabled={page + 1 === pageCount} onClick={() => setPage(previous => previous + 1)}>Next</button></div>
        </nav> : null}
      </section> : null}
    </div>
  );
}
