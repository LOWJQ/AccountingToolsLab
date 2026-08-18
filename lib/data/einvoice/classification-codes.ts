/**
 * Generated from the official LHDN MyInvois SDK code list.
 *
 * Source:    https://sdk.myinvois.hasil.gov.my/files/ClassificationCodes.json
 * Retrieved: 2026-08-18
 *
 * Do not hand-edit. Re-download from the source when LHDN publishes a change,
 * then regenerate so the codes stay traceable to the official list.
 */

import type { EInvoiceCode } from "@/lib/einvoice/einvoice-types";

/**
 * Three-digit line-item classification codes. Every e-invoice line needs one;
 * `022` (Others) is the fallback when nothing more specific fits.
 */
export const CLASSIFICATION_CODES: EInvoiceCode[] = [
  { code: "001", label: "Breastfeeding equipment" },
  { code: "002", label: "Child care centres and kindergartens fees" },
  { code: "003", label: "Computer, smartphone or tablet" },
  { code: "004", label: "Consolidated e-Invoice" },
  { code: "005", label: "Construction materials (as specified under Fourth Schedule of the Lembaga Pembangunan Industri Pembinaan Malaysia Act 1994)" },
  { code: "006", label: "Disbursement" },
  { code: "007", label: "Donation" },
  { code: "008", label: "e-Commerce - e-Invoice to buyer / purchaser" },
  { code: "009", label: "e-Commerce - Self-billed e-Invoice to seller, logistics, etc." },
  { code: "010", label: "Education fees" },
  { code: "011", label: "Goods on consignment (Consignor)" },
  { code: "012", label: "Goods on consignment (Consignee)" },
  { code: "013", label: "Gym membership" },
  { code: "014", label: "Insurance - Education and medical benefits" },
  { code: "015", label: "Insurance - Takaful or life insurance" },
  { code: "016", label: "Interest and financing expenses" },
  { code: "017", label: "Internet subscription" },
  { code: "018", label: "Land and building" },
  { code: "019", label: "Medical examination for learning disabilities and early intervention or rehabilitation treatments of learning disabilities" },
  { code: "020", label: "Medical examination or vaccination expenses" },
  { code: "021", label: "Medical expenses for serious diseases" },
  { code: "022", label: "Others" },
  { code: "023", label: "Petroleum operations (as defined in Petroleum (Income Tax) Act 1967)" },
  { code: "024", label: "Private retirement scheme or deferred annuity scheme" },
  { code: "025", label: "Motor vehicle" },
  { code: "026", label: "Subscription of books / journals / magazines / newspapers / other similar publications" },
  { code: "027", label: "Reimbursement" },
  { code: "028", label: "Rental of motor vehicle" },
  { code: "029", label: "EV charging facilities (Installation, rental, sale / purchase or subscription fees)" },
  { code: "030", label: "Repair and maintenance" },
  { code: "031", label: "Research and development" },
  { code: "032", label: "Foreign income" },
  { code: "033", label: "Self-billed - Betting and gaming" },
  { code: "034", label: "Self-billed - Importation of goods" },
  { code: "035", label: "Self-billed - Importation of services" },
  { code: "036", label: "Self-billed - Others" },
  { code: "037", label: "Self-billed - Monetary payment to agents, dealers or distributors" },
  { code: "038", label: "Sports equipment, rental / entry fees for sports facilities, registration in sports competition or sports training fees imposed by associations / sports clubs / companies registered with the Sports Commissioner or Companies Commission of Malaysia and carrying out sports activities as listed under the Sports Development Act 1997" },
  { code: "039", label: "Supporting equipment for disabled person" },
  { code: "040", label: "Voluntary contribution to approved provident fund" },
  { code: "041", label: "Dental examination or treatment" },
  { code: "042", label: "Fertility treatment" },
  { code: "043", label: "Treatment and home care nursing, daycare centres and residential care centers" },
  { code: "044", label: "Vouchers, gift cards, loyalty points, etc" },
  { code: "045", label: "Self-billed - Non-monetary payment to agents, dealers or distributors" }
];
