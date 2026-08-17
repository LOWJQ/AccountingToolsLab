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
    logo: `${siteConfig.url}/logo-optimized.png`
  };
}

type ItemListEntry = {
  name: string;
  url: string;
  description?: string;
};

/**
 * Build an ItemList for a directory page. `itemType` must match what the
 * listed pages actually are: the tools directory lists WebApplications, the
 * guides directory lists Articles.
 */
export function createItemListSchema(
  items: ItemListEntry[],
  itemType: "Article" | "WebApplication" = "WebApplication"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": itemType,
        name: item.name,
        url: item.url,
        ...(item.description ? { description: item.description } : {})
      }
    }))
  };
}
