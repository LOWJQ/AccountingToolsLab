"use client";

type InvoiceMetaProps = {
  dueDate: string;
  invoiceDate: string;
  invoiceNumber: string;
  onDueDateChange: (value: string) => void;
  onInvoiceDateChange: (value: string) => void;
  onInvoiceNumberChange: (value: string) => void;
};

export function InvoiceMeta({
  dueDate,
  invoiceDate,
  invoiceNumber,
  onDueDateChange,
  onInvoiceDateChange,
  onInvoiceNumberChange
}: InvoiceMetaProps) {
  return (
    <section className="grid gap-4">
      <h2 className="text-base font-semibold text-stone-950">Invoice details</h2>
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Invoice number</span>
          <input
            className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onInvoiceNumberChange(event.target.value)}
            value={invoiceNumber}
          />
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Invoice date</span>
          <input
            className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onInvoiceDateChange(event.target.value)}
            type="date"
            value={invoiceDate}
          />
        </label>
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-semibold text-stone-800">Due date</span>
          <input
            className="h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            onChange={(event) => onDueDateChange(event.target.value)}
            type="date"
            value={dueDate}
          />
        </label>
      </div>
    </section>
  );
}
