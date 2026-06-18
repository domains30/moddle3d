'use client';

import { create } from 'zustand';

import { BASE_CURRENCY, type CurrencyCode, isCurrencyCode } from '@/shared/config/currencies';

const STORAGE_KEY = 'currency';

const getStoredCurrency = (): CurrencyCode => {
  if (typeof window === 'undefined') return BASE_CURRENCY;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && isCurrencyCode(stored) ? stored : BASE_CURRENCY;
};

type CurrencyStore = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
};

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: getStoredCurrency(),
  setCurrency: (currency: CurrencyCode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, currency);
    }
    set({ currency });
  },
}));
