"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frameId = 0;
    const sections = items.map((item) => ({
      element: document.getElementById(getSectionId(item.href)),
      href: item.href
    }));

    function updateActiveSection() {
      frameId = 0;

      if (!navRef.current || navRef.current.offsetParent === null) {
        return;
      }

      let currentHref = items[0]?.href ?? "";

      for (let index = sections.length - 1; index >= 0; index -= 1) {
        const section = sections[index];

        if (!section?.element) {
          continue;
        }

        if (section.element.getBoundingClientRect().top <= 140) {
          currentHref = section.href;
          break;
        }
      }

      setActiveHref((previousHref) => previousHref === currentHref ? previousHref : currentHref);
    }

    function scheduleActiveSectionUpdate() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateActiveSection);
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className={className} ref={navRef}>
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
