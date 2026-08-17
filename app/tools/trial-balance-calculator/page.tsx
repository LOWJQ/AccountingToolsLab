import { TrialBalanceCalculator } from "@/components/calculators/TrialBalanceCalculator";
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
  title: "Free Trial Balance Calculator | Trial Balance Generator",
  description:
    "Use this free trial balance calculator to total debit and credit balances, generate a simple trial balance worksheet, and find the difference instantly.",
  path: "/tools/trial-balance-calculator"
});

const trialBalanceFaqs = [
  {
    question: "What is a trial balance calculator?",
    answer:
      "A trial balance calculator helps total debit and credit balances in an accounting worksheet so you can quickly see whether the trial balance is balanced."
  },
  {
    question: "Can I use this as a trial balance generator?",
    answer:
      "Yes. Enter account names and debit or credit balances, then the tool generates a simple trial balance layout with total debits, total credits, the difference, and a balanced or unbalanced status."
  },
  {
    question: "How do I calculate trial balance in accounting?",
    answer:
      "List each ledger account balance, place each amount in either the debit or credit column, add the debit column, add the credit column, and compare the totals. A trial balance is balanced when total debits equal total credits."
  },
  {
    question: "Why might a trial balance not balance?",
    answer:
      "A trial balance may not balance because of missing entries, wrong-side posting, duplicated amounts, typing mistakes, or balances taken from different periods."
  },
  {
    question: "Does a balanced trial balance mean there are no errors?",
    answer:
      "No. A balanced trial balance means total debit and credit amounts agree, but classification mistakes, omitted explanations, or posting errors can still exist."
  },
  {
    question: "What is the difference between debit and credit in a trial balance?",
    answer:
      "Debit and credit are the two sides used to record account balances. In a trial balance, each account amount is placed on one side so the totals can be checked against each other."
  },
  {
    question: "When should I use a trial balance calculator?",
    answer:
      "Use a trial balance calculator before preparing financial statements, after posting ledger balances, or whenever you want to review whether your debit and credit totals agree."
  }
];

const trialBalanceSteps = [
  "Enter an account name for each ledger balance you want to check.",
  "Type the amount in either the debit or credit column for that row.",
  "Review the running totals to see whether the trial balance is balanced.",
  "Use the difference shown to spot entries that may need correction.",
  "Add or remove rows as needed until your account list matches your worksheet."
];

const trialBalanceBenefits = [
  "Quickly check whether total debits equal total credits.",
  "Simple worksheet layout for students and small businesses.",
  "Helps identify missing, duplicate, or incorrect entries.",
  "Useful before preparing financial statements.",
  "Supports accurate bookkeeping and reporting."
];

const commonChecks = [
  "Look for missing entries if an account balance was left out of the worksheet.",
  "Check for wrong-side posting when a debit is entered as a credit or the reverse.",
  "Review duplicate amounts that may have been entered twice by mistake.",
  "Compare the unbalanced totals and difference to narrow down where to investigate first."
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Invoice Generator"
  },
  {
    href: "/tools/financial-ratio-calculator",
    icon: toolIcons.financialRatio,
    label: "Financial Ratio Calculator"
  },
  {
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow,
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function TrialBalanceCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/trial-balance-calculator`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Trial Balance Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Trial Balance Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={trialBalanceFaqs} />
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
          <li className="font-medium text-slate-700">Trial Balance Calculator</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Free Trial Balance Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Enter account balances in the debit or credit column to generate a clean trial balance
          worksheet layout, total both sides, and check whether the trial balance is balanced.
        </p>
      </div>
      <TrialBalanceCalculator />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Calculate a trial balance in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {trialBalanceSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this trial balance calculator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {trialBalanceBenefits.map((benefit) => (
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
            Common trial balance checks
          </h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-black">
            {commonChecks.map((check) => (
              <li className="pl-1" key={check}>
                {check}
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

      <RelatedGuideCard eyebrow="Trial balance guide" slug="errors-not-revealed-by-a-trial-balance" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={trialBalanceFaqs} title="Trial Balance Calculator FAQs" />
      </section>
    </ToolPageLayout>
  );
}
