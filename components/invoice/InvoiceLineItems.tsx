"use client";

import type { InvoiceLineItem } from "@/lib/invoice/invoice-types";
import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";
import { formatLineItemErrorForDisplay } from "@/lib/invoice/invoice-line-item-error-display";

type InvoiceLineItemsProps = {
  currency: string;
  formatCurrency: (value: number) => string;
  getLineItemError: (
    index: number,
    key: "description" | "quantity" | "unitPrice"
  ) => string;
  lineItemPreviewTotals: number[];
  lineItems: InvoiceLineItem[];
  lineItemsMessage: string;
  onAddLineItem: () => void;
  onLineItemBlur?: (index: number, key: "description" | "quantity" | "unitPrice") => void;
  onRemoveLineItem: (id: string) => void;
  onUpdateLineItem: (id: string, key: keyof InvoiceLineItem, value: string) => void;
};

function LineItemErrorSlot({
  error,
  id,
  reserve
}: {
  error: string;
  id: string;
  reserve: boolean;
}) {
  return (
    <div className={reserve ? "min-h-5" : "min-h-0"}>
      {error ? (
        <p className="text-sm font-medium text-red-700 xl:whitespace-nowrap" id={id}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function InvoiceLineItems({
  currency,
  formatCurrency,
  getLineItemError,
  lineItemPreviewTotals,
  lineItems,
  lineItemsMessage,
  onAddLineItem,
  onLineItemBlur,
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
        {lineItems.map((item, index) => {
          const descriptionError = formatLineItemErrorForDisplay(
            getLineItemError(index, "description"),
            "description"
          );
          const quantityError = formatLineItemErrorForDisplay(
            getLineItemError(index, "quantity"),
            "quantity"
          );
          const unitPriceError = formatLineItemErrorForDisplay(
            getLineItemError(index, "unitPrice"),
            "unitPrice"
          );
          const hasFieldError = Boolean(descriptionError || quantityError || unitPriceError);

          return (
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={item.id}>
            <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_10.5rem_8.5rem_8.5rem_auto]">
              <label className="grid min-w-0 gap-2 self-start">
                <span className="text-sm font-semibold text-stone-800">Description</span>
                <input
                  aria-describedby={descriptionError ? `line-item-${index}-description-error` : undefined}
                  aria-invalid={descriptionError ? true : undefined}
                  className={`h-12 w-full min-w-0 rounded-xl border bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
                    descriptionError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
                  }`}
                  maxLength={INVOICE_TEXT_MAX_LENGTHS.lineItemDescription}
                  onBlur={() => onLineItemBlur?.(index, "description")}
                  onChange={(event) =>
                    onUpdateLineItem(item.id, "description", event.target.value)
                  }
                  placeholder={`Item ${index + 1}`}
                  value={item.description}
                />
                <LineItemErrorSlot
                  error={descriptionError}
                  id={`line-item-${index}-description-error`}
                  reserve={hasFieldError}
                />
              </label>
              <label className="grid min-w-0 gap-2 self-start">
                <span className="text-sm font-semibold text-stone-800">Quantity</span>
                <input
                  aria-describedby={quantityError ? `line-item-${index}-quantity-error` : undefined}
                  aria-invalid={quantityError ? true : undefined}
                  className={`h-12 w-full min-w-0 rounded-xl border bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
                    quantityError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
                  }`}
                  inputMode="decimal"
                  onBlur={() => onLineItemBlur?.(index, "quantity")}
                  onChange={(event) => onUpdateLineItem(item.id, "quantity", event.target.value)}
                  placeholder="1"
                  type="text"
                  value={item.quantity}
                />
                <LineItemErrorSlot
                  error={quantityError}
                  id={`line-item-${index}-quantity-error`}
                  reserve={hasFieldError}
                />
              </label>
              <label className="grid min-w-0 gap-2 self-start">
                <span className="text-sm font-semibold text-stone-800">
                  Unit price ({currency})
                </span>
                <input
                  aria-describedby={unitPriceError ? `line-item-${index}-unit-price-error` : undefined}
                  aria-invalid={unitPriceError ? true : undefined}
                  className={`h-12 w-full min-w-0 rounded-xl border bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
                    unitPriceError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
                  }`}
                  inputMode="decimal"
                  onBlur={() => onLineItemBlur?.(index, "unitPrice")}
                  onChange={(event) => onUpdateLineItem(item.id, "unitPrice", event.target.value)}
                  placeholder="0.00"
                  type="text"
                  value={item.unitPrice}
                />
                <LineItemErrorSlot
                  error={unitPriceError}
                  id={`line-item-${index}-unit-price-error`}
                  reserve={hasFieldError}
                />
              </label>
              <div className="grid min-w-0 gap-2 self-start">
                <span className="text-sm font-semibold text-stone-800">Line total</span>
                <div className="flex h-12 w-full min-w-0 items-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-950">
                  {formatCurrency(lineItemPreviewTotals[index] ?? 0)}
                </div>
              </div>
              <div className="flex min-w-0 items-start xl:pt-7">
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
          );
        })}
      </div>
      {lineItemsMessage ? (
        <p className="text-sm font-medium text-red-700">{lineItemsMessage}</p>
      ) : null}
    </section>
  );
}
