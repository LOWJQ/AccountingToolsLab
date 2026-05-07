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
      <DepreciationCalculator />
      <FAQSection faqs={depreciationFaqs} title="Depreciation Calculator FAQs" />
    </ToolPageLayout>
  );
}
