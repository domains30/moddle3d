/**
 * Countries that are not allowed to place an order at checkout.
 *
 * Values are ISO 3166-1 alpha-2 codes — the same format the country select and
 * the checkout form store. If one of these is selected the order is rejected
 * with a neutral error (both on the client and again server-side in postOrder).
 */
export const BLOCKED_COUNTRY_CODES: readonly string[] = [
  'CU', // Cuba
  'IR', // Iran
  'KP', // North Korea
  'RU', // Russia
  'AF', // Afghanistan
  'BY', // Belarus
  'MM', // Myanmar
  'CF', // Central African Republic
  'CD', // Democratic Republic of the Congo
  'ET', // Ethiopia
  'IQ', // Iraq
  'LB', // Lebanon
  'LY', // Libya
  'ML', // Mali
  'NI', // Nicaragua
  'SO', // Somalia
  'SS', // South Sudan
  'SD', // Sudan
  'VE', // Venezuela
  'YE', // Yemen
  'DZ', // Algeria
  'AO', // Angola
  'CM', // Cameroon
  'CI', // Côte d'Ivoire
  'HT', // Haiti
  'KE', // Kenya
  'LA', // Laos
  'MC', // Monaco
  'NA', // Namibia
  'NP', // Nepal
  'SY', // Syria
  'US', // United States
  'IL', // Israel
  'UA', // Ukraine
  'PS', // Palestine
  'PL', // Poland
];

const blockedSet = new Set(BLOCKED_COUNTRY_CODES);

/** Whether the given country code (any case) is blocked from checkout. */
export const isBlockedCountry = (code: string | null | undefined): boolean =>
  !!code && blockedSet.has(code.trim().toUpperCase());
