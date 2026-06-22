export const SERVER_URL = process.env.SERVER_URL ?? 'https://cms.moddle3d.com';
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? '';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';
export const FROM_EMAIL = process.env.FROM_EMAIL ?? '';
export const FROM_NAME = process.env.FROM_NAME ?? 'Moddle 3D';
/** Sender used for outgoing emails so the site name (not the inbox) is shown. */
export const EMAIL_FROM = { email: FROM_EMAIL, name: FROM_NAME };
export const SITE_URL = process.env.SITE_URL ?? 'https://moddle3d.com';

// Zoho CRM (orders sync). US datacenter — see .env.local.
export const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID ?? '';
export const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET ?? '';
export const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN ?? '';
export const ZOHO_ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN ?? 'https://accounts.zoho.com';
export const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN ?? 'https://www.zohoapis.com';
/** Whether Zoho credentials are configured; lets the sync no-op safely when not. */
export const ZOHO_ENABLED = Boolean(ZOHO_CLIENT_ID && ZOHO_CLIENT_SECRET && ZOHO_REFRESH_TOKEN);
