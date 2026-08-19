import { buildAssetUrl, siteConfig } from "./site";

/**
 * Stable identifiers for the two nodes that describe the site itself. Other
 * schema nodes point at these by @id rather than repeating the organisation
 * inline, so a search or answer engine resolves one entity instead of several
 * look-alikes it has to reconcile.
 *
 * Both nodes are emitted from the root layout, so these references resolve on
 * every page, not just the homepage.
 */
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-MY"
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: {
      "@type": "ImageObject",
      url: buildAssetUrl("/logo-optimized.png")
    },
    areaServed: {
      "@type": "Country",
      name: "Malaysia"
    },
    knowsAbout: [
      "Malaysian SST",
      "LHDN e-Invoice",
      "Invoicing",
      "Bookkeeping",
      "Financial statements"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteConfig.url}/contact`
    },
    // The same editorial policy each Article node cites, stated once for the
    // organisation as a whole.
    publishingPrinciples: `${siteConfig.url}/editorial-policy`
    // No `sameAs` yet. An empty array is worse than an absent property, so the
    // profile URLs go here once they actually exist.
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
