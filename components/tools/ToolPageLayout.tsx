import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

type ToolPageLayoutProps = {
  eyebrow?: string;
  children?: ReactNode;
};

export function ToolPageLayout({ children }: ToolPageLayoutProps) {
  return (
    <div>
      <Container as="main">
        {children}
      </Container>
    </div>
  );
}
