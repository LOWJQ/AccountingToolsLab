"use client";

import { Check, Copy, Printer, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SstResultActions.module.css";

const estimateNote =
  "Estimate only. Confirm the applicable SST category and rate with current MySST/RMCD guidance before invoicing or filing.";
const buttonClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100";

export function SstResultActions({
  isComplete = true,
  onInvalidExport,
  onReset,
  rows,
  sections = []
}: {
  isComplete?: boolean;
  onInvalidExport?: () => void;
  onReset: () => void;
  rows: Array<[string, string]>;
  sections?: Array<{ title: string; rows: Array<[string, string]> }>;
}) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<{
    text: string;
    status: "copied" | "error";
  } | null>(null);
  const [printError, setPrintError] = useState(false);
  const resultText = [
    "SST Calculator Malaysia — AccountingToolsLab",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...sections.flatMap((section) => [
      "",
      section.title,
      ...section.rows.map(([label, value]) => `${label}: ${value}`)
    ]),
    "",
    estimateNote
  ].join("\n");
  // Feedback belongs to the copied calculation, and disappears when its values change.
  const copyStatus = isComplete && copyFeedback?.text === resultText ? copyFeedback.status : null;

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  async function copyResult() {
    if (!isComplete) {
      onInvalidExport?.();
      return;
    }
    try {
      await navigator.clipboard.writeText(resultText);
      setCopyFeedback({ text: resultText, status: "copied" });
    } catch {
      setCopyFeedback({ text: resultText, status: "error" });
    }
  }

  function printResult() {
    setPrintError(false);
    if (!isComplete) {
      onInvalidExport?.();
      return;
    }
    try {
      window.print();
    } catch {
      setPrintError(true);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className={buttonClassName} onClick={copyResult} type="button">
          {copyStatus === "copied" ? (
            <Check aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Copy aria-hidden="true" className="h-4 w-4" />
          )}
          {copyStatus === "copied" ? "Copied" : "Copy result"}
        </button>
        <button
          className={buttonClassName}
          disabled={!portalTarget}
          onClick={printResult}
          type="button"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Print result
        </button>
        <button className={buttonClassName} onClick={onReset} type="button">
          <RefreshCcw aria-hidden="true" className="h-4 w-4" />
          Reset
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-600" role="status">
        {copyStatus === "copied"
          ? "Result copied to clipboard."
          : copyStatus === "error"
            ? "Your browser could not copy the result. Select the text below and copy it manually."
            : ""}
      </p>
      {copyStatus === "error" ? (
        <textarea
          aria-label="SST result to copy manually"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-4 focus:ring-slate-100"
          onFocus={(event) => event.currentTarget.select()}
          readOnly
          rows={sections.length > 0 ? 16 : 11}
          value={resultText}
        />
      ) : null}
      {printError ? (
        <p className="mt-2 text-sm text-slate-600" role="alert">
          The print dialog could not open. Use your browser&apos;s Print menu to print the result.
        </p>
      ) : null}
      {portalTarget
        ? createPortal(
            <div className={styles.printSheet}>
              <p className={styles.brand}>AccountingToolsLab</p>
              <h1>SST Calculator Malaysia</h1>
              {!isComplete ? (
                <p>Incomplete calculation. Complete or remove unfinished items before printing the result.</p>
              ) : [{ title: "SST calculation result", rows }, ...sections].map((section) => (
                <table key={section.title}>
                  <caption>{section.title}</caption>
                  <tbody>
                    {section.rows.map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
              <p className={styles.note}>{estimateNote}</p>
            </div>,
            portalTarget
          )
        : null}
    </div>
  );
}
