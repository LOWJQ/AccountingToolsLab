"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";

export function InvoiceMockPreview() {
  const { currency } = useCurrency();

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Invoice
          </p>
          <p className="mt-2 text-lg font-semibold text-stone-950">INV-001</p>
        </div>
        <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
          PDF
        </p>
      </div>
      <div className="mt-5 grid gap-3">
        <div className="grid grid-cols-[1fr_5rem] gap-3 text-sm">
          <span className="text-stone-600">Line item</span>
          <span className="text-right font-semibold text-stone-950">{currency}</span>
        </div>
        <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
        <div className="h-10 rounded-xl bg-white ring-1 ring-stone-200" />
        <div className="ml-auto mt-2 h-16 w-full max-w-xs rounded-xl bg-white ring-1 ring-stone-200" />
      </div>
    </div>
  );
}
