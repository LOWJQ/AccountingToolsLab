import assert from "node:assert/strict";
import { processLogoFile } from "../lib/invoice/invoice-logo";
import { processPaymentQrFile } from "../lib/invoice/invoice-payment-qr";
import { downloadBlob, downloadCsv } from "../lib/utils/download-blob";
import { todayIsoDate } from "../lib/utils/format-date";
import { parseDebitCreditAmount } from "../lib/calculators/number-utils";

async function main() {
  const names = ["window", "document", "FileReader", "Image"];
  const descriptors = names.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  const createUrl = URL.createObjectURL;
  const revokeUrl = URL.revokeObjectURL;
  const install = (name: string, value: unknown) => Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  let imageWidth = 1000, imageHeight = 400, canDraw = true, readFails = false;
  let output = "data:image/png;base64,AAAA";
  let drawing: number[] = [];
  let encoded: { type: string; quality?: number; smoothing: boolean } | undefined;
  const context = { imageSmoothingEnabled: true, drawImage: (_: unknown, x: number, y: number, width: number, height: number) => { drawing = [x, y, width, height]; } };
  const events: string[] = [];
  const timers: Array<{ callback: () => void; delay: number }> = [];
  const anchor = { href: "", download: "", click: () => events.push("click"), remove: () => events.push("remove") };
  const file = (type: string) => new File([new Uint8Array(10)], "test-image", { type });

  try {
    install("window", { setTimeout: (callback: () => void, delay: number) => timers.push({ callback, delay }) });
    install("document", {
      body: { appendChild: () => events.push("append") },
      createElement: (tag: string) => tag === "a" ? anchor : {
        width: 0, height: 0,
        getContext: () => canDraw ? context : null,
        toDataURL: (type: string, quality?: number) => { encoded = { type, quality, smoothing: context.imageSmoothingEnabled }; return output; }
      }
    });
    install("FileReader", class {
      result = output;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() { if (readFails) this.onerror?.(); else this.onload?.(); }
    });
    install("Image", class {
      naturalWidth = imageWidth;
      naturalHeight = imageHeight;
      onload: (() => void) | null = null;
      set src(_: string) { this.onload?.(); }
    });

    assert.equal((await processLogoFile(file("image/jpeg"))).ok, true);
    assert.deepEqual(drawing, [0, 0, 500, 200]);
    assert.deepEqual(encoded, { type: "image/jpeg", quality: 0.85, smoothing: true });
    imageWidth = 100; imageHeight = 50;
    assert.equal((await processLogoFile(file("image/png"))).ok, true);
    assert.deepEqual(drawing, [0, 0, 100, 50], "Small images must not be enlarged");
    assert.equal(encoded?.type, "image/png");

    imageWidth = 1024; imageHeight = 1024;
    assert.equal((await processPaymentQrFile(file("image/jpeg"))).ok, true);
    assert.deepEqual(drawing, [0, 0, 512, 512]);
    assert.deepEqual(encoded, { type: "image/png", quality: undefined, smoothing: false });
    console.log("PASS shared image pipeline preserves logo quality, aspect ratio and sharp PNG payment QR output");

    output = "data:image/png;base64," + "A".repeat(1_100_000);
    assert.deepEqual(await processLogoFile(file("image/png")), { ok: false, error: "Logo could not be processed. Please try another image." });
    assert.deepEqual(await processPaymentQrFile(file("image/png")), { ok: false, error: "Payment QR image is too large after processing. Please upload a smaller PNG or JPG image." });
    output = "not-image-data";
    assert.equal((await processLogoFile(file("image/png"))).ok, false);
    assert.equal((await processPaymentQrFile(file("image/png"))).ok, false);
    output = "data:image/png;base64,AAAA";
    canDraw = false;
    assert.equal((await processLogoFile(file("image/png"))).ok, false);
    assert.equal((await processPaymentQrFile(file("image/png"))).ok, false);
    canDraw = true; readFails = true;
    assert.equal((await processLogoFile(file("image/png"))).ok, false);
    assert.equal((await processPaymentQrFile(file("image/png"))).ok, false);
    install("window", undefined);
    assert.equal((await processLogoFile(file("image/png"))).ok, false);
    assert.equal((await processPaymentQrFile(file("image/png"))).ok, false);
    console.log("PASS image limits, invalid output, unavailable canvas and read failures retain safe errors");

    install("window", { setTimeout: (callback: () => void, delay: number) => timers.push({ callback, delay }) });
    URL.createObjectURL = () => "blob:test-download";
    URL.revokeObjectURL = url => events.push(`revoke:${url}`);
    downloadBlob(new Blob(["pdf"]), "Invoice-001.pdf");
    assert.equal(anchor.download, "Invoice-001.pdf");
    assert.deepEqual(events, ["append", "click", "remove", "revoke:blob:test-download"]);
    events.length = 0;
    downloadCsv("Date,Amount\n2026-10-26,100", "report.csv");
    assert.equal(anchor.download, "report.csv");
    assert.deepEqual(events, ["append", "click", "remove"]);
    assert.equal(timers[0].delay, 60_000);
    timers[0].callback();
    assert.equal(events.at(-1), "revoke:blob:test-download");
    console.log("PASS shared download helper preserves file names and immediate or delayed URL cleanup");
  } finally {
    URL.createObjectURL = createUrl;
    URL.revokeObjectURL = revokeUrl;
    names.forEach((name, index) => {
      const descriptor = descriptors[index];
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    });
  }

  assert.equal(todayIsoDate(new Date(2026, 0, 5, 0, 1)), "2026-01-05");
  assert.equal(todayIsoDate(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
  for (const value of ["", " ", "0", "0.00"]) assert.equal(parseDebitCreditAmount(value), 0);
  assert.equal(parseDebitCreditAmount("12.50"), 12.5);
  for (const value of ["-1", "NaN", "Infinity", "invalid"]) assert.equal(parseDebitCreditAmount(value), null);
  console.log("PASS shared date and debit/credit helpers preserve local dates, blank zero amounts and invalid input handling");
}

void main().catch(error => { console.error(error); process.exitCode = 1; });
