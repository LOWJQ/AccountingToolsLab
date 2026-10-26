"use client";

import { useCallback, useEffect, useRef } from "react";
import type { WorkerRequest, WorkerResponse } from "@/lib/reconciliation/types";

type RequestPayload = WorkerRequest extends infer Request ? Request extends WorkerRequest ? Omit<Request, "id"> : never : never;
type Completed = Exclude<WorkerResponse, { type: "progress" | "error" }>;

export function useReconciliationWorker() {
  const worker = useRef<Worker | null>(null);
  const sequence = useRef(0);
  const pending = useRef(new Map<number, { resolve: (value: Completed) => void; reject: (error: Error) => void }>());

  const cancel = useCallback(() => {
    worker.current?.terminate();
    worker.current = null;
    for (const item of pending.current.values()) item.reject(new Error("Local processing cancelled."));
    pending.current.clear();
  }, []);
  useEffect(() => cancel, [cancel]);

  const request = useCallback((payload: RequestPayload): Promise<Completed> => {
    if (!worker.current) {
      const instance = new Worker(new URL("../lib/reconciliation/reconciliation.worker.ts", import.meta.url));
      instance.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;
        if (response.type === "progress") return;
        const item = pending.current.get(response.id);
        if (!item) return;
        pending.current.delete(response.id);
        if (response.type === "error") item.reject(new Error(response.message));
        else item.resolve(response);
      };
      instance.onerror = () => {
        instance.terminate();
        worker.current = null;
        for (const item of pending.current.values()) item.reject(new Error("Local processing could not start. Refresh the page or try a current browser."));
        pending.current.clear();
      };
      worker.current = instance;
    }
    const id = ++sequence.current;
    return new Promise((resolve, reject) => {
      pending.current.set(id, { resolve, reject });
      worker.current!.postMessage({ ...payload, id });
    });
  }, []);
  return { request, cancel };
}
