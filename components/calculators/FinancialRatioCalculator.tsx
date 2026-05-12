"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import {
  calculateFinancialRatio,
  ratioDefinitions,
  type FinancialRatioType
} from "@/lib/calculators/financial-ratios";

const ratioOptions: FinancialRatioType[] = [
  "current-ratio",
  "debt-to-equity",
  "gross-profit-margin",
  "net-profit-margin",
  "return-on-assets"
];

const examples = [
  {
    title: "Current ratio example",
    text: "If current assets are 10,000 and current liabilities are 5,000, the current ratio is 2.00 : 1."
  },
  {
    title: "Net profit margin example",
    text: "If net income is 1,250 and revenue is 10,000, the net profit margin is 12.50%."
  }
];

const mistakes = [
  "Dividing by zero or missing liabilities/assets",
  "Mixing up revenue and profit",
  "Comparing ratios across very different industries",
  "Thinking one ratio tells the whole story",
  "Using old or inaccurate financial statement numbers"
];

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function FinancialRatioCalculator() {
  const [ratioType, setRatioType] = useState<FinancialRatioType>("current-ratio");
  const [values, setValues] = useState<Record<string, string>>({});
  const definition = ratioDefinitions[ratioType];

  const calculation = useMemo(() => {
    const missingField = definition.fields.find((field) => !values[field.key]?.trim());

    if (missingField) {
      return {
        result: null,
        message: `Enter ${missingField.label.toLowerCase()} to calculate ${definition.name.toLowerCase()}.`
      };
    }

    const parsedValues = definition.fields.reduce<Record<string, number | null>>(
      (accumulator, field) => {
        accumulator[field.key] = parseAmount(values[field.key] ?? "");
        return accumulator;
      },
      {}
    );

    const invalidField = definition.fields.find((field) => parsedValues[field.key] === null);

    if (invalidField) {
      return {
        result: null,
        message: `${invalidField.label} must be a valid number.`
      };
    }

    try {
      return {
        result: calculateFinancialRatio({
          ratioType,
          values: parsedValues
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [definition, ratioType, values]);

  function updateValue(key: string, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));
  }

  function resetCalculator() {
    setValues({});
  }

  function changeRatio(nextRatio: FinancialRatioType) {
    setRatioType(nextRatio);
    setValues({});
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Ratio to calculate</span>
              <select
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => changeRatio(event.target.value as FinancialRatioType)}
                value={ratioType}
              >
                {ratioOptions.map((option) => (
                  <option key={option} value={option}>
                    {ratioDefinitions[option].name}
                  </option>
                ))}
              </select>
            </label>

            {definition.fields.map((field) => (
              <label className="grid gap-2" key={field.key}>
                <span className="text-sm font-semibold text-stone-800">{field.label}</span>
                <input
                  className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                  inputMode="decimal"
                  onChange={(event) => updateValue(field.key, event.target.value)}
                  placeholder="0.00"
                  type="number"
                  value={values[field.key] ?? ""}
                />
              </label>
            ))}

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
              {definition.name}
            </h2>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              {calculation.result ? calculation.result.displayValue : "-"}
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {calculation.result ? calculation.result.explanation : calculation.message}
            </p>
            {calculation.result?.warnings.length ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                {calculation.result.warnings[0]}
              </div>
            ) : null}
            <p className="mt-5 rounded-xl border border-stone-200 bg-white p-3 text-sm font-semibold text-stone-700">
              {definition.formula}
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What financial ratios show
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Financial ratios compare numbers from financial statements. They can help you
            review liquidity, debt, profitability, and how efficiently assets are used.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
            Ratios are useful, but they need context. Compare them with prior periods,
            similar businesses, and the reason you are calculating them.
          </p>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked examples</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple examples
          </h2>
          <div className="mt-5 divide-y divide-stone-100">
            {examples.map((example) => (
              <article className="py-4 first:pt-0 last:pb-0" key={example.title}>
                <h3 className="text-base font-semibold text-stone-950">{example.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{example.text}</p>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Formulas</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Ratio formulas included
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-2">Ratio</th>
                <th className="px-4 py-2">Formula</th>
              </tr>
            </thead>
            <tbody>
              {ratioOptions.map((option) => (
                <tr className="bg-stone-50" key={option}>
                  <td className="rounded-l-xl border-y border-l border-stone-200 px-4 py-3 font-semibold text-stone-900">
                    {ratioDefinitions[option].name}
                  </td>
                  <td className="rounded-r-xl border-y border-r border-stone-200 px-4 py-3 text-stone-700">
                    {ratioDefinitions[option].formula}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
              Continue checking accounting basics
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Connect ratio analysis with equation, debit/credit, and trial balance tools.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/accounting-equation-calculator">
              Accounting Equation Calculator
            </ButtonLink>
            <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
              Trial Balance Calculator
            </ButtonLink>
            <ButtonLink href="/tools/debit-credit-checker" variant="secondary">
              Debit/Credit Checker
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
