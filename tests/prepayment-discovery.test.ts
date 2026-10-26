import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { availableTools, navTools, orderedAvailableTools } from "../lib/data/tools";
import { createItemListSchema } from "../lib/seo/schema";
import { siteConfig } from "../lib/seo/site";

const href = "/tools/prepayment-schedule-generator";
assert.equal(availableTools.filter(tool => tool.href === href).length, 1);
assert.ok(orderedAvailableTools.some(tool => tool.href === href));
assert.ok(!navTools.some(tool => tool.href === href), "the new tool must not change header navigation");
const schema = createItemListSchema(orderedAvailableTools.map(tool => ({ name: tool.name, url: siteConfig.url + tool.href })));
assert.ok(schema.itemListElement.some(row => row.item.url === siteConfig.url + href));
for (const slug of ["depreciation-calculator", "journal-entry-checker", "trial-balance-calculator"]) {
  assert.ok(readFileSync(`app/tools/${slug}/page.tsx`, "utf8").includes(href), `${slug} must link to the new tool`);
}
assert.ok(!readFileSync("components/layout/Footer.tsx", "utf8").includes("prepayment-schedule-generator"));
console.log("PASS prepayment discovery, related links and unchanged navigation scope");
