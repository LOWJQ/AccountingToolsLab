import Image from "next/image";

const navItems = [
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" }
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a className="flex items-center" href="/" aria-label="AccountingToolsLab home">
          <Image
            alt="AccountingToolsLab"
            className="h-auto w-[185px] sm:w-[220px]"
            height={52}
            priority
            src="/logo.png"
            width={220}
          />
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 sm:flex">
          {navItems.map((item) => (
            <a className="transition hover:text-stone-950" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="inline-flex h-10 items-center justify-center rounded-full bg-slate-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          href="/tools"
        >
          Start
        </a>
      </div>
    </header>
  );
}
