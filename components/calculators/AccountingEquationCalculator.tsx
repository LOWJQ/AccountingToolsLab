"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
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

function parseAmount(value: string): number {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function AccountingEquationCalculator() {
  const [solveFor, setSolveFor] = useState<AccountingEquationSolveFor>("assets");
  const { formatCurrency } = useCurrency();
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
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-stone-900">Choose what to calculate</p>
            <div className="inline-grid grid-cols-3 rounded-xl border border-stone-200 bg-stone-50 p-1">
              {solveOptions.map((option) => (
                <button
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    solveFor === option.value
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-stone-200"
                      : "text-stone-600 hover:bg-white/80 hover:text-stone-900"
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

          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div className="grid gap-4">
              {activeFields.map((field) => (
                <label className="grid gap-2" key={field}>
                  <span className="text-sm font-semibold text-stone-800">{fieldLabels[field]}</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    inputMode="decimal"
                    onChange={(event) => updateValue(field, event.target.value)}
                    placeholder="0.00"
                    type="number"
                    value={values[field]}
                  />
                  <span className="text-xs leading-5 text-stone-500">{fieldHelp[field]}</span>
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

            <div className="grid gap-5 rounded-xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>

              <div>
                <p className="text-sm font-semibold text-stone-800">
                  Calculated {fieldLabels[solveFor]}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                  {formatCurrency(calculation.result.value)}
                </p>
              </div>

              <p className="text-sm leading-6 text-stone-700">
                <span className="font-semibold text-stone-800">Formula:</span>{" "}
                {calculation.result.formula}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
