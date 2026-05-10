"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { LogoUploader } from "@/components/invoice/LogoUploader";
import { PaymentDetailsFields } from "@/components/invoice/PaymentDetailsFields";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { isCurrencyCode } from "@/lib/currency";
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
import { buildInvoicePdfFileName } from "@/lib/invoice/invoice-pdf";
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
type TaxMode = "none" | "sst-6" | "sst-8" | "custom";
type DiscountMode = "none" | "percentage" | "fixed";

const mistakes = [
  "Forgetting invoice number",
  "Using unclear item descriptions",
  "Missing customer details",
  "Forgetting payment details",
  "Forgetting terms or due date",
  "Applying tax before discount instead of after discount",
  "Using a payment QR image that is blurry or hard to scan",
  "Confusing an invoice with a receipt",
  "Assuming this simple PDF is an official validated Malaysia e-Invoice"
];

const featureHighlights = [
  "Add business and customer details",
  "Upload a business logo",
  "Add line items, quantities, and unit prices",
  "Choose no tax, SST 6%, SST 8%, or a custom tax rate",
  "Add a percentage or fixed discount",
  "Add bank details, DuitNow ID, payment link, and payment notes",
  "Upload your own payment QR image",
  "Add terms and conditions",
  "Preview the invoice before downloading",
  "Download a PDF invoice",
  "Save the current draft on this device"
];

const fieldNotes = [
  ["Invoice number", "A unique reference that helps both sides identify the invoice."],
  ["Invoice date", "The date the invoice is issued."],
  ["Due date", "The optional date payment is expected."],
  ["Business details", "Your business name, contact, and address."],
  ["Customer details", "The customer name, contact, and address shown in the Bill To section."],
  ["Logo", "An optional PNG or JPG business logo shown in the preview and PDF."],
  ["Line items", "The goods or services being billed."],
  ["Quantity", "How many units, hours, or items are being charged."],
  ["Unit price", "The price for one unit or one hour."],
  ["Subtotal", "The total of all line items before discount and SST / tax."],
  ["Discount", "An optional percentage or fixed amount applied before SST / tax."],
  ["SST / Tax", "Optional basic tax math using no tax, SST 6%, SST 8%, or a custom rate."],
  [
    "Payment details",
    "Optional bank details, account name, account number, DuitNow ID, payment link, and payment notes."
  ],
  ["Payment QR image", "An optional uploaded payment QR image with a Scan here to pay caption."],
  ["Terms & Conditions", "Optional payment or invoice terms shown near the bottom of the invoice."],
  ["Notes", "Optional extra information for the customer when included."],
  ["Total", "The final amount after discount and SST / tax."]
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

function getLogoImageType(dataUrl: string): "PNG" | "JPEG" | null {
  if (dataUrl.startsWith("data:image/png")) {
    return "PNG";
  }

  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) {
    return "JPEG";
  }

  return null;
}

function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height
      });
    };
    image.onerror = () => reject(new Error("Logo could not be loaded."));
    image.src = dataUrl;
  });
}

function fitWithinBox(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return {
    width: Math.max(1, width * scale),
    height: Math.max(1, height * scale)
  };
}

export function InvoiceGenerator() {
  const today = new Date().toISOString().slice(0, 10);
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
  const [invoiceDate, setInvoiceDate] = useState(today);
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
  const confirmDownloadButtonRef = useRef<HTMLButtonElement>(null);
  const confirmClearEverythingButtonRef = useRef<HTMLButtonElement>(null);
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
    const lineItemError = validationErrors.find((error) => error.field.startsWith("items"));
    return lineItemError?.message ?? "";
  }, [validationErrors]);

  const hasValidInvoice = validationErrors.length === 0;
  const lineItemsMessage = lineItemRequiredMessage;

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
      setInvoiceDate(invoice.invoiceDate || today);
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
    [setCurrency, today]
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
      saveInvoiceDraft(invoiceData);
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
        invoiceDate: today,
        invoiceNumber: nextInvoiceNumber ?? DEFAULT_INVOICE_NUMBER,
        lineItemId: createLineItem(1).id
      })
    );
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
        invoiceDate: today,
        invoiceNumber: nextInvoiceNumber ?? DEFAULT_INVOICE_NUMBER,
        lineItemId: createLineItem(1).id
      })
    );
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
    if (typeof window === "undefined" || !hasValidInvoice) {
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageMargin = 48;
      const contentX = pageMargin;
      const contentWidth = pageWidth - pageMargin * 2;
      const contentRight = contentX + contentWidth;
      const contentBottom = pageHeight - pageMargin;
      const maxFlowHeight = contentBottom - pageMargin;
      const stone950: [number, number, number] = [28, 25, 23];
      const stone600: [number, number, number] = [87, 83, 78];
      const stone500: [number, number, number] = [120, 113, 108];
      const stone200: [number, number, number] = [231, 229, 228];
      const stone100: [number, number, number] = [245, 245, 244];
      const slate700: [number, number, number] = [51, 65, 85];
      const slate50: [number, number, number] = [248, 250, 252];
      const white: [number, number, number] = [255, 255, 255];
      let y = pageMargin;

      const applyFill = (color: [number, number, number]) => {
        doc.setFillColor(color[0], color[1], color[2]);
      };

      const applyStroke = (color: [number, number, number]) => {
        doc.setDrawColor(color[0], color[1], color[2]);
      };

      const applyText = (color: [number, number, number]) => {
        doc.setTextColor(color[0], color[1], color[2]);
      };

      const drawInvoicePage = () => {
        applyFill(white);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      };

      const addPageIfNeeded = (neededHeight: number) => {
        if (y + neededHeight <= contentBottom) {
          return;
        }

        doc.addPage();
        drawInvoicePage();
        y = pageMargin;
      };

      const lineHeightFor = (fontSize: number) => fontSize + 4;

      const textLines = (text: string, maxWidth: number) =>
        text
          .split(/\r?\n/)
          .flatMap((line) =>
            line.trim() === "" ? [""] : (doc.splitTextToSize(line, maxWidth) as string[])
          );

      const measureTextBlock = (text: string, maxWidth: number, fontSize = 10) =>
        Math.max(textLines(text, maxWidth).length, 1) * lineHeightFor(fontSize);

      const writeTextAt = (
        text: string,
        x: number,
        top: number,
        options: {
          align?: "left" | "right";
          bold?: boolean;
          color?: [number, number, number];
          fontSize?: number;
          maxWidth?: number;
        } = {}
      ) => {
        const fontSize = options.fontSize ?? 10;
        const lines = textLines(text, options.maxWidth ?? contentWidth);

        doc.setFont("helvetica", options.bold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        applyText(options.color ?? stone950);
        doc.text(lines, x, top, { align: options.align ?? "left" });
        return lines.length * lineHeightFor(fontSize);
      };

      const writeText = (
        text: string,
        x: number,
        options: {
          bold?: boolean;
          color?: [number, number, number];
          fontSize?: number;
          lineGap?: number;
          maxWidth?: number;
        } = {}
      ) => {
        const fontSize = options.fontSize ?? 10;
        const lineGap = options.lineGap ?? fontSize + 4;
        const lines = textLines(text, options.maxWidth ?? contentWidth);

        addPageIfNeeded(lines.length * lineGap);
        doc.setFont("helvetica", options.bold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        applyText(options.color ?? stone950);
        doc.text(lines, x, y);
        y += lines.length * lineGap;
      };

      const drawDivider = (top = y) => {
        applyStroke(stone200);
        doc.line(contentX, top, contentRight, top);
      };

      const drawPageNumber = () => {
        const pageCount = doc.getNumberOfPages();

        for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
          doc.setPage(pageIndex);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          applyText(stone500);
          doc.text(`Page ${pageIndex} of ${pageCount}`, contentRight, pageHeight - 24, {
            align: "right"
          });
        }
      };

      doc.setProperties({
        title: `Invoice ${invoiceNumber || "Preview"}`,
        subject: "Invoice",
        creator: "AccountingToolsLab"
      });

      drawInvoicePage();

      const columnGap = 36;
      const rightColumnWidth = Math.min(230, contentWidth * 0.44);
      const leftColumnWidth = contentWidth - rightColumnWidth - columnGap;
      const rightColumnX = contentRight - rightColumnWidth;
      const headerTop = y;
      const writeHeaderTextBlock = (
        text: string,
        x: number,
        top: number,
        options: Parameters<typeof writeTextAt>[3] = {}
      ) => {
        const fontSize = options.fontSize ?? 10;

        return writeTextAt(text, x, top + fontSize, options);
      };

      let leftY = headerTop;
      leftY += writeHeaderTextBlock(businessName || "Business name", contentX, leftY, {
        bold: true,
        fontSize: 18,
        maxWidth: leftColumnWidth
      });
      if (businessContact) {
        leftY += 8;
        leftY += writeHeaderTextBlock(businessContact, contentX, leftY, {
          color: stone600,
          maxWidth: leftColumnWidth
        });
      }
      if (businessAddress) {
        leftY += 4;
        leftY += writeHeaderTextBlock(businessAddress, contentX, leftY, {
          color: stone600,
          maxWidth: leftColumnWidth
        });
      }

      let rightY = headerTop;
      if (businessLogoDataUrl) {
        try {
          const logoType = getLogoImageType(businessLogoDataUrl);

          if (logoType) {
            const logoSize = await loadImageDimensions(businessLogoDataUrl);
            const fittedLogo = fitWithinBox(logoSize.width, logoSize.height, 128, 58);
            doc.addImage(
              businessLogoDataUrl,
              logoType,
              contentRight - fittedLogo.width,
              rightY,
              fittedLogo.width,
              fittedLogo.height
            );
            rightY += fittedLogo.height + 24;
          }
        } catch {
          rightY = headerTop;
        }
      }

      rightY += writeHeaderTextBlock("INVOICE", contentRight, rightY, {
        align: "right",
        bold: true,
        color: slate700,
        fontSize: 30,
        maxWidth: rightColumnWidth
      });
      rightY += 16;

      const writeInvoiceMetaRow = (label: string, value: string, top: number) => {
        const labelWidth = 70;
        const labelX = rightColumnX + labelWidth;
        const valueWidth = Math.max(110, rightColumnWidth - labelWidth - 12);
        const fontSize = 10;
        const textBaseline = top + fontSize;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        const valueLines =
          doc.getTextWidth(value) <= valueWidth ? [value] : textLines(value, valueWidth);
        const rowHeight = Math.max(valueLines.length * lineHeightFor(fontSize), lineHeightFor(fontSize));

        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);
        applyText(stone600);
        doc.text(label, labelX, textBaseline, { align: "right" });
        doc.setFont("helvetica", "normal");
        applyText(stone950);
        doc.text(valueLines, contentRight, textBaseline, { align: "right" });

        return rowHeight;
      };

      rightY += writeInvoiceMetaRow("Invoice #:", invoiceNumber || "Invoice number", rightY);
      rightY += 8;
      rightY += writeInvoiceMetaRow("Date:", invoiceDate || "Invoice date", rightY);
      if (dueDate) {
        rightY += 8;
        rightY += writeInvoiceMetaRow("Due:", dueDate, rightY);
      }

      y = Math.max(leftY, rightY) + 30;
      drawDivider();
      y += 30;

      const billToHeight =
        12 +
        6 +
        measureTextBlock(customerName || "Customer name", leftColumnWidth, 13) +
        (customerContact ? 4 + measureTextBlock(customerContact, leftColumnWidth) : 0) +
        (customerAddress ? 2 + measureTextBlock(customerAddress, leftColumnWidth) : 0);

      addPageIfNeeded(billToHeight + 28);
      writeText("BILL TO", contentX, {
        bold: true,
        color: slate700,
        fontSize: 9,
        lineGap: 12,
        maxWidth: leftColumnWidth
      });
      y += 6;
      writeText(customerName || "Customer name", contentX, {
        bold: true,
        fontSize: 15,
        lineGap: 19,
        maxWidth: leftColumnWidth
      });
      if (customerContact) {
        y += 4;
        writeText(customerContact, contentX, { color: stone600, maxWidth: leftColumnWidth });
      }
      if (customerAddress) {
        y += 2;
        writeText(customerAddress, contentX, { color: stone600, maxWidth: leftColumnWidth });
      }
      y += 34;

      const tableX = contentX;
      const tableWidth = contentWidth;
      const noWidth = 44;
      const qtyWidth = 62;
      const unitWidth = 96;
      const amountWidth = 104;
      const descriptionWidth = tableWidth - noWidth - qtyWidth - unitWidth - amountWidth;
      const descriptionX = tableX + noWidth;
      const unitRight = tableX + noWidth + descriptionWidth + unitWidth - 14;
      const qtyRight = tableX + noWidth + descriptionWidth + unitWidth + qtyWidth - 14;
      const totalRight = tableX + tableWidth - 16;
      const headerHeight = 34;

      const drawTableHeader = () => {
        addPageIfNeeded(headerHeight + 22);
        applyFill(slate700);
        applyStroke(slate700);
        doc.roundedRect(tableX, y, tableWidth, headerHeight, 8, 8, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        applyText(white);
        doc.text("NO", tableX + 14, y + 21);
        doc.text("DESCRIPTION", descriptionX + 10, y + 21);
        doc.text("UNIT PRICE", unitRight, y + 21, { align: "right" });
        doc.text("QTY", qtyRight, y + 21, { align: "right" });
        doc.text("AMOUNT", totalRight, y + 21, { align: "right" });
        y += headerHeight;
      };

      drawTableHeader();

      previewItems.forEach((item, index) => {
        const descriptionLines = textLines(item.description, descriptionWidth - 26);
        const maxLinesPerRow = Math.max(1, Math.floor((maxFlowHeight - headerHeight - 34) / 14));
        let remainingLines = descriptionLines.length > 0 ? descriptionLines : ["Item"];
        let chunkIndex = 0;

        while (remainingLines.length > 0) {
          const chunkLines = remainingLines.slice(0, maxLinesPerRow);
          remainingLines = remainingLines.slice(maxLinesPerRow);
          const rowHeight = Math.max(chunkLines.length * 14 + 22, 44);

          if (y + rowHeight > contentBottom) {
            doc.addPage();
            drawInvoicePage();
            y = pageMargin;
            drawTableHeader();
          }

          applyFill(index % 2 === 0 ? white : slate50);
          applyStroke(stone200);
          doc.rect(tableX, y, tableWidth, rowHeight, "S");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          applyText(stone600);
          doc.text(chunkIndex === 0 ? String(index + 1) : "", tableX + 14, y + 22);
          applyText(stone950);
          doc.text(chunkLines, descriptionX + 10, y + 22);
          applyText(stone600);
          doc.text(chunkIndex === 0 ? formatCurrency(item.unitPrice) : "", unitRight, y + 22, {
            align: "right"
          });
          doc.text(chunkIndex === 0 ? formatAmount(item.quantity) : "", qtyRight, y + 22, {
            align: "right"
          });
          doc.setFont("helvetica", "bold");
          applyText(stone950);
          doc.text(chunkIndex === 0 ? formatCurrency(item.lineTotal) : "", totalRight, y + 22, {
            align: "right"
          });
          y += rowHeight;
          chunkIndex += 1;
        }

        if (index === previewItems.length - 1) {
          y += 24;
        }
      });

      const totalsWidth = 220;
      const totalsX = contentRight - totalsWidth;
      const totalsRows: Array<[string, string]> = [["Subtotal", formatCurrency(subtotal)]];
      if (hasDiscount) {
        totalsRows.push(["Discount", `-${formatCurrency(discountAmount)}`]);
        totalsRows.push(["Amount after discount", formatCurrency(taxableAmount)]);
      }
      if (hasTax) {
        totalsRows.push([taxLabel, formatCurrency(taxAmount)]);
      }
      const totalsRowHeight = 24;
      const totalsHeight = totalsRows.length * totalsRowHeight + 58;
      addPageIfNeeded(totalsHeight + 24);
      applyFill(stone100);
      applyStroke(stone200);
      doc.roundedRect(totalsX, y, totalsWidth, totalsHeight, 10, 10, "FD");
      let totalsRowY = y + 24;
      totalsRows.forEach(([label, value]) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        applyText(stone600);
        doc.text(label, totalsX + 16, totalsRowY);
        doc.setFont("helvetica", "bold");
        applyText(stone950);
        doc.text(value, totalsX + totalsWidth - 16, totalsRowY, {
          align: "right"
        });
        totalsRowY += totalsRowHeight;
      });
      const totalRowY = totalsRowY + 16;
      applyStroke(stone200);
      doc.line(totalsX + 16, totalRowY - 20, totalsX + totalsWidth - 16, totalRowY - 20);
      doc.setFontSize(12);
      doc.text("Total", totalsX + 16, totalRowY);
      doc.text(formatCurrency(total), totalsX + totalsWidth - 16, totalRowY, { align: "right" });
      y += totalsHeight + 24;

      const renderFlowTextSection = (title: string, text: string) => {
        const trimmedText = text.trim();

        if (!trimmedText) {
          return;
        }

        addPageIfNeeded(46);
        drawDivider();
        y += 20;
        writeTextAt(title, contentX, y, {
          bold: true,
          color: stone950,
          fontSize: 11,
          maxWidth: contentWidth
        });
        y += 24;

        const lines = textLines(trimmedText, contentWidth);
        const lineHeight = lineHeightFor(10);
        let lineIndex = 0;

        while (lineIndex < lines.length) {
          const availableLines = Math.max(1, Math.floor((contentBottom - y) / lineHeight));

          if (availableLines <= 1 && y + lineHeight > contentBottom) {
            doc.addPage();
            drawInvoicePage();
            y = pageMargin;
            continue;
          }

          const chunk = lines.slice(lineIndex, lineIndex + availableLines);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          applyText(stone600);
          doc.text(chunk, contentX, y);
          y += chunk.length * lineHeight;
          lineIndex += chunk.length;

          if (lineIndex < lines.length) {
            doc.addPage();
            drawInvoicePage();
            y = pageMargin;
          }
        }

        y += 18;
      };

      const renderPaymentQrAt = async (x: number, top: number, maxSize: number) => {
        if (!payment.paymentQrDataUrl) {
          return 0;
        }

        try {
          const qrType = getLogoImageType(payment.paymentQrDataUrl);

          if (!qrType) {
            return 0;
          }

          const qrSize = await loadImageDimensions(payment.paymentQrDataUrl);
          const fittedQr = fitWithinBox(qrSize.width, qrSize.height, maxSize, maxSize);
          doc.addImage(payment.paymentQrDataUrl, qrType, x, top, fittedQr.width, fittedQr.height);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          applyText(stone500);
          doc.text("Scan here to pay", x + fittedQr.width / 2, top + fittedQr.height + 13, {
            align: "center"
          });

          return fittedQr.height + 22;
        } catch {
          return 0;
        }
      };

      const renderPaymentDetailsFlow = async () => {
        if (!hasPaymentDetails) {
          return;
        }

        addPageIfNeeded(46);
        drawDivider();
        y += 20;
        writeTextAt("Payment Details", contentX, y, {
          bold: true,
          color: stone950,
          fontSize: 11,
          maxWidth: contentWidth
        });
        y += 24;

        const paymentLabelWidth = 96;
        const paymentValueX = contentX + paymentLabelWidth + 12;
        const paymentValueWidth = contentWidth - paymentLabelWidth - 12;
        const lineHeight = lineHeightFor(10);

        paymentDetailRows.forEach(([label, value]) => {
          const valueLines = textLines(value, paymentValueWidth);
          let lineIndex = 0;
          let isFirstChunk = true;

          while (lineIndex < valueLines.length) {
            const availableLines = Math.max(1, Math.floor((contentBottom - y) / lineHeight));

            if (availableLines <= 1 && y + lineHeight > contentBottom) {
              doc.addPage();
              drawInvoicePage();
              y = pageMargin;
              continue;
            }

            const chunk = valueLines.slice(lineIndex, lineIndex + availableLines);

            if (isFirstChunk) {
              writeTextAt(`${label}:`, contentX, y, {
                bold: true,
                color: stone600,
                maxWidth: paymentLabelWidth
              });
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            applyText(stone600);
            doc.text(chunk, paymentValueX, y);
            y += chunk.length * lineHeight;
            lineIndex += chunk.length;
            isFirstChunk = false;

            if (lineIndex < valueLines.length) {
              doc.addPage();
              drawInvoicePage();
              y = pageMargin;
            }
          }

          y += 6;
        });

        if (payment.paymentQrDataUrl) {
          addPageIfNeeded(124);
          y += 4;
          y += await renderPaymentQrAt(contentX, y, 96);
        }

        y += 12;
      };

      const hasTerms = terms.trim() !== "";
      const hasNotes = notes.trim() !== "";

      if (hasPaymentDetails || hasTerms) {
        const bottomColumnGap = 32;
        const bottomColumnWidth =
          hasPaymentDetails && hasTerms
            ? (contentWidth - bottomColumnGap) / 2
            : contentWidth;
        const rightBottomColumnX = contentX + bottomColumnWidth + bottomColumnGap;
        const measurePaymentRowsHeight = (width: number) =>
          paymentDetailRows.reduce(
            (height, [label, value]) => {
              const labelWidth = Math.min(92, width * 0.38);
              const valueWidth = width - labelWidth - 8;
              return height + Math.max(measureTextBlock(value, valueWidth), 14) + 6;
            },
            0
          );
        const paymentQrHeight = hasPaymentQr ? Math.min(96, bottomColumnWidth) + 26 : 0;
        const paymentDetailsHeight = hasPaymentDetails
          ? measurePaymentRowsHeight(bottomColumnWidth) + paymentQrHeight + 44
          : 0;
        const termsHeight = hasTerms
          ? measureTextBlock(terms, bottomColumnWidth) + 44
          : 0;
        const bottomSectionHeight = Math.max(paymentDetailsHeight, termsHeight);

        if (bottomSectionHeight <= maxFlowHeight - 8) {
          addPageIfNeeded(bottomSectionHeight + 8);
          applyStroke(stone200);
          doc.line(contentX, y, contentRight, y);
          const bottomStartY = y + 20;

          if (hasPaymentDetails) {
            writeTextAt("Payment Details", contentX, bottomStartY, {
              bold: true,
              color: stone950,
              fontSize: 11,
              maxWidth: bottomColumnWidth
            });
            let paymentY = bottomStartY + 24;
            const paymentLabelWidth = Math.min(92, bottomColumnWidth * 0.38);
            const paymentValueX = contentX + paymentLabelWidth + 8;
            const paymentValueWidth = bottomColumnWidth - paymentLabelWidth - 8;
            paymentDetailRows.forEach(([label, value]) => {
              writeTextAt(`${label}:`, contentX, paymentY, {
                bold: true,
                color: stone600,
                maxWidth: paymentLabelWidth
              });
              paymentY += writeTextAt(value, paymentValueX, paymentY, {
                color: stone600,
                maxWidth: paymentValueWidth
              });
              paymentY += 6;
            });
            if (payment.paymentQrDataUrl) {
              paymentY += 4;
              paymentY += await renderPaymentQrAt(contentX, paymentY, Math.min(96, bottomColumnWidth));
            }
          }

          if (hasTerms) {
            const termsX = hasPaymentDetails ? rightBottomColumnX : contentX;
            writeTextAt("Terms & Conditions", termsX, bottomStartY, {
              bold: true,
              color: stone950,
              fontSize: 11,
              maxWidth: bottomColumnWidth
            });
            writeTextAt(terms, termsX, bottomStartY + 24, {
              color: stone600,
              maxWidth: bottomColumnWidth
            });
          }

          y = bottomStartY + bottomSectionHeight + 12;
        } else {
          await renderPaymentDetailsFlow();
          renderFlowTextSection("Terms & Conditions", terms);
        }
      }

      if (hasNotes) {
        renderFlowTextSection("Notes", notes);
      }

      drawPageNumber();
      doc.save(buildInvoicePdfFileName(invoiceNumber, customerName, invoiceDate));
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
  const discountError =
    validationErrors.find((error) => error.field === "discount.value")?.message ?? "";
  const paymentLinkError =
    validationErrors.find((error) => error.field === "payment.paymentLink")?.message ?? "";
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
        <div className="max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Free Invoice Generator Malaysia
          </h1>
          <p className="mt-3 max-w-4xl text-base leading-7 text-stone-600">
            Create a simple invoice with business details, customer details, line items,
            optional SST / tax, discounts, payment details, QR image, terms, notes, and PDF
            download.
          </p>
        </div>

        <div className="mt-8 inline-grid rounded-xl border border-stone-200 bg-stone-50 p-1 sm:grid-cols-2">
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
            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">Business details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Business name</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Your business name"
                    value={businessName}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">
                    Business email or phone
                  </span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setBusinessContact(event.target.value)}
                    placeholder="hello@example.com"
                    value={businessContact}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Business address</span>
                  <textarea
                    className="min-h-20 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setBusinessAddress(event.target.value)}
                    placeholder="Business address"
                    value={businessAddress}
                  />
                </label>
                <LogoUploader
                  logoDataUrl={businessLogoDataUrl}
                  onChange={setBusinessLogoDataUrl}
                />
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">Customer details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Customer name</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer name"
                    value={customerName}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">
                    Customer email or phone
                  </span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setCustomerContact(event.target.value)}
                    placeholder="customer@example.com"
                    value={customerContact}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Customer address</span>
                  <textarea
                    className="min-h-20 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    placeholder="Customer address"
                    value={customerAddress}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">Invoice details</h2>
              <div className="grid min-w-0 gap-4 md:grid-cols-3">
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-semibold text-stone-800">Invoice number</span>
                  <input
                    className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setInvoiceNumber(event.target.value)}
                    value={invoiceNumber}
                  />
                </label>
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-semibold text-stone-800">Invoice date</span>
                  <input
                    className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setInvoiceDate(event.target.value)}
                    type="date"
                    value={invoiceDate}
                  />
                </label>
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-semibold text-stone-800">Due date</span>
                  <input
                    className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setDueDate(event.target.value)}
                    type="date"
                    value={dueDate}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">SST / Tax</h2>
              <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {taxOptions.map((option) => (
                    <label
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        taxMode === option.mode
                          ? "border-slate-300 bg-white text-stone-950 shadow-sm"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                      }`}
                      key={option.mode}
                    >
                      <input
                        checked={taxMode === option.mode}
                        className="h-4 w-4 accent-slate-700"
                        onChange={() => setTaxMode(option.mode)}
                        type="radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {taxMode === "custom" ? (
                  <label className="grid max-w-xs gap-2">
                    <span className="text-sm font-semibold text-stone-800">Tax rate (%)</span>
                    <input
                      className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                      inputMode="decimal"
                      max="100"
                      min="0"
                      onChange={(event) => setCustomTaxRate(event.target.value)}
                      placeholder="Example: 6"
                      type="number"
                      value={customTaxRate}
                    />
                  </label>
                ) : null}
              </div>
            </section>

            <section className="grid gap-4">
              <div>
                <h2 className="text-base font-semibold text-stone-950">Discount</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Discount is applied before SST / tax.
                </p>
              </div>
              <div className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {discountOptions.map((option) => (
                    <label
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        discountMode === option.mode
                          ? "border-slate-300 bg-white text-stone-950 shadow-sm"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                      }`}
                      key={option.mode}
                    >
                      <input
                        checked={discountMode === option.mode}
                        className="h-4 w-4 accent-slate-700"
                        onChange={() => selectDiscount(option.mode)}
                        type="radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {discount.enabled ? (
                  <label className="grid max-w-xs gap-2">
                    <span className="text-sm font-semibold text-stone-800">
                      {discount.type === "percentage"
                        ? "Discount percentage"
                        : `Discount amount (${currency})`}
                    </span>
                    <div className="relative">
                      <input
                        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 ${
                          discount.type === "percentage" ? "pr-10" : ""
                        } ${
                          discountError
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-stone-200"
                        }`}
                        inputMode="decimal"
                        max={discount.type === "percentage" ? "100" : undefined}
                        min="0"
                        onChange={(event) => updateDiscountValue(event.target.value)}
                        placeholder={discount.type === "percentage" ? "10" : "50.00"}
                        type="number"
                        value={discount.value}
                      />
                      {discount.type === "percentage" ? (
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-stone-500">
                          %
                        </span>
                      ) : null}
                    </div>
                  </label>
                ) : null}
                {discountError ? (
                  <p className="text-sm font-medium text-red-700">{discountError}</p>
                ) : null}
              </div>
            </section>

            <section className="grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-stone-950">Line items</h2>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={addLineItem}
                  type="button"
                >
                  Add item
                </button>
              </div>

              <div className="grid gap-4">
                {lineItems.map((item, index) => (
                  <div
                    className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                    key={item.id}
                  >
                    <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_7.5rem_8.5rem_8.5rem_auto]">
                      <label className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">
                          Description
                        </span>
                        <input
                          className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          onChange={(event) =>
                            updateLineItem(item.id, "description", event.target.value)
                          }
                          placeholder={`Item ${index + 1}`}
                          value={item.description}
                        />
                      </label>
                      <label className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">Quantity</span>
                        <input
                          className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateLineItem(item.id, "quantity", event.target.value)
                          }
                          placeholder="1"
                          type="number"
                          value={item.quantity}
                        />
                      </label>
                      <label className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">
                          Unit price ({currency})
                        </span>
                        <input
                          className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateLineItem(item.id, "unitPrice", event.target.value)
                          }
                          placeholder="0.00"
                          type="number"
                          value={item.unitPrice}
                        />
                      </label>
                      <div className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">Line total</span>
                        <div className="flex h-12 w-full min-w-0 items-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-950">
                          {formatCurrency(lineItemPreviewTotals[index] ?? 0)}
                        </div>
                      </div>
                      <div className="flex min-w-0 items-end">
                        <button
                          className="h-12 w-full rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 xl:w-auto"
                          disabled={lineItems.length === 1}
                          onClick={() => removeLineItem(item.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {lineItemsMessage ? (
                <p className="text-sm font-medium text-red-700">{lineItemsMessage}</p>
              ) : null}
            </section>

            <PaymentDetailsFields
              onChange={updatePayment}
              payment={payment}
              paymentLinkError={paymentLinkError}
            />

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
              className="invoice-print-area min-w-0 rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
              id="invoice-print-area"
            >
              <div className="invoice-print-header grid gap-8 border-b border-stone-200 pb-8 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,0.85fr)]">
                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-semibold tracking-tight text-stone-950">
                    {businessName || "Business name"}
                  </h2>
                  {businessContact ? (
                    <p className="invoice-print-muted mt-3 break-words text-sm leading-6 text-stone-600">
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
                      className="mb-6 ml-0 max-h-20 max-w-44 object-contain sm:ml-auto"
                      height={80}
                      unoptimized
                      src={businessLogoDataUrl}
                      width={180}
                    />
                  ) : null}
                  <p className="text-4xl font-semibold uppercase tracking-wide text-slate-700">
                    Invoice
                  </p>
                  <dl className="mt-5 grid gap-2 text-sm text-stone-600">
                    <div className="flex justify-between gap-4 sm:justify-end">
                      <dt className="font-medium text-stone-500">Invoice #:</dt>
                      <dd className="font-semibold text-stone-950">
                        {invoiceNumber || "Invoice number"}
                      </dd>
                    </div>
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
              </div>

              <div className="grid max-w-xl gap-2 py-8">
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

              <div className="invoice-preview-lines overflow-hidden rounded-xl border border-stone-200">
                <div className="invoice-preview-line invoice-preview-heading hidden bg-slate-700 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-white sm:grid sm:grid-cols-[3rem_minmax(0,1.6fr)_6.5rem_4.5rem_7rem] sm:gap-3 sm:px-4">
                  <span>No</span>
                  <span>Description</span>
                  <span className="text-right leading-4">Unit Price</span>
                  <span className="text-right">Quantity</span>
                  <span className="text-right leading-4">Amount</span>
                </div>
                <div className="divide-y divide-stone-100 bg-white">
                  {previewItems.map((item, index) => (
                    <div
                      className="invoice-preview-line grid min-w-0 gap-3 px-3 py-4 text-sm odd:bg-white even:bg-slate-50 sm:grid-cols-[3rem_minmax(0,1.6fr)_6.5rem_4.5rem_7rem] sm:gap-3 sm:px-4"
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

              <div className="invoice-totals-wrap mt-6 flex justify-end">
                <div className="invoice-totals-box w-full max-w-sm rounded-xl border border-stone-200 bg-stone-50 p-5">
                  <div className="invoice-total-row flex justify-between gap-4 text-sm text-stone-600">
                    <span className="invoice-total-label">Subtotal</span>
                    <span className="invoice-total-amount font-semibold text-stone-950">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {hasDiscount ? (
                    <>
                      <div className="invoice-total-row mt-3 flex justify-between gap-4 text-sm text-stone-600">
                        <span className="invoice-total-label">Discount</span>
                        <span className="invoice-total-amount font-semibold text-stone-950">
                          -{formatCurrency(discountAmount)}
                        </span>
                      </div>
                      <div className="invoice-total-row mt-3 flex justify-between gap-4 text-sm text-stone-600">
                        <span className="invoice-total-label">Amount after discount</span>
                        <span className="invoice-total-amount font-semibold text-stone-950">
                          {formatCurrency(taxableAmount)}
                        </span>
                      </div>
                    </>
                  ) : null}
                  {hasTax ? (
                    <div className="invoice-total-row mt-3 flex justify-between gap-4 text-sm text-stone-600">
                      <span className="invoice-total-label">{taxLabel}</span>
                      <span className="invoice-total-amount font-semibold text-stone-950">
                        {formatCurrency(taxAmount)}
                      </span>
                    </div>
                  ) : null}
                  <div className="invoice-total-row invoice-grand-total mt-4 flex justify-between gap-4 border-t border-stone-300 pt-4 text-lg font-semibold text-stone-950">
                    <span className="invoice-total-label">Total</span>
                    <span className="invoice-total-amount">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {hasPaymentDetails || terms.trim() ? (
                <section className="mt-8 border-t border-stone-200 pt-5">
                  <div
                    className={`grid gap-8 ${
                      hasPaymentDetails && terms.trim() ? "md:grid-cols-2" : ""
                    }`}
                  >
                    {hasPaymentDetails ? (
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-stone-950">
                          Payment Details
                        </h3>
                        {paymentDetailRows.length > 0 ? (
                          <dl className="mt-4 grid gap-2 text-sm leading-6 text-stone-600">
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
                          <div className="mt-5 inline-grid justify-items-center gap-2 text-center">
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
                        <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-stone-600">
                          {terms}
                        </p>
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

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What an invoice is
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              An invoice is a document sent to a customer to request payment for goods or
              services.
            </p>
            <p>
              A simple invoice usually includes seller details, customer details, invoice
              number, invoice date, optional due date, line items, subtotal, discount, SST / tax
              if applicable, payment instructions, terms, and total amount due.
            </p>
            <p>
              This tool helps create a simple downloadable PDF invoice. It does not replace
              accounting, tax, or legal advice.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Features</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What this invoice generator can do
          </h2>
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
      </section>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Invoice fields</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          What each field means
        </h2>
        <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
          {fieldNotes.map(([label, text]) => (
            <div className="border-t border-stone-100 py-3" key={label}>
              <h3 className="text-sm font-semibold text-stone-950">{label}</h3>
              <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Malaysia note</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Simple PDF invoice, not official MyInvois submission
        </h2>
        <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            This tool creates a simple invoice PDF for everyday business use. It does not submit
            invoices to LHDN, validate an official Malaysia e-Invoice, or connect to MyInvois.
          </p>
          <p>
            For official Malaysia e-Invoice requirements, refer to LHDN/MyInvois guidance or a
            qualified tax professional.
          </p>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Mistakes to avoid
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mistakes.map((mistake) => (
            <div
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
              key={mistake}
            >
              {mistake}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Connect invoices with SST, cash, and business checks
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use SST, cash flow, break-even, and ratio tools to review the numbers around an
              invoice before and after it is issued.
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
            onClick={(event) => event.stopPropagation()}
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
            onClick={(event) => event.stopPropagation()}
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
