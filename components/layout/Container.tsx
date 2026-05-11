import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children?: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1080px] flex-col gap-7 px-4 py-8 sm:px-6 sm:py-12 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
