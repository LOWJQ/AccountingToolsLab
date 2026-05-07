import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Break-even Point Explained: Formula, Example, and Meaning | AccountingToolsLab",
  description:
    "Learn what break-even point means, how to calculate break-even units and sales, contribution margin, examples, common mistakes, and beginner tips.",
  path: "/guides/break-even-point-explained"
});

const keyTerms = [
  ["Fixed Costs", "Costs that stay the same over the relevant activity range", "Rent, basic salaries, insurance"],
  ["Variable Costs", "Costs that change with each unit sold", "Materials, packaging, direct commission"],
  ["Selling Price per Unit", "Amount charged for one unit", "RM 50 per unit"],
  ["Contribution Margin per Unit", "Selling price minus variable cost per unit", "RM 50 - RM 30 = RM 20"],
  ["Break-even Units", "Units needed to cover fixed costs", "500 units"],
  ["Break-even Sales", "Sales revenue needed to cover fixed costs", "RM 25,000"]
];

const steps = [
  "Identify fixed costs.",
  "Find the selling price per unit.",
  "Find the variable cost per unit.",
  "Calculate contribution margin per unit.",
  "Divide fixed costs by contribution margin per unit.",
  "Multiply break-even units by selling price per unit to estimate break-even sales.",
  "Review whether the result makes sense for the business."
];

const exampleRows = [
  ["Fixed costs", "RM 10,000"],
  ["Selling price per unit", "RM 50"],
  ["Variable cost per unit", "RM 30"],
  ["Contribution margin per unit", "RM 20"],
  ["Break-even units", "500 units"],
  ["Break-even sales", "RM 25,000"]
];

const unitVsSalesRows = [
  ["Break-even Units", "Fixed Costs / Contribution Margin per Unit", "Unit sales targets"],
  ["Break-even Sales", "Break-even Units x Selling Price per Unit", "Revenue targets"]
];

const changeRows = [
  ["Fixed costs increase", "Break-even point increases"],
  ["Variable cost per unit increases", "Break-even point increases"],
  ["Selling price increases", "Break-even point decreases"],
  ["Selling price decreases", "Break-even point increases"],
  ["Contribution margin increases", "Break-even point decreases"]
];

const toolLinks = [
  {
    title: "Break-even Calculator",
    href: "/tools/break-even-calculator",
    description: "Use it to estimate break-even units and sales."
  },
  {
    title: "Cash Flow vs Profit",
    href: "/guides/cash-flow-vs-profit",
    description: "Learn how break-even, profit, and cash movement answer different questions."
  },
  {
    title: "Cash Flow Calculator",
    href: "/tools/cash-flow-calculator",
    description: "Use it to calculate net cash flow and ending cash balance."
  },
  {
    title: "Financial Ratios for Beginners",
    href: "/guides/financial-ratios-for-beginners",
    description: "Review basic performance and position ratios after break-even analysis."
  },
  {
    title: "Financial Ratio Calculator",
    href: "/tools/financial-ratio-calculator",
    description: "Use it to review liquidity and profitability ratios."
  }
];

const mistakes = [
  "Mixing up fixed costs and variable costs",
  "Using total variable costs instead of variable cost per unit",
  "Forgetting that selling price must be higher than variable cost per unit",
  "Treating break-even as profit",
  "Ignoring changes in price, cost, or demand",
  "Rounding too early",
  "Assuming all costs behave perfectly as fixed or variable",
  "Using break-even alone to make a major business decision"
];

const checklist = [
  "Do you know your fixed costs?",
  "Do you know the selling price per unit?",
  "Do you know the variable cost per unit?",
  "Is selling price higher than variable cost?",
  "Did you calculate contribution margin correctly?",
  "Did you divide fixed costs by contribution margin?",
  "Did you check both break-even units and break-even sales?",
  "Did you review whether the sales target is realistic?"
];

const faqs = [
  {
    question: "What is break-even point?",
    answer:
      "Break-even point is the sales level where total revenue covers total costs, with no profit and no loss."
  },
  {
    question: "What is the break-even point formula?",
    answer:
      "Break-even units equal fixed costs divided by contribution margin per unit. Break-even sales equal break-even units multiplied by selling price per unit."
  },
  {
    question: "How do you calculate break-even units?",
    answer:
      "Calculate contribution margin per unit, then divide fixed costs by that contribution margin."
  },
  {
    question: "How do you calculate break-even sales?",
    answer:
      "Multiply break-even units by the selling price per unit."
  },
  {
    question: "What is contribution margin?",
    answer:
      "Contribution margin is selling price per unit minus variable cost per unit. It shows how much each unit contributes toward fixed costs and then profit."
  },
  {
    question: "Does break-even mean profit?",
    answer:
      "No. Break-even means revenue covers costs. Profit starts after sales move above the break-even point."
  },
  {
    question: "What happens if fixed costs increase?",
    answer:
      "If fixed costs increase and other inputs stay the same, the break-even point usually increases."
  },
  {
    question: "What happens if variable cost increases?",
    answer:
      "If variable cost per unit increases, contribution margin falls and the break-even point usually increases."
  },
  {
    question: "Can the Break-even Calculator help with homework?",
    answer:
      "Yes. It can help check simple break-even units, break-even sales, and contribution margin calculations."
  },
  {
    question: "Is break-even analysis enough for business planning?",
    answer:
      "No. Break-even analysis is a useful planning check, but it does not replace demand research, cash flow review, or professional advice."
  }
];

function GuideTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
            <tr className={row[0].includes("Break-even") ? "bg-stone-50 font-semibold" : ""} key={row[0]}>
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

export default function BreakEvenPointExplainedPage() {
  const pageUrl = `${siteConfig.url}/guides/break-even-point-explained`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Break-even Point Explained", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Break-even Point Explained: Formula, Example, and Meaning",
          description:
            "Learn what break-even point means, how to calculate break-even units and sales, contribution margin, examples, common mistakes, and beginner tips.",
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
            Break-even Point Explained: Formula, Example, and Meaning
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            The break-even point is the sales level where total revenue covers total costs, so
            the business has no profit and no loss yet.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/break-even-calculator"
            >
              Try the Break-even Calculator
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/guides/cash-flow-vs-profit"
            >
              Learn Cash Flow vs Profit
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is break-even point?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Break-even point is where revenue equals total costs.</p>
              <p>At break-even, the business has covered costs but has not made profit yet.</p>
              <p>Sales above break-even can start creating profit.</p>
              <p>Sales below break-even usually mean the business is not covering all costs.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Formula</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Break-even point formula
            </h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Contribution Margin per Unit = Selling Price per Unit - Variable Cost per Unit
              </p>
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Break-even Units = Fixed Costs / Contribution Margin per Unit
              </p>
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Break-even Sales = Break-even Units x Selling Price per Unit
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Terms</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Key terms in break-even analysis
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            Fixed costs stay the same within the activity range, variable costs change with each
            unit sold, and contribution margin is the amount each unit contributes toward fixed
            costs and then profit.
          </p>
          <GuideTable headers={["Term", "Meaning", "Simple example"]} rows={keyTerms} />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Steps</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to calculate break-even point step by step
          </h2>
          <ol className="mt-6 grid gap-3">
            {steps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-stone-700" key={step}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Break-even point example
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            A small business has fixed costs of RM 10,000. It sells a product for RM 50 per
            unit. The variable cost is RM 30 per unit.
          </p>
          <GuideTable headers={["Item", "Amount"]} rows={exampleRows} />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Contribution margin is RM 50 - RM 30 = RM 20.</p>
            <p>Break-even units are RM 10,000 / RM 20 = 500 units.</p>
            <p>Break-even sales are 500 x RM 50 = RM 25,000.</p>
            <p>
              The business needs to sell 500 units before it begins earning profit, assuming the
              inputs stay the same.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Targets</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Break-even units vs break-even sales
            </h2>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
              Break-even units tell you how many units must be sold. Break-even sales tell you
              the sales revenue needed. Units are useful for product planning, while sales
              amount is useful for revenue targets.
            </p>
            <GuideTable headers={["Measure", "Formula", "Best for"]} rows={unitVsSalesRows} />
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Why it matters</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Why break-even point matters
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
              {[
                "Helps estimate minimum sales target.",
                "Helps review pricing decisions.",
                "Helps compare fixed and variable cost changes.",
                "Helps understand how many units are needed before profit starts.",
                "Helps beginners connect sales, costs, and profit."
              ].map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Input changes</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What changes your break-even point?
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Higher fixed costs usually increase break-even point.</p>
            <p>
              Higher variable cost per unit lowers contribution margin and increases break-even
              point.
            </p>
            <p>
              Higher selling price can lower break-even point if variable cost stays the same.
              Lower selling price can increase break-even point.
            </p>
            <p>Cost or price changes should be checked again.</p>
          </div>
          <GuideTable headers={["Change", "Likely effect on break-even point"]} rows={changeRows} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Limitations</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What break-even analysis does not tell you
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>It is a simplified planning tool.</p>
              <p>It assumes selling price and variable cost per unit stay constant.</p>
              <p>It does not guarantee demand or include every business risk.</p>
              <p>It does not replace full business planning or professional advice.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Use the tool</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Calculate break-even point with the Break-even Calculator
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                Users can enter fixed costs, selling price per unit, and variable cost per unit.
              </p>
              <p>
                The tool calculates contribution margin, break-even units, and break-even sales.
                It is useful for homework checks, beginner business planning, and quick scenario
                testing.
              </p>
              <p>
                You can{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/break-even-calculator"
                >
                  calculate break-even point with the Break-even Calculator
                </a>
                ,{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/cash-flow-calculator"
                >
                  review simple cash flow
                </a>
                , or{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/financial-ratio-calculator"
                >
                  calculate basic financial ratios
                </a>
                .
              </p>
            </div>
          </article>
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Related break-even and planning tools
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            To connect break-even planning with cash timing and performance checks, review{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/cash-flow-vs-profit"
            >
              Cash Flow vs Profit
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

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common break-even mistakes
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

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Break-even checklist for beginners
            </h2>
            <ul className="mt-6 grid gap-3">
              {checklist.map((item) => (
                <li
                  className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Break-even Point FAQs
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
