import type { Metadata } from "next";
import { TrialBalancePreview } from "@/components/home/TrialBalancePreview";

export const metadata: Metadata = {
  title: "AccountingToolsLab | Free Accounting Tools",
  description:
    "Free accounting calculators and beginner-friendly explanations for students, beginners, and small business owners."
};

const featuredTools = [
  {
    name: "Trial Balance Calculator",
    description: "Check whether total debits equal total credits and review the difference.",
    status: "Available",
    href: "/tools/trial-balance-calculator",
    isAvailable: true
  },
  {
    name: "Accounting Equation Calculator",
    description: "Review assets, liabilities, and equity in a simple accounting equation format.",
    status: "Available",
    href: "/tools/accounting-equation-calculator",
    isAvailable: true
  },
  {
    name: "Debit/Credit Checker",
    description: "Practice whether an account should increase with a debit or a credit.",
    status: "Available",
    href: "/tools/debit-credit-checker",
    isAvailable: true
  },
  {
    name: "Financial Ratio Calculator",
    description: "Calculate common ratios for liquidity, profitability, and solvency checks.",
    status: "Available",
    href: "/tools/financial-ratio-calculator",
    isAvailable: true
  },
  {
    name: "Depreciation Calculator",
    description: "Estimate depreciation with beginner-friendly inputs and explanations.",
    status: "Available",
    href: "/tools/depreciation-calculator",
    isAvailable: true
  },
  {
    name: "Break-even Calculator",
    description: "Find contribution margin, break-even units, and break-even sales.",
    status: "Available",
    href: "/tools/break-even-calculator",
    isAvailable: true
  },
  {
    name: "Cash Flow Calculator",
    description: "Calculate net cash flow and ending cash balance for a simple period.",
    status: "Available",
    href: "/tools/cash-flow-calculator",
    isAvailable: true
  },
  {
    name: "Invoice Generator",
    description: "Create a simple invoice with line items, subtotal, and total.",
    status: "Available",
    href: "/tools/invoice-generator",
    isAvailable: true
  },
  {
    name: "SST Calculator Malaysia",
    description: "Estimate SST amount, total including SST, or amount before SST.",
    status: "Available",
    href: "/tools/sst-calculator-malaysia",
    isAvailable: true
  },
  {
    name: "Journal Entry Checker",
    description: "Check whether debit and credit lines balance in a journal entry.",
    status: "Available",
    href: "/tools/journal-entry-checker",
    isAvailable: true
  }
];

const reasons = [
  {
    title: "Simple accounting calculators",
    description: "Use focused tools that solve one accounting task at a time without extra clutter."
  },
  {
    title: "Beginner-friendly explanations",
    description: "Read plain-English notes that connect each result back to the accounting concept."
  },
  {
    title: "Built for learning basics",
    description:
      "Check trial balances, debits, credits, journal entries, ratios, depreciation, break-even points, cash flow, invoices, and SST estimates."
  }
];

const spotlightBenefits = [
  "Check whether total debits equal total credits",
  "Find the difference instantly",
  "Learn what an unbalanced trial balance means"
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">
                Accounting Tools
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Free accounting tools for students, beginners, and small business owners
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
                Use simple calculators and beginner-friendly explanations to check accounting
                basics like trial balances, debit and credit, financial ratios, and depreciation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  href="/tools/trial-balance-calculator"
                >
                  Try Trial Balance Calculator
                </a>
                <a
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  href="/tools"
                >
                  Explore Tools
                </a>
              </div>
            </div>

            <TrialBalancePreview />
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
              Start with the essentials, then add more calculators as the toolkit grows.
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
                <a
                  className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
                  href={tool.href}
                  key={tool.name}
                >
                  {content}
                </a>
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
                Calculator spotlight
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Start with the Trial Balance Calculator
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Enter account names and amounts, then see whether the debit and credit sides
                agree. It is a simple first check before moving into deeper accounting review.
              </p>
              <ul className="mt-6 space-y-3">
                {spotlightBenefits.map((benefit) => (
                  <li className="flex gap-3 text-sm text-stone-700" key={benefit}>
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
                href="/tools/trial-balance-calculator"
              >
                Open Calculator
              </a>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                <span>Account</span>
                <span>Debit</span>
                <span>Credit</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2">
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                </div>
                <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-2">
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                  <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
