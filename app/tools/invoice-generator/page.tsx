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
    question: "Can I add SST, tax, or a discount?",
    answer:
      "Yes. You can choose no tax, SST 6%, SST 8%, or a custom tax rate, and you can add a percentage or fixed amount discount before SST or tax."
  },
  {
    question: "Can I add payment details and a QR image?",
    answer:
      "Yes. You can add bank details, DuitNow ID, a payment link, payment notes, and your own uploaded payment QR image."
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
      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Free Invoice Generator Malaysia
        </h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-stone-600">
          Create a simple invoice with business details, customer details, line items, optional
          SST / tax, discounts, payment details, QR image, terms, notes, and PDF download.
        </p>
      </div>
      <InvoiceGenerator />
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Related guide</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Need help writing an invoice?
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          Read the{" "}
          <a
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/how-to-create-a-simple-invoice"
          >
            simple invoice guide
          </a>{" "}
          for a field-by-field walkthrough. For SST arithmetic, review{" "}
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
