"use client";

import { useMemo, useState } from "react";
import { ToolFormula, ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolSelectField, ToolWorkspace } from "@/components/tools/ToolWorkspace";
import {
  calculateFinancialRatio,
  ratioDefinitions,
  type FinancialRatioType
} from "@/lib/calculators/financial-ratios";

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

const ratioOptions: FinancialRatioType[] = [
  "current-ratio",
  "debt-to-equity",
  "gross-profit-margin",
  "net-profit-margin",
  "return-on-assets"
];

const ratioDropdownOptions: Array<DropdownOption<FinancialRatioType>> = ratioOptions.map((option) => ({
  label: ratioDefinitions[option].name,
  value: option
}));

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
    <ToolWorkspace title="Choose a ratio" inputs={<>
      <ToolSelectField label="Ratio to calculate" onChange={changeRatio} options={ratioDropdownOptions} value={ratioType} />
      {definition.fields.map(field => <ToolNumberField key={field.key} error={field.key === definition.denominatorKey && values[field.key]?.trim() && Number(values[field.key]) === 0 ? `${field.label} must not be zero.` : undefined} label={field.label} name={field.key} value={values[field.key] ?? ""} onChange={e => updateValue(field.key, e.target.value)} placeholder="0.00" />)}
      <p className="text-sm leading-6 text-slate-600">Use amounts from the same reporting period and currency.</p>
      <ToolReset onClick={resetCalculator} />
    </>}>
      <ToolPrimaryResult label={definition.name} value={calculation.result?.displayValue ?? "—"} />
      <ToolNote>{calculation.result?.explanation ?? calculation.message}</ToolNote>
      {calculation.result?.warnings.map(warning => <ToolNote key={warning} warning>{warning}</ToolNote>)}
      <ToolFormula>{definition.formula}</ToolFormula>
    </ToolWorkspace>
  );
}
