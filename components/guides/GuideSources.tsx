import Link from "next/link";
import { formatLongDate } from "@/lib/utils/format-date";

export type GuideSource = {
  /** What the source is, as the publisher names it. */
  label: string;
  /** Absolute URL of the official page this guide drew on. */
  href: string;
  /** Which part of the guide it supports. */
  note: string;
};

type GuideSourcesProps = {
  /** ISO date (YYYY-MM-DD) the sources were last checked. */
  checkedOn: string;
  sources: GuideSource[];
};

/**
 * Lists the official pages a guide is based on. Malaysian tax guidance changes,
 * and a reader deciding whether to trust a figure needs to reach the authority
 * that published it rather than take this site's word for it. Shown as a
 * visible section rather than buried inline links so the sourcing is obvious.
 */
export function GuideSources({ checkedOn, sources }: GuideSourcesProps) {
  return (
    <section className="mt-12">
      <header className="scroll-mt-28" id="sources">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Sources
        </h2>
      </header>
      <p className="mt-4 text-base leading-7 text-slate-950">
        This guide is based on the official pages below, last checked on{" "}
        {formatLongDate(checkedOn)}. Where they disagree with anything written here, they are
        the authority.
      </p>
      {/* A divided list rather than one box per source: each entry is a link and
          a single line, so borders around them add weight without adding
          separation the hairlines do not already give. */}
      <ul className="mt-5 divide-y divide-slate-200 border-t border-slate-200">
        {sources.map((source) => (
          <li className="py-3" key={source.href}>
            <a
              className="text-base font-semibold text-slate-950 underline-offset-4 hover:underline"
              href={source.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {source.label}
            </a>
            <p className="mt-1 text-sm leading-6 text-slate-600">{source.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-6 text-slate-600">
        How this content is put together is set out in our{" "}
        <Link className="font-semibold underline-offset-4 hover:underline" href="/editorial-policy">
          editorial policy
        </Link>
        .
      </p>
    </section>
  );
}
