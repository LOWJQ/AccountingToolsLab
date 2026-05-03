export type ToolStatus = "planned" | "mvp";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  href: string;
  status: ToolStatus;
};
