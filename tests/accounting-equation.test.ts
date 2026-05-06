import assert from "node:assert/strict";
import { calculateAccountingEquation } from "../lib/calculators/accounting-equation";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("calculates assets as liabilities plus equity", () => {
  const result = calculateAccountingEquation({
    solveFor: "assets",
    liabilities: 400,
    equity: 600
  });

  assert.deepEqual(result, {
    solveFor: "assets",
    value: 1000,
    formula: "Assets = Liabilities + Equity"
  });
});

test("calculates liabilities as assets minus equity", () => {
  const result = calculateAccountingEquation({
    solveFor: "liabilities",
    assets: 1000,
    equity: 600
  });

  assert.deepEqual(result, {
    solveFor: "liabilities",
    value: 400,
    formula: "Liabilities = Assets - Equity"
  });
});

test("calculates equity as assets minus liabilities", () => {
  const result = calculateAccountingEquation({
    solveFor: "equity",
    assets: 1000,
    liabilities: 400
  });

  assert.deepEqual(result, {
    solveFor: "equity",
    value: 600,
    formula: "Equity = Assets - Liabilities"
  });
});

test("handles decimals", () => {
  const result = calculateAccountingEquation({
    solveFor: "assets",
    liabilities: 125.25,
    equity: 74.75
  });

  assert.equal(result.value, 200);
});

test("allows negative equity when liabilities exceed assets", () => {
  const result = calculateAccountingEquation({
    solveFor: "equity",
    assets: 250,
    liabilities: 400
  });

  assert.deepEqual(result, {
    solveFor: "equity",
    value: -150,
    formula: "Equity = Assets - Liabilities"
  });
});

test("handles large accounting equation values", () => {
  const result = calculateAccountingEquation({
    solveFor: "assets",
    liabilities: 987654321.12,
    equity: 123456789.98
  });

  assert.equal(result.value, 1111111111.1);
});

test("rejects empty or invalid required input", () => {
  assert.throws(
    () =>
      calculateAccountingEquation({
        solveFor: "assets",
        liabilities: null,
        equity: 600
      }),
    /Liabilities is required/
  );

  assert.throws(
    () =>
      calculateAccountingEquation({
        solveFor: "equity",
        assets: Number.NaN,
        liabilities: 400
      }),
    /Assets is required/
  );
});
