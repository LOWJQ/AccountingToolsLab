"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Card } from "@/components/ui/Card";
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
        : "text-stone-950";

  return (
    <Card className="rounded-xl px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
    </Card>
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
      label: "Waiting for lines",
      cardClass: "border-stone-200 bg-stone-50",
      labelClass: "text-stone-500",
      badgeClass: "bg-white text-stone-600 ring-stone-200"
    };
  }

  if (isBalanced) {
    return {
      label: "Balanced",
      cardClass: "border-emerald-100 bg-emerald-50",
      labelClass: "text-stone-500",
      badgeClass: "bg-white text-emerald-700 ring-emerald-100"
    };
  }

  return {
    label: "Not balanced",
    cardClass: "border-rose-100 bg-rose-50",
    labelClass: "text-stone-500",
    badgeClass: "bg-white text-rose-700 ring-rose-100"
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

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="space-y-4">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_3rem] gap-3 px-1 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
            <span>Account Name</span>
            <span>Debit</span>
            <span>Credit</span>
            <span className="sr-only">Remove</span>
          </div>

          <div className="flex flex-col gap-3">
            {lines.map((line, index) => {
              const parsedDebit = parseAmount(line.debit);
              const parsedCredit = parseAmount(line.credit);
              const hasDebit = parsedDebit !== null && parsedDebit > 0;
              const hasCredit = parsedCredit !== null && parsedCredit > 0;

              return (
                <div
                  className="rounded-2xl border border-stone-200 bg-stone-50/50 p-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
                  key={line.id}
                >
                  <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_3rem]">
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                        Account Name
                      </span>
                      <input
                        aria-label={`Line ${index + 1} account name`}
                        className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        onChange={(event) => updateLine(line.id, "accountName", event.target.value)}
                        placeholder="Account name"
                        value={line.accountName}
                      />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                        Debit
                      </span>
                      <input
                        aria-label={`Line ${index + 1} debit amount`}
                        className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        disabled={hasCredit}
                        inputMode="decimal"
                        min="0"
                        onChange={(event) => updateLine(line.id, "debit", event.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={line.debit}
                      />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                        Credit
                      </span>
                      <input
                        aria-label={`Line ${index + 1} credit amount`}
                        className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        disabled={hasDebit}
                        inputMode="decimal"
                        min="0"
                        onChange={(event) => updateLine(line.id, "credit", event.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={line.credit}
                      />
                    </div>
                    <div className="flex items-end lg:items-center">
                      <button
                        aria-label={`Remove line ${index + 1}`}
                        className="flex h-12 w-full items-center justify-center rounded-xl border border-stone-200 text-sm font-semibold text-stone-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 lg:w-12"
                        disabled={lines.length === 1}
                        onClick={() => removeLine(line.id)}
                        type="button"
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-stretch lg:justify-end">
            <button
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 lg:w-auto"
              onClick={addLine}
              type="button"
            >
              Add line
            </button>
          </div>
        </div>

        {calculation.message ? (
          <p className="mt-5 text-sm font-medium text-stone-600">{calculation.message}</p>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Debits" value={formatCurrency(totalDebit)} />
          <SummaryCard label="Total Credits" value={formatCurrency(totalCredit)} />
          <SummaryCard
            label="Difference"
            tone={difference > 0 ? "error" : "neutral"}
            value={formatCurrency(difference)}
          />
          <div className={`rounded-xl border px-4 py-4 shadow-sm ${status.cardClass}`}>
            <p className={`text-xs font-medium uppercase tracking-wide ${status.labelClass}`}>
              Status
            </p>
            <div
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${status.badgeClass}`}
            >
              {status.label}
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-stone-600">
          {calculation.result
            ? calculation.result.isBalanced
              ? "Your journal entry balances. Total debits equal total credits."
              : `Your journal entry does not balance. ${
                  totalDebit > totalCredit ? "Debits" : "Credits"
                } are higher by ${formatCurrency(difference)}.`
            : "This checker confirms the math balance only. It does not verify whether every account choice is correct."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex h-11 w-fit items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
            onClick={resetChecker}
            type="button"
          >
            Reset
          </button>
        </div>
      </Card>
    </div>
  );
}
