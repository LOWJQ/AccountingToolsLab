import assert from "node:assert/strict";
import { calculateTrialBalance } from "../lib/calculators/trial-balance";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("returns balanced totals when debit and credit totals match", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Cash", debit: 100, credit: 0 },
    { id: "2", accountName: "Capital", debit: 0, credit: 100 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 100,
    totalCredit: 100,
    difference: 0,
    isBalanced: true
  });
});

test("returns unbalanced totals when debit and credit totals do not match", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Cash", debit: 100, credit: 0 },
    { id: "2", accountName: "Capital", debit: 0, credit: 90 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 100,
    totalCredit: 90,
    difference: 10,
    isBalanced: false
  });
});

test("handles empty rows as zero totals", () => {
  const result = calculateTrialBalance([]);

  assert.deepEqual(result, {
    totalDebit: 0,
    totalCredit: 0,
    difference: 0,
    isBalanced: true
  });
});

test("handles decimal values", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Cash", debit: 10.5, credit: 0 },
    { id: "2", accountName: "Revenue", debit: 0, credit: 10.5 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 10.5,
    totalCredit: 10.5,
    difference: 0,
    isBalanced: true
  });
});

test("handles rows with only debit values", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Cash", debit: 125, credit: 0 },
    { id: "2", accountName: "Equipment", debit: 275, credit: 0 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 400,
    totalCredit: 0,
    difference: 400,
    isBalanced: false
  });
});

test("handles rows with only credit values", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Revenue", debit: 0, credit: 125 },
    { id: "2", accountName: "Capital", debit: 0, credit: 275 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 0,
    totalCredit: 400,
    difference: 400,
    isBalanced: false
  });
});

test("rejects negative debit or credit values", () => {
  assert.throws(
    () =>
      calculateTrialBalance([
        { id: "1", accountName: "Invalid Debit", debit: -25, credit: 0 }
      ]),
    /non-negative/
  );

  assert.throws(
    () =>
      calculateTrialBalance([
        { id: "1", accountName: "Invalid Credit", debit: 0, credit: -25 }
      ]),
    /non-negative/
  );
});

test("rejects rows with both debit and credit values", () => {
  assert.throws(
    () =>
      calculateTrialBalance([
        { id: "1", accountName: "Invalid Row", debit: 25, credit: 25 }
      ]),
    /both debit and credit/
  );
});

test("uses tolerance for floating point precision", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Decimal Debit", debit: 0.1 + 0.2, credit: 0 },
    { id: "2", accountName: "Decimal Credit", debit: 0, credit: 0.3 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 0.3,
    totalCredit: 0.3,
    difference: 0,
    isBalanced: true
  });
});
