"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, Menu, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();
  const selectedLabel = getCompactCurrencyLabel(currency);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative inline-flex" onKeyDown={handleKeyDown} ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select currency"
        className="inline-flex h-10 w-32 items-center justify-between gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
        onClick={() => setIsOpen((current) => !current)}
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
          role="listbox"
        >
          {currencyOptions.map((option) => {
            const isSelected = option.code === currency;

            return (
              <button
                aria-selected={isSelected}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-slate-50 font-semibold text-slate-800"
                    : "font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                }`}
                key={option.code}
                onClick={() => {
                  setCurrency(option.code);
                  setIsOpen(false);
                }}
                role="option"
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

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
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
