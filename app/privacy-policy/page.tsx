import { Container } from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Read how AccountingToolsLab handles saved invoices, business details, logos, payment QR images, local preferences, contact messages, and analytics.",
  path: "/privacy-policy"
});

const privacySections = [
  {
    title: "Current status",
    content: [
      "AccountingToolsLab provides free accounting calculators, an invoice generator, and practical accounting guides for learning and basic business checks.",
      "You do not need an account to use the website. The site does not currently offer login, user dashboards, subscriptions, paid checkout, ads, or AI features.",
      "The homepage email signup currently validates the email address in your browser and shows a confirmation message. It is not connected to a mailing list or database at this time."
    ]
  },
  {
    title: "Information you provide",
    content: [
      "If you email AccountingToolsLab directly, the site owner may receive your email address, subject line, and message content.",
      "If you use the contact form, AccountingToolsLab receives the name, email address, topic, subject, message, optional page or tool URL, and spam-check information needed to send and protect the message.",
      "When you use calculators, the numbers you enter are used to calculate results for that page. The general calculator pages are designed to work without creating an account or saving your entries on the server.",
      "The invoice generator processes your invoice details, business logo, and payment QR image in your browser to create previews and PDFs. The generator does not upload these details or images to an AccountingToolsLab server. They may be saved in your browser as explained below.",
      "The bank reconciliation matcher reads bank statement and cashbook CSV and Excel (.xlsx) files in this browser tab. Parsing, transaction matching, review decisions and Excel or CSV report creation run locally. There is no file-upload endpoint, bank connection or third-party AI service for this tool. Financial contents and file names are not sent to analytics or error-reporting services. Source files, matches and notes are not saved automatically in browser storage or on a server; leaving or clearing the page removes the in-memory comparison. Downloaded reports contain transaction information and should be kept private."
    ]
  },
  {
    title: "Automatically collected information",
    content: [
      "The site may receive basic technical information through hosting and security logs, such as IP address, browser type, device type, requested pages, timestamps, and error information.",
      "AccountingToolsLab uses Vercel Analytics to understand aggregate page usage and Vercel Speed Insights to understand site performance. These tools help identify which pages are useful and where the website needs speed or usability improvements.",
      "Page-view analytics and performance reporting are excluded for the bank reconciliation tool. Normal page and asset requests still reach the hosting service and may appear in technical hosting or security logs; those requests do not include your imported file contents.",
      "The contact form may use technical signals such as IP address and user agent for rate limiting, spam prevention, and Cloudflare Turnstile verification."
    ]
  },
  {
    title: "Local storage and similar technologies",
    content: [
      "AccountingToolsLab uses browser localStorage to remember your selected currency preference, so the same currency can remain selected after refresh.",
      "When browser storage is available, the invoice generator automatically saves your invoice edits in this browser. It can keep up to 50 invoices, including customer details, dates, item descriptions, prices, taxes, discounts, and notes. It also remembers the last used invoice number.",
      "Your business details are saved separately and reused across invoices. These include your business name, contact details, address, logo, payment details, payment QR image, and terms. Logos and QR images can remain saved after closing the page or starting a new invoice.",
      "Saved invoices and business details are kept in this browser on this device, without an online account or automatic syncing to other devices. Anyone with access to the same browser profile may be able to open them. If browser storage is blocked or full, changes may remain available only while the page is open.",
      "The receipt generator saves up to 50 receipts and a separate receipt business profile and logo in this browser. New receipts reuse those business details. On first use, existing invoice business details may be copied into the receipt profile; invoice records and receipt records remain separate. My receipts provides open, duplicate, delete, export backup, and restore backup actions. Reset clears the current receipt and the receipt profile, keeping other receipt records and the last used number. Receipt backups are separate from invoice backups and include private receipt details and the logo. Clearing this website’s browser data removes saved receipts too.",
      "Analytics, hosting, security, and performance services may use technical signals or similar technologies to measure usage, protect the contact form, and keep the website working."
    ]
  },
  {
    title: "Managing saved invoices and backups",
    content: [
      "Starting a New invoice keeps your saved invoices and business details. Deleting an invoice from My invoices removes that invoice, but keeps your shared business details, logo, and payment QR image.",
      "Reset removes the invoice you are working on and the shared business details, including the logo, payment details, and QR image. Your other saved invoices and last used invoice number remain.",
      "To remove all locally saved website data, clear this website's site data in your browser settings. This also removes your saved invoices, business details, images, last invoice number, and currency preference. Export a backup first if you want to keep your invoices.",
      "Export backup downloads a file containing your saved invoices and shared business details, including any saved logo, payment details, and QR image. Restore backup reads that file in your browser. Keep backup files private. Clearing website data does not delete PDFs or backup files you have already downloaded."
    ]
  },
  {
    title: "How information is used",
    content: [
      "Information is used to run the website, calculate tool results, remember local preferences, generate invoice previews and PDFs, respond to contact messages, prevent abuse, debug errors, and improve content and performance.",
      "AccountingToolsLab does not sell personal information. Calculator and invoice entries are used for your tool results, saved invoices, previews, and downloads."
    ]
  },
  {
    title: "Third-party services",
    content: [
      "AccountingToolsLab uses Vercel for hosting, deployment, analytics, and speed insights.",
      "The contact form uses Cloudflare Turnstile to help prevent spam and automated abuse.",
      "The contact form uses Resend to deliver contact messages by email to AccountingToolsLab.",
      "These third-party services may process technical information needed to provide hosting, security, analytics, performance measurement, and email delivery."
    ]
  },
  {
    title: "Educational use",
    content: [
      "AccountingToolsLab is designed for learning, rough checking, and simple small-business workflows. The tools and guides are not professional accounting, tax, legal, or financial advice.",
      "Do not enter sensitive personal information, confidential business information, bank passwords, government login details, or official tax submission credentials into the calculators or contact form.",
      "The invoice generator creates a practical PDF invoice for record-keeping and customer billing. It does not submit invoices to LHDN, MyInvois, or any official tax system."
    ]
  },
  {
    title: "Children and students",
    content: [
      "AccountingToolsLab can be used as a learning resource, but students and younger users should avoid submitting personal information unnecessarily.",
      "If you are below the age required by your local law to consent to data processing, use the site with guidance from a parent, guardian, teacher, or school."
    ]
  },
  {
    title: "Changes to this policy",
    content: [
      "This Privacy Policy may be updated when AccountingToolsLab adds new tools, contact features, storage behavior, analytics, or third-party services.",
      "When meaningful changes are made, the Last updated date on this page should be changed."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Privacy Policy", url: `${siteConfig.url}/privacy-policy` }
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
                <li className="font-medium text-slate-700">Privacy Policy</li>
              </ol>
            </nav>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              How Accounting Tools Lab handles privacy
            </h1>
            <p className="mt-5 text-base leading-7 text-black">
              This Privacy Policy explains what information Accounting Tools Lab may collect, how it
              is used, and how browser-based preferences and analytics are handled.
            </p>
            <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
              <span>Last updated</span>
              <time className="text-slate-950" dateTime="2026-10-26">October 26, 2026</time>
            </p>
            <div className="mt-8 border-t border-slate-200" />
          </Container>
        </section>

        <Container className="gap-0 pb-12 pt-0 sm:pb-16 sm:pt-0">
        <article>
          {privacySections.map((section, index) => (
            <section
              className={`grid gap-4 py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-6 ${
                index < privacySections.length - 1 ? "border-b border-slate-200" : ""
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
                Questions about privacy?
              </h2>
              <p className="mt-3 text-base leading-7 text-black">
                Use the contact page for questions about this Privacy Policy.
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
