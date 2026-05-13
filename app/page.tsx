import { InvoicePreview } from "@/components/home/InvoicePreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { tools } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createWebsiteSchema } from "@/lib/seo/schema";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Invoice Generator and Accounting Tools | AccountingToolsLab",
  description:
    "Create simple invoices, download PDFs, choose from 10 supported currencies including MYR, calculate SST, and use free accounting tools for small businesses, freelancers, and learners.",
  path: "/"
});

const featuredToolOrder = [
  "invoice-generator",
  "sst-calculator-malaysia",
  "cash-flow-calculator",
  "break-even-calculator",
  "trial-balance-calculator"
];

const featuredTools = [...tools]
  .sort((firstTool, secondTool) => {
    const firstIndex = featuredToolOrder.indexOf(firstTool.slug);
    const secondIndex = featuredToolOrder.indexOf(secondTool.slug);
    const firstRank = firstIndex === -1 ? featuredToolOrder.length : firstIndex;
    const secondRank = secondIndex === -1 ? featuredToolOrder.length : secondIndex;

    return firstRank - secondRank;
  })
  .map((tool) => ({
    name: tool.name,
    description: tool.description,
    status: tool.status === "mvp" ? "Available" : "Planned",
    href: tool.href,
    isAvailable: tool.status === "mvp"
  }));

const reasons = [
  {
    title: "Invoices first",
    description:
      "Create a simple invoice, then use supporting calculators when you need accounting checks."
  },
  {
    title: "Beginner-friendly explanations",
    description: "Read plain-English notes that connect each result back to the accounting concept."
  },
  {
    title: "Built for small business basics",
    description:
      "Work with invoices, SST estimates, cash flow, break-even points, ratios, debit and credit, journal entries, depreciation, and trial balances."
  }
];

const spotlightBenefits = [
  "Create a simple invoice quickly",
  "Add business and customer details",
  "Add line items, subtotal, and total",
  "Download the invoice as a PDF"
];

function StatusBadge({
  label,
  isAvailable
}: {
  label: string;
  isAvailable: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        isAvailable
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-stone-100 text-stone-500 ring-stone-200"
      }`}
    >
      {label}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <JsonLd data={createWebsiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />
      <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">
                Invoice Generator
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Free Invoice Generator and Accounting Tools for Small Businesses
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
                Create simple invoices with business and customer details, line items, totals,
                and currency formatting for 10 supported currencies including MYR, then use
                beginner-friendly accounting tools for everyday business checks.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  href="/tools/invoice-generator"
                >
                  Create a PDF Invoice
                </Link>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  href="/tools"
                >
                  Explore Accounting Tools
                </Link>
              </div>
            </div>

            <InvoicePreview />
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Tools</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Featured accounting tools
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Start with invoices, then use tax and accounting calculators as your business
              questions get more specific.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-stone-950">{tool.name}</h3>
                    <StatusBadge label={tool.status} isAvailable={tool.isAvailable} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
                  <p
                    className={`mt-5 text-sm font-semibold ${
                      tool.isAvailable ? "text-slate-700" : "text-stone-400"
                    }`}
                  >
                    {tool.isAvailable ? "Open tool" : "Planned"}
                  </p>
                </>
              );

              return tool.isAvailable ? (
                <Link
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                  href={tool.href}
                  key={tool.name}
                >
                  {content}
                </Link>
              ) : (
                <article
                  className="rounded-xl border border-stone-200 bg-white/70 p-5 shadow-sm"
                  key={tool.name}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Why use it</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Made for clear accounting checks
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reasons.map((reason, index) => (
              <article
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                key={reason.title}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-base font-semibold text-stone-950">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{reason.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">
                Tool spotlight
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with the PDF Invoice Generator
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Build a clean invoice for a customer in a few minutes. Add business details,
                customer details, line items, quantities, unit prices, and totals, then download
                a PDF when the invoice is ready.
              </p>
              <ul className="mt-6 space-y-3">
                {spotlightBenefits.map((benefit) => (
                  <li className="flex gap-3 text-sm text-stone-700" key={benefit}>
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
                href="/tools/invoice-generator"
              >
                Create Free Invoice
              </Link>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
              <div className="grid grid-cols-[1.4fr_0.6fr_1fr] gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[1.4fr_0.6fr_1fr] gap-2">
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                </div>
                <div className="grid grid-cols-[1.4fr_0.6fr_1fr] gap-2">
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                </div>
                <div className="ml-auto mt-5 h-16 w-full max-w-xs rounded-xl bg-white ring-1 ring-stone-200" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
