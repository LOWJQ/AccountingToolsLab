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
  "Free invoice generator",
  "PDF invoice download",
  "SST and tax math",
  "Business calculators",
  "Beginner-friendly explanations"
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
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
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
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Mission</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Our mission
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Our mission is to make everyday accounting tasks easier with free tools for
              invoices, SST, cash flow, break-even checks, and accounting basics.
            </p>
          </article>

          <section>
            <p className="text-sm font-medium tracking-wide text-slate-500">Who it is for</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {audiences.map((audience) => (
                <article
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                  key={audience.title}
                >
                  <h3 className="text-base font-semibold text-stone-950">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {audience.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">What it provides</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Practical support for accounting basics
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              The site focuses on useful business tools and learning aids rather than complicated
              software features. Each tool is intended to make a specific invoice, tax, planning,
              or accounting check easier to complete.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {provides.map((item) => (
              <div
                className="flex min-h-24 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-center text-sm font-semibold text-stone-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Current status</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Current project status
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              AccountingToolsLab includes a free invoice generator, Malaysia SST calculator, cash
              flow calculator, break-even calculator, and focused accounting learning tools. New
              guide content and practical tool improvements continue to be added over time.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {currentTools.map((tool) => (
                <span
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200"
                  key={tool}
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">
              Educational note
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Simple tools, not professional advice
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              These tools are designed for simple business tasks, learning, and basic checking.
              They do not replace advice from a qualified accountant, tax professional, or
              financial adviser.
            </p>
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
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools/invoice-generator"
              >
                Create Free Invoice
              </a>
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/tools"
              >
                Explore Tools
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
