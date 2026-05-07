import type { Metadata } from "next";
import { siteConfig } from "./site";

type CreateMetadataInput = {
  title: string;
  description?: string;
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
  path = "/"
}: CreateMetadataInput): Metadata {
  const canonicalPath = normalizePath(path);
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website"
    }
  };
}
