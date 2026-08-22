import Link from "next/link";
import { toolsByCategory } from "@/lib/data/tools";

/**
 * A plain grouped index rather than a card grid. This page is somewhere people
 * pass through on the way to one tool, so anything that is not the tool's name
 * — icon, description, arrow, card border — is one more thing to read past on
 * every visit. The card layout stopped scaling somewhere around twenty tools;
 * a bare list keeps the whole set scannable in one screen.
 *
 * Names are links in a list rather than headings: this is navigation, not
 * content, so a screen reader announcing "list, 7 items" is more use than a
 * run of h3s.
 */
export function ToolsDirectory() {
  return (
    <div className="flex flex-col gap-14">
      {toolsByCategory.map((group) => (
        <section aria-labelledby={`tools-${group.id}`} key={group.id}>
          {/* Deliberately louder than the tool names. With a long list the
              category is what someone locates first, so it has to win the
              page's second level outright; the rule under it closes the group
              off without wrapping anything in a box. */}
          <h2
            className="border-b border-slate-200 pb-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
            id={`tools-${group.id}`}
          >
            {group.title}
          </h2>
          <ul className="mt-4 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {group.tools.map((tool) => (
              <li key={tool.slug}>
                {/* The negative margin cancels the tap-target padding, so the
                    text still lines up with the heading above it. */}
                <Link
                  className="-mx-2 block rounded px-2 py-2.5 text-[15px] leading-6 text-slate-700 underline-offset-4 transition-colors hover:text-slate-950 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  href={tool.href}
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
