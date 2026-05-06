import type { Metadata } from "next";
import { FinancialRatioCalculator } from "@/components/calculators/FinancialRatioCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Financial Ratio Calculator | Calculate Common Accounting Ratios",
  description:
    "Use this free financial ratio calculator to calculate current ratio, debt-to-equity ratio, profit margins, and return on assets."
};

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
      <FinancialRatioCalculator />
      <FAQSection faqs={financialRatioFaqs} title="Financial Ratio Calculator FAQs" />
    </ToolPageLayout>
  );
}
