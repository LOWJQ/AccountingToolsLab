import type { Metadata } from "next";
import { siteConfig } from "./site";

type CreateMetadataInput = {
  title: string;
  description?: string;
  path?: string;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/"
}: CreateMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}${path}`
    }
  };
}
