import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy | AccountingToolsLab",
  description:
    "Read the Privacy Policy for AccountingToolsLab, including analytics, local preferences, and calculator input handling.",
  path: "/privacy-policy"
});

const privacySections = [
  {
    title: "Current status",
    content: [
      "AccountingToolsLab provides free accounting tools and informational content.",
      "No account is required to use the site.",
      "The site does not process payments or store calculator entries in a user account."
    ]
  },
  {
    title: "Information you provide",
    content: [
      "If you contact the site by email, AccountingToolsLab may receive the email address, subject, and message content you provide.",
      "If you submit the contact form, AccountingToolsLab may receive the name, email address, topic, subject, message, page/tool URL, and basic technical information needed to process the message.",
      "Calculator inputs are processed in the browser where applicable to show results. Do not enter sensitive personal, financial, or confidential business information into calculators."
    ]
  },
  {
    title: "Automatically collected information",
    content: [
      "The site may collect basic technical information through hosting logs, such as browser type, device type, pages visited, and approximate technical usage data.",
      "AccountingToolsLab uses Vercel Analytics to understand general page usage and Vercel Speed Insights to understand site performance."
    ]
  },
  {
    title: "Local storage and similar technologies",
    content: [
      "The site may save your selected currency preference in the browser using localStorage so the same currency remains selected after refresh.",
      "Analytics and performance services may use privacy-conscious technical signals to measure site usage and speed."
    ]
  },
  {
    title: "How information is used",
    content: [
      "Information may be used to operate and improve the website, respond to messages, fix bugs, improve tools, and understand general site performance."
    ]
  },
  {
    title: "Third-party services",
    content: [
      "The site uses Vercel for hosting and deployment.",
      "The site uses Vercel Analytics and Vercel Speed Insights for aggregate usage and performance information."
    ]
  },
  {
    title: "Educational use",
    content: [
      "AccountingToolsLab is designed for learning and basic checking.",
      "Users should not submit sensitive personal, financial, or confidential business information into calculators."
    ]
  },
  {
    title: "Children and students",
    content: [
      "The site is intended as an educational resource, and users should avoid submitting personal information unnecessarily.",
      "If a user is below the age required by their local law to consent to data processing, they should use the site with guidance from a parent, guardian, or teacher."
    ]
  },
  {
    title: "Changes to this policy",
    content: [
      "This Privacy Policy may be updated as new features are added.",
      "The Last updated date should be changed when updates are made."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-stone-50 text-stone-950">
      <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Privacy Policy</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            How AccountingToolsLab handles privacy
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            This Privacy Policy explains what information AccountingToolsLab may collect, how it
            is used, and how browser-based preferences and analytics are handled.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
            Last updated: May 7, 2026
          </p>
        </section>

        <section className="grid gap-4">
          {privacySections.map((section) => (
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
            Questions about privacy?
          </h2>
          <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
            Use the contact page for questions about this Privacy Policy.
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
