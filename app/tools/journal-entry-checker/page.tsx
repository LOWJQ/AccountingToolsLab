import type { Metadata } from "next";
import { JournalEntryChecker } from "@/components/calculators/JournalEntryChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Journal Entry Checker | Check Debits and Credits",
  description:
    "Use this free journal entry checker to total debits and credits, check whether a journal entry balances, and find the difference."
};

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
      <JournalEntryChecker />
      <FAQSection faqs={journalEntryFaqs} title="Journal Entry Checker FAQs" />
    </ToolPageLayout>
  );
}
