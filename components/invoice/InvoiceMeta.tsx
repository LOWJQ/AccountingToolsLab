"use client";

import type { CurrencyCode } from "@/lib/currency";
import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";

type InvoiceMetaProps = {
  currency: CurrencyCode;
  currencyCodes: readonly CurrencyCode[];
  dueDate: string;
  dueDateError?: string;
  invoiceDate: string;
  invoiceDateError?: string;
  invoiceNumber: string;
  invoiceNumberError?: string;
  onCurrencyChange: (value: CurrencyCode) => void;
  onDueDateChange: (value: string) => void;
  onFieldBlur?: (field: "invoiceNumber" | "invoiceDate" | "dueDate") => void;
  onInvoiceDateChange: (value: string) => void;
  onInvoiceNumberChange: (value: string) => void;
};

export function InvoiceMeta({
  currency,
  currencyCodes,
  dueDate,
  dueDateError,
  invoiceDate,
  invoiceDateError,
  invoiceNumber,
  invoiceNumberError,
  onCurrencyChange,
  onDueDateChange,
  onFieldBlur,
  onInvoiceDateChange,
  onInvoiceNumberChange
}: InvoiceMetaProps) {
  return (
    <section className="grid gap-4">
      <h2 className="text-base font-semibold text-stone-950">Invoice details</h2>
      <div className="grid min-w-0 gap-4 md:grid-cols-4">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Invoice number</span>
          <input
            aria-describedby={invoiceNumberError ? "invoice-number-error" : undefined}
            aria-invalid={invoiceNumberError ? true : undefined}
            className={`h-12 w-full min-w-0 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              invoiceNumberError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.invoiceNumber}
            onBlur={() => onFieldBlur?.("invoiceNumber")}
            onChange={(event) => onInvoiceNumberChange(event.target.value)}
            value={invoiceNumber}
          />
          {invoiceNumberError ? (
            <p className="text-sm font-medium text-red-700" id="invoice-number-error">
              {invoiceNumberError}
            </p>
          ) : null}
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Invoice date</span>
          <input
            aria-describedby={invoiceDateError ? "invoice-date-error" : undefined}
            aria-invalid={invoiceDateError ? true : undefined}
            className={`h-12 w-full min-w-0 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              invoiceDateError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            onBlur={() => onFieldBlur?.("invoiceDate")}
            onChange={(event) => onInvoiceDateChange(event.target.value)}
            type="date"
            value={invoiceDate}
          />
          {invoiceDateError ? (
            <p className="text-sm font-medium text-red-700" id="invoice-date-error">
              {invoiceDateError}
            </p>
          ) : null}
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Due date</span>
          <input
            aria-describedby={dueDateError ? "due-date-error" : undefined}
            aria-invalid={dueDateError ? true : undefined}
            className={`h-12 w-full min-w-0 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              dueDateError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            onBlur={() => onFieldBlur?.("dueDate")}
            onChange={(event) => onDueDateChange(event.target.value)}
            type="date"
            value={dueDate}
          />
          {dueDateError ? (
            <p className="text-sm font-medium text-red-700" id="due-date-error">
              {dueDateError}
            </p>
          ) : null}
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Currency</span>
          <select
            className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
            value={currency}
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
