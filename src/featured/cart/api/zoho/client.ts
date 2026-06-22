import {
  ZOHO_ACCOUNTS_DOMAIN,
  ZOHO_API_DOMAIN,
  ZOHO_CLIENT_ID,
  ZOHO_CLIENT_SECRET,
  ZOHO_REFRESH_TOKEN,
} from '@/shared/config/env';

/**
 * Minimal Zoho CRM client used by the order sync.
 *
 * Access tokens live ~1h, so we mint them on demand from the long-lived
 * refresh token and cache the value in module memory until shortly before it
 * expires. Everything here runs server-side only.
 */

type CachedToken = { token: string; expiresAt: number };
let cached: CachedToken | null = null;

/** Refresh the access token, refreshing early if it expires within 5 minutes. */
const getAccessToken = async (force = false): Promise<string> => {
  if (!force && cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cached.token;
  }

  const params = new URLSearchParams({
    refresh_token: ZOHO_REFRESH_TOKEN,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  const res = await fetch(`${ZOHO_ACCOUNTS_DOMAIN}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error(`Zoho token refresh failed: ${res.status} ${JSON.stringify(data)}`);
  }

  cached = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return cached.token;
};

/**
 * Authenticated request against the Zoho CRM v6 API. Retries once on a 401
 * (expired/invalidated token) by forcing a fresh access token.
 */
export const zohoFetch = async (
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<Response> => {
  const token = await getAccessToken();

  const res = await fetch(`${ZOHO_API_DOMAIN}/crm/v6${path}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (res.status === 401 && retry) {
    await getAccessToken(true);
    return zohoFetch(path, init, false);
  }

  return res;
};

/**
 * Search a module for the first record matching `(field:equals:value)`.
 * Returns the record id, or `null` when nothing matches (Zoho replies 204).
 */
export const zohoSearchId = async (
  module: string,
  field: string,
  value: string
): Promise<string | null> => {
  const criteria = encodeURIComponent(`(${field}:equals:${value})`);
  const res = await zohoFetch(`/${module}/search?criteria=${criteria}`);

  if (res.status === 204) return null;
  if (!res.ok) {
    throw new Error(`Zoho search ${module} failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data?.[0]?.id ?? null;
};

/** Create a single record in `module`; returns the new record id. */
export const zohoCreate = async (
  module: string,
  record: Record<string, unknown>
): Promise<string> => {
  const res = await zohoFetch(`/${module}`, {
    method: 'POST',
    body: JSON.stringify({ data: [record] }),
  });

  const data = await res.json();
  const row = data.data?.[0];

  if (!res.ok || row?.code !== 'SUCCESS' || !row?.details?.id) {
    throw new Error(`Zoho create ${module} failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return row.details.id;
};
