import assert from "node:assert/strict";
import {
  CURRENCY_CODES,
  currencyOptions,
  defaultCurrency,
  formatCurrency,
  isCurrencyCode
} from "../lib/currency";
import {
  currencyDetailCodes,
  getSearchableCurrencies,
  searchCurrencies
} from "../lib/currency-search";

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

// The currency table is split across two files so the search-only fields load
// on demand. Nothing at build time forces them to agree, so assert it here: a
// currency added to one file but not the other would otherwise show up in the
// dropdown with its code as its name and no country ever matching a search.
test("every currency has search metadata, and vice versa", () => {
  const coreCodes = [...CURRENCY_CODES].sort();
  const detailCodes = [...currencyDetailCodes].sort();

  assert.deepEqual(detailCodes, coreCodes);

  getSearchableCurrencies().forEach((option) => {
    assert.ok(option.name.length > 0, `${option.code} has no name`);
    assert.notEqual(option.name, option.code, `${option.code} fell back to its code`);
    assert.ok(option.countries.length > 0, `${option.code} has no countries`);
  });
});

test("currency formatting supports expanded and unexpected currencies safely", () => {
  assert.doesNotThrow(() => formatCurrency(1234.56, "GBP"));
  assert.doesNotThrow(() => formatCurrency(1234.56, "ZZZ"));
  assert.match(formatCurrency(1234.56, "ZZZ"), /MYR|RM/);
});
