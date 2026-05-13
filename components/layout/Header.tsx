"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, Menu, Search, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { getCompactCurrencyLabel, isCurrencyCode, searchCurrencies } from "@/lib/currency";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" }
];

function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const searchInputId = useId();
  const { currency, setCurrency } = useCurrency();
  const selectedLabel = getCompactCurrencyLabel(currency);
  const filteredCurrencies = useMemo(() => searchCurrencies(searchQuery), [searchQuery]);
  const selectedIndex = Math.max(filteredCurrencies.findIndex((option) => option.code === currency), 0);
  const activeCurrency = filteredCurrencies[activeIndex];
  const activeOptionId = activeCurrency ? `${listboxId}-${activeCurrency.code}` : undefined;

  function openSelector(index = selectedIndex) {
    setIsOpen(true);
    setActiveIndex(index);
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }

  function closeSelector({ returnFocus = true }: { returnFocus?: boolean } = {}) {
    setIsOpen(false);

    if (returnFocus) {
      window.requestAnimationFrame(() => {
        buttonRef.current?.focus();
      });
    }
  }

  function selectCurrency(index: number) {
    const option = filteredCurrencies[index];

    if (!option) {
      return;
    }

    if (!isCurrencyCode(option.code)) {
      return;
    }

    setCurrency(option.code);
    setSearchQuery("");
    closeSelector();
  }

  function moveActiveOption(index: number) {
    const lastIndex = filteredCurrencies.length - 1;

    if (lastIndex < 0) {
      setActiveIndex(0);
      return;
    }

    const nextIndex = Math.min(Math.max(index, 0), lastIndex);

    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.scrollIntoView({ block: "nearest" });
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeSelector({ returnFocus: false });
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const nextSelectedIndex = filteredCurrencies.findIndex((option) => option.code === currency);

    setActiveIndex(nextSelectedIndex >= 0 ? nextSelectedIndex : 0);
  }, [currency, filteredCurrencies]);

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openSelector(isOpen ? Math.min(activeIndex + 1, filteredCurrencies.length - 1) : selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openSelector(isOpen ? Math.max(activeIndex - 1, 0) : selectedIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      openSelector(0);
    } else if (event.key === "End") {
      event.preventDefault();
      openSelector(filteredCurrencies.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      openSelector(isOpen ? activeIndex : selectedIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSelector();
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveOption(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveOption(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveActiveOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveActiveOption(filteredCurrencies.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      if (event.key !== " " || searchQuery.trim() === "") {
        event.preventDefault();
        selectCurrency(activeIndex);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setSearchQuery("");
      closeSelector();
    }
  }

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select currency"
        className="inline-flex h-10 w-32 items-center justify-between gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
        onClick={() => {
          if (isOpen) {
            closeSelector();
          } else {
            setSearchQuery("");
            openSelector(selectedIndex);
          }
        }}
        onKeyDown={handleButtonKeyDown}
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
          className="absolute left-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg shadow-stone-200/60 sm:left-auto sm:right-0"
        >
          <div className="border-b border-stone-100 p-3">
            <label className="relative block" htmlFor={searchInputId}>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              />
              <input
                aria-activedescendant={activeOptionId}
                aria-controls={listboxId}
                aria-expanded={isOpen}
                aria-label="Search currencies"
                autoComplete="off"
                className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                id={searchInputId}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search code, name, country"
                ref={searchInputRef}
                role="combobox"
                value={searchQuery}
              />
            </label>
          </div>

          <div
            className="max-h-80 overflow-y-auto py-1.5"
            id={listboxId}
            role="listbox"
          >
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((option, index) => {
                const isActive = activeIndex === index;
                const isSelected = option.code === currency;
                const optionId = `${listboxId}-${option.code}`;

                return (
                  <button
                    aria-selected={isSelected}
                    className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 px-3 py-2.5 text-left text-sm transition ${
                      isSelected
                        ? "bg-slate-50 text-slate-800"
                        : isActive
                          ? "bg-stone-50 text-stone-950"
                          : "text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                    }`}
                    id={optionId}
                    key={option.code}
                    onClick={() => {
                      selectCurrency(index);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    role="option"
                    tabIndex={-1}
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0 font-semibold text-stone-950">{option.code}</span>
                        <span className="shrink-0 text-stone-500">{option.symbol}</span>
                        <span className="min-w-0 truncate font-medium">{option.name}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-stone-500">
                        {option.countries.join(", ")}
                      </span>
                    </span>
                    {isSelected ? <Check aria-hidden="true" className="h-4 w-4 text-slate-700" /> : null}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-6 text-center text-sm font-medium text-stone-500">
                No currencies found.
              </p>
            )}
          </div>
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
