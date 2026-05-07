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
    "/tools/sst-calculator-malaysia",
    "/tools/journal-entry-checker",
    "/guides",
    "/guides/break-even-point-explained",
    "/guides/cash-flow-vs-profit",
    "/guides/debit-vs-credit",
    "/guides/financial-ratios-for-beginners",
    "/guides/how-to-create-a-simple-invoice",
    "/guides/journal-entries-for-beginners",
    "/guides/sst-calculator-malaysia-add-remove-sst",
    "/guides/straight-line-depreciation-explained",
    "/guides/trial-balance-explained",
    "/guides/why-trial-balance-not-balancing",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms"
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route || "/"}`
  }));
}
