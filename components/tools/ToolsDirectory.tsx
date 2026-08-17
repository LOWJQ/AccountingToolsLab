import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolIconsBySlug } from "@/components/tools/toolIcons";
import { availableTools } from "@/lib/data/tools";
import type { Tool } from "@/types/tool";

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = toolIconsBySlug[tool.slug];

  return (
    <Link
      className="group flex min-h-[164px] items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={tool.href}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-800">
        {Icon ? <Icon aria-hidden="true" className="h-5 w-5" /> : null}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-6 text-slate-950">{tool.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
      />
    </Link>
  );
}

export function ToolsDirectory() {
  return (
    <section aria-label="Accounting tools" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {availableTools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </section>
  );
}
