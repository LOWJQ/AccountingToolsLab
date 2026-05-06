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
  total: number;
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

export function calculateInvoice(items: InvoiceLineItemInput[]): InvoiceResult {
  if (items.length === 0) {
    return {
      items: [],
      subtotal: 0,
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

  return {
    items: calculatedItems,
    subtotal,
    total: subtotal
  };
}
