import { EInvoiceRequirementChecker } from "@/components/calculators/EInvoiceRequirementChecker";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import {
  EINVOICE_EXEMPTION_THRESHOLD,
  EINVOICE_PHASES
} from "@/lib/data/einvoice/phases";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "e-Invoice Checker Malaysia | Am I Required to Issue e-Invoices?",
  description:
    "Check whether your business must issue LHDN e-Invoices through MyInvois. Enter your annual turnover to see your phase, your mandatory start date, and the RM1 million exemption.",
  path: "/tools/e-invoice-checker-malaysia"
});

const einvoiceFaqs = [
  {
    question: "Am I required to issue e-Invoices in Malaysia?",
    answer:
      "It depends on your annual turnover. Businesses with annual turnover above RM1 million are phased into the LHDN e-Invoice mandate, with the largest businesses starting first. Businesses at or below RM1 million are currently exempt. Enter your turnover in the checker above to see which phase applies to you."
  },
  {
    question: "What is the e-Invoice exemption threshold?",
    answer:
      "Businesses with annual turnover at or below RM1 million are exempt. The threshold was raised from RM500,000 to RM1 million with effect from 1 January 2026. The originally planned final phase for businesses below that level was cancelled rather than postponed, so there is no later start date waiting for them."
  },
  {
    question: "Which turnover figure does LHDN use to decide my phase?",
    answer:
      "LHDN places a business into a phase using its FY2022 annual turnover, not what it earns today. If your current turnover differs from your FY2022 figure, check both, and confirm your position with LHDN if the two fall on different sides of a threshold."
  },
  {
    question: "What is the relaxation period?",
    answer:
      "Each phase has a six-month relaxation period after its start date. During relaxation LHDN does not impose penalties, and businesses may issue consolidated e-Invoices and use more flexible descriptions. The requirement itself still applies during relaxation, so it is a grace period on enforcement rather than a delay to the start date."
  },
  {
    question: "Is a PDF invoice an e-Invoice?",
    answer:
      "No. An e-Invoice is structured data submitted to the MyInvois system and validated by LHDN before you give it to your customer. The validated document comes back with a unique identifier and a QR code. A PDF or a printed invoice on its own does not meet the requirement."
  },
  {
    question: "Can I issue e-Invoices voluntarily if I am exempt?",
    answer:
      "Yes. Exempt businesses may still register and issue e-Invoices voluntarily, and some buyers prefer or request it so their own records stay consistent. Being exempt means it is not compulsory, not that it is unavailable."
  },
  {
    question: "What happens if I do not comply after my phase starts?",
    answer:
      "Once the relaxation period for your phase has ended, non-compliance can attract penalties. Fines have been reported in the range of RM200 to RM20,000 per offence. Confirm the current penalty position with LHDN or a qualified tax adviser, since enforcement details change."
  },
  {
    question: "Does this checker submit anything to LHDN?",
    answer:
      "No. This tool runs entirely in your browser and does not connect to MyInvois. It compares the turnover you enter against LHDN's published phase thresholds and dates. It cannot confirm your registration status and is not a substitute for advice from LHDN or a qualified tax adviser."
  }
];

const benefits = [
  {
    description:
      "Enter one figure and see whether the mandate applies to you, or whether you fall under the RM1 million exemption.",
    title: "A straight answer on scope"
  },
  {
    description:
      "See your phase, the date it became or becomes mandatory, and how many days sit between that date and today.",
    title: "Know your actual deadline"
  },
  {
    description:
      "Check where the relaxation period sits, so you know whether you are in the penalty-free window or past it.",
    title: "Understand the grace period"
  }
];

const steps = [
  "Enter your annual turnover in Malaysian ringgit.",
  "Read your position: exempt, upcoming, or required now.",
  "Check the phase and the mandatory start date shown beside it.",
  "Review the notes, then confirm your position with LHDN before acting."
];

const readinessChecks = [
  "Use your FY2022 turnover, since that is the figure LHDN phases businesses on.",
  "If your turnover sits close to a threshold, confirm your position with LHDN rather than assuming.",
  "Being exempt today does not lock in the position if your turnover later rises above RM1 million.",
  "A validated e-Invoice must reach your buyer, not just your accounting system.",
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
    href: "https://www.hasil.gov.my/en/e-invois/pelaksanaan-e-invois-di-malaysia/",
    label: "e-Invoice implementation in Malaysia"
  },
  {
    description: "LHDN's main e-Invoice section, including guidelines and announcements.",
    href: "https://www.hasil.gov.my/en/e-invois/",
    label: "LHDN e-Invoice"
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
    icon: toolIcons.invoice,
    label: "Create a PDF Invoice"
  },
  {
    href: "/tools/sst-calculator-malaysia",
    icon: toolIcons.sst,
    label: "SST Calculator Malaysia"
  },
  {
    href: "/tools/cash-flow-calculator",
    icon: toolIcons.cashFlow,
    label: "Cash Flow Calculator"
  },
  {
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

function formatMyr(amount: number): string {
  return `RM${amount.toLocaleString("en-MY")}`;
}

function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric"
  });
}

function describeTurnoverRange(minTurnover: number, maxTurnover: number | null): string {
  if (maxTurnover === null) {
    return `Above ${formatMyr(minTurnover)}`;
  }

  return `Above ${formatMyr(minTurnover)} up to ${formatMyr(maxTurnover)}`;
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

      <p className="text-base leading-7 text-black">
        LHDN phases businesses into the e-Invoice mandate by annual turnover, starting with the
        largest. Businesses at or below {formatMyr(EINVOICE_EXEMPTION_THRESHOLD)} in annual turnover
        are currently exempt. This checker compares the figure you enter against the published
        thresholds and start dates so you can see where you stand.
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
          Each phase has a start date and a six-month relaxation period during which LHDN does not
          impose penalties. These dates and thresholds are set by LHDN, and the current position is
          published on the{" "}
          <a
            className="font-semibold underline-offset-4 hover:underline"
            href="https://www.hasil.gov.my/en/e-invois/pelaksanaan-e-invois-di-malaysia/"
            rel="noopener noreferrer"
            target="_blank"
          >
            e-Invoice implementation page on the LHDN website
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
                    {describeTurnoverRange(phase.minTurnover, phase.maxTurnover)}
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
                  Exempt
                </th>
                <td className="px-4 py-3 font-semibold text-black">
                  {formatMyr(EINVOICE_EXEMPTION_THRESHOLD)} and below
                </td>
                <td className="px-4 py-3 font-semibold text-black">Not applicable</td>
                <td className="px-4 py-3 font-semibold text-black">Not applicable</td>
              </tr>
            </tbody>
          </table>
        </div>
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
          {relatedTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                className="group flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold leading-7 text-black transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                href={tool.href}
                key={tool.href}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-700" />
                <span className="min-w-0 flex-1">{tool.label}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
                />
              </Link>
            );
          })}
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
