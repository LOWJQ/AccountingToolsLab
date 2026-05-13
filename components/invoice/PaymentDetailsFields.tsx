"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";
import { processPaymentQrFile } from "@/lib/invoice/invoice-payment-qr";
import type { InvoicePaymentDetails } from "@/lib/invoice/invoice-types";

type PaymentDetailsFieldsProps = {
  payment: InvoicePaymentDetails;
  paymentErrors?: Partial<Record<keyof InvoicePaymentDetails, string>>;
  onChange: (field: keyof InvoicePaymentDetails, value: string | undefined) => void;
  onFieldBlur?: (field: keyof InvoicePaymentDetails) => void;
};

const inputClassName =
  "h-12 rounded-xl border bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100";

export function PaymentDetailsFields({
  payment,
  paymentErrors = {},
  onChange,
  onFieldBlur
}: PaymentDetailsFieldsProps) {
  const qrInputRef = useRef<HTMLInputElement>(null);
  const [qrMessage, setQrMessage] = useState("");
  const [isProcessingQr, setIsProcessingQr] = useState(false);

  async function handlePaymentQrChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsProcessingQr(true);
    setQrMessage("Processing payment QR...");

    const result = await processPaymentQrFile(file);

    setIsProcessingQr(false);

    if (result.ok) {
      onChange("paymentQrDataUrl", result.dataUrl);
      setQrMessage("");
      return;
    }

    onChange("paymentQrDataUrl", undefined);
    setQrMessage(result.error);
  }

  function removePaymentQr() {
    onChange("paymentQrDataUrl", undefined);
    setQrMessage("");

    if (qrInputRef.current) {
      qrInputRef.current.value = "";
    }
  }

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
            aria-describedby={paymentErrors.bankName ? "payment-bank-name-error" : undefined}
            aria-invalid={paymentErrors.bankName ? true : undefined}
            className={`${inputClassName} ${
              paymentErrors.bankName ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.bankName}
            onBlur={() => onFieldBlur?.("bankName")}
            onChange={(event) => onChange("bankName", event.target.value)}
            placeholder="Maybank"
            value={payment.bankName}
          />
          {paymentErrors.bankName ? (
            <p className="text-sm font-medium text-red-700" id="payment-bank-name-error">
              {paymentErrors.bankName}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">Account holder name</span>
          <input
            aria-describedby={paymentErrors.accountName ? "payment-account-name-error" : undefined}
            aria-invalid={paymentErrors.accountName ? true : undefined}
            className={`${inputClassName} ${
              paymentErrors.accountName ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.accountName}
            onBlur={() => onFieldBlur?.("accountName")}
            onChange={(event) => onChange("accountName", event.target.value)}
            placeholder="Your business or account name"
            value={payment.accountName}
          />
          {paymentErrors.accountName ? (
            <p className="text-sm font-medium text-red-700" id="payment-account-name-error">
              {paymentErrors.accountName}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">Account number</span>
          <input
            aria-describedby={paymentErrors.accountNumber ? "payment-account-number-error" : undefined}
            aria-invalid={paymentErrors.accountNumber ? true : undefined}
            className={`${inputClassName} ${
              paymentErrors.accountNumber ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.accountNumber}
            onBlur={() => onFieldBlur?.("accountNumber")}
            onChange={(event) => onChange("accountNumber", event.target.value)}
            placeholder="Account number"
            value={payment.accountNumber}
          />
          {paymentErrors.accountNumber ? (
            <p className="text-sm font-medium text-red-700" id="payment-account-number-error">
              {paymentErrors.accountNumber}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-stone-800">DuitNow ID</span>
          <input
            aria-describedby={paymentErrors.duitNowId ? "payment-duitnow-id-error" : undefined}
            aria-invalid={paymentErrors.duitNowId ? true : undefined}
            className={`${inputClassName} ${
              paymentErrors.duitNowId ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.duitNowId}
            onBlur={() => onFieldBlur?.("duitNowId")}
            onChange={(event) => onChange("duitNowId", event.target.value)}
            placeholder="Phone number, NRIC, or business registration number"
            value={payment.duitNowId}
          />
          {paymentErrors.duitNowId ? (
            <p className="text-sm font-medium text-red-700" id="payment-duitnow-id-error">
              {paymentErrors.duitNowId}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">Payment link</span>
          <input
            aria-describedby={paymentErrors.paymentLink ? "payment-link-error" : undefined}
            aria-invalid={paymentErrors.paymentLink ? true : undefined}
            className={`${inputClassName} ${
              paymentErrors.paymentLink ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.paymentLink}
            onBlur={() => onFieldBlur?.("paymentLink")}
            onChange={(event) => onChange("paymentLink", event.target.value)}
            placeholder="https://example.com/pay"
            type="url"
            value={payment.paymentLink}
          />
          {paymentErrors.paymentLink ? (
            <p className="text-sm font-medium text-red-700" id="payment-link-error">
              {paymentErrors.paymentLink}
            </p>
          ) : null}
        </label>
        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-stone-800">
            Additional payment notes
          </span>
          <textarea
            aria-describedby={paymentErrors.notes ? "payment-notes-error" : undefined}
            aria-invalid={paymentErrors.notes ? true : undefined}
            className={`min-h-24 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
              paymentErrors.notes ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
            }`}
            maxLength={INVOICE_TEXT_MAX_LENGTHS.paymentNotes}
            onBlur={() => onFieldBlur?.("notes")}
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="Please include the invoice number as payment reference."
            value={payment.notes}
          />
          {paymentErrors.notes ? (
            <p className="text-sm font-medium text-red-700" id="payment-notes-error">
              {paymentErrors.notes}
            </p>
          ) : null}
        </label>
        <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="text-sm font-semibold text-stone-800" htmlFor="payment-qr-image">
                Payment QR image
              </label>
              <p className="mt-1 text-sm text-stone-500">
                Upload your own payment QR image, PNG or JPG, max 2MB.
              </p>
            </div>
            {payment.paymentQrDataUrl ? (
              <div className="flex items-center gap-3">
                <Image
                  alt="Payment QR preview"
                  className="h-20 w-20 rounded-lg border border-stone-200 bg-white object-contain p-1"
                  height={80}
                  unoptimized
                  src={payment.paymentQrDataUrl}
                  width={80}
                />
                <button
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                  onClick={removePaymentQr}
                  type="button"
                >
                  Remove QR image
                </button>
              </div>
            ) : null}
          </div>
          <input
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            className="block w-full text-sm text-stone-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
            disabled={isProcessingQr}
            id="payment-qr-image"
            onChange={(event) => handlePaymentQrChange(event.target.files?.[0])}
            ref={qrInputRef}
            type="file"
          />
          <p
            aria-live="polite"
            className={`text-sm ${qrMessage === "Processing payment QR..." ? "text-stone-600" : "font-medium text-red-700"}`}
          >
            {qrMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
