"use client";

import { useId, useMemo, useState } from "react";
import { ToolNote, ToolPrimaryResult, ToolReset, ToolResultRows, ToolSelectField, ToolWorkspace } from "@/components/tools/ToolWorkspace";
import {
  checkDebitCredit,
  type AccountEffect,
  type AccountType
} from "@/lib/calculators/debit-credit";

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

const accountOptions: Array<DropdownOption<AccountType | "">> = [
  { label: "Select account type", value: "" },
  { label: "Asset", value: "asset" },
  { label: "Liability", value: "liability" },
  { label: "Equity", value: "equity" },
  { label: "Revenue", value: "revenue" },
  { label: "Expense", value: "expense" },
  { label: "Dividends/Drawings", value: "dividends" }
];

export function DebitCreditChecker() {
  const effectName = useId();
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [effect, setEffect] = useState<AccountEffect | "">("");

  const result = useMemo(() => {
    try {
      return {
        value: checkDebitCredit({
          accountType: accountType || null,
          effect: effect || null
        }),
        message: ""
      };
    } catch (error) {
      return {
        value: null,
        message: error instanceof Error ? error.message : "Choose an account type and effect."
      };
    }
  }, [accountType, effect]);

  function resetChecker() {
    setAccountType("");
    setEffect("");
  }

  return (
    <ToolWorkspace title="Account and change" inputs={<>
      <ToolSelectField label="Account type" onChange={setAccountType} options={accountOptions} value={accountType} />
      <fieldset className="min-w-0">
        <legend className="text-sm font-medium text-slate-950">What happens to this account?</legend>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          {(["increase", "decrease"] as const).map(option => <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800" key={option}>
            <input className="h-[18px] w-[18px] accent-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400" checked={effect === option} name={effectName} onChange={() => setEffect(option)} type="radio" value={option} />
            {option === "increase" ? "Increase" : "Decrease"}
          </label>)}
        </div>
      </fieldset>
      <ToolReset onClick={resetChecker} />
    </>}>
      <ToolPrimaryResult label="Entry to record" value={result.value?.answer ?? "—"} />
      <ToolNote>{result.value?.explanation ?? "Choose an account type and whether it increases or decreases."}</ToolNote>
      {result.value ? <ToolResultRows rows={[["Normal balance", result.value.normalBalance]]} /> : null}
    </ToolWorkspace>
  );
}
