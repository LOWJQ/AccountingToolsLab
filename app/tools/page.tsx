import type { Metadata } from "next";
import { tools } from "@/lib/data/tools";

export const metadata: Metadata = {
  title: "Accounting Tools | AccountingToolsLab",
  description:
    "Explore free accounting calculators and learning tools for students, beginners, and small business owners."
};

const categories = [
  {
    title: "Accounting Basics",
    description: "Core concepts such as the accounting equation, debits, and credits."
  },
  {
    title: "Bookkeeping Checks",
    description: "Practical tools for checking whether accounting records agree."
  },
  {
    title: "Financial Analysis",
    description: "Ratio and statement checks for understanding business performance."
  },
  {
    title: "Depreciation & Adjustments",
    description: "Support for common adjusting entries and fixed asset calculations."
  }
];

const availableTools = tools.filter((tool) => tool.status === "mvp");
const plannedTools = tools.filter((tool) => tool.status === "planned");

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

export default function ToolsPage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">
              Accounting Tools
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Free accounting calculators and learning tools
            </h1>
            <p className="mt-5 text-base leading-7 text-stone-600">
              Explore simple accounting tools built for students, beginners, and small business
              owners. Start with trial balance checking, then use more calculators as they are
              released.
            </p>
            <div className="mt-7 inline-flex rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
              {availableTools.length} available tool · {plannedTools.length} coming soon
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Directory</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Tool directory
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Available tools open directly. Planned tools are shown so the product roadmap stays
              easy to understand.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const isAvailable = tool.status === "mvp";
              const content = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                        {tool.category}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-stone-950">
                        {tool.name}
                      </h3>
                    </div>
                    <StatusBadge status={tool.status} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-600">{tool.description}</p>
                  {tool.bestFor ? (
                    <p className="mt-4 text-sm leading-6 text-stone-500">
                      <span className="font-semibold text-stone-700">Best for:</span>{" "}
                      {tool.bestFor}
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
                <a
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                  href={tool.href}
                  key={tool.slug}
                >
                  {content}
                </a>
              ) : (
                <article
                  className="rounded-xl border border-stone-200 bg-white/70 p-5 shadow-sm"
                  key={tool.slug}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">Use cases</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Accounting tool categories
            </h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              New to accounting? Start with the Trial Balance Calculator.
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use it to check whether total debits equal total credits and understand what an
              unbalanced trial balance means.
            </p>
            <a
              className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
              href="/tools/trial-balance-calculator"
            >
              Open Trial Balance Calculator
            </a>
          </div>
        </section>

        <aside className="rounded-xl border border-stone-200 bg-white/80 p-5 text-sm leading-6 text-stone-600 shadow-sm">
          More accounting tools are planned, including journal entry support, bank reconciliation,
          and beginner practice tools.
        </aside>
      </main>
    </div>
  );
}
