import { guides } from "@/lib/data/guides";
import { Container } from "@/components/layout/Container";
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
  "cash-flow-vs-profit",
  "break-even-point-explained",
  "financial-ratios-for-beginners",
  "straight-line-depreciation-explained",
  "trial-balance-explained",
  "why-trial-balance-not-balancing",
  "journal-entries-for-beginners",
  "debit-vs-credit"
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

function StatusBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
      {children}
    </span>
  );
}

export default function GuidesPage() {
  const availableGuideCount = guides.filter((guide) => guide.status === "available").length;
  const comingSoonGuideCount = guides.length - availableGuideCount;

  return (
    <div>
      <Container as="main">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            Invoice and Accounting Guides
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Invoice and accounting guides for small businesses
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Learn how to create simple invoices, understand SST, check cash flow, estimate
            break-even points, and review beginner-friendly accounting concepts.
          </p>
          <p className="mt-7 inline-flex rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
            {availableGuideCount} available guides; {comingSoonGuideCount} coming soon
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Invoice Generator</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Need to create an invoice now?
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Use the free Invoice Generator to add business details, customer details, line
                items, optional SST or tax, and download a PDF invoice.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools/invoice-generator"
              >
                Create Free Invoice
              </Link>
              <Link
                className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/guides/how-to-create-a-simple-invoice"
              >
                Read Simple Invoice Guide
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3">
            <div className="w-full">
              <p className="text-sm font-medium tracking-wide text-slate-500">Featured guides</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with practical business guides
              </h2>
            </div>
            <p className="w-full text-sm leading-6 text-stone-600">
              Begin with invoice, SST, cash flow, and break-even topics, then explore accounting
              basics when you need them.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {orderedGuides.map((guide) => {
              const isAvailable = guide.status === "available";
              const content = (
                <>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge>{guide.category}</StatusBadge>
                    <StatusBadge>{isAvailable ? "Available guide" : "Coming soon"}</StatusBadge>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-stone-950">
                    {guide.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{guide.description}</p>
                  <p
                    className={`mt-6 text-sm font-semibold ${
                      isAvailable ? "text-slate-700" : "text-stone-400"
                    }`}
                  >
                    {isAvailable ? "Read guide" : "Guide coming soon"}
                  </p>
                </>
              );

              return isAvailable ? (
                <Link
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                  href={guide.href}
                  key={guide.slug}
                >
                  {content}
                </Link>
              ) : (
                <article
                  className="rounded-xl border border-stone-200 bg-white/70 p-5 shadow-sm"
                  key={guide.slug}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Learning paths</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Suggested learning paths
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <article
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                key={path.title}
              >
                <h3 className="text-base font-semibold text-stone-950">{path.title}</h3>
                <ol className="mt-5 space-y-3">
                  {path.steps.map((step, index) => (
                    <li className="flex gap-3 text-sm leading-6" key={step.label}>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                        {index + 1}
                      </span>
                      <span>
                        {step.href ? (
                          <Link
                            className="font-semibold text-stone-800 hover:text-slate-700"
                            href={step.href}
                          >
                            {step.label}
                          </Link>
                        ) : (
                          <span className="font-semibold text-stone-500">{step.label}</span>
                        )}
                        <span className="ml-2 text-xs font-medium text-stone-400">
                          {step.status}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Guides and tools</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Create an invoice, then explore the tools
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Start with the free Invoice Generator, or explore calculators for SST, cash flow,
                break-even, and accounting basics.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools/invoice-generator"
              >
                Create Free Invoice
              </Link>
              <Link
                className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/tools"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-950">More guides may be added</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            The current guide library starts with practical business topics and keeps accounting
            basics available for students, beginners, and self-learners.
          </p>
        </aside>
      </Container>
    </div>
  );
}
