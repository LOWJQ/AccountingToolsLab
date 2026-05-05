import assert from "node:assert/strict";
import { checkDebitCredit } from "../lib/calculators/debit-credit";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("asset increase returns debit", () => {
  const result = checkDebitCredit({ accountType: "asset", effect: "increase" });

  assert.equal(result.answer, "Debit");
  assert.equal(result.normalBalance, "Debit");
});

test("asset decrease returns credit", () => {
  const result = checkDebitCredit({ accountType: "asset", effect: "decrease" });

  assert.equal(result.answer, "Credit");
});

test("liability increase returns credit", () => {
  const result = checkDebitCredit({ accountType: "liability", effect: "increase" });

  assert.equal(result.answer, "Credit");
  assert.equal(result.normalBalance, "Credit");
});

test("liability decrease returns debit", () => {
  const result = checkDebitCredit({ accountType: "liability", effect: "decrease" });

  assert.equal(result.answer, "Debit");
});

test("revenue increase returns credit", () => {
  const result = checkDebitCredit({ accountType: "revenue", effect: "increase" });

  assert.equal(result.answer, "Credit");
});

test("expense increase returns debit", () => {
  const result = checkDebitCredit({ accountType: "expense", effect: "increase" });

  assert.equal(result.answer, "Debit");
});

test("dividends or drawings increase returns debit", () => {
  const result = checkDebitCredit({ accountType: "dividends", effect: "increase" });

  assert.equal(result.answer, "Debit");
});

test("missing or invalid input is handled safely", () => {
  assert.throws(
    () => checkDebitCredit({ accountType: null, effect: "increase" }),
    /Choose an account type/
  );

  assert.throws(
    () => checkDebitCredit({ accountType: "asset", effect: null }),
    /Choose whether the account increases or decreases/
  );
});
