"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { isPrivateToolUrl } from "@/lib/reconciliation/privacy";

// The filter also covers scripts mounted on an earlier page during client-side
// navigation. File names, transaction data and review decisions never go here.
function filterEvent<T extends { url: string }>(event: T): T | null {
  return isPrivateToolUrl(event.url) ? null : event;
}

export function SiteTelemetry() {
  const pathname = usePathname();
  if (pathname && isPrivateToolUrl(pathname)) return null;
  return <><Analytics beforeSend={filterEvent} /><SpeedInsights beforeSend={filterEvent} /></>;
}
