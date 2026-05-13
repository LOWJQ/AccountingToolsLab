"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
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
  useManualRate: boolean;
  manualRate: string;
};

type CopyTarget = "quick" | "invoice";

const inputClassName =
  "h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

const smallInputClassName =
  "h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

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

function createInvoiceLine(overrides: Partial<InvoiceLineForm> = {}): InvoiceLineForm {
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
    useManualRate: false,
    manualRate: "",
    ...overrides
  };
}

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function getCategoryOrFallback(id: string): SstMalaysiaCategory {
  return getSstCategoryById(id) ?? SST_MALAYSIA_CATEGORIES[0];
}

function shouldUseManualRate(category: SstMalaysiaCategory, useManualRate: boolean): boolean {
  return category.rateType === "manual" || useManualRate;
}

function getCategoryRateLabel(category: SstMalaysiaCategory, isManualRateEnabled: boolean): string {
  if (isManualRateEnabled || category.rateType === "manual") {
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

function categorySelectOptions() {
  return groupedCategories.map((group) => (
    <optgroup label={group.label} key={group.label}>
      {group.categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.label}
        </option>
      ))}
    </optgroup>
  ));
}

function buildInvoiceItems(lines: InvoiceLineForm[]) {
  return lines.map((line) => {
    const category = getCategoryOrFallback(line.categoryId);
    const useManualRate = shouldUseManualRate(category, line.useManualRate);

    return {
      id: line.id,
      description: line.description,
      quantity: parseAmount(line.quantity),
      unitPrice: parseAmount(line.unitPrice),
      categoryId: line.categoryId,
      manualRatePercent: useManualRate ? parseAmount(line.manualRate) : undefined
    };
  });
}

export function SstCalculatorMalaysia() {
  const { formatCurrency } = useCurrency();
  const [view, setView] = useState<CalculatorView>("quick");
  const [quickMode, setQuickMode] = useState<SstCalculationMode>("add");
  const [quickAmount, setQuickAmount] = useState("");
  const [quickCategoryId, setQuickCategoryId] = useState<SstCategoryId>(
    "service_general_taxable"
  );
  const [quickUseManualRate, setQuickUseManualRate] = useState(false);
  const [quickManualRate, setQuickManualRate] = useState("");
  const [invoiceMode, setInvoiceMode] = useState<SstCalculationMode>("add");
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineForm[]>([
    createInvoiceLine({ description: "Consulting service", unitPrice: "100" })
  ]);
  const [copyStatus, setCopyStatus] = useState("");

  const quickCategory = getCategoryOrFallback(quickCategoryId);
  const quickManualRateEnabled = shouldUseManualRate(quickCategory, quickUseManualRate);

  const quickCalculation = useMemo(() => {
    if (!quickAmount.trim()) {
      return { result: null, message: "Enter an amount to estimate SST." };
    }

    if (quickManualRateEnabled && !quickManualRate.trim()) {
      return { result: null, message: "Enter a manual SST rate for this category." };
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
                ? parseAmount(quickManualRate)
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
    setQuickAmount("");
    setQuickCategoryId("service_general_taxable");
    setQuickUseManualRate(false);
    setQuickManualRate("");
    setCopyStatus("");
  }

  function resetInvoiceCalculator() {
    setInvoiceMode("add");
    setInvoiceLines([createInvoiceLine({ description: "Consulting service", unitPrice: "100" })]);
    setCopyStatus("");
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

  function applyPreset(preset: string) {
    setCopyStatus("");

    if (preset === "general-service") {
      setView("quick");
      setQuickMode("add");
      setQuickAmount("100");
      setQuickCategoryId("service_general_taxable");
      setQuickUseManualRate(false);
      setQuickManualRate("");
      return;
    }

    if (preset === "fnb-service") {
      setView("quick");
      setQuickMode("add");
      setQuickAmount("100");
      setQuickCategoryId("service_food_beverage");
      setQuickUseManualRate(false);
      setQuickManualRate("");
      return;
    }

    if (preset === "goods-10") {
      setView("quick");
      setQuickMode("add");
      setQuickAmount("250");
      setQuickCategoryId("goods_sales_tax_10");
      setQuickUseManualRate(false);
      setQuickManualRate("");
      return;
    }

    if (preset === "mixed-invoice") {
      setView("invoice");
      setInvoiceMode("add");
      setInvoiceLines([
        createInvoiceLine({
          description: "Accounting service",
          quantity: "1",
          unitPrice: "300",
          categoryId: "service_general_taxable"
        }),
        createInvoiceLine({
          description: "Food and beverage service",
          quantity: "2",
          unitPrice: "50",
          categoryId: "service_food_beverage"
        }),
        createInvoiceLine({
          description: "Taxable goods",
          quantity: "3",
          unitPrice: "80",
          categoryId: "goods_sales_tax_10"
        })
      ]);
      return;
    }

    setView("invoice");
    setInvoiceMode("remove");
    setInvoiceLines([
      createInvoiceLine({
        description: "SST-inclusive service receipt",
        quantity: "1",
        unitPrice: "108",
        categoryId: "service_general_taxable"
      }),
      createInvoiceLine({
        description: "SST-inclusive F&B receipt",
        quantity: "1",
        unitPrice: "106",
        categoryId: "service_food_beverage"
      })
    ]);
  }

  async function copyResult(target: CopyTarget) {
    const text =
      target === "quick"
        ? quickCalculation.result
          ? buildQuickCopyText(quickCalculation.result, quickMode, formatCurrency)
          : ""
        : invoiceCalculation.result
          ? buildInvoiceCopyText(invoiceCalculation.result, invoiceMode, formatCurrency)
          : "";

    if (!text) {
      setCopyStatus("Nothing to copy yet.");
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setCopyStatus("Clipboard copy is not supported in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Result copied.");
    } catch {
      setCopyStatus("Could not copy result. You can select the result text manually.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              className="grid gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1 sm:grid-cols-2"
              role="group"
            >
              {[
                ["quick", "Quick SST"],
                ["invoice", "Invoice breakdown"]
              ].map(([nextView, label]) => (
                <button
                  aria-pressed={view === nextView}
                  className={`h-10 rounded-lg px-4 text-sm font-semibold transition ${
                    view === nextView
                      ? "bg-white text-stone-950 shadow-sm"
                      : "text-stone-600 hover:bg-white/70"
                  }`}
                  key={nextView}
                  onClick={() => {
                    setView(nextView as CalculatorView);
                    setCopyStatus("");
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-stone-800">Example presets</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <PresetButton onClick={() => applyPreset("general-service")}>
                General taxable service, 8%
              </PresetButton>
              <PresetButton onClick={() => applyPreset("fnb-service")}>
                F&B service, 6%
              </PresetButton>
              <PresetButton onClick={() => applyPreset("goods-10")}>
                Goods with 10% sales tax
              </PresetButton>
              <PresetButton onClick={() => applyPreset("mixed-invoice")}>
                Mixed invoice example
              </PresetButton>
              <PresetButton onClick={() => applyPreset("inclusive-receipt")}>
                SST-inclusive receipt example
              </PresetButton>
            </div>
          </div>

          {view === "quick" ? (
            <QuickCalculatorView
              amount={quickAmount}
              calculation={quickCalculation}
              category={quickCategory}
              categoryId={quickCategoryId}
              copyStatus={copyStatus}
              formatCurrency={formatCurrency}
              manualRate={quickManualRate}
              manualRateEnabled={quickManualRateEnabled}
              mode={quickMode}
              onAmountChange={setQuickAmount}
              onCategoryChange={(categoryId) => {
                setQuickCategoryId(categoryId);
                setQuickUseManualRate(false);
                setQuickManualRate("");
              }}
              onCopy={() => copyResult("quick")}
              onManualRateChange={setQuickManualRate}
              onManualToggle={setQuickUseManualRate}
              onModeChange={setQuickMode}
              onReset={resetQuickCalculator}
              useManualRate={quickUseManualRate}
            />
          ) : (
            <InvoiceBreakdownView
              calculation={invoiceCalculation}
              copyStatus={copyStatus}
              formatCurrency={formatCurrency}
              lines={invoiceLines}
              mode={invoiceMode}
              onAddLine={addInvoiceLine}
              onCopy={() => copyResult("invoice")}
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
  copyStatus,
  formatCurrency,
  manualRate,
  manualRateEnabled,
  mode,
  onAmountChange,
  onCategoryChange,
  onCopy,
  onManualRateChange,
  onManualToggle,
  onModeChange,
  onReset,
  useManualRate
}: {
  amount: string;
  calculation: { message: string; result: SstInvoiceMalaysiaResult | null };
  category: SstMalaysiaCategory;
  categoryId: SstCategoryId;
  copyStatus: string;
  formatCurrency: (value: number) => string;
  manualRate: string;
  manualRateEnabled: boolean;
  mode: SstCalculationMode;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: SstCategoryId) => void;
  onCopy: () => void;
  onManualRateChange: (value: string) => void;
  onManualToggle: (value: boolean) => void;
  onModeChange: (value: SstCalculationMode) => void;
  onReset: () => void;
  useManualRate: boolean;
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
          describedBy="quick-sst-category-note"
          id="quick-sst-category"
          label="Product or service category"
          onChange={onCategoryChange}
        />

        <CategoryHint
          category={category}
          id="quick-sst-category-note"
          manualRateEnabled={manualRateEnabled}
        />

        <ManualRateControls
          category={category}
          idPrefix="quick-sst"
          manualRate={manualRate}
          manualRateEnabled={manualRateEnabled}
          onManualRateChange={onManualRateChange}
          onManualToggle={onManualToggle}
          useManualRate={useManualRate}
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
        copyStatus={copyStatus}
        heading={mode === "add" ? "Add SST estimate" : "Remove SST estimate"}
        message={calculation.message}
        onCopy={onCopy}
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
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultMetric label="Amount before SST" value={formatCurrency(line.amountBeforeSst)} />
              <ResultMetric
                label="Total including SST"
                value={formatCurrency(line.totalIncludingSst)}
              />
            </div>
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
  copyStatus,
  formatCurrency,
  lines,
  mode,
  onAddLine,
  onCopy,
  onModeChange,
  onRemoveLine,
  onReset,
  onUpdateLine
}: {
  calculation: { message: string; result: SstInvoiceMalaysiaResult | null };
  copyStatus: string;
  formatCurrency: (value: number) => string;
  lines: InvoiceLineForm[];
  mode: SstCalculationMode;
  onAddLine: () => void;
  onCopy: () => void;
  onModeChange: (value: SstCalculationMode) => void;
  onRemoveLine: (id: string) => void;
  onReset: () => void;
  onUpdateLine: (id: string, updates: Partial<InvoiceLineForm>) => void;
}) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-5">
        <ModeSelect
          addLabel="Prices entered are before SST"
          mode={mode}
          onModeChange={onModeChange}
          removeLabel="Prices entered include SST"
        />

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

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-10 w-fit items-center justify-center rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            onClick={onAddLine}
            type="button"
          >
            Add line item
          </button>
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
        copyStatus={copyStatus}
        heading="Invoice SST breakdown"
        message={calculation.message}
        onCopy={onCopy}
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
  const manualRateEnabled = shouldUseManualRate(category, line.useManualRate);
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

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.6fr_0.8fr_1.4fr]">
        <label className="grid gap-2" htmlFor={`${idPrefix}-description`}>
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

        <label className="grid gap-2" htmlFor={`${idPrefix}-quantity`}>
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

        <label className="grid gap-2" htmlFor={`${idPrefix}-unit-price`}>
          <span className="text-sm font-semibold text-stone-800">Unit price</span>
          <input
            className={smallInputClassName}
            id={`${idPrefix}-unit-price`}
            inputMode="decimal"
            min="0"
            onChange={(event) => onUpdate({ unitPrice: event.target.value })}
            placeholder="100"
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
              useManualRate: false,
              manualRate: ""
            })
          }
          compact
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.7fr]">
        <CategoryHint category={category} manualRateEnabled={manualRateEnabled} />
        <ManualRateControls
          category={category}
          idPrefix={idPrefix}
          manualRate={line.manualRate}
          manualRateEnabled={manualRateEnabled}
          onManualRateChange={(value) => onUpdate({ manualRate: value })}
          onManualToggle={(value) => onUpdate({ useManualRate: value, manualRate: "" })}
          useManualRate={line.useManualRate}
        />
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
    <label className="grid gap-2" htmlFor="sst-calculation-mode">
      <span className="text-sm font-semibold text-stone-800">Calculation mode</span>
      <select
        className={inputClassName}
        id="sst-calculation-mode"
        onChange={(event) => onModeChange(event.target.value as SstCalculationMode)}
        value={mode}
      >
        <option value="add">{addLabel}</option>
        <option value="remove">{removeLabel}</option>
      </select>
    </label>
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
    <label className="grid gap-2" htmlFor={id}>
      <span className="text-sm font-semibold text-stone-800">{label}</span>
      <select
        aria-describedby={describedBy}
        className={compact ? smallInputClassName : inputClassName}
        id={id}
        onChange={(event) => onChange(event.target.value as SstCategoryId)}
        value={categoryId}
      >
        {categorySelectOptions()}
      </select>
    </label>
  );
}

function CategoryHint({
  category,
  id,
  manualRateEnabled
}: {
  category: SstMalaysiaCategory;
  id?: string;
  manualRateEnabled: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600"
      id={id}
    >
      <p className="break-words font-semibold text-stone-900">
        {getCategoryRateLabel(category, manualRateEnabled)}
      </p>
      <p className="mt-1">{category.description}</p>
      {category.warning ? <p className="mt-2 text-amber-800">{category.warning}</p> : null}
    </div>
  );
}

function ManualRateControls({
  category,
  idPrefix,
  manualRate,
  manualRateEnabled,
  onManualRateChange,
  onManualToggle,
  useManualRate
}: {
  category: SstMalaysiaCategory;
  idPrefix: string;
  manualRate: string;
  manualRateEnabled: boolean;
  onManualRateChange: (value: string) => void;
  onManualToggle: (value: boolean) => void;
  useManualRate: boolean;
}) {
  const manualRequired = category.rateType === "manual";

  return (
    <div className="grid gap-3">
      {!manualRequired ? (
        <label className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700">
          <input
            checked={useManualRate}
            className="mt-1"
            onChange={(event) => onManualToggle(event.target.checked)}
            type="checkbox"
          />
          <span>Use manual percentage override</span>
        </label>
      ) : null}

      {manualRateEnabled ? (
        <label className="grid gap-2" htmlFor={`${idPrefix}-manual-rate`}>
          <span className="text-sm font-semibold text-stone-800">
            Manual SST rate (%)
          </span>
          <input
            className={smallInputClassName}
            id={`${idPrefix}-manual-rate`}
            inputMode="decimal"
            max="100"
            min="0"
            onChange={(event) => onManualRateChange(event.target.value)}
            placeholder="8"
            required={manualRequired}
            step="0.01"
            type="number"
            value={manualRate}
          />
        </label>
      ) : null}
    </div>
  );
}

function ResultPanel({
  children,
  copyStatus,
  heading,
  message,
  onCopy,
  result
}: {
  children: ReactNode;
  copyStatus: string;
  heading: string;
  message: string;
  onCopy: () => void;
  result: SstInvoiceMalaysiaResult | null;
}) {
  return (
    <div aria-live="polite" className="rounded-xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
            {heading}
          </h2>
        </div>
        <button
          className="inline-flex h-10 w-fit items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!result}
          onClick={onCopy}
          type="button"
        >
          Copy result
        </button>
      </div>

      {result ? <div className="mt-5 grid gap-3">{children}</div> : (
        <p className="mt-4 text-sm leading-6 text-stone-600">{message}</p>
      )}

      {copyStatus ? (
        <p className="mt-4 text-sm font-medium text-slate-700" role="status">
          {copyStatus}
        </p>
      ) : null}
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

function PresetButton({
  children,
  onClick
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="min-h-11 rounded-xl border border-stone-200 bg-white px-4 py-2 text-left text-sm font-semibold text-stone-700 transition hover:border-slate-200 hover:bg-stone-50"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function buildQuickCopyText(
  result: SstInvoiceMalaysiaResult,
  mode: SstCalculationMode,
  formatCurrency: (value: number) => string
): string {
  const line = result.lineItems[0];

  return [
    "SST quick estimate",
    `Mode: ${mode === "add" ? "Add SST" : "Remove SST"}`,
    `Category: ${line.categoryLabel}`,
    `Rate: ${line.rateType === "fixed" ? `Fixed RM ${line.fixedAmount?.toFixed(2)}` : formatPercent(line.sstRatePercent)}`,
    `Amount before SST: ${formatCurrency(line.amountBeforeSst)}`,
    `SST amount: ${formatCurrency(line.sstAmount)}`,
    `Total including SST: ${formatCurrency(line.totalIncludingSst)}`
  ].join("\n");
}

function buildInvoiceCopyText(
  result: SstInvoiceMalaysiaResult,
  mode: SstCalculationMode,
  formatCurrency: (value: number) => string
): string {
  return [
    "SST invoice breakdown",
    `Mode: ${mode === "add" ? "Prices before SST" : "Prices include SST"}`,
    `Subtotal before SST: ${formatCurrency(result.subtotalBeforeSst)}`,
    `SST total: ${formatCurrency(result.totalSst)}`,
    `Grand total including SST: ${formatCurrency(result.grandTotalIncludingSst)}`,
    "",
    "Grouped SST:",
    ...result.groupedSst.map(
      (group) =>
        `${group.categoryLabel} (${group.rateType === "fixed" ? `Fixed RM ${group.fixedAmount?.toFixed(2)}` : formatPercent(group.sstRatePercent)}): ${formatCurrency(group.sstAmount)}`
    )
  ].join("\n");
}
