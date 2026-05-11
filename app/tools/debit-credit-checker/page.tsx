import { DebitCreditChecker } from "@/components/calculators/DebitCreditChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Debit/Credit Checker
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Choose an account type and whether it increases or decreases to see whether you should
          debit or credit the account.
        </p>
      </div>
      <DebitCreditChecker />
      <RelatedLinks
        title="Learn debit and credit rules"
        links={[
          {
            title: "Debit vs Credit",
            href: "/guides/debit-vs-credit",
            description: "Learn the beginner rules for which accounts increase with debits or credits."
          },
          {
            title: "Journal Entries for Beginners",
            href: "/guides/journal-entries-for-beginners",
            description: "See how debit and credit rules turn into balanced journal entries."
          },
          {
            title: "Journal Entry Checker",
            href: "/tools/journal-entry-checker",
            description: "Check whether debit and credit amounts balance in a full journal entry."
          },
          {
            title: "Accounting Equation Calculator",
            href: "/tools/accounting-equation-calculator",
            description: "Review how assets, liabilities, and equity connect to account direction."
          }
        ]}
      />
      <FAQSection faqs={debitCreditFaqs} title="Debit/Credit Checker FAQs" />
    </ToolPageLayout>
  );
}
