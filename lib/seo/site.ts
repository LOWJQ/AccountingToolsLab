const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.accountingtoolslab.com";

export const siteConfig = {
  name: "AccountingToolsLab",
  description: "Free accounting tools and guides for learners and small businesses.",
  url: siteUrl,
  ogImage: {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "AccountingToolsLab - Free accounting calculators and guides"
  },
  social: {
    x: "",
    linkedin: ""
  }
};
