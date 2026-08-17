import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { guideLink, guides, indexableGuides } from "@/lib/data/guides";
import { toolLink } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";
import { createItemListSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Invoice and Accounting Guides | AccountingToolsLab",
  description:
    "Simple guides on invoices, SST, cash flow, break-even, and accounting basics for small businesses, freelancers, and students.",
  path: "/guides"
});

// Display order comes from lib/data/guides.ts. Draft (noindex) guides stay in
// the visible list but out of the schema, matching what the sitemap submits.
const guideItemList = indexableGuides.map((guide) => ({
  name: guide.title,
  url: `${siteConfig.url}${guide.href}`,
  description: guide.description
}));

const learningPaths = [
  {
    title: "Business Documents",
    steps: [
      { ...guideLink("what-should-an-invoice-include-before-you-send-it"), status: "Available" },
      { ...toolLink("invoice-generator"), status: "Available" },
      { ...toolLink("sst-calculator-malaysia"), status: "Available" },
      { ...toolLink("cash-flow-calculator"), status: "Available" }
    ]
  },
  {
    title: "Malaysia Tax Basics",
    steps: [
      { ...toolLink("sst-calculator-malaysia"), status: "Available" },
      { ...guideLink("do-i-need-to-register-for-sst-malaysia"), status: "Available" },
      { ...toolLink("invoice-generator"), status: "Available" }
    ]
  },
  {
    title: "Business Planning",
    steps: [
      { ...guideLink("fixed-vs-variable-costs"), status: "Available" },
      { ...toolLink("break-even-calculator"), status: "Available" },
      { ...guideLink("profitable-but-no-cash"), status: "Available" },
      { ...toolLink("cash-flow-calculator"), status: "Available" }
    ]
  },
  {
    title: "Financial Analysis",
    steps: [
      { ...guideLink("what-is-a-good-financial-ratio"), status: "Available" },
      { ...toolLink("financial-ratio-calculator"), status: "Available" }
    ]
  },
  {
    title: "Accounting Basics",
    steps: [
      { ...guideLink("debit-vs-credit"), status: "Available" },
      { ...guideLink("journal-entries-for-beginners"), status: "Available" },
      { ...toolLink("debit-credit-checker"), status: "Available" },
      { ...toolLink("journal-entry-checker"), status: "Available" },
      { ...toolLink("accounting-equation-calculator"), status: "Available" }
    ]
  },
  {
    title: "Bookkeeping Checks",
    steps: [
      { ...guideLink("errors-not-revealed-by-a-trial-balance"), status: "Available" },
      { ...guideLink("why-trial-balance-not-balancing"), status: "Available" },
      { ...toolLink("trial-balance-calculator"), status: "Available" }
    ]
  },
  {
    title: "Depreciation & Adjustments",
    steps: [
      { ...guideLink("straight-line-depreciation-explained"), status: "Available" },
      { ...toolLink("depreciation-calculator"), status: "Available" }
    ]
  }
];

export default function GuidesPage() {
  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` }
        ]}
      />
      <JsonLd data={createItemListSchema(guideItemList, "Article")} />

      <main>
        <section className="bg-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link className="transition hover:text-slate-900" href="/">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">&gt;</li>
                <li className="font-medium text-slate-700">Guides</li>
              </ol>
            </nav>

            <div className="mt-8 max-w-5xl">
              <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Invoice and Accounting Guides
              </h1>
              <p className="mt-5 text-base leading-7 text-stone-600">
                Learn how to create simple invoices, understand SST, check cash flow, estimate
                break-even points, and review beginner-friendly accounting concepts.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="border-t border-stone-200" />
        </div>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Directory</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with practical business guides
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Begin with invoice, SST, cash flow, and break-even topics, then explore accounting
                basics when you need them.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => {
                const isAvailable = guide.status === "available";

                const content = (
                  <>
                    <p className="text-sm font-medium tracking-wide text-slate-500">
                      {guide.category}
                    </p>
                    <h3 className="mt-4 text-base font-semibold text-stone-950">
                      {guide.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-stone-600">{guide.description}</p>
                    {isAvailable ? (
                      <div className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white">
                        Read guide
                      </div>
                    ) : (
                      <div className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold text-stone-400">
                        Guide coming soon
                      </div>
                    )}
                  </>
                );

                return isAvailable ? (
                  <Link
                    className="rounded-xl border border-stone-200 bg-[#f5f5f5] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                    href={guide.href}
                    key={guide.slug}
                  >
                    {content}
                  </Link>
                ) : (
                  <article
                    className="rounded-xl border border-stone-200 bg-[#f5f5f5] p-5 shadow-sm"
                    key={guide.slug}
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="border-t border-stone-200" />
        </div>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Learning paths</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Suggested learning paths
              </h2>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {learningPaths.map((path) => (
                <article className="rounded-xl border border-stone-200 bg-white p-5" key={path.title}>
                  <h3 className="text-base font-semibold text-stone-950">{path.title}</h3>
                  <ol className="mt-5 space-y-4">
                    {path.steps.map((step, index) => (
                      <li className="flex gap-3 text-sm leading-6" key={step.label}>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                          {index + 1}
                        </span>
                        <span>
                          {step.href ? (
                            <Link
                              className="rounded-sm font-semibold text-stone-800 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                              href={step.href}
                            >
                              {step.label}
                            </Link>
                          ) : (
                            <span className="font-semibold text-stone-500">{step.label}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
