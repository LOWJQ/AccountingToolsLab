const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.accountingtoolslab.com";

export function buildAssetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}

export const siteConfig = {
  name: "AccountingToolsLab",
  description: "Free accounting tools and guides for learners and small businesses.",
  url: siteUrl,
  ogImage: {
    url: buildAssetUrl("/og-image.png"),
    width: 1200,
    height: 630,
    alt: "AccountingToolsLab - Free accounting calculators and guides"
  }
};
