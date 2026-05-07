"use client";

import { useCurrency } from "@/components/currency/CurrencyProvider";

const sampleItems = [
  {
    description: "Website setup",
    quantity: 1,
    unitPrice: 850
  },
  {
    description: "Monthly bookkeeping support",
    quantity: 2,
    unitPrice: 275
  }
];

export function InvoicePreview() {
  const { currency, formatCurrency } = useCurrency();
  const subtotal = sampleItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Invoice preview
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
              Invoice #INV-1024
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {currency}
          </span>
        </div>

        <div className="grid gap-4 border-b border-stone-100 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              From
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-950">Bright Ledger Studio</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">Kuala Lumpur, Malaysia</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Bill to
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-950">Acme Trading Co.</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">Customer account</p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-stone-200">
          <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            <span>Line item</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-stone-100 bg-white">
            {sampleItems.map((item) => (
              <div
                className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-3 px-4 py-3 text-sm"
                key={item.description}
              >
                <div className="min-w-0">
                  <p className="break-words font-medium text-stone-900">{item.description}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="text-right font-semibold tabular-nums text-stone-950">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div className="flex justify-between gap-4 text-sm text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold tabular-nums text-stone-950">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="mt-3 flex justify-between gap-4 border-t border-stone-200 pt-3 text-base font-semibold text-stone-950">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
