/** Creates a local download; no transaction data is sent to a server. */
export function downloadCsv(content: string, name: string) {
  downloadBlob(new Blob([content], { type: "text/csv;charset=utf-8" }), name);
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
