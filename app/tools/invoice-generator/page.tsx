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
    "Create free PDF invoices for Malaysia online. Add business details, line items, SST or tax, discounts, payment info, notes, and download instantly.",
  path: "/tools/invoice-generator"
});

const invoiceFaqs = [
  {
    question: "Can I download the invoice as a PDF?",
    answer:
      "Yes. After entering your invoice details, you can preview the invoice and download it as a PDF."
  },
  {
    question: "Can I add my logo to the invoice?",
    answer:
      "Yes. If you upload a PNG or JPG logo, it can appear on the generated invoice PDF."
  },
  {
    question: "Can I add SST, tax, or a discount?",
    answer:
      "Yes. You can add SST-style tax, other tax amounts, or discounts if they apply to your invoice. Check with your accountant or tax adviser if you are unsure about tax requirements."
  },
  {
    question: "Can I add payment details and a QR image?",
    answer:
      "Yes. You can add payment instructions and upload a payment QR image if you want customers to see payment details on the invoice."
  },
  {
    question: "Are invoices saved online?",
    answer:
      "No. Invoice drafts are saved on your device/browser if local draft saving is supported. AccountingToolsLab does not store your invoice details online."
  },
  {
    question: "Is this an official Malaysia e-Invoice or MyInvois tool?",
    answer:
      "No. This tool creates a simple downloadable PDF invoice. It does not submit, validate, or connect invoices to LHDN/MyInvois."
  },
  {
    question: "Who can use this invoice generator?",
    answer:
      "It is useful for freelancers, consultants, small businesses, and service providers who need a simple PDF invoice generator for Malaysia."
  }
];

const softwareApplicationDescription =
  "Create free PDF invoices for Malaysia with business details, line items, SST or tax, discounts, payment information, notes, and PDF download.";

export default function InvoiceGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/invoice-generator`;

  return (
    <ToolPageLayout eyebrow="Business Tool">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Free Invoice Generator Malaysia", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        applicationCategory="BusinessApplication"
        description={softwareApplicationDescription}
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
          Create professional PDF invoices online for Malaysia. Add your business details,
          customer information, line items, SST or tax, discounts, payment instructions, notes,
          logo, and payment QR image, then download a clean invoice PDF instantly.
        </p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-stone-500">
          Built for freelancers, consultants, small businesses, and service providers who need a
          simple PDF invoice. It does not submit, validate, or connect invoices to LHDN/MyInvois.
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
      <FAQSection faqs={invoiceFaqs} title="Free Invoice Generator Malaysia FAQs" />
    </ToolPageLayout>
  );
}
