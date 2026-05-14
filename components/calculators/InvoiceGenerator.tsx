"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import {
  EditableInvoiceCanvas,
  type EditableInvoiceDiscountMode,
  type EditableInvoiceTaxMode
} from "@/components/invoice/EditableInvoiceCanvas";
import { InvoiceModals } from "@/components/invoice/InvoiceModals";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { CURRENCY_CODES, isCurrencyCode } from "@/lib/currency";
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
  DEFAULT_INVOICE_TERMS,
  type InvoiceData,
  type InvoiceDiscount,
  type InvoiceLineItem,
  type InvoicePaymentDetails,
  type InvoiceShipping
} from "@/lib/invoice/invoice-types";

type TaxMode = EditableInvoiceTaxMode;
type DiscountMode = EditableInvoiceDiscountMode;

const featureHighlights = [
  "Malaysia-friendly for simple record-keeping.",
  "Free to use with no sign-up required.",
  "Enter line items with quantity, unit price, subtotal, and total.",
  "Apply optional SST, other tax rates, and discounts when needed.",
  "Include payment details and an optional QR/payment image.",
  "Preview the invoice, download the PDF, and keep drafts on this device."
];

const toolFitNotes = [
  [
    "Good for",
    "Simple PDF invoices for Malaysian freelancers, students, small business owners, consultants, side-hustle sellers, and repeat customers."
  ],
  [
    "Not for",
    "Official LHDN/MyInvois submission, validation, connected e-Invoice filing, professional advice, or proof of tax compliance."
  ]
];

const taxOptions: { label: string; mode: TaxMode; rate: number | null }[] = [
  { label: "No tax", mode: "none", rate: 0 },
  { label: "SST 6%", mode: "sst-6", rate: 6 },
  { label: "SST 8%", mode: "sst-8", rate: 8 },
  { label: "Custom tax rate", mode: "custom", rate: null }
];

const discountOptions: { label: string; mode: DiscountMode }[] = [
  { label: "No discount", mode: "none" },
  { label: "Percentage discount", mode: "percentage" },
  { label: "Fixed amount discount", mode: "fixed" }
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

export function InvoiceGenerator() {
  const { currency, formatCurrency, setCurrency } = useCurrency();
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
  const [taxMode, setTaxMode] = useState<TaxMode>("none");
  const [customTaxRate, setCustomTaxRate] = useState("");
  const [discount, setDiscount] = useState<InvoiceDiscount>(DEFAULT_INVOICE_DISCOUNT);
  const [shipping, setShipping] = useState<InvoiceShipping>(DEFAULT_INVOICE_SHIPPING);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([createLineItem(1)]);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isClearEverythingModalOpen, setIsClearEverythingModalOpen] = useState(false);
  const [touchedInvoiceFields, setTouchedInvoiceFields] = useState<Set<string>>(() => new Set());
  const [hasAttemptedInvoiceAction, setHasAttemptedInvoiceAction] = useState(false);
  const { getNextInvoiceNumberSuggestion, saveUsedInvoiceNumber } = useInvoiceNumbering();

  const selectedTaxOption = taxOptions.find((option) => option.mode === taxMode);
  const discountMode: DiscountMode = discount.enabled ? discount.type : "none";
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
      tax: {
        enabled: taxMode !== "none",
        rate: taxMode === "custom" ? customTaxRate : String(selectedTaxOption?.rate ?? 0),
        label: selectedTaxOption?.label
      },
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
      customTaxRate,
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
      selectedTaxOption,
      shipping,
      taxMode,
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
      setDiscount(restoredInvoice.discount);
      setShipping(restoredInvoice.shipping ?? DEFAULT_INVOICE_SHIPPING);
      setLineItems(restoredInvoice.items);

      if (isCurrencyCode(restoredInvoice.currency)) {
        setCurrency(restoredInvoice.currency);
      }

      if (!restoredInvoice.tax.enabled) {
        setTaxMode("none");
        setCustomTaxRate("");
      } else if (restoredInvoice.tax.rate === "6") {
        setTaxMode("sst-6");
        setCustomTaxRate("");
      } else if (restoredInvoice.tax.rate === "8") {
        setTaxMode("sst-8");
        setCustomTaxRate("");
      } else {
        setTaxMode("custom");
        setCustomTaxRate(restoredInvoice.tax.rate);
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
      amount: currentShipping.amount || DEFAULT_INVOICE_SHIPPING.amount
    }));
  }

  function selectDiscount(mode: DiscountMode) {
    setDiscount((currentDiscount) => {
      if (mode === "none") {
        return DEFAULT_INVOICE_DISCOUNT;
      }

      return {
        enabled: true,
        type: mode,
        value: currentDiscount.enabled ? currentDiscount.value : DEFAULT_INVOICE_DISCOUNT.value
      };
    });
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
  const taxRateError = getValidationMessage("tax.rate");
  const discountError = getValidationMessage("discount.value");
  const shippingError = getValidationMessage("shipping.amount");
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
          currency={currency}
          currencyCodes={CURRENCY_CODES}
          customTaxRate={customTaxRate}
          customerAddress={customerAddress}
          customerAddressError={customerAddressError}
          customerContact={customerContact}
          customerContactError={customerContactError}
          customerName={customerName}
          customerNameError={customerNameError}
          discount={discount}
          discountError={discountError}
          discountMode={discountMode}
          discountOptions={discountOptions}
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
          onCurrencyChange={setCurrency}
          onCustomTaxRateChange={setCustomTaxRate}
          onCustomerAddressChange={setCustomerAddress}
          onCustomerContactChange={setCustomerContact}
          onCustomerNameChange={setCustomerName}
          onDiscountModeChange={selectDiscount}
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
          onTaxModeChange={setTaxMode}
          onTermsChange={setTerms}
          onUpdateLineItem={updateLineItem}
          payment={payment}
          paymentErrors={paymentErrors}
          pdfStatus={pdfStatus}
          previewItems={previewItems}
          shipping={shipping}
          shippingError={shippingError}
          taxMode={taxMode}
          taxOptions={taxOptions}
          taxRateError={taxRateError}
          terms={terms}
          termsError={termsError}
          validationSummaryMessage={validationSummaryMessage}
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Fast invoice setup</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Create PDF invoices for Malaysia in a few steps
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Build the invoice details, check the preview, then download a clean PDF invoice for
            your records or customer.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featureHighlights.map((feature) => (
              <div
                className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
                key={feature}
              >
                {feature}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Malaysia note</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple PDF invoice only, not MyInvois filing
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            No. This invoice generator creates a simple PDF invoice for payment requests and
            record-keeping. It does not submit, validate, or connect invoices to LHDN/MyInvois.
            For official e-Invoice requirements, check the latest LHDN guidance or speak with a
            qualified professional.
          </p>
          <div className="mt-5 grid gap-3">
            {toolFitNotes.map(([label, text]) => (
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4" key={label}>
                <h3 className="text-sm font-semibold text-stone-950">{label}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Connect invoices with SST, cash flow, and business checks
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use the SST, cash flow, break-even, and ratio calculators to review the numbers
              around an invoice before and after it is issued.
            </p>
          </div>
          <div className="flex flex-col gap-3">
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
        </div>
      </Card>

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
