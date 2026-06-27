import { TrialBalanceCalculator } from "@/components/calculators/TrialBalanceCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Free Trial Balance Calculator | Trial Balance Generator",
  description:
    "Use this free trial balance calculator to total debit and credit balances, generate a simple trial balance worksheet, and find the difference instantly.",
  path: "/tools/trial-balance-calculator"
});

const trialBalanceFaqs = [
  {
    question: "What is a trial balance calculator?",
    answer:
      "A trial balance calculator helps total debit and credit balances in an accounting worksheet so you can quickly see whether the trial balance is balanced."
  },
  {
    question: "Can I use this as a trial balance generator?",
    answer:
      "Yes. Enter account names and debit or credit balances, then the tool generates a simple trial balance layout with total debits, total credits, the difference, and a balanced or unbalanced status."
  },
  {
    question: "How do I calculate trial balance in accounting?",
    answer:
      "List each ledger account balance, place each amount in either the debit or credit column, add the debit column, add the credit column, and compare the totals. A trial balance is balanced when total debits equal total credits."
  },
  {
    question: "Why might a trial balance not balance?",
    answer:
      "A trial balance may not balance because of missing entries, wrong-side posting, duplicated amounts, typing mistakes, or balances taken from different periods."
  },
  {
    question: "Does a balanced trial balance mean there are no errors?",
    answer:
      "No. A balanced trial balance means total debit and credit amounts agree, but classification mistakes, omitted explanations, or posting errors can still exist."
  },
  {
    question: "What is the difference between debit and credit in a trial balance?",
    answer:
      "Debit and credit are the two sides used to record account balances. In a trial balance, each account amount is placed on one side so the totals can be checked against each other."
  },
  {
    question: "When should I use a trial balance calculator?",
    answer:
      "Use a trial balance calculator before preparing financial statements, after posting ledger balances, or whenever you want to review whether your debit and credit totals agree."
  }
];

export default function TrialBalanceCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/trial-balance-calculator`;

  return (
    <ToolPageLayout eyebrow="Accounting Tools">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Trial Balance Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Trial Balance Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={trialBalanceFaqs} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Free Trial Balance Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Enter account balances in the debit or credit column to generate a clean trial balance
          worksheet layout, total both sides, and check whether the trial balance is balanced.
        </p>
      </div>
      <TrialBalanceCalculator />
      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Calculate a trial balance in a few steps
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use this trial balance calculator or generator to review account balances in a simple
            accounting worksheet format. It is useful when you want to check debit and credit
            totals quickly before moving on to reports or further accounting work.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {[
              "Enter an account name for each ledger balance you want to check.",
              "Type the amount in either the debit or credit column for that row.",
              "Review the running totals to see whether the trial balance is balanced.",
              "Use the difference shown to spot entries that may need correction.",
              "Add or remove rows as needed until your account list matches your worksheet."
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
          Use the trial balance before preparing reports
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          A trial balance helps you check whether total debits equal total credits before
          preparing financial statements. It does not replace full review work, but it gives you
          a practical checkpoint before moving into income statements, balance sheets, or further
          bookkeeping adjustments.
        </p>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Common trial balance checks
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {[
              "Look for missing entries if an account balance was left out of the worksheet.",
              "Check for wrong side posting when a debit is entered as a credit or the reverse.",
              "Review duplicate amounts that may have been entered twice by mistake.",
              "Compare the unbalanced totals and difference to narrow down where to investigate first."
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Connect trial balance with other accounting tools
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use related accounting tools to continue checking the numbers after your trial balance
            worksheet is reviewed, especially when you want to connect bookkeeping, cash flow, and
            business analysis tasks.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/invoice-generator">Invoice Generator</ButtonLink>
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <FAQSection faqs={trialBalanceFaqs} title="Trial Balance Calculator FAQs" />
    </ToolPageLayout>
  );
}
