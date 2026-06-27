import { CashFlowCalculator } from "@/components/calculators/CashFlowCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideArticleSection } from "@/components/tools/RelatedGuideArticleSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
      "Cash flow is the movement of cash into and out of a business during a period. It focuses on actual cash received and cash paid, not just accounting profit."
  },
  {
    question: "How do you calculate net cash flow?",
    answer:
      "Subtract cash outflows from cash inflows. The result is net cash flow for the period."
  },
  {
    question: "What is ending cash balance?",
    answer:
      "Ending cash balance is the cash left after adding net cash flow to the beginning cash balance."
  },
  {
    question: "Is cash flow the same as profit?",
    answer:
      "No. Profit is based on income and expenses, while cash flow focuses on cash received and cash paid."
  },
  {
    question: "Why can cash flow be negative?",
    answer:
      "Cash flow can be negative when cash outflows are higher than cash inflows during the period. This can happen even if a business is making sales but has not collected the cash yet."
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
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Cash Flow Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Calculate net cash flow and ending cash balance from beginning cash, cash inflows, and
          cash outflows.
        </p>
      </div>
      <CashFlowCalculator />
      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Calculate cash flow in a few steps
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            This cash flow calculator helps you review how cash moves through a period by combining
            beginning cash balance, cash inflows, and cash outflows. It gives you a quick way to
            calculate net cash flow and ending cash balance without building a separate worksheet.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {[
              "Enter the beginning cash balance available at the start of the period.",
              "Add cash inflows such as customer collections, cash sales, or other money received.",
              "Enter cash outflows such as supplier payments, expenses, wages, or loan repayments.",
              "Review the result to see net cash flow and the ending cash balance for the period."
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          Understand your net cash flow
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          Positive cash flow means cash inflows are higher than cash outflows for the period.
          Negative cash flow means more cash left the business than came in. Ending cash balance
          shows what remains after net cash flow is added to the starting cash amount, which makes
          it useful for simple business planning, payment timing, and short-term cash decisions.
        </p>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            When to use this cash flow calculator
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {[
              "Use it for monthly cash review when you want a quick summary of cash inflows and cash outflows.",
              "Use it for small business planning before making hiring, purchasing, or payment decisions.",
              "Check invoice collections against outgoing payments to see whether cash is staying healthy.",
              "Track expenses against incoming cash to spot periods where outflows may be growing too quickly.",
              "Use it as a simple budgeting check when comparing expected inflows and outflows."
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Connect cash flow with other accounting tools
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use related tools to connect cash flow checks with invoicing, SST calculations, break-even
            planning, and business analysis when you want a clearer picture around collections,
            payments, pricing, and performance.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/invoice-generator">Free Invoice Generator Malaysia</ButtonLink>
          <ButtonLink href="/tools/sst-calculator-malaysia" variant="secondary">
            SST Calculator Malaysia
          </ButtonLink>
          <ButtonLink href="/tools/break-even-calculator" variant="secondary">
            Break-even Calculator
          </ButtonLink>
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <RelatedGuideArticleSection
        articles={[
          {
            description:
              "Learn the difference between cash flow and profit, why profitable businesses can run out of cash, and how to check simple cash movement.",
            href: "/guides/cash-flow-vs-profit",
            label: "Cash flow guide",
            title: "Cash Flow vs Profit"
          }
        ]}
        toolName="Cash Flow Calculator"
      />
      <FAQSection faqs={cashFlowFaqs} title="Cash Flow Calculator FAQs" />
    </ToolPageLayout>
  );
}
