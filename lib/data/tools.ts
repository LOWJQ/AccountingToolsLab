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
    status: "mvp"
  },
  {
    slug: "depreciation-calculator",
    name: "Depreciation Calculator",
    description: "Calculate straight-line depreciation from cost, salvage value, and useful life.",
    category: "Depreciation & Adjustments",
    bestFor: "Understanding asset cost allocation over time.",
    href: "/tools/depreciation-calculator",
    status: "mvp"
  },
  {
    slug: "break-even-calculator",
    name: "Break-even Calculator",
    description:
      "Calculate contribution margin, break-even units, and break-even sales for a simple business scenario.",
    category: "Business Planning",
    bestFor: "Estimating how many units a business needs to sell to cover costs.",
    href: "/tools/break-even-calculator",
    status: "mvp"
  },
  {
    slug: "cash-flow-calculator",
    name: "Cash Flow Calculator",
    description:
      "Calculate net cash flow and ending cash balance from cash inflows and outflows.",
    category: "Business Planning",
    bestFor: "Reviewing whether cash increased or decreased during a period.",
    href: "/tools/cash-flow-calculator",
    status: "mvp"
  }
];
