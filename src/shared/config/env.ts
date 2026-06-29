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

// Google Sheets checkout blocker (blocked IPs / emails).
/** Spreadsheet holding the "Blocked IPs" and "Blocked Emails" tabs. */
export const GOOGLE_BLOCK_SHEET_ID =
  process.env.GOOGLE_BLOCK_SHEET_ID ?? '10pz2UWFulCkumQayO23NRtvB-0vaN_KCMdSEgNnZ_qQ';
/**
 * Whether the Google Sheets blocker runs. Defaults on; set
 * `GOOGLE_BLOCK_ENABLED=false` to disable (e.g. local dev) so checkout never
 * waits on the Sheets API.
 */
export const GOOGLE_BLOCK_ENABLED = (process.env.GOOGLE_BLOCK_ENABLED ?? 'true') !== 'false';

// FingerprintJS Pro device tracking (checkout fraud signal). Public values —
// inlined into the client bundle, so they must be NEXT_PUBLIC_*.
/** FingerprintJS Pro public API key (the `/v3/<key>` CDN agent endpoint). */
export const FINGERPRINT_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_FINGERPRINT_PUBLIC_KEY ?? 'r148KAXwE49ho2FcfsRJ';
/** Agent region: `eu` | `us` | `ap`. Must match the workspace region. */
export const FINGERPRINT_REGION = process.env.NEXT_PUBLIC_FINGERPRINT_REGION ?? 'eu';

// Zoho CRM (orders sync). US datacenter — see .env.local.
export const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID ?? '';
export const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET ?? '';
export const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN ?? '';
export const ZOHO_ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN ?? 'https://accounts.zoho.com';
export const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN ?? 'https://www.zohoapis.com';
/** Whether Zoho credentials are configured; lets the sync no-op safely when not. */
export const ZOHO_ENABLED = Boolean(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN);
