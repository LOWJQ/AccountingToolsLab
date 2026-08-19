import Link from "next/link";
import { GuideMeta } from "@/components/guides/GuideMeta";
import { GuideSources } from "@/components/guides/GuideSources";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createGuideMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Is My Current Ratio Good? How to Judge Any Ratio";
const guidePath = "/guides/what-is-a-good-financial-ratio";
const pageDescription =
  "Calculating a ratio is the easy part. A single number tells you almost nothing on its own, and this is the method that turns it into something you can actually act on.";

export const metadata = createGuideMetadata({
  slug: "what-is-a-good-financial-ratio",
  title: pageTitle,
  description:
    "A ratio on its own means little. Learn what counts as a good current ratio, why a high number can be bad, and how to judge any ratio using trend and context."
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Why one number tells you little", href: "#one-number" },
  { label: "Key terms", href: "#key-terms" },
  { label: "The five ratios", href: "#five-ratios" },
  { label: "When a high ratio is bad", href: "#too-high" },
  { label: "Worked example", href: "#example" },
  { label: "How to judge any ratio", href: "#how-to-judge" },
  { label: "Review checklist", href: "#checklist" },
  { label: "Sources", href: "#sources" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Liquidity",
    meaning:
      "Whether the business can meet its short-term obligations as they fall due. The current ratio is the usual starting measure."
  },
  {
    term: "Solvency",
    meaning:
      "Whether the business can meet its obligations over the long term. Debt-to-equity is the common measure of how much it relies on borrowing."
  },
  {
    term: "Profitability",
    meaning:
      "Whether the business earns enough from what it sells. Gross margin, net margin, and return on assets each look at this differently."
  },
  {
    term: "Benchmark",
    meaning:
      "A reference point you compare against, such as an industry average or your own figure from last year. Without one, a ratio is just a number."
  },
  {
    term: "Trend",
    meaning:
      "The direction a ratio moves across several periods. The direction is usually more informative than the level at any single date."
  },
  {
    term: "Snapshot ratio",
    meaning:
      "A ratio built from balance sheet figures, which describe one moment in time. It can be flattered or distorted by what happened the week before."
  },
  {
    term: "Working capital",
    meaning:
      "Current assets minus current liabilities. It expresses the same idea as the current ratio but as an amount rather than a proportion."
  }
] as const;

const ratioTable = [
  [
    "Current Ratio",
    "Current Assets / Current Liabilities",
    "Balance sheet",
    "Below 1.0 is a warning sign"
  ],
  [
    "Debt-to-Equity",
    "Total Liabilities / Total Equity",
    "Balance sheet",
    "No universal target, varies hugely"
  ],
  [
    "Gross Profit Margin",
    "(Gross Profit / Revenue) x 100",
    "Income statement",
    "Only meaningful against your industry"
  ],
  [
    "Net Profit Margin",
    "(Net Income / Revenue) x 100",
    "Income statement",
    "Only meaningful against your industry"
  ],
  [
    "Return on Assets",
    "(Net Income / Total Assets) x 100",
    "Both statements",
    "Only meaningful against your industry"
  ]
] as const;

const ratioDetails = [
  {
    id: "current-ratio",
    name: "Current Ratio",
    question: "Can the business cover what it owes in the next twelve months?",
    reading:
      "A result of 1.80 means RM 1.80 of current assets for every RM 1.00 of current liabilities. Below 1.00 means short-term obligations exceed short-term assets, which is the one genuinely widely accepted warning sign in this list. A range of roughly 1.5 to 2.0 is often described as comfortable.",
    caution:
      "The number counts stock and unpaid customer invoices as though they were cash. If your stock is slow-moving or your customers pay late, a healthy-looking ratio can still leave you unable to pay wages."
  },
  {
    id: "debt-to-equity",
    name: "Debt-to-Equity Ratio",
    question: "How much of the business is funded by borrowing rather than by the owners?",
    reading:
      "A result of 2.0 means RM 2.00 of liabilities for every RM 1.00 of equity. Higher means more reliance on debt, which raises both potential returns and risk. There is no universal target, because capital-intensive businesses normally carry far more debt than service businesses.",
    caution:
      "A very low figure is not automatically good. It can mean the business is not using affordable finance to grow, and is funding everything from retained profits instead."
  },
  {
    id: "gross-margin",
    name: "Gross Profit Margin",
    question: "How much is left from each sale after the direct cost of delivering it?",
    reading:
      "A result of 40 percent means 40 sen of every ringgit of revenue remains after direct costs. This is the ratio most directly under your control, because it responds to pricing and supplier terms.",
    caution:
      "Comparisons only work within an industry. A software business and a grocery retailer can both be healthy while their gross margins differ by fifty percentage points."
  },
  {
    id: "net-margin",
    name: "Net Profit Margin",
    question: "How much is left after every expense, not just the direct ones?",
    reading:
      "A result of 8 percent means 8 sen of every ringgit becomes profit. Comparing it against gross margin is the useful move, because a wide gap points at overheads rather than pricing.",
    caution:
      "Net margin includes non-cash items such as depreciation, so a fall in this ratio does not necessarily mean less money in the bank."
  },
  {
    id: "return-on-assets",
    name: "Return on Assets",
    question: "How efficiently is the business turning what it owns into profit?",
    reading:
      "A result of 10 percent means the business generated 10 sen of profit for every ringgit of assets. It is most useful for asset-heavy businesses, where the question of whether equipment earns its keep genuinely matters.",
    caution:
      "Older assets have been depreciated down, which shrinks the denominator and flatters the ratio. Two identical businesses can report very different figures purely because of asset age."
  }
] as const;

const judgingSteps = [
  "Check the direction first. Is the number above or below the level that would concern you at all?",
  "Compare it against your own figure for the last three or four periods, and look at the direction of travel.",
  "Compare it against businesses of a similar size in the same industry, never across industries.",
  "Look at what the number is made of. A current ratio propped up by slow stock is not the same as one backed by cash.",
  "Cross-check liquidity ratios against your actual bank balance and cash movement.",
  "Ask what changed. A ratio that moved sharply usually has one identifiable cause worth understanding.",
  "Recalculate after anything significant, such as a large loan, a big asset purchase, or a pricing change."
] as const;

const checklist = [
  "I know which financial statement each figure came from.",
  "I used figures from the same date or the same period throughout.",
  "I have the same ratio for at least three earlier periods.",
  "I compared against businesses in my own industry, not a general rule.",
  "I looked at what the current assets figure is actually made of.",
  "I checked whether a high ratio might mean idle resources.",
  "I cross-checked liquidity against the actual bank balance.",
  "I treated the ratio as a question to investigate, not a verdict."
] as const;

const guideSources = [
  {
    href: "https://www.ifrs.org/issued-standards/list-of-standards/ias-1-presentation-of-financial-statements/",
    label: "IAS 1 Presentation of Financial Statements",
    note: "The statements every ratio on this page is computed from, and the line items each one draws on. MASB adopts this in Malaysia as MFRS 101."
  }
];

const sidebarGuides = [
  guideLink("profitable-but-no-cash"),
  guideLink("fixed-vs-variable-costs"),
  guideLink("straight-line-depreciation-explained")
];

const faqs = [
  {
    question: "What is a good current ratio?",
    answer:
      "Below 1.0 is generally treated as a warning sign, because short-term obligations exceed short-term assets. A range of roughly 1.5 to 2.0 is commonly described as comfortable, and figures approaching 3.0 or higher can suggest cash sitting idle rather than being used. These are rules of thumb rather than targets, and they vary considerably by industry."
  },
  {
    question: "Where do I find the numbers for these ratios?",
    answer:
      "Current assets, current liabilities, total liabilities, total equity, and total assets come from the balance sheet, which describes one point in time. Revenue, gross profit, and net income come from the income statement, which covers a period. Always take both from the same reporting date or period so the comparison is valid."
  },
  {
    question: "What is the difference between gross profit margin and net profit margin?",
    answer:
      "Gross margin deducts only the direct costs of delivering what you sold, so it reflects pricing and supplier terms. Net margin deducts every expense including overheads, interest, and depreciation. The gap between the two tells you how much your fixed running costs consume, which is often more useful than either figure alone."
  },
  {
    question: "How often should I calculate financial ratios?",
    answer:
      "Quarterly is enough for most small businesses, because ratios are about trend rather than daily movement. Calculating them monthly is worthwhile if you are managing tight liquidity or have just made a significant change such as taking on debt."
  },
  {
    question: "Why is my ratio different from another business in the same industry?",
    answer:
      "Size, age, and structure all matter. A business that rents its premises will show very different asset figures from one that owns them, and older assets that have been depreciated down shrink the denominator in return on assets. Differences are a reason to ask what is different, not automatically a sign that something is wrong."
  },
  {
    question: "Does the Financial Ratio Calculator compare my result to an industry average?",
    answer:
      "No. It calculates the five ratios from the figures you enter and explains what each result means. Industry comparison is the part you have to supply, because the benchmark depends on your sector, your size, and the accounting choices behind the published averages."
  }
];

function SimpleTable({
  headers,
  rows
}: {
  headers: readonly string[];
  rows: ReadonlyArray<readonly string[]>;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-950">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3" key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-950">
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 align-top ${
                    index === 0 ? "font-semibold text-slate-950" : ""
                  }`}
                  key={`${row[0]}-${cell}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({
  children,
  id
}: {
  children: string;
  id: string;
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {children}
      </h2>
    </header>
  );
}

export default function WhatIsAGoodFinancialRatioGuidePage() {
  const pageUrl = `${siteConfig.url}${guidePath}`;

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: pageTitle, url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <ArticleJsonLd
        description={metadata.description as string}
        slug="what-is-a-good-financial-ratio"
      />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-950">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition hover:text-slate-900" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link className="transition hover:text-slate-900" href="/guides">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-slate-950">{pageTitle}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="min-w-0">
            <header>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {pageTitle}
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-950 sm:text-lg">
                {pageDescription}
              </p>
              <GuideMeta slug="what-is-a-good-financial-ratio" />
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">
                Quick answer: a ratio needs a reference point
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Only one of these five ratios has a widely accepted rule of thumb. A current ratio
                below 1.00 is a warning sign, because it means short-term obligations exceed
                short-term assets. Roughly 1.5 to 2.0 is often called comfortable.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                For everything else, there is no target number. A gross margin of 40 percent is
                excellent for a grocer and poor for a software business. What makes any ratio
                meaningful is comparing it against two things: your own figure from earlier
                periods, and businesses of a similar size in the same industry.
              </p>
              <SimpleTable
                headers={["Ratio", "Formula", "Numbers come from", "Rule of thumb"]}
                rows={ratioTable}
              />
            </section>

            <section className="mt-12">
              <SectionHeading id="one-number">
                Why one number on its own tells you little
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A ratio compresses two figures into one. That is what makes it useful and also what
                makes it easy to misread, because the compression throws away everything about how
                the two figures were made up.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Two businesses can report an identical current ratio of 1.80. In one, the current
                assets are mostly cash in the bank. In the other, they are mostly stock that has
                not moved for eight months. The ratio cannot tell them apart, and only one of those
                businesses can pay its bills next week.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Balance sheet ratios have a second weakness: they describe a single moment. A large
                customer payment received the day before your year end can lift the current ratio
                noticeably without anything about the business having changed.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Treat any ratio as a question worth investigating rather than a verdict.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms in plain English</SectionHeading>
              <dl className="mt-6 space-y-5 text-base leading-7 text-slate-950">
                {keyTerms.map((item) => (
                  <div key={item.term}>
                    <dt className="font-semibold">{item.term}</dt>
                    <dd className="mt-1">{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-12">
              <SectionHeading id="five-ratios">
                Reading each of the five ratios
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These are the five the calculator produces. For each one, the question it answers
                matters more than the formula.
              </p>
              <div className="mt-8 space-y-10">
                {ratioDetails.map((ratio) => (
                  <div className="scroll-mt-28" id={ratio.id} key={ratio.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {ratio.name}
                    </h3>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                        The question it answers
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-950">{ratio.question}</p>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-950">
                      <span className="font-semibold">How to read it. </span>
                      {ratio.reading}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">What it hides. </span>
                      {ratio.caution}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="too-high">
                When a high ratio is the bad news
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The instinct that higher is always better is wrong often enough to be worth
                naming.
              </p>
              <div className="mt-6 space-y-6 text-base leading-7 text-slate-950">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    A current ratio approaching 3.0 or above
                  </h3>
                  <p className="mt-2">
                    This can mean resources are sitting idle rather than being put to work. Large
                    cash balances earning nothing, or stock piling up faster than it sells, both
                    push the ratio up while making the business weaker.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    A very low debt-to-equity ratio
                  </h3>
                  <p className="mt-2">
                    Carrying almost no debt can mean the business is passing up affordable finance
                    and growing more slowly than it could. Low risk and low ambition look identical
                    in this ratio.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    A rising margin on falling revenue
                  </h3>
                  <p className="mt-2">
                    Dropping unprofitable lines lifts the margin while the business shrinks. The
                    percentage improves and the amount of profit falls, so always read margins
                    alongside the revenue figure.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="example">
                Worked example: is a current ratio of 1.80 good?
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A business has RM 90,000 of current assets and RM 50,000 of current liabilities,
                giving a current ratio of 1.80. Against the rule of thumb it looks comfortable. Now
                apply the method.
              </p>
              <SimpleTable
                headers={["Check", "Finding", "What it means"]}
                rows={[
                  ["Direction", "1.80, comfortably above 1.00", "No immediate warning"],
                  ["Trend", "2.90, then 2.40, now 1.80", "Falling steadily for three periods"],
                  [
                    "Composition",
                    "RM 55,000 of the RM 90,000 is unsold stock",
                    "Much of it is not readily available"
                  ],
                  ["Cash cross-check", "Bank balance falling each month", "Liquidity is tighter than the ratio suggests"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The level looked fine and the picture is not. Cash and receivables together are
                only RM 35,000 against RM 50,000 of current liabilities, and the trend has moved in
                one direction for three periods. A business reading only the 1.80 would have
                concluded there was nothing to look at.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                If profit looks healthy while cash does not, the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/guides/profitable-but-no-cash"
                >
                  guide on being profitable with no cash
                </Link>{" "}
                explains where the money went, and the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/cash-flow-calculator"
                >
                  cash flow calculator
                </Link>{" "}
                confirms the actual movement.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="how-to-judge">
                How to judge any ratio
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The same routine works for all five, and for any ratio you meet later.
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {judgingSteps.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                The second step is the one people skip, and it is the one that does most of the
                work. A single ratio is a data point; three or four in sequence is information.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Review checklist</SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide explains general financial analysis concepts for learning and review. It
                is not accounting, investment, or financial advice for a specific business. The
                ranges mentioned are common rules of thumb rather than standards.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Work out the five ratios
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Enter your figures to get the current ratio, debt-to-equity, both margins, and
                    return on assets, then bring each one back to the method above.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/accounting-equation-calculator"
                  >
                    Accounting Equation
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/financial-ratio-calculator"
                  >
                    Financial Ratio Calculator
                  </Link>
                </div>
              </div>
            </section>

            <GuideSources checkedOn="2026-08-19" sources={guideSources} />

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Financial Ratio FAQs"
            />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <GuideTableOfContents items={tableOfContents} />

              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                  Related guides
                </p>
                <div className="mt-4 grid gap-3">
                  {sidebarGuides.map((guide) => (
                    <Link
                      className="text-sm leading-6 text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                      href={guide.href}
                      key={guide.href}
                    >
                      {guide.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
