import type { ReactNode } from "react";

type ToolPageLayoutProps = {
  eyebrow?: string;
  children?: ReactNode;
};

export function ToolPageLayout({ eyebrow, children }: ToolPageLayoutProps) {
  return (
    <div className="bg-stone-50 text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-slate-500">{eyebrow}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
