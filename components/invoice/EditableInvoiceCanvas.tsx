"use client";

import Image from "next/image";
import { memo, useRef, useState } from "react";
import { Download, Plus, Repeat2, RotateCcw, Trash2, Upload, X } from "lucide-react";
import type { InvoiceCalculationResult } from "@/lib/invoice/invoice-calculations";
import { formatLineItemErrorForDisplay } from "@/lib/invoice/invoice-line-item-error-display";
import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";
import { processLogoFile } from "@/lib/invoice/invoice-logo";
import { processPaymentQrFile } from "@/lib/invoice/invoice-payment-qr";
import type {
  InvoiceDiscount,
  InvoiceLineItem,
  InvoicePaymentDetails,
  InvoiceShipping,
  InvoiceTax
} from "@/lib/invoice/invoice-types";

type EditableInvoiceCanvasProps = {
  autosaveError: string;
  businessAddress: string;
  businessAddressError: string;
  businessContact: string;
  businessContactError: string;
  businessLogoDataUrl?: string;
  businessName: string;
  businessNameError: string;
  calculation: InvoiceCalculationResult;
  currencySymbol: string;
  customerAddress: string;
  customerAddressError: string;
  customerContact: string;
  customerContactError: string;
  customerName: string;
  customerNameError: string;
  discount: InvoiceDiscount;
  discountError: string;
  discountLabelError: string;
  dueDate: string;
  dueDateError: string;
  formatCurrency: (value: number) => string;
  getLineItemError: (
    index: number,
    key: "description" | "quantity" | "unitPrice"
  ) => string;
  getTaxError: (index: number, key: "label" | "value") => string;
  invoiceDate: string;
  invoiceDateError: string;
  invoiceNumber: string;
  invoiceNumberError: string;
  isGeneratingPdf: boolean;
  lineItemPreviewTotals: number[];
  lineItems: InvoiceLineItem[];
  lineItemsMessage: string;
  notes: string;
  notesError: string;
  onAddLineItem: () => void;
  onBusinessAddressChange: (value: string) => void;
  onBusinessContactChange: (value: string) => void;
  onBusinessLogoChange: (value: string | undefined) => void;
  onBusinessNameChange: (value: string) => void;
  onClearEverything: () => void;
  onCustomerAddressChange: (value: string) => void;
  onCustomerContactChange: (value: string) => void;
  onCustomerNameChange: (value: string) => void;
  onDiscountEnabledChange: (enabled: boolean) => void;
  onDiscountLabelChange: (value: string) => void;
  onDiscountTypeToggle: () => void;
  onDiscountValueChange: (value: string) => void;
  onDownloadInvoice: () => void;
  onDueDateChange: (value: string) => void;
  onFieldBlur: (field: string) => void;
  onAddTax: () => void;
  onInvoiceDateChange: (value: string) => void;
  onInvoiceNumberChange: (value: string) => void;
  onLineItemBlur: (index: number, key: "description" | "quantity" | "unitPrice") => void;
  onNotesChange: (value: string) => void;
  onPaymentChange: (field: keyof InvoicePaymentDetails, value: string | undefined) => void;
  onPaymentFieldBlur: (field: keyof InvoicePaymentDetails) => void;
  onRemoveLineItem: (id: string) => void;
  onShippingAmountChange: (value: string) => void;
  onShippingEnabledChange: (enabled: boolean) => void;
  onShippingLabelChange: (value: string) => void;
  onRemoveTax: (id: string) => void;
  onTaxLabelChange: (id: string, value: string) => void;
  onTaxTypeChange: (id: string, type: InvoiceTax["type"]) => void;
  onTaxValueChange: (id: string, value: string) => void;
  onTermsChange: (value: string) => void;
  onUpdateLineItem: (id: string, key: keyof InvoiceLineItem, value: string) => void;
  payment: InvoicePaymentDetails;
  paymentErrors: Partial<Record<keyof InvoicePaymentDetails, string>>;
  pdfStatus?: { type: "error" | "warning"; message: string } | null;
  shipping: InvoiceShipping;
  shippingError: string;
  shippingLabelError: string;
  tax: InvoiceTax[];
  terms: string;
  termsError: string;
  validationSummaryMessage: string;
};

const editableBaseClass =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-500 focus:ring-4 focus:ring-slate-100";
const multilineInputClass = `${editableBaseClass} px-3 py-2 text-sm leading-6`;

function errorClass(error: string) {
  return error ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100" : "";
}

function FieldError({ error, id }: { error: string; id: string }) {
  if (!error) {
    return null;
  }

  return (
    <p className="mt-1 whitespace-nowrap text-xs font-medium text-red-700" id={id}>
      {error}
    </p>
  );
}

function EditableInput({
  ariaLabel,
  autoFocus = false,
  className = "",
  error = "",
  errorId,
  inputMode,
  max,
  maxLength,
  min,
  onBlur,
  onChange,
  placeholder,
  type = "text",
  value
}: {
  ariaLabel: string;
  autoFocus?: boolean;
  className?: string;
  error?: string;
  errorId: string;
  inputMode?: "decimal" | "text";
  max?: string;
  maxLength?: number;
  min?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "date" | "number" | "text" | "url";
  value: string;
}) {
  return (
    <>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={`${editableBaseClass} h-10 px-3 text-sm ${errorClass(error)} ${className}`}
        inputMode={inputMode}
        max={max}
        maxLength={maxLength}
        min={min}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      <FieldError error={error} id={errorId} />
    </>
  );
}

function EditableTextarea({
  ariaLabel,
  className = "",
  error = "",
  errorId,
  maxLength,
  onBlur,
  onChange,
  placeholder,
  rows = 2,
  value
}: {
  ariaLabel: string;
  className?: string;
  error?: string;
  errorId: string;
  maxLength?: number;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  value: string;
}) {
  return (
    <>
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
        className={`${multilineInputClass} ${errorClass(error)} ${className}`}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
      <FieldError error={error} id={errorId} />
    </>
  );
}

export function EditableInvoiceActions({
  isGeneratingPdf,
  onClearEverything,
  onDownloadInvoice,
  /** "bottom" flips the divider so the bar reads as closing the form rather
   *  than heading it. The same controls appear at both ends of a long form. */
  placement = "top",
  validationSummaryMessage
}: Pick<
  EditableInvoiceCanvasProps,
  | "isGeneratingPdf"
  | "onClearEverything"
  | "onDownloadInvoice"
  | "validationSummaryMessage"
> & { placement?: "bottom" | "top" }) {
  return (
    <div
      className={`flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-center sm:justify-between ${
        placement === "bottom" ? "border-t border-slate-200" : "border-b border-slate-200"
      }`}
    >
      <div className="flex flex-wrap gap-2">
        <button
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
          onClick={onClearEverything}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Reset / Clear everything
        </button>
      </div>
      <button
        aria-describedby={validationSummaryMessage ? "invoice-validation-summary" : undefined}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-wait disabled:opacity-70"
        disabled={isGeneratingPdf}
        onClick={onDownloadInvoice}
        type="button"
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        {isGeneratingPdf ? "Preparing PDF..." : "Download invoice PDF"}
      </button>
    </div>
  );
}

function EditableInvoiceLogo({
  businessLogoDataUrl,
  businessName,
  onBusinessLogoChange
}: Pick<
  EditableInvoiceCanvasProps,
  "businessLogoDataUrl" | "businessName" | "onBusinessLogoChange"
>) {
  const logoInputRef = useRef<HTMLInputElement>(null);
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
      onBusinessLogoChange(result.dataUrl);
      setMessage("");
      return;
    }

    onBusinessLogoChange(undefined);
    setMessage(result.error);
  }

  function openLogoPicker() {
    logoInputRef.current?.click();
  }

  function removeLogo() {
    onBusinessLogoChange(undefined);
    setMessage("");

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  return (
    <div className="grid justify-items-start gap-2 sm:justify-items-end">
      <button
        aria-label={businessLogoDataUrl ? "Replace business logo" : "Upload logo"}
        className="group flex min-h-20 w-40 items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-100"
        disabled={isProcessing}
        onClick={openLogoPicker}
        type="button"
      >
        {businessLogoDataUrl ? (
          <Image
            alt={`${businessName || "Business"} logo`}
            className="max-h-16 max-w-36 object-contain"
            height={80}
            unoptimized
            src={businessLogoDataUrl}
            width={160}
          />
        ) : (
          <span className="inline-flex items-center gap-2">
            <Upload aria-hidden="true" className="h-4 w-4" />
            Upload logo
          </span>
        )}
      </button>
      <input
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        className="sr-only"
        disabled={isProcessing}
        onChange={(event) => handleLogoChange(event.target.files?.[0])}
        ref={logoInputRef}
        type="file"
      />
      {businessLogoDataUrl ? (
        <div className="flex gap-2">
          <button
            className="text-xs font-semibold text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline focus:outline-none focus:ring-4 focus:ring-slate-100"
            onClick={openLogoPicker}
            type="button"
          >
            Replace
          </button>
          <button
            className="text-xs font-semibold text-red-600 underline-offset-4 hover:text-red-800 hover:underline focus:outline-none focus:ring-4 focus:ring-red-100"
            onClick={removeLogo}
            type="button"
          >
            Remove
          </button>
        </div>
      ) : null}
      <p
        aria-live="polite"
        className={`min-h-4 text-xs ${
          message === "Processing logo..." ? "text-stone-500" : "font-medium text-red-700"
        }`}
      >
        {message}
      </p>
    </div>
  );
}

export function EditableInvoiceHeader(props: EditableInvoiceCanvasProps) {
  return (
    <header className="grid gap-6 border-b border-slate-200 pb-6 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.78fr)]">
      <div className="min-w-0">
        <p className="mb-3 text-sm font-semibold text-slate-950">Business information</p>
        <div className="grid gap-2">
          <EditableInput
            ariaLabel="Business name"
            autoFocus
            className="h-11 text-base font-semibold"
            error={props.businessNameError}
            errorId="business-name-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.businessName}
            onBlur={() => props.onFieldBlur("businessName")}
            onChange={props.onBusinessNameChange}
            placeholder="Your business name"
            value={props.businessName}
          />
          <EditableInput
            ariaLabel="Business email or phone"
            error={props.businessContactError}
            errorId="business-contact-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.businessContact}
            onBlur={() => props.onFieldBlur("businessContact")}
            onChange={props.onBusinessContactChange}
            placeholder="Business email or phone"
            value={props.businessContact}
          />
          <EditableTextarea
            ariaLabel="Business address"
            error={props.businessAddressError}
            errorId="business-address-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.businessAddress}
            onBlur={() => props.onFieldBlur("businessAddress")}
            onChange={props.onBusinessAddressChange}
            placeholder="Business address"
            rows={2}
            value={props.businessAddress}
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-4 text-left sm:justify-items-end sm:text-right">
        <EditableInvoiceLogo
          businessLogoDataUrl={props.businessLogoDataUrl}
          businessName={props.businessName}
          onBusinessLogoChange={props.onBusinessLogoChange}
        />
        <p className="text-3xl font-semibold uppercase tracking-wide text-slate-800">Invoice</p>
        <div className="grid w-full max-w-xs gap-2 text-sm text-slate-600">
          <label className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-2">
            <span className="pt-2 font-medium text-slate-600">Invoice #</span>
            <span>
              <EditableInput
                ariaLabel="Invoice number"
                error={props.invoiceNumberError}
                errorId="invoice-number-error"
                maxLength={INVOICE_TEXT_MAX_LENGTHS.invoiceNumber}
                onBlur={() => props.onFieldBlur("invoiceNumber")}
                onChange={props.onInvoiceNumberChange}
                placeholder="Invoice number"
                value={props.invoiceNumber}
              />
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}

function EditableInvoiceCustomerAndDates(props: EditableInvoiceCanvasProps) {
  return (
    <section className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.78fr)]">
      <div className="min-w-0">
        <p className="mb-3 text-sm font-semibold text-slate-950">Bill to</p>
        <div className="grid gap-2">
          <EditableInput
            ariaLabel="Customer name"
            className="h-10 text-sm"
            error={props.customerNameError}
            errorId="customer-name-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.customerName}
            onBlur={() => props.onFieldBlur("customerName")}
            onChange={props.onCustomerNameChange}
            placeholder="Customer name"
            value={props.customerName}
          />
          <EditableInput
            ariaLabel="Customer email or phone"
            error={props.customerContactError}
            errorId="customer-contact-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.customerContact}
            onBlur={() => props.onFieldBlur("customerContact")}
            onChange={props.onCustomerContactChange}
            placeholder="Customer email or phone"
            value={props.customerContact}
          />
          <EditableTextarea
            ariaLabel="Customer address"
            error={props.customerAddressError}
            errorId="customer-address-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.customerAddress}
            onBlur={() => props.onFieldBlur("customerAddress")}
            onChange={props.onCustomerAddressChange}
            placeholder="Customer address"
            rows={2}
            value={props.customerAddress}
          />
        </div>
      </div>
      <div className="grid content-start gap-2 text-sm text-slate-600 sm:text-right">
        <p className="mb-1 text-left text-sm font-semibold text-slate-950 sm:text-right">
          Invoice details
        </p>
        <label className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
          <span className="pt-2 font-medium text-slate-600">Date</span>
          <span>
            <EditableInput
              ariaLabel="Invoice date"
              error={props.invoiceDateError}
              errorId="invoice-date-error"
              onBlur={() => props.onFieldBlur("invoiceDate")}
              onChange={props.onInvoiceDateChange}
              placeholder="Invoice date"
              type="date"
              value={props.invoiceDate}
            />
          </span>
        </label>
        <label className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
          <span className="pt-2 font-medium text-slate-600">Due</span>
          <span>
            <EditableInput
              ariaLabel="Due date"
              error={props.dueDateError}
              errorId="due-date-error"
              onBlur={() => props.onFieldBlur("dueDate")}
              onChange={props.onDueDateChange}
              placeholder="Due date"
              type="date"
              value={props.dueDate}
            />
          </span>
        </label>
      </div>
    </section>
  );
}

const EditableInvoiceLineItemRow = memo(function EditableInvoiceLineItemRow({
  canRemove,
  descriptionError,
  formatCurrency,
  index,
  item,
  lineTotal,
  onLineItemBlur,
  onRemoveLineItem,
  onUpdateLineItem,
  quantityError,
  unitPriceError
}: {
  canRemove: boolean;
  descriptionError: string;
  formatCurrency: EditableInvoiceCanvasProps["formatCurrency"];
  index: number;
  item: InvoiceLineItem;
  lineTotal: number;
  onLineItemBlur: EditableInvoiceCanvasProps["onLineItemBlur"];
  onRemoveLineItem: EditableInvoiceCanvasProps["onRemoveLineItem"];
  onUpdateLineItem: EditableInvoiceCanvasProps["onUpdateLineItem"];
  quantityError: string;
  unitPriceError: string;
}) {
  return (
    <div className="group grid min-w-0 gap-3 bg-white px-3 py-3 text-sm sm:grid-cols-[3rem_minmax(0,1.6fr)_7rem_5rem_7rem_2rem] sm:items-start sm:gap-3 sm:px-4">
      <div className="pt-2 tabular-nums text-slate-600">
        <span className="mr-2 text-xs font-semibold uppercase tracking-wide sm:hidden">
          No
        </span>
        {index + 1}
      </div>
      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600 sm:hidden">
          Description
        </span>
        <EditableInput
          ariaLabel={`Line item ${index + 1} description`}
          className="rounded-lg"
          error={formatLineItemErrorForDisplay(descriptionError, "description")}
          errorId={`line-item-${index}-description-error`}
          maxLength={INVOICE_TEXT_MAX_LENGTHS.lineItemDescription}
          onBlur={() => onLineItemBlur(index, "description")}
          onChange={(value) => onUpdateLineItem(item.id, "description", value)}
          placeholder={`Item ${index + 1} description`}
          value={item.description}
        />
      </div>
      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600 sm:hidden">
          Unit Price
        </span>
        <EditableInput
          ariaLabel={`Line item ${index + 1} unit price`}
          className="rounded-lg tabular-nums sm:text-right"
          error={formatLineItemErrorForDisplay(unitPriceError, "unitPrice")}
          errorId={`line-item-${index}-unit-price-error`}
          inputMode="decimal"
          onBlur={() => onLineItemBlur(index, "unitPrice")}
          onChange={(value) => onUpdateLineItem(item.id, "unitPrice", value)}
          placeholder="0.00"
          value={item.unitPrice}
        />
      </div>
      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600 sm:hidden">
          Qty
        </span>
        <EditableInput
          ariaLabel={`Line item ${index + 1} quantity`}
          className="rounded-lg tabular-nums sm:text-right"
          error={formatLineItemErrorForDisplay(quantityError, "quantity")}
          errorId={`line-item-${index}-quantity-error`}
          inputMode="decimal"
          onBlur={() => onLineItemBlur(index, "quantity")}
          onChange={(value) => onUpdateLineItem(item.id, "quantity", value)}
          placeholder="1"
          value={item.quantity}
        />
      </div>
      <div className="min-w-0 pt-2 font-semibold tabular-nums text-slate-950 sm:text-right">
        <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:hidden">
          Amount
        </span>
        {formatCurrency(lineTotal)}
      </div>
      <button
        aria-label={`Remove line item ${index + 1}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-30 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
        disabled={!canRemove}
        onClick={() => onRemoveLineItem(item.id)}
        type="button"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
});

export function EditableInvoiceLineItems({
  formatCurrency,
  getLineItemError,
  lineItemPreviewTotals,
  lineItems,
  lineItemsMessage,
  onAddLineItem,
  onLineItemBlur,
  onRemoveLineItem,
  onUpdateLineItem
}: Pick<
  EditableInvoiceCanvasProps,
  | "formatCurrency"
  | "getLineItemError"
  | "lineItemPreviewTotals"
  | "lineItems"
  | "lineItemsMessage"
  | "onAddLineItem"
  | "onLineItemBlur"
  | "onRemoveLineItem"
  | "onUpdateLineItem"
>) {
  return (
    <section className="mt-7">
      <h3 className="mb-3 text-sm font-semibold text-slate-950">Invoice items</h3>
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
          {lineItems.map((item, index) => (
            <EditableInvoiceLineItemRow
              canRemove={lineItems.length > 1}
              descriptionError={getLineItemError(index, "description")}
              formatCurrency={formatCurrency}
              index={index}
              item={item}
              key={item.id}
              lineTotal={lineItemPreviewTotals[index] ?? 0}
              onLineItemBlur={onLineItemBlur}
              onRemoveLineItem={onRemoveLineItem}
              onUpdateLineItem={onUpdateLineItem}
              quantityError={getLineItemError(index, "quantity")}
              unitPriceError={getLineItemError(index, "unitPrice")}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          onClick={onAddLineItem}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add item
        </button>
        {lineItemsMessage ? (
          <p className="text-sm font-medium text-red-700">{lineItemsMessage}</p>
        ) : null}
      </div>
    </section>
  );
}

function EditableTaxRow({
  currencySymbol,
  getTaxError,
  index,
  onFieldBlur,
  onRemoveTax,
  onTaxLabelChange,
  onTaxTypeChange,
  onTaxValueChange,
  tax
}: Pick<
  EditableInvoiceCanvasProps,
  | "getTaxError"
  | "onFieldBlur"
  | "onRemoveTax"
  | "onTaxLabelChange"
  | "onTaxTypeChange"
  | "onTaxValueChange"
> & {
  currencySymbol: string;
  index: number;
  tax: InvoiceTax;
}) {
  const labelError = getTaxError(index, "label");
  const valueError = getTaxError(index, "value");
  const errorIdBase = `invoice-tax-${tax.id}`;
  const taxValueIsPercentage = tax.type === "percentage";

  function toggleTaxType() {
    onTaxTypeChange(tax.id, taxValueIsPercentage ? "fixed" : "percentage");
  }

  return (
    <div className="grid gap-2 py-1.5 text-slate-700 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,18rem)_2.5rem] sm:items-start">
      <div className="min-w-0">
        <EditableInput
          ariaLabel={`Tax ${index + 1} name`}
          className="h-10"
          error={labelError}
          errorId={`${errorIdBase}-label-error`}
          maxLength={INVOICE_TEXT_MAX_LENGTHS.taxLabel}
          onBlur={() => onFieldBlur(`tax.${index}.label`)}
          onChange={(value) => onTaxLabelChange(tax.id, value)}
          placeholder="Tax name"
          value={tax.label}
        />
      </div>
      {taxValueIsPercentage ? (
        <div className="min-w-0">
          <div className="flex h-10 min-w-0 items-stretch">
            <div className="relative min-w-0 flex-1">
              <EditableInput
                ariaLabel={`Tax ${index + 1} percentage`}
                className="h-full rounded-r-none px-4 pr-8 tabular-nums"
                error=""
                errorId={`${errorIdBase}-value-error`}
                inputMode="decimal"
                max="100"
                min="0"
                onBlur={() => onFieldBlur(`tax.${index}.value`)}
                onChange={(value) => onTaxValueChange(tax.id, value)}
                placeholder="0"
                type="number"
                value={tax.value}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                %
              </span>
            </div>
            <button
              aria-label={`Switch tax ${index + 1} to fixed amount`}
              className="inline-flex h-full w-12 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={toggleTaxType}
              type="button"
            >
              <Repeat2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <FieldError error={valueError} id={`${errorIdBase}-value-error`} />
        </div>
      ) : (
        <div className="min-w-0">
          <div className="flex h-10 min-w-0 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
            <span className="inline-flex shrink-0 items-center px-3 text-sm font-semibold text-slate-600">
              {currencySymbol}
            </span>
            <div className="min-w-0 flex-1">
              <EditableInput
                ariaLabel={`Tax ${index + 1} amount`}
                className="h-full rounded-none border-0 bg-transparent px-0 tabular-nums hover:border-0 focus:border-0 focus:bg-transparent focus:ring-0"
                error=""
                errorId={`${errorIdBase}-value-error`}
                inputMode="decimal"
                min="0"
                onBlur={() => onFieldBlur(`tax.${index}.value`)}
                onChange={(value) => onTaxValueChange(tax.id, value)}
                placeholder="0"
                type="number"
                value={tax.value}
              />
            </div>
            <button
              aria-label={`Switch tax ${index + 1} to percentage`}
              className="inline-flex h-full w-12 shrink-0 items-center justify-center border-l border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
              onClick={toggleTaxType}
              type="button"
            >
              <Repeat2 aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <FieldError error={valueError} id={`${errorIdBase}-value-error`} />
        </div>
      )}
      <button
        aria-label={`Remove tax ${index + 1}`}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
        onClick={() => onRemoveTax(tax.id)}
        type="button"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

export function EditableInvoiceTotals(props: EditableInvoiceCanvasProps) {
  const discountValueIsPercentage = props.discount.type === "percentage";

  return (
    <section className="mt-5 flex justify-end">
      <div className="w-full max-w-xl text-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-950">Totals</h3>
        <div className="flex justify-between gap-4 border-t border-slate-200 py-2 text-slate-700">
          <span>Subtotal</span>
          <span className="font-semibold tabular-nums text-slate-950">
            {props.formatCurrency(props.calculation.subtotal)}
          </span>
        </div>

        <div className="space-y-0.5">
          {props.tax.map((taxRow, index) => (
            <EditableTaxRow
              currencySymbol={props.currencySymbol}
              getTaxError={props.getTaxError}
              index={index}
              key={taxRow.id}
              onFieldBlur={props.onFieldBlur}
              onRemoveTax={props.onRemoveTax}
              onTaxLabelChange={props.onTaxLabelChange}
              onTaxTypeChange={props.onTaxTypeChange}
              onTaxValueChange={props.onTaxValueChange}
              tax={taxRow}
            />
          ))}
        </div>
        <button
          className="flex h-9 w-fit items-center gap-1.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
          onClick={props.onAddTax}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add tax
        </button>

        {!props.discount.enabled ? (
          <button
            className="flex h-9 w-fit items-center gap-1.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
            onClick={() => props.onDiscountEnabledChange(true)}
            type="button"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add discount
          </button>
        ) : (
          <div className="grid gap-2 py-1.5 text-slate-700 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,18rem)_2.5rem] sm:items-start">
            <div>
              <EditableInput
                ariaLabel="Discount label"
                className="h-10 px-4"
                error={props.discountLabelError}
                errorId="invoice-discount-label-error"
                onBlur={() => props.onFieldBlur("discount.label")}
                onChange={props.onDiscountLabelChange}
                placeholder="Discount"
                value={props.discount.label}
              />
            </div>
            {discountValueIsPercentage ? (
              <div className="min-w-0">
                <div className="flex h-10 min-w-0 items-stretch">
                  <div className="relative min-w-0 flex-1">
                    <EditableInput
                      ariaLabel="Discount percentage"
                      className="h-full rounded-r-none px-4 pr-8 tabular-nums"
                      error=""
                      errorId="invoice-discount-error"
                      inputMode="decimal"
                      max="100"
                      min="0"
                      onBlur={() => props.onFieldBlur("discount.value")}
                      onChange={props.onDiscountValueChange}
                      placeholder="0"
                      type="number"
                      value={props.discount.value}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                      %
                      <span className="sr-only">, calculated discount {props.formatCurrency(props.calculation.discountAmount)}</span>
                    </span>
                  </div>
                  <button
                    aria-label="Switch discount to fixed amount"
                    className="inline-flex h-full w-12 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
                    onClick={props.onDiscountTypeToggle}
                    type="button"
                  >
                    <Repeat2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                <FieldError error={props.discountError} id="invoice-discount-error" />
              </div>
            ) : (
              <div className="min-w-0">
                <div className="flex h-10 min-w-0 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
                  <span className="inline-flex shrink-0 items-center px-3 text-sm font-semibold text-slate-600">
                    {props.currencySymbol}
                  </span>
                  <div className="min-w-0 flex-1">
                    <EditableInput
                      ariaLabel="Discount amount"
                      className="h-full rounded-none border-0 bg-transparent px-0 tabular-nums hover:border-0 focus:border-0 focus:bg-transparent focus:ring-0"
                      error=""
                      errorId="invoice-discount-error"
                      inputMode="decimal"
                      min="0"
                      onBlur={() => props.onFieldBlur("discount.value")}
                      onChange={props.onDiscountValueChange}
                      placeholder="0"
                      type="number"
                      value={props.discount.value}
                    />
                  </div>
                  <button
                    aria-label="Switch discount to percentage"
                    className="inline-flex h-full w-12 shrink-0 items-center justify-center border-l border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
                    onClick={props.onDiscountTypeToggle}
                    type="button"
                  >
                    <Repeat2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                <FieldError error={props.discountError} id="invoice-discount-error" />
              </div>
            )}
            <button
              aria-label="Remove discount"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
              onClick={() => props.onDiscountEnabledChange(false)}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}

        {!props.shipping.enabled ? (
          <button
            className="flex h-9 w-fit items-center gap-1.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
            onClick={() => props.onShippingEnabledChange(true)}
            type="button"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add shipping
          </button>
        ) : (
          <div className="grid gap-2 py-1.5 text-slate-700 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,18rem)_2.5rem] sm:items-start">
            <div>
              <EditableInput
                ariaLabel="Shipping label"
                className="h-10 px-4"
                error={props.shippingLabelError}
                errorId="invoice-shipping-label-error"
                onBlur={() => props.onFieldBlur("shipping.label")}
                onChange={props.onShippingLabelChange}
                placeholder="Shipping"
                value={props.shipping.label}
              />
            </div>
            <div className="min-w-0">
              <div className="flex h-10 min-w-0 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-slate-500 focus-within:ring-4 focus-within:ring-slate-100">
                <span className="inline-flex shrink-0 items-center px-3 text-sm font-semibold text-slate-600">
                  {props.currencySymbol}
                </span>
                <div className="min-w-0 flex-1">
                  <EditableInput
                    ariaLabel="Shipping amount"
                    className="h-full rounded-none border-0 bg-transparent px-0 tabular-nums hover:border-0 focus:border-0 focus:bg-transparent focus:ring-0"
                    error=""
                    errorId="invoice-shipping-error"
                    inputMode="decimal"
                    min="0"
                    onBlur={() => props.onFieldBlur("shipping.amount")}
                    onChange={props.onShippingAmountChange}
                    placeholder="0"
                    value={props.shipping.amount}
                  />
                </div>
              </div>
              <FieldError error={props.shippingError} id="invoice-shipping-error" />
            </div>
            <button
              aria-label="Remove shipping"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
              onClick={() => props.onShippingEnabledChange(false)}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-3 flex justify-between gap-4 border-t border-slate-300 pt-3 text-lg font-semibold text-slate-950">
          <span>Total</span>
          <span className="tabular-nums">{props.formatCurrency(props.calculation.total)}</span>
        </div>
      </div>
    </section>
  );
}

export function EditableInvoicePaymentDetails({
  onPaymentChange,
  onPaymentFieldBlur,
  payment,
  paymentErrors
}: Pick<
  EditableInvoiceCanvasProps,
  "onPaymentChange" | "onPaymentFieldBlur" | "payment" | "paymentErrors"
>) {
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
      onPaymentChange("paymentQrDataUrl", result.dataUrl);
      setQrMessage("");
      return;
    }

    onPaymentChange("paymentQrDataUrl", undefined);
    setQrMessage(result.error);
  }

  function openQrPicker() {
    qrInputRef.current?.click();
  }

  function removePaymentQr() {
    onPaymentChange("paymentQrDataUrl", undefined);
    setQrMessage("");

    if (qrInputRef.current) {
      qrInputRef.current.value = "";
    }
  }

  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.86fr)]">
        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-semibold text-slate-950">Payment details</h3>
          <div className="grid gap-2">
            <EditableInput
              ariaLabel="Bank name"
              error={paymentErrors.bankName ?? ""}
              errorId="payment-bank-name-error"
              maxLength={INVOICE_TEXT_MAX_LENGTHS.bankName}
              onBlur={() => onPaymentFieldBlur("bankName")}
              onChange={(value) => onPaymentChange("bankName", value)}
              placeholder="Bank name"
              value={payment.bankName}
            />
            <EditableInput
              ariaLabel="Account holder name"
              error={paymentErrors.accountName ?? ""}
              errorId="payment-account-name-error"
              maxLength={INVOICE_TEXT_MAX_LENGTHS.accountName}
              onBlur={() => onPaymentFieldBlur("accountName")}
              onChange={(value) => onPaymentChange("accountName", value)}
              placeholder="Account holder name"
              value={payment.accountName}
            />
            <EditableInput
              ariaLabel="Account number"
              error={paymentErrors.accountNumber ?? ""}
              errorId="payment-account-number-error"
              maxLength={INVOICE_TEXT_MAX_LENGTHS.accountNumber}
              onBlur={() => onPaymentFieldBlur("accountNumber")}
              onChange={(value) => onPaymentChange("accountNumber", value)}
              placeholder="Account number"
              value={payment.accountNumber}
            />
            <EditableInput
              ariaLabel="DuitNow ID"
              error={paymentErrors.duitNowId ?? ""}
              errorId="payment-duitnow-id-error"
              maxLength={INVOICE_TEXT_MAX_LENGTHS.duitNowId}
              onBlur={() => onPaymentFieldBlur("duitNowId")}
              onChange={(value) => onPaymentChange("duitNowId", value)}
              placeholder="DuitNow ID"
              value={payment.duitNowId}
            />
            <EditableInput
              ariaLabel="Payment link"
              error={paymentErrors.paymentLink ?? ""}
              errorId="payment-link-error"
              maxLength={INVOICE_TEXT_MAX_LENGTHS.paymentLink}
              onBlur={() => onPaymentFieldBlur("paymentLink")}
              onChange={(value) => onPaymentChange("paymentLink", value)}
              placeholder="Payment link"
              type="url"
              value={payment.paymentLink}
            />
            <EditableTextarea
              ariaLabel="Payment notes"
              error={paymentErrors.notes ?? ""}
              errorId="payment-notes-error"
              maxLength={INVOICE_TEXT_MAX_LENGTHS.paymentNotes}
              onBlur={() => onPaymentFieldBlur("notes")}
              onChange={(value) => onPaymentChange("notes", value)}
              placeholder="Payment notes"
              rows={2}
              value={payment.notes}
            />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-semibold text-slate-950">Payment QR image</h3>
          <button
            aria-label={payment.paymentQrDataUrl ? "Replace payment QR image" : "Upload payment QR image"}
            className="flex min-h-32 w-40 items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-center text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-100"
            disabled={isProcessingQr}
            onClick={openQrPicker}
            type="button"
          >
            {payment.paymentQrDataUrl ? (
              <Image
                alt="Payment QR"
                className="h-28 w-28 object-contain"
                height={112}
                unoptimized
                src={payment.paymentQrDataUrl}
                width={112}
              />
            ) : (
              <span className="inline-flex flex-col items-center gap-2">
                <Upload aria-hidden="true" className="h-4 w-4" />
                Upload QR
              </span>
            )}
          </button>
          <input
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            className="sr-only"
            disabled={isProcessingQr}
            onChange={(event) => handlePaymentQrChange(event.target.files?.[0])}
            ref={qrInputRef}
            type="file"
          />
          {payment.paymentQrDataUrl ? (
            <div className="mt-2 flex gap-2">
              <button
                className="text-xs font-semibold text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline focus:outline-none focus:ring-4 focus:ring-slate-100"
                onClick={openQrPicker}
                type="button"
              >
                Replace
              </button>
              <button
                className="text-xs font-semibold text-red-600 underline-offset-4 hover:text-red-800 hover:underline focus:outline-none focus:ring-4 focus:ring-red-100"
                onClick={removePaymentQr}
                type="button"
              >
                Remove
              </button>
            </div>
          ) : null}
          <p
            aria-live="polite"
            className={`mt-2 min-h-4 text-xs ${
              qrMessage === "Processing payment QR..." ? "text-stone-500" : "font-medium text-red-700"
            }`}
          >
            {qrMessage}
          </p>
        </div>
      </div>
    </section>
  );
}

function EditableInvoiceNotesAndTerms(props: EditableInvoiceCanvasProps) {
  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-semibold text-slate-950">Notes</h3>
          <EditableTextarea
            ariaLabel="Invoice notes"
            error={props.notesError}
            errorId="invoice-notes-error"
            maxLength={INVOICE_TEXT_MAX_LENGTHS.notes}
            onBlur={() => props.onFieldBlur("notes")}
            onChange={props.onNotesChange}
            placeholder="Add any notes for this invoice"
            rows={4}
            value={props.notes}
          />
        </div>
        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-semibold text-slate-950">Terms &amp; conditions</h3>
        <EditableTextarea
          ariaLabel="Payment terms"
          error={props.termsError}
          errorId="invoice-terms-error"
          maxLength={INVOICE_TEXT_MAX_LENGTHS.terms}
          onBlur={() => props.onFieldBlur("terms")}
          onChange={props.onTermsChange}
          placeholder="Add terms & conditions"
          rows={4}
          value={props.terms}
        />
        </div>
      </div>
    </section>
  );
}

export function EditableInvoiceCanvas(props: EditableInvoiceCanvasProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <EditableInvoiceActions
        isGeneratingPdf={props.isGeneratingPdf}
        onClearEverything={props.onClearEverything}
        onDownloadInvoice={props.onDownloadInvoice}
        validationSummaryMessage={props.validationSummaryMessage}
      />

      {props.validationSummaryMessage ? (
        <p
          className="mx-4 mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          id="invoice-validation-summary"
          role="alert"
        >
          {props.validationSummaryMessage}
        </p>
      ) : null}
      {props.pdfStatus ? (
        <p
          className={`mx-4 mt-4 rounded-lg border px-3 py-2 text-sm font-medium leading-6 ${
            props.pdfStatus.type === "error"
              ? "border-red-100 bg-red-50 text-red-700"
              : "border-amber-100 bg-amber-50 text-amber-800"
          }`}
          role="status"
        >
          {props.pdfStatus.message}
        </p>
      ) : null}
      {props.autosaveError ? (
        <p className="mx-4 mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {props.autosaveError}
        </p>
      ) : null}

      <div
        className="invoice-print-area min-w-0 bg-white p-5 sm:p-7 lg:p-8"
        id="invoice-print-area"
      >
        <EditableInvoiceHeader {...props} />
        <EditableInvoiceCustomerAndDates {...props} />
        <EditableInvoiceLineItems
          formatCurrency={props.formatCurrency}
          getLineItemError={props.getLineItemError}
          lineItemPreviewTotals={props.lineItemPreviewTotals}
          lineItems={props.lineItems}
          lineItemsMessage={props.lineItemsMessage}
          onAddLineItem={props.onAddLineItem}
          onLineItemBlur={props.onLineItemBlur}
          onRemoveLineItem={props.onRemoveLineItem}
          onUpdateLineItem={props.onUpdateLineItem}
        />
        <EditableInvoiceTotals {...props} />
        <EditableInvoicePaymentDetails
          onPaymentChange={props.onPaymentChange}
          onPaymentFieldBlur={props.onPaymentFieldBlur}
          payment={props.payment}
          paymentErrors={props.paymentErrors}
        />
        <EditableInvoiceNotesAndTerms {...props} />
      </div>

      <EditableInvoiceActions
        isGeneratingPdf={props.isGeneratingPdf}
        onClearEverything={props.onClearEverything}
        onDownloadInvoice={props.onDownloadInvoice}
        placement="bottom"
        validationSummaryMessage={props.validationSummaryMessage}
      />
    </div>
  );
}
