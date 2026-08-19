"use client";

import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  checkEInvoiceRequirement,
  type EInvoiceRequirementResult
} from "@/lib/calculators/e-invoice-requirement";
import type { EInvoiceRequirementStatus } from "@/lib/einvoice/einvoice-types";
import { formatLongDate } from "@/lib/utils/format-date";

const DEFAULT_TURNOVER = "1500000";

/**
 * Same badge treatment as the trial balance calculator's status card, so a
 * status reads the same way across the site: emerald for the settled case,
 * rose for the one that needs action, amber for the heads-up in between.
 */
const statusBadges: Record<EInvoiceRequirementStatus, { className: string; label: string }> = {
  exempt: { className: "bg-emerald-100 text-emerald-800", label: "Exempt" },
  "required-now": { className: "bg-rose-100 text-rose-800", label: "Required now" },
  "required-later": { className: "bg-amber-100 text-amber-900", label: "Upcoming" }
};

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function describeCountdown(result: EInvoiceRequirementResult): string {
  if (result.daysUntilMandatory === null) {
    return "Not applicable";
  }

  if (result.daysUntilMandatory > 0) {
    return `${result.daysUntilMandatory.toLocaleString("en-MY")} days away`;
  }

  if (result.daysUntilMandatory === 0) {
    return "Starts today";
  }

  return `${Math.abs(result.daysUntilMandatory).toLocaleString("en-MY")} days ago`;
}

export function EInvoiceRequirementChecker() {
  const [annualTurnover, setAnnualTurnover] = useState(DEFAULT_TURNOVER);
  // Read on the client only. Rendering the date during SSR would risk a
  // hydration mismatch whenever server and browser sit on different calendar
  // days, and the answer depends on today's date.
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(toIsoDate(new Date()));
  }, []);

  const calculation = useMemo(() => {
    if (today === null) {
      return { result: null, message: "Checking today's date..." };
    }

    if (!annualTurnover.trim()) {
      return { result: null, message: "Enter your annual turnover to check your position." };
    }

    try {
      return {
        result: checkEInvoiceRequirement({
          annualTurnover: parseAmount(annualTurnover),
          asOfDate: today
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the value and try again."
      };
    }
  }, [annualTurnover, today]);

  const result = calculation.result;
  const badge = result ? statusBadges[result.status] : null;

  return (
    <section
      aria-labelledby="e-invoice-requirement-heading"
      className="w-full overflow-visible rounded-lg border border-slate-200 bg-white"
    >
      <h2 className="sr-only" id="e-invoice-requirement-heading">
        e-Invoice requirement checker inputs and results
      </h2>

      <div className="grid gap-5 p-5 md:grid-cols-3 md:p-6">
        <label className="grid min-w-0 gap-2" htmlFor="e-invoice-turnover">
          <span className="text-xs font-medium text-slate-600">Annual turnover</span>
          <span className="flex h-11 min-w-0 overflow-hidden rounded-lg border border-stone-300 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
            <span className="flex h-full items-center border-r border-stone-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">
              RM
            </span>
            <input
              className="h-full min-w-0 flex-1 border-0 bg-white px-3 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
              id="e-invoice-turnover"
              inputMode="decimal"
              min="0"
              onChange={(event) => setAnnualTurnover(event.target.value)}
              placeholder="1500000"
              step="1000"
              type="number"
              value={annualTurnover}
            />
          </span>
        </label>

        <p className="text-sm leading-6 text-slate-600 md:col-span-2 md:self-end">
          LHDN phases businesses in by annual turnover only, so this is the one figure the answer
          depends on. Thresholds are published in Malaysian ringgit.
        </p>
      </div>

      <div aria-live="polite" className="border-t border-slate-200 p-5 md:p-6">
        {result && badge ? (
          <div>
            <div className="grid gap-5 md:grid-cols-3">
              <ResultStat label="Your position" value={badge.label} valueClassName={badge.className}>
                <button
                  className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  onClick={() => setAnnualTurnover(DEFAULT_TURNOVER)}
                  type="button"
                >
                  <RefreshCcw aria-hidden="true" className="h-4 w-4" />
                  Reset
                </button>
              </ResultStat>
              <ResultStat label="Phase" value={result.phase ? result.phase.label : "Not in scope"} />
              <ResultStat
                label="Mandatory from"
                value={result.phase ? formatLongDate(result.phase.mandatoryFrom) : "Not applicable"}
              >
                {result.phase ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {describeCountdown(result)}
                  </p>
                ) : null}
              </ResultStat>
            </div>

            <p className="mt-6 border-t border-slate-200 pt-5 text-base font-semibold leading-7 text-slate-950">
              {result.headline}
            </p>
            <p className="mt-2 text-base leading-7 text-black">{result.explanation}</p>

            <ul className="mt-5 space-y-3 border-l-2 border-slate-300 pl-6 text-sm leading-6 text-slate-700">
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-600">{calculation.message}</p>
        )}
      </div>
    </section>
  );
}

function ResultStat({
  children,
  label,
  value,
  valueClassName
}: {
  children?: ReactNode;
  label: string;
  value: string;
  /** Badge classes, when the value reads as a status rather than a figure. */
  valueClassName?: string;
}) {
  return (
    <div className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0 md:first:border-l-0 md:first:pl-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      {valueClassName ? (
        // Wrapped in a block so anything rendered after the badge starts on its
        // own line: the pill is inline-flex and would otherwise sit beside it.
        <div>
          <div
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${valueClassName}`}
          >
            {value}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {value}
        </p>
      )}
      {children}
    </div>
  );
}
