import { BreakEvenCalculator } from "@/components/calculators/BreakEvenCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Break-even Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Calculate how many units or how much sales revenue a business needs to cover its fixed
          and variable costs.
        </p>
      </div>
      <BreakEvenCalculator />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Learn the formula behind the result
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          If you want the full beginner explanation, read{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/break-even-point-explained"
          >
            break-even point explained
          </a>{" "}
          to see the formula, contribution margin, units, sales, and common mistakes.
        </p>
      </section>
      <FAQSection faqs={breakEvenFaqs} title="Break-even Calculator FAQs" />
    </ToolPageLayout>
  );
}
