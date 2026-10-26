"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolResultRows, ToolSelectField, ToolWorkspace, toolInputClass } from "@/components/tools/ToolWorkspace";
import {
  checkEInvoiceRequirement,
  type EInvoiceRequirementResult,
  type EInvoiceRequirementInput
} from "@/lib/calculators/e-invoice-requirement";
import { EINVOICE_EXEMPTION_THRESHOLD, EINVOICE_GUIDELINE_URL, EINVOICE_LAST_REVIEWED, EINVOICE_SPECIFIC_GUIDELINE_URL } from "@/lib/data/einvoice/phases";
import type { EInvoiceRequirementStatus } from "@/lib/einvoice/einvoice-types";
import { formatLongDate } from "@/lib/utils/format-date";

const DEFAULT_TURNOVER = "1500000";

const statusLabels: Record<EInvoiceRequirementStatus, string> = {
  exempt: "Potentially exempt",
  "needs-review": "Needs confirmation",
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
  const [businessSituation, setBusinessSituation] = useState<NonNullable<EInvoiceRequirementInput["businessSituation"]>>("unsure");
  const [exemptionException, setExemptionException] = useState<NonNullable<EInvoiceRequirementInput["exemptionException"]>>("unsure");
  const [businessStartDate, setBusinessStartDate] = useState("");
  const startDateId = useId();
  const belowThreshold = annualTurnover.trim() !== "" && Number(annualTurnover) >= 0 && Number(annualTurnover) < EINVOICE_EXEMPTION_THRESHOLD;
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
          asOfDate: today,
          businessSituation,
          exemptionException,
          businessStartDate
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the value and try again."
      };
    }
  }, [annualTurnover, today, businessSituation, exemptionException, businessStartDate]);

  const result = calculation.result;

  return (
    <ToolWorkspace title="Check your turnover" inputs={<>
      <ToolSelectField label="Business history" value={businessSituation} onChange={setBusinessSituation} options={[
        { value: "unsure", label: "Choose your business history" },
        { value: "established", label: "Operating in 2022; turnover band unchanged" },
        { value: "new-2023-2025", label: "Started during 2023–2025" },
        { value: "new-2026-onwards", label: "Started in 2026 or later" },
        { value: "changed", label: "Turnover band changed / existing mandate to check" }
      ]} />
      <ToolNumberField label="Annual turnover or revenue (MYR)" hint={businessSituation === "established" ? "Use FY2022 audited turnover or YA2022 tax-return revenue. If your turnover band changed later, choose that history above." : businessSituation === "new-2026-onwards" ? "Use expected first-year revenue. If a later year first reached the threshold, choose the changed-turnover history instead." : "Enter the relevant annual revenue in Malaysian ringgit."} min="0" name="annualTurnover" value={annualTurnover} onChange={e => setAnnualTurnover(e.target.value)} placeholder="e.g. 1500000" error={Number(annualTurnover) < 0 ? "Enter a turnover of zero or more." : undefined} />
      {businessSituation === "new-2026-onwards" && !belowThreshold ? <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-950" htmlFor={startDateId}>Operation commencement date</label>
        <input className={toolInputClass} id={startDateId} min="2026-01-01" type="date" value={businessStartDate} onChange={event => setBusinessStartDate(event.target.value)} />
      </div> : null}
      {belowThreshold ? <>
        <ToolSelectField label="Does an ownership or group exception apply?" value={exemptionException} onChange={setExemptionException} options={[
          { value: "unsure", label: "Not sure / not checked" },
          { value: "no", label: "No, none of the links below applies" },
          { value: "yes", label: "Yes, at least one applies" }
        ]} />
        <p className="text-sm leading-6 text-slate-600">Check whether a non-individual shareholder, holding company, related company or joint venture has annual revenue of at least RM3 million. These links can exclude the business from the turnover exemption.</p>
      </> : null}
      <p className="text-sm leading-6 text-slate-600">For ordinary businesses. Special entities, changed turnover bands and uncertain ownership need confirmation with LHDN.</p>
      <ToolReset onClick={() => { setAnnualTurnover(DEFAULT_TURNOVER); setBusinessSituation("unsure"); setExemptionException("unsure"); setBusinessStartDate(""); }} />
    </>}>
      <ToolPrimaryResult label="e-Invoice requirement" value={result ? statusLabels[result.status] : "—"} />
      {result ? <>
        <ToolResultRows rows={[["Timetable", result.phase?.label ?? (result.mandatoryFrom ? "New business" : result.status === "needs-review" ? "Needs confirmation" : "Turnover exemption")], ["Mandatory from", result.mandatoryFrom ? formatLongDate(result.mandatoryFrom) : result.status === "needs-review" ? "Needs confirmation" : "Not applicable"], ...(result.relaxationEndsOn ? [["Relaxation ends", formatLongDate(result.relaxationEndsOn)] as const] : [])]} />
        {result.mandatoryFrom ? <p className="text-sm text-slate-500">{describeCountdown(result)}</p> : null}
        <p className="mt-6 text-sm font-semibold leading-6 text-slate-950">{result.headline}</p>
        <ToolNote>{result.explanation}</ToolNote>
        {result.inRelaxationPeriod ? <ToolNote>Relaxation is conditional on following the consolidated submission rules. Required submissions still apply.</ToolNote> : null}
        {result.notes.length ? <details className="mt-5 border-t border-slate-200 pt-3">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400">Exceptions and notes</summary>
          <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">{result.notes.map(note => <li key={note}>{note}</li>)}</ul>
        </details> : null}
      </> : <ToolNote warning={annualTurnover.trim() !== "" && today !== null}>{calculation.message}</ToolNote>}
      <p className="mt-5 text-xs leading-5 text-slate-500">Rules checked {formatLongDate(EINVOICE_LAST_REVIEWED)} against <a className="underline underline-offset-4" href={EINVOICE_GUIDELINE_URL} target="_blank" rel="noopener noreferrer">LHDN General Guideline v4.8</a> and <a className="underline underline-offset-4" href={EINVOICE_SPECIFIC_GUIDELINE_URL} target="_blank" rel="noopener noreferrer">Specific Guideline v4.9</a>.</p>
    </ToolWorkspace>
  );
}
