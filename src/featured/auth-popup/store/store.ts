'use client';

import { create } from 'zustand';

type OpenOptions = {
  email?: string;
  onSuccess?: () => void;
};

type AuthPopupStore = {
  isOpen: boolean;
  email: string;
  onSuccess?: () => void;
  open: (options?: OpenOptions) => void;
  close: () => void;
};

export const useAuthPopupStore = create<AuthPopupStore>((set) => ({
  isOpen: false,
  email: '',
  onSuccess: undefined,
  open: (options) =>
    set({ isOpen: true, email: options?.email ?? '', onSuccess: options?.onSuccess }),
  close: () => set({ isOpen: false, onSuccess: undefined }),
}));
