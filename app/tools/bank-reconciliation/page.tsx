import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReconciliationWorkspace } from "@/components/reconciliation/ReconciliationWorkspace";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Free Bank Reconciliation Tool | CSV Transaction Matcher",
  description: "Match bank statement and cashbook CSV transactions in your browser. Review unmatched items, possible duplicates, bank fees and combined payments. Free, no sign-up.",
  path: "/tools/bank-reconciliation"
});

const faqs = [
  { question: "Will this work with different banks?", answer: "It supports common CSV layouts through column mapping, rather than a connection to a specific bank. Match your file’s date and amount columns and check the preview, including money direction. Use a signed amount or separate money-in and money-out columns. Running balances alone, PDF statements and Excel workbooks are not supported. This version needs a header row and numeric dates with a four-digit year; unusual exports may need to be reformatted. Compatibility has not been verified against every bank." },
  { question: "Are my bank statement and cashbook files uploaded?", answer: "No. CSV parsing, transaction matching and report creation happen in this browser tab. The tool has no file-upload endpoint, bank connection or AI service. Files and review decisions are not saved automatically. Download your report before closing the tab. Normal page requests still reach the website hosting service." },
  { question: "Which CSV formats does the bank reconciliation matcher support?", answer: "Choose CSV or TSV files with a header row, a date column and either one signed amount column or separate money-in and money-out columns. Description, reference and currency columns are optional. Each file can contain up to 10,000 transaction rows and be up to 5 MB. Amounts support up to two decimal places. Select the date and number formats and confirm the money direction in the preview." },
  { question: "Can one bank deposit match several cashbook entries?", answer: "Yes. The tool suggests groups of two or three transactions in the same money direction whose amounts add up exactly within your date window. Combined suggestions need your approval. When several combinations could work, the rows stay unmatched for manual review. Large candidate pools and the total search effort are bounded to keep the browser responsive; any search limits are shown with the results." },
  { question: "Does an unmatched item mean there is an accounting error?", answer: "No. It may be a timing difference, an unrecorded fee, a duplicate export, a different reference or a missing transaction. The tool labels possible causes as clues, not confirmed facts. Check the original records and subsequent statement before making an accounting adjustment." },
  { question: "Does matching every transaction prove the bank account reconciles?", answer: "No. This tool compares exported transactions. A complete bank reconciliation also checks the statement and cashbook closing balances, previous outstanding items, the statement period and any required accounting adjustments. The net movement difference shown here is not a closing balance difference." },
  { question: "Can I change a match and download the results?", answer: "Yes. Accept or reject suggestions, unmatch an automatic match, or select equal-value bank and cashbook transactions to match manually. Undo restores recent match changes. Download a CSV report with source file names, original line numbers, amounts, match reasons, review status, notes and invalid rows." },
  { question: "Can I compare different currencies or import a PDF bank statement?", answer: "Use one bank account and one currency per comparison. The currency selection labels amounts and does not convert them. If your files include a currency column, conflicting currencies are flagged as invalid. This version accepts transaction CSV or TSV exports; it does not read PDFs or Excel workbooks." }
];

export default function BankReconciliationPage() {
  const pageUrl = `${siteConfig.url}/tools/bank-reconciliation`;
  return <ToolPageLayout>
    <BreadcrumbJsonLd items={[{ name: "Home", url: siteConfig.url }, { name: "Tools", url: `${siteConfig.url}/tools` }, { name: "Bank Reconciliation Matcher", url: pageUrl }]} />
    <SoftwareApplicationJsonLd name="Bank Reconciliation Matcher" description={metadata.description as string} url={pageUrl} />
    <FAQJsonLd faqs={faqs} />
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><ol className="flex flex-wrap items-center gap-2"><li><Link className="hover:text-slate-900" href="/">Home</Link></li><li aria-hidden="true">&gt;</li><li><Link className="hover:text-slate-900" href="/tools">Tools</Link></li><li aria-hidden="true">&gt;</li><li className="font-medium text-slate-700">Bank Reconciliation Matcher</li></ol></nav>
    <ReconciliationWorkspace intro={<div className="max-w-4xl"><h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Bank Reconciliation Matcher</h1><p className="mt-3 text-base leading-7 text-black">Compare a bank statement and cashbook CSV. Find matching transactions, review differences, and download your working paper. Free, with no sign-up.</p></div>}>
      <section className="grid gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
        <div className="lg:pr-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            How this bank reconciliation tool works
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-black marker:text-black">
            <li className="pl-2">
              Choose the bank statement and the cashbook or ledger CSV for the same bank account
              and period.
            </li>
            <li className="pl-2">
              Check the column preview to confirm dates, amounts and money direction. Include
              references and descriptions where available.
            </li>
            <li className="pl-2">
              Review the results. Accept or reject suggested matches and investigate unmatched
              items, possible duplicates and amount typos.
            </li>
            <li className="pl-2">
              Download your CSV report with source lines and review decisions. Complete the
              balance checks in your normal reconciliation process.
            </li>
          </ol>
        </div>

        <div className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Understand unmatched transactions
          </h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-7 text-black">
            <li className="pl-1">
              <strong>Timing differences.</strong> Cashbook items near the statement end may not
              have cleared. Confirm them against the next bank statement.
            </li>
            <li className="pl-1">
              <strong>Possible duplicates.</strong> Repeated dates, amounts and references may
              indicate a repeated import or a genuine repeat payment. Nothing is deleted
              automatically.
            </li>
            <li className="pl-1">
              <strong>Transposed amounts.</strong> A nearby transaction with the same reference
              or description may have two digits swapped, such as 1,250 and 1,520. Check the
              source record.
            </li>
            <li className="pl-1">
              <strong>Bank charges.</strong> Bank-only withdrawals mentioning fees or charges
              are highlighted for review. Confirm whether a cashbook entry is needed.
            </li>
            <li className="pl-1">
              <strong>Combined payments.</strong> A single deposit or payment may cover several
              cashbook entries. Compare the components and their total before accepting.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Keep client transaction data local
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          Your files are read and compared on this device. Financial contents, file names and
          review decisions are not sent to an AccountingToolsLab upload service, an AI provider
          or analytics. The comparison stays in memory until you leave or clear the page.
        </p>
        <p className="mt-3 text-base leading-7 text-black">
          Reports contain the transaction details you imported, so store them privately. There
          is no automatic backup or browser history of reconciliations. See the{" "}
          <Link className="underline underline-offset-4" href="/privacy-policy">
            Privacy Policy
          </Link>{" "}
          for normal website hosting and storage information.
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          A transaction matcher for your reconciliation workflow
        </h2>
        <p className="mt-3 text-base leading-7 text-black">
          The comparison helps you locate differences; it does not post journal entries or
          certify account balances. Verify opening and closing balances and carry-forward
          items separately.
        </p>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Related Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { href: "/tools/cash-flow-calculator", label: "Cash Flow Calculator" },
            { href: "/tools/journal-entry-checker", label: "Journal Entry Checker" }
          ].map((tool) => (
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

      <section className="[&_details>p]:text-base [&_details>p]:leading-7 [&_details>p]:text-black [&_h2]:text-3xl [&_summary]:text-base [&_summary]:leading-7 [&_summary]:text-black sm:[&_h2]:text-4xl">
        <FAQSection eyebrow="" faqs={faqs} title="Bank Reconciliation Tool FAQs" />
      </section>
    </ReconciliationWorkspace>
  </ToolPageLayout>;
}
