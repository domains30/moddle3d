export const SERVER_URL = process.env.SERVER_URL ?? 'https://cms.moddle3d.com';
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? '';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';
export const FROM_EMAIL = process.env.FROM_EMAIL ?? '';
export const FROM_NAME = process.env.FROM_NAME ?? 'Moddle 3D';
/** Sender used for outgoing emails so the site name (not the inbox) is shown. */
export const EMAIL_FROM = { email: FROM_EMAIL, name: FROM_NAME };
export const SITE_URL = process.env.SITE_URL ?? 'https://moddle3d.com';

/** Shared secret required (in the `x-api-key` header) by the external-order endpoint. */
export const EXTERNAL_ORDER_API_KEY = process.env.EXTERNAL_ORDER_API_KEY ?? '';

// Hunter.io email verification (checkout email validation).
export const HUNTER_API_KEY = process.env.HUNTER_EMAIL_VALIDATION_API_KEY ?? '';
/** Whether Hunter is configured; lets validation no-op (fail-open) when not. */
export const HUNTER_ENABLED = Boolean(HUNTER_API_KEY);
/**
 * Comma-separated emails and/or domains that bypass Hunter validation, e.g.
 * `EMAIL_VALIDATION_WHITELIST=qa@moddle3d.com,@partner.com`. A bare domain or a
 * `@domain` entry whitelists every address at that domain; a full address
 * whitelists only that address. Matching is case-insensitive.
 */
export const EMAIL_VALIDATION_WHITELIST = process.env.EMAIL_VALIDATION_WHITELIST ?? '';

// Zoho CRM (orders sync). US datacenter — see .env.local.
export const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID ?? '';
export const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET ?? '';
export const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN ?? '';
export const ZOHO_ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN ?? 'https://accounts.zoho.com';
export const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN ?? 'https://www.zohoapis.com';
/** Whether Zoho credentials are configured; lets the sync no-op safely when not. */
export const ZOHO_ENABLED = Boolean(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN);
