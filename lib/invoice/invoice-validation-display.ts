export type InvoiceValidationDisplayOptions = {
  touchedFields?: ReadonlySet<string>;
};

export function shouldShowInvoiceValidationError(
  field: string,
  { touchedFields }: InvoiceValidationDisplayOptions
) {
  if (touchedFields?.has(field) === true) {
    return true;
  }

  if (field === "items" && touchedFields) {
    return Array.from(touchedFields).some((touchedField) => touchedField.startsWith("items."));
  }

  return false;
}
