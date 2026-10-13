import { SstCalculatorMalaysia } from "@/components/calculators/SstCalculatorMalaysia";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "SST Calculator Malaysia | Add or Remove SST Online",
  description:
    "Use this SST calculator to add SST, remove SST, and calculate SST amounts in Malaysia. Estimate 6%, 8%, 10%, 5%, 0%, or manual SST rates.",
  path: "/tools/sst-calculator-malaysia"
});

const sstFaqs = [
  {
    question: "What is an SST calculator used for?",
    answer:
      "An SST calculator helps you estimate the SST amount, the total including SST, or the amount before SST. It is useful when checking invoice amounts, quotations, and simple business records."
  },
  {
    question: "How do I calculate SST from an amount before tax?",
    answer:
      "For percentage SST, multiply the amount before SST by the rate divided by 100. Then add that tax amount to the original amount to get the total including SST. The fixed RM25 option uses a fixed amount instead of this percentage formula."
  },
  {
    question: "How do I remove SST from a total that already includes SST?",
    answer:
      "For percentage SST, divide the SST-inclusive total by 1 plus the rate divided by 100. For example, with 8% SST, divide the total by 1.08 to estimate the amount before SST. For a fixed-amount tax, remove the fixed tax amount instead."
  },
  {
    question: "What SST rate should I use in Malaysia?",
    answer:
      "Choose the category and rate that apply to your item. The calculator has preset percentages, a manual percentage option, and a fixed RM25 option. These choices do not cover every SST treatment or confirm whether your item is taxable. Check the current MySST industry guides and tax orders before selecting a rate."
  },
  {
    question: "Can I calculate several items with different SST rates?",
    answer:
      "Yes. Select Multiple items, enter each item's quantity and unit price, and choose its SST category or manual rate. The calculator works out each item separately, rounds its amounts to two decimal places, and adds them to get the combined totals. Add SST or Remove SST applies to every item in the list."
  },
  {
    question: "How do I copy or print my calculation?",
    answer:
      "After entering valid values, choose Copy result to copy the amount breakdown, or Print result to open your browser's print dialog. In Multiple items mode, both include the individual items and combined totals. You can save a PDF if your browser offers that print option."
  },
  {
    question: "What is the difference between sales tax and service tax?",
    answer:
      "Service tax generally applies to prescribed taxable services provided by a taxable person in Malaysia. Sales tax is a single-stage tax on imported or locally manufactured goods, depending on the goods classification and current rules."
  },
  {
    question: "Can this SST calculator confirm whether my item is taxable?",
    answer:
      "No. The calculator only performs the arithmetic. Taxability depends on the service category, goods classification, exemptions, registration status, and current SST rules."
  },
  {
    question: "Can I use this result for SST filing?",
    answer:
      "Use the result as a checking estimate only. Before filing or issuing tax documents, confirm the SST category, rate, taxable period, and invoice treatment using official guidance or a qualified tax adviser."
  }
];

const steps = [
  "Choose Single amount for one total, or Multiple items to enter separate items with their own quantities and rates.",
  "Choose Add SST if your prices exclude SST. Choose Remove SST if your prices already include it. This choice applies to all items.",
  "Enter your amount. In Multiple items mode, enter a quantity and unit price for each row, then use Add item for the next row.",
  "Choose the product or service category for each amount. If you select a manual category, enter the percentage you want to use.",
  "Review the breakdown, then use Copy result or Print result to keep a copy. Complete every item before copying or printing the combined total."
];

const calculationExamples = [
  {
    title: "Add SST to a price before tax",
    instruction: "For an amount of RM1,000 before SST at an example rate of 8%, choose Add SST and enter 1000.",
    rows: [
      ["SST amount", "RM1,000 × 0.08 = RM80"],
      ["Total including SST", "RM1,000 + RM80 = RM1,080"]
    ],
    formula: "SST amount = amount before SST × (rate ÷ 100)"
  },
  {
    title: "Remove SST from a price including tax",
    instruction: "For a total of RM1,080 that already includes 8% SST, choose Remove SST and enter 1080.",
    rows: [
      ["Amount before SST", "RM1,080 ÷ 1.08 = RM1,000"],
      ["SST amount", "RM1,080 − RM1,000 = RM80"]
    ],
    formula: "Amount before SST = total including SST ÷ (1 + rate ÷ 100)"
  }
];

const officialSources = [
  { href: "https://mysst.customs.gov.my/understanding-sst/", label: "Understanding SST", description: "The difference between sales tax and service tax." },
  { href: "https://mysst.customs.gov.my/industry-guides/", label: "Industry guides", description: "Guidance for particular goods and services." },
  { href: "https://mysst.customs.gov.my/sst-orders/", label: "SST orders", description: "Official rate, exemption, and other tax orders." }
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    label: "Create a PDF Invoice"
  },
  {
    href: "/tools/cash-flow-calculator",
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools/break-even-calculator",
    label: "Break-even Calculator"
  },
  {
    href: "/tools",
    label: "All Tools"
  }
];

export default function SstCalculatorMalaysiaPage() {
  const pageUrl = `${siteConfig.url}/tools/sst-calculator-malaysia`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "SST Calculator Malaysia", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="SST Calculator Malaysia"
        url={pageUrl}
      />
      <FAQJsonLd faqs={sstFaqs} />
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
          <li className="font-medium text-slate-700">SST Calculator Malaysia</li>
        </ol>
      </nav>

      <div className="max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          SST Calculator Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Calculate SST amount, total including SST, or reverse-calculate the amount before SST.
        </p>
      </div>

      <SstCalculatorMalaysia />

      <section className="border-t border-slate-200 pt-8" id="sst-how-to-use">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          How to use this SST calculator
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
          {steps.map((step) => (
            <li className="pl-2" key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 pt-8" id="sst-calculation-examples">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          How to add or remove SST
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          These examples use 8% to show the calculation. Use the rate that applies to your
          item. The percentage formulas below do not apply to a fixed-amount tax.
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {calculationExamples.map((example) => (
            <div className="lg:last:border-l lg:last:border-slate-200 lg:last:pl-8" key={example.title}>
              <h3 className="text-lg font-semibold text-slate-950">{example.title}</h3>
              <p className="mt-3 text-base leading-7 text-black">{example.instruction}</p>
              <dl className="mt-4 divide-y divide-slate-200">
                {example.rows.map(([label, value]) => (
                  <div className="py-3" key={label}>
                    <dt className="text-sm text-slate-600">{label}</dt>
                    <dd className="mt-1 text-base font-semibold leading-7 text-slate-950">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm leading-6 text-slate-600">{example.formula}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 border-l-2 border-slate-300 pl-5 text-base leading-7 text-black">
          To remove 8% SST, divide by 1.08. Subtracting 8% from RM1,080 would give RM993.60,
          which is not the original RM1,000 price. The tax was calculated on the price before SST.
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8" id="sst-multiple-item-example">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Calculate several items with different SST rates
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          Select Multiple items when you need separate amounts or rates. Each row&apos;s amount
          is its quantity multiplied by its unit price. The calculator applies that row&apos;s
          SST rate, rounds its amounts to two decimal places, then adds the rows together.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          For example, suppose you have two RM100 items at 8% and three RM50 items at 5%.
          In Add SST mode, the breakdown is:
        </p>
        <div
          aria-label="Multiple-item SST example; scroll horizontally to see all columns"
          className="mt-5 overflow-x-auto rounded-lg border border-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100"
          role="region"
          tabIndex={0}
        >
          <table className="w-full min-w-[600px] text-sm leading-6">
            <caption className="sr-only">Example amounts at two different SST rates</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold" scope="col">Items</th>
                <th className="px-4 py-3 font-semibold" scope="col">Before SST</th>
                <th className="px-4 py-3 font-semibold" scope="col">Rate</th>
                <th className="px-4 py-3 font-semibold" scope="col">SST</th>
                <th className="px-4 py-3 font-semibold" scope="col">Including SST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-black">
              <tr>
                <th className="px-4 py-3 text-left font-medium" scope="row">2 × RM100</th>
                <td className="px-4 py-3">RM200.00</td>
                <td className="px-4 py-3">8%</td>
                <td className="px-4 py-3">RM16.00</td>
                <td className="px-4 py-3">RM216.00</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium" scope="row">3 × RM50</th>
                <td className="px-4 py-3">RM150.00</td>
                <td className="px-4 py-3">5%</td>
                <td className="px-4 py-3">RM7.50</td>
                <td className="px-4 py-3">RM157.50</td>
              </tr>
            </tbody>
            <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-950">
              <tr>
                <th className="px-4 py-3 text-left" scope="row">Combined total</th>
                <td className="px-4 py-3">RM350.00</td>
                <td className="px-4 py-3">Mixed</td>
                <td className="px-4 py-3">RM23.50</td>
                <td className="px-4 py-3">RM373.50</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-4 text-base leading-7 text-black">
          Use a separate row for each rate, rather than applying one rate to the RM350 subtotal.
          In Remove SST mode, enter each item&apos;s unit price including SST. Because amounts
          are rounded per row, combining items into one row can produce a small rounding difference.
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8" id="sst-category-guidance">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Which SST category should you choose?
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          SST includes sales tax and service tax. Sales tax generally applies to taxable
          imported or locally manufactured goods. Service tax applies to prescribed taxable
          services. The treatment depends on your item and the applicable rules, rather than
          one percentage for every purchase.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          The calculator offers preset percentages of 0%, 5%, 6%, 8%, and 10%, plus a manual
          percentage option. They are calculation choices, not a complete list of Malaysian
          SST treatments. Choosing the exempt or 0% option does not confirm that your goods
          qualify for an exemption.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          The credit or charge card option uses a fixed RM25 per unit in this calculator.
          In Multiple items mode, its fixed tax is RM25 multiplied by quantity, rather than a
          percentage of the price. This fixed option requires MYR; enter prices in ringgit.
          Changing the selected currency does not convert your entered amounts.
          Check the official card guidance for when the tax applies.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          Before using an estimate on an invoice or return, confirm the taxable category,
          rate, and any exemption using the Royal Malaysian Customs Department (RMCD) guidance.
          For help with registration, read our{" "}
          <Link className="font-semibold underline underline-offset-4" href="/guides/do-i-need-to-register-for-sst-malaysia">
            SST registration guide
          </Link>.
        </p>
        <h3 className="mt-6 text-lg font-semibold text-slate-950">Official SST sources</h3>
        <ul className="mt-3 space-y-3 text-base leading-7 text-black">
          {officialSources.map((source) => (
            <li key={source.href}>
              <a
                className="font-semibold underline underline-offset-4"
                href={source.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                MySST: {source.label}
              </a>{" "}
              — {source.description}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Explanation updated <time dateTime="2026-10-13">13 October 2026</time>.
          This tool provides checking estimates and does not determine taxability or submit SST returns.
        </p>
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

      <RelatedGuideCard showTopBorder={false} eyebrow="SST Guide" slug="do-i-need-to-register-for-sst-malaysia" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={sstFaqs} title="SST Calculator Malaysia FAQs" />
      </section>
    </ToolPageLayout>
  );
}
