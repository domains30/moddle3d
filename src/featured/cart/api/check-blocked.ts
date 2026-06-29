'use server';

import { headers } from 'next/headers';

import { isBlockedByGoogleSheet } from '@/shared/lib/security/google-sheets-blocker';

/** Best-effort client IP from the proxy headers, falling back to x-real-ip. */
const getClientIp = async (): Promise<string | null> => {
  const h = await headers();
  // x-forwarded-for is a comma-separated chain; the first entry is the client.
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip');
};

/**
 * True if the current checkout should be silently rejected because its email or
 * client IP is on the Google Sheets block list. Fails open (returns false) on
 * any error so a Sheets outage never blocks a real customer.
 */
export const checkOrderBlocked = async (email: string): Promise<boolean> => {
  const ip = await getClientIp();
  return isBlockedByGoogleSheet({ email, ip });
};
