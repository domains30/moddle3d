'use client';

import { create } from 'zustand';

import type { CurrencyCode } from '@/shared/config/currencies';
import { notifySuccess } from '@/shared/lib/utils/notify';

import type { CartItem } from './types';

/**
 * A coupon coming from a checkout link (e.g. `?coupon=300eur`). It pins the
 * whole order to a fixed final `amount` expressed in `currency`.
 */
export type AppliedCoupon = {
  code: string;
  amount: number;
  currency: CurrencyCode;
};

const getStoredCoupon = (): AppliedCoupon | null => {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(localStorage.getItem('coupon') || 'null');
    return parsed && typeof parsed.amount === 'number' ? (parsed as AppliedCoupon) : null;
  } catch {
    return null;
  }
};

const getStoredUtmSource = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('utm_source') || null;
};

const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem('cart') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getStoredTotal = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const parsed = JSON.parse(localStorage.getItem('total') || '0');
    return typeof parsed === 'number' && !Number.isNaN(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
};

type CartStore = {
  cart: CartItem[];
  total: number;
  coupon: AppliedCoupon | null;
  utmSource: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setTotal: (total: number) => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  setUtmSource: (utmSource: string | null) => void;
  decrementQuantity: (id: string) => void;
  incrementQuantity: (id: string) => void;
  isCartFilled: boolean;
  setIsCartFilled: (isCartFilled: boolean) => void;
};

export const useCartStore = create<CartStore>((set, get) => {
  return {
    cart: getStoredCart(),
    total: getStoredTotal(),
    coupon: getStoredCoupon(),
    utmSource: getStoredUtmSource(),
    isCartFilled: false,
    setIsCartFilled: (isCartFilled: boolean) => {
      set({ isCartFilled });
    },
    addToCart: (item: CartItem) => {
      const cart = get().cart;
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return;
      }
      const newCart = [...cart, item];
      set({ cart: newCart });
      localStorage.setItem('cart', JSON.stringify(newCart));
      localStorage.setItem('total', JSON.stringify(get().total + item.price));
      notifySuccess('Product added to cart');
    },
    removeFromCart: (id: string) => {
      const cart = get().cart;
      const newCart = cart.filter((item) => item.id !== id);
      set({ cart: newCart });
      localStorage.setItem('cart', JSON.stringify(newCart));
      localStorage.setItem(
        'total',
        JSON.stringify(get().total - (cart.find((item) => item.id === id)?.subtotal || 0))
      );
    },
    clearCart: () => {
      set({ cart: [], coupon: null, utmSource: null });
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('total', JSON.stringify(0));
      localStorage.removeItem('coupon');
      localStorage.removeItem('utm_source');
    },
    setTotal: (total: number) => {
      set({ total });
      localStorage.setItem('total', JSON.stringify(total));
    },
    setCoupon: (coupon: AppliedCoupon | null) => {
      set({ coupon });
      if (coupon) {
        localStorage.setItem('coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('coupon');
      }
    },
    setUtmSource: (utmSource: string | null) => {
      set({ utmSource });
      if (utmSource) {
        localStorage.setItem('utm_source', utmSource);
      } else {
        localStorage.removeItem('utm_source');
      }
    },
    decrementQuantity: (id: string) => {
      const cart = get().cart;
      const item = cart.find((item) => item.id === id);
      if (!item || item.quantity <= 1) return;

      const updatedCart = cart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity: cartItem.quantity - 1,
              subtotal: cartItem.price * (cartItem.quantity - 1),
            }
          : cartItem
      );

      const newTotal = updatedCart.reduce((sum, item) => sum + item.subtotal, 0);

      set({ cart: updatedCart, total: newTotal });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      localStorage.setItem('total', JSON.stringify(newTotal));
    },
    incrementQuantity: (id: string) => {
      const cart = get().cart;
      const item = cart.find((item) => item.id === id);
      if (!item) return;

      const updatedCart = cart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
              subtotal: cartItem.price * (cartItem.quantity + 1),
            }
          : cartItem
      );

      const newTotal = updatedCart.reduce((sum, item) => sum + item.subtotal, 0);

      set({ cart: updatedCart, total: newTotal });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      localStorage.setItem('total', JSON.stringify(newTotal));
    },
  };
});
