import { TrialBalanceCalculator } from "@/components/calculators/TrialBalanceCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Free Trial Balance Calculator | Check Debits and Credits",
  description:
    "Use this free trial balance calculator to total debits and credits, check whether your trial balance is balanced, and find the difference instantly.",
  path: "/tools/trial-balance-calculator"
});

const trialBalanceFaqs = [
  {
    question: "What is a trial balance calculator?",
    answer:
      "A trial balance calculator totals debit and credit amounts so you can check whether both sides match."
  },
  {
    question: "What does it mean if my trial balance is unbalanced?",
    answer:
      "It means total debits and total credits do not match. The difference should be checked for missing accounts, wrong-side entries, or typing mistakes."
  },
  {
    question: "Does a balanced trial balance mean there are no errors?",
    answer:
      "No. A balanced trial balance means debits and credits match, but classification or posting errors can still exist."
  },
  {
    question: "Can I use this calculator for homework?",
    answer:
      "Yes. It can help you check totals and understand differences, but you should still show your own working."
  },
  {
    question: "What causes trial balance differences?",
    answer:
      "Common causes include entering amounts on the wrong side, missing an account, typing wrong digits, or mixing balances from different periods."
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Trial Balance Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Enter account balances in the debit or credit column to preview a clean trial balance
          worksheet layout.
        </p>
      </div>
      <TrialBalanceCalculator />
      <RelatedLinks
        title="Learn more about trial balances"
        links={[
          {
            title: "Trial Balance Explained",
            href: "/guides/trial-balance-explained",
            description: "Learn what a trial balance is, how it works, and why debits should equal credits."
          },
          {
            title: "Why Trial Balance Does Not Balance",
            href: "/guides/why-trial-balance-not-balancing",
            description: "Use common difference clues to find missing accounts, wrong-side entries, and typing mistakes."
          },
          {
            title: "Journal Entries for Beginners",
            href: "/guides/journal-entries-for-beginners",
            description: "Review how debit and credit entries are created before they reach the trial balance."
          },
          {
            title: "Debit vs Credit",
            href: "/guides/debit-vs-credit",
            description: "Learn the account rules that decide whether a balance belongs on the debit or credit side."
          }
        ]}
      />
      <FAQSection faqs={trialBalanceFaqs} title="Trial Balance Calculator FAQs" />
    </ToolPageLayout>
  );
}
