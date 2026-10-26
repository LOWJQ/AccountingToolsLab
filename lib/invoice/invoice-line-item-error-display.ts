export type InvoiceLineItemErrorField = "description" | "quantity" | "unitPrice";

const lineItemErrorMessages: Record<InvoiceLineItemErrorField, string> = {
  description: "Enter a description.",
  quantity: "Enter a valid quantity.",
  unitPrice: "Enter a valid price."
};

export function formatLineItemErrorForDisplay(
  error: string,
  field: InvoiceLineItemErrorField
) {
  if (error.includes("2 decimal places")) return "Use up to 2 decimal places.";
  return error ? lineItemErrorMessages[field] : "";
}
