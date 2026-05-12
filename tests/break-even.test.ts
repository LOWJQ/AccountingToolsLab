import assert from "node:assert/strict";
import { calculateBreakEven } from "../lib/calculators/break-even";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("calculates contribution margin per unit", () => {
  const result = calculateBreakEven({
    fixedCosts: 10000,
    sellingPricePerUnit: 50,
    variableCostPerUnit: 30
  });

  assert.equal(result.contributionMarginPerUnit, 20);
});

test("calculates break-even units", () => {
  const result = calculateBreakEven({
    fixedCosts: 10000,
    sellingPricePerUnit: 50,
    variableCostPerUnit: 30
  });

  assert.equal(result.breakEvenUnits, 500);
  assert.equal(result.minimumWholeUnits, 500);
});

test("calculates minimum whole units for fractional break-even", () => {
  const result = calculateBreakEven({
    fixedCosts: 100,
    sellingPricePerUnit: 30,
    variableCostPerUnit: 12
  });

  assert.equal(result.breakEvenUnits, 5.56);
  assert.equal(result.minimumWholeUnits, 6);
});

test("calculates break-even sales", () => {
  const result = calculateBreakEven({
    fixedCosts: 10000,
    sellingPricePerUnit: 50,
    variableCostPerUnit: 30
  });

  assert.equal(result.breakEvenSales, 25000);
});

test("handles decimals", () => {
  const result = calculateBreakEven({
    fixedCosts: 1200.5,
    sellingPricePerUnit: 15.75,
    variableCostPerUnit: 9.25
  });

  assert.equal(result.contributionMarginPerUnit, 6.5);
  assert.equal(result.breakEvenUnits, 184.69);
  assert.equal(result.minimumWholeUnits, 185);
  assert.equal(result.breakEvenSales, 2908.9);
});

test("handles zero fixed costs", () => {
  const result = calculateBreakEven({
    fixedCosts: 0,
    sellingPricePerUnit: 50,
    variableCostPerUnit: 30
  });

  assert.equal(result.breakEvenUnits, 0);
  assert.equal(result.minimumWholeUnits, 0);
  assert.equal(result.breakEvenSales, 0);
});

test("handles large break-even values", () => {
  const result = calculateBreakEven({
    fixedCosts: 1000000000,
    sellingPricePerUnit: 1250,
    variableCostPerUnit: 750
  });

  assert.equal(result.contributionMarginPerUnit, 500);
  assert.equal(result.breakEvenUnits, 2000000);
  assert.equal(result.breakEvenSales, 2500000000);
});

test("rejects selling price equal to variable cost", () => {
  assert.throws(
    () =>
      calculateBreakEven({
        fixedCosts: 10000,
        sellingPricePerUnit: 30,
        variableCostPerUnit: 30
      }),
    /Selling price per unit must be greater than variable cost per unit/
  );
});

test("rejects selling price lower than variable cost", () => {
  assert.throws(
    () =>
      calculateBreakEven({
        fixedCosts: 10000,
        sellingPricePerUnit: 25,
        variableCostPerUnit: 30
      }),
    /Selling price per unit must be greater than variable cost per unit/
  );
});

test("handles empty or invalid input safely", () => {
  assert.throws(
    () =>
      calculateBreakEven({
        fixedCosts: null,
        sellingPricePerUnit: 50,
        variableCostPerUnit: 30
      }),
    /Fixed costs is required/
  );

  assert.throws(
    () =>
      calculateBreakEven({
        fixedCosts: 10000,
        sellingPricePerUnit: Number.NaN,
        variableCostPerUnit: 30
      }),
    /Selling price per unit is required/
  );
});
