"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateCashFlow, type CashFlowStatus } from "@/lib/calculators/cash-flow";
import { RotateCcw } from "lucide-react";

const statusLabels: Record<CashFlowStatus, string> = {
  positive: "Positive cash flow",
  negative: "Negative cash flow",
  neutral: "Neutral cash flow"
};

const statusClasses: Record<CashFlowStatus, string> = {
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  negative: "bg-rose-50 text-rose-700 ring-rose-100",
  neutral: "bg-slate-50 text-slate-700 ring-slate-200"
};

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function CashFlowCalculator() {
  const [beginningCashBalance, setBeginningCashBalance] = useState("0");
  const { currency, formatCurrency } = useCurrency();
  const [cashInflows, setCashInflows] = useState("0");
  const [cashOutflows, setCashOutflows] = useState("0");

  const calculation = useMemo(() => {
    try {
      const parsedBeginningCashBalance = parseAmount(beginningCashBalance);
      const parsedCashInflows = parseAmount(cashInflows);
      const parsedCashOutflows = parseAmount(cashOutflows);

      return {
        result: calculateCashFlow({
          beginningCashBalance: parsedBeginningCashBalance ?? 0,
          cashInflows: parsedCashInflows ?? 0,
          cashOutflows: parsedCashOutflows ?? 0
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: calculateCashFlow({
          beginningCashBalance: 0,
          cashInflows: 0,
          cashOutflows: 0
        }),
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [beginningCashBalance, cashInflows, cashOutflows]);

  function resetCalculator() {
    setBeginningCashBalance("0");
    setCashInflows("0");
    setCashOutflows("0");
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div className="grid gap-5 lg:pr-8">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-950">
                Beginning Cash Balance ({currency})
              </span>
              <input
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                min="0"
                onChange={(event) => setBeginningCashBalance(event.target.value)}
                placeholder="0.00"
                type="number"
                value={beginningCashBalance}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-950">Cash Inflows ({currency})</span>
              <input
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                min="0"
                onChange={(event) => setCashInflows(event.target.value)}
                placeholder="0.00"
                type="number"
                value={cashInflows}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-950">Cash Outflows ({currency})</span>
              <input
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                min="0"
                onChange={(event) => setCashOutflows(event.target.value)}
                placeholder="0.00"
                type="number"
                value={cashOutflows}
              />
            </label>

            <button
              className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={resetCalculator}
              type="button"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="grid gap-6">
            <div>
              <p className="text-sm font-medium text-slate-700">Ending Cash Balance</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(calculation.result.endingCashBalance)}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm font-medium text-slate-700">Net Cash Flow</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(calculation.result.netCashFlow)}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm font-medium text-slate-700">Status</p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${statusClasses[calculation.result.status]}`}
              >
                {statusLabels[calculation.result.status]}
              </span>
            </div>

            <p className="text-base leading-7 text-black">
              Ending Cash Balance = Beginning Cash Balance + Net Cash Flow
            </p>
            {calculation.message ? (
              <p className="text-sm font-medium text-rose-700">{calculation.message}</p>
            ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
