"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { formatCurrency as formatCurrencyValue } from "@/lib/currency";
import {
  calculateSstInvoiceMalaysia,
  getSstCategoryById,
  isFixedSstCategory,
  isPercentageSstCategory,
  SST_MALAYSIA_CATEGORIES,
  type SstCalculationMode,
  type SstCategoryId,
  type SstInvoiceMalaysiaResult,
  type SstMalaysiaCategory
} from "@/lib/calculators/sst-malaysia";

type CalculatorView = "quick" | "invoice";

type InvoiceLineForm = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  categoryId: SstCategoryId;
  manualRate: string;
};

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

type DropdownGroup<T extends string> = {
  label?: string;
  options: Array<DropdownOption<T>>;
};

const inputClassName =
  "h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

const smallInputClassName =
  "h-11 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

const mistakes = [
  "Using the wrong SST rate for a product or service",
  "Forgetting that some prices may already include SST",
  "Treating this calculator as tax advice",
  "Confusing SST with income tax",
  "Rounding too early"
];

const groupedCategories = [
  {
    label: "Services",
    categories: SST_MALAYSIA_CATEGORIES.filter((category) => category.group === "service")
  },
  {
    label: "Goods",
    categories: SST_MALAYSIA_CATEGORIES.filter((category) => category.group === "goods")
  },
  {
    label: "Manual / custom",
    categories: SST_MALAYSIA_CATEGORIES.filter((category) => category.group === "manual")
  }
];

const viewOptions: Array<DropdownOption<CalculatorView>> = [
  { label: "Quick SST", value: "quick" },
  { label: "Invoice breakdown", value: "invoice" }
];

const categoryDropdownGroups: Array<DropdownGroup<SstCategoryId>> = groupedCategories.map(
  (group) => ({
    label: group.label,
    options: group.categories.map((category) => ({
      label: category.label,
      value: category.id
    }))
  })
);

function createInvoiceLine(): InvoiceLineForm {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sst-line-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    description: "",
    quantity: "1",
    unitPrice: "",
    categoryId: "service_general_taxable",
    manualRate: ""
  };
}

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function parseManualRate(value: string): number {
  return parseAmount(value) ?? 0;
}

function getCategoryOrFallback(id: string): SstMalaysiaCategory {
  return getSstCategoryById(id) ?? SST_MALAYSIA_CATEGORIES[0];
}

function shouldUseManualRate(category: SstMalaysiaCategory): boolean {
  return category.rateType === "manual";
}

function getCategoryRateLabel(category: SstMalaysiaCategory): string {
  if (category.rateType === "manual") {
    return "Manual rate required";
  }

  if (isPercentageSstCategory(category)) {
    return `Suggested rate: ${category.suggestedRatePercent}%`;
  }

  if (isFixedSstCategory(category)) {
    return `Special fixed amount: RM ${category.fixedAmount.toFixed(2)}`;
  }

  return "Manual handling required";
}

function formatPercent(value: number | null): string {
  return value === null ? "-" : `${value.toFixed(2)}%`;
}

function buildInvoiceItems(lines: InvoiceLineForm[]) {
  return lines.map((line) => {
    const category = getCategoryOrFallback(line.categoryId);
    const useManualRate = shouldUseManualRate(category);

    return {
      id: line.id,
      description: line.description,
      quantity: parseAmount(line.quantity),
      unitPrice: parseAmount(line.unitPrice),
      categoryId: line.categoryId,
      manualRatePercent: useManualRate ? parseManualRate(line.manualRate) : undefined
    };
  });
}

export function SstCalculatorMalaysia() {
  const { currency } = useCurrency();
  const formatCurrency = useMemo(
    () =>
      (value: number) =>
        formatCurrencyValue(value, currency, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
    [currency]
  );
  const [view, setView] = useState<CalculatorView>("quick");
  const [quickMode, setQuickMode] = useState<SstCalculationMode>("add");
  const [quickAmount, setQuickAmount] = useState("0");
  const [quickCategoryId, setQuickCategoryId] = useState<SstCategoryId>(
    "service_general_taxable"
  );
  const [quickManualRate, setQuickManualRate] = useState("");
  const [invoiceMode, setInvoiceMode] = useState<SstCalculationMode>("add");
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineForm[]>([createInvoiceLine()]);

  const quickCategory = getCategoryOrFallback(quickCategoryId);
  const quickManualRateEnabled = shouldUseManualRate(quickCategory);

  const quickCalculation = useMemo(() => {
    if (!quickAmount.trim()) {
      return { result: null, message: "Enter an amount to estimate SST." };
    }

    try {
      return {
        result: calculateSstInvoiceMalaysia({
          mode: quickMode,
          items: [
            {
              id: "quick",
              description: quickCategory.label,
              quantity: 1,
              unitPrice: parseAmount(quickAmount),
              categoryId: quickCategoryId,
              manualRatePercent: quickManualRateEnabled
                ? parseManualRate(quickManualRate)
                : undefined
            }
          ]
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [
    quickAmount,
    quickCategory.label,
    quickCategoryId,
    quickManualRate,
    quickManualRateEnabled,
    quickMode
  ]);

  const invoiceCalculation = useMemo(() => {
    if (invoiceLines.some((line) => !line.unitPrice.trim() || !line.quantity.trim())) {
      return { result: null, message: "Enter quantity and unit price for each line item." };
    }

    try {
      return {
        result: calculateSstInvoiceMalaysia({
          mode: invoiceMode,
          items: buildInvoiceItems(invoiceLines)
        }),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the values and try again."
      };
    }
  }, [invoiceLines, invoiceMode]);

  function resetQuickCalculator() {
    setQuickMode("add");
    setQuickAmount("0");
    setQuickCategoryId("service_general_taxable");
    setQuickManualRate("");
  }

  function resetInvoiceCalculator() {
    setInvoiceMode("add");
    setInvoiceLines([createInvoiceLine()]);
  }

  function updateInvoiceLine(id: string, updates: Partial<InvoiceLineForm>) {
    setInvoiceLines((currentLines) =>
      currentLines.map((line) => (line.id === id ? { ...line, ...updates } : line))
    );
  }

  function removeInvoiceLine(id: string) {
    setInvoiceLines((currentLines) =>
      currentLines.length === 1 ? currentLines : currentLines.filter((line) => line.id !== id)
    );
  }

  function addInvoiceLine() {
    setInvoiceLines((currentLines) => [...currentLines, createInvoiceLine()]);
  }

  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-col gap-8">
      <Card className="w-full p-5 sm:p-8" variant="elevated">
        <div className="flex flex-col gap-6">
          <div className="grid gap-5">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Calculator mode</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                Quick SST or invoice breakdown
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                Start with one amount, or switch to invoice breakdown for multiple line items
                with different suggested categories or manual rates.
              </p>
            </div>
            <div
              aria-label="SST calculator mode"
              className="grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1 sm:max-w-md sm:grid-cols-2"
              role="group"
            >
              {viewOptions.map((option) => (
                <button
                  aria-pressed={view === option.value}
                  className={`h-10 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-slate-100 ${
                    view === option.value
                      ? "bg-white text-stone-950 shadow-sm"
                      : "text-stone-600 hover:bg-white/70"
                  }`}
                  key={option.value}
                  onClick={() => {
                    setView(option.value);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {view === "quick" ? (
            <QuickCalculatorView
              amount={quickAmount}
              calculation={quickCalculation}
              category={quickCategory}
              categoryId={quickCategoryId}
              formatCurrency={formatCurrency}
              manualRate={quickManualRate}
              manualRateEnabled={quickManualRateEnabled}
              mode={quickMode}
              onAmountChange={setQuickAmount}
              onCategoryChange={(categoryId) => {
                setQuickCategoryId(categoryId);
                setQuickManualRate("");
              }}
              onManualRateChange={setQuickManualRate}
              onModeChange={setQuickMode}
              onReset={resetQuickCalculator}
            />
          ) : (
            <InvoiceBreakdownView
              calculation={invoiceCalculation}
              formatCurrency={formatCurrency}
              lines={invoiceLines}
              mode={invoiceMode}
              onAddLine={addInvoiceLine}
              onModeChange={setInvoiceMode}
              onRemoveLine={removeInvoiceLine}
              onReset={resetInvoiceCalculator}
              onUpdateLine={updateInvoiceLine}
            />
          )}
        </div>
      </Card>

      <Card className="border-amber-200 bg-amber-50 p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-amber-700">Important note</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Estimation only
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
          This calculator provides an estimate only. SST treatment may depend on taxable
          service category, goods classification, exemption status, registration status, and
          official RMCD/MySST updates. Please confirm with official guidance or your
          accountant before issuing tax invoices.
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
              Add SST: SST Amount = Amount Before SST x SST Rate
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Add SST: Total = Amount Before SST + SST Amount
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Remove SST: Amount Before SST = SST-Inclusive Amount / (1 + SST Rate)
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Invoice breakdown: each line is calculated first, then rounded line totals are
              grouped by category/rate.
            </p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
              Rounding note: amounts are rounded to 2 decimals per line so displayed rows and
              totals stay consistent.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Mistakes to avoid
          </h2>
          <div className="mt-5 grid gap-3">
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
      </section>

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
            <ButtonLink href="/tools/invoice-generator">Create a PDF Invoice</ButtonLink>
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

function QuickCalculatorView({
  amount,
  calculation,
  category,
  categoryId,
  formatCurrency,
  manualRate,
  manualRateEnabled,
  mode,
  onAmountChange,
  onCategoryChange,
  onManualRateChange,
  onModeChange,
  onReset
}: {
  amount: string;
  calculation: { message: string; result: SstInvoiceMalaysiaResult | null };
  category: SstMalaysiaCategory;
  categoryId: SstCategoryId;
  formatCurrency: (value: number) => string;
  manualRate: string;
  manualRateEnabled: boolean;
  mode: SstCalculationMode;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: SstCategoryId) => void;
  onManualRateChange: (value: string) => void;
  onModeChange: (value: SstCalculationMode) => void;
  onReset: () => void;
}) {
  const line = calculation.result?.lineItems[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-5">
        <ModeSelect mode={mode} onModeChange={onModeChange} />

        <label className="grid gap-2" htmlFor="quick-sst-amount">
          <span className="text-sm font-semibold text-stone-800">
            {mode === "add" ? "Amount before SST" : "SST-inclusive amount"}
          </span>
          <input
            className={inputClassName}
            id="quick-sst-amount"
            inputMode="decimal"
            min="0"
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="100"
            step="0.01"
            type="number"
            value={amount}
          />
        </label>

        <CategorySelect
          categoryId={categoryId}
          describedBy={manualRateEnabled ? undefined : "quick-sst-category-note"}
          id="quick-sst-category"
          label="Product or service category"
          onChange={onCategoryChange}
        />

        <ManualRateControls
          idPrefix="quick-sst"
          manualRate={manualRate}
          manualRateEnabled={manualRateEnabled}
          onManualRateChange={onManualRateChange}
        />

        <CategoryHint
          category={category}
          id="quick-sst-category-note"
        />

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-10 w-fit items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>

      <ResultPanel
        heading={mode === "add" ? "Add SST estimate" : "Remove SST estimate"}
        message={calculation.message}
        result={calculation.result}
      >
        {line ? (
          <>
            <ResultMetric
              label={mode === "add" ? "Total including SST" : "Amount before SST"}
              value={
                mode === "add"
                  ? formatCurrency(line.totalIncludingSst)
                  : formatCurrency(line.amountBeforeSst)
              }
              featured
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultMetric label="SST rate" value={formatPercent(line.sstRatePercent)} />
              <ResultMetric label="SST amount" value={formatCurrency(line.sstAmount)} />
            </div>
            {mode === "add" ? (
              <ResultMetric label="Amount before SST" value={formatCurrency(line.amountBeforeSst)} />
            ) : (
              <ResultMetric
                label="Total including SST"
                value={formatCurrency(line.totalIncludingSst)}
              />
            )}
            <p className="text-sm leading-6 text-stone-600">{line.explanation}</p>
            <p className="text-sm leading-6 text-stone-600">
              Formula used:{" "}
              {mode === "add"
                ? "SST amount = amount before SST x selected rate."
                : "Amount before SST = SST-inclusive amount / (1 + selected rate)."}
            </p>
            <WarningsList warnings={calculation.result?.warnings ?? []} />
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

function InvoiceBreakdownView({
  calculation,
  formatCurrency,
  lines,
  mode,
  onAddLine,
  onModeChange,
  onRemoveLine,
  onReset,
  onUpdateLine
}: {
  calculation: { message: string; result: SstInvoiceMalaysiaResult | null };
  formatCurrency: (value: number) => string;
  lines: InvoiceLineForm[];
  mode: SstCalculationMode;
  onAddLine: () => void;
  onModeChange: (value: SstCalculationMode) => void;
  onRemoveLine: (id: string) => void;
  onReset: () => void;
  onUpdateLine: (id: string, updates: Partial<InvoiceLineForm>) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <ModeSelect
            addLabel="Prices entered are before SST"
            mode={mode}
            onModeChange={onModeChange}
            removeLabel="Prices entered include SST"
          />
          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex h-10 w-fit items-center justify-center rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              onClick={onAddLine}
              type="button"
            >
              Add line item
            </button>
            <button
              className="inline-flex h-10 w-fit items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-white"
              onClick={onReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {lines.map((line, index) => (
            <InvoiceLineEditor
              index={index}
              key={line.id}
              line={line}
              onRemove={() => onRemoveLine(line.id)}
              onUpdate={(updates) => onUpdateLine(line.id, updates)}
              removeDisabled={lines.length === 1}
            />
          ))}
        </div>
      </div>

      <ResultPanel
        heading="Invoice SST breakdown"
        message={calculation.message}
        result={calculation.result}
      >
        {calculation.result ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <ResultMetric
                label="Subtotal before SST"
                value={formatCurrency(calculation.result.subtotalBeforeSst)}
              />
              <ResultMetric label="SST total" value={formatCurrency(calculation.result.totalSst)} />
              <ResultMetric
                label="Grand total including SST"
                value={formatCurrency(calculation.result.grandTotalIncludingSst)}
                featured
              />
            </div>

            <div className="grid gap-3">
              <h3 className="text-base font-semibold text-stone-950">Line-by-line result</h3>
              {calculation.result.lineItems.map((line) => (
                <div
                  className="rounded-xl border border-stone-200 bg-white p-4"
                  key={line.id ?? line.description}
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-950">{line.description}</p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        {line.categoryLabel} - {line.rateType === "fixed"
                          ? `RM ${line.fixedAmount?.toFixed(2)} fixed`
                          : formatPercent(line.sstRatePercent)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-stone-950">
                      {formatCurrency(line.totalIncludingSst)}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-3">
                    <span>Before SST: {formatCurrency(line.amountBeforeSst)}</span>
                    <span>SST: {formatCurrency(line.sstAmount)}</span>
                    <span>Total: {formatCurrency(line.totalIncludingSst)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              <h3 className="text-base font-semibold text-stone-950">Grouped SST totals</h3>
              {calculation.result.groupedSst.map((group) => (
                <div
                  className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={group.key}
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-950">{group.categoryLabel}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {group.rateType === "fixed"
                        ? `Fixed RM ${group.fixedAmount?.toFixed(2)}`
                        : formatPercent(group.sstRatePercent)}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-stone-950">
                    {formatCurrency(group.sstAmount)}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm leading-6 text-stone-600">{calculation.result.explanation}</p>
            <p className="text-sm leading-6 text-stone-600">
              Rounded line totals are summed for subtotal, SST total, and grand total so the
              breakdown matches the displayed rows.
            </p>
            <WarningsList warnings={calculation.result.warnings} />
          </>
        ) : null}
      </ResultPanel>
    </div>
  );
}

function InvoiceLineEditor({
  index,
  line,
  onRemove,
  onUpdate,
  removeDisabled
}: {
  index: number;
  line: InvoiceLineForm;
  onRemove: () => void;
  onUpdate: (updates: Partial<InvoiceLineForm>) => void;
  removeDisabled: boolean;
}) {
  const category = getCategoryOrFallback(line.categoryId);
  const manualRateEnabled = shouldUseManualRate(category);
  const idPrefix = `sst-line-${index + 1}`;

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-stone-950">Line item {index + 1}</h3>
        <button
          className="inline-flex h-9 items-center justify-center rounded-xl border border-stone-300 px-3 text-sm font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={removeDisabled}
          onClick={onRemove}
          type="button"
        >
          Remove line
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-[minmax(13rem,1fr)_8rem_10rem_minmax(17rem,1.1fr)]">
        <label className="grid min-w-0 gap-2" htmlFor={`${idPrefix}-description`}>
          <span className="text-sm font-semibold text-stone-800">Description</span>
          <input
            className={smallInputClassName}
            id={`${idPrefix}-description`}
            onChange={(event) => onUpdate({ description: event.target.value })}
            placeholder="Service or goods"
            type="text"
            value={line.description}
          />
        </label>

        <label className="grid min-w-0 gap-2" htmlFor={`${idPrefix}-quantity`}>
          <span className="text-sm font-semibold text-stone-800">Quantity</span>
          <input
            className={smallInputClassName}
            id={`${idPrefix}-quantity`}
            inputMode="decimal"
            min="0.0001"
            onChange={(event) => onUpdate({ quantity: event.target.value })}
            placeholder="1"
            step="0.0001"
            type="number"
            value={line.quantity}
          />
        </label>

        <label className="grid min-w-0 gap-2" htmlFor={`${idPrefix}-unit-price`}>
          <span className="text-sm font-semibold text-stone-800">Unit price</span>
          <input
            className={smallInputClassName}
            id={`${idPrefix}-unit-price`}
            inputMode="decimal"
            min="0"
            onChange={(event) => onUpdate({ unitPrice: event.target.value })}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={line.unitPrice}
          />
        </label>

        <CategorySelect
          categoryId={line.categoryId}
          id={`${idPrefix}-category`}
          label="Category"
          onChange={(categoryId) =>
            onUpdate({
              categoryId,
              manualRate: ""
            })
          }
          compact
        />
      </div>

      <div className="mt-3 grid gap-3">
        <ManualRateControls
          idPrefix={idPrefix}
          manualRate={line.manualRate}
          manualRateEnabled={manualRateEnabled}
          onManualRateChange={(value) => onUpdate({ manualRate: value })}
        />
        <CategoryHint category={category} />
      </div>
    </div>
  );
}

function ModeSelect({
  addLabel = "Add SST",
  mode,
  onModeChange,
  removeLabel = "Remove SST"
}: {
  addLabel?: string;
  mode: SstCalculationMode;
  onModeChange: (value: SstCalculationMode) => void;
  removeLabel?: string;
}) {
  return (
    <DropdownSelect
      id="sst-calculation-mode"
      label="Calculation mode"
      onChange={onModeChange}
      options={[
        { label: addLabel, value: "add" },
        { label: removeLabel, value: "remove" }
      ]}
      value={mode}
    />
  );
}

function CategorySelect({
  categoryId,
  compact = false,
  describedBy,
  id,
  label,
  onChange
}: {
  categoryId: SstCategoryId;
  compact?: boolean;
  describedBy?: string;
  id: string;
  label: string;
  onChange: (value: SstCategoryId) => void;
}) {
  return (
    <DropdownSelect
      compact={compact}
      describedBy={describedBy}
      groups={categoryDropdownGroups}
      id={id}
      label={label}
      onChange={onChange}
      value={categoryId}
    />
  );
}

function DropdownSelect<T extends string>({
  compact = false,
  describedBy,
  groups,
  id,
  label,
  onChange,
  options,
  value
}: {
  compact?: boolean;
  describedBy?: string;
  groups?: Array<DropdownGroup<T>>;
  id: string;
  label: string;
  onChange: (value: T) => void;
  options?: Array<DropdownOption<T>>;
  value: T;
}) {
  const normalizedGroups =
    groups ?? [
      {
        options: options ?? []
      }
    ];
  const flatOptions = normalizedGroups.flatMap((group) => group.options);
  const selectedIndex = Math.max(
    flatOptions.findIndex((option) => option.value === value),
    0
  );
  const selectedOption = flatOptions[selectedIndex];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reactId = useId();
  const labelId = `${id}-label`;
  const buttonId = `${id}-button`;
  const listboxId = `${reactId}-listbox`;
  const triggerHeightClass = compact ? "h-11" : "h-12";

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function openAndFocusOption(index: number) {
    setIsOpen(true);
    setActiveIndex(index);
    window.requestAnimationFrame(() => focusOption(index));
  }

  function closeAndFocusButton() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function selectOption(index: number) {
    const option = flatOptions[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function moveOptionFocus(index: number) {
    const lastIndex = flatOptions.length - 1;
    const nextIndex = Math.min(Math.max(index, 0), lastIndex);

    setActiveIndex(nextIndex);
    focusOption(nextIndex);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocusOption(isOpen ? Math.min(activeIndex + 1, flatOptions.length - 1) : selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocusOption(isOpen ? Math.max(activeIndex - 1, 0) : selectedIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      openAndFocusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      openAndFocusOption(flatOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      openAndFocusOption(isOpen ? activeIndex : selectedIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveOptionFocus(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveOptionFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveOptionFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveOptionFocus(flatOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      selectOption(index);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusButton();
    }
  }

  return (
    <div className="relative grid min-w-0 gap-2" ref={rootRef}>
      <span className="text-sm font-semibold text-stone-800" id={labelId}>
        {label}
      </span>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${buttonId}`}
        className={`inline-flex ${triggerHeightClass} w-full items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 text-left text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100`}
        id={buttonId}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setIsOpen((current) => !current);
        }}
        onKeyDown={handleButtonKeyDown}
        ref={buttonRef}
        type="button"
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? "Select"}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-stone-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-40 mt-2 max-h-72 w-full min-w-full overflow-y-auto rounded-xl border border-stone-200 bg-white py-1.5 shadow-lg shadow-stone-200/60"
          id={listboxId}
          role="listbox"
        >
          {normalizedGroups.map((group) => (
            <div key={group.label ?? "options"}>
              {group.label ? (
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                  {group.label}
                </p>
              ) : null}
              {group.options.map((option) => {
                const optionIndex = flatOptions.findIndex(
                  (flatOption) => flatOption.value === option.value
                );
                const isSelected = option.value === value;

                return (
                  <button
                    aria-selected={isSelected}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "bg-slate-50 font-semibold text-slate-800"
                        : "font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                    }`}
                    id={`${listboxId}-${option.value}`}
                    key={option.value}
                    onClick={() => selectOption(optionIndex)}
                    onFocus={() => setActiveIndex(optionIndex)}
                    onKeyDown={(event) => handleOptionKeyDown(event, optionIndex)}
                    ref={(element) => {
                      optionRefs.current[optionIndex] = element;
                    }}
                    role="option"
                    tabIndex={activeIndex === optionIndex ? 0 : -1}
                    type="button"
                  >
                    <span className="min-w-0">{option.label}</span>
                    {isSelected ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategoryHint({
  category,
  id
}: {
  category: SstMalaysiaCategory;
  id?: string;
}) {
  return (
    <div
      className="rounded-xl border border-stone-200 bg-white p-3 text-sm leading-6 text-stone-600"
      id={id}
    >
      <p className="break-words font-semibold text-stone-900">
        {getCategoryRateLabel(category)}
      </p>
      <p className="mt-1">{category.description}</p>
      {category.warning ? <p className="mt-2 text-amber-800">{category.warning}</p> : null}
    </div>
  );
}

function ManualRateControls({
  idPrefix,
  manualRate,
  manualRateEnabled,
  onManualRateChange
}: {
  idPrefix: string;
  manualRate: string;
  manualRateEnabled: boolean;
  onManualRateChange: (value: string) => void;
}) {
  if (!manualRateEnabled) {
    return null;
  }

  return (
    <label className="grid gap-2" htmlFor={`${idPrefix}-manual-rate`}>
      <span className="text-sm font-semibold text-stone-800">Manual SST rate (%)</span>
      <input
        className={smallInputClassName}
        id={`${idPrefix}-manual-rate`}
        inputMode="decimal"
        max="100"
        min="0"
        onChange={(event) => onManualRateChange(event.target.value)}
        placeholder="0"
        required
        step="0.01"
        type="number"
        value={manualRate}
      />
    </label>
  );
}

function ResultPanel({
  children,
  heading,
  message,
  result
}: {
  children: ReactNode;
  heading: string;
  message: string;
  result: SstInvoiceMalaysiaResult | null;
}) {
  return (
    <div aria-live="polite" className="rounded-xl border border-stone-200 bg-stone-50 p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
          {heading}
        </h2>
      </div>

      {result ? <div className="mt-5 grid gap-3">{children}</div> : (
        <p className="mt-4 text-sm leading-6 text-stone-600">{message}</p>
      )}
    </div>
  );
}

function ResultMetric({
  featured = false,
  label,
  value
}: {
  featured?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p
        className={`mt-2 font-semibold tracking-tight text-stone-950 ${
          featured ? "text-3xl" : "text-xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function WarningsList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-2">
      {[...new Set(warnings)].map((warning) => (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900"
          key={warning}
        >
          {warning}
        </p>
      ))}
    </div>
  );
}
