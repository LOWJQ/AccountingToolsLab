export type ToolStatus = "planned" | "mvp";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  bestFor?: string;
  href: string;
  status: ToolStatus;
};
