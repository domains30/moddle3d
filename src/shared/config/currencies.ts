export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CAD' | 'AUD';

export type CurrencyConfig = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** How many units of this currency equal 1 unit of the base currency (EUR). */
  rate: number;
};

export const BASE_CURRENCY: CurrencyCode = 'EUR';

/**
 * Fixed conversion rates relative to the base currency (EUR).
 * Prices in the CMS are stored in EUR and converted on the front-end.
 * Update these values whenever the rates need to be refreshed.
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', label: 'EUR', rate: 1 },
  USD: { code: 'USD', symbol: '$', label: 'USD', rate: 1.08 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP', rate: 0.85 },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'CAD', rate: 1.47 },
  AUD: { code: 'AUD', symbol: 'A$', label: 'AUD', rate: 1.63 },
};

export const CURRENCY_LIST: CurrencyConfig[] = Object.values(CURRENCIES);

export const isCurrencyCode = (value: string): value is CurrencyCode =>
  Object.prototype.hasOwnProperty.call(CURRENCIES, value);

/** Convert an amount expressed in the base currency (EUR) into the target currency. */
export const convertFromBase = (amountInBase: number, code: CurrencyCode): number => {
  const rate = CURRENCIES[code]?.rate ?? 1;
  return Math.round(amountInBase * rate * 100) / 100;
};

/** Convert an amount expressed in the given currency back into the base currency (EUR). */
export const convertToBase = (amount: number, code: CurrencyCode): number => {
  const rate = CURRENCIES[code]?.rate ?? 1;
  return Math.round((amount / rate) * 100) / 100;
};

/** Format an amount (stored in EUR) into a display string for the given currency. */
export const formatPrice = (amountInBase: number, code: CurrencyCode): string => {
  const config = CURRENCIES[code] ?? CURRENCIES[BASE_CURRENCY];
  return `${config.symbol}${convertFromBase(amountInBase, code).toFixed(2)}`;
};
