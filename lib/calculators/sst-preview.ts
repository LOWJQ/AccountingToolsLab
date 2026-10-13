import {
  calculateSstInvoiceMalaysia,
  type SstInvoiceMalaysiaInput
} from "./sst-malaysia";

/** Keep completed amounts visible while retaining every unfinished row for validation. */
export function calculateSstPreview(input: SstInvoiceMalaysiaInput) {
  const items = input.items.map((item, index) => {
    try {
      return {
        input: item,
        line: calculateSstInvoiceMalaysia({ mode: input.mode, currency: input.currency, items: [item] }).lineItems[0],
        message: ""
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Check the values and try again.";
      return {
        input: item,
        line: null,
        message: `Item ${index + 1}: ${message.replace(/^Line 1 /, "")}`
      };
    }
  });
  const completedInputs = items.filter((item) => item.line !== null).map((item) => item.input);
  const incompleteCount = items.length - completedInputs.length;

  return {
    items,
    incompleteCount,
    canExport: items.length > 0 && incompleteCount === 0,
    result: completedInputs.length > 0
      ? calculateSstInvoiceMalaysia({ mode: input.mode, currency: input.currency, items: completedInputs })
      : null
  };
}
