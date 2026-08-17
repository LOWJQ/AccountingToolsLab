import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Which Costs Are Fixed and Which Are Variable?";
const guidePath = "/guides/fixed-vs-variable-costs";
const pageDescription =
  "One question sorts almost every cost, and getting it wrong is why most break-even numbers are too optimistic. Here is how to classify costs and use them properly.";

export const metadata = createMetadata({
  title: pageTitle,
  description:
    "Sort any cost with one question. Learn to classify fixed, variable, and semi-variable costs, split mixed bills, and get a break-even number you can trust.",
  path: guidePath
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Why it matters", href: "#why-it-matters" },
  { label: "Key terms", href: "#key-terms" },
  { label: "Sorting your costs", href: "#sorting" },
  { label: "Splitting mixed costs", href: "#semi-variable" },
  { label: "Four classification traps", href: "#traps" },
  { label: "Using them for break-even", href: "#break-even" },
  { label: "Classification checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Fixed cost",
    meaning:
      "A cost that stays the same in total whether you sell one unit or a thousand. Rent is the clearest example: the landlord charges the same amount on a quiet month."
  },
  {
    term: "Variable cost",
    meaning:
      "A cost that rises and falls in total with the number of units sold. Materials are the clearest example: no sales means no materials used."
  },
  {
    term: "Semi-variable cost",
    meaning:
      "Also called a mixed cost. It has a fixed base plus a usage component, such as an electricity bill with a standing charge plus consumption."
  },
  {
    term: "Contribution margin",
    meaning:
      "Selling price per unit minus variable cost per unit. It is the amount each sale contributes towards covering fixed costs, and profit once they are covered."
  },
  {
    term: "Break-even point",
    meaning:
      "The sales level where total revenue exactly equals total costs. Profit at this point is zero, which is not the same as the business being comfortable."
  },
  {
    term: "Relevant range",
    meaning:
      "The activity range over which a fixed cost genuinely stays fixed. Outside it, fixed costs step up, such as when you need a second unit of premises."
  },
  {
    term: "Direct cost",
    meaning:
      "A cost traceable to a specific product or job. Direct and indirect describe traceability, not behaviour, so a direct cost is not automatically variable."
  },
  {
    term: "Margin of safety",
    meaning:
      "How far current or forecast sales sit above the break-even point. It shows how much sales could fall before the business starts making a loss."
  }
] as const;

const sortingTable = [
  ["Shop or office rent", "Fixed", "Same amount whether you sell nothing or everything"],
  ["Raw materials", "Variable", "One more unit made means more material used"],
  ["Packaging", "Variable", "Each unit sold needs its own packaging"],
  ["Sales commission", "Variable", "Paid as a share of each sale"],
  ["Payment gateway fees", "Variable", "Charged per transaction"],
  ["Salaried admin staff", "Fixed", "Paid the same regardless of volume"],
  ["Hourly staff scaling with orders", "Variable", "Hours rise and fall with demand"],
  ["Insurance premium", "Fixed", "Set annually, unrelated to volume"],
  ["Electricity", "Semi-variable", "Standing charge plus usage"],
  ["Mobile or internet plan", "Semi-variable", "Base plan plus overage"],
  ["Depreciation of equipment", "Fixed", "Charged by time, not by units produced"]
] as const;

const traps = [
  {
    id: "owner-salary",
    name: "1. Leaving your own salary out of fixed costs",
    summary: "The most common reason a break-even number looks reassuring and is not.",
    example:
      "A business with RM 5,150 of other fixed costs and RM 26 contribution per unit breaks even at 199 units. Add the owner's RM 4,000 salary and the real figure is 352 units.",
    why: "That is roughly 43 percent more sales needed than the original number suggested. If you work in the business, your time has a cost, and leaving it out means the break-even point only covers everyone except you.",
    fix: "Include a realistic market salary for your own role in fixed costs, even if you currently take drawings instead of a wage."
  },
  {
    id: "semi-as-fixed",
    name: "2. Treating semi-variable costs as entirely fixed",
    summary: "Lumping a mixed bill into fixed costs understates how fast costs grow.",
    example:
      "Treating a whole electricity bill as fixed hides the fact that part of it rises with every unit produced.",
    why: "The usage portion belongs in variable cost per unit. Leaving it in fixed costs overstates contribution margin, which makes each sale look more profitable than it is and pushes the break-even estimate too low.",
    fix: "Split mixed costs into their fixed base and usage rate using the method in the next section."
  },
  {
    id: "depreciation-in-unit-cost",
    name: "3. Putting depreciation or overhead into variable cost per unit",
    summary: "This is the opposite error and makes the business look worse than it is.",
    example:
      "Adding a share of monthly depreciation and rent to each unit inflates variable cost per unit and shrinks contribution margin.",
    why: "Depreciation is charged by time, not by units sold, so it is a fixed cost. Allocating overheads per unit mixes an arbitrary spread into a figure that should only contain costs genuinely caused by one more sale.",
    fix: "Ask whether the cost would disappear if you sold one fewer unit. If it would not, it is fixed."
  },
  {
    id: "direct-vs-variable",
    name: "4. Assuming direct costs are always variable",
    summary: "Direct versus indirect is a different question from fixed versus variable.",
    example:
      "A supervisor employed full-time on one product line is a direct cost of that line, but the salary does not change with units produced, so it is fixed.",
    why: "Direct and indirect describe whether a cost can be traced to a product. Fixed and variable describe how a cost behaves with volume. A cost can be direct and fixed, or indirect and variable.",
    fix: "Classify for break-even purposes on behaviour only. Ignore traceability when filling in the calculator."
  }
] as const;

const checklist = [
  "I asked of every cost whether it changes when I sell one more unit.",
  "I included a realistic salary for my own role in fixed costs.",
  "I split semi-variable bills into a fixed base and a usage rate.",
  "I kept depreciation and rent out of variable cost per unit.",
  "I classified on behaviour rather than on whether a cost is traceable.",
  "I checked my fixed costs are still valid at the sales level I am planning for.",
  "I used a consistent period for fixed costs and the sales target.",
  "I recalculated after any change in rent, wages, or supplier pricing."
] as const;

const sidebarGuides = [
  {
    href: "/guides/profitable-but-no-cash",
    label: "Why Is My Business Profitable but I Have No Cash?"
  },
  {
    href: "/guides/straight-line-depreciation-explained",
    label: "Straight-Line Depreciation: The Two Numbers You Guess"
  },
  {
    href: "/guides/what-is-a-good-financial-ratio",
    label: "Is My Current Ratio Good?"
  }
] as const;

const faqs = [
  {
    question: "Is a salary a fixed or variable cost?",
    answer:
      "It depends on how the person is paid. A salaried employee who receives the same amount regardless of sales is a fixed cost. Hourly staff whose hours rise and fall with demand, or staff paid by commission or piece rate, are variable. Many businesses have both, and the two should be separated rather than averaged."
  },
  {
    question: "Are fixed costs the same as indirect costs?",
    answer:
      "No. Fixed and variable describe how a cost behaves when volume changes. Direct and indirect describe whether a cost can be traced to a specific product or job. A supervisor dedicated to one product line is direct and fixed, while a shared delivery charge can be indirect and variable."
  },
  {
    question: "What is the difference between contribution margin and gross profit?",
    answer:
      "Contribution margin subtracts only variable costs from revenue, so it isolates what each extra sale contributes towards fixed costs. Gross profit subtracts cost of goods sold, which usually includes some fixed production costs. They are calculated differently and are not interchangeable."
  },
  {
    question: "Do fixed costs stay fixed forever?",
    answer:
      "Only within a relevant range. Fixed costs step up once you outgrow current capacity, such as renting a second unit or hiring another supervisor. A break-even figure is only valid for the range of activity your current fixed costs actually support."
  },
  {
    question: "What is the margin of safety?",
    answer:
      "The margin of safety is the gap between your expected sales and your break-even point. If break-even is 352 units and you expect to sell 500, the margin of safety is 148 units, or about 30 percent. It shows how far sales could fall before the business makes a loss."
  },
  {
    question: "Does the break-even calculator handle semi-variable costs?",
    answer:
      "Not directly, because it takes a single fixed cost total and a single variable cost per unit. Split any mixed cost yourself first, then add the fixed base to your fixed cost total and the usage rate to your variable cost per unit. The calculator then works correctly."
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

export default function FixedVsVariableCostsGuidePage() {
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
          datePublished: "2026-08-17",
          dateModified: "2026-08-17",
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
                Updated on 17 August 2026 <span aria-hidden="true">-</span> 10 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">
                Quick answer: one question sorts almost every cost
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Ask this about each cost:{" "}
                <strong>
                  if I sold one more unit this month, would this cost go up?
                </strong>
              </p>
              <ul className="mt-6 grid gap-3 text-base leading-7 text-slate-950">
                <li className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>
                    <strong>Yes, it goes up.</strong> Variable cost. It belongs in your variable
                    cost per unit.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>
                    <strong>No, it stays the same.</strong> Fixed cost. It belongs in your monthly
                    fixed cost total.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>
                    <strong>Partly.</strong> Semi-variable. Split it, then put each part in the
                    right place.
                  </span>
                </li>
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Note the wording: does the cost change <em>in total</em>. Fixed costs per unit fall
                as you sell more, which trips people up, but the total does not move.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="why-it-matters">
                Why misclassifying costs ruins the answer
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Break-even is fixed costs divided by contribution margin per unit. Both parts of
                that fraction depend on classification, so a misplaced cost does not shift the
                answer slightly. It moves the numerator and the denominator at once.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Put a variable cost into fixed costs and you overstate contribution margin, making
                every sale look more profitable than it is. Put a fixed cost into variable cost per
                unit and you do the reverse, making a viable product look hopeless. Either way the
                pricing decision that follows is built on a number that was never right.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                This is also why lumping everything into one pile called &quot;expenses&quot; makes
                break-even impossible to calculate at all.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms in plain English</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These come up whenever costs are split for planning or pricing.
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
              <SectionHeading id="sorting">Sorting common business costs</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Use this as a starting point rather than a rule. The same cost can behave
                differently in different businesses, so always apply the one-more-unit test to your
                own situation.
              </p>
              <SimpleTable
                headers={["Cost", "Usually", "Reason"]}
                rows={sortingTable}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Depreciation is worth a second look. It is fixed here because it is charged by
                time, and the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/depreciation-calculator"
                >
                  depreciation calculator
                </Link>{" "}
                will give you the annual amount to divide across your months.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="semi-variable">
                Splitting a semi-variable cost
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Mixed costs are the ones people give up on. The simplest reliable method uses your
                highest and lowest activity months, which is why it is called the high-low method.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Say your electricity bill looked like this:
              </p>
              <SimpleTable
                headers={["Month", "Units produced", "Electricity bill (RM)"]}
                rows={[
                  ["Quietest month", "200", "350"],
                  ["Busiest month", "500", "650"]
                ]}
              />
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-950">
                <p>
                  <strong>Step 1. Find the variable rate per unit.</strong> Divide the change in
                  cost by the change in units: (650 - 350) / (500 - 200) = 300 / 300 = RM 1.00 per
                  unit.
                </p>
                <p>
                  <strong>Step 2. Find the fixed base.</strong> Take either month and remove the
                  variable part: 350 - (200 x RM 1.00) = RM 150.
                </p>
                <p>
                  <strong>Step 3. Check it against the other month.</strong> 650 - (500 x RM 1.00)
                  = RM 150. The two agree, so the split is consistent.
                </p>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                The RM 150 goes into fixed costs and the RM 1.00 goes into variable cost per unit.
                Repeat for every mixed bill you have.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="traps">Four traps that skew the result</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These four account for most wrong break-even figures. The first is by far the most
                common.
              </p>
              <div className="mt-8 space-y-10">
                {traps.map((trap) => (
                  <div className="scroll-mt-28" id={trap.id} key={trap.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {trap.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-950">{trap.summary}</p>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                        Example
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-950">{trap.example}</p>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-950">
                      <span className="font-semibold">Why it matters. </span>
                      {trap.why}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">What to do. </span>
                      {trap.fix}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="break-even">
                Worked example: turning sorted costs into a break-even point
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A small product business sells at RM 50 per unit. After classifying everything and
                splitting the electricity bill, the monthly picture looks like this.
              </p>
              <SimpleTable
                headers={["Fixed costs per month", "RM"]}
                rows={[
                  ["Rent", "3,000"],
                  ["Owner salary", "4,000"],
                  ["Admin staff", "1,800"],
                  ["Insurance", "200"],
                  ["Electricity, fixed base", "150"],
                  ["Total fixed costs", "9,150"]
                ]}
              />
              <SimpleTable
                headers={["Variable cost per unit", "RM"]}
                rows={[
                  ["Materials", "18"],
                  ["Packaging", "2"],
                  ["Sales commission", "3"],
                  ["Electricity, usage rate", "1"],
                  ["Total variable cost per unit", "24"]
                ]}
              />
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-950">
                <p>
                  <strong>Contribution margin per unit</strong> = RM 50 - RM 24 = RM 26. Each sale
                  puts RM 26 towards fixed costs.
                </p>
                <p>
                  <strong>Break-even units</strong> = RM 9,150 / RM 26 = 351.9, so 352 whole units.
                </p>
                <p>
                  <strong>Break-even sales</strong> = 352 x RM 50 = RM 17,600 of revenue per month.
                </p>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Now the contrast that matters. Leave the owner salary out and fixed costs drop to
                RM 5,150, giving a break-even of 199 units. That is 43 percent fewer sales than the
                business actually needs, and it is the version most people calculate first.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Enter the three figures into the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/break-even-calculator"
                >
                  break-even calculator
                </Link>{" "}
                to get contribution margin, break-even units, and break-even sales without doing
                the arithmetic yourself. Remember that break-even means zero profit, so treat it as
                the floor rather than the target.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Classification checklist</SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide explains general costing concepts for learning and planning. It is not
                accounting or financial advice for a specific business.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Costs sorted? Work out your break-even
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Enter fixed costs, selling price, and variable cost per unit to see
                    contribution margin, break-even units, and break-even sales.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/cash-flow-calculator"
                  >
                    Cash Flow Calculator
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/break-even-calculator"
                  >
                    Break-even Calculator
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Fixed and Variable Cost FAQs"
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
