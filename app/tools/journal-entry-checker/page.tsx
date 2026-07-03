import { JournalEntryChecker } from "@/components/calculators/JournalEntryChecker";
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
  title: "Journal Entry Checker | Check Debits and Credits",
  description:
    "Use this free journal entry checker to total debits and credits, check whether a journal entry balances, and find the difference.",
  path: "/tools/journal-entry-checker"
});

const journalEntryFaqs = [
  {
    question: "What is a journal entry?",
    answer:
      "A journal entry records the debit and credit sides of a transaction before posting it to accounts."
  },
  {
    question: "How do I know if a journal entry balances?",
    answer: "A journal entry balances when total debit amounts equal total credit amounts."
  },
  {
    question: "Does a balanced journal entry mean it is correct?",
    answer:
      "No. A balanced journal entry means the totals match, but the account choices can still be wrong."
  },
  {
    question: "Can one line have both debit and credit?",
    answer:
      "For a clear basic journal entry, one line should normally have either a debit amount or a credit amount, not both."
  },
  {
    question: "Why must total debits equal total credits?",
    answer:
      "Double-entry accounting records equal value on both sides of an entry, so total debits should equal total credits."
  },
  {
    question: "Can this checker help with accounting homework?",
    answer:
      "Yes. It can help check whether your journal entry balances, but you should still review the account choices."
  }
];

const journalEntrySteps = [
  "Enter the account name for each journal entry line.",
  "Fill in the debit amount or the credit amount for that line.",
  "Add more lines when the transaction needs multiple accounts.",
  "Review the total debits and credits, difference, and status instantly."
];

const journalEntryBenefits = [
  "Quickly confirm that total debits equal total credits.",
  "Catch math errors before posting to your books.",
  "Practice double-entry accounting with simple examples.",
  "Useful for homework, bookkeeping reviews, and exam prep."
];

const whenToUseItems = [
  "Check accounting homework that requires total debits and credits to balance.",
  "Review bookkeeping entries before posting them to accounts.",
  "Practice double-entry accounting with simple transaction examples.",
  "Recheck debit and credit totals when an entry looks incomplete or uneven.",
  "Find entry mistakes such as missing values or unbalanced lines."
];

const relatedTools = [
  {
    href: "/tools/debit-credit-checker",
    icon: toolIcons.debitCredit,
    label: "Debit/Credit Checker"
  },
  {
    href: "/tools/trial-balance-calculator",
    icon: toolIcons.trialBalance,
    label: "Trial Balance Calculator"
  },
  {
    href: "/tools/accounting-equation-calculator",
    icon: toolIcons.accountingEquation,
    label: "Accounting Equation Calculator"
  },
  {
    href: "/tools/financial-ratio-calculator",
    icon: toolIcons.financialRatio,
    label: "Financial Ratio Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function JournalEntryCheckerPage() {
  const pageUrl = `${siteConfig.url}/tools/journal-entry-checker`;

  return (
    <ToolPageLayout eyebrow="Accounting Checker">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Journal Entry Checker", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Journal Entry Checker"
        url={pageUrl}
      />
      <FAQJsonLd faqs={journalEntryFaqs} />

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
          <li className="font-medium text-slate-700">Journal Entry Checker</li>
        </ol>
      </nav>

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Journal Entry Checker
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Enter debit and credit lines to check whether total debits equal total credits in a basic
          journal entry.
        </p>
      </div>

      <JournalEntryChecker />

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Check journal entries in a few steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {journalEntrySteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this journal entry checker?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {journalEntryBenefits.map((benefit) => (
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
          When to use this journal entry checker
        </h2>
        <ul className="mt-5 space-y-3 text-base leading-7 text-black">
          {whenToUseItems.map((item) => (
            <li className="flex items-start gap-3" key={item}>
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
              <span>{item}</span>
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
          href="/guides/journal-entries-for-beginners"
        >
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium leading-7 text-black">Journal entry guide</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Journal Entries for Beginners
            </h3>
            <p className="mt-2 max-w-3xl text-base leading-7 text-black">
              Learn how journal entries work with simple debit and credit examples, common
              mistakes, and a step-by-step beginner checklist.
            </p>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
          />
        </Link>
      </section>

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="FAQ" faqs={journalEntryFaqs} title="Journal Entry Checker FAQs" />
      </section>
    </ToolPageLayout>
  );
}
