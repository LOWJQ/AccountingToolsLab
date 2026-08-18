import type { EInvoiceCode } from "./einvoice-types";

/**
 * Shared search and paging for LHDN's code lists. Holds no data itself, so both
 * the small eager list and the large lazily-loaded MSIC list can use it without
 * pulling either one into the other's bundle.
 */

/** Rows per page. Enough to scan without turning the page into a scroll marathon. */
export const CODE_PAGE_SIZE = 25;

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Ranks a row against a query. Lower is better, -1 means no match.
 *
 * Someone typing a code wants that exact code first; someone typing words wants
 * the entry whose description opens with them. Plain substring matches come
 * last so a query like "car" still surfaces "Motor vehicle" style entries
 * without burying the obvious hits.
 */
function scoreCode(row: EInvoiceCode, normalizedQuery: string): number {
  const code = row.code.toLocaleLowerCase();
  const label = row.label.toLocaleLowerCase();

  if (code === normalizedQuery) {
    return 0;
  }

  if (code.startsWith(normalizedQuery)) {
    return 1;
  }

  if (label.startsWith(normalizedQuery)) {
    return 2;
  }

  // Word-boundary hit, e.g. "food" matching "Fast-food restaurants".
  if (new RegExp(`\\b${escapeForRegExp(normalizedQuery)}`).test(label)) {
    return 3;
  }

  if (label.includes(normalizedQuery)) {
    return 4;
  }

  return -1;
}

/**
 * Filters and ranks a code list, returning every match. Paging happens
 * separately in paginateCodes, so the caller always knows the true match count
 * and can offer real pages rather than a truncated list.
 *
 * An empty query returns the list unchanged, in LHDN's published order, so the
 * tool is browsable and not just searchable.
 */
export function searchEInvoiceCodes<T extends EInvoiceCode>(
  codes: readonly T[],
  query: string
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [...codes];
  }

  const scored: { row: T; score: number; index: number }[] = [];

  codes.forEach((row, index) => {
    const score = scoreCode(row, normalizedQuery);

    if (score !== -1) {
      scored.push({ row, score, index });
    }
  });

  // Ties keep LHDN's published order rather than re-sorting alphabetically,
  // which would scatter related codes that sit next to each other in the list.
  scored.sort((a, b) => (a.score === b.score ? a.index - b.index : a.score - b.score));

  return scored.map((entry) => entry.row);
}

export type CodePage<T> = {
  rows: T[];
  /** 1-based, clamped into range so an out-of-range page cannot blank the list. */
  page: number;
  /** At least 1, so "Page 1 of 1" still reads correctly with no results. */
  pageCount: number;
  totalMatches: number;
  /** 1-based position of the first row on this page, 0 when there are none. */
  startIndex: number;
  /** 1-based position of the last row on this page, 0 when there are none. */
  endIndex: number;
};

/**
 * Slices ranked matches into a page. Pure and clamped: callers can hand it any
 * page number, including one left over from a previous longer result set, and
 * still get a valid page back.
 */
export function paginateCodes<T>(
  rows: readonly T[],
  page: number,
  pageSize: number = CODE_PAGE_SIZE
): CodePage<T> {
  const totalMatches = rows.length;
  const pageCount = Math.max(Math.ceil(totalMatches / pageSize), 1);
  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount);
  const start = (safePage - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return {
    rows: pageRows,
    page: safePage,
    pageCount,
    totalMatches,
    startIndex: pageRows.length === 0 ? 0 : start + 1,
    endIndex: start + pageRows.length
  };
}
