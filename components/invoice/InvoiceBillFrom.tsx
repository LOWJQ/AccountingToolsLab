"use client";

import { LogoUploader } from "@/components/invoice/LogoUploader";

type InvoiceBillFromProps = {
  businessAddress: string;
  businessContact: string;
  businessLogoDataUrl?: string;
  businessName: string;
  onBusinessAddressChange: (value: string) => void;
  onBusinessContactChange: (value: string) => void;
  onBusinessLogoChange: (value: string | undefined) => void;
  onBusinessNameChange: (value: string) => void;
};

export function InvoiceBillFrom({
  businessAddress,
  businessContact,
  businessLogoDataUrl,
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
            className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onBusinessNameChange(event.target.value)}
            placeholder="Your business name"
            value={businessName}
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Business email or phone
          </span>
          <input
            className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onBusinessContactChange(event.target.value)}
            placeholder="hello@example.com"
            value={businessContact}
          />
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Business address</span>
          <textarea
            className="min-h-20 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onBusinessAddressChange(event.target.value)}
            placeholder="Business address"
            value={businessAddress}
          />
        </label>
        <LogoUploader logoDataUrl={businessLogoDataUrl} onChange={onBusinessLogoChange} />
      </div>
    </section>
  );
}
