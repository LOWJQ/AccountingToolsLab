"use client";

import { Download, Plus, Repeat2, RotateCcw, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { formatCurrency as formatCurrencyValue } from "@/lib/currency";
import {
  calculateInvoiceLineItems,
  calculateInvoiceWithLineItems
} from "@/lib/invoice/invoice-calculations";
import { getNextInvoiceNumber } from "@/lib/invoice/invoice-numbering";
import { DEFAULT_INVOICE_TAX } from "@/lib/invoice/invoice-types";
import { createEmptyReceipt, createEmptyReceiptLineItem } from "@/lib/receipt/receipt-defaults";
import { createReceiptPdfLabels, toInvoiceDocument } from "@/lib/receipt/receipt-document";
import { RECEIPT_PAYMENT_METHODS, type ReceiptData } from "@/lib/receipt/receipt-types";

const fieldClassName =
  "h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";
const textareaClassName =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";
const addButtonClassName =
  "flex h-9 w-fit items-center gap-1.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-100";
const removeButtonClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent";

/**
 * Percentage or fixed amount, switched with the same toggle button the invoice
 * generator uses rather than a dropdown, so the two forms behave identically.
 */
function AmountTypeField({
  ariaPrefix,
  currencySymbol,
  onTypeChange,
  onValueChange,
  type,
  value
}: {
  ariaPrefix: string;
  currencySymbol: string;
  onTypeChange: (type: "fixed" | "percentage") => void;
  onValueChange: (value: string) => void;
  type: "fixed" | "percentage";
  value: string;
}) {
  const isPercentage = type === "percentage";

  return (
    <div className="flex h-10 min-w-0 items-stretch">
      {isPercentage ? (
        <div className="relative min-w-0 flex-1">
          <input
            aria-label={`${ariaPrefix} percentage`}
            className={`${fieldClassName} h-full rounded-r-none pr-8 text-right tabular-nums`}
            inputMode="decimal"
            onChange={(event) => onValueChange(event.target.value)}
            placeholder="0"
            value={value}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
            %
          </span>
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-l-lg border border-r-0 border-slate-200 bg-white focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
          <span className="inline-flex shrink-0 items-center px-3 text-sm font-semibold text-slate-600">
            {currencySymbol}
          </span>
          <input
            aria-label={`${ariaPrefix} amount`}
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 pr-3 text-right text-sm tabular-nums text-slate-950 outline-none placeholder:text-slate-400"
            inputMode="decimal"
            onChange={(event) => onValueChange(event.target.value)}
            placeholder="0"
            value={value}
          />
        </div>
      )}
      <button
        aria-label={`Switch ${ariaPrefix.toLowerCase()} to ${
          isPercentage ? "fixed amount" : "percentage"
        }`}
        className="inline-flex h-full w-12 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
        onClick={() => onTypeChange(isPercentage ? "fixed" : "percentage")}
        type="button"
      >
        <Repeat2 aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Same control pair as the invoice generator, shown at both ends of the form. */
function ReceiptActions({
  isGenerating,
  onDownload,
  onReset,
  placement
}: {
  isGenerating: boolean;
  onDownload: () => void;
  onReset: () => void;
  placement: "bottom" | "top";
}) {
  return (
    <div
      // Negative margins cancel the card's own padding so the bar sits flush
      // against the card edge, the way the invoice generator's bar does.
      className={`-mx-5 flex flex-col gap-3 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:-mx-7 md:px-7 ${
        placement === "bottom"
          ? "-mb-5 mt-8 rounded-b-lg border-t border-slate-200 md:-mb-7"
          : "-mt-5 mb-6 rounded-t-lg border-b border-slate-200 md:-mt-7"
      }`}
    >
      <button
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
        onClick={onReset}
        type="button"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4" />
        Reset / Clear everything
      </button>
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-wait disabled:opacity-70"
        disabled={isGenerating}
        onClick={onDownload}
        type="button"
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        {isGenerating ? "Preparing PDF..." : "Download receipt PDF"}
      </button>
    </div>
  );
}

export function ReceiptGenerator() {
  const { currency } = useCurrency();
  const formatCurrency = useMemo(
    () => (value: number) =>
      formatCurrencyValue(value, currency, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
    [currency]
  );

  // Built on the client so the date is the visitor's own, and so the server and
  // browser cannot disagree about "today" during hydration.
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: "error" | "warning" } | null>(null);
  const idPrefix = useId();

  useEffect(() => {
    setReceipt(createEmptyReceipt());
  }, []);

  const totals = useMemo(
    () => (receipt ? calculateInvoiceWithLineItems(toInvoiceDocument(receipt)) : null),
    [receipt]
  );

  if (!receipt || !totals) {
    return (
      <section className="w-full rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <p className="text-sm leading-6 text-slate-600">Loading the receipt form...</p>
      </section>
    );
  }

  const { calculation, lineItems: previewTotals } = totals;

  const update = (patch: Partial<ReceiptData>) =>
    setReceipt((current) => (current ? { ...current, ...patch } : current));

  function updateItem(index: number, patch: Partial<ReceiptData["items"][number]>) {
    setReceipt((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item, position) =>
              position === index ? { ...item, ...patch } : item
            )
          }
        : current
    );
  }

  function addItem() {
    setReceipt((current) =>
      current
        ? {
            ...current,
            items: [...current.items, createEmptyReceiptLineItem(`receipt-item-${Date.now()}`)]
          }
        : current
    );
  }

  function removeItem(index: number) {
    setReceipt((current) =>
      current && current.items.length > 1
        ? { ...current, items: current.items.filter((_, position) => position !== index) }
        : current
    );
  }

  function addTax() {
    setReceipt((current) =>
      current
        ? {
            ...current,
            tax: [
              ...current.tax.filter((row) => row.enabled),
              { ...DEFAULT_INVOICE_TAX, id: `tax-${Date.now()}`, enabled: true }
            ]
          }
        : current
    );
  }

  function updateTax(index: number, patch: Partial<ReceiptData["tax"][number]>) {
    setReceipt((current) =>
      current
        ? {
            ...current,
            tax: current.tax.map((row, position) =>
              position === index ? { ...row, ...patch } : row
            )
          }
        : current
    );
  }

  function removeTax(index: number) {
    setReceipt((current) =>
      current ? { ...current, tax: current.tax.filter((_, position) => position !== index) } : current
    );
  }

  function resetReceipt() {
    setReceipt(createEmptyReceipt());
    setStatus(null);
  }

  async function downloadPdf() {
    if (!receipt) {
      return;
    }

    setIsGenerating(true);
    setStatus(null);

    try {
      const invoiceData = toInvoiceDocument(receipt);
      const previewItems = calculateInvoiceLineItems(invoiceData.items).map((item, index) => ({
        ...item,
        description: invoiceData.items[index]?.description.trim() || `Item ${index + 1}`
      }));
      const { generateInvoicePdf } = await import("@/lib/invoice/invoice-pdf-generator");
      const result = await generateInvoicePdf({
        calculation,
        formatCurrency,
        invoiceData,
        labels: createReceiptPdfLabels(receipt),
        previewItems
      });

      // Roll the number forward so a run of receipts does not need retyping.
      const nextNumber = getNextInvoiceNumber(receipt.receiptNumber);

      if (nextNumber) {
        update({ receiptNumber: nextNumber });
      }

      if (result.warnings.length > 0) {
        setStatus({
          message: "The receipt downloaded, but the logo could not be included.",
          type: "warning"
        });
      }
    } catch {
      setStatus({
        message: "The receipt PDF could not be generated. Try again, or remove the logo first.",
        type: "error"
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const visibleTax = receipt.tax.filter((row) => row.enabled);

  return (
    <section
      aria-labelledby="receipt-generator-heading"
      className="w-full rounded-lg border border-slate-200 bg-white p-5 md:p-7"
    >
      <h2 className="sr-only" id="receipt-generator-heading">
        Receipt details
      </h2>

      <ReceiptActions
        isGenerating={isGenerating}
        onDownload={() => void downloadPdf()}
        onReset={resetReceipt}
        placement="top"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-950">From</p>
          <div className="grid gap-2">
            <input
              aria-label="Business name"
              className={fieldClassName}
              onChange={(event) => update({ businessName: event.target.value })}
              placeholder="Your business name"
              value={receipt.businessName}
            />
            <input
              aria-label="Business email or phone"
              className={fieldClassName}
              onChange={(event) => update({ businessContact: event.target.value })}
              placeholder="Business email or phone"
              value={receipt.businessContact}
            />
            <textarea
              aria-label="Business address"
              className={textareaClassName}
              onChange={(event) => update({ businessAddress: event.target.value })}
              placeholder="Business address"
              rows={2}
              value={receipt.businessAddress}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-950">Receipt details</p>
          <div className="grid gap-2">
            <div className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center">
              <label className="text-sm text-slate-700" htmlFor={`${idPrefix}-number`}>
                Receipt no.
              </label>
              <input
                className={fieldClassName}
                id={`${idPrefix}-number`}
                onChange={(event) => update({ receiptNumber: event.target.value })}
                placeholder="REC-001"
                value={receipt.receiptNumber}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center">
              <label className="text-sm text-slate-700" htmlFor={`${idPrefix}-date`}>
                Date paid
              </label>
              <input
                className={fieldClassName}
                id={`${idPrefix}-date`}
                onChange={(event) => update({ receiptDate: event.target.value })}
                type="date"
                value={receipt.receiptDate}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center">
              <label className="text-sm text-slate-700" htmlFor={`${idPrefix}-method`}>
                Paid by
              </label>
              <SelectMenu
                ariaLabel="Paid by"
                id={`${idPrefix}-method`}
                onChange={(paymentMethod) => update({ paymentMethod })}
                options={RECEIPT_PAYMENT_METHODS.map((method) => ({
                  label: method.label,
                  value: method.id
                }))}
                value={receipt.paymentMethod}
              />
            </div>
            {receipt.paymentMethod === "other" ? (
              <div className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center">
                <label className="text-sm text-slate-700" htmlFor={`${idPrefix}-method-other`}>
                  Method
                </label>
                <input
                  className={fieldClassName}
                  id={`${idPrefix}-method-other`}
                  onChange={(event) => update({ paymentMethodOther: event.target.value })}
                  placeholder="Describe how it was paid"
                  value={receipt.paymentMethodOther}
                />
              </div>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center">
              <label className="text-sm text-slate-700" htmlFor={`${idPrefix}-invoice-ref`}>
                Invoice ref
              </label>
              <input
                className={fieldClassName}
                id={`${idPrefix}-invoice-ref`}
                onChange={(event) => update({ invoiceReference: event.target.value })}
                placeholder="INV-001"
                value={receipt.invoiceReference}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-3 text-sm font-semibold text-slate-950">Received from</p>
        <div className="grid gap-2 sm:max-w-[calc(50%-0.75rem)]">
          <input
            aria-label="Customer name"
            className={fieldClassName}
            onChange={(event) => update({ receivedFrom: event.target.value })}
            placeholder="Customer name"
            value={receipt.receivedFrom}
          />
          <input
            aria-label="Customer email or phone"
            className={fieldClassName}
            onChange={(event) => update({ receivedFromContact: event.target.value })}
            placeholder="Customer email or phone"
            value={receipt.receivedFromContact}
          />
          <textarea
            aria-label="Customer address"
            className={textareaClassName}
            onChange={(event) => update({ receivedFromAddress: event.target.value })}
            placeholder="Customer address"
            rows={2}
            value={receipt.receivedFromAddress}
          />
        </div>
      </div>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-950">What was paid for</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <div className="hidden min-w-[720px] border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 sm:grid sm:grid-cols-[3rem_minmax(0,1.6fr)_7rem_5rem_7rem_2rem] sm:gap-3 sm:px-4">
            <span>No</span>
            <span>Description</span>
            <span className="text-right">Unit Price</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Amount</span>
            <span className="sr-only">Remove</span>
          </div>
          <div className="divide-y divide-slate-200 bg-white sm:min-w-[720px]">
            {receipt.items.map((item, index) => (
              <div
                className="grid gap-3 px-3 py-3 sm:grid-cols-[3rem_minmax(0,1.6fr)_7rem_5rem_7rem_2rem] sm:items-center sm:px-4"
                key={item.id}
              >
                <span className="hidden text-sm text-slate-600 sm:block">{index + 1}</span>
                <input
                  aria-label={`Line item ${index + 1} description`}
                  className={fieldClassName}
                  onChange={(event) => updateItem(index, { description: event.target.value })}
                  placeholder={`Item ${index + 1} description`}
                  value={item.description}
                />
                <input
                  aria-label={`Line item ${index + 1} unit price`}
                  className={`${fieldClassName} sm:text-right`}
                  inputMode="decimal"
                  onChange={(event) => updateItem(index, { unitPrice: event.target.value })}
                  placeholder="0.00"
                  value={item.unitPrice}
                />
                <input
                  aria-label={`Line item ${index + 1} quantity`}
                  className={`${fieldClassName} sm:text-right`}
                  inputMode="decimal"
                  onChange={(event) => updateItem(index, { quantity: event.target.value })}
                  placeholder="1"
                  value={item.quantity}
                />
                <span className="text-sm font-semibold tabular-nums text-slate-950 sm:text-right">
                  {formatCurrency(previewTotals[index]?.lineTotal ?? 0)}
                </span>
                <button
                  aria-label={`Remove line item ${index + 1}`}
                  className={removeButtonClassName}
                  disabled={receipt.items.length <= 1}
                  onClick={() => removeItem(index)}
                  type="button"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          onClick={addItem}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add item
        </button>
      </section>

      <section className="mt-5 flex justify-end">
        <div className="w-full max-w-xl text-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-950">Totals</h3>
          <div className="flex justify-between gap-4 border-t border-slate-200 py-2 text-slate-700">
            <span>Subtotal</span>
            <span className="font-semibold tabular-nums text-slate-950">
              {formatCurrency(calculation.subtotal)}
            </span>
          </div>

          <div className="space-y-0.5">
            {receipt.tax.map((taxRow, index) =>
              taxRow.enabled ? (
                <div
                  className="grid gap-2 py-1.5 text-slate-700 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,18rem)_2.5rem] sm:items-center"
                  key={taxRow.id}
                >
                  <input
                    aria-label={`Tax ${index + 1} label`}
                    className={fieldClassName}
                    onChange={(event) => updateTax(index, { label: event.target.value })}
                    placeholder="Tax"
                    value={taxRow.label}
                  />
                  <AmountTypeField
                    ariaPrefix={`Tax ${index + 1}`}
                    currencySymbol={currency}
                    onTypeChange={(type) => updateTax(index, { type })}
                    onValueChange={(taxValue) => updateTax(index, { value: taxValue })}
                    type={taxRow.type}
                    value={taxRow.value}
                  />
                  <button
                    aria-label={`Remove tax ${index + 1}`}
                    className={removeButtonClassName}
                    onClick={() => removeTax(index)}
                    type="button"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              ) : null
            )}
          </div>
          <button className={addButtonClassName} onClick={addTax} type="button">
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add tax
          </button>

          {!receipt.discount.enabled ? (
            <button
              className={addButtonClassName}
              onClick={() => update({ discount: { ...receipt.discount, enabled: true } })}
              type="button"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add discount
            </button>
          ) : (
            <div className="grid gap-2 py-1.5 text-slate-700 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,18rem)_2.5rem] sm:items-center">
              <input
                aria-label="Discount label"
                className={fieldClassName}
                onChange={(event) =>
                  update({ discount: { ...receipt.discount, label: event.target.value } })
                }
                placeholder="Discount"
                value={receipt.discount.label}
              />
              <AmountTypeField
                ariaPrefix="Discount"
                currencySymbol={currency}
                onTypeChange={(type) => update({ discount: { ...receipt.discount, type } })}
                onValueChange={(discountValue) =>
                  update({ discount: { ...receipt.discount, value: discountValue } })
                }
                type={receipt.discount.type}
                value={receipt.discount.value}
              />
              <button
                aria-label="Remove discount"
                className={removeButtonClassName}
                onClick={() => update({ discount: { ...receipt.discount, enabled: false } })}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          )}

          {!receipt.shipping.enabled ? (
            <button
              className={addButtonClassName}
              onClick={() => update({ shipping: { ...receipt.shipping, enabled: true } })}
              type="button"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add shipping
            </button>
          ) : (
            <div className="grid gap-2 py-1.5 text-slate-700 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,18rem)_2.5rem] sm:items-center">
              <input
                aria-label="Shipping label"
                className={fieldClassName}
                onChange={(event) =>
                  update({ shipping: { ...receipt.shipping, label: event.target.value } })
                }
                placeholder="Shipping"
                value={receipt.shipping.label}
              />
              <input
                aria-label="Shipping amount"
                className={`${fieldClassName} text-right`}
                inputMode="decimal"
                onChange={(event) =>
                  update({ shipping: { ...receipt.shipping, amount: event.target.value } })
                }
                placeholder="0.00"
                value={receipt.shipping.amount}
              />
              <button
                aria-label="Remove shipping"
                className={removeButtonClassName}
                onClick={() => update({ shipping: { ...receipt.shipping, enabled: false } })}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-3 flex justify-between gap-4 border-t border-slate-300 pt-3 text-lg font-semibold text-slate-950">
            <span>Total paid</span>
            <span className="tabular-nums">{formatCurrency(calculation.total)}</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-slate-950">Notes</h3>
        <textarea
          aria-label="Receipt notes"
          className={textareaClassName}
          onChange={(event) => update({ notes: event.target.value })}
          placeholder="Thank you for your payment."
          rows={2}
          value={receipt.notes}
        />
      </section>

      {status ? (
        <p
          aria-live="polite"
          className={`mt-6 rounded-lg border p-3 text-sm leading-6 ${
            status.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <ReceiptActions
        isGenerating={isGenerating}
        onDownload={() => void downloadPdf()}
        onReset={resetReceipt}
        placement="bottom"
      />
    </section>
  );
}
