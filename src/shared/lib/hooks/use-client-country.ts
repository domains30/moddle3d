'use client';

import { useEffect, useState } from 'react';

const fetchCountryCode = async (): Promise<string> => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();

    const countryResponse = await fetch(`https://ipinfo.io/${ip}?token=a1de4b6d03b20a`);
    const { country } = await countryResponse.json();

    return country.toLowerCase();
  } catch (error) {
    console.error('Error fetching country code:', error);
    return 'us';
  }
};

/**
 * Detects the visitor's country by IP on the client only.
 *
 * Unlike `useCountryCode` (which resolves a module-level promise via `use()` and
 * therefore runs during SSR with the *server's* location), this hook fetches
 * after mount, so it reflects the real visitor and never causes a hydration
 * mismatch. Returns `undefined` until the lookup resolves.
 */
export const useClientCountryCode = (): string | undefined => {
  const [countryCode, setCountryCode] = useState<string>();

  useEffect(() => {
    let active = true;
    fetchCountryCode().then((code) => {
      if (active) setCountryCode(code);
    });
    return () => {
      active = false;
    };
  }, []);

  return countryCode;
};
