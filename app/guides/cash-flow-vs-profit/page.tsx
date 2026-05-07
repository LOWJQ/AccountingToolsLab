import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Cash Flow vs Profit: What Is the Difference? | AccountingToolsLab",
  description:
    "Learn the difference between cash flow and profit, why profitable businesses can run out of cash, simple examples, common mistakes, and how to check cash flow.",
  path: "/guides/cash-flow-vs-profit"
});

const comparisonRows = [
  [
    "Basic meaning",
    "Cash moving in and out",
    "Revenue left after expenses"
  ],
  [
    "Focus",
    "Timing of cash receipts and payments",
    "Earnings or loss for a period"
  ],
  [
    "Main question answered",
    "Did cash increase or decrease?",
    "Did the business earn more than it spent?"
  ],
  [
    "Example issue",
    "Customer has not paid yet",
    "Expense is recorded even if not paid yet"
  ],
  [
    "Useful for",
    "Paying bills and managing liquidity",
    "Measuring business performance"
  ]
];

const exampleRows = [
  ["Service revenue", "RM 5,000", "RM 0 cash received this month"],
  ["Rent and supplies paid", "RM 2,000 expense", "RM 2,000 cash outflow"],
  ["Result", "RM 3,000 profit", "RM 2,000 negative cash flow"]
];

const cashShortReasons = [
  "Customers have not paid yet.",
  "Inventory or supplies were bought before sales cash was collected.",
  "Loan repayments use cash but may not appear fully as an expense.",
  "Equipment purchases can use a lot of cash upfront.",
  "Owner withdrawals reduce cash.",
  "Sales are growing, but cash collection is slow."
];

const cashFlowSteps = [
  "Start with beginning cash balance.",
  "Add cash inflows received during the period.",
  "Subtract cash outflows paid during the period.",
  "Calculate net cash flow.",
  "Add net cash flow to beginning cash.",
  "Review the ending cash balance.",
  "Compare cash flow with profit to understand the difference."
];

const toolLinks = [
  {
    title: "Cash Flow Calculator",
    href: "/tools/cash-flow-calculator",
    description: "Use it to calculate net cash flow and ending cash balance."
  },
  {
    title: "Invoice Generator",
    href: "/tools/invoice-generator",
    description: "Use it to create a simple invoice before collecting payment."
  },
  {
    title: "Break-even Calculator",
    href: "/tools/break-even-calculator",
    description: "Use it to estimate the sales level needed to cover costs."
  },
  {
    title: "Financial Ratio Calculator",
    href: "/tools/financial-ratio-calculator",
    description: "Use it to review basic liquidity and profitability ratios."
  }
];

const mistakes = [
  "Thinking profit means cash is already in the bank",
  "Ignoring unpaid invoices",
  "Forgetting loan repayments use cash",
  "Treating owner withdrawals as business profit",
  "Confusing sales with cash collected",
  "Ignoring large equipment or inventory purchases",
  "Looking at only one month without context",
  "Treating positive cash flow as proof the business is profitable"
];

const checklist = [
  "Did the customer actually pay yet?",
  "Are there unpaid invoices?",
  "Were any expenses recorded but not paid yet?",
  "Were there cash payments that are not simple operating expenses?",
  "Did the business borrow money or receive owner contributions?",
  "Did cash increase or decrease during the period?",
  "Did profit increase or decrease during the same period?"
];

const faqs = [
  {
    question: "What is the difference between cash flow and profit?",
    answer:
      "Profit is revenue minus expenses. Cash flow is cash received minus cash paid during a period."
  },
  {
    question: "Can a business be profitable but have no cash?",
    answer:
      "Yes. A business can be profitable but short on cash if customers have not paid yet, cash was used for inventory or equipment, or loan repayments and withdrawals reduced cash."
  },
  {
    question: "Can cash flow be positive while profit is low?",
    answer:
      "Yes. Cash flow can be positive because of loans, owner contributions, or collecting old receivables even when current profit is low."
  },
  {
    question: "Is cash flow more important than profit?",
    answer:
      "Both matter. Profit helps measure business performance, while cash flow helps show whether the business can pay bills."
  },
  {
    question: "What is net cash flow?",
    answer:
      "Net cash flow is cash inflows minus cash outflows for a period."
  },
  {
    question: "How do you calculate ending cash balance?",
    answer:
      "Ending cash balance equals beginning cash balance plus net cash flow."
  },
  {
    question: "Why are unpaid invoices important for cash flow?",
    answer:
      "Unpaid invoices may count as sales or revenue, but they do not increase cash until the customer pays."
  },
  {
    question: "How can the Cash Flow Calculator help?",
    answer:
      "The Cash Flow Calculator can calculate net cash flow and ending cash balance from beginning cash, cash inflows, and cash outflows."
  },
  {
    question: "Can this guide help with small business homework or basic bookkeeping?",
    answer:
      "Yes. It can help beginners and small business owners understand basic cash movement, but it is educational and not professional financial advice."
  }
];

function SimpleTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
      <table className="min-w-[720px] w-full border-collapse bg-white text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3 font-semibold" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-700">
          {rows.map((row) => (
            <tr className={row[0] === "Result" ? "bg-stone-50 font-semibold" : ""} key={row[0]}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 ${index === 0 ? "font-semibold text-stone-950" : ""}`}
                  key={cell}
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

export default function CashFlowVsProfitGuidePage() {
  const pageUrl = `${siteConfig.url}/guides/cash-flow-vs-profit`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Cash Flow vs Profit", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Cash Flow vs Profit: What Is the Difference?",
          description:
            "Learn the difference between cash flow and profit, why profitable businesses can run out of cash, simple examples, common mistakes, and how to check cash flow.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Cash Flow vs Profit: What Is the Difference?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Profit shows whether revenue is higher than expenses, while cash flow shows actual
            cash moving into and out of a business.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/cash-flow-calculator"
            >
              Try the Cash Flow Calculator
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/tools/financial-ratio-calculator"
            >
              Explore Financial Ratio Calculator
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Quick answer: cash flow vs profit
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Profit is revenue minus expenses.</p>
              <p>Cash flow is cash received minus cash paid during a period.</p>
              <p>A business can show profit but still have weak cash flow.</p>
              <p>A business can also have positive cash flow but low or no profit.</p>
              <p>Both numbers are useful, but they answer different questions.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Two formulas</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Cash flow and profit formulas
            </h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center text-base font-semibold text-stone-950">
                Net Cash Flow = Cash Inflows - Cash Outflows
              </p>
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center text-base font-semibold text-stone-950">
                Profit = Revenue - Expenses
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Comparison</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Cash flow vs profit comparison
          </h2>
          <SimpleTable headers={["Topic", "Cash Flow", "Profit"]} rows={comparisonRows} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Cash movement</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is cash flow?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Cash flow is the movement of cash into and out of a business.</p>
              <p>
                Cash inflows can include customer payments, owner contributions, loan proceeds,
                or asset sales.
              </p>
              <p>
                Cash outflows can include rent, wages, supplier payments, loan repayments,
                equipment purchases, and other cash payments.
              </p>
              <p>Net cash flow is cash inflows minus cash outflows.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Earnings</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is profit?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Profit is what remains when expenses are subtracted from revenue.</p>
              <p>
                Profit can be measured in different ways, such as gross profit, operating
                profit, or net profit.
              </p>
              <p>
                For beginners, the simple idea is whether the business earned more than it spent
                during a period.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple cash flow vs profit example
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            A business sells RM 5,000 of services this month, but the customer will pay next
            month. The business pays RM 2,000 cash for rent and supplies this month.
          </p>
          <SimpleTable headers={["Item", "Profit View", "Cash Flow View"]} rows={exampleRows} />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>The business appears profitable because revenue is higher than expenses.</p>
            <p>Cash flow is negative because cash was paid out before customer cash was received.</p>
            <p>This is why profit and cash flow can move differently.</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Timing gap</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              How can a business be profitable but have no cash?
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
              {cashShortReasons.map((reason) => (
                <li className="flex gap-3" key={reason}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Cash source</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Can cash flow be positive when profit is low?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Yes.</p>
              <p>
                A business might receive cash from a loan, owner contribution, or collecting old
                receivables.
              </p>
              <p>
                These can increase cash without meaning the business earned high profit from
                operations.
              </p>
              <p>
                Positive cash flow is helpful, but users should still understand where the cash
                came from.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Cash check</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to check simple cash flow
          </h2>
          <ol className="mt-6 grid gap-3">
            {cashFlowSteps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-stone-700" key={step}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
              Net Cash Flow = Cash Inflows - Cash Outflows
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
              Ending Cash Balance = Beginning Cash Balance + Net Cash Flow
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Calculation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Cash flow calculation example
          </h2>
          <div className="mt-6 grid gap-3 text-sm leading-6 text-stone-700 sm:grid-cols-2 sm:text-base">
            <p>Beginning cash balance: RM 3,000</p>
            <p>Cash inflows: RM 8,000</p>
            <p>Cash outflows: RM 6,500</p>
            <p>Net cash flow: RM 1,500</p>
            <p className="font-semibold text-stone-950">Ending cash balance: RM 4,500</p>
          </div>
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            In this example, cash increased by RM 1,500 during the period. You can{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/tools/cash-flow-calculator"
            >
              calculate net cash flow with the Cash Flow Calculator
            </a>{" "}
            using your own inflow and outflow numbers.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Both matter</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Why cash flow and profit both matter
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Profit helps show whether the business model is earning more than it spends.</p>
              <p>Cash flow helps show whether the business has enough cash to pay bills.</p>
              <p>
                A business should pay attention to both. For beginners, do not treat one number
                as the full story.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common cash flow vs profit mistakes
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700">
              {mistakes.map((mistake) => (
                <li className="flex gap-3" key={mistake}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Tools that can help you review cash and performance
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {toolLinks.map((tool) => (
              <a
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                href={tool.href}
                key={tool.href}
              >
                <h3 className="text-base font-semibold text-stone-950">{tool.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            To connect cash flow with invoices, sales targets, and profitability measures, read{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/how-to-create-a-simple-invoice"
            >
              how to create a simple invoice
            </a>
            ,{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/break-even-point-explained"
            >
              break-even point explained
            </a>{" "}
            and{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/financial-ratios-for-beginners"
            >
              Financial Ratios for Beginners
            </a>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Cash flow vs profit checklist for beginners
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <li
                className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Cash Flow vs Profit FAQs
          </h2>
          <div className="mt-6 divide-y divide-stone-100">
            {faqs.map((faq) => (
              <article className="py-5 first:pt-0 last:pb-0" key={faq.question}>
                <h3 className="text-base font-semibold text-stone-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
