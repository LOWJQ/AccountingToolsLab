import { guideBySlug } from "@/lib/data/guides";
import { buildAssetUrl, siteConfig } from "@/lib/seo/site";
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
        // Authored and published by the site itself rather than a named person.
        // The publisher logo is what Google asks for on Article markup.
        author: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            "@type": "ImageObject",
            url: buildAssetUrl("/logo-optimized.png")
          }
        },
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
