import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "trial-balance-calculator",
    name: "Trial Balance Calculator",
    emoji: "\u2696\uFE0F",
    description: "Check whether total debits equal total credits and see the difference instantly.",
    category: "Bookkeeping Checks",
    bestFor: "Checking ledger balances before preparing financial statements.",
    href: "/tools/trial-balance-calculator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "accounting-equation-calculator",
    name: "Accounting Equation Calculator",
    emoji: "\u{1F9E9}",
    description: "Review assets, liabilities, and equity using the basic accounting equation.",
    category: "Accounting Basics",
    bestFor: "Understanding how assets, liabilities, and equity relate.",
    href: "/tools/accounting-equation-calculator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "debit-credit-checker",
    name: "Debit/Credit Checker",
    emoji: "\u{1F501}",
    description: "Practice whether common account changes should be recorded as debits or credits.",
    category: "Accounting Basics",
    bestFor: "Learning normal balances and basic journal entry direction.",
    href: "/tools/debit-credit-checker",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "financial-ratio-calculator",
    name: "Financial Ratio Calculator",
    emoji: "\u{1F4CA}",
    description: "Calculate beginner-friendly liquidity, profitability, and solvency ratios.",
    category: "Financial Analysis",
    bestFor: "Reviewing financial statement performance and position.",
    href: "/tools/financial-ratio-calculator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "depreciation-calculator",
    name: "Depreciation Calculator",
    emoji: "\u{1F4C9}",
    description: "Calculate straight-line depreciation from cost, salvage value, and useful life.",
    category: "Depreciation & Adjustments",
    bestFor: "Understanding asset cost allocation over time.",
    href: "/tools/depreciation-calculator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "break-even-calculator",
    name: "Break-even Calculator",
    emoji: "\u{1F3AF}",
    description:
      "Calculate contribution margin, break-even units, and break-even sales for a simple business scenario.",
    category: "Business Planning",
    bestFor: "Estimating how many units a business needs to sell to cover costs.",
    href: "/tools/break-even-calculator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "cash-flow-calculator",
    name: "Cash Flow Calculator",
    emoji: "\u{1F4B5}",
    description:
      "Calculate net cash flow and ending cash balance from cash inflows and outflows.",
    category: "Business Planning",
    bestFor: "Reviewing whether cash increased or decreased during a period.",
    href: "/tools/cash-flow-calculator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    emoji: "\u{1F4C4}",
    description:
      "Create a simple PDF invoice with business details, customer details, line items, optional SST/tax, and totals.",
    category: "Business Documents",
    bestFor: "Preparing downloadable PDF invoices for freelancers and small businesses.",
    href: "/tools/invoice-generator",
    status: "mvp",
    lastModified: "2026-07-18"
  },
  {
    slug: "sst-calculator-malaysia",
    name: "SST Calculator Malaysia",
    emoji: "\u{1F9FE}",
    description:
      "Estimate Malaysian SST amount, total including SST, or amount before SST using a selected rate.",
    category: "Malaysia Tax Tools",
    bestFor: "Learning how to add or remove SST from a simple amount.",
    href: "/tools/sst-calculator-malaysia",
    status: "mvp",
    lastModified: "2026-07-28"
  },
  {
    slug: "journal-entry-checker",
    name: "Journal Entry Checker",
    emoji: "\u{1F9EE}",
    description:
      "Total debits and credits to check whether a basic journal entry balances.",
    category: "Accounting Basics",
    bestFor: "Checking the math balance of debit and credit lines.",
    href: "/tools/journal-entry-checker",
    status: "mvp",
    lastModified: "2026-07-18"
  }
];

export type ToolLink = {
  href: string;
  label: string;
};

/**
 * Single source of truth for tool links in navigation and learning paths, so
 * renaming a tool updates every surface at once. Throws if the slug is unknown.
 */
export function toolLink(slug: string): ToolLink {
  const tool = tools.find((item) => item.slug === slug);

  if (!tool) {
    throw new Error(`toolLink: no tool with slug "${slug}"`);
  }

  return { href: tool.href, label: tool.name };
}
