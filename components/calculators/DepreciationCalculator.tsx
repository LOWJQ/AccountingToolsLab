"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { calculateDepreciation } from "@/lib/calculators/depreciation";

const mistakes = [
  "Using purchase price without including necessary asset costs",
  "Entering salvage value higher than cost",
  "Using useful life of zero",
  "Confusing annual depreciation with accumulated depreciation",
  "Assuming all assets use straight-line depreciation"
];

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState("");
  const { formatCurrency } = useCurrency();
  const [salvageValue, setSalvageValue] = useState("");
  const [usefulLifeYears, setUsefulLifeYears] = useState("");

  const calculation = useMemo(() => {
    if (!assetCost.trim()) {
      return { result: null, message: "Enter the asset cost to calculate depreciation." };
    }

    if (!salvageValue.trim()) {
      return { result: null, message: "Enter the salvage value. Use 0 if there is no expected salvage value." };
    }

    if (!usefulLifeYears.trim()) {
      return { result: null, message: "Enter the useful life in years." };
    }

    try {
      return {
        result: calculateDepreciation({
          assetCost: parseAmount(assetCost),
          salvageValue: parseAmount(salvageValue),
          usefulLifeYears: parseAmount(usefulLifeYears)
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [assetCost, salvageValue, usefulLifeYears]);

  function resetCalculator() {
    setAssetCost("");
    setSalvageValue("");
    setUsefulLifeYears("");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Asset Cost</span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setAssetCost(event.target.value)}
                placeholder="10000"
                type="number"
                value={assetCost}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Salvage Value</span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setSalvageValue(event.target.value)}
                placeholder="1000"
                type="number"
                value={salvageValue}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Useful Life in Years</span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setUsefulLifeYears(event.target.value)}
                placeholder="5"
                type="number"
                value={usefulLifeYears}
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
              Straight-line depreciation
            </h2>

            {calculation.result ? (
              <div className="mt-5 grid gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Annual depreciation expense
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    {formatCurrency(calculation.result.annualDepreciation)}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      Depreciable amount
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatCurrency(calculation.result.depreciableAmount)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      Monthly depreciation
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatCurrency(calculation.result.monthlyDepreciation)}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-stone-600">
                  The depreciable amount is {formatCurrency(calculation.result.depreciableAmount)},
                  spread evenly over {calculation.result.usefulLifeYears} year
                  {calculation.result.usefulLifeYears === 1 ? "" : "s"}.
                </p>
                <p className="text-xs leading-5 text-stone-500">
                  Rounded yearly amounts can differ by a cent when multiplied across several
                  years.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-stone-600">{calculation.message}</p>
            )}

            <p className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm font-semibold text-stone-700">
              Annual Depreciation Expense = (Cost - Salvage Value) / Useful Life
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Straight-line depreciation formula
          </h2>
          <p className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
            Annual Depreciation Expense = (Cost - Salvage Value) / Useful Life
          </p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              Cost is the amount assigned to the asset. Salvage value is the expected value
              at the end of the asset&apos;s useful life.
            </p>
            <p>
              Useful life is the number of years the asset is expected to help the business.
              Depreciation expense spreads the depreciable amount evenly across those years.
            </p>
            <p>
              This calculator is for simple straight-line depreciation, which uses the same
              depreciation amount each year.
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
              ["Cost", formatCurrency(10000)],
              ["Salvage value", formatCurrency(1000)],
              ["Useful life", "5 years"],
              ["Depreciable amount", formatCurrency(9000)],
              ["Annual depreciation", formatCurrency(1800)]
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
            The asset has {formatCurrency(9000)} of depreciable amount. Dividing{" "}
            {formatCurrency(9000)} by 5 years gives {formatCurrency(1800)} of depreciation
            expense per year.
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
              Connect depreciation with the rest of your accounting checks
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use the equation, ratio, and trial balance tools to keep practicing related
              accounting basics.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/accounting-equation-calculator">
              Accounting Equation Calculator
            </ButtonLink>
            <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
              Financial Ratio Calculator
            </ButtonLink>
            <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
              Trial Balance Calculator
            </ButtonLink>
            <ButtonLink href="/guides" variant="secondary">
              Guides
            </ButtonLink>
          </div>
        </div>
      </Card>
    </div>
  );
}
