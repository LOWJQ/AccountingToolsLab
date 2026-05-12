import type { Metadata } from "next";
import { buildAssetUrl, siteConfig } from "./site";

type CreateMetadataInput = {
  title: string;
  description?: string;
  ogImage?: {
    alt: string;
    height: number;
    url: string;
    width: number;
  };
  path?: string;
};

function normalizePath(path: string): string {
  if (path === "") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function createMetadata({
  title,
  description = siteConfig.description,
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
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-MY": canonicalUrl
      }
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
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
