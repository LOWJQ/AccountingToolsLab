"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { calculateCashFlow, type CashFlowStatus } from "@/lib/calculators/cash-flow";

const mistakes = [
  "Confusing profit with cash flow",
  "Forgetting unpaid invoices are not cash received yet",
  "Mixing up cash inflows and outflows",
  "Ignoring beginning cash balance",
  "Treating positive cash flow as the only sign of business health"
];

const statusLabels: Record<CashFlowStatus, string> = {
  positive: "Positive cash flow",
  negative: "Negative cash flow",
  neutral: "Neutral cash flow"
};

const statusClasses: Record<CashFlowStatus, string> = {
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  negative: "bg-red-50 text-red-700 ring-red-100",
  neutral: "bg-stone-100 text-stone-600 ring-stone-200"
};

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function CashFlowCalculator() {
  const [beginningCashBalance, setBeginningCashBalance] = useState("");
  const { formatCurrency } = useCurrency();
  const [cashInflows, setCashInflows] = useState("");
  const [cashOutflows, setCashOutflows] = useState("");

  const calculation = useMemo(() => {
    if (!beginningCashBalance.trim()) {
      return { result: null, message: "Enter beginning cash balance to calculate cash flow." };
    }

    if (!cashInflows.trim()) {
      return { result: null, message: "Enter cash inflows. Use 0 if there were no inflows." };
    }

    if (!cashOutflows.trim()) {
      return { result: null, message: "Enter cash outflows. Use 0 if there were no outflows." };
    }

    try {
      return {
        result: calculateCashFlow({
          beginningCashBalance: parseAmount(beginningCashBalance),
          cashInflows: parseAmount(cashInflows),
          cashOutflows: parseAmount(cashOutflows)
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [beginningCashBalance, cashInflows, cashOutflows]);

  function resetCalculator() {
    setBeginningCashBalance("");
    setCashInflows("");
    setCashOutflows("");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">
                Beginning Cash Balance
              </span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setBeginningCashBalance(event.target.value)}
                placeholder="5000"
                type="number"
                value={beginningCashBalance}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Cash Inflows</span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setCashInflows(event.target.value)}
                placeholder="12000"
                type="number"
                value={cashInflows}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Cash Outflows</span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setCashOutflows(event.target.value)}
                placeholder="9000"
                type="number"
                value={cashOutflows}
              />
            </label>

            <button
              className="inline-flex h-10 w-fit items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              onClick={resetCalculator}
              type="button"
            >
              Reset
            </button>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
              Net cash flow
            </h2>

            {calculation.result ? (
              <div className="mt-5 grid gap-3">
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                    statusClasses[calculation.result.status]
                  }`}
                >
                  {statusLabels[calculation.result.status]}
                </span>
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Ending cash balance
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    {formatCurrency(calculation.result.endingCashBalance)}
                  </p>
                </div>
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Net cash flow
                  </p>
                  <p className="mt-2 text-xl font-semibold text-stone-950">
                    {formatCurrency(calculation.result.netCashFlow)}
                  </p>
                </div>
                <p className="text-sm leading-6 text-stone-600">
                  Net cash flow is {calculation.result.status}, so the ending cash balance is{" "}
                  {formatCurrency(calculation.result.endingCashBalance)}.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-stone-600">{calculation.message}</p>
            )}

            <p className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm font-semibold text-stone-700">
              Ending Cash Balance = Beginning Cash Balance + Net Cash Flow
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What cash flow means
          </h2>
          <div className="mt-4 grid gap-3">
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Net Cash Flow = Cash Inflows - Cash Outflows
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Ending Cash Balance = Beginning Cash Balance + Net Cash Flow
            </p>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              Cash flow tracks cash moving into and out of a business during a period.
              It is not always the same as profit.
            </p>
            <p>
              Beginning cash is the amount available at the start. Inflows are cash received,
              outflows are cash paid, net cash flow is the difference, and ending cash is what
              remains after the period.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Example calculation
          </h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Beginning cash", formatCurrency(5000)],
              ["Cash inflows", formatCurrency(12000)],
              ["Cash outflows", formatCurrency(9000)],
              ["Net cash flow", formatCurrency(3000)],
              ["Ending cash balance", formatCurrency(8000)]
            ].map(([label, value]) => (
              <div
                className="flex items-center justify-between gap-4 border-b border-stone-100 py-3 last:border-b-0"
                key={label}
              >
                <span className="text-sm text-stone-600">{label}</span>
                <span className="text-sm font-semibold text-stone-950">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Cash inflows of {formatCurrency(12000)} minus cash outflows of{" "}
            {formatCurrency(9000)} gives positive net cash flow of {formatCurrency(3000)}.
            Adding that to {formatCurrency(5000)} beginning cash gives {formatCurrency(8000)}{" "}
            ending cash.
          </p>
        </Card>
      </section>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Mistakes to avoid
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {mistakes.map((mistake) => (
            <div
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
              key={mistake}
            >
              {mistake}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Connect cash flow with simple business checks
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use break-even, ratio, and equation tools to keep reviewing the bigger picture.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/break-even-calculator">Break-even Calculator</ButtonLink>
            <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
              Financial Ratio Calculator
            </ButtonLink>
            <ButtonLink href="/tools/accounting-equation-calculator" variant="secondary">
              Accounting Equation Calculator
            </ButtonLink>
            <ButtonLink href="/tools" variant="secondary">
              All Tools
            </ButtonLink>
          </div>
        </div>
      </Card>
    </div>
  );
}
