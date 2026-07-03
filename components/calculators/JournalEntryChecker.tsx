"use client";

import { Info, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { checkJournalEntry, type JournalEntryLine } from "@/lib/calculators/journal-entry";

type EditableJournalEntryLine = {
  id: string;
  accountName: string;
  debit: string;
  credit: string;
};

function createLine(index: number): EditableJournalEntryLine {
  return {
    id: `line-${Date.now()}-${index}`,
    accountName: "",
    debit: "",
    credit: ""
  };
}

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

const invalidAmountMessage = "Please enter valid numeric debit and credit amounts.";

function isBlankLine(line: EditableJournalEntryLine): boolean {
  return !line.accountName.trim() && !line.debit.trim() && !line.credit.trim();
}

function SummaryCard({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "error";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-700"
      : tone === "error"
        ? "text-rose-700"
        : "text-slate-950";

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
    </div>
  );
}

function getStatus({
  hasResult,
  isBalanced
}: {
  hasResult: boolean;
  isBalanced: boolean;
}) {
  if (!hasResult) {
    return {
      label: "Waiting for entries",
      cardClass: "border-slate-200 bg-white",
      labelClass: "text-slate-500",
      badgeClass: "bg-slate-100 text-slate-700"
    };
  }

  if (isBalanced) {
    return {
      label: "Balanced",
      cardClass: "border-slate-200 bg-white",
      labelClass: "text-slate-500",
      badgeClass: "bg-emerald-100 text-emerald-800"
    };
  }

  return {
    label: "Not balanced",
    cardClass: "border-slate-200 bg-white",
    labelClass: "text-slate-500",
    badgeClass: "bg-rose-100 text-rose-800"
  };
}

export function JournalEntryChecker() {
  const [lines, setLines] = useState<EditableJournalEntryLine[]>([createLine(1), createLine(2)]);
  const { formatCurrency } = useCurrency();

  const calculation = useMemo(() => {
    const activeLines = lines.filter((line) => !isBlankLine(line));

    if (activeLines.length === 0) {
      return {
        result: null,
        message: "Enter at least one account line to check the journal entry."
      };
    }

    const parsedLines = activeLines.map((line) => ({
      line,
      debit: parseAmount(line.debit),
      credit: parseAmount(line.credit)
    }));

    if (parsedLines.some((line) => line.debit === null || line.credit === null)) {
      return {
        result: null,
        message: invalidAmountMessage
      };
    }

    const calculationLines: JournalEntryLine[] = parsedLines.map(({ line, debit, credit }) => ({
      id: line.id,
      accountName: line.accountName,
      debit: debit ?? 0,
      credit: credit ?? 0
    }));

    try {
      return {
        result: checkJournalEntry(calculationLines),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the journal entry and try again."
      };
    }
  }, [lines]);

  function updateLine(
    id: string,
    field: keyof Omit<EditableJournalEntryLine, "id">,
    value: string
  ) {
    if ((field === "debit" || field === "credit") && value.includes("-")) {
      return;
    }

    setLines((currentLines) =>
      currentLines.map((line) => {
        if (line.id !== id) {
          return line;
        }

        if (field === "debit") {
          return {
            ...line,
            debit: value,
            credit: value === "" ? line.credit : ""
          };
        }

        if (field === "credit") {
          return {
            ...line,
            credit: value,
            debit: value === "" ? line.debit : ""
          };
        }

        return {
          ...line,
          accountName: value
        };
      })
    );
  }

  function addLine() {
    setLines((currentLines) => [...currentLines, createLine(currentLines.length + 1)]);
  }

  function removeLine(id: string) {
    setLines((currentLines) =>
      currentLines.length === 1 ? currentLines : currentLines.filter((line) => line.id !== id)
    );
  }

  function resetChecker() {
    setLines([createLine(1), createLine(2)]);
  }

  const totalDebit = calculation.result?.totalDebit ?? 0;
  const totalCredit = calculation.result?.totalCredit ?? 0;
  const difference = calculation.result?.difference ?? Math.abs(totalDebit - totalCredit);
  const status = getStatus({
    hasResult: Boolean(calculation.result),
    isBalanced: calculation.result?.isBalanced ?? false
  });
  const helperMessage = calculation.result
    ? calculation.result.isBalanced
      ? "Your journal entry balances. Total debits equal total credits."
      : `Your journal entry does not balance. ${
          totalDebit > totalCredit ? "Debits" : "Credits"
        } are higher by ${formatCurrency(difference)}.`
    : "";

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center border-b border-slate-200 px-5 py-4 sm:px-6">
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
          onClick={resetChecker}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Reset / Clear
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <div className="space-y-3">
          <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_6rem] gap-4 px-1 text-sm font-semibold text-slate-900 lg:grid">
            <span>Account Name</span>
            <span>Debit</span>
            <span>Credit</span>
            <span className="sr-only">Remove</span>
          </div>

          {lines.map((line, index) => {
            const parsedDebit = parseAmount(line.debit);
            const parsedCredit = parseAmount(line.credit);
            const hasDebit = parsedDebit !== null && parsedDebit > 0;
            const hasCredit = parsedCredit !== null && parsedCredit > 0;

            return (
              <div
                className="grid min-w-0 gap-3 rounded-lg border border-slate-200 bg-white p-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_6rem] lg:border-0 lg:p-0"
                key={line.id}
              >
                <label className="grid min-w-0 gap-2">
                  <span className="text-xs font-semibold uppercase text-slate-500 lg:hidden">
                    Account Name
                  </span>
                  <input
                    aria-label={`Line ${index + 1} account name`}
                    className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => updateLine(line.id, "accountName", event.target.value)}
                    placeholder="Account name"
                    value={line.accountName}
                  />
                </label>

                <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:contents">
                  <label className="grid min-w-0 gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500 lg:hidden">
                      Debit
                    </span>
                    <input
                      aria-label={`Line ${index + 1} debit amount`}
                      className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-right text-base text-black outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                      disabled={hasCredit}
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => updateLine(line.id, "debit", event.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={line.debit}
                    />
                  </label>

                  <label className="grid min-w-0 gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500 lg:hidden">
                      Credit
                    </span>
                    <input
                      aria-label={`Line ${index + 1} credit amount`}
                      className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-right text-base text-black outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 hover:border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                      disabled={hasDebit}
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => updateLine(line.id, "credit", event.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={line.credit}
                    />
                  </label>
                </div>

                <button
                  aria-label={`Remove line ${index + 1}`}
                    className="flex h-10 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-base font-semibold text-transparent transition after:text-slate-500 after:content-['x'] hover:border-rose-200 hover:bg-rose-50 hover:after:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 lg:w-24"
                  disabled={lines.length === 1}
                  onClick={() => removeLine(line.id)}
                  type="button"
                >
                  ×
                </button>
              </div>
            );
          })}

          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            onClick={addLine}
            type="button"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add line
          </button>
        </div>

        {calculation.message ? (
          <p className="mt-5 text-base font-medium leading-7 text-black">{calculation.message}</p>
        ) : null}

        <div className="mt-6 border-t border-slate-200 pt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Debits" value={formatCurrency(totalDebit)} />
          <SummaryCard label="Total Credits" value={formatCurrency(totalCredit)} />
          <SummaryCard
            label="Difference"
            tone={difference > 0 ? "error" : "neutral"}
            value={formatCurrency(difference)}
          />
          <div className={`rounded-lg border px-4 py-4 ${status.cardClass}`}>
            <p className={`text-xs font-semibold uppercase ${status.labelClass}`}>
              Status
            </p>
            <div
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${status.badgeClass}`}
            >
              {status.label}
            </div>
          </div>
        </div>

        {helperMessage ? (
          <p className="mt-5 flex items-start gap-3 text-base leading-7 text-black">
            <Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-600" />
            <span>{helperMessage}</span>
          </p>
        ) : null}
        </div>
      </div>
    </section>
  );
}
