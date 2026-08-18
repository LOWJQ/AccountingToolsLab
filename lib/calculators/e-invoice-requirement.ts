import {
  EINVOICE_EXEMPTION_THRESHOLD,
  EINVOICE_PHASES,
  EINVOICE_PHASE_REFERENCE_YEAR
} from "../data/einvoice/phases";
import type { EInvoicePhase, EInvoiceRequirementStatus } from "../einvoice/einvoice-types";
import { assertValidNumber } from "./number-utils";

export type EInvoiceRequirementInput = {
  /** Annual turnover in MYR. LHDN publishes the thresholds in MYR only. */
  annualTurnover: number | null | undefined;
  /**
   * ISO date (YYYY-MM-DD) the timetable is judged against. Passed in rather
   * than read from the clock so results are reproducible and testable.
   */
  asOfDate: string;
};

export type EInvoiceRequirementResult = {
  annualTurnover: number;
  status: EInvoiceRequirementStatus;
  /** The phase the turnover falls into, or null when the business is exempt. */
  phase: EInvoicePhase | null;
  exemptionThreshold: number;
  /**
   * Whole days from asOfDate to the phase start. Zero on the day itself,
   * negative once it has passed, null when exempt.
   */
  daysUntilMandatory: number | null;
  /** True while the phase penalty-free relaxation period is still running. */
  inRelaxationPeriod: boolean;
  /** Whole days until relaxation ends. Null when exempt or no date published. */
  daysUntilRelaxationEnds: number | null;
  /** One-line answer, used as the result heading. */
  headline: string;
  /** Short paragraph explaining the headline. */
  explanation: string;
  /** Caveats worth showing beside the result. */
  notes: string[];
};

const MILLISECONDS_PER_DAY = 86_400_000;

function formatMyr(amount: number): string {
  return `RM${amount.toLocaleString("en-MY")}`;
}

/**
 * Parses YYYY-MM-DD as a UTC timestamp. UTC throughout: this is a calendar-day
 * comparison, and a local timezone would shift the answer by a day.
 */
function toUtcTimestamp(isoDate: string, label: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!match) {
    throw new Error(`${label} must be an ISO date in YYYY-MM-DD format.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  // Date.UTC rolls 2026-02-31 forward into March rather than rejecting it.
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`${label} is not a real calendar date.`);
  }

  return timestamp;
}

function wholeDaysBetween(fromIsoDate: string, toIsoDate: string): number {
  const from = toUtcTimestamp(fromIsoDate, "Date");
  const to = toUtcTimestamp(toIsoDate, "Date");

  return Math.round((to - from) / MILLISECONDS_PER_DAY);
}

function formatLongDate(isoDate: string): string {
  return new Date(toUtcTimestamp(isoDate, "Date")).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric"
  });
}

function describeDayCount(days: number): string {
  const absolute = Math.abs(days);

  return absolute === 1 ? "1 day" : `${absolute.toLocaleString("en-MY")} days`;
}

/**
 * Finds the phase a turnover falls into. Bounds are exclusive at the bottom and
 * inclusive at the top, so a business sitting exactly on a boundary lands in the
 * lower phase, which carries the later deadline.
 */
export function findEInvoicePhase(annualTurnover: number): EInvoicePhase | null {
  return (
    EINVOICE_PHASES.find(
      (phase) =>
        annualTurnover > phase.minTurnover &&
        (phase.maxTurnover === null || annualTurnover <= phase.maxTurnover)
    ) ?? null
  );
}

/**
 * Answers "do I have to issue e-Invoices, and from when?" from annual turnover
 * alone. Turnover is the only thing the phasing depends on, so the checker asks
 * for nothing else: an extra input would imply it changes the answer when it
 * does not.
 */
export function checkEInvoiceRequirement(
  input: EInvoiceRequirementInput
): EInvoiceRequirementResult {
  const annualTurnover = assertValidNumber(input.annualTurnover, "Annual turnover");

  if (annualTurnover < 0) {
    throw new Error("Annual turnover must be zero or greater.");
  }

  const asOfDate = input.asOfDate;
  // Validated up front so a bad date fails loudly rather than at first use.
  toUtcTimestamp(asOfDate, "Date checked");

  const exemptionThreshold = EINVOICE_EXEMPTION_THRESHOLD;

  if (annualTurnover <= exemptionThreshold) {
    return {
      annualTurnover,
      status: "exempt",
      phase: null,
      exemptionThreshold,
      daysUntilMandatory: null,
      inRelaxationPeriod: false,
      daysUntilRelaxationEnds: null,
      headline: "You are exempt from e-Invoice",
      explanation:
        `Annual turnover of ${formatMyr(annualTurnover)} is at or below the ` +
        `${formatMyr(exemptionThreshold)} exemption threshold, so issuing e-Invoices through ` +
        "MyInvois is not mandatory for your business.",
      notes: [
        `The exemption threshold rose to ${formatMyr(exemptionThreshold)} with effect from ` +
          "1 January 2026. The originally planned final phase for businesses below that level " +
          "was cancelled, not postponed.",
        "You can still issue e-Invoices voluntarily, and some buyers may ask you to.",
        `If turnover later rises above ${formatMyr(exemptionThreshold)}, you come into scope ` +
          "and should confirm your start date with LHDN."
      ]
    };
  }

  const phase = findEInvoicePhase(annualTurnover);

  if (!phase) {
    // Unreachable while the phase table covers everything above the threshold.
    // Guarded anyway so a future edit leaving a gap fails loudly.
    throw new Error("No e-Invoice phase covers that annual turnover.");
  }

  const daysUntilMandatory = wholeDaysBetween(asOfDate, phase.mandatoryFrom);
  const status: EInvoiceRequirementStatus =
    daysUntilMandatory > 0 ? "required-later" : "required-now";
  const mandatoryDate = formatLongDate(phase.mandatoryFrom);

  const daysUntilRelaxationEnds =
    phase.relaxationEndsOn === null ? null : wholeDaysBetween(asOfDate, phase.relaxationEndsOn);
  const inRelaxationPeriod =
    status === "required-now" && daysUntilRelaxationEnds !== null && daysUntilRelaxationEnds >= 0;

  const notes = [
    `LHDN places a business into a phase using its FY${EINVOICE_PHASE_REFERENCE_YEAR} annual ` +
      "turnover, not what it earns today. Use that figure if it differs from the one entered.",
    "Every e-Invoice must be sent to MyInvois and validated before you give it to your " +
      "customer. A PDF on its own is not an e-Invoice."
  ];

  if (phase.relaxationEndsOn !== null) {
    if (inRelaxationPeriod) {
      notes.push(
        `The relaxation period for ${phase.label} runs to ` +
          `${formatLongDate(phase.relaxationEndsOn)}. LHDN does not impose penalties during ` +
          "relaxation, but the requirement itself already applies."
      );
    } else if (status === "required-now") {
      notes.push(
        `The relaxation period for ${phase.label} ended on ` +
          `${formatLongDate(phase.relaxationEndsOn)}, so normal enforcement applies.`
      );
    }
  }

  if (status === "required-later") {
    return {
      annualTurnover,
      status,
      phase,
      exemptionThreshold,
      daysUntilMandatory,
      inRelaxationPeriod,
      daysUntilRelaxationEnds,
      headline: `You come into scope on ${mandatoryDate}`,
      explanation:
        `Annual turnover of ${formatMyr(annualTurnover)} puts you in ${phase.label}. ` +
        `E-Invoicing becomes mandatory for you on ${mandatoryDate}, which is ` +
        `${describeDayCount(daysUntilMandatory)} away.`,
      notes
    };
  }

  return {
    annualTurnover,
    status,
    phase,
    exemptionThreshold,
    daysUntilMandatory,
    inRelaxationPeriod,
    daysUntilRelaxationEnds,
    headline: "You are required to issue e-Invoices",
    explanation:
      `Annual turnover of ${formatMyr(annualTurnover)} puts you in ${phase.label}, which became ` +
      `mandatory on ${mandatoryDate}, ${describeDayCount(daysUntilMandatory)} ago.`,
    notes
  };
}
