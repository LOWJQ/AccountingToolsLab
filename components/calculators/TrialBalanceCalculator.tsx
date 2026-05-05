"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { calculateTrialBalance } from "@/lib/calculators/trial-balance";
import type { TrialBalanceRow } from "@/lib/calculators/trial-balance";

type EditableTrialBalanceRow = {
  id: string;
  accountName: string;
  debit: string;
  credit: string;
};

const initialRows: EditableTrialBalanceRow[] = [
  { id: "row-1", accountName: "", debit: "", credit: "" }
];

const facts = [
  {
    label: "Purpose",
    value: "Check whether total debits and total credits agree before statements."
  },
  {
    label: "Total Debit",
    value: "Sum of all debit balances from the ledger."
  },
  {
    label: "Total Credit",
    value: "Sum of all credit balances from the ledger."
  },
  {
    label: "Difference",
    value: "The gap between debit and credit totals."
  }
];

const mistakes = [
  {
    title: "Posting an amount to the wrong side",
    description: "A debit entered as a credit can make an otherwise correct ledger look unbalanced."
  },
  {
    title: "Missing an account balance",
    description: "Leaving out one account can create a difference that is hard to spot later."
  },
  {
    title: "Typing transposed digits",
    description: "Amounts like 540 and 450 often point to a simple input mistake."
  },
  {
    title: "Mixing period balances",
    description: "Use balances from the same accounting period for a meaningful check."
  },
  {
    title: "Assuming balanced means error-free",
    description: "A balanced trial balance can still contain classification or posting errors."
  }
];

function parseAmount(value: string): number {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD"
  }).format(value);
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
  totalDebit,
  totalCredit,
  isBalanced
}: {
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}) {
  if (totalDebit === 0 && totalCredit === 0) {
    return {
      label: "Waiting for entries",
      cardClass: "border-stone-200 bg-stone-50",
      labelClass: "text-stone-600",
      badgeClass: "bg-white text-stone-600 ring-stone-200"
    };
  }

  if (isBalanced) {
    return {
      label: "Balanced",
      cardClass: "border-emerald-100 bg-emerald-50",
      labelClass: "text-emerald-700",
      badgeClass: "bg-white text-emerald-700 ring-emerald-100"
    };
  }

  return {
    label: "Unbalanced",
    cardClass: "border-rose-100 bg-rose-50",
    labelClass: "text-rose-700",
    badgeClass: "bg-white text-rose-700 ring-rose-100"
  };
}

export function TrialBalanceCalculator() {
  const [rows, setRows] = useState<EditableTrialBalanceRow[]>(initialRows);

  const calculationRows = useMemo<TrialBalanceRow[]>(
    () =>
      rows.map((row) => ({
        id: row.id,
        accountName: row.accountName,
        debit: parseAmount(row.debit),
        credit: parseAmount(row.credit)
      })),
    [rows]
  );

  const result = useMemo(() => calculateTrialBalance(calculationRows), [calculationRows]);
  const status = getStatus(result);

  function updateRow(
    id: string,
    field: keyof Omit<EditableTrialBalanceRow, "id">,
    value: string
  ) {
    if ((field === "debit" || field === "credit") && value.includes("-")) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== id) {
          return row;
        }

        if (field === "debit") {
          return {
            ...row,
            debit: value,
            credit: value === "" ? row.credit : ""
          };
        }

        if (field === "credit") {
          return {
            ...row,
            credit: value,
            debit: value === "" ? row.debit : ""
          };
        }

        return {
          ...row,
          accountName: value
        };
      })
    );
  }

  function addRow() {
    const id = `row-${Date.now()}`;
    setRows((currentRows) => [
      ...currentRows,
      {
        id,
        accountName: "",
        debit: "",
        credit: ""
      }
    ]);
  }

  function removeRow(id: string) {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Trial Balance Calculator
            </h1>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Enter account balances in the debit or credit column to preview a clean trial
              balance worksheet layout.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            onClick={addRow}
          >
            Add Row
          </button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_3rem] gap-3 px-1 pb-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <span>Account Name</span>
              <span>Debit</span>
              <span>Credit</span>
              <span className="sr-only">Actions</span>
            </div>
            <div className="flex flex-col gap-3">
              {rows.map((row, index) => {
                const hasDebit = parseAmount(row.debit) > 0;
                const hasCredit = parseAmount(row.credit) > 0;

                return (
                  <div
                    className="grid grid-cols-[1.4fr_1fr_1fr_3rem] gap-3"
                    key={row.id}
                  >
                    <input
                      aria-label={`Row ${index + 1} account name`}
                      className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      onChange={(event) => updateRow(row.id, "accountName", event.target.value)}
                      placeholder="Account name"
                      value={row.accountName}
                    />
                    <input
                      aria-label={`Row ${index + 1} debit amount`}
                      className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      disabled={hasCredit}
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => updateRow(row.id, "debit", event.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={row.debit}
                    />
                    <input
                      aria-label={`Row ${index + 1} credit amount`}
                      className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      disabled={hasDebit}
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => updateRow(row.id, "credit", event.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                      value={row.credit}
                    />
                    <button
                      aria-label={`Remove row ${index + 1}`}
                      className="flex h-12 items-center justify-center rounded-xl border border-stone-200 text-sm font-semibold text-stone-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={rows.length === 1}
                      onClick={() => removeRow(row.id)}
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

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Debit" value={formatMoney(result.totalDebit)} />
          <SummaryCard label="Total Credit" value={formatMoney(result.totalCredit)} />
          <SummaryCard
            label="Difference"
            tone={result.difference > 0 ? "error" : "neutral"}
            value={formatMoney(result.difference)}
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

        <p className="mt-5 text-sm text-stone-500">
          A trial balance is balanced when total debits equal total credits.
        </p>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              About Trial Balance
            </h2>
            <dl className="mt-5 divide-y divide-stone-100">
              {facts.map((fact) => (
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr]" key={fact.label}>
                  <dt className="text-sm font-semibold text-stone-800">{fact.label}</dt>
                  <dd className="text-sm leading-6 text-stone-600">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="overflow-hidden">
            <div className="grid gap-6 p-6 sm:grid-cols-[1fr_12rem] sm:items-center">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  Learn Trial Balance Step by Step
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Build confidence with plain-English explanations, worked examples, and
                  accounting basics made for beginners.
                </p>
                <ButtonLink
                  className="mt-5 h-10"
                  href="/guides/trial-balance-explained"
                  variant="secondary"
                >
                  Learn More
                </ButtonLink>
              </div>
              <div className="min-h-40 rounded-2xl bg-[linear-gradient(135deg,#eef2f3,#dfe7df_55%,#f8f6f1)] p-4">
                <div className="h-full rounded-xl border border-white/70 bg-white/45 p-4">
                  <div className="h-3 w-20 rounded-full bg-slate-300" />
                  <div className="mt-6 space-y-3">
                    <div className="h-2 rounded-full bg-white" />
                    <div className="h-2 w-4/5 rounded-full bg-white" />
                    <div className="h-2 w-2/3 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold tracking-tight text-stone-950">
            Common Mistakes
          </h2>
          <div className="mt-5 divide-y divide-stone-100">
            {mistakes.map((mistake) => (
              <div className="py-4" key={mistake.title}>
                <h3 className="text-sm font-semibold text-stone-900">{mistake.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{mistake.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[radial-gradient(circle_at_70%_35%,rgba(101,116,139,0.18),transparent_34%),linear-gradient(135deg,transparent,#edf1ed)] lg:block" />
        <div className="relative max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Understand accounting faster with simple tools and worked examples.
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
            Explore beginner-friendly guides that explain why debits and credits move the way
            they do.
          </p>
          <ButtonLink className="mt-6" href="/guides" variant="dark">
            Explore Guides
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
