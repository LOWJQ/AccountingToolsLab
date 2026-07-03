"use client";

import { Check, ChevronDown, RefreshCcw } from "lucide-react";
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
import { formatCurrency as formatCurrencyValue } from "@/lib/currency";
import {
  calculateSstInvoiceMalaysia,
  getSstCategoryById,
  SST_MALAYSIA_CATEGORIES,
  type SstCalculationMode,
  type SstCategoryId,
  type SstMalaysiaCategory
} from "@/lib/calculators/sst-malaysia";

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

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

  const [mode, setMode] = useState<SstCalculationMode>("add");
  const [amount, setAmount] = useState("1000");
  const [categoryId, setCategoryId] = useState<SstCategoryId>("service_general_taxable");
  const [manualRate, setManualRate] = useState("");

  const category = getCategoryOrFallback(categoryId);
  const manualRateEnabled = shouldUseManualRate(category);

  const calculation = useMemo(() => {
    if (!amount.trim()) {
      return { result: null, message: "Enter an amount to estimate SST." };
    }

    try {
      return {
        result: calculateSstInvoiceMalaysia({
          mode,
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
  }, [amount, category.label, categoryId, manualRate, manualRateEnabled, mode]);

  const line = calculation.result?.lineItems[0];

  function resetCalculator() {
    setMode("add");
    setAmount("1000");
    setCategoryId("service_general_taxable");
    setManualRate("");
  }

  return (
    <section
      aria-labelledby="sst-calculator-heading"
      className="mx-auto w-full max-w-6xl overflow-visible rounded-lg border border-slate-200 bg-white"
    >
      <h2 className="sr-only" id="sst-calculator-heading">
        SST calculator inputs and results
      </h2>

      <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:p-6">
        <ModeSelect mode={mode} onModeChange={setMode} />

        <CategorySelect
          categoryId={categoryId}
          id="sst-category"
          label="Product or service category"
          onChange={(nextCategoryId) => {
            setCategoryId(nextCategoryId);
            setManualRate("");
          }}
        />

        <label className="grid min-w-0 gap-2" htmlFor="sst-amount">
          <span className="text-xs font-medium text-slate-600">
            {mode === "add" ? "Amount before SST" : "Amount including SST"}
          </span>
          <span className="flex h-11 min-w-0 overflow-hidden rounded-lg border border-stone-300 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
            <span className="flex h-full items-center border-r border-stone-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">
              {currency}
            </span>
            <input
              className="h-full min-w-0 flex-1 border-0 bg-white px-3 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
              id="sst-amount"
              inputMode="decimal"
              min="0"
              onChange={(event) => setAmount(event.target.value)}
              placeholder={mode === "add" ? "1000" : "1080"}
              step="0.01"
              type="number"
              value={amount}
            />
          </span>
        </label>

        <ManualRateControls
          idPrefix="sst"
          manualRate={manualRate}
          manualRateEnabled={manualRateEnabled}
          onManualRateChange={setManualRate}
        />
      </div>

      <div
        aria-live="polite"
        className="border-t border-slate-200 p-5 md:p-6"
      >
        {line ? (
          <div className="grid gap-5 md:grid-cols-3">
            <ResultStat label="SST amount" value={formatCurrency(line.sstAmount)}>
              <button
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                onClick={resetCalculator}
                type="button"
              >
                <RefreshCcw aria-hidden="true" className="h-4 w-4" />
                Reset
              </button>
            </ResultStat>
            <ResultStat
              label={mode === "add" ? "Total including SST" : "Amount before SST"}
              value={
                mode === "add"
                  ? formatCurrency(line.totalIncludingSst)
                  : formatCurrency(line.amountBeforeSst)
              }
            />
            <ResultStat label="SST rate" value={formatRateSummary(line)} />
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-600">{calculation.message}</p>
        )}
      </div>
    </section>
  );
}

function ModeSelect({
  mode,
  onModeChange
}: {
  mode: SstCalculationMode;
  onModeChange: (value: SstCalculationMode) => void;
}) {
  return (
    <DropdownSelect
      id="sst-calculation-mode"
      label="Calculation mode"
      onChange={onModeChange}
      options={[
        { label: "Add SST (Amount before SST to Total including SST)", value: "add" },
        { label: "Remove SST (Total including SST to Amount before SST)", value: "remove" }
      ]}
      value={mode}
    />
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
      <span className="text-xs font-medium text-slate-600" id={labelId}>
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
    <label className="grid gap-2 md:col-start-3" htmlFor={`${idPrefix}-manual-rate`}>
      <span className="text-xs font-medium text-slate-600">Manual SST rate (%)</span>
      <input
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
  children,
  label,
  value
}: {
  children?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0 md:first:border-l-0 md:first:pl-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {value}
      </p>
      {children}
    </div>
  );
}
