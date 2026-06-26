'use server';

import { EMAIL_VALIDATION_WHITELIST, HUNTER_API_KEY, HUNTER_ENABLED } from '@/shared/config/env';

export type EmailValidationReason = 'undeliverable' | 'disposable' | 'invalid';

export type EmailValidationResult = {
  /** Whether the address may be used to place an order. */
  valid: boolean;
  /** Why it was rejected (only set when `valid` is false). */
  reason?: EmailValidationReason;
};

/** Parse the configured whitelist into normalized entries. */
const parseWhitelist = () =>
  EMAIL_VALIDATION_WHITELIST.split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

/**
 * A whitelist entry matches either a full address (`qa@moddle3d.com`) or a whole
 * domain (`@partner.com` or bare `partner.com`).
 */
const isWhitelisted = (email: string): boolean => {
  const normalized = email.trim().toLowerCase();
  const domain = normalized.split('@')[1] ?? '';
  if (!domain) return false;

  return parseWhitelist().some((entry) => {
    // Full address entry — must match exactly.
    if (entry.includes('@') && !entry.startsWith('@')) {
      return entry === normalized;
    }
    // Domain entry (`@domain` or bare `domain`).
    return entry.replace(/^@/, '') === domain;
  });
};

/**
 * Hunter "email-verifier" deliverability statuses we treat as hard failures.
 * Everything else (valid, accept_all, webmail, unknown, risky) is allowed so we
 * don't reject real customers on inconclusive results.
 */
const BLOCKED_STATUSES = new Set(['disposable', 'invalid']);

/**
 * Validate a checkout email through Hunter.io. Fails open: if Hunter is not
 * configured, errors, or rate-limits, the email is allowed so a third-party
 * outage never blocks a sale. Whitelisted addresses skip Hunter entirely.
 */
export const validateEmail = async (email: string): Promise<EmailValidationResult> => {
  if (!HUNTER_ENABLED || isWhitelisted(email)) {
    return { valid: true };
  }

  try {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(
      email
    )}&api_key=${HUNTER_API_KEY}`;

    const res = await fetch(url);

    // Treat any non-OK response (incl. 429 rate limit) as inconclusive.
    if (!res.ok) {
      console.error(`Hunter verification failed with status: ${res.status}`);
      return { valid: true };
    }

    const json = await res.json();
    const status: string | undefined = json?.data?.status;
    const result: string | undefined = json?.data?.result;

    if (result === 'undeliverable') {
      return { valid: false, reason: 'undeliverable' };
    }

    if (status && BLOCKED_STATUSES.has(status)) {
      return { valid: false, reason: status as EmailValidationReason };
    }

    return { valid: true };
  } catch (error) {
    console.error('Hunter email verification error:', error);
    return { valid: true };
  }
};
