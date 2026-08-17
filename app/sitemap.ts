import type { MetadataRoute } from "next";
import { indexableGuides } from "../lib/data/guides";
import { tools } from "../lib/data/tools";
import { siteConfig } from "../lib/seo/site";

type SitemapEntry = {
  path: string;
  lastModified: string;
};

// Tool and guide dates live on each entry in lib/data, so editing a page and
// updating its date happen in the same place. Only the standalone pages below
// need a date recorded here.
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = [
    { path: "", lastModified: "2026-07-05" },
    { path: "/tools", lastModified: "2026-07-05" },
    ...tools.map((tool) => ({ path: tool.href, lastModified: tool.lastModified })),
    { path: "/guides", lastModified: "2026-07-28" },
    ...indexableGuides.map((guide) => ({
      path: guide.href,
      lastModified: guide.lastModified
    })),
    { path: "/about", lastModified: "2026-07-05" },
    { path: "/contact", lastModified: "2026-07-05" },
    { path: "/privacy-policy", lastModified: "2026-07-03" },
    { path: "/terms", lastModified: "2026-07-03" }
  ];

  return entries.map(({ path, lastModified }) => ({
    url: `${siteConfig.url}${path || "/"}`,
    lastModified
  }));
}
