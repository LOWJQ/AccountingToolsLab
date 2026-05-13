import assert from "node:assert/strict";
import {
  CURRENCY_CODES,
  currencyOptions,
  defaultCurrency,
  formatCurrency,
  isCurrencyCode,
  searchCurrencies
} from "../lib/currency";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

test("default currency remains MYR", () => {
  assert.equal(defaultCurrency, "MYR");
  assert.equal(currencyOptions[0].code, "MYR");
});

test("currency list includes expanded common world currencies", () => {
  const requiredCodes = [
    "MYR",
    "SGD",
    "USD",
    "EUR",
    "CNY",
    "TWD",
    "KRW",
    "JPY",
    "THB",
    "IDR",
    "GBP",
    "AUD",
    "CAD",
    "INR",
    "PHP",
    "VND",
    "AED",
    "SAR",
    "ZAR",
    "BRL",
    "MXN"
  ];

  assert.ok(currencyOptions.length > 100);
  requiredCodes.forEach((code) => {
    assert.equal(CURRENCY_CODES.includes(code as (typeof CURRENCY_CODES)[number]), true);
  });
});

test("currency code guard accepts expanded currencies and rejects invalid values", () => {
  assert.equal(isCurrencyCode("MYR"), true);
  assert.equal(isCurrencyCode("GBP"), true);
  assert.equal(isCurrencyCode("NOT_A_CURRENCY"), false);
});

test("currency search matches code, symbol, name, and country", () => {
  assert.equal(searchCurrencies("MYR")[0]?.code, "MYR");
  assert.equal(searchCurrencies("RM")[0]?.code, "MYR");
  assert.equal(searchCurrencies("ringgit")[0]?.code, "MYR");
  assert.equal(searchCurrencies("Malaysia")[0]?.code, "MYR");
  assert.equal(searchCurrencies("United Kingdom").some((option) => option.code === "GBP"), true);
});

test("currency formatting supports expanded and unexpected currencies safely", () => {
  assert.doesNotThrow(() => formatCurrency(1234.56, "GBP"));
  assert.doesNotThrow(() => formatCurrency(1234.56, "ZZZ"));
  assert.match(formatCurrency(1234.56, "ZZZ"), /MYR|RM/);
});
