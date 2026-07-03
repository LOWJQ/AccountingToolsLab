"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateBreakEven } from "@/lib/calculators/break-even";
import { RotateCcw } from "lucide-react";

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
  const { currency, formatCurrency } = useCurrency();
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

  const isReadyToCalculate =
    parseAmount(fixedCosts) === 0 &&
    parseAmount(sellingPricePerUnit) === 0 &&
    parseAmount(variableCostPerUnit) === 0;
  const statusLabel = isReadyToCalculate
    ? "Ready to calculate"
    : calculation.isValid
      ? "Break-even point calculated"
      : calculation.message;
  const statusClass = isReadyToCalculate
    ? "bg-slate-50 text-slate-700 ring-slate-200"
    : calculation.isValid
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : "bg-rose-50 text-rose-700 ring-rose-100";

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div className="grid min-w-0 gap-5 lg:pr-8">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-950">Fixed Costs ({currency})</span>
              <input
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                min="0"
                onChange={(event) => setFixedCosts(event.target.value)}
                placeholder="0.00"
                type="number"
                value={fixedCosts}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-950">
                Selling Price per Unit ({currency})
              </span>
              <input
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                min="0"
                onChange={(event) => setSellingPricePerUnit(event.target.value)}
                placeholder="0.00"
                type="number"
                value={sellingPricePerUnit}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-950">
                Variable Cost per Unit ({currency})
              </span>
              <input
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                min="0"
                onChange={(event) => setVariableCostPerUnit(event.target.value)}
                placeholder="0.00"
                type="number"
                value={variableCostPerUnit}
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

          <div className="min-w-0 border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="grid gap-4">
              {[
                ["Break-even Units", `${formatAmount(calculation.result.breakEvenUnits)} units`],
                [
                  "Minimum Whole Units",
                  `${calculation.result.minimumWholeUnits.toLocaleString("en-US")} units`
                ],
                [
                  "Contribution Margin per Unit",
                  formatCurrency(calculation.result.contributionMarginPerUnit)
                ],
                ["Break-even Sales", formatCurrency(calculation.result.breakEvenSales)]
              ].map(([label, value], index) => (
                <div
                  className={`${index === 0 ? "" : "border-t border-slate-200 pt-4"}`}
                  key={label}
                >
                  <p className="text-sm font-medium text-slate-700">{label}</p>
                  <p className="mt-1 break-words text-2xl font-semibold tracking-tight text-slate-950">
                    {value}
                  </p>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-5">
                <p className="text-sm font-medium text-slate-700">Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </div>

              <p className="text-base leading-7 text-black">
                Break-even Units = Fixed Costs / Contribution Margin per Unit
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
