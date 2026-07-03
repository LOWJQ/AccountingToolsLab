"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import {
  calculateAccountingEquation,
  type AccountingEquationSolveFor
} from "@/lib/calculators/accounting-equation";
import { RotateCcw } from "lucide-react";

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

function parseAmount(value: string): number {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function AccountingEquationCalculator() {
  const [solveFor, setSolveFor] = useState<AccountingEquationSolveFor>("assets");
  const { currency, formatCurrency } = useCurrency();
  const [values, setValues] = useState<Record<FieldName, string>>({
    assets: "0",
    liabilities: "0",
    equity: "0"
  });

  const activeFields = requiredFields[solveFor];

  const calculation = useMemo(() => {
    const parsedValues = {
      assets: parseAmount(values.assets),
      liabilities: parseAmount(values.liabilities),
      equity: parseAmount(values.equity)
    };

    return {
      result: calculateAccountingEquation({
        solveFor,
        assets: parsedValues.assets,
        liabilities: parsedValues.liabilities,
        equity: parsedValues.equity
      })
    };
  }, [solveFor, values]);

  function updateValue(field: FieldName, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));
  }

  function resetCalculator() {
    setValues({
      assets: "0",
      liabilities: "0",
      equity: "0"
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-slate-950">Choose what to calculate</p>
            <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-slate-200 bg-white sm:grid-cols-3">
              {solveOptions.map((option) => (
                <button
                  aria-pressed={solveFor === option.value}
                  className={`h-11 px-4 text-sm font-semibold transition ${
                    solveFor === option.value
                      ? "bg-slate-900 text-white"
                      : "border-t border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 sm:border-l sm:border-t-0"
                  }`}
                  key={option.value}
                  onClick={() => setSolveFor(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div className="grid gap-5 lg:pr-8">
              {activeFields.map((field) => (
                <label className="grid gap-2" key={field}>
                  <span className="text-sm font-medium text-slate-950">
                    {fieldLabels[field]} ({currency})
                  </span>
                  <input
                    className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    inputMode="decimal"
                    onChange={(event) => updateValue(field, event.target.value)}
                    placeholder="0.00"
                    type="number"
                    value={values[field]}
                  />
                  <span className="text-sm leading-6 text-slate-600">{fieldHelp[field]}</span>
                </label>
              ))}

              <button
                className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                onClick={resetCalculator}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Result</p>

              <div>
                <p className="mt-5 text-sm font-medium text-slate-700">
                  Calculated {fieldLabels[solveFor]}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  {formatCurrency(calculation.result.value)}
                </p>
              </div>

              <p className="mt-5 text-base leading-7 text-black">
                <span className="font-semibold text-black">Formula:</span>{" "}
                {calculation.result.formula}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
