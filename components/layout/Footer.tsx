import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  href: string;
  label: string;
};

const footerSections: Array<{ links: FooterLink[]; title: string }> = [
  {
    title: "Tools",
    links: [
      { label: "Invoice Generator", href: "/tools/invoice-generator" },
      { label: "SST Calculator Malaysia", href: "/tools/sst-calculator-malaysia" },
      { label: "Trial Balance Calculator", href: "/tools/trial-balance-calculator" },
      { label: "Cash Flow Calculator", href: "/tools/cash-flow-calculator" },
      { label: "All Tools", href: "/tools" }
    ]
  },
  {
    title: "Guides",
    links: [
      { label: "What an Invoice Includes", href: "/guides/what-should-an-invoice-include-before-you-send-it" },
      { label: "SST Guide for Businesses", href: "/guides/sst-calculator-malaysia-add-remove-sst" },
      { label: "Debit vs Credit", href: "/guides/debit-vs-credit" },
      { label: "Accounting Basics", href: "/guides" },
      { label: "All Guides", href: "/guides" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms" }
    ]
  }
];

const trustPoints = ["Free tools", "MYR support", "No sign-up needed"];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white text-stone-900">
      <div className="mx-auto max-w-[1240px] px-3 py-12 sm:px-5 sm:py-14 lg:px-6 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <section aria-labelledby="footer-brand" className="max-w-[420px]">
            <Link className="inline-flex items-center" href="/" aria-label="AccountingToolsLab home">
              <Image
                alt="AccountingToolsLab"
                className="h-auto w-[190px] sm:w-[220px]"
                height={52}
                src="/logo-optimized.png"
                width={220}
              />
            </Link>
            <h2 className="sr-only" id="footer-brand">
              AccountingToolsLab
            </h2>
            <p className="mt-5 text-sm leading-6 text-stone-600 sm:text-[0.95rem]">
              Free accounting tools and guides for small businesses, freelancers, students, and
              beginners.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-stone-500">
              {trustPoints.map((point, index) => (
                <span className="inline-flex items-center" key={point}>
                  {index > 0 ? <span className="mr-3 text-stone-300">·</span> : null}
                  {point}
                </span>
              ))}
            </div>
          </section>

          <nav aria-label="Footer navigation" className="w-full max-w-[680px]">
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-sm font-semibold text-stone-950">{section.title}</h2>
                  <ul className="mt-4 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          className="text-sm leading-6 text-stone-500 transition hover:text-stone-950 focus:outline-none"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-stone-200 pt-5 text-xs text-stone-500 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p>Copyright 2026 AccountingToolsLab. All rights reserved.</p>
          <p>Built for simple invoices, business checks, and accounting learning.</p>
        </div>
      </div>
    </footer>
  );
}
