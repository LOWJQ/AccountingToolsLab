import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "How to Create a Simple Invoice for a Small Business | AccountingToolsLab",
  description:
    "Learn how to create a simple invoice, what fields to include, invoice number, invoice date, due date, line items, totals, notes, and common mistakes to avoid.",
  path: "/guides/how-to-create-a-simple-invoice"
});

const invoiceFields = [
  ["Business name", "The person or business sending the invoice", "ABC Services"],
  ["Business contact", "Email, phone, or address", "hello@example.com"],
  ["Customer name", "The person or business being billed", "XYZ Trading"],
  ["Invoice number", "Unique reference for tracking", "INV-001"],
  ["Invoice date", "Date the invoice is issued", "7 May 2026"],
  ["Due date", "Date payment is expected", "21 May 2026"],
  ["Line items", "Goods or services provided", "Website update, 3 hours"],
  ["Quantity", "Number of units, hours, or items", "3"],
  ["Unit price", "Price per unit or hour", "RM 100"],
  ["Line total", "Quantity x unit price", "RM 300"],
  ["Notes", "Optional payment terms or extra details", "Thank you for your business"]
];

const sampleLineItems = [
  ["Bookkeeping service", "2", "RM 150", "RM 300"],
  ["Report preparation", "1", "RM 200", "RM 200"],
  ["Total", "-", "-", "RM 500"]
];

const steps = [
  "Add your business name and contact details.",
  "Add the customer's name and contact details.",
  "Create a unique invoice number.",
  "Add the invoice date.",
  "Add a due date if payment is expected later.",
  "List the goods or services provided.",
  "Enter quantity and unit price for each line item.",
  "Calculate each line total.",
  "Add the subtotal and final total.",
  "Add notes or payment terms if needed.",
  "Review the invoice before sending it."
];

const exampleRows = [
  ["Business name", "Aina Design Studio"],
  ["Customer name", "Bright Cafe"],
  ["Invoice number", "INV-1001"],
  ["Invoice date", "7 May 2026"],
  ["Due date", "21 May 2026"],
  ["Description", "Logo design work"],
  ["Quantity", "5"],
  ["Unit price", "RM 120"],
  ["Total", "RM 600"]
];

const dateRows = [
  ["Invoice Date", "Date the invoice is created or issued", "7 May 2026"],
  ["Due Date", "Date payment is expected", "21 May 2026"]
];

const invoiceReceiptRows = [
  ["Invoice", "Requests payment", "Before payment"],
  ["Receipt", "Confirms payment", "After payment"]
];

const toolLinks = [
  {
    title: "Invoice Generator",
    href: "/tools/invoice-generator",
    description: "Use it to create a simple invoice preview."
  },
  {
    title: "Cash Flow Calculator",
    href: "/tools/cash-flow-calculator",
    description: "Use it to estimate net cash flow after payments are received or made."
  },
  {
    title: "SST Calculator Malaysia",
    href: "/tools/sst-calculator-malaysia",
    description: "Use it to estimate SST arithmetic if you already know the correct rate and treatment."
  },
  {
    title: "Break-even Calculator",
    href: "/tools/break-even-calculator",
    description: "Use it to estimate sales needed to cover costs."
  }
];

const mistakes = [
  "Forgetting the invoice number",
  "Leaving out customer details",
  "Using unclear item descriptions",
  "Forgetting the invoice date or due date",
  "Entering the wrong quantity or unit price",
  "Reusing the same invoice number",
  "Confusing an invoice with a receipt",
  "Assuming invoiced sales are the same as cash received",
  "Adding tax without checking whether it applies"
];

const checklist = [
  "Is your business name included?",
  "Are your contact details included?",
  "Is the customer name correct?",
  "Is the invoice number unique?",
  "Is the invoice date included?",
  "Is the due date clear?",
  "Are line item descriptions easy to understand?",
  "Are quantities and unit prices correct?",
  "Does the total look correct?",
  "Did you review notes, payment terms, or tax treatment if needed?"
];

const faqs = [
  {
    question: "What is a simple invoice?",
    answer:
      "A simple invoice is a document sent to a customer to request payment for goods or services."
  },
  {
    question: "What should an invoice include?",
    answer:
      "A simple invoice usually includes business details, customer details, invoice number, invoice date, due date, line items, subtotal, total, and notes."
  },
  {
    question: "How do I create an invoice number?",
    answer:
      "Use a unique and consistent reference such as INV-001, INV-2026-001, or a client-based number."
  },
  {
    question: "What is the difference between invoice date and due date?",
    answer:
      "Invoice date is when the invoice is issued. Due date is when payment is expected."
  },
  {
    question: "Is an invoice the same as a receipt?",
    answer:
      "No. An invoice requests payment, while a receipt confirms payment has already been received."
  },
  {
    question: "Can I create an invoice without tax?",
    answer:
      "Some simple invoices may not include tax, but tax treatment depends on the business, location, registration status, and applicable rules."
  },
  {
    question: "Should I include payment terms?",
    answer:
      "Clear payment terms can help customers understand when and how payment is expected."
  },
  {
    question: "Does sending an invoice mean cash has been received?",
    answer:
      "No. Sending an invoice requests payment. Cash flow changes when payment is actually collected."
  },
  {
    question: "How can the Invoice Generator help?",
    answer:
      "The Invoice Generator helps create a simple invoice preview with business details, customer details, line items, totals, and notes."
  },
  {
    question: "Can this guide help freelancers and small business owners?",
    answer:
      "Yes. It is written for beginners, freelancers, and small business owners who need a simple educational invoice checklist."
  }
];

function GuideTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
      <table className="min-w-[720px] w-full border-collapse bg-white text-left text-sm">
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
                  key={cell}
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
          headline: "How to Create a Simple Invoice for a Small Business",
          description:
            "Learn how to create a simple invoice, what fields to include, invoice number, invoice date, due date, line items, totals, notes, and common mistakes to avoid.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Business Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            How to Create a Simple Invoice for a Small Business
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            An invoice is a document sent to a customer to request payment for goods or services.
            A simple invoice should clearly show who is billing, who is being billed, what was
            provided, how much is due, and when payment is expected.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/invoice-generator"
            >
              Try the Invoice Generator
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/guides/cash-flow-vs-profit"
            >
              Learn Cash Flow vs Profit
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What is a simple invoice?
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>A simple invoice is a document that requests payment.</p>
            <p>
              It usually includes seller details, customer details, invoice number, invoice date,
              due date, line items, subtotal, total, and notes.
            </p>
            <p>
              It is different from a receipt because an invoice requests payment while a receipt
              confirms payment.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Fields</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What should an invoice include?
          </h2>
          <GuideTable headers={["Field", "What it means", "Example"]} rows={invoiceFields} />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Format</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple invoice format
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-700 sm:grid-cols-2 sm:text-base">
            {[
              "Business details at the top",
              "Customer details below or beside it",
              "Invoice number and dates",
              "Line item table",
              "Subtotal and total",
              "Notes or payment terms"
            ].map((item) => (
              <li className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={item}>
                {item}
              </li>
            ))}
          </ul>
          <GuideTable
            headers={["Description", "Quantity", "Unit Price", "Line Total"]}
            rows={sampleLineItems}
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
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

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple invoice example
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
            A freelancer provides design work to a customer. The freelancer charges RM 120 per
            hour for 5 hours.
          </p>
          <div className="mt-5 grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm leading-6 text-stone-700 sm:grid-cols-3">
            <p>Quantity: 5 hours</p>
            <p>Unit price: RM 120</p>
            <p className="font-semibold text-stone-950">Line total: RM 600</p>
          </div>
          <GuideTable headers={["Invoice Detail", "Example"]} rows={exampleRows} />
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            The invoice clearly identifies the seller, customer, work completed, amount charged,
            and expected payment date.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Tracking</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              How to choose an invoice number
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Use a unique number for each invoice.</p>
              <p>Keep the format simple and consistent.</p>
              <p>Examples: INV-001, INV-2026-001, CLIENTA-001.</p>
              <p>Avoid reusing the same invoice number for different customers or jobs.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Dates</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Invoice date vs due date
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Invoice date is when the invoice is issued.</p>
              <p>Due date is when payment is expected.</p>
              <p>If payment is due immediately, the due date can be the same as the invoice date.</p>
              <p>Clear dates reduce confusion.</p>
            </div>
            <GuideTable headers={["Date", "Meaning", "Example"]} rows={dateRows} />
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Documents</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Invoice vs receipt
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Invoice requests payment.</p>
              <p>Receipt confirms payment has already been received.</p>
              <p>A customer may receive an invoice first and a receipt after payment.</p>
            </div>
            <GuideTable headers={["Document", "Purpose", "When used"]} rows={invoiceReceiptRows} />
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Tax note</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Should a simple invoice include tax?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                Some invoices may need tax details depending on the business, location,
                registration status, product or service, and rules that apply.
              </p>
              <p>This guide is educational and does not decide tax treatment.</p>
              <p>
                For Malaysia SST arithmetic only, you can{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/sst-calculator-malaysia"
                >
                  estimate SST arithmetic with the SST Calculator Malaysia
                </a>
                , or read{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/sst-calculator-malaysia-add-remove-sst"
                >
                  how to add or remove SST in Malaysia
                </a>
                . You should check official guidance or a qualified professional for tax
                treatment.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Cash collection</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Why invoices matter for cash flow
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Sending an invoice does not always mean cash has been received.</p>
              <p>
                An unpaid invoice may show that money is owed, but cash flow depends on actual
                cash collected.
              </p>
              <p>
                You can{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/cash-flow-vs-profit"
                >
                  learn the difference between cash flow and profit
                </a>{" "}
                or{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/cash-flow-calculator"
                >
                  calculate simple net cash flow
                </a>
                .
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Use the tool</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Create a simple invoice with the Invoice Generator
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                Users can enter business details, customer details, invoice dates, line items,
                quantities, and unit prices.
              </p>
              <p>
                The tool calculates line totals and total invoice amount. It is useful for simple
                invoice previews and learning what invoice fields mean.
              </p>
              <p>It does not include payment processing or professional accounting/tax advice.</p>
              <p>
                You can{" "}
                <a
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/invoice-generator"
                >
                  create a simple invoice with the Invoice Generator
                </a>
                .
              </p>
            </div>
          </article>
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Tools that can help after creating an invoice
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {toolLinks.map((tool) => (
              <a
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                href={tool.href}
                key={tool.href}
              >
                <h3 className="text-base font-semibold text-stone-950">{tool.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            For planning beyond the invoice, review{" "}
            <a
              className="font-semibold text-slate-700 hover:text-slate-900"
              href="/guides/break-even-point-explained"
            >
              Break-even Point Explained
            </a>
            .
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common invoice mistakes
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
            <p className="text-sm font-medium tracking-wide text-slate-500">Checklist</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Simple invoice checklist
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

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple Invoice FAQs
          </h2>
          <div className="mt-6 divide-y divide-stone-100">
            {faqs.map((faq) => (
              <article className="py-5 first:pt-0 last:pb-0" key={faq.question}>
                <h3 className="text-base font-semibold text-stone-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
