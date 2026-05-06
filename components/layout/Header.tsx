"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { currencyOptions, isCurrencyCode } from "@/lib/currency";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  function handleCurrencyChange(value: string) {
    if (isCurrencyCode(value)) {
      setCurrency(value);
    }
  }

  const currencySelector = (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600">
      <span className="sr-only">Currency</span>
      <select
        aria-label="Currency"
        className="h-10 rounded-full border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 outline-none transition hover:border-stone-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
        onChange={(event) => handleCurrencyChange(event.target.value)}
        value={currency}
      >
        {currencyOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <header className="relative border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center" href="/" aria-label="AccountingToolsLab home">
          <Image
            alt="AccountingToolsLab"
            className="h-auto w-[185px] sm:w-[220px]"
            height={52}
            priority
            src="/logo.png"
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
          <div className="hidden sm:block">{currencySelector}</div>

          <Link
            className="inline-flex h-10 items-center justify-center rounded-full bg-slate-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            href="/tools"
          >
            Start
          </Link>

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
          <div className="mx-auto flex max-w-6xl flex-col text-sm font-medium text-stone-600">
            <div className="border-b border-stone-100 pb-3">{currencySelector}</div>
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
