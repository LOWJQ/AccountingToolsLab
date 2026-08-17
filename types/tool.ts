export type ToolStatus = "planned" | "mvp";

export type Tool = {
  slug: string;
  /**
   * Canonical display name. Rendered on the tools directory card and emitted
   * as the ItemList schema name, so the two can never drift apart.
   */
  name: string;
  /** Short label for nav menus and the footer, where the full name wraps. */
  menuTitle?: string;
  /**
   * Canonical description. Rendered on the directory card and emitted as the
   * ItemList schema description. Structured data must match visible text.
   */
  description: string;
  /** Shorter description for the header mega-menu, where space is tight. */
  menuDescription: string;
  href: string;
  status: ToolStatus;
  /** ISO date (YYYY-MM-DD) of the last meaningful content change. Feeds the sitemap. */
  lastModified: string;
};
