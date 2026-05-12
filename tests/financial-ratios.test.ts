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
  assert.deepEqual(result.warnings, []);
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

test("rounds repeating decimal ratio results", () => {
  const result = calculateFinancialRatio({
    ratioType: "current-ratio",
    values: {
      currentAssets: 10,
      currentLiabilities: 3
    }
  });

  assert.equal(result.value, 3.33);
  assert.equal(result.displayValue, "3.33 : 1");
});

test("rounds repeating decimal percentage results", () => {
  const result = calculateFinancialRatio({
    ratioType: "return-on-assets",
    values: {
      netIncome: 1,
      totalAssets: 3
    }
  });

  assert.equal(result.value, 33.33);
  assert.equal(result.displayValue, "33.33%");
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

test("allows negative numerator values when the ratio can represent a loss", () => {
  const result = calculateFinancialRatio({
    ratioType: "net-profit-margin",
    values: {
      netIncome: -250,
      revenue: 1000
    }
  });

  assert.equal(result.value, -25);
  assert.equal(result.displayValue, "-25.00%");
});

test("allows negative denominator values but preserves the calculated sign", () => {
  const result = calculateFinancialRatio({
    ratioType: "debt-to-equity",
    values: {
      totalLiabilities: 1000,
      totalEquity: -500
    }
  });

  assert.equal(result.value, -2);
  assert.equal(result.displayValue, "-2.00 : 1");
  assert.deepEqual(result.warnings, [
    "Total Equity is negative, so this ratio can be unusual and should be interpreted with extra context."
  ]);
});

test("warns when percentage ratio denominator is negative", () => {
  const result = calculateFinancialRatio({
    ratioType: "net-profit-margin",
    values: {
      netIncome: 250,
      revenue: -1000
    }
  });

  assert.equal(result.value, -25);
  assert.equal(result.displayValue, "-25.00%");
  assert.deepEqual(result.warnings, [
    "Revenue is negative, so this ratio can be unusual and should be interpreted with extra context."
  ]);
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
