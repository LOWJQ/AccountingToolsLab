"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, Menu, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { currencyOptions } from "@/lib/currency";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" }
];

function getCompactCurrencyLabel(code: string) {
  const option = currencyOptions.find((currencyOption) => currencyOption.code === code);

  return option ? `${option.code} (${option.symbol})` : code;
}

function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const { currency, setCurrency } = useCurrency();
  const selectedLabel = getCompactCurrencyLabel(currency);
  const selectedIndex = Math.max(
    currencyOptions.findIndex((option) => option.code === currency),
    0
  );

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function openAndFocusOption(index: number) {
    setIsOpen(true);
    setActiveIndex(index);
    window.requestAnimationFrame(() => focusOption(index));
  }

  function selectCurrency(index: number) {
    const option = currencyOptions[index];

    if (!option) {
      return;
    }

    setCurrency(option.code);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function moveOptionFocus(index: number) {
    const lastIndex = currencyOptions.length - 1;
    const nextIndex = Math.min(Math.max(index, 0), lastIndex);

    setActiveIndex(nextIndex);
    focusOption(nextIndex);
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== buttonRef.current) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocusOption(isOpen ? Math.min(activeIndex + 1, currencyOptions.length - 1) : selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocusOption(isOpen ? Math.max(activeIndex - 1, 0) : selectedIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      openAndFocusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      openAndFocusOption(currencyOptions.length - 1);
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
      moveOptionFocus(currencyOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      selectCurrency(index);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div className="relative inline-flex" onKeyDown={handleKeyDown} ref={rootRef}>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select currency"
        className="inline-flex h-10 w-32 items-center justify-between gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
        onClick={() => {
          setActiveIndex(selectedIndex);
          setIsOpen((current) => !current);
        }}
        ref={buttonRef}
        type="button"
      >
        <span className="whitespace-nowrap">{selectedLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 text-stone-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-40 mt-2 w-32 overflow-hidden rounded-xl border border-stone-200 bg-white py-1.5 shadow-lg shadow-stone-200/60"
          id={listboxId}
          role="listbox"
        >
          {currencyOptions.map((option, index) => {
            const isSelected = option.code === currency;
            const optionId = `${listboxId}-${option.code}`;

            return (
              <button
                aria-selected={isSelected}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-slate-50 font-semibold text-slate-800"
                    : "font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                }`}
                id={optionId}
                key={option.code}
                onClick={() => {
                  selectCurrency(index);
                }}
                onFocus={() => setActiveIndex(index)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="option"
                tabIndex={activeIndex === index ? 0 : -1}
                type="button"
              >
                <span>{getCompactCurrencyLabel(option.code)}</span>
                {isSelected ? <Check aria-hidden="true" className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur"
      ref={headerRef}
    >
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center" href="/" aria-label="AccountingToolsLab home">
          <Image
            alt="AccountingToolsLab"
            className="h-auto w-[185px] sm:w-[220px]"
            height={52}
            priority
            src="/logo-optimized.png"
            width={220}
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 sm:flex">
          {navItems.map((item) => (
            <Link className="transition hover:text-stone-950" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CurrencySelector />
          </div>

          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:border-stone-300 hover:text-stone-950 sm:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="absolute inset-x-0 top-16 z-20 border-b border-stone-200 bg-white px-4 py-3 shadow-sm sm:hidden">
          <div className="mx-auto flex max-w-[1080px] flex-col text-sm font-medium text-stone-600">
            <div className="border-b border-stone-100 pb-3">
              <CurrencySelector />
            </div>
            {navItems.map((item) => (
              <Link
                className="py-3 transition hover:text-stone-950"
                href={item.href}
                key={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
