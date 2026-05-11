import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Journal Entries for Beginners: Debit and Credit Examples | AccountingToolsLab",
  description:
    "Learn journal entries for beginners with simple debit and credit examples, journal entry format, common mistakes, and step-by-step checks.",
  path: "/guides/journal-entries-for-beginners"
});

const debitCreditRules = [
  ["Asset", "Debit", "Credit"],
  ["Expense", "Debit", "Credit"],
  ["Dividends/Drawings", "Debit", "Credit"],
  ["Liability", "Credit", "Debit"],
  ["Equity", "Credit", "Debit"],
  ["Revenue", "Credit", "Debit"]
];

const steps = [
  "Identify the transaction.",
  "Decide which accounts are affected.",
  "Decide whether each account increases or decreases.",
  "Use debit and credit rules to choose the correct side.",
  "Enter the debit line or lines.",
  "Enter the credit line or lines.",
  "Check that total debits equal total credits.",
  "Add a short explanation if needed."
];

const examples = [
  {
    title: "Example 1: receiving cash for service revenue",
    scenario: "A business earns RM 1,000 cash from providing a service.",
    rows: [
      ["Cash", "RM 1,000", "-"],
      ["Service Revenue", "-", "RM 1,000"],
      ["Total", "RM 1,000", "RM 1,000"]
    ],
    explanation: [
      "Cash increases, and cash is an asset, so debit Cash.",
      "Revenue increases, and revenue normally increases with credit, so credit Service Revenue."
    ]
  },
  {
    title: "Example 2: paying rent expense",
    scenario: "A business pays RM 800 cash for rent.",
    rows: [
      ["Rent Expense", "RM 800", "-"],
      ["Cash", "-", "RM 800"],
      ["Total", "RM 800", "RM 800"]
    ],
    explanation: [
      "Rent Expense increases, and expenses increase with debit.",
      "Cash decreases, and assets decrease with credit."
    ]
  },
  {
    title: "Example 3: buying equipment with cash",
    scenario: "A business buys equipment for RM 3,000 cash.",
    rows: [
      ["Equipment", "RM 3,000", "-"],
      ["Cash", "-", "RM 3,000"],
      ["Total", "RM 3,000", "RM 3,000"]
    ],
    explanation: [
      "Equipment increases, and equipment is an asset, so debit Equipment.",
      "Cash decreases, and cash is also an asset, so credit Cash."
    ]
  },
  {
    title: "Example 4: owner invests cash into the business",
    scenario: "The owner invests RM 5,000 cash into the business.",
    rows: [
      ["Cash", "RM 5,000", "-"],
      ["Owner's Capital", "-", "RM 5,000"],
      ["Total", "RM 5,000", "RM 5,000"]
    ],
    explanation: [
      "Cash increases, so debit Cash.",
      "Owner's Capital increases, and equity normally increases with credit."
    ]
  },
  {
    title: "Example 5: buying supplies on credit",
    scenario: "A business buys RM 600 of supplies but will pay later.",
    rows: [
      ["Supplies", "RM 600", "-"],
      ["Accounts Payable", "-", "RM 600"],
      ["Total", "RM 600", "RM 600"]
    ],
    explanation: [
      "Supplies increase, and supplies are an asset, so debit Supplies.",
      "Accounts Payable increases, and liabilities increase with credit."
    ]
  }
];

const multiLineRows = [
  ["Cash", "RM 700", "-"],
  ["Accounts Receivable", "RM 300", "-"],
  ["Service Revenue", "-", "RM 1,000"],
  ["Total", "RM 1,000", "RM 1,000"]
];

const mistakes = [
  "Thinking debit always means increase",
  "Thinking credit always means decrease",
  "Forgetting one side of the entry",
  "Entering both debit and credit on the same line",
  "Using the wrong account even though the entry balances",
  "Forgetting that revenue normally increases with credit",
  "Forgetting that expenses normally increase with debit",
  "Mixing up cash received with revenue earned",
  "Not checking whether total debits equal total credits"
];

const toolLinks = [
  {
    title: "Journal Entry Checker",
    href: "/tools/journal-entry-checker",
    description: "Use it to check whether debit and credit totals match."
  },
  {
    title: "Debit vs Credit",
    href: "/guides/debit-vs-credit",
    description: "Review the account rules before choosing which side to use."
  },
  {
    title: "Debit/Credit Checker",
    href: "/tools/debit-credit-checker",
    description: "Use it to check whether an account should be debited or credited."
  },
  {
    title: "Why Trial Balance Does Not Balance",
    href: "/guides/why-trial-balance-not-balancing",
    description: "Learn what to check if posted entries lead to unbalanced totals."
  },
  {
    title: "Trial Balance Calculator",
    href: "/tools/trial-balance-calculator",
    description: "Use it to check whether total ledger debit and credit balances match."
  },
  {
    title: "Accounting Equation Calculator",
    href: "/tools/accounting-equation-calculator",
    description: "Use it to review assets, liabilities, and equity."
  }
];

const checklist = [
  "Did you identify the accounts affected?",
  "Did you decide whether each account increased or decreased?",
  "Did you apply the debit and credit rules correctly?",
  "Did you put each amount on only one side of each line?",
  "Do total debits equal total credits?",
  "Did you add a clear explanation?",
  "Did you check the entry with the Journal Entry Checker?"
];

const faqs = [
  {
    question: "What is a journal entry?",
    answer:
      "A journal entry records a business transaction by showing the accounts affected, the debit amounts, and the credit amounts."
  },
  {
    question: "What is the basic format of a journal entry?",
    answer:
      "A basic journal entry usually includes the date, account names, debit column, credit column, and a short explanation."
  },
  {
    question: "Why do debits and credits need to balance?",
    answer:
      "Debits and credits need to balance because double-entry accounting records equal debit and credit effects for each complete transaction."
  },
  {
    question: "How do I know which account to debit?",
    answer:
      "Identify the account type and whether it increased or decreased. Assets and expenses usually increase with debits."
  },
  {
    question: "How do I know which account to credit?",
    answer:
      "Identify the account type and whether it increased or decreased. Liabilities, equity, and revenue usually increase with credits."
  },
  {
    question: "Can a journal entry have more than two lines?",
    answer:
      "Yes. A journal entry can have multiple debit or credit lines as long as total debits equal total credits."
  },
  {
    question: "Can a journal entry balance but still be wrong?",
    answer:
      "Yes. A balanced journal entry checks the math, but the wrong account or wrong classification can still be used."
  },
  {
    question: "What is the difference between a journal entry and a trial balance?",
    answer:
      "A journal entry records one transaction. A trial balance lists ledger account balances to check whether total debit and credit balances match."
  },
  {
    question: "Can this guide help with accounting homework?",
    answer:
      "Yes. This guide can help you understand the format, examples, and checking steps, but you should still follow your class instructions."
  }
];

function EntryTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-stone-200">
      <table className="min-w-[560px] w-full border-collapse bg-white text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Account</th>
            <th className="px-4 py-3 text-right font-semibold">Debit</th>
            <th className="px-4 py-3 text-right font-semibold">Credit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-700">
          {rows.map(([account, debit, credit]) => (
            <tr className={account === "Total" ? "bg-stone-50 font-semibold" : ""} key={account}>
              <td className="px-4 py-3 font-semibold text-stone-950">{account}</td>
              <td className="px-4 py-3 text-right">{debit}</td>
              <td className="px-4 py-3 text-right">{credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function JournalEntriesForBeginnersPage() {
  const pageUrl = `${siteConfig.url}/guides/journal-entries-for-beginners`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Journal Entries for Beginners", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Journal Entries for Beginners: Debit and Credit Examples",
          description:
            "Learn journal entries for beginners with simple debit and credit examples, journal entry format, common mistakes, and step-by-step checks.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Journal Entries for Beginners: Debit and Credit Examples
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            A journal entry records a business transaction using debit and credit lines. A
            complete journal entry should have total debits equal to total credits.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/journal-entry-checker"
            >
              Check a Journal Entry
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/guides/debit-vs-credit"
            >
              Review Debit/Credit Rules
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is a journal entry?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>A journal entry records the accounts affected by a transaction.</p>
              <p>
                Each journal entry usually includes a date, account names, debit amounts, credit
                amounts, and a short description.
              </p>
              <p>
                Debits go on the left side, credits go on the right side, and total debits should
                equal total credits.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Core rule</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              The basic rule: debits must equal credits
            </h2>
            <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-5 text-center text-xl font-semibold tracking-tight text-stone-950">
              Total Debits = Total Credits
            </div>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
              This is the foundation of double-entry accounting. A journal entry can have more
              than two lines, but the total debit amount must equal the total credit amount.
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
              A balanced journal entry checks the math, but it does not always prove the account
              choices are correct.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Format</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Journal entry format
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-[640px] w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Account</th>
                  <th className="px-4 py-3 text-right font-semibold">Debit</th>
                  <th className="px-4 py-3 text-right font-semibold">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="px-4 py-3">Jan 1</td>
                  <td className="px-4 py-3 font-semibold text-stone-950">Cash</td>
                  <td className="px-4 py-3 text-right">RM 1,000</td>
                  <td className="px-4 py-3 text-right">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Jan 1</td>
                  <td className="px-4 py-3 font-semibold text-stone-950">Service Revenue</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right">RM 1,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Cash is debited because cash increased.</p>
            <p>Service Revenue is credited because revenue increased.</p>
            <p>
              The entry balances because total debits and total credits are both RM 1,000.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Rules reminder</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Which accounts increase with debit or credit?
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-[640px] w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Account Type</th>
                  <th className="px-4 py-3 font-semibold">Increases With</th>
                  <th className="px-4 py-3 font-semibold">Decreases With</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {debitCreditRules.map(([accountType, increasesWith, decreasesWith]) => (
                  <tr key={accountType}>
                    <td className="px-4 py-3 font-semibold text-stone-950">{accountType}</td>
                    <td className="px-4 py-3">{increasesWith}</td>
                    <td className="px-4 py-3">{decreasesWith}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            If this still feels slippery,{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/debit-vs-credit"
            >
              learn the full debit vs credit rules
            </a>{" "}
            or{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/tools/debit-credit-checker"
            >
              use the Debit/Credit Checker
            </a>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Process</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to write a journal entry step by step
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
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Examples</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Debit and credit journal entry examples
          </h2>
          <div className="mt-6 grid gap-6">
            {examples.map((example) => (
              <article
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
                key={example.title}
              >
                <h3 className="text-xl font-semibold tracking-tight text-stone-950">
                  {example.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                  <span className="font-semibold text-stone-800">Scenario:</span>{" "}
                  {example.scenario}
                </p>
                <EntryTable rows={example.rows} />
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
                  {example.explanation.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Multiple lines</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Can a journal entry have more than two lines?
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>Yes. A journal entry can have multiple debit or credit lines.</p>
            <p>The total debit amount still needs to equal the total credit amount.</p>
            <p>
              Scenario: a customer pays RM 1,000 total: RM 700 in cash and RM 300 still owed.
            </p>
          </div>
          <EntryTable rows={multiLineRows} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common journal entry mistakes
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

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related guides</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Learn what happens after journal entries
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                Journal entries are posted to ledger accounts. Those ending ledger balances can
                then be checked in a trial balance.
              </p>
              <p>
                To continue,{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/trial-balance-explained"
                >
                  learn how a trial balance works
                </a>{" "}
                and review{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/why-trial-balance-not-balancing"
                >
                  why a trial balance may not balance
                </a>
                .
              </p>
            </div>
          </article>
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Practice journal entries with related tools
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolLinks.map((tool) => (
              <a
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                href={tool.href}
                key={tool.href}
              >
                <h3 className="text-base font-semibold text-stone-950">{tool.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Journal entry checklist for beginners
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
            Journal Entries for Beginners FAQs
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
      </main>
    </div>
  );
}
