import { guideBySlug } from "@/lib/data/guides";
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
        author: {
          "@type": "Organization",
          name: siteConfig.name
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url
        },
        ...(image ? { image } : {}),
        mainEntityOfPage: pageUrl
      }}
    />
  );
}
