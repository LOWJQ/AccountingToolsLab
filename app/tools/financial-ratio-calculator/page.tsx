import { FinancialRatioCalculator } from "@/components/calculators/FinancialRatioCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Financial Ratio Calculator | Common Accounting Ratios",
  description:
    "Use this free financial ratio calculator to calculate current ratio, debt-to-equity ratio, profit margins, and return on assets.",
  path: "/tools/financial-ratio-calculator"
});

const financialRatioFaqs = [
  {
    question: "What is a financial ratio?",
    answer:
      "A financial ratio compares two numbers from financial statements to help understand performance, position, or risk."
  },
  {
    question: "What does the current ratio show?",
    answer:
      "The current ratio compares current assets with current liabilities to help review short-term liquidity."
  },
  {
    question: "What does the debt-to-equity ratio show?",
    answer:
      "The debt-to-equity ratio compares total liabilities with total equity to show how much financing comes from debt."
  },
  {
    question: "What is a good profit margin?",
    answer:
      "A good profit margin depends on the industry, business model, and time period being compared."
  },
  {
    question: "Why do financial ratios need context?",
    answer:
      "Ratios are more useful when compared with prior periods, similar businesses, or a clear business goal."
  },
  {
    question: "Can this calculator help with accounting homework?",
    answer:
      "Yes. It can help check common ratio calculations, but you should still show your formula and working."
  }
];

const ratioSteps = [
  "Choose a ratio such as current ratio, debt-to-equity ratio, or profit margin.",
  "Enter the values requested for that ratio.",
  "Review the calculated result, explanation, and formula summary.",
  "Reset the fields anytime to check another ratio quickly."
];

const ratioBenefits = [
  "Helpful for beginner accounting review.",
  "Makes common ratio formulas easier to check.",
  "Useful for homework, business analysis, and quick comparisons.",
  "Provides formula context with the result.",
  "Keeps the page simple and easy to use."
];

const whenToUseItems = [
  "Review business performance with quick ratio-based comparisons.",
  "Check homework answers for current ratio, debt-to-equity ratio, and return on assets.",
  "Run simple liquidity checks using current assets and current liabilities.",
  "Review profitability with gross profit margin and net profit margin.",
  "Compare debt levels with owner funding using debt-to-equity ratio.",
  "Support simple financial analysis before deeper reporting or discussion."
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
    href: "/tools/break-even-calculator",
    icon: toolIcons.breakEven,
    label: "Break-even Calculator"
  },
  {
    href: "/tools/trial-balance-calculator",
    icon: toolIcons.trialBalance,
    label: "Trial Balance Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function FinancialRatioCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/financial-ratio-calculator`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Financial Ratio Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Financial Ratio Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={financialRatioFaqs} />

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
          <li className="font-medium text-slate-700">Financial Ratio Calculator</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Financial Ratio Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Calculate common financial ratios for beginner accounting, business review, and
          homework checks.
        </p>
      </div>

      <FinancialRatioCalculator />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Calculate financial ratios in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {ratioSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this financial ratio calculator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {ratioBenefits.map((benefit) => (
              <li className="flex items-start gap-3" key={benefit}>
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          When to use this financial ratio calculator
        </h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-black">
          {whenToUseItems.map((item) => (
            <li className="pl-1" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Related Tools
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

      <RelatedGuideCard eyebrow="Financial ratio guide" slug="what-is-a-good-financial-ratio" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection
          eyebrow=""
          faqs={financialRatioFaqs}
          title="Financial Ratio Calculator FAQs"
        />
      </section>
    </ToolPageLayout>
  );
}
