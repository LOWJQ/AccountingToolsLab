import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Debit vs Credit: Simple Rules for Beginners | AccountingToolsLab",
  description:
    "Learn the difference between debit and credit, which accounts increase with debits or credits, normal balances, examples, and beginner mistakes to avoid.",
  path: "/guides/debit-vs-credit"
});

const accountRules = [
  ["Asset", "Debit", "Debit", "Credit"],
  ["Expense", "Debit", "Debit", "Credit"],
  ["Dividends/Drawings", "Debit", "Debit", "Credit"],
  ["Liability", "Credit", "Credit", "Debit"],
  ["Equity", "Credit", "Credit", "Debit"],
  ["Revenue", "Credit", "Credit", "Debit"]
];

const examples = [
  {
    title: "Buying equipment with cash",
    happens: "The business buys equipment and pays cash immediately.",
    debit: "Debit Equipment",
    credit: "Credit Cash",
    explanation:
      "Equipment is an asset, and assets increase with debits. Cash is also an asset, but it decreases when the business pays it out, so cash is credited."
  },
  {
    title: "Earning service revenue in cash",
    happens: "The business performs a service and receives cash from the customer.",
    debit: "Debit Cash",
    credit: "Credit Service Revenue",
    explanation:
      "Cash is an asset, so receiving cash increases it with a debit. Revenue normally increases with a credit."
  },
  {
    title: "Paying rent expense",
    happens: "The business pays rent for the month.",
    debit: "Debit Rent Expense",
    credit: "Credit Cash",
    explanation:
      "Rent expense increases with a debit. Cash decreases because the business paid money out, so cash is credited."
  },
  {
    title: "Owner invests cash into the business",
    happens: "The owner puts personal cash into the business.",
    debit: "Debit Cash",
    credit: "Credit Owner's Capital",
    explanation:
      "Cash increases with a debit. Owner's capital is an equity account, and equity increases with a credit."
  }
];

const mistakes = [
  "Thinking debit always means increase",
  "Thinking credit always means decrease",
  "Mixing up assets and expenses",
  "Forgetting revenue normally increases with credit",
  "Entering both debit and credit on the same line",
  "Balancing the entry mathematically but using the wrong account"
];

const faqs = [
  {
    question: "What is a debit?",
    answer:
      "A debit is the left side of an accounting entry. It increases some account types, such as assets and expenses, and decreases others, such as liabilities, equity, and revenue."
  },
  {
    question: "What is a credit?",
    answer:
      "A credit is the right side of an accounting entry. It increases liabilities, equity, and revenue, and decreases assets, expenses, and drawings."
  },
  {
    question: "Does debit always mean increase?",
    answer:
      "No. Debit does not always mean increase. Whether a debit increases or decreases an account depends on the account type."
  },
  {
    question: "Which accounts increase with debits?",
    answer:
      "Assets, expenses, and dividends or drawings usually increase with debits."
  },
  {
    question: "Which accounts increase with credits?",
    answer: "Liabilities, equity, and revenue usually increase with credits."
  },
  {
    question: "Why do debits and credits have to balance?",
    answer:
      "Debits and credits have to balance because double-entry accounting records each transaction on at least two sides. Total debits must equal total credits in a complete journal entry."
  },
  {
    question: "How do I know whether to debit or credit an account?",
    answer:
      "First identify the account type, then decide whether the account is increasing or decreasing. The normal balance rules tell you whether to debit or credit it."
  },
  {
    question: "Can a journal entry balance but still be wrong?",
    answer:
      "Yes. A journal entry can have equal debits and credits but still use the wrong account, wrong amount, or wrong accounting treatment."
  }
];

export default function DebitVsCreditGuidePage() {
  const pageUrl = `${siteConfig.url}/guides/debit-vs-credit`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "Debit vs Credit", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Debit vs Credit: Simple Rules for Beginners
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Debits and credits are the left and right sides of accounting entries. They are not
            simply another way to say increase and decrease. Whether a debit or credit increases
            an account depends on the type of account you are recording.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/debit-credit-checker"
            >
              Try the Debit/Credit Checker
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/tools/journal-entry-checker"
            >
              Check a Journal Entry
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is the difference between debit and credit?
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>A debit is the left side of an accounting entry.</p>
              <p>A credit is the right side of an accounting entry.</p>
              <p>
                Whether debit or credit increases an account depends on the account type. For
                example, cash increases with a debit, but revenue increases with a credit.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Memory tip</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Easy way to remember debit and credit rules
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Assets and expenses usually increase with debits.</p>
              <p>Liabilities, equity, and revenue usually increase with credits.</p>
              <p>
                In a complete journal entry, total debits must equal total credits. That balance
                is what keeps the accounting equation organized.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Normal balances</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Debit and credit rules by account type
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            The normal balance is the side where an account usually increases. Use this table
            when you are deciding which accounts increase with debit and which accounts increase
            with credit.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
            <table className="min-w-[680px] w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Account Type</th>
                  <th className="px-4 py-3 font-semibold">Normal Balance</th>
                  <th className="px-4 py-3 font-semibold">Increases With</th>
                  <th className="px-4 py-3 font-semibold">Decreases With</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {accountRules.map(([accountType, normalBalance, increasesWith, decreasesWith]) => (
                  <tr key={accountType}>
                    <td className="px-4 py-3 font-semibold text-stone-950">{accountType}</td>
                    <td className="px-4 py-3">{normalBalance}</td>
                    <td className="px-4 py-3">{increasesWith}</td>
                    <td className="px-4 py-3">{decreasesWith}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Examples</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Debit and credit examples
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
              The easiest way to learn debit and credit rules is to connect each transaction to
              the account types involved.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {examples.map((example) => (
              <article
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                key={example.title}
              >
                <h3 className="text-base font-semibold text-stone-950">{example.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{example.happens}</p>
                <div className="mt-4 grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
                  <p>
                    <span className="font-semibold text-stone-950">Debit line:</span>{" "}
                    <span className="text-stone-700">{example.debit}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-stone-950">Credit line:</span>{" "}
                    <span className="text-stone-700">{example.credit}</span>
                  </p>
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-600">{example.explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Watch out</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common debit and credit mistakes
            </h2>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
              {mistakes.map((mistake) => (
                <li className="flex gap-3" key={mistake}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Use the tool</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Check debit and credit direction with the tool
            </h2>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
              If you are unsure whether to debit or credit an account, use the Debit/Credit
              Checker. Choose the account type, choose whether it increases or decreases, and
              the tool shows the correct side.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                ["Debit/Credit Checker", "/tools/debit-credit-checker"],
                ["Journal Entry Checker", "/tools/journal-entry-checker"],
                ["Journal Entries for Beginners", "/guides/journal-entries-for-beginners"],
                ["Accounting Equation Calculator", "/tools/accounting-equation-calculator"],
                ["Trial Balance Calculator", "/tools/trial-balance-calculator"],
                ["Trial Balance Explained", "/guides/trial-balance-explained"]
              ].map(([label, href]) => (
                <a
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  href={href}
                  key={href}
                >
                  {label}
                </a>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Debit vs Credit FAQs
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
