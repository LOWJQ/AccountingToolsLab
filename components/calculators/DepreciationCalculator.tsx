"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Asset Cost</span>
            <input
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              inputMode="decimal"
              onChange={(event) => setAssetCost(event.target.value)}
              placeholder="0"
              type="number"
              value={assetCost}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Salvage Value</span>
            <input
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              inputMode="decimal"
              onChange={(event) => setSalvageValue(event.target.value)}
              placeholder="0"
              type="number"
              value={salvageValue}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Useful Life in Years</span>
            <input
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
              inputMode="decimal"
              onChange={(event) => setUsefulLifeYears(event.target.value)}
              placeholder="0"
              type="number"
              value={usefulLifeYears}
            />
          </label>

          <button
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={resetCalculator}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-xs font-semibold uppercase text-slate-500">Result</p>

          <div className="mt-5">
            <p className="text-base font-semibold leading-7 text-black">
              Annual Depreciation Expense
            </p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(calculation.result.annualDepreciation)}
            </p>
          </div>

          <div className="mt-5">
            <p className="text-base font-semibold leading-7 text-black">Depreciable Amount</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              {formatCurrency(calculation.result.depreciableAmount)}
            </p>
          </div>

          <p className="mt-5 text-base leading-7 text-black">
            <span className="font-semibold">Useful Life:</span>{" "}
            {calculation.result.usefulLifeYears} year
            {calculation.result.usefulLifeYears === 1 ? "" : "s"}
          </p>

          <p className="mt-3 text-base leading-7 text-black">
            <span className="font-semibold">Status:</span> {calculation.status}
          </p>

          <p className="mt-5 text-base font-medium leading-7 text-black">
            Annual Depreciation Expense = (Cost - Salvage Value) / Useful Life
          </p>
        </div>
      </div>
    </section>
  );
}
