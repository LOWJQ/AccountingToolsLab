import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Terms", url: `${siteConfig.url}/terms` }
        ]}
      />

      <main className="bg-white">
        <section className="w-full bg-white">
          <Container className="gap-0 pb-0 pt-12 sm:pb-0 sm:pt-16">
            <nav aria-label="Breadcrumb" className="mb-10 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link className="transition hover:text-slate-900" href="/">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">&gt;</li>
                <li className="font-medium text-slate-700">Terms</li>
              </ol>
            </nav>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Terms for using Accounting Tools Lab
            </h1>
            <p className="mt-5 text-base leading-7 text-black">
              These Terms explain the basic rules for using Accounting Tools Lab&apos;s free
              accounting tools and educational content.
            </p>
            <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
              <span>Last updated</span>
              <span className="text-slate-950">May 4, 2026</span>
            </p>
            <div className="mt-8 border-t border-slate-200" />
          </Container>
        </section>

        <Container className="gap-0 pb-12 pt-0 sm:pb-16 sm:pt-0">
        <article>
          {termsSections.map((section, index) => (
            <section
              className={`grid gap-4 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-6 ${
                index < termsSections.length - 1 ? "border-b border-slate-200" : ""
              }`}
              key={section.title}
            >
              <div>
                <span className="text-base font-semibold tabular-nums text-teal-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="border-slate-200 md:border-l md:pl-8">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.content.map((paragraph) => (
                    <p className="text-base leading-7 text-black" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </article>

        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Contact</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Questions about these Terms?
              </h2>
              <p className="mt-3 text-base leading-7 text-black">
                Use the contact page for questions about these starter Terms or future updates.
              </p>
            </div>
            <Link
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-fit"
              href="/contact"
            >
              Contact AccountingToolsLab
            </Link>
          </div>
        </section>
        </Container>
      </main>
    </>
  );
}
