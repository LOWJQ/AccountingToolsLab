import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Editorial Policy | How AccountingToolsLab Researches Its Content",
  description:
    "How the tools and guides on AccountingToolsLab are researched, which official sources they draw on, how often they are reviewed, and what they are not.",
  path: "/editorial-policy"
});

const editorialSections = [
  {
    title: "Primary sources first",
    content: [
      "Rules, rates, thresholds, and code lists are taken from what the relevant Malaysian authority publishes, not from summaries written by other websites.",
      "Where a page states a rate, a threshold, or a deadline, the official page it came from is linked so you can check it yourself. Guides that rely on published Malaysian guidance carry a Sources section listing those pages and the date they were last checked."
    ]
  },
  {
    title: "Reference data is copied, not retyped",
    content: [
      "Reference data such as the MSIC codes and the e-Invoice classification codes is taken directly from the files LHDN publishes, rather than transcribed by hand.",
      "The source URL and the retrieval date are recorded alongside the data. When an authority updates a list, the data is replaced from the source again instead of being edited in place."
    ]
  },
  {
    title: "Tools calculate, they do not advise",
    content: [
      "Every calculator on this site runs entirely in your browser. It performs arithmetic, a lookup, or a format check on the figures you enter.",
      "A tool does not decide whether a rule applies to your situation, and it does not submit anything to LHDN, MyInvois, or any official system. Nothing you type is sent to a server."
    ]
  },
  {
    title: "Dates are shown, not implied",
    content: [
      "Each guide shows the date it was last updated, and pages built on published code lists state when that data was retrieved.",
      "Malaysian tax rules change, so a visible date is more useful than a claim that a page is current. If a date looks old relative to a rule you are checking, treat the authority's page as correct."
    ]
  },
  {
    title: "Limits are stated on the page",
    content: [
      "Where a result depends on a judgement this site cannot make for you, such as whether a particular service is taxable or which implementation phase your business falls into, the page says so.",
      "In those cases the page points to the authority rather than guessing, and explains what the tool checked and what it did not."
    ]
  },
  {
    title: "What this site is not",
    content: [
      "Nothing here is tax, legal, or accounting advice, and using a tool on this site does not create a professional relationship.",
      "The calculators work out figures from what you type, and the guides explain published rules in plain language. Neither can take account of your particular circumstances.",
      "Decisions that affect what you owe, what you file, or what you are registered for should be confirmed with the relevant authority or a qualified tax or accounting professional. That is especially true where a figure sits close to a threshold, or where a classification is open to interpretation."
    ]
  },
  {
    title: "Corrections",
    content: [
      "If something on this site is wrong or out of date, please say so through the contact page.",
      "Corrections are made to the page itself and the update date is changed, rather than the content being altered quietly."
    ]
  }
];

const sources = [
  {
    description: "Income tax, e-Invoice, and the MyInvois system.",
    href: "https://www.hasil.gov.my/en/",
    label: "Lembaga Hasil Dalam Negeri (LHDN / HASiL)"
  },
  {
    description: "Technical documentation and the published e-Invoice code lists.",
    href: "https://sdk.myinvois.hasil.gov.my/",
    label: "MyInvois SDK"
  },
  {
    description: "Sales and Service Tax registration, rates, and industry guides.",
    href: "https://mysst.customs.gov.my/",
    label: "MySST, Royal Malaysian Customs Department"
  },
  {
    description: "Business registration and company information.",
    href: "https://www.ssm.com.my/",
    label: "Companies Commission of Malaysia (SSM)"
  }
];

/**
 * One numbered row of the policy. Shared so the sources list sits in the same
 * rhythm as the prose sections instead of arriving as a separate card, which
 * left a bordered list nested inside a bordered panel.
 */
function PolicySection({
  children,
  index,
  isLast = false,
  title
}: {
  children: ReactNode;
  index: number;
  isLast?: boolean;
  title: string;
}) {
  return (
    <section
      className={`grid gap-4 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-6 ${
        isLast ? "" : "border-b border-slate-200"
      }`}
    >
      <div>
        <span className="text-base font-semibold tabular-nums text-teal-700">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="border-slate-200 md:border-l md:pl-8">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function EditorialPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Editorial Policy", url: `${siteConfig.url}/editorial-policy` }
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
                <li className="font-medium text-slate-700">Editorial Policy</li>
              </ol>
            </nav>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              How Accounting Tools Lab researches its content
            </h1>
            <p className="mt-5 text-base leading-7 text-black">
              Accounting Tools Lab publishes free calculators and plain-language guides for small
              businesses, freelancers, and students in Malaysia. This page explains how that content
              is put together, what it is based on, and where its limits are.
            </p>
            <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
              <span>Last updated</span>
              <span className="text-slate-950">August 19, 2026</span>
            </p>
            <div className="mt-8 border-t border-slate-200" />
          </Container>
        </section>

        <Container className="gap-0 pb-12 pt-0 sm:pb-16 sm:pt-0">
          <article>
            {editorialSections.map((section, index) => (
              <PolicySection index={index} key={section.title} title={section.title}>
                <div className="mt-3 space-y-3">
                  {section.content.map((paragraph) => (
                    <p className="text-base leading-7 text-black" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </PolicySection>
            ))}

            {/* Last section, so it carries no bottom rule. */}
            <PolicySection
              index={editorialSections.length}
              isLast
              title="The authorities this site relies on"
            >
              <p className="mt-3 text-base leading-7 text-black">
                Malaysian tax and business content here is based on material published by these
                bodies. They are the authority; this site is a convenience layer over what they
                publish.
              </p>
              <ul className="mt-4 divide-y divide-slate-200">
                {sources.map((source) => (
                  <li className="py-3 first:pt-0 last:pb-0" key={source.href}>
                    <a
                      className="text-base font-semibold text-slate-950 underline-offset-4 hover:underline"
                      href={source.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {source.label}
                    </a>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{source.description}</p>
                  </li>
                ))}
              </ul>
            </PolicySection>
          </article>

          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">Contact</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Spotted something wrong?
                </h2>
                <p className="mt-3 text-base leading-7 text-black">
                  Use the contact page to report an error or an out-of-date figure.
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
