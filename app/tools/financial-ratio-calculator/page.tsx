import { FinancialRatioCalculator } from "@/components/calculators/FinancialRatioCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
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
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Calculate financial ratios in a few steps
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Use this financial ratio calculator to choose the ratio you want, enter the required
            values, and review the result instantly for simple financial analysis, beginner
            accounting practice, or business review.
          </p>
          <p>→ Choose a ratio such as current ratio, debt-to-equity ratio, or profit margin.</p>
          <p>→ Enter the values requested for that ratio.</p>
          <p>→ Review the calculated result, explanation, and formula summary.</p>
          <p>→ Reset the fields anytime to check another ratio quickly.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Understand what each financial ratio means
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            The current ratio compares short-term assets with short-term liabilities to show
            whether a business may be able to cover near-term obligations. The debt-to-equity
            ratio compares liabilities with owner funding to show how much the business relies on
            debt versus equity.
          </p>
          <p>
            Gross profit margin shows how much of each sales amount remains after direct costs.
            Net profit margin goes further by showing how much profit remains after overall
            expenses. These profit margin measures can help you review cost control and operating
            performance.
          </p>
          <p>
            Return on assets compares profit with total assets to show how effectively a business
            is using its resources. Together, these ratios support a clearer view of liquidity,
            debt, profitability, and overall financial analysis.
          </p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          When to use this financial ratio calculator
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>→ Review business performance with quick ratio-based comparisons.</p>
          <p>→ Check homework answers for current ratio, debt-to-equity ratio, and return on assets.</p>
          <p>→ Run simple liquidity checks using current assets and current liabilities.</p>
          <p>→ Review profitability with gross profit margin and net profit margin.</p>
          <p>→ Compare debt levels with owner funding using debt-to-equity ratio.</p>
          <p>→ Support simple financial analysis before deeper reporting or discussion.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Connect ratio analysis with other accounting tools
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          After using this financial ratio calculator, you can continue with related tools to
          create business documents, review cash movement, estimate break-even targets, or check
          balances before doing broader financial analysis.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/invoice-generator" variant="secondary">
            Free Invoice Generator Malaysia
          </ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools/break-even-calculator" variant="secondary">
            Break-even Calculator
          </ButtonLink>
          <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
            Trial Balance Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <FAQSection faqs={financialRatioFaqs} title="Financial Ratio Calculator FAQs" />
    </ToolPageLayout>
  );
}
