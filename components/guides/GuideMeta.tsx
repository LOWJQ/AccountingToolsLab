import { guideBySlug } from "@/lib/data/guides";
import { formatLongDate } from "@/lib/utils/format-date";

type GuideMetaProps = {
  /** Guide slug. Both the date and the read time come from the guide record. */
  slug: string;
};

/**
 * The dateline under a guide h1. Reads the same guide record that feeds the
 * Article dateModified and the sitemap lastmod, so the date a reader sees and
 * the date a crawler reads cannot disagree. They had drifted apart on two
 * guides while this line was typed by hand into each page.
 *
 * The <time> element carries the machine-readable date, since the visible text
 * is prose.
 */
export function GuideMeta({ slug }: GuideMetaProps) {
  const guide = guideBySlug(slug);

  return (
    <p className="mt-5 text-sm text-slate-950">
      Updated on{" "}
      <time dateTime={guide.lastModified}>{formatLongDate(guide.lastModified)}</time>{" "}
      <span aria-hidden="true">-</span> {guide.readTime} min read
    </p>
  );
}
