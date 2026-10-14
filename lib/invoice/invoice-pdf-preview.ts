import type { InvoicePdfGenerationResult } from "./invoice-pdf-generator";

export type InvoicePdfPreviewResult =
  | { status: "blocked" | "closed" }
  | { status: "opened"; tab: Window; url: string; pdf: InvoicePdfGenerationResult };

/** Open during the click, before async PDF generation consumes user activation. */
export async function openInvoicePdfPreview(
  generatePdf: () => Promise<InvoicePdfGenerationResult>
): Promise<InvoicePdfPreviewResult> {
  const tab = window.open("about:blank", "_blank");
  if (!tab) return { status: "blocked" };

  let url = "";
  try {
    tab.opener = null;
    tab.document.title = "Invoice preview";
    tab.document.body.textContent = "Preparing invoice...";

    const pdf = await generatePdf();
    if (!pdf.blob || !pdf.fileName) throw new Error("Invoice PDF could not be created.");
    if (tab.closed) return { status: "closed" };

    url = URL.createObjectURL(pdf.blob);
    tab.location.replace(`${url}#navpanes=0&view=Fit`);
    return { status: "opened", tab, url, pdf };
  } catch (error) {
    if (url) URL.revokeObjectURL(url);
    if (!tab.closed) tab.close();
    throw error;
  }
}
