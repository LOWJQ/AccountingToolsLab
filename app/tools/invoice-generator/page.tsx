import { InvoiceGenerator } from "@/components/calculators/InvoiceGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Invoice Generator Malaysia | Online PDF Invoice Maker",
  description:
    "Free online invoice generator for Malaysia. Create a PDF invoice with items, SST, discounts, and your logo. No sign-up needed.",
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
      "Drafts can be saved in your browser on this device when local draft saving is available. They are not stored in an online account."
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
    icon: toolIcons.sst,
    label: "SST Calculator Malaysia"
  },
  {
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow,
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools/break-even-calculator",
    icon: toolIcons.breakEven,
    label: "Break-even Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
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

      <div className="max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Free Online Invoice Generator Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Use this free invoice generator Malaysia tool to create a simple PDF invoice for
          freelancers and small businesses. Add your business details, customer details, invoice
          items, tax/SST, discounts, payment information, notes, logo, and payment QR image, then
          download a clean invoice without signing up.
        </p>
      </div>
      <InvoiceGenerator />

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
          {relatedTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-7 text-black transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                href={tool.href}
                key={tool.href}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-700" />
                <span className="min-w-0 flex-1">{tool.label}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Related Guide Article
        </h2>
        <Link
          className="group mt-5 flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          href="/guides/what-should-an-invoice-include-before-you-send-it"
        >
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium leading-7 text-black">Invoice guide</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              How to Create a Simple Invoice
            </h3>
            <p className="mt-2 max-w-3xl text-base leading-7 text-black">
              Learn what to include in a simple invoice, from business and customer details to line
              items, invoice numbers, payment terms, and notes.
            </p>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
          />
        </Link>
      </section>

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={invoiceFaqs} title="Invoice Generator FAQs" />
      </section>
    </ToolPageLayout>
  );
}
