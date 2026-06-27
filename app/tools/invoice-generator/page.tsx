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
  title: "Free Invoice Generator Malaysia | Online PDF Invoice Maker",
  description:
    "Use a free online invoice generator Malaysia tool to create a simple PDF invoice. Add items, SST/tax, discounts, payment details, logo, and download without signing up.",
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
    question: "Is this an online invoice generator for Malaysia?",
    answer:
      "Yes. This is a browser-based invoice generator for Malaysia-focused freelancers and small businesses who need a simple PDF invoice for payment requests and record-keeping."
  },
  {
    question: "Can I use this as an invoice maker in Malaysia?",
    answer:
      "Yes. You can use it as a simple invoice maker in Malaysia to add business details, customer details, line items, optional SST/tax, discounts, payment details, logo, and download a PDF invoice."
  },
  {
    question: "Do I need to sign up to create an invoice?",
    answer: "No. You can create and download a PDF invoice without creating an account."
  },
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
  "Use a free online invoice generator for Malaysia to create simple PDF invoices with business details, line items, SST or tax, discounts, payment information, notes, and PDF download.";

export default function InvoiceGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/invoice-generator`;

  return (
    <ToolPageLayout eyebrow="Business Tool">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Free Online Invoice Generator Malaysia", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        applicationCategory="BusinessApplication"
        description={softwareApplicationDescription}
        name="Free Online Invoice Generator Malaysia"
        priceCurrency="MYR"
        url={pageUrl}
      />
      <FAQJsonLd faqs={invoiceFaqs} />
      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Free Online Invoice Generator Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Use this free invoice generator Malaysia tool to create a simple PDF invoice for
          freelancers and small businesses. Add your business details, customer details, invoice
          items, tax/SST, discounts, payment information, notes, logo, and payment QR image, then
          download a clean invoice without signing up.
        </p>
      </div>
      <InvoiceGenerator />
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Online invoice maker for Malaysia
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          Accounting Tools Lab offers a simple online invoice maker Malaysia users can open in the
          browser whenever they need a clean invoice PDF. It is designed for practical billing,
          payment requests, and basic record-keeping, while keeping official e-Invoice or tax
          submission questions separate.
        </p>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Invoice Generator Related Guide Article
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            className="group flex min-h-[220px] flex-col rounded-2xl border border-stone-200 bg-[#f5f5f5] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            href="/guides/how-to-create-a-simple-invoice"
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoice guide</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">
              How to Create a Simple Invoice
            </h3>
            <p className="mt-4 flex-1 text-sm leading-6 text-stone-600 sm:text-base">
              Learn what to include in a simple invoice, from business and customer details to line
              items, invoice numbers, payment terms, and notes.
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-slate-700 group-hover:text-slate-950">
              Read guide -&gt;
            </span>
          </Link>
          <Link
            className="group flex min-h-[220px] flex-col rounded-2xl border border-stone-200 bg-[#f5f5f5] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            href="/guides/sst-calculator-malaysia-add-remove-sst"
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">SST guide</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">
              How to Add or Remove SST in Malaysia
            </h3>
            <p className="mt-4 flex-1 text-sm leading-6 text-stone-600 sm:text-base">
              Review the SST add and remove formulas before using tax or SST amounts on a simple
              invoice.
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-slate-700 group-hover:text-slate-950">
              Read guide -&gt;
            </span>
          </Link>
        </div>
      </section>
      <FAQSection eyebrow="" faqs={invoiceFaqs} title="Free Online Invoice Generator Malaysia FAQs" />
    </ToolPageLayout>
  );
}
