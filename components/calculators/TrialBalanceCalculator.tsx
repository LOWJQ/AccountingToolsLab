"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateTrialBalance } from "@/lib/calculators/trial-balance";
import type { TrialBalanceRow } from "@/lib/calculators/trial-balance";
import { Check, Minus, Plus, TriangleAlert, X } from "lucide-react";

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
    <div className="min-w-0 border-t border-slate-200 py-4 first:border-t-0 first:pt-0 lg:border-0 lg:p-0">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_2.75rem]">
        <div className="col-span-3 grid min-w-0 gap-2 lg:col-span-1">
          <span className="text-xs font-medium text-slate-600 lg:hidden">
            Account name
          </span>
          <input
            aria-label={`Row ${index + 1} account name`}
            className="h-11 w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onUpdate(row.id, "accountName", event.target.value)}
            placeholder="Account name"
            value={row.accountName}
          />
        </div>
        <div className="grid min-w-0 gap-2">
          <span className="text-xs font-medium text-slate-600 lg:hidden">
            Debit ({currency})
          </span>
          <input
            aria-label={`Row ${index + 1} debit amount`}
            className="h-11 w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 text-right text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
            disabled={hasCredit}
            inputMode="decimal"
            min="0"
            onChange={(event) => onUpdate(row.id, "debit", event.target.value)}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={row.debit}
          />
        </div>
        <div className="grid min-w-0 gap-2">
          <span className="text-xs font-medium text-slate-600 lg:hidden">
            Credit ({currency})
          </span>
          <input
            aria-label={`Row ${index + 1} credit amount`}
            className="h-11 w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 text-right text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
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
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
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
  const hasAmounts = rows.some((row) => row.debit.trim() !== "" || row.credit.trim() !== "");
  const hasResult = hasAmounts && !calculation.message;
  const statusLabel = calculation.message
    ? "Check your entries"
    : !hasAmounts
      ? "Waiting for entries"
      : result.isBalanced ? "Balanced" : "Not balanced";
  const StatusIcon = calculation.message || (hasAmounts && !result.isBalanced)
    ? TriangleAlert
    : hasAmounts ? Check : Minus;
  const statusMessage = calculation.message
    ? "Correct the invalid amount to see your result."
    : !hasAmounts
      ? "Enter a debit or credit amount to see the totals."
      : result.isBalanced
        ? "Total debits equal total credits."
        : result.difference === 0
          ? "The totals differ by less than 0.01. Check amounts with more than two decimal places."
          : `${result.totalDebit > result.totalCredit ? "Debit" : "Credit"} total is ${formatCurrency(result.difference)} higher than ${result.totalDebit > result.totalCredit ? "credit" : "debit"} total.`;

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
    <section aria-labelledby="trial-balance-calculator-heading" className="grid min-w-0 rounded-lg border border-slate-200 bg-white lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <h2 className="sr-only" id="trial-balance-calculator-heading">Trial balance entries and result</h2>
      <div className="min-w-0 p-5 sm:p-6">
        <h3 className="text-base font-semibold text-slate-950">Account balances</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter each account balance in either Debit or Credit.</p>
        <div className="mt-6 space-y-4">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-3 border-b border-slate-200 pb-3 text-sm font-medium text-slate-600 lg:grid">
            <span>Account name</span>
            <span className="text-right">Debit ({currency})</span>
            <span className="text-right">Credit ({currency})</span>
            <span className="sr-only">Remove</span>
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

          <div>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
              onClick={addRow}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add row
            </button>
          </div>
        </div>

        {calculation.message ? (
          <p className="mt-5 text-sm font-medium text-slate-900" role="alert">{calculation.message}</p>
        ) : null}

      </div>
      <div className="min-w-0 border-t border-slate-200 p-5 sm:p-6 lg:border-l lg:border-t-0">
        <div className="lg:sticky lg:top-24" aria-live="polite" aria-atomic="true">
          <h3 className="text-base font-semibold text-slate-950">Your result</h3>
          <p className="mt-6 flex items-center gap-2 text-base font-semibold text-slate-950">
            <StatusIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
            {statusLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{statusMessage}</p>
          <dl className="mt-6 divide-y divide-slate-200 border-t border-slate-200">
            {([
              ["Total debit", result.totalDebit],
              ["Total credit", result.totalCredit],
              ["Difference", result.difference]
            ] as const).map(([label, value]) => (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4" key={label}>
                <dt className="text-sm text-slate-600">{label}</dt>
                <dd className="min-w-0 max-w-full break-words text-base font-semibold tabular-nums text-slate-950">{hasResult ? formatCurrency(value) : "—"}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-5 text-slate-500">Matching totals do not rule out every accounting error.</p>
        </div>
      </div>
    </section>
  );
}
