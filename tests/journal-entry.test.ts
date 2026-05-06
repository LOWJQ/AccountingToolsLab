import assert from "node:assert/strict";
import { checkJournalEntry } from "../lib/calculators/journal-entry";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("balanced entry returns balanced status", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 1000, credit: 0 },
    { accountName: "Service Revenue", debit: 0, credit: 1000 }
  ]);

  assert.equal(result.isBalanced, true);
});

test("unbalanced entry returns not balanced status", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 1000, credit: 0 },
    { accountName: "Service Revenue", debit: 0, credit: 900 }
  ]);

  assert.equal(result.isBalanced, false);
});

test("calculates total debits", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 1000, credit: 0 },
    { accountName: "Supplies", debit: 250, credit: 0 },
    { accountName: "Accounts Payable", debit: 0, credit: 1250 }
  ]);

  assert.equal(result.totalDebit, 1250);
});

test("calculates total credits", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 1000, credit: 0 },
    { accountName: "Service Revenue", debit: 0, credit: 1000 }
  ]);

  assert.equal(result.totalCredit, 1000);
});

test("calculates difference", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 1000, credit: 0 },
    { accountName: "Service Revenue", debit: 0, credit: 900 }
  ]);

  assert.equal(result.difference, 100);
});

test("handles decimals", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 100.25, credit: 0 },
    { accountName: "Revenue", debit: 0, credit: 100.25 }
  ]);

  assert.equal(result.totalDebit, 100.25);
  assert.equal(result.totalCredit, 100.25);
  assert.equal(result.isBalanced, true);
});

test("treats empty debit or credit fields as zero", () => {
  const result = checkJournalEntry([
    { accountName: "Cash", debit: 1000, credit: 0 },
    { accountName: "Service Revenue", debit: 0, credit: 1000 }
  ]);

  assert.equal(result.totalDebit, 1000);
  assert.equal(result.totalCredit, 1000);
});

test("rejects negative debit or credit amounts", () => {
  assert.throws(
    () =>
      checkJournalEntry([
        { accountName: "Cash", debit: -100, credit: 0 },
        { accountName: "Revenue", debit: 0, credit: 100 }
      ]),
    /cannot be negative/
  );
});

test("flags a line with both debit and credit amounts", () => {
  assert.throws(
    () =>
      checkJournalEntry([
        { accountName: "Cash", debit: 100, credit: 100 }
      ]),
    /cannot have both debit and credit/
  );
});

test("handles empty or invalid input safely", () => {
  assert.throws(
    () =>
      checkJournalEntry([
        { accountName: "", debit: 0, credit: 0 }
      ]),
    /is empty/
  );

  assert.throws(
    () =>
      checkJournalEntry([
        { accountName: "Cash", debit: Number.NaN, credit: 0 }
      ]),
    /must be a valid number/
  );
});
