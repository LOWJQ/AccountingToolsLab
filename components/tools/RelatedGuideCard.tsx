import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guideCard } from "@/lib/data/guides";

type RelatedGuideCardProps = {
  /** Short kicker above the title, e.g. "Trial balance guide". */
  eyebrow: string;
  /** Slug of the guide to link. Title and description come from the record. */
  slug: string;
  showTopBorder?: boolean;
};

export function RelatedGuideCard({
  eyebrow,
  showTopBorder = true,
  slug
}: RelatedGuideCardProps) {
  const guide = guideCard(slug);

  return (
    <section className={`${showTopBorder ? "border-t border-slate-200 " : ""}pt-8`}>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        Related Guide Article
      </h2>
      <Link
        className="group mt-5 flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
        href={guide.href}
      >
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium leading-7 text-black">{eyebrow}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {guide.title}
          </h3>
          <p className="mt-2 max-w-3xl text-base leading-7 text-black">{guide.description}</p>
        </div>
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
        />
      </Link>
    </section>
  );
}
