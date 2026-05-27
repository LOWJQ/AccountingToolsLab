import { BreakEvenCalculator } from "@/components/calculators/BreakEvenCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Break-even Calculator | Calculate Break-even Units and Sales",
  description:
    "Use this free break-even calculator to calculate contribution margin, break-even units, and break-even sales from fixed costs, selling price, and variable cost.",
  path: "/tools/break-even-calculator"
});

const breakEvenFaqs = [
  {
    question: "What is break-even point?",
    answer:
      "Break-even point is the sales level where total revenue covers total costs, with no profit or loss."
  },
  {
    question: "How do you calculate break-even units?",
    answer:
      "Divide fixed costs by contribution margin per unit. Contribution margin is selling price per unit minus variable cost per unit."
  },
  {
    question: "How do you calculate break-even sales?",
    answer:
      "Multiply break-even units by the selling price per unit to estimate break-even sales revenue."
  },
  {
    question: "What is contribution margin?",
    answer:
      "Contribution margin is the amount each unit contributes toward covering fixed costs and then profit."
  },
  {
    question: "Does breaking even mean making a profit?",
    answer:
      "No. Breaking even means revenue covers costs. Profit starts after sales move above the break-even point."
  },
  {
    question: "Can this calculator help with business homework?",
    answer:
      "Yes. It can help check simple break-even calculations, but you should still show your formula and working."
  }
];

export default function BreakEvenCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/break-even-calculator`;

  return (
    <ToolPageLayout eyebrow="Business Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Break-even Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Break-even Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={breakEvenFaqs} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Break-even Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Calculate how many units or how much sales revenue a business needs to cover its fixed
          and variable costs.
        </p>
      </div>
      <BreakEvenCalculator />
      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Calculate your break-even point in a few steps
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            This break-even calculator helps you estimate how many units a business needs to sell,
            or how much break-even sales revenue it needs, before costs are fully covered. It uses
            fixed costs, selling price per unit, and variable cost per unit to calculate the
            break-even point in a simple format.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {[
              "Enter fixed costs such as rent, salaries, or other costs that do not change with each unit sold.",
              "Add the selling price per unit you expect to charge for each product or service.",
              "Enter the variable cost per unit so the calculator can work out contribution margin.",
              "Review the result to see break-even units, minimum whole units, contribution margin per unit, and break-even sales."
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          Understand what your break-even result means
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          Break-even units show how many units must be sold before the business covers its fixed
          costs and variable costs. Contribution margin per unit is the amount left from each sale
          after variable cost per unit is deducted. Minimum whole units round the result up to a
          practical sales target, while break-even sales show the sales revenue needed to reach
          that break-even point.
        </p>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            When to use this break-even calculator
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {[
              "Use it when testing pricing decisions to see how a higher or lower selling price changes the break-even point.",
              "Use it for product planning when comparing whether a product can support its fixed costs.",
              "Check costs when you want to review whether variable cost per unit is too close to the selling price.",
              "Set sales targets by using break-even units and break-even sales as a starting benchmark.",
              "Use it for small business planning before launching offers, promotions, or new services."
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Connect break-even planning with other accounting tools
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use related tools to connect break-even planning with invoicing, cash flow review, SST
            calculations, and business analysis when you want a clearer picture of pricing,
            collections, costs, and performance.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/invoice-generator">Free Invoice Generator Malaysia</ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools/sst-calculator-malaysia" variant="secondary">
            SST Calculator Malaysia
          </ButtonLink>
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <FAQSection faqs={breakEvenFaqs} title="Break-even Calculator FAQs" />
    </ToolPageLayout>
  );
}
