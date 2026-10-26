import { parseCsv } from "./csv";
import { reconcile } from "./matcher";
import type { WorkerRequest, WorkerResponse } from "./types";

// Dedicated, local-only worker. No network, storage, telemetry or bank API.
const context = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (message: WorkerResponse) => void;
};

context.onmessage = async event => {
  const request = event.data;
  try {
    if (request.type === "parse") context.postMessage({ id: request.id, type: "parsed", document: parseCsv(request.text) });
    else if (request.type === "excel") {
      const { readWorkbook } = await import("./excel");
      context.postMessage({ id: request.id, type: "workbook", ...await readWorkbook(request.bytes, request.sheet) });
    } else if (request.type === "report") {
      const { createWorkbookReport } = await import("./excel");
      context.postMessage({ id: request.id, type: "report", bytes: await createWorkbookReport(request.result, request.matches, request.notes) });
    }
    else {
      context.postMessage({ id: request.id, type: "progress", message: "Comparing transactions in this browser…" });
      context.postMessage({ id: request.id, type: "matched", result: reconcile(request.bank, request.ledger, request.options) });
    }
  } catch (error) {
    context.postMessage({ id: request.id, type: "error", message: error instanceof Error ? error.message : "The files could not be compared. Check the column settings and try again." });
  }
};
