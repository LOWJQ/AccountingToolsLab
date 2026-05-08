"use client";

import type { InvoicePaymentDetails } from "@/lib/invoice/invoice-types";

type PaymentDetailsFieldsProps = {
  payment: InvoicePaymentDetails;
  paymentLinkError?: string;
  onChange: (field: keyof InvoicePaymentDetails, value: string) => void;
};

const inputClassName =
  "h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

export function PaymentDetailsFields({
  payment,
  paymentLinkError,
  onChange
}: PaymentDetailsFieldsProps) {
  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-base font-semibold text-stone-950">Payment details (optional)</h2>
        <p className="mt-1 text-sm leading-6 text-stone-500">
          Payment details are optional and saved on this device only.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">Bank name</span>
          <input
            className={inputClassName}
            onChange={(event) => onChange("bankName", event.target.value)}
            placeholder="Maybank"
            value={payment.bankName}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">Account holder name</span>
          <input
            className={inputClassName}
            onChange={(event) => onChange("accountName", event.target.value)}
            placeholder="Your business or account name"
            value={payment.accountName}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">Account number</span>
          <input
            className={inputClassName}
            onChange={(event) => onChange("accountNumber", event.target.value)}
            placeholder="Account number"
            value={payment.accountNumber}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">DuitNow ID</span>
          <input
            className={inputClassName}
            onChange={(event) => onChange("duitNowId", event.target.value)}
            placeholder="Phone number, NRIC, or business registration number"
            value={payment.duitNowId}
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Payment link</span>
          <input
            aria-describedby={paymentLinkError ? "payment-link-error" : undefined}
            className={inputClassName}
            onChange={(event) => onChange("paymentLink", event.target.value)}
            placeholder="https://example.com/pay"
            type="url"
            value={payment.paymentLink}
          />
          {paymentLinkError ? (
            <p className="text-sm font-medium text-red-700" id="payment-link-error">
              {paymentLinkError}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Additional payment notes
          </span>
          <textarea
            className="min-h-24 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="Please include the invoice number as payment reference."
            value={payment.notes}
          />
        </label>
      </div>
    </section>
  );
}
