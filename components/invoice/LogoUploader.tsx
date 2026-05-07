"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { processLogoFile } from "@/lib/invoice/invoice-logo";

type LogoUploaderProps = {
  logoDataUrl?: string;
  onChange: (logoDataUrl: string | undefined) => void;
};

export function LogoUploader({ logoDataUrl, onChange }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleLogoChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsProcessing(true);
    setMessage("Processing logo...");

    const result = await processLogoFile(file);

    setIsProcessing(false);

    if (result.ok) {
      onChange(result.dataUrl);
      setMessage("");
      return;
    }

    onChange(undefined);
    setMessage(result.error);
  }

  function removeLogo() {
    onChange(undefined);
    setMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:col-span-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="text-sm font-semibold text-stone-800" htmlFor="business-logo">
            Business logo (optional)
          </label>
          <p className="mt-1 text-sm text-stone-500">Upload PNG or JPG, max 2MB.</p>
        </div>
        {logoDataUrl ? (
          <div className="flex items-center gap-3">
            <Image
              alt="Business logo preview"
              className="h-12 max-w-32 rounded-lg border border-stone-200 bg-white object-contain p-1"
              height={48}
              unoptimized
              src={logoDataUrl}
              width={128}
            />
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              onClick={removeLogo}
              type="button"
            >
              Remove logo
            </button>
          </div>
        ) : null}
      </div>
      <input
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        className="block w-full text-sm text-stone-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
        disabled={isProcessing}
        id="business-logo"
        onChange={(event) => handleLogoChange(event.target.files?.[0])}
        ref={inputRef}
        type="file"
      />
      <p
        aria-live="polite"
        className={`text-sm ${message === "Processing logo..." ? "text-stone-600" : "font-medium text-red-700"}`}
      >
        {message}
      </p>
    </div>
  );
}
