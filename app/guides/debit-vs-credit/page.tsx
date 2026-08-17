import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Debit or Credit? Why Your Bank Says the Opposite";
const guidePath = "/guides/debit-vs-credit";
const pageDescription =
  "Debit means left and credit means right. That is the entire definition. Once you see why your bank statement is written backwards, the rest of the rules stop feeling arbitrary.";

export const metadata = createMetadata({
  title: pageTitle,
  description:
    "Debit means left, credit means right, nothing more. Learn why your bank shows the opposite, which side each account type uses, and why revenue is a credit.",
  path: guidePath
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Why your bank says the opposite", href: "#bank-statement" },
  { label: "Key terms", href: "#key-terms" },
  { label: "The six account types", href: "#account-types" },
  { label: "Why revenue is a credit", href: "#why-revenue" },
  { label: "Worked examples", href: "#examples" },
  { label: "Four traps", href: "#traps" },
  { label: "Quick checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Debit (Dr)",
    meaning:
      "An entry on the left side of an account. It is a position, not a judgement. Whether it increases or decreases the account depends entirely on the account type."
  },
  {
    term: "Credit (Cr)",
    meaning:
      "An entry on the right side of an account. Again a position only. Credit does not mean money received and does not mean something good."
  },
  {
    term: "Normal balance",
    meaning:
      "The side an account usually sits on, which is the side that increases it. Assets normally hold a debit balance; liabilities normally hold a credit balance."
  },
  {
    term: "Double entry",
    meaning:
      "Every transaction is recorded twice, once as a debit and once as a credit of equal value, so the books stay in balance."
  },
  {
    term: "Contra account",
    meaning:
      "An account that sits opposite its normal side, such as accumulated depreciation, which reduces an asset and therefore carries a credit balance."
  },
  {
    term: "Drawings",
    meaning:
      "Money taken out by the owner. It reduces equity, so despite being a withdrawal it increases with a debit, in the same way an expense does."
  }
] as const;

const accountTable = [
  ["Assets", "Debit", "Debit", "Credit"],
  ["Expenses", "Debit", "Debit", "Credit"],
  ["Drawings or dividends", "Debit", "Debit", "Credit"],
  ["Liabilities", "Credit", "Credit", "Debit"],
  ["Equity", "Credit", "Credit", "Debit"],
  ["Revenue", "Credit", "Credit", "Debit"]
] as const;

const mirrorTable = [
  [
    "You deposit RM 1,000",
    "Debit Cash (your asset increases)",
    "Credit your account (the bank owes you more)"
  ],
  [
    "You withdraw RM 400",
    "Credit Cash (your asset decreases)",
    "Debit your account (the bank owes you less)"
  ],
  [
    "Bank charges RM 20 in fees",
    "Debit Bank Charges, Credit Cash",
    "Credit fee income, Debit your account"
  ]
] as const;

const examples = [
  [
    "Sell a service for RM 500 cash",
    "Debit Cash 500",
    "Credit Revenue 500",
    "An asset rises and equity rises through profit"
  ],
  [
    "Pay RM 800 rent by bank transfer",
    "Debit Rent Expense 800",
    "Credit Cash 800",
    "An expense rises, reducing equity, and an asset falls"
  ],
  [
    "Buy stock on credit for RM 1,200",
    "Debit Inventory 1,200",
    "Credit Trade Payables 1,200",
    "An asset rises and a liability rises"
  ],
  [
    "Owner takes RM 600 for personal use",
    "Debit Drawings 600",
    "Credit Cash 600",
    "Equity falls through drawings and an asset falls"
  ],
  [
    "Customer pays a RM 900 invoice",
    "Debit Cash 900",
    "Credit Trade Receivables 900",
    "One asset rises while another falls, so no change in total"
  ]
] as const;

const traps = [
  {
    id: "good-bad",
    name: "1. Treating debit as bad and credit as good",
    summary: "Neither word carries any judgement about the business.",
    example:
      "A RM 800 rent payment is a debit to Rent Expense. A RM 500 sale is a credit to Revenue. One is a cost and one is income, yet the labels say nothing about which is welcome.",
    why: "Debit and credit only describe which side of the account the entry sits on. Reading them as positive or negative leads to guessing rather than applying the rule for the account type.",
    fix: "Say the words as left and right in your head until the habit fades."
  },
  {
    id: "bank-wording",
    name: "2. Copying the wording on your bank statement",
    summary: "The statement is written from the bank point of view, not yours.",
    example:
      "The bank credits your account when you deposit money, but in your own books receiving cash is a debit.",
    why: "Your balance is an asset to you and a liability to the bank. Both records are correct and they will always use opposite words for the same event.",
    fix: "Decide entries from your own account types. Use the statement for amounts and dates only, never for the debit or credit wording."
  },
  {
    id: "drawings",
    name: "3. Assuming drawings behave like equity",
    summary: "Equity increases with a credit, but drawings increase with a debit.",
    example:
      "The owner withdraws RM 600. Drawings is debited even though it belongs to the equity family.",
    why: "Drawings reduce equity, so it moves in the opposite direction to the capital account. Expenses work the same way for the same reason.",
    fix: "Remember that anything reducing equity, whether an expense or a withdrawal, increases with a debit."
  },
  {
    id: "revenue-debit",
    name: "4. Debiting revenue because money came in",
    summary: "The cash gets the debit. The revenue account does not.",
    example:
      "On a RM 500 cash sale, people often want to debit both Cash and Revenue because both feel like increases.",
    why: "Revenue is not the money itself, it is the reason the money arrived. Cash is the asset that rose, so cash takes the debit and revenue takes the credit.",
    fix: "Ask which account holds the money. That one is debited. The account explaining why is credited."
  }
] as const;

const checklist = [
  "I can state that debit means left and credit means right.",
  "I identify the account type before deciding the side.",
  "I check whether the account is increasing or decreasing.",
  "I apply the normal balance rule for that account type.",
  "I ignore the wording used on my bank statement.",
  "I confirm the debit amount equals the credit amount.",
  "I treat expenses and drawings as reductions of equity.",
  "I check that the entry still satisfies the accounting equation."
] as const;

const sidebarGuides = [
  guideLink("journal-entries-for-beginners"),
  guideLink("why-trial-balance-not-balancing"),
  guideLink("errors-not-revealed-by-a-trial-balance")
];

const faqs = [
  {
    question: "Is a debit money coming in or money going out?",
    answer:
      "Neither on its own. A debit is simply an entry on the left side of an account. It increases assets, expenses, and drawings, and it decreases liabilities, equity, and revenue. You have to know the account type before the word tells you anything."
  },
  {
    question: "What do Dr and Cr actually stand for?",
    answer:
      "They come from the Latin debere, meaning to owe, and credere, meaning to entrust. The abbreviations kept the r from the Latin spellings, which is why credit is shortened to Cr rather than Cd."
  },
  {
    question: "Is a debit card related to accounting debits?",
    answer:
      "Only through the bank point of view. A debit card takes money from your account, which reduces what the bank owes you, and reductions in a liability are debits in the bank records. In your own books, spending that money is a credit to cash."
  },
  {
    question: "What is a contra account?",
    answer:
      "A contra account sits on the opposite side to the type it belongs to. Accumulated depreciation is a contra asset, so it carries a credit balance and reduces the asset it relates to. Sales returns work the same way against revenue."
  },
  {
    question: "Do debits always have to equal credits?",
    answer:
      "Yes, for every individual transaction and therefore for the books as a whole. If the totals do not agree, one side was posted without the other, or an amount was written incorrectly, which is what a trial balance is designed to reveal."
  },
  {
    question: "Can the Debit/Credit Checker tell me the account type?",
    answer:
      "No. You choose the account type and whether it is increasing or decreasing, and the checker returns the correct side along with the normal balance. Deciding whether something is an asset, an expense, or a liability is the judgement it cannot make for you."
  }
];

function SimpleTable({
  headers,
  rows
}: {
  headers: readonly string[];
  rows: ReadonlyArray<readonly string[]>;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-950">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3" key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-950">
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 align-top ${
                    index === 0 ? "font-semibold text-slate-950" : ""
                  }`}
                  key={`${row[0]}-${cell}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({
  children,
  id
}: {
  children: string;
  id: string;
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {children}
      </h2>
    </header>
  );
}

export default function DebitVsCreditGuidePage() {
  const pageUrl = `${siteConfig.url}${guidePath}`;

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: pageTitle, url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pageTitle,
          description: metadata.description,
          url: pageUrl,
          datePublished: "2026-08-17",
          dateModified: "2026-08-17",
          author: {
            "@type": "Organization",
            name: "AccountingToolsLab"
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-950">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition hover:text-slate-900" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link className="transition hover:text-slate-900" href="/guides">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-slate-950">{pageTitle}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="min-w-0">
            <header>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {pageTitle}
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-950 sm:text-lg">
                {pageDescription}
              </p>
              <p className="mt-5 text-sm text-slate-950">
                Updated on 17 August 2026 <span aria-hidden="true">-</span> 9 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">
                Quick answer: debit is left, credit is right
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                That is the whole definition. Debit does not mean money out, credit does not mean
                money in, and neither says anything about whether something is good for the
                business.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Whether a debit increases or decreases an account depends only on what kind of
                account it is:
              </p>
              <SimpleTable
                headers={["Account type", "Normal balance", "Increases with", "Decreases with"]}
                rows={accountTable}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Two questions get you the answer every time. What type of account is this, and is
                it going up or down? The{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/debit-credit-checker"
                >
                  debit and credit checker
                </Link>{" "}
                takes exactly those two answers and returns the side.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="bank-statement">
                Why your bank statement says the opposite
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                This is the single most common reason debits and credits feel impossible to learn.
                You deposit money, the bank calls it a credit, but every textbook says receiving
                cash is a debit. Both are right.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Your bank statement is not written from your point of view. It is a copy of the
                bank ledger. To you, money in the bank is an asset. To the bank, your balance is a
                liability, because they owe it back to you on demand.
              </p>
              <SimpleTable
                headers={["What happens", "In your books", "In the bank books"]}
                rows={mirrorTable}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The two records are mirror images and always will be. Once you see that, the
                statement stops being confusing and simply becomes someone else&apos;s ledger.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The practical rule: take amounts and dates from your bank statement, never the
                debit and credit wording.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms in plain English</SectionHeading>
              <dl className="mt-6 space-y-5 text-base leading-7 text-slate-950">
                {keyTerms.map((item) => (
                  <div key={item.term}>
                    <dt className="font-semibold">{item.term}</dt>
                    <dd className="mt-1">{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-12">
              <SectionHeading id="account-types">
                Why each account type behaves the way it does
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The rules in the table are not arbitrary. They fall directly out of the accounting
                equation:
              </p>
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-base font-semibold leading-7 text-slate-950">
                  Assets = Liabilities + Equity
                </p>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Assets sit on the left of that equation, so assets increase with a left-side entry,
                which is a debit. Liabilities and equity sit on the right, so they increase with a
                credit. Everything else follows from how it affects equity:
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                <li className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>
                    <strong>Revenue increases equity</strong>, so it moves the same way as equity
                    and increases with a credit.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>
                    <strong>Expenses reduce equity</strong>, so they move against it and increase
                    with a debit.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>
                    <strong>Drawings reduce equity</strong> as well, which is why a withdrawal is a
                    debit despite money leaving the business.
                  </span>
                </li>
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                If the equation itself is unfamiliar, the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/accounting-equation-calculator"
                >
                  accounting equation calculator
                </Link>{" "}
                shows how assets, liabilities, and equity relate before you apply any of this.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="why-revenue">
                Why revenue increases with a credit
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                This is the rule that feels most backwards. Money arrives, which feels like an
                increase, so people want to debit the revenue account.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The resolution is that revenue is not the money. Revenue is the reason the money
                arrived. On a RM 500 cash sale, two different things go up: the cash you now hold,
                and the profit you have earned.
              </p>
              <SimpleTable
                headers={["Account", "Side", "What it represents"]}
                rows={[
                  ["Cash", "Debit 500", "The asset you now hold"],
                  ["Revenue", "Credit 500", "The earnings that increase equity"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                An asset rose and equity rose, so both sides of the accounting equation moved by
                RM 500 and it still balances. If you had debited both, the equation would break
                immediately.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="examples">Five worked examples</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Read the reasoning column rather than memorising the entries. The reasoning is what
                transfers to transactions you have not seen before.
              </p>
              <SimpleTable
                headers={["Transaction", "Debit", "Credit", "Why"]}
                rows={examples}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The last example is worth pausing on. Both accounts are assets, so one rises and
                one falls and total assets do not change. Debits and credits still balance.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="traps">Four traps that cause wrong entries</SectionHeading>
              <div className="mt-8 space-y-10">
                {traps.map((trap) => (
                  <div className="scroll-mt-28" id={trap.id} key={trap.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {trap.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-950">{trap.summary}</p>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                        Example
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-950">{trap.example}</p>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-950">
                      <span className="font-semibold">Why it happens. </span>
                      {trap.why}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">What to do. </span>
                      {trap.fix}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Quick checklist for any entry</SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide explains general bookkeeping concepts for learning and review. It is not
                accounting advice for a specific set of accounts.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Not sure which side to use?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Pick the account type and whether it is going up or down, and get the side plus
                    the normal balance.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/journal-entry-checker"
                  >
                    Journal Entry Checker
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/debit-credit-checker"
                  >
                    Debit/Credit Checker
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Debit and Credit FAQs"
            />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <GuideTableOfContents items={tableOfContents} />

              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                  Related guides
                </p>
                <div className="mt-4 grid gap-3">
                  {sidebarGuides.map((guide) => (
                    <Link
                      className="text-sm leading-6 text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                      href={guide.href}
                      key={guide.href}
                    >
                      {guide.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
