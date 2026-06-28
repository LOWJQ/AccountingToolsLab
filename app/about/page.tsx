import { Container } from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

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
      "Create simple invoices and use lightweight tools to check basic business numbers."
  },
  {
    title: "Freelancers",
    description:
      "Generate invoices, add customer details, and prepare simple totals without complicated software."
  },
  {
    title: "Business beginners",
    description:
      "Understand invoices, SST, cash flow, break-even points, and common accounting terms."
  },
  {
    title: "Accounting students",
    description: "Practice concepts and check simple accounting exercises while studying."
  }
];

const provides = [
  "Free invoice generator with PDF download",
  "Malaysia SST and tax math helpers",
  "Business calculators for cash flow, break-even points, ratios, and depreciation",
  "Accounting learning tools for trial balances, journal entries, debits, credits, and the accounting equation",
  "Beginner-friendly explanations and practical guide articles"
];

const currentTools = [
  "Invoice Generator",
  "Malaysia SST Calculator",
  "Cash Flow Calculator",
  "Break-even Calculator",
  "Financial Ratio Calculator",
  "Depreciation Calculator",
  "Trial Balance Calculator",
  "Journal Entry Checker",
  "Debit/Credit Checker",
  "Accounting Equation Calculator"
];

export default function AboutPage() {
  return (
    <main>
      <section className="w-full border-b border-stone-200 bg-[#eef6f5]">
        <Container className="gap-0 py-10 sm:py-12 lg:py-14">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            About AccountingToolsLab
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Free invoice and accounting tools for small businesses
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            AccountingToolsLab helps freelancers, small business owners, students, and beginners
            create simple invoices, calculate SST, check cash flow, and understand basic
            accounting concepts with free online tools.
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <section className="space-y-8">
          <article>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">Our mission</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Our mission is to make everyday accounting tasks easier with free tools for
              invoices, SST, cash flow, break-even checks, and accounting basics.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">Who it is for</h2>
            <ul className="mt-4 grid gap-4 text-sm leading-6 text-stone-600 sm:text-base">
              {audiences.map((audience) => (
                <li className="flex gap-3" key={audience.title}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  <span>
                    <span className="font-semibold text-stone-950">{audience.title}</span>
                    <span className="block">{audience.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-stone-950">
            Practical support for accounting basics
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            The site focuses on useful business tools and learning aids rather than complicated
            software features. Each tool is intended to make a specific invoice, tax, planning,
            or accounting check easier to complete.
          </p>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            {provides.map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <article>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              Current project status
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              AccountingToolsLab includes a free invoice generator, Malaysia SST calculator, cash
              flow calculator, break-even calculator, and focused accounting learning tools. New
              guide content and practical tool improvements continue to be added over time.
            </p>
            <ul className="mt-5 grid gap-2 text-sm leading-6 text-stone-600 sm:grid-cols-2 sm:text-base lg:grid-cols-3">
              {currentTools.map((tool) => (
                <li className="flex gap-3" key={tool}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Start here</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with a free invoice
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Create a simple invoice first, or explore the full set of accounting tools and
                guides.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools/invoice-generator"
              >
                Create Free Invoice
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/tools"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
