export type FinancialRatioType =
  | "current-ratio"
  | "debt-to-equity"
  | "gross-profit-margin"
  | "net-profit-margin"
  | "return-on-assets";

export type FinancialRatioInput = {
  ratioType: FinancialRatioType;
  values: Record<string, number | null | undefined>;
};

export type FinancialRatioResult = {
  ratioType: FinancialRatioType;
  name: string;
  value: number;
  displayValue: string;
  formula: string;
  explanation: string;
  format: "ratio" | "percentage";
  warnings: string[];
};

export type RatioField = {
  key: string;
  label: string;
};

export type RatioDefinition = {
  name: string;
  formula: string;
  fields: RatioField[];
  format: "ratio" | "percentage";
  denominatorKey: string;
  calculate: (values: Record<string, number>) => number;
  explain: (displayValue: string) => string;
};

export const ratioDefinitions: Record<FinancialRatioType, RatioDefinition> = {
  "current-ratio": {
    name: "Current Ratio",
    formula: "Current Assets / Current Liabilities",
    fields: [
      { key: "currentAssets", label: "Current Assets" },
      { key: "currentLiabilities", label: "Current Liabilities" }
    ],
    format: "ratio",
    denominatorKey: "currentLiabilities",
    calculate: (values) => values.currentAssets / values.currentLiabilities,
    explain: (displayValue) =>
      `Your current ratio is ${displayValue}. This means the business has ${displayValue.replace(
        " : 1",
        ""
      )} of current assets for every 1.00 of current liabilities.`
  },
  "debt-to-equity": {
    name: "Debt-to-Equity Ratio",
    formula: "Total Liabilities / Total Equity",
    fields: [
      { key: "totalLiabilities", label: "Total Liabilities" },
      { key: "totalEquity", label: "Total Equity" }
    ],
    format: "ratio",
    denominatorKey: "totalEquity",
    calculate: (values) => values.totalLiabilities / values.totalEquity,
    explain: (displayValue) =>
      `Your debt-to-equity ratio is ${displayValue}. This compares liabilities with the owner's or shareholders' equity.`
  },
  "gross-profit-margin": {
    name: "Gross Profit Margin",
    formula: "(Gross Profit / Revenue) x 100",
    fields: [
      { key: "grossProfit", label: "Gross Profit" },
      { key: "revenue", label: "Revenue" }
    ],
    format: "percentage",
    denominatorKey: "revenue",
    calculate: (values) => (values.grossProfit / values.revenue) * 100,
    explain: (displayValue) =>
      `Your gross profit margin is ${displayValue}. This shows how much revenue remains after direct costs before other expenses.`
  },
  "net-profit-margin": {
    name: "Net Profit Margin",
    formula: "(Net Income / Revenue) x 100",
    fields: [
      { key: "netIncome", label: "Net Income" },
      { key: "revenue", label: "Revenue" }
    ],
    format: "percentage",
    denominatorKey: "revenue",
    calculate: (values) => (values.netIncome / values.revenue) * 100,
    explain: (displayValue) =>
      `Your net profit margin is ${displayValue}. This shows how much revenue remains as profit after expenses.`
  },
  "return-on-assets": {
    name: "Return on Assets",
    formula: "(Net Income / Total Assets) x 100",
    fields: [
      { key: "netIncome", label: "Net Income" },
      { key: "totalAssets", label: "Total Assets" }
    ],
    format: "percentage",
    denominatorKey: "totalAssets",
    calculate: (values) => (values.netIncome / values.totalAssets) * 100,
    explain: (displayValue) =>
      `Your return on assets is ${displayValue}. This shows how efficiently assets generate profit.`
  }
};

function assertValidNumber(value: number | null | undefined, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function roundAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatRatioResult(value: number, format: "ratio" | "percentage"): string {
  const rounded = roundAmount(value);

  if (format === "percentage") {
    return `${rounded.toFixed(2)}%`;
  }

  return `${rounded.toFixed(2)} : 1`;
}

export function calculateFinancialRatio(input: FinancialRatioInput): FinancialRatioResult {
  const definition = ratioDefinitions[input.ratioType];

  if (!definition) {
    throw new Error("Choose a financial ratio.");
  }

  const values = definition.fields.reduce<Record<string, number>>((accumulator, field) => {
    accumulator[field.key] = assertValidNumber(input.values[field.key], field.label);
    return accumulator;
  }, {});

  if (values[definition.denominatorKey] === 0) {
    throw new Error(`${definition.fields.find((field) => field.key === definition.denominatorKey)?.label} cannot be zero.`);
  }

  const value = roundAmount(definition.calculate(values));
  const displayValue = formatRatioResult(value, definition.format);
  const warnings = getRatioWarnings(definition, values);

  return {
    ratioType: input.ratioType,
    name: definition.name,
    value,
    displayValue,
    formula: definition.formula,
    explanation: definition.explain(displayValue),
    format: definition.format,
    warnings
  };
}

export function calculateFinancialRatios(input: FinancialRatioInput): FinancialRatioResult {
  return calculateFinancialRatio(input);
}

function getRatioWarnings(
  definition: RatioDefinition,
  values: Record<string, number>
): string[] {
  const denominator = values[definition.denominatorKey];
  const denominatorLabel =
    definition.fields.find((field) => field.key === definition.denominatorKey)?.label ??
    "Denominator";

  if (denominator < 0) {
    return [
      `${denominatorLabel} is negative, so this ratio can be unusual and should be interpreted with extra context.`
    ];
  }

  return [];
}
