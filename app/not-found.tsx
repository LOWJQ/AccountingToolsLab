import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { availableTools } from "@/lib/data/tools";
import { indexableGuides } from "@/lib/data/guides";

// No canonical or sitemap entry here on purpose: the route already answers
// with a 404 status, which is the signal that matters. This page exists so a
// bad URL lands on something navigable instead of a bare default screen.
export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true }
};

const popularTools = availableTools.slice(0, 4);
const popularGuides = indexableGuides.slice(0, 4);

export default function NotFound() {
  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-slate-500">Error 404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            We could not find that page
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600">
            The page may have been moved or renamed. Try one of the tools or guides below, or
            start from the homepage.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm shadow-slate-950/20 transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100"
              href="/tools"
            >
              Browse all tools
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              href="/guides"
            >
              Read the guides
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-stone-200 pt-10 sm:grid-cols-2">
          <section>
            <h2 className="text-base font-semibold text-stone-950">Popular tools</h2>
            <ul className="mt-4 space-y-3">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    className="text-sm leading-6 text-stone-600 transition hover:text-stone-950"
                    href={tool.href}
                  >
                    {tool.menuTitle ?? tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-950">Popular guides</h2>
            <ul className="mt-4 space-y-3">
              {popularGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    className="text-sm leading-6 text-stone-600 transition hover:text-stone-950"
                    href={guide.href}
                  >
                    {guide.menuTitle ?? guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
