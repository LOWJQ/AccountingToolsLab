import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gauge,
  LockKeyhole,
  MapPin,
  PenLine,
  QrCode,
  ReceiptText,
  Scale,
  UserRound
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolIcons } from "@/components/tools/toolIcons";
import { createMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createWebsiteSchema } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Free Invoice Generator and Accounting Tools | AccountingToolsLab",
  description:
    "Create invoices, calculate SST, check cash flow, and verify accounts with free MYR-friendly accounting tools.",
  path: "/"
});

const trustPoints = [
  { label: "Free to use", icon: FileText },
  { label: "MYR support", icon: CircleDollarSign },
  { label: "No sign-up needed", icon: UserRound },
  { label: "Built for Malaysia", icon: MapPin }
] as const;

const statusCards = [
  {
    title: "SST auto-calculated",
    detail: "8% SST applied accurately.",
    icon: Calculator
  },
  {
    title: "Debit / credit balanced",
    detail: "Checks every accounting entry.",
    icon: Scale
  },
  {
    title: "QR payment supported",
    detail: "DuitNow ready.",
    icon: QrCode
  }
] as const;

const mainTools = [
  {
    title: "Invoice Generator",
    description:
      "Create professional invoices with SST, discounts, payment details, QR payment, and PDF output.",
    href: "/tools/invoice-generator",
    cta: "Create invoice",
    icon: toolIcons.invoice,
    preview: "invoice"
  },
  {
    title: "SST Calculator Malaysia",
    description: "Add or remove SST and review totals instantly with MYR calculations.",
    href: "/tools/sst-calculator-malaysia",
    cta: "Calculate SST",
    icon: toolIcons.sst,
    preview: "sst"
  },
  {
    title: "Trial Balance Calculator",
    description: "Check debit and credit totals to make sure your accounts stay balanced.",
    href: "/tools/trial-balance-calculator",
    cta: "Check balance",
    icon: toolIcons.trialBalance,
    preview: "trial-balance"
  },
  {
    title: "Cash Flow Calculator",
    description: "Track cash inflows and outflows to understand your business cash position.",
    href: "/tools/cash-flow-calculator",
    cta: "Open tool",
    icon: toolIcons.cashFlow,
    preview: "cash-flow"
  }
] as const;

const benefits = [
  {
    title: "Fast checks",
    description: "Get instant results for everyday accounting and financial tasks.",
    icon: Gauge
  },
  {
    title: "Malaysia-ready",
    description: "MYR support, SST-ready, and built for local business workflows.",
    flag: "\uD83C\uDDF2\uD83C\uDDFE"
  },
  {
    title: "No account needed",
    description: "Use any tool directly, 100% free with no sign-up required.",
    icon: LockKeyhole
  }
] as const;

const steps = [
  {
    title: "Pick a tool",
    description: "Choose the tool that matches your task.",
    icon: ClipboardList
  },
  {
    title: "Enter your details",
    description: "Input your numbers or business information.",
    icon: PenLine
  },
  {
    title: "Review your result",
    description: "See results instantly, or generate an output when available.",
    icon: CheckCircle2
  }
] as const;

const guideCards = [
  {
    title: "How to Create a Simple Invoice",
    description: "Step-by-step guide to create clear, professional invoices for your business.",
    href: "/guides/how-to-create-a-simple-invoice",
    cta: "Read guide",
    icon: toolIcons.invoice
  },
  {
    title: "Debit vs Credit",
    description: "Understand the difference and how they keep your books in balance.",
    href: "/guides/debit-vs-credit",
    cta: "Read guide",
    icon: toolIcons.debitCredit
  },
  {
    title: "Trial Balance Explained",
    description: "What it is, why it matters, and how to check it accurately.",
    href: "/guides/trial-balance-explained",
    cta: "Read guide",
    icon: toolIcons.trialBalance
  }
] as const;

function PrimaryButton({
  children,
  href
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={href}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  children,
  href
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={href}
    >
      {children}
    </Link>
  );
}

function SectionTitle({
  action,
  children,
  description
}: {
  action?: ReactNode;
  children: ReactNode;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
          {children}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function InlineAction({
  children,
  href
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold text-slate-950 transition hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={href}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

function HeroInvoicePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="max-w-[430px] rounded-lg border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-5 lg:mr-28">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-950">Accounting Tools Lab</p>
            <p className="mt-1.5 text-[0.68rem] text-slate-500">accountingtoolslab.com</p>
            <p className="mt-1 text-[0.68rem] text-slate-500">+60 3-1234 5678</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-wide text-slate-950">INVOICE</p>
            <p className="mt-1.5 text-[0.68rem] font-medium text-slate-500">INV-0042</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
              Bill to
            </p>
            <p className="mt-1 text-xs font-bold text-slate-950">Example Customer</p>
            <p className="mt-1 text-[0.65rem] text-slate-500">customer@example.com</p>
            <p className="mt-1 truncate text-[0.65rem] text-slate-500">Kuala Lumpur</p>
          </div>
          <div className="grid content-start gap-1 text-[0.65rem]">
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-slate-700">Date:</span>
              <span className="text-slate-700">12/05/2024</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-slate-700">Due:</span>
              <span className="text-slate-700">26/05/2024</span>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_2.25rem_4rem_4rem] gap-1 bg-slate-950 px-2 py-2 text-[0.48rem] font-semibold uppercase tracking-wide text-white sm:grid-cols-[2rem_minmax(0,1fr)_2.5rem_4.7rem_4.7rem]">
            <span>#</span>
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_2.25rem_4rem_4rem] gap-1 px-2 py-2.5 text-[0.64rem] sm:grid-cols-[2rem_minmax(0,1fr)_2.5rem_4.7rem_4.7rem]">
            <span className="text-slate-500">1</span>
            <span className="truncate font-medium text-slate-800">Accounting Consultation</span>
            <span className="text-right text-slate-600">1</span>
            <span className="truncate text-right text-slate-600">RM 1,200</span>
            <span className="truncate text-right font-semibold text-slate-950">RM 1,200</span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <div>
            <p className="text-[0.68rem] font-bold text-slate-950">Payment Details</p>
            <dl className="mt-2 grid grid-cols-[4.2rem_minmax(0,1fr)] gap-x-2 gap-y-1 text-[0.6rem] text-slate-600">
              <dt className="font-semibold">Bank:</dt>
              <dd>Maybank</dd>
              <dt className="font-semibold">Account:</dt>
              <dd>5123 4567 8901</dd>
            </dl>
            <div className="mt-2 flex items-center gap-2">
              <QrCode aria-hidden="true" className="h-9 w-9 shrink-0 text-slate-950" strokeWidth={1.8} />
              <p className="text-[0.58rem] leading-3 text-slate-400">Scan to pay via DuitNow QR</p>
            </div>
          </div>
          <div className="space-y-1.5 text-[0.66rem]">
            <div className="flex justify-between gap-3 text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-950">RM 1,200</span>
            </div>
            <div className="flex justify-between gap-3 text-slate-600">
              <span>SST (8%)</span>
              <span className="font-semibold text-slate-950">RM 96</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-200 pt-2 text-xs font-bold text-slate-950">
              <span>Total Due</span>
              <span>RM 1,296</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:absolute lg:right-0 lg:top-5 lg:mt-0 lg:w-36 lg:grid-cols-1">
        {statusCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/70"
              key={card.title}
            >
              <Icon aria-hidden="true" className="h-5 w-5 text-slate-950" strokeWidth={1.7} />
              <p className="mt-2 text-[0.68rem] font-bold leading-4 text-slate-950">{card.title}</p>
              <p className="mt-1 text-[0.6rem] leading-3 text-slate-500">{card.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniPreview({ type }: { type: (typeof mainTools)[number]["preview"] }) {
  if (type === "invoice") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-[0.68rem]">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-500">Inv. no.</span>
          <span className="font-medium text-slate-950">INV-0042</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-2">
          <span className="font-semibold text-slate-500">Total</span>
          <span className="font-medium text-slate-950">RM 1,296.00</span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="font-semibold text-slate-500">Status</span>
          <span className="rounded bg-teal-50 px-2 py-0.5 font-semibold text-teal-700">Paid</span>
        </div>
      </div>
    );
  }

  if (type === "sst") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-[0.68rem]">
        {[
          ["Amount (RM)", "1,000.00"],
          ["SST (8%)", "80.00"],
          ["Total (RM)", "1,080.00"]
        ].map(([label, value]) => (
          <div className="flex justify-between border-b border-slate-100 py-2 first:pt-0 last:border-b-0 last:pb-0" key={label}>
            <span className="font-semibold text-slate-500">{label}</span>
            <span className="font-semibold text-slate-950">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "trial-balance") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-[0.68rem]">
        {[
          ["Total Debit", "RM 15,000.00", "text-slate-950"],
          ["Total Credit", "RM 15,000.00", "text-slate-950"],
          ["Difference", "0.00", "text-teal-700"]
        ].map(([label, value, color]) => (
          <div className="flex justify-between border-b border-slate-100 py-2 first:pt-0 last:border-b-0 last:pb-0" key={label}>
            <span className="font-semibold text-slate-500">{label}</span>
            <span className={`font-semibold ${color}`}>{value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-[0.68rem]">
      {[
        ["Cash In", "RM 18,230.00", "text-slate-950"],
        ["Cash Out", "RM 12,450.00", "text-slate-950"],
        ["Net Cash Flow", "RM 5,780.00", "text-teal-700"]
      ].map(([label, value, color]) => (
        <div className="flex justify-between border-b border-slate-100 py-2 first:pt-0 last:border-b-0 last:pb-0" key={label}>
          <span className="font-semibold text-slate-500">{label}</span>
          <span className={`font-semibold ${color}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function ToolCard({ tool }: { tool: (typeof mainTools)[number] }) {
  const Icon = tool.icon;

  return (
    <Link
      aria-label={`Open ${tool.title}`}
      className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-200/80 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={tool.href}
    >
      <MiniPreview type={tool.preview} />
      <div className="mt-5 flex flex-1 items-stretch gap-3">
        <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-slate-950" strokeWidth={1.7} />
        <div className="flex min-h-0 flex-1 flex-col">
          <h3 className="text-lg font-semibold text-slate-950">{tool.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-slate-950 transition group-hover:text-teal-700">
            {tool.cta}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function GuideCard({ guide }: { guide: (typeof guideCards)[number] }) {
  const Icon = guide.icon;

  return (
    <Link
      aria-label={`Read ${guide.title}`}
      className="group flex h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-200/80 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={guide.href}
    >
      <div className="flex h-full flex-1 items-start gap-4">
        <Icon aria-hidden="true" className="mt-1 h-8 w-8 shrink-0 text-slate-950" strokeWidth={1.6} />
        <div className="flex min-h-0 flex-1 flex-col">
          <h3 className="text-base font-semibold text-slate-950">{guide.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-slate-950 transition group-hover:text-teal-700">
            {guide.cta}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="bg-white text-slate-950">
      <JsonLd data={createWebsiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />

      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1fr)] lg:items-center lg:px-8 lg:py-20">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-[3.4rem]">
              Simple Accounting Tools for Everyday Business Work
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Create invoices, calculate SST, check cash flow, and verify accounts&mdash;anytime,
              in one clean workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/tools/invoice-generator">
                <FileText aria-hidden="true" className="h-4 w-4" />
                Create invoice
              </PrimaryButton>
              <SecondaryButton href="/tools">
                Explore tools
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </SecondaryButton>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div className="border-r border-slate-200 pr-4 last:border-r-0" key={point.label}>
                    <Icon aria-hidden="true" className="h-7 w-7 text-slate-950" strokeWidth={1.6} />
                    <p className="mt-2 text-sm font-semibold leading-5 text-slate-950">{point.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <HeroInvoicePreview />
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <SectionTitle
          action={<InlineAction href="/tools">All tools</InlineAction>}
          description="Practical tools for Malaysian businesses, freelancers, traders, students, and beginners."
        >
          Start with the Tool You Need Today
        </SectionTitle>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mainTools.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-slate-950">
          Why Choose Accounting Tools Lab?
        </h2>
        <div className="mt-8 grid gap-7 md:grid-cols-3 md:divide-x md:divide-slate-200">
          {benefits.map((benefit, index) => {
            const Icon = "icon" in benefit ? benefit.icon : null;

            return (
              <article className={index > 0 ? "md:pl-7" : ""} key={benefit.title}>
                <div className="flex items-start gap-4">
                  {Icon ? (
                    <Icon aria-hidden="true" className="h-10 w-10 shrink-0 text-slate-950" strokeWidth={1.5} />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center text-2xl leading-none"
                    >
                      {"flag" in benefit ? benefit.flag : ""}
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-slate-950">How It Works</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="contents" key={step.title}>
                <article className="p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-950">
                      {index + 1}
                    </span>
                    <Icon aria-hidden="true" className="h-9 w-9 text-slate-950" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </article>
                {index < steps.length - 1 ? (
                  <ArrowRight aria-hidden="true" className="hidden h-6 w-6 text-slate-950 lg:block" />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <SectionTitle
          action={<InlineAction href="/guides">All guides</InlineAction>}
          description="Straightforward accounting explainers for invoices, debit and credit, and bookkeeping checks."
        >
          Learn the Basics with Practical Guides
        </SectionTitle>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {guideCards.map((guide) => (
            <GuideCard guide={guide} key={guide.href} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <ReceiptText aria-hidden="true" className="hidden h-14 w-14 text-slate-950 lg:block" strokeWidth={1.5} />
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-950">
                Ready to Create Your First Invoice?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Free PDF invoices with MYR and SST support. No sign-up. No limits.
              </p>
            </div>
            <PrimaryButton href="/tools/invoice-generator">
              <FileText aria-hidden="true" className="h-4 w-4" />
              Create invoice
            </PrimaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}
