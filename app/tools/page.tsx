import { tools } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { InvoiceMockPreview } from "@/components/tools/InvoiceMockPreview";
import { createItemListSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Accounting Calculators and Invoice Tools | AccountingToolsLab",
  description:
    "Create invoices, calculate SST, check cash flow, estimate break-even points, and use free accounting calculators for small businesses, freelancers, and learners.",
  path: "/tools"
});

const categories = [
  {
    title: "Main Business Tool",
    description: "Start with the invoice generator for practical small business documents."
  },
  {
    title: "Business Calculators",
    description: "Estimate SST, review cash flow, calculate break-even points, and check ratios."
  },
  {
    title: "Accounting Learning Tools",
    description: "Practice trial balances, journal entries, debits, credits, and core concepts."
  }
];

const availableTools = tools.filter((tool) => tool.status === "mvp");
const invoiceTool = tools.find((tool) => tool.slug === "invoice-generator");
const toolItemList = availableTools.map((tool) => ({
  name: tool.name,
  url: `${siteConfig.url}${tool.href}`,
  description: tool.description
}));

const businessToolSlugs = [
  "sst-calculator-malaysia",
  "cash-flow-calculator",
  "break-even-calculator",
  "financial-ratio-calculator",
  "depreciation-calculator"
];

const learningToolSlugs = [
  "trial-balance-calculator",
  "journal-entry-checker",
  "debit-credit-checker",
  "accounting-equation-calculator"
];

function getToolsBySlugOrder(slugs: string[]) {
  return slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
}

const businessTools = getToolsBySlugOrder(businessToolSlugs);
const learningTools = getToolsBySlugOrder(learningToolSlugs);

function StatusBadge({ status }: { status: "mvp" | "planned" }) {
  const isAvailable = status === "mvp";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        isAvailable
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-stone-100 text-stone-500 ring-stone-200"
      }`}
    >
      {isAvailable ? "Available" : "Coming Soon"}
    </span>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  const isAvailable = tool.status === "mvp";
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {tool.category}
          </p>
          <h3 className="mt-2 text-base font-semibold text-stone-950">{tool.name}</h3>
        </div>
        <StatusBadge status={tool.status} />
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-600">{tool.description}</p>
      {tool.bestFor ? (
        <p className="mt-4 text-sm leading-6 text-stone-500">
          <span className="font-semibold text-stone-700">Best for:</span> {tool.bestFor}
        </p>
      ) : null}
      <div
        className={`mt-6 inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold ${
          isAvailable
            ? "bg-slate-700 text-white"
            : "border border-stone-200 bg-stone-50 text-stone-400"
        }`}
      >
        {isAvailable ? "Open tool" : "Coming soon"}
      </div>
    </>
  );

  return isAvailable ? (
    <Link
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
      href={tool.href}
      key={tool.slug}
    >
      {content}
    </Link>
  ) : (
    <article
      className="rounded-xl border border-stone-200 bg-white/70 p-5 shadow-sm"
      key={tool.slug}
    >
      {content}
    </article>
  );
}

export default function ToolsPage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` }
        ]}
      />
      <JsonLd data={createItemListSchema(toolItemList)} />
      <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">
              Invoice and Accounting Tools
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Free Invoice Generator and Accounting Tools
            </h1>
            <p className="mt-5 text-base leading-7 text-stone-600">
              Create simple invoices, calculate SST, check cash flow, estimate break-even points,
              and use beginner-friendly accounting calculators for small business and learning.
            </p>
            <div className="mt-7 inline-flex rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
              {availableTools.length} available tools
            </div>
          </div>
        </section>

        {invoiceTool ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Most Useful for Small Businesses
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                  PDF Invoice Generator Malaysia
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                  Create simple invoices with business and customer details, line items,
                  subtotal, optional SST / tax, total, and 10 supported currencies including MYR.
                  Preview your invoice and download it as a PDF when it is ready.
                </p>
                <Link
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  href="/tools/invoice-generator"
                >
                  Create a PDF Invoice
                </Link>
              </div>
              <InvoiceMockPreview />
            </div>
          </section>
        ) : null}

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Directory</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Business calculators
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              After invoices, use these calculators to estimate tax, cash flow, break-even
              points, performance, and depreciation.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">
                Accounting learning
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Beginner-friendly accounting tools
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Keep learning with practical checks for trial balances, journals, debits, credits,
              and the accounting equation.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Use cases</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Accounting tool categories
            </h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <article
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                key={category.title}
              >
                <h3 className="text-sm font-semibold text-stone-950">{category.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">
              Recommended starting point
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Need to bill a customer? Start with the free invoice generator.
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              It gives small businesses and freelancers a simple path from customer details and
              line items to a clean downloadable PDF invoice.
            </p>
            <Link
              className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
              href="/tools/invoice-generator"
            >
              Open PDF Invoice Generator
            </Link>
          </div>
        </section>

        <aside className="rounded-xl border border-stone-200 bg-white/80 p-5 text-sm leading-6 text-stone-600 shadow-sm">
          Accounting learning resources still matter here. Start with invoices for business tasks,
          then use the calculators when you need tax, cash, planning, or bookkeeping checks.
        </aside>
      </main>
    </div>
  );
}

