/**
 * Generated from the official LHDN MyInvois SDK code list.
 *
 * Source:    https://sdk.myinvois.hasil.gov.my/files/EInvoiceTypes.json
 * Retrieved: 2026-08-18
 *
 * Do not hand-edit. Re-download from the source when LHDN publishes a change,
 * then regenerate so the codes stay traceable to the official list.
 */

import type { EInvoiceCode } from "@/lib/einvoice/einvoice-types";

/**
 * Document type codes. 01-04 are issued by the supplier, 11-14 are the
 * self-billed equivalents issued by the buyer.
 */
export const E_INVOICE_TYPES: EInvoiceCode[] = [
  { code: "01", label: "Invoice" },
  { code: "02", label: "Credit Note" },
  { code: "03", label: "Debit Note" },
  { code: "04", label: "Refund Note" },
  { code: "11", label: "Self-billed Invoice" },
  { code: "12", label: "Self-billed Credit Note" },
  { code: "13", label: "Self-billed Debit Note" },
  { code: "14", label: "Self-billed Refund Note" }
];
