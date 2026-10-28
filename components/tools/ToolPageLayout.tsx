import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

type ToolPageLayoutProps = {
  children?: ReactNode;
};

export function ToolPageLayout({ children }: ToolPageLayoutProps) {
  return (
    <div>
      <Container as="main" className="tool-page gap-7 py-6 sm:gap-10 sm:py-12">
        {children}
      </Container>
    </div>
  );
}
