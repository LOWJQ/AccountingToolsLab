import { AccountingEquationCalculator } from "@/components/calculators/AccountingEquationCalculator";
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
  title: "Accounting Equation Calculator | Assets and Equity",
  description:
    "Use this free accounting equation calculator to solve for assets, liabilities, or equity using Assets = Liabilities + Equity.",
  path: "/tools/accounting-equation-calculator"
});

const accountingEquationFaqs = [
  {
    question: "What is the accounting equation?",
    answer:
      "The accounting equation is Assets = Liabilities + Equity. It shows how a business's resources are financed."
  },
  {
    question: "How do you calculate assets?",
    answer: "Add liabilities and equity together. Assets = Liabilities + Equity."
  },
  {
    question: "How do you calculate liabilities?",
    answer: "Subtract equity from assets. Liabilities = Assets - Equity."
  },
  {
    question: "How do you calculate equity?",
    answer: "Subtract liabilities from assets. Equity = Assets - Liabilities."
  },
  {
    question: "Can this calculator help with accounting homework?",
    answer:
      "Yes. It can help you check basic accounting equation problems, but you should still show your own working."
  },
  {
    question: "Why must the accounting equation balance?",
    answer:
      "It balances because every business resource is funded either by amounts owed to others or by the owner's claim."
  }
];

const equationSteps = [
  "Select Assets, Liabilities, or Equity at the top of the calculator.",
  "Enter the two known amounts shown for that selection.",
  "Review the instant result and formula summary below the inputs.",
  "Reset the fields anytime to start a new calculation."
];

const equationBenefits = [
  "Instantly solve for assets, liabilities, or equity.",
  "Useful for homework help and accounting practice.",
  "Helps verify calculations and balance accuracy.",
  "Shows how the accounting equation works.",
  "Quick financial review for any business or project."
];

const whenToUseItems = [
  "Check homework answers for assets, liabilities, and equity questions.",
  "Practice basic accounting equation exercises and rearranged formulas.",
  "Review simple business balance checks before preparing a balance sheet.",
  "Learn how assets, liabilities, and equity relationships work in accounting.",
  "Do a quick financial review when you need to calculate assets, liabilities, or equity."
];

const relatedTools = [
  {
    href: "/tools/trial-balance-calculator",
    icon: toolIcons.trialBalance,
    label: "Trial Balance Calculator"
  },
  {
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow,
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Create a PDF Invoice"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function AccountingEquationCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/accounting-equation-calculator`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Accounting Equation Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Accounting Equation Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={accountingEquationFaqs} />
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
          <li className="font-medium text-slate-700">Accounting Equation Calculator</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Accounting Equation Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Solve for assets, liabilities, or equity using the basic accounting equation: Assets =
          Liabilities + Equity.
        </p>
      </div>

      <AccountingEquationCalculator />

      {/* Sits below the tool: someone arriving from a search for a calculator
          wants the calculator, not an essay. The wording is kept self-contained
          so it still reads correctly when an answer engine lifts it away from
          the surrounding page. */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          How do you use the accounting equation?
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          The accounting equation is Assets = Liabilities + Equity, and it holds after every
          transaction a business records. Rearranged, it gives you whichever figure is missing:
          Liabilities = Assets - Equity, and Equity = Assets - Liabilities. Enter any two of
          the three and the third follows.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          The equation shows how a business&apos;s resources are financed, not whether the
          figures behind them are right. Two sides that agree can still contain an amount
          posted to the wrong account, so treat a balanced result as arithmetic confirmed
          rather than accounts verified.
        </p>
      </section>

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Solve the accounting equation in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {equationSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this accounting equation calculator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {equationBenefits.map((benefit) => (
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
          When to use this accounting equation calculator
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

      <RelatedGuideCard eyebrow="Accounting basics guide" slug="debit-vs-credit" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection
          eyebrow=""
          faqs={accountingEquationFaqs}
          title="Accounting Equation Calculator FAQs"
        />
      </section>

    </ToolPageLayout>
  );
}
