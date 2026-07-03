import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, GraduationCap, UserRound } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About AccountingToolsLab | Free Invoice and Accounting Tools",
  description:
    "Learn about AccountingToolsLab, a free invoice generator and accounting tools site for freelancers, small businesses, beginners, and students.",
  path: "/about"
});

const audiences = [
  {
    title: "Small business owners",
    description:
      "Create simple invoices and use lightweight tools to check basic business numbers.",
    icon: UserRound
  },
  {
    title: "Freelancers",
    description:
      "Generate invoices, add customer details, and prepare simple totals without complicated software.",
    icon: Briefcase
  },
  {
    title: "Business beginners",
    description:
      "Understand invoices, SST, cash flow, break-even points, and common accounting terms.",
    icon: BookOpen
  },
  {
    title: "Accounting students",
    description: "Practice concepts and check simple accounting exercises while studying.",
    icon: GraduationCap
  }
];

const supportItems = [
  "Free invoice generator with PDF download",
  "Malaysia SST and tax math helpers",
  "Business calculators for cash flow, break-even points, ratios, and depreciation",
  "Accounting learning tools for trial balances, journal entries, debits, credits, and the accounting equation",
  "Beginner-friendly explanations and practical guide articles"
];

const currentTools = [
  { label: "Invoice Generator", href: "/tools/invoice-generator" },
  { label: "Malaysia SST Calculator", href: "/tools/sst-calculator-malaysia" },
  { label: "Cash Flow Calculator", href: "/tools/cash-flow-calculator" },
  { label: "Break-even Calculator", href: "/tools/break-even-calculator" },
  { label: "Financial Ratio Calculator", href: "/tools/financial-ratio-calculator" },
  { label: "Depreciation Calculator", href: "/tools/depreciation-calculator" },
  { label: "Trial Balance Calculator", href: "/tools/trial-balance-calculator" },
  { label: "Journal Entry Checker", href: "/tools/journal-entry-checker" },
  { label: "Debit/Credit Checker", href: "/tools/debit-credit-checker" },
  { label: "Accounting Equation Calculator", href: "/tools/accounting-equation-calculator" }
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="w-full bg-white">
        <Container className="gap-0 pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12">
          <h1 className="mx-auto max-w-4xl text-center text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            This is Accounting Tools Lab
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-7 text-black">
            Accounting Tools Lab helps freelancers, small business owners, students, and beginners
            create simple invoices, calculate SST, check cash flow, and understand basic accounting
            concepts with free online tools.
          </p>
          <div className="mt-12 border-t border-slate-200" />
        </Container>
      </section>

      <Container className="gap-0 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <section className="grid gap-8 border-b border-slate-200 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 md:pb-12">
          <article>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Our mission</h2>
            <p className="mt-4 text-base leading-7 text-black">
              Our mission is to make everyday accounting tasks easier with free tools for invoices,
              SST, cash flow, break-even checks, and accounting basics.
            </p>
          </article>

          <article className="border-t border-slate-200 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              Simple tools, not complicated software
            </h3>
            <p className="mt-4 text-base leading-7 text-black">
              Each tool is focused on one practical accounting task, so users can complete checks
              faster without needing a full accounting system.
            </p>
          </article>
        </section>

        <section className="border-b border-slate-200 py-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Who it is for</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => {
              const Icon = audience.icon;

              return (
                <article key={audience.title}>
                  <Icon aria-hidden="true" className="h-8 w-8 text-slate-900" />
                  <h3 className="mt-5 text-base font-semibold leading-6 text-slate-950">
                    {audience.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-black">{audience.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-b border-slate-200 py-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Practical support for accounting basics
          </h2>
          <p className="mt-4 text-base leading-7 text-black">
            The site focuses on useful business tools and learning aids rather than complicated
            software features.
          </p>
          <ul className="mt-5 space-y-3 text-base leading-7 text-black">
            {supportItems.map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Current tools</h2>
          <p className="mt-3 text-base leading-7 text-black">
            AccountingToolsLab continues to add practical tools and guide content over time.
          </p>
          <div className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentTools.map((tool) => (
              <Link
                className="group flex items-center justify-between gap-4 border-b border-slate-200 py-4 text-sm font-semibold leading-6 text-slate-950 transition hover:border-slate-300 hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-slate-100"
                href={tool.href}
                key={tool.href}
              >
                <span>{tool.label}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
                />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Start with a simple accounting tool
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-black">
                Create an invoice, calculate SST, check cash flow, or learn accounting basics with
                free tools.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100"
                href="/tools"
              >
                View All Tools
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-900 bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                href="/tools/invoice-generator"
              >
                Create Invoice
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
