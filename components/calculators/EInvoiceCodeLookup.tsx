"use client";

import { Check, ChevronLeft, ChevronRight, Copy, Search } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { toolButtonClass } from "@/components/tools/ToolWorkspace";
import { CLASSIFICATION_CODES } from "@/lib/data/einvoice/classification-codes";
import { paginateCodes, searchEInvoiceCodes } from "@/lib/einvoice/code-search";
import type { EInvoiceCode, MsicCode } from "@/lib/einvoice/einvoice-types";

/**
 * The MSIC list is the heavy one, so it loads on demand rather than on page
 * view, mirroring how the header loads lib/currency-search. Warmed when the tab
 * is hovered or focused, which means it is usually ready before the tab opens;
 * a direct tap falls back to a brief loading row.
 */
type MsicSearchModule = typeof import("@/lib/einvoice/msic-search");

let msicSearchPromise: Promise<MsicSearchModule> | null = null;

function loadMsicSearch(): Promise<MsicSearchModule> {
  msicSearchPromise ??= import("@/lib/einvoice/msic-search");

  return msicSearchPromise;
}

type CodeListId = "classification" | "msic";

const tabs: { description: string; id: CodeListId; label: string }[] = [
  {
    description: "The three-digit code that goes on every e-Invoice line item.",
    id: "classification",
    label: "Line item codes"
  },
  {
    description: "The five-digit MSIC code describing what your business does.",
    id: "msic",
    label: "Business activity codes"
  }
];

const noMatches: (EInvoiceCode | MsicCode)[] = [];

export function EInvoiceCodeLookup() {
  const [activeTab, setActiveTab] = useState<CodeListId>("classification");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // Kept as text, not a number, so the field can be empty mid-typing without
  // snapping the list back to page 1 on every keystroke.
  const [pageInput, setPageInput] = useState("1");
  const [msicSearch, setMsicSearch] = useState<MsicSearchModule | null>(null);
  const [loadError, setLoadError] = useState("");
  const [copyError, setCopyError] = useState("");
  const tabId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const searchInputId = useId();
  const pageInputId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  const prefetchMsic = useCallback(() => {
    if (msicSearch) {
      return;
    }

    setLoadError("");
    void loadMsicSearch().then((msicModule) => {
      setMsicSearch(() => msicModule);
    }).catch(() => {
      msicSearchPromise = null;
      setLoadError("The business activity codes could not load. Try again.");
    });
  }, [msicSearch]);

  // Loading only starts once the MSIC tab is actually selected or warmed, so a
  // visitor who only ever needs a line item code never downloads the big list.
  useEffect(() => {
    if (activeTab === "msic") {
      prefetchMsic();
    }
  }, [activeTab, prefetchMsic]);

  useEffect(() => {
    if (copiedCode === null) {
      return;
    }

    const timer = window.setTimeout(() => setCopiedCode(null), 1600);

    return () => window.clearTimeout(timer);
  }, [copiedCode]);

  const isLoadingMsic = activeTab === "msic" && msicSearch === null;

  const matches = useMemo<(EInvoiceCode | MsicCode)[]>(() => {
    if (activeTab === "classification") {
      return searchEInvoiceCodes(CLASSIFICATION_CODES, query);
    }

    return msicSearch?.searchMsicCodes(query) ?? noMatches;
  }, [activeTab, msicSearch, query]);

  // paginateCodes clamps, so a page left over from a longer result set still
  // renders the last valid page instead of an empty one.
  const result = paginateCodes(matches, page);

  /**
   * Jumps to the top of the tool. Paging from the bottom of a long list would
   * otherwise leave the reader looking at the end of the next page.
   *
   * Deliberately an instant jump rather than a smooth one: smooth scrolling is
   * silently ignored in some environments, which left paging with no scroll at
   * all. scroll-mt-24 on the section keeps the sticky header from covering it.
   */
  function scrollToTop() {
    sectionRef.current?.scrollIntoView({ block: "start" });
  }

  function goToPage(nextPage: number) {
    setPage(nextPage);
    setPageInput(String(nextPage));
    scrollToTop();
  }

  function resetPaging() {
    setPage(1);
    setPageInput("1");
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setCopyError("");
    } catch {
      // Clipboard access can be blocked; the code is on screen to copy by hand.
      setCopiedCode(null);
      setCopyError(`Could not copy ${code}. Select the code and copy it manually.`);
    }
  }

  return (
    <section
      aria-labelledby="e-invoice-code-lookup-heading"
      className="w-full min-w-0 scroll-mt-24 rounded-lg border border-slate-200 bg-white"
      ref={sectionRef}
    >
      <h2 className="sr-only" id="e-invoice-code-lookup-heading">
        e-Invoice code lookup
      </h2>

      <div className="border-b border-slate-200 px-5 pt-3 sm:px-6 lg:px-8">
        <div aria-label="Code list" className="flex gap-4 sm:gap-6" role="tablist">
          {tabs.map((tab, tabIndex) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                aria-selected={isActive}
                aria-controls={`${tabId}-panel`}
                id={`${tabId}-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                ref={element => { tabRefs.current[tabIndex] = element; }}
                onKeyDown={event => {
                  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                  event.preventDefault();
                  const index = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (tabIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
                  setActiveTab(tabs[index].id);
                  setQuery("");
                  resetPaging();
                  tabRefs.current[index]?.focus();
                }}
                className={`inline-flex min-h-11 items-center border-b-2 py-3 text-left text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${isActive ? "border-slate-900 text-slate-950" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"}`}
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setQuery("");
                  resetPaging();
                }}
                onFocus={tab.id === "msic" ? prefetchMsic : undefined}
                onMouseEnter={tab.id === "msic" ? prefetchMsic : undefined}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div role="tabpanel" aria-labelledby={`${tabId}-${activeTab}`} id={`${tabId}-panel`} className="min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400" tabIndex={0}>
      <div className="p-5 sm:p-6 lg:px-8">
        <p className="text-sm leading-6 text-slate-600">
          {tabs.find((tab) => tab.id === activeTab)?.description}
        </p>

        <label className="mt-5 grid gap-2" htmlFor={searchInputId}>
          <span className="text-sm font-medium text-slate-950">
            Search by keyword or code
          </span>
          <span className="flex h-11 min-w-0 overflow-hidden rounded-lg border border-stone-300 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
            <span className="flex h-full items-center pl-3 text-slate-400">
              <Search aria-hidden="true" className="h-4 w-4" />
            </span>
            <input
              autoComplete="off"
              className="h-full min-w-0 flex-1 border-0 bg-white px-3 text-base text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-400"
              id={searchInputId}
              name="codeSearch"
              spellCheck={false}
              onChange={(event) => {
                setQuery(event.target.value);
                resetPaging();
              }}
              placeholder={activeTab === "classification" ? "e.g. education, 022" : "e.g. restaurant, 56101"}
              type="search"
              value={query}
            />
          </span>
        </label>
      </div>

      <div className="min-w-0 border-t border-slate-200 p-5 sm:p-6 lg:px-8">
        <h3 className="text-base font-semibold text-slate-950">Search results</h3>
        <p aria-live="polite" className="mt-2 text-sm leading-6 text-slate-600">
          {loadError && activeTab === "msic" ? loadError : isLoadingMsic
            ? "Loading the MSIC list…"
            : result.totalMatches === 0
              ? "0 matches"
              : `Showing ${result.startIndex.toLocaleString("en-MY")}-${result.endIndex.toLocaleString(
                  "en-MY"
                )} of ${result.totalMatches.toLocaleString("en-MY")} ${
                  query.trim()
                    ? result.totalMatches === 1
                      ? "match"
                      : "matches"
                    : `codes. Type to search.`
                }`}
        </p>

        {loadError && activeTab === "msic" ? <button className={`${toolButtonClass} mt-3`} onClick={prefetchMsic} type="button">Try again</button> : null}
        <p className="sr-only" role="status">{copiedCode ? `Code ${copiedCode} copied.` : ""}</p>
        {copyError ? <p role="status" className="mt-3 text-sm text-slate-700">{copyError}</p> : null}
        {!isLoadingMsic && result.rows.length === 0 && query.trim() ? (
          <p className="mt-4 text-base leading-7 text-black">
            No code matches that search. Try a shorter or more general word.
            {activeTab === "classification"
              ? " If nothing fits, LHDN's fallback for a line item is 022 (Others)."
              : ""}
          </p>
        ) : null}

        {result.rows.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
            {result.rows.map((row) => (
              <li className="grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-start gap-3 py-4 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-4" key={row.code}>
                <code className="pt-3 text-sm font-semibold tabular-nums text-slate-950 [font-family:inherit]">
                  {row.code}
                </code>
                <span className="min-w-0 break-words pt-2.5 text-sm leading-6 text-slate-700">{row.label}</span>
                <button
                  aria-label={copiedCode === row.code ? `Code ${row.code} copied` : `Copy code ${row.code}`}
                  className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"

                  onClick={() => void copyCode(row.code)}
                  type="button"
                >
                  {copiedCode === row.code ? (
                    <>
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy code {row.code}</span>
                      <span aria-hidden="true" className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {result.pageCount > 1 ? (
          <nav
            aria-label="Code results pages"
            className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4"
          >
            <button
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white"
              disabled={result.page <= 1}
              onClick={() => goToPage(result.page - 1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Previous
            </button>

            <div className="order-first flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-600 sm:order-none sm:w-auto">
              <label htmlFor={pageInputId}>Page</label>
              <input
                aria-label={`Page number, 1 to ${result.pageCount}`}
                className="h-11 w-14 rounded-lg border border-stone-300 bg-white px-2 text-center text-base font-semibold text-slate-950 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                id={pageInputId}
                autoComplete="off"
                name="resultsPage"
                inputMode="numeric"
                onBlur={() => setPageInput(String(result.page))}
                onChange={(event) => {
                  const raw = event.target.value.replace(/[^0-9]/g, "");
                  setPageInput(raw);

                  // Empty means mid-edit, so leave the page where it is.
                  // paginateCodes clamps anything out of range.
                  if (raw !== "") {
                    setPage(Number(raw));
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    event.currentTarget.blur();
                    scrollToTop();
                  }
                }}
                type="text"
                value={pageInput}
              />
              <span>of {result.pageCount.toLocaleString("en-MY")}</span>
            </div>

            <button
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white"
              disabled={result.page >= result.pageCount}
              onClick={() => goToPage(result.page + 1)}
              type="button"
            >
              Next
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        ) : null}
      </div>
      </div>
    </section>
  );
}
