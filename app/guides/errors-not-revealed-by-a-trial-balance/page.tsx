import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Balanced Trial Balance: 5 Errors It Will Not Catch";
const guidePath = "/guides/errors-not-revealed-by-a-trial-balance";
const pageDescription =
  "A trial balance that balances proves your debits equal your credits. It does not prove your books are right. These five errors keep the totals matching while the accounts stay wrong.";

export const metadata = createMetadata({
  title: pageTitle,
  description:
    "A balanced trial balance proves only that debits equal credits. Learn the 5 errors it hides, from omission to compensating, and how to find them.",
  path: guidePath
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "What it actually proves", href: "#what-it-proves" },
  { label: "Key terms", href: "#key-terms" },
  { label: "The five hidden errors", href: "#five-errors" },
  { label: "Worked example", href: "#example" },
  { label: "What it does catch", href: "#does-catch" },
  { label: "How to check further", href: "#how-to-check" },
  { label: "Review checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Trial balance",
    meaning:
      "A list of every ledger account balance, split into a debit column and a credit column, used to check that the two column totals agree."
  },
  {
    term: "Arithmetical accuracy",
    meaning:
      "The only thing a trial balance tests. It confirms the postings add up, not that the right accounts or the right amounts were used."
  },
  {
    term: "Error of omission",
    meaning:
      "A transaction left out of the books entirely, so neither the debit nor the credit was ever recorded."
  },
  {
    term: "Error of commission",
    meaning:
      "The correct amount posted to the wrong account of the same type, such as the wrong customer within trade receivables."
  },
  {
    term: "Error of principle",
    meaning:
      "The correct amount posted to an account of the wrong category, such as treating the purchase of an asset as an expense."
  },
  {
    term: "Error of original entry",
    meaning:
      "A wrong figure taken from the source document and then posted consistently to both the debit and the credit side."
  },
  {
    term: "Compensating error",
    meaning:
      "Two unrelated errors of equal value on opposite sides that cancel each other out in the column totals."
  },
  {
    term: "Suspense account",
    meaning:
      "A temporary holding account used to park a difference while the cause is investigated. It is only needed when the trial balance does not balance."
  }
] as const;

const errorTable = [
  [
    "Error of omission",
    "Nothing was recorded at all",
    "Both sides are missing equally"
  ],
  [
    "Error of commission",
    "Right amount, wrong account, same category",
    "The category total is unchanged"
  ],
  [
    "Error of principle",
    "Right amount, wrong category of account",
    "A debit is still a debit, just in the wrong place"
  ],
  [
    "Error of original entry",
    "Wrong amount taken from the source document",
    "The same wrong figure was used on both sides"
  ],
  [
    "Compensating error",
    "Two separate errors of equal size",
    "One overstatement cancels the other"
  ]
] as const;

const detectedErrors = [
  "A one-sided posting, where the debit was entered but the credit was not.",
  "Posting the same entry twice on one side only.",
  "Entering an amount on the wrong side of a single account.",
  "A transposition such as RM 540 written as RM 450 in one account only.",
  "An addition or casting error when totalling a column.",
  "Copying a ledger balance into the trial balance incorrectly."
] as const;

const furtherChecks = [
  "Compare the closing balance of each bank and cash account with an external statement.",
  "Agree the total of the receivables ledger with the individual customer balances.",
  "Agree the total of the payables ledger with the individual supplier balances.",
  "Review large or unusual expense postings for items that should have been capitalised.",
  "Check that every invoice and receipt in the period has a matching entry in the books.",
  "Compare this period's balances with the previous period and investigate anything that moved unexpectedly.",
  "Confirm that opening balances were carried forward correctly from the last period."
] as const;

const checklist = [
  "I confirmed the two column totals agree.",
  "I checked that no source document was left unrecorded.",
  "I checked that amounts were posted to the correct individual account, not just the correct category.",
  "I checked that asset purchases were not posted to expense accounts.",
  "I traced a sample of postings back to the original invoice or receipt.",
  "I reconciled the bank balance to an external statement.",
  "I compared the balances with the previous period.",
  "I understand that agreement of the totals is a starting point, not proof of accuracy."
] as const;

const sidebarGuides = [
  {
    href: "/guides/why-trial-balance-not-balancing",
    label: "Why Is My Trial Balance Not Balancing?"
  },
  {
    href: "/guides/debit-vs-credit",
    label: "Debit or Credit? Why Your Bank Says the Opposite"
  },
  {
    href: "/guides/journal-entries-for-beginners",
    label: "Journal Entries: How to Know Which Accounts to Use"
  }
] as const;

const detailedErrors = [
  {
    id: "omission",
    name: "1. Error of omission",
    summary: "The transaction never entered the books at all.",
    example:
      "A supplier invoice for RM 1,200 is filed away and never posted. Purchases are understated by RM 1,200 and trade payables are understated by RM 1,200.",
    why: "Because neither the debit nor the credit was recorded, the two column totals fall by nothing at all. The trial balance agrees perfectly while the profit figure and the liability are both wrong.",
    spot: "Match every invoice, receipt, and bank transaction in the period against a posting in the books."
  },
  {
    id: "commission",
    name: "2. Error of commission",
    summary: "The right amount reached the wrong account of the same type.",
    example:
      "A RM 800 receipt from customer Ahmad is credited to customer Aminah. Both are trade receivables.",
    why: "Total trade receivables is still correct, so the credit column total does not move. Only the two individual customer balances are wrong.",
    spot: "Agree the receivables and payables control account totals with the sum of the individual customer and supplier balances, then review the individual balances themselves."
  },
  {
    id: "principle",
    name: "3. Error of principle",
    summary: "The right amount reached an account of the wrong category.",
    example:
      "A RM 5,000 laptop is debited to Office Expenses instead of Equipment. An asset has been treated as an expense.",
    why: "A debit was still recorded as a debit, so the totals agree. But profit is understated by RM 5,000 and total assets are understated by RM 5,000. This is usually the most damaging of the five because it distorts both the profit and the balance sheet.",
    spot: "Review large expense postings and ask whether the item will still be used by the business next year. If it will, it may belong in an asset account."
  },
  {
    id: "original-entry",
    name: "4. Error of original entry",
    summary: "The wrong figure was taken from the document, then used on both sides.",
    example:
      "A sales invoice for RM 940 is read as RM 490 and posted as RM 490 to both the debit and the credit.",
    why: "The same incorrect amount appears on both sides, so the difference between the columns is zero. Revenue and receivables are each understated by RM 450.",
    spot: "Trace a sample of postings back to the original document and compare the figures character by character. Transposed digits are easy to miss."
  },
  {
    id: "compensating",
    name: "5. Compensating error",
    summary: "Two unrelated errors of equal size cancel each other out.",
    example:
      "Sales is overstated by RM 300 and Rent Expense is overstated by RM 300. The errors are unconnected.",
    why: "One error inflates the credit column and the other inflates the debit column by the same amount. The net effect on the totals is nil, so nothing looks unusual.",
    spot: "These are the hardest to find. Comparing each account with the previous period is usually more effective than re-checking the totals."
  }
] as const;

const faqs = [
  {
    question: "Does a balanced trial balance mean my accounts are correct?",
    answer:
      "No. A balanced trial balance only proves that total debits equal total credits. It confirms arithmetical accuracy of the postings, not that the correct accounts, categories, or amounts were used."
  },
  {
    question: "What errors does a trial balance actually detect?",
    answer:
      "It detects errors that make one column differ from the other. These include one-sided postings, entering an amount on the wrong side of a single account, transposing digits in one account only, and mistakes when adding up a column."
  },
  {
    question: "If the trial balance balances, what should I check next?",
    answer:
      "Reconcile bank and cash balances to external statements, agree the receivables and payables ledgers to the individual balances, trace a sample of entries to source documents, and compare each balance with the previous period."
  },
  {
    question: "What is a suspense account used for?",
    answer:
      "A suspense account temporarily holds a difference while the cause is investigated. It applies when a trial balance does not balance. The five errors described in this guide leave the totals in agreement, so no suspense account appears."
  },
  {
    question: "Can the Trial Balance Calculator find these five errors?",
    answer:
      "No, and no tool that only compares column totals can. The calculator totals your debit and credit balances and shows the difference, which addresses arithmetical accuracy only. The five errors here keep that difference at zero, so they must be found by reviewing the accounts themselves."
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

export default function ErrorsNotRevealedByTrialBalanceGuidePage() {
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
                Quick answer: balancing is not the same as being correct
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A trial balance tests one thing only: whether the total of the debit column equals
                the total of the credit column. That is a test of arithmetic, not of judgement.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                An error that removes the same amount from both sides, or adds the same amount to
                both sides, leaves the two totals in perfect agreement. Five well-known error types
                do exactly that, which is why a set of books can balance to the last cent and still
                report the wrong profit.
              </p>
              <SimpleTable
                headers={["Error type", "What went wrong", "Why the totals still agree"]}
                rows={errorTable}
              />
            </section>

            <section className="mt-12">
              <SectionHeading id="what-it-proves">
                What a trial balance actually proves
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Under double-entry bookkeeping, every transaction is recorded with a debit and a
                matching credit. If that rule was followed every time, the sum of all debit
                balances must equal the sum of all credit balances. The trial balance checks that
                sum.
              </p>
              <div className="mt-6 space-y-6 text-base leading-7 text-slate-950">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">What agreement tells you</h3>
                  <p className="mt-2">
                    Each entry that was made had two sides of equal value, the ledger balances were
                    carried across correctly, and the columns were added up correctly.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    What agreement does not tell you
                  </h3>
                  <p className="mt-2">
                    It says nothing about whether a transaction was recorded at all, whether it
                    reached the right account, whether it was classified as the right type of
                    account, or whether the amount matched the underlying document.
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Put simply, the trial balance checks the bookkeeping mechanics. It does not check
                the accounting decisions behind them.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms in plain English</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These names come up in textbooks and exam questions. The wording differs between
                syllabuses, but the ideas are the same.
              </p>
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
              <SectionHeading id="five-errors">
                The five errors a trial balance will not catch
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Each one below keeps the debit and credit totals equal. For each, the example shows
                what happened, why the totals still agree, and the check most likely to find it.
              </p>
              <div className="mt-8 space-y-10">
                {detailedErrors.map((error) => (
                  <div className="scroll-mt-28" id={error.id} key={error.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {error.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-950">{error.summary}</p>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                        Example
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-950">{error.example}</p>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-950">
                      <span className="font-semibold">Why it still balances. </span>
                      {error.why}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">How to spot it. </span>
                      {error.spot}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="example">
                Worked example: a trial balance that balances and still misstates profit
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A business buys a laptop for RM 5,000 in cash and posts the debit to Office
                Expenses instead of Equipment. Below is the trial balance that results.
              </p>
              <SimpleTable
                headers={["Account", "Debit (RM)", "Credit (RM)"]}
                rows={[
                  ["Cash", "15,000", "-"],
                  ["Equipment", "0", "-"],
                  ["Office Expenses", "9,000", "-"],
                  ["Trade Payables", "-", "4,000"],
                  ["Capital", "-", "20,000"],
                  ["Total", "24,000", "24,000"]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Both columns total RM 24,000, so the trial balance agrees and nothing looks wrong.
                Yet Office Expenses contains RM 5,000 that belongs in Equipment. Profit for the
                period is understated by RM 5,000 and total assets are understated by the same
                amount.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Correcting it means debiting Equipment RM 5,000 and crediting Office Expenses
                RM 5,000. Notice that the correcting entry has a debit and a credit of equal value,
                which is exactly why the original error never disturbed the totals.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="does-catch">
                What a trial balance does catch
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The picture is not all bad. Any error that changes one column without changing the
                other will show up as a difference between the totals.
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {detectedErrors.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                If your totals do not agree, the cause is one of these rather than the five above.
                The{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/guides/why-trial-balance-not-balancing"
                >
                  guide on why a trial balance is not balancing
                </Link>{" "}
                works through how to trace the difference.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="how-to-check">
                How to check the books once the totals agree
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Agreement of the columns is where the review starts, not where it ends. These
                checks look for the errors the totals cannot reveal.
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {furtherChecks.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Comparing each balance against the previous period is the single most useful habit.
                Compensating errors and errors of principle rarely look wrong on their own, but
                they often look odd next to last period.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Review checklist</SectionHeading>
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
                audit or accounting advice for a specific set of accounts.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Check the arithmetic first
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Total your debit and credit balances and confirm they agree, then use the
                    checks above to review the accounts behind the totals.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/guides/why-trial-balance-not-balancing"
                  >
                    Not Balancing?
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/trial-balance-calculator"
                  >
                    Trial Balance Calculator
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Trial Balance Error FAQs"
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
