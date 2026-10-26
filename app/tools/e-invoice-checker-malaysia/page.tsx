import { EInvoiceRequirementChecker } from "@/components/calculators/EInvoiceRequirementChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import {
  EINVOICE_EXEMPTION_THRESHOLD,
  EINVOICE_PHASES,
  EINVOICE_GUIDELINE_URL,
  EINVOICE_SPECIFIC_GUIDELINE_URL,
  EINVOICE_LAST_REVIEWED
} from "@/lib/data/einvoice/phases";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { formatLongDate } from "@/lib/utils/format-date";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "e-Invoice Checker Malaysia | Do I Need to Issue e-Invoices?",
  description:
    "Check Malaysia e-Invoice scope using the RM3 million exemption, ownership exceptions, new-business start dates and Phase 4 relaxation through 2027.",
  path: "/tools/e-invoice-checker-malaysia"
});

const einvoiceFaqs = [
  {
    question: "Am I required to issue e-Invoices in Malaysia?",
    answer:
      "Turnover, business history and exemption conditions all matter. From 1 September 2026, businesses below RM3 million may qualify for the turnover exemption. Exactly RM3 million is not below the ceiling. Ownership or group links can exclude a business from the exemption, and new businesses have separate start-date rules."
  },
  {
    question: "What is the e-Invoice exemption threshold?",
    answer:
      "The ceiling is annual turnover or revenue below RM3 million, effective 1 September 2026. The exemption does not apply where a qualifying non-individual shareholder, holding company, related company or joint venture has annual revenue of at least RM3 million. Check General Guideline section 1.6.10 and any existing implementation obligation before relying on the exemption."
  },
  {
    question: "Which turnover figure does LHDN use to decide my phase?",
    answer:
      "For the original rollout, use FY2022 audited turnover or YA2022 tax-return revenue, adjusted to 12 months if necessary. New businesses and businesses that later reach a threshold need their applicable rules instead. A fall in current revenue does not automatically change an established implementation obligation."
  },
  {
    question: "What is the relaxation period?",
    answer:
      "The original first three phases had six-month windows. For taxpayers up to RM5 million with the 1 January or 1 July 2026 implementation date, the published relaxation runs through 31 December 2027. Relief under section 120 is conditional on following the consolidated e-Invoice and consolidated self-billed e-Invoice rules in Specific Guideline section 16; submissions are still required."
  },
  {
    question: "Is a PDF invoice an e-Invoice?",
    answer:
      "A PDF alone is not a validated e-Invoice. MyInvois validation is required under the applicable individual or consolidated submission rules. Eligible taxpayers using interim relaxation may provide ordinary receipts or invoices while meeting their consolidated submission obligations."
  },
  {
    question: "Can I issue e-Invoices voluntarily if I am exempt?",
    answer:
      "Yes. Exempt businesses may still register and issue e-Invoices voluntarily, and some buyers prefer or request it so their own records stay consistent. Being exempt means it is not compulsory, not that it is unavailable."
  },
  {
    question: "What happens if I do not comply after my phase starts?",
    answer:
      "Check your applicable implementation date and any conditional relief with LHDN. Interim relaxation is not a blanket waiver for ignoring submissions. The Specific Guideline sets out the consolidated submission conditions for relief from prosecution under section 120."
  },
  {
    question: "Does this checker submit anything to LHDN?",
    answer:
      "No. This tool runs in your browser. It uses the turnover, business history and ownership answers you supply to indicate a timetable or exemption. Uncertain or changed circumstances are flagged for confirmation; it cannot verify your registration or compliance status."
  }
];

const benefits = [
  {
    description:
      "Check the below-RM3-million ceiling together with business history and ownership exceptions.",
    title: "Check scope and exceptions"
  },
  {
    description:
      "See the original rollout or new-business timetable where your answers establish a start date.",
    title: "Find your indicated start date"
  },
  {
    description:
      "See the published relaxation end and the conditions that still require consolidated submissions.",
    title: "Understand conditional relief"
  }
];

const steps = [
  "Choose your business history and enter the relevant annual revenue in Malaysian ringgit.",
  "Below RM3 million, check whether an ownership or group exception applies.",
  "Review the indicated start date, potential exemption or request for confirmation.",
  "Review the notes, then confirm your position with LHDN before acting."
];

const readinessChecks = [
  "Use FY2022 or YA2022 revenue for the original rollout, and the relevant first-year figure for a new business.",
  "If your turnover sits close to a threshold, confirm your position with LHDN rather than assuming.",
  "Reaching RM3 million later, an existing mandate or a change in ownership can require a separate check.",
  "Follow the individual or consolidated submission rules that apply to your business.",
  "Treat this as a scope check, not confirmation that you are compliant."
];

/**
 * Links out to LHDN itself. The thresholds and dates on this page are only a
 * copy of what LHDN publishes, so the authority is one click away rather than
 * something a reader has to go and find.
 */
const officialResources = [
  {
    description: "Phases, thresholds, and the start date for each group of businesses.",
    href: EINVOICE_GUIDELINE_URL,
    label: "General Guideline v4.8 — scope and exemptions"
  },
  {
    description: "Section 16 sets out relaxation periods and consolidated submission conditions.",
    href: EINVOICE_SPECIFIC_GUIDELINE_URL,
    label: "Specific Guideline v4.9 — interim relaxation"
  },
  {
    description: "The portal where e-Invoices are submitted and validated.",
    href: "https://myinvois.hasil.gov.my/",
    label: "MyInvois portal"
  },
  {
    description: "Technical documentation, code lists, and API reference for developers.",
    href: "https://sdk.myinvois.hasil.gov.my/",
    label: "MyInvois SDK"
  }
];

const relatedTools = [
  {
    href: "/tools/invoice-generator",
    label: "Create a PDF Invoice"
  },
  {
    href: "/tools/sst-calculator-malaysia",
    label: "SST Calculator Malaysia"
  },
  {
    href: "/tools/cash-flow-calculator",
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools",
    label: "All Tools"
  }
];

function formatMyr(amount: number): string {
  return `RM${amount.toLocaleString("en-MY")}`;
}

function describeTurnoverRange(minTurnover: number, maxTurnover: number | null, minInclusive = false): string {
  if (maxTurnover === null) {
    return `Above ${formatMyr(minTurnover)}`;
  }

  return `${minInclusive ? "From" : "Above"} ${formatMyr(minTurnover)} up to ${formatMyr(maxTurnover)}`;
}

export default function EInvoiceCheckerMalaysiaPage() {
  const pageUrl = `${siteConfig.url}/tools/e-invoice-checker-malaysia`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "e-Invoice Checker Malaysia", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="e-Invoice Checker Malaysia"
        url={pageUrl}
      />
      <FAQJsonLd faqs={einvoiceFaqs} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="transition hover:text-slate-900" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li>
            <Link className="transition hover:text-slate-900" href="/tools">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="font-medium text-slate-700">e-Invoice Checker Malaysia</li>
        </ol>
      </nav>

      <div className="max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          e-Invoice Checker Malaysia
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Check whether your business must issue LHDN e-Invoices through MyInvois, which phase you
          fall into, and the date it starts.
        </p>
      </div>

      <EInvoiceRequirementChecker />

      {/* Sits below the tool: someone arriving from a search for a calculator
          wants the calculator, not an essay. The wording is kept self-contained
          so it still reads correctly when an answer engine lifts it away from
          the surrounding page. */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Do you need to issue e-Invoices in Malaysia?
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          From 1 September 2026, annual turnover below RM3 million may qualify for the
          small-business exemption. Exactly RM3 million does not qualify under that ceiling.
          Ownership and group exceptions must also be checked; a turnover figure alone cannot
          establish exemption.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          The original rollout uses FY2022 audited turnover or YA2022 tax-return revenue.
          Businesses starting during 2023–2025 generally use 1 July 2026 where their relevant
          revenue reaches RM3 million. For operations starting from 2026, the expected first-year
          revenue and commencement date matter. Changed turnover bands need a separate review.
        </p>
      </section>

      <p className="text-base leading-7 text-black">
        LHDN phases businesses into the e-Invoice mandate by annual turnover, starting with the
        largest. The current turnover exemption is below {formatMyr(EINVOICE_EXEMPTION_THRESHOLD)},
        subject to eligibility. This page was checked on {formatLongDate(EINVOICE_LAST_REVIEWED)}
        against General Guideline v4.8 and Specific Guideline v4.9.
      </p>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Why use this e-Invoice checker
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3 md:divide-x md:divide-slate-200">
          {benefits.map((benefit) => (
            <div className="md:px-8 md:first:pl-0 md:last:pr-0" key={benefit.title}>
              <h3 className="text-base font-semibold text-slate-950">{benefit.title}</h3>
              <p className="mt-2 text-base leading-7 text-black">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          How to use this e-Invoice checker
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
          {steps.map((step) => (
            <li className="pl-2" key={step}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Malaysia e-Invoice implementation phases
        </h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-black">
          These are the original rollout dates with the current turnover scope. Phase 4 relaxation
          now runs to 31 December 2027 for the published January/July 2026 groups. Relief depends
          on meeting the consolidated submission conditions. Check the{" "}
          <a
            className="font-semibold underline-offset-4 hover:underline"
            href={EINVOICE_GUIDELINE_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            current LHDN General Guideline
          </a>
          .
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Phase
                </th>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Annual turnover
                </th>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Mandatory from
                </th>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Relaxation ends
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {EINVOICE_PHASES.map((phase) => (
                <tr key={phase.id}>
                  <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                    {phase.label}
                  </th>
                  <td className="px-4 py-3 font-medium text-black">
                    {describeTurnoverRange(phase.minTurnover, phase.maxTurnover, phase.minInclusive)}
                  </td>
                  <td className="px-4 py-3 font-medium text-black">
                    {formatLongDate(phase.mandatoryFrom)}
                  </td>
                  <td className="px-4 py-3 font-medium text-black">
                    {phase.relaxationEndsOn === null
                      ? "Not published"
                      : formatLongDate(phase.relaxationEndsOn)}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-black" scope="row">
                  Potential turnover exemption
                </th>
                <td className="px-4 py-3 font-semibold text-black">
                  Below {formatMyr(EINVOICE_EXEMPTION_THRESHOLD)}; eligibility conditions apply
                </td>
                <td className="px-4 py-3 font-semibold text-black">Not applicable</td>
                <td className="px-4 py-3 font-semibold text-black">Not applicable</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          New-business dates and ownership exceptions can differ from this table. If a business
          starting from 2026 expects first-year revenue below the ceiling and later reaches it,
          the guideline provides a 1 January start in the second year after the threshold year.
          Confirm the relevant year and any existing mandate with LHDN.
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Before you rely on the result
        </h2>
        <ul className="mt-5 space-y-3 border-l-2 border-slate-300 pl-6 text-base leading-7 text-black">
          {readinessChecks.map((check) => (
            <li className="flex items-start gap-3" key={check}>
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Official LHDN e-Invoice resources
        </h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-black">
          LHDN is the authority on who must issue e-Invoices and from when. Check these before
          acting on anything you read here.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {officialResources.map((resource) => (
            <a
              className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              href={resource.href}
              key={resource.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold leading-7 text-black">
                  {resource.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {resource.description}
                </span>
              </span>
              <ExternalLink
                aria-hidden="true"
                className="mt-1.5 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-slate-900"
              />
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Related Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map((tool) => (
            <Link
              className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-7 text-black transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              href={tool.href}
              key={tool.href}
            >
              <span className="min-w-0 flex-1">{tool.label}</span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
              />
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuideCard
        eyebrow="e-Invoice Guide"
        showTopBorder={false}
        slug="what-is-a-tin-number-malaysia"
      />

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={einvoiceFaqs} title="Malaysia e-Invoice FAQs" />
      </section>
    </ToolPageLayout>
  );
}
