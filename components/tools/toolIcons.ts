import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  BarChart3,
  BookCheck,
  Calculator,
  CalendarCheck,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Grid2X2,
  LineChart,
  ListChecks,
  ReceiptText,
  Scale,
  SearchCode,
  Table2
} from "lucide-react";

export const toolIcons = {
  accountingEquation: ListChecks,
  allTools: Grid2X2,
  breakEven: Calculator,
  cashFlow: CircleDollarSign,
  debitCredit: Scale,
  depreciation: LineChart,
  eInvoice: CalendarCheck,
  eInvoiceCodes: SearchCode,
  estimateQuotation: FileCheck2,
  financialRatio: BarChart3,
  invoice: FileText,
  journalEntry: BookCheck,
  receipt: ReceiptText,
  sst: BadgePercent,
  trialBalance: Table2
};

/**
 * Icons live here rather than on the Tool records in lib/data/tools.ts: the
 * header is a client component, and putting icon components on the data would
 * pull every one of them into every page's bundle.
 */
export const toolIconsBySlug: Record<string, LucideIcon> = {
  "accounting-equation-calculator": toolIcons.accountingEquation,
  "break-even-calculator": toolIcons.breakEven,
  "cash-flow-calculator": toolIcons.cashFlow,
  "debit-credit-checker": toolIcons.debitCredit,
  "depreciation-calculator": toolIcons.depreciation,
  "e-invoice-checker-malaysia": toolIcons.eInvoice,
  "e-invoice-code-lookup-malaysia": toolIcons.eInvoiceCodes,
  "financial-ratio-calculator": toolIcons.financialRatio,
  "invoice-generator": toolIcons.invoice,
  "journal-entry-checker": toolIcons.journalEntry,
  "sst-calculator-malaysia": toolIcons.sst,
  "trial-balance-calculator": toolIcons.trialBalance
};
