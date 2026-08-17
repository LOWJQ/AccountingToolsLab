import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createGuideMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "Do I Need to Register for SST in Malaysia?";
const guidePath = "/guides/do-i-need-to-register-for-sst-malaysia";
const pageDescription =
  "Use this step-by-step screening guide to identify whether your business provides taxable goods or services, find the relevant registration threshold, and test your taxable turnover over 12 months.";

export const metadata = createGuideMetadata({
  slug: "do-i-need-to-register-for-sst-malaysia",
  title: "Do I Need to Register for SST in Malaysia?",
  description:
    "Check whether your Malaysian business may need SST registration. Identify sales or service tax, find the correct threshold, and test 12-month taxable turnover."
});

const tableOfContents = [
  { label: "Quick registration test", href: "#quick-test" },
  { label: "Key terms", href: "#key-terms" },
  { label: "Sales tax or service tax", href: "#tax-type" },
  { label: "Taxable category", href: "#taxable-category" },
  { label: "12-month turnover test", href: "#turnover-test" },
  { label: "Decision examples", href: "#examples" },
  { label: "How to register", href: "#how-to-register" },
  { label: "After registration", href: "#after-registration" },
  { label: "Registration checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "SST",
    meaning:
      "Sales and Service Tax. Despite the name, it is a system containing two separate taxes: sales tax and service tax."
  },
  {
    term: "RMCD",
    meaning:
      "Royal Malaysian Customs Department, also called Jabatan Kastam Diraja Malaysia (JKDM). It is the government authority that administers SST."
  },
  {
    term: "MySST",
    meaning:
      "RMCD's official online portal for SST information, registration, returns, and payments."
  },
  {
    term: "Taxable activity",
    meaning:
      "Manufacturing taxable goods or providing a service that Malaysia's SST rules specifically list as taxable."
  },
  {
    term: "Taxable turnover",
    meaning:
      "The value of the relevant taxable goods or services used for the registration test. It is not the same as profit and may not equal total business revenue."
  },
  {
    term: "Registration threshold",
    meaning:
      "The taxable-turnover amount that can trigger mandatory registration. The amount depends on the business activity."
  },
  {
    term: "SST-02",
    meaning:
      "The sales tax or service tax return used to report SST to RMCD for a taxable period."
  },
  {
    term: "Taxable period",
    meaning:
      "The reporting period covered by an SST-02 return. The standard period is two months."
  }
] as const;

const thresholdExamples = [
  ["Manufacturer of taxable goods", "Sales tax", "RM500,000"],
  ["Subcontract manufacturing work on taxable goods", "Sales tax", "RM500,000"],
  ["Accommodation", "Service tax", "RM500,000"],
  ["Food and beverage operator or caterer", "Service tax", "RM1,500,000"],
  ["Construction work services", "Service tax", "RM1,500,000"],
  ["Certain prescribed services", "Service tax", "No threshold"]
] as const;

const registrationSteps = [
  "List the goods you manufacture and services you provide.",
  "Match each activity to the current MySST taxable category and industry guide.",
  "Confirm the threshold for that exact category.",
  "Calculate taxable turnover using both the historical and future methods.",
  "Keep the calculation and supporting sales records.",
  "Apply through MySST if the registration conditions are met.",
  "Wait for the effective registration details before charging SST."
] as const;

const responsibilities = [
  "Charge the applicable SST on taxable supplies from the effective date.",
  "Issue invoices containing the particulars required by the Royal Malaysian Customs Department (RMCD).",
  "Show the amount before tax, tax rate, SST amount, and total clearly.",
  "Keep adequate business and tax records.",
  "Submit an SST-02 return for each two-month taxable period, including a nil return when required. A nil return reports that no tax is payable for that period.",
  "Pay the tax by the applicable deadline.",
  "Update RMCD when relevant registered particulars change."
] as const;

const checklist = [
  "I separated taxable turnover from total business revenue.",
  "I identified whether the activity concerns sales tax or service tax.",
  "I checked the latest MySST category rather than assuming every business uses RM500,000.",
  "I reviewed an industry-specific RMCD guide for my activity.",
  "I calculated the preceding 12 months under the historical method.",
  "I estimated the succeeding 12 months under the future method.",
  "I included taxable turnover from relevant branches of the same legal entity.",
  "I saved the calculation and the records supporting it.",
  "I confirmed the result with RMCD or a qualified tax adviser if classification is unclear."
] as const;

const sidebarGuides = [
  guideLink("what-should-an-invoice-include-before-you-send-it"),
  guideLink("profitable-but-no-cash"),
  guideLink("debit-vs-credit")
];

const faqs = [
  {
    question: "Is registering a business with SSM the same as registering for SST?",
    answer:
      "No. Registration with the Companies Commission of Malaysia (SSM) establishes or records the business. SST registration is a separate tax registration administered by the Royal Malaysian Customs Department (RMCD) through MySST."
  },
  {
    question: "Does every Malaysian business above RM500,000 need SST registration?",
    answer:
      "No. Registration depends first on whether the business is a prescribed taxable person carrying out a taxable activity. Thresholds also differ by category: some use RM500,000, some use RM1,500,000, and certain prescribed services have no threshold."
  },
  {
    question: "Is SST registration based on revenue or profit?",
    answer:
      "It is based on the relevant value of taxable goods or taxable services, not accounting profit. Total company revenue can also differ from taxable turnover used for the registration test."
  },
  {
    question: "What is the difference between sales tax and service tax registration?",
    answer:
      "Sales tax registration generally concerns manufacturers of taxable goods and subcontract manufacturing work. Service tax registration concerns businesses providing services prescribed as taxable services."
  },
  {
    question: "How is the 12-month SST threshold calculated?",
    answer:
      "RMCD describes a historical method using the current month and the preceding 11 months, and a future method using the current month and the succeeding 11 months. Review both because liability can arise under either test."
  },
  {
    question: "Do I count all branch turnover separately?",
    answer:
      "Usually, relevant taxable turnover is considered for the legal entity rather than treating every branch as a separate business. A branch that is itself a separately constituted legal entity may require different treatment."
  },
  {
    question: "Can I register voluntarily when I am below the threshold?",
    answer:
      "MySST states that voluntary registration may be available to a person providing taxable services below the threshold, subject to the conditions determined by the Director General."
  },
  {
    question: "Should I start charging SST as soon as I cross the threshold?",
    answer:
      "Do not guess the charging date. Complete the required registration process and follow the effective date and instructions issued by RMCD for your registration."
  },
  {
    question: "What is an SST-02 return?",
    answer:
      "SST-02 is the return form used by a registered manufacturer or registered service provider to report sales tax or service tax for a taxable period. The standard taxable period is two months, and the return generally must still be submitted when no tax is payable."
  },
  {
    question: "How often must an SST return be filed?",
    answer:
      "The standard taxable period is once every two months. The Royal Malaysian Customs Department (RMCD) states that the return is mandatory for each taxable period even when no tax is payable, subject to the rules applying to the registered person."
  }
];

function SimpleTable({
  headers,
  rows
}: {
  headers: readonly string[];
  rows: ReadonlyArray<readonly string[]>;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse bg-white text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-950">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3" key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-950">
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td
                  className={`px-4 py-3 align-top ${
                    index === 0 ? "font-semibold text-slate-950" : ""
                  }`}
                  key={`${row[0]}-${cell}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({
  children,
  id
}: {
  children: string;
  id: string;
}) {
  return (
    <header id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {children}
      </h2>
    </header>
  );
}

export default function SstRegistrationGuidePage() {
  const pageUrl = `${siteConfig.url}${guidePath}`;

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` },
          { name: pageTitle, url: pageUrl }
        ]}
      />
      <FAQJsonLd faqs={faqs} />
      <ArticleJsonLd
        description={metadata.description as string}
        slug="do-i-need-to-register-for-sst-malaysia"
      />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-950">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition hover:text-slate-900" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li>
              <Link className="transition hover:text-slate-900" href="/guides">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-slate-950">{pageTitle}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="min-w-0">
            <header>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {pageTitle}
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-950 sm:text-lg">
                {pageDescription}
              </p>
              <p className="mt-5 text-sm text-slate-950">
                Updated on 24 July 2026 <span aria-hidden="true">-</span> 10 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-test">
                Quick answer: the three-part SST registration test
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Reaching a revenue figure by itself does not automatically mean that every
                business must register. Registration normally depends on all three questions
                below.
              </p>
              <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-7 text-slate-950">
                {[
                  {
                    title: "Check whether the activity is taxable",
                    description:
                      "Do you manufacture taxable goods or provide a service that Malaysia's SST rules specifically list as taxable?"
                  },
                  {
                    title: "Find the threshold for that activity",
                    description:
                      "Do not assume every business uses RM500,000. Different activities can have different thresholds, and some prescribed services have no threshold."
                  },
                  {
                    title: "Test the relevant turnover over 12 months",
                    description:
                      "Has the value of the taxable goods or services exceeded the threshold, or is it expected to exceed it?"
                  }
                ].map((check) => (
                  <li className="pl-2" key={check.title}>
                    <p className="font-semibold">{check.title}</p>
                    <p className="mt-1">{check.description}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-base leading-7 text-slate-950">
                If any answer is unclear, do not start with the tax rate. First identify the
                taxable activity and its official category.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">
                Key SST terms in plain English
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These terms appear throughout the registration process. Understanding them first
                makes the rest of the guide easier to follow.
              </p>
              <dl className="mt-6 space-y-5 text-base leading-7 text-slate-950">
                {keyTerms.map((item) => (
                  <div key={item.term}>
                    <dt className="font-semibold">{item.term}</dt>
                    <dd className="mt-1">{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-12">
              <SectionHeading id="tax-type">
                Step 1: decide whether you are checking sales tax or service tax
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                SST means Sales and Service Tax, but sales tax and service tax apply to different
                business activities. Start by deciding which side could apply to you.
              </p>
              <div className="mt-6 space-y-6 text-base leading-7 text-slate-950">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Sales tax</h3>
                  <p className="mt-2">
                    Check sales tax if your business manufactures taxable goods or performs
                    subcontract manufacturing work on taxable goods. The registration test looks
                    at the sales value of those taxable goods or the value of the taxable
                    manufacturing work.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Service tax</h3>
                  <p className="mt-2">
                    Check service tax if your business provides a service that the SST rules list
                    as taxable. The registration test looks at the value of those taxable services.
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                A retailer that merely resells goods is not the same as a manufacturer for sales
                tax purposes. Likewise, earning business revenue does not by itself make every
                service a taxable service.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="taxable-category">
                Step 2: find your taxable category and its threshold
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Match what the business actually supplies to the current description from the
                Royal Malaysian Customs Department (RMCD). Do not choose a threshold based only
                on a broad label such as consultant, online business, contractor, or restaurant.
              </p>
              <SimpleTable
                headers={["Example activity", "Tax to check", "Current threshold example"]}
                rows={thresholdExamples}
              />
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This is a short screening table, not the complete taxable-services schedule.
                Categories, exclusions, exemptions, and policies can change. Confirm the current
                entry on the{" "}
                <a
                  className="font-semibold underline-offset-4 hover:underline"
                  href="https://mysst.customs.gov.my/registering-business/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  RMCD registration page on MySST
                </a>{" "}
                and read the relevant{" "}
                <a
                  className="font-semibold underline-offset-4 hover:underline"
                  href="https://mysst.customs.gov.my/industry-guides/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  industry guide
                </a>
                .
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="turnover-test">
                Step 3: calculate taxable turnover over 12 months
              </SectionHeading>
              <div className="mt-4 space-y-4 text-base leading-7 text-slate-950">
                <p>
                  <strong>Taxable turnover</strong> means the value of the taxable goods or
                  services relevant to the registration category. It is not profit, and it may be
                  different from the total revenue shown in your accounts.
                </p>
                <p>
                  <strong>Historical method:</strong> add the taxable value for the month you are
                  checking and the 11 months immediately before it. For July 2026, this means
                  August 2025 through July 2026.
                </p>
                <p>
                  <strong>Future method:</strong> add the expected taxable value for the month you
                  are checking and the 11 months immediately after it. For July 2026, this means
                  July 2026 through June 2027.
                </p>
                <p>
                  RMCD uses both methods because a business can become liable based on what has
                  already happened or what it is expected to earn. Keep a simple monthly taxable
                  turnover schedule so that you can see a threshold crossing before year-end.
                </p>
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="examples">
                Apply the decision test to your business
              </SectionHeading>
              <div className="mt-6 space-y-6 text-base leading-7 text-slate-950">
                <div>
                  <h3 className="text-lg font-semibold">Restaurant below the example threshold</h3>
                  <p className="mt-2">
                    A restaurant has RM1.20 million of taxable food and beverage turnover. This is
                    below the RM1.50 million example threshold, so it should continue monthly
                    monitoring and also run the future method.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Restaurant above the example threshold</h3>
                  <p className="mt-2">
                    A restaurant has RM1.60 million of taxable food and beverage turnover. The
                    threshold appears to have been exceeded. The owner should confirm the
                    classification and apply through the official MySST portal.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Manufacturer of taxable goods</h3>
                  <p className="mt-2">
                    A manufacturer has RM620,000 of sales from taxable goods. The RM500,000
                    sales-tax threshold appears to have been exceeded. The business should confirm
                    that the goods are taxable and apply through MySST.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Service business with RM600,000 total revenue
                  </h3>
                  <p className="mt-2">
                    Revenue alone is not enough to answer the question. The owner must first
                    identify whether the service is taxable, find its category and threshold, and
                    count the turnover belonging to that taxable service.
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                These examples demonstrate the workflow only. Exemptions, business-to-business
                relief, place-of-supply rules, and industry policies may change the final result.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="how-to-register">
                How to check and register step by step
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                MySST is the official online SST portal operated by the Royal Malaysian Customs
                Department. Use it to confirm the current category and submit a registration
                application when the conditions are met.
              </p>
              <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-7 text-slate-950">
                {registrationSteps.map((step) => (
                  <li className="pl-2" key={step}>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-12">
              <SectionHeading id="after-registration">
                What changes after SST registration?
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Registration creates ongoing responsibilities. Build these tasks into invoicing
                and bookkeeping instead of treating registration as a one-time form.
              </p>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {responsibilities.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-950">
                <h3 className="text-lg font-semibold">What is the SST-02 return?</h3>
                <p>
                  SST-02 is the return form used to tell RMCD how much sales tax or service tax
                  must be reported for a taxable period. A taxable period is the time covered by
                  one return; the standard period is two months.
                </p>
                <p>
                  The return records the relevant taxable value and tax amount for that period.
                  RMCD says it must generally be submitted even when no tax is payable. That is
                  called a <strong>nil return</strong>. The standard deadline is the last day of
                  the month following the end of the taxable period.
                </p>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                RMCD&apos;s{" "}
                <a
                  className="font-semibold underline-offset-4 hover:underline"
                  href="https://mysst.customs.gov.my/issuing-invoices/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  invoicing guidance
                </a>{" "}
                lists the required particulars. Its{" "}
                <a
                  className="font-semibold underline-offset-4 hover:underline"
                  href="https://mysst.customs.gov.my/filing-text-returns/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  filing guidance
                </a>{" "}
                explains the standard two-month taxable period and return deadline.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">
                SST registration decision checklist
              </SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide is a general screening aid. Use current RMCD guidance or qualified
                professional advice for a registration decision affecting your business.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Already registered and preparing an invoice?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Review the invoice details first, then use the calculator to check the SST
                    arithmetic.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/guides/what-should-an-invoice-include-before-you-send-it"
                  >
                    Invoice Guide
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/sst-calculator-malaysia"
                  >
                    SST Calculator
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="SST Registration Malaysia FAQs"
            />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <GuideTableOfContents items={tableOfContents} />

              <section>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">
                  Related guides
                </p>
                <div className="mt-4 grid gap-3">
                  {sidebarGuides.map((guide) => (
                    <Link
                      className="text-sm leading-6 text-blue-700 underline underline-offset-4 transition hover:text-blue-900"
                      href={guide.href}
                      key={guide.href}
                    >
                      {guide.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
