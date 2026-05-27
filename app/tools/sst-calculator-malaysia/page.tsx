import { SstCalculatorMalaysia } from "@/components/calculators/SstCalculatorMalaysia";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "SST Calculator Malaysia | Add or Remove SST by Category",
  description:
    "Estimate Malaysia SST with add/remove calculations, suggested category rates, manual overrides, and a clean SST summary card.",
  path: "/tools/sst-calculator-malaysia"
});

const sstFaqs = [
  {
    question: "Can this calculator tell me the official SST rate for my product?",
    answer:
      "No. It suggests common rates for learning and estimation, but official treatment may depend on taxable service category, goods classification, exemption status, and current RMCD/MySST rules."
  },
  {
    question: "What is the difference between adding and removing SST?",
    answer:
      "Add SST when your amount is before SST. Remove SST when your amount already includes SST and you want to estimate the amount before SST."
  },
  {
    question: "Why do some services use 6% and others 8%?",
    answer:
      "Some service categories commonly use different rates. The category selector shows suggested rates, but you should confirm the actual treatment with official guidance or an accountant."
  },
  {
    question: "Can I use this for goods with 5% or 10% sales tax?",
    answer:
      "Yes, for arithmetic estimates. The calculator includes goods categories for 0%, 5%, and 10%, plus a manual option when the goods treatment is specific or uncertain."
  },
  {
    question: "What if I am not sure which SST category applies?",
    answer:
      "Use the manual or unsure category only for estimation, then check RMCD/MySST guidance or ask a qualified professional before issuing tax invoices."
  },
  {
    question: "Is this calculator official tax advice?",
    answer:
      "No. AccountingToolsLab provides calculation helpers for learning and record-keeping. This tool is not official tax advice and does not replace RMCD/MySST guidance."
  }
];

const categorySummaries = [
  ["General taxable services", "Suggested 8%"],
  ["F&B, logistics, telecommunications, parking", "Suggested 6%"],
  ["Credit or charge card services", "Special fixed RM25 treatment"],
  ["Goods exempt or zero-rated", "Suggested 0%"],
  ["Some taxable goods", "Suggested 5% or 10%"],
  ["Specific or uncertain goods", "Use manual rate after checking guidance"]
];

export default function SstCalculatorMalaysiaPage() {
  const pageUrl = `${siteConfig.url}/tools/sst-calculator-malaysia`;

  return (
    <ToolPageLayout eyebrow="Malaysia Tax Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "SST Calculator Malaysia", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="SST Calculator Malaysia"
        url={pageUrl}
      />
      <FAQJsonLd faqs={sstFaqs} />
      <div className="max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          SST Calculator Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Estimate Malaysia SST with add/remove calculations, suggested category rates, and a
          cleaner summary for business checks. Use it for arithmetic and record-keeping checks,
          not official tax classification.
        </p>
      </div>
      <SstCalculatorMalaysia />

      <section className="border-t border-stone-200 pt-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Learn the SST arithmetic
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          If you want a walkthrough of the formulas, read{" "}
          <Link
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/sst-calculator-malaysia-add-remove-sst"
          >
            how to add or remove SST in Malaysia
          </Link>
          . If you are preparing a simple invoice, review{" "}
          <Link
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/how-to-create-a-simple-invoice"
          >
            how to create a simple invoice
          </Link>{" "}
          and confirm the SST treatment separately.
        </p>
      </section>

      <FAQSection faqs={sstFaqs} title="SST Calculator Malaysia FAQs" />
    </ToolPageLayout>
  );
}
