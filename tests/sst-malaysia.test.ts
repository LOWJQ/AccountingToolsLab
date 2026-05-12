import assert from "node:assert/strict";
import { calculateSstMalaysia } from "../lib/calculators/sst-malaysia";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("add SST calculates SST amount", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 100,
    sstRate: 8
  });

  assert.equal(result.sstAmount, 8);
});

test("add SST calculates total including SST", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 100,
    sstRate: 8
  });

  assert.equal(result.totalIncludingSst, 108);
});

test("remove SST calculates amount before SST", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 108,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 100);
});

test("remove SST calculates SST amount", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 108,
    sstRate: 8
  });

  assert.equal(result.sstAmount, 8);
});

test("handles 0 percent rate", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 100,
    sstRate: 0
  });

  assert.equal(result.sstAmount, 0);
  assert.equal(result.totalIncludingSst, 100);
});

test("handles 5, 6, 8, and 10 percent rates", () => {
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 5 }).sstAmount, 5);
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 6 }).sstAmount, 6);
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 8 }).sstAmount, 8);
  assert.equal(calculateSstMalaysia({ mode: "add", amount: 100, sstRate: 10 }).sstAmount, 10);
});

test("handles custom rates", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 200,
    sstRate: 7.5
  });

  assert.equal(result.sstAmount, 15);
  assert.equal(result.totalIncludingSst, 215);
});

test("handles custom rates with awkward decimals", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 123.45,
    sstRate: 7.25
  });

  assert.equal(result.sstAmount, 8.95);
  assert.equal(result.totalIncludingSst, 132.4);
});

test("handles decimals", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 99.99,
    sstRate: 8
  });

  assert.equal(result.sstAmount, 8);
  assert.equal(result.totalIncludingSst, 107.99);
});

test("add SST mode rounds awkward decimals", () => {
  const result = calculateSstMalaysia({
    mode: "add",
    amount: 123.456,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 123.46);
  assert.equal(result.sstAmount, 9.88);
  assert.equal(result.totalIncludingSst, 133.34);
});

test("remove SST mode rounds awkward decimals", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 133.34,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 123.46);
  assert.equal(result.sstAmount, 9.88);
  assert.equal(result.totalIncludingSst, 133.34);
});

test("handles zero amount", () => {
  const result = calculateSstMalaysia({
    mode: "remove",
    amount: 0,
    sstRate: 8
  });

  assert.equal(result.amountBeforeSst, 0);
  assert.equal(result.sstAmount, 0);
  assert.equal(result.totalIncludingSst, 0);
});

test("rejects invalid amount", () => {
  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: Number.NaN,
        sstRate: 8
      }),
    /Amount is required/
  );

  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: -100,
        sstRate: 8
      }),
    /Amount must be zero or greater/
  );
});

test("rejects invalid custom rate", () => {
  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: 100,
        sstRate: null
      }),
    /SST rate is required/
  );

  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: 100,
        sstRate: -1
      }),
    /SST rate must be zero or greater/
  );

  assert.throws(
    () =>
      calculateSstMalaysia({
        mode: "add",
        amount: 100,
        sstRate: 101
      }),
    /SST rate must be 100% or less/
  );
});
