import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Tools",
    links: [
      { label: "Invoice Generator", href: "/tools/invoice-generator" },
      { label: "SST Calculator Malaysia", href: "/tools/sst-calculator-malaysia" },
      { label: "Cash Flow Calculator", href: "/tools/cash-flow-calculator" },
      { label: "Break-even Calculator", href: "/tools/break-even-calculator" },
      { label: "All Tools", href: "/tools" }
    ]
  },
  {
    title: "Guides",
    links: [
      { label: "Simple Invoice Guide", href: "/guides/how-to-create-a-simple-invoice" },
      {
        label: "SST Calculator Malaysia Guide",
        href: "/guides/sst-calculator-malaysia-add-remove-sst"
      },
      { label: "Cash Flow vs Profit", href: "/guides/cash-flow-vs-profit" },
      { label: "Break-even Point Explained", href: "/guides/break-even-point-explained" },
      { label: "All Guides", href: "/guides" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8 lg:py-12">
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
            Free invoice generator and accounting tools for freelancers, small businesses,
            students, and beginners.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-stone-950">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-sm text-stone-500 transition hover:text-stone-900"
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
      </div>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-3 border-t border-stone-100 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Copyright 2026 AccountingToolsLab. All rights reserved.</p>
        <p>Built for simple invoices, business checks, and accounting learning.</p>
      </div>
    </footer>
  );
}
