"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { calculateDepreciation } from "@/lib/calculators/depreciation";
import { ToolFormula, ToolNote, ToolNumberField, ToolPrimaryResult, ToolReset, ToolResultRows, ToolWorkspace } from "@/components/tools/ToolWorkspace";

export function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState("");
  const [salvageValue, setSalvageValue] = useState("");
  const [usefulLifeYears, setUsefulLifeYears] = useState("");
  const { currency, formatCurrency } = useCurrency();
  const hasRequiredValues = assetCost.trim() !== "" && usefulLifeYears.trim() !== "";
  const calculation = useMemo(() => {
    try {
      return { result: calculateDepreciation({ assetCost: Number(assetCost), salvageValue: Number(salvageValue), usefulLifeYears: Number(usefulLifeYears) }), message: "" };
    } catch (error) {
      return { result: null, message: error instanceof Error ? error.message : "Check the amounts and try again." };
    }
  }, [assetCost, salvageValue, usefulLifeYears]);
  const result = hasRequiredValues ? calculation.result : null;
  return (
    <ToolWorkspace title="Asset details" inputs={<>
      <ToolNumberField label={`Asset cost (${currency})`} min="0" name="assetCost" value={assetCost} onChange={e => setAssetCost(e.target.value)} placeholder="0.00" error={assetCost !== "" && Number(assetCost) <= 0 ? "Enter an asset cost greater than zero." : undefined} />
      <ToolNumberField label={`Salvage value (${currency})`} hint="Expected value at the end of its useful life. Leave blank for zero." min="0" name="salvageValue" value={salvageValue} onChange={e => setSalvageValue(e.target.value)} placeholder="0.00" error={Number(salvageValue) < 0 || (assetCost !== "" && Number(salvageValue) > Number(assetCost)) ? "Enter a value from zero to the asset cost." : undefined} />
      <ToolNumberField label="Useful life (years)" min="0" name="usefulLifeYears" value={usefulLifeYears} onChange={e => setUsefulLifeYears(e.target.value)} placeholder="e.g. 5" error={usefulLifeYears !== "" && Number(usefulLifeYears) <= 0 ? "Enter a useful life greater than zero." : undefined} />
      <ToolReset onClick={() => { setAssetCost(""); setSalvageValue(""); setUsefulLifeYears(""); }} />
    </>}>
      <ToolPrimaryResult label="Annual depreciation" value={result ? formatCurrency(result.annualDepreciation) : "—"} />
      {result ? <>
        <ToolNote>Straight-line depreciation spreads the cost evenly over the asset’s useful life.</ToolNote>
        <ToolResultRows rows={[["Monthly depreciation", formatCurrency(result.monthlyDepreciation)], ["Depreciable amount", formatCurrency(result.depreciableAmount)], ["Useful life", `${result.usefulLifeYears} ${result.usefulLifeYears === 1 ? "year" : "years"}`]]} />
      </> : <ToolNote warning={hasRequiredValues}>{hasRequiredValues ? calculation.message : "Enter the asset cost and useful life to see depreciation."}</ToolNote>}
      <ToolFormula>Annual depreciation = (Asset cost − Salvage value) ÷ Useful life</ToolFormula>
    </ToolWorkspace>
  );
}
