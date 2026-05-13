export type SstCalculationMode = "add" | "remove";

export type SstCategoryGroup = "service" | "goods" | "manual";

export type SstRateType = "percentage" | "fixed" | "manual";

export type SstMalaysiaCategory = {
  id: string;
  label: string;
  group: SstCategoryGroup;
  rateType: SstRateType;
  suggestedRatePercent?: number;
  fixedAmount?: number;
  description: string;
  warning?: string;
};

export const SST_MALAYSIA_CATEGORIES = [
  {
    id: "service_general_taxable",
    label: "General taxable services",
    group: "service",
    rateType: "percentage",
    suggestedRatePercent: 8,
    description: "Common suggested service tax rate for general taxable services.",
    warning: "Confirm the taxable service category with current RMCD/MySST guidance."
  },
  {
    id: "service_food_beverage",
    label: "Food and beverage services",
    group: "service",
    rateType: "percentage",
    suggestedRatePercent: 6,
    description: "Common suggested service tax rate for food and beverage services.",
    warning: "Confirm the treatment before relying on the result for filing or invoicing."
  },
  {
    id: "service_logistics",
    label: "Logistics services",
    group: "service",
    rateType: "percentage",
    suggestedRatePercent: 6,
    description: "Common suggested service tax rate for logistics services.",
    warning: "Logistics treatment can depend on the service scope and current rules."
  },
  {
    id: "service_telecommunications",
    label: "Telecommunications services",
    group: "service",
    rateType: "percentage",
    suggestedRatePercent: 6,
    description: "Common suggested service tax rate for telecommunications services.",
    warning: "Confirm the treatment with current official guidance."
  },
  {
    id: "service_parking",
    label: "Parking services",
    group: "service",
    rateType: "percentage",
    suggestedRatePercent: 6,
    description: "Common suggested service tax rate for parking services.",
    warning: "Confirm the treatment with current official guidance."
  },
  {
    id: "service_credit_charge_card",
    label: "Credit or charge card services",
    group: "service",
    rateType: "fixed",
    fixedAmount: 25,
    description: "Special fixed RM25 treatment, not a normal percentage rate.",
    warning:
      "Credit or charge card SST has special handling. This helper treats RM25 as a fixed amount for estimation only."
  },
  {
    id: "goods_exempt_or_zero",
    label: "Goods exempt or zero-rated",
    group: "goods",
    rateType: "percentage",
    suggestedRatePercent: 0,
    description: "Use when goods are treated as exempt or 0% for estimation.",
    warning: "This tool does not legally classify whether goods are exempt or taxable."
  },
  {
    id: "goods_sales_tax_5",
    label: "Goods with 5% sales tax",
    group: "goods",
    rateType: "percentage",
    suggestedRatePercent: 5,
    description: "Common suggested sales tax rate for some taxable goods.",
    warning: "Goods treatment depends on official classification and orders."
  },
  {
    id: "goods_sales_tax_10",
    label: "Goods with 10% sales tax",
    group: "goods",
    rateType: "percentage",
    suggestedRatePercent: 10,
    description: "Common suggested sales tax rate for some taxable goods.",
    warning: "Goods treatment depends on official classification and orders."
  },
  {
    id: "goods_specific_or_unsure",
    label: "Goods with specific rate or unsure treatment",
    group: "goods",
    rateType: "manual",
    description: "Use a manual rate when goods may have a specific rate or uncertain treatment.",
    warning:
      "This category needs manual handling. Check official classification/orders before choosing a rate."
  },
  {
    id: "custom",
    label: "Custom manual percentage",
    group: "manual",
    rateType: "manual",
    description: "Manually enter an SST percentage rate.",
    warning: "Manual rates are estimates and should be checked against current official guidance."
  }
] as const satisfies readonly SstMalaysiaCategory[];

export type SstCategoryId = (typeof SST_MALAYSIA_CATEGORIES)[number]["id"];

export type PercentageSstCategory = SstMalaysiaCategory & {
  rateType: "percentage";
  suggestedRatePercent: number;
};

export type FixedSstCategory = SstMalaysiaCategory & {
  rateType: "fixed";
  fixedAmount: number;
};

export type SstMalaysiaInput = {
  mode: SstCalculationMode;
  amount: number | null | undefined;
  sstRate: number | null | undefined;
};

export type SstMalaysiaResult = {
  mode: SstCalculationMode;
  amountBeforeSst: number;
  sstRate: number;
  sstAmount: number;
  totalIncludingSst: number;
  explanation: string;
};

export type SstInvoiceLineItemInput = {
  id?: string;
  description?: string;
  quantity: number | null | undefined;
  unitPrice: number | null | undefined;
  categoryId: SstCategoryId | string;
  manualRatePercent?: number | null | undefined;
};

export type CalculatedSstInvoiceLineItem = {
  id?: string;
  description: string;
  categoryId: string;
  categoryLabel: string;
  quantity: number;
  unitPrice: number;
  rateType: "percentage" | "fixed";
  sstRatePercent: number | null;
  fixedAmount: number | null;
  amountBeforeSst: number;
  sstAmount: number;
  totalIncludingSst: number;
  warnings: string[];
  explanation: string;
};

export type SstInvoiceGroupTotal = {
  key: string;
  categoryId: string;
  categoryLabel: string;
  rateType: "percentage" | "fixed";
  sstRatePercent: number | null;
  fixedAmount: number | null;
  amountBeforeSst: number;
  sstAmount: number;
  totalIncludingSst: number;
};

export type SstInvoiceMalaysiaInput = {
  mode: SstCalculationMode;
  items: SstInvoiceLineItemInput[];
};

export type SstInvoiceMalaysiaResult = {
  mode: SstCalculationMode;
  lineItems: CalculatedSstInvoiceLineItem[];
  subtotalBeforeSst: number;
  totalSst: number;
  grandTotalIncludingSst: number;
  groupedSst: SstInvoiceGroupTotal[];
  warnings: string[];
  explanation: string;
};

function assertValidNumber(value: number | null | undefined, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

export function roundSstMoneyAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertValidPercentageRate(value: number | null | undefined, label: string): number {
  const rate = assertValidNumber(value, label);

  if (rate < 0) {
    throw new Error(`${label} must be zero or greater.`);
  }

  if (rate > 100) {
    throw new Error(`${label} must be 100% or less.`);
  }

  return rate;
}

export function getSstCategoryById(id: string): SstMalaysiaCategory | undefined {
  return SST_MALAYSIA_CATEGORIES.find((category) => category.id === id);
}

export function isPercentageSstCategory(
  category: SstMalaysiaCategory | undefined
): category is PercentageSstCategory {
  return category?.rateType === "percentage" && typeof category.suggestedRatePercent === "number";
}

export function isFixedSstCategory(
  category: SstMalaysiaCategory | undefined
): category is FixedSstCategory {
  return category?.rateType === "fixed" && typeof category.fixedAmount === "number";
}

export function getSuggestedSstRateForCategory(id: string): number | null {
  const category = getSstCategoryById(id);
  return isPercentageSstCategory(category) ? category.suggestedRatePercent : null;
}

export function calculateSstMalaysia(input: SstMalaysiaInput): SstMalaysiaResult {
  const amount = assertValidNumber(input.amount, "Amount");
  const sstRate = assertValidNumber(input.sstRate, "SST rate");

  if (amount < 0) {
    throw new Error("Amount must be zero or greater.");
  }

  if (sstRate < 0) {
    throw new Error("SST rate must be zero or greater.");
  }

  if (sstRate > 100) {
    throw new Error("SST rate must be 100% or less.");
  }

  const rateDecimal = sstRate / 100;

  if (input.mode === "add") {
    const amountBeforeSst = roundSstMoneyAmount(amount);
    const sstAmount = roundSstMoneyAmount(amountBeforeSst * rateDecimal);
    const totalIncludingSst = roundSstMoneyAmount(amountBeforeSst + sstAmount);

    return {
      mode: input.mode,
      amountBeforeSst,
      sstRate,
      sstAmount,
      totalIncludingSst,
      explanation: `Adding ${sstRate}% SST gives an estimated total including SST of ${totalIncludingSst.toFixed(
        2
      )}.`
    };
  }

  if (input.mode === "remove") {
    const totalIncludingSst = roundSstMoneyAmount(amount);
    const amountBeforeSst = roundSstMoneyAmount(totalIncludingSst / (1 + rateDecimal));
    const sstAmount = roundSstMoneyAmount(totalIncludingSst - amountBeforeSst);

    return {
      mode: input.mode,
      amountBeforeSst,
      sstRate,
      sstAmount,
      totalIncludingSst,
      explanation: `Removing ${sstRate}% SST gives an estimated amount before SST of ${amountBeforeSst.toFixed(
        2
      )}.`
    };
  }

  throw new Error("Choose whether to add or remove SST.");
}

function resolveLineTreatment(item: SstInvoiceLineItemInput): {
  category: SstMalaysiaCategory;
  fixedAmount: number | null;
  rateType: "percentage" | "fixed";
  sstRatePercent: number | null;
  warnings: string[];
} {
  const category = getSstCategoryById(item.categoryId);

  if (!category) {
    throw new Error("Choose a valid SST category.");
  }

  const warnings = category.warning ? [category.warning] : [];
  const hasManualRate = item.manualRatePercent !== null && item.manualRatePercent !== undefined;

  if (hasManualRate) {
    const manualRate = assertValidPercentageRate(item.manualRatePercent, "Manual SST rate");

    return {
      category,
      fixedAmount: null,
      rateType: "percentage",
      sstRatePercent: manualRate,
      warnings: [
        ...warnings,
        `Manual SST rate of ${manualRate}% used for ${category.label}.`
      ]
    };
  }

  if (isPercentageSstCategory(category)) {
    return {
      category,
      fixedAmount: null,
      rateType: "percentage",
      sstRatePercent: category.suggestedRatePercent,
      warnings
    };
  }

  if (isFixedSstCategory(category)) {
    return {
      category,
      fixedAmount: category.fixedAmount,
      rateType: "fixed",
      sstRatePercent: null,
      warnings
    };
  }

  throw new Error(`${category.label} requires a valid manual SST rate.`);
}

function calculateLineAmounts({
  fixedAmount,
  mode,
  quantity,
  rateType,
  sstRatePercent,
  unitPrice
}: {
  fixedAmount: number | null;
  mode: SstCalculationMode;
  quantity: number;
  rateType: "percentage" | "fixed";
  sstRatePercent: number | null;
  unitPrice: number;
}): Pick<
  CalculatedSstInvoiceLineItem,
  "amountBeforeSst" | "sstAmount" | "totalIncludingSst"
> {
  const lineAmount = roundSstMoneyAmount(quantity * unitPrice);

  if (rateType === "fixed") {
    const fixedSstAmount = roundSstMoneyAmount((fixedAmount ?? 0) * quantity);

    if (mode === "add") {
      return {
        amountBeforeSst: lineAmount,
        sstAmount: fixedSstAmount,
        totalIncludingSst: roundSstMoneyAmount(lineAmount + fixedSstAmount)
      };
    }

    if (fixedSstAmount > lineAmount) {
      throw new Error("Fixed SST amount cannot be greater than the SST-inclusive line amount.");
    }

    return {
      amountBeforeSst: roundSstMoneyAmount(lineAmount - fixedSstAmount),
      sstAmount: fixedSstAmount,
      totalIncludingSst: lineAmount
    };
  }

  const rateDecimal = (sstRatePercent ?? 0) / 100;

  if (mode === "add") {
    const amountBeforeSst = lineAmount;
    const sstAmount = roundSstMoneyAmount(amountBeforeSst * rateDecimal);

    return {
      amountBeforeSst,
      sstAmount,
      totalIncludingSst: roundSstMoneyAmount(amountBeforeSst + sstAmount)
    };
  }

  const totalIncludingSst = lineAmount;
  const amountBeforeSst = roundSstMoneyAmount(totalIncludingSst / (1 + rateDecimal));

  return {
    amountBeforeSst,
    sstAmount: roundSstMoneyAmount(totalIncludingSst - amountBeforeSst),
    totalIncludingSst
  };
}

function getLineExplanation(line: CalculatedSstInvoiceLineItem): string {
  if (line.rateType === "fixed") {
    return `${line.categoryLabel} uses a fixed RM${line.fixedAmount?.toFixed(
      2
    )} SST treatment for this estimate.`;
  }

  return `${line.categoryLabel} uses ${line.sstRatePercent}% SST for this estimate.`;
}

function groupLineItems(lineItems: CalculatedSstInvoiceLineItem[]): SstInvoiceGroupTotal[] {
  const groups = new Map<string, SstInvoiceGroupTotal>();

  lineItems.forEach((line) => {
    const key =
      line.rateType === "fixed"
        ? `${line.categoryId}:fixed:${line.fixedAmount}`
        : `${line.categoryId}:percentage:${line.sstRatePercent}`;
    const current = groups.get(key);

    if (!current) {
      groups.set(key, {
        key,
        categoryId: line.categoryId,
        categoryLabel: line.categoryLabel,
        rateType: line.rateType,
        sstRatePercent: line.sstRatePercent,
        fixedAmount: line.fixedAmount,
        amountBeforeSst: line.amountBeforeSst,
        sstAmount: line.sstAmount,
        totalIncludingSst: line.totalIncludingSst
      });
      return;
    }

    current.amountBeforeSst = roundSstMoneyAmount(
      current.amountBeforeSst + line.amountBeforeSst
    );
    current.sstAmount = roundSstMoneyAmount(current.sstAmount + line.sstAmount);
    current.totalIncludingSst = roundSstMoneyAmount(
      current.totalIncludingSst + line.totalIncludingSst
    );
  });

  return [...groups.values()];
}

export function calculateSstInvoiceMalaysia(
  input: SstInvoiceMalaysiaInput
): SstInvoiceMalaysiaResult {
  if (input.mode !== "add" && input.mode !== "remove") {
    throw new Error("Choose whether to add or remove SST.");
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("At least one SST line item is required.");
  }

  const lineItems = input.items.map((item, index) => {
    const lineNumber = index + 1;
    const quantity = assertValidNumber(item.quantity, `Line ${lineNumber} quantity`);
    const unitPrice = assertValidNumber(item.unitPrice, `Line ${lineNumber} unit price`);

    if (quantity <= 0) {
      throw new Error(`Line ${lineNumber} quantity must be greater than zero.`);
    }

    if (unitPrice < 0) {
      throw new Error(`Line ${lineNumber} unit price must be zero or greater.`);
    }

    const treatment = resolveLineTreatment(item);
    const amounts = calculateLineAmounts({
      fixedAmount: treatment.fixedAmount,
      mode: input.mode,
      quantity,
      rateType: treatment.rateType,
      sstRatePercent: treatment.sstRatePercent,
      unitPrice
    });
    const line: CalculatedSstInvoiceLineItem = {
      id: item.id,
      description: item.description?.trim() || `Line ${lineNumber}`,
      categoryId: treatment.category.id,
      categoryLabel: treatment.category.label,
      quantity,
      unitPrice,
      rateType: treatment.rateType,
      sstRatePercent: treatment.sstRatePercent,
      fixedAmount: treatment.fixedAmount,
      ...amounts,
      warnings: treatment.warnings,
      explanation: ""
    };

    return {
      ...line,
      explanation: getLineExplanation(line)
    };
  });

  // Round per line, then sum rounded line amounts so invoice rows and totals reconcile.
  const subtotalBeforeSst = roundSstMoneyAmount(
    lineItems.reduce((sum, line) => sum + line.amountBeforeSst, 0)
  );
  const totalSst = roundSstMoneyAmount(
    lineItems.reduce((sum, line) => sum + line.sstAmount, 0)
  );
  const grandTotalIncludingSst = roundSstMoneyAmount(
    lineItems.reduce((sum, line) => sum + line.totalIncludingSst, 0)
  );
  const warnings = [...new Set(lineItems.flatMap((line) => line.warnings))];

  return {
    mode: input.mode,
    lineItems,
    subtotalBeforeSst,
    totalSst,
    grandTotalIncludingSst,
    groupedSst: groupLineItems(lineItems),
    warnings,
    explanation:
      input.mode === "add"
        ? "SST is estimated from line amounts before SST, then added to calculate the invoice total."
        : "SST is estimated from SST-inclusive line amounts, then removed to estimate amounts before SST."
  };
}
