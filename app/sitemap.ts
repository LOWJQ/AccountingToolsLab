import type { MetadataRoute } from "next";
import { guides } from "@/lib/data/guides";
import { tools } from "@/lib/data/tools";
import { siteConfig } from "@/lib/seo/site";

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
    url: `${siteConfig.url}${route || "/"}`
  }));
}
