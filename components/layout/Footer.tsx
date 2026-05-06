import Image from "next/image";

const footerSections = [
  {
    title: "Tools",
    links: [
      { label: "All Tools", href: "/tools" },
      { label: "Trial Balance Calculator", href: "/tools/trial-balance-calculator" },
      { label: "Accounting Equation Calculator", href: "/tools/accounting-equation-calculator" },
      { label: "Debit/Credit Checker", href: "/tools/debit-credit-checker" },
      { label: "Financial Ratio Calculator", href: "/tools/financial-ratio-calculator" },
      { label: "Depreciation Calculator", href: "/tools/depreciation-calculator" },
      { label: "Break-even Calculator", href: "/tools/break-even-calculator" },
      { label: "Cash Flow Calculator", href: "/tools/cash-flow-calculator" },
      { label: "Invoice Generator", href: "/tools/invoice-generator" }
    ]
  },
  {
    title: "Guides",
    links: [{ label: "All Guides", href: "/guides" }]
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
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8 lg:py-16">
        <div>
          <a className="inline-flex items-center" href="/" aria-label="AccountingToolsLab home">
            <Image
              alt="AccountingToolsLab"
              className="h-auto w-[220px]"
              height={52}
              src="/logo.png"
              width={220}
            />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600">
            Free accounting tools and beginner-friendly guides for students, new founders,
            and small business owners.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-stone-950">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      className="text-sm text-stone-500 transition hover:text-stone-900"
                      href={link.href}
                    >
                      {link.label}
                    </a>
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
