export type InvoiceLineItemInput = {
  description?: string;
  quantity: number | null | undefined;
  unitPrice: number | null | undefined;
};

export type InvoiceLineItemResult = {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type InvoiceResult = {
  items: InvoiceLineItemResult[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
};

export type InvoiceOptions = {
  taxRate?: number;
};

function assertValidNumber(value: number | null | undefined, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function roundAmount(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateInvoice(
  items: InvoiceLineItemInput[],
  options: InvoiceOptions = {}
): InvoiceResult {
  const taxRate = options.taxRate ?? 0;

  if (typeof taxRate !== "number" || !Number.isFinite(taxRate)) {
    throw new Error("Tax rate must be a valid number.");
  }

  if (taxRate < 0) {
    throw new Error("Tax rate cannot be negative.");
  }

  if (taxRate > 100) {
    throw new Error("Tax rate cannot be above 100.");
  }

  if (items.length === 0) {
    return {
      items: [],
      subtotal: 0,
      taxRate,
      taxAmount: 0,
      total: 0
    };
  }

  const calculatedItems = items.map((item, index) => {
    const quantity = assertValidNumber(item.quantity, `Line item ${index + 1} quantity`);
    const unitPrice = assertValidNumber(item.unitPrice, `Line item ${index + 1} unit price`);

    if (quantity <= 0) {
      throw new Error(`Line item ${index + 1} quantity must be greater than zero.`);
    }

    if (unitPrice < 0) {
      throw new Error(`Line item ${index + 1} unit price must be zero or greater.`);
    }

    return {
      description: item.description?.trim() || `Item ${index + 1}`,
      quantity,
      unitPrice,
      lineTotal: roundAmount(quantity * unitPrice)
    };
  });

  const subtotal = roundAmount(
    calculatedItems.reduce((total, item) => total + item.lineTotal, 0)
  );
  const taxAmount = roundAmount(subtotal * (taxRate / 100));

  return {
    items: calculatedItems,
    subtotal,
    taxRate,
    taxAmount,
    total: roundAmount(subtotal + taxAmount)
  };
}
