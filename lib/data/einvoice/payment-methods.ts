/**
 * Generated from the official LHDN MyInvois SDK code list.
 *
 * Source:    https://sdk.myinvois.hasil.gov.my/files/PaymentMethods.json
 * Retrieved: 2026-08-18
 *
 * Do not hand-edit. Re-download from the source when LHDN publishes a change,
 * then regenerate so the codes stay traceable to the official list.
 */

import type { EInvoiceCode } from "@/lib/einvoice/einvoice-types";

/**
 * Payment mode codes. Optional on an e-invoice.
 */
export const PAYMENT_METHODS: EInvoiceCode[] = [
  { code: "01", label: "Cash" },
  { code: "02", label: "Cheque" },
  { code: "03", label: "Bank Transfer" },
  { code: "04", label: "Credit Card" },
  { code: "05", label: "Debit Card" },
  { code: "06", label: "e-Wallet / Digital Wallet" },
  { code: "07", label: "Digital Bank" },
  { code: "08", label: "Others" }
];
