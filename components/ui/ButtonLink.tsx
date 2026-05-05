import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: "primary" | "secondary" | "dark";
};

const buttonVariants = {
  primary: "bg-slate-700 text-white shadow-sm hover:bg-slate-800",
  secondary: "border border-stone-300 text-stone-800 hover:bg-stone-50",
  dark: "bg-stone-950 text-white hover:bg-stone-800"
};

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary"
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
        buttonVariants[variant],
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
