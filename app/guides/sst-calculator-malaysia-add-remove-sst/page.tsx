import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "SST Calculator Malaysia: How to Add or Remove SST | AccountingToolsLab",
  description:
    "Learn how to add or remove SST in Malaysia with simple formulas, examples, SST amount, total including SST, amount before SST, and common mistakes to avoid.",
  path: "/guides/sst-calculator-malaysia-add-remove-sst"
});

const termRows = [
  ["Amount Before SST", "Price before SST is added", "RM 100"],
  ["SST Rate", "Percentage rate selected for calculation", "8%"],
  ["SST Amount", "Amount of SST estimated from the rate", "RM 8"],
  ["Total Including SST", "Amount before SST plus SST amount", "RM 108"],
  ["Remove SST", "Work backward from an SST-inclusive total", "RM 108 back to RM 100 before SST"]
];

const addSstRows = [
  ["Amount before SST", "RM 100"],
  ["SST rate", "8%"],
  ["SST amount", "RM 8"],
  ["Total including SST", "RM 108"]
];

const removeSstRows = [
  ["Total including SST", "RM 108"],
  ["SST rate", "8%"],
  ["Amount before SST", "RM 100"],
  ["SST amount", "RM 8"]
];

const modeRows = [
  ["You have a price before SST", "Add SST", "RM 100 before SST becomes RM 108 at 8%"],
  ["You have a price that already includes SST", "Remove SST", "RM 108 including SST becomes RM 100 before SST at 8%"]
];

const rateRows = [
  ["0%", "Useful for zero-rate or no-tax arithmetic checks", "Does not prove an item is zero-rated"],
  ["5%", "Common rate option for some SST calculations", "Check official treatment"],
  ["6%", "Common service tax rate option for some categories", "Check official treatment"],
  ["8%", "Common service tax rate option for some taxable services", "Check official treatment"],
  ["10%", "Common sales tax rate option for some goods", "Check official treatment"],
  ["Custom", "Useful for arithmetic testing when a rate is known", "Only use if you know the correct rate"]
];

const calculatorSteps = [
  "Choose Add SST if your amount is before SST.",
  "Choose Remove SST if your amount already includes SST.",
  "Enter the amount.",
  "Choose the SST rate you want to test.",
  "Use custom rate only if you know the correct rate.",
  "Review the estimated SST amount and total.",
  "Check official guidance before relying on the result."
];

const toolLinks = [
  {
    title: "SST Calculator Malaysia",
    href: "/tools/sst-calculator-malaysia",
    description: "Use it to estimate SST arithmetic."
  },
  {
    title: "How to Create a Simple Invoice",
    href: "/guides/how-to-create-a-simple-invoice",
    description: "Learn which basic fields usually appear on a simple invoice."
  },
  {
    title: "Invoice Generator",
    href: "/tools/invoice-generator",
    description: "Use it to create a simple invoice preview."
  },
  {
    title: "Cash Flow vs Profit",
    href: "/guides/cash-flow-vs-profit",
    description: "Understand why invoice totals, SST, and cash received are different ideas."
  },
  {
    title: "Cash Flow Calculator",
    href: "/tools/cash-flow-calculator",
    description: "Use it to calculate net cash flow and ending cash balance."
  },
  {
    title: "Financial Ratio Calculator",
    href: "/tools/financial-ratio-calculator",
    description: "Use it to review basic business ratios."
  }
];

const mistakes = [
  "Using the wrong SST rate",
  "Assuming the calculator decides whether SST applies",
  "Adding SST to a price that already includes SST",
  "Removing SST from a price that does not include SST",
  "Treating SST as business profit",
  "Rounding too early",
  "Confusing SST with income tax",
  "Forgetting that rules and taxable scope can change",
  "Using a custom rate without checking official guidance"
];

const checklist = [
  "Do you know whether the amount is before SST or already includes SST?",
  "Do you know which rate you want to test?",
  "Did you choose Add SST or Remove SST correctly?",
  "Did you calculate SST amount separately from the total?",
  "Did you avoid treating SST as profit?",
  "Did you check whether official guidance is needed?",
  "Did you review rounding before using the result?"
];

const faqs = [
  {
    question: "What is SST in Malaysia?",
    answer:
      "SST commonly refers to Sales and Service Tax in Malaysia. This guide only explains arithmetic and does not decide whether SST applies."
  },
  {
    question: "How do I add SST to a price?",
    answer:
      "Multiply the amount before SST by the SST rate to estimate the SST amount, then add it to the original amount."
  },
  {
    question: "How do I remove SST from a price?",
    answer:
      "Divide the total including SST by 1 plus the SST rate, then subtract the amount before SST from the total."
  },
  {
    question: "What is the SST amount formula?",
    answer:
      "When adding SST, SST Amount = Amount Before SST x SST Rate."
  },
  {
    question: "What is amount before SST?",
    answer:
      "Amount before SST is the price before the estimated SST amount is added."
  },
  {
    question: "What is total including SST?",
    answer:
      "Total including SST is the amount before SST plus the estimated SST amount."
  },
  {
    question: "Which SST rate should I use?",
    answer:
      "Use only a rate you have confirmed from official RMCD/MySST guidance or a qualified tax professional."
  },
  {
    question: "Does the SST Calculator Malaysia decide whether SST applies?",
    answer:
      "No. It only performs arithmetic based on the amount and rate entered."
  },
  {
    question: "Can I use the SST Calculator Malaysia for invoices?",
    answer:
      "It can help estimate SST arithmetic for invoice examples, but it does not confirm tax treatment or invoice compliance."
  },
  {
    question: "Is SST the same as income tax?",
    answer:
      "No. SST and income tax are different and should not be treated as the same calculation."
  },
  {
    question: "Can this guide help with accounting homework or small business estimates?",
    answer:
      "Yes. It can help with arithmetic practice and estimates, but it is not professional tax, legal, accounting, or financial advice."
  }
];

function GuideTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-stone-200">
      <table className="min-w-[760px] w-full border-collapse bg-white text-left text-sm">
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
            <tr
              className={
                row[0].includes("Total") || row[0].includes("SST amount")
                  ? "bg-stone-50 font-semibold"
                  : ""
              }
              key={row[0]}
            >
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

export default function SstCalculatorMalaysiaGuidePage() {
  const pageUrl = `${siteConfig.url}/guides/sst-calculator-malaysia-add-remove-sst`;

  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: "SST Calculator Malaysia", url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "SST Calculator Malaysia: How to Add or Remove SST",
          description:
            "Learn how to add or remove SST in Malaysia with simple formulas, examples, SST amount, total including SST, amount before SST, and common mistakes to avoid.",
          url: pageUrl,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          },
          mainEntityOfPage: pageUrl
        }}
      />

      <Container as="main">
        <Link
          className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          href="/guides"
        >
          ← All guides
        </Link>
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Malaysia Tax Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            SST Calculator Malaysia: How to Add or Remove SST
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            This guide shows how to estimate SST arithmetic in Malaysia, including how to add SST
            to an amount before SST and how to remove SST from a total that already includes SST.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/sst-calculator-malaysia"
            >
              Try the SST Calculator Malaysia
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              href="/tools/invoice-generator"
            >
              Create a Simple Invoice
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-amber-700">Important note</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Important note about SST in Malaysia
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-700 sm:text-base">
            <p>
              This guide is for SST arithmetic and learning only. It does not decide whether SST
              applies, which SST rate is legally correct, or what invoice/tax treatment a business
              must use.
            </p>
            <p>
              SST rules, rates, exemptions, and taxable scope can change. Check{" "}
              <a
                className="font-semibold text-amber-800 hover:text-amber-950"
                href="https://mysst.customs.gov.my/"
                rel="noopener noreferrer"
                target="_blank"
              >
                official MySST guidance
              </a>{" "}
              from RMCD or ask a qualified tax professional before relying on the result.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Quick answer: how do you add or remove SST?
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                To add SST, multiply the amount before SST by the SST rate, then add the SST
                amount to the original amount.
              </p>
              <p>
                To remove SST, divide the total including SST by 1 plus the SST rate, then
                subtract the amount before SST from the total.
              </p>
              <p>Use the calculator only after you already know the amount and rate to test.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Key terms</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Key SST calculation terms
            </h2>
            <GuideTable headers={["Term", "Meaning", "Simple example"]} rows={termRows} />
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Add SST</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              How to add SST to an amount
            </h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                SST Amount = Amount Before SST x SST Rate
              </p>
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Total Including SST = Amount Before SST + SST Amount
              </p>
            </div>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Amount before SST: RM 100</p>
              <p>SST rate: 8%</p>
              <p>SST amount: RM 100 x 8% = RM 8</p>
              <p>Total including SST: RM 100 + RM 8 = RM 108</p>
            </div>
            <GuideTable headers={["Item", "Amount"]} rows={addSstRows} />
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Remove SST</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              How to remove SST from a total
            </h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                Amount Before SST = Total Including SST / (1 + SST Rate)
              </p>
              <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-950">
                SST Amount = Total Including SST - Amount Before SST
              </p>
            </div>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>Total including SST: RM 108</p>
              <p>SST rate: 8%</p>
              <p>Amount before SST: RM 108 / 1.08 = RM 100</p>
              <p>SST amount: RM 108 - RM 100 = RM 8</p>
            </div>
            <GuideTable headers={["Item", "Amount"]} rows={removeSstRows} />
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Modes</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Add SST vs remove SST
          </h2>
          <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-base">
            Use Add SST when your price does not include SST yet. Use Remove SST when the price
            already includes SST and you want to estimate the pre-SST amount.
          </p>
          <GuideTable headers={["Situation", "Use this mode", "Example"]} rows={modeRows} />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Rates</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Which SST rate should I use?
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              SST rates and taxable scope depend on the type of goods or services and official
              rules.
            </p>
            <p>
              The calculator may include common rate options such as 0%, 5%, 6%, 8%, 10%, or a
              custom rate for arithmetic.
            </p>
            <p>
              The presence of a rate in the calculator does not mean it applies to your product
              or service. Check official RMCD/MySST guidance or a qualified tax professional for
              the correct treatment.
            </p>
          </div>
          <GuideTable
            headers={["Calculator Rate Option", "Why it may appear", "Important reminder"]}
            rows={rateRows}
          />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Calculator steps</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How to use the SST Calculator Malaysia
          </h2>
          <ol className="mt-6 grid gap-3">
            {calculatorSteps.map((step, index) => (
              <li className="flex gap-3 text-sm leading-6 text-stone-700" key={step}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoices</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Using SST estimates with invoices
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>
                Some invoices may show an amount before SST, SST amount, and total including SST.
                This depends on the business, registration status, goods/services, and tax rules.
              </p>
              <p>The simple Invoice Generator does not replace tax-compliant invoicing advice.</p>
              <p>
                You can{" "}
                <Link
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/invoice-generator"
                >
                  create a simple invoice preview
                </Link>{" "}
                and{" "}
                <Link
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/how-to-create-a-simple-invoice"
                >
                  learn how to create a simple invoice
                </Link>
                .
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Cash flow</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              SST, invoices, and cash flow
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
              <p>SST on an invoice is not the same as profit.</p>
              <p>Invoice totals and cash received may happen at different times.</p>
              <p>
                You can{" "}
                <Link
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/guides/cash-flow-vs-profit"
                >
                  learn the difference between cash flow and profit
                </Link>{" "}
                or{" "}
                <Link
                  className="font-semibold text-slate-700 hover:text-slate-900"
                  href="/tools/cash-flow-calculator"
                >
                  calculate simple cash flow
                </Link>
                .
              </p>
            </div>
          </article>
        </section>

        <section>
          <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Related SST, invoice, and cash flow tools
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolLinks.map((tool) => (
              <Link
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                href={tool.href}
                key={tool.href}
              >
                <h3 className="text-base font-semibold text-stone-950">{tool.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common SST calculation mistakes
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
              SST calculation checklist
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
            SST Calculator Malaysia FAQs
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
      </Container>
    </div>
  );
}
