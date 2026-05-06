"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import {
  calculateSstMalaysia,
  type SstCalculationMode
} from "@/lib/calculators/sst-malaysia";

const sstRateOptions = [
  { label: "0%", value: "0" },
  { label: "5%", value: "5" },
  { label: "6%", value: "6" },
  { label: "8%", value: "8" },
  { label: "10%", value: "10" },
  { label: "Custom rate", value: "custom" }
];

const mistakes = [
  "Using the wrong SST rate for a product or service",
  "Forgetting that some prices may already include SST",
  "Treating this calculator as tax advice",
  "Confusing SST with income tax",
  "Rounding too early"
];

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function formatCurrency(value: number): string {
  return `RM${value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function SstCalculatorMalaysia() {
  const [mode, setMode] = useState<SstCalculationMode>("add");
  const [amount, setAmount] = useState("");
  const [rateOption, setRateOption] = useState("8");
  const [customRate, setCustomRate] = useState("");

  const selectedRate = rateOption === "custom" ? parseAmount(customRate) : Number(rateOption);

  const calculation = useMemo(() => {
    if (!amount.trim()) {
      return { result: null, message: "Enter an amount to estimate SST." };
    }

    if (rateOption === "custom" && !customRate.trim()) {
      return { result: null, message: "Enter a custom SST rate." };
    }

    try {
      return {
        result: calculateSstMalaysia({
          mode,
          amount: parseAmount(amount),
          sstRate: selectedRate
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [amount, customRate, mode, rateOption, selectedRate]);

  function resetCalculator() {
    setMode("add");
    setAmount("");
    setRateOption("8");
    setCustomRate("");
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            SST Calculator Malaysia
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Estimate SST amount, total including SST, or amount before SST using a selected
            SST rate.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Calculation mode</span>
              <select
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => setMode(event.target.value as SstCalculationMode)}
                value={mode}
              >
                <option value="add">Add SST</option>
                <option value="remove">Remove SST</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">
                {mode === "add" ? "Amount before SST" : "Total including SST"}
              </span>
              <input
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                inputMode="decimal"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="100"
                type="number"
                value={amount}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">SST rate</span>
              <select
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => setRateOption(event.target.value)}
                value={rateOption}
              >
                {sstRateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {rateOption === "custom" ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-800">
                  Custom SST rate (%)
                </span>
                <input
                  className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                  inputMode="decimal"
                  onChange={(event) => setCustomRate(event.target.value)}
                  placeholder="8"
                  type="number"
                  value={customRate}
                />
              </label>
            ) : null}

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
              {mode === "add" ? "Add SST estimate" : "Remove SST estimate"}
            </h2>

            {calculation.result ? (
              <div className="mt-5 grid gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    {mode === "add" ? "Total including SST" : "Amount before SST"}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                    {mode === "add"
                      ? formatCurrency(calculation.result.totalIncludingSst)
                      : formatCurrency(calculation.result.amountBeforeSst)}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      SST rate
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {calculation.result.sstRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      SST amount
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatCurrency(calculation.result.sstAmount)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      Amount before SST
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatCurrency(calculation.result.amountBeforeSst)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                      Total including SST
                    </p>
                    <p className="mt-2 text-xl font-semibold text-stone-950">
                      {formatCurrency(calculation.result.totalIncludingSst)}
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
              {mode === "add"
                ? "Total Including SST = Amount Before SST + SST Amount"
                : "Amount Before SST = Total Including SST / (1 + SST Rate)"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-amber-200 bg-amber-50 p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-amber-700">Important note</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Estimation only
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
          This calculator is for estimation and learning only. It does not determine whether a
          product or service is subject to SST, and it does not confirm which SST rate is
          legally correct. SST rates, exemptions, and taxable scope can change. Check official
          RMCD/MySST guidance or ask a qualified tax professional before relying on the result.
        </p>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            How SST estimates work
          </h2>
          <div className="mt-4 grid gap-3">
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              SST Amount = Amount Before SST x SST Rate
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Total Including SST = Amount Before SST + SST Amount
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Amount Before SST = Total Including SST / (1 + SST Rate)
            </p>
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              SST commonly refers to Sales and Service Tax in Malaysia. This tool only helps
              with arithmetic once you choose an amount and rate.
            </p>
            <p>
              Use Add SST when your amount is before SST. Use Remove SST when your amount
              already includes SST and you want to estimate the pre-SST amount.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked examples</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Add and remove SST
          </h2>
          <div className="mt-5 grid gap-5">
            <div>
              <h3 className="text-base font-semibold text-stone-950">Add SST</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Amount before SST RM100 at 8% gives SST amount RM8 and total including SST
                RM108.
              </p>
            </div>
            <div className="border-t border-stone-100 pt-5">
              <h3 className="text-base font-semibold text-stone-950">Remove SST</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Total including SST RM108 at 8% gives amount before SST RM100 and SST amount
                RM8.
              </p>
            </div>
          </div>
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
              Connect SST estimates with business records
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use invoice, cash flow, and ratio tools for related business calculations.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/invoice-generator">Invoice Generator</ButtonLink>
            <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
              Cash Flow Calculator
            </ButtonLink>
            <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
              Financial Ratio Calculator
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
