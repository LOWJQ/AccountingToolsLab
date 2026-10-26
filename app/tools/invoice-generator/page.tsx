import { InvoiceGeneratorWorkspace } from "@/components/invoice/InvoiceGeneratorWorkspace";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Invoice Generator Malaysia | Online PDF Invoice Maker",
  description:
    "Free online invoice generator for Malaysia. Create a PDF invoice with items, SST, discounts, and your logo. No sign-up needed.",
  ogImage: {
    url: "/og-invoice-generator-guide.jpg",
    width: 1200,
    height: 630,
    alt: "Free Invoice Generator and simple invoice guide preview by AccountingToolsLab"
  },
  path: "/tools/invoice-generator"
});

const invoiceFaqs = [
  {
    question: "Is this invoice generator free to use?",
    answer:
      "Yes. You can create and download a simple PDF invoice without signing up."
  },
  {
    question: "Can I add SST, tax, or a discount?",
    answer:
      "Yes. You can add tax/SST and discounts when they apply to your invoice."
  },
  {
    question: "Can I add my logo and payment QR code?",
    answer:
      "Yes. You can upload a PNG or JPG business logo and an optional payment QR image."
  },
  {
    question: "Is the invoice I create official for tax filing?",
    answer:
      "This tool creates a simple PDF invoice for payment requests and record-keeping. It does not submit e-Invoices or replace official tax advice."
  },
  {
    question: "Can I save or edit my invoice later?",
    answer:
      "Yes. When browser storage is available, your edits are saved automatically. Open My invoices to find saved invoices. Business details, logos, and payment QR images are saved separately and reused. These stay in this browser on this device, without automatic syncing to other devices."
  }
];

const invoiceSteps = [
  "Add your business and customer details.",
  "Enter invoice items with quantity, unit price, and tax/SST if needed.",
  "Add discounts, payment details, notes, logo, or QR image.",
  "Preview the invoice and download the PDF."
];

const invoiceBenefits = [
  "Malaysia-friendly for simple record-keeping.",
  "Free to use with no sign-up required.",
  "Includes tax/SST, discounts, notes, and payment details.",
  "Download and keep invoices on your device."
];

const relatedTools = [
  {
    href: "/tools/sst-calculator-malaysia",
    label: "SST Calculator Malaysia"
  },
  {
    href: "/tools/cash-flow-calculator",
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools/bank-reconciliation",
    label: "Bank Reconciliation Matcher"
  },
  {
    href: "/tools",
    label: "All Tools"
  }
];

const softwareApplicationDescription =
  "Use a free online invoice generator for Malaysia to create simple PDF invoices with business details, line items, SST or tax, discounts, payment information, notes, and PDF download.";

export default function InvoiceGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/invoice-generator`;

  return (
    <ToolPageLayout>
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
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="transition hover:text-slate-900" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <Link className="transition hover:text-slate-900" href="/tools">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="font-medium text-slate-700">Invoice Generator</li>
        </ol>
      </nav>

      <InvoiceGeneratorWorkspace intro={<div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Free Online Invoice Generator Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Create and download a PDF invoice with optional SST, discounts and payment details.
          Free, with no sign-up.
        </p>
      </div>}>

      {/* Sits below the tool: someone arriving from a search for a calculator
          wants the calculator, not an essay. The wording is kept self-contained
          so it still reads correctly when an answer engine lifts it away from
          the surrounding page. */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          What should an invoice include?
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          An invoice needs your business name and contact details, the customer&apos;s details,
          a unique invoice number, the issue date and the payment due date, a line for each
          item with quantity and price, the total, and how to pay. Tax such as SST is shown as
          its own line rather than folded into the unit price, so the customer can see what was
          charged.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          This generator builds the PDF in your browser and does not upload your invoice details
          or images to our server. It produces an ordinary business invoice: if your business is required to
          issue an LHDN e-Invoice, that is a separate submission to MyInvois with its own
          required fields.
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Where are my invoice details saved?
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          When browser storage is available, your invoice edits are saved automatically in this
          browser on this device. Your business details, logo, payment details, and payment QR
          image are saved separately and reused when you start a New invoice. They can remain
          saved after you close the page. There is no automatic syncing to other devices.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          Delete individual invoices in My invoices. Reset removes the current
          invoice and your shared business details and images, while keeping other saved invoices
          and the last used invoice number. Clear this website&apos;s site data in your browser
          settings to remove all locally saved data.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          Export backup in My invoices lets you keep a copy before clearing browser data. That
          file includes your saved invoices, business details, and any saved logo or payment QR
          image. Keep it private, especially on a shared device. Read the{" "}
          <Link className="underline underline-offset-4" href="/privacy-policy">
            Privacy Policy
          </Link>{" "}
          for details about storage and other website services.
        </p>
      </section>

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Create invoices in a few simple steps
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            {invoiceSteps.map((step) => (
              <li className="pl-2" key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Why use this invoice generator?
          </h2>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {invoiceBenefits.map((benefit) => (
              <li className="flex items-start gap-3" key={benefit}>
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Related Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map((tool) => (
            <Link
              className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-7 text-black transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              href={tool.href}
              key={tool.href}
            >
              <span className="min-w-0 flex-1">{tool.label}</span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
              />
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuideCard eyebrow="Invoice guide" slug="what-should-an-invoice-include-before-you-send-it" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={invoiceFaqs} title="Invoice Generator FAQs" />
      </section>
      </InvoiceGeneratorWorkspace>
    </ToolPageLayout>
  );
}
