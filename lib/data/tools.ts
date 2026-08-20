import type { Tool } from "@/types/tool";

/**
 * Single source of truth for every tool surface: the tools directory, the
 * header mega-menu, the footer, the ItemList schema on /tools, and the
 * sitemap. Order here is the order shown everywhere, flagship tools first.
 */
export const tools: Tool[] = [
  {
    slug: "invoice-generator",
    name: "PDF Invoice Generator Malaysia",
    menuTitle: "Invoice Generator",
    description:
      "Create simple PDF invoices with business details, customer details, line items, optional SST/tax, discounts, and totals.",
    menuDescription: "Create professional invoices with MYR, SST, and PDF export.",
    href: "/tools/invoice-generator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "receipt-generator",
    name: "Free Receipt Generator",
    menuTitle: "Receipt Generator",
    description:
      "Create a payment receipt PDF recording who paid, what for, the payment method, and the total, with optional tax.",
    menuDescription: "Make a payment receipt PDF in your browser.",
    href: "/tools/receipt-generator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "sst-calculator-malaysia",
    name: "SST Calculator Malaysia",
    description:
      "Estimate Malaysian SST amount, total including SST, or amount before SST using a selected rate.",
    menuDescription: "Calculate SST-inclusive and SST-exclusive prices.",
    href: "/tools/sst-calculator-malaysia",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "e-invoice-checker-malaysia",
    name: "e-Invoice Checker Malaysia",
    menuTitle: "e-Invoice Checker",
    description:
      "Check whether your business must issue LHDN e-Invoices, which implementation phase you fall into, and the date it becomes mandatory.",
    menuDescription: "Check if LHDN e-Invoice applies to your business.",
    href: "/tools/e-invoice-checker-malaysia",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "e-invoice-code-lookup-malaysia",
    name: "e-Invoice Code Lookup Malaysia",
    menuTitle: "e-Invoice Code Lookup",
    description:
      "Search LHDN e-Invoice codes by keyword or number, covering MSIC business activity codes and line item classification codes.",
    menuDescription: "Find MSIC and e-Invoice classification codes.",
    href: "/tools/e-invoice-code-lookup-malaysia",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "cash-flow-calculator",
    name: "Cash Flow Calculator",
    description:
      "Calculate net cash flow and ending cash balance from cash inflows and outflows.",
    menuDescription: "Review cash inflows, outflows, and net cash flow.",
    href: "/tools/cash-flow-calculator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "break-even-calculator",
    name: "Break-even Calculator",
    description:
      "Calculate contribution margin, break-even units, and break-even sales for a simple business scenario.",
    menuDescription: "Find the sales needed to cover your costs.",
    href: "/tools/break-even-calculator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "financial-ratio-calculator",
    name: "Financial Ratio Calculator",
    description: "Calculate beginner-friendly liquidity, profitability, and solvency ratios.",
    menuDescription: "Calculate useful business and accounting ratios.",
    href: "/tools/financial-ratio-calculator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "depreciation-calculator",
    name: "Depreciation Calculator",
    description:
      "Calculate straight-line depreciation from cost, salvage value, and useful life.",
    menuDescription: "Estimate depreciation using common methods.",
    href: "/tools/depreciation-calculator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "trial-balance-calculator",
    name: "Trial Balance Calculator",
    description:
      "Check whether total debits equal total credits and see the difference instantly.",
    menuDescription: "Check debit and credit totals easily.",
    href: "/tools/trial-balance-calculator",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "journal-entry-checker",
    name: "Journal Entry Checker",
    description: "Total debits and credits to check whether a basic journal entry balances.",
    menuDescription: "Review simple journal entry logic.",
    href: "/tools/journal-entry-checker",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "debit-credit-checker",
    name: "Debit/Credit Checker",
    description:
      "Practice whether common account changes should be recorded as debits or credits.",
    menuDescription: "Learn whether an account should be debited or credited.",
    href: "/tools/debit-credit-checker",
    status: "mvp",
    lastModified: "2026-08-19"
  },
  {
    slug: "accounting-equation-calculator",
    name: "Accounting Equation Calculator",
    description: "Review assets, liabilities, and equity using the basic accounting equation.",
    menuDescription: "Check assets, liabilities, and equity.",
    href: "/tools/accounting-equation-calculator",
    status: "mvp",
    lastModified: "2026-08-19"
  }
];

/**
 * Tools that are actually shipped. Every public surface renders this list, so
 * the directory, the nav, and the ItemList schema always agree on what exists.
 */
export const availableTools: Tool[] = tools.filter((tool) => tool.status === "mvp");

/** How many tools the header menu lists before deferring to "View all tools". */
export const NAV_TOOL_LIMIT = 12;

/**
 * Tools shown in the header menu. The menu is a shortcut to the most-used
 * tools, not a full index, so anything past the limit stays one click away
 * behind "View all tools" rather than growing the panel until it scrolls.
 *
 * Reordering the array above is what changes the menu, so there is no second
 * list to keep in step.
 */
export const navTools: Tool[] = availableTools.slice(0, NAV_TOOL_LIMIT);

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

  return { href: tool.href, label: tool.menuTitle ?? tool.name };
}
