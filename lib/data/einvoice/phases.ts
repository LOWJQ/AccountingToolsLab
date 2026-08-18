import type { EInvoicePhase } from "@/lib/einvoice/einvoice-types";

/**
 * LHDN's e-Invoice rollout, as data. Every e-Invoice tool and guide reads the
 * dates and thresholds from here, so when LHDN revises the timetable there is
 * one file to edit rather than a date copied across a dozen pages.
 *
 * Last checked against public guidance: 2026-08-18.
 */

/**
 * Annual turnover in MYR at or below which a business is fully exempt.
 *
 * Raised from RM500,000 to RM1,000,000 for 2026. The originally planned fifth
 * phase (RM500,000 to RM1,000,000, from 1 July 2026) was cancelled outright
 * rather than deferred, so there is no phase below Phase 4 waiting to start.
 */
export const EINVOICE_EXEMPTION_THRESHOLD = 1_000_000;

/**
 * The financial year LHDN uses to decide which phase a business falls into.
 * A business is placed by its FY2022 turnover, not by what it earns today.
 */
export const EINVOICE_PHASE_REFERENCE_YEAR = 2022;

/**
 * Phases in turnover order, largest first. Bounds read as:
 * minTurnover < turnover <= maxTurnover, with maxTurnover null meaning no cap.
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
    minTurnover: 1_000_000,
    maxTurnover: 5_000_000,
    mandatoryFrom: "2026-01-01",
    relaxationEndsOn: "2026-06-30",
    description: "Businesses with annual turnover above RM1 million up to RM5 million."
  }
];
