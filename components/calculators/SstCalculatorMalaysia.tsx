"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
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
  "h-12 w-full min-w-0 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

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
      label: category.label,
      value: category.id
    }))
  })
);

const mistakes = [
  "Confirm whether your entered amount is before SST or already includes SST.",
  "Check the taxable category before using a suggested rate for invoicing or filing.",
  "Use special fixed-amount categories carefully because they are not normal percentage SST.",
  "Treat this tool as an estimate, not official tax advice."
];

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

function formatPercent(value: number | null): string {
  return value === null ? "-" : `${value.toFixed(2)}%`;
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="rounded-[1.5rem] border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                SST Calculator Malaysia
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                Estimate SST amounts quickly for Malaysia business checks.
              </p>
            </div>

            <ModeSelect mode={mode} onModeChange={setMode} />

            <label className="grid gap-2" htmlFor="sst-amount">
              <span className="text-sm font-semibold text-stone-800">
                {mode === "add" ? "Amount before SST" : "Amount including SST"}
              </span>
              <input
                className={inputClassName}
                id="sst-amount"
                inputMode="decimal"
                min="0"
                onChange={(event) => setAmount(event.target.value)}
                placeholder={mode === "add" ? "1000" : "1080"}
                step="0.01"
                type="number"
                value={amount}
              />
            </label>

            <CategorySelect
              categoryId={categoryId}
              describedBy={manualRateEnabled ? undefined : "sst-category-note"}
              id="sst-category"
              label="Product or service category"
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

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                onClick={resetCalculator}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
        </Card>

        <Card
          aria-live="polite"
          className="rounded-[1.5rem] border-stone-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Result</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            {mode === "add" ? "Add SST estimate" : "Remove SST estimate"}
          </h2>

          {line ? (
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 sm:p-6">
                <p className="text-sm font-medium text-stone-600">
                  {mode === "add" ? "Total including SST" : "Amount before SST"}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                  {mode === "add"
                    ? formatCurrency(line.totalIncludingSst)
                    : formatCurrency(line.amountBeforeSst)}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultStat label="SST rate" value={formatRateSummary(line)} />
                <ResultStat
                  accent
                  label="SST amount"
                  value={formatCurrency(line.sstAmount)}
                />
              </div>

              <ResultStat
                label={mode === "add" ? "Amount before SST" : "Total including SST"}
                value={
                  mode === "add"
                    ? formatCurrency(line.amountBeforeSst)
                    : formatCurrency(line.totalIncludingSst)
                }
              />
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-stone-600">{calculation.message}</p>
          )}
        </Card>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <p className="text-sm font-medium tracking-wide text-slate-500">How it works</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Clear SST summary for fast checks
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-stone-400">
                {"\u2192"}
              </span>
              <span>Add SST: total including SST = amount before SST + SST amount</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-stone-400">
                {"\u2192"}
              </span>
              <span>Remove SST: amount before SST = amount including SST / (1 + SST rate)</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-stone-400">
                {"\u2192"}
              </span>
              <span>
                Special fixed SST categories are shown separately and do not use a percentage
                formula.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Checks to make</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Before you rely on the estimate
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {mistakes.map((mistake) => (
              <li className="flex gap-3" key={mistake}>
                <span aria-hidden="true" className="text-stone-400">
                  {"\u2192"}
                </span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Keep your records and estimates aligned
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Pair this SST estimate with your invoice, cash flow, and ratio checks.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
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
      </section>
    </div>
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
        { label: "Add SST", value: "add" },
        { label: "Remove SST", value: "remove" }
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
      <span className="text-sm font-semibold text-stone-800" id={labelId}>
        {label}
      </span>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${buttonId}`}
        className="inline-flex h-12 w-full items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-left text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
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
          className="absolute left-0 top-full z-40 mt-2 max-h-72 w-full min-w-full overflow-y-auto rounded-2xl border border-stone-200 bg-white py-1.5 shadow-lg shadow-stone-200/60"
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
  accent = false,
  label,
  value
}: {
  accent?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p
        className={`mt-2 text-xl font-semibold tracking-tight ${
          accent ? "text-teal-700" : "text-stone-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
