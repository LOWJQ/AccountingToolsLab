/**
 * Saves a generated file to the visitor's device. Used by the invoice PDF and
 * the invoice backup, so the object URL cleanup lives in one place rather than
 * being repeated (and eventually forgotten) at each call site.
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
