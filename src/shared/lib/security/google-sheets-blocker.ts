import crypto from 'crypto';

import { GOOGLE_BLOCK_ENABLED, GOOGLE_BLOCK_SHEET_ID } from '@/shared/config/env';
import { googleCreds } from '@/shared/config/google-creds';

/**
 * Checkout blocker backed by a Google Sheet. The sheet has two tabs,
 * "Blocked IPs" and "Blocked Emails" (column A each), maintained by ops. Adapted
 * from the WooCommerce APS plugin: read both lists and reject a checkout whose
 * customer IP or billing email matches.
 *
 * Everything here is server-only — it signs a JWT with the service-account
 * private key. Fails open: any API/auth error returns "not blocked" so a Google
 * outage never breaks checkout.
 */

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes, matching the plugin.

const IP_RANGE = 'Blocked IPs!A1:A';
const EMAIL_RANGE = 'Blocked Emails!A1:A';

type ListCache = { values: Set<string>; expires: number };

// Module-scoped caches survive across requests in the same server instance.
let ipCache: ListCache | null = null;
let emailCache: ListCache | null = null;
let tokenCache: { token: string; expires: number } | null = null;

const base64url = (input: Buffer | string) => Buffer.from(input).toString('base64url');

/** Mint (and cache) a service-account access token via the JWT-bearer flow. */
const getAccessToken = async (): Promise<string | null> => {
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache.token;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claim = base64url(
      JSON.stringify({
        iss: googleCreds.client_email,
        scope: SCOPE,
        aud: googleCreds.token_uri,
        iat: now,
        exp: now + 3600,
      })
    );
    const unsigned = `${header}.${claim}`;
    const signature = base64url(
      crypto.sign('RSA-SHA256', Buffer.from(unsigned), googleCreds.private_key)
    );
    const assertion = `${unsigned}.${signature}`;

    const res = await fetch(googleCreds.token_uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    });

    if (!res.ok) {
      console.error(`Google token request failed: ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (!json?.access_token) return null;

    const expiresInMs = (Number(json.expires_in) || 3600) * 1000;
    // Refresh a minute early to avoid using a token that expires mid-request.
    tokenCache = { token: json.access_token, expires: Date.now() + expiresInMs - 60_000 };
    return json.access_token;
  } catch (error) {
    console.error('Google token signing/exchange error:', error);
    return null;
  }
};

/** Fetch a single column of values from the sheet. Returns null on failure. */
const fetchColumn = async (range: string): Promise<string[] | null> => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const url = `${SHEETS_API}/${GOOGLE_BLOCK_SHEET_ID}/values/${encodeURIComponent(range)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (!res.ok) {
      console.error(`Google Sheets read failed (${range}): ${res.status}`);
      return null;
    }

    const json = await res.json();
    const rows: string[][] = json?.values ?? [];
    return rows.map((row) => (row[0] ?? '').trim()).filter(Boolean);
  } catch (error) {
    console.error(`Google Sheets read error (${range}):`, error);
    return null;
  }
};

/**
 * Normalize an IP for comparison. inet_pton in the plugin collapses IPv6 forms;
 * here we lowercase and strip a leading IPv4-mapped IPv6 prefix (`::ffff:`) so
 * `::ffff:1.2.3.4` matches `1.2.3.4`.
 */
const normalizeIp = (ip: string) =>
  ip
    .trim()
    .toLowerCase()
    .replace(/^::ffff:/, '');

const getBlockedIps = async (): Promise<Set<string>> => {
  if (ipCache && ipCache.expires > Date.now()) return ipCache.values;

  const list = await fetchColumn(IP_RANGE);
  if (list === null) {
    // API failed — reuse the stale cache if we have one, else treat as empty.
    return ipCache?.values ?? new Set();
  }

  const values = new Set(list.map(normalizeIp));
  ipCache = { values, expires: Date.now() + CACHE_TTL_MS };
  return values;
};

const getBlockedEmails = async (): Promise<Set<string>> => {
  if (emailCache && emailCache.expires > Date.now()) return emailCache.values;

  const list = await fetchColumn(EMAIL_RANGE);
  if (list === null) {
    return emailCache?.values ?? new Set();
  }

  const values = new Set(list.map((email) => email.toLowerCase()));
  emailCache = { values, expires: Date.now() + CACHE_TTL_MS };
  return values;
};

/**
 * Whether the given email and/or IP is on the block list. Fails open: any error
 * resolves to `false` so checkout is never blocked by a Sheets outage.
 */
export const isBlockedByGoogleSheet = async ({
  email,
  ip,
}: {
  email?: string | null;
  ip?: string | null;
}): Promise<boolean> => {
  if (!GOOGLE_BLOCK_ENABLED) return false;

  try {
    if (email) {
      const blockedEmails = await getBlockedEmails();
      if (blockedEmails.has(email.trim().toLowerCase())) return true;
    }

    if (ip) {
      const blockedIps = await getBlockedIps();
      if (blockedIps.has(normalizeIp(ip))) return true;
    }
  } catch (error) {
    console.error('Google Sheets blocker error:', error);
    return false;
  }

  return false;
};
