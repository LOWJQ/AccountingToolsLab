"use client";

import { parseDebitCreditAmount } from "@/lib/calculators/number-utils";

import { Check, Minus, Plus, TriangleAlert, X } from "lucide-react";
import { ToolNote, ToolReset, ToolResultRows, ToolWorkspace, toolButtonClass, toolInputClass } from "@/components/tools/ToolWorkspace";
import { memo, useCallback, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { checkJournalEntry, type JournalEntryLine } from "@/lib/calculators/journal-entry";

type EditableJournalEntryLine = {
  id: string;
  accountName: string;
  debit: string;
  credit: string;
};

function createLine(index: number, id = `line-${index}`): EditableJournalEntryLine {
  return {
    id,
    accountName: "",
    debit: "",
    credit: ""
  };
}

const invalidAmountMessage = "Please enter valid numeric debit and credit amounts.";

type JournalEntryLineField = keyof Omit<EditableJournalEntryLine, "id">;

const JournalEntryLineEditor = memo(function JournalEntryLineEditor({
  canRemove,
  index,
  currency,
  line,
  onRemove,
  onUpdate
}: {
  canRemove: boolean;
  index: number;
  currency: string;
  line: EditableJournalEntryLine;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: JournalEntryLineField, value: string) => void;
}) {
  const parsedDebit = parseDebitCreditAmount(line.debit);
  const parsedCredit = parseDebitCreditAmount(line.credit);
  const hasDebit = parsedDebit !== null && parsedDebit > 0;
  const hasCredit = parsedCredit !== null && parsedCredit > 0;

  return (
    <div className="min-w-0 border-t border-slate-200 py-4 first:border-t-0 first:pt-0 lg:border-0 lg:p-0">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_2.75rem]">
        <label className="col-span-3 grid min-w-0 gap-2 lg:col-span-1">
          <span className="text-xs font-medium text-slate-600 lg:hidden">Account name</span>
          <input aria-label={`Line ${index + 1} account name`} className={toolInputClass} name={`account-${line.id}`} onChange={e => onUpdate(line.id, "accountName", e.target.value)} placeholder="Account name" value={line.accountName} />
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-medium text-slate-600 lg:hidden">Debit ({currency})</span>
          <input aria-label={`Line ${index + 1} debit amount`} aria-invalid={parsedDebit === null || undefined} className={`${toolInputClass} text-right tabular-nums`} disabled={hasCredit} inputMode="decimal" min="0" name={`debit-${line.id}`} onChange={e => onUpdate(line.id, "debit", e.target.value)} placeholder="0.00" step="0.01" type="number" value={line.debit} />
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-medium text-slate-600 lg:hidden">Credit ({currency})</span>
          <input aria-label={`Line ${index + 1} credit amount`} aria-invalid={parsedCredit === null || undefined} className={`${toolInputClass} text-right tabular-nums`} disabled={hasDebit} inputMode="decimal" min="0" name={`credit-${line.id}`} onChange={e => onUpdate(line.id, "credit", e.target.value)} placeholder="0.00" step="0.01" type="number" value={line.credit} />
        </label>
        <div className="flex items-end lg:items-center"><button aria-label={`Remove line ${index + 1}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canRemove} onClick={() => onRemove(line.id)} type="button"><X aria-hidden="true" className="h-4 w-4" /></button></div>
      </div>
    </div>
  );
});

function isBlankLine(line: EditableJournalEntryLine): boolean {
  return !line.accountName.trim() && !line.debit.trim() && !line.credit.trim();
}

export function JournalEntryChecker() {
  const [lines, setLines] = useState<EditableJournalEntryLine[]>([createLine(1), createLine(2)]);
  const { currency, formatCurrency } = useCurrency();

  const calculation = useMemo(() => {
    const activeLines = lines.filter((line) => !isBlankLine(line));

    if (activeLines.length === 0) {
      return {
        result: null,
        message: "Enter at least one account line to check the journal entry."
      };
    }

    const parsedLines = activeLines.map((line) => ({
      line,
      debit: parseDebitCreditAmount(line.debit),
      credit: parseDebitCreditAmount(line.credit)
    }));

    if (parsedLines.some((line) => line.debit === null || line.credit === null)) {
      return {
        result: null,
        message: invalidAmountMessage
      };
    }

    const calculationLines: JournalEntryLine[] = parsedLines.map(({ line, debit, credit }) => ({
      id: line.id,
      accountName: line.accountName,
      debit: debit ?? 0,
      credit: credit ?? 0
    }));

    try {
      return {
        result: checkJournalEntry(calculationLines),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the journal entry and try again."
      };
    }
  }, [lines]);

  const updateLine = useCallback((
    id: string,
    field: JournalEntryLineField,
    value: string
  ) => {
    if ((field === "debit" || field === "credit") && value.includes("-")) {
      return;
    }

    setLines((currentLines) =>
      currentLines.map((line) => {
        if (line.id !== id) {
          return line;
        }

        if (field === "debit") {
          return {
            ...line,
            debit: value,
            credit: value === "" ? line.credit : ""
          };
        }

        if (field === "credit") {
          return {
            ...line,
            credit: value,
            debit: value === "" ? line.debit : ""
          };
        }

        return {
          ...line,
          accountName: value
        };
      })
    );
  }, []);

  function addLine() {
    setLines((currentLines) => [...currentLines, createLine(currentLines.length + 1, crypto.randomUUID())]);
  }

  const removeLine = useCallback((id: string) => {
    setLines((currentLines) =>
      currentLines.length === 1 ? currentLines : currentLines.filter((line) => line.id !== id)
    );
  }, []);

  function resetChecker() {
    setLines([createLine(1), createLine(2)]);
  }

  const totalDebit = calculation.result?.totalDebit ?? 0;
  const totalCredit = calculation.result?.totalCredit ?? 0;
  const difference = calculation.result?.difference ?? Math.abs(totalDebit - totalCredit);
  const statusLabel = calculation.result ? calculation.result.isBalanced ? "Balanced" : "Not balanced" : lines.some(line => !isBlankLine(line)) ? "Check your entries" : "Waiting for entries";
  const StatusIcon = calculation.result ? calculation.result.isBalanced ? Check : TriangleAlert : Minus;
  const helperMessage = calculation.result
    ? calculation.result.isBalanced
      ? "Your journal entry balances. Total debits equal total credits."
      : `Your journal entry does not balance. ${
          totalDebit > totalCredit ? "Debits" : "Credits"
        } are higher by ${formatCurrency(difference)}.`
    : "";

  return (
    <ToolWorkspace title="Journal entry lines" wide inputs={<>
      <p className="text-sm leading-6 text-slate-600">Enter each account on its own line, with an amount in Debit or Credit.</p>
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-3 border-b border-slate-200 pb-3 text-sm font-medium text-slate-600 lg:grid">
        <span>Account name</span><span className="text-right">Debit ({currency})</span><span className="text-right">Credit ({currency})</span><span className="sr-only">Remove</span>
      </div>
      <div className="flex min-w-0 flex-col gap-3">{lines.map((line, index) => <JournalEntryLineEditor canRemove={lines.length > 1} currency={currency} index={index} key={line.id} line={line} onRemove={removeLine} onUpdate={updateLine} />)}</div>
      <div className="flex flex-wrap gap-3"><button className={toolButtonClass} onClick={addLine} type="button"><Plus aria-hidden="true" className="h-4 w-4" />Add line</button><ToolReset onClick={resetChecker} /></div>
    </>}>
      <p className="flex items-center gap-2 text-base font-semibold text-slate-950"><StatusIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />{statusLabel}</p>
      <ToolNote warning={Boolean(calculation.message && lines.some(line => !isBlankLine(line)))}>{helperMessage || calculation.message}</ToolNote>
      <ToolResultRows rows={[["Total debit", calculation.result ? formatCurrency(totalDebit) : "—"], ["Total credit", calculation.result ? formatCurrency(totalCredit) : "—"], ["Difference", calculation.result ? formatCurrency(difference) : "—"]]} />
      <p className="mt-4 text-xs leading-5 text-slate-500">Matching totals do not confirm that every account or amount is correct.</p>
    </ToolWorkspace>
  );
}
