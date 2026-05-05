import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "muted";
};

const cardVariants = {
  default: "border-stone-200 bg-white shadow-sm",
  elevated: "border-stone-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]",
  muted: "border-stone-200 bg-white/80 shadow-sm"
};

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <section className={cn("rounded-2xl border", cardVariants[variant], className)}>
      {children}
    </section>
  );
}
