import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Financial Ratios for Beginners: Formulas and Examples | AccountingToolsLab",
  description:
    "Learn basic financial ratios with formulas and examples, including current ratio, debt-to-equity ratio, gross profit margin, net profit margin, and return on assets.",
  path: "/guides/financial-ratios-for-beginners"
});

const ratioRows = [
  [
    "Current Ratio",
    "Current Assets / Current Liabilities",
    "Short-term liquidity"
  ],
  [
    "Debt-to-Equity Ratio",
    "Total Liabilities / Total Equity",
    "How much financing comes from debt compared with equity"
  ],
  [
    "Gross Profit Margin",
    "(Gross Profit / Revenue) x 100",
    "Profit left after cost of goods sold"
  ],
  [
    "Net Profit Margin",
    "(Net Income / Revenue) x 100",
    "Profit left after all expenses"
  ],
  [
    "Return on Assets",
    "(Net Income / Total Assets) x 100",
    "How efficiently assets generate profit"
  ]
];

const formulaExamples = [
  {
    eyebrow: "Liquidity",
    title: "Current ratio formula and example",
    formula: "Current Ratio = Current Assets / Current Liabilities",
    facts: [
      "Current assets = RM 10,000",
      "Current liabilities = RM 5,000",
      "Current ratio = 2.00 : 1"
    ],
    explanation:
      "A higher current ratio can suggest stronger short-term liquidity, but very high ratios can also mean resources are not being used efficiently."
  },
  {
    eyebrow: "Debt",
    title: "Debt-to-equity ratio formula and example",
    formula: "Debt-to-Equity Ratio = Total Liabilities / Total Equity",
    facts: [
      "Total liabilities = RM 40,000",
      "Total equity = RM 20,000",
      "Debt-to-equity ratio = 2.00"
    ],
    explanation:
      "This ratio shows how much debt is used compared with owner or shareholder equity. A higher result usually means the business relies more on liabilities."
  },
  {
    eyebrow: "Efficiency",
    title: "Return on assets formula and example",
    formula: "Return on Assets = (Net Income / Total Assets) x 100",
    facts: [
      "Net income = RM 5,000",
      "Total assets = RM 50,000",
      "Return on assets = 10%"
    ],
    explanation:
      "Return on assets, often called ROA, helps show how efficiently a business uses assets to generate profit."
  }
];

const mistakes = [
  "Dividing by zero or using missing values",
  "Mixing up revenue, gross profit, and net income",
  "Comparing businesses from very different industries",
  "Thinking one ratio tells the whole story",
  "Using old or inaccurate financial statement numbers",
  "Ignoring business context"
];

const checklist = [
  "Know which financial statement numbers you are using",
  "Check the period covered by the numbers",
  "Use the correct formula",
  "Compare with a useful benchmark",
  "Read the result with context"
];

const faqs = [
  {
    question: "What are financial ratios?",
    answer:
      "Financial ratios compare two financial statement numbers to help users understand liquidity, debt, profitability, efficiency, or risk."
  },
  {
    question: "Why are financial ratios useful?",
    answer:
      "Financial ratios are useful because they turn raw accounting numbers into easier comparisons. They can help beginners review trends, ask better questions, and compare results with a goal or benchmark."
  },
  {
    question: "What financial ratios should beginners learn first?",
    answer:
      "Beginners can start with current ratio, debt-to-equity ratio, gross profit margin, net profit margin, and return on assets."
  },
  {
    question: "What is the current ratio?",
    answer:
      "The current ratio compares current assets with current liabilities. It is commonly used to review short-term liquidity."
  },
  {
    question: "What is the debt-to-equity ratio?",
    answer:
      "The debt-to-equity ratio compares total liabilities with total equity. It helps show how much financing comes from debt compared with equity."
  },
  {
    question: "What is the difference between gross profit margin and net profit margin?",
    answer:
      "Gross profit margin looks at profit after direct costs such as cost of goods sold. Net profit margin looks at profit after all expenses."
  },
  {
    question: "What does return on assets show?",
    answer:
      "Return on assets shows how much profit a business generates compared with its total assets."
  },
  {
    question: "Can one financial ratio tell if a business is healthy?",
    answer:
      "No. One ratio cannot tell the whole story. Ratios should be read together with other ratios, trends, industry context, and the quality of the underlying financial numbers."
  },
  {
    question: "Can this guide help with accounting homework?",
    answer:
      "Yes. This guide can help you understand common formulas and examples, but you should still follow your class instructions and show your own working."
  }
];

export default function FinancialRatiosForBeginnersGuidePage() {
  const pageUrl = `${siteConfig.url}/guides/financial-ratios-for-beginners`;

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Financial Ratios for Beginners", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Financial Ratios for Beginners: Formulas and Examples",
          description:
            "Learn basic financial ratios with formulas and examples, including current ratio, debt-to-equity ratio, gross profit margin, net profit margin, and return on assets.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <Container as="main">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Financial Ratios for Beginners: Formulas and Examples
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Financial ratios compare numbers from financial statements to help review
            liquidity, debt, profitability, and efficiency. They are useful for learning, basic
            business review, and asking better questions about performance.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/financial-ratio-calculator"
            >
              Try the Financial Ratio Calculator
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/tools"
            >
              Explore Accounting Tools
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What are financial ratios?
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              Financial ratios compare two numbers from financial statements. For example, a
              ratio might compare current assets with current liabilities, or net income with
              revenue.
            </p>
            <p>
              Ratios help users understand business performance, financial position, and risk.
              They can make large financial statement numbers easier to interpret.
            </p>
            <p>
              Ratios are useful, but they need context. Beginners should compare ratios with
              previous periods, similar businesses, or a clear goal instead of reading one
              number in isolation.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Core formulas</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Common financial ratios beginners should know
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            These financial ratio formulas are common starting points for homework checks and
            basic business review.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-[760px] w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ratio</th>
                  <th className="px-4 py-3 font-semibold">Formula</th>
                  <th className="px-4 py-3 font-semibold">What it helps show</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {ratioRows.map(([ratio, formula, meaning]) => (
                  <tr key={ratio}>
                    <td className="px-4 py-3 font-semibold text-stone-950">{ratio}</td>
                    <td className="px-4 py-3">{formula}</td>
                    <td className="px-4 py-3">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {formulaExamples.map((example) => (
            <article
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              key={example.title}
            >
              <p className="text-sm font-medium tracking-wide text-slate-500">
                {example.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                {example.title}
              </h2>
              <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                {example.formula}
              </div>
              <ul className="mt-5 grid gap-2 text-sm leading-6 text-stone-700">
                {example.facts.map((fact) => (
                  <li className="flex gap-3" key={fact}>
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
                {example.explanation}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Profitability</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Gross profit margin vs net profit margin
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-base font-semibold text-stone-950">
                Gross profit margin formula
              </h3>
              <p className="mt-3 text-sm font-semibold text-stone-800">
                Gross Profit Margin = (Gross Profit / Revenue) x 100
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Gross profit margin looks at profit after direct costs, such as cost of goods
                sold.
              </p>
            </article>
            <article className="rounded-xl border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-base font-semibold text-stone-950">
                Net profit margin formula
              </h3>
              <p className="mt-3 text-sm font-semibold text-stone-800">
                Net Profit Margin = (Net Income / Revenue) x 100
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Net profit margin looks at profit after all expenses, not only direct costs.
              </p>
            </article>
          </div>
          <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
            <h3 className="text-base font-semibold text-stone-950">Simple margin example</h3>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-700 sm:grid-cols-2">
              <p>Revenue = RM 10,000</p>
              <p>Gross profit = RM 4,000</p>
              <p>Gross profit margin = 40%</p>
              <p>Net income = RM 1,200</p>
              <p>Net profit margin = 12%</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Use the tool</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Calculate ratios with the Financial Ratio Calculator
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                The Financial Ratio Calculator lets you choose a ratio, enter the required
                numbers, and see the result.
              </p>
              <p>
                It can help with homework checks, basic business review, and learning formulas.
                It does not replace professional financial advice.
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ["Financial Ratio Calculator", "/tools/financial-ratio-calculator"],
                ["Cash Flow Calculator", "/tools/cash-flow-calculator"],
                ["Cash Flow vs Profit", "/guides/cash-flow-vs-profit"],
                [
                  "Straight-Line Depreciation Explained",
                  "/guides/straight-line-depreciation-explained"
                ],
                ["Break-even Point Explained", "/guides/break-even-point-explained"],
                ["Break-even Calculator", "/tools/break-even-calculator"]
              ].map(([label, href]) => (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Avoid these</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common financial ratio mistakes
            </h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
              {mistakes.map((mistake) => (
                <li className="flex gap-3" key={mistake}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Beginner checklist before using financial ratios
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {checklist.map((item, index) => (
              <li
                className="flex gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
                key={item}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <FAQSection faqs={faqs} title="Financial Ratios for Beginners FAQs" />
      </Container>
    </div>
  );
}
