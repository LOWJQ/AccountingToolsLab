"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { EditableInput, EditableTextarea, EditableInvoiceActions, EditableInvoiceLogo, EditableInvoiceLineItems, EditableInvoiceTotals } from "@/components/invoice/EditableInvoiceCanvas";
import { InvoiceDownloadComplete } from "@/components/invoice/InvoiceDownloadComplete";
import { InvoiceModals } from "@/components/invoice/InvoiceModals";
import { SavedInvoicesModal } from "@/components/invoice/SavedInvoicesModal";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { useReceiptLibrary } from "@/hooks/useReceiptLibrary";
import { useInvoicePdf } from "@/hooks/useInvoicePdf";
import { useInvoiceValidation } from "@/hooks/useInvoiceValidation";
import { getCurrencyOption, isCurrencyCode } from "@/lib/currency";
import { calculateInvoiceWithLineItems } from "@/lib/invoice/invoice-calculations";
import { getInvoiceExportErrors } from "@/lib/invoice/invoice-validation";
import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";
import { DEFAULT_INVOICE_TAX } from "@/lib/invoice/invoice-types";
import { createDefaultInvoiceLineItem } from "@/lib/invoice/invoice-defaults";
import { createReceiptPdfLabels, toInvoiceDocument } from "@/lib/receipt/receipt-document";
import { receiptFromLibrary } from "@/lib/receipt/receipt-library";
import { RECEIPT_PAYMENT_METHODS } from "@/lib/receipt/receipt-types";

const receiptWording = (message: string) => message.replace(/Invoice/g, "Receipt").replace(/invoice/g, "receipt");
type TextKey = "businessName" | "businessContact" | "businessAddress" | "receivedFrom" | "receivedFromContact" | "receivedFromAddress" | "receiptNumber" | "receiptDate" | "invoiceReference" | "paymentMethodOther" | "notes";

export function ReceiptGenerator({ onCompletionChange }: { onCompletionChange?: (complete: boolean) => void } = {}) {
  const { currency, formatCurrency, setCurrency } = useCurrency();
  const draft = useReceiptLibrary(currency, value => { if (isCurrencyCode(value)) setCurrency(value); });
  const { receipt, library, updateReceipt } = draft;
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  useEffect(() => { setActionError(""); }, [receipt]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(() => new Set());
  const editorRef = useRef<HTMLDivElement>(null);
  const document = useMemo(() => toInvoiceDocument(receipt), [receipt]);
  const validation = useInvoiceValidation(document, receipt.items, { touchedFields });
  const pdfParams = useMemo(() => ({ calculation: validation.calculation, formatCurrency, invoiceData: document, labels: createReceiptPdfLabels(receipt) }), [document, formatCurrency, receipt, validation.calculation]);
  const pdf = useInvoicePdf({ invoiceNumber: receipt.receiptNumber, pdfParams, saveUsedInvoiceNumber: draft.markNumberUsed });
  const complete = pdf.pdfStage === "downloaded" && !!pdf.completedPdf;
  useEffect(() => { onCompletionChange?.(complete); }, [complete, onCompletionChange]);
  const entries = useMemo(() => historyOpen ? library.receipts.map(entry => ({
    id: entry.id, invoiceNumber: entry.fields.receiptNumber, customerName: entry.fields.receivedFrom,
    currency: entry.fields.currency, updatedAt: entry.updatedAt,
    total: calculateInvoiceWithLineItems(toInvoiceDocument(receiptFromLibrary(library, entry.id)!)).calculation.total
  })) : [], [historyOpen, library]);

  function touch(field: string) { setTouchedFields(current => new Set(current).add(field)); }
  function error(field: string) { return receiptWording(validation.getValidationMessage(field)); }
  function beginNew(duplicateId?: string) {
    if (!draft.startReceipt(duplicateId)) return;
    pdf.returnToEditor(); setHistoryOpen(false); setTouchedFields(new Set()); setActionError("");
    window.scrollTo({ top: 0 });
  }
  function generate(action: "preview" | "download") {
    const errors = getInvoiceExportErrors(document, validation.calculation.subtotal);
    if (errors.length) {
      setTouchedFields(new Set(errors.map(item => item.field)));
      setActionError(receiptWording(errors[0].message));
      window.requestAnimationFrame(() => editorRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setActionError("");
    if (action === "preview") void pdf.prepareInvoicePdf(); else void pdf.downloadInvoicePdf();
  }
  function field(key: TextKey, label: string, placeholder: string, maxLength: number, validationField: string = key, multiline = false, type: "text" | "date" = "text") {
    const props = { ariaLabel: label, label, placeholder, maxLength, error: error(validationField), errorId: `receipt-${key}-error`, value: receipt[key], onBlur: () => touch(validationField), onChange: (value: string) => updateReceipt({ [key]: value }) };
    return multiline ? <EditableTextarea {...props} /> : <EditableInput {...props} type={type} />;
  }

  if (!draft.ready) return <p className="text-sm text-slate-600" role="status">Loading the receipt form…</p>;
  return <>
    {complete && pdf.completedPdf ? <InvoiceDownloadComplete documentKind="receipt"
      invoiceNumber={pdf.completedPdf.invoiceNumber} customerName={pdf.completedPdf.customerName} total={pdf.completedPdf.total}
      autosaveError={draft.saveError} pdfStatus={pdf.pdfStatus} onDownload={pdf.downloadCompletedPdf} onEdit={pdf.returnToEditor}
      onNewInvoice={() => beginNew()} onHistory={() => setHistoryOpen(true)} /> :
    <div className="relative min-w-0 border-y border-slate-200 bg-white sm:rounded-lg sm:border [&_button]:min-h-11 [&_input]:text-base [&_textarea]:text-base sm:[&_input]:text-sm sm:[&_textarea]:text-sm" ref={editorRef}>
      <EditableInvoiceActions documentKind="receipt" calculation={validation.calculation} formatCurrency={formatCurrency} savedInvoiceCount={library.receipts.length}
        isGeneratingPdf={pdf.isGeneratingPdf} onClearEverything={() => setResetOpen(true)} onDownloadInvoice={() => generate("download")}
        onPreviewInvoice={() => generate("preview")} onOpenSavedInvoices={() => setHistoryOpen(true)} />
      {actionError || pdf.pdfStatus || draft.saveError ? <p className="mx-5 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900" role="status">{actionError || pdf.pdfStatus?.message || draft.saveError}</p> : null}
      <div className="min-w-0 py-5 sm:p-7 lg:p-8">
        <header className="grid gap-6 border-b border-slate-200 pb-6 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.78fr)]">
          <div className="min-w-0"><h2 className="mb-3 text-sm font-semibold text-slate-950">Business information</h2><div className="grid gap-3">
            {field("businessName", "Business name", "Your business name", 120)}
            {field("businessContact", "Business email or phone", "Business email or phone", 160)}
            {field("businessAddress", "Business address", "Business address", 500, "businessAddress", true)}
          </div></div>
          <div className="grid min-w-0 content-start gap-4 sm:justify-items-end">
            <EditableInvoiceLogo businessLogoDataUrl={receipt.businessLogoDataUrl} businessName={receipt.businessName} onBusinessLogoChange={businessLogoDataUrl => updateReceipt({ businessLogoDataUrl })} />
            <p className="text-3xl font-semibold uppercase tracking-wide text-slate-800">Receipt</p>
            <div className="w-full max-w-xs">{field("receiptNumber", "Receipt number", "REC-001", 60, "invoiceNumber")}</div>
          </div>
        </header>
        <section className="mt-6 grid min-w-0 gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.78fr)]">
          <div className="min-w-0"><h3 className="mb-3 text-sm font-semibold text-slate-950">Received from</h3><div className="grid gap-3">
            {field("receivedFrom", "Customer name", "Customer name", 120, "customerName")}
            {field("receivedFromContact", "Customer email or phone", "Customer email or phone", 160, "customerContact")}
            {field("receivedFromAddress", "Customer address", "Customer address", 500, "customerAddress", true)}
          </div></div>
          <div className="min-w-0"><h3 className="mb-3 text-sm font-semibold text-slate-950 sm:text-right">Payment received</h3><div className="grid gap-3">
            {field("receiptDate", "Date paid", "", 40, "invoiceDate", false, "date")}
            <div><label className="mb-1.5 block text-xs font-medium text-slate-600" htmlFor="receipt-payment-method">Paid by</label><SelectMenu ariaLabel="Paid by" id="receipt-payment-method" value={receipt.paymentMethod} onChange={paymentMethod => updateReceipt({ paymentMethod })} options={RECEIPT_PAYMENT_METHODS.map(method => ({ label: method.label, value: method.id }))} /></div>
            {receipt.paymentMethod === "other" ? field("paymentMethodOther", "Payment method", "Describe how it was paid", 160) : null}
            {field("invoiceReference", "Invoice reference (optional)", "INV-001", 60)}
          </div></div>
        </section>
        <EditableInvoiceLineItems title="Receipt items" formatCurrency={formatCurrency} lineItemPreviewTotals={validation.lineItemPreviewTotals} lineItems={receipt.items}
          lineItemsMessage={validation.lineItemsMessage} getLineItemError={validation.getLineItemError}
          onAddLineItem={() => updateReceipt({ items: [...receipt.items, createDefaultInvoiceLineItem(`receipt-item-${Date.now()}`)] })}
          onLineItemBlur={(index, key) => touch(`items.${index}.${key}`)}
          onRemoveLineItem={id => { if (receipt.items.length > 1) updateReceipt({ items: receipt.items.filter(item => item.id !== id) }); }}
          onUpdateLineItem={(id, key, value) => updateReceipt({ items: receipt.items.map(item => item.id === id ? { ...item, [key]: value } : item) })} />
        <EditableInvoiceTotals totalLabel="Total paid" calculation={validation.calculation} formatCurrency={formatCurrency} currencySymbol={getCurrencyOption(currency)?.symbol ?? currency}
          discount={receipt.discount} discountError={error("discount.value")} discountLabelError={error("discount.label")}
          shipping={receipt.shipping} shippingError={error("shipping.amount")} shippingLabelError={error("shipping.label")} tax={receipt.tax}
          getTaxError={(index, key) => error(`tax.${index}.${key}`)} onFieldBlur={touch}
          onAddTax={() => updateReceipt({ tax: [...receipt.tax.filter(row => row.enabled), { ...DEFAULT_INVOICE_TAX, id: `tax-${Date.now()}`, enabled: true }] })}
          onRemoveTax={id => updateReceipt({ tax: receipt.tax.filter(row => row.id !== id) })}
          onTaxLabelChange={(id, label) => updateReceipt({ tax: receipt.tax.map(row => row.id === id ? { ...row, label } : row) })}
          onTaxTypeChange={(id, type) => updateReceipt({ tax: receipt.tax.map(row => row.id === id ? { ...row, type } : row) })}
          onTaxValueChange={(id, value) => updateReceipt({ tax: receipt.tax.map(row => row.id === id ? { ...row, value } : row) })}
          onDiscountEnabledChange={enabled => updateReceipt({ discount: { ...receipt.discount, enabled } })}
          onDiscountLabelChange={label => updateReceipt({ discount: { ...receipt.discount, label } })}
          onDiscountTypeToggle={() => updateReceipt({ discount: { ...receipt.discount, type: receipt.discount.type === "fixed" ? "percentage" : "fixed" } })}
          onDiscountValueChange={value => updateReceipt({ discount: { ...receipt.discount, value } })}
          onShippingEnabledChange={enabled => updateReceipt({ shipping: { ...receipt.shipping, enabled } })}
          onShippingLabelChange={label => updateReceipt({ shipping: { ...receipt.shipping, label } })}
          onShippingAmountChange={amount => updateReceipt({ shipping: { ...receipt.shipping, amount } })} />
        <section className="mt-8 border-t border-slate-200 pt-6"><h3 className="mb-3 text-sm font-semibold text-slate-950">Notes</h3>
          {field("notes", "Receipt notes", "Thank you for your payment.", INVOICE_TEXT_MAX_LENGTHS.notes, "notes", true)}
        </section>
      </div>
    </div>}
    <SavedInvoicesModal documentKind="receipt" currentInvoiceId={library.activeId} invoices={entries} isOpen={historyOpen} onClose={() => setHistoryOpen(false)}
      onOpenInvoice={id => { draft.openReceipt(id); pdf.returnToEditor(); setHistoryOpen(false); setTouchedFields(new Set()); setActionError(""); }}
      onDuplicate={id => beginNew(id)} onDelete={id => { draft.deleteReceipt(id); if (id === library.activeId) pdf.returnToEditor(); }}
      onExportBackup={draft.exportBackup} onImportBackup={async file => {
        const result = await draft.importBackup(file);
        if (result.ok) { pdf.returnToEditor(); setTouchedFields(new Set()); setActionError(""); }
        return result;
      }} />
    <InvoiceModals documentKind="receipt" isClearEverythingModalOpen={resetOpen} onCancelClearEverything={() => setResetOpen(false)}
      onConfirmClearEverything={() => { draft.resetReceipt(); pdf.returnToEditor(); setResetOpen(false); setTouchedFields(new Set()); setActionError(""); }} />
  </>;
}
