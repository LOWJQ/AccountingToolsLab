import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title:
    "Trial Balance Explained: Meaning, Format, Examples, and Common Errors | AccountingToolsLab",
  description:
    "Learn what a trial balance is, how to prepare one, the trial balance format, examples, common errors, and why total debits should equal total credits.",
  path: "/guides/trial-balance-explained"
});

const unbalancedRows = [
  ["Cash", "RM 5,000", "-"],
  ["Accounts Receivable", "RM 2,000", "-"],
  ["Equipment", "RM 8,000", "-"],
  ["Accounts Payable", "-", "RM 3,000"],
  ["Owner's Capital", "-", "RM 10,000"],
  ["Service Revenue", "-", "RM 2,000"],
  ["Rent Expense", "RM 1,000", "-"],
  ["Total", "RM 16,000", "RM 15,000"]
];

const balancedRows = [
  ["Cash", "RM 6,000", "-"],
  ["Equipment", "RM 4,000", "-"],
  ["Rent Expense", "RM 1,000", "-"],
  ["Accounts Payable", "-", "RM 2,000"],
  ["Owner's Capital", "-", "RM 7,000"],
  ["Service Revenue", "-", "RM 2,000"],
  ["Total", "RM 11,000", "RM 11,000"]
];

const relatedTerms = [
  [
    "General Ledger",
    "Detailed record of account activity",
    "Tracks account movements"
  ],
  [
    "Trial Balance",
    "List of ending ledger balances",
    "Checks debit and credit equality"
  ],
  [
    "Balance Sheet",
    "Financial statement showing assets, liabilities, and equity",
    "Reports financial position"
  ]
];

const steps = [
  "List every ledger account.",
  "Find the ending balance of each account.",
  "Put debit balances in the debit column.",
  "Put credit balances in the credit column.",
  "Add the debit column.",
  "Add the credit column.",
  "Compare total debits and total credits.",
  "Investigate any difference."
];

const errorCauses = [
  "An amount was entered on the wrong side.",
  "An account balance was missing.",
  "A number was typed incorrectly.",
  "A transaction was only partly posted.",
  "Balances from different accounting periods were mixed.",
  "A debit or credit was added incorrectly.",
  "A blank or duplicate line was included."
];

const mistakes = [
  "Assuming balanced means completely correct",
  "Forgetting one account",
  "Posting a debit as a credit",
  "Using balances from different dates",
  "Mixing income statement and balance sheet ideas",
  "Rounding too early",
  "Not checking the difference amount carefully"
];

const checklist = [
  "Are all ledger accounts included?",
  "Is each balance placed on the correct side?",
  "Do total debits equal total credits?",
  "Is the accounting period consistent?",
  "Are there duplicate or blank lines?",
  "Did you review any difference shown by the calculator?"
];

const faqs = [
  {
    question: "What is a trial balance?",
    answer:
      "A trial balance is a list of ledger account balances used to check whether total debits equal total credits."
  },
  {
    question: "What is the trial balance formula?",
    answer:
      "The trial balance formula is Total Debits = Total Credits. It comes from double-entry accounting."
  },
  {
    question: "How do you prepare a trial balance?",
    answer:
      "List every ledger account, place debit balances in the debit column, place credit balances in the credit column, add both columns, and compare the totals."
  },
  {
    question: "Why should total debits equal total credits?",
    answer:
      "Total debits should equal total credits because every complete double-entry transaction has debit and credit effects."
  },
  {
    question: "Why is my trial balance not balancing?",
    answer:
      "A trial balance may not balance because of a wrong-side entry, missing account, typing mistake, incomplete posting, mixed accounting periods, or an addition error."
  },
  {
    question: "Does a balanced trial balance mean there are no errors?",
    answer:
      "No. A balanced trial balance only means total debits equal total credits. Wrong accounts, omitted transactions, or incorrect classifications can still exist."
  },
  {
    question: "What accounts appear in a trial balance?",
    answer:
      "A trial balance can include assets, liabilities, equity, revenue, expenses, and drawings or dividends, depending on the accounts used by the business."
  },
  {
    question: "Is a trial balance the same as a balance sheet?",
    answer:
      "No. A trial balance is an internal checking list of ledger balances. A balance sheet is a financial statement showing assets, liabilities, and equity."
  },
  {
    question: "Can this guide help with accounting homework?",
    answer:
      "Yes. This guide can help beginners understand the format, formula, and common checks, but you should still follow your class instructions and show your own working."
  }
];

function TrialBalanceTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
      <table className="min-w-[640px] w-full border-collapse bg-white text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Account Name</th>
            <th className="px-4 py-3 text-right font-semibold">Debit</th>
            <th className="px-4 py-3 text-right font-semibold">Credit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-700">
          {rows.map(([account, debit, credit]) => (
            <tr className={account === "Total" ? "bg-stone-50 font-semibold" : ""} key={account}>
              <td className="px-4 py-3 text-stone-950">{account}</td>
              <td className="px-4 py-3 text-right">{debit}</td>
              <td className="px-4 py-3 text-right">{credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TrialBalanceExplainedGuidePage() {
  const pageUrl = `${siteConfig.url}/guides/trial-balance-explained`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Trial Balance Explained", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Trial Balance Explained: Meaning, Format, Examples, and Common Errors",
          description:
            "Learn what a trial balance is, how to prepare one, the trial balance format, examples, common errors, and why total debits should equal total credits.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <Container as="main">
        <Link
          className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          href="/guides"
        >
          ← All guides
        </Link>
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Trial Balance Explained: Meaning, Format, Examples, and Common Errors
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            A trial balance is a list of ledger account balances used to check whether total
            debits equal total credits before preparing financial statements. It is one of the
            first checks beginners learn in double-entry accounting.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/trial-balance-calculator"
            >
              Try the Trial Balance Calculator
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/tools/journal-entry-checker"
            >
              Check a Journal Entry
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is a trial balance?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>A trial balance is a summary of ledger account balances.</p>
              <p>Debit balances go in the debit column. Credit balances go in the credit column.</p>
              <p>Total debits should equal total credits.</p>
              <p>
                A trial balance is a checking tool, not a final financial statement. It helps
                spot mathematical or posting differences before deeper review.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Formula</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Trial balance formula
            </h2>
            <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-5 text-center text-xl font-semibold tracking-tight text-stone-950">
              Total Debits = Total Credits
            </div>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
              This formula comes from double-entry accounting, where every transaction has debit
              and credit effects. If one side is missing or entered incorrectly, the totals may
              not agree.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Format</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Trial balance format
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            A common trial balance format has one column for account names, one for debit
            balances, and one for credit balances.
          </p>
          <TrialBalanceTable rows={unbalancedRows} />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              This example is unbalanced because debit total and credit total do not match. The
              difference is RM 1,000.
            </p>
            <p>
              The user should review missing accounts, wrong-side entries, typing mistakes, or
              period errors before relying on the numbers.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Balanced example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Trial balance example that balances
          </h2>
          <TrialBalanceTable rows={balancedRows} />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              The trial balance balances because total debits and total credits are both RM
              11,000. This means the math balance is correct.
            </p>
            <p>
              It does not guarantee every account is classified correctly. A balanced trial
              balance can still include accounting errors.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Steps</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              How to prepare a trial balance step by step
            </h2>
            <ol className="mt-6 grid gap-3">
              {steps.map((step, index) => (
                <li className="flex gap-3 text-sm leading-6 text-stone-700" key={step}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Unbalanced totals</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Why does a trial balance not balance?
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700">
              {errorCauses.map((cause) => (
                <li className="flex gap-3" key={cause}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
              For a focused troubleshooting walkthrough, read{" "}
              <Link
                className="font-semibold text-slate-700 hover:text-slate-900"
                href="/guides/why-trial-balance-not-balancing"
              >
                why your trial balance is not balancing
              </Link>
              .
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Important limit</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Does a balanced trial balance mean there are no errors?
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>No. A balanced trial balance only means total debits equal total credits.</p>
            <p>
              Some errors can still exist, such as using the wrong account, recording the wrong
              amount on both sides, omitting a full transaction, or classifying an account
              incorrectly.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Related terms</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Trial balance vs balance sheet vs general ledger
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-[760px] w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Term</th>
                  <th className="px-4 py-3 font-semibold">What it means</th>
                  <th className="px-4 py-3 font-semibold">Main purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {relatedTerms.map(([term, meaning, purpose]) => (
                  <tr key={term}>
                    <td className="px-4 py-3 font-semibold text-stone-950">{term}</td>
                    <td className="px-4 py-3">{meaning}</td>
                    <td className="px-4 py-3">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Use the tool</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Check your numbers with the Trial Balance Calculator
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                You can enter account names and debit or credit balances into the Trial Balance
                Calculator. The tool totals both sides and shows the difference.
              </p>
              <p>
                It helps with homework checks, beginner bookkeeping practice, and finding simple
                input mistakes. It does not replace professional accounting review.
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ["Trial Balance Calculator", "/tools/trial-balance-calculator"],
                ["Why Trial Balance Does Not Balance", "/guides/why-trial-balance-not-balancing"],
                ["Journal Entry Checker", "/tools/journal-entry-checker"],
                ["Basic Journal Entries", "/guides/journal-entries-for-beginners"],
                ["Accounting Equation Calculator", "/tools/accounting-equation-calculator"],
                ["Debit vs Credit Guide", "/guides/debit-vs-credit"]
              ].map(([label, href]) => (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common trial balance mistakes
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700">
              {mistakes.map((mistake) => (
                <li className="flex gap-3" key={mistake}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Trial balance checklist for beginners
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <li
                className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Trial Balance FAQs
          </h2>
          <div className="mt-6 divide-y divide-stone-100">
            {faqs.map((faq) => (
              <article className="py-5 first:pt-0 last:pb-0" key={faq.question}>
                <h3 className="text-base font-semibold text-stone-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
