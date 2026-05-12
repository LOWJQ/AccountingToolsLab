"use client";

import type { InvoiceLineItem } from "@/lib/invoice/invoice-types";

type InvoiceLineItemsProps = {
  currency: string;
  formatCurrency: (value: number) => string;
  lineItemPreviewTotals: number[];
  lineItems: InvoiceLineItem[];
  lineItemsMessage: string;
  onAddLineItem: () => void;
  onRemoveLineItem: (id: string) => void;
  onUpdateLineItem: (id: string, key: keyof InvoiceLineItem, value: string) => void;
};

export function InvoiceLineItems({
  currency,
  formatCurrency,
  lineItemPreviewTotals,
  lineItems,
  lineItemsMessage,
  onAddLineItem,
  onRemoveLineItem,
  onUpdateLineItem
}: InvoiceLineItemsProps) {
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-stone-950">Line items</h2>
        <button
          className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={onAddLineItem}
          type="button"
        >
          Add item
        </button>
      </div>

      <div className="grid gap-4">
        {lineItems.map((item, index) => (
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={item.id}>
            <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_7.5rem_8.5rem_8.5rem_auto]">
              <label className="grid min-w-0 gap-2">
                <span className="text-sm font-semibold text-stone-800">Description</span>
                <input
                  className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  onChange={(event) =>
                    onUpdateLineItem(item.id, "description", event.target.value)
                  }
                  placeholder={`Item ${index + 1}`}
                  value={item.description}
                />
              </label>
              <label className="grid min-w-0 gap-2">
                <span className="text-sm font-semibold text-stone-800">Quantity</span>
                <input
                  className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  inputMode="decimal"
                  onChange={(event) => onUpdateLineItem(item.id, "quantity", event.target.value)}
                  placeholder="1"
                  type="number"
                  value={item.quantity}
                />
              </label>
              <label className="grid min-w-0 gap-2">
                <span className="text-sm font-semibold text-stone-800">
                  Unit price ({currency})
                </span>
                <input
                  className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  inputMode="decimal"
                  onChange={(event) => onUpdateLineItem(item.id, "unitPrice", event.target.value)}
                  placeholder="0.00"
                  type="number"
                  value={item.unitPrice}
                />
              </label>
              <div className="grid min-w-0 gap-2">
                <span className="text-sm font-semibold text-stone-800">Line total</span>
                <div className="flex h-12 w-full min-w-0 items-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-950">
                  {formatCurrency(lineItemPreviewTotals[index] ?? 0)}
                </div>
              </div>
              <div className="flex min-w-0 items-end">
                <button
                  className="h-12 w-full rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 xl:w-auto"
                  disabled={lineItems.length === 1}
                  onClick={() => onRemoveLineItem(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {lineItemsMessage ? (
        <p className="text-sm font-medium text-red-700">{lineItemsMessage}</p>
      ) : null}
    </section>
  );
}
