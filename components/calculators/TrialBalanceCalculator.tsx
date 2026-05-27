"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
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

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return 0;
  }

  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

const invalidAmountMessage = "Please enter valid numeric debit and credit amounts.";

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
  const { formatCurrency } = useCurrency();

  const calculation = useMemo(() => {
    const parsedRows = rows.map((row) => ({
      row,
      debit: parseAmount(row.debit),
      credit: parseAmount(row.credit)
    }));

    if (parsedRows.some((row) => row.debit === null || row.credit === null)) {
      return {
        result: calculateTrialBalance([]),
        message: invalidAmountMessage
      };
    }

    const calculationRows: TrialBalanceRow[] = parsedRows.map(({ row, debit, credit }) => ({
      id: row.id,
      accountName: row.accountName,
      debit: debit ?? 0,
      credit: credit ?? 0
    }));

    return {
      result: calculateTrialBalance(calculationRows),
      message: ""
    };
  }, [rows]);

  const result = calculation.result;
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
        <div className="space-y-4">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_3rem] gap-3 px-1 text-xs font-semibold uppercase tracking-wide text-stone-500 lg:grid">
            <span>Account Name</span>
            <span>Debit</span>
            <span>Credit</span>
            <span className="sr-only">Actions</span>
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((row, index) => {
              const parsedDebit = parseAmount(row.debit);
              const parsedCredit = parseAmount(row.credit);
              const hasDebit = parsedDebit !== null && parsedDebit > 0;
              const hasCredit = parsedCredit !== null && parsedCredit > 0;

              return (
                <div
                  className="rounded-2xl border border-stone-200 bg-stone-50/50 p-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
                  key={row.id}
                >
                  <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_3rem]">
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                        Account Name
                      </span>
                      <input
                        aria-label={`Row ${index + 1} account name`}
                        className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        onChange={(event) => updateRow(row.id, "accountName", event.target.value)}
                        placeholder="Account name"
                        value={row.accountName}
                      />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                        Debit
                      </span>
                      <input
                        aria-label={`Row ${index + 1} debit amount`}
                        className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-right text-sm font-medium text-stone-800 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                        disabled={hasCredit}
                        inputMode="decimal"
                        min="0"
                        onChange={(event) => updateRow(row.id, "debit", event.target.value)}
                        placeholder="0.00"
                        type="number"
                        value={row.debit}
                      />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 lg:hidden">
                        Credit
                      </span>
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
                    </div>
                    <div className="flex items-end lg:items-center">
                      <button
                        aria-label={`Remove row ${index + 1}`}
                        className="flex h-12 w-full items-center justify-center rounded-xl border border-stone-200 text-sm font-semibold text-stone-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 lg:w-12"
                        disabled={rows.length === 1}
                        onClick={() => removeRow(row.id)}
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
              type="button"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 lg:w-auto"
              onClick={addRow}
            >
              Add Row
            </button>
          </div>
        </div>

        {calculation.message ? (
          <p className="mt-5 text-sm font-medium text-rose-700">{calculation.message}</p>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Total Debit" value={formatCurrency(result.totalDebit)} />
          <SummaryCard label="Total Credit" value={formatCurrency(result.totalCredit)} />
          <SummaryCard
            label="Difference"
            tone={result.difference > 0 ? "error" : "neutral"}
            value={formatCurrency(result.difference)}
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
    </div>
  );
}
