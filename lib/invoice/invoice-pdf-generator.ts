import type {
  InvoiceCalculationResult,
  InvoiceLineCalculationResult
} from "./invoice-calculations";
import { buildInvoicePdfFileName } from "./invoice-pdf";
import type { InvoiceData, InvoicePaymentDetails } from "./invoice-types";

type PdfColor = [number, number, number];

export type InvoicePdfParams = {
  businessAddress: string;
  businessContact: string;
  businessLogoDataUrl?: string;
  businessName: string;
  calculation: InvoiceCalculationResult;
  customerAddress: string;
  customerContact: string;
  customerName: string;
  dueDate: string;
  formatCurrency: (value: number) => string;
  invoiceData: InvoiceData;
  invoiceDate: string;
  invoiceNumber: string;
  notes: string;
  payment: InvoicePaymentDetails;
  previewItems: InvoiceLineCalculationResult[];
  terms: string;
};

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
    image.onerror = () => reject(new Error("Image could not be loaded."));
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

export async function generateInvoicePdf(params: InvoicePdfParams): Promise<void> {
  const {
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
  } = params;

  if (typeof window === "undefined") {
    return;
  }

  const subtotal = calculation.subtotal;
  const discountAmount = calculation.discountAmount;
  const taxableAmount = calculation.taxableAmount;
  const hasDiscount = discountAmount > 0;
  const taxRate = invoiceData.tax.enabled ? parseAmount(invoiceData.tax.rate) ?? 0 : 0;
  const taxAmount = calculation.taxAmount;
  const total = calculation.total;
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

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageMargin = 42;
  const pageBottomMargin = 28;
  const contentX = pageMargin;
  const contentWidth = pageWidth - pageMargin * 2;
  const contentRight = contentX + contentWidth;
  const contentBottom = pageHeight - pageBottomMargin;
  const maxFlowHeight = contentBottom - pageMargin;
  const stone950: PdfColor = [28, 25, 23];
  const stone600: PdfColor = [87, 83, 78];
  const stone500: PdfColor = [120, 113, 108];
  const stone200: PdfColor = [231, 229, 228];
  const stone100: PdfColor = [245, 245, 244];
  const slate700: PdfColor = [51, 65, 85];
  const slate50: PdfColor = [248, 250, 252];
  const white: PdfColor = [255, 255, 255];
  let y = pageMargin;

  const applyFill = (color: PdfColor) => {
    doc.setFillColor(color[0], color[1], color[2]);
  };

  const applyStroke = (color: PdfColor) => {
    doc.setDrawColor(color[0], color[1], color[2]);
  };

  const applyText = (color: PdfColor) => {
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

  const textLines = (text: string, maxWidth: number, fontSize = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);

    return text
      .split(/\r?\n/)
      .flatMap((line) =>
        line.trim() === "" ? [""] : (doc.splitTextToSize(line, maxWidth) as string[])
      );
  };

  const measureTextBlock = (text: string, maxWidth: number, fontSize = 10) =>
    Math.max(textLines(text, maxWidth, fontSize).length, 1) * lineHeightFor(fontSize);

  const writeTextAt = (
    text: string,
    x: number,
    top: number,
    options: {
      align?: "left" | "right";
      bold?: boolean;
      color?: PdfColor;
      fontSize?: number;
      maxWidth?: number;
    } = {}
  ) => {
    const fontSize = options.fontSize ?? 10;
    const lines = textLines(
      text,
      options.maxWidth ?? contentWidth,
      fontSize,
      options.bold ?? false
    );

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
      color?: PdfColor;
      fontSize?: number;
      lineGap?: number;
      maxWidth?: number;
    } = {}
  ) => {
    const fontSize = options.fontSize ?? 10;
    const lineGap = options.lineGap ?? fontSize + 4;
    const lines = textLines(
      text,
      options.maxWidth ?? contentWidth,
      fontSize,
      options.bold ?? false
    );

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
      doc.text(`Page ${pageIndex} of ${pageCount}`, contentRight, pageHeight - 16, {
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
        rightY += fittedLogo.height + 14;
      }
    } catch {
      rightY = headerTop;
    }
  }

  rightY += writeHeaderTextBlock("INVOICE", contentRight, rightY, {
    align: "right",
    bold: true,
    color: slate700,
    fontSize: 24,
    maxWidth: rightColumnWidth
  });
  rightY += 10;

  const writeInvoiceMetaRow = (label: string, value: string, top: number) => {
    const labelWidth = 70;
    const labelX = rightColumnX + labelWidth;
    const valueWidth = Math.max(110, rightColumnWidth - labelWidth - 12);
    const fontSize = 9;
    const textBaseline = top + fontSize;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    const valueLines =
      doc.getTextWidth(value) <= valueWidth ? [value] : textLines(value, valueWidth, fontSize);
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

  const billToHeight =
    12 +
    6 +
    measureTextBlock(customerName || "Customer name", leftColumnWidth, 13) +
    (customerContact ? 4 + measureTextBlock(customerContact, leftColumnWidth) : 0) +
    (customerAddress ? 2 + measureTextBlock(customerAddress, leftColumnWidth) : 0);
  const dateRowsHeight =
    lineHeightFor(9) + (dueDate ? 5 + lineHeightFor(9) : 0);

  y = Math.max(leftY, rightY) + 14;
  drawDivider();
  y += 16;
  addPageIfNeeded(Math.max(billToHeight, dateRowsHeight) + 24);
  const secondRowTop = y;
  let billToY = secondRowTop;
  writeTextAt("BILL TO", contentX, billToY, {
    bold: true,
    color: slate700,
    fontSize: 9,
    maxWidth: leftColumnWidth
  });
  billToY += 18;
  billToY += writeTextAt(customerName || "Customer name", contentX, billToY, {
    bold: true,
    fontSize: 15,
    maxWidth: leftColumnWidth
  });
  if (customerContact) {
    billToY += 4;
    billToY += writeTextAt(customerContact, contentX, billToY, {
      color: stone600,
      maxWidth: leftColumnWidth
    });
  }
  if (customerAddress) {
    billToY += 2;
    billToY += writeTextAt(customerAddress, contentX, billToY, {
      color: stone600,
      maxWidth: leftColumnWidth
    });
  }

  let dateY = secondRowTop;
  dateY += writeInvoiceMetaRow("Date:", invoiceDate || "Invoice date", dateY);
  if (dueDate) {
    dateY += 5;
    dateY += writeInvoiceMetaRow("Due:", dueDate, dateY);
  }

  y = Math.max(billToY, dateY) + 18;

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
  const headerHeight = 30;

  const drawTableHeader = () => {
    addPageIfNeeded(headerHeight + 18);
    applyFill(slate700);
    applyStroke(slate700);
    doc.rect(tableX, y, tableWidth, headerHeight, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    applyText(white);
    doc.text("NO", tableX + 14, y + 19);
    doc.text("DESCRIPTION", descriptionX + 10, y + 19);
    doc.text("UNIT PRICE", unitRight, y + 19, { align: "right" });
    doc.text("QTY", qtyRight, y + 19, { align: "right" });
    doc.text("AMOUNT", totalRight, y + 19, { align: "right" });
    y += headerHeight;
  };

  drawTableHeader();

  previewItems.forEach((item, index) => {
    const descriptionLines = textLines(item.description, descriptionWidth - 26);
    const maxLinesPerRow = Math.max(1, Math.floor((maxFlowHeight - headerHeight - 30) / 13));
    let remainingLines = descriptionLines.length > 0 ? descriptionLines : ["Item"];
    let chunkIndex = 0;

    while (remainingLines.length > 0) {
      const chunkLines = remainingLines.slice(0, maxLinesPerRow);
      remainingLines = remainingLines.slice(maxLinesPerRow);
      const rowHeight = Math.max(chunkLines.length * 13 + 18, 38);

      if (y + rowHeight > contentBottom) {
        doc.addPage();
        drawInvoicePage();
        y = pageMargin;
        drawTableHeader();
      }

      applyFill(index % 2 === 0 ? white : slate50);
      applyStroke(stone200);
      doc.rect(tableX, y, tableWidth, rowHeight, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      applyText(stone600);
      doc.text(chunkIndex === 0 ? String(index + 1) : "", tableX + 14, y + 20);
      applyText(stone950);
      doc.text(chunkLines, descriptionX + 10, y + 20);
      applyText(stone600);
      doc.text(chunkIndex === 0 ? formatCurrency(item.unitPrice) : "", unitRight, y + 20, {
        align: "right"
      });
      doc.text(chunkIndex === 0 ? formatAmount(item.quantity) : "", qtyRight, y + 20, {
        align: "right"
      });
      doc.setFont("helvetica", "bold");
      applyText(stone950);
      doc.text(chunkIndex === 0 ? formatCurrency(item.lineTotal) : "", totalRight, y + 20, {
        align: "right"
      });
      y += rowHeight;
      chunkIndex += 1;
    }

    if (index === previewItems.length - 1) {
      y += 14;
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
  const totalsRowHeight = 21;
  const totalsHeight = totalsRows.length * totalsRowHeight + 48;
  addPageIfNeeded(totalsHeight + 16);
  applyFill(stone100);
  applyStroke(stone200);
  doc.rect(totalsX, y, totalsWidth, totalsHeight, "FD");
  let totalsRowY = y + 21;
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
  const totalRowY = totalsRowY + 13;
  applyStroke(stone200);
  doc.line(totalsX + 16, totalRowY - 17, totalsX + totalsWidth - 16, totalRowY - 17);
  doc.setFontSize(12);
  doc.text("Total", totalsX + 16, totalRowY);
  doc.text(formatCurrency(total), totalsX + totalsWidth - 16, totalRowY, { align: "right" });
  y += totalsHeight + 20;

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
      const valueLines = textLines(value, paymentValueWidth, 10);
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
    const termsColumnX = hasPaymentDetails && hasTerms ? totalsX : contentX;
    const termsColumnWidth = contentRight - termsColumnX;
    const paymentColumnWidth =
      hasPaymentDetails && hasTerms ? Math.max(220, termsColumnX - contentX - 28) : contentWidth;
    const bottomTopPadding = 21;
    const bottomHeadingHeight = 17;
    const bottomRowGap = 2;
    const bottomFontSize = 9;
    const bottomLineHeight = lineHeightFor(bottomFontSize);
    const termsParagraphGap = 3;
    const measureTermsHeight = (text: string, width: number) => {
      const paragraphs = text
        .trim()
        .split(/\r?\n/)
        .filter((paragraph) => paragraph.trim() !== "");

      return paragraphs.reduce((height, paragraph, index) => {
        const paragraphHeight =
          textLines(paragraph, width, bottomFontSize).length * bottomLineHeight;
        const gap = index < paragraphs.length - 1 ? termsParagraphGap : 0;

        return height + paragraphHeight + gap;
      }, 0);
    };
    const renderTermsText = (text: string, x: number, startY: number, width: number) => {
      const paragraphs = text
        .trim()
        .split(/\r?\n/)
        .filter((paragraph) => paragraph.trim() !== "");
      let currentY = startY;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(bottomFontSize);
      applyText(stone600);

      paragraphs.forEach((paragraph, paragraphIndex) => {
        const lines = textLines(paragraph, width, bottomFontSize);
        lines.forEach((line) => {
          doc.text(line, x, currentY);
          currentY += bottomLineHeight;
        });

        if (paragraphIndex < paragraphs.length - 1) {
          currentY += termsParagraphGap;
        }
      });

      return currentY - startY;
    };
    const measurePaymentRowsHeight = (width: number) =>
      paymentDetailRows.reduce(
        (height, [label, value]) => {
          const labelWidth = Math.min(92, width * 0.38);
          const valueWidth = width - labelWidth - 8;
          return (
            height +
            Math.max(
              textLines(value, valueWidth, bottomFontSize).length * bottomLineHeight,
              bottomLineHeight
            ) +
            bottomRowGap
          );
        },
        0
      );
    const paymentQrHeight = hasPaymentQr ? 2 + Math.min(96, paymentColumnWidth) + 22 : 0;
    const paymentDetailsHeight = hasPaymentDetails
      ? bottomHeadingHeight + measurePaymentRowsHeight(paymentColumnWidth) + paymentQrHeight
      : 0;
    const termsHeight = hasTerms
      ? bottomHeadingHeight + measureTermsHeight(terms, termsColumnWidth)
      : 0;
    const bottomSectionHeight = Math.max(paymentDetailsHeight, termsHeight);
    const bottomRequiredHeight = bottomTopPadding + bottomSectionHeight;
    const remainingHeight = contentBottom - y;

    if (bottomRequiredHeight <= remainingHeight || bottomRequiredHeight <= maxFlowHeight) {
      if (bottomRequiredHeight > remainingHeight) {
        doc.addPage();
        drawInvoicePage();
        y = pageMargin;
      }

      applyStroke(stone200);
      doc.line(contentX, y, contentRight, y);
      const bottomStartY = y + bottomTopPadding;

      if (hasPaymentDetails) {
        writeTextAt("Payment Details", contentX, bottomStartY, {
          bold: true,
          color: stone950,
          fontSize: 11,
          maxWidth: paymentColumnWidth
        });
        let paymentY = bottomStartY + bottomHeadingHeight;
        const paymentLabelWidth = Math.min(92, paymentColumnWidth * 0.38);
        const paymentValueX = contentX + paymentLabelWidth + 8;
        const paymentValueWidth = paymentColumnWidth - paymentLabelWidth - 8;
        paymentDetailRows.forEach(([label, value]) => {
          writeTextAt(`${label}:`, contentX, paymentY, {
            bold: true,
            color: stone600,
            fontSize: bottomFontSize,
            maxWidth: paymentLabelWidth
          });
          paymentY += writeTextAt(value, paymentValueX, paymentY, {
            color: stone600,
            fontSize: bottomFontSize,
            maxWidth: paymentValueWidth
          });
          paymentY += bottomRowGap;
        });
        if (payment.paymentQrDataUrl) {
          paymentY += 2;
          paymentY += await renderPaymentQrAt(contentX, paymentY, Math.min(96, paymentColumnWidth));
        }
      }

      if (hasTerms) {
        writeTextAt("Terms & Conditions", termsColumnX, bottomStartY, {
          bold: true,
          color: stone950,
          fontSize: 11,
          maxWidth: termsColumnWidth
        });
        renderTermsText(terms, termsColumnX, bottomStartY + bottomHeadingHeight, termsColumnWidth);
      }

      y = bottomStartY + bottomSectionHeight;
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

}
