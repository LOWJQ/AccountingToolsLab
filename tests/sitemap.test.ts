import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import sitemap from "../app/sitemap";
import { guides } from "../lib/data/guides";
import { siteConfig } from "../lib/seo/site";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

const entries = sitemap();
// Tests run from the project root, but __dirname points into .test-dist once
// compiled, where the .tsx files do not exist.
const projectRoot = resolve(process.cwd());
const appDirectory = join(projectRoot, "app");

/** Every rendered page route, taken from the filesystem rather than a list. */
function listRouteePaths(): string[] {
  const routes: string[] = [];

  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name === "page.tsx") {
        const relativePath = relative(appDirectory, dirname(full)).split("\\").join("/");

        routes.push(relativePath === "" ? "/" : `/${relativePath}`);
      }
    }
  }

  walk(appDirectory);

  return routes;
}

const sitemapPaths = new Set(
  entries.map((entry) => {
    const path = String(entry.url).replace(siteConfig.url, "");

    return path === "" ? "/" : path;
  })
);

// This is the failure that actually costs traffic: a page ships and never gets
// crawled because nobody added it to the data file the sitemap reads.
test("every page route appears in the sitemap", () => {
  const routes = listRouteePaths();

  // Guard against the scan silently finding nothing, which would make the
  // assertion below pass without checking anything.
  assert.ok(routes.length > 10, `expected to find page routes, found ${routes.length}`);

  const missing = routes.filter((route) => !sitemapPaths.has(route));

  assert.deepEqual(missing, [], `routes missing from the sitemap: ${missing.join(", ")}`);
});

test("the sitemap advertises no route that does not exist", () => {
  const routes = new Set(listRouteePaths());
  const extra = [...sitemapPaths].filter((path) => !routes.has(path));

  assert.deepEqual(extra, [], `sitemap lists routes with no page: ${extra.join(", ")}`);
});

test("the sitemap has no duplicate URLs", () => {
  const urls = entries.map((entry) => String(entry.url));

  assert.equal(new Set(urls).size, urls.length);
});

test("every URL uses the canonical origin", () => {
  for (const entry of entries) {
    assert.ok(
      String(entry.url).startsWith(siteConfig.url),
      `${entry.url} does not start with ${siteConfig.url}`
    );
  }
});

test("every entry carries a real ISO lastmod date", () => {
  for (const entry of entries) {
    const lastModified = String(entry.lastModified);

    assert.match(lastModified, /^\d{4}-\d{2}-\d{2}$/, `${entry.url} has lastmod ${lastModified}`);

    const [year, month, day] = lastModified.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));

    assert.equal(parsed.getUTCFullYear(), year, `${entry.url} lastmod is not a real date`);
    assert.equal(parsed.getUTCMonth(), month - 1, `${entry.url} lastmod is not a real date`);
    assert.equal(parsed.getUTCDate(), day, `${entry.url} lastmod is not a real date`);
  }
});

// A future date tells crawlers the page changed after today, which is either a
// typo or a copied placeholder. Either way it is wrong when the sitemap ships.
test("no entry claims a lastmod in the future", () => {
  const today = new Date().toISOString().slice(0, 10);

  for (const entry of entries) {
    assert.ok(
      String(entry.lastModified) <= today,
      `${entry.url} has a future lastmod of ${entry.lastModified}`
    );
  }
});

test("draft guides stay out of the sitemap", () => {
  for (const guide of guides) {
    if (guide.noindex) {
      assert.ok(
        !sitemapPaths.has(guide.href),
        `${guide.href} is noindex but still listed in the sitemap`
      );
    }
  }
});

test("the API route is not advertised as a page", () => {
  assert.ok(![...sitemapPaths].some((path) => path.startsWith("/api")));
});
