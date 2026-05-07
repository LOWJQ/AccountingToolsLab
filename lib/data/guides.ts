export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: "available" | "coming-soon";
  href: string;
};

export const guides: Guide[] = [
  {
    slug: "debit-vs-credit",
    title: "Debit vs Credit",
    description:
      "Learn debit and credit rules, normal balances, beginner examples, and how to know whether to debit or credit an account.",
    category: "Accounting Basics",
    status: "available",
    href: "/guides/debit-vs-credit"
  },
  {
    slug: "journal-entries-for-beginners",
    title: "Journal Entries for Beginners",
    description:
      "Learn how journal entries work with simple debit and credit examples, common mistakes, and a step-by-step beginner checklist.",
    category: "Accounting Basics",
    status: "available",
    href: "/guides/journal-entries-for-beginners"
  },
  {
    slug: "trial-balance-explained",
    title: "Trial Balance Explained",
    description:
      "Learn what a trial balance is, how to prepare one, the trial balance format, examples, common errors, and why total debits should equal total credits.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/trial-balance-explained"
  },
  {
    slug: "why-trial-balance-not-balancing",
    title: "Why Is My Trial Balance Not Balancing?",
    description:
      "Learn common reasons a trial balance does not balance, how to use the difference amount, and how to check debit and credit errors step by step.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/why-trial-balance-not-balancing"
  },
  {
    slug: "financial-ratios-for-beginners",
    title: "Financial Ratios for Beginners",
    description:
      "Learn basic financial ratio formulas, examples, and what ratios like current ratio, debt-to-equity, profit margin, and return on assets mean.",
    category: "Financial Analysis",
    status: "available",
    href: "/guides/financial-ratios-for-beginners"
  },
  {
    slug: "cash-flow-vs-profit",
    title: "Cash Flow vs Profit",
    description:
      "Learn the difference between cash flow and profit, why profitable businesses can run out of cash, and how to check simple cash movement.",
    category: "Business Planning",
    status: "available",
    href: "/guides/cash-flow-vs-profit"
  },
  {
    slug: "break-even-point-explained",
    title: "Break-even Point Explained",
    description:
      "Learn what break-even point means, how to calculate break-even units and sales, contribution margin, examples, and common beginner mistakes.",
    category: "Business Planning",
    status: "available",
    href: "/guides/break-even-point-explained"
  },
  {
    slug: "straight-line-depreciation-explained",
    title: "Straight-Line Depreciation Explained",
    description:
      "Learn straight-line depreciation with the formula, examples, salvage value, useful life, annual depreciation expense, and common beginner mistakes.",
    category: "Depreciation & Adjustments",
    status: "available",
    href: "/guides/straight-line-depreciation-explained"
  },
  {
    slug: "how-to-create-a-simple-invoice",
    title: "How to Create a Simple Invoice",
    description:
      "Learn what a simple invoice should include, invoice number, invoice date, due date, line items, totals, and common beginner mistakes.",
    category: "Business Documents",
    status: "available",
    href: "/guides/how-to-create-a-simple-invoice"
  },
  {
    slug: "sst-calculator-malaysia-add-remove-sst",
    title: "SST Calculator Malaysia: Add or Remove SST",
    description:
      "Learn how to add or remove SST in Malaysia with formulas, examples, SST amount, total including SST, amount before SST, and common mistakes.",
    category: "Malaysia Tax Basics",
    status: "available",
    href: "/guides/sst-calculator-malaysia-add-remove-sst"
  }
];
