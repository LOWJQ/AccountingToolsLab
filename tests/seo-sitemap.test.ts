import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sitemap from "../app/sitemap";
import { guides } from "../lib/data/guides";
import { tools } from "../lib/data/tools";
import { createGuideMetadata, createMetadata } from "../lib/seo/metadata";
import { buildAssetUrl, siteConfig } from "../lib/seo/site";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

function publicAssetPathFromUrl(url: string): string {
  const pathname = new URL(url).pathname.replace(/^\/+/, "");
  return join(process.cwd(), "public", pathname);
}

/**
 * Social preview images must stay small. WhatsApp in particular silently drops
 * previews for oversized images, and it is a primary sharing channel for this
 * site. Both OG images were once ~750 KB and ~1 MB.
 */
const maxOgImageBytes = 300 * 1024;

function readImageDimensions(filePath: string): { height: number; width: number } {
  const buffer = readFileSync(filePath);

  if (buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer.readUInt16BE(0) === 0xffd8) {
    // Walk the JPEG segment chain to the start-of-frame marker, which carries
    // the real dimensions. Everything before it is metadata of varying length.
    let offset = 2;

    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        break;
      }

      const marker = buffer[offset + 1];
      const isStartOfFrame =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }

      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  throw new Error(`${filePath} is not a readable PNG or JPEG`);
}

function assertOgImage(filePath: string, expected: { height: number; width: number }) {
  assert.equal(existsSync(filePath), true, filePath);
  assert.deepEqual(readImageDimensions(filePath), expected, filePath);

  const bytes = readFileSync(filePath).length;
  assert.ok(
    bytes <= maxOgImageBytes,
    `${filePath} is ${Math.round(bytes / 1024)} KB, over the ${maxOgImageBytes / 1024} KB budget`
  );
}

test("sitemap includes all tools", () => {
  const urls = new Set(sitemap().map((entry) => entry.url));

  tools.forEach((tool) => {
    assert.equal(urls.has(`${siteConfig.url}${tool.href}`), true, tool.href);
  });
});

test("sitemap includes all available guides", () => {
  const urls = new Set(sitemap().map((entry) => entry.url));

  guides
    .filter((guide) => guide.status === "available")
    .forEach((guide) => {
      assert.equal(urls.has(`${siteConfig.url}${guide.href}`), true, guide.href);
    });
});

// The site ships a single en-MY version of every page, so createMetadata
// deliberately emits no hreflang. A lone self-referencing alternate tells
// Google nothing and can narrow perceived targeting, so absence is the
// expected output here, not an oversight.
test("createMetadata generates consistent canonical URLs without hreflang", () => {
  const metadata = createMetadata({
    title: "Test Page",
    description: "Test description",
    path: "tools/invoice-generator"
  });

  assert.equal(
    metadata.alternates?.canonical,
    "https://www.accountingtoolslab.com/tools/invoice-generator"
  );
  assert.equal(metadata.alternates?.languages, undefined);
  assert.equal(
    metadata.openGraph?.url,
    "https://www.accountingtoolslab.com/tools/invoice-generator"
  );
});

// Guides used to hardcode datePublished/dateModified inside each page's
// Article JSON-LD while the sitemap read lastModified from the guide record.
// Two guides had already drifted apart, sending Google conflicting freshness
// signals for the same URL. Both now read the same field; this keeps it that way.
test("every guide's article dates match its sitemap lastmod", () => {
  const sitemapEntries = new Map(sitemap().map((entry) => [entry.url, entry.lastModified]));

  guides
    .filter((guide) => guide.status === "available" && !guide.noindex)
    .forEach((guide) => {
      const metadata = createGuideMetadata({
        slug: guide.slug,
        title: guide.title,
        description: guide.description
      });
      const openGraph = metadata.openGraph as {
        modifiedTime?: string;
        publishedTime?: string;
        type?: string;
      };

      assert.equal(openGraph.type, "article", guide.slug);
      assert.equal(openGraph.publishedTime, guide.datePublished, guide.slug);
      assert.equal(
        openGraph.modifiedTime,
        sitemapEntries.get(`${siteConfig.url}${guide.href}`),
        guide.slug
      );
    });
});

test("non-article pages stay og:type website", () => {
  const metadata = createMetadata({ title: "Tools", path: "/tools" });

  assert.equal((metadata.openGraph as { type?: string }).type, "website");
});

test("createMetadata resolves custom OG image URLs consistently", () => {
  const metadata = createMetadata({
    title: "Invoice",
    path: "/tools/invoice-generator",
    ogImage: {
      alt: "Invoice OG image",
      height: 630,
      url: "/og-invoice-generator-guide.jpg",
      width: 1200
    }
  });
  const expectedImageUrl = buildAssetUrl("/og-invoice-generator-guide.jpg");

  assert.deepEqual(metadata.twitter?.images, [expectedImageUrl]);
  assert.deepEqual(metadata.openGraph?.images, [
    {
      alt: "Invoice OG image",
      height: 630,
      url: expectedImageUrl,
      width: 1200
    }
  ]);
});

test("default OG image exists, matches dimensions, and stays under budget", () => {
  assertOgImage(publicAssetPathFromUrl(siteConfig.ogImage.url), {
    width: siteConfig.ogImage.width,
    height: siteConfig.ogImage.height
  });
});

test("custom invoice OG image exists and matches metadata dimensions", () => {
  const metadata = createMetadata({
    title: "Invoice",
    path: "/tools/invoice-generator",
    ogImage: {
      alt: "Invoice OG image",
      height: 630,
      url: "/og-invoice-generator-guide.jpg",
      width: 1200
    }
  });
  const [image] = metadata.openGraph?.images as Array<{
    alt: string;
    height: number;
    url: string;
    width: number;
  }>;
  assertOgImage(publicAssetPathFromUrl(image.url), {
    width: image.width,
    height: image.height
  });
});
