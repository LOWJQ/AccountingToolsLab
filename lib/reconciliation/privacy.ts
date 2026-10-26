export const RECONCILIATION_PATH = "/tools/bank-reconciliation";

export function isPrivateToolUrl(url: string): boolean {
  try {
    const path = new URL(url, "https://www.accountingtoolslab.com").pathname.replace(/\/$/, "");
    return path === RECONCILIATION_PATH;
  } catch { return false; }
}
