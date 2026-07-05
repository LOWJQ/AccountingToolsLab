"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type GuideTableOfContentsItem = {
  href: string;
  label: string;
};

type GuideTableOfContentsProps = {
  className?: string;
  items: readonly GuideTableOfContentsItem[];
};

function getSectionId(href: string) {
  return href.startsWith("#") ? href.slice(1) : href;
}

export function GuideTableOfContents({ className = "", items }: GuideTableOfContentsProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

  useEffect(() => {
    function updateActiveSection() {
      let currentHref = items[0]?.href ?? "";

      for (const item of items) {
        const section = document.getElementById(getSectionId(item.href));

        if (!section) {
          continue;
        }

        if (section.getBoundingClientRect().top <= 140) {
          currentHref = item.href;
        }
      }

      setActiveHref(currentHref);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-950">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-slate-200">
        {items.map((item) => {
          const isActive = activeHref === item.href;

          return (
            <li key={item.href}>
              <Link
                aria-current={isActive ? "location" : undefined}
                className={`block border-l-2 py-2 pl-4 text-sm text-slate-950 transition ${
                  isActive
                    ? "-ml-px border-slate-950 font-bold"
                    : "border-transparent font-semibold hover:-ml-px hover:border-slate-300"
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
