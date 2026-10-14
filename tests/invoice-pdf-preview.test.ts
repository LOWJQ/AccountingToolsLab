import assert from "node:assert/strict";
import { openInvoicePdfPreview } from "../lib/invoice/invoice-pdf-preview";
import type { InvoicePdfGenerationResult } from "../lib/invoice/invoice-pdf-generator";

async function runTests() {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  const pdf: InvoicePdfGenerationResult = { blob: new Blob(["test PDF"]), fileName: "invoice.pdf", warnings: [] };
  const events: string[] = [];
  const tab = {
    closed: false,
    opener: {} as unknown,
    document: { title: "", body: { textContent: "" } },
    location: { replace: (url: string) => { events.push(url); } },
    close: () => { tab.closed = true; events.push("close"); }
  };
  let blocked = false;
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    open: (url: string, target: string) => {
      events.push(`open:${url}:${target}`);
      return blocked ? null : tab;
    }
  } });
  URL.createObjectURL = () => { events.push("create URL"); return "blob:test-invoice"; };
  URL.revokeObjectURL = (url) => { events.push(`revoke:${url}`); };

  try {
    let finish!: (result: InvoicePdfGenerationResult) => void;
    const pending = openInvoicePdfPreview(() => {
      events.push("generate");
      return new Promise((resolve) => { finish = resolve; });
    });
    assert.deepEqual(events, ["open:about:blank:_blank", "generate"]);
    assert.equal(tab.opener, null);
    assert.equal(tab.document.body.textContent, "Preparing invoice...");
    finish(pdf);
    const opened = await pending;
    assert.equal(opened.status, "opened");
    assert.equal(events.at(-1), "blob:test-invoice#navpanes=0&view=Fit");
    assert.equal(events.some((value) => value.startsWith("revoke")), false);
    console.log("PASS preview opens synchronously, fits the page, and keeps the PDF URL alive");

    events.length = 0;
    blocked = true;
    assert.deepEqual(await openInvoicePdfPreview(async () => { throw new Error("must not run"); }), { status: "blocked" });
    assert.deepEqual(events, ["open:about:blank:_blank"]);
    console.log("PASS blocked popup does not generate an unreachable PDF");

    blocked = false;
    events.length = 0;
    tab.closed = false;
    assert.deepEqual(await openInvoicePdfPreview(async () => { tab.closed = true; return pdf; }), { status: "closed" });
    assert.equal(events.includes("create URL"), false);
    console.log("PASS closed preview does not allocate a PDF URL");

    tab.closed = false;
    await assert.rejects(openInvoicePdfPreview(async () => { throw new Error("generation failed"); }), /generation failed/);
    assert.equal(tab.closed, true);
    console.log("PASS failed PDF generation closes the temporary tab");

    tab.closed = false;
    await assert.rejects(openInvoicePdfPreview(async () => ({ warnings: [] })), /could not be created/);
    assert.equal(tab.closed, true);
    console.log("PASS missing PDF result cannot produce an empty preview");

    events.length = 0;
    tab.closed = false;
    tab.location.replace = () => { throw new Error("navigation failed"); };
    await assert.rejects(openInvoicePdfPreview(async () => pdf), /navigation failed/);
    assert.ok(events.includes("revoke:blob:test-invoice"));
    assert.equal(tab.closed, true);
    console.log("PASS preview navigation failure revokes the PDF URL and closes the tab");
  } finally {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

runTests().catch((error) => { console.error(error); process.exitCode = 1; });
