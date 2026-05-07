import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Trial Balance Explained | AccountingToolsLab",
  description:
    "Learn what a trial balance is, why total debits and total credits should match, and what an unbalanced trial balance means.",
  path: "/guides/trial-balance-explained"
});

const commonMistakes = [
  "Entering an amount on the wrong side",
  "Missing an account from the list",
  "Typing wrong digits",
  "Mixing balances from different periods",
  "Assuming balanced means completely error-free"
];

export default function TrialBalanceExplainedGuidePage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Trial Balance Explained
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            This guide helps beginners understand what a trial balance is, why debits and credits
            should match, and what to check when the totals do not agree.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Quick answer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What is a trial balance?
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              A trial balance is a list of ledger account balances used to check whether total
              debits equal total credits.
            </p>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Formula</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Trial balance formula
            </h2>
            <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-5 text-center text-xl font-semibold tracking-tight text-stone-950">
              Total Debits = Total Credits
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Why it matters</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Why trial balance matters
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600">
            A trial balance helps detect posting or calculation differences before preparing
            financial statements. If the debit and credit totals do not match, it is a signal to
            review the ledger entries and account balances before moving forward.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple trial balance example
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-2">Account</th>
                  <th className="px-4 py-2 text-right">Debit</th>
                  <th className="px-4 py-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="text-stone-700">
                <tr className="bg-stone-50">
                  <td className="rounded-l-xl border-y border-l border-stone-200 px-4 py-3">
                    Cash
                  </td>
                  <td className="border-y border-stone-200 px-4 py-3 text-right">1,000</td>
                  <td className="rounded-r-xl border-y border-r border-stone-200 px-4 py-3 text-right">
                    -
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="rounded-l-xl border-y border-l border-stone-200 px-4 py-3">
                    Equipment
                  </td>
                  <td className="border-y border-stone-200 px-4 py-3 text-right">500</td>
                  <td className="rounded-r-xl border-y border-r border-stone-200 px-4 py-3 text-right">
                    -
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="rounded-l-xl border-y border-l border-stone-200 px-4 py-3">
                    Capital
                  </td>
                  <td className="border-y border-stone-200 px-4 py-3 text-right">-</td>
                  <td className="rounded-r-xl border-y border-r border-stone-200 px-4 py-3 text-right">
                    1,500
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-base leading-7 text-stone-600">
            This trial balance is balanced because total debits are 1,500 and total credits are
            1,500.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Unbalanced totals</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What if it is unbalanced?
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              An unbalanced trial balance means total debits and total credits do not match. The
              difference should be investigated by checking for missing accounts, wrong-side
              entries, typing mistakes, or balances from the wrong period.
            </p>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Common trial balance mistakes
            </h2>
            <ul className="mt-5 space-y-3">
              {commonMistakes.map((mistake) => (
                <li className="flex gap-3 text-sm leading-6 text-stone-700" key={mistake}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-500" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Try it</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Check your own trial balance
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Use the calculator to enter debit and credit balances, compare totals, and see
                the difference instantly.
              </p>
            </div>
            <a
              className="inline-flex h-11 min-w-64 items-center justify-center whitespace-nowrap rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="/tools/trial-balance-calculator"
            >
              Try the Trial Balance Calculator
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
