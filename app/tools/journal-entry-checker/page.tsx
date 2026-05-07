import { JournalEntryChecker } from "@/components/calculators/JournalEntryChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
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
      <JournalEntryChecker />
      <RelatedLinks
        title="Learn how journal entries work"
        links={[
          {
            title: "Journal Entries for Beginners",
            href: "/guides/journal-entries-for-beginners",
            description: "Learn journal entry format, debit and credit examples, and the balancing rule."
          },
          {
            title: "Debit vs Credit",
            href: "/guides/debit-vs-credit",
            description: "Review which account types increase with debits and which increase with credits."
          },
          {
            title: "Trial Balance Explained",
            href: "/guides/trial-balance-explained",
            description: "See how ledger balances from journal entries are checked in a trial balance."
          },
          {
            title: "Why Trial Balance Does Not Balance",
            href: "/guides/why-trial-balance-not-balancing",
            description: "Learn what to check when debit and credit totals do not match later."
          }
        ]}
      />
      <FAQSection faqs={journalEntryFaqs} title="Journal Entry Checker FAQs" />
    </ToolPageLayout>
  );
}
