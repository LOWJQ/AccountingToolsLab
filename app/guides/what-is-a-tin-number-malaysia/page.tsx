import Link from "next/link";
import { GuideTableOfContents } from "@/components/guides/GuideTableOfContents";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { guideLink } from "@/lib/data/guides";
import { createGuideMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

const pageTitle = "What Is a TIN Number in Malaysia and How Do I Find Mine?";
const guidePath = "/guides/what-is-a-tin-number-malaysia";
const pageDescription =
  "Your Tax Identification Number identifies you to LHDN and appears on every e-Invoice. Find yours, read what the prefix means, and apply the two formatting rules that cause most TIN rejections.";

export const metadata = createGuideMetadata({
  slug: "what-is-a-tin-number-malaysia",
  title: "What Is a TIN Number in Malaysia? How to Find and Format It",
  description:
    "Find your Malaysian TIN, understand the IG, C, D and other prefixes, use the correct general TIN codes, and format it so MyInvois accepts your e-Invoice."
});

const tableOfContents = [
  { label: "Quick answer", href: "#quick-answer" },
  { label: "Key terms", href: "#key-terms" },
  { label: "Where to find your TIN", href: "#find-your-tin" },
  { label: "What the prefix means", href: "#prefixes" },
  { label: "Two formatting rules", href: "#formatting-rules" },
  { label: "General TIN codes", href: "#general-tins" },
  { label: "Why TINs get rejected", href: "#rejections" },
  { label: "TIN checklist", href: "#checklist" },
  { label: "FAQs", href: "#faq" }
] as const;

const keyTerms = [
  {
    term: "TIN",
    meaning:
      "Tax Identification Number, also called Nombor Pengenalan Cukai. It identifies a taxpayer to LHDN and is made up of a letter prefix followed by digits."
  },
  {
    term: "LHDN / HASiL",
    meaning:
      "Lembaga Hasil Dalam Negeri, the Inland Revenue Board of Malaysia. It issues TINs and runs the MyInvois e-Invoice system."
  },
  {
    term: "MyTax",
    meaning:
      "LHDN's online tax portal. It is the normal place to look up your own TIN, through e-Daftar or your profile information."
  },
  {
    term: "NRIC",
    meaning:
      "Your MyKad identity card number. It is not a TIN, though people often confuse the two when filling in invoice details."
  },
  {
    term: "BRN",
    meaning:
      "Business Registration Number from SSM. An e-Invoice carries this alongside the TIN, but they are separate identifiers."
  }
] as const;

const findYourTin = [
  {
    title: "Check the MyTax portal",
    body: "Log in to MyTax and look under e-Daftar or your profile information. This is the channel LHDN names first, and it shows the TIN exactly as LHDN holds it."
  },
  {
    title: "Look at past tax documents",
    body: "Your TIN appears on income tax return forms, assessment notices, and correspondence from LHDN. For a company it is usually on file with whoever prepares your tax return."
  },
  {
    title: "Ask your tax agent or company secretary",
    body: "If someone files on your behalf, they will already hold the TIN and any related file numbers for your entity."
  },
  {
    title: "Contact the HASiL Contact Centre",
    body: "If none of the above works, LHDN's contact centre can retrieve it. You will need identifying details such as your NRIC or business registration number."
  }
] as const;

/**
 * Prefixes exactly as LHDN lists them in the MyInvois SDK FAQ. The list is
 * deliberately not padded with other file-number letters: an e-Invoice TIN uses
 * these, and adding plausible-looking extras would invite people to submit a
 * prefix LHDN does not accept here.
 */
const prefixes = [
  { code: "IG", meaning: "Individual", note: "Replaced the older OG and SG prefixes" },
  { code: "C", meaning: "Company", note: "" },
  { code: "CS", meaning: "Cooperative society", note: "" },
  { code: "D", meaning: "Partnership", note: "" },
  { code: "F", meaning: "Association", note: "" },
  { code: "FA", meaning: "Non-resident public entertainer", note: "" },
  { code: "PT", meaning: "Limited liability partnership", note: "" },
  { code: "TA", meaning: "Trust body", note: "" },
  { code: "TC", meaning: "Unit trust or property trust", note: "" },
  { code: "TN", meaning: "Business trust", note: "" },
  { code: "TR", meaning: "Real estate investment trust or property trust fund", note: "" },
  { code: "TP", meaning: "Deceased person's estate", note: "" },
  { code: "J", meaning: "Hindu joint family", note: "" },
  { code: "LE", meaning: "Labuan entity", note: "" }
] as const;

const generalTins = [
  {
    code: "EI00000000010",
    use: "General public",
    when: "A Malaysian individual buyer who does not need their own e-Invoice, and consolidated e-Invoices covering many individual buyers."
  },
  {
    code: "EI00000000020",
    use: "Foreign buyer",
    when: "A buyer outside Malaysia, such as a tourist or an overseas customer, with no Malaysian TIN."
  },
  {
    code: "EI00000000030",
    use: "Foreign supplier",
    when: "A supplier outside Malaysia, typically on a self-billed e-Invoice for imported goods or services."
  },
  {
    code: "EI00000000040",
    use: "Government or public sector buyer",
    when: "Government agencies, statutory bodies, and exempt institutions without a designated TIN."
  }
] as const;

const rejectionCauses = [
  {
    cause: "Using an old OG or SG prefix",
    fix: "Swap the prefix for IG and leave the digits unchanged. SG123456789 becomes IG123456789."
  },
  {
    cause: "Leading zeros left in a non-individual TIN",
    fix: "Remove any zeros that sit immediately after the prefix before submitting."
  },
  {
    cause: "A non-individual TIN that does not end in zero",
    fix: "LHDN states that a non-individual TIN always ends in zero. Add the trailing zero if yours is missing one."
  },
  {
    cause: "An NRIC entered instead of a TIN",
    fix: "An NRIC identifies a person, not a tax file. Look up the actual TIN, which begins with a letter prefix."
  },
  {
    cause: "A buyer TIN that was correct last year",
    fix: "Buyer details change. Confirm the TIN with the buyer rather than reusing one stored years ago."
  },
  {
    cause: "Copy-paste spaces or dashes",
    fix: "Submit the prefix and digits with nothing between them, and no trailing space."
  }
] as const;

const checklist = [
  "I retrieved my TIN from MyTax rather than reconstructing it from memory.",
  "I checked the prefix matches my entity type, not someone else's.",
  "I replaced any old OG or SG prefix with IG.",
  "I removed leading zeros sitting straight after the prefix on a non-individual TIN.",
  "I confirmed a non-individual TIN ends in zero.",
  "I used a general TIN code only where no real TIN could be obtained.",
  "I asked the buyer to confirm their TIN instead of reusing an old record.",
  "I verified the TIN through MyTax or LHDN where anything looked unclear."
] as const;

const sidebarGuides = [
  guideLink("what-should-an-invoice-include-before-you-send-it"),
  guideLink("do-i-need-to-register-for-sst-malaysia"),
  guideLink("profitable-but-no-cash")
];

const faqs = [
  {
    question: "What is a TIN number in Malaysia?",
    answer:
      "A TIN, or Tax Identification Number, is the reference LHDN uses to identify a taxpayer. It is written as a letter prefix followed by digits, such as IG for an individual or C for a company. It is also called Nombor Pengenalan Cukai."
  },
  {
    question: "Is my TIN the same as my NRIC or my SSM number?",
    answer:
      "No. Your NRIC identifies you as a person and your SSM business registration number identifies the business entity. A TIN is a separate tax reference issued by LHDN. An e-Invoice asks for the TIN and the business registration number as two different fields."
  },
  {
    question: "How do I find my TIN?",
    answer:
      "The usual route is the MyTax portal, through e-Daftar or your profile information. Your TIN also appears on past tax returns and LHDN correspondence, and your tax agent will hold it. If none of those work, the HASiL Contact Centre can retrieve it."
  },
  {
    question: "My TIN starts with SG or OG. Is it still valid?",
    answer:
      "The numeric part stays the same, but the prefix changed. LHDN states that the individual prefix is now IG, replacing OG and SG, and gives the example that SG123456789 should be entered as IG123456789. Submitting the old prefix is a common cause of rejection."
  },
  {
    question: "Why does my non-individual TIN need to end in zero?",
    answer:
      "LHDN states that a non-individual TIN always ends with a zero, and that you should add one if yours does not appear to. The same guidance says to remove any leading zeros that sit immediately after the prefix. Both rules exist so the TIN matches the format LHDN validates against."
  },
  {
    question: "What TIN do I use when my customer will not give me one?",
    answer:
      "LHDN publishes general TIN codes for exactly this. EI00000000010 covers the general public, EI00000000020 a foreign buyer, EI00000000030 a foreign supplier, and EI00000000040 a government or public sector buyer. Use them only when a real TIN genuinely cannot be obtained, and keep a record of why."
  },
  {
    question: "Can I check whether someone else's TIN is real?",
    answer:
      "Not from a public website. LHDN provides a Validate Taxpayer's TIN API, but it requires credentials tied to a registered taxpayer or intermediary, and the MyTax TIN search requires a login. In practice you confirm a buyer's TIN by asking the buyer, and your accounting software validates it at submission."
  },
  {
    question: "Do I need a TIN if my business is exempt from e-Invoice?",
    answer:
      "Being outside the e-Invoice mandate does not remove your normal tax obligations, and you will still have a TIN if you are registered with LHDN. You may also need to give your TIN to a customer who is in scope and is issuing a self-billed e-Invoice."
  }
];

function SectionHeading({ children, id }: { children: string; id: string }) {
  return (
    <header id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {children}
      </h2>
    </header>
  );
}

export default function TinNumberMalaysiaGuidePage() {
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
        slug="what-is-a-tin-number-malaysia"
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
                Updated on 18 August 2026 <span aria-hidden="true">-</span> 8 min read
              </p>
            </header>

            <GuideTableOfContents className="mt-8 lg:hidden" items={tableOfContents} />

            <section className="mt-12">
              <SectionHeading id="quick-answer">Quick answer</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A TIN is the number LHDN uses to identify you as a taxpayer. It is a letter prefix
                followed by digits, and it appears on every e-Invoice for both the supplier and the
                buyer. Three things settle most TIN problems:
              </p>
              <ol className="mt-6 list-decimal space-y-4 pl-6 text-base leading-7 text-slate-950">
                <li>
                  <span className="font-semibold">Get the real number from MyTax.</span> Do not
                  rebuild it from memory or reuse a buyer TIN recorded years ago.
                </li>
                <li>
                  <span className="font-semibold">Use the current prefix.</span> Individuals now use
                  IG. The older OG and SG prefixes are no longer the ones to submit.
                </li>
                <li>
                  <span className="font-semibold">Apply the zero rules.</span> A non-individual TIN
                  drops leading zeros after the prefix and always ends in a zero.
                </li>
              </ol>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Those last two rules come straight from LHDN&apos;s own MyInvois guidance and cause
                a large share of rejected submissions.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="key-terms">Key terms</SectionHeading>
              <dl className="mt-6 grid gap-5">
                {keyTerms.map((item) => (
                  <div key={item.term}>
                    <dt className="text-base font-semibold text-slate-950">{item.term}</dt>
                    <dd className="mt-1 text-base leading-7 text-slate-950">{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-12">
              <SectionHeading id="find-your-tin">Where to find your TIN</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                LHDN lists several channels for retrieving your own TIN. Start at the top and work
                down.
              </p>
              <ol className="mt-6 space-y-5">
                {findYourTin.map((item, index) => (
                  <li className="flex gap-4" key={item.title}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-base leading-7 text-slate-950">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-base leading-7 text-slate-950">
                You can reach the portal at{" "}
                <a
                  className="font-semibold underline-offset-4 hover:underline"
                  href="https://mytax.hasil.gov.my/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  mytax.hasil.gov.my
                </a>
                .
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="prefixes">What the prefix means</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                The letters at the start of a TIN say what kind of taxpayer it belongs to. These are
                the prefixes LHDN lists for e-Invoice use.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[520px] overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        Prefix
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        Taxpayer type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {prefixes.map((item) => (
                      <tr key={item.code}>
                        <th
                          className="px-4 py-3 text-left font-mono font-semibold text-slate-950"
                          scope="row"
                        >
                          {item.code}
                        </th>
                        <td className="px-4 py-3 text-slate-950">
                          {item.meaning}
                          {item.note ? (
                            <span className="block text-sm text-slate-600">{item.note}</span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                An individual TIN is at most 14 characters including the prefix, and the digits that
                follow are the ones LHDN already holds for you. Do not pad or trim them to reach a
                particular length.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="formatting-rules">
                Two formatting rules for non-individual TINs
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                These two rules are stated by LHDN in its MyInvois guidance and are the ones most
                often missed, because the TIN can look perfectly reasonable and still fail.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-950">Drop leading zeros</h3>
                  <p className="mt-2 text-base leading-7 text-slate-950">
                    If your TIN has zeros sitting immediately after the prefix, remove them before
                    submitting.
                  </p>
                  <p className="mt-3 font-mono text-sm text-slate-700">
                    C00123456700 <span aria-hidden="true">-&gt;</span> C123456700
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-950">End with a zero</h3>
                  <p className="mt-2 text-base leading-7 text-slate-950">
                    LHDN states a non-individual TIN always ends in zero. Add the trailing zero if
                    yours does not have one.
                  </p>
                  <p className="mt-3 font-mono text-sm text-slate-700">
                    C12345678 <span aria-hidden="true">-&gt;</span> C123456780
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Both rules apply to the non-individual prefixes in the table above. They do not
                apply to an individual IG number, where the digits stay exactly as LHDN issued them.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="general-tins">
                General TIN codes when there is no real TIN
              </SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                Sometimes there is genuinely no TIN to use, such as a walk-in customer or an
                overseas buyer. LHDN publishes four general codes for those cases.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        Use for
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        When it applies
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {generalTins.map((item) => (
                      <tr key={item.code}>
                        <th
                          className="px-4 py-3 text-left font-mono font-semibold text-slate-950"
                          scope="row"
                        >
                          {item.code}
                        </th>
                        <td className="px-4 py-3 font-medium text-slate-950">{item.use}</td>
                        <td className="px-4 py-3 text-slate-950">{item.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-950">
                Treat these as a fallback, not a shortcut. If a buyer can give you a real TIN, use
                it, and keep a note of why a general code was used where one was needed.
              </p>
            </section>

            <section className="mt-12">
              <SectionHeading id="rejections">Why TINs get rejected</SectionHeading>
              <p className="mt-4 text-base leading-7 text-slate-950">
                A wrong or outdated TIN is one of the most common reasons an e-Invoice fails
                validation. These are the usual causes and what to do about each.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] overflow-hidden rounded-lg border border-slate-200 text-base leading-7">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        Cause
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-950" scope="col">
                        What to do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rejectionCauses.map((item) => (
                      <tr key={item.cause}>
                        <th
                          className="px-4 py-3 text-left font-medium text-slate-950"
                          scope="row"
                        >
                          {item.cause}
                        </th>
                        <td className="px-4 py-3 text-slate-950">{item.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12">
              <SectionHeading id="checklist">TIN checklist</SectionHeading>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-950">
                {checklist.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-slate-950">
                This guide explains how a TIN is structured and where to find it. It cannot confirm
                that a particular TIN exists or is active. Verify through MyTax, or with LHDN or a
                qualified tax adviser, before relying on one.
              </p>
            </section>

            <section className="mt-12">
              <div className="rounded-lg border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Working on an e-Invoice?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-950">
                    Check whether the mandate applies to you, then look up the MSIC and
                    classification codes your invoice needs.
                  </p>
                </div>
                <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-0">
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                    href="/tools/e-invoice-checker-malaysia"
                  >
                    e-Invoice Checker
                  </Link>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                    href="/tools/e-invoice-code-lookup-malaysia"
                  >
                    Code Lookup
                  </Link>
                </div>
              </div>
            </section>

            <FAQSection
              eyebrow=""
              faqs={faqs}
              id="faq"
              showTopBorder={false}
              title="Malaysia TIN Number FAQs"
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
