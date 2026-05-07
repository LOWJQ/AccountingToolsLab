import type { InvoiceData, InvoiceLineItem } from "./invoice-types";

export type InvoiceCalculationResult = {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
};

export type InvoiceLineCalculationResult = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export function parseInvoiceNumber(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toSafeAmount(value: string): number {
  return parseInvoiceNumber(value) ?? 0;
}

export function calculateInvoiceLineItems(
  items: InvoiceLineItem[]
): InvoiceLineCalculationResult[] {
  return items.map((item) => {
    const quantity = toSafeAmount(item.quantity);
    const unitPrice = toSafeAmount(item.unitPrice);
    const safeQuantity = quantity > 0 ? quantity : 0;
    const safeUnitPrice = unitPrice >= 0 ? unitPrice : 0;

    return {
      id: item.id,
      description: item.description.trim() || "Item",
      quantity: safeQuantity,
      unitPrice: safeUnitPrice,
      lineTotal: roundMoney(safeQuantity * safeUnitPrice)
    };
  });
}

export function calculateInvoiceTotals(invoice: InvoiceData): InvoiceCalculationResult {
  const subtotal = roundMoney(
    calculateInvoiceLineItems(invoice.items).reduce((total, item) => total + item.lineTotal, 0)
  );

  const discountValue = toSafeAmount(invoice.discount.value);
  const rawDiscountAmount = invoice.discount.enabled
    ? invoice.discount.type === "percentage"
      ? subtotal * (discountValue / 100)
      : discountValue
    : 0;
  const discountAmount = roundMoney(Math.min(Math.max(rawDiscountAmount, 0), subtotal));
  const taxableAmount = roundMoney(Math.max(subtotal - discountAmount, 0));
  const taxRate = invoice.tax.enabled ? toSafeAmount(invoice.tax.rate) : 0;
  const taxAmount = roundMoney(taxableAmount * (Math.max(taxRate, 0) / 100));

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total: roundMoney(taxableAmount + taxAmount)
  };
}
