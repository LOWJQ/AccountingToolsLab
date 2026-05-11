import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Straight-Line Depreciation Explained: Formula and Example | AccountingToolsLab",
  description:
    "Learn straight-line depreciation with the formula, examples, salvage value, useful life, annual depreciation expense, common mistakes, and beginner tips.",
  path: "/guides/straight-line-depreciation-explained"
});

const keyTerms = [
  ["Asset Cost", "Amount assigned to the asset", "RM 10,000"],
  ["Salvage Value", "Estimated value at the end of useful life", "RM 1,000"],
  ["Useful Life", "Years the asset is expected to provide value", "5 years"],
  ["Depreciable Amount", "Cost minus salvage value", "RM 9,000"],
  ["Annual Depreciation Expense", "Depreciable amount divided by useful life", "RM 1,800 per year"]
];

const steps = [
  "Find the asset cost.",
  "Estimate the salvage value.",
  "Subtract salvage value from asset cost.",
  "Find the asset's useful life in years.",
  "Divide the depreciable amount by useful life.",
  "Review whether the result is reasonable.",
  "Use the same annual depreciation amount each year unless the assumptions change."
];

const exampleRows = [
  ["Asset cost", "RM 10,000"],
  ["Salvage value", "RM 1,000"],
  ["Depreciable amount", "RM 9,000"],
  ["Useful life", "5 years"],
  ["Annual depreciation expense", "RM 1,800"]
];

const scheduleRows = [
  ["1", "RM 1,800", "RM 1,800", "RM 8,200"],
  ["2", "RM 1,800", "RM 3,600", "RM 6,400"],
  ["3", "RM 1,800", "RM 5,400", "RM 4,600"],
  ["4", "RM 1,800", "RM 7,200", "RM 2,800"],
  ["5", "RM 1,800", "RM 9,000", "RM 1,000"]
];

const comparisonRows = [
  ["Depreciation Expense", "Depreciation recorded in one period", "RM 1,800 in Year 1"],
  ["Accumulated Depreciation", "Total depreciation recorded over time", "RM 3,600 after Year 2"],
  ["Book Value", "Asset cost minus accumulated depreciation", "RM 6,400 after Year 2"]
];

const toolLinks = [
  {
    title: "Depreciation Calculator",
    href: "/tools/depreciation-calculator",
    description: "Use it to estimate annual straight-line depreciation."
  },
  {
    title: "Financial Ratios for Beginners",
    href: "/guides/financial-ratios-for-beginners",
    description: "Learn ratio basics that may use assets, profit, and depreciation context."
  },
  {
    title: "Accounting Equation Calculator",
    href: "/tools/accounting-equation-calculator",
    description: "Use it to review assets, liabilities, and equity."
  },
  {
    title: "Financial Ratio Calculator",
    href: "/tools/financial-ratio-calculator",
    description: "Use it to review basic ratios that may involve assets or profit."
  },
  {
    title: "Journal Entry Checker",
    href: "/tools/journal-entry-checker",
    description: "Use it to check whether debit and credit lines balance."
  },
  {
    title: "Journal Entries for Beginners",
    href: "/guides/journal-entries-for-beginners",
    description: "Review how depreciation-related entries fit into double-entry accounting."
  }
];

const mistakes = [
  "Forgetting to subtract salvage value",
  "Entering salvage value higher than asset cost",
  "Using useful life of zero",
  "Confusing annual depreciation with accumulated depreciation",
  "Thinking book value always equals market value",
  "Treating all assets as if straight-line depreciation is always appropriate",
  "Rounding too early",
  "Forgetting that tax rules may differ from simple accounting examples"
];

const checklist = [
  "Do you know the asset cost?",
  "Did you estimate salvage value?",
  "Is salvage value lower than asset cost?",
  "Do you know useful life in years?",
  "Did you calculate depreciable amount?",
  "Did you divide by useful life?",
  "Did you keep depreciation expense separate from accumulated depreciation?",
  "Did you remember this is a simple educational estimate?"
];

const faqs = [
  {
    question: "What is straight-line depreciation?",
    answer:
      "Straight-line depreciation records the same depreciation expense each year over an asset's useful life."
  },
  {
    question: "What is the straight-line depreciation formula?",
    answer:
      "Annual Depreciation Expense = (Asset Cost - Salvage Value) / Useful Life."
  },
  {
    question: "How do you calculate annual depreciation expense?",
    answer:
      "Subtract salvage value from asset cost to get depreciable amount, then divide by useful life."
  },
  {
    question: "What is salvage value?",
    answer:
      "Salvage value is the estimated value of an asset at the end of its useful life."
  },
  {
    question: "What is useful life?",
    answer:
      "Useful life is the number of years an asset is expected to provide value to the business."
  },
  {
    question: "What is depreciable amount?",
    answer:
      "Depreciable amount is asset cost minus salvage value. It is the amount spread over useful life."
  },
  {
    question: "What is the difference between depreciation expense and accumulated depreciation?",
    answer:
      "Depreciation expense is the amount recorded for one period. Accumulated depreciation is total depreciation recorded so far."
  },
  {
    question: "Does book value equal market value?",
    answer:
      "Not necessarily. Book value is an accounting amount, while market value depends on what the asset may sell for."
  },
  {
    question: "Can the Depreciation Calculator help with homework?",
    answer:
      "Yes. It can help check simple straight-line depreciation calculations, but you should still show your formula and working."
  },
  {
    question: "Is straight-line depreciation the only depreciation method?",
    answer:
      "No. It is one common method. Other methods may be used depending on the asset, accounting rules, or tax requirements."
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
            <tr
              className={
                row[0].includes("Annual") || row[0] === "5" ? "bg-stone-50 font-semibold" : ""
              }
              key={row[0]}
            >
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

export default function StraightLineDepreciationExplainedPage() {
  const pageUrl = `${siteConfig.url}/guides/straight-line-depreciation-explained`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Straight-Line Depreciation Explained", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Straight-Line Depreciation Explained: Formula and Example",
          description:
            "Learn straight-line depreciation with the formula, examples, salvage value, useful life, annual depreciation expense, common mistakes, and beginner tips.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Straight-Line Depreciation Explained: Formula and Example
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Straight-line depreciation spreads an asset&apos;s depreciable cost evenly over its useful
            life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/depreciation-calculator"
            >
              Try the Depreciation Calculator
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/guides/financial-ratios-for-beginners"
            >
              Review Financial Ratios
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is straight-line depreciation?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Straight-line depreciation records the same depreciation expense each year.</p>
              <p>
                It is commonly used to spread an asset&apos;s cost over the years the asset is
                expected to help the business.
              </p>
              <p>It uses cost, salvage value, and useful life.</p>
              <p>It is simple, but it may not fit every asset or accounting situation.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Formula</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Straight-line depreciation formula
            </h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Annual Depreciation Expense = (Asset Cost - Salvage Value) / Useful Life
              </p>
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Depreciable Amount = Asset Cost - Salvage Value
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Terms</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Key terms in straight-line depreciation
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Asset cost is the amount assigned to the asset.</p>
            <p>Salvage value is the estimated value at the end of useful life.</p>
            <p>Useful life is how many years the asset is expected to provide value.</p>
            <p>Depreciable amount is the part of the asset cost that will be depreciated.</p>
          </div>
          <GuideTable headers={["Term", "Meaning", "Simple example"]} rows={keyTerms} />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Steps</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to calculate straight-line depreciation step by step
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
            Straight-line depreciation example
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            A business buys equipment for RM 10,000. The estimated salvage value is RM 1,000.
            The useful life is 5 years.
          </p>
          <GuideTable headers={["Item", "Amount"]} rows={exampleRows} />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Depreciable amount is RM 10,000 - RM 1,000 = RM 9,000.</p>
            <p>Annual depreciation expense is RM 9,000 / 5 = RM 1,800.</p>
            <p>
              The business records RM 1,800 of depreciation expense each year using the
              straight-line method.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Schedule</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple straight-line depreciation schedule
          </h2>
          <GuideTable
            headers={["Year", "Depreciation Expense", "Accumulated Depreciation", "Book Value"]}
            rows={scheduleRows}
          />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Depreciation expense is the same each year.</p>
            <p>Accumulated depreciation increases each year.</p>
            <p>Book value decreases until it reaches the estimated salvage value.</p>
            <p>Book value in this simple schedule is cost minus accumulated depreciation.</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Comparison</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Depreciation expense vs accumulated depreciation
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Depreciation expense is the amount recorded for one period.</p>
              <p>Accumulated depreciation is the total depreciation recorded so far.</p>
              <p>Beginners often confuse the annual expense with the total accumulated amount.</p>
            </div>
            <GuideTable headers={["Term", "Meaning", "Example"]} rows={comparisonRows} />
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Why it matters</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Why depreciation matters
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
              {[
                "It spreads asset cost over time instead of treating the full cost as one period's expense.",
                "It helps match asset use with the periods that benefit from the asset.",
                "It affects accounting profit because depreciation is an expense.",
                "It affects asset book value on the balance sheet.",
                "It is a basic concept used in accounting, financial statements, and ratio analysis."
              ].map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Limitations</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What straight-line depreciation does not tell you
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>It is a simple method.</p>
              <p>It assumes the asset provides value evenly over time.</p>
              <p>It does not necessarily match actual market value.</p>
              <p>It does not decide tax treatment.</p>
              <p>It may not fit assets that lose value faster early in life.</p>
              <p>It does not replace professional accounting or tax advice.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Use the tool</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Calculate depreciation with the Depreciation Calculator
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                Users can enter asset cost, salvage value, and useful life. The tool calculates
                annual depreciation expense using the straight-line method.
              </p>
              <p>
                It is useful for homework checks, beginner learning, and simple depreciation
                estimates.
              </p>
              <p>
                You can{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/depreciation-calculator"
                >
                  calculate straight-line depreciation
                </a>
                ,{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/financial-ratio-calculator"
                >
                  review financial ratios
                </a>
                , or{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/accounting-equation-calculator"
                >
                  review assets, liabilities, and equity
                </a>
                .
              </p>
            </div>
          </article>
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Related depreciation and accounting resources
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
            To connect depreciation with performance measures and journal entries, read{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/financial-ratios-for-beginners"
            >
              Financial Ratios for Beginners
            </a>{" "}
            and{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/journal-entries-for-beginners"
            >
              Journal Entries for Beginners
            </a>
            .
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common straight-line depreciation mistakes
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
              Straight-line depreciation checklist for beginners
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
            Straight-Line Depreciation FAQs
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
