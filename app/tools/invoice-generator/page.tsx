import { InvoiceGenerator } from "@/components/calculators/InvoiceGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Free Invoice Generator | Download PDF Invoices",
  description:
    "Create a simple invoice with line items, business and customer details, optional SST or tax, PDF download, and 10 supported currencies including MYR.",
  path: "/tools/invoice-generator"
});

const invoiceFaqs = [
  {
    question: "What is an invoice?",
    answer:
      "An invoice is a document sent to a customer to request payment for goods or services."
  },
  {
    question: "What should an invoice include?",
    answer:
      "A simple invoice usually includes seller details, customer details, invoice number, dates, line items, subtotal, optional SST or tax, total, payment details, and notes."
  },
  {
    question: "Can I download the invoice as a PDF?",
    answer:
      "Yes. Use the Download PDF action to generate a simple invoice PDF from the preview."
  },
  {
    question: "Does this invoice generator include tax?",
    answer:
      "Yes. You can add an optional SST or custom tax rate for simple invoice math, but this tool does not provide accounting or tax advice."
  },
  {
    question: "Is an invoice the same as a receipt?",
    answer:
      "No. An invoice requests payment, while a receipt confirms payment has been received."
  },
  {
    question: "Can this tool help small businesses?",
    answer:
      "Yes. It can help create a simple invoice preview, but it does not replace accounting or tax advice."
  }
];

export default function InvoiceGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/invoice-generator`;

  return (
    <ToolPageLayout eyebrow="Business Tool">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Invoice Generator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Invoice Generator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={invoiceFaqs} />
      <InvoiceGenerator />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Learn what to include on a simple invoice
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          If you want the field-by-field explanation, read{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/how-to-create-a-simple-invoice"
          >
            how to create a simple invoice
          </a>{" "}
          before sending an invoice to a customer. For Malaysia SST arithmetic, review{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/sst-calculator-malaysia-add-remove-sst"
          >
            how to add or remove SST in Malaysia
          </a>
          .
        </p>
      </section>
      <FAQSection faqs={invoiceFaqs} title="Invoice Generator FAQs" />
    </ToolPageLayout>
  );
}
