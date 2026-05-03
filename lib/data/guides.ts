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
      "Understand how debit and credit work, which accounts increase with debit, and which accounts increase with credit.",
    category: "Accounting Basics",
    status: "coming-soon",
    href: "/guides/debit-vs-credit"
  },
  {
    slug: "trial-balance-explained",
    title: "Trial Balance Explained",
    description:
      "Learn what a trial balance is, why total debits and total credits should match, and what an unbalanced trial balance means.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/trial-balance-explained"
  },
  {
    slug: "financial-ratios-for-beginners",
    title: "Financial Ratios for Beginners",
    description:
      "Learn basic financial ratios such as current ratio, profit margin, and debt-to-equity ratio in beginner-friendly language.",
    category: "Financial Analysis",
    status: "coming-soon",
    href: "/guides/financial-ratios-for-beginners"
  }
];
