import { guideBySlug } from "@/lib/data/guides";
import { ORGANIZATION_ID } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import { JsonLd } from "./JsonLd";

type ArticleJsonLdProps = {
  /** Guide slug. Headline, URL, and both dates come from the guide record. */
  slug: string;
  /** Meta description for the page, so schema and <meta> agree. */
  description: string;
  /** Optional absolute URL of the article's lead image. */
  image?: string;
};

export function ArticleJsonLd({ description, image, slug }: ArticleJsonLdProps) {
  const guide = guideBySlug(slug);
  const pageUrl = `${siteConfig.url}${guide.href}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description,
        url: pageUrl,
        datePublished: guide.datePublished,
        dateModified: guide.lastModified,
        // Authored and published by the site itself rather than a named
        // person. Both point at the Organization node the root layout
        // emits, so name, URL, and logo are stated once for the site.
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        // Points readers and crawlers at how this content is researched.
        publishingPrinciples: `${siteConfig.url}/editorial-policy`,
        isAccessibleForFree: true,
        inLanguage: "en-MY",
        ...(image ? { image } : {}),
        mainEntityOfPage: pageUrl
      }}
    />
  );
}
