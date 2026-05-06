"use client";

import { useMemo, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { calculateInvoice } from "@/lib/calculators/invoice";

type EditableLineItem = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

type InvoiceView = "details" | "preview";

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
  const { currency, formatCurrency } = useCurrency();
  const invoiceGeneratorTopRef = useRef<HTMLDivElement>(null);
  const invoicePreviewRef = useRef<HTMLDivElement>(null);
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
  const [activeView, setActiveView] = useState<InvoiceView>("details");

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

  const lineItemPreviewTotals = useMemo(
    () =>
      lineItems.map((item) => {
        const quantity = parseAmount(item.quantity);
        const unitPrice = parseAmount(item.unitPrice);

        if (quantity === null || unitPrice === null || quantity <= 0 || unitPrice < 0) {
          return 0;
        }

        return quantity * unitPrice;
      }),
    [lineItems]
  );

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

  function switchInvoiceView(view: InvoiceView) {
    setActiveView(view);
    window.requestAnimationFrame(() => {
      invoiceGeneratorTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  function printInvoice() {
    if (typeof window === "undefined" || !invoicePreviewRef.current) {
      return;
    }

    document.getElementById("invoice-print-clone")?.remove();

    const printClone = invoicePreviewRef.current.cloneNode(true) as HTMLElement;
    printClone.id = "invoice-print-clone";
    document.body.appendChild(printClone);
    document.body.classList.add("printing-invoice");

    let cleanupTimeout: number | undefined;

    const cleanup = () => {
      document.body.classList.remove("printing-invoice");
      printClone.remove();
      window.removeEventListener("afterprint", cleanup);

      if (cleanupTimeout) {
        window.clearTimeout(cleanupTimeout);
      }
    };

    window.addEventListener("afterprint", cleanup);
    window.print();
    cleanupTimeout = window.setTimeout(cleanup, 1500);
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
      <div className="scroll-mt-24" ref={invoiceGeneratorTopRef}>
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

        <div className="mt-8 inline-grid rounded-xl border border-stone-200 bg-stone-50 p-1 sm:grid-cols-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeView === "details"
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-600 hover:text-stone-950"
            }`}
            onClick={() => switchInvoiceView("details")}
            type="button"
          >
            Enter invoice details
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeView === "preview"
                ? "bg-white text-stone-950 shadow-sm"
                : "text-stone-600 hover:text-stone-950"
            }`}
            onClick={() => switchInvoiceView("preview")}
            type="button"
          >
            Preview & print
          </button>
        </div>

        <div className="mt-8 grid min-w-0 gap-8">
          {activeView === "details" ? (
            <div className="grid min-w-0 gap-6">
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
              <div className="grid min-w-0 gap-4 md:grid-cols-3">
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-semibold text-stone-800">Invoice number</span>
                  <input
                    className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setInvoiceNumber(event.target.value)}
                    value={invoiceNumber}
                  />
                </label>
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-semibold text-stone-800">Invoice date</span>
                  <input
                    className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    onChange={(event) => setInvoiceDate(event.target.value)}
                    type="date"
                    value={invoiceDate}
                  />
                </label>
                <label className="grid min-w-0 gap-2">
                  <span className="text-sm font-semibold text-stone-800">Due date</span>
                  <input
                    className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
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
                    <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_7.5rem_8.5rem_8.5rem_auto]">
                      <label className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">
                          Description
                        </span>
                        <input
                          className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          onChange={(event) =>
                            updateLineItem(item.id, "description", event.target.value)
                          }
                          placeholder={`Item ${index + 1}`}
                          value={item.description}
                        />
                      </label>
                      <label className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">Quantity</span>
                        <input
                          className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateLineItem(item.id, "quantity", event.target.value)
                          }
                          placeholder="1"
                          type="number"
                          value={item.quantity}
                        />
                      </label>
                      <label className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">
                          Unit price ({currency})
                        </span>
                        <input
                          className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                          inputMode="decimal"
                          onChange={(event) =>
                            updateLineItem(item.id, "unitPrice", event.target.value)
                          }
                          placeholder="0.00"
                          type="number"
                          value={item.unitPrice}
                        />
                      </label>
                      <div className="grid min-w-0 gap-2">
                        <span className="text-sm font-semibold text-stone-800">Line total</span>
                        <div className="flex h-12 w-full min-w-0 items-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-950">
                          {formatCurrency(lineItemPreviewTotals[index] ?? 0)}
                        </div>
                      </div>
                      <div className="flex min-w-0 items-end">
                        <button
                          className="h-12 w-full rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 xl:w-auto"
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
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                onClick={resetInvoice}
                type="button"
              >
                Reset
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                onClick={() => switchInvoiceView("preview")}
                type="button"
              >
                Preview invoice
              </button>
            </div>
            </div>
          ) : (
            <div className="grid min-w-0 gap-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-stone-600">
                  Review your invoice before printing. The preview updates from the details you
                  entered.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-white"
                    onClick={() => switchInvoiceView("details")}
                    type="button"
                  >
                    Back to details
                  </button>
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    onClick={printInvoice}
                    type="button"
                  >
                    Print invoice
                  </button>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div
              className="invoice-print-area min-w-0 rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
              id="invoice-print-area"
              ref={invoicePreviewRef}
            >
              <div className="invoice-print-header flex flex-col gap-6 border-b border-stone-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Invoice from
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-stone-950">
                    {businessName || "Business name"}
                  </h2>
                  {businessContact ? (
                    <p className="invoice-print-muted mt-2 text-sm text-stone-600">
                      {businessContact}
                    </p>
                  ) : null}
                  {businessAddress ? (
                    <p className="invoice-print-muted mt-1 whitespace-pre-line text-sm text-stone-600">
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

              <div className="invoice-preview-lines mt-6 overflow-hidden rounded-xl border border-stone-200">
                <div className="invoice-preview-line invoice-preview-heading hidden bg-stone-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-500 sm:grid sm:grid-cols-[minmax(0,1.6fr)_4rem_6rem_6.5rem] sm:gap-2 sm:px-4">
                  <span>Description</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right leading-4">Unit Price</span>
                  <span className="text-right leading-4">Line Total</span>
                </div>
                <div className="divide-y divide-stone-100 bg-white">
                  {previewItems.map((item, index) => (
                    <div
                      className="invoice-preview-line grid min-w-0 gap-3 px-3 py-4 text-sm sm:grid-cols-[minmax(0,1.6fr)_4rem_6rem_6.5rem] sm:gap-2 sm:px-4 sm:py-3"
                      key={`${item.description}-${index}`}
                    >
                      <div className="min-w-0 sm:contents">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                          Description
                        </span>
                        <span className="mt-1 block min-w-0 break-words font-medium text-stone-900 sm:mt-0">
                          {item.description}
                        </span>
                      </div>
                      <div className="grid min-w-0 grid-cols-3 gap-3 sm:contents">
                        <div className="min-w-0">
                          <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                            Qty
                          </span>
                          <span className="mt-1 block text-left tabular-nums text-stone-600 sm:mt-0 sm:text-right">
                            {formatAmount(item.quantity)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                            Unit Price
                          </span>
                          <span className="mt-1 block text-left tabular-nums text-stone-600 sm:mt-0 sm:text-right">
                            {formatCurrency(item.unitPrice)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500 sm:hidden">
                            Line Total
                          </span>
                          <span className="mt-1 block text-left font-semibold tabular-nums text-stone-950 sm:mt-0 sm:text-right">
                            {formatCurrency(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="invoice-totals-wrap mt-6 flex justify-end">
                <div className="invoice-totals-box w-full max-w-xs rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="invoice-total-row flex justify-between gap-4 text-sm text-stone-600">
                    <span className="invoice-total-label">Subtotal</span>
                    <span className="invoice-total-amount font-semibold text-stone-950">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="invoice-total-row invoice-grand-total mt-3 flex justify-between gap-4 border-t border-stone-200 pt-3 text-base font-semibold text-stone-950">
                    <span className="invoice-total-label">Total</span>
                    <span className="invoice-total-amount">
                      {formatCurrency(total)}
                    </span>
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
          )}
        </div>
        </Card>
      </div>

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
