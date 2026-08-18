import assert from "node:assert/strict";
import {
  checkEInvoiceRequirement,
  findEInvoicePhase
} from "../lib/calculators/e-invoice-requirement";
import { EINVOICE_EXEMPTION_THRESHOLD } from "../lib/data/einvoice/phases";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

// A date well after every published phase start, so "required now" cases are
// stable no matter when the suite runs.
const AFTER_ALL_PHASES = "2026-08-18";

function check(annualTurnover: number, asOfDate = AFTER_ALL_PHASES) {
  return checkEInvoiceRequirement({ annualTurnover, asOfDate });
}

test("turnover exactly at the exemption threshold is exempt", () => {
  const result = check(EINVOICE_EXEMPTION_THRESHOLD);

  assert.equal(result.status, "exempt");
  assert.equal(result.phase, null);
  assert.equal(result.daysUntilMandatory, null);
});

test("a single ringgit above the threshold falls into Phase 4", () => {
  const result = check(EINVOICE_EXEMPTION_THRESHOLD + 1);

  assert.equal(result.status, "required-now");
  assert.equal(result.phase?.id, "phase-4");
});

test("zero turnover is exempt rather than an error", () => {
  assert.equal(check(0).status, "exempt");
});

test("phase boundaries put a business in the lower phase", () => {
  // Upper bound is inclusive, so 5,000,000 stays in Phase 4, not Phase 3.
  assert.equal(findEInvoicePhase(5_000_000)?.id, "phase-4");
  assert.equal(findEInvoicePhase(5_000_000.01)?.id, "phase-3");
  assert.equal(findEInvoicePhase(25_000_000)?.id, "phase-3");
  assert.equal(findEInvoicePhase(25_000_000.01)?.id, "phase-2");
  assert.equal(findEInvoicePhase(100_000_000)?.id, "phase-2");
  assert.equal(findEInvoicePhase(100_000_000.01)?.id, "phase-1");
});

test("the largest phase has no upper bound", () => {
  assert.equal(findEInvoicePhase(50_000_000_000)?.id, "phase-1");
});

test("turnover at or below the threshold matches no phase", () => {
  assert.equal(findEInvoicePhase(EINVOICE_EXEMPTION_THRESHOLD), null);
  assert.equal(findEInvoicePhase(0), null);
});

test("the day a phase starts already counts as required", () => {
  const result = check(2_000_000, "2026-01-01");

  assert.equal(result.status, "required-now");
  assert.equal(result.daysUntilMandatory, 0);
});

test("the day before a phase starts is still upcoming", () => {
  const result = check(2_000_000, "2025-12-31");

  assert.equal(result.status, "required-later");
  assert.equal(result.daysUntilMandatory, 1);
  assert.match(result.headline, /1 January 2026/);
});

test("days remaining counts across a leap year correctly", () => {
  // 2024 is a leap year: 2024-02-28 to 2024-08-01 is 155 days.
  const result = check(500_000_000, "2024-02-28");

  assert.equal(result.status, "required-later");
  assert.equal(result.daysUntilMandatory, 155);
});

test("elapsed days are reported as negative", () => {
  const result = check(2_000_000, "2026-01-31");

  assert.equal(result.daysUntilMandatory, -30);
  assert.match(result.explanation, /30 days ago/);
});

test("a business inside its relaxation period is flagged", () => {
  const result = check(2_000_000, "2026-06-30");

  assert.equal(result.status, "required-now");
  assert.equal(result.inRelaxationPeriod, true);
  assert.equal(result.daysUntilRelaxationEnds, 0);
  assert.ok(result.notes.some((note) => note.includes("does not impose penalties")));
});

test("relaxation ends the day after its published end date", () => {
  const result = check(2_000_000, "2026-07-01");

  assert.equal(result.inRelaxationPeriod, false);
  assert.equal(result.daysUntilRelaxationEnds, -1);
  assert.ok(result.notes.some((note) => note.includes("normal enforcement applies")));
});

test("an upcoming phase is not treated as being in relaxation", () => {
  const result = check(2_000_000, "2025-12-01");

  assert.equal(result.status, "required-later");
  assert.equal(result.inRelaxationPeriod, false);
});

test("exempt results explain the cancelled final phase", () => {
  const result = check(400_000);

  assert.ok(result.notes.some((note) => note.includes("cancelled, not postponed")));
});

test("required results warn that a PDF is not an e-Invoice", () => {
  const result = check(2_000_000);

  assert.ok(result.notes.some((note) => note.includes("A PDF on its own is not an e-Invoice")));
});

test("required results point at the FY2022 reference year", () => {
  assert.ok(check(2_000_000).notes.some((note) => note.includes("FY2022")));
});

test("amounts are formatted with thousand separators", () => {
  assert.match(check(2_500_000).explanation, /RM2,500,000/);
});

test("a single day is described in the singular", () => {
  assert.match(check(2_000_000, "2025-12-31").explanation, /1 day away/);
});

test("missing turnover is rejected", () => {
  assert.throws(
    () => checkEInvoiceRequirement({ annualTurnover: null, asOfDate: AFTER_ALL_PHASES }),
    /Annual turnover is required/
  );
});

test("non-finite turnover is rejected", () => {
  assert.throws(
    () => checkEInvoiceRequirement({ annualTurnover: Number.NaN, asOfDate: AFTER_ALL_PHASES }),
    /Annual turnover is required/
  );
  assert.throws(
    () =>
      checkEInvoiceRequirement({
        annualTurnover: Number.POSITIVE_INFINITY,
        asOfDate: AFTER_ALL_PHASES
      }),
    /Annual turnover is required/
  );
});

test("negative turnover is rejected", () => {
  assert.throws(
    () => checkEInvoiceRequirement({ annualTurnover: -1, asOfDate: AFTER_ALL_PHASES }),
    /zero or greater/
  );
});

test("a malformed date is rejected", () => {
  assert.throws(
    () => checkEInvoiceRequirement({ annualTurnover: 2_000_000, asOfDate: "18-08-2026" }),
    /YYYY-MM-DD/
  );
});

test("a date that does not exist is rejected", () => {
  assert.throws(
    () => checkEInvoiceRequirement({ annualTurnover: 2_000_000, asOfDate: "2026-02-31" }),
    /not a real calendar date/
  );
});

test("the date is validated even when the business is exempt", () => {
  assert.throws(
    () => checkEInvoiceRequirement({ annualTurnover: 100, asOfDate: "not-a-date" }),
    /YYYY-MM-DD/
  );
});
