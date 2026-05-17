import type { InvoiceData, InvoiceLineItem } from "./invoice-types";

export type InvoiceCalculationResult = {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
};

export type InvoiceLineCalculationResult = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const MONEY_AMOUNT_PATTERN = /^[+-]?(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/;
const QUANTITY_AMOUNT_PATTERN = /^[+-]?(?:\d+(?:\.\d{0,4})?|\.\d{1,4})$/;
const PERCENTAGE_AMOUNT_PATTERN = /^[+-]?(?:\d+(?:\.\d{0,4})?|\.\d{1,4})$/;

function parseDecimalAmount(value: string, pattern: RegExp): number | null {
  const trimmedValue = value.trim();

  if (trimmedValue === "" || !pattern.test(trimmedValue)) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function parseInvoiceMoneyAmount(value: string): number | null {
  return parseDecimalAmount(value, MONEY_AMOUNT_PATTERN);
}

export function parseInvoiceQuantity(value: string): number | null {
  return parseDecimalAmount(value, QUANTITY_AMOUNT_PATTERN);
}

export function parseInvoicePercentage(value: string): number | null {
  return parseDecimalAmount(value, PERCENTAGE_AMOUNT_PATTERN);
}

export function parseInvoiceAmount(value: string): number | null {
  return parseInvoiceMoneyAmount(value);
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toSafeMoneyAmount(value: string): number {
  return parseInvoiceMoneyAmount(value) ?? 0;
}

function toSafeQuantity(value: string): number {
  return parseInvoiceQuantity(value) ?? 0;
}

function toSafePercentage(value: string): number {
  return parseInvoicePercentage(value) ?? 0;
}

export function calculateInvoiceLineItems(
  items: InvoiceLineItem[]
): InvoiceLineCalculationResult[] {
  return items.map((item) => {
    const quantity = toSafeQuantity(item.quantity);
    const unitPrice = toSafeMoneyAmount(item.unitPrice);
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

  const discountValue =
    invoice.discount.type === "percentage"
      ? toSafePercentage(invoice.discount.value)
      : toSafeMoneyAmount(invoice.discount.value);
  const rawDiscountAmount = invoice.discount.enabled
    ? invoice.discount.type === "percentage"
      ? subtotal * (discountValue / 100)
      : discountValue
    : 0;
  const discountAmount = roundMoney(Math.min(Math.max(rawDiscountAmount, 0), subtotal));
  const taxableAmount = roundMoney(Math.max(subtotal - discountAmount, 0));
  const rawTaxValue = invoice.tax.enabled
    ? invoice.tax.type === "fixed"
      ? toSafeMoneyAmount(invoice.tax.value)
      : toSafePercentage(invoice.tax.value)
    : 0;
  const taxAmount = roundMoney(
    invoice.tax.enabled
      ? invoice.tax.type === "fixed"
        ? Math.max(rawTaxValue, 0)
        : taxableAmount * (Math.max(rawTaxValue, 0) / 100)
      : 0
  );
  const rawShippingAmount =
    invoice.shipping?.enabled === true ? toSafeMoneyAmount(invoice.shipping.amount) : 0;
  const shippingAmount = roundMoney(Math.max(rawShippingAmount, 0));

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    shippingAmount,
    total: roundMoney(taxableAmount + taxAmount + shippingAmount)
  };
}
