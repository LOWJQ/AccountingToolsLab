/**
 * Saves a generated file locally. Large reconciliation reports retain their
 * object URL briefly so the browser has time to start reading the download.
 */
export function downloadBlob(blob: Blob, fileName: string, revokeDelayMs = 0) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (revokeDelayMs > 0) {
    window.setTimeout(() => URL.revokeObjectURL(url), revokeDelayMs);
  } else {
    URL.revokeObjectURL(url);
  }
}

/** Creates a local CSV download; no transaction data is sent to a server. */
export function downloadCsv(content: string, fileName: string) {
  downloadBlob(new Blob([content], { type: "text/csv;charset=utf-8" }), fileName, 60_000);
}
