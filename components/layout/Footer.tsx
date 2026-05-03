const footerSections = [
  {
    title: "Tools",
    links: ["Trial Balance", "Accounting Equation", "Debit/Credit Checker", "Financial Ratios"]
  },
  {
    title: "Guides",
    links: ["Debit vs Credit", "Trial Balance Explained", "Ratios for Beginners"]
  },
  {
    title: "Company",
    links: ["About", "Contact", "Roadmap"]
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms"]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8 lg:py-16">
        <div>
          <div className="flex items-center gap-3 text-sm font-semibold text-stone-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
              ATL
            </span>
            <span>AccountingToolsLab</span>
          </div>
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
                  <li key={link}>
                    <a className="text-sm text-stone-500 transition hover:text-stone-900" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-stone-100 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 AccountingToolsLab. All rights reserved.</p>
        <p>Built for simple accounting education.</p>
      </div>
    </footer>
  );
}
