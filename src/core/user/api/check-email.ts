'use server';

import { SERVER_URL } from '@/shared/config/env';

/** Returns true if a user account already exists for the given email. */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `${SERVER_URL}/api/users?where[email][equals]=${encodeURIComponent(email)}`
    );

    if (!res.ok) return false;

    const data = await res.json();
    return Array.isArray(data?.docs) && data.docs.length > 0;
  } catch (error) {
    console.error('Failed to check email existence:', error);
    return false;
  }
};
