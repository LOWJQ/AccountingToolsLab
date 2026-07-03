"use client";

import { Check, ChevronDown, RotateCcw } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  checkDebitCredit,
  type AccountEffect,
  type AccountType
} from "@/lib/calculators/debit-credit";

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

const accountOptions: Array<DropdownOption<AccountType | "">> = [
  { label: "Select account type", value: "" },
  { label: "Asset", value: "asset" },
  { label: "Liability", value: "liability" },
  { label: "Equity", value: "equity" },
  { label: "Revenue", value: "revenue" },
  { label: "Expense", value: "expense" },
  { label: "Dividends/Drawings", value: "dividends" }
];

const effectOptions: Array<DropdownOption<AccountEffect | "">> = [
  { label: "Select increase or decrease", value: "" },
  { label: "Increase", value: "increase" },
  { label: "Decrease", value: "decrease" }
];

export function DebitCreditChecker() {
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [effect, setEffect] = useState<AccountEffect | "">("");

  const result = useMemo(() => {
    try {
      return {
        value: checkDebitCredit({
          accountType: accountType || null,
          effect: effect || null
        }),
        message: ""
      };
    } catch (error) {
      return {
        value: null,
        message: error instanceof Error ? error.message : "Choose an account type and effect."
      };
    }
  }, [accountType, effect]);

  function resetChecker() {
    setAccountType("");
    setEffect("");
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="grid gap-5">
          <DropdownSelect
            id="debit-credit-account-type"
            label="Account type"
            onChange={(value) => setAccountType(value as AccountType | "")}
            options={accountOptions}
            value={accountType}
          />

          <DropdownSelect
            id="debit-credit-effect"
            label="Effect"
            onChange={(value) => setEffect(value as AccountEffect | "")}
            options={effectOptions}
            value={effect}
          />

          <button
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={resetChecker}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-xs font-semibold uppercase text-slate-500">Answer</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {result.value ? result.value.answer : "—"}
          </p>
          <p className="mt-4 text-base leading-7 text-black">
            {result.value ? result.value.explanation : result.message}
          </p>
          {result.value ? (
            <p className="mt-5 text-base leading-7 text-black">
              <span className="font-semibold">Normal balance:</span> {result.value.normalBalance}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DropdownSelect<T extends string>({
  id,
  label,
  onChange,
  options,
  value
}: {
  id: string;
  label: string;
  onChange: (value: T) => void;
  options: Array<DropdownOption<T>>;
  value: T;
}) {
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  );
  const selectedOption = options[selectedIndex];
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
    const option = options[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function moveOptionFocus(index: number) {
    const lastIndex = options.length - 1;
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
      openAndFocusOption(isOpen ? Math.min(activeIndex + 1, options.length - 1) : selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocusOption(isOpen ? Math.max(activeIndex - 1, 0) : selectedIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      openAndFocusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      openAndFocusOption(options.length - 1);
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
      moveOptionFocus(options.length - 1);
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
      <span className="text-sm font-semibold text-slate-900" id={labelId}>
        {label}
      </span>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${buttonId}`}
        className="inline-flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 text-left text-base font-medium text-black transition hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100"
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
          className={`h-4 w-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-40 mt-2 max-h-72 w-full min-w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-200/60"
          id={listboxId}
          role="listbox"
        >
          {options.map((option, optionIndex) => {
            const isSelected = option.value === value;

            return (
              <button
                aria-selected={isSelected}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-slate-50 font-semibold text-slate-800"
                    : "font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
                id={`${listboxId}-${optionIndex}`}
                key={`${id}-${option.value || "empty"}`}
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
      ) : null}
    </div>
  );
}
