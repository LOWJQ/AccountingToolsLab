import type { ReactNode } from "react";

type ToolPageLayoutProps = {
  children?: ReactNode;
};

export function ToolPageLayout({ children }: ToolPageLayoutProps) {
  return <div>{children ?? "ToolPageLayout component placeholder."}</div>;
}
