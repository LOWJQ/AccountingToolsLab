import type { Metadata } from "next";
// Relative, not "@/": the test harness compiles with tsc and runs plain Node,
// which does not resolve the path alias. app/sitemap.ts does the same.
import { guideBySlug } from "../data/guides";
import { buildAssetUrl, siteConfig } from "./site";

type ArticleDates = {
  /** ISO date (YYYY-MM-DD) the article first went live. */
  publishedTime: string;
  /** ISO date (YYYY-MM-DD) of the last meaningful content change. */
  modifiedTime: string;
};

type CreateMetadataInput = {
  title: string;
  description?: string;
  ogImage?: {
    alt: string;
    height: number;
    url: string;
    width: number;
  };
  noindex?: boolean;
  path?: string;
  /**
   * Present for articles only. Switches og:type from "website" to "article"
   * and adds the published/modified timestamps that go with it.
   */
  article?: ArticleDates;
};

function normalizePath(path: string): string {
  if (path === "") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function createMetadata({
  article,
  title,
  description = siteConfig.description,
  noindex = false,
  ogImage = siteConfig.ogImage,
  path = "/"
}: CreateMetadataInput): Metadata {
  const canonicalPath = normalizePath(path);
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;
  const resolvedOgImage = {
    ...ogImage,
    url: buildAssetUrl(ogImage.url)
  };

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: [siteConfig.name]
          }
        : { type: "website" as const }),
      images: [
        {
          url: resolvedOgImage.url,
          width: resolvedOgImage.width,
          height: resolvedOgImage.height,
          alt: resolvedOgImage.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage.url]
    }
  };
}

type CreateGuideMetadataInput = Omit<CreateMetadataInput, "article" | "path"> & {
  slug: string;
};

/**
 * Metadata for a guide article. Canonical path and both article dates come
 * from the guide record, so the sitemap lastmod, og:article:modified_time,
 * and Article dateModified can never disagree the way they used to when each
 * page hardcoded its own dates.
 *
 * `title` stays explicit: several guides run a keyword-tuned <title> that
 * differs from the on-page headline, which is intentional.
 */
export function createGuideMetadata({ slug, ...rest }: CreateGuideMetadataInput): Metadata {
  const guide = guideBySlug(slug);

  return createMetadata({
    ...rest,
    path: guide.href,
    article: {
      publishedTime: guide.datePublished,
      modifiedTime: guide.lastModified
    }
  });
}
