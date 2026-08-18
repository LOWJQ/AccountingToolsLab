/**
 * Generated from the official LHDN MyInvois SDK code list.
 *
 * Source:    https://sdk.myinvois.hasil.gov.my/files/TaxTypes.json
 * Retrieved: 2026-08-18
 *
 * Do not hand-edit. Re-download from the source when LHDN publishes a change,
 * then regenerate so the codes stay traceable to the official list.
 */

import type { EInvoiceCode } from "@/lib/einvoice/einvoice-types";

/**
 * Tax type codes used on invoice line items and tax subtotals.
 */
export const TAX_TYPES: EInvoiceCode[] = [
  { code: "01", label: "Sales Tax" },
  { code: "02", label: "Service Tax" },
  { code: "03", label: "Tourism Tax" },
  { code: "04", label: "High-Value Goods Tax" },
  { code: "05", label: "Sales Tax on Low Value Goods" },
  { code: "06", label: "Not Applicable" },
  { code: "E", label: "Tax exemption (where applicable)" }
];
