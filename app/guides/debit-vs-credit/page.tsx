import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debit vs Credit | Coming Soon",
  alternates: {
    canonical: "/guides/debit-vs-credit"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function DebitVsCreditGuidePage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Accounting Guide</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Debit vs Credit
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            This guide is still being prepared. It will explain how debits and credits work,
            which accounts increase on each side, and how beginners can remember the basics.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
            Guide coming soon
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Browse available guides
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            For now, use the guides directory to find the accounting guides that are ready to
            read.
          </p>
          <a
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            href="/guides"
          >
            Back to Guides
          </a>
        </section>
      </main>
    </div>
  );
}
