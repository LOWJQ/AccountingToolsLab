"use client";

import { useState, type ReactNode } from "react";
import { BankReconciliationMatcher, type ReconciliationStage } from "./BankReconciliationMatcher";

/** Keep the current task in view, like the invoice editor and finish screen. */
export function ReconciliationWorkspace({ intro, children }: { intro: ReactNode; children: ReactNode }) {
  const [stage, setStage] = useState<ReconciliationStage>("files");
  return <div className="flex min-w-0 flex-col gap-10">
    {stage === "files" ? intro : null}
    <BankReconciliationMatcher onStageChange={setStage} />
    {stage === "files" ? children : null}
  </div>;
}
