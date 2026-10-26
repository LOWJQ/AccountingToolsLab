import assert from "node:assert/strict";
import { checkEInvoiceRequirement, findEInvoicePhase, type EInvoiceRequirementInput } from "../lib/calculators/e-invoice-requirement";
import { EINVOICE_EXEMPTION_THRESHOLD } from "../lib/data/einvoice/phases";

function test(name: string, run: () => void) { run(); console.log(`PASS ${name}`); }

// Independent policy examples: General Guideline v4.8 sections 1.5/1.6 and
// Specific Guideline v4.9 section 16. Expectations use literal policy boundaries.
function check(annualTurnover: number, overrides: Partial<EInvoiceRequirementInput> = {}) {
  return checkEInvoiceRequirement({ annualTurnover, asOfDate: "2026-10-27", businessSituation: "established", exemptionException: "no", ...overrides });
}

test("current exemption ceiling is RM3 million", () => {
  assert.equal(EINVOICE_EXEMPTION_THRESHOLD, 3_000_000);
});

test("RM2 million can qualify from September 2026 with no group exception", () => {
  const result = check(2_000_000, { asOfDate: "2026-09-01" });
  assert.equal(result.status, "exempt");
  assert.equal(result.phase, null);
  assert.equal(result.mandatoryFrom, null);
  assert.equal(result.daysUntilMandatory, null);
  assert.equal(result.relaxationEndsOn, null);
  assert.match(result.headline, /may qualify/);
});

test("a sen below RM3 million qualifies but exactly RM3 million does not", () => {
  assert.equal(check(2_999_999.99).status, "exempt");
  const exact = check(3_000_000);
  assert.equal(exact.status, "required-now");
  assert.equal(exact.phase?.id, "phase-4");
  assert.equal(exact.mandatoryFrom, "2026-01-01");
  assert.equal(findEInvoicePhase(3_000_000)?.id, "phase-4");
  assert.equal(findEInvoicePhase(2_999_999.99), null);
});

test("zero turnover is a possible exemption rather than an input error", () => {
  assert.equal(check(0).status, "exempt");
});

test("unknown business history cannot silently establish exemption or a deadline", () => {
  for (const annualTurnover of [0, 2_000_000, 4_000_000, 200_000_000]) {
    const result = checkEInvoiceRequirement({ annualTurnover, asOfDate: "2026-10-27" });
    assert.equal(result.status, "needs-review");
    assert.equal(result.mandatoryFrom, null);
  }
});

test("known and unchecked ownership exceptions never produce an exemption", () => {
  for (const exemptionException of ["yes", "unsure", undefined] as const) {
    const result = check(2_000_000, { exemptionException });
    assert.equal(result.status, "needs-review");
    assert.equal(result.mandatoryFrom, null);
    assert.ok(result.notes.some(note => note.includes("1.6.10")));
  }
  assert.match(check(2_000_000, { exemptionException: "yes" }).explanation, /exemption does not apply/);
  assert.equal(check(3_000_000, { exemptionException: "unsure" }).status, "required-now");
});

test("turnover changes and existing mandates need review at all revenue levels", () => {
  for (const amount of [500_000, 2_000_000, 3_000_000, 100_000_001]) {
    const result = check(amount, { businessSituation: "changed" });
    assert.equal(result.status, "needs-review");
    assert.equal(result.phase, null);
    assert.equal(result.mandatoryFrom, null);
  }
});

test("original rollout boundaries retain inclusive upper limits", () => {
  for (const [amount, phase] of [[5_000_000, "phase-4"], [5_000_000.01, "phase-3"], [25_000_000, "phase-3"], [25_000_000.01, "phase-2"], [100_000_000, "phase-2"], [100_000_000.01, "phase-1"], [50_000_000_000, "phase-1"]] as const) {
    assert.equal(findEInvoicePhase(amount)?.id, phase);
  }
});

test("Phase 4 conditional relaxation includes 31 December 2027", () => {
  const result = check(4_000_000, { asOfDate: "2027-12-31" });
  assert.equal(result.status, "required-now");
  assert.equal(result.relaxationEndsOn, "2027-12-31");
  assert.equal(result.inRelaxationPeriod, true);
  assert.equal(result.daysUntilRelaxationEnds, 0);
  assert.ok(result.notes.some(note => note.includes("depends on following") && note.includes("consolidated")));
  const after = check(4_000_000, { asOfDate: "2028-01-01" });
  assert.equal(after.inRelaxationPeriod, false);
  assert.equal(after.daysUntilRelaxationEnds, -1);
});

test("first three phases retain their original relaxation end dates", () => {
  for (const [amount, expected] of [[6_000_000, "2025-12-31"], [30_000_000, "2025-06-30"], [101_000_000, "2025-01-31"]] as const) {
    const result = check(amount);
    assert.equal(result.relaxationEndsOn, expected);
    assert.equal(result.inRelaxationPeriod, false);
  }
});

test("new 2023-2025 businesses use July 2026 rather than FY2022 phases", () => {
  for (const amount of [3_000_000, 5_000_000, 200_000_000]) {
    const result = check(amount, { businessSituation: "new-2023-2025" });
    assert.equal(result.mandatoryFrom, "2026-07-01");
    assert.equal(result.phase, null);
    assert.equal(result.inRelaxationPeriod, amount <= 5_000_000);
  }
});

test("new 2026 businesses use July or the later commencement date", () => {
  assert.equal(check(3_000_000, { businessSituation: "new-2026-onwards", businessStartDate: "2026-02-01" }).mandatoryFrom, "2026-07-01");
  assert.equal(check(3_000_000, { businessSituation: "new-2026-onwards", businessStartDate: "2026-10-01" }).mandatoryFrom, "2026-10-01");
  assert.equal(check(3_000_000, { businessSituation: "new-2026-onwards" }).status, "needs-review");
});

test("future commencement handles upcoming, same-day and elapsed dates", () => {
  const inputs = { businessSituation: "new-2026-onwards", businessStartDate: "2027-01-01" } as const;
  const before = check(4_000_000, { ...inputs, asOfDate: "2026-12-31" });
  assert.equal(before.status, "required-later");
  assert.equal(before.daysUntilMandatory, 1);
  assert.match(before.explanation, /1 day away/);
  const on = check(4_000_000, { ...inputs, asOfDate: "2027-01-01" });
  assert.equal(on.status, "required-now");
  assert.equal(on.daysUntilMandatory, 0);
  assert.match(on.explanation, /today/);
  const after = check(4_000_000, { ...inputs, asOfDate: "2027-01-31" });
  assert.equal(after.daysUntilMandatory, -30);
  assert.match(after.explanation, /30 days ago/);
  assert.equal(before.inRelaxationPeriod, false);
  assert.equal(before.relaxationEndsOn, null);
});

test("new first-year revenue below the ceiling can qualify without group links", () => {
  assert.equal(check(2_000_000, { businessSituation: "new-2026-onwards" }).status, "exempt");
});

test("date differences count leap days correctly", () => {
  const result = check(4_000_000, { businessSituation: "new-2026-onwards", businessStartDate: "2028-03-01", asOfDate: "2028-02-28" });
  assert.equal(result.daysUntilMandatory, 2);
});

test("current rules are not applied retrospectively before their effective date", () => {
  const result = check(2_000_000, { asOfDate: "2026-08-31" });
  assert.equal(result.status, "needs-review");
  assert.match(result.explanation, /earlier date/);
});

test("required results explain validation and the reference year", () => {
  const result = check(4_000_000);
  assert.ok(result.notes.some(note => note.includes("A PDF on its own is not an e-Invoice")));
  assert.ok(result.notes.some(note => note.includes("FY2022") && note.includes("YA2022")));
  assert.match(check(2_500_000).explanation, /RM2,500,000/);
});

test("missing, negative and non-finite turnover are rejected", () => {
  for (const annualTurnover of [null, undefined, NaN, Infinity]) {
    assert.throws(() => checkEInvoiceRequirement({ annualTurnover, asOfDate: "2026-10-27" }), /Annual turnover is required/);
  }
  assert.throws(() => check(-1), /zero or greater/);
});

test("malformed and impossible dates are rejected even below the ceiling", () => {
  for (const asOfDate of ["27-10-2026", "2026-02-31", "not-a-date"]) {
    assert.throws(() => check(100, { asOfDate }), /YYYY-MM-DD|not a real calendar date/);
  }
});

test("commencement dates must be real and from 2026 onwards", () => {
  for (const businessStartDate of ["2026-02-31", "wrong", "2025-12-31"]) {
    assert.throws(() => check(3_000_000, { businessSituation: "new-2026-onwards", businessStartDate }), /calendar date|YYYY-MM-DD|2026 or later/);
  }
});
