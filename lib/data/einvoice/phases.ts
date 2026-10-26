import type { EInvoicePhase } from "@/lib/einvoice/einvoice-types";

/**
 * LHDN's e-Invoice rollout, as data. Every e-Invoice tool and guide reads the
 * dates and thresholds from here, so when LHDN revises the timetable there is
 * one file to edit rather than a date copied across a dozen pages.
 *
 * Checked on 2026-10-27 against General Guideline v4.8 (sections 1.5/1.6),
 * Specific Guideline v4.9 (section 16), and the 30 August 2026 announcement.
 * https://www.hasil.gov.my/wp-content/uploads/IRBM-e-Invoice-Guideline.pdf
 * https://www.hasil.gov.my/wp-content/uploads/IRBM-e-Invoice-Specific-Guideline.pdf
 */

/**
 * Exclusive exemption ceiling. Exactly RM3 million is not below it.
 * Ownership/group exceptions and business history must also be checked.
 */
export const EINVOICE_EXEMPTION_THRESHOLD = 3_000_000;
export const EINVOICE_RULES_EFFECTIVE_FROM = "2026-09-01";
export const EINVOICE_LAST_REVIEWED = "2026-10-27";
export const EINVOICE_NEW_BUSINESS_START = "2026-07-01";
export const EINVOICE_PHASE_4_RELAXATION_END = "2027-12-31";
export const EINVOICE_GUIDELINE_URL = "https://www.hasil.gov.my/wp-content/uploads/IRBM-e-Invoice-Guideline.pdf";
export const EINVOICE_SPECIFIC_GUIDELINE_URL = "https://www.hasil.gov.my/wp-content/uploads/IRBM-e-Invoice-Specific-Guideline.pdf";

/**
 * The financial year LHDN uses to decide which phase a business falls into.
 * A business is placed by its FY2022 turnover, not by what it earns today.
 */
export const EINVOICE_PHASE_REFERENCE_YEAR = 2022;

/**
 * Phases in turnover order, largest first. Bounds read as:
 * minTurnover < turnover <= maxTurnover, except Phase 4 includes its minimum.
 * This table covers the ordinary rollout, not every exemption exception.
 */
export const EINVOICE_PHASES: EInvoicePhase[] = [
  {
    id: "phase-1",
    label: "Phase 1",
    minTurnover: 100_000_000,
    maxTurnover: null,
    mandatoryFrom: "2024-08-01",
    relaxationEndsOn: "2025-01-31",
    description: "Businesses with annual turnover above RM100 million."
  },
  {
    id: "phase-2",
    label: "Phase 2",
    minTurnover: 25_000_000,
    maxTurnover: 100_000_000,
    mandatoryFrom: "2025-01-01",
    relaxationEndsOn: "2025-06-30",
    description: "Businesses with annual turnover above RM25 million up to RM100 million."
  },
  {
    id: "phase-3",
    label: "Phase 3",
    minTurnover: 5_000_000,
    maxTurnover: 25_000_000,
    mandatoryFrom: "2025-07-01",
    relaxationEndsOn: "2025-12-31",
    description: "Businesses with annual turnover above RM5 million up to RM25 million."
  },
  {
    id: "phase-4",
    label: "Phase 4",
    minTurnover: EINVOICE_EXEMPTION_THRESHOLD,
    minInclusive: true,
    maxTurnover: 5_000_000,
    mandatoryFrom: "2026-01-01",
    relaxationEndsOn: EINVOICE_PHASE_4_RELAXATION_END,
    description: "Businesses with annual turnover from RM3 million up to RM5 million, subject to the applicable implementation rules."
  }
];
