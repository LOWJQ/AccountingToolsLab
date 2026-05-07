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

test("rounds decimal totals to two places", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Cash", debit: 10.335, credit: 0 },
    { id: "2", accountName: "Revenue", debit: 0, credit: 10.335 }
  ]);

  assert.deepEqual(result, {
    totalDebit: 10.34,
    totalCredit: 10.34,
    difference: 0,
    isBalanced: true
  });
});

test("allows empty account names without changing totals", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "", debit: 100, credit: 0 },
    { id: "2", accountName: "Capital", debit: 0, credit: 100 }
  ]);

  assert.equal(result.totalDebit, 100);
  assert.equal(result.totalCredit, 100);
  assert.equal(result.isBalanced, true);
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

test("treats tiny rounding differences as balanced", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Debit", debit: 100.0000001, credit: 0 },
    { id: "2", accountName: "Credit", debit: 0, credit: 100.0000002 }
  ]);

  assert.equal(result.difference, 0);
  assert.equal(result.isBalanced, true);
});

test("reports small differences outside tolerance", () => {
  const result = calculateTrialBalance([
    { id: "1", accountName: "Debit", debit: 100.01, credit: 0 },
    { id: "2", accountName: "Credit", debit: 0, credit: 100 }
  ]);

  assert.equal(result.difference, 0.01);
  assert.equal(result.isBalanced, false);
});
