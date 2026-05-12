import { siteConfig } from "./site";

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`
  };
}

export function createSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication"
  };
}

export function createFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage"
  };
}

export function createItemListSchema(
  items: Array<{
    name: string;
    url: string;
    description?: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebApplication",
        name: item.name,
        url: item.url,
        ...(item.description ? { description: item.description } : {})
      }
    }))
  };
}
