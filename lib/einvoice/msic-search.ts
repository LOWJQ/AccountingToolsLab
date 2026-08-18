import { MSIC_CODES } from "../data/einvoice/msic-codes";
import { searchEInvoiceCodes } from "./code-search";
import type { MsicCode } from "./einvoice-types";

/**
 * The MSIC list is over a thousand entries and by far the largest thing the
 * code lookup touches. Split into its own module, the same way
 * lib/currency-search.ts is split from lib/currency.ts, so the bytes load when
 * someone actually opens the business-activity tab rather than on page view.
 */
export function searchMsicCodes(query: string): MsicCode[] {
  return searchEInvoiceCodes(MSIC_CODES, query);
}

/** Total published entries, shown as a count before anyone searches. */
export const msicCodeCount = MSIC_CODES.length;
