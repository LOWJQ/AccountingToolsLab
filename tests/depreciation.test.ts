import assert from "node:assert/strict";
import { calculateDepreciation } from "../lib/calculators/depreciation";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("calculates depreciable amount", () => {
  const result = calculateDepreciation({
    assetCost: 10000,
    salvageValue: 1000,
    usefulLifeYears: 5
  });

  assert.equal(result.depreciableAmount, 9000);
});

test("calculates annual depreciation", () => {
  const result = calculateDepreciation({
    assetCost: 10000,
    salvageValue: 1000,
    usefulLifeYears: 5
  });

  assert.equal(result.annualDepreciation, 1800);
});

test("calculates monthly depreciation", () => {
  const result = calculateDepreciation({
    assetCost: 10000,
    salvageValue: 1000,
    usefulLifeYears: 5
  });

  assert.equal(result.monthlyDepreciation, 150);
});

test("handles decimals", () => {
  const result = calculateDepreciation({
    assetCost: 1000.5,
    salvageValue: 100.25,
    usefulLifeYears: 3
  });

  assert.equal(result.depreciableAmount, 900.25);
  assert.equal(result.annualDepreciation, 300.08);
  assert.equal(result.monthlyDepreciation, 25.01);
});

test("rejects useful life of zero", () => {
  assert.throws(
    () =>
      calculateDepreciation({
        assetCost: 10000,
        salvageValue: 1000,
        usefulLifeYears: 0
      }),
    /Useful life must be greater than zero/
  );
});

test("rejects salvage value greater than cost", () => {
  assert.throws(
    () =>
      calculateDepreciation({
        assetCost: 10000,
        salvageValue: 12000,
        usefulLifeYears: 5
      }),
    /Salvage value cannot be greater than asset cost/
  );
});

test("handles empty or invalid input safely", () => {
  assert.throws(
    () =>
      calculateDepreciation({
        assetCost: null,
        salvageValue: 0,
        usefulLifeYears: 5
      }),
    /Asset cost is required/
  );

  assert.throws(
    () =>
      calculateDepreciation({
        assetCost: 10000,
        salvageValue: Number.NaN,
        usefulLifeYears: 5
      }),
    /Salvage value is required/
  );
});
