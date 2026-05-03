import assert from "node:assert/strict";
import { calculateTrialBalance } from "../lib/calculators/trial-balance";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("returns balanced totals when debit and credit totals match", () => {
    const result = calculateTrialBalance([
      { accountName: "Cash", debit: 100, credit: 0 },
      { accountName: "Capital", debit: 0, credit: 100 }
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
      { accountName: "Cash", debit: 100, credit: 0 },
      { accountName: "Capital", debit: 0, credit: 90 }
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

test("handles rows with zero values", () => {
    const result = calculateTrialBalance([
      { accountName: "No Activity", debit: 0, credit: 0 },
      { accountName: "Also No Activity", debit: 0, credit: 0 }
    ]);

    assert.deepEqual(result, {
      totalDebit: 0,
      totalCredit: 0,
      difference: 0,
      isBalanced: true
    });
  });

test("handles decimal values", () => {
    const result = calculateTrialBalance([
      { accountName: "Cash", debit: 10.5, credit: 0 },
      { accountName: "Revenue", debit: 0, credit: 10.5 }
    ]);

    assert.deepEqual(result, {
      totalDebit: 10.5,
      totalCredit: 10.5,
      difference: 0,
      isBalanced: true
    });
  });

test("handles negative values by summing them directly", () => {
    const result = calculateTrialBalance([
      { accountName: "Correction Debit", debit: -25, credit: 0 },
      { accountName: "Correction Credit", debit: 0, credit: -25 }
    ]);

    assert.deepEqual(result, {
      totalDebit: -25,
      totalCredit: -25,
      difference: 0,
      isBalanced: true
    });
  });
