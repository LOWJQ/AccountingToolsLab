import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  as?: "div" | "main";
  children?: ReactNode;
  className?: string;
};

export function Container({ as: Component = "div", children, className }: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8",
        className
      )}
    >
      {children}
    </Component>
  );
}
