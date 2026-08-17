export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** Short label for nav menus, where the full SEO title wraps and breaks the layout. */
  menuTitle?: string;
  menuDescription: string;
  category: string;
  status: "available" | "coming-soon";
  /** Draft guides: reachable and linked, but kept out of the sitemap and search index. */
  noindex?: boolean;
  href: string;
  /** ISO date (YYYY-MM-DD) the guide first went live. Feeds Article schema. */
  datePublished: string;
  /**
   * ISO date (YYYY-MM-DD) of the last meaningful content change. Feeds both the
   * sitemap lastmod and the Article dateModified, so the two cannot disagree.
   */
  lastModified: string;
};

export const guides: Guide[] = [
  {
    slug: "what-should-an-invoice-include-before-you-send-it",
    // Matches the page's h1 so the Article headline, the directory card, and
    // the related-guide cards all show the same title as the page itself.
    title: "What Should an Invoice Include Before You Send It?",
    description:
      "Learn what to include before sending an invoice, including business details, customer details, invoice number, dates, line items, totals, payment details, and tax notes.",
    menuTitle: "What to Put on an Invoice",
    menuDescription: "Check what to include before sending an invoice.",
    category: "Business Documents",
    status: "available",
    href: "/guides/what-should-an-invoice-include-before-you-send-it",
    datePublished: "2026-05-08",
    lastModified: "2026-07-28"
  },
  {
    slug: "do-i-need-to-register-for-sst-malaysia",
    title: "Do I Need to Register for SST in Malaysia?",
    description:
      "Identify whether your business provides taxable goods or services, find the relevant threshold, and test your taxable turnover over 12 months.",
    menuTitle: "Do I Need to Register for SST?",
    menuDescription: "Check whether your business may need SST registration.",
    category: "Malaysia Business Tax",
    status: "available",
    href: "/guides/do-i-need-to-register-for-sst-malaysia",
    datePublished: "2026-07-24",
    lastModified: "2026-07-28"
  },
  {
    slug: "errors-not-revealed-by-a-trial-balance",
    title: "Balanced Trial Balance: 5 Errors It Will Not Catch",
    description:
      "A balanced trial balance only proves debits equal credits. Learn the five errors it cannot detect and the checks that find them.",
    menuTitle: "Errors a Trial Balance Hides",
    menuDescription: "Learn the five errors a balanced trial balance hides.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/errors-not-revealed-by-a-trial-balance",
    datePublished: "2026-08-17",
    lastModified: "2026-08-17"
  },
  {
    slug: "profitable-but-no-cash",
    title: "Why Is My Business Profitable but I Have No Cash?",
    description:
      "Profit is not cash. Learn the six gaps that drain the bank while profit still looks healthy, and how to close them.",
    menuTitle: "Profitable but No Cash?",
    menuDescription: "Find out where the cash went when profit looks fine.",
    category: "Business Planning",
    status: "available",
    href: "/guides/profitable-but-no-cash",
    datePublished: "2026-08-17",
    lastModified: "2026-08-17"
  },
  {
    slug: "fixed-vs-variable-costs",
    title: "Which Costs Are Fixed and Which Are Variable?",
    description:
      "Sort any cost with one question, split mixed bills correctly, and get a break-even number that is not quietly too optimistic.",
    menuTitle: "Fixed vs Variable Costs",
    menuDescription: "Sort fixed, variable, and mixed costs the right way.",
    category: "Business Planning",
    status: "available",
    href: "/guides/fixed-vs-variable-costs",
    datePublished: "2026-08-17",
    lastModified: "2026-08-17"
  },
  {
    slug: "why-trial-balance-not-balancing",
    title: "Why Is My Trial Balance Not Balancing?",
    description:
      "Use the size of the difference to find the error: re-add the columns, divide by 2, divide by 9, then search the ledger in a fixed order.",
    menuTitle: "Trial Balance Not Balancing?",
    menuDescription: "Use the difference to track down the error fast.",
    category: "Bookkeeping Checks",
    status: "available",
    href: "/guides/why-trial-balance-not-balancing",
    datePublished: "2026-08-17",
    lastModified: "2026-08-17"
  },
  {
    slug: "debit-vs-credit",
    title: "Debit or Credit? Why Your Bank Says the Opposite",
    description:
      "Debit means left and credit means right. Learn why your bank statement shows the opposite, and which side each account type uses.",
    menuTitle: "Debit or Credit?",
    menuDescription: "Learn which side to use and why banks say the opposite.",
    category: "Accounting Basics",
    status: "available",
    href: "/guides/debit-vs-credit",
    datePublished: "2026-08-17",
    lastModified: "2026-08-17"
  },
  {
    slug: "what-is-a-good-financial-ratio",
    title: "Is My Current Ratio Good? How to Judge Any Ratio",
    description:
      "A ratio on its own means little. Learn what counts as good, why a high number can be bad, and how to judge any ratio using trend and context.",
    menuTitle: "Is My Current Ratio Good?",
    menuDescription: "Turn a ratio into something you can actually act on.",
    category: "Financial Analysis",
    status: "available",
    href: "/guides/what-is-a-good-financial-ratio",
    datePublished: "2026-08-18",
    lastModified: "2026-08-18"
  },
  {
    slug: "straight-line-depreciation-explained",
    title: "Straight-Line Depreciation: The Two Numbers You Guess",
    description:
      "Cost is a fact, useful life and salvage value are estimates. Learn how to set both, and why LHDN will not accept your depreciation figure.",
    menuTitle: "Straight-Line Depreciation",
    menuDescription: "Set the two estimates behind every depreciation figure.",
    category: "Depreciation & Adjustments",
    status: "available",
    href: "/guides/straight-line-depreciation-explained",
    datePublished: "2026-08-18",
    lastModified: "2026-08-18"
  },
  {
    slug: "journal-entries-for-beginners",
    title: "Journal Entries: How to Know Which Accounts to Use",
    description:
      "The hard part is picking the accounts, not the sides. Learn a four-question method and when to use prepaid, accrued, and unearned accounts.",
    menuTitle: "Journal Entries",
    menuDescription: "Turn a sentence into the right two account names.",
    category: "Accounting Basics",
    status: "available",
    href: "/guides/journal-entries-for-beginners",
    datePublished: "2026-08-18",
    lastModified: "2026-08-18"
  }
];

/**
 * Guides that are live and belong in the search index. Feeds both the sitemap
 * and the /guides ItemList, so the two always list the same set. Draft guides
 * (noindex) stay linked on the directory page but out of both.
 */
export const indexableGuides: Guide[] = guides.filter(
  (guide) => guide.status === "available" && !guide.noindex
);

function requireGuide(slug: string, caller: string): Guide {
  const guide = guides.find((item) => item.slug === slug);

  if (!guide) {
    throw new Error(`${caller}: no guide with slug "${slug}"`);
  }

  return guide;
}

/**
 * Look up a guide record by slug. Used by metadata and Article schema helpers
 * so headline, canonical path, and both dates all come from one place.
 * Throws at build time if the slug does not exist.
 */
export function guideBySlug(slug: string): Guide {
  return requireGuide(slug, "guideBySlug");
}

export type GuideCard = {
  description: string;
  href: string;
  title: string;
};

/**
 * Content for a "Related Guide" card. Tool pages used to hardcode these, which
 * left three of them advertising titles of guides that had since been renamed
 * and redirected away. Reading from the guide record keeps card text, page
 * title, and link target in agreement. Throws if the slug does not exist.
 */
export function guideCard(slug: string): GuideCard {
  const guide = requireGuide(slug, "guideCard");

  return {
    description: guide.description,
    href: guide.href,
    title: guide.title
  };
}

export type GuideLink = {
  href: string;
  label: string;
};

/**
 * Single source of truth for guide links in navigation, sidebars, and learning
 * paths. Use this instead of hardcoding a label, so renaming a guide updates
 * every surface at once. Throws at build time if the slug does not exist.
 */
export function guideLink(slug: string): GuideLink {
  const guide = requireGuide(slug, "guideLink");

  return { href: guide.href, label: guide.menuTitle ?? guide.title };
}
