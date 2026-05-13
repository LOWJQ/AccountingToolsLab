export type InvoiceValidationDisplayOptions = {
  showAllErrors?: boolean;
  touchedFields?: ReadonlySet<string>;
};

export function shouldShowInvoiceValidationError(
  field: string,
  { showAllErrors = false, touchedFields }: InvoiceValidationDisplayOptions
) {
  if (showAllErrors || touchedFields?.has(field) === true) {
    return true;
  }

  if (field === "items" && touchedFields) {
    return Array.from(touchedFields).some((touchedField) => touchedField.startsWith("items."));
  }

  return false;
}
