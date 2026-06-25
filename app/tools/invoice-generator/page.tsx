import { InvoiceGenerator } from "@/components/calculators/InvoiceGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Online Invoice Generator Malaysia | PDF Invoice Maker",
  description:
    "Create a simple PDF invoice for freelancers and small businesses in Malaysia. Add invoice items, tax/SST, discounts, and payment details, then download without signing up.",
  ogImage: {
    url: "/og-invoice-generator-guide.png",
    width: 1200,
    height: 630,
    alt: "Free Invoice Generator and simple invoice guide preview by AccountingToolsLab"
  },
  path: "/tools/invoice-generator"
});

const invoiceFaqs = [
  {
    question: "Can I download the invoice as a PDF?",
    answer:
      "Yes. After entering your invoice details, you can preview the invoice and download it as a simple PDF for payment requests and record-keeping."
  },
  {
    question: "Can I add my logo to the invoice?",
    answer:
      "Yes. If you upload a PNG or JPG logo, it can appear on the generated invoice PDF."
  },
  {
    question: "Can I add SST, tax, or a discount?",
    answer:
      "Yes. You can add SST-style tax, other tax amounts, or discounts if they apply to your invoice. If you are unsure whether SST applies, check official guidance or ask a qualified professional."
  },
  {
    question: "Can I add payment details and a QR image?",
    answer:
      "Yes. You can add payment instructions and upload a payment QR image if you want customers to see bank transfer, DuitNow-style, or other payment details on the invoice."
  },
  {
    question: "Are invoices saved online?",
    answer:
      "No. Invoice drafts are saved on your device/browser if local draft saving is supported. AccountingToolsLab does not store your invoice details online."
  },
  {
    question: "Is this an official Malaysia e-Invoice or MyInvois tool?",
    answer:
      "No. This invoice generator creates a simple PDF invoice for payment requests and record-keeping. It does not submit invoices to LHDN or MyInvois. For official e-Invoice requirements, check the latest LHDN guidance or speak with a qualified professional."
  },
  {
    question: "Who can use this invoice generator?",
    answer:
      "It is useful for Malaysian freelancers, students, side-hustle sellers, service providers, consultants, and small business owners who need a simple PDF invoice generator."
  }
];

const softwareApplicationDescription =
  "Create simple PDF invoices for Malaysian freelancers and small businesses with business details, line items, SST or tax, discounts, payment information, notes, and PDF download.";

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
        <p className="mt-3 text-base leading-7 text-stone-600">
          Create a simple PDF invoice for freelancers and small businesses in Malaysia. Add your
          business details, customer details, invoice items, tax/SST, discounts, payment
          information, notes, logo, and payment QR image, then download a clean invoice without
          signing up.
        </p>
      </div>
      <InvoiceGenerator />
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Need help writing an invoice?
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          Read the{" "}
          <Link
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/how-to-create-a-simple-invoice"
          >
            learn how to create a simple invoice
          </Link>{" "}
          for a field-by-field walkthrough. For SST arithmetic, review{" "}
          <Link
            className="font-semibold text-slate-700 hover:text-slate-900"
            href="/guides/sst-calculator-malaysia-add-remove-sst"
          >
            how to add or remove SST in Malaysia
          </Link>
          .
        </p>
      </section>
      <FAQSection eyebrow="" faqs={invoiceFaqs} title="Free Invoice Generator Malaysia FAQs" />
    </ToolPageLayout>
  );
}
