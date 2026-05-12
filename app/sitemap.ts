import type { MetadataRoute } from "next";
import { guides } from "../lib/data/guides";
import { tools } from "../lib/data/tools";
import { siteConfig } from "../lib/seo/site";

const defaultLastModified = "2026-05-08";

const updatedRouteLastModified: Record<string, string> = {
  "": "2026-05-08",
  "/tools": "2026-05-08",
  "/about": "2026-05-08",
  "/guides/debit-vs-credit": "2026-05-08",
  "/guides/journal-entries-for-beginners": "2026-05-08",
  "/guides/trial-balance-explained": "2026-05-08",
  "/guides/why-trial-balance-not-balancing": "2026-05-08",
  "/guides/financial-ratios-for-beginners": "2026-05-08",
  "/guides/cash-flow-vs-profit": "2026-05-08",
  "/guides/break-even-point-explained": "2026-05-08",
  "/guides/straight-line-depreciation-explained": "2026-05-08",
  "/guides/how-to-create-a-simple-invoice": "2026-05-12",
  "/guides/sst-calculator-malaysia-add-remove-sst": "2026-05-08",
  "/tools/invoice-generator": "2026-05-11"
};

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tools",
    ...tools.map((tool) => tool.href),
    "/guides",
    ...guides.filter((guide) => guide.status === "available").map((guide) => guide.href),
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms"
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route || "/"}`,
    lastModified: updatedRouteLastModified[route] ?? defaultLastModified
  }));
}
