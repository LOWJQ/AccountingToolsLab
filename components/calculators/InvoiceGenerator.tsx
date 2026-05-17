"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { EditableInvoiceCanvas } from "@/components/invoice/EditableInvoiceCanvas";
import { InvoiceModals } from "@/components/invoice/InvoiceModals";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCurrencyOption, isCurrencyCode } from "@/lib/currency";
import { calculateInvoiceLineItems } from "@/lib/invoice/invoice-calculations";
import {
  createEmptyInvoiceDefaults,
  createNewInvoiceFromCurrent,
  DEFAULT_INVOICE_NUMBER,
  prepareInvoiceForFormRestore
} from "@/lib/invoice/invoice-defaults";
import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";
import { useInvoiceNumbering } from "@/hooks/useInvoiceNumbering";
import { useInvoicePdf } from "@/hooks/useInvoicePdf";
import { useInvoiceValidation } from "@/hooks/useInvoiceValidation";
import { clearInvoiceDraft } from "@/lib/invoice/invoice-storage";
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
  type InvoiceShipping
} from "@/lib/invoice/invoice-types";

const featureHighlights = [
  "Malaysia-friendly for simple record-keeping.",
  "Free to use with no sign-up required.",
  "Enter line items with quantity, unit price, subtotal, and total.",
  "Apply optional SST, other tax rates, and discounts when needed.",
  "Include payment details and an optional QR/payment image.",
  "Preview the invoice, download the PDF, and keep drafts on this device."
];

function createLineItem(index: number): InvoiceLineItem {
  return {
    id: `item-${Date.now()}-${index}`,
    description: "",
    quantity: "1",
    unitPrice: ""
  };
}

function getLocalDateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function normalizeLegacyTaxLabel(label: string) {
  return ["SST 6%", "SST 8%", "Custom tax rate"].includes(label) ? "Tax" : label;
}

export function InvoiceGenerator() {
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
  const [invoiceDate, setInvoiceDate] = useState(() => getLocalDateInputValue());
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(DEFAULT_INVOICE_TERMS);
  const [payment, setPayment] = useState<InvoicePaymentDetails>(DEFAULT_INVOICE_PAYMENT_DETAILS);
  const [tax, setTax] = useState(DEFAULT_INVOICE_TAX);
  const [discount, setDiscount] = useState<InvoiceDiscount>(DEFAULT_INVOICE_DISCOUNT);
  const [shipping, setShipping] = useState<InvoiceShipping>(DEFAULT_INVOICE_SHIPPING);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([createLineItem(1)]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isClearEverythingModalOpen, setIsClearEverythingModalOpen] = useState(false);
  const [touchedInvoiceFields, setTouchedInvoiceFields] = useState<Set<string>>(() => new Set());
  const [hasAttemptedInvoiceAction, setHasAttemptedInvoiceAction] = useState(false);
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
      showAllErrors: hasAttemptedInvoiceAction,
      touchedFields: touchedInvoiceFields
    }),
    [hasAttemptedInvoiceAction, touchedInvoiceFields]
  );

  const {
    calculation,
    getLineItemError,
    getValidationMessage,
    hasValidInvoice,
    lineItemPreviewTotals,
    lineItemsMessage
  } = useInvoiceValidation(invoiceData, lineItems, validationDisplayOptions);

  const restoreInvoiceState = useCallback(
    (invoice: InvoiceData) => {
      const restoredInvoice = prepareInvoiceForFormRestore(invoice, {
        invoiceDate: getLocalDateInputValue(),
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
      setTax({
        ...restoredInvoice.tax,
        label: normalizeLegacyTaxLabel(restoredInvoice.tax.label)
      });
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
    clearAutosaveTimer,
    setAutosaveError,
    skipNextAutosave
  } = useInvoiceDraft({
    invoiceData,
    restoreInvoiceState
  });

  function markInvoiceFieldTouched(field: string) {
    setTouchedInvoiceFields((currentFields) => {
      if (currentFields.has(field)) {
        return currentFields;
      }

      const nextFields = new Set(currentFields);
      nextFields.add(field);
      return nextFields;
    });
  }

  function resetValidationDisplay() {
    setTouchedInvoiceFields(new Set());
    setHasAttemptedInvoiceAction(false);
  }

  function revealInvoiceValidationErrors() {
    setHasAttemptedInvoiceAction(true);
    scrollInvoiceGeneratorToTop();
  }

  function updateLineItem(id: string, key: keyof InvoiceLineItem, value: string) {
    setLineItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }

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

  function updateTaxEnabled(enabled: boolean) {
    setTax((currentTax) => ({
      ...currentTax,
      enabled,
      label: currentTax.label || DEFAULT_INVOICE_TAX.label,
      value: currentTax.value || DEFAULT_INVOICE_TAX.value
    }));
  }

  function updateTaxLabel(value: string) {
    setTax((currentTax) => ({
      ...currentTax,
      label: value
    }));
  }

  function updateTaxValue(value: string) {
    setTax((currentTax) => ({
      ...currentTax,
      value
    }));
  }

  function toggleTaxType() {
    setTax((currentTax) => ({
      ...currentTax,
      type: currentTax.type === "percentage" ? "fixed" : "percentage"
    }));
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

  function removeLineItem(id: string) {
    setLineItems((currentItems) =>
      currentItems.length === 1 ? currentItems : currentItems.filter((item) => item.id !== id)
    );
  }

  function startNewInvoice() {
    const nextInvoiceNumber = getNextInvoiceNumberSuggestion();
    restoreInvoiceState(
      createNewInvoiceFromCurrent(invoiceData, {
        invoiceDate: getLocalDateInputValue(),
        invoiceNumber: nextInvoiceNumber ?? DEFAULT_INVOICE_NUMBER,
        lineItemId: createLineItem(1).id
      })
    );
    setAutosaveError("");
    resetValidationDisplay();
    setIsDownloadModalOpen(false);
    scrollInvoiceGeneratorToTop();
  }

  function clearEverything() {
    setIsClearEverythingModalOpen(true);
  }

  function confirmClearEverything() {
    const nextInvoiceNumber = getNextInvoiceNumberSuggestion();
    clearAutosaveTimer();
    const clearResult = clearInvoiceDraft();
    skipNextAutosave();
    restoreInvoiceState(
      createEmptyInvoiceDefaults({
        invoiceDate: getLocalDateInputValue(),
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
    setIsDownloadModalOpen(false);
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

  function openDownloadModal() {
    if (!hasValidInvoice) {
      revealInvoiceValidationErrors();
      return;
    }

    clearPdfStatus();
    setIsDownloadModalOpen(true);
  }

  function confirmDownloadInvoicePdf() {
    if (!hasValidInvoice) {
      revealInvoiceValidationErrors();
      setIsDownloadModalOpen(false);
      return;
    }

    void downloadInvoicePdf();
  }

  const previewItems = useMemo(
    () =>
      calculateInvoiceLineItems(lineItems).map((item, index) => ({
        ...item,
        description: lineItems[index]?.description.trim() || `Item ${index + 1}`
      })),
    [lineItems]
  );
  const pdfParams = useMemo(
    () => ({
      calculation,
      formatCurrency,
      invoiceData,
      previewItems
    }),
    [
      calculation,
      formatCurrency,
      invoiceData,
      previewItems
    ]
  );
  const handleDownloadComplete = useCallback(() => {
    setIsDownloadModalOpen(false);
  }, []);
  const {
    clearPdfStatus,
    downloadInvoicePdf,
    isGeneratingPdf,
    pdfStatus
  } = useInvoicePdf({
    hasValidInvoice,
    invoiceNumber,
    onDownloadComplete: handleDownloadComplete,
    pdfParams,
    saveUsedInvoiceNumber
  });
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
  const taxLabelError = getValidationMessage("tax.label");
  const taxValueError = getValidationMessage("tax.value");
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
  const validationSummaryMessage =
    hasAttemptedInvoiceAction && !hasValidInvoice
      ? "Please complete the highlighted invoice fields before downloading."
      : "";

  return (
    <div className="flex flex-col gap-8">
      <div className="scroll-mt-24" ref={invoiceGeneratorTopRef}>
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
      currencyCode={currency}
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
          onCustomerAddressChange={setCustomerAddress}
          onCustomerContactChange={setCustomerContact}
          onCustomerNameChange={setCustomerName}
          onDiscountEnabledChange={updateDiscountEnabled}
          onDiscountLabelChange={updateDiscountLabel}
          onDiscountTypeToggle={toggleDiscountType}
          onDiscountValueChange={updateDiscountValue}
          onDownloadInvoice={openDownloadModal}
          onDueDateChange={setDueDate}
          onFieldBlur={markInvoiceFieldTouched}
          onInvoiceDateChange={setInvoiceDate}
          onInvoiceNumberChange={setInvoiceNumber}
          onLineItemBlur={(index, key) => markInvoiceFieldTouched(`items.${index}.${key}`)}
          onNewInvoice={startNewInvoice}
          onNotesChange={setNotes}
          onPaymentChange={updatePayment}
          onPaymentFieldBlur={(field) => markInvoiceFieldTouched(`payment.${field}`)}
          onRemoveLineItem={removeLineItem}
          onShippingAmountChange={updateShippingAmount}
          onShippingEnabledChange={updateShippingEnabled}
          onShippingLabelChange={updateShippingLabel}
          onTaxEnabledChange={updateTaxEnabled}
          onTaxLabelChange={updateTaxLabel}
          onTaxTypeToggle={toggleTaxType}
          onTaxValueChange={updateTaxValue}
          onTermsChange={setTerms}
          onUpdateLineItem={updateLineItem}
          payment={payment}
          paymentErrors={paymentErrors}
          pdfStatus={pdfStatus}
          previewItems={previewItems}
          shipping={shipping}
          shippingError={shippingError}
          shippingLabelError={shippingLabelError}
          tax={tax}
          taxLabelError={taxLabelError}
          taxValueError={taxValueError}
          terms={terms}
          termsError={termsError}
          validationSummaryMessage={validationSummaryMessage}
        />
      </div>

      <section className="space-y-8 border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Create PDF invoices for Malaysia in a few steps
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Build the invoice details, check the preview, then download a clean PDF invoice for
            your records or customer.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700 sm:text-base">
            {featureHighlights.map((feature) => (
              <li className="flex gap-3" key={feature}>
                <span aria-hidden="true" className="text-stone-400">
                  →
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-stone-200 pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            Connect invoices with SST, cash flow, and business checks
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use the SST, cash flow, break-even, and ratio calculators to review the numbers
            around an invoice before and after it is issued.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/sst-calculator-malaysia">SST Calculator Malaysia</ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools/break-even-calculator" variant="secondary">
            Break-even Calculator
          </ButtonLink>
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>

      <InvoiceModals
        hasValidInvoice={hasValidInvoice}
        isClearEverythingModalOpen={isClearEverythingModalOpen}
        isDownloadModalOpen={isDownloadModalOpen}
        isGeneratingPdf={isGeneratingPdf}
        onCancelClearEverything={() => setIsClearEverythingModalOpen(false)}
        onCancelDownload={() => setIsDownloadModalOpen(false)}
        onConfirmClearEverything={confirmClearEverything}
        onConfirmDownload={confirmDownloadInvoicePdf}
        pdfStatus={pdfStatus}
      />
    </div>
  );
}
