"use client";

import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";

type InvoiceCustomerProps = {
  customerAddress: string;
  customerAddressError?: string;
  customerContact: string;
  customerContactError?: string;
  customerNameError?: string;
  customerName: string;
  onCustomerAddressChange: (value: string) => void;
  onCustomerContactChange: (value: string) => void;
  onCustomerNameChange: (value: string) => void;
};

export function InvoiceCustomer({
  customerAddress,
  customerAddressError,
  customerContact,
  customerContactError,
  customerNameError,
  customerName,
  onCustomerAddressChange,
  onCustomerContactChange,
  onCustomerNameChange
}: InvoiceCustomerProps) {
  return (
    <section className="grid gap-4">
      <h2 className="text-base font-semibold text-stone-950">Customer details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Customer name</span>
          <input
            aria-describedby={customerNameError ? "customer-name-error" : undefined}
            className={`h-12 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              customerNameError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            placeholder="Customer name"
            value={customerName}
          />
          {customerNameError ? (
            <p className="text-sm font-medium text-red-700" id="customer-name-error">
              {customerNameError}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Customer email or phone
          </span>
          <input
            aria-describedby={customerContactError ? "customer-contact-error" : undefined}
            className={`h-12 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              customerContactError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.customerContact}
            onChange={(event) => onCustomerContactChange(event.target.value)}
            placeholder="customer@example.com"
            value={customerContact}
          />
          {customerContactError ? (
            <p className="text-sm font-medium text-red-700" id="customer-contact-error">
              {customerContactError}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Customer address</span>
          <textarea
            aria-describedby={customerAddressError ? "customer-address-error" : undefined}
            className={`min-h-20 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              customerAddressError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.customerAddress}
            onChange={(event) => onCustomerAddressChange(event.target.value)}
            placeholder="Customer address"
            value={customerAddress}
          />
          {customerAddressError ? (
            <p className="text-sm font-medium text-red-700" id="customer-address-error">
              {customerAddressError}
            </p>
          ) : null}
        </label>
      </div>
    </section>
  );
}
