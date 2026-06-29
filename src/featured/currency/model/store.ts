'use client';

import { create } from 'zustand';

import { BASE_CURRENCY, type CurrencyCode, isCurrencyCode } from '@/shared/config/currencies';

const STORAGE_KEY = 'currency';

const getStoredCurrency = (): CurrencyCode => {
  if (typeof window === 'undefined') return BASE_CURRENCY;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && isCurrencyCode(stored) ? stored : BASE_CURRENCY;
};

/**
 * Whether a currency was already persisted — i.e. the shopper explicitly picked
 * one before (the key is only ever written by `setCurrency`). Used to decide if
 * an IP-derived default may be applied.
 */
const hasStoredCurrency = (): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return !!stored && isCurrencyCode(stored);
};

type CurrencyStore = {
  currency: CurrencyCode;
  /** True once the shopper has explicitly chosen a currency (or had one stored). */
  isUserSelected: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  /**
   * Apply an IP/geo-derived default currency. Ignored once the shopper has made
   * an explicit choice, and never persisted (it's a default, not a selection).
   */
  setGeoCurrency: (currency: CurrencyCode) => void;
};

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currency: getStoredCurrency(),
  isUserSelected: hasStoredCurrency(),
  setCurrency: (currency: CurrencyCode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, currency);
    }
    set({ currency, isUserSelected: true });
  },
  setGeoCurrency: (currency: CurrencyCode) => {
    if (get().isUserSelected || get().currency === currency) return;
    set({ currency });
  },
}));
