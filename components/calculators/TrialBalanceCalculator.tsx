const trialBalanceRows = [
  { accountName: "Cash", debit: "12,500.00", credit: "" },
  { accountName: "Accounts Receivable", debit: "4,200.00", credit: "" },
  { accountName: "Service Revenue", debit: "", credit: "10,800.00" },
  { accountName: "Owner's Capital", debit: "", credit: "5,900.00" }
];

const facts = [
  {
    label: "Purpose",
    value: "Check whether total debits and total credits agree before statements."
  },
  {
    label: "Total Debit",
    value: "Sum of all debit balances from the ledger."
  },
  {
    label: "Total Credit",
    value: "Sum of all credit balances from the ledger."
  },
  {
    label: "Difference",
    value: "The gap between debit and credit totals."
  }
];

const mistakes = [
  {
    title: "Posting an amount to the wrong side",
    description: "A debit entered as a credit can make an otherwise correct ledger look unbalanced."
  },
  {
    title: "Missing an account balance",
    description: "Leaving out one account can create a difference that is hard to spot later."
  },
  {
    title: "Typing transposed digits",
    description: "Amounts like 540 and 450 often point to a simple input mistake."
  },
  {
    title: "Mixing period balances",
    description: "Use balances from the same accounting period for a meaningful check."
  },
  {
    title: "Assuming balanced means error-free",
    description: "A balanced trial balance can still contain classification or posting errors."
  }
];

function SummaryCard({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "error";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-700"
      : tone === "error"
        ? "text-rose-700"
        : "text-stone-950";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
    </div>
  );
}

export function TrialBalanceCalculator() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Trial Balance Calculator
            </h1>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Enter account balances in the debit or credit column to preview a clean trial
              balance worksheet layout.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add Row
          </button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 px-1 pb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <span>Account Name</span>
              <span>Debit</span>
              <span>Credit</span>
            </div>
            <div className="flex flex-col gap-3">
              {trialBalanceRows.map((row) => (
                <div
                  className="grid grid-cols-[1.4fr_1fr_1fr] gap-3"
                  key={row.accountName}
                >
                  <input
                    aria-label={`${row.accountName} account name`}
                    className="h-12 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none"
                    defaultValue={row.accountName}
                    readOnly
                  />
                  <input
                    aria-label={`${row.accountName} debit amount`}
                    className="h-12 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none"
                    defaultValue={row.debit}
                    placeholder="0.00"
                    readOnly
                  />
                  <input
                    aria-label={`${row.accountName} credit amount`}
                    className="h-12 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none"
                    defaultValue={row.credit}
                    placeholder="0.00"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Debit" value="$16,700.00" />
          <SummaryCard label="Total Credit" value="$16,700.00" />
          <SummaryCard label="Difference" value="$0.00" />
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Status
            </p>
            <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
              Balanced
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm text-stone-500">
          A trial balance is balanced when total debits equal total credits.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col gap-6">
          <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              About Trial Balance
            </h2>
            <div className="mt-5 divide-y divide-stone-100">
              {facts.map((fact) => (
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr]" key={fact.label}>
                  <dt className="text-sm font-semibold text-stone-800">{fact.label}</dt>
                  <dd className="text-sm leading-6 text-stone-600">{fact.value}</dd>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm">
            <div className="grid gap-6 p-6 sm:grid-cols-[1fr_12rem] sm:items-center">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  Learn Trial Balance Step by Step
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Build confidence with plain-English explanations, worked examples, and
                  accounting basics made for beginners.
                </p>
                <button
                  type="button"
                  className="mt-5 inline-flex h-10 items-center rounded-full border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                >
                  Learn More
                </button>
              </div>
              <div className="min-h-40 rounded-[1.5rem] bg-[linear-gradient(135deg,#eef2f3,#dfe7df_55%,#f8f6f1)] p-4">
                <div className="h-full rounded-2xl border border-white/70 bg-white/45 p-4">
                  <div className="h-3 w-20 rounded-full bg-slate-300" />
                  <div className="mt-6 space-y-3">
                    <div className="h-2 rounded-full bg-white" />
                    <div className="h-2 w-4/5 rounded-full bg-white" />
                    <div className="h-2 w-2/3 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-stone-950">
            Common Mistakes
          </h2>
          <div className="mt-5 divide-y divide-stone-100">
            {mistakes.map((mistake) => (
              <div className="py-4" key={mistake.title}>
                <h3 className="text-sm font-semibold text-stone-900">{mistake.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{mistake.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[radial-gradient(circle_at_70%_35%,rgba(101,116,139,0.18),transparent_34%),linear-gradient(135deg,transparent,#edf1ed)] lg:block" />
        <div className="relative max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Understand accounting faster with simple tools and worked examples.
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
            Explore beginner-friendly guides that explain why debits and credits move the way
            they do.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Explore Guides
          </button>
        </div>
      </section>
    </div>
  );
}
