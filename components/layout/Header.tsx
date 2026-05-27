"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  X
} from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { getCompactCurrencyLabel, isCurrencyCode, searchCurrencies } from "@/lib/currency";
import { guides } from "@/lib/data/guides";

type DesktopMenuKey = "guides" | "tools";

type MenuItem = {
  description: string;
  href: string;
  label: string;
};

type MegaMenuConfig = {
  eyebrow: string;
  items: MenuItem[];
  summary: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
};

const toolItems: MenuItem[] = [
  {
    label: "Invoice Generator",
    href: "/tools/invoice-generator",
    description: "Create professional invoices with MYR, SST, and PDF export."
  },
  {
    label: "SST Calculator Malaysia",
    href: "/tools/sst-calculator-malaysia",
    description: "Calculate SST-inclusive and SST-exclusive prices."
  },
  {
    label: "Trial Balance Calculator",
    href: "/tools/trial-balance-calculator",
    description: "Check debit and credit totals easily."
  },
  {
    label: "Cash Flow Calculator",
    href: "/tools/cash-flow-calculator",
    description: "Review cash inflows, outflows, and net cash flow."
  },
  {
    label: "Break-even Calculator",
    href: "/tools/break-even-calculator",
    description: "Find the sales needed to cover your costs."
  },
  {
    label: "Accounting Equation Calculator",
    href: "/tools/accounting-equation-calculator",
    description: "Check assets, liabilities, and equity."
  },
  {
    label: "Debit/Credit Checker",
    href: "/tools/debit-credit-checker",
    description: "Learn whether an account should be debited or credited."
  },
  {
    label: "Financial Ratio Calculator",
    href: "/tools/financial-ratio-calculator",
    description: "Calculate useful business and accounting ratios."
  },
  {
    label: "Depreciation Calculator",
    href: "/tools/depreciation-calculator",
    description: "Estimate depreciation using common methods."
  },
  {
    label: "Journal Entry Checker",
    href: "/tools/journal-entry-checker",
    description: "Review simple journal entry logic."
  }
];

const guideItems: MenuItem[] = guides
  .filter((guide) => guide.status === "available")
  .map((guide) => ({
    label: guide.title,
    href: guide.href,
    description: guide.menuDescription
  }));

const megaMenus: Record<DesktopMenuKey, MegaMenuConfig> = {
  tools: {
    eyebrow: "Tools",
    title: "Accounting tools",
    summary: "Open the calculators and checkers people use most for everyday accounting work.",
    items: toolItems,
    viewAllHref: "/tools",
    viewAllLabel: "View all tools"
  },
  guides: {
    eyebrow: "Guides",
    title: "Accounting guides",
    summary: "Browse practical walkthroughs for invoices, bookkeeping, SST, and accounting basics.",
    items: guideItems,
    viewAllHref: "/guides",
    viewAllLabel: "View all guides"
  }
};

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

    if (!option || !isCurrencyCode(option.code)) {
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

  function handleButtonKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
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

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
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
        <div className="absolute left-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg shadow-stone-200/60 sm:left-auto sm:right-0">
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

          <div className="max-h-80 overflow-y-auto py-1.5" id={listboxId} role="listbox">
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

function MegaMenuPanel({
  menuKey,
  onNavigate,
  panelRef
}: {
  menuKey: DesktopMenuKey;
  onNavigate: () => void;
  panelRef: RefObject<HTMLDivElement>;
}) {
  const menu = megaMenus[menuKey];

  return (
    <div className="absolute inset-x-0 top-full pt-1" ref={panelRef}>
      <div className="mx-auto max-w-[1400px] px-3 sm:px-5 lg:px-6">
        <div className="overflow-hidden border border-stone-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="border-b border-stone-100 bg-stone-50/70 p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                {menu.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
                {menu.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{menu.summary}</p>
            </div>

            <div className="max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain p-5 sm:p-6 lg:p-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {menu.items.map((item) => (
                  <Link
                    className="group rounded-2xl border border-transparent p-4 transition hover:border-stone-200 hover:bg-stone-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                    href={item.href}
                    key={item.href}
                    onClick={onNavigate}
                  >
                    <p className="text-sm font-semibold text-stone-950 transition group-hover:text-teal-700">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-stone-500">{item.description}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-4 border-t border-stone-100 pt-4">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  href={menu.viewAllHref}
                  onClick={onNavigate}
                >
                  {menu.viewAllLabel}
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenuKey | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<DesktopMenuKey | null>(null);
  const [headerOffset, setHeaderOffset] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopMenuPanelRef = useRef<HTMLDivElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const guidesButtonRef = useRef<HTMLButtonElement>(null);

  function closeAllMenus() {
    setDesktopMenu(null);
    setIsMobileMenuOpen(false);
    setMobileExpandedSection(null);
  }

  function openDesktopMenu(menu: DesktopMenuKey) {
    setDesktopMenu(menu);
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeAllMenus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!desktopMenu) {
        return;
      }

      const target = event.target as Node;
      const activeButton =
        desktopMenu === "tools" ? toolsButtonRef.current : guidesButtonRef.current;
      const targetMenu = toolsButtonRef.current?.contains(target)
        ? "tools"
        : guidesButtonRef.current?.contains(target)
          ? "guides"
          : null;
      const activeButtonRect = activeButton?.getBoundingClientRect();
      const panelRect = desktopMenuPanelRef.current?.getBoundingClientRect();
      const isBetweenActiveButtonAndPanel =
        activeButtonRect &&
        panelRect &&
        event.clientX >= panelRect.left &&
        event.clientX <= panelRect.right &&
        event.clientY >= activeButtonRect.bottom &&
        event.clientY <= panelRect.top;

      if (targetMenu) {
        setDesktopMenu(targetMenu);
        return;
      }

      if (
        activeButton?.contains(target) ||
        desktopMenuPanelRef.current?.contains(target) ||
        isBetweenActiveButtonAndPanel
      ) {
        return;
      }

      setDesktopMenu(null);
    }

    document.addEventListener("pointermove", handlePointerMove);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, [desktopMenu]);

  useEffect(() => {
    function handleWindowScroll() {
      setDesktopMenu(null);
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    let previousScrollY = window.scrollY;

    function updateHeaderOffset() {
      frameId = 0;

      const currentScrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 0;

      if (currentScrollY <= 0 || headerHeight <= 0) {
        previousScrollY = 0;
        setHeaderOffset(0);
        return;
      }

      const scrollDelta = currentScrollY - previousScrollY;
      previousScrollY = currentScrollY;

      setHeaderOffset((currentOffset) => {
        const nextOffset = currentOffset + scrollDelta;
        return Math.min(Math.max(nextOffset, 0), headerHeight);
      });
    }

    function handleScroll() {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateHeaderOffset);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  function handleDesktopBlur() {
    window.requestAnimationFrame(() => {
      if (!desktopNavRef.current?.contains(document.activeElement)) {
        setDesktopMenu(null);
      }
    });
  }

  const headerHeight = headerRef.current?.offsetHeight ?? 64;
  const visibilityProgress = headerHeight > 0 ? 1 - headerOffset / headerHeight : 1;

  return (
    <header
      className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur transition-[transform,opacity] duration-300 ease-out will-change-transform"
      ref={headerRef}
      style={{
        opacity: Math.max(visibilityProgress, 0),
        transform: `translateY(-${headerOffset}px)`
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-3 sm:px-5 lg:px-6">
        <Link className="flex shrink-0 items-center" href="/" aria-label="AccountingToolsLab home">
          <Image
            alt="AccountingToolsLab"
            className="h-auto w-[185px] sm:w-[220px]"
            height={52}
            priority
            src="/logo-optimized.png"
            width={220}
          />
        </Link>

        <div
          className="hidden flex-1 sm:block"
          onBlurCapture={handleDesktopBlur}
          ref={desktopNavRef}
        >
          <nav className="flex items-center justify-center gap-2 text-sm font-medium text-stone-600">
            <button
              aria-expanded={desktopMenu === "tools"}
              aria-haspopup="dialog"
              className={`inline-flex h-10 items-center gap-1 rounded-full px-4 transition focus:outline-none focus:ring-4 focus:ring-slate-100 ${
                desktopMenu === "tools"
                  ? "bg-stone-100 text-stone-950"
                  : "hover:bg-stone-50 hover:text-stone-950"
              }`}
              onClick={() => openDesktopMenu("tools")}
              onFocus={() => openDesktopMenu("tools")}
              onMouseEnter={() => openDesktopMenu("tools")}
              ref={toolsButtonRef}
              type="button"
            >
              <span>Tools</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition ${desktopMenu === "tools" ? "rotate-180" : ""}`}
              />
            </button>

            <button
              aria-expanded={desktopMenu === "guides"}
              aria-haspopup="dialog"
              className={`inline-flex h-10 items-center gap-1 rounded-full px-4 transition focus:outline-none focus:ring-4 focus:ring-slate-100 ${
                desktopMenu === "guides"
                  ? "bg-stone-100 text-stone-950"
                  : "hover:bg-stone-50 hover:text-stone-950"
              }`}
              onClick={() => openDesktopMenu("guides")}
              onFocus={() => openDesktopMenu("guides")}
              onMouseEnter={() => openDesktopMenu("guides")}
              ref={guidesButtonRef}
              type="button"
            >
              <span>Guides</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition ${desktopMenu === "guides" ? "rotate-180" : ""}`}
              />
            </button>

            <Link
              className="inline-flex h-10 items-center rounded-full px-4 transition hover:bg-stone-50 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-slate-100"
              href="/about"
              onMouseEnter={() => setDesktopMenu(null)}
            >
              About
            </Link>
          </nav>

          {desktopMenu ? (
            <MegaMenuPanel
              menuKey={desktopMenu}
              onNavigate={() => setDesktopMenu(null)}
              panelRef={desktopMenuPanelRef}
            />
          ) : null}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <CurrencySelector />
          </div>

          <button
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:border-stone-300 hover:text-stone-950 sm:hidden"
            onClick={() => {
              setIsMobileMenuOpen((current) => !current);
              setDesktopMenu(null);
            }}
            type="button"
          >
            {isMobileMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <nav className="absolute inset-x-0 top-16 z-20 border-b border-stone-200 bg-white px-4 py-3 shadow-sm sm:hidden">
          <div className="mx-auto flex max-w-[1240px] flex-col rounded-3xl border border-stone-200 bg-white p-2 text-sm text-stone-600 shadow-lg shadow-stone-200/50">
            <div className="border-b border-stone-100 p-2 pb-4">
              <CurrencySelector />
            </div>

            {(["tools", "guides"] as DesktopMenuKey[]).map((sectionKey) => {
              const menu = megaMenus[sectionKey];
              const isExpanded = mobileExpandedSection === sectionKey;

              return (
                <div className="border-b border-stone-100 last:border-b-0" key={sectionKey}>
                  <button
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between px-2 py-4 text-left text-sm font-semibold text-stone-900"
                    onClick={() =>
                      setMobileExpandedSection((current) =>
                        current === sectionKey ? null : sectionKey
                      )
                    }
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      {menu.eyebrow}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 text-stone-500 transition ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded ? (
                    <div className="grid gap-1 px-2 pb-4">
                      {menu.items.map((item) => (
                        <Link
                          className="rounded-2xl px-3 py-3 transition hover:bg-stone-50"
                          href={item.href}
                          key={item.href}
                          onClick={() => closeAllMenus()}
                        >
                          <p className="font-semibold text-stone-900">{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-stone-500">{item.description}</p>
                        </Link>
                      ))}
                      <Link
                        className="px-3 pt-2 text-sm font-semibold text-teal-700"
                        href={menu.viewAllHref}
                        onClick={() => closeAllMenus()}
                      >
                        {menu.viewAllLabel}
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}

            <Link
              className="px-4 py-4 text-sm font-semibold text-stone-900 transition hover:text-stone-950"
              href="/about"
              onClick={() => closeAllMenus()}
            >
              About
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
