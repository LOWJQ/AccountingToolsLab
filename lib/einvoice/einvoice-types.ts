/**
 * Shared types for the e-Invoice tools. The code lists in lib/data/einvoice are
 * generated from LHDN's published JSON files and typed against these shapes, so
 * a change in the official data cannot silently change the shape the tools read.
 */

/** A code/label pair from one of LHDN's published code lists. */
export type EInvoiceCode = {
  /** The literal code LHDN publishes, e.g. "022". Kept as a string: codes are
   *  zero-padded and must never be treated as numbers. */
  code: string;
  label: string;
};

/** An MSIC entry, which additionally carries its section letter. */
export type MsicCode = EInvoiceCode & {
  /** MSIC section letter A-U, or "" for the "NOT APPLICABLE" entry. */
  section: string;
};

/**
 * How a taxpayer is brought into the e-Invoice mandate. LHDN phases businesses
 * in by annual turnover, so a business is either inside a phase or below the
 * exemption threshold entirely.
 */
export type EInvoicePhaseId = "phase-1" | "phase-2" | "phase-3" | "phase-4";

export type EInvoicePhase = {
  id: EInvoicePhaseId;
  /** Display label, e.g. "Phase 4". */
  label: string;
  /**
   * Lower bound of annual turnover in MYR, inclusive. A business qualifies for
   * a phase when turnover is greater than minTurnover.
   */
  minTurnover: number;
  /**
   * Upper bound of annual turnover in MYR, inclusive. `null` means no ceiling,
   * which is how the first phase is defined.
   */
  maxTurnover: number | null;
  /** ISO date (YYYY-MM-DD) the phase became mandatory. */
  mandatoryFrom: string;
  /**
   * ISO date (YYYY-MM-DD) the phase's six-month relaxation period ends. During
   * relaxation LHDN does not impose penalties. `null` where LHDN has not
   * published one.
   */
  relaxationEndsOn: string | null;
  /** Plain-language description of who falls in this phase. */
  description: string;
};

/** What the requirement checker concludes for a given business. */
export type EInvoiceRequirementStatus =
  /** Turnover is at or below the exemption threshold. */
  | "exempt"
  /** In scope, and the mandatory date has already passed. */
  | "required-now"
  /** In scope, but the mandatory date is still in the future. */
  | "required-later";
