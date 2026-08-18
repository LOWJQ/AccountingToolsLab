import assert from "node:assert/strict";
import { CLASSIFICATION_CODES } from "../lib/data/einvoice/classification-codes";
import { MSIC_CODES } from "../lib/data/einvoice/msic-codes";
import {
  CODE_PAGE_SIZE,
  paginateCodes,
  searchEInvoiceCodes
} from "../lib/einvoice/code-search";
import { msicCodeCount, searchMsicCodes } from "../lib/einvoice/msic-search";
import type { EInvoiceCode } from "../lib/einvoice/einvoice-types";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

const sample: EInvoiceCode[] = [
  { code: "001", label: "Breastfeeding equipment" },
  { code: "010", label: "Education fees" },
  { code: "022", label: "Others" },
  { code: "025", label: "Motor vehicle" },
  { code: "028", label: "Rental of motor vehicle" }
];

// --- searching ---------------------------------------------------------------

test("an empty query returns the list in published order", () => {
  assert.deepEqual(
    searchEInvoiceCodes(sample, "").map((row) => row.code),
    ["001", "010", "022", "025", "028"]
  );
});

test("an empty query returns a copy, not the original array", () => {
  const result = searchEInvoiceCodes(sample, "");
  result.pop();

  assert.equal(sample.length, 5);
});

test("a whitespace-only query is treated as empty", () => {
  assert.equal(searchEInvoiceCodes(sample, "   ").length, sample.length);
});

test("an exact code match ranks first", () => {
  assert.equal(searchEInvoiceCodes(sample, "022")[0].code, "022");
});

test("a code prefix matches", () => {
  assert.deepEqual(
    searchEInvoiceCodes(sample, "02").map((row) => row.code),
    ["022", "025", "028"]
  );
});

test("a label that starts with the query outranks one that merely contains it", () => {
  const rows = searchEInvoiceCodes(sample, "motor");

  // "Motor vehicle" starts with it; "Rental of motor vehicle" only contains it.
  assert.equal(rows[0].code, "025");
  assert.equal(rows[1].code, "028");
});

test("search is case insensitive", () => {
  assert.equal(searchEInvoiceCodes(sample, "EDUCATION")[0].code, "010");
  assert.equal(searchEInvoiceCodes(sample, "eDuCaTiOn")[0].code, "010");
});

test("a query matching nothing returns no rows", () => {
  assert.equal(searchEInvoiceCodes(sample, "zzzzz").length, 0);
});

test("regex characters in a query are treated literally", () => {
  const tricky: EInvoiceCode[] = [{ code: "999", label: "Repair (and) maintenance" }];

  // Would throw or mis-match if the query were interpolated into a regex raw.
  assert.doesNotThrow(() => searchEInvoiceCodes(tricky, "("));
  assert.equal(searchEInvoiceCodes(tricky, "(and)").length, 1);
  assert.equal(searchEInvoiceCodes(tricky, "[").length, 0);
});

test("search returns every match rather than a capped list", () => {
  const all = searchMsicCodes("a");

  assert.ok(all.length > CODE_PAGE_SIZE);
  assert.equal(all.length, MSIC_CODES.filter((row) => /a/i.test(row.code + row.label)).length);
});

// --- paging ------------------------------------------------------------------

test("the first page starts at row 1", () => {
  const page = paginateCodes(sample, 1, 2);

  assert.deepEqual(
    page.rows.map((row) => row.code),
    ["001", "010"]
  );
  assert.equal(page.page, 1);
  assert.equal(page.pageCount, 3);
  assert.equal(page.totalMatches, 5);
  assert.equal(page.startIndex, 1);
  assert.equal(page.endIndex, 2);
});

test("a middle page slices correctly", () => {
  const page = paginateCodes(sample, 2, 2);

  assert.deepEqual(
    page.rows.map((row) => row.code),
    ["022", "025"]
  );
  assert.equal(page.startIndex, 3);
  assert.equal(page.endIndex, 4);
});

test("a partial last page reports the real end index", () => {
  const page = paginateCodes(sample, 3, 2);

  assert.deepEqual(
    page.rows.map((row) => row.code),
    ["028"]
  );
  assert.equal(page.startIndex, 5);
  assert.equal(page.endIndex, 5);
});

test("a page beyond the end clamps to the last page", () => {
  const page = paginateCodes(sample, 99, 2);

  assert.equal(page.page, 3);
  assert.equal(page.rows.length, 1);
});

test("a page below one clamps to the first page", () => {
  assert.equal(paginateCodes(sample, 0, 2).page, 1);
  assert.equal(paginateCodes(sample, -5, 2).page, 1);
});

test("a non-integer page is truncated rather than breaking the slice", () => {
  assert.equal(paginateCodes(sample, 2.9, 2).page, 2);
});

test("an empty result set still reports one page", () => {
  const page = paginateCodes([], 1);

  assert.equal(page.rows.length, 0);
  assert.equal(page.pageCount, 1);
  assert.equal(page.totalMatches, 0);
  assert.equal(page.startIndex, 0);
  assert.equal(page.endIndex, 0);
});

test("every row is reachable by paging through the whole MSIC list", () => {
  const all = searchMsicCodes("");
  const seen: string[] = [];
  const { pageCount } = paginateCodes(all, 1);

  for (let page = 1; page <= pageCount; page += 1) {
    seen.push(...paginateCodes(all, page).rows.map((row) => row.code));
  }

  assert.equal(seen.length, MSIC_CODES.length);
  assert.equal(new Set(seen).size, MSIC_CODES.length);
});

test("page size divides the MSIC list into the expected number of pages", () => {
  const { pageCount, totalMatches } = paginateCodes(searchMsicCodes(""), 1);

  assert.equal(totalMatches, msicCodeCount);
  assert.equal(pageCount, Math.ceil(msicCodeCount / CODE_PAGE_SIZE));
});

// --- real code lists ---------------------------------------------------------

test("classification codes find the Others fallback by name", () => {
  assert.equal(searchEInvoiceCodes(CLASSIFICATION_CODES, "others")[0].code, "022");
});

test("classification codes find a real category by keyword", () => {
  assert.ok(searchEInvoiceCodes(CLASSIFICATION_CODES, "education").some((r) => r.code === "010"));
});

test("MSIC search finds restaurants by keyword", () => {
  const rows = searchMsicCodes("restaurant");

  assert.ok(rows.some((row) => row.code === "56101"));
  assert.ok(rows.some((row) => row.code === "56103"));
});

test("MSIC search finds an entry by its exact code", () => {
  const rows = searchMsicCodes("56101");

  assert.equal(rows[0].code, "56101");
  assert.equal(rows[0].label, "Restaurants and restaurant cum night clubs");
});

test("MSIC results carry the section letter", () => {
  assert.equal(searchMsicCodes("56101")[0].section, "I");
});

test("the exported MSIC count matches the code list", () => {
  assert.equal(msicCodeCount, MSIC_CODES.length);
});
