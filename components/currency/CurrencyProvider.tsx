"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  defaultCurrency,
  formatCurrency as formatCurrencyValue,
  isCurrencyCode,
  type CurrencyCode
} from "@/lib/currency";

const currencyStorageKey = "accounting-tools-lab-currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatCurrency: (value: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(defaultCurrency);

  useEffect(() => {
    let storedCurrency: string | null = null;

    try {
      storedCurrency = window.localStorage.getItem(currencyStorageKey);
    } catch {
      storedCurrency = null;
    }

    if (storedCurrency && isCurrencyCode(storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = useCallback((nextCurrency: CurrencyCode) => {
    setCurrencyState(nextCurrency);

    try {
      window.localStorage.setItem(currencyStorageKey, nextCurrency);
    } catch {
      // Keep the selected currency for this session even when storage is blocked.
    }
  }, []);

  const formatCurrency = useCallback(
    (value: number) => formatCurrencyValue(value, currency),
    [currency]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatCurrency
    }),
    [currency, formatCurrency, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider.");
  }

  return context;
}
