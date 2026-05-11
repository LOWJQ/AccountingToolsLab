import { DepreciationCalculator } from "@/components/calculators/DepreciationCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

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
    answer:
      "Salvage value is the estimated value of the asset at the end of its useful life."
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

export default function DepreciationCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/depreciation-calculator`;

  return (
    <ToolPageLayout eyebrow="Accounting Calculator">
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Depreciation Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Calculate straight-line depreciation from asset cost, salvage value, and useful life.
        </p>
      </div>
      <DepreciationCalculator />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Learn the straight-line depreciation formula
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          If you want the full beginner explanation, read{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/straight-line-depreciation-explained"
          >
            straight-line depreciation explained
          </a>{" "}
          to review salvage value, useful life, annual depreciation expense, and common mistakes.
        </p>
      </section>
      <FAQSection faqs={depreciationFaqs} title="Depreciation Calculator FAQs" />
    </ToolPageLayout>
  );
}
