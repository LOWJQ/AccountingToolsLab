import Link from "next/link";
import { tools } from "@/lib/data/tools";

const featuredToolSlugs = [
  "invoice-generator",
  "sst-calculator-malaysia",
  "cash-flow-calculator",
  "break-even-calculator",
  "trial-balance-calculator",
  "accounting-equation-calculator",
  "debit-credit-checker",
  "financial-ratio-calculator",
  "depreciation-calculator",
  "journal-entry-checker"
];

const marqueeTools = featuredToolSlugs
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

export function ToolsMarquee() {
  const loopedTools = [...marqueeTools, ...marqueeTools];

  return (
    <div
      aria-label="Featured accounting tools"
      className="tools-marquee relative left-1/2 mt-14 w-screen max-w-none -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="tools-marquee-track flex w-max items-center gap-4 px-6 pr-4 sm:gap-6 sm:px-8 sm:pr-6 lg:px-10">
        {loopedTools.map((tool, index) => (
          <Link
            aria-label={`Open ${tool.name}`}
            className="group inline-flex shrink-0 items-center rounded-full px-4 py-2 text-lg font-bold tracking-tight text-stone-800 transition hover:bg-white/70 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-stone-200 sm:px-5 sm:text-xl lg:text-2xl"
            href={tool.href}
            key={`${tool.slug}-${index}`}
          >
            <span className="transition group-hover:-translate-y-0.5">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
