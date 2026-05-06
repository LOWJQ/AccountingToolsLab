import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/tools",
    "/tools/trial-balance-calculator",
    "/tools/accounting-equation-calculator",
    "/tools/debit-credit-checker",
    "/tools/financial-ratio-calculator",
    "/tools/depreciation-calculator",
    "/tools/break-even-calculator",
    "/tools/cash-flow-calculator",
    "/tools/invoice-generator",
    "/guides",
    "/guides/trial-balance-explained",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms"
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`
  }));
}
