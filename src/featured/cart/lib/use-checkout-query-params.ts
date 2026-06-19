'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { isCurrencyCode } from '@/shared/config/currencies';

import { type AppliedCoupon, useCartStore } from '../model/store';

import { useCurrencyStore } from '@/featured/currency/model/store';
import { getProductById } from '@/featured/products/api/products';

/**
 * Parse a coupon value such as `300eur` / `300usd` into a fixed final total.
 * Returns `null` when the value can't be understood.
 */
const parseCoupon = (raw: string): AppliedCoupon | null => {
  const match = raw.trim().match(/^(\d+(?:\.\d+)?)([a-z]{3})$/i);
  if (!match) return null;

  const amount = Number.parseFloat(match[1]);
  const currency = match[2].toUpperCase();

  if (!Number.isFinite(amount) || amount <= 0 || !isCurrencyCode(currency)) return null;

  return { code: raw.trim(), amount, currency };
};

/**
 * Reads checkout deep-link params once on mount and fills the cart accordingly:
 *  - `add-to-cart=56|55` adds one or more products by id
 *  - `currency=EUR` selects the display/checkout currency
 *  - `coupon=300eur` pins the order total to a fixed amount
 *  - `utm_source=test` is stored and later attached to the order
 */
export const useCheckoutQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { setCoupon, setUtmSource, setTotal } = useCartStore();
  const { setCurrency } = useCurrencyStore();

  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const addToCartParam = searchParams.get('add-to-cart');
    const currencyParam = searchParams.get('currency');
    const couponParam = searchParams.get('coupon');
    const utmSourceParam = searchParams.get('utm_source');

    if (!addToCartParam && !currencyParam && !couponParam && !utmSourceParam) return;

    processed.current = true;

    if (currencyParam) {
      const code = currencyParam.toUpperCase();
      if (isCurrencyCode(code)) setCurrency(code);
    }

    if (couponParam) {
      setCoupon(parseCoupon(couponParam));
    }

    if (utmSourceParam) {
      setUtmSource(utmSourceParam);
    }

    const addProducts = async () => {
      if (addToCartParam) {
        const ids = addToCartParam
          .split('|')
          .map((id) => id.trim())
          .filter(Boolean);

        const products = await Promise.all(ids.map((id) => getProductById(id)));

        const { addToCart } = useCartStore.getState();

        products.forEach((product) => {
          if (!product) return;
          addToCart({
            id: String(product.id),
            name: product.title,
            price: product.price,
            image: product.image.url,
            quantity: 1,
            subtotal: product.price,
          });
        });

        // addToCart only mutates the cart array, so recompute the running total
        // from the resulting cart to keep state and localStorage in sync.
        const { cart } = useCartStore.getState();
        setTotal(cart.reduce((sum, item) => sum + item.subtotal, 0));
      }

      // Drop the params from the address bar so a refresh doesn't re-add items.
      router.replace(pathname);
    };

    void addProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
};
