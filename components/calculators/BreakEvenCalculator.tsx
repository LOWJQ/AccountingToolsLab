"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Card } from "@/components/ui/Card";
import { calculateBreakEven } from "@/lib/calculators/break-even";

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("0");
  const { formatCurrency } = useCurrency();
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState("0");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("0");

  const calculation = useMemo(() => {
    try {
      const parsedFixedCosts = parseAmount(fixedCosts);
      const parsedSellingPricePerUnit = parseAmount(sellingPricePerUnit);
      const parsedVariableCostPerUnit = parseAmount(variableCostPerUnit);

      return {
        result: calculateBreakEven({
          fixedCosts: parsedFixedCosts ?? 0,
          sellingPricePerUnit: parsedSellingPricePerUnit ?? 0,
          variableCostPerUnit: parsedVariableCostPerUnit ?? 0
        }),
        message: "",
        isValid: true
      };
    } catch (error) {
      const parsedFixedCosts = parseAmount(fixedCosts) ?? 0;
      const parsedSellingPricePerUnit = parseAmount(sellingPricePerUnit) ?? 0;
      const parsedVariableCostPerUnit = parseAmount(variableCostPerUnit) ?? 0;
      const contributionMarginPerUnit = parsedSellingPricePerUnit - parsedVariableCostPerUnit;

      return {
        result: {
          fixedCosts: parsedFixedCosts,
          sellingPricePerUnit: parsedSellingPricePerUnit,
          variableCostPerUnit: parsedVariableCostPerUnit,
          contributionMarginPerUnit: contributionMarginPerUnit > 0 ? contributionMarginPerUnit : 0,
          breakEvenUnits: 0,
          minimumWholeUnits: 0,
          breakEvenSales: 0,
          explanation: ""
        },
        message: "Enter a selling price higher than variable cost",
        isValid: false
      };
    }
  }, [fixedCosts, sellingPricePerUnit, variableCostPerUnit]);

  function resetCalculator() {
    setFixedCosts("0");
    setSellingPricePerUnit("0");
    setVariableCostPerUnit("0");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="grid min-w-0 gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Fixed Costs</span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setFixedCosts(event.target.value)}
                placeholder="10000"
                type="number"
                value={fixedCosts}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">
                Selling Price per Unit
              </span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setSellingPricePerUnit(event.target.value)}
                placeholder="50"
                type="number"
                value={sellingPricePerUnit}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">
                Variable Cost per Unit
              </span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setVariableCostPerUnit(event.target.value)}
                placeholder="30"
                type="number"
                value={variableCostPerUnit}
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

          <div className="grid min-w-0 gap-5 rounded-xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>

            <div>
              <p className="text-sm font-semibold text-stone-800">Break-even Units</p>
              <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-stone-950">
                {formatAmount(calculation.result.breakEvenUnits)}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">Minimum Whole Units</p>
              <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-stone-950">
                {calculation.result.minimumWholeUnits.toLocaleString("en-US")}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">Contribution Margin per Unit</p>
              <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-stone-950">
                {formatCurrency(calculation.result.contributionMarginPerUnit)}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">Break-even Sales</p>
              <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-stone-950">
                {formatCurrency(calculation.result.breakEvenSales)}
              </p>
            </div>

            <p className="min-w-0 text-sm leading-6 text-stone-700">
              <span className="font-semibold text-stone-800">Status:</span>{" "}
              {calculation.isValid ? "Valid break-even point" : calculation.message}
            </p>

            <p className="text-sm font-medium text-stone-700">
              Break-even Units = Fixed Costs / Contribution Margin per Unit
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
