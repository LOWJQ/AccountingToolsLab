"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";

export function TrialBalancePreview() {
  const { formatCurrency } = useCurrency();
  const previewAmount = formatCurrency(2400);

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Trial balance preview
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
              Summary
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Balanced
          </span>
        </div>
        <div className="mt-6 grid gap-3">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Total Debit
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              {previewAmount}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Total Credit
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              {previewAmount}
            </p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <div className="h-3 rounded-full bg-stone-100" />
          <div className="h-3 w-4/5 rounded-full bg-stone-100" />
        </div>
      </div>
    </div>
  );
}
