"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { InvoiceBillFrom } from "@/components/invoice/InvoiceBillFrom";
import { InvoiceCustomer } from "@/components/invoice/InvoiceCustomer";
import { InvoiceLineItems } from "@/components/invoice/InvoiceLineItems";
import { InvoiceMeta } from "@/components/invoice/InvoiceMeta";
import { InvoiceModals } from "@/components/invoice/InvoiceModals";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import {
  InvoiceTotals,
  type InvoiceDiscountMode,
  type InvoiceTaxMode
} from "@/components/invoice/InvoiceTotals";
import { PaymentDetailsFields } from "@/components/invoice/PaymentDetailsFields";
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
import { INVOICE_TEXT_MAX_LENGTHS } from "@/lib/invoice/invoice-limits";
import { useInvoiceDraft } from "@/hooks/useInvoiceDraft";
import { useInvoiceNumbering } from "@/hooks/useInvoiceNumbering";
import { useInvoicePdf } from "@/hooks/useInvoicePdf";
import { useInvoiceValidation } from "@/hooks/useInvoiceValidation";
import { clearInvoiceDraft } from "@/lib/invoice/invoice-storage";
import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  DEFAULT_INVOICE_TERMS,
  type InvoiceData,
  type InvoiceDiscount,
  type InvoiceLineItem,
  type InvoicePaymentDetails
} from "@/lib/invoice/invoice-types";

type InvoiceView = "details" | "preview";
type TaxMode = InvoiceTaxMode;
type DiscountMode = InvoiceDiscountMode;

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
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([createLineItem(1)]);
  const [activeView, setActiveView] = useState<InvoiceView>("details");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isClearEverythingModalOpen, setIsClearEverythingModalOpen] = useState(false);
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
      taxMode,
      terms
    ]
  );

  const {
    calculation,
    getLineItemError,
    getValidationMessage,
    hasValidInvoice,
    lineItemPreviewTotals,
    lineItemsMessage
  } = useInvoiceValidation(invoiceData, lineItems);

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

  useEffect(() => {
    if (hasValidInvoice) {
      return;
    }

    setIsDownloadModalOpen(false);

    if (activeView === "preview") {
      setActiveView("details");
    }
  }, [activeView, hasValidInvoice]);

  const {
    autosaveError,
    clearAutosaveTimer,
    setAutosaveError,
    skipNextAutosave
  } = useInvoiceDraft({
    invoiceData,
    restoreInvoiceState
  });

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
    setActiveView("details");
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
    setActiveView("details");
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

  function switchInvoiceView(view: InvoiceView) {
    if (view === "preview" && !hasValidInvoice) {
      return;
    }

    setActiveView(view);
    scrollInvoiceGeneratorToTop();
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
  const paymentErrors = {
    accountName: getValidationMessage("payment.accountName"),
    accountNumber: getValidationMessage("payment.accountNumber"),
    bankName: getValidationMessage("payment.bankName"),
    duitNowId: getValidationMessage("payment.duitNowId"),
    notes: getValidationMessage("payment.notes"),
    paymentLink: getValidationMessage("payment.paymentLink")
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="scroll-mt-24" ref={invoiceGeneratorTopRef}>
        <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="inline-grid rounded-xl border border-stone-200 bg-stone-50 p-1 sm:grid-cols-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeView === "details"
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-600 hover:text-stone-950"
            }`}
            onClick={() => switchInvoiceView("details")}
            type="button"
          >
            Enter Invoice Details
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeView === "preview"
                ? "bg-white text-stone-950 shadow-sm"
                : hasValidInvoice
                  ? "text-stone-600 hover:text-stone-950"
                  : "cursor-not-allowed text-stone-400"
            }`}
            aria-describedby={!hasValidInvoice ? "invoice-preview-disabled-note" : undefined}
            disabled={!hasValidInvoice}
            onClick={() => switchInvoiceView("preview")}
            type="button"
          >
            Preview Invoice
          </button>
        </div>
        {!hasValidInvoice ? (
          <p className="mt-3 text-sm font-medium text-red-700" id="invoice-preview-disabled-note">
            Enter the required information before previewing or downloading.
          </p>
        ) : null}

        <div className="mt-8 grid min-w-0 gap-8">
          {activeView === "details" ? (
            <div className="grid min-w-0 gap-6">
              <InvoiceBillFrom
                businessAddress={businessAddress}
                businessAddressError={businessAddressError}
                businessContact={businessContact}
                businessContactError={businessContactError}
                businessLogoDataUrl={businessLogoDataUrl}
                businessNameError={businessNameError}
                businessName={businessName}
                onBusinessAddressChange={setBusinessAddress}
                onBusinessContactChange={setBusinessContact}
                onBusinessLogoChange={setBusinessLogoDataUrl}
                onBusinessNameChange={setBusinessName}
              />

              <InvoiceCustomer
                customerAddress={customerAddress}
                customerAddressError={customerAddressError}
                customerContact={customerContact}
                customerContactError={customerContactError}
                customerNameError={customerNameError}
                customerName={customerName}
                onCustomerAddressChange={setCustomerAddress}
                onCustomerContactChange={setCustomerContact}
                onCustomerNameChange={setCustomerName}
              />

              <InvoiceMeta
                currency={currency}
                currencyCodes={CURRENCY_CODES}
                dueDate={dueDate}
                dueDateError={dueDateError}
                invoiceDate={invoiceDate}
                invoiceDateError={invoiceDateError}
                invoiceNumber={invoiceNumber}
                invoiceNumberError={invoiceNumberError}
                onCurrencyChange={setCurrency}
                onDueDateChange={setDueDate}
                onInvoiceDateChange={setInvoiceDate}
                onInvoiceNumberChange={setInvoiceNumber}
              />

              <InvoiceTotals
                currency={currency}
                customTaxRate={customTaxRate}
                discount={discount}
                discountError={discountError}
                discountMode={discountMode}
                discountOptions={discountOptions}
                onCustomTaxRateChange={setCustomTaxRate}
                onDiscountModeChange={selectDiscount}
                onDiscountValueChange={updateDiscountValue}
                onTaxModeChange={setTaxMode}
                taxRateError={taxRateError}
                taxMode={taxMode}
                taxOptions={taxOptions}
              />

              <InvoiceLineItems
                currency={currency}
                formatCurrency={formatCurrency}
                getLineItemError={getLineItemError}
                lineItemPreviewTotals={lineItemPreviewTotals}
                lineItems={lineItems}
                lineItemsMessage={lineItemsMessage}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
                onUpdateLineItem={updateLineItem}
              />

              <PaymentDetailsFields
                onChange={updatePayment}
                payment={payment}
                paymentErrors={paymentErrors}
              />

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-stone-800">
                  Notes (optional)
                </span>
                <textarea
                  aria-describedby={notesError ? "invoice-notes-error" : undefined}
                  className={`min-h-28 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
                    notesError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
                  }`}
                  maxLength={INVOICE_TEXT_MAX_LENGTHS.notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Additional notes for the customer"
                  value={notes}
                />
                {notesError ? (
                  <p className="text-sm font-medium text-red-700" id="invoice-notes-error">
                    {notesError}
                  </p>
                ) : null}
              </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">
                Terms &amp; Conditions (optional)
              </span>
              <textarea
                aria-describedby={termsError ? "invoice-terms-error" : undefined}
                className={`min-h-28 rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 ${
                  termsError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-stone-200"
                }`}
                maxLength={INVOICE_TEXT_MAX_LENGTHS.terms}
                onChange={(event) => setTerms(event.target.value)}
                placeholder="Payment terms or invoice conditions"
                value={terms}
              />
              {termsError ? (
                <p className="text-sm font-medium text-red-700" id="invoice-terms-error">
                  {termsError}
                </p>
              ) : null}
            </label>

            {autosaveError ? (
              <p className="text-sm font-medium text-red-700">{autosaveError}</p>
            ) : null}

            <p className="text-sm leading-6 text-stone-600">
              New invoice keeps your business, payment, and terms details. Clear everything resets
              the whole form.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                onClick={startNewInvoice}
                type="button"
              >
                New invoice
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                onClick={clearEverything}
                type="button"
              >
                Clear everything
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                aria-describedby={!hasValidInvoice ? "invoice-preview-disabled-note" : undefined}
                disabled={!hasValidInvoice}
                onClick={() => switchInvoiceView("preview")}
                type="button"
              >
                Preview invoice
              </button>
            </div>
            </div>
          ) : (
            <div className="grid min-w-0 gap-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-stone-600">
                  Review your invoice before downloading. The preview updates from the details you
                  entered.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-white"
                    onClick={() => switchInvoiceView("details")}
                    type="button"
                  >
                    Back to details
                  </button>
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-describedby={!hasValidInvoice ? "invoice-download-disabled-note" : undefined}
                    disabled={!hasValidInvoice}
                    onClick={() => {
                      clearPdfStatus();
                      setIsDownloadModalOpen(true);
                    }}
                    type="button"
                  >
                    Download invoice PDF
                  </button>
                </div>
              </div>
              {!hasValidInvoice ? (
                <p className="text-sm font-medium text-red-700" id="invoice-download-disabled-note">
                  Fix invoice errors before downloading.
                </p>
              ) : null}
              {pdfStatus ? (
                <p
                  className={`rounded-xl border p-3 text-sm font-medium leading-6 ${
                    pdfStatus.type === "error"
                      ? "border-red-100 bg-red-50 text-red-700"
                      : "border-amber-100 bg-amber-50 text-amber-800"
                  }`}
                  role="status"
                >
                  {pdfStatus.message}
                </p>
              ) : null}

              <InvoicePreview
                calculation={calculation}
                formatCurrency={formatCurrency}
                invoiceData={invoiceData}
                previewItems={previewItems}
              />
            </div>
          )}
        </div>
        </Card>
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
        onConfirmDownload={downloadInvoicePdf}
        pdfStatus={pdfStatus}
      />
    </div>
  );
}
