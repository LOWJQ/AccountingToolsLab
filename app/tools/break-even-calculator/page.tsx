import { BreakEvenCalculator } from "@/components/calculators/BreakEvenCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

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

const breakEvenSteps = [
  "Enter fixed costs such as rent, salaries, or other costs that do not change with each unit sold.",
  "Add the selling price per unit you expect to charge for each product or service.",
  "Enter the variable cost per unit so the calculator can work out contribution margin.",
  "Review the result to see break-even units, minimum whole units, contribution margin per unit, and break-even sales."
];

const breakEvenBenefits = [
  "Helps set pricing and sales targets with more confidence.",
  "Shows how many units must be sold before covering costs.",
  "Helps compare selling price and variable cost.",
  "Useful for product planning and small business decisions.",
  "Free to use with no sign-up required."
];

const whenToUseItems = [
  "Use it when testing pricing decisions to see how a higher or lower selling price changes the break-even point.",
  "Use it for product planning when comparing whether a product can support its fixed costs.",
  "Check costs when you want to review whether variable cost per unit is too close to the selling price.",
  "Set sales targets by using break-even units and break-even sales as a starting benchmark.",
  "Use it for small business planning before launching offers, promotions, or new services."
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Create a PDF Invoice"
  },
  {
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow,
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools/sst-calculator-malaysia",
    icon: toolIcons.sst,
    label: "SST Calculator Malaysia"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function BreakEvenCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/break-even-calculator`;

  return (
    <ToolPageLayout>
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
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="transition hover:text-slate-900" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <Link className="transition hover:text-slate-900" href="/tools">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="font-medium text-slate-700">Break-even Calculator</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Break-even Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Calculate how many units or how much sales revenue a business needs to cover its fixed
          and variable costs.
        </p>
      </div>
      <BreakEvenCalculator />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Calculate your break-even point in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {breakEvenSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this break-even calculator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {breakEvenBenefits.map((benefit) => (
              <li className="flex items-start gap-3" key={benefit}>
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            When to use this break-even calculator
          </h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-black">
            {whenToUseItems.map((item) => (
              <li className="pl-1" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Related Tools
          </h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-7 text-black transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                href={tool.href}
                key={tool.href}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-700" />
                <span className="min-w-0 flex-1">{tool.label}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Related Guide Article
        </h2>
        <Link
          className="group mt-5 flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          href="/guides/break-even-point-explained"
        >
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium leading-7 text-black">Break-even guide</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Break-even Point Explained
            </h3>
            <p className="mt-2 max-w-3xl text-base leading-7 text-black">
              Learn what break-even point means, how to calculate break-even units and sales,
              contribution margin, examples, and common beginner mistakes.
            </p>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
          />
        </Link>
      </section>

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={breakEvenFaqs} title="Break-even Calculator FAQs" />
      </section>

    </ToolPageLayout>
  );
}
