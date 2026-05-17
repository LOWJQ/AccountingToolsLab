"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import {
  checkDebitCredit,
  normalBalances,
  type AccountEffect,
  type AccountType
} from "@/lib/calculators/debit-credit";

const accountOptions: Array<{ label: string; value: AccountType }> = [
  { label: "Asset", value: "asset" },
  { label: "Liability", value: "liability" },
  { label: "Equity", value: "equity" },
  { label: "Revenue", value: "revenue" },
  { label: "Expense", value: "expense" },
  { label: "Dividends/Drawings", value: "dividends" }
];

const effectOptions: Array<{ label: string; value: AccountEffect }> = [
  { label: "Increase", value: "increase" },
  { label: "Decrease", value: "decrease" }
];

const examples = [
  {
    title: "Buying equipment with cash",
    text: "Equipment is an asset, so increasing equipment means debit Equipment. Cash is also an asset, so decreasing cash means credit Cash."
  },
  {
    title: "Earning service revenue",
    text: "Revenue has a normal credit balance, so increasing service revenue means recording a credit."
  }
];

const mistakes = [
  "Thinking debit always means increase",
  "Thinking credit always means decrease",
  "Mixing up assets and expenses",
  "Forgetting that revenue has a normal credit balance",
  "Forgetting that liabilities increase with credits"
];

export function DebitCreditChecker() {
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
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Account type</span>
              <select
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => setAccountType(event.target.value as AccountType | "")}
                value={accountType}
              >
                <option value="">Select account type</option>
                {accountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Effect</span>
              <select
                className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => setEffect(event.target.value as AccountEffect | "")}
                value={effect}
              >
                <option value="">Select increase or decrease</option>
                {effectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="inline-flex h-10 w-fit items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              onClick={resetChecker}
              type="button"
            >
              Reset
            </button>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Answer</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              {result.value ? `${result.value.answer} the account` : "-"}
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {result.value ? result.value.explanation : result.message}
            </p>
            {result.value ? (
              <p className="mt-5 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-stone-600 ring-1 ring-stone-200">
                Normal balance: {result.value.normalBalance}
              </p>
            ) : null}
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Rules</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Debit and credit rules
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Debits and credits do not always mean increase or decrease. The effect depends on
            the account type and its normal balance.
          </p>

          <div className="mt-6 grid gap-3 sm:hidden">
            {accountOptions.map((option) => (
              <div
                className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                key={option.value}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Account type
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-900">{option.label}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Normal balance
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {normalBalances[option.value]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden sm:block">
            <table className="w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-2">Account type</th>
                  <th className="px-4 py-2">Normal balance</th>
                </tr>
              </thead>
              <tbody>
                {accountOptions.map((option) => (
                  <tr className="bg-stone-50" key={option.value}>
                    <td className="rounded-l-xl border-y border-l border-stone-200 px-4 py-3 text-stone-700">
                      {option.label}
                    </td>
                    <td className="rounded-r-xl border-y border-r border-stone-200 px-4 py-3 font-semibold text-stone-900">
                      {normalBalances[option.value]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Worked examples</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Simple examples
          </h2>
          <div className="mt-5 divide-y divide-stone-100">
            {examples.map((example) => (
              <article className="py-4 first:pt-0 last:pb-0" key={example.title}>
                <h3 className="text-base font-semibold text-stone-950">{example.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{example.text}</p>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-6 sm:p-8">
        <p className="text-sm font-medium tracking-wide text-slate-500">Common mistakes</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
          Mistakes to avoid
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {mistakes.map((mistake) => (
            <div
              className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700"
              key={mistake}
            >
              {mistake}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Related tools</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Continue checking accounting basics
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use the accounting equation and trial balance tools to keep practicing the same
              double-entry ideas.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/accounting-equation-calculator">
              Accounting Equation Calculator
            </ButtonLink>
            <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
              Trial Balance Calculator
            </ButtonLink>
            <ButtonLink href="/guides" variant="secondary">
              Guides
            </ButtonLink>
          </div>
        </div>
      </Card>
    </div>
  );
}
