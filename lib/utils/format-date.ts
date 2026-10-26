/**
 * Formats an ISO date (YYYY-MM-DD) as "18 August 2026".
 *
 * Built on Date.UTC rather than `new Date(isoDate)` on purpose. The runtime
 * parses a bare YYYY-MM-DD string as UTC midnight but renders it in local
 * time, so anywhere behind UTC displays the previous day. These dates are
 * rendered on the server and hydrated on the client, which makes that a
 * hydration mismatch as well as a wrong date.
 */
export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric"
  });
}
/** ISO date (YYYY-MM-DD) for today, in the visitor's own timezone. */
export function todayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
