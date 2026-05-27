import { JournalEntryChecker } from "@/components/calculators/JournalEntryChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

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
    answer:
      "A journal entry balances when total debit amounts equal total credit amounts."
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Journal Entry Checker
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Enter debit and credit lines to check whether total debits equal total credits in a
          basic journal entry.
        </p>
      </div>
      <JournalEntryChecker />
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Check journal entries in a few steps
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Use this journal entry checker to enter account names, debit amounts, and credit
            amounts, then review whether total debits and credits balance in a basic double-entry
            accounting entry.
          </p>
          <p>→ Enter the account name for each journal entry line.</p>
          <p>→ Fill in the debit amount or the credit amount for that line.</p>
          <p>→ Add more lines when the transaction needs multiple accounts.</p>
          <p>→ Review the total debits and credits, difference, and status instantly.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Understand balanced journal entries
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            A journal entry is balanced when total debits equal total credits. This is a core rule
            of double-entry accounting because each transaction records equal value on both sides of
            the entry.
          </p>
          <p>
            A balanced journal entry checks the math, but it does not always confirm that the
            correct accounts were used. An entry can balance and still contain the wrong account
            choice or incorrect debit and credit treatment.
          </p>
          <p>
            That is why a journal entry balance check is helpful for reviewing totals first, then
            following up with a debit and credit checker or other accounting review when needed.
          </p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          When to use this journal entry checker
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>→ Check accounting homework that requires total debits and credits to balance.</p>
          <p>→ Review bookkeeping entries before posting them to accounts.</p>
          <p>→ Practice double-entry accounting with simple transaction examples.</p>
          <p>→ Recheck debit and credit totals when an entry looks incomplete or uneven.</p>
          <p>→ Find entry mistakes such as missing values or unbalanced lines.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Connect journal entry checks with other accounting tools
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          After using this journal entry checker, you can continue with related tools to confirm
          debit and credit direction, review trial balance totals, connect entries to the accounting
          equation, and explore broader financial analysis.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/debit-credit-checker" variant="secondary">
            Debit/Credit Checker
          </ButtonLink>
          <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
            Trial Balance Calculator
          </ButtonLink>
          <ButtonLink href="/tools/accounting-equation-calculator" variant="secondary">
            Accounting Equation Calculator
          </ButtonLink>
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <FAQSection faqs={journalEntryFaqs} title="Journal Entry Checker FAQs" />
    </ToolPageLayout>
  );
}
