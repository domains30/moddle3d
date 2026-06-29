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

/** Currencies always shown in the "Popular" group of the selector. */
export const POPULAR_CURRENCIES: CurrencyCode[] = ['EUR', 'USD', 'GBP'];

/**
 * Maps an ISO 3166-1 alpha-2 country code to the currency used there. Two uses:
 * (1) the selector promotes a country's currency into the "Popular" group, and
 * (2) checkout derives the default currency from the IP-detected country. Any
 * country without an entry falls back to the base currency (EUR). When a new
 * currency is added (CHF, INR, …), map its countries here.
 */
export const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  GB: 'GBP',
  US: 'USD',
  CA: 'CAD',
  AU: 'AUD',
};

/** The currency associated with a country, if we have a mapping for it. */
export const currencyForCountry = (countryCode?: string): CurrencyCode | undefined => {
  if (!countryCode) return undefined;
  return COUNTRY_CURRENCY[countryCode.toUpperCase()];
};

/**
 * Split the currency list into "popular" and "others", promoting the selected
 * country's currency into the popular group when we have a mapping for it.
 */
export const getCurrencyGroups = (
  countryCode?: string
): { popular: CurrencyConfig[]; others: CurrencyConfig[] } => {
  const popularCodes = new Set<CurrencyCode>(POPULAR_CURRENCIES);
  const promoted = currencyForCountry(countryCode);
  if (promoted) popularCodes.add(promoted);

  const popular = CURRENCY_LIST.filter((c) => popularCodes.has(c.code));
  const others = CURRENCY_LIST.filter((c) => !popularCodes.has(c.code));
  return { popular, others };
};

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
