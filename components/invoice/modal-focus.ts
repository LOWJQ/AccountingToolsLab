"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";

/**
 * Shared by every invoice dialog so keyboard behaviour cannot drift between
 * them. Extracted from InvoiceModals when the saved-invoices dialog was added.
 */
export function getFocusableElements(container: HTMLElement) {
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => {
      const style = window.getComputedStyle(element);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        element.getClientRects().length > 0
      );
    }
  );
}

export function trapModalFocus(
  event: ReactKeyboardEvent<HTMLElement>,
  container: HTMLElement | null
) {
  if (event.key !== "Tab" || !container) {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}
