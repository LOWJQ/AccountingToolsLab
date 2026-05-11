import { SstCalculatorMalaysia } from "@/components/calculators/SstCalculatorMalaysia";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "SST Calculator Malaysia | Add or Remove SST",
  description:
    "Use this free SST Calculator Malaysia to estimate SST amount, total including SST, or amount before SST using a selected SST rate.",
  path: "/tools/sst-calculator-malaysia"
});

const sstFaqs = [
  {
    question: "What is SST in Malaysia?",
    answer:
      "SST commonly refers to Sales and Service Tax in Malaysia. This calculator only estimates amounts based on a selected rate."
  },
  {
    question: "How do I add SST to a price?",
    answer:
      "Multiply the amount before SST by the SST rate, then add the SST amount to the original amount."
  },
  {
    question: "How do I remove SST from a price?",
    answer:
      "Divide the total including SST by 1 plus the SST rate, then subtract that amount from the total to estimate SST."
  },
  {
    question: "Does this calculator tell me which SST rate applies?",
    answer:
      "No. It does not decide whether an item is taxable or which rate applies. Check official RMCD/MySST guidance or a tax professional."
  },
  {
    question: "Is SST the same as income tax?",
    answer:
      "No. SST is different from income tax and should not be treated as the same calculation."
  },
  {
    question: "Can this calculator be used for invoices?",
    answer:
      "It can help estimate SST arithmetic for an invoice, but it does not confirm tax treatment or legal invoice requirements."
  }
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
          Estimate SST amount, total including SST, or amount before SST using a selected SST
          rate.
        </p>
      </div>
      <SstCalculatorMalaysia />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Using SST arithmetic on invoices
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          If you are checking SST arithmetic, read{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/sst-calculator-malaysia-add-remove-sst"
          >
            how to add or remove SST in Malaysia
          </a>
          . If you are preparing an invoice, review{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/how-to-create-a-simple-invoice"
          >
            how to create a simple invoice
          </a>{" "}
          and check official guidance or a qualified professional before deciding tax treatment.
        </p>
      </section>
      <FAQSection faqs={sstFaqs} title="SST Calculator Malaysia FAQs" />
    </ToolPageLayout>
  );
}
