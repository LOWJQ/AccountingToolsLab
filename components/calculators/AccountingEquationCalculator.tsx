"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import {
  calculateAccountingEquation,
  type AccountingEquationSolveFor
} from "@/lib/calculators/accounting-equation";

type FieldName = "assets" | "liabilities" | "equity";

const solveOptions: Array<{
  label: string;
  value: AccountingEquationSolveFor;
}> = [
  { label: "Assets", value: "assets" },
  { label: "Liabilities", value: "liabilities" },
  { label: "Equity", value: "equity" }
];

const fieldLabels: Record<FieldName, string> = {
  assets: "Assets",
  liabilities: "Liabilities",
  equity: "Equity"
};

const requiredFields: Record<AccountingEquationSolveFor, FieldName[]> = {
  assets: ["liabilities", "equity"],
  liabilities: ["assets", "equity"],
  equity: ["assets", "liabilities"]
};

const fieldHelp: Record<FieldName, string> = {
  assets: "Resources owned by the business.",
  liabilities: "Amounts the business owes.",
  equity: "The owner's claim after liabilities."
};

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export function AccountingEquationCalculator() {
  const [solveFor, setSolveFor] = useState<AccountingEquationSolveFor>("assets");
  const { formatCurrency } = useCurrency();
  const [values, setValues] = useState<Record<FieldName, string>>({
    assets: "",
    liabilities: "",
    equity: ""
  });

  const activeFields = requiredFields[solveFor];

  const calculation = useMemo(() => {
    const missingField = activeFields.find((field) => values[field].trim() === "");

    if (missingField) {
      return {
        result: null,
        message: `Enter ${fieldLabels[missingField].toLowerCase()} to calculate ${fieldLabels[
          solveFor
        ].toLowerCase()}.`
      };
    }

    const parsedValues = {
      assets: parseAmount(values.assets),
      liabilities: parseAmount(values.liabilities),
      equity: parseAmount(values.equity)
    };

    const invalidField = activeFields.find((field) => parsedValues[field] === null);

    if (invalidField) {
      return {
        result: null,
        message: `${fieldLabels[invalidField]} must be a valid number.`
      };
    }

    try {
      return {
        result: calculateAccountingEquation({
          solveFor,
          assets: parsedValues.assets,
          liabilities: parsedValues.liabilities,
          equity: parsedValues.equity
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [activeFields, solveFor, values]);

  function updateValue(field: FieldName, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));
  }

  function resetCalculator() {
    setValues({
      assets: "",
      liabilities: "",
      equity: ""
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Accounting Equation Calculator
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Solve for assets, liabilities, or equity using the basic accounting equation:
            Assets = Liabilities + Equity.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-stone-900">Choose what to calculate</p>
            <div className="mt-3 grid gap-3">
              {solveOptions.map((option) => (
                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    solveFor === option.value
                      ? "border-slate-300 bg-slate-50 text-slate-800"
                      : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                  }`}
                  key={option.value}
                >
                  {option.label}
                  <input
                    checked={solveFor === option.value}
                    className="h-4 w-4 accent-slate-700"
                    name="solve-for"
                    onChange={() => setSolveFor(option.value)}
                    type="radio"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {(["assets", "liabilities", "equity"] as FieldName[]).map((field) => {
              const isCalculatedField = field === solveFor;

              return (
                <label className="grid gap-2" key={field}>
                  <span className="flex items-center justify-between gap-3 text-sm font-semibold text-stone-800">
                    {fieldLabels[field]}
                    {isCalculatedField ? (
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500 ring-1 ring-stone-200">
                        Calculated
                      </span>
                    ) : null}
                  </span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    disabled={isCalculatedField}
                    inputMode="decimal"
                    onChange={(event) => updateValue(field, event.target.value)}
                    placeholder={isCalculatedField ? "Result appears below" : "0.00"}
                    type="number"
                    value={isCalculatedField ? "" : values[field]}
                  />
                  <span className="text-xs leading-5 text-stone-500">{fieldHelp[field]}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Calculated {fieldLabels[solveFor]}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              {calculation.result ? formatCurrency(calculation.result.value) : "-"}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {calculation.result ? calculation.result.formula : calculation.message}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5">
            <div>
              <p className="text-sm font-semibold text-stone-950">Result check</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Enter the two known values. The calculator will solve the missing part of the
                equation without showing confusing NaN output.
              </p>
            </div>
            <button
              className="inline-flex h-10 w-fit items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              onClick={resetCalculator}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Formula</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Assets = Liabilities + Equity
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Assets are resources owned by a business. Liabilities are amounts the business owes.
            Equity is the owner's remaining claim after liabilities are subtracted from assets.
          </p>
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm font-semibold text-stone-950">Worked example</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              If liabilities are {formatCurrency(400)} and equity is {formatCurrency(600)},
              assets are {formatCurrency(1000)} because {formatCurrency(400)} +{" "}
              {formatCurrency(600)} = {formatCurrency(1000)}.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Watch for these issues
          </h2>
          <div className="mt-5 divide-y divide-stone-100">
            {[
              "Mixing up liabilities and expenses",
              "Forgetting that equity is the owner's claim after liabilities",
              "Entering only one side of the equation",
              "Assuming a positive result always means the numbers are correct"
            ].map((mistake) => (
              <p className="py-3 text-sm leading-6 text-stone-600" key={mistake}>
                {mistake}
              </p>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Keep learning with connected tools and guides
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use the Trial Balance Calculator next, or explore beginner-friendly accounting
              guides.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/trial-balance-calculator">
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
