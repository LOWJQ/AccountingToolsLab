import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/**
 * Sitemap lastmod dates are hand-written, so they drift the moment someone
 * edits a page and forgets to bump the date. This works out what each date
 * should be by asking git when the files behind that route last changed, then
 * reports the differences. Pass --fix to write the corrected dates back.
 *
 * A route is more than its page.tsx: the invoice generator's content lives
 * mostly in components. Imports are followed so a change to a shared component
 * counts as a change to every page that renders it.
 */

const projectRoot = resolve(process.cwd());
const shouldFix = process.argv.includes("--fix");

const DATE_SOURCES = [
  { file: "lib/data/tools.ts", kind: "record" },
  { file: "lib/data/guides.ts", kind: "record" },
  { file: "app/sitemap.ts", kind: "standalone" }
];

function readSource(file) {
  return readFileSync(join(projectRoot, file), "utf8");
}

/** Routes and their recorded dates, read straight from the files that own them. */
function collectRecordedDates() {
  const recorded = new Map();

  for (const { file, kind } of DATE_SOURCES) {
    const source = readSource(file);

    if (kind === "record") {
      // href sits a few lines above lastModified inside each record.
      const pattern = /href:\s*"([^"]+)"[\s\S]{0,200}?lastModified:\s*"(\d{4}-\d{2}-\d{2})"/g;

      for (const match of source.matchAll(pattern)) {
        recorded.set(match[1], { date: match[2], file });
      }
    } else {
      const pattern = /\{\s*path:\s*"([^"]*)",\s*lastModified:\s*"(\d{4}-\d{2}-\d{2})"\s*\}/g;

      for (const match of source.matchAll(pattern)) {
        recorded.set(match[1] === "" ? "/" : match[1], { date: match[2], file });
      }
    }
  }

  return recorded;
}

function listRoutes() {
  const routes = [];

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name === "page.tsx") {
        const route = `/${relative(join(projectRoot, "app"), dirname(full)).split("\\").join("/")}`;
        routes.push({ file: full, route: route === "/." ? "/" : route });
      }
    }
  }

  walk(join(projectRoot, "app"));

  return routes;
}

const EXTENSIONS = [".ts", ".tsx", ".mjs", ".js"];

function resolveImport(specifier, fromFile) {
  let base;

  if (specifier.startsWith("@/")) {
    base = join(projectRoot, specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = resolve(dirname(fromFile), specifier);
  } else {
    return null; // node_modules, not our content
  }

  for (const extension of EXTENSIONS) {
    if (existsSync(base + extension)) {
      return base + extension;
    }
  }

  for (const extension of EXTENSIONS) {
    const indexFile = join(base, `index${extension}`);

    if (existsSync(indexFile)) {
      return indexFile;
    }
  }

  return existsSync(base) ? base : null;
}

/** Every project file a route pulls in, followed transitively. */
function collectDependencies(entryFile) {
  const seen = new Set();
  const queue = [entryFile];

  while (queue.length > 0) {
    const current = queue.pop();

    if (!current || seen.has(current)) {
      continue;
    }

    seen.add(current);

    let source;

    try {
      source = readFileSync(current, "utf8");
    } catch {
      continue;
    }

    const pattern = /(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g;

    for (const match of source.matchAll(pattern)) {
      const resolved = resolveImport(match[1], current);

      if (resolved && !seen.has(resolved)) {
        queue.push(resolved);
      }
    }
  }

  return [...seen];
}

const dirtyFiles = new Set(
  execFileSync("git", ["status", "--porcelain"], { cwd: projectRoot, encoding: "utf8" })
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map((path) => resolve(projectRoot, path))
);

const today = new Date().toISOString().slice(0, 10);

function lastChangedDate(file) {
  // Uncommitted edits have no commit date yet, but they are still changes.
  if (dirtyFiles.has(resolve(file))) {
    return today;
  }

  try {
    const output = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
      cwd: projectRoot,
      encoding: "utf8"
    }).trim();

    return output || null;
  } catch {
    return null;
  }
}

const recorded = collectRecordedDates();
const stale = [];
const missing = [];

for (const { file, route } of listRoutes()) {
  const entry = recorded.get(route);

  if (!entry) {
    missing.push(route);
    continue;
  }

  const dates = collectDependencies(file)
    .map((dependency) => lastChangedDate(dependency))
    .filter(Boolean)
    .sort();
  const actual = dates[dates.length - 1];

  if (actual && actual > entry.date) {
    stale.push({ actual, recorded: entry.date, route, source: entry.file });
  }
}

if (missing.length > 0) {
  console.log("Routes with no sitemap entry:");

  for (const route of missing) {
    console.log(`  ${route}`);
  }

  console.log("");
}

if (stale.length === 0) {
  console.log("All sitemap dates are up to date.");
  process.exit(missing.length > 0 ? 1 : 0);
}

console.log(`${stale.length} route${stale.length === 1 ? "" : "s"} with a stale lastmod:\n`);

for (const item of stale) {
  console.log(`  ${item.route}`);
  console.log(`    recorded ${item.recorded} -> should be ${item.actual}  (${item.source})`);
}

if (!shouldFix) {
  console.log("\nRun with --fix to update them.");
  process.exit(1);
}

const edits = new Map();

for (const item of stale) {
  if (!edits.has(item.source)) {
    edits.set(item.source, readSource(item.source));
  }

  const source = edits.get(item.source);
  const pattern =
    item.source === "app/sitemap.ts"
      ? new RegExp(
          `(\\{\\s*path:\\s*"${item.route === "/" ? "" : item.route}",\\s*lastModified:\\s*")${item.recorded}(")`
        )
      : new RegExp(`(href:\\s*"${item.route}"[\\s\\S]{0,200}?lastModified:\\s*")${item.recorded}(")`);

  edits.set(item.source, source.replace(pattern, `$1${item.actual}$2`));
}

for (const [file, source] of edits) {
  writeFileSync(join(projectRoot, file), source);
  console.log(`\nUpdated ${file}`);
}

console.log("\nDates fixed.");
