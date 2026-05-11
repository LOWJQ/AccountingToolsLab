"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { checkJournalEntry, type JournalEntryLine } from "@/lib/calculators/journal-entry";

type EditableJournalEntryLine = {
  id: string;
  accountName: string;
  debit: string;
  credit: string;
};

const mistakes = [
  "Entering both debit and credit on the same line",
  "Forgetting one side of the entry",
  "Using the wrong account even though the entry balances",
  "Confusing debit/credit rules with increase/decrease",
  "Leaving blank lines in the entry"
];

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

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            onClick={addLine}
            type="button"
          >
            Add line
          </button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_3rem] gap-3 px-1 pb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <span>Account name</span>
              <span>Debit</span>
              <span>Credit</span>
              <span className="sr-only">Actions</span>
            </div>
            <div className="grid gap-3">
              {lines.map((line, index) => {
                const parsedDebit = parseAmount(line.debit);
                const parsedCredit = parseAmount(line.credit);
                const hasDebit = parsedDebit !== null && parsedDebit > 0;
                const hasCredit = parsedCredit !== null && parsedCredit > 0;

                return (
                  <div
                    className="grid grid-cols-[1.4fr_1fr_1fr_3rem] gap-3"
                    key={line.id}
                  >
                    <input
                      aria-label={`Line ${index + 1} account name`}
                      className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      onChange={(event) => updateLine(line.id, "accountName", event.target.value)}
                      placeholder="Account name"
                      value={line.accountName}
                    />
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
                    <button
                      aria-label={`Remove line ${index + 1}`}
                      className="flex h-12 items-center justify-center rounded-xl border border-stone-200 text-sm font-semibold text-stone-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={lines.length === 1}
                      onClick={() => removeLine(line.id)}
                      type="button"
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {calculation.message ? (
          <p className="mt-5 text-sm font-medium text-stone-600">{calculation.message}</p>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Total debits
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              {formatCurrency(totalDebit)}
            </p>
          </Card>
          <Card className="rounded-xl px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Total credits
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              {formatCurrency(totalCredit)}
            </p>
          </Card>
          <Card className="rounded-xl px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Difference
            </p>
            <p
              className={`mt-2 text-2xl font-semibold tracking-tight ${
                difference > 0 ? "text-rose-700" : "text-stone-950"
              }`}
            >
              {formatCurrency(difference)}
            </p>
          </Card>
          <div
            className={`rounded-xl border px-4 py-4 shadow-sm ${
              calculation.result?.isBalanced
                ? "border-emerald-100 bg-emerald-50"
                : calculation.result
                  ? "border-rose-100 bg-rose-50"
                  : "border-stone-200 bg-stone-50"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Status</p>
            <div
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${
                calculation.result?.isBalanced
                  ? "bg-white text-emerald-700 ring-emerald-100"
                  : calculation.result
                    ? "bg-white text-rose-700 ring-rose-100"
                    : "bg-white text-stone-600 ring-stone-200"
              }`}
            >
              {calculation.result?.isBalanced
                ? "Balanced"
                : calculation.result
                  ? "Not balanced"
                  : "Waiting for lines"}
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

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What a journal entry checks
          </h2>
          <p className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-800">
            Total Debits = Total Credits
          </p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              A journal entry records the debit and credit sides of a transaction before it is
              posted to accounts.
            </p>
            <p>
              Debits and credits must balance because double-entry accounting records equal
              value on both sides of the entry.
            </p>
            <p>
              This checker confirms the math balance only. It does not prove every account
              choice or debit/credit treatment is correct.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked example</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Balanced journal entry
          </h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Debit Cash", formatCurrency(1000)],
              ["Credit Service Revenue", formatCurrency(1000)],
              ["Total debits", formatCurrency(1000)],
              ["Total credits", formatCurrency(1000)],
              ["Status", "Entry balances"]
            ].map(([label, value]) => (
              <div
                className="flex items-center justify-between gap-4 border-b border-stone-100 py-3 last:border-b-0"
                key={label}
              >
                <span className="text-sm text-stone-600">{label}</span>
                <span className="text-sm font-semibold text-stone-950">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Mistakes to avoid
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {mistakes.map((mistake) => (
            <div
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
              key={mistake}
            >
              {mistake}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Keep practicing debit and credit checks
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use the debit/credit checker, trial balance calculator, and accounting equation
              calculator to review related accounting basics.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/debit-credit-checker">Debit/Credit Checker</ButtonLink>
            <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
              Trial Balance Calculator
            </ButtonLink>
            <ButtonLink href="/tools/accounting-equation-calculator" variant="secondary">
              Accounting Equation Calculator
            </ButtonLink>
            <ButtonLink href="/tools" variant="secondary">
              All Tools
            </ButtonLink>
          </div>
        </div>
      </Card>
    </div>
  );
}
