"use client";

import { LogoUploader } from "@/components/invoice/LogoUploader";

type InvoiceBillFromProps = {
  businessAddress: string;
  businessAddressError?: string;
  businessContact: string;
  businessContactError?: string;
  businessLogoDataUrl?: string;
  businessNameError?: string;
  businessName: string;
  onBusinessAddressChange: (value: string) => void;
  onBusinessContactChange: (value: string) => void;
  onBusinessLogoChange: (value: string | undefined) => void;
  onBusinessNameChange: (value: string) => void;
};

export function InvoiceBillFrom({
  businessAddress,
  businessAddressError,
  businessContact,
  businessContactError,
  businessLogoDataUrl,
  businessNameError,
  businessName,
  onBusinessAddressChange,
  onBusinessContactChange,
  onBusinessLogoChange,
  onBusinessNameChange
}: InvoiceBillFromProps) {
  return (
    <section className="grid gap-4">
      <h2 className="text-base font-semibold text-stone-950">Business details</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Business name</span>
          <input
            aria-describedby={businessNameError ? "business-name-error" : undefined}
            className={`h-12 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              businessNameError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            onChange={(event) => onBusinessNameChange(event.target.value)}
            placeholder="Your business name"
            value={businessName}
          />
          {businessNameError ? (
            <p className="text-sm font-medium text-red-700" id="business-name-error">
              {businessNameError}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Business email or phone
          </span>
          <input
            aria-describedby={businessContactError ? "business-contact-error" : undefined}
            className={`h-12 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              businessContactError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            onChange={(event) => onBusinessContactChange(event.target.value)}
            placeholder="hello@example.com"
            value={businessContact}
          />
          {businessContactError ? (
            <p className="text-sm font-medium text-red-700" id="business-contact-error">
              {businessContactError}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Business address</span>
          <textarea
            aria-describedby={businessAddressError ? "business-address-error" : undefined}
            className={`min-h-20 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              businessAddressError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            onChange={(event) => onBusinessAddressChange(event.target.value)}
            placeholder="Business address"
            value={businessAddress}
          />
          {businessAddressError ? (
            <p className="text-sm font-medium text-red-700" id="business-address-error">
              {businessAddressError}
            </p>
          ) : null}
        </label>
        <LogoUploader logoDataUrl={businessLogoDataUrl} onChange={onBusinessLogoChange} />
      </div>
    </section>
  );
}
