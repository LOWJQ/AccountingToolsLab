import { DebitCreditChecker } from "@/components/calculators/DebitCreditChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideArticleSection } from "@/components/tools/RelatedGuideArticleSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Debit/Credit Checker | Know Whether to Debit or Credit",
  description:
    "Use this free debit and credit checker to find out whether to debit or credit an account based on the account type and whether it increases or decreases.",
  path: "/tools/debit-credit-checker"
});

const debitCreditFaqs = [
  {
    question: "What is a debit?",
    answer:
      "A debit is the left side of an accounting entry. It increases assets, expenses, and dividends or drawings."
  },
  {
    question: "What is a credit?",
    answer:
      "A credit is the right side of an accounting entry. It increases liabilities, equity, and revenue."
  },
  {
    question: "Do debits always increase accounts?",
    answer:
      "No. Debits increase some accounts and decrease others. It depends on the account type."
  },
  {
    question: "Which accounts increase with debits?",
    answer:
      "Assets, expenses, and dividends or drawings increase with debits."
  },
  {
    question: "Which accounts increase with credits?",
    answer:
      "Liabilities, equity, and revenue increase with credits."
  },
  {
    question: "Can this checker help with accounting homework?",
    answer:
      "Yes. It can help you check the direction of an account change, but you should still explain your reasoning."
  }
];

export default function DebitCreditCheckerPage() {
  const pageUrl = `${siteConfig.url}/tools/debit-credit-checker`;

  return (
    <ToolPageLayout eyebrow="Accounting Checker">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Debit/Credit Checker", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Debit/Credit Checker"
        url={pageUrl}
      />
      <FAQJsonLd faqs={debitCreditFaqs} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Debit/Credit Checker
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Choose an account type and whether it increases or decreases to see whether you should
          debit or credit the account.
        </p>
      </div>
      <DebitCreditChecker />
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Check debit or credit treatment in a few steps
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Use this debit credit checker when you need a quick way to see whether to debit or
            credit account changes. Choose the account type, decide whether the account increases
            or decreases, and the tool shows the treatment immediately.
          </p>
          <p>→ Select the account type you want to review.</p>
          <p>→ Choose whether the account is increasing or decreasing.</p>
          <p>→ See whether you should debit or credit the account.</p>
          <p>→ Review the short explanation and normal balance shown with the result.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Understand debit and credit rules
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Basic accounting debit and credit rules become easier when you focus on account type.
            Assets and expenses usually increase with a debit. Liabilities, equity, and income
            usually increase with a credit.
          </p>
          <p>
            The opposite side usually decreases the account. That means a credit often reduces an
            asset or expense, while a debit often reduces a liability, equity, or income account.
          </p>
          <p>
            This is why a debit or credit account decision depends on what kind of account you are
            working with, not just whether the number is going up or down. That same logic supports
            journal entries and double-entry accounting.
          </p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          When to use this debit and credit checker
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>→ Check accounting homework when you need to confirm debit or credit treatment.</p>
          <p>→ Practice journal entry logic before writing a full transaction.</p>
          <p>→ Review bookkeeping changes and make sure the account direction is correct.</p>
          <p>→ Learn the patterns behind double-entry accounting in a simple way.</p>
          <p>→ Recheck transaction treatment before moving on to a journal entry checker or trial balance.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Connect debit and credit checks with other accounting tools
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          After using this debit credit checker, you can continue with other tools to connect
          account direction with equation checks, balance reviews, cash analysis, and simple
          business documents.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/accounting-equation-calculator" variant="secondary">
            Accounting Equation Calculator
          </ButtonLink>
          <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
            Trial Balance Calculator
          </ButtonLink>
          <ButtonLink href="/tools/invoice-generator" variant="secondary">
            Free Invoice Generator Malaysia
          </ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <RelatedGuideArticleSection
        articles={[
          {
            description:
              "Learn debit and credit rules, normal balances, beginner examples, and how to know whether to debit or credit an account.",
            href: "/guides/debit-vs-credit",
            label: "Debit and credit guide",
            title: "Debit vs Credit"
          }
        ]}
        toolName="Debit/Credit Checker"
      />
      <FAQSection faqs={debitCreditFaqs} title="Debit/Credit Checker FAQs" />
    </ToolPageLayout>
  );
}
