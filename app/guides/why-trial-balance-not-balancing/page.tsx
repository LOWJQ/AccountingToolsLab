import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Why Is My Trial Balance Not Balancing?";
const guidePath = "/guides/why-trial-balance-not-balancing";
const pageDescription =
  "The size of the difference is a clue, not just a problem. Five arithmetic checks narrow the search in seconds, and a fixed search order finds whatever is left.";

export const metadata = createMetadata({
  title: pageTitle,
  description:
    "Use the difference to find the error. Re-add the columns, divide by 2, divide by 9, match it to an account balance, then search the ledger in a fixed order.",
  path: guidePath
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "What the difference tells you", href: "#what-difference-means" },
  { label: "Key terms", href: "#key-terms" },
  { label: "Five diagnostic checks", href: "#diagnostics" },
  { label: "If the checks find nothing", href: "#systematic-search" },
  { label: "Using a suspense account", href: "#suspense" },
  { label: "Worked example", href: "#example" },
  { label: "Search checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Difference",
    meaning:
      "The gap between the debit column total and the credit column total. Its exact size is the most useful clue you have, so write it down before changing anything."
  },
  {
    term: "Casting",
    meaning:
      "Adding up a column. A casting error means the individual figures are right but the total is wrong, which is the easiest fault to fix and the most often overlooked."
  },
  {
    term: "Transposition error",
    meaning:
      "Two digits written in the wrong order, such as 3,820 recorded as 3,280. The resulting difference is always divisible by nine."
  },
  {
    term: "Slide error",
    meaning:
      "A decimal point in the wrong place, such as RM 1,500 recorded as RM 150. Like a transposition, it produces a difference divisible by nine."
  },
  {
    term: "One-sided entry",
    meaning:
      "A transaction where only the debit or only the credit was posted. It moves one column without the other, which is exactly what makes a trial balance disagree."
  },
  {
    term: "Suspense account",
    meaning:
      "A temporary account opened for the amount of the difference so the trial balance can be presented while the cause is investigated."
  },
  {
    term: "Rectifying entry",
    meaning:
      "The journal entry that corrects the original mistake. When a suspense account was opened, the rectifying entry also clears it back to zero."
  }
] as const;

const checkTable = [
  ["Re-add both columns", "A casting or carry error in the totals"],
  ["Divide the difference by 2", "An amount entered on the wrong side"],
  ["Divide the difference by 9", "Transposed digits or a misplaced decimal point"],
  ["Match the difference to an account balance", "An account left off the trial balance entirely"],
  ["Check for a round 10, 100 or 1,000", "A carry mistake while adding"]
] as const;

const diagnostics = [
  {
    id: "recast",
    name: "1. Add both columns again",
    summary: "Before hunting through the ledger, confirm the totals themselves are right.",
    example:
      "A column that actually totals RM 48,600 but was written up as RM 48,060 produces a RM 540 difference with nothing wrong in the ledger at all.",
    why: "Casting errors are the most common cause and the cheapest to rule out. Add each column twice, once downwards and once upwards, so you do not repeat the same slip in the same direction.",
    action:
      "Re-total both columns before doing anything else. If a total changes, start the comparison again from the new figure."
  },
  {
    id: "divide-by-2",
    name: "2. Divide the difference by 2",
    summary: "Finds an amount that was put in the wrong column.",
    example:
      "The difference is RM 1,600. Half of it is RM 800. A rent expense of RM 800 sitting in the credit column instead of the debit column explains it exactly.",
    why: "Putting an amount on the wrong side does not simply remove it from one column, it also adds it to the other. The gap created is therefore twice the amount itself, so half the difference is the figure to hunt for.",
    action:
      "Halve the difference, then scan for an amount equal to that half. Check whether it sits on the side its account type would normally use."
  },
  {
    id: "divide-by-9",
    name: "3. Divide the difference by 9",
    summary: "Points to transposed digits or a decimal point in the wrong place.",
    example:
      "The difference is RM 540. Dividing by nine gives exactly 60, so a transposition is likely. RM 3,820 written as RM 3,280 is one candidate.",
    why: "Swapping two digits always changes a number by a multiple of nine, and shifting a decimal point does the same. So if the difference divides evenly by nine, the underlying figures are probably correct but were written down in the wrong order.",
    action:
      "Divide the difference by nine. If it divides evenly, compare each trial balance figure against its ledger balance digit by digit rather than glancing at them."
  },
  {
    id: "match-balance",
    name: "4. Compare the difference with each account balance",
    summary: "An exact match usually means an account never made it onto the list.",
    example:
      "The trial balance is short by RM 2,400 on the credit side, and a loan account with a RM 2,400 credit balance is missing from the list entirely.",
    why: "Leaving a whole account off the trial balance removes its balance from one column only. The difference is then exactly equal to that balance, which makes it easy to spot once you know to look for it.",
    action:
      "Count your ledger accounts and count the lines on the trial balance. If the two counts differ, find the missing account before anything else."
  },
  {
    id: "round-number",
    name: "5. Look at the shape of the number",
    summary: "A difference of exactly 10, 100 or 1,000 points at the addition, not the ledger.",
    example:
      "A difference of exactly RM 100 usually means a column of figures was carried across incorrectly rather than a transaction being mis-posted.",
    why: "Clean round differences rarely come from real transactions, which tend to produce untidy amounts. They almost always come from arithmetic while totalling or carrying between subtotals.",
    action:
      "Re-check subtotals and any figure carried from one page or section to the next."
  }
] as const;

const searchOrder = [
  "Confirm every ledger account appears on the trial balance, and that none appears twice.",
  "Compare each trial balance figure against its ledger balance, one line at a time.",
  "Re-total any ledger account whose balance looks unfamiliar.",
  "Check that opening balances were brought forward correctly from the previous period.",
  "Review postings made near the period end, where entries are most often left half-finished.",
  "Scan the journals for any entry where the debit and credit amounts differ.",
  "Check that each ledger balance was placed in the column its account type normally uses."
] as const;

const checklist = [
  "I wrote down the exact difference before changing anything.",
  "I re-added both columns downwards and upwards.",
  "I divided the difference by 2 and looked for that amount.",
  "I divided the difference by 9 to test for transposition.",
  "I compared the difference against every account balance.",
  "I checked that the number of ledger accounts matches the number of trial balance lines.",
  "I compared each trial balance figure against its ledger balance.",
  "I cleared any suspense account back to zero before preparing final accounts."
] as const;

const sidebarGuides = [
  {
    href: "/guides/errors-not-revealed-by-a-trial-balance",
    label: "Balanced Trial Balance: 5 Errors It Will Not Catch"
  },
  {
    href: "/guides/debit-vs-credit",
    label: "Debit vs Credit"
  },
  {
    href: "/guides/journal-entries-for-beginners",
    label: "Journal Entries: How to Know Which Accounts to Use"
  }
] as const;

const faqs = [
  {
    question: "Why is my trial balance not balancing?",
    answer:
      "Because something changed one column without changing the other. The usual causes are an addition error in the totals, an amount placed in the wrong column, transposed digits, an account left off the list, or a transaction where only one side was posted."
  },
  {
    question: "Can a trial balance balance and still be wrong?",
    answer:
      "Yes. Errors of omission, commission, principle, original entry, and compensating errors all leave the totals in agreement while the accounts remain wrong. Those are a separate problem from the one this guide solves, because they never produce a difference to investigate."
  },
  {
    question: "What is the difference between a transposition error and a slide error?",
    answer:
      "A transposition error swaps two digits, such as 3,820 written as 3,280. A slide error moves the decimal point, such as RM 1,500 written as RM 150. Both produce a difference divisible by nine, so the nine test flags either one and you compare against the ledger to tell them apart."
  },
  {
    question: "What if the difference does not divide by 2 or 9?",
    answer:
      "Then there is likely more than one error, or a one-sided entry of an ordinary amount. Stop applying shortcuts and switch to the ordered search: confirm every account is listed, then compare each trial balance figure against its ledger balance line by line."
  },
  {
    question: "Does a suspense account remain in the final accounts?",
    answer:
      "No. A suspense account is temporary. Once the error is found, a rectifying entry corrects the original account and clears suspense back to zero. A suspense balance still sitting in the books when final accounts are prepared means the cause was never identified."
  },
  {
    question: "Can the Trial Balance Calculator find the error for me?",
    answer:
      "It finds the difference, not the cause. The calculator totals your debit and credit balances and shows the exact gap, which is the number every check in this guide starts from. Identifying which entry created that gap still means comparing the trial balance against the ledger."
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

export default function WhyTrialBalanceNotBalancingGuidePage() {
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
                Quick answer: let the difference tell you where to look
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Work out the exact difference between the two column totals and write it down
                before touching anything. Its size narrows the search immediately.
              </p>
              <SimpleTable headers={["Check", "What it points to"]} rows={checkTable} />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Run them in that order. Most differences are explained by the first three, and each
                takes seconds compared with reading through the whole ledger.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="what-difference-means">
                What a difference actually tells you
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A trial balance only disagrees when something moved one column without moving the
                other. That is a genuinely useful restriction, because it rules out a large family
                of mistakes before you start.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A transaction posted to completely the wrong account still has a debit and a
                credit, so the totals stay level. The same is true of a transaction left out
                altogether. Neither can be the cause of your difference, so do not spend time
                looking for them here. They are covered in the companion guide on{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/guides/errors-not-revealed-by-a-trial-balance"
                >
                  errors a balanced trial balance will not catch
                </Link>
                .
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                What you are looking for is much narrower: an arithmetic slip, a figure in the
                wrong column, a figure written down incorrectly, a missing account, or an entry
                where only one side was posted.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms in plain English</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These appear in textbooks and exam questions on rectification of errors.
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
              <SectionHeading id="diagnostics">
                Five checks that narrow the search
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Each check takes the difference you already have and turns it into something
                specific to look for.
              </p>
              <div className="mt-8 space-y-10">
                {diagnostics.map((check) => (
                  <div className="scroll-mt-28" id={check.id} key={check.id}>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                      {check.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-slate-950">{check.summary}</p>
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                        Example
                      </p>
                      <p className="mt-2 text-base leading-7 text-slate-950">{check.example}</p>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-950">
                      <span className="font-semibold">Why it works. </span>
                      {check.why}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">What to do. </span>
                      {check.action}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="systematic-search">
                If none of the checks find it
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                When the shortcuts come up empty, the cause is usually more than one error at once,
                and the arithmetic clues stop working because the separate differences overlap.
                Switch to a fixed order and work through it without skipping steps.
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {searchOrder.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Checking that individual entries balance is quicker with the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/journal-entry-checker"
                >
                  journal entry checker
                </Link>
                , and the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/debit-credit-checker"
                >
                  debit and credit checker
                </Link>{" "}
                helps confirm which side a balance belongs on.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="suspense">
                Using a suspense account while you investigate
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                If you need the trial balance to agree before the error is found, open a suspense
                account for the amount of the difference, placed on whichever side is short. The
                totals then match and the unresolved problem stays visible rather than hidden.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                When you find the cause, the rectifying entry corrects the real account and removes
                the same amount from suspense. Done properly, suspense returns to zero on its own
                without a second adjustment.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A suspense balance must never survive into the final accounts. If one is still
                there, the difference was never explained, only parked.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="example">
                Worked example: a difference of RM 540
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A trial balance totals RM 48,060 on the debit side and RM 48,600 on the credit
                side. The credit column is higher by RM 540, so a debit somewhere is understated.
              </p>
              <SimpleTable
                headers={["Step", "Result"]}
                rows={[
                  ["Re-add both columns", "Totals confirmed, so not a casting error"],
                  ["Divide 540 by 2", "270, and no account shows a balance of RM 270"],
                  ["Divide 540 by 9", "Exactly 60, so a transposition is likely"],
                  [
                    "Compare each figure with the ledger",
                    "Equipment is RM 3,820 in the ledger but RM 3,280 on the trial balance"
                  ]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The digits 8 and 2 were swapped when the balance was copied across, understating
                the debit column by exactly RM 540. Correcting the figure brings the debit total to
                RM 48,600, matching the credit side.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Had a suspense account been opened, it would have held RM 540 on the debit side.
                The rectifying entry debits Equipment RM 540 and credits Suspense RM 540, clearing
                it to zero.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Notice that the nine test did the real work. Without it, the only option was
                comparing every line against the ledger one at a time.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Search checklist</SectionHeading>
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
                    Start by getting the exact difference
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Total your debit and credit balances to see the gap, then bring that number
                    back to the five checks above.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/guides/errors-not-revealed-by-a-trial-balance"
                  >
                    It Balances but Looks Wrong
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
              title="Trial Balance Difference FAQs"
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
