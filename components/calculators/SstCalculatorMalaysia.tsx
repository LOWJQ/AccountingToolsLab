"use client";

import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent
} from "react";
import { SstResultActions } from "./SstResultActions";
import { calculateSstPreview } from "@/lib/calculators/sst-preview";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatCurrency as formatCurrencyValue } from "@/lib/currency";
import {
  calculateSstInvoiceMalaysia,
  getSstCategoryById,
  SST_MALAYSIA_CATEGORIES,
  type CalculatedSstInvoiceLineItem,
  type SstCalculationMode,
  type SstCategoryId,
  type SstMalaysiaCategory
} from "@/lib/calculators/sst-malaysia";

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

type SstItemDraft = {
  id: string;
  description: string;
  quantity: string;
  amount: string;
  categoryId: SstCategoryId;
  manualRate: string;
};

function createItem(id: string): SstItemDraft {
  return {
    id,
    description: "",
    quantity: "1",
    amount: "",
    categoryId: "service_general_taxable",
    manualRate: ""
  };
}

type DropdownGroup<T extends string> = {
  label?: string;
  options: Array<DropdownOption<T>>;
};

const inputClassName =
  "h-11 w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100";

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

const categoryDropdownGroups: Array<DropdownGroup<SstCategoryId>> = groupedCategories.map(
  (group) => ({
    label: group.label,
    options: group.categories.map((category) => ({
      label: getCategorySelectLabel(category),
      value: category.id
    }))
  })
);

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

function getCategorySelectLabel(category: SstMalaysiaCategory): string {
  if (category.rateType === "fixed") {
    return `${category.label} (RM ${category.fixedAmount?.toFixed(0)} fixed)`;
  }

  if (category.rateType === "percentage") {
    return `${category.label} (${category.suggestedRatePercent}%)`;
  }

  return category.label;
}

function formatPercent(value: number | null): string {
  return value === null ? "-" : `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)}%`;
}

function formatRateSummary(
  line: { fixedAmount: number | null; rateType: "percentage" | "fixed"; sstRatePercent: number | null } | undefined
): string {
  if (!line) {
    return "-";
  }

  if (line.rateType === "fixed") {
    return `RM ${line.fixedAmount?.toFixed(2)} fixed`;
  }

  return formatPercent(line.sstRatePercent);
}

export function SstCalculatorMalaysia() {
  const { currency, setCurrency } = useCurrency();
  const formatCurrency = useMemo(
    () =>
      (value: number) =>
        formatCurrencyValue(value, currency, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
    [currency]
  );

  const [mode, setMode] = useState<SstCalculationMode>("add");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<SstCategoryId>("service_general_taxable");
  const [manualRate, setManualRate] = useState("");
  const [multipleItems, setMultipleItems] = useState(false);
  const [items, setItems] = useState<SstItemDraft[]>([]);
  const [hasAttemptedExport, setHasAttemptedExport] = useState(false);
  const nextItemId = useRef(1);

  const category = getCategoryOrFallback(categoryId);
  const manualRateEnabled = shouldUseManualRate(category);
  const requiresMyr = currency !== "MYR" && (multipleItems
    ? items.some((item) => getCategoryOrFallback(item.categoryId).rateType === "fixed")
    : category.rateType === "fixed");

  const preview = useMemo(
    () => calculateSstPreview({
      mode,
      currency,
      items: items.map((item, index) => ({
          id: item.id,
          description: item.description.trim() || `Item ${index + 1}`,
          quantity: parseAmount(item.quantity),
          unitPrice: parseAmount(item.amount),
          categoryId: item.categoryId,
          manualRatePercent: shouldUseManualRate(getCategoryOrFallback(item.categoryId))
            ? parseAmount(item.manualRate)
            : undefined
        }))
    }),
    [currency, items, mode]
  );
  const itemCalculations = preview.items;
  const isComplete = !multipleItems || preview.canExport;
  const incompleteCount = multipleItems ? preview.incompleteCount : 0;

  const calculation = useMemo(() => {
    if (multipleItems) {
      return { result: preview.result, message: "Enter values for an item to see its subtotal." };
    }
    if (!amount.trim()) {
      return { result: null, message: "Enter an amount to see your result." };
    }

    try {
      return {
        result: calculateSstInvoiceMalaysia({
          mode,
          currency,
          items: [
            {
              id: "sst-summary",
              description: category.label,
              quantity: 1,
              unitPrice: parseAmount(amount),
              categoryId,
              manualRatePercent: manualRateEnabled ? parseManualRate(manualRate) : undefined
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
  }, [amount, category.label, categoryId, currency, preview.result, manualRate, manualRateEnabled, mode, multipleItems]);

  const line = calculation.result?.lineItems[0];
  const result = calculation.result;

  function switchInputMode(useMultiple: boolean) {
    setHasAttemptedExport(false);
    if (useMultiple && items.length === 0) {
      setItems([{
        ...createItem(String(nextItemId.current++)),
        amount,
        categoryId,
        manualRate
      }]);
    }
    setMultipleItems(useMultiple);
  }

  function addItem() {
    setHasAttemptedExport(false);
    const item = createItem(String(nextItemId.current++));
    setItems((current) => [...current, item]);
    window.requestAnimationFrame(() => {
      document.getElementById(`sst-item-${item.id}-amount`)?.focus();
    });
  }

  function updateItem(id: string, changes: Partial<SstItemDraft>) {
    setHasAttemptedExport(false);
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function removeItem(id: string) {
    setHasAttemptedExport(false);
    if (items.length <= 1) return;
    const index = items.findIndex((item) => item.id === id);
    const remaining = items.filter((item) => item.id !== id);
    setItems(remaining);
    window.requestAnimationFrame(() => {
      document.getElementById(`sst-item-${remaining[Math.min(index, remaining.length - 1)].id}-description`)?.focus();
    });
  }

  function resetCalculator() {
    setHasAttemptedExport(false);
    setMode("add");
    if (multipleItems) {
      const item = createItem(String(nextItemId.current++));
      setItems([item]);
      window.requestAnimationFrame(() => {
        document.getElementById(`sst-item-${item.id}-amount`)?.focus();
      });
      return;
    }
    setAmount("");
    setCategoryId("service_general_taxable");
    setManualRate("");
    window.requestAnimationFrame(() => document.getElementById("sst-amount")?.focus());
  }

  function handleInvalidExport() {
    setHasAttemptedExport(true);
    if (requiresMyr) {
      window.requestAnimationFrame(() => document.getElementById("sst-use-myr")?.focus());
      return;
    }
    const index = itemCalculations.findIndex((item) => !item.line);
    const item = items[index];
    if (!item) return;
    const quantity = parseAmount(item.quantity);
    const price = parseAmount(item.amount);
    const field = quantity === null || quantity <= 0
      ? "quantity"
      : price === null || price < 0
        ? "amount"
        : shouldUseManualRate(getCategoryOrFallback(item.categoryId))
          ? "manual-rate"
          : "amount";
    window.requestAnimationFrame(() => {
      document.getElementById(`sst-item-${item.id}-${field}`)?.focus();
    });
  }

  return (
    <section
      aria-labelledby="sst-calculator-heading"
      className="w-full overflow-visible rounded-lg border border-slate-200 bg-white"
    >
      <h2 className="sr-only" id="sst-calculator-heading">
        SST calculator inputs and results
      </h2>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 px-5 py-3 md:px-8" role="group" aria-label="Calculator input mode">
        {([false, true] as const).map((useMultiple) => (
          <button
            aria-pressed={multipleItems === useMultiple}
            className={`min-h-11 border-b-2 px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 ${multipleItems === useMultiple ? "border-slate-900 text-slate-950" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"}`}
            key={String(useMultiple)}
            onClick={() => switchInputMode(useMultiple)}
            type="button"
          >
            {useMultiple ? "Multiple items" : "Single amount"}
          </button>
        ))}
      </div>

      {requiresMyr ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
          <p className="max-w-3xl text-sm leading-6 text-slate-700" role="status">
            The fixed RM25 option requires MYR. Enter prices in Malaysian ringgit.
            Switching currency keeps your entered numbers and does not convert them.
          </p>
          <button
            className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            id="sst-use-myr"
            onClick={() => { setCurrency("MYR"); setHasAttemptedExport(false); }}
            type="button"
          >
            Use MYR
          </button>
        </div>
      ) : null}

      <div className={multipleItems ? "" : "grid md:grid-cols-2"}>
      {multipleItems ? (
        <div className="p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 md:items-end">
            <ModeSelect mode={mode} onModeChange={(value) => { setMode(value); setHasAttemptedExport(false); }} />
            <p className="text-sm leading-6 text-slate-600">
              Choose an SST category for each item. {mode === "add" ? "Enter unit prices before SST." : "Enter unit prices that already include SST."}
            </p>
          </div>
          <div className="mt-6 space-y-6 divide-y divide-slate-200">
            {items.map((item, index) => (
              <SstItemRow
                canRemove={items.length > 1}
                currency={currency}
                formatCurrency={formatCurrency}
                index={index}
                item={item}
                key={item.id}
                line={itemCalculations[index].line}
                message={itemCalculations[index].message}
                mode={mode}
                onRemove={() => removeItem(item.id)}
                onUpdate={(changes) => updateItem(item.id, changes)}
                showError={hasAttemptedExport}
              />
            ))}
          </div>
          <button className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100" onClick={addItem} type="button">
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add item
          </button>
        </div>
      ) : (
      <div className="grid content-start gap-7 p-5 md:p-8">
        <label className="grid min-w-0 gap-2" htmlFor="sst-amount">
          <span className="text-sm font-semibold text-slate-950" id="sst-amount-label">
            1. Enter amount
          </span>
          <span className="flex h-11 min-w-0 overflow-hidden rounded-lg border border-stone-300 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
            <span className="flex h-full items-center border-r border-stone-200 bg-slate-50 px-3 text-sm font-medium text-slate-500" id="sst-amount-currency">
              {currency}
            </span>
            <input
              aria-describedby="sst-amount-hint"
              aria-labelledby="sst-amount-label sst-amount-currency"
              className="h-full min-w-0 flex-1 border-0 bg-white px-3 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
              id="sst-amount"
              inputMode="decimal"
              min="0"
              onChange={(event) => setAmount(event.target.value)}
              placeholder={mode === "add" ? "e.g. 1000" : "e.g. 1080"}
              step="0.01"
              type="number"
              value={amount}
            />
          </span>
          <span className="text-sm leading-6 text-slate-600" id="sst-amount-hint">
            {mode === "add" ? "Enter a price before SST." : "Enter a price that already includes SST."}
          </span>
        </label>

        <ModeSelect label="2. Add or remove SST" mode={mode} onModeChange={(value) => { setMode(value); setHasAttemptedExport(false); }} />

        <div className="grid min-w-0 gap-4">
          <CategorySelect
            categoryId={categoryId}
            id="sst-category"
            label="3. Choose category / rate"
            onChange={(nextCategoryId) => {
              setCategoryId(nextCategoryId);
              setManualRate("");
            }}
          />
          <ManualRateControls
            idPrefix="sst"
            manualRate={manualRate}
            manualRateEnabled={manualRateEnabled}
            onManualRateChange={setManualRate}
          />
        </div>
      </div>
      )}

      <div
        aria-live="polite"
        className={multipleItems ? "border-t border-slate-200 p-5 md:p-6" : "min-w-0 border-t border-slate-200 p-5 md:border-l md:border-t-0 md:p-8"}
      >
        {!multipleItems ? <h3 className="mb-6 text-base font-semibold text-slate-950">Your result</h3> : null}
        {incompleteCount > 0 ? (
          <div className="mb-5">
            {result ? <p className="font-semibold text-slate-900">Subtotal of completed items</p> : null}
            <p className={`mt-1 text-sm leading-6 ${hasAttemptedExport ? "text-red-700" : "text-slate-600"}`} role={hasAttemptedExport ? "alert" : undefined}>
              {incompleteCount} {incompleteCount === 1 ? "item unfinished" : "items unfinished"}.
              {result ? " Shown amounts include completed items only." : ""} Complete or remove unfinished items before copying or printing.
            </p>
          </div>
        ) : null}
        {line && result ? (
          <>
            {multipleItems ? <div className="grid gap-5 md:grid-cols-3">
              <ResultStat label={isComplete ? "Total SST" : "Subtotal SST"} value={formatCurrency(result.totalSst)} />
              <ResultStat
                label={mode === "add" ? (isComplete ? "Total including SST" : "Subtotal including SST") : (isComplete ? "Amount before SST" : "Subtotal before SST")}
                value={
                  mode === "add"
                    ? formatCurrency(result.grandTotalIncludingSst)
                    : formatCurrency(result.subtotalBeforeSst)
                }
              />
                <ResultStat
                  label={mode === "add" ? "Subtotal before SST" : (isComplete ? "Total including SST" : "Subtotal including SST")}
                  value={formatCurrency(mode === "add" ? result.subtotalBeforeSst : result.grandTotalIncludingSst)}
                />
            </div> : (
              <>
                <p className="text-sm font-medium text-slate-600">
                  {mode === "add" ? "Total including SST" : "Amount before SST"}
                </p>
                <p className="mt-2 break-words text-3xl font-semibold tabular-nums tracking-tight text-slate-950 sm:text-4xl">
                  {formatCurrency(mode === "add" ? result.grandTotalIncludingSst : result.subtotalBeforeSst)}
                </p>
                <dl className="mt-6 divide-y divide-slate-200 border-t border-slate-200 text-sm">
                  {([
                    [mode === "add" ? "Amount before SST" : "Total including SST", formatCurrency(mode === "add" ? result.subtotalBeforeSst : result.grandTotalIncludingSst)],
                    ["SST amount", formatCurrency(result.totalSst)],
                    ["SST rate", formatRateSummary(line)]
                  ] as const).map(([label, value]) => (
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4" key={label}>
                      <dt className="text-slate-600">{label}</dt>
                      <dd className="min-w-0 max-w-full break-words font-semibold tabular-nums text-slate-950">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            <SstResultActions
              isComplete={isComplete}
              onInvalidExport={handleInvalidExport}
              onReset={resetCalculator}
              rows={multipleItems ? [
                ["Calculation mode", mode === "add" ? "Add SST" : "Remove SST"],
                ["Number of items", String(items.length)],
                ["Currency", currency],
                ["Subtotal before SST", formatCurrency(result.subtotalBeforeSst)],
                ["Total SST", formatCurrency(result.totalSst)],
                ["Total including SST", formatCurrency(result.grandTotalIncludingSst)]
              ] : [
                ["Calculation mode", mode === "add" ? "Add SST" : "Remove SST"],
                ["Product or service category", category.label],
                ["Currency", currency],
                ["SST rate", formatRateSummary(line)],
                ["Amount before SST", formatCurrency(line.amountBeforeSst)],
                ["SST amount", formatCurrency(line.sstAmount)],
                ["Total including SST", formatCurrency(line.totalIncludingSst)]
              ]}
              sections={multipleItems ? result.lineItems.map((item, index) => ({
                title: `Item ${index + 1}: ${item.description}`,
                rows: [
                  ["Product or service category", item.categoryLabel],
                  ["Quantity", String(item.quantity)],
                  [mode === "add" ? "Unit price before SST" : "Unit price including SST", formatCurrency(item.unitPrice)],
                  ["SST rate", formatRateSummary(item)],
                  ["Amount before SST", formatCurrency(item.amountBeforeSst)],
                  ["SST amount", formatCurrency(item.sstAmount)],
                  ["Total including SST", formatCurrency(item.totalIncludingSst)]
                ]
              })) : undefined}
            />
          </>
        ) : (
          <div>
            {!multipleItems ? (
              <>
                <p className="text-sm font-medium text-slate-600">{mode === "add" ? "Total including SST" : "Amount before SST"}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-400" aria-hidden="true">—</p>
              </>
            ) : null}
            <p className={`${multipleItems ? "" : "mt-6 "}text-sm leading-6 text-slate-600`}>{calculation.message}</p>
            {multipleItems ? (
              <SstResultActions isComplete={false} onInvalidExport={handleInvalidExport} onReset={resetCalculator} rows={[]} />
            ) : amount || mode !== "add" || categoryId !== "service_general_taxable" ? (
              <button className="mt-6 min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100" onClick={resetCalculator} type="button">Reset</button>
            ) : null}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

function SstItemRow({
  canRemove, currency, formatCurrency, index, item, line, message, mode, onRemove, onUpdate, showError
}: {
  canRemove: boolean;
  currency: string;
  formatCurrency: (value: number) => string;
  index: number;
  item: SstItemDraft;
  line: CalculatedSstInvoiceLineItem | null;
  message: string;
  mode: SstCalculationMode;
  onRemove: () => void;
  onUpdate: (changes: Partial<SstItemDraft>) => void;
  showError: boolean;
}) {
  const prefix = `sst-item-${item.id}`;
  const category = getCategoryOrFallback(item.categoryId);
  const feedbackId = `${prefix}-feedback`;
  const prompt = category.rateType === "fixed" && currency !== "MYR"
    ? message
    : !item.amount.trim()
    ? "Enter a unit price to include this item."
    : !item.quantity.trim()
      ? "Enter a quantity to include this item."
      : shouldUseManualRate(category) && !item.manualRate.trim()
        ? "Enter an SST rate to include this item."
        : message;
  return (
    <fieldset className="min-w-0 border-0 p-0 pt-6 first:pt-0">
      <legend className="sr-only">Item {index + 1}</legend>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p aria-hidden="true" className="text-sm font-semibold text-slate-900">Item {index + 1}</p>
        <button
          aria-label={`Remove item ${index + 1}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!canRemove}
          onClick={onRemove}
          type="button"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" /> Remove
        </button>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.5fr)_minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <label className="grid min-w-0 gap-2" htmlFor={`${prefix}-description`}>
          <span className="text-xs font-medium text-slate-600">Description (optional)</span>
          <input className={inputClassName} id={`${prefix}-description`} maxLength={200} onChange={(event) => onUpdate({ description: event.target.value })} placeholder={`Item ${index + 1}`} type="text" value={item.description} />
        </label>
        <label className="grid min-w-0 gap-2" htmlFor={`${prefix}-quantity`}>
          <span className="text-xs font-medium text-slate-600">Quantity</span>
          <input aria-describedby={!line ? feedbackId : undefined} aria-invalid={showError && !line && (!item.quantity || Number(item.quantity) <= 0) ? true : undefined} className={inputClassName} id={`${prefix}-quantity`} inputMode="decimal" min="0" onChange={(event) => onUpdate({ quantity: event.target.value })} step="any" type="number" value={item.quantity} />
        </label>
        <label className="grid min-w-0 gap-2" htmlFor={`${prefix}-amount`}>
          <span className="text-xs font-medium text-slate-600">{mode === "add" ? "Unit price before SST" : "Unit price including SST"} ({currency})</span>
          <input aria-describedby={!line ? feedbackId : undefined} aria-invalid={showError && !line && (!item.amount || Number(item.amount) < 0 || message.includes("Fixed SST amount")) ? true : undefined} className={inputClassName} id={`${prefix}-amount`} inputMode="decimal" min="0" onChange={(event) => onUpdate({ amount: event.target.value })} placeholder="0.00" step="0.01" type="number" value={item.amount} />
        </label>
        <div className="grid min-w-0 content-start gap-3">
          <CategorySelect categoryId={item.categoryId} describedBy={!line ? feedbackId : undefined} id={`${prefix}-category`} label="Product or service category" onChange={(categoryId) => onUpdate({ categoryId, manualRate: "" })} />
          <ManualRateControls className="min-w-0" describedBy={!line ? feedbackId : undefined} invalid={showError && !line && (parseAmount(item.manualRate) === null || Number(item.manualRate) < 0 || Number(item.manualRate) > 100) ? true : undefined} idPrefix={prefix} manualRate={item.manualRate} manualRateEnabled={shouldUseManualRate(category)} onManualRateChange={(manualRate) => onUpdate({ manualRate })} />
        </div>
      </div>
      {line ? (
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          {([
            ["Amount before SST", line.amountBeforeSst],
            ["SST amount", line.sstAmount],
            ["Total including SST", line.totalIncludingSst]
          ] as const).map(([label, value]) => (
            <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-semibold tabular-nums text-slate-950">{formatCurrency(value)}</dd></div>
          ))}
        </dl>
      ) : <p className={`mt-3 text-sm ${showError ? "text-red-700" : "text-slate-600"}`} id={feedbackId}>{showError ? message : prompt}</p>}
    </fieldset>
  );
}

function ModeSelect({
  label = "Calculation mode",
  mode,
  onModeChange
}: {
  label?: string;
  mode: SstCalculationMode;
  onModeChange: (value: SstCalculationMode) => void;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-2 text-sm font-semibold text-slate-950">{label}</legend>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {(["add", "remove"] as const).map((value) => (
          <label
            className={`inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium transition hover:text-slate-950 ${mode === value ? "text-slate-950" : "text-slate-600"}`}
            key={value}
          >
            <input
              checked={mode === value}
              className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded-full accent-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              name="sst-calculation-mode"
              onChange={() => onModeChange(value)}
              type="radio"
              value={value}
            />
            {value === "add" ? "Add SST" : "Remove SST"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CategorySelect({
  categoryId,
  describedBy,
  id,
  label,
  onChange
}: {
  categoryId: SstCategoryId;
  describedBy?: string;
  id: string;
  label: string;
  onChange: (value: SstCategoryId) => void;
}) {
  return (
    <DropdownSelect
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
  describedBy,
  groups,
  id,
  label,
  onChange,
  options,
  value
}: {
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
      <span className="text-sm font-semibold text-slate-950" id={labelId}>
        {label}
      </span>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${buttonId}`}
        className="inline-flex h-11 w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-lg border border-stone-300 bg-white px-3 text-left text-sm font-semibold text-slate-950 transition hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100"
        id={buttonId}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setIsOpen((current) => !current);
        }}
        onKeyDown={handleButtonKeyDown}
        ref={buttonRef}
        type="button"
      >
        <span className="block min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap">
          {selectedOption?.label ?? "Select"}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-stone-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-40 mt-2 max-h-72 w-full min-w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1.5 shadow-lg shadow-stone-200/60"
          id={listboxId}
          role="listbox"
        >
          {normalizedGroups.map((group) => (
            <div key={group.label ?? "options"}>
              {group.label ? (
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
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
                        ? "bg-slate-50 font-semibold text-slate-900"
                        : "font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
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

function ManualRateControls({
  className = "md:col-start-3",
  describedBy,
  invalid,
  idPrefix,
  manualRate,
  manualRateEnabled,
  onManualRateChange
}: {
  className?: string;
  describedBy?: string;
  invalid?: boolean;
  idPrefix: string;
  manualRate: string;
  manualRateEnabled: boolean;
  onManualRateChange: (value: string) => void;
}) {
  if (!manualRateEnabled) {
    return null;
  }

  return (
    <label className={`grid gap-2 ${className}`} htmlFor={`${idPrefix}-manual-rate`}>
      <span className="text-xs font-medium text-slate-600">Manual SST rate (%)</span>
      <input
        aria-describedby={describedBy}
        aria-invalid={invalid}
        className={inputClassName}
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

function ResultStat({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0 md:first:border-l-0 md:first:pl-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {value}
      </p>
    </div>
  );
}
