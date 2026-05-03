import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AccountingToolsLab",
  description:
    "Read the starter Privacy Policy for AccountingToolsLab, including how privacy may be handled as the site develops."
};

const privacySections = [
  {
    title: "Current status",
    content: [
      "AccountingToolsLab is currently an early-stage educational tools website.",
      "The site currently provides free accounting tools and informational content.",
      "The site does not currently require user accounts, process payments, or store calculator entries in a user account."
    ]
  },
  {
    title: "Information you provide",
    content: [
      "If you contact the site by email or through a future contact form, AccountingToolsLab may receive the name, email address, and message content you provide.",
      "Calculator inputs are used to show results in the browser. The current site should not be treated as permanently storing calculator inputs unless a future feature clearly explains that storage."
    ]
  },
  {
    title: "Automatically collected information",
    content: [
      "The site may collect basic technical information through hosting logs, such as browser type, device type, pages visited, and approximate technical usage data.",
      "If analytics tools such as Google Analytics are added later, this Privacy Policy should be updated to explain that use."
    ]
  },
  {
    title: "Cookies and similar technologies",
    content: [
      "The current version may use only essential technologies needed for the website to function.",
      "If analytics, advertising, or affiliate tools are added later, cookies or similar technologies may be used and this policy should be updated."
    ]
  },
  {
    title: "How information is used",
    content: [
      "Information may be used to operate and improve the website, respond to messages, fix bugs, improve tools, and understand general site performance if analytics are added later."
    ]
  },
  {
    title: "Third-party services",
    content: [
      "The site may use third-party services for hosting and deployment, such as Vercel or similar hosting providers.",
      "If analytics, advertising, AI APIs, payment processors, or affiliate services are added later, this section should be updated."
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <p className="text-sm font-medium tracking-wide text-slate-500">Privacy Policy</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            How AccountingToolsLab handles privacy
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            This Privacy Policy explains what information AccountingToolsLab may collect, how it
            is used, and what may change as the site develops.
          </p>
          <p className="mt-6 inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
            Last updated: May 4, 2026
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
            Use the contact page for questions about this starter Privacy Policy or future privacy
            updates.
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
