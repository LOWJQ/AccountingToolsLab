import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

type ToolPageLayoutProps = {
  eyebrow?: string;
  children?: ReactNode;
};

export function ToolPageLayout({ eyebrow, children }: ToolPageLayoutProps) {
  return (
    <div>
      <Container as="main">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-slate-500">{eyebrow}</p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
