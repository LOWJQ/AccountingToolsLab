import {
  EINVOICE_EXEMPTION_THRESHOLD,
  EINVOICE_NEW_BUSINESS_START,
  EINVOICE_PHASE_4_RELAXATION_END,
  EINVOICE_PHASES,
  EINVOICE_PHASE_REFERENCE_YEAR,
  EINVOICE_RULES_EFFECTIVE_FROM
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
  /** Established means operating in 2022 with no subsequent turnover-band change. */
  businessSituation?: "established" | "new-2023-2025" | "new-2026-onwards" | "changed" | "unsure";
  /** Section 1.6.10: qualifying non-individual shareholder, parent, related company or JV. */
  exemptionException?: "yes" | "no" | "unsure";
  /** Required for new businesses from 2026 with first-year turnover at/above the ceiling. */
  businessStartDate?: string;
};

export type EInvoiceRequirementResult = {
  annualTurnover: number;
  status: EInvoiceRequirementStatus;
  /** Original rollout phase; null for exemptions, new businesses or review cases. */
  phase: EInvoicePhase | null;
  mandatoryFrom: string | null;
  relaxationEndsOn: string | null;
  exemptionThreshold: number;
  /**
   * Days to the indicated start. Null when exempt or the date is unknown.
   */
  daysUntilMandatory: number | null;
  /** Relief remains conditional on following the consolidated submission rules. */
  inRelaxationPeriod: boolean;
  /** Days to a published relaxation end, or null when not established. */
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
 * The ordinary rollout only. Phase 4 includes exactly RM3 million; the other
 * phases retain exclusive lower and inclusive upper bounds.
 */
export function findEInvoicePhase(annualTurnover: number): EInvoicePhase | null {
  return (
    EINVOICE_PHASES.find(
      (phase) =>
        (phase.minInclusive ? annualTurnover >= phase.minTurnover : annualTurnover > phase.minTurnover) &&
        (phase.maxTurnover === null || annualTurnover <= phase.maxTurnover)
    ) ?? null
  );
}

/**
 * Current ordinary-business rules, not a historical policy simulator. Unknown
 * ownership, changed turnover bands and special cases must not become a false
 * exemption or a fabricated deadline.
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
  const emptyResult = {
    annualTurnover,
    phase: null,
    mandatoryFrom: null,
    relaxationEndsOn: null,
    exemptionThreshold,
    daysUntilMandatory: null,
    inRelaxationPeriod: false,
    daysUntilRelaxationEnds: null
  };
  const review = (explanation: string, notes: string[] = []): EInvoiceRequirementResult => ({
    ...emptyResult,
    status: "needs-review",
    headline: "Confirm your position with LHDN",
    explanation,
    notes
  });
  const situation = input.businessSituation ?? "unsure";
  if (!["established", "new-2023-2025", "new-2026-onwards", "changed", "unsure"].includes(situation) ||
      !["yes", "no", "unsure"].includes(input.exemptionException ?? "unsure")) {
    throw new Error("Choose valid business history and ownership answers.");
  }

  if (asOfDate < EINVOICE_RULES_EFFECTIVE_FROM) {
    return review("These rules apply from 1 September 2026. An earlier date needs the guidance that applied at that time.");
  }
  if (situation === "unsure") {
    return review("Choose your business history to check the applicable timetable. Turnover alone cannot establish your start date or exemption.");
  }
  if (situation === "changed") {
    return review(
      "A later turnover change or an existing implementation obligation needs a separate check. Do not infer a new deadline or exemption from today's turnover alone.",
      ["For a previously exempt business reaching the threshold, check the year it first reached that level and the applicable transition rules with LHDN.",
        "The original rollout uses FY2022 or YA2022 revenue. A subsequent fall in revenue does not automatically cancel an established obligation."]
    );
  }
  if (annualTurnover < exemptionThreshold) {
    if (input.exemptionException !== "no") {
      return review(
        input.exemptionException === "yes"
          ? "The ownership/group exception means the small-business turnover exemption does not apply. Ask LHDN to confirm your implementation date."
          : "Your turnover is below RM3 million, but the ownership/group exceptions must be checked before treating the business as exempt.",
        ["Check non-individual shareholders, a holding company, related companies and joint ventures with annual revenue of at least RM3 million (General Guideline section 1.6.10)."]
      );
    }
    return {
      ...emptyResult,
      status: "exempt",
      headline: "You may qualify for the turnover exemption",
      explanation:
        `Your reported turnover of ${formatMyr(annualTurnover)} is below ${formatMyr(exemptionThreshold)}, ` +
        "and you reported no ownership/group exception. This indicates eligibility for the small-business exemption.",
      notes: [
        "The RM3 million ceiling took effect on 1 September 2026. Exactly RM3 million is not below the ceiling.",
        "This indication assumes the business history and ownership answers are correct. Confirm any existing mandate or special status with LHDN.",
        "Voluntary e-Invoicing remains available. Recheck your start date if revenue later reaches the threshold."
      ]
    };
  }

  const phase = situation === "established" ? findEInvoicePhase(annualTurnover) : null;
  let mandatoryFrom = phase?.mandatoryFrom ?? EINVOICE_NEW_BUSINESS_START;
  if (situation === "new-2026-onwards") {
    if (!input.businessStartDate) {
      return review("Enter the operation commencement date. For a new business from 2026 with expected first-year revenue of at least RM3 million, the start date is 1 July 2026 or the later commencement date.");
    }
    toUtcTimestamp(input.businessStartDate, "Business start date");
    if (input.businessStartDate < "2026-01-01") throw new Error("Choose a business start date in 2026 or later.");
    mandatoryFrom = input.businessStartDate > EINVOICE_NEW_BUSINESS_START ? input.businessStartDate : EINVOICE_NEW_BUSINESS_START;
  }
  const relaxationEndsOn = phase?.relaxationEndsOn ??
    (annualTurnover <= 5_000_000 && mandatoryFrom === EINVOICE_NEW_BUSINESS_START ? EINVOICE_PHASE_4_RELAXATION_END : null);
  const daysUntilMandatory = wholeDaysBetween(asOfDate, mandatoryFrom);
  const status: EInvoiceRequirementStatus =
    daysUntilMandatory > 0 ? "required-later" : "required-now";
  const mandatoryDate = formatLongDate(mandatoryFrom);

  const daysUntilRelaxationEnds =
    relaxationEndsOn === null ? null : wholeDaysBetween(asOfDate, relaxationEndsOn);
  const inRelaxationPeriod =
    status === "required-now" && daysUntilRelaxationEnds !== null && daysUntilRelaxationEnds >= 0;

  const notes = [
    situation === "established"
      ? `The original rollout uses FY${EINVOICE_PHASE_REFERENCE_YEAR} audited turnover or YA2022 tax-return revenue, with a 12-month adjustment where needed. If your band changed, select that business history instead.`
      : "New-business rules differ from the original FY2022 rollout. The turnover entered must reflect the relevant annual revenue (expected first-year revenue for businesses starting from 2026).",
    "A PDF on its own is not an e-Invoice. MyInvois validation and the applicable individual or consolidated submission rules still matter."
  ];

  if (relaxationEndsOn !== null) {
    if (inRelaxationPeriod) {
      notes.push(
        `Interim relaxation runs to ${formatLongDate(relaxationEndsOn)}. ` +
          "Relief from prosecution under section 120 depends on following the consolidated e-Invoice / consolidated self-billed e-Invoice conditions in Specific Guideline section 16. It is not permission to skip submissions."
      );
    } else if (status === "required-now") {
      notes.push(
        `The published relaxation period ended on ${formatLongDate(relaxationEndsOn)}. Check current enforcement guidance with LHDN.`
      );
    }
  }
  if (!phase && !relaxationEndsOn) {
    notes.push("This calculator does not infer relaxation eligibility for this commencement date/turnover. Confirm the applicable relief with LHDN.");
  }
  const groupDescription = phase ? phase.label : "the new-business timetable";

  if (status === "required-later") {
    return {
      annualTurnover,
      status,
      phase,
      mandatoryFrom,
      relaxationEndsOn,
      exemptionThreshold,
      daysUntilMandatory,
      inRelaxationPeriod,
      daysUntilRelaxationEnds,
      headline: `You come into scope on ${mandatoryDate}`,
      explanation:
        `Based on ${groupDescription}, ` +
        `e-Invoicing becomes mandatory for you on ${mandatoryDate}, which is ` +
        `${describeDayCount(daysUntilMandatory)} away.`,
      notes
    };
  }

  return {
    annualTurnover,
    status,
    phase,
    mandatoryFrom,
    relaxationEndsOn,
    exemptionThreshold,
    daysUntilMandatory,
    inRelaxationPeriod,
    daysUntilRelaxationEnds,
    headline: "You are required to issue e-Invoices",
    explanation:
      `Based on ${groupDescription}, your indicated start date is ${mandatoryDate}` +
      (daysUntilMandatory === 0 ? " (today)." : `, ${describeDayCount(daysUntilMandatory)} ago.`),
    notes
  };
}
