import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title:
    "Why Is My Trial Balance Not Balancing? Common Causes and Fixes | AccountingToolsLab",
  description:
    "Learn why a trial balance does not balance, common causes of debit and credit differences, how to find errors, and how to check your numbers step by step.",
  path: "/guides/why-trial-balance-not-balancing"
});

const differenceClues = [
  [
    "Same as one account balance",
    "Missing account or duplicated account",
    "Look for that exact amount"
  ],
  [
    "Double one account balance",
    "Amount may be on the wrong side",
    "Check debit/credit placement"
  ],
  [
    "Divisible by 9",
    "Possible transposition or slide error",
    "Check reversed digits or decimal placement"
  ],
  [
    "Small round number",
    "Addition or omission issue",
    "Re-add columns and review small balances"
  ]
];

const commonCauses = [
  [
    "An amount was posted to the wrong side",
    "A debit balance may have been entered as a credit, or a credit balance may have been entered as a debit."
  ],
  [
    "An account balance is missing",
    "One ledger account may not have been copied into the trial balance."
  ],
  [
    "A number was typed incorrectly",
    "A single wrong digit can make debit and credit totals different."
  ],
  [
    "Debit and credit columns were added incorrectly",
    "The account balances may be right, but one total may be calculated incorrectly."
  ],
  [
    "A transaction was only partly posted",
    "One side of a journal entry may have reached the ledger while the other side did not."
  ],
  [
    "A balance was copied from the wrong account",
    "The number may be real, but it may belong to a different ledger account."
  ],
  [
    "Balances from different accounting periods were mixed",
    "Using balances from different dates can cause totals to stop matching."
  ],
  [
    "A blank, duplicate, or old line was included",
    "Extra or outdated lines can affect one side of the trial balance."
  ],
  [
    "A decimal or comma was entered incorrectly",
    "For example, RM 1,000 entered as RM 100 can create a large difference."
  ]
];

const fixSteps = [
  "Recalculate total debits and total credits.",
  "Find the exact difference.",
  "Check whether the difference matches an account balance.",
  "Check whether half the difference matches an account balance.",
  "Look for transposed digits if the difference is divisible by 9.",
  "Confirm every ledger account is included.",
  "Confirm every balance is on the correct debit or credit side.",
  "Make sure all balances come from the same accounting period.",
  "Remove duplicate or blank lines.",
  "Recheck using the Trial Balance Calculator."
];

const balancedRows = [
  ["Cash", "RM 5,000", "-"],
  ["Equipment", "RM 3,000", "-"],
  ["Rent Expense", "RM 1,000", "-"],
  ["Accounts Payable", "-", "RM 2,000"],
  ["Owner's Capital", "-", "RM 6,000"],
  ["Service Revenue", "-", "RM 1,000"],
  ["Total", "RM 9,000", "RM 9,000"]
];

const unbalancedRows = [
  ["Cash", "RM 5,000", "-"],
  ["Equipment", "RM 3,000", "-"],
  ["Rent Expense", "RM 1,000", "-"],
  ["Accounts Payable", "-", "RM 2,000"],
  ["Owner's Capital", "-", "RM 6,000"],
  ["Service Revenue", "-", "-"],
  ["Total", "RM 9,000", "RM 8,000"]
];

const toolLinks = [
  {
    title: "Trial Balance Calculator",
    href: "/tools/trial-balance-calculator",
    description: "Use it to total debits, credits, and the difference."
  },
  {
    title: "Trial Balance Explained",
    href: "/guides/trial-balance-explained",
    description: "Review what a trial balance checks and what it cannot prove."
  },
  {
    title: "Journal Entries for Beginners",
    href: "/guides/journal-entries-for-beginners",
    description: "Review how transactions become debit and credit lines."
  },
  {
    title: "Debit vs Credit",
    href: "/guides/debit-vs-credit",
    description: "Check the normal balance rules behind wrong-side entries."
  },
  {
    title: "Journal Entry Checker",
    href: "/tools/journal-entry-checker",
    description: "Use it to check whether a single journal entry balances."
  },
  {
    title: "Debit/Credit Checker",
    href: "/tools/debit-credit-checker",
    description: "Use it to check whether an account should increase with a debit or credit."
  },
  {
    title: "Accounting Equation Calculator",
    href: "/tools/accounting-equation-calculator",
    description: "Use it to review assets, liabilities, and equity."
  }
];

const checklist = [
  "Did you include every ledger account?",
  "Did you put each account on the correct side?",
  "Did you copy every balance correctly?",
  "Did you re-add both columns?",
  "Did you check the exact difference?",
  "Did you look for the difference, half the difference, and divisible-by-9 clues?",
  "Did you use the same accounting period for every balance?",
  "Did you remove duplicates and blank lines?"
];

const faqs = [
  {
    question: "Why is my trial balance not balancing?",
    answer:
      "A trial balance is not balancing because total debits and total credits are different. Common causes include missing accounts, wrong-side entries, typing mistakes, incomplete posting, or mixed accounting periods."
  },
  {
    question: "What should I check first when my trial balance does not balance?",
    answer:
      "Check the exact difference first. Then see whether the difference matches an account balance, half an account balance, or a number divisible by 9."
  },
  {
    question: "What does the trial balance difference mean?",
    answer:
      "The difference is the gap between total debits and total credits. It can help you narrow down where the error may be."
  },
  {
    question: "Why does half the difference matter?",
    answer:
      "Half the difference can matter because an amount placed on the wrong side affects both totals. A RM 500 credit entered as a debit can create a RM 1,000 difference."
  },
  {
    question: "Why does a difference divisible by 9 matter?",
    answer:
      "A difference divisible by 9 may suggest a transposition error, such as reversed digits, or a slide error, such as a decimal placed incorrectly."
  },
  {
    question: "Can a trial balance balance but still have errors?",
    answer:
      "Yes. A balanced trial balance only confirms that total debits equal total credits. Wrong accounts, omitted transactions, and incorrect classifications can still exist."
  },
  {
    question: "Does an unbalanced trial balance mean my financial statements are wrong?",
    answer:
      "An unbalanced trial balance means the ledger totals need review before relying on the numbers. It is a warning sign, not a complete diagnosis."
  },
  {
    question: "Can the Trial Balance Calculator find my exact accounting mistake?",
    answer:
      "The calculator can total debits and credits and show the difference. It helps narrow the search, but you still need to review accounts and entries to find the exact mistake."
  },
  {
    question: "Can this guide help with accounting homework?",
    answer:
      "Yes. This guide can help you understand common trial balance errors and checking steps, but you should still follow your class instructions and show your own working."
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

export default function WhyTrialBalanceNotBalancingPage() {
  const pageUrl = `${siteConfig.url}/guides/why-trial-balance-not-balancing`;

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Why Trial Balance Is Not Balancing", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Why Is My Trial Balance Not Balancing?",
          description:
            "Learn why a trial balance does not balance, common causes of debit and credit differences, how to find errors, and how to check your numbers step by step.",
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
            Why Is My Trial Balance Not Balancing?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            A trial balance does not balance when total debits and total credits are different.
            The difference usually points to a missing account, wrong-side entry, typing
            mistake, or posting issue.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/trial-balance-calculator"
            >
              Check with the Trial Balance Calculator
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/guides/debit-vs-credit"
            >
              Review Debit/Credit Rules
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Quick answer: why your trial balance does not balance
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Total debits must equal total credits.</p>
              <p>
                If they do not match, at least one amount, account, side, or period may be
                wrong.
              </p>
              <p>
                The difference amount is the first clue. A trial balance can be unbalanced even
                when most entries are correct.
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
              This comes from double-entry accounting, where complete transactions have debit
              and credit effects.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">First clue</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Start with the difference amount
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Subtract the smaller total from the larger total.</p>
            <p>
              If the difference equals one account balance, that account may be missing or
              placed on the wrong side. If the difference is divisible by 9, it may suggest a
              transposition or digit error. If the difference is exactly double an amount, an
              item may have been placed on the wrong side.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-[760px] w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Difference clue</th>
                  <th className="px-4 py-3 font-semibold">What it may suggest</th>
                  <th className="px-4 py-3 font-semibold">What to check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {differenceClues.map(([clue, suggestion, check]) => (
                  <tr key={clue}>
                    <td className="px-4 py-3 font-semibold text-stone-950">{clue}</td>
                    <td className="px-4 py-3">{suggestion}</td>
                    <td className="px-4 py-3">{check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Causes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Common reasons a trial balance does not balance
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commonCauses.map(([title, description]) => (
              <article
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                key={title}
              >
                <h3 className="text-base font-semibold text-stone-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Fix steps</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to find trial balance errors step by step
          </h2>
          <ol className="mt-6 grid gap-3">
            {fixSteps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-stone-700" key={step}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Example of an unbalanced trial balance
          </h2>
          <TrialBalanceTable rows={balancedRows} />
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            This example balances because total debits and total credits are both RM 9,000.
          </p>
          <TrialBalanceTable rows={unbalancedRows} />
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>This trial balance is short by RM 1,000 on the credit side.</p>
            <p>
              The missing Service Revenue balance is RM 1,000. Adding the missing credit fixes
              the trial balance.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Wrong side</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Example: amount entered on the wrong side
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>A RM 500 credit balance was entered as a debit.</p>
              <p>
                This increases debit total by RM 500 and decreases credit total by RM 500. The
                total difference becomes RM 1,000, which is double the original RM 500 amount.
              </p>
              <p>
                That is why checking half the difference can help. If you want to review the
                transaction before it reaches the trial balance, start with{" "}
                <Link
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/journal-entries-for-beginners"
                >
                  journal entries for beginners
                </Link>
                .
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Limitations</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Can a trial balance balance and still be wrong?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Yes. A balanced trial balance only confirms total debits equal total credits.</p>
              <p>
                Errors can still exist if the wrong account was used, the wrong amount was
                recorded on both sides, a full transaction was omitted, or an account was
                classified incorrectly.
              </p>
              <p>
                You can{" "}
                <Link
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/trial-balance-explained"
                >
                  learn what a trial balance can and cannot prove
                </Link>{" "}
                in the full trial balance guide.
              </p>
            </div>
          </article>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Tools and guides for fixing trial balance errors
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolLinks.map((tool) => (
              <Link
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                href={tool.href}
                key={tool.href}
              >
                <h3 className="text-base font-semibold text-stone-950">{tool.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Trial balance error checklist
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
            Trial Balance Not Balancing FAQs
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
