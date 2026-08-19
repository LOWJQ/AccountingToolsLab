import { SstCalculatorMalaysia } from "@/components/calculators/SstCalculatorMalaysia";
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
      "To add SST, multiply the amount before SST by the SST rate. Then add the SST amount to the original amount to get the total including SST."
  },
  {
    question: "How do I remove SST from a total that already includes SST?",
    answer:
      "To remove SST, divide the SST-inclusive total by 1 plus the SST rate as a decimal. For example, with 8% SST, divide the total by 1.08 to estimate the amount before SST."
  },
  {
    question: "What SST rate should I use in Malaysia?",
    answer:
      "Use the rate that applies to your taxable service or goods category. This calculator includes common percentage rates such as 6%, 8%, 10%, 5%, 0%, and a manual rate option, but you should confirm the applicable treatment with current MySST or RMCD guidance."
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

const benefits = [
  {
    description:
      "Estimate SST from an amount before tax or reverse-calculate the amount before SST.",
    title: "Add or remove SST quickly"
  },
  {
    description:
      "See how the SST amount, total including SST, and amount before SST relate to each other.",
    title: "Understand the calculation"
  },
  {
    description:
      "Check SST amounts before preparing invoices, quotations, or simple business records.",
    title: "Useful for invoices and estimates"
  }
];

const steps = [
  "Enter the amount.",
  "Choose whether the amount is before SST or includes SST.",
  "Select the SST category or rate.",
  "Review the estimated SST amount and total."
];

const formulas = [
  ["SST amount", "amount before SST x SST rate"],
  ["Total including SST", "amount before SST + SST amount"],
  ["Amount before SST", "amount including SST / (1 + SST rate)"]
];

const estimateChecks = [
  "Confirm whether the amount is before SST or already includes SST.",
  "Check the taxable category before using a suggested rate for invoicing or filing.",
  "Special fixed-amount categories may not use percentage SST.",
  "Treat this tool as an estimate, not official tax advice."
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    icon: toolIcons.invoice,
    label: "Create a PDF Invoice"
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

      {/* Sits below the calculator: someone arriving from a search for a tool
          wants the tool, not an essay. It still states the method in a form
          that survives being quoted out of context, which is what an answer
          engine lifts. The rate itself is deliberately not asserted as
          current, since classification and the rate orders change. */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          How do you add or remove SST in Malaysia?
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          To add SST, multiply the amount before tax by the SST rate, then add that result to
          the original amount. To remove SST from a total that already includes it, divide the
          total by 1 plus the rate written as a decimal: at an 8% rate divide by 1.08, and at 6%
          divide by 1.06. Subtracting 8% from an SST-inclusive total gives the wrong figure,
          because the tax was worked out on the smaller pre-tax amount rather than on the total.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          Which rate applies depends on how your service or goods are classified. This calculator
          covers the percentage rates in common use together with the fixed RM25 treatment for
          credit and charge card services. Malaysia&apos;s SST base was widened from 1 July 2025
          and the rate orders have been amended since, so confirm the rate for your category
          against{" "}
          <a
            className="font-semibold underline-offset-4 hover:underline"
            href="https://mysst.customs.gov.my/"
            rel="noopener noreferrer"
            target="_blank"
          >
            MySST
          </a>{" "}
          before relying on a figure for invoicing or filing.
        </p>
      </section>

      <p className="text-base leading-7 text-black">
        This SST calculator helps you quickly add or remove SST from an amount. It is useful for
        preparing invoices, quotations, and checking SST amounts for general taxable services and
        other SST categories in Malaysia.
      </p>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Why use this SST calculator
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
          How to use this SST calculator
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
          {steps.map((step) => (
            <li className="pl-2" key={step}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            SST calculation formulas
          </h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-black">
            {formulas.map(([label, formula]) => (
              <div className="grid gap-2 sm:grid-cols-[170px_24px_1fr]" key={label}>
                <span className="font-semibold text-black">{label}</span>
                <span className="hidden text-center font-semibold text-black sm:block">=</span>
                <span>{formula}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:border-l lg:border-slate-200 lg:pl-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Worked example
          </h2>
          <table className="mt-5 w-full overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
            <tbody className="divide-y divide-slate-200">
              <tr>
                <th className="w-3/5 px-4 py-3 text-left font-medium text-black" scope="row">
                  Amount before SST
                </th>
                <td className="px-4 py-3 font-medium text-black">RM 1,000.00</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  SST rate
                </th>
                <td className="px-4 py-3 font-medium text-black">8%</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  SST amount
                </th>
                <td className="px-4 py-3 font-medium text-black">RM 80.00</td>
              </tr>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-black" scope="row">
                  Total including SST
                </th>
                <td className="px-4 py-3 font-semibold text-black">RM 1,080.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Before you rely on the estimate
        </h2>
        <ul className="mt-5 space-y-3 border-l-2 border-slate-300 pl-6 text-base leading-7 text-black">
          {estimateChecks.map((check) => (
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

      <RelatedGuideCard showTopBorder={false} eyebrow="SST Guide" slug="do-i-need-to-register-for-sst-malaysia" />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={sstFaqs} title="SST Calculator Malaysia FAQs" />
      </section>
    </ToolPageLayout>
  );
}
