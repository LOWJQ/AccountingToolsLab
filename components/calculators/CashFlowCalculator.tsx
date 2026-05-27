"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Card } from "@/components/ui/Card";
import { calculateCashFlow, type CashFlowStatus } from "@/lib/calculators/cash-flow";

const statusLabels: Record<CashFlowStatus, string> = {
  positive: "Positive cash flow",
  negative: "Negative cash flow",
  neutral: "Neutral cash flow"
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
  const { formatCurrency } = useCurrency();
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
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="grid gap-4">
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

          <div className="grid gap-5 rounded-xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>

            <div>
              <p className="text-sm font-semibold text-stone-800">Ending Cash Balance</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                {formatCurrency(calculation.result.endingCashBalance)}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">Net Cash Flow</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                {formatCurrency(calculation.result.netCashFlow)}
              </p>
            </div>

            <p className="text-sm leading-6 text-stone-700">
              <span className="font-semibold text-stone-800">Status:</span>{" "}
              {statusLabels[calculation.result.status]}
            </p>

            <p className="text-sm font-medium text-stone-700">
              Ending Cash Balance = Beginning Cash Balance + Net Cash Flow
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
