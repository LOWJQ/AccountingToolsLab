"use client";

import Image from "next/image";
import type {
  InvoiceCalculationResult,
  InvoiceLineCalculationResult
} from "@/lib/invoice/invoice-calculations";
import { parseInvoiceAmount } from "@/lib/invoice/invoice-calculations";
import type { InvoiceData } from "@/lib/invoice/invoice-types";

type InvoicePreviewProps = {
  calculation: InvoiceCalculationResult;
  formatCurrency: (value: number) => string;
  invoiceData: InvoiceData;
  previewItems: InvoiceLineCalculationResult[];
};

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function InvoicePreview({
  calculation,
  formatCurrency,
  invoiceData,
  previewItems
}: InvoicePreviewProps) {
  const {
    businessAddress,
    businessContact,
    businessLogoDataUrl,
    businessName,
    customerAddress,
    customerContact,
    customerName,
    dueDate,
    invoiceDate,
    invoiceNumber,
    payment,
    terms
  } = invoiceData;
  const subtotal = calculation.subtotal;
  const discountAmount = calculation.discountAmount;
  const taxableAmount = calculation.taxableAmount;
  const taxRate = invoiceData.tax.enabled ? parseInvoiceAmount(invoiceData.tax.rate) ?? 0 : 0;
  const taxAmount = calculation.taxAmount;
  const total = calculation.total;
  const hasDiscount = discountAmount > 0;
  const hasTax = taxAmount > 0;
  const taxLabel = `SST / Tax (${formatAmount(taxRate)}%)`;
  const paymentDetailRows = [
    ["Bank", payment.bankName],
    ["Account name", payment.accountName],
    ["Account number", payment.accountNumber],
    ["DuitNow ID", payment.duitNowId],
    ["Payment link", payment.paymentLink],
    ["Notes", payment.notes]
  ].filter(([, value]) => value.trim() !== "");
  const hasPaymentQr = Boolean(payment.paymentQrDataUrl);
  const hasPaymentDetails = paymentDetailRows.length > 0 || hasPaymentQr;

  return (
    <div className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div
        className="invoice-print-area min-w-0 border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
        id="invoice-print-area"
      >
        <div className="invoice-print-header grid gap-6 border-b border-stone-200 pb-5 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.85fr)]">
          <div className="min-w-0">
            <h2 className="break-words text-2xl font-semibold tracking-tight text-stone-950">
              {businessName || "Business name"}
            </h2>
            {businessContact ? (
              <p className="invoice-print-muted mt-2 break-words text-sm leading-6 text-stone-600">
                {businessContact}
              </p>
            ) : null}
            {businessAddress ? (
              <p className="invoice-print-muted mt-1 whitespace-pre-line break-words text-sm leading-6 text-stone-600">
                {businessAddress}
              </p>
            ) : null}
          </div>
          <div className="min-w-0 text-left sm:text-right">
            {businessLogoDataUrl ? (
              <Image
                alt={`${businessName || "Business"} logo`}
                className="mb-4 ml-0 max-h-16 max-w-40 object-contain sm:ml-auto"
                height={80}
                unoptimized
                src={businessLogoDataUrl}
                width={180}
              />
            ) : null}
            <p className="text-3xl font-semibold uppercase tracking-wide text-slate-700">
              Invoice
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-stone-600">
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="font-medium text-stone-500">Invoice #:</dt>
                <dd className="font-semibold text-stone-950">
                  {invoiceNumber || "Invoice number"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.85fr)]">
          <div className="grid max-w-xl gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Bill To
            </p>
            <h3 className="break-words text-lg font-semibold text-stone-950">
              {customerName || "Customer name"}
            </h3>
            {customerContact ? (
              <p className="break-words text-sm leading-6 text-stone-600">{customerContact}</p>
            ) : null}
            {customerAddress ? (
              <p className="whitespace-pre-line break-words text-sm leading-6 text-stone-600">
                {customerAddress}
              </p>
            ) : null}
          </div>
          <dl className="grid content-start gap-2 text-sm text-stone-600 sm:text-right">
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="font-medium text-stone-500">Date:</dt>
              <dd>{invoiceDate || "Invoice date"}</dd>
            </div>
            {dueDate ? (
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="font-medium text-stone-500">Due:</dt>
                <dd>{dueDate}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="invoice-preview-lines mt-6 overflow-hidden border border-stone-200">
          <div className="invoice-preview-line invoice-preview-heading hidden bg-slate-700 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-white sm:grid sm:grid-cols-[3rem_minmax(0,1.6fr)_6.5rem_4.5rem_7rem] sm:gap-3 sm:px-4">
            <span>No</span>
            <span>Description</span>
            <span className="text-right leading-4">Unit Price</span>
            <span className="text-right">Quantity</span>
            <span className="text-right leading-4">Amount</span>
          </div>
          <div className="divide-y divide-stone-100 bg-white">
            {previewItems.map((item, index) => (
              <div
                className="invoice-preview-line grid min-w-0 gap-3 px-3 py-3 text-sm odd:bg-white even:bg-slate-50 sm:grid-cols-[3rem_minmax(0,1.6fr)_6.5rem_4.5rem_7rem] sm:gap-3 sm:px-4"
                key={`${item.description}-${index}`}
              >
                <div className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                    No
                  </span>
                  <span className="mt-1 block tabular-nums text-stone-600 sm:mt-0">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                    Description
                  </span>
                  <span className="mt-1 block min-w-0 break-words font-medium text-stone-900 sm:mt-0">
                    {item.description}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                    Unit Price
                  </span>
                  <span className="mt-1 block text-left tabular-nums text-stone-600 sm:mt-0 sm:text-right">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                    Quantity
                  </span>
                  <span className="mt-1 block text-left tabular-nums text-stone-600 sm:mt-0 sm:text-right">
                    {formatAmount(item.quantity)}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                    Amount
                  </span>
                  <span className="mt-1 block text-left font-semibold tabular-nums text-stone-950 sm:mt-0 sm:text-right">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="invoice-totals-wrap mt-4 flex justify-end">
          <div className="invoice-totals-box w-full max-w-sm border border-stone-200 bg-stone-50 p-4">
            <div className="invoice-total-row flex justify-between gap-4 text-sm text-stone-600">
              <span className="invoice-total-label">Subtotal</span>
              <span className="invoice-total-amount font-semibold text-stone-950">
                {formatCurrency(subtotal)}
              </span>
            </div>
            {hasDiscount ? (
              <>
                <div className="invoice-total-row mt-2.5 flex justify-between gap-4 text-sm text-stone-600">
                  <span className="invoice-total-label">Discount</span>
                  <span className="invoice-total-amount font-semibold text-stone-950">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
                <div className="invoice-total-row mt-2.5 flex justify-between gap-4 text-sm text-stone-600">
                  <span className="invoice-total-label">Amount after discount</span>
                  <span className="invoice-total-amount font-semibold text-stone-950">
                    {formatCurrency(taxableAmount)}
                  </span>
                </div>
              </>
            ) : null}
            {hasTax ? (
              <div className="invoice-total-row mt-2.5 flex justify-between gap-4 text-sm text-stone-600">
                <span className="invoice-total-label">{taxLabel}</span>
                <span className="invoice-total-amount font-semibold text-stone-950">
                  {formatCurrency(taxAmount)}
                </span>
              </div>
            ) : null}
            <div className="invoice-total-row invoice-grand-total mt-3 flex justify-between gap-4 border-t border-stone-300 pt-3 text-lg font-semibold text-stone-950">
              <span className="invoice-total-label">Total</span>
              <span className="invoice-total-amount">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {hasPaymentDetails || terms.trim() ? (
          <section className="mt-8 border-t border-stone-200 pt-6">
            <div
              className={`grid gap-6 ${
                hasPaymentDetails && terms.trim()
                  ? "md:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] md:items-start"
                  : ""
              }`}
            >
              {hasPaymentDetails ? (
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-stone-950">
                    Payment Details
                  </h3>
                  {paymentDetailRows.length > 0 ? (
                    <dl className="mt-3 grid gap-1.5 text-sm leading-6 text-stone-600">
                      {paymentDetailRows.map(([label, value]) => (
                        <div
                          className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)]"
                          key={label}
                        >
                          <dt className="font-medium text-stone-500">{label}:</dt>
                          <dd className="min-w-0 whitespace-pre-line break-words">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {payment.paymentQrDataUrl ? (
                    <div className="mt-4 inline-grid justify-items-center gap-1.5 text-center">
                      <Image
                        alt="Payment QR"
                        className="h-28 w-28 object-contain"
                        height={112}
                        unoptimized
                        src={payment.paymentQrDataUrl}
                        width={112}
                      />
                      <p className="text-xs font-medium text-stone-500">
                        Scan here to pay
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {terms.trim() ? (
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-stone-950">
                    Terms &amp; Conditions
                  </h3>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-stone-600">
                    {terms
                      .trim()
                      .split(/\r?\n/)
                      .filter((paragraph) => paragraph.trim() !== "")
                      .map((paragraph, index) => (
                        <p className="break-words" key={`${paragraph}-${index}`}>
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
