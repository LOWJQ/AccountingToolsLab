"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectMenuOption<T extends string> = {
  label: string;
  value: T;
};

type SelectMenuProps<T extends string> = {
  ariaLabel?: string;
  className?: string;
  id?: string;
  onChange: (value: T) => void;
  options: SelectMenuOption<T>[];
  value: T;
};

/**
 * Listbox styled to match the currency selector in the header rather than a
 * bare native <select>, whose menu is drawn by the operating system and cannot
 * be made to match the rest of the form.
 *
 * Keyboard behaviour follows the same pattern: arrows move, Home and End jump,
 * Enter or Space selects, Escape closes and returns focus to the button.
 */
export function SelectMenu<T extends string>({
  ariaLabel,
  className,
  id,
  onChange,
  options,
  value
}: SelectMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

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

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function openAt(index: number) {
    setIsOpen(true);
    setActiveIndex(index);
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus());
  }

  function selectAt(index: number) {
    const option = options[index];

    if (!option) {
      return;
    }

    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function moveFocus(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), options.length - 1);

    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAt(selectedIndex);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      openAt(selectedIndex);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(options.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      selectAt(index);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div className={`relative min-w-0 ${className ?? ""}`} ref={rootRef}>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="inline-flex h-10 w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-lg border border-slate-200 bg-white px-3 text-left text-sm text-slate-950 transition hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100"
        id={id}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setIsOpen((current) => !current);
        }}
        onKeyDown={handleButtonKeyDown}
        ref={buttonRef}
        type="button"
      >
        <span className="block min-w-0 flex-1 truncate">{selectedOption?.label ?? "Select"}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-200/60"
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <button
                aria-selected={isSelected}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-slate-50 font-semibold text-slate-900"
                    : "font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
                key={option.value}
                onClick={() => selectAt(index)}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="option"
                tabIndex={activeIndex === index ? 0 : -1}
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
