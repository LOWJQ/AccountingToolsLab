"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateTrialBalance } from "@/lib/calculators/trial-balance";
import type { TrialBalanceRow } from "@/lib/calculators/trial-balance";
import { Plus, X } from "lucide-react";

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

type TrialBalanceRowField = keyof Omit<EditableTrialBalanceRow, "id">;

const TrialBalanceRowEditor = memo(function TrialBalanceRowEditor({
  canRemove,
  currency,
  index,
  onRemove,
  onUpdate,
  row
}: {
  canRemove: boolean;
  currency: string;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: TrialBalanceRowField, value: string) => void;
  row: EditableTrialBalanceRow;
}) {
  const parsedDebit = parseAmount(row.debit);
  const parsedCredit = parseAmount(row.credit);
  const hasDebit = parsedDebit !== null && parsedDebit > 0;
  const hasCredit = parsedCredit !== null && parsedCredit > 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_3.5rem] lg:gap-4">
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 lg:hidden">
            Account Name
          </span>
          <input
            aria-label={`Row ${index + 1} account name`}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-base text-black outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onUpdate(row.id, "accountName", event.target.value)}
            placeholder="Account name"
            value={row.accountName}
          />
        </div>
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 lg:hidden">
            Debit ({currency})
          </span>
          <input
            aria-label={`Row ${index + 1} debit amount`}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-right text-base font-medium text-black outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            disabled={hasCredit}
            inputMode="decimal"
            min="0"
            onChange={(event) => onUpdate(row.id, "debit", event.target.value)}
            placeholder="0.00"
            type="number"
            value={row.debit}
          />
        </div>
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 lg:hidden">
            Credit ({currency})
          </span>
          <input
            aria-label={`Row ${index + 1} credit amount`}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-right text-base font-medium text-black outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            disabled={hasDebit}
            inputMode="decimal"
            min="0"
            onChange={(event) => onUpdate(row.id, "credit", event.target.value)}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={row.credit}
          />
        </div>
        <div className="flex items-end lg:items-center">
          <button
            aria-label={`Remove row ${index + 1}`}
            className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 lg:w-11"
            disabled={!canRemove}
            onClick={() => onRemove(row.id)}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
    </div>
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

export function TrialBalanceCalculator() {
  const [rows, setRows] = useState<EditableTrialBalanceRow[]>(initialRows);
  const { currency, formatCurrency } = useCurrency();

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

  const updateRow = useCallback((
    id: string,
    field: TrialBalanceRowField,
    value: string
  ) => {
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
  }, []);

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

  const removeRow = useCallback((id: string) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <div className="space-y-4">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_3.5rem] gap-4 px-1 text-xs font-semibold uppercase tracking-wide text-slate-600 lg:grid">
            <span>Account Name</span>
            <span>Debit ({currency})</span>
            <span>Credit ({currency})</span>
            <span>Remove</span>
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((row, index) => (
              <TrialBalanceRowEditor
                canRemove={rows.length > 1}
                currency={currency}
                index={index}
                key={row.id}
                onRemove={removeRow}
                onUpdate={updateRow}
                row={row}
              />
            ))}
          </div>

          <div className="flex justify-stretch lg:justify-end">
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 lg:w-auto"
              onClick={addRow}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add Row
            </button>
          </div>
        </div>

        {calculation.message ? (
          <p className="mt-5 text-sm font-medium text-rose-700">{calculation.message}</p>
        ) : null}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Total Debit" value={formatCurrency(result.totalDebit)} />
            <SummaryCard label="Total Credit" value={formatCurrency(result.totalCredit)} />
            <SummaryCard
              label="Difference"
              tone={result.difference > 0 ? "error" : "neutral"}
              value={formatCurrency(result.difference)}
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
        </div>

        <p className="mt-5 text-base leading-7 text-slate-600">
          Use this generated trial balance summary to check whether total debits equal total credits.
        </p>
      </section>
    </div>
  );
}
