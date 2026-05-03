import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AccountingToolsLab",
  description:
    "Learn about AccountingToolsLab, a free accounting tools website for students, beginners, and small business owners."
};

const audiences = [
  {
    title: "Accounting students",
    description: "Practice core concepts and check simple accounting exercises while studying."
  },
  {
    title: "Business beginners",
    description: "Understand the basics behind common accounting terms and calculations."
  },
  {
    title: "Small business owners",
    description: "Use lightweight tools to review basic bookkeeping and accounting checks."
  },
  {
    title: "Self-learners",
    description: "Learn accounting step by step with clear explanations and practical examples."
  }
];

const provides = [
  "Simple calculators",
  "Clear formulas",
  "Worked examples",
  "Common mistakes",
  "Beginner-friendly explanations"
];

const plannedTools = [
  "Accounting Equation Calculator",
  "Debit/Credit Checker",
  "Financial Ratio Calculator",
  "Depreciation Calculator"
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
            Accounting tools built for learning and checking the basics
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            AccountingToolsLab provides simple calculators and beginner-friendly explanations to
            help students, beginners, and small business owners understand core accounting
            concepts.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Mission</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Our mission
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              To make basic accounting easier to learn, check, and apply through simple,
              accessible online tools.
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
              The site focuses on useful learning aids rather than complicated software features.
              Each tool is intended to make a specific accounting check easier to understand.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {provides.map((item) => (
              <div
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-semibold text-stone-700"
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
              AccountingToolsLab is currently in its early version. The Trial Balance Calculator
              is available first, with more accounting tools planned over time.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {plannedTools.map((tool) => (
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
              Educational use
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              The tools are designed for learning and basic checking. They should not replace
              advice from a qualified accountant or professional financial adviser.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Start here</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with the tools
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Try the available calculator or explore upcoming tools.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools"
              >
                Explore Tools
              </a>
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/tools/trial-balance-calculator"
              >
                Try Trial Balance Calculator
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
