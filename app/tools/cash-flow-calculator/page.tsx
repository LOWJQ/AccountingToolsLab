import { CashFlowCalculator } from "@/components/calculators/CashFlowCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Cash Flow Calculator | Calculate Net Cash Flow",
  description:
    "Use this free cash flow calculator to calculate net cash flow and ending cash balance from cash inflows, cash outflows, and beginning cash.",
  path: "/tools/cash-flow-calculator"
});

const cashFlowFaqs = [
  {
    question: "What is cash flow?",
    answer:
      "Cash flow is the movement of cash into and out of a business during a period."
  },
  {
    question: "How do you calculate net cash flow?",
    answer:
      "Subtract cash outflows from cash inflows. The result is net cash flow for the period."
  },
  {
    question: "What is ending cash balance?",
    answer:
      "Ending cash balance is beginning cash balance plus net cash flow."
  },
  {
    question: "Is cash flow the same as profit?",
    answer:
      "No. Profit is based on income and expenses, while cash flow focuses on cash received and cash paid."
  },
  {
    question: "What does negative cash flow mean?",
    answer:
      "Negative cash flow means cash outflows were higher than cash inflows for the period."
  },
  {
    question: "Can this calculator help with accounting homework?",
    answer:
      "Yes. It can help check simple net cash flow and ending cash balance calculations."
  }
];

export default function CashFlowCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/cash-flow-calculator`;

  return (
    <ToolPageLayout eyebrow="Business Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Cash Flow Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Cash Flow Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={cashFlowFaqs} />
      <CashFlowCalculator />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Cash flow and profit are not the same
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          If you are comparing cash movement with business performance, read{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/cash-flow-vs-profit"
          >
            cash flow vs profit
          </a>{" "}
          to understand why a business can be profitable but still short on cash.
        </p>
      </section>
      <FAQSection faqs={cashFlowFaqs} title="Cash Flow Calculator FAQs" />
    </ToolPageLayout>
  );
}
