import Image from "next/image";
import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createMetadata } from "@/lib/seo/metadata";
import { buildAssetUrl, siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "What Should an Invoice Include? Malaysia Checklist",
  description:
    "A simple Malaysia invoice checklist: business and customer details, invoice number, dates, line items, payment terms, SST notes, and totals.",
  ogImage: {
    url: "/og-invoice-generator-guide.png",
    width: 1200,
    height: 630,
    alt: "What should an invoice include guide preview by AccountingToolsLab"
  },
  path: "/guides/what-should-an-invoice-include-before-you-send-it"
});

const pageTitle = "What Should an Invoice Include Before You Send It?";
const guidePath = "/guides/what-should-an-invoice-include-before-you-send-it";
const pageDescription =
  "A good invoice clearly shows who is billing, who needs to pay, what was provided, how much is due, when payment is due, and how the customer should pay.";

const tableOfContents = [
  { label: "What to include", href: "#what-to-include" },
  { label: "Invoice example", href: "#invoice-example" },
  { label: "Step-by-step guide", href: "#steps" },
  { label: "Line item wording", href: "#line-item-wording" },
  { label: "Before sending checklist", href: "#checklist" },
  { label: "Malaysia note", href: "#malaysia-note" },
  { label: "Invoice vs receipt", href: "#invoice-vs-receipt" },
  { label: "FAQs", href: "#faq" }
] as const;

const invoiceDetails = [
  ["Business details", "Shows who is billing and how to contact you."],
  ["Customer details", "Confirms who needs to pay and what to send the invoice to."],
  ["Invoice number", "Helps you and your customer track the invoice easily."],
  ["Invoice date", "Shows when the invoice was issued."],
  ["Due date", "Lets your customer know when payment is expected."],
  ["Line items", "Lists the goods or services you provided."],
  ["Quantity and unit price", "Explains how each item amount is calculated."],
  ["Discount", "Shows any discount given before tax."],
  ["SST / Tax", "Shows tax charged, if applicable."],
  ["Total amount due", "The final amount your customer needs to pay."],
  ["Payment details", "Provides bank or payment method information."],
  ["Terms and notes", "Includes payment terms or any important notes."]
] as const;

const steps = [
  "Add business details",
  "Add customer details",
  "Use a unique invoice number",
  "Set invoice date and due date",
  "Describe each product or service clearly",
  "Enter quantity, unit price, discount, and tax if needed",
  "Add payment details and payment instructions",
  "Review the total before sending or downloading the PDF"
] as const;

const wordingExamples = [
  ["Service fee", "Website maintenance service for April 2026"],
  ["Consultation", "Accounting consultation session on 11 May 2026"],
  ["Products", "5 boxes of printed labels for May 2026 order"],
  ["Pay soon", "Payment due within 7 days by bank transfer"],
  ["Reference payment", "Please include invoice number INV-002 as the payment reference"]
] as const;

const checklist = [
  "Customer name is correct",
  "Invoice number is unique",
  "Invoice date and due date are clear",
  "Line item descriptions are specific",
  "Quantity, unit price, discount, and total are correct",
  "SST/tax is included only when applicable",
  "Payment details are clear",
  "Payment reference instruction is included",
  "Invoice is saved or downloaded as a PDF"
] as const;

const sidebarGuides = [
  guideLink("do-i-need-to-register-for-sst-malaysia"),
  guideLink("profitable-but-no-cash"),
  guideLink("debit-vs-credit")
];

const faqs = [
  {
    question: "What should an invoice include?",
    answer:
      "An invoice should include business details, customer details, invoice number, invoice date, due date if needed, line items, quantity, unit price, discount, SST or tax if applicable, payment details, payment terms, and the total amount due."
  },
  {
    question: "Do I need an invoice number?",
    answer:
      "Yes. A unique invoice number helps you and your customer track the invoice, payment reference, and records. A simple format like INV-001 or INV-2026-001 is enough for many small businesses."
  },
  {
    question: "What should I write for invoice line items?",
    answer:
      "Use clear descriptions that explain the product or service, the period or date, quantity, and unit price. For example, write Website maintenance service for April 2026 instead of Service fee."
  },
  {
    question: "Should I include SST or tax on a simple invoice?",
    answer:
      "Include SST or tax only when it applies to your business and transaction. If SST applies, show it clearly on the invoice. If you are unsure, check official guidance or speak with a qualified professional."
  },
  {
    question: "Is a PDF invoice the same as Malaysia e-Invoice?",
    answer:
      "No. A simple PDF invoice can help with payment requests and record-keeping, but it is not the same as submitting an e-Invoice through LHDN/MyInvois."
  },
  {
    question: "Is an invoice the same as a receipt?",
    answer:
      "No. An invoice asks for payment. A receipt confirms that payment has already been received."
  },
  {
    question: "Can I create a PDF invoice for free?",
    answer:
      "Yes. You can use the PDF Invoice Generator on AccountingToolsLab to enter invoice details, preview the invoice, and download a simple PDF invoice."
  }
];

function SimpleTable({
  headers,
  rows
}: {
  headers: readonly string[];
  rows: ReadonlyArray<readonly string[]>;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-950">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-950">
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 align-top ${index === 0 ? "font-semibold text-slate-950" : ""}`}
                  key={`${row[0]}-${cell}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({
  children,
  id
}: {
  children: string;
  id: string;
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {children}
      </h2>
    </header>
  );
}

function CtaBlock() {
  return (
    <div className="mt-5 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-base font-semibold text-slate-950">Need to create one quickly?</p>
        <p className="mt-1 text-sm leading-6 text-slate-950">
          Use the free PDF Invoice Generator to create and download your invoice in seconds.
        </p>
      </div>
      <Link
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        href="/tools/invoice-generator"
      >
        Create a PDF Invoice
      </Link>
    </div>
  );
}

export default function HowToCreateSimpleInvoicePage() {
  const pageUrl = `${siteConfig.url}${guidePath}`;

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: pageTitle, url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: pageTitle,
          description: metadata.description,
          url: pageUrl,
          datePublished: "2026-05-08",
          dateModified: "2026-05-12",
          author: {
            "@type": "Organization",
            name: "AccountingToolsLab"
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          image: buildAssetUrl("/guides/simple-invoice-example-labeled.webp"),
          mainEntityOfPage: pageUrl
        }}
      />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-950">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition hover:text-slate-900" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link className="transition hover:text-slate-900" href="/guides">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-slate-950">{pageTitle}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="min-w-0">
            <header>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {pageTitle}
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-950 sm:text-lg">
                {pageDescription} Include the right details before you send it to reduce payment
                delays and confusion.
              </p>
              <p className="mt-5 text-sm text-slate-950">
                Updated on 12 May 2026 <span aria-hidden="true">-</span> 10 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <figure className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image
                alt="Labeled invoice example showing business details, customer details, invoice number, invoice date, due date, line items, subtotal, SST or tax, total amount due, payment details, and terms and notes."
                className="h-auto w-full"
                height={3375}
                priority
                sizes="(min-width: 1024px) calc(100vw - 440px), 100vw"
                src="/guides/simple-invoice-example-labeled.webp"
                unoptimized
                width={6000}
              />
              <figcaption className="px-4 py-3 text-sm text-slate-950">
                Labeled invoice example showing the main details to check before sending.
              </figcaption>
            </figure>

            <CtaBlock />

            <section className="mt-12">
              <SectionHeading id="what-to-include">
                The invoice details you should include
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Before you send an invoice, make sure it explains the payment request clearly. The
                customer should not need to guess who sent it, what it is for, or how to pay.
              </p>
              <SimpleTable headers={["Detail", "Why it matters"]} rows={invoiceDetails} />
            </section>

            <section className="mt-12">
              <SectionHeading id="invoice-example">
                What a simple invoice looks like
              </SectionHeading>
              <div className="mt-4 space-y-4 text-base leading-7 text-slate-950">
                <p>
                  The labelled example above shows a simple invoice layout. Business details and
                  customer details sit near the top, followed by invoice number, invoice date, and
                  due date. The line item table explains what was provided and how the amount was
                  calculated.
                </p>
                <p>
                  Near the bottom, the invoice should show subtotal, discount if any, SST/tax if
                  applicable, total amount due, payment details, and terms or notes. This keeps the
                  invoice easy to review before sending or downloading as a PDF.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="steps">
                How to create an invoice step by step
              </SectionHeading>
              <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-7 text-slate-950">
                {steps.map((step) => (
                  <li className="pl-2" key={step}>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-12">
              <SectionHeading id="line-item-wording">
                How should you write invoice line items?
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Clear line item wording helps your customer understand what they are paying for.
                Specific descriptions also make your own records easier to review later.
              </p>
              <SimpleTable
                headers={["Instead of vague", "Better and clear"]}
                rows={wordingExamples}
              />
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">
                What to check before sending the invoice
              </SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <SectionHeading id="malaysia-note">
                Malaysia note: SST, e-Invoice, and records
              </SectionHeading>
              <div className="mt-4 space-y-4 text-base leading-7 text-slate-950">
                <p>
                  A simple PDF invoice can help with payment requests and record-keeping. It is not
                  the same as submitting an e-Invoice through LHDN/MyInvois.
                </p>
                <p>
                  If SST applies, show the SST amount clearly on the invoice. You can use the{" "}
                  <Link
                    className="text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                    href="/tools/sst-calculator-malaysia"
                  >
                    SST Calculator Malaysia
                  </Link>{" "}
                  to check the arithmetic, and read the{" "}
                  <Link
                    className="text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                    href="/guides/do-i-need-to-register-for-sst-malaysia"
                  >
                    SST registration guide
                  </Link>{" "}
                  to check whether the business may need to register. This guide is general
                  information only, not professional tax or legal advice.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="invoice-vs-receipt">
                Invoice vs receipt
              </SectionHeading>
              <SimpleTable
                headers={["Document", "Purpose"]}
                rows={[
                  ["Invoice", "Asks the customer to pay for goods or services."],
                  ["Receipt", "Confirms payment has already been received."]
                ]}
              />
              <p className="mt-5 text-base leading-7 text-slate-950">
                An invoice also does not mean cash has been collected. For cash planning, see{" "}
                <Link
                  className="text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                  href="/guides/profitable-but-no-cash"
                >
                  why profit is not cash
                </Link>{" "}
                or use the{" "}
                <Link
                  className="text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                  href="/tools/cash-flow-calculator"
                >
                  Cash Flow Calculator
                </Link>
                .
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Ready to create the invoice?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Use the free Invoice Generator to enter the details, review the total, and
                    download a PDF.
                  </p>
                </div>
                <Link
                  className="mt-4 inline-flex h-11 min-w-40 items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:mt-0"
                  href="/tools/invoice-generator"
                >
                  Create invoice
                </Link>
              </div>
            </section>

            <FAQSection eyebrow="" faqs={faqs} id="faq" title="Simple Invoice FAQs" />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <GuideTableOfContents items={tableOfContents} />

              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                  Related guides
                </p>
                <div className="mt-4 grid gap-3">
                  {sidebarGuides.map((guide) => (
                    <Link
                      className="text-sm leading-6 text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                      href={guide.href}
                      key={guide.href}
                    >
                      {guide.label}
                    </Link>
                  ))}
                </div>
              </section>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
