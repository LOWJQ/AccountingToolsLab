import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { orderedAvailableTools } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { createItemListSchema } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "All Accounting Tools | Free Calculators and Invoice Tools",
  description:
    "Free accounting tools for Malaysia — invoice and receipt generators, SST and business calculators, plus checkers for LHDN e-Invoice rules and journal entries.",
  path: "/tools"
});

// Built from the same records the directory renders, in the same grouped
// order, so the ItemList schema always describes exactly what a visitor sees.
// No description: the directory lists names only now, and structured data
// should not claim text that is not on the page.
const toolItemList = orderedAvailableTools.map((tool) => ({
  name: tool.name,
  url: `${siteConfig.url}${tool.href}`
}));

export default function ToolsPage() {
  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` }
        ]}
      />
      <JsonLd data={createItemListSchema(toolItemList)} />

      <main className="bg-white">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link className="transition hover:text-slate-900" href="/">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">&gt;</li>
              <li className="font-medium text-slate-700">All Tools</li>
            </ol>
          </nav>

          <section>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              All Accounting Tools
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Free accounting tools for Malaysian businesses, freelancers, and students. MYR
              invoicing, SST and LHDN e-Invoice compliance, and the everyday calculators. No
              sign-up, nothing to install.
            </p>
          </section>

          <ToolsDirectory />
        </div>
      </main>
    </div>
  );
}
