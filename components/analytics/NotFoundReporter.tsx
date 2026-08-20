"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics/react";

/**
 * Records which URL produced a 404, and which host sent the visitor there.
 *
 * AI assistants cite URLs that never existed at a much higher rate than search
 * does, and those visits are otherwise invisible: the analytics dashboard shows
 * a pageview for the 404 route, not the address that was actually requested.
 * Logging the path is what turns "some people are landing on the 404 page" into
 * a list of redirects worth adding.
 *
 * Only the referrer's hostname is sent, never the full URL, so nothing from the
 * referring page's query string is carried across.
 */
export function NotFoundReporter() {
  const pathname = usePathname();

  useEffect(() => {
    let referrerHost = "(direct)";

    if (document.referrer) {
      try {
        referrerHost = new URL(document.referrer).hostname;
      } catch {
        referrerHost = "(unparseable)";
      }
    }

    track("not_found", { path: pathname, referrer: referrerHost });
  }, [pathname]);

  return null;
}
