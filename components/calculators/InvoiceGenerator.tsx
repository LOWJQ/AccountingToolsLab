"use client";

import Image from "next/image";
import {
  type KeyboardEvent as ReactKeyboardEvent,
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
import { InvoicePaymentSection } from "@/components/invoice/InvoicePaymentSection";
import {
  InvoiceTotals,
  type InvoiceDiscountMode,
  type InvoiceTaxMode
} from "@/components/invoice/InvoiceTotals";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { CURRENCY_CODES, isCurrencyCode } from "@/lib/currency";
import {
  calculateInvoiceLineItems,
  calculateInvoiceTotals
} from "@/lib/invoice/invoice-calculations";
import {
  createEmptyInvoiceDefaults,
  createNewInvoiceFromCurrent,
  DEFAULT_INVOICE_NUMBER
} from "@/lib/invoice/invoice-defaults";
import {
  clearInvoiceDraft,
  loadLastInvoiceNumber,
  loadInvoiceDraft,
  saveLastInvoiceNumber,
  saveInvoiceDraft
} from "@/lib/invoice/invoice-storage";
import { getNextInvoiceNumber } from "@/lib/invoice/invoice-numbering";
import { generateInvoicePdf } from "@/lib/invoice/invoice-pdf-generator";
import {
  DEFAULT_INVOICE_DISCOUNT,
  DEFAULT_INVOICE_PAYMENT_DETAILS,
  DEFAULT_INVOICE_TERMS,
  type InvoiceData,
  type InvoiceDiscount,
  type InvoiceLineItem,
  type InvoicePaymentDetails
} from "@/lib/invoice/invoice-types";
import { validateInvoice } from "@/lib/invoice/invoice-validation";

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

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getLocalDateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function getFocusableElements(container: HTMLElement) {
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
    }
  );
}

function trapModalFocus(
  event: ReactKeyboardEvent<HTMLElement>,
  container: HTMLElement | null
) {
  if (event.key !== "Tab" || !container) {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const [autosaveError, setAutosaveError] = useState("");
  const confirmDownloadButtonRef = useRef<HTMLButtonElement>(null);
  const confirmClearEverythingButtonRef = useRef<HTMLButtonElement>(null);
  const downloadDialogRef = useRef<HTMLDivElement>(null);
  const clearEverythingDialogRef = useRef<HTMLDivElement>(null);
  const hasLoadedDraftRef = useRef(false);
  const skipNextAutosaveRef = useRef(false);
  const autosaveTimerRef = useRef<number | null>(null);

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

  const calculation = useMemo(() => calculateInvoiceTotals(invoiceData), [invoiceData]);
  const validationErrors = useMemo(() => validateInvoice(invoiceData), [invoiceData]);

  const lineItemPreviewTotals = useMemo(
    () =>
      calculateInvoiceLineItems(lineItems).map((item) => item.lineTotal),
    [lineItems]
  );

  const lineItemRequiredMessage = useMemo(() => {
    const lineItemError = validationErrors.find((error) => error.field === "items");
    return lineItemError?.message ?? "";
  }, [validationErrors]);

  const hasValidInvoice = validationErrors.length === 0;
  const lineItemsMessage = lineItemRequiredMessage;
  const getValidationMessage = useCallback(
    (field: string) => validationErrors.find((error) => error.field === field)?.message ?? "",
    [validationErrors]
  );
  const getLineItemError = useCallback(
    (index: number, key: "description" | "quantity" | "unitPrice") =>
      getValidationMessage(`items.${index}.${key}`),
    [getValidationMessage]
  );

  const restoreInvoiceState = useCallback(
    (invoice: InvoiceData) => {
      setBusinessName(invoice.businessName);
      setBusinessContact(invoice.businessContact);
      setBusinessAddress(invoice.businessAddress);
      setBusinessLogoDataUrl(invoice.businessLogoDataUrl);
      setCustomerName(invoice.customerName);
      setCustomerContact(invoice.customerContact);
      setCustomerAddress(invoice.customerAddress);
      setInvoiceNumber(invoice.invoiceNumber || DEFAULT_INVOICE_NUMBER);
      setInvoiceDate(invoice.invoiceDate || getLocalDateInputValue());
      setDueDate(invoice.dueDate);
      setNotes(invoice.notes);
      setTerms(invoice.terms);
      setPayment(invoice.payment);
      setDiscount(invoice.discount);
      setLineItems(invoice.items.length > 0 ? invoice.items : [createLineItem(1)]);

      if (isCurrencyCode(invoice.currency)) {
        setCurrency(invoice.currency);
      }

      if (!invoice.tax.enabled) {
        setTaxMode("none");
        setCustomTaxRate("");
      } else if (invoice.tax.rate === "6") {
        setTaxMode("sst-6");
        setCustomTaxRate("");
      } else if (invoice.tax.rate === "8") {
        setTaxMode("sst-8");
        setCustomTaxRate("");
      } else {
        setTaxMode("custom");
        setCustomTaxRate(invoice.tax.rate);
      }
    },
    [setCurrency]
  );

  useEffect(() => {
    if (!isDownloadModalOpen) {
      return;
    }

    confirmDownloadButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isGeneratingPdf) {
        setIsDownloadModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDownloadModalOpen, isGeneratingPdf]);

  useEffect(() => {
    if (!isClearEverythingModalOpen) {
      return;
    }

    confirmClearEverythingButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClearEverythingModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClearEverythingModalOpen]);

  useEffect(() => {
    if (hasValidInvoice) {
      return;
    }

    setIsDownloadModalOpen(false);

    if (activeView === "preview") {
      setActiveView("details");
    }
  }, [activeView, hasValidInvoice]);

  useEffect(() => {
    if (hasLoadedDraftRef.current) {
      return;
    }

    hasLoadedDraftRef.current = true;
    const storedDraft = loadInvoiceDraft();

    if (storedDraft) {
      restoreInvoiceState(storedDraft.invoice);
    }

    skipNextAutosaveRef.current = true;
    setIsDraftHydrated(true);
  }, [restoreInvoiceState]);

  useEffect(() => {
    if (!isDraftHydrated) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      const result = saveInvoiceDraft(invoiceData);

      if (!result.ok) {
        setAutosaveError("Draft could not be saved. Your invoice is still available this session.");
      } else {
        setAutosaveError("");
      }

      autosaveTimerRef.current = null;
    }, 1000);

    autosaveTimerRef.current = timer;

    return () => {
      window.clearTimeout(timer);
    };
  }, [invoiceData, isDraftHydrated]);

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

  function getNextInvoiceNumberSuggestion() {
    const lastInvoiceNumber = loadLastInvoiceNumber();
    return lastInvoiceNumber ? getNextInvoiceNumber(lastInvoiceNumber) : null;
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
    clearInvoiceDraft();
    skipNextAutosaveRef.current = true;
    restoreInvoiceState(
      createEmptyInvoiceDefaults({
        invoiceDate: getLocalDateInputValue(),
        invoiceNumber: nextInvoiceNumber ?? DEFAULT_INVOICE_NUMBER,
        lineItemId: createLineItem(1).id
      })
    );
    setAutosaveError("");
    setActiveView("details");
    setIsDownloadModalOpen(false);
    setIsClearEverythingModalOpen(false);
    scrollInvoiceGeneratorToTop();
  }

  function clearAutosaveTimer() {
    if (!autosaveTimerRef.current) {
      return;
    }

    window.clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = null;
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

  async function downloadInvoicePdf() {
    if (!hasValidInvoice) {
      return;
    }

    setIsGeneratingPdf(true);

    try {
      await generateInvoicePdf({
        businessAddress,
        businessContact,
        businessLogoDataUrl,
        businessName,
        calculation,
        customerAddress,
        customerContact,
        customerName,
        dueDate,
        formatCurrency,
        invoiceData,
        invoiceDate,
        invoiceNumber,
        notes,
        payment,
        previewItems,
        terms
      });
      saveLastInvoiceNumber(invoiceNumber);
      setIsDownloadModalOpen(false);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  const previewItems = calculateInvoiceLineItems(lineItems).map((item, index) => ({
    ...item,
    description: lineItems[index]?.description.trim() || `Item ${index + 1}`
  }));

  const subtotal = calculation.subtotal;
  const discountAmount = calculation.discountAmount;
  const taxableAmount = calculation.taxableAmount;
  const hasDiscount = discountAmount > 0;
  const taxRate = invoiceData.tax.enabled ? parseAmount(invoiceData.tax.rate) ?? 0 : 0;
  const taxAmount = calculation.taxAmount;
  const total = calculation.total;
  const hasTax = taxAmount > 0;
  const taxLabel = `SST / Tax (${formatAmount(taxRate)}%)`;
  const businessNameError = getValidationMessage("businessName");
  const customerNameError = getValidationMessage("customerName");
  const invoiceNumberError = getValidationMessage("invoiceNumber");
  const invoiceDateError = getValidationMessage("invoiceDate");
  const dueDateError = getValidationMessage("dueDate");
  const notesError = getValidationMessage("notes");
  const taxRateError = getValidationMessage("tax.rate");
  const discountError = getValidationMessage("discount.value");
  const paymentLinkError = getValidationMessage("payment.paymentLink");
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
                businessContact={businessContact}
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
                customerContact={customerContact}
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

              <InvoicePaymentSection
                onChange={updatePayment}
                payment={payment}
                paymentLinkError={paymentLinkError}
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
                className="min-h-28 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => setTerms(event.target.value)}
                placeholder="Payment terms or invoice conditions"
                value={terms}
              />
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
                    onClick={() => setIsDownloadModalOpen(true)}
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

      {isClearEverythingModalOpen ? (
        <div
          aria-labelledby="clear-invoice-draft-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsClearEverythingModalOpen(false)}
          role="dialog"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-6"
            onKeyDown={(event) => trapModalFocus(event, clearEverythingDialogRef.current)}
            onClick={(event) => event.stopPropagation()}
            ref={clearEverythingDialogRef}
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoice Draft</p>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
              id="clear-invoice-draft-title"
            >
              Clear all invoice details?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              This will remove the current draft from this device and reset the form. Your last
              used invoice number will not be reset.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                onClick={() => setIsClearEverythingModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800"
                onClick={confirmClearEverything}
                ref={confirmClearEverythingButtonRef}
                type="button"
              >
                Clear everything
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDownloadModalOpen ? (
        <div
          aria-labelledby="download-invoice-pdf-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 px-4 py-6 backdrop-blur-sm"
          onClick={() => {
            if (!isGeneratingPdf) {
              setIsDownloadModalOpen(false);
            }
          }}
          role="dialog"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-6"
            onKeyDown={(event) => trapModalFocus(event, downloadDialogRef.current)}
            onClick={(event) => event.stopPropagation()}
            ref={downloadDialogRef}
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">Invoice PDF</p>
            <h2
              className="mt-2 text-xl font-semibold tracking-tight text-stone-950"
              id="download-invoice-pdf-title"
            >
              Download invoice PDF?
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Your invoice will be generated as a PDF file using the details in the preview.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isGeneratingPdf}
                onClick={() => setIsDownloadModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-80"
                disabled={isGeneratingPdf || !hasValidInvoice}
                onClick={downloadInvoicePdf}
                ref={confirmDownloadButtonRef}
                type="button"
              >
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
