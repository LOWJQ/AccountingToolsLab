import { EInvoiceCodeLookup } from "@/components/calculators/EInvoiceCodeLookup";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideCard } from "@/components/tools/RelatedGuideCard";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "MSIC and Classification Code Lookup Malaysia | e-Invoice Codes",
  description:
    "Search LHDN e-Invoice codes by keyword or number. Find the 5-digit MSIC code for your business activity and the 3-digit classification code for each invoice line item.",
  path: "/tools/e-invoice-code-lookup-malaysia"
});

const codeFaqs = [
  {
    question: "What is an MSIC code?",
    answer:
      "MSIC stands for Malaysia Standard Industrial Classification. It is a five-digit code describing what your business does, such as 56101 for restaurants. On an e-Invoice it identifies the supplier's business activity, so you use your own MSIC code rather than your customer's."
  },
  {
    question: "What is a classification code on an e-Invoice?",
    answer:
      "It is a three-digit code describing what is being sold, and it is required on every line item of an e-Invoice. LHDN publishes 45 of them, covering categories such as education fees, medical expenses, and reimbursements. They are not the same as MSIC codes."
  },
  {
    question: "Which classification code should I use if nothing fits?",
    answer:
      "LHDN provides 022 (Others) as the fallback. Use a more specific code when one clearly matches what you are selling, since some categories exist to support tax relief claims by the buyer, and reach for 022 only when nothing else applies."
  },
  {
    question: "Where do I find my MSIC code?",
    answer:
      "Your MSIC code is usually recorded on your SSM business registration and in your LHDN tax profile. Search this tool by keyword to find the likely match, then confirm it against your registration documents rather than picking one that merely sounds close."
  },
  {
    question: "Can one business have more than one MSIC code?",
    answer:
      "A business can carry out several activities, but an e-Invoice submission uses the MSIC code registered as your main business activity. If your activities have changed significantly since registration, check with SSM and LHDN rather than substituting a different code yourself."
  },
  {
    question: "Do MSIC and classification codes ever change?",
    answer:
      "Yes. LHDN maintains both lists and publishes updates. The codes in this tool were taken from LHDN's published code lists on 18 August 2026. Check the MyInvois SDK for the current version before relying on a code for a submission."
  },
  {
    question: "Does my accounting software pick these codes for me?",
    answer:
      "Usually not. Accounting software can submit e-Invoices to MyInvois for you, but it generally still asks you to choose the classification code for each product or service, and to enter your MSIC code during setup. That is why the codes remain worth looking up even when your software handles submission."
  }
];

const benefits = [
  {
    description:
      "Search by plain words instead of scrolling a long official table. Type what you sell and see the matching codes.",
    title: "Search by keyword"
  },
  {
    description:
      "Enter a code you already have and see exactly what LHDN says it means, so you can confirm the right one was used.",
    title: "Check a code in reverse"
  },
  {
    description:
      "Both lists come straight from LHDN's published code files, with the exact official wording rather than a paraphrase.",
    title: "Official wording"
  }
];

const steps = [
  "Choose whether you need a line item code or a business activity code.",
  "Type a keyword such as restaurant, or type the code itself.",
  "Read the official description to confirm it matches what you mean.",
  "Copy the code into your invoice or accounting software."
];

const codeChecks = [
  "A classification code is needed on every line item, not once per invoice.",
  "The MSIC code on an e-Invoice is the supplier's, not the buyer's.",
  "Use 022 (Others) only when no more specific classification code applies.",
  "Confirm your MSIC code against your SSM registration rather than guessing from a keyword match.",
  "LHDN updates these lists, so check the SDK before relying on a code for a submission."
];

const officialResources = [
  {
    description: "LHDN's published code lists, including MSIC and classification codes.",
    href: "https://sdk.myinvois.hasil.gov.my/codes/",
    label: "MyInvois SDK code lists"
  },
  {
    description: "The portal where e-Invoices are submitted and validated.",
    href: "https://myinvois.hasil.gov.my/",
    label: "MyInvois portal"
  }
];

const relatedTools = [
  {
    href: "/tools/e-invoice-checker-malaysia",
    icon: toolIcons.eInvoice,
    label: "e-Invoice Checker"
  },
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
    href: "/tools",
    icon: toolIcons.allTools,
    label: "All Tools"
  }
];

export default function EInvoiceCodeLookupMalaysiaPage() {
  const pageUrl = `${siteConfig.url}/tools/e-invoice-code-lookup-malaysia`;

  return (
    <ToolPageLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "e-Invoice Code Lookup Malaysia", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="e-Invoice Code Lookup Malaysia"
        url={pageUrl}
      />
      <FAQJsonLd faqs={codeFaqs} />
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
          <li className="font-medium text-slate-700">e-Invoice Code Lookup Malaysia</li>
        </ol>
      </nav>

      <div className="max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          MSIC and Classification Code Lookup
        </h1>
        <p className="mt-3 text-base leading-7 text-black">
          Search LHDN e-Invoice codes by keyword or number. Find the MSIC code for your business
          activity and the classification code for each invoice line item.
        </p>
      </div>

      <EInvoiceCodeLookup />

      <p className="text-base leading-7 text-black">
        An e-Invoice needs two different kinds of code. The five-digit MSIC code says what your
        business does and is entered once as the supplier. The three-digit classification code says
        what is being sold and is needed on every single line item. Both lists here come from
        LHDN&apos;s published code files.
      </p>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          MSIC codes and classification codes are not the same
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col" />
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  MSIC code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-black" scope="col">
                  Classification code
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Length
                </th>
                <td className="px-4 py-3 font-medium text-black">5 digits</td>
                <td className="px-4 py-3 font-medium text-black">3 digits</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Describes
                </th>
                <td className="px-4 py-3 font-medium text-black">What your business does</td>
                <td className="px-4 py-3 font-medium text-black">What you are selling</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  How often
                </th>
                <td className="px-4 py-3 font-medium text-black">Once, as the supplier</td>
                <td className="px-4 py-3 font-medium text-black">On every line item</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-left font-medium text-black" scope="row">
                  Example
                </th>
                <td className="px-4 py-3 font-medium text-black">
                  56101 Restaurants and restaurant cum night clubs
                </td>
                <td className="px-4 py-3 font-medium text-black">022 Others</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Why use this code lookup
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
          How to use this code lookup
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
          Before you use a code
        </h2>
        <ul className="mt-5 space-y-3 border-l-2 border-slate-300 pl-6 text-base leading-7 text-black">
          {codeChecks.map((check) => (
            <li className="flex items-start gap-3" key={check}>
              <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-700" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Official LHDN code lists
        </h2>
        <p className="mt-3 max-w-5xl text-base leading-7 text-black">
          These codes were taken from LHDN&apos;s published code files on 18 August 2026. LHDN is
          the authority, so check the source before relying on a code for a submission.
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
        <FAQSection eyebrow="" faqs={codeFaqs} title="MSIC and Classification Code FAQs" />
      </section>
    </ToolPageLayout>
  );
}
