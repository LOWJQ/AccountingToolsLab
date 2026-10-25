"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReceiptGenerator } from "@/components/calculators/ReceiptGenerator";

export function ReceiptGeneratorWorkspace({ intro, children }: { intro: ReactNode; children: ReactNode }) {
  const [complete, setComplete] = useState(false);
  useEffect(() => { if (complete) window.scrollTo({ top: 0 }); }, [complete]);
  return <div className={`flex min-w-0 flex-col gap-10 ${complete ? "min-h-[calc(100svh-14rem)]" : ""}`}>
    {!complete ? intro : null}
    <ReceiptGenerator onCompletionChange={setComplete} />
    {!complete ? children : null}
  </div>;
}
