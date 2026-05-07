import { TrialBalanceCalculator } from "@/components/calculators/TrialBalanceCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
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
      <TrialBalanceCalculator />
      <FAQSection faqs={trialBalanceFaqs} />
    </ToolPageLayout>
  );
}
