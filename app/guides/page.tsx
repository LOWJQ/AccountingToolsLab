import { guides } from "@/lib/data/guides";
import { createMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Invoice and Accounting Guides | AccountingToolsLab",
  description:
    "Read simple guides about invoices, SST, cash flow, break-even points, financial ratios, and accounting basics for small businesses, freelancers, beginners, and students.",
  path: "/guides"
});

const guideOrder = [
  "how-to-create-a-simple-invoice",
  "sst-calculator-malaysia-add-remove-sst",
  "trial-balance-explained",
  "cash-flow-vs-profit",
  "break-even-point-explained",
  "why-trial-balance-not-balancing",
  "debit-vs-credit",
  "financial-ratios-for-beginners",
  "straight-line-depreciation-explained",
  "journal-entries-for-beginners"
];

const orderedGuides = [...guides].sort(
  (firstGuide, secondGuide) =>
    guideOrder.indexOf(firstGuide.slug) - guideOrder.indexOf(secondGuide.slug)
);

const learningPaths = [
  {
    title: "Business Documents",
    steps: [
      {
        label: "How to Create a Simple Invoice",
        href: "/guides/how-to-create-a-simple-invoice",
        status: "Available"
      },
      {
        label: "Invoice Generator",
        href: "/tools/invoice-generator",
        status: "Available"
      },
      {
        label: "SST Calculator Malaysia",
        href: "/tools/sst-calculator-malaysia",
        status: "Available"
      },
      {
        label: "Cash Flow Calculator",
        href: "/tools/cash-flow-calculator",
        status: "Available"
      }
    ]
  },
  {
    title: "Malaysia Tax Basics",
    steps: [
      {
        label: "SST Calculator Malaysia",
        href: "/tools/sst-calculator-malaysia",
        status: "Available"
      },
      {
        label: "SST Calculator Malaysia: Add or Remove SST",
        href: "/guides/sst-calculator-malaysia-add-remove-sst",
        status: "Available"
      },
      {
        label: "Invoice Generator",
        href: "/tools/invoice-generator",
        status: "Available"
      }
    ]
  },
  {
    title: "Business Planning",
    steps: [
      {
        label: "Break-even Point Explained",
        href: "/guides/break-even-point-explained",
        status: "Available"
      },
      {
        label: "Break-even Calculator",
        href: "/tools/break-even-calculator",
        status: "Available"
      },
      {
        label: "Cash Flow vs Profit",
        href: "/guides/cash-flow-vs-profit",
        status: "Available"
      },
      {
        label: "Cash Flow Calculator",
        href: "/tools/cash-flow-calculator",
        status: "Available"
      }
    ]
  },
  {
    title: "Financial Analysis",
    steps: [
      {
        label: "Financial Ratios for Beginners",
        href: "/guides/financial-ratios-for-beginners",
        status: "Available"
      },
      {
        label: "Financial Ratio Calculator",
        href: "/tools/financial-ratio-calculator",
        status: "Available"
      }
    ]
  },
  {
    title: "Accounting Basics",
    steps: [
      {
        label: "Debit vs Credit",
        href: "/guides/debit-vs-credit",
        status: "Available"
      },
      {
        label: "Journal Entries for Beginners",
        href: "/guides/journal-entries-for-beginners",
        status: "Available"
      },
      {
        label: "Debit/Credit Checker",
        href: "/tools/debit-credit-checker",
        status: "Available"
      },
      {
        label: "Journal Entry Checker",
        href: "/tools/journal-entry-checker",
        status: "Available"
      },
      {
        label: "Accounting Equation Calculator",
        href: "/tools/accounting-equation-calculator",
        status: "Available"
      }
    ]
  },
  {
    title: "Bookkeeping Checks",
    steps: [
      {
        label: "Trial Balance Explained",
        href: "/guides/trial-balance-explained",
        status: "Available"
      },
      {
        label: "Why Trial Balance Is Not Balancing",
        href: "/guides/why-trial-balance-not-balancing",
        status: "Available"
      },
      {
        label: "Trial Balance Calculator",
        href: "/tools/trial-balance-calculator",
        status: "Available"
      }
    ]
  },
  {
    title: "Depreciation & Adjustments",
    steps: [
      {
        label: "Straight-Line Depreciation Explained",
        href: "/guides/straight-line-depreciation-explained",
        status: "Available"
      },
      {
        label: "Depreciation Calculator",
        href: "/tools/depreciation-calculator",
        status: "Available"
      }
    ]
  }
];

export default function GuidesPage() {
  return (
    <div>
      <main>
        <section className="bg-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="max-w-5xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">
                Invoice and Accounting Guides
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
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
              {orderedGuides.map((guide) => {
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
