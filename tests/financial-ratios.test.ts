import assert from "node:assert/strict";
import { calculateFinancialRatio } from "../lib/calculators/financial-ratios";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("calculates current ratio", () => {
  const result = calculateFinancialRatio({
    ratioType: "current-ratio",
    values: {
      currentAssets: 10000,
      currentLiabilities: 5000
    }
  });

  assert.equal(result.value, 2);
  assert.equal(result.displayValue, "2.00 : 1");
});

test("calculates debt-to-equity ratio", () => {
  const result = calculateFinancialRatio({
    ratioType: "debt-to-equity",
    values: {
      totalLiabilities: 15000,
      totalEquity: 10000
    }
  });

  assert.equal(result.value, 1.5);
  assert.equal(result.displayValue, "1.50 : 1");
});

test("calculates gross profit margin", () => {
  const result = calculateFinancialRatio({
    ratioType: "gross-profit-margin",
    values: {
      grossProfit: 4500,
      revenue: 10000
    }
  });

  assert.equal(result.value, 45);
  assert.equal(result.displayValue, "45.00%");
});

test("calculates net profit margin", () => {
  const result = calculateFinancialRatio({
    ratioType: "net-profit-margin",
    values: {
      netIncome: 1250,
      revenue: 10000
    }
  });

  assert.equal(result.value, 12.5);
  assert.equal(result.displayValue, "12.50%");
});

test("calculates return on assets", () => {
  const result = calculateFinancialRatio({
    ratioType: "return-on-assets",
    values: {
      netIncome: 825,
      totalAssets: 10000
    }
  });

  assert.equal(result.value, 8.25);
  assert.equal(result.displayValue, "8.25%");
});

test("handles decimals", () => {
  const result = calculateFinancialRatio({
    ratioType: "current-ratio",
    values: {
      currentAssets: 10.5,
      currentLiabilities: 4.2
    }
  });

  assert.equal(result.value, 2.5);
  assert.equal(result.displayValue, "2.50 : 1");
});

test("rejects denominator zero safely", () => {
  assert.throws(
    () =>
      calculateFinancialRatio({
        ratioType: "current-ratio",
        values: {
          currentAssets: 100,
          currentLiabilities: 0
        }
      }),
    /cannot be zero/
  );
});

test("rejects empty or invalid input safely", () => {
  assert.throws(
    () =>
      calculateFinancialRatio({
        ratioType: "net-profit-margin",
        values: {
          netIncome: null,
          revenue: 100
        }
      }),
    /Net Income is required/
  );

  assert.throws(
    () =>
      calculateFinancialRatio({
        ratioType: "return-on-assets",
        values: {
          netIncome: 100,
          totalAssets: Number.NaN
        }
      }),
    /Total Assets is required/
  );
});
