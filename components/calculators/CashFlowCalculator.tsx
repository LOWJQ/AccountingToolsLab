"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateCashFlow, type CashFlowStatus } from "@/lib/calculators/cash-flow";
import { ToolFormula, ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolResultRows, ToolWorkspace } from "@/components/tools/ToolWorkspace";

const statusLabels: Record<CashFlowStatus, string> = {
  positive: "Positive cash flow",
  negative: "Negative cash flow",
  neutral: "Neutral cash flow"
};

export function CashFlowCalculator() {
  const [beginningCashBalance, setBeginningCashBalance] = useState("");
  const [cashInflows, setCashInflows] = useState("");
  const [cashOutflows, setCashOutflows] = useState("");
  const { currency, formatCurrency } = useCurrency();
  const hasEntries = [beginningCashBalance, cashInflows, cashOutflows].some(value => value.trim() !== "");
  const calculation = useMemo(() => {
    try {
      return { result: calculateCashFlow({ beginningCashBalance: Number(beginningCashBalance), cashInflows: Number(cashInflows), cashOutflows: Number(cashOutflows) }), message: "" };
    } catch (error) {
      return { result: null, message: error instanceof Error ? error.message : "Check the amounts and try again." };
    }
  }, [beginningCashBalance, cashInflows, cashOutflows]);
  const result = hasEntries ? calculation.result : null;
  return (
    <ToolWorkspace title="Cash for the period" inputs={<>
      <ToolNumberField label={`Beginning cash balance (${currency})`} hint="Cash available at the start of the period." min="0" name="beginningCashBalance" value={beginningCashBalance} onChange={e => setBeginningCashBalance(e.target.value)} placeholder="0.00" error={Number(beginningCashBalance) < 0 ? "Enter zero or more." : undefined} />
      <ToolNumberField label={`Cash inflows (${currency})`} hint="Money received during the same period." min="0" name="cashInflows" value={cashInflows} onChange={e => setCashInflows(e.target.value)} placeholder="0.00" error={Number(cashInflows) < 0 ? "Enter zero or more." : undefined} />
      <ToolNumberField label={`Cash outflows (${currency})`} hint="Money paid out during the same period." min="0" name="cashOutflows" value={cashOutflows} onChange={e => setCashOutflows(e.target.value)} placeholder="0.00" error={Number(cashOutflows) < 0 ? "Enter zero or more." : undefined} />
      <ToolReset onClick={() => { setBeginningCashBalance(""); setCashInflows(""); setCashOutflows(""); }} />
    </>}>
      <ToolPrimaryResult label="Ending cash balance" value={result ? formatCurrency(result.endingCashBalance) : "—"} />
      {result ? <>
        <ToolResultRows rows={[["Net cash flow", formatCurrency(result.netCashFlow)], ["Cash flow", statusLabels[result.status]]]} />
        <ToolNote>{result.netCashFlow > 0 ? "More money came in than went out." : result.netCashFlow < 0 ? "More money went out than came in." : "Cash inflows and outflows are equal."}</ToolNote>
      </> : <ToolNote warning={Boolean(calculation.message)}>{calculation.message || "Enter your cash amounts to see the result. Blank fields count as zero."}</ToolNote>}
      <ToolFormula>Ending cash balance = Beginning cash balance + Cash inflows − Cash outflows</ToolFormula>
    </ToolWorkspace>
  );
}
