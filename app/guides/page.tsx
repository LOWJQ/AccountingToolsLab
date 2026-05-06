import type { Metadata } from "next";
import { guides } from "@/lib/data/guides";

export const metadata: Metadata = {
  title: "Accounting Guides | AccountingToolsLab",
  description:
    "Beginner-friendly accounting guides with clear explanations, formulas, examples, and links to practical tools."
};

const learningPaths = [
  {
    title: "Accounting Basics",
    steps: [
      { label: "Debit vs Credit", status: "Coming soon" },
      {
        label: "Debit/Credit Checker",
        href: "/tools/debit-credit-checker",
        status: "Available"
      },
      {
        label: "Accounting Equation Calculator",
        href: "/tools/accounting-equation-calculator",
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
    title: "Bookkeeping Checks",
    steps: [
      {
        label: "Trial Balance Explained",
        href: "/guides/trial-balance-explained",
        status: "Available"
      },
      {
        label: "Trial Balance Calculator",
        href: "/tools/trial-balance-calculator",
        status: "Available"
      },
      { label: "Future Bank Reconciliation Tool", status: "Coming soon" }
    ]
  },
  {
    title: "Financial Analysis",
    steps: [
      { label: "Financial Ratios for Beginners", status: "Coming soon" },
      {
        label: "Financial Ratio Calculator",
        href: "/tools/financial-ratio-calculator",
        status: "Available"
      },
      { label: "Future Ratio Practice Examples", status: "Coming soon" }
    ]
  },
  {
    title: "Depreciation & Adjustments",
    steps: [
      {
        label: "Depreciation Calculator",
        href: "/tools/depreciation-calculator",
        status: "Available"
      },
      { label: "Future Depreciation Methods Guide", status: "Coming soon" },
      { label: "Future Adjusting Entries Guide", status: "Coming soon" }
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
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            Accounting Guides
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Beginner-friendly accounting guides
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Learn core accounting concepts with clear explanations, formulas, examples, and
            links to practical tools.
          </p>
          <p className="mt-7 inline-flex rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
            1 available guide; {guides.length - 1} coming soon
          </p>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Featured guides</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with core accounting concepts
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              The available guide is ready to read. Upcoming guides are shown without linking to
              placeholder pages.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {guides.map((guide) => {
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
                <a
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                  href={guide.href}
                  key={guide.slug}
                >
                  {content}
                </a>
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
                          <a
                            className="font-semibold text-stone-800 hover:text-slate-700"
                            href={step.href}
                          >
                            {step.label}
                          </a>
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
                Learn the concept, then use the tool
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Each guide is designed to connect with a practical accounting tool, so you can
                understand the concept and then check your own numbers.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools"
              >
                Explore Tools
              </a>
              <a
                className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/tools/trial-balance-calculator"
              >
                Try Trial Balance Calculator
              </a>
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-950">More guides are planned</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Future guides may cover journal entries, bank reconciliation, depreciation methods,
            adjusting entries, and beginner bookkeeping workflows.
          </p>
        </aside>
      </main>
    </div>
  );
}
