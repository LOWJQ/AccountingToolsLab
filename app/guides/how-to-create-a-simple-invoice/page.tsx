import Image from "next/image";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { buildAssetUrl, siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "How to Create a Simple Invoice in Malaysia | Step-by-Step Guide",
  description:
    "Learn how to create a simple invoice for freelancers and small businesses in Malaysia, including invoice fields, payment terms, SST notes, examples, and common mistakes.",
  path: "/guides/how-to-create-a-simple-invoice"
});

const tableOfContents = [
  ["What to include", "#what-to-include"],
  ["Invoice format", "#invoice-format"],
  ["Step-by-step guide", "#steps"],
  ["Wording examples", "#wording-examples"],
  ["Example", "#example"],
  ["Checklist", "#checklist"],
  ["Malaysia note", "#malaysia-note"],
  ["Related tools", "#related-tools"],
  ["FAQ", "#faq"]
];

const invoiceFields = [
  ["Business details", "Who is sending the invoice", "Accounting Tools Lab"],
  ["Customer details", "Who needs to pay", "Example Customer"],
  ["Invoice number", "A unique tracking reference", "INV-002"],
  ["Invoice date", "Date the invoice is issued", "2026-05-11"],
  ["Due date", "Date payment is expected", "2026-05-18"],
  ["Line items", "Goods or services billed", "Website maintenance service for April 2026"],
  ["Quantity and unit price", "How the amount is calculated", "1 x RM 150"],
  ["Subtotal and total", "Amount before and after discount and tax", "RM 146.28"],
  ["Payment details", "How the customer can pay", "Bank transfer, DuitNow ID, or payment link"],
  [
    "Terms and conditions",
    "Payment rules and important notes",
    "Payment due within 7 days by bank transfer"
  ]
];

const formatItems = [
  "Business details at the top",
  "Customer details in a Bill To section",
  "Invoice number, invoice date, and due date",
  "Line item table with quantity and unit price",
  "Subtotal, discount if any, SST/tax if applicable, and total",
  "Payment details, terms, and notes near the bottom"
];

const steps = [
  "Add your business name, contact details, and logo if you have one.",
  "Add the customer name and contact details.",
  "Use a unique invoice number such as INV-001 or INV-2026-001.",
  "Enter the invoice date and a due date if payment is expected later.",
  "List each product or service with a clear description.",
  "Enter quantity and unit price so each line total is easy to check.",
  "Add any discount before SST or tax if it applies to the invoice.",
  "Add payment details, payment reference wording, terms, and notes that help the customer pay.",
  "Preview the invoice, check the total, then download or send the PDF."
];

const wordingExamples = [
  [
    "Freelance service",
    "Service fee",
    "Website maintenance service for April 2026"
  ],
  [
    "Consulting work",
    "Consultation",
    "Accounting consultation session on 11 May 2026"
  ],
  [
    "Small business sale",
    "Products",
    "5 boxes of printed labels for May 2026 order"
  ],
  [
    "Payment terms",
    "Pay soon",
    "Payment due within 7 days by bank transfer."
  ],
  [
    "Payment reference",
    "Reference payment",
    "Please include invoice number INV-001 as the payment reference."
  ],
  [
    "DuitNow note",
    "Pay by QR",
    "You may pay by bank transfer or the DuitNow QR shown on this invoice."
  ]
];

const sampleLineItems = [
  ["Website maintenance service for April 2026", "1", "RM 150.00", "RM 150.00"],
  ["Discount", "-", "-", "-RM 12.00"],
  ["Amount after discount", "-", "-", "RM 138.00"],
  ["SST / Tax 6%", "-", "-", "RM 8.28"],
  ["Total", "-", "-", "RM 146.28"]
];

const mistakes = [
  "Reusing an invoice number",
  "Using vague item descriptions",
  "Forgetting customer details",
  "Missing payment details or terms",
  "Adding SST/tax without checking whether it applies",
  "Treating an unpaid invoice as cash received"
];

const checklist = [
  "Business and customer names are correct",
  "Invoice number is unique",
  "Invoice date and due date are clear",
  "Line items, quantities, and prices are correct",
  "Discount, SST/tax, subtotal, and total look right",
  "Payment details and terms are easy to understand"
];

const relatedLinks = [
  {
    title: "Invoice Generator",
    href: "/tools/invoice-generator",
    description: "Create a simple invoice preview and download a PDF."
  },
  {
    title: "SST Calculator Malaysia",
    href: "/tools/sst-calculator-malaysia",
    description: "Estimate SST arithmetic when you already know the correct rate."
  },
  {
    title: "How to add or remove SST in Malaysia",
    href: "/guides/sst-calculator-malaysia-add-remove-sst",
    description: "Learn the basic formulas for adding or removing SST."
  },
  {
    title: "Cash Flow Calculator",
    href: "/tools/cash-flow-calculator",
    description: "Check simple cash inflows, outflows, and ending cash balance."
  },
  {
    title: "Cash Flow vs Profit",
    href: "/guides/cash-flow-vs-profit",
    description: "Understand why an invoice is not the same as cash collected."
  },
  {
    title: "Break-even Calculator",
    href: "/tools/break-even-calculator",
    description: "Estimate sales needed to cover fixed and variable costs."
  },
  {
    title: "Break-even Point Explained",
    href: "/guides/break-even-point-explained",
    description: "Connect pricing, cost, and sales planning after invoicing."
  }
];

const faqs = [
  {
    question: "What is a simple invoice?",
    answer:
      "A simple invoice is a document used to request payment for goods or services. For Malaysian freelancers and small businesses, it usually shows the seller, customer, invoice number, invoice date, line items, payment details, and total amount due."
  },
  {
    question: "What should an invoice include?",
    answer:
      "An invoice should include business details, customer details, invoice number, invoice date, due date if needed, line items, subtotal, tax or SST if applicable, payment details, payment terms, and total. Use clear descriptions so the customer understands what they are paying for."
  },
  {
    question: "How do you create a simple invoice?",
    answer:
      "Start by adding your business and customer details, then add an invoice number, invoice date, line items, quantities, prices, payment details, and payment terms. Check the subtotal, SST or tax if applicable, and final total before sending or downloading the invoice."
  },
  {
    question: "Is an invoice the same as a receipt?",
    answer:
      "No. An invoice requests payment, while a receipt confirms that payment has already been received. For record-keeping, an unpaid invoice should not be treated the same as collected cash."
  },
  {
    question: "Can I create an invoice without tax?",
    answer:
      "Yes, a simple invoice can have no tax if tax does not apply. If you are unsure about SST or other tax treatment, check official guidance or a qualified professional."
  },
  {
    question: "What payment terms can I write on an invoice?",
    answer:
      "A simple payment term can say: Payment due within 7 days by bank transfer. Please include invoice number INV-001 as the payment reference. You can adjust the due date, payment method, and reference wording for your customer."
  },
  {
    question: "Can I use the Invoice Generator to create a PDF invoice?",
    answer:
      "Yes. The Invoice Generator lets you enter invoice details, preview the invoice, and download a simple PDF invoice."
  },
  {
    question: "Can Malaysian freelancers use a simple invoice?",
    answer:
      "Yes. Malaysian freelancers, side-hustle sellers, and service providers can use a simple invoice to request payment and keep basic records. If your business has SST, e-Invoice, or other tax obligations, check official guidance or speak with a qualified professional."
  },
  {
    question: "Is a PDF invoice the same as an official Malaysia e-Invoice?",
    answer:
      "No. A PDF invoice can help with payment requests and simple record-keeping, but it is not the same as submitting an e-Invoice through LHDN/MyInvois. The Invoice Generator does not submit, validate, or connect invoices to MyInvois."
  }
];

function GuideTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3 font-semibold" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-700">
          {rows.map((row) => (
            <tr className={row[0] === "Total" ? "bg-stone-50 font-semibold" : ""} key={row[0]}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 ${index === 0 ? "font-semibold text-stone-950" : ""}`}
                  key={`${row[0]}-${index}-${cell}`}
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

export default function HowToCreateSimpleInvoicePage() {
  const pageUrl = `${siteConfig.url}/guides/how-to-create-a-simple-invoice`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "How to Create a Simple Invoice", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Create a Simple Invoice in Malaysia",
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

      <main className="mx-auto flex w-full max-w-[1040px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <a
          className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          href="/guides"
        >
          ← All guides
        </a>
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Business Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            How to Create a Simple Invoice in Malaysia
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Learn what a simple invoice should include, how to write clearer invoice lines and
            payment terms, and what Malaysian freelancers and small businesses should check before
            sending it to a customer.
          </p>
          <p className="mt-3 text-sm font-medium text-stone-500">
            Last updated: 12 May 2026
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/invoice-generator"
            >
              Try the PDF Invoice Generator
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="#steps"
            >
              Read the steps
            </a>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is a simple invoice?
            </h2>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
              A simple invoice requests payment for goods or services. In Malaysia, freelancers,
              service providers, and small businesses can use it to show who is billing, who needs
              to pay, what was provided, the invoice number, payment details, and the total amount
              due.
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              About this guide: This guide helps Malaysian freelancers, students, side-hustle
              sellers, and small business owners understand the basic parts of a simple invoice. It
              is for general learning and record-keeping purposes only and should not be treated as
              professional accounting, tax, or legal advice.
            </p>
          </article>

          <nav className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">On this page</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {tableOfContents.map(([label, href]) => (
                <a
                  className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-slate-200 hover:bg-white hover:text-stone-950"
                  href={href}
                  key={href}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex justify-center">
            <Image
              alt="Labeled example of a simple invoice showing business details, customer details, invoice number, invoice date and due date, item details, subtotal and total, payment details, and terms and conditions."
              className="h-auto w-full max-w-[1000px]"
              height={3375}
              priority
              sizes="(min-width: 1024px) 1000px, 100vw"
              src="/guides/simple-invoice-example-labeled.webp"
              unoptimized
              width={6000}
            />
          </div>
          <p className="mt-3 text-center text-sm leading-6 text-stone-500">
            Labeled example of a simple PDF invoice
          </p>
          <div className="mx-auto mt-5 flex max-w-[1000px] flex-col items-start justify-between gap-4 rounded-xl bg-stone-50 p-5 sm:flex-row sm:items-center">
            <p className="text-sm leading-6 text-stone-700">
              Want to create one like this? Use the free invoice generator to enter your details
              and download a PDF invoice for Malaysia.
            </p>
            <a
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/invoice-generator"
            >
              Create a PDF invoice
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="what-to-include">
          <p className="text-sm font-medium tracking-wide text-slate-500">Fields</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What should an invoice include?
          </h2>
          <GuideTable headers={["Field", "Purpose", "Example"]} rows={invoiceFields} />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="invoice-format">
          <p className="text-sm font-medium tracking-wide text-slate-500">Format</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple invoice format
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-700 sm:grid-cols-2 lg:grid-cols-3">
            {formatItems.map((item) => (
              <li className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="steps">
          <p className="text-sm font-medium tracking-wide text-slate-500">Steps</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to create a simple invoice step by step
          </h2>
          <ol className="mt-6 grid gap-3">
            {steps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-stone-700" key={step}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="wording-examples">
          <p className="text-sm font-medium tracking-wide text-slate-500">Wording examples</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Write invoice details clearly
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            Clear wording helps the customer understand what they are paying for and how to pay.
            Avoid vague descriptions when a short, specific phrase would be clearer.
          </p>
          <GuideTable
            headers={["Situation", "Weak wording", "Better wording"]}
            rows={wordingExamples}
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="example">
          <p className="text-sm font-medium tracking-wide text-slate-500">Example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple invoice example
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            In the example above, Accounting Tools Lab bills Example Customer for one website
            maintenance service at RM 150. A RM 12 discount reduces the taxable amount to RM 138.
            SST/tax is shown at 6%, adding RM 8.28, so the final total is RM 146.28.
          </p>
          <GuideTable
            headers={["Description", "Quantity", "Unit Price", "Line Total"]}
            rows={sampleLineItems}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2" id="checklist">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Avoid these before sending
            </h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-stone-700">
              {mistakes.map((mistake) => (
                <li className="flex gap-3" key={mistake}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Final checklist</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Quick check before download
            </h2>
            <ul className="mt-6 grid gap-3">
              {checklist.map((item) => (
                <li
                  className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="malaysia-note">
            <p className="text-sm font-medium tracking-wide text-slate-500">Malaysia note</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Tax, SST, and MyInvois
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                For Malaysian users, a simple PDF invoice can help with payment requests and
                record-keeping, but it is not the same as submitting an e-Invoice through
                LHDN/MyInvois.
              </p>
              <p>
                If SST applies to your business, include the SST amount and label it clearly. For
                SST arithmetic, use the{" "}
                <a className="font-semibold text-slate-700 hover:text-slate-900" href="/tools/sst-calculator-malaysia">
                  SST Calculator Malaysia
                </a>{" "}
                or read{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/sst-calculator-malaysia-add-remove-sst"
                >
                  how to add or remove SST
                </a>
                . If you are unsure whether SST or e-Invoice requirements apply, check official
                guidance or ask a qualified professional.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Cash flow note</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Invoice vs receipt and cash flow
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>An invoice requests payment. A receipt confirms payment was received.</p>
              <p>
                An invoice also does not mean cash has been collected. Read{" "}
                <a className="font-semibold text-slate-700 hover:text-slate-900" href="/guides/cash-flow-vs-profit">
                  cash flow vs profit
                </a>{" "}
                or use the{" "}
                <a className="font-semibold text-slate-700 hover:text-slate-900" href="/tools/cash-flow-calculator">
                  Cash Flow Calculator
                </a>{" "}
                to think through cash movement.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-700 p-6 text-white shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-200">Create the invoice</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to make your invoice?
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-100 sm:text-base">
                Use the free Invoice Generator to add business details, customer details, line
                items, optional SST/tax, payment details, terms, and download a PDF invoice.
              </p>
            </div>
            <a
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
              href="/tools/invoice-generator"
            >
              Use the free invoice generator
            </a>
          </div>
        </section>

        <section id="related-tools">
          <p className="text-sm font-medium tracking-wide text-slate-500">Related tools and guides</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Keep going after the invoice
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <a
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                href={link.href}
                key={link.href}
              >
                <h3 className="text-base font-semibold text-stone-950">{link.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8" id="faq">
          <p className="text-sm font-medium tracking-wide text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple Invoice FAQs
          </h2>
          <div className="mt-6 divide-y divide-stone-100">
            {faqs.map((faq) => (
              <details className="group py-5 first:pt-0 last:pb-0" key={faq.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-stone-950">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition group-open:rotate-180"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.5 6L8 10.5L12.5 6"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
