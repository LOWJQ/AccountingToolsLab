import type { MetadataRoute } from "next";
import { guides } from "@/lib/data/guides";
import { tools } from "@/lib/data/tools";
import { siteConfig } from "@/lib/seo/site";

const defaultLastModified = "2026-05-08";

const updatedRouteLastModified: Record<string, string> = {
  "": "2026-05-08",
  "/tools": "2026-05-08",
  "/about": "2026-05-08",
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
