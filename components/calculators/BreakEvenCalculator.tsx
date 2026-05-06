"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { calculateBreakEven } from "@/lib/calculators/break-even";

const mistakes = [
  "Mixing up fixed costs and variable costs",
  "Forgetting that selling price must be higher than variable cost",
  "Using total variable costs instead of variable cost per unit",
  "Assuming break-even means profit",
  "Ignoring changes in costs or selling price"
];

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
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
  const [fixedCosts, setFixedCosts] = useState("");
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("");

  const calculation = useMemo(() => {
    if (!fixedCosts.trim()) {
      return { result: null, message: "Enter fixed costs to calculate break-even point." };
    }

    if (!sellingPricePerUnit.trim()) {
      return { result: null, message: "Enter the selling price per unit." };
    }

    if (!variableCostPerUnit.trim()) {
      return { result: null, message: "Enter the variable cost per unit." };
    }

    try {
      return {
        result: calculateBreakEven({
          fixedCosts: parseAmount(fixedCosts),
          sellingPricePerUnit: parseAmount(sellingPricePerUnit),
          variableCostPerUnit: parseAmount(variableCostPerUnit)
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [fixedCosts, sellingPricePerUnit, variableCostPerUnit]);

  function resetCalculator() {
    setFixedCosts("");
    setSellingPricePerUnit("");
    setVariableCostPerUnit("");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Break-even Calculator
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Calculate how many units or how much sales revenue a business needs to cover its
            fixed and variable costs.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
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

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
              Break-even point
            </h2>

            {calculation.result ? (
              <div className="mt-5 grid gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Break-even units
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    {formatAmount(calculation.result.breakEvenUnits)}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      Contribution margin per unit
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatAmount(calculation.result.contributionMarginPerUnit)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      Break-even sales
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatAmount(calculation.result.breakEvenSales)}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-stone-600">
                  {calculation.result.explanation}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-stone-600">{calculation.message}</p>
            )}

            <p className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm font-semibold text-stone-700">
              Break-even Units = Fixed Costs / Contribution Margin per Unit
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What break-even point means
          </h2>
          <div className="mt-4 grid gap-3">
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Contribution Margin per Unit = Selling Price per Unit - Variable Cost per Unit
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Break-even Units = Fixed Costs / Contribution Margin per Unit
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Break-even Sales = Break-even Units x Selling Price per Unit
            </p>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              Break-even point is where sales cover costs, but the business has not made a
              profit yet.
            </p>
            <p>
              Fixed costs stay the same over the activity range, while variable costs change
              with each unit sold. Contribution margin is the amount each unit contributes
              toward fixed costs and then profit.
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
              ["Fixed costs", "10,000"],
              ["Selling price per unit", "50"],
              ["Variable cost per unit", "30"],
              ["Contribution margin", "20"],
              ["Break-even units", "500"],
              ["Break-even sales", "25,000"]
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
            The contribution margin is 20 per unit. Dividing 10,000 of fixed costs by 20
            gives 500 break-even units, or 25,000 of break-even sales.
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
              Connect break-even checks with accounting basics
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Review related numbers with ratio, equation, and trial balance tools.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/financial-ratio-calculator">
              Financial Ratio Calculator
            </ButtonLink>
            <ButtonLink href="/tools/accounting-equation-calculator" variant="secondary">
              Accounting Equation Calculator
            </ButtonLink>
            <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
              Trial Balance Calculator
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
