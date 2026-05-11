import { FinancialRatioCalculator } from "@/components/calculators/FinancialRatioCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Financial Ratio Calculator | Calculate Common Accounting Ratios",
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

export default function FinancialRatioCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/financial-ratio-calculator`;

  return (
    <ToolPageLayout eyebrow="Accounting Calculator">
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Financial Ratio Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Calculate common financial ratios for beginner accounting, business review, and
          homework checks.
        </p>
      </div>
      <FinancialRatioCalculator />
      <RelatedLinks
        title="Learn financial ratio basics"
        links={[
          {
            title: "Financial Ratios for Beginners",
            href: "/guides/financial-ratios-for-beginners",
            description: "Learn common ratio formulas, examples, and what the results can show."
          },
          {
            title: "Cash Flow vs Profit",
            href: "/guides/cash-flow-vs-profit",
            description: "Understand why profitability and cash movement answer different questions."
          },
          {
            title: "Break-even Point Explained",
            href: "/guides/break-even-point-explained",
            description: "Connect costs, sales, contribution margin, and break-even targets."
          },
          {
            title: "Straight-Line Depreciation Explained",
            href: "/guides/straight-line-depreciation-explained",
            description: "Review depreciation expense and asset book value before using asset-based ratios."
          }
        ]}
      />
      <FAQSection faqs={financialRatioFaqs} title="Financial Ratio Calculator FAQs" />
    </ToolPageLayout>
  );
}
