"use client";

import { useEffect, useState, type ReactNode } from "react";
import { InvoiceGenerator } from "@/components/calculators/InvoiceGenerator";

/** Keep the finish view focused on the invoice, while retaining the editor state. */
export function InvoiceGeneratorWorkspace({ intro, children }: { intro: ReactNode; children: ReactNode }) {
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    if (isComplete) window.scrollTo({ top: 0 });
  }, [isComplete]);

  return (
    <div className={`flex flex-col gap-10 ${isComplete ? "min-h-[calc(100svh-14rem)]" : ""}`}>
      {!isComplete ? intro : null}
      <InvoiceGenerator onCompletionChange={setIsComplete} />
      {!isComplete ? children : null}
    </div>
  );
}
