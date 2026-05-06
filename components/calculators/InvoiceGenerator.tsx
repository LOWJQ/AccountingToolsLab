"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { calculateInvoice } from "@/lib/calculators/invoice";

type EditableLineItem = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

const mistakes = [
  "Forgetting invoice number",
  "Missing customer details",
  "Using unclear item descriptions",
  "Forgetting payment terms or due date",
  "Confusing invoice total with cash received"
];

const fieldNotes = [
  ["Invoice number", "A unique reference that helps both sides identify the invoice."],
  ["Invoice date", "The date the invoice is issued."],
  ["Due date", "The date payment is expected, if you want to include one."],
  ["Line items", "The goods or services being billed."],
  ["Quantity", "How many units, hours, or items are being charged."],
  ["Unit price", "The price for one unit or one hour."],
  ["Subtotal", "The total of all line items before taxes or extra charges."],
  ["Total", "The amount requested on this simple invoice. Tax is not included here."]
];

function createLineItem(index: number): EditableLineItem {
  return {
    id: `item-${Date.now()}-${index}`,
    description: "",
    quantity: "",
    unitPrice: ""
  };
}

function parseAmount(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function InvoiceGenerator() {
  const today = new Date().toISOString().slice(0, 10);
  const [businessName, setBusinessName] = useState("");
  const [businessContact, setBusinessContact] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<EditableLineItem[]>([createLineItem(1)]);

  const calculation = useMemo(() => {
    try {
      return {
        result: calculateInvoice(
          lineItems.map((item) => ({
            description: item.description,
            quantity: parseAmount(item.quantity),
            unitPrice: parseAmount(item.unitPrice)
          }))
        ),
        message: ""
      };
    } catch (error) {
      return {
        result: null,
        message: error instanceof Error ? error.message : "Check the line items and try again."
      };
    }
  }, [lineItems]);

  function updateLineItem(id: string, key: keyof EditableLineItem, value: string) {
    setLineItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }

  function addLineItem() {
    setLineItems((currentItems) => [...currentItems, createLineItem(currentItems.length + 1)]);
  }

  function removeLineItem(id: string) {
    setLineItems((currentItems) =>
      currentItems.length === 1 ? currentItems : currentItems.filter((item) => item.id !== id)
    );
  }

  function resetInvoice() {
    setBusinessName("");
    setBusinessContact("");
    setBusinessAddress("");
    setCustomerName("");
    setCustomerContact("");
    setCustomerAddress("");
    setInvoiceNumber("INV-001");
    setInvoiceDate(today);
    setDueDate("");
    setNotes("");
    setLineItems([createLineItem(1)]);
  }

  function printInvoice() {
    window.print();
  }

  const previewItems =
    calculation.result?.items ??
    lineItems.map((item, index) => ({
      description: item.description.trim() || `Item ${index + 1}`,
      quantity: parseAmount(item.quantity) ?? 0,
      unitPrice: parseAmount(item.unitPrice) ?? 0,
      lineTotal: 0
    }));

  const subtotal = calculation.result?.subtotal ?? 0;
  const total = calculation.result?.total ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-5 sm:p-8 lg:p-10" variant="elevated">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Invoice Generator
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Create a simple invoice with business details, customer details, line items,
            subtotal, and total.
          </p>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6">
            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">Business details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Business name</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Your business name"
                    value={businessName}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">
                    Business email or phone
                  </span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setBusinessContact(event.target.value)}
                    placeholder="hello@example.com"
                    value={businessContact}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Business address</span>
                  <textarea
                    className="min-h-20 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setBusinessAddress(event.target.value)}
                    placeholder="Business address"
                    value={businessAddress}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">Customer details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Customer name</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer name"
                    value={customerName}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">
                    Customer email or phone
                  </span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setCustomerContact(event.target.value)}
                    placeholder="customer@example.com"
                    value={customerContact}
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-stone-800">Customer address</span>
                  <textarea
                    className="min-h-20 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    placeholder="Customer address"
                    value={customerAddress}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-base font-semibold text-stone-950">Invoice details</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-800">Invoice number</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setInvoiceNumber(event.target.value)}
                    value={invoiceNumber}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-800">Invoice date</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setInvoiceDate(event.target.value)}
                    type="date"
                    value={invoiceDate}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-stone-800">Due date</span>
                  <input
                    className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setDueDate(event.target.value)}
                    type="date"
                    value={dueDate}
                  />
                </label>
              </div>
            </section>

            <section className="grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-stone-950">Line items</h2>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={addLineItem}
                  type="button"
                >
                  Add item
                </button>
              </div>

              <div className="grid gap-4">
                {lineItems.map((item, index) => (
                  <div
                    className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                    key={item.id}
                  >
                    <div className="grid gap-3 lg:grid-cols-[1.5fr_0.7fr_0.8fr_auto]">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-stone-800">
                          Description
                        </span>
                        <input
                          className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          onChange={(event) =>
                            updateLineItem(item.id, "description", event.target.value)
                          }
                          placeholder={`Item ${index + 1}`}
                          value={item.description}
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-stone-800">Quantity</span>
                        <input
                          className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateLineItem(item.id, "quantity", event.target.value)
                          }
                          placeholder="1"
                          type="number"
                          value={item.quantity}
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-stone-800">Unit price</span>
                        <input
                          className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateLineItem(item.id, "unitPrice", event.target.value)
                          }
                          placeholder="0.00"
                          type="number"
                          value={item.unitPrice}
                        />
                      </label>
                      <div className="flex items-end">
                        <button
                          className="h-12 rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={lineItems.length === 1}
                          onClick={() => removeLineItem(item.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {calculation.message ? (
                <p className="text-sm font-medium text-red-700">{calculation.message}</p>
              ) : null}
            </section>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Notes</span>
              <textarea
                className="min-h-24 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Payment terms or thank-you note"
                value={notes}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                onClick={printInvoice}
                type="button"
              >
                Print invoice
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                onClick={resetInvoice}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-6 border-b border-stone-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Invoice from
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-stone-950">
                    {businessName || "Business name"}
                  </h2>
                  {businessContact ? (
                    <p className="mt-2 text-sm text-stone-600">{businessContact}</p>
                  ) : null}
                  {businessAddress ? (
                    <p className="mt-1 whitespace-pre-line text-sm text-stone-600">
                      {businessAddress}
                    </p>
                  ) : null}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-semibold tracking-tight text-stone-950">Invoice</p>
                  <p className="mt-2 text-sm text-stone-600">
                    #{invoiceNumber || "Invoice number"}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Date: {invoiceDate || "Invoice date"}
                  </p>
                  {dueDate ? <p className="mt-1 text-sm text-stone-600">Due: {dueDate}</p> : null}
                </div>
              </div>

              <div className="grid gap-2 border-b border-stone-100 py-6">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Bill to
                </p>
                <h3 className="text-base font-semibold text-stone-950">
                  {customerName || "Customer name"}
                </h3>
                {customerContact ? (
                  <p className="text-sm text-stone-600">{customerContact}</p>
                ) : null}
                {customerAddress ? (
                  <p className="whitespace-pre-line text-sm text-stone-600">{customerAddress}</p>
                ) : null}
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b border-stone-200 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    <tr>
                      <th className="py-3 pr-4">Description</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Unit price</th>
                      <th className="py-3 pl-4 text-right">Line total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {previewItems.map((item, index) => (
                      <tr key={`${item.description}-${index}`}>
                        <td className="py-3 pr-4 font-medium text-stone-900">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-right text-stone-600">
                          {formatAmount(item.quantity)}
                        </td>
                        <td className="px-4 py-3 text-right text-stone-600">
                          {formatAmount(item.unitPrice)}
                        </td>
                        <td className="py-3 pl-4 text-right font-semibold text-stone-950">
                          {formatAmount(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-xs rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex justify-between gap-4 text-sm text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-950">{formatAmount(subtotal)}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-4 border-t border-stone-200 pt-3 text-base font-semibold text-stone-950">
                    <span>Total</span>
                    <span>{formatAmount(total)}</span>
                  </div>
                </div>
              </div>

              {notes ? (
                <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Notes
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-600">
                    {notes}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Explanation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What an invoice is
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-stone-600 sm:text-base">
            <p>
              An invoice is a document sent to a customer to request payment for goods or
              services.
            </p>
            <p>
              A simple invoice usually includes seller details, customer details, invoice
              number, invoice date, optional due date, line items, subtotal, total, and notes.
            </p>
            <p>
              This is a simple invoice generator. It does not include tax, payment processing,
              or professional accounting or tax advice.
            </p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Invoice fields</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            What each field means
          </h2>
          <div className="mt-5 divide-y divide-stone-100">
            {fieldNotes.map(([label, text]) => (
              <div className="py-3 first:pt-0 last:pb-0" key={label}>
                <h3 className="text-sm font-semibold text-stone-950">{label}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{text}</p>
              </div>
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
              Connect invoices with cash and business checks
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use cash flow, break-even, and ratio tools to review what happens after an
              invoice is issued.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href="/tools/cash-flow-calculator">Cash Flow Calculator</ButtonLink>
            <ButtonLink href="/tools/break-even-calculator" variant="secondary">
              Break-even Calculator
            </ButtonLink>
            <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
              Financial Ratio Calculator
            </ButtonLink>
            <ButtonLink href="/tools" variant="secondary">
              All Tools
            </ButtonLink>
          </div>
        </div>
      </Card>
    </div>
  );
}
