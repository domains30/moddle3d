export const SERVER_URL = process.env.SERVER_URL ?? 'https://cms.moddle3d.com';
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? '';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';
export const FROM_EMAIL = process.env.FROM_EMAIL ?? '';
export const FROM_NAME = process.env.FROM_NAME ?? 'Moddle 3D';
/** Sender used for outgoing emails so the site name (not the inbox) is shown. */
export const EMAIL_FROM = { email: FROM_EMAIL, name: FROM_NAME };
export const SITE_URL = process.env.SITE_URL ?? 'https://moddle3d.com';
