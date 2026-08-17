import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createGuideMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Why Is My Business Profitable but I Have No Cash?";
const guidePath = "/guides/profitable-but-no-cash";
const pageDescription =
  "Your profit and loss shows a healthy figure and the bank account does not agree. Six ordinary gaps explain almost every case, and none of them mean the accounts are wrong.";

export const metadata = createGuideMetadata({
  slug: "profitable-but-no-cash",
  title: pageTitle,
  description:
    "Profit is not cash. Six gaps drain the bank while profit still looks healthy: unpaid invoices, drawings, loan principal, assets, stock, depreciation."
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Why the two never match", href: "#why-different" },
  { label: "Key terms", href: "#key-terms" },
  { label: "The six gaps", href: "#six-gaps" },
  { label: "Worked example", href: "#example" },
  { label: "Which number to watch", href: "#which-to-watch" },
  { label: "How to close the gap", href: "#how-to-close" },
  { label: "Monthly checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Profit",
    meaning:
      "Income earned during a period minus the expenses incurred to earn it. It measures performance over a period of time, not the money available today."
  },
  {
    term: "Net cash flow",
    meaning:
      "Cash actually received during a period minus cash actually paid out. It measures movement of money, regardless of when the sale or expense was recorded."
  },
  {
    term: "Accrual basis",
    meaning:
      "Recording income when it is earned and expenses when they are incurred, even if no money has changed hands yet. Most business accounts are prepared this way."
  },
  {
    term: "Cash basis",
    meaning:
      "Recording income only when money is received and expenses only when money is paid. Simpler, but it does not show amounts owed to or by the business."
  },
  {
    term: "Trade receivables",
    meaning:
      "Money owed by customers for invoices already issued. The sale is in the profit figure, but the cash is still with the customer."
  },
  {
    term: "Drawings",
    meaning:
      "Money the owner takes out of the business for personal use. It reduces cash and equity, but it is not a business expense and never appears in profit."
  },
  {
    term: "Capital expenditure",
    meaning:
      "Money spent buying an asset the business will use for years, such as equipment or a vehicle. The full amount leaves the bank at once, but only the annual depreciation reaches profit."
  },
  {
    term: "Depreciation",
    meaning:
      "The portion of an asset's cost charged as an expense this period. It reduces profit but no money leaves the bank, which is why it is called a non-cash expense."
  }
] as const;

const gapTable = [
  ["Unpaid customer invoices", "Adds to profit", "No cash yet"],
  ["Owner drawings", "No effect on profit", "Cash leaves"],
  ["Loan principal repaid", "No effect on profit", "Cash leaves"],
  ["Equipment or vehicle bought", "Only depreciation reduces profit", "Full amount leaves"],
  ["Stock bought but unsold", "No effect on profit until sold", "Cash leaves"],
  ["Depreciation charged", "Reduces profit", "No cash leaves"]
] as const;

const detailedGaps = [
  {
    id: "unpaid-invoices",
    name: "1. Invoices you have issued but not been paid for",
    summary: "The sale counts towards profit the day you invoice, not the day you get paid.",
    example:
      "You complete a RM 18,000 job on 2 March and invoice immediately on 30-day terms. March profit includes the full RM 18,000. The bank sees nothing until April at the earliest.",
    why: "Under the accrual basis, income is recognised when it is earned. If your customers are slow, you can invoice a record month and still be unable to pay wages. This is the single most common cause, and it gets worse the faster you grow.",
    fix: "Invoice the same day the work finishes, state the due date clearly, and chase overdue accounts on a schedule rather than when you notice."
  },
  {
    id: "drawings",
    name: "2. Money you took out for yourself",
    summary: "Owner drawings reduce the bank balance but are not a business expense.",
    example:
      "You transfer RM 6,000 to your personal account during the month. Cash falls by RM 6,000 and profit does not move at all.",
    why: "Drawings are a withdrawal of your own equity, not a cost of running the business, so they never appear on the profit and loss. Owners often forget this and assume the profit figure is already net of what they took.",
    fix: "Track drawings separately every month and compare them against profit. If drawings routinely exceed profit, the business is shrinking even while it looks profitable."
  },
  {
    id: "loan-principal",
    name: "3. The capital portion of your loan repayments",
    summary: "Only the interest part of a repayment is an expense.",
    example:
      "A monthly instalment of RM 3,000 is made up of RM 2,500 principal and RM 500 interest. Profit is reduced by RM 500. The bank balance falls by RM 3,000.",
    why: "Repaying principal settles a liability rather than consuming a resource, so it belongs on the balance sheet, not the profit and loss. On a large loan this quietly removes a great deal of cash that profit never accounts for.",
    fix: "Split every instalment into principal and interest using the loan schedule, and treat the principal as a fixed monthly cash commitment."
  },
  {
    id: "asset-purchases",
    name: "4. Equipment and vehicles you paid for outright",
    summary: "The whole cost leaves the bank now, but profit is only charged a slice each year.",
    example:
      "You buy a RM 8,000 machine with a five-year life. Cash falls by RM 8,000 this month. Profit for the whole year is reduced by roughly RM 1,600 of depreciation.",
    why: "Capital expenditure is spread across the years the asset is used. The mismatch is deliberate and correct, but it means a heavy investment month can wipe out your cash while barely denting profit.",
    fix: "Plan asset purchases against a cash forecast rather than a profit figure. Check the annual charge with the depreciation calculator before committing."
  },
  {
    id: "stock",
    name: "5. Stock sitting on the shelf",
    summary: "Buying stock costs cash immediately, but only affects profit when it sells.",
    example:
      "You spend RM 3,000 restocking in March and sell none of it until April. March cash falls by RM 3,000 while March profit is untouched.",
    why: "The cost of goods only reaches the profit and loss when the matching sale is recorded. A business that keeps increasing stock levels ties up more and more cash without the profit figure ever showing it.",
    fix: "Watch the trend in stock value month to month. Rising stock alongside flat sales is cash quietly leaving the bank."
  },
  {
    id: "depreciation",
    name: "6. Depreciation, which works the other way",
    summary: "An expense that reduces profit without any money leaving the bank.",
    example:
      "The RM 1,500 depreciation charged this month lowers profit by RM 1,500. No payment is made to anyone.",
    why: "Depreciation is the only item on this list that makes profit look worse than cash rather than better. When reconciling profit to cash you add it back, because the cash went out when the asset was bought.",
    fix: "Add depreciation back first when working out why profit and cash differ. It usually explains part of the gap in your favour."
  }
] as const;

const closingActions = [
  "Invoice on the day work is completed rather than at month end.",
  "Agree payment terms in writing before starting, and state the due date on the invoice.",
  "Review overdue invoices weekly and follow up on a fixed schedule.",
  "Ask for a deposit on larger jobs so the work is part-funded before it starts.",
  "Negotiate supplier terms so money goes out later than it comes in.",
  "Keep drawings below profit so the business retains something each month.",
  "Forecast cash for the next three months, including loan principal and tax.",
  "Hold a cash buffer for at least one month of fixed costs."
] as const;

const checklist = [
  "I compared this month's profit with the actual movement in the bank balance.",
  "I listed invoices issued but not yet collected.",
  "I recorded how much I took out as drawings.",
  "I separated loan repayments into principal and interest.",
  "I noted any equipment or vehicles paid for during the month.",
  "I checked whether stock levels rose or fell.",
  "I added depreciation back when reconciling profit to cash.",
  "I forecast cash for the next three months, not just this one."
] as const;

const sidebarGuides = [
  guideLink("what-should-an-invoice-include-before-you-send-it"),
  guideLink("straight-line-depreciation-explained"),
  guideLink("fixed-vs-variable-costs")
];

const faqs = [
  {
    question: "Can a profitable business really run out of cash?",
    answer:
      "Yes, and it is common. Profit measures income earned against expenses incurred over a period. Cash measures money actually received and paid. Unpaid invoices, owner drawings, loan principal, asset purchases, and rising stock all take cash without reducing profit, so a business can report a strong profit and still be unable to pay its bills."
  },
  {
    question: "Can a business be unprofitable but still have plenty of cash?",
    answer:
      "Yes. Collecting a large overdue invoice, taking out a loan, selling an asset, or running down stock all bring cash in without creating profit. A healthy bank balance in a loss-making month is usually a timing effect rather than a sign the business has recovered."
  },
  {
    question: "What is free cash flow?",
    answer:
      "Free cash flow is the cash left from operations after paying for the assets needed to keep the business running. It is a stricter measure than net cash flow because it assumes equipment must eventually be replaced, so it is often used to judge how much cash the business genuinely generates."
  },
  {
    question: "How often should a small business review cash flow?",
    answer:
      "Monthly is the minimum for most small businesses. Weekly is more useful if customers pay slowly, if income is seasonal, or if the cash buffer is less than one month of fixed costs. The review matters more than the frequency, as long as it is regular."
  },
  {
    question: "Does this cash flow calculator use profit or actual cash?",
    answer:
      "Actual cash. The calculator takes your beginning cash balance, adds the cash you genuinely received, and subtracts the cash you genuinely paid out, including items such as drawings and loan principal that never appear in profit. That is why its result can differ sharply from your profit figure."
  },
  {
    question: "Is a cash flow forecast the same as a profit forecast?",
    answer:
      "No. A profit forecast estimates income and expenses for a period. A cash flow forecast estimates when money will actually arrive and leave, so it includes collection delays, loan principal, asset purchases, and drawings. A business can pass a profit forecast and still fail a cash forecast in the same month."
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

export default function ProfitableButNoCashGuidePage() {
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
        slug="profitable-but-no-cash"
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
              <p className="mt-5 text-sm text-slate-950">
                Updated on 17 August 2026 <span aria-hidden="true">-</span> 10 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">
                Quick answer: profit and cash answer different questions
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Profit answers &quot;did the business earn more than it spent over this
                period?&quot;. Cash answers &quot;how much money is available right now?&quot;.
                They are both correct and they are rarely the same number.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Six ordinary things move one figure without moving the other. Nothing below means
                your accounts are wrong.
              </p>
              <SimpleTable
                headers={["What happened", "Effect on profit", "Effect on cash"]}
                rows={gapTable}
              />
            </section>

            <section className="mt-12">
              <SectionHeading id="why-different">
                Why the two numbers never match
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Most business accounts are prepared on the accrual basis. Income is recorded when
                it is earned and expenses are recorded when they are incurred, regardless of when
                money changes hands. That is what makes profit a fair measure of performance:
                a sale made in March belongs in March, even if payment lands in May.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The trade-off is that profit stops describing your bank account. Two separate
                distortions appear at once:
              </p>
              <div className="mt-6 space-y-6 text-base leading-7 text-slate-950">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Timing differences</h3>
                  <p className="mt-2">
                    The same transaction hits profit and cash in different months. An invoice
                    raised in March and paid in May counts as March income and May cash.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Items that only ever touch one side
                  </h3>
                  <p className="mt-2">
                    Drawings, loan principal, and asset purchases move cash but never appear in
                    profit. Depreciation reduces profit but never moves cash. These are not timing
                    differences; they never catch up.
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                A business can therefore be profitable and insolvent at the same time. Profit does
                not pay wages; cash does.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms in plain English</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These terms come up whenever profit and cash are compared.
              </p>
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
              <SectionHeading id="six-gaps">
                The six gaps between profit and your bank balance
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Work through these in order. In most small businesses the first three account for
                nearly all of the missing money.
              </p>
              <div className="mt-8 space-y-10">
                {detailedGaps.map((gap) => (
                  <div className="scroll-mt-28" id={gap.id} key={gap.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {gap.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-950">{gap.summary}</p>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                        Example
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-950">{gap.example}</p>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-950">
                      <span className="font-semibold">Why it happens. </span>
                      {gap.why}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">What to do. </span>
                      {gap.fix}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-base leading-7 text-slate-950">
                Two of these have their own tools. Use the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/depreciation-calculator"
                >
                  depreciation calculator
                </Link>{" "}
                to work out the annual charge on an asset you have bought, and the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/invoice-generator"
                >
                  invoice generator
                </Link>{" "}
                to get invoices out the same day the work is finished.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="example">
                Worked example: RM 20,000 profit and RM 16,000 less in the bank
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A small services business reports RM 20,000 profit for the month. The owner cannot
                understand why the account is emptier than it was. Starting from profit and
                adjusting for each gap explains it exactly.
              </p>
              <SimpleTable
                headers={["Line", "Effect on cash (RM)"]}
                rows={[
                  ["Profit for the month", "20,000"],
                  ["Add back depreciation (no cash paid)", "+1,500"],
                  ["Increase in unpaid customer invoices", "-18,000"],
                  ["Owner drawings", "-6,000"],
                  ["Loan principal repaid", "-2,500"],
                  ["Equipment purchased", "-8,000"],
                  ["Increase in unsold stock", "-3,000"],
                  ["Net movement in cash", "-16,000"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The business earned RM 20,000 and its bank balance fell by RM 16,000. Every line is
                ordinary and every line is correct. If cash at the start of the month was
                RM 25,000, cash at the end is RM 9,000.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                That reconciliation explains <em>why</em> the two figures differ. The{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/cash-flow-calculator"
                >
                  cash flow calculator
                </Link>{" "}
                approaches the same month from the other direction: enter the beginning balance of
                RM 25,000, the cash actually collected, and the cash actually paid out, and it
                returns the same RM 9,000 ending balance. One method explains the gap, the other
                confirms the position.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="which-to-watch">
                Which number should you watch?
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Both, for different decisions. Watching only one is how businesses get caught out.
              </p>
              <div className="mt-6 space-y-6 text-base leading-7 text-slate-950">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Watch profit to decide</h3>
                  <p className="mt-2">
                    Whether your pricing works, whether a product line is worth keeping, whether
                    costs are under control, and whether the business model earns its keep over
                    time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Watch cash to survive</h3>
                  <p className="mt-2">
                    Whether you can pay wages this month, take on a large order, buy equipment,
                    hire, or afford your own drawings. Every one of those is a cash question.
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                A business that is unprofitable but cash-rich is slowly dying. A business that is
                profitable but cash-poor can die suddenly. The second failure is faster, which is
                why cash deserves the more frequent review.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="how-to-close">
                How to close the gap
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Most of the gap is timing, and timing responds to habits rather than accounting
                changes.
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {closingActions.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Getting paid sooner is usually the largest single improvement available, and it
                costs nothing but discipline.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Monthly review checklist</SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide explains general business finance concepts for learning and review. It
                is not accounting, tax, or financial advice for a specific business.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Check where your cash actually went
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Enter your opening balance and the money that genuinely moved to see net cash
                    flow and your ending balance for the period.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/break-even-calculator"
                  >
                    Break-even Calculator
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/cash-flow-calculator"
                  >
                    Cash Flow Calculator
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Profit and Cash Flow FAQs"
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
