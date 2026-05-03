import type { Metadata } from "next";
import { TrialBalanceCalculator } from "@/components/calculators/TrialBalanceCalculator";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
  title: "Trial Balance Calculator | AccountingToolsLab",
  description: "A simple trial balance calculator layout for comparing total debits and credits."
};

export default function TrialBalanceCalculatorPage() {
  return (
    <ToolPageLayout eyebrow="Accounting Tools">
      <TrialBalanceCalculator />
    </ToolPageLayout>
  );
}
