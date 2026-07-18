import { CashFlowCalculator } from "@/components/calculators/CashFlowCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

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
  },
  {
    question: "When should I use this cash flow calculator?",
    answer:
      "Use it when reviewing monthly cash movement, comparing expected inflows and outflows, or checking whether available cash is enough for upcoming payments."
  }
];

const cashFlowSteps = [
  "Enter the beginning cash balance available at the start of the period.",
  "Add cash inflows such as customer collections, cash sales, or other money received.",
  "Enter cash outflows such as supplier payments, expenses, wages, or loan repayments.",
  "Review the result to see net cash flow and the ending cash balance for the period."
];

const cashFlowBenefits = [
  "Quickly see your net cash flow for the period.",
  "Simple and easy to use for any business size.",
  "Helps monitor cash inflows and outflows.",
  "Useful for budgeting, planning, and decision making.",
  "Supports better cash management and stability."
];

const whenToUseItems = [
  "Use it for monthly cash review when you need a quick summary.",
  "Use it for small business planning before making hiring, purchasing, or payment decisions.",
  "Check invoice collections against outgoing payments to see whether cash is staying healthy.",
  "Track expenses against incoming cash to spot periods where outflows may be growing too quickly.",
  "Use it as a simple budgeting check when comparing expected inflows and outflows."
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Create a PDF Invoice"
  },
  {
    href: "/tools/sst-calculator-malaysia",
    icon: toolIcons.sst,
    label: "SST Calculator Malaysia"
  },
  {
    href: "/tools/break-even-calculator",
    icon: toolIcons.breakEven,
    label: "Break-even Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function CashFlowCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/cash-flow-calculator`;

  return (
    <ToolPageLayout>
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
          <li className="font-medium text-slate-700">Cash Flow Calculator</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Cash Flow Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Calculate net cash flow and ending cash balance from beginning cash, cash inflows, and
          cash outflows.
        </p>
      </div>
      <CashFlowCalculator />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Calculate cash flow in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {cashFlowSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this cash flow calculator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {cashFlowBenefits.map((benefit) => (
              <li className="flex items-start gap-3" key={benefit}>
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            When to use this cash flow calculator
          </h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-black">
            {whenToUseItems.map((item) => (
              <li className="pl-1" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Related Tools
          </h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Related Guide Article
        </h2>
        <Link
          className="group mt-5 flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          href="/guides/cash-flow-vs-profit"
        >
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium leading-7 text-black">Cash flow guide</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Cash Flow vs Profit
            </h3>
            <p className="mt-2 max-w-3xl text-base leading-7 text-black">
              Learn the difference between cash flow and profit, why profitable businesses can run
              out of cash, and how to check simple cash movement.
            </p>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
          />
        </Link>
      </section>

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={cashFlowFaqs} title="Cash Flow Calculator FAQs" />
      </section>

    </ToolPageLayout>
  );
}
