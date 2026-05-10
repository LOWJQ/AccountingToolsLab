import { InvoiceGenerator } from "@/components/calculators/InvoiceGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Free Invoice Generator Malaysia | Create PDF Invoices",
  description:
    "Create a simple invoice PDF with logo, line items, SST/tax, discounts, payment details, QR image, terms, and notes. Free invoice generator for Malaysia.",
  path: "/tools/invoice-generator"
});

const invoiceFaqs = [
  {
    question: "What is an invoice?",
    answer:
      "An invoice is a document sent to request payment for goods or services. It usually includes seller details, customer details, line items, payment instructions, and the total amount due."
  },
  {
    question: "Can I download the invoice as a PDF?",
    answer:
      "Yes. Use the Download PDF action to generate a simple invoice PDF from the preview."
  },
  {
    question: "Can I add my logo to the invoice?",
    answer:
      "Yes. You can upload a PNG or JPG logo and include it in the invoice preview and PDF."
  },
  {
    question: "Can I add SST or tax?",
    answer:
      "Yes. You can choose no tax, SST 6%, SST 8%, or a custom tax rate for simple invoice calculations."
  },
  {
    question: "Can I add a discount?",
    answer:
      "Yes. You can add a percentage discount or a fixed amount discount. The discount is applied before SST or tax."
  },
  {
    question: "Can I add payment details?",
    answer:
      "Yes. You can add bank details, account name, account number, DuitNow ID, payment link, and payment notes."
  },
  {
    question: "Can I add a payment QR image?",
    answer:
      "Yes. You can upload your own payment QR image and show it on the invoice with a Scan here to pay caption."
  },
  {
    question: "Are invoices saved online?",
    answer:
      "No. The current draft is saved on this device only. It is not uploaded to a server or synced across devices."
  },
  {
    question: "Is this an official Malaysia e-Invoice or MyInvois tool?",
    answer:
      "No. This tool creates a simple invoice PDF. It does not submit, validate, or store official Malaysia e-Invoices through LHDN/MyInvois."
  },
  {
    question: "Is an invoice the same as a receipt?",
    answer:
      "No. An invoice requests payment, while a receipt confirms payment has been received."
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
        applicationCategory="BusinessApplication"
        description={metadata.description as string}
        name="Free Invoice Generator Malaysia"
        priceCurrency="MYR"
        url={pageUrl}
      />
      <FAQJsonLd faqs={invoiceFaqs} />
      <InvoiceGenerator />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Learn how to write a simple invoice
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          For a field-by-field walkthrough, read{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/how-to-create-a-simple-invoice"
          >
            how to write a simple invoice
          </a>{" "}
          before sending one to a customer. For Malaysia SST arithmetic, review{" "}
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
