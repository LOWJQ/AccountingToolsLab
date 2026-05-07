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
    slug: "trial-balance-explained",
    title: "Trial Balance Explained",
    description:
      "Learn what a trial balance is, how to prepare one, the trial balance format, examples, common errors, and why total debits should equal total credits.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/trial-balance-explained"
  },
  {
    slug: "financial-ratios-for-beginners",
    title: "Financial Ratios for Beginners",
    description:
      "Learn basic financial ratio formulas, examples, and what ratios like current ratio, debt-to-equity, profit margin, and return on assets mean.",
    category: "Financial Analysis",
    status: "available",
    href: "/guides/financial-ratios-for-beginners"
  }
];
