import { ReceiptGenerator } from "@/components/calculators/ReceiptGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Receipt Generator | Make a Payment Receipt PDF",
  description:
    "Create a payment receipt PDF with your business details, who paid, what for, the payment method, and the total. Free, no sign-up, runs in your browser.",
  path: "/tools/receipt-generator"
});

const receiptFaqs = [
  {
    question: "What is the difference between an invoice and a receipt?",
    answer:
      "An invoice is a request for payment, issued before the customer pays. A receipt is proof that the payment has already been made. That is why a receipt has no due date and no bank details to pay into, but does record how and when the money was paid."
  },
  {
    question: "What should a receipt include?",
    answer:
      "Your business name and contact details, who paid, a receipt number, the date the payment was made, what the payment was for, the amount, and the payment method. A reference to the original invoice number is useful when the receipt settles an invoice."
  },
  {
    question: "Do I need to give a receipt if I already sent an invoice?",
    answer:
      "An invoice and a receipt do different jobs, so many businesses issue both: the invoice asks for payment, the receipt confirms it arrived. Customers often need a receipt for their own bookkeeping or expense claims, even when they already hold your invoice."
  },
  {
    question: "Is a receipt the same as an official tax receipt?",
    answer:
      "No. This tool produces a normal business payment receipt. Requirements for tax invoices or official receipts under Malaysian SST or e-Invoice rules are separate, and can include registration numbers and other prescribed fields. Confirm your obligations with LHDN, RMCD, or a qualified adviser."
  },
  {
    question: "Can I add SST or another tax to a receipt?",
    answer:
      "Yes. Turn on the tax option and set a label and a percentage rate. The tax is calculated on the amount after any discount, and the receipt shows the subtotal, tax, and total paid separately."
  },
  {
    question: "Does my data get uploaded anywhere?",
    answer:
      "No. The receipt is built and turned into a PDF entirely in your browser. Nothing you type is sent to a server, and there is no sign-up."
  },
  {
    question: "Can I number receipts automatically?",
    answer:
      "Yes. If your receipt number ends in digits, such as REC-001, the number moves on to the next one after each download. You can always type a different number yourself."
  }
];

const benefits = [
  {
    description:
      "Record who paid, what they paid for, and how they paid, then hand over a clean PDF.",
    title: "Proof of payment in one step"
  },
  {
    description:
      "Turn on tax when you need it. The receipt shows subtotal, tax, and total paid as separate lines.",
    title: "Handles tax and discounts"
  },
  {
    description:
      "Everything runs in your browser. No account, no upload, and no watermark on the PDF.",
    title: "Free and private"
  }
];

const steps = [
  "Fill in your business details and who the payment came from.",
  "Enter the receipt number, the date paid, and the payment method.",
  "List what the payment covered, with quantity and unit price.",
  "Add tax or notes if you need them, then download the PDF."
];

const receiptChecks = [
  "Give every receipt its own number, and do not reuse one.",
  "Record the date the money was actually received, not the invoice date.",
  "Reference the invoice number when the receipt settles an invoice.",
  "Keep a copy for your own records, not just the customer's.",
  "Check whether SST or e-Invoice rules apply before treating this as a tax document."
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Invoice Generator"
  },
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
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function ReceiptGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/receipt-generator`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Receipt Generator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Receipt Generator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={receiptFaqs} />
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
          <li className="font-medium text-slate-700">Receipt Generator</li>
        </ol>
      </nav>

      <div className="max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Free Receipt Generator
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Create a payment receipt PDF that records who paid, what for, how much, and how they
          paid. No sign-up, and nothing leaves your browser.
        </p>
      </div>

      <ReceiptGenerator />

      <p className="text-base leading-7 text-black">
        A receipt is proof that money has already changed hands, so it works differently from an
        invoice. There is no due date and no bank details for the customer to pay into. Instead it
        records the date the payment arrived, the method used, and optionally the invoice it
        settles.
      </p>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Invoice or receipt: which do you need?
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col" />
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Invoice
                </th>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Sent
                </th>
                <td className="px-4 py-3 font-medium text-black">Before payment</td>
                <td className="px-4 py-3 font-medium text-black">After payment</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Purpose
                </th>
                <td className="px-4 py-3 font-medium text-black">Requests money</td>
                <td className="px-4 py-3 font-medium text-black">Confirms money arrived</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Due date
                </th>
                <td className="px-4 py-3 font-medium text-black">Yes</td>
                <td className="px-4 py-3 font-medium text-black">No</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Payment method
                </th>
                <td className="px-4 py-3 font-medium text-black">Not yet known</td>
                <td className="px-4 py-3 font-medium text-black">Recorded on the document</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-base leading-7 text-black">
          Need the other one?{" "}
          <Link
            className="font-semibold underline-offset-4 hover:underline"
            href="/tools/invoice-generator"
          >
            Use the invoice generator
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Why use this receipt generator
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3 md:divide-x md:divide-slate-200">
          {benefits.map((benefit) => (
            <div className="md:px-8 md:first:pl-0 md:last:pr-0" key={benefit.title}>
              <h3 className="text-base font-semibold text-slate-950">{benefit.title}</h3>
              <p className="mt-2 text-base leading-7 text-black">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          How to create a receipt
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
          {steps.map((step) => (
            <li className="pl-2" key={step}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Before you send the receipt
        </h2>
        <ul className="mt-5 space-y-3 border-l-2 border-slate-300 pl-6 text-base leading-7 text-black">
          {receiptChecks.map((check) => (
            <li className="flex items-start gap-3" key={check}>
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
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

      <RelatedGuideCard
        eyebrow="Invoice Guide"
        showTopBorder={false}
        slug="what-should-an-invoice-include-before-you-send-it"
      />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={receiptFaqs} title="Receipt Generator FAQs" />
      </section>
    </ToolPageLayout>
  );
}
