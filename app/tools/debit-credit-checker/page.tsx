import type { Metadata } from "next";
import { DebitCreditChecker } from "@/components/calculators/DebitCreditChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Debit/Credit Checker | Know Whether to Debit or Credit",
  description:
    "Use this free debit and credit checker to find out whether to debit or credit an account based on the account type and whether it increases or decreases."
};

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
      <DebitCreditChecker />
      <FAQSection faqs={debitCreditFaqs} title="Debit/Credit Checker FAQs" />
    </ToolPageLayout>
  );
}
