import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Straight-Line Depreciation: The Two Numbers You Guess";
const guidePath = "/guides/straight-line-depreciation-explained";
const pageDescription =
  "The formula is the easy part. Only one of the three inputs is a fact, the other two are estimates you make, and in Malaysia the answer is not what LHDN will accept.";

export const metadata = createMetadata({
  title: pageTitle,
  description:
    "Cost is a fact. Useful life and salvage value are estimates. Learn how to set both, what book value is not, and why LHDN ignores your figure.",
  path: guidePath
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Only one input is a fact", href: "#one-fact" },
  { label: "Key terms", href: "#key-terms" },
  { label: "Estimating useful life", href: "#useful-life" },
  { label: "Estimating salvage value", href: "#salvage-value" },
  { label: "What book value is not", href: "#book-value" },
  { label: "Why LHDN ignores your figure", href: "#capital-allowances" },
  { label: "Worked example", href: "#example" },
  { label: "Checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Asset cost",
    meaning:
      "What the business paid to acquire the asset and get it ready for use. This is the one input taken from a document rather than judgement."
  },
  {
    term: "Useful life",
    meaning:
      "How many years the business expects to use the asset. Not how long it could physically last, but how long it will earn its keep for you."
  },
  {
    term: "Salvage value",
    meaning:
      "Also called residual value. What you realistically expect to receive for the asset when you finish with it. For many assets this is zero."
  },
  {
    term: "Depreciable amount",
    meaning:
      "Cost minus salvage value. This is the portion actually spread across the years, not the full purchase price."
  },
  {
    term: "Accumulated depreciation",
    meaning:
      "The running total charged since the asset was bought. It is a contra asset, so it carries a credit balance and reduces the asset on the balance sheet."
  },
  {
    term: "Book value",
    meaning:
      "Cost minus accumulated depreciation. An accounting figure describing what is left to charge, not an estimate of what the asset would sell for."
  },
  {
    term: "Capital allowance",
    meaning:
      "The tax relief Malaysia grants on qualifying assets under Schedule 3 of the Income Tax Act 1967. It replaces accounting depreciation for tax purposes."
  }
] as const;

const inputTable = [
  ["Asset cost", "The purchase invoice", "Certain"],
  ["Useful life", "Your judgement about how long you will use it", "Estimate"],
  ["Salvage value", "Your judgement about resale at the end", "Estimate"]
] as const;

const usefulLifeFactors = [
  ["Heavy or continuous daily use", "Shortens", "A van driven all day wears out faster than a spare"],
  ["Rapid technology change", "Shortens", "Computers and phones are usually replaced before they break"],
  ["Poor or skipped maintenance", "Shortens", "Machinery neglected now fails earlier"],
  ["Careful servicing on schedule", "Lengthens", "Well-kept equipment stays productive longer"],
  ["Light or occasional use", "Lengthens", "A backup unit used monthly outlasts a primary one"],
  ["Plans to upgrade early", "Shortens", "If you will replace it in three years, its life is three years"]
] as const;

const lifeExamples = [
  ["Laptops and phones", "3 to 4 years", "Obsolescence usually arrives before failure"],
  ["Office furniture", "5 to 10 years", "Little to wear out, replaced for appearance"],
  ["Motor vehicles", "About 5 years", "Common commercial practice, and resale is real"],
  ["Machinery and equipment", "5 to 15 years", "Depends almost entirely on usage intensity"]
] as const;

const bookValuePoints = [
  {
    id: "not-market-value",
    name: "Book value is not market value",
    summary: "The two numbers answer different questions and rarely agree.",
    detail:
      "Book value records how much of the cost you have charged to profit so far. Market value is what somebody would pay you today. A three-year-old van can easily be worth more than its book value, or far less, without either figure being wrong."
  },
  {
    id: "fully-depreciated",
    name: "A fully depreciated asset can still be working",
    summary: "Reaching the end of the schedule changes the accounting, not the machine.",
    detail:
      "When accumulated depreciation reaches the depreciable amount, you stop charging depreciation and the asset sits at its salvage value. You do not stop using it, and you do not remove it from the books. It simply costs nothing more in depreciation terms."
  },
  {
    id: "disposal",
    name: "Selling for a different amount is a gain or loss, not a correction",
    summary: "You do not go back and rewrite earlier years.",
    detail:
      "If you sell for more than book value you record a gain on disposal, and if you sell for less you record a loss. The earlier depreciation was based on the best estimate available at the time and stays as it was."
  }
] as const;

const checklist = [
  "I used the full cost of getting the asset ready for use, not just the invoice price.",
  "I set useful life based on how long the business will use it, not how long it could last.",
  "I used zero salvage value where resale is unlikely.",
  "I checked that salvage value is lower than cost.",
  "I applied the same assumptions to similar assets for consistency.",
  "I understand that book value is not market value.",
  "I know accounting depreciation is added back for Malaysian tax purposes.",
  "I will revisit the estimates if plans for the asset change."
] as const;

const sidebarGuides = [
  {
    href: "/guides/what-is-a-good-financial-ratio",
    label: "Is My Current Ratio Good? How to Judge Any Ratio"
  },
  {
    href: "/guides/profitable-but-no-cash",
    label: "Why Is My Business Profitable but I Have No Cash?"
  },
  {
    href: "/guides/fixed-vs-variable-costs",
    label: "Which Costs Are Fixed and Which Are Variable?"
  }
] as const;

const faqs = [
  {
    question: "Why do I depreciate something I already paid for?",
    answer:
      "Because the payment and the benefit happen at different times. You pay for a machine once, but it helps you earn income for several years. Depreciation spreads the cost across those years so each period carries a fair share, instead of one month absorbing the whole amount and looking artificially unprofitable."
  },
  {
    question: "Do I depreciate land?",
    answer:
      "No. Land is normally not depreciated because it does not have a limited useful life in the way a machine or vehicle does. Buildings standing on land are depreciated, so the two are usually recorded separately when they are bought together."
  },
  {
    question: "What if my useful life estimate turns out to be wrong?",
    answer:
      "You adjust going forward rather than rewriting the past. Take the current book value, subtract the salvage value, and spread what remains over the revised number of years still expected. Earlier years stay as they were, because they reflected the best estimate available at the time."
  },
  {
    question: "Is straight-line the only depreciation method?",
    answer:
      "No. Reducing balance charges a percentage of the falling book value each year, so more of the cost lands in the early years. Straight-line is the most common for simple accounts because the charge is the same every period, which makes budgeting and checking easier."
  },
  {
    question: "What happens when an asset is fully depreciated but still in use?",
    answer:
      "You stop charging depreciation and leave the asset in the books at its salvage value. Nothing about the asset changes and you keep using it normally. If you later sell it, the difference between the sale proceeds and that remaining book value is a gain or loss on disposal."
  },
  {
    question: "Does the Depreciation Calculator handle Malaysian capital allowances?",
    answer:
      "No. It calculates straight-line accounting depreciation from cost, salvage value, and useful life. Capital allowances follow separate rules under Schedule 3 of the Income Tax Act 1967, with different rates by asset category, so that computation has to be done separately."
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

export default function StraightLineDepreciationGuidePage() {
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pageTitle,
          description: metadata.description,
          url: pageUrl,
          datePublished: "2026-08-18",
          dateModified: "2026-08-18",
          author: {
            "@type": "Organization",
            name: "AccountingToolsLab"
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
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
                Updated on 18 August 2026 <span aria-hidden="true">-</span> 10 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">
                Quick answer: the formula, and the part nobody explains
              </SectionHeading>
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-base font-semibold leading-7 text-slate-950">
                  Annual depreciation = (Cost - Salvage Value) / Useful Life
                </p>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                The arithmetic takes seconds. The difficulty is that two of the three inputs are
                not facts you can look up.
              </p>
              <SimpleTable
                headers={["Input", "Where it comes from", "How certain"]}
                rows={inputTable}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                That is not a flaw in the method. Depreciation is a reasonable way of spreading a
                cost, not a measurement of what something is worth.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="one-fact">
                Only one input is a fact
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Cost comes from the invoice, and it should include what you spent getting the asset
                ready to use, not just the purchase price. Delivery, installation, and initial
                setup normally belong in the cost rather than in expenses.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Useful life and salvage value are both judgements about the future. Two sensible
                owners can look at the same machine and reach different annual figures, and both
                can be defensible. What matters is that your assumptions are reasonable, written
                down, and applied consistently to similar assets.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The practical consequence: precision in the arithmetic is worth far less than care
                in the two estimates. The worked example later shows how much the answer moves when
                either one changes.
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
              <SectionHeading id="useful-life">
                Estimating useful life
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The question is not how long the asset could survive. It is how long{" "}
                <strong>your business</strong> will actually use it. If you intend to replace
                laptops every three years, their useful life is three years even though they might
                run for eight.
              </p>
              <SimpleTable
                headers={["Factor", "Effect on life", "Why"]}
                rows={usefulLifeFactors}
              />
              <p className="mt-6 text-base leading-7 text-slate-950">
                These ranges reflect common commercial practice rather than any rule, and they are
                a starting point for your own judgement:
              </p>
              <SimpleTable
                headers={["Asset", "Often used", "Reasoning"]}
                rows={lifeExamples}
              />
            </section>

            <section className="mt-12">
              <SectionHeading id="salvage-value">
                Estimating salvage value
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Ask one question: at the end of the period above, what could I realistically expect
                somebody to pay me for this?
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                For a great many business assets the honest answer is nothing. Computers,
                phones, and specialised equipment usually reach the end of their useful life with
                no meaningful resale value, so zero is both realistic and the conservative choice.
                Vehicles are the common exception, since there is an active second-hand market.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Note the direction of the effect. A higher salvage value means a smaller
                depreciable amount, which means a{" "}
                <strong>lower</strong> annual charge and a higher reported profit. If you find
                yourself reaching for an optimistic salvage figure, be aware that is what it does.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                When the amount is small and you are genuinely unsure, zero is easy to justify and
                easy to apply consistently.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="book-value">
                What book value is not
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Book value is cost minus accumulated depreciation. Three misreadings of that figure
                cause most of the confusion.
              </p>
              <div className="mt-8 space-y-10">
                {bookValuePoints.map((point) => (
                  <div className="scroll-mt-28" id={point.id} key={point.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {point.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-950">{point.summary}</p>
                    <p className="mt-3 text-base leading-7 text-slate-950">{point.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-base leading-7 text-slate-950">
                Because depreciation shrinks the asset figures on the balance sheet, it also lifts
                return on assets over time. That is worth remembering when{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/guides/what-is-a-good-financial-ratio"
                >
                  judging whether a ratio is good
                </Link>
                , because two identical businesses with different asset ages will not look alike.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="capital-allowances">
                Why LHDN ignores your depreciation figure
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                This surprises most Malaysian business owners the first time they meet it.
                Accounting depreciation is <strong>not deductible</strong> for Malaysian income
                tax. The figure you carefully calculated does not reduce your tax bill.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Instead, depreciation is added back when accounting profit is reconciled to taxable
                income, and relief is claimed through{" "}
                <strong>capital allowances</strong> under Schedule 3 of the Income Tax Act 1967.
                These follow their own rules and their own rates.
              </p>
              <SimpleTable
                headers={["", "Accounting depreciation", "Capital allowances"]}
                rows={[
                  ["Purpose", "Spread cost across the years used", "Grant tax relief on qualifying assets"],
                  ["Who sets the rate", "You do, through your estimates", "Prescribed by asset category"],
                  ["Salvage value", "Reduces the depreciable amount", "Not applied in the same way"],
                  ["Effect on tax", "None, it is added back", "This is what reduces taxable income"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Broadly, a qualifying asset can attract an initial allowance in the year it is
                acquired plus an annual allowance thereafter, with the annual rate depending on the
                asset category. The result is that the same machine can carry one number in your
                accounts and a different number in your tax computation, and both are correct for
                their own purpose.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Rates, eligibility, and asset categories change and depend on the specific asset.
                Confirm the treatment with current LHDN guidance or a qualified tax agent before
                relying on it for a tax computation.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="example">
                Worked example, and how much the estimates matter
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A machine costs RM 10,000, is expected to be used for five years, and to be worth
                RM 1,000 at the end. The depreciable amount is RM 9,000, so the annual charge is
                RM 1,800, or RM 150 a month.
              </p>
              <SimpleTable
                headers={["Year", "Depreciation (RM)", "Accumulated (RM)", "Book value (RM)"]}
                rows={[
                  ["1", "1,800", "1,800", "8,200"],
                  ["2", "1,800", "3,600", "6,400"],
                  ["3", "1,800", "5,400", "4,600"],
                  ["4", "1,800", "7,200", "2,800"],
                  ["5", "1,800", "9,000", "1,000"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The schedule ends exactly at the salvage value, which is the check that the numbers
                were applied correctly. Now change one estimate at a time and watch what happens.
              </p>
              <SimpleTable
                headers={["Change", "New annual charge", "Difference"]}
                rows={[
                  ["Original estimates", "RM 1,800", "-"],
                  ["Salvage value set to zero", "RM 2,000", "About 11 percent higher"],
                  ["Useful life cut to 3 years", "RM 3,000", "About 67 percent higher"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Useful life moves the answer far more than salvage value does. If you are going to
                spend care on one of the two estimates, spend it there. The{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/depreciation-calculator"
                >
                  depreciation calculator
                </Link>{" "}
                makes this easy to test: change one input, see the annual and monthly charge move,
                and settle on assumptions you can defend.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Before you record depreciation</SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide explains general accounting concepts for learning and review. It is not
                accounting or tax advice for a specific business, and the Malaysian tax treatment
                described should be confirmed with current LHDN guidance or a qualified tax agent.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Test your two estimates
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Enter cost, salvage value, and useful life to see the annual and monthly
                    charge, then change one input to see how sensitive the answer is.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/financial-ratio-calculator"
                  >
                    Financial Ratio Calculator
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/depreciation-calculator"
                  >
                    Depreciation Calculator
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Depreciation FAQs"
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
