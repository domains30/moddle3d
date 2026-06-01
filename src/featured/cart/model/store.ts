'use client';

import { create } from 'zustand';

import { notifySuccess } from '@/shared/lib/utils/notify';

import type { CartItem } from './types';

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
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setTotal: (total: number) => void;
  decrementQuantity: (id: string) => void;
  incrementQuantity: (id: string) => void;
  isCartFilled: boolean;
  setIsCartFilled: (isCartFilled: boolean) => void;
};

export const useCartStore = create<CartStore>((set, get) => {
  return {
    cart: getStoredCart(),
    total: getStoredTotal(),
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
      set({ cart: [] });
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('total', JSON.stringify(0));
    },
    setTotal: (total: number) => {
      set({ total });
      localStorage.setItem('total', JSON.stringify(total));
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
