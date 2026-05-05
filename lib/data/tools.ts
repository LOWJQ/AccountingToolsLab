import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "trial-balance-calculator",
    name: "Trial Balance Calculator",
    description: "Check whether total debits equal total credits and see the difference instantly.",
    category: "Bookkeeping Checks",
    bestFor: "Checking ledger balances before preparing financial statements.",
    href: "/tools/trial-balance-calculator",
    status: "mvp"
  },
  {
    slug: "accounting-equation-calculator",
    name: "Accounting Equation Calculator",
    description: "Review assets, liabilities, and equity using the basic accounting equation.",
    category: "Accounting Basics",
    bestFor: "Understanding how assets, liabilities, and equity relate.",
    href: "/tools/accounting-equation-calculator",
    status: "mvp"
  },
  {
    slug: "debit-credit-checker",
    name: "Debit/Credit Checker",
    description: "Practice whether common account changes should be recorded as debits or credits.",
    category: "Accounting Basics",
    bestFor: "Learning normal balances and basic journal entry direction.",
    href: "/tools/debit-credit-checker",
    status: "mvp"
  },
  {
    slug: "financial-ratio-calculator",
    name: "Financial Ratio Calculator",
    description: "Calculate beginner-friendly liquidity, profitability, and solvency ratios.",
    category: "Financial Analysis",
    bestFor: "Reviewing financial statement performance and position.",
    href: "/tools/financial-ratio-calculator",
    status: "planned"
  },
  {
    slug: "depreciation-calculator",
    name: "Depreciation Calculator",
    description: "Estimate depreciation for simple fixed asset examples and adjustments.",
    category: "Depreciation & Adjustments",
    bestFor: "Understanding asset cost allocation over time.",
    href: "/tools/depreciation-calculator",
    status: "planned"
  }
];
