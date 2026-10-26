import assert from "node:assert/strict";
import { CLASSIFICATION_CODES } from "../lib/data/einvoice/classification-codes";
import { MSIC_CODES } from "../lib/data/einvoice/msic-codes";
import {
  EINVOICE_EXEMPTION_THRESHOLD,
  EINVOICE_PHASES
} from "../lib/data/einvoice/phases";
import type { EInvoiceCode } from "../lib/einvoice/einvoice-types";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

// The code lists are generated from LHDN's published JSON. These guard against a
// bad regeneration silently emptying, truncating, or corrupting a list.
const lists: { name: string; rows: EInvoiceCode[]; expected: number }[] = [
  { name: "classification codes", rows: CLASSIFICATION_CODES, expected: 45 },
  { name: "MSIC codes", rows: MSIC_CODES, expected: 1174 }
];

for (const { name, rows, expected } of lists) {
  test(`${name} match the row count published by LHDN`, () => {
    assert.equal(rows.length, expected);
  });

  test(`${name} have unique, non-empty, trimmed entries`, () => {
    const codes = new Set<string>();

    for (const row of rows) {
      assert.ok(row.code.length > 0, `${name}: empty code`);
      assert.equal(row.code, row.code.trim(), `${name}: untrimmed code ${row.code}`);
      assert.ok(row.label.length > 0, `${name}: empty label for ${row.code}`);
      assert.equal(row.label, row.label.trim(), `${name}: untrimmed label for ${row.code}`);
      assert.ok(!codes.has(row.code), `${name}: duplicate code ${row.code}`);
      codes.add(row.code);
    }
  });
}

test("classification codes keep the 022 Others fallback", () => {
  const others = CLASSIFICATION_CODES.find((row) => row.code === "022");

  assert.equal(others?.label, "Others");
});

test("classification codes stay zero-padded to three characters", () => {
  for (const row of CLASSIFICATION_CODES) {
    assert.match(row.code, /^\d{3}$/);
  }
});

test("MSIC codes stay five digits", () => {
  for (const row of MSIC_CODES) {
    assert.match(row.code, /^\d{5}$/);
  }
});

test("phases are ordered largest turnover first and do not overlap", () => {
  for (let index = 1; index < EINVOICE_PHASES.length; index += 1) {
    const previous = EINVOICE_PHASES[index - 1];
    const current = EINVOICE_PHASES[index];

    assert.equal(current.maxTurnover, previous.minTurnover);
    assert.ok(current.minTurnover < previous.minTurnover);
  }
});

test("only the first phase is uncapped", () => {
  assert.equal(EINVOICE_PHASES[0].maxTurnover, null);

  for (const phase of EINVOICE_PHASES.slice(1)) {
    assert.notEqual(phase.maxTurnover, null);
  }
});

// Largest turnover first also means earliest start date first: LHDN phased the
// biggest businesses in before the smaller ones.
test("phase start dates run in chronological order", () => {
  const dates = EINVOICE_PHASES.map((phase) => phase.mandatoryFrom);

  assert.deepEqual(dates, [...dates].sort());
});

test("the lowest phase starts exactly at the exemption threshold", () => {
  const lowest = EINVOICE_PHASES[EINVOICE_PHASES.length - 1];

  assert.equal(lowest.minTurnover, EINVOICE_EXEMPTION_THRESHOLD);
  assert.equal(lowest.minInclusive, true);
});

test("phase dates are ISO formatted", () => {
  for (const phase of EINVOICE_PHASES) {
    assert.match(phase.mandatoryFrom, /^\d{4}-\d{2}-\d{2}$/);

    if (phase.relaxationEndsOn !== null) {
      assert.match(phase.relaxationEndsOn, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(phase.relaxationEndsOn > phase.mandatoryFrom);
    }
  }
});
