import Image from "next/image";
import Link from "next/link";

import { guides } from "@/lib/data/guides";
import { tools } from "@/lib/data/tools";

type FooterLink = {
  label: string;
  href: string;
  shortLabel?: string;
};

const footerGuideLabels: Record<string, { label: string; shortLabel: string }> = {
  "debit-vs-credit": {
    label: "Debit vs Credit",
    shortLabel: "Debit vs Credit"
  },
  "trial-balance-explained": {
    label: "Trial Balance Explained",
    shortLabel: "Trial Balance"
  },
  "why-trial-balance-not-balancing": {
    label: "Why Trial Balance Does Not Balance",
    shortLabel: "Trial Balance Errors"
  },
  "journal-entries-for-beginners": {
    label: "Journal Entries for Beginners",
    shortLabel: "Journal Entries"
  },
  "financial-ratios-for-beginners": {
    label: "Financial Ratios for Beginners",
    shortLabel: "Financial Ratios"
  },
  "cash-flow-vs-profit": {
    label: "Cash Flow vs Profit",
    shortLabel: "Cash Flow vs Profit"
  },
  "break-even-point-explained": {
    label: "Break-even Point Explained",
    shortLabel: "Break-even Point"
  },
  "straight-line-depreciation-explained": {
    label: "Straight-Line Depreciation",
    shortLabel: "Depreciation"
  },
  "how-to-create-a-simple-invoice": {
    label: "Simple Invoice Guide",
    shortLabel: "Simple Invoice"
  },
  "sst-calculator-malaysia-add-remove-sst": {
    label: "SST Calculator Malaysia Guide",
    shortLabel: "SST Malaysia"
  }
};

const footerGuideLinks: FooterLink[] = [
  { label: "All Guides", href: "/guides" },
  ...guides
    .filter((guide) => guide.status === "available" && footerGuideLabels[guide.slug])
    .map((guide) => ({
      href: guide.href,
      label: footerGuideLabels[guide.slug].label,
      shortLabel: footerGuideLabels[guide.slug].shortLabel
    }))
];

const footerSections = [
  {
    title: "Tools",
    links: [
      { label: "All Tools", href: "/tools" },
      ...tools.map((tool) => ({
        label: tool.name,
        href: tool.href
      }))
    ]
  },
  {
    title: "Guides",
    links: footerGuideLinks
  },
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8 lg:py-16">
        <div>
          <Link className="inline-flex items-center" href="/" aria-label="AccountingToolsLab home">
            <Image
              alt="AccountingToolsLab"
              className="h-auto w-[220px]"
              height={52}
              src="/logo-optimized.png"
              width={220}
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600">
            Free accounting tools and beginner-friendly guides for students, new founders,
            and small business owners.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-stone-950">{section.title}</h2>
              <ul
                className={
                  section.title === "Tools" || section.title === "Guides"
                    ? "mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:block sm:space-y-3"
                    : "mt-4 space-y-3"
                }
              >
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-sm text-stone-500 transition hover:text-stone-900"
                      href={link.href}
                    >
                      {link.shortLabel ? (
                        <>
                          <span className="sm:hidden">{link.shortLabel}</span>
                          <span className="hidden sm:inline">{link.label}</span>
                        </>
                      ) : (
                        link.label
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-stone-100 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Copyright 2026 AccountingToolsLab. All rights reserved.</p>
        <p>Built for simple accounting education.</p>
      </div>
    </footer>
  );
}
