import { DepreciationCalculator } from "@/components/calculators/DepreciationCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Calculate depreciation in a few steps
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Use this depreciation calculator to enter asset cost, salvage value, and useful life,
            then review the annual straight-line depreciation result for simple accounting checks,
            bookkeeping work, or planning.
          </p>
          <p>→ Enter the asset cost assigned to the fixed asset.</p>
          <p>→ Add the expected salvage value at the end of its useful life.</p>
          <p>→ Enter the useful life in years to calculate annual depreciation expense.</p>
          <p>→ Review the straight-line depreciation result and summary instantly.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Understand straight-line depreciation
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Straight-line depreciation spreads an asset&apos;s depreciable amount evenly across its
            useful life. This makes it one of the simplest ways to estimate annual depreciation
            expense for basic accounting and financial reporting.
          </p>
          <p>
            Asset cost is the amount assigned to the asset at the start. Salvage value is the
            estimated value left at the end of use. The depreciable amount is the difference
            between asset cost and salvage value.
          </p>
          <p>
            Useful life is the number of years the asset is expected to help the business. Annual
            depreciation expense is then calculated by spreading the depreciable amount evenly over
            those years.
          </p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          When to use this depreciation calculator
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>→ Plan fixed asset costs over time with a simple straight-line depreciation estimate.</p>
          <p>→ Check accounting homework that uses asset cost, salvage value, and useful life.</p>
          <p>→ Review bookkeeping entries tied to depreciation expense.</p>
          <p>→ Estimate annual depreciation expense for budgeting or internal review.</p>
          <p>→ Support simple financial reporting for assets that use straight-line depreciation.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Connect depreciation with other accounting tools
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          After using this depreciation calculator, you can continue with related tools to review
          financial performance, check balances, understand the accounting equation, and see how
          asset-related expenses connect with broader business cash activity.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
            Trial Balance Calculator
          </ButtonLink>
          <ButtonLink href="/tools/accounting-equation-calculator" variant="secondary">
            Accounting Equation Calculator
          </ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <FAQSection faqs={depreciationFaqs} title="Depreciation Calculator FAQs" />
    </ToolPageLayout>
  );
}
