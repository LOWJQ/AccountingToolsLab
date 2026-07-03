import { DebitCreditChecker } from "@/components/calculators/DebitCreditChecker";
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
  title: "Debit/Credit Checker | Know Whether to Debit or Credit",
  description:
    "Use this free debit and credit checker to find out whether to debit or credit an account based on the account type and whether it increases or decreases.",
  path: "/tools/debit-credit-checker"
});

const debitCreditFaqs = [
  {
    question: "What is a debit?",
    answer:
      "A debit is the left side of an accounting entry. It increases assets, expenses, and dividends or drawings."
  },
  {
    question: "What is a credit?",
    answer:
      "A credit is the right side of an accounting entry. It increases liabilities, equity, and revenue."
  },
  {
    question: "Do debits always increase accounts?",
    answer:
      "No. Debits increase some accounts and decrease others. It depends on the account type."
  },
  {
    question: "Which accounts increase with debits?",
    answer: "Assets, expenses, and dividends or drawings increase with debits."
  },
  {
    question: "Which accounts increase with credits?",
    answer: "Liabilities, equity, and revenue increase with credits."
  },
  {
    question: "Can this checker help with accounting homework?",
    answer:
      "Yes. It can help you check the direction of an account change, but you should still explain your reasoning."
  }
];

const checkerSteps = [
  "Select the account type you want to review.",
  "Choose whether the account is increasing or decreasing.",
  "See whether you should debit or credit the account.",
  "Review the short explanation and normal balance shown with the result."
];

const checkerBenefits = [
  "Quickly check whether to debit or credit an account.",
  "Helps with homework and journal entry practice.",
  "Clarifies normal balance and account direction rules.",
  "Useful before moving on to journal entry or trial balance work.",
  "Helps reduce beginner mistakes in double-entry accounting."
];

const whenToUseItems = [
  "Check accounting homework when you need to confirm debit or credit treatment.",
  "Practice journal entry logic before writing a full transaction.",
  "Review bookkeeping changes and make sure the account direction is correct.",
  "Learn the patterns behind double-entry accounting in a simple way.",
  "Recheck transaction treatment before moving on to a journal entry checker or trial balance."
];

const relatedTools = [
  {
    href: "/tools/accounting-equation-calculator",
    icon: toolIcons.accountingEquation,
    label: "Accounting Equation Calculator"
  },
  {
    href: "/tools/trial-balance-calculator",
    icon: toolIcons.trialBalance,
    label: "Trial Balance Calculator"
  },
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Create a PDF Invoice"
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

export default function DebitCreditCheckerPage() {
  const pageUrl = `${siteConfig.url}/tools/debit-credit-checker`;

  return (
    <ToolPageLayout eyebrow="Accounting Checker">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Debit/Credit Checker", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Debit/Credit Checker"
        url={pageUrl}
      />
      <FAQJsonLd faqs={debitCreditFaqs} />

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
          <li className="font-medium text-slate-700">Debit/Credit Checker</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Debit/Credit Checker
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Choose an account type and whether it increases or decreases to see whether you should
          debit or credit the account.
        </p>
      </div>

      <DebitCreditChecker />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Check debit or credit treatment in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {checkerSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this debit/credit checker?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {checkerBenefits.map((benefit) => (
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
          When to use this debit and credit checker
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
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          href="/guides/debit-vs-credit"
        >
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium leading-7 text-black">Debit and credit guide</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Debit vs Credit
            </h3>
            <p className="mt-2 max-w-3xl text-base leading-7 text-black">
              Learn debit and credit rules, normal balances, beginner examples, and how to know
              whether to debit or credit an account.
            </p>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
          />
        </Link>
      </section>

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={debitCreditFaqs} title="Debit/Credit Checker FAQs" />
      </section>
    </ToolPageLayout>
  );
}
