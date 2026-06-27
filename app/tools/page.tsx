import { tools } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { createItemListSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Free Accounting Calculators and Invoice Tools | AccountingToolsLab",
  description:
    "Create invoices, calculate SST, check cash flow, estimate break-even points, and use free accounting calculators for small businesses, freelancers, and learners.",
  path: "/tools"
});

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
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` }
        ]}
      />
      <JsonLd data={createItemListSchema(toolItemList)} />
      <Container as="main">
        <section className="max-w-5xl">
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
        </section>

        {invoiceTool ? (
          <section className="border-t border-stone-200 pt-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">
              Most Useful for Small Businesses
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              PDF Invoice Generator Malaysia
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Create simple invoices with business and customer details, line items, subtotal,
              optional SST / tax, total, and 10 supported currencies including MYR. Preview your
              invoice and download it as a PDF when it is ready.
            </p>
            <Link
              className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/invoice-generator"
            >
              Create a PDF Invoice
            </Link>
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
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {learningTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

      </Container>
    </div>
  );
}
