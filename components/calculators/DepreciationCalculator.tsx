"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Card } from "@/components/ui/Card";
import { calculateDepreciation } from "@/lib/calculators/depreciation";

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState("0");
  const { formatCurrency } = useCurrency();
  const [salvageValue, setSalvageValue] = useState("0");
  const [usefulLifeYears, setUsefulLifeYears] = useState("0");

  const calculation = useMemo(() => {
    const parsedAssetCost = parseAmount(assetCost) ?? 0;
    const parsedSalvageValue = parseAmount(salvageValue) ?? 0;
    const parsedUsefulLifeYears = parseAmount(usefulLifeYears) ?? 0;

    try {
      return {
        result: calculateDepreciation({
          assetCost: parsedAssetCost,
          salvageValue: parsedSalvageValue,
          usefulLifeYears: parsedUsefulLifeYears
        }),
        status: "Ready"
      };
    } catch (error) {
      const statusMessage =
        parsedUsefulLifeYears <= 0
          ? "Enter a useful life greater than 0"
          : error instanceof Error
            ? error.message
            : "Check the values and try again.";

      return {
        result: {
          assetCost: parsedAssetCost,
          salvageValue: parsedSalvageValue,
          usefulLifeYears: parsedUsefulLifeYears,
          depreciableAmount:
            parsedAssetCost > 0 && parsedSalvageValue >= 0 && parsedSalvageValue <= parsedAssetCost
              ? parsedAssetCost - parsedSalvageValue
              : 0,
          annualDepreciation: 0,
          monthlyDepreciation: 0,
          explanation: ""
        },
        status: statusMessage
      };
    }
  }, [assetCost, salvageValue, usefulLifeYears]);

  function resetCalculator() {
    setAssetCost("0");
    setSalvageValue("0");
    setUsefulLifeYears("0");
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
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
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

          <div className="grid gap-5 rounded-xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>

            <div>
              <p className="text-sm font-semibold text-stone-800">Annual Depreciation Expense</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                {formatCurrency(calculation.result.annualDepreciation)}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">Depreciable Amount</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                {formatCurrency(calculation.result.depreciableAmount)}
              </p>
            </div>

            <p className="text-sm leading-6 text-stone-700">
              <span className="font-semibold text-stone-800">Useful Life:</span>{" "}
              {calculation.result.usefulLifeYears} year
              {calculation.result.usefulLifeYears === 1 ? "" : "s"}
            </p>

            <p className="text-sm leading-6 text-stone-700">
              <span className="font-semibold text-stone-800">Status:</span> {calculation.status}
            </p>

            <p className="text-sm font-medium text-stone-700">
              Annual Depreciation Expense = (Cost - Salvage Value) / Useful Life
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
