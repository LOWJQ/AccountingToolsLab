"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { todayIsoDate } from "@/lib/utils/format-date";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { EditableInvoiceCanvas } from "@/components/invoice/EditableInvoiceCanvas";
import { InvoiceModals } from "@/components/invoice/InvoiceModals";
import { InvoiceDownloadComplete } from "@/components/invoice/InvoiceDownloadComplete";
import { SavedInvoicesModal } from "@/components/invoice/SavedInvoicesModal";
import { mergeInvoice, splitInvoice } from "@/lib/invoice/invoice-library";
import { getCurrencyOption, isCurrencyCode } from "@/lib/currency";
import {
  createDefaultInvoiceLineItem,
  createEmptyInvoiceDefaults,
  DEFAULT_INVOICE_NUMBER,
  prepareInvoiceForFormRestore
} from "@/lib/invoice/invoice-defaults";
import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";
import { useInvoiceNumbering } from "@/hooks/useInvoiceNumbering";
import { useInvoicePdf } from "@/hooks/useInvoicePdf";
import { useInvoiceValidation } from "@/hooks/useInvoiceValidation";
import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  DEFAULT_INVOICE_SHIPPING,
  DEFAULT_INVOICE_TAX,
  DEFAULT_INVOICE_TERMS,
  type InvoiceData,
  type InvoiceDiscount,
  type InvoiceLineItem,
  type InvoicePaymentDetails,
  type InvoiceShipping,
  type InvoiceTax
} from "@/lib/invoice/invoice-types";

function createLineItem(index: number): InvoiceLineItem {
  return createDefaultInvoiceLineItem(`item-${Date.now()}-${index}`);
}

function normalizeLegacyTaxLabel(label: string) {
  return ["SST 6%", "SST 8%", "Custom tax rate"].includes(label) ? "Tax" : label;
}

function createTaxRow(index: number): InvoiceTax {
  return {
    ...DEFAULT_INVOICE_TAX,
    id: `tax-${Date.now()}-${index}`,
    enabled: true,
    label: index === 1 ? DEFAULT_INVOICE_TAX.label : `Tax ${index}`,
    type: "percentage",
    value: DEFAULT_INVOICE_TAX.value
  };
}

function normalizeRestoredTaxRows(taxRows: InvoiceTax[]): InvoiceTax[] {
  return taxRows.map((tax, index) => ({
    ...DEFAULT_INVOICE_TAX,
    ...tax,
    id: tax.id || `tax-${Date.now()}-${index + 1}`,
    enabled: tax.enabled === true,
    label: normalizeLegacyTaxLabel(tax.label || DEFAULT_INVOICE_TAX.label),
    type: tax.type === "fixed" ? "fixed" : "percentage",
    value: tax.value || DEFAULT_INVOICE_TAX.value
  }));
}

export function InvoiceGenerator({ onCompletionChange }: { onCompletionChange?: (isComplete: boolean) => void } = {}) {
  const { currency, formatCurrency, setCurrency } = useCurrency();
  const currencySymbol = getCurrencyOption(currency)?.symbol ?? currency;
  const invoiceGeneratorTopRef = useRef<HTMLDivElement>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessContact, setBusinessContact] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessLogoDataUrl, setBusinessLogoDataUrl] = useState<string | undefined>();
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(DEFAULT_INVOICE_NUMBER);
  const [invoiceDate, setInvoiceDate] = useState(() => todayIsoDate());
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(DEFAULT_INVOICE_TERMS);
  const [payment, setPayment] = useState<InvoicePaymentDetails>(DEFAULT_INVOICE_PAYMENT_DETAILS);
  const [tax, setTax] = useState<InvoiceTax[]>([]);
  const [discount, setDiscount] = useState<InvoiceDiscount>(DEFAULT_INVOICE_DISCOUNT);
  const [shipping, setShipping] = useState<InvoiceShipping>(DEFAULT_INVOICE_SHIPPING);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([createLineItem(1)]);
  const [isClearEverythingModalOpen, setIsClearEverythingModalOpen] = useState(false);
  const [isSavedInvoicesModalOpen, setIsSavedInvoicesModalOpen] = useState(false);
  const [touchedInvoiceFields, setTouchedInvoiceFields] = useState<Set<string>>(() => new Set());
  const { getNextInvoiceNumberSuggestion, saveUsedInvoiceNumber } = useInvoiceNumbering();

  const invoiceData: InvoiceData = useMemo(
    () => ({
      businessName,
      businessContact,
      businessAddress,
      businessLogoDataUrl,
      customerName,
      customerContact,
      customerAddress,
      invoiceNumber,
      invoiceDate,
      dueDate,
      currency,
      items: lineItems,
      discount,
      tax,
      shipping,
      payment,
      notes,
      terms
    }),
    [
      businessAddress,
      businessContact,
      businessLogoDataUrl,
      businessName,
      currency,
      customerAddress,
      customerContact,
      customerName,
      discount,
      dueDate,
      invoiceDate,
      invoiceNumber,
      lineItems,
      notes,
      payment,
      shipping,
      tax,
      terms
    ]
  );

  const validationDisplayOptions = useMemo(
    () => ({
      touchedFields: touchedInvoiceFields
    }),
    [touchedInvoiceFields]
  );

  const {
    calculation,
    exportErrors,
    getLineItemError,
    getValidationMessage,
    lineItemPreviewTotals,
    lineItemsMessage
  } = useInvoiceValidation(invoiceData, lineItems, validationDisplayOptions);

  const restoreInvoiceState = useCallback(
    (invoice: InvoiceData) => {
      const restoredInvoice = prepareInvoiceForFormRestore(invoice, {
        invoiceDate: todayIsoDate(),
        invoiceNumber: DEFAULT_INVOICE_NUMBER,
        lineItemId: createLineItem(1).id
      });

      setBusinessName(restoredInvoice.businessName);
      setBusinessContact(restoredInvoice.businessContact);
      setBusinessAddress(restoredInvoice.businessAddress);
      setBusinessLogoDataUrl(restoredInvoice.businessLogoDataUrl);
      setCustomerName(restoredInvoice.customerName);
      setCustomerContact(restoredInvoice.customerContact);
      setCustomerAddress(restoredInvoice.customerAddress);
      setInvoiceNumber(restoredInvoice.invoiceNumber);
      setInvoiceDate(restoredInvoice.invoiceDate);
      setDueDate(restoredInvoice.dueDate);
      setNotes(restoredInvoice.notes);
      setTerms(restoredInvoice.terms);
      setPayment(restoredInvoice.payment);
      setTax(normalizeRestoredTaxRows(restoredInvoice.tax));
      setDiscount(restoredInvoice.discount);
      setShipping(restoredInvoice.shipping ?? DEFAULT_INVOICE_SHIPPING);
      setLineItems(restoredInvoice.items);

      if (isCurrencyCode(restoredInvoice.currency)) {
        setCurrency(restoredInvoice.currency);
      }
    },
    [setCurrency]
  );

  const {
    autosaveError,
    beginNewInvoice,
    clearAutosaveTimer,
    currentInvoiceId,
    duplicateSavedInvoice,
    exportBackup,
    importBackup,
    openSavedInvoice,
    removeSavedInvoice,
    resetEverything,
    savedInvoices,
    saveCurrentInvoice,
    setAutosaveError,
    skipNextAutosave
  } = useInvoiceDraft({
    invoiceData,
    restoreInvoiceState
  });

  const markInvoiceFieldTouched = useCallback((field: string) => {
    setTouchedInvoiceFields((currentFields) => {
      if (currentFields.has(field)) {
        return currentFields;
      }

      const nextFields = new Set(currentFields);
      nextFields.add(field);
      return nextFields;
    });
  }, []);

  function resetValidationDisplay() {
    setTouchedInvoiceFields(new Set());
  }

  const updateLineItem = useCallback((id: string, key: keyof InvoiceLineItem, value: string) => {
    setLineItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }, []);

  function updatePayment(field: keyof InvoicePaymentDetails, value: string | undefined) {
    setPayment((currentPayment) => ({
      ...currentPayment,
      [field]: value
    }));
  }

  function updateShippingAmount(value: string) {
    setShipping((currentShipping) => ({
      ...currentShipping,
      amount: value
    }));
  }

  function updateShippingEnabled(enabled: boolean) {
    setShipping((currentShipping) => ({
      enabled,
      label: currentShipping.label || DEFAULT_INVOICE_SHIPPING.label,
      amount: currentShipping.amount || DEFAULT_INVOICE_SHIPPING.amount
    }));
  }

  function updateShippingLabel(value: string) {
    setShipping((currentShipping) => ({
      ...currentShipping,
      label: value
    }));
  }

  function addTaxRow() {
    setTax((currentTaxRows) => [...currentTaxRows, createTaxRow(currentTaxRows.length + 1)]);
  }

  function removeTaxRow(id: string) {
    setTax((currentTaxRows) => currentTaxRows.filter((taxRow) => taxRow.id !== id));
  }

  function updateTaxLabel(id: string, value: string) {
    setTax((currentTaxRows) =>
      currentTaxRows.map((taxRow) => (taxRow.id === id ? { ...taxRow, label: value } : taxRow))
    );
  }

  function updateTaxValue(id: string, value: string) {
    setTax((currentTaxRows) =>
      currentTaxRows.map((taxRow) => (taxRow.id === id ? { ...taxRow, value } : taxRow))
    );
  }

  function updateTaxType(id: string, type: InvoiceTax["type"]) {
    setTax((currentTaxRows) =>
      currentTaxRows.map((taxRow) => (taxRow.id === id ? { ...taxRow, type } : taxRow))
    );
  }

  function updateDiscountEnabled(enabled: boolean) {
    setDiscount((currentDiscount) => {
      return {
        ...currentDiscount,
        enabled,
        label: currentDiscount.label || DEFAULT_INVOICE_DISCOUNT.label,
        value: currentDiscount.enabled ? currentDiscount.value : DEFAULT_INVOICE_DISCOUNT.value
      };
    });
  }

  function updateDiscountLabel(value: string) {
    setDiscount((currentDiscount) => ({
      ...currentDiscount,
      label: value
    }));
  }

  function toggleDiscountType() {
    setDiscount((currentDiscount) => ({
      ...currentDiscount,
      enabled: true,
      type: currentDiscount.type === "percentage" ? "fixed" : "percentage"
    }));
  }

  function updateDiscountValue(value: string) {
    setDiscount((currentDiscount) => ({
      ...currentDiscount,
      value
    }));
  }

  function addLineItem() {
    setLineItems((currentItems) => [...currentItems, createLineItem(currentItems.length + 1)]);
  }

  const removeLineItem = useCallback((id: string) => {
    setLineItems((currentItems) =>
      currentItems.length === 1 ? currentItems : currentItems.filter((item) => item.id !== id)
    );
  }, []);

  const handleLineItemBlur = useCallback(
    (index: number, key: "description" | "quantity" | "unitPrice") => {
      markInvoiceFieldTouched(`items.${index}.${key}`);
    },
    [markInvoiceFieldTouched]
  );

  function clearEverything() {
    setIsClearEverythingModalOpen(true);
  }

  function handleOpenSavedInvoice(id: string) {
    setIsSavedInvoicesModalOpen(false);
    if (openSavedInvoice(id)) {
      returnToEditor();
      resetValidationDisplay();
      scrollInvoiceGeneratorToTop();
    }
  }

  // A duplicate is for "same as last time, new month", so it takes a fresh
  // number and today's date rather than copying the original's.
  function handleDuplicateSavedInvoice(id: string) {
    setIsSavedInvoicesModalOpen(false);
    const duplicated = duplicateSavedInvoice(id, {
      fallbackInvoiceNumber: getNextInvoiceNumberSuggestion() ?? DEFAULT_INVOICE_NUMBER,
      invoiceDate: todayIsoDate()
    });

    if (duplicated) {
      returnToEditor();
      resetValidationDisplay();
      scrollInvoiceGeneratorToTop();
    }
  }

  function handleDeleteSavedInvoice(id: string) {
    const { wasCurrent } = removeSavedInvoice(id);

    if (!wasCurrent) {
      return;
    }
    returnToEditor();

    // The invoice on screen was the one deleted, so put a blank one in its
    // place rather than leaving the form pointing at something that is gone.
    // Business details are kept: deleting an invoice is not a reason to make
    // someone retype who they are.
    skipNextAutosave();
    restoreInvoiceState(
      mergeInvoice(
        splitInvoice(invoiceData).profile,
        splitInvoice(
          createEmptyInvoiceDefaults({
            invoiceDate: todayIsoDate(),
            invoiceNumber: getNextInvoiceNumberSuggestion() ?? DEFAULT_INVOICE_NUMBER,
            lineItemId: createLineItem(1).id
          })
        ).fields
      )
    );
    resetValidationDisplay();
  }

  function confirmClearEverything() {
    const nextInvoiceNumber = getNextInvoiceNumberSuggestion();
    clearAutosaveTimer();
    // Discards this invoice and the saved business details. Any other saved
    // invoice is left alone: Reset is for the work in front of you, not the
    // whole library.
    const clearResult = resetEverything();
    skipNextAutosave();
    restoreInvoiceState(
      createEmptyInvoiceDefaults({
        invoiceDate: todayIsoDate(),
        invoiceNumber: nextInvoiceNumber ?? DEFAULT_INVOICE_NUMBER,
        lineItemId: createLineItem(1).id
      })
    );
    setAutosaveError(
      clearResult.ok
        ? ""
        : "Draft could not be cleared from this device. The form was reset for this session."
    );
    resetValidationDisplay();
    returnToEditor();
    setIsClearEverythingModalOpen(false);
    scrollInvoiceGeneratorToTop();
  }

  function scrollInvoiceGeneratorToTop() {
    window.requestAnimationFrame(() => {
      invoiceGeneratorTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  // Keep drafts available, but focus an entered value that would make the PDF
  // incorrect. Use the existing field errors rather than adding another notice.
  function canExportInvoice() {
    clearPdfStatus();
    const firstError = exportErrors[0];
    if (!firstError) return true;
    markInvoiceFieldTouched(firstError.field);
    window.requestAnimationFrame(() => {
      invoiceGeneratorTopRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
    return false;
  }

  function previewInvoice() {
    if (!canExportInvoice()) return;
    void prepareInvoicePdf();
  }

  function downloadInvoice() {
    if (!canExportInvoice()) return;
    saveCurrentInvoice();
    void downloadInvoicePdf();
  }

  function openHistory() {
    if (pdfStage === "closed") saveCurrentInvoice();
    setIsSavedInvoicesModalOpen(true);
  }

  /**
   * Starts the next invoice from the same business details. The one on screen
   * has already been autosaved under its own id, so it stays in My invoices.
   */
  function startNewInvoice() {
    if (!saveCurrentInvoice()) return;
    returnToEditor();
    clearAutosaveTimer();
    beginNewInvoice();
    skipNextAutosave();
    restoreInvoiceState(
      mergeInvoice(
        splitInvoice(invoiceData).profile,
        splitInvoice(
          createEmptyInvoiceDefaults({
            currency: invoiceData.currency,
            invoiceDate: todayIsoDate(),
            invoiceNumber: getNextInvoiceNumberSuggestion() ?? DEFAULT_INVOICE_NUMBER,
            lineItemId: createLineItem(1).id
          })
        ).fields
      )
    );
    resetValidationDisplay();
    scrollInvoiceGeneratorToTop();
  }

  const pdfParams = useMemo(
    () => ({ calculation, formatCurrency, invoiceData }),
    [calculation, formatCurrency, invoiceData]
  );
  const {
    clearPdfStatus,
    returnToEditor,
    completedPdf,
    downloadCompletedPdf,
    downloadInvoicePdf,
    isGeneratingPdf,
    pdfStage,
    pdfStatus,
    prepareInvoicePdf
  } = useInvoicePdf({
    invoiceNumber,
    pdfParams,
    saveUsedInvoiceNumber
  });
  useEffect(() => {
    onCompletionChange?.(pdfStage === "downloaded");
  }, [onCompletionChange, pdfStage]);
  const businessNameError = getValidationMessage("businessName");
  const businessContactError = getValidationMessage("businessContact");
  const businessAddressError = getValidationMessage("businessAddress");
  const customerNameError = getValidationMessage("customerName");
  const customerContactError = getValidationMessage("customerContact");
  const customerAddressError = getValidationMessage("customerAddress");
  const invoiceNumberError = getValidationMessage("invoiceNumber");
  const invoiceDateError = getValidationMessage("invoiceDate");
  const dueDateError = getValidationMessage("dueDate");
  const notesError = getValidationMessage("notes");
  const termsError = getValidationMessage("terms");
  const discountError = getValidationMessage("discount.value");
  const discountLabelError = getValidationMessage("discount.label");
  const shippingError = getValidationMessage("shipping.amount");
  const shippingLabelError = getValidationMessage("shipping.label");
  const paymentErrors = {
    accountName: getValidationMessage("payment.accountName"),
    accountNumber: getValidationMessage("payment.accountNumber"),
    bankName: getValidationMessage("payment.bankName"),
    duitNowId: getValidationMessage("payment.duitNowId"),
    notes: getValidationMessage("payment.notes"),
    paymentLink: getValidationMessage("payment.paymentLink")
  };

  return (
    <div>
      <div className="scroll-mt-24" ref={invoiceGeneratorTopRef}>
        {pdfStage === "downloaded" && completedPdf ? (
          <InvoiceDownloadComplete
            invoiceNumber={completedPdf.invoiceNumber}
            customerName={completedPdf.customerName}
            total={completedPdf.total}
            autosaveError={autosaveError}
            pdfStatus={pdfStatus}
            onDownload={downloadCompletedPdf}
            onEdit={() => { returnToEditor(); scrollInvoiceGeneratorToTop(); }}
            onNewInvoice={startNewInvoice}
            onHistory={openHistory}
          />
        ) : (
        <EditableInvoiceCanvas
          autosaveError={autosaveError}
          businessAddress={businessAddress}
          businessAddressError={businessAddressError}
          businessContact={businessContact}
          businessContactError={businessContactError}
          businessLogoDataUrl={businessLogoDataUrl}
          businessName={businessName}
          businessNameError={businessNameError}
          calculation={calculation}
          currencySymbol={currencySymbol}
          customerAddress={customerAddress}
          customerAddressError={customerAddressError}
          customerContact={customerContact}
          customerContactError={customerContactError}
          customerName={customerName}
          customerNameError={customerNameError}
          discount={discount}
          discountError={discountError}
          discountLabelError={discountLabelError}
          dueDate={dueDate}
          dueDateError={dueDateError}
          formatCurrency={formatCurrency}
          getLineItemError={getLineItemError}
          invoiceDate={invoiceDate}
          invoiceDateError={invoiceDateError}
          invoiceNumber={invoiceNumber}
          invoiceNumberError={invoiceNumberError}
          isGeneratingPdf={isGeneratingPdf}
          lineItemPreviewTotals={lineItemPreviewTotals}
          lineItems={lineItems}
          lineItemsMessage={lineItemsMessage}
          notes={notes}
          notesError={notesError}
          onAddLineItem={addLineItem}
          onBusinessAddressChange={setBusinessAddress}
          onBusinessContactChange={setBusinessContact}
          onBusinessLogoChange={setBusinessLogoDataUrl}
          onBusinessNameChange={setBusinessName}
          onClearEverything={clearEverything}
          onOpenSavedInvoices={openHistory}
          savedInvoiceCount={savedInvoices.length}
          onCustomerAddressChange={setCustomerAddress}
          onCustomerContactChange={setCustomerContact}
          onCustomerNameChange={setCustomerName}
          onDiscountEnabledChange={updateDiscountEnabled}
          onDiscountLabelChange={updateDiscountLabel}
          onDiscountTypeToggle={toggleDiscountType}
          onDiscountValueChange={updateDiscountValue}
          onDownloadInvoice={downloadInvoice}
          onPreviewInvoice={previewInvoice}
          onDueDateChange={setDueDate}
          onFieldBlur={markInvoiceFieldTouched}
          onInvoiceDateChange={setInvoiceDate}
          onInvoiceNumberChange={setInvoiceNumber}
          onLineItemBlur={handleLineItemBlur}
          onNotesChange={setNotes}
          onPaymentChange={updatePayment}
          onPaymentFieldBlur={(field) => markInvoiceFieldTouched(`payment.${field}`)}
          onRemoveLineItem={removeLineItem}
          onShippingAmountChange={updateShippingAmount}
          onShippingEnabledChange={updateShippingEnabled}
          onShippingLabelChange={updateShippingLabel}
          onAddTax={addTaxRow}
          onRemoveTax={removeTaxRow}
          onTaxLabelChange={updateTaxLabel}
          onTaxTypeChange={updateTaxType}
          onTaxValueChange={updateTaxValue}
          onTermsChange={setTerms}
          onUpdateLineItem={updateLineItem}
          payment={payment}
          paymentErrors={paymentErrors}
          pdfStatus={pdfStatus}
          shipping={shipping}
          shippingError={shippingError}
          shippingLabelError={shippingLabelError}
          tax={tax}
          getTaxError={(index, key) => getValidationMessage(`tax.${index}.${key}`)}
          terms={terms}
          termsError={termsError}
        />
        )}
      </div>

      <InvoiceModals
        isClearEverythingModalOpen={isClearEverythingModalOpen}
        onCancelClearEverything={() => setIsClearEverythingModalOpen(false)}
        onConfirmClearEverything={confirmClearEverything}
      />

      <SavedInvoicesModal
        currentInvoiceId={pdfStage === "downloaded" ? "" : currentInvoiceId}
        invoices={savedInvoices}
        isOpen={isSavedInvoicesModalOpen}
        onClose={() => setIsSavedInvoicesModalOpen(false)}
        onDelete={handleDeleteSavedInvoice}
        onDuplicate={handleDuplicateSavedInvoice}
        onExportBackup={exportBackup}
        onImportBackup={importBackup}
        onOpenInvoice={handleOpenSavedInvoice}
      />
    </div>
  );
}
