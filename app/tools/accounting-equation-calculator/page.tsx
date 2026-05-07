import { AccountingEquationCalculator } from "@/components/calculators/AccountingEquationCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Accounting Equation Calculator | Assets, Liabilities and Equity",
  description:
    "Use this free accounting equation calculator to solve for assets, liabilities, or equity using Assets = Liabilities + Equity.",
  path: "/tools/accounting-equation-calculator"
});

const accountingEquationFaqs = [
  {
    question: "What is the accounting equation?",
    answer:
      "The accounting equation is Assets = Liabilities + Equity. It shows how a business's resources are financed."
  },
  {
    question: "How do you calculate assets?",
    answer:
      "Add liabilities and equity together. Assets = Liabilities + Equity."
  },
  {
    question: "How do you calculate liabilities?",
    answer:
      "Subtract equity from assets. Liabilities = Assets - Equity."
  },
  {
    question: "How do you calculate equity?",
    answer:
      "Subtract liabilities from assets. Equity = Assets - Liabilities."
  },
  {
    question: "Can this calculator help with accounting homework?",
    answer:
      "Yes. It can help you check basic accounting equation problems, but you should still show your own working."
  },
  {
    question: "Why must the accounting equation balance?",
    answer:
      "It balances because every business resource is funded either by amounts owed to others or by the owner's claim."
  }
];

export default function AccountingEquationCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/accounting-equation-calculator`;

  return (
    <ToolPageLayout eyebrow="Accounting Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Accounting Equation Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Accounting Equation Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={accountingEquationFaqs} />
      <AccountingEquationCalculator />
      <RelatedLinks
        title="Continue learning accounting basics"
        links={[
          {
            title: "Debit vs Credit",
            href: "/guides/debit-vs-credit",
            description: "Learn how account types increase or decrease with debits and credits."
          },
          {
            title: "Journal Entries for Beginners",
            href: "/guides/journal-entries-for-beginners",
            description: "See how accounting equation changes are recorded as journal entries."
          },
          {
            title: "Trial Balance Explained",
            href: "/guides/trial-balance-explained",
            description: "Review how ledger balances are summarized after entries are posted."
          },
          {
            title: "Debit/Credit Checker",
            href: "/tools/debit-credit-checker",
            description: "Practice choosing the correct debit or credit direction for an account change."
          }
        ]}
      />
      <FAQSection
        faqs={accountingEquationFaqs}
        title="Accounting Equation Calculator FAQs"
      />
    </ToolPageLayout>
  );
}
