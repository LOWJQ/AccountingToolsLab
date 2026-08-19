import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { GuidesDirectory } from "@/components/guides/GuidesDirectory";
import { JsonLd } from "@/components/seo/JsonLd";
import { indexableGuides } from "@/lib/data/guides";
import { createMetadata } from "@/lib/seo/metadata";
import { createItemListSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Invoice and Accounting Guides",
  description:
    "Simple guides on invoices, SST, cash flow, break-even, and accounting basics for small businesses, freelancers, and students.",
  path: "/guides"
});

// Display order comes from lib/data/guides.ts. Draft (noindex) guides stay in
// the visible list but out of the schema, matching what the sitemap submits.
// menuDescription, not description, because that is the line the directory
// card renders and structured data must match the visible text.
const guideItemList = indexableGuides.map((guide) => ({
  name: guide.title,
  url: `${siteConfig.url}${guide.href}`,
  description: guide.menuDescription
}));

export default function GuidesPage() {
  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Guides", url: `${siteConfig.url}/guides` }
        ]}
      />
      <JsonLd data={createItemListSchema(guideItemList, "Article")} />

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
              <li className="font-medium text-slate-700">Guides</li>
            </ol>
          </nav>

          <section>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Invoice and Accounting Guides
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Learn how to create simple invoices, understand SST, check cash flow, estimate
              break-even points, and review beginner-friendly accounting concepts.
            </p>
          </section>

          <GuidesDirectory />
        </div>
      </main>
    </div>
  );
}
