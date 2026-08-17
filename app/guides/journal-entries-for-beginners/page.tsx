import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Journal Entries: How to Know Which Accounts to Use";
const guidePath = "/guides/journal-entries-for-beginners";
const pageDescription =
  "Choosing the sides is the easy half. The hard half is turning a sentence into two account names, and knowing when the answer is Prepaid Insurance rather than Insurance Expense.";

export const metadata = createMetadata({
  title: pageTitle,
  description:
    "The hard part of a journal entry is picking the accounts, not the sides. Learn a four-question method and when to use prepaid, accrued, and unearned accounts.",
  path: guidePath
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Turning a sentence into an entry", href: "#the-method" },
  { label: "Key terms", href: "#key-terms" },
  { label: "When cash and benefit differ", href: "#timing-accounts" },
  { label: "Entries with more than two lines", href: "#compound" },
  { label: "Worked examples", href: "#examples" },
  { label: "Four traps", href: "#traps" },
  { label: "Checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "Journal entry",
    meaning:
      "The record of one transaction, listing the accounts affected and the amount debited and credited. It is where a transaction enters the books."
  },
  {
    term: "Narration",
    meaning:
      "The short explanation written under an entry saying what it was for. It is what makes the entry understandable to someone reading it months later."
  },
  {
    term: "Compound entry",
    meaning:
      "An entry with more than two lines. Perfectly valid, as long as total debits still equal total credits."
  },
  {
    term: "Prepaid expense",
    meaning:
      "Something paid for before it is used. It is an asset until consumed, which is why it is Prepaid Insurance and not Insurance Expense on the day you pay."
  },
  {
    term: "Accrued expense",
    meaning:
      "Something used before it is paid for. It is a liability, because the benefit has been taken and the obligation to pay exists."
  },
  {
    term: "Unearned revenue",
    meaning:
      "Money received before the work is delivered. It is a liability, not revenue, because the business still owes the customer something."
  },
  {
    term: "Adjusting entry",
    meaning:
      "An entry made at period end to move amounts into the period they belong to, such as converting part of a prepayment into an expense."
  }
] as const;

const methodSteps = [
  [
    "1. What did the business receive?",
    "Cash, stock, equipment, or a service consumed",
    "This is usually one account"
  ],
  [
    "2. What did it give up or now owe?",
    "Cash paid out, or a new obligation created",
    "This is usually the other account"
  ],
  [
    "3. Has the cash moved at a different time?",
    "Paid early, or used now and paying later",
    "This is where prepaid, accrued, and unearned accounts appear"
  ],
  [
    "4. What type is each account?",
    "Asset, liability, equity, revenue, expense, drawings",
    "Only now does the debit or credit side get decided"
  ]
] as const;

const timingTable = [
  [
    "You pay before you use it",
    "Prepaid Expense",
    "Asset",
    "Insurance paid 12 months ahead"
  ],
  [
    "You use it before you pay",
    "Accrued Expense",
    "Liability",
    "March electricity billed in April"
  ],
  [
    "Customer pays before you deliver",
    "Unearned Revenue",
    "Liability",
    "Deposit for work starting next month"
  ],
  [
    "You deliver before the customer pays",
    "Trade Receivables",
    "Asset",
    "Invoice issued on 30-day terms"
  ]
] as const;

const traps = [
  {
    id: "jumping-to-sides",
    name: "1. Reaching for debit and credit too early",
    summary: "The sides are the last decision, not the first.",
    example:
      "Given a sentence about paying rent, people immediately think about which side rent goes on before confirming whether the account is Rent Expense or Prepaid Rent.",
    why: "Choosing a side for the wrong account produces an entry that balances perfectly and is still wrong. The trial balance will never flag it.",
    fix: "Name both accounts in full before thinking about sides at all."
  },
  {
    id: "expense-not-asset",
    name: "2. Expensing something paid for in advance",
    summary: "Paying does not make it an expense yet.",
    example:
      "RM 6,000 of insurance covering the next twelve months is debited entirely to Insurance Expense on the day of payment.",
    why: "The benefit has not been consumed. Recording it all as an expense understates profit this period and overstates it in the eleven periods that follow.",
    fix: "Debit Prepaid Insurance, then move RM 500 into Insurance Expense each month with an adjusting entry."
  },
  {
    id: "revenue-too-early",
    name: "3. Treating a deposit as revenue",
    summary: "Cash received is not the same as revenue earned.",
    example:
      "A RM 3,000 deposit for work starting next month is credited to Revenue on receipt.",
    why: "The business still owes the customer the work, so the amount is an obligation rather than income. Recording it as revenue overstates this period and leaves nothing for the period the work is actually done.",
    fix: "Credit Unearned Revenue, and move it to Revenue as the work is delivered."
  },
  {
    id: "accrual-double-count",
    name: "4. Forgetting to reverse an accrual",
    summary: "The expense gets counted twice when the real invoice arrives.",
    example:
      "March electricity is accrued at RM 400. In April the actual bill is posted in full, and nobody removes the accrual.",
    why: "The same cost now sits in the books twice, overstating expenses and understating profit. It also leaves a liability that never clears.",
    fix: "Reverse the accrual at the start of the new period so the real invoice can be posted normally."
  }
] as const;

const checklist = [
  "I wrote down what the business received before thinking about sides.",
  "I wrote down what it gave up or now owes.",
  "I checked whether the cash moved at a different time from the benefit.",
  "I used a prepaid, accrued, or unearned account where the timing differed.",
  "I identified the account type for every line.",
  "I applied the debit and credit rule for each type.",
  "I confirmed total debits equal total credits.",
  "I added a narration explaining what the entry was for."
] as const;

const sidebarGuides = [
  guideLink("debit-vs-credit"),
  guideLink("why-trial-balance-not-balancing"),
  guideLink("errors-not-revealed-by-a-trial-balance")
];

const faqs = [
  {
    question: "How do I know which accounts a transaction affects?",
    answer:
      "Ask what the business received and what it gave up or now owes. Those two answers are usually your two accounts. Then check whether the cash moved at a different time from the benefit, because that is when a prepaid, accrued, or unearned account belongs in the entry instead of the obvious one."
  },
  {
    question: "What is the difference between the journal and the ledger?",
    answer:
      "The journal records transactions in date order as they happen, so it reads like a diary. The ledger groups the same entries by account, so you can see everything that hit Cash or Rent Expense in one place. Every entry starts in the journal and is then posted to the ledger."
  },
  {
    question: "Do debits always have to be listed before credits?",
    answer:
      "By convention yes. Debit lines are written first and credit lines below them, usually indented. It is a formatting convention rather than a rule that changes the accounting, but following it makes entries far quicker for someone else to read."
  },
  {
    question: "Is a narration required on a journal entry?",
    answer:
      "It is not mathematically required, but leaving it out is a mistake you will regret. Months later, an entry without an explanation is very hard to verify or correct, and it is usually the first thing an auditor or accountant asks about."
  },
  {
    question: "What is an adjusting entry?",
    answer:
      "An entry made at period end to move amounts into the period they belong to. Converting one month of a twelve-month prepayment into an expense is an adjusting entry, as is recording an expense that has been incurred but not yet billed."
  },
  {
    question: "Does the Journal Entry Checker tell me if I picked the right accounts?",
    answer:
      "No. It totals your debit and credit lines and confirms whether the entry balances, which catches arithmetic problems and missing lines. Whether Prepaid Insurance was the right account rather than Insurance Expense is a judgement it cannot make, and a wrong account will still balance perfectly."
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

function EntryBlock({
  caption,
  lines,
  reasoning
}: {
  caption: string;
  lines: ReadonlyArray<readonly [string, string, string]>;
  reasoning: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">{caption}</h3>
      <SimpleTable
        headers={["Account", "Debit (RM)", "Credit (RM)"]}
        rows={lines.map((line) => [line[0], line[1], line[2]])}
      />
      <p className="mt-4 text-base leading-7 text-slate-950">
        <span className="font-semibold">Why these accounts. </span>
        {reasoning}
      </p>
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

export default function JournalEntriesGuidePage() {
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
          datePublished: "2026-08-18",
          dateModified: "2026-08-18",
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
                Updated on 18 August 2026 <span aria-hidden="true">-</span> 10 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">
                Quick answer: pick the accounts before the sides
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Most people learn the debit and credit rules and still freeze when handed a
                sentence like &quot;paid RM 6,000 for twelve months of insurance&quot;. The rules
                were never the problem. Naming the accounts is.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Work through four questions in order, and only reach for debit and credit at the
                very end.
              </p>
              <SimpleTable
                headers={["Question", "What you are looking for", "Notes"]}
                rows={methodSteps}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                Once the accounts are named, deciding the side is mechanical. If that part is still
                shaky, the guide on{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/guides/debit-vs-credit"
                >
                  which side to use and why banks say the opposite
                </Link>{" "}
                covers it.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="the-method">
                Turning a sentence into an entry
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Every transaction is an exchange. The business gets something and gives up
                something, and each half of that exchange is one account.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Take &quot;the business paid RM 800 rent for this month by bank transfer&quot;. The
                business received the use of premises for the month, which is Rent Expense. It gave
                up money in the bank, which is Cash. Two accounts, identified before any thought
                about sides.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Question three is where most difficulty lives. If the cash moved at a different
                time from the benefit, the obvious account is the wrong one. That is the whole
                reason accounts like Prepaid Insurance and Unearned Revenue exist.
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
              <SectionHeading id="timing-accounts">
                When the cash and the benefit happen at different times
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                This single table answers the question that trips up more beginners than any other:
                when to use Prepaid Insurance instead of Insurance Expense, or Unearned Revenue
                instead of Revenue.
              </p>
              <SimpleTable
                headers={["Situation", "Account to use", "Type", "Example"]}
                rows={timingTable}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                The pattern is consistent. Paying early creates an <strong>asset</strong>, because
                you are owed something. Receiving early creates a <strong>liability</strong>,
                because you owe something. Using before paying creates a liability, and delivering
                before being paid creates an asset.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These balances do not sit there forever. An adjusting entry moves them across as
                the benefit is consumed or the work is delivered, which is shown in the second
                worked example below.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="compound">
                Entries with more than two lines
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Nothing says an entry must have exactly one debit and one credit. A compound entry
                can have several lines on either side, and it is correct as long as the two totals
                agree.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-950">
                This is where entries most often go wrong, because a missing line is easy to
                overlook when there are four or five. Checking the totals with the{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/tools/journal-entry-checker"
                >
                  journal entry checker
                </Link>{" "}
                catches that quickly.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="examples">
                Five sentences turned into entries
              </SectionHeading>
              <div className="mt-8 space-y-10">
                <EntryBlock
                  caption="1. Paid RM 500 cash for office supplies used this month"
                  lines={[
                    ["Office Supplies Expense", "500", "-"],
                    ["Cash", "-", "500"]
                  ]}
                  reasoning="The business received supplies and consumed them now, so the benefit and the payment happen together. No timing account is needed."
                />
                <EntryBlock
                  caption="2. Paid RM 6,000 for twelve months of insurance in advance"
                  lines={[
                    ["Prepaid Insurance", "6,000", "-"],
                    ["Cash", "-", "6,000"]
                  ]}
                  reasoning="Cash left now but no insurance cover has been used yet, so the business is owed something. That makes it an asset rather than an expense. Insurance Expense would be wrong on this date."
                />
                <EntryBlock
                  caption="2a. One month later, the adjusting entry"
                  lines={[
                    ["Insurance Expense", "500", "-"],
                    ["Prepaid Insurance", "-", "500"]
                  ]}
                  reasoning="One twelfth of the cover has now been consumed, so RM 500 moves out of the asset and into the expense. Repeating this monthly empties the prepayment over the year."
                />
                <EntryBlock
                  caption="3. Received RM 3,000 from a client for work starting next month"
                  lines={[
                    ["Cash", "3,000", "-"],
                    ["Unearned Revenue", "-", "3,000"]
                  ]}
                  reasoning="Cash arrived but nothing has been delivered, so the business owes the client work. That is a liability. Crediting Revenue here would report income the business has not earned."
                />
                <EntryBlock
                  caption="4. Used RM 400 of electricity in March, bill arrives in April"
                  lines={[
                    ["Electricity Expense", "400", "-"],
                    ["Accrued Expenses", "-", "400"]
                  ]}
                  reasoning="The benefit was consumed in March, so the cost belongs to March even though no invoice exists yet. The unpaid obligation is a liability."
                />
                <EntryBlock
                  caption="5. Sold RM 1,000 of goods, RM 400 paid in cash and RM 600 on credit"
                  lines={[
                    ["Cash", "400", "-"],
                    ["Trade Receivables", "600", "-"],
                    ["Revenue", "-", "1,000"]
                  ]}
                  reasoning="One sale produced two different assets, so the entry needs three lines. Total debits of RM 1,000 still equal the single RM 1,000 credit."
                />
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="traps">Four traps worth naming</SectionHeading>
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
                      <span className="font-semibold">Why it matters. </span>
                      {trap.why}
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-950">
                      <span className="font-semibold">What to do. </span>
                      {trap.fix}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-base leading-7 text-slate-950">
                Notice that all four produce entries that balance. A wrong account never disturbs
                the totals, which is why they survive into the trial balance untouched. The guide
                on{" "}
                <Link
                  className="font-semibold underline underline-offset-4"
                  href="/guides/errors-not-revealed-by-a-trial-balance"
                >
                  errors a balanced trial balance will not catch
                </Link>{" "}
                explains how they are eventually found.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">Checklist for any entry</SectionHeading>
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
                    Check the entry balances
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Enter your debit and credit lines to confirm the totals agree, then use the
                    checklist above to confirm the accounts were the right ones.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/debit-credit-checker"
                  >
                    Debit/Credit Checker
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/journal-entry-checker"
                  >
                    Journal Entry Checker
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Journal Entry FAQs"
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
