import assert from "node:assert/strict";
import sitemap from "../app/sitemap";
import { guides } from "../lib/data/guides";
import { tools } from "../lib/data/tools";
import { createMetadata } from "../lib/seo/metadata";
import { buildAssetUrl, siteConfig } from "../lib/seo/site";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
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

test("createMetadata generates consistent canonical and language URLs", () => {
  const metadata = createMetadata({
    title: "Test Page",
    description: "Test description",
    path: "tools/invoice-generator"
  });

  assert.equal(
    metadata.alternates?.canonical,
    "https://www.accountingtoolslab.com/tools/invoice-generator"
  );
  assert.deepEqual(metadata.alternates?.languages, {
    "en-MY": "https://www.accountingtoolslab.com/tools/invoice-generator"
  });
  assert.equal(
    metadata.openGraph?.url,
    "https://www.accountingtoolslab.com/tools/invoice-generator"
  );
});

test("createMetadata resolves custom OG image URLs consistently", () => {
  const metadata = createMetadata({
    title: "Invoice",
    path: "/tools/invoice-generator",
    ogImage: {
      alt: "Invoice OG image",
      height: 630,
      url: "/og-invoice-generator-guide.png",
      width: 1200
    }
  });
  const expectedImageUrl = buildAssetUrl("/og-invoice-generator-guide.png");

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
