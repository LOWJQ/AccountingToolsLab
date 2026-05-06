import assert from "node:assert/strict";
import { calculateCashFlow } from "../lib/calculators/cash-flow";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("calculates net cash flow", () => {
  const result = calculateCashFlow({
    beginningCashBalance: 5000,
    cashInflows: 12000,
    cashOutflows: 9000
  });

  assert.equal(result.netCashFlow, 3000);
});

test("calculates ending cash balance", () => {
  const result = calculateCashFlow({
    beginningCashBalance: 5000,
    cashInflows: 12000,
    cashOutflows: 9000
  });

  assert.equal(result.endingCashBalance, 8000);
});

test("identifies positive cash flow", () => {
  const result = calculateCashFlow({
    beginningCashBalance: 5000,
    cashInflows: 12000,
    cashOutflows: 9000
  });

  assert.equal(result.status, "positive");
});

test("identifies negative cash flow", () => {
  const result = calculateCashFlow({
    beginningCashBalance: 5000,
    cashInflows: 6000,
    cashOutflows: 9000
  });

  assert.equal(result.netCashFlow, -3000);
  assert.equal(result.status, "negative");
});

test("identifies neutral cash flow", () => {
  const result = calculateCashFlow({
    beginningCashBalance: 5000,
    cashInflows: 9000,
    cashOutflows: 9000
  });

  assert.equal(result.netCashFlow, 0);
  assert.equal(result.status, "neutral");
});

test("handles decimals", () => {
  const result = calculateCashFlow({
    beginningCashBalance: 100.25,
    cashInflows: 50.5,
    cashOutflows: 25.25
  });

  assert.equal(result.netCashFlow, 25.25);
  assert.equal(result.endingCashBalance, 125.5);
});

test("handles zero inflows or outflows", () => {
  const noInflows = calculateCashFlow({
    beginningCashBalance: 100,
    cashInflows: 0,
    cashOutflows: 25
  });

  const noOutflows = calculateCashFlow({
    beginningCashBalance: 100,
    cashInflows: 25,
    cashOutflows: 0
  });

  assert.equal(noInflows.netCashFlow, -25);
  assert.equal(noOutflows.netCashFlow, 25);
});

test("handles empty or invalid input safely", () => {
  assert.throws(
    () =>
      calculateCashFlow({
        beginningCashBalance: null,
        cashInflows: 12000,
        cashOutflows: 9000
      }),
    /Beginning cash balance is required/
  );

  assert.throws(
    () =>
      calculateCashFlow({
        beginningCashBalance: 5000,
        cashInflows: Number.NaN,
        cashOutflows: 9000
      }),
    /Cash inflows is required/
  );
});
