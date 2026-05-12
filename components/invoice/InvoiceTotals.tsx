"use client";

import type { InvoiceDiscount } from "@/lib/invoice/invoice-types";

export type InvoiceTaxMode = "none" | "sst-6" | "sst-8" | "custom";
export type InvoiceDiscountMode = "none" | "percentage" | "fixed";

type InvoiceTaxOption = {
  label: string;
  mode: InvoiceTaxMode;
  rate: number | null;
};

type InvoiceDiscountOption = {
  label: string;
  mode: InvoiceDiscountMode;
};

type InvoiceTotalsProps = {
  currency: string;
  customTaxRate: string;
  discount: InvoiceDiscount;
  discountError: string;
  discountMode: InvoiceDiscountMode;
  discountOptions: InvoiceDiscountOption[];
  onCustomTaxRateChange: (value: string) => void;
  onDiscountModeChange: (mode: InvoiceDiscountMode) => void;
  onDiscountValueChange: (value: string) => void;
  onTaxModeChange: (mode: InvoiceTaxMode) => void;
  taxRateError: string;
  taxMode: InvoiceTaxMode;
  taxOptions: InvoiceTaxOption[];
};

export function InvoiceTotals({
  currency,
  customTaxRate,
  discount,
  discountError,
  discountMode,
  discountOptions,
  onCustomTaxRateChange,
  onDiscountModeChange,
  onDiscountValueChange,
  onTaxModeChange,
  taxRateError,
  taxMode,
  taxOptions
}: InvoiceTotalsProps) {
  return (
    <>
      <section className="grid gap-4">
        <h2 className="text-base font-semibold text-stone-950">SST / Tax</h2>
        <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {taxOptions.map((option) => (
              <label
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  taxMode === option.mode
                    ? "border-slate-300 bg-white text-stone-950 shadow-sm"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                }`}
                key={option.mode}
              >
                <input
                  checked={taxMode === option.mode}
                  className="h-4 w-4 accent-slate-700"
                  onChange={() => onTaxModeChange(option.mode)}
                  type="radio"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {taxMode === "custom" ? (
            <label className="grid max-w-xs gap-2">
              <span className="text-sm font-semibold text-stone-800">Tax rate (%)</span>
              <input
                aria-describedby={taxRateError ? "custom-tax-rate-error" : undefined}
                className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
                  taxRateError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
                }`}
                inputMode="decimal"
                max="100"
                min="0"
                onChange={(event) => onCustomTaxRateChange(event.target.value)}
                placeholder="Example: 6"
                type="number"
                value={customTaxRate}
              />
              {taxRateError ? (
                <p className="text-sm font-medium text-red-700" id="custom-tax-rate-error">
                  {taxRateError}
                </p>
              ) : null}
            </label>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-950">Discount</h2>
          <p className="mt-1 text-sm text-stone-600">
            Discount is applied before SST / tax.
          </p>
        </div>
        <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            {discountOptions.map((option) => (
              <label
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  discountMode === option.mode
                    ? "border-slate-300 bg-white text-stone-950 shadow-sm"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                }`}
                key={option.mode}
              >
                <input
                  checked={discountMode === option.mode}
                  className="h-4 w-4 accent-slate-700"
                  onChange={() => onDiscountModeChange(option.mode)}
                  type="radio"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {discount.enabled ? (
            <label className="grid max-w-xs gap-2">
              <span className="text-sm font-semibold text-stone-800">
                {discount.type === "percentage"
                  ? "Discount percentage"
                  : `Discount amount (${currency})`}
              </span>
              <div className="relative">
                <input
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
                    discount.type === "percentage" ? "pr-10" : ""
                  } ${
                    discountError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-stone-200"
                  }`}
                  inputMode="decimal"
                  max={discount.type === "percentage" ? "100" : undefined}
                  min="0"
                  onChange={(event) => onDiscountValueChange(event.target.value)}
                  placeholder={discount.type === "percentage" ? "10" : "50.00"}
                  type="number"
                  value={discount.value}
                />
                {discount.type === "percentage" ? (
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-stone-500">
                    %
                  </span>
                ) : null}
              </div>
            </label>
          ) : null}
          {discountError ? (
            <p className="text-sm font-medium text-red-700">{discountError}</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
