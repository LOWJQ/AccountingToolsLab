import { DepreciationCalculator } from "@/components/calculators/DepreciationCalculator";
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
  title: "Depreciation Calculator | Straight-Line Depreciation",
  description:
    "Use this free depreciation calculator to calculate straight-line depreciation expense from asset cost, salvage value, and useful life.",
  path: "/tools/depreciation-calculator"
});

const depreciationFaqs = [
  {
    question: "What is depreciation?",
    answer:
      "Depreciation is the process of spreading an asset's cost over the years it is expected to be used."
  },
  {
    question: "What is straight-line depreciation?",
    answer:
      "Straight-line depreciation records the same depreciation expense each year over an asset's useful life."
  },
  {
    question: "How do you calculate annual depreciation?",
    answer:
      "Subtract salvage value from asset cost, then divide the result by the useful life in years."
  },
  {
    question: "What is salvage value?",
    answer: "Salvage value is the estimated value of the asset at the end of its useful life."
  },
  {
    question: "What is useful life?",
    answer:
      "Useful life is the number of years an asset is expected to provide value to the business."
  },
  {
    question: "Can this calculator help with accounting homework?",
    answer:
      "Yes. It can help check simple straight-line depreciation calculations, but you should still show your working."
  }
];

const depreciationSteps = [
  "Enter the asset cost assigned to the fixed asset.",
  "Add the expected salvage value at the end of its useful life.",
  "Enter the useful life in years to calculate annual depreciation expense.",
  "Review the straight-line depreciation result and summary instantly."
];

const depreciationBenefits = [
  "Plan fixed asset costs over time with a simple straight-line depreciation estimate.",
  "Check accounting homework that uses asset cost, salvage value, and useful life.",
  "Review bookkeeping entries tied to depreciation expense.",
  "Estimate annual depreciation expense for budgeting or internal review.",
  "Support simple financial reporting for assets that use straight-line depreciation."
];

const whenToUseItems = [
  "Plan fixed asset costs over time with a simple straight-line depreciation estimate.",
  "Check accounting homework that uses asset cost, salvage value, and useful life.",
  "Review bookkeeping entries tied to depreciation expense.",
  "Estimate annual depreciation expense for budgeting or internal review.",
  "Support simple financial reporting for assets that use straight-line depreciation."
];

const relatedTools = [
  {
    href: "/tools/financial-ratio-calculator",
    icon: toolIcons.financialRatio,
    label: "Financial Ratio Calculator"
  },
  {
    href: "/tools/trial-balance-calculator",
    icon: toolIcons.trialBalance,
    label: "Trial Balance Calculator"
  },
  {
    href: "/tools/accounting-equation-calculator",
    icon: toolIcons.accountingEquation,
    label: "Accounting Equation Calculator"
  },
  {
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow,
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function DepreciationCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/depreciation-calculator`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Depreciation Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Depreciation Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={depreciationFaqs} />

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
          <li className="font-medium text-slate-700">Depreciation Calculator</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Depreciation Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Calculate straight-line depreciation from asset cost, salvage value, and useful life.
        </p>
      </div>

      <DepreciationCalculator />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Calculate depreciation in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {depreciationSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this depreciation calculator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {depreciationBenefits.map((benefit) => (
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
          When to use this depreciation calculator
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

      <RelatedGuideCard eyebrow="Depreciation guide" slug="straight-line-depreciation-explained" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={depreciationFaqs} title="Depreciation Calculator FAQs" />
      </section>
    </ToolPageLayout>
  );
}
