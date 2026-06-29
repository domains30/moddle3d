'use client';

import { useEffect, useRef, useState } from 'react';

import { FINGERPRINT_PUBLIC_KEY, FINGERPRINT_REGION } from '@/shared/config/env';

/** Minimal shape of the FingerprintJS Pro agent loaded from the CDN. */
type FingerprintAgent = {
  get: () => Promise<{ visitorId?: string }>;
};
type FingerprintModule = {
  load: (options: { apiKey: string; region: string }) => Promise<FingerprintAgent>;
};

/**
 * Resolve a FingerprintJS Pro device visitor ID on the client and store it in a
 * cookie for 24h (mirrors the WooCommerce APS tracker). Best-effort: any error
 * leaves the id null so checkout is never blocked by the fingerprint agent.
 *
 * The agent is an ESM module served from the FingerprintJS CDN, so the dynamic
 * import is marked `webpackIgnore` to let the browser load it natively instead
 * of webpack trying to bundle the remote URL.
 */
export const useDeviceFingerprint = (): string | null => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  // Guard against double-invocation in React 18 StrictMode dev mode.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    const run = async () => {
      try {
        const agentModule: FingerprintModule = await import(
          /* webpackIgnore: true */ `https://fpjscdn.net/v3/${FINGERPRINT_PUBLIC_KEY}`
        );
        const fp = await agentModule.load({
          apiKey: FINGERPRINT_PUBLIC_KEY,
          region: FINGERPRINT_REGION,
        });
        const result = await fp.get();

        if (cancelled || !result?.visitorId) return;

        setVisitorId(result.visitorId);
        document.cookie = `fpjs_visitor_id=${result.visitorId}; path=/; max-age=86400; SameSite=Lax`;
      } catch (error) {
        console.error('Device fingerprint initialization error:', error);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return visitorId;
};
