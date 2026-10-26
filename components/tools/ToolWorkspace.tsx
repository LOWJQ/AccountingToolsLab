"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { SelectMenu, type SelectMenuOption } from "@/components/ui/SelectMenu";

// Matches the SST and trial balance tools: one workspace, two clear areas,
// and open result rows rather than a second set of cards.
export function ToolWorkspace({ children, inputs, title, wide = false }: {
  children: ReactNode;
  inputs: ReactNode;
  title: string;
  wide?: boolean;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={`grid min-w-0 rounded-lg border border-slate-200 bg-white ${wide ? "lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"}`}>
      <div className="min-w-0 p-5 sm:p-6 lg:p-8">
        <h2 className="text-base font-semibold text-slate-950" id={headingId}>{title}</h2>
        <div className="mt-5 grid min-w-0 gap-5">{inputs}</div>
      </div>
      <div className="min-w-0 border-t border-slate-200 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
        <h3 className="text-base font-semibold text-slate-950">Your result</h3>
        <div aria-live="polite" aria-atomic="true" className="mt-6 min-w-0">{children}</div>
      </div>
    </section>
  );
}

export const toolInputClass = "h-11 w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 text-base text-slate-950 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
export const toolButtonClass = "inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

export function ToolNumberField({ label, hint, invalid, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; invalid?: boolean; error?: string }) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return (
    <div className="grid min-w-0 gap-2">
      <label className="text-sm font-medium text-slate-950" htmlFor={id}>{label}</label>
      <input autoComplete="off" className={toolInputClass} id={id} inputMode="decimal" step="any" type="number" {...props} aria-invalid={Boolean(invalid || error) || undefined} aria-describedby={describedBy || undefined} />
      {hint ? <p className="text-sm leading-6 text-slate-600" id={`${id}-hint`}>{hint}</p> : null}
      {error ? <p className="text-sm font-medium leading-6 text-slate-900" id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

export function ToolReset({ onClick }: { onClick: () => void }) {
  return <button className={toolButtonClass} onClick={onClick} type="button"><RotateCcw aria-hidden="true" className="h-4 w-4" />Reset</button>;
}

export function ToolSelectField<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: SelectMenuOption<T>[] }) {
  const id = useId();
  return <div className="grid min-w-0 gap-2 [&_button]:min-h-11 [&_button]:text-base"><label className="text-sm font-medium text-slate-950" htmlFor={id}>{label}</label><SelectMenu ariaLabel={label} id={id} onChange={onChange} options={options} value={value} /></div>;
}

export function ToolPrimaryResult({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-slate-600">{label}</p><p className="mt-2 break-words text-3xl font-semibold tracking-tight tabular-nums text-slate-950 sm:text-4xl">{value}</p></div>;
}

export function ToolResultRows({ rows }: { rows: ReadonlyArray<readonly [string, ReactNode]> }) {
  return <dl className="mt-6 divide-y divide-slate-200 border-t border-slate-200">{rows.map(([label, value]) => <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4" key={label}><dt className="text-sm text-slate-600">{label}</dt><dd className="min-w-0 max-w-full break-words text-right text-base font-semibold tabular-nums text-slate-950">{value}</dd></div>)}</dl>;
}

export function ToolNote({ children, warning = false }: { children: ReactNode; warning?: boolean }) {
  return <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-600">{warning ? <TriangleAlert aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" /> : null}<span className="min-w-0">{children}</span></p>;
}

export function ToolFormula({ children }: { children: ReactNode }) {
  return <div className="mt-6 border-t border-slate-200 pt-5"><p className="text-sm font-medium text-slate-950">Formula</p><p className="mt-2 text-sm leading-6 text-slate-600">{children}</p></div>;
}
