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
  title: "SST Calculator Malaysia | Category Rates & Invoice Breakdown",
  description:
    "Estimate Malaysia SST with quick add/remove calculations, suggested category rates, manual overrides, and invoice-style line item breakdowns.",
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
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          SST Calculator Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Estimate Malaysia SST with quick add/remove calculations, suggested category rates,
          manual overrides, and invoice-style line item breakdowns. Use it for arithmetic and
          record-keeping checks, not official tax classification.
        </p>
      </div>
      <SstCalculatorMalaysia />

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">What it helps with</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Quick SST checks and invoice breakdowns
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use quick mode when you have one amount and want to add or remove SST. Use invoice
            breakdown when an invoice or receipt has several line items with different common
            SST categories or manual rates.
          </p>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Add vs remove SST</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Choose the direction first
          </h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              Add SST when the amount entered is before SST and you want the SST amount plus
              final total.
            </p>
            <p>
              Remove SST when the amount entered already includes SST and you want to estimate
              the amount before SST.
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Suggested category rates</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Common SST categories included
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
          These are suggested/common rates for estimation. Goods and services can depend on
          official classification, exemptions, registration status, and updated RMCD/MySST
          guidance.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categorySummaries.map(([label, rate]) => (
            <div
              className="rounded-xl border border-stone-200 bg-stone-50 p-4"
              key={label}
            >
              <h3 className="text-sm font-semibold text-stone-950">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{rate}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-amber-700">Malaysia SST disclaimer</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Check official guidance before relying on SST treatment
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
          This tool estimates arithmetic only. It does not decide whether a product or service
          is taxable, exempt, or correctly classified. If you are unsure, check RMCD/MySST
          guidance or speak with your accountant before issuing tax invoices.
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
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
