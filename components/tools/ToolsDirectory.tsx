import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { toolIcons } from "@/components/tools/toolIcons";

type DirectoryTool = {
  description: string;
  href: string;
  icon: LucideIcon;
  name: string;
};

const directoryTools: DirectoryTool[] = [
  {
    name: "PDF Invoice Generator Malaysia",
    description: "Create simple PDF invoices with SST, totals, and multi-currency support.",
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice
  },
  {
    name: "SST Calculator Malaysia",
    description: "Calculate SST, total including SST, or amount before SST.",
    href: "/tools/sst-calculator-malaysia",
    icon: toolIcons.sst
  },
  {
    name: "Cash Flow Calculator",
    description: "Check net cash flow and ending cash balance.",
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow
  },
  {
    name: "Break-even Calculator",
    description: "Estimate break-even units and sales.",
    href: "/tools/break-even-calculator",
    icon: toolIcons.breakEven
  },
  {
    name: "Financial Ratio Calculator",
    description: "Review liquidity, profitability, and solvency ratios.",
    href: "/tools/financial-ratio-calculator",
    icon: toolIcons.financialRatio
  },
  {
    name: "Depreciation Calculator",
    description: "Calculate straight-line depreciation.",
    href: "/tools/depreciation-calculator",
    icon: toolIcons.depreciation
  },
  {
    name: "Trial Balance Calculator",
    description: "Check whether total debits equal total credits.",
    href: "/tools/trial-balance-calculator",
    icon: toolIcons.trialBalance
  },
  {
    name: "Journal Entry Checker",
    description: "Check whether a journal entry balances.",
    href: "/tools/journal-entry-checker",
    icon: toolIcons.journalEntry
  },
  {
    name: "Debit/Credit Checker",
    description: "Learn whether accounts increase by debit or credit.",
    href: "/tools/debit-credit-checker",
    icon: toolIcons.debitCredit
  },
  {
    name: "Accounting Equation Calculator",
    description: "Review assets, liabilities, and equity.",
    href: "/tools/accounting-equation-calculator",
    icon: toolIcons.accountingEquation
  }
];

function ToolCard({ tool }: { tool: DirectoryTool }) {
  const Icon = tool.icon;

  return (
    <Link
      className="group flex min-h-[164px] items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={tool.href}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-800">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-6 text-slate-950">{tool.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
      />
    </Link>
  );
}

export function ToolsDirectory() {
  return (
    <section aria-label="Accounting tools" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {directoryTools.map((tool) => (
        <ToolCard key={tool.name} tool={tool} />
      ))}
    </section>
  );
}
