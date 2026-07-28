export type Guide = {
  slug: string;
  title: string;
  description: string;
  menuDescription: string;
  category: string;
  status: "available" | "coming-soon";
  href: string;
};

export const guides: Guide[] = [
  {
    slug: "what-should-an-invoice-include-before-you-send-it",
    title: "What Should an Invoice Include?",
    description:
      "Learn what to include before sending an invoice, including business details, customer details, invoice number, dates, line items, totals, payment details, and tax notes.",
    menuDescription: "Check what to include before sending an invoice.",
    category: "Business Documents",
    status: "available",
    href: "/guides/what-should-an-invoice-include-before-you-send-it"
  },
  {
    slug: "do-i-need-to-register-for-sst-malaysia",
    title: "Do I Need to Register for SST in Malaysia?",
    description:
      "Identify whether your business provides taxable goods or services, find the relevant threshold, and test your taxable turnover over 12 months.",
    menuDescription: "Check whether your business may need SST registration.",
    category: "Malaysia Business Tax",
    status: "available",
    href: "/guides/do-i-need-to-register-for-sst-malaysia"
  },
  {
    slug: "trial-balance-explained",
    title: "Trial Balance Explained",
    description:
      "Learn what a trial balance is, how to prepare one, the trial balance format, examples, common errors, and why total debits should equal total credits.",
    menuDescription: "Learn what a trial balance is and how to prepare one.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/trial-balance-explained"
  },
  {
    slug: "cash-flow-vs-profit",
    title: "Cash Flow vs Profit",
    description:
      "Learn the difference between cash flow and profit, why profitable businesses can run out of cash, and how to check simple cash movement.",
    menuDescription: "Learn the difference between cash flow and profit.",
    category: "Business Planning",
    status: "available",
    href: "/guides/cash-flow-vs-profit"
  },
  {
    slug: "break-even-point-explained",
    title: "Break-even Point Explained",
    description:
      "Learn what break-even point means, how to calculate break-even units and sales, contribution margin, examples, and common beginner mistakes.",
    menuDescription: "Learn what break-even point means and how it is calculated.",
    category: "Business Planning",
    status: "available",
    href: "/guides/break-even-point-explained"
  },
  {
    slug: "why-trial-balance-not-balancing",
    title: "Why Is My Trial Balance Not Balancing?",
    description:
      "Learn common reasons a trial balance does not balance, how to use the difference amount, and how to check debit and credit errors step by step.",
    menuDescription: "Learn common reasons a trial balance does not balance.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/why-trial-balance-not-balancing"
  },
  {
    slug: "debit-vs-credit",
    title: "Debit vs Credit",
    description:
      "Learn debit and credit rules, normal balances, beginner examples, and how to know whether to debit or credit an account.",
    menuDescription: "Learn debit and credit rules with simple beginner examples.",
    category: "Accounting Basics",
    status: "available",
    href: "/guides/debit-vs-credit"
  },
  {
    slug: "financial-ratios-for-beginners",
    title: "Financial Ratios for Beginners",
    description:
      "Learn basic financial ratio formulas, examples, and what ratios like current ratio, debt-to-equity, profit margin, and return on assets mean.",
    menuDescription: "Learn basic financial ratio formulas for simple business checks.",
    category: "Financial Analysis",
    status: "available",
    href: "/guides/financial-ratios-for-beginners"
  },
  {
    slug: "straight-line-depreciation-explained",
    title: "Straight-Line Depreciation Explained",
    description:
      "Learn straight-line depreciation with the formula, examples, salvage value, useful life, annual depreciation expense, and common beginner mistakes.",
    menuDescription: "Learn straight-line depreciation with the formula and examples.",
    category: "Depreciation & Adjustments",
    status: "available",
    href: "/guides/straight-line-depreciation-explained"
  },
  {
    slug: "journal-entries-for-beginners",
    title: "Journal Entries for Beginners",
    description:
      "Learn how journal entries work with simple debit and credit examples, common mistakes, and a step-by-step beginner checklist.",
    menuDescription: "Learn how journal entries work with simple debit and credit examples.",
    category: "Accounting Basics",
    status: "available",
    href: "/guides/journal-entries-for-beginners"
  }
];
