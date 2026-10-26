"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateBreakEven } from "@/lib/calculators/break-even";
import { ToolFormula, ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolResultRows, ToolWorkspace } from "@/components/tools/ToolWorkspace";

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("");
  const { currency, formatCurrency } = useCurrency();
  const hasPrice = sellingPricePerUnit.trim() !== "";
  const calculation = useMemo(() => {
    try {
      return { result: calculateBreakEven({ fixedCosts: Number(fixedCosts), sellingPricePerUnit: Number(sellingPricePerUnit), variableCostPerUnit: Number(variableCostPerUnit) }), message: "" };
    } catch (error) {
      return { result: null, message: error instanceof Error ? error.message : "Check the amounts and try again." };
    }
  }, [fixedCosts, sellingPricePerUnit, variableCostPerUnit]);
  const result = calculation.result;
  return (
    <ToolWorkspace title="Costs and selling price" inputs={<>
      <ToolNumberField label={`Fixed costs (${currency})`} hint="Costs that stay the same, such as rent." min="0" name="fixedCosts" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} placeholder="0.00" error={Number(fixedCosts) < 0 ? "Enter zero or more." : undefined} />
      <ToolNumberField label={`Selling price per unit (${currency})`} min="0" name="sellingPricePerUnit" value={sellingPricePerUnit} onChange={e => setSellingPricePerUnit(e.target.value)} placeholder="0.00" error={hasPrice && Number(sellingPricePerUnit) <= Number(variableCostPerUnit) ? "Enter a price greater than the variable cost." : undefined} />
      <ToolNumberField label={`Variable cost per unit (${currency})`} hint="Cost of producing or delivering one unit." min="0" name="variableCostPerUnit" value={variableCostPerUnit} onChange={e => setVariableCostPerUnit(e.target.value)} placeholder="0.00" error={Number(variableCostPerUnit) < 0 ? "Enter zero or more." : undefined} />
      <ToolReset onClick={() => { setFixedCosts(""); setSellingPricePerUnit(""); setVariableCostPerUnit(""); }} />
    </>}>
      <ToolPrimaryResult label="Minimum units to break even" value={result ? `${result.minimumWholeUnits.toLocaleString("en-US")} units` : "—"} />
      {result ? <>
        <ToolNote>Sell at least this many whole units to cover your costs.</ToolNote>
        <ToolResultRows rows={[["Break-even units", result.breakEvenUnits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })], ["Break-even sales", formatCurrency(result.breakEvenSales)], ["Contribution margin per unit", formatCurrency(result.contributionMarginPerUnit)]]} />
      </> : <ToolNote warning={hasPrice}>{hasPrice ? calculation.message : "Enter a selling price to see your break-even point. Blank costs count as zero."}</ToolNote>}
      <ToolFormula>Break-even units = Fixed costs ÷ (Selling price per unit − Variable cost per unit)</ToolFormula>
    </ToolWorkspace>
  );
}
