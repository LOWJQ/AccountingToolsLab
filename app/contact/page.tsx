import { ContactForm } from "@/components/contact/ContactForm";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact AccountingToolsLab",
  description:
    "Contact AccountingToolsLab with feedback, issue reports, or suggestions for future accounting tools.",
  path: "/contact"
});

const contactEmail = "accttoolslab@gmail.com";

const contactOptions = [
  {
    title: "Feedback and suggestions",
    text: "Share ideas for new accounting calculators, page improvements, or beginner-friendly explanations.",
    action: "Use feedback form",
    href: "#contact-form"
  },
  {
    title: "Report an issue",
    text: "Found a calculation problem, broken page, or confusing explanation? Report it so it can be reviewed.",
    action: "Use issue form",
    href: "#contact-form"
  },
  {
    title: "General contact",
    text: `For general questions about AccountingToolsLab. Direct email: ${contactEmail}.`,
    action: "Use contact form",
    href: "#contact-form"
  }
];

export default function ContactPage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Contact</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Get in touch about AccountingToolsLab
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            Have feedback, found an issue, or want to suggest a new accounting tool? You can
            reach out and help improve AccountingToolsLab.
          </p>
        </section>

        <section
          className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          id="contact-form"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-slate-500">Send a message</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
              Send feedback, report an issue, or ask a question
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Use the form below for feedback, issue reports, tool suggestions, or general
              questions. If the form is unavailable, email{" "}
              <span className="font-semibold text-slate-700">{contactEmail}</span> directly.
            </p>
          </div>
          <ContactForm />
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">Contact options</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                How to reach out
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Keep messages specific where possible so feedback can be reviewed clearly.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {contactOptions.map((option) => (
              <article
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                key={option.title}
              >
                <h3 className="text-base font-semibold text-stone-950">{option.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{option.text}</p>
                <a
                  className="mt-5 inline-flex rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600 ring-1 ring-stone-200 transition hover:text-stone-900"
                  href={option.href}
                >
                  {option.action}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Email tips</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              What to include
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              If you are reporting a calculator issue, include the tool name, the values you
              entered, the result you expected, and the result shown.
            </p>
            <a
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              href="#contact-form"
            >
              Use issue report form
            </a>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Direct email fallback:{" "}
              <span className="font-semibold text-stone-700">{contactEmail}</span>
            </p>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium tracking-wide text-slate-500">Helpful note</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Before you contact
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              AccountingToolsLab is a free educational tools site. Please avoid sending
              sensitive personal, financial, or confidential business information by email.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-wide text-slate-500">Keep exploring</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
                Create an invoice first
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
                Start with the free Invoice Generator, or explore the full set of accounting
                tools.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                href="/tools/invoice-generator"
              >
                Create Free Invoice
              </a>
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                href="/tools"
              >
                Explore Tools
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
