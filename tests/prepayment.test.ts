import assert from "node:assert/strict";
import { calculatePrepaymentSchedule, getPrepaymentErrors, prepaymentScheduleCsv, type PrepaymentInput } from "../lib/calculators/prepayment";
import { parseCsv } from "../lib/reconciliation/csv";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}
const base: PrepaymentInput = { amount: "12000", startDate: "2025-01-01", endDate: "2025-12-31", method: "monthly" };

test("annual prepayments have equal full-month charges and clear the asset", () => {
  const result = calculatePrepaymentSchedule(base);
  assert.equal(result.periods.length, 12);
  assert.ok(result.periods.every(row => row.expenseCents === 100_000));
  assert.equal(result.periods[0].openingCents, 1_200_000);
  assert.equal(result.periods[0].remainingCents, 1_100_000);
  assert.equal(result.periods[11].remainingCents, 0);
});

test("monthly allocation prorates partial months by their calendar-month weights", () => {
  const result = calculatePrepaymentSchedule({ ...base, amount: "4700", startDate: "2025-01-16", endDate: "2025-02-28" });
  assert.deepEqual(result.periods.map(row => row.expenseCents), [160_000, 310_000]);
  assert.equal(result.periods[0].startDate, "2025-01-16");
  assert.equal(result.periods[0].endDate, "2025-01-31");
});

test("an anniversary-year schedule retains equal full months between partial endpoints", () => {
  const result = calculatePrepaymentSchedule({ ...base, startDate: "2025-01-15", endDate: "2026-01-14" });
  assert.equal(result.periods.length, 13);
  assert.equal(result.periods[0].expenseCents, 54_839);
  assert.ok(result.periods.slice(1, -1).every(row => row.expenseCents === 100_000));
  assert.equal(result.periods[12].expenseCents, 45_161);
});

test("daily allocation follows covered days rather than equal months", () => {
  const result = calculatePrepaymentSchedule({ ...base, method: "daily" });
  assert.equal(result.periods[0].expenseCents, 101_918);
  assert.equal(result.periods[1].expenseCents, 92_055);
  assert.equal(result.periods[11].remainingCents, 0);
});

test("daily allocation includes leap day and both coverage endpoints", () => {
  const result = calculatePrepaymentSchedule({ ...base, amount: "600", startDate: "2024-02-28", endDate: "2024-03-02", method: "daily" });
  assert.deepEqual(result.periods.map(row => row.expenseCents), [30_000, 30_000]);
  assert.equal(result.periods[0].endDate, "2024-02-29");
});

test("single-day and same-month coverage expense the entire amount", () => {
  for (const method of ["monthly", "daily"] as const) {
    for (const endDate of ["2025-01-15", "2025-01-29"]) {
      const result = calculatePrepaymentSchedule({ ...base, amount: ".99", startDate: "2025-01-15", endDate, method });
      assert.equal(result.periods.length, 1);
      assert.equal(result.periods[0].expenseCents, 99);
      assert.equal(result.periods[0].remainingCents, 0);
    }
  }
});

test("rounding stays in cents and reconciles even when the prepayment is tiny", () => {
  for (const amount of ["0.01", "0.07", "100", "999999999999.99"]) {
    for (const method of ["monthly", "daily"] as const) {
      const result = calculatePrepaymentSchedule({ ...base, amount, startDate: "2024-02-15", endDate: "2026-03-10", method });
      assert.equal(result.periods.reduce((sum, row) => sum + row.expenseCents, 0), result.amountCents);
      assert.ok(result.periods.every(row => Number.isSafeInteger(row.expenseCents) && row.expenseCents >= 0 && row.remainingCents >= 0));
      result.periods.forEach((row, index) => {
        assert.equal(row.openingCents - row.expenseCents, row.remainingCents);
        assert.equal(row.remainingCents + row.cumulativeCents, result.amountCents);
        if (index) assert.equal(row.openingCents, result.periods[index - 1].remainingCents);
      });
      assert.equal(result.periods.at(-1)?.remainingCents, 0);
    }
  }
});

test("coverage crosses financial years and stays independent of daylight saving", () => {
  const result = calculatePrepaymentSchedule({ ...base, startDate: "2025-11-01", endDate: "2026-02-28" });
  assert.deepEqual(result.periods.map(row => row.month), ["2025-11", "2025-12", "2026-01", "2026-02"]);
  const dst = calculatePrepaymentSchedule({ ...base, startDate: "2026-03-07", endDate: "2026-03-10", method: "daily" });
  assert.equal(dst.periods.length, 1);
  assert.equal(dst.periods[0].expenseCents, 1_200_000);
});

test("invalid amounts, dates and methods cannot generate a misleading schedule", () => {
  for (const amount of ["", "0", "-1", "NaN", "Infinity", "1e3", "1.234", "1,000", "1000000000000"]) {
    assert.ok(getPrepaymentErrors({ ...base, amount }).amount, amount);
    assert.throws(() => calculatePrepaymentSchedule({ ...base, amount }));
  }
  for (const startDate of ["", "2025-02-29", "2024-02-30", "2025-13-01", "1899-12-31"]) {
    assert.ok(getPrepaymentErrors({ ...base, startDate }).startDate, startDate);
  }
  assert.ok(getPrepaymentErrors({ ...base, endDate: "2024-12-31" }).endDate);
  assert.ok(getPrepaymentErrors({ ...base, endDate: "2125-01-01" }).endDate);
  assert.ok(getPrepaymentErrors({ ...base, method: "other" as PrepaymentInput["method"] }).method);
  assert.equal(getPrepaymentErrors({ ...base, amount: "1.234" }).amount, "Use up to 2 decimal places.");
});

test("CSV contains all months, exact balances, currency and matching journal accounts", () => {
  const result = calculatePrepaymentSchedule({ ...base, startDate: "2025-01-15", endDate: "2026-01-14" });
  const csv = prepaymentScheduleCsv(result, "MYR");
  const parsed = parseCsv(csv);
  assert.equal(parsed.records.length, 14);
  assert.equal(parsed.records[1].cells[3], "MYR");
  assert.equal(parsed.records[1].cells[5], "548.39");
  assert.equal(parsed.records[1].cells[8], "2025-01-31");
  assert.equal(parsed.records[1].cells[9], "Expense");
  assert.equal(parsed.records[1].cells[10], "Prepaid expense");
  assert.equal(parsed.records[13].cells[7], "0.00");
  assert.equal(parsed.records[13].cells[8], "2026-01-14");
  assert.throws(() => prepaymentScheduleCsv(result, "=1+1"));
});
