import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of Use | AccountingToolsLab",
  description:
    "Read the starter Terms of Use for AccountingToolsLab's free accounting tools and educational content.",
  path: "/terms"
});

const termsSections = [
  {
    title: "Acceptance of terms",
    content: [
      "By using AccountingToolsLab, you agree to these Terms.",
      "If you do not agree with these Terms, you should not use the site."
    ]
  },
  {
    title: "Educational purpose",
    content: [
      "AccountingToolsLab provides educational tools and beginner-friendly explanations.",
      "The site is not a substitute for professional accounting, tax, legal, or financial advice."
    ]
  },
  {
    title: "Accuracy of tools",
    content: [
      "The site aims to provide useful and accurate calculations.",
      "Users are responsible for checking results before relying on them. Mistakes, bugs, or outdated explanations may occur."
    ]
  },
  {
    title: "User responsibilities",
    content: [
      "Users should use the tools lawfully, avoid submitting sensitive or confidential information, and not misuse, disrupt, scrape aggressively, or attack the site.",
      "Users should not rely on results as the only basis for important financial decisions."
    ]
  },
  {
    title: "No professional relationship",
    content: [
      "Use of the site does not create an accountant-client, adviser-client, or other professional relationship."
    ]
  },
  {
    title: "Intellectual property",
    content: [
      "The website design, content, explanations, and tool structure belong to AccountingToolsLab unless otherwise stated.",
      "Users may use the tools for personal learning and basic checking. Users should not copy, resell, or republish substantial parts of the site without permission."
    ]
  },
  {
    title: "Third-party links",
    content: [
      "The site may later contain links to external resources or services.",
      "AccountingToolsLab is not responsible for the content or practices of external websites."
    ]
  },
  {
    title: "Future monetization",
    content: [
      "The site may later include ads, affiliate links, paid templates, or premium features.",
      "If those are added, the relevant pages and policies should be updated."
    ]
  },
  {
    title: "Limitation of liability",
    content: [
      "The site is provided as-is.",
      "AccountingToolsLab is not responsible for losses caused by reliance on the tools or content. Users should verify important accounting or financial matters with a qualified professional."
    ]
  },
  {
    title: "Changes to terms",
    content: [
      "These Terms may be updated as the site develops.",
      "Continued use of the site means acceptance of the updated Terms."
    ]
  }
];

export default function TermsPage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Terms</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Terms for using AccountingToolsLab
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            These Terms explain the basic rules for using AccountingToolsLab&apos;s free accounting
            tools and educational content.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
            Last updated: May 4, 2026
          </p>
        </section>

        <section className="grid gap-4">
          {termsSections.map((section) => (
            <article
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
              key={section.title}
            >
              <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.content.map((paragraph) => (
                  <p className="text-sm leading-6 text-stone-600 sm:text-base" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-slate-500">Contact</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
            Questions about these Terms?
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use the contact page for questions about these starter Terms or future updates.
          </p>
          <a
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            href="/contact"
          >
            Contact AccountingToolsLab
          </a>
        </section>
      </main>
    </div>
  );
}
