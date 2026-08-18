import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guides } from "@/lib/data/guides";
import type { Guide } from "@/lib/data/guides";

/**
 * Mirrors components/tools/ToolsDirectory so the guides directory and the tools
 * directory read as one system. Guide cards deliberately carry no icon: the
 * category kicker is the distinguishing mark here, the way the icon is on a
 * tool card.
 */
function GuideCard({ guide }: { guide: Guide }) {
  const isAvailable = guide.status === "available";

  const body = (
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium tracking-wide text-slate-500">{guide.category}</p>
      <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950">{guide.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{guide.menuDescription}</p>
    </div>
  );

  if (!isAvailable) {
    return (
      <article className="flex min-h-[164px] items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
        {body}
        <span className="mt-1 shrink-0 text-xs font-medium text-slate-500">Soon</span>
      </article>
    );
  }

  return (
    <Link
      className="group flex min-h-[164px] items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
      href={guide.href}
    >
      {body}
      <ArrowRight
        aria-hidden="true"
        className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
      />
    </Link>
  );
}

export function GuidesDirectory() {
  return (
    <section
      aria-label="Invoice and accounting guides"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {guides.map((guide) => (
        <GuideCard guide={guide} key={guide.slug} />
      ))}
    </section>
  );
}
