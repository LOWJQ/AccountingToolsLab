import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type EInvoiceDisclaimerProps = {
  /** Optional tool-specific sentence, shown after the standard wording. */
  children?: ReactNode;
  className?: string;
};

/**
 * Every e-Invoice tool renders this. The tools read LHDN's published code lists
 * and thresholds, but they do not talk to MyInvois and cannot confirm that
 * anything is compliant, so the limits are stated in one place rather than
 * reworded per page.
 */
export function EInvoiceDisclaimer({ children, className }: EInvoiceDisclaimerProps) {
  return (
    <aside
      className={cn(
        "rounded-lg border border-amber-200 bg-amber-50 p-4 text-base leading-7 text-amber-900",
        className
      )}
      role="note"
    >
      <p className="font-semibold">This is a helper, not a compliance check.</p>
      <p className="mt-2">
        It does not connect to MyInvois and cannot submit, validate, or approve anything with
        LHDN. E-Invoice rules, thresholds, and dates change. Confirm your position with LHDN or
        a qualified tax adviser before you rely on this.
      </p>
      {children ? <p className="mt-2">{children}</p> : null}
    </aside>
  );
}
