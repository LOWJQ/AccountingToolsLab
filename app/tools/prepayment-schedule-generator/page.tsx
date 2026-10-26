import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PrepaymentScheduleGenerator } from "@/components/calculators/PrepaymentScheduleGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolLink } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Free Prepayment Schedule Generator | Prepaid Expense Calculator",
  description: "Generate a monthly prepaid expense schedule for insurance, rent or subscriptions. Calculate partial months, remaining balances and journal entries. Free CSV download.",
  path: "/tools/prepayment-schedule-generator"
});

const faqs = [
  {
    question: "How are partial months calculated?",
    answer: "The default monthly method gives each full calendar month equal weight. A partial month has a weight of covered days divided by the days in that month. The prepaid amount is allocated across these weights. Both the start and end dates are included."
  },
  {
    question: "What is the difference between monthly and daily allocation?",
    answer: "Monthly allocation gives full months equal charges before rounding. Daily allocation divides the amount by the total covered days, then charges each month for its covered days. Daily charges can differ between months of different lengths. Choose the method that matches your accounting policy under Calculation options."
  },
  {
    question: "Can a prepayment schedule cross financial years?",
    answer: "Yes. The schedule covers every month between your coverage dates, including across year ends and leap years. Download the CSV to review the monthly charges and closing prepaid balance for your reporting period."
  },
  {
    question: "Why can monthly amounts differ by one cent?",
    answer: "The tool rounds cumulative allocations to two decimal places and calculates each month's expense from the change. This distributes rounding differences, keeps expenses non-negative and ensures the total equals the original prepayment with a final balance of zero."
  },
  {
    question: "What journal entries does the schedule support?",
    answer: "When payment is made, debit Prepaid expense and credit Bank for the prepaid amount. For each covered period, debit the relevant expense account and credit Prepaid expense for the expense shown in the schedule. The CSV includes the period-end recognition dates and generic account names, which you can replace with your own accounts."
  }
];

const relatedTools = [
  toolLink("depreciation-calculator"), toolLink("journal-entry-checker"),
  toolLink("trial-balance-calculator"), toolLink("cash-flow-calculator"),
  { href: "/tools", label: "All Tools" }
];

export default function PrepaymentScheduleGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/prepayment-schedule-generator`;
  return <ToolPageLayout>
    <BreadcrumbJsonLd items={[
      { name: "Home", url: siteConfig.url },
      { name: "Tools", url: `${siteConfig.url}/tools` },
      { name: "Prepayment Schedule Generator", url: pageUrl }
    ]} />
    <SoftwareApplicationJsonLd name="Prepayment Schedule Generator" description={metadata.description as string} url={pageUrl} />
    <FAQJsonLd faqs={faqs} />
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link className="transition hover:text-slate-900" href="/">Home</Link></li>
        <li aria-hidden="true">&gt;</li>
        <li><Link className="transition hover:text-slate-900" href="/tools">Tools</Link></li>
        <li aria-hidden="true">&gt;</li>
        <li className="font-medium text-slate-700">Prepayment Schedule Generator</li>
      </ol>
    </nav>
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Prepayment Schedule Generator</h1>
      <p className="mt-3 text-base leading-7 text-black">Spread prepaid insurance, rent or subscriptions across months. Calculate expenses and remaining balances, then download your schedule.</p>
    </div>
    <PrepaymentScheduleGenerator />
    <section className="border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">How do you calculate prepaid expenses?</h2>
      <p className="mt-3 text-base leading-7 text-black">A prepayment records a cost paid before its benefit is used. For equal full months, monthly expense = prepaid amount ÷ coverage months. Each expense reduces the prepaid asset. For example, RM12,000 of insurance covering January to December gives RM1,000 of expense each month and a zero prepaid balance after December.</p>
      <p className="mt-3 text-base leading-7 text-black">This prepaid expense calculator also handles partial months and offers daily allocation. Select the method that matches your accounting policy.</p>
    </section>
    <section className="border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Related Tools</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{relatedTools.map(tool => <Link className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-7 text-black transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100" href={tool.href} key={tool.href}>
        <span className="min-w-0 flex-1">{tool.label}</span><ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900" />
      </Link>)}</div>
    </section>
    <FAQSection eyebrow="" faqs={faqs} title="Prepayment Schedule FAQs" />
  </ToolPageLayout>;
}
