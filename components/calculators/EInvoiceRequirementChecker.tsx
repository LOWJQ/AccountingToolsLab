"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolResultRows, ToolWorkspace } from "@/components/tools/ToolWorkspace";
import {
  checkEInvoiceRequirement,
  type EInvoiceRequirementResult
} from "@/lib/calculators/e-invoice-requirement";
import type { EInvoiceRequirementStatus } from "@/lib/einvoice/einvoice-types";
import { formatLongDate } from "@/lib/utils/format-date";

const DEFAULT_TURNOVER = "1500000";

const statusLabels: Record<EInvoiceRequirementStatus, string> = {
  exempt: "Exempt",
  "required-now": "Required now",
  "required-later": "Upcoming"
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
      return { result: null, message: "Checking today’s date…" };
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

  return (
    <ToolWorkspace title="Check your turnover" inputs={<>
      <ToolNumberField label="Annual turnover (MYR)" hint="Enter your annual turnover in Malaysian ringgit." min="0" name="annualTurnover" value={annualTurnover} onChange={e => setAnnualTurnover(e.target.value)} placeholder="e.g. 1500000" error={Number(annualTurnover) < 0 ? "Enter a turnover of zero or more." : undefined} />
      <p className="text-sm leading-6 text-slate-600">Get an indication of your e-Invoice phase based on turnover. Review the exceptions in your result.</p>
      <ToolReset onClick={() => setAnnualTurnover(DEFAULT_TURNOVER)} />
    </>}>
      <ToolPrimaryResult label="e-Invoice requirement" value={result ? statusLabels[result.status] : "—"} />
      {result ? <>
        <ToolResultRows rows={[["Phase", result.phase?.label ?? "Not in scope"], ["Mandatory from", result.phase ? formatLongDate(result.phase.mandatoryFrom) : "Not applicable"]]} />
        {result.phase ? <p className="text-sm text-slate-500">{describeCountdown(result)}</p> : null}
        <p className="mt-6 text-sm font-semibold leading-6 text-slate-950">{result.headline}</p>
        <ToolNote>{result.explanation}</ToolNote>
        {result.notes.length ? <details className="mt-5 border-t border-slate-200 pt-3">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400">Exceptions and notes</summary>
          <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">{result.notes.map(note => <li key={note}>{note}</li>)}</ul>
        </details> : null}
      </> : <ToolNote warning={annualTurnover.trim() !== "" && today !== null}>{calculation.message}</ToolNote>}
    </ToolWorkspace>
  );
}
