import countryList from 'react-select-country-list';
import { z } from 'zod';

import {
  BASE_CURRENCY,
  convertToBase,
  type CurrencyCode,
  isCurrencyCode,
} from '@/shared/config/currencies';
import { SERVER_URL } from '@/shared/config/env';

import type { CheckoutFormSchema } from '../model/schema';
import type { CartItem } from '../model/types';
import { postOrder } from './post-order';

/**
 * Order placed by an external custom service (not the on-site checkout). The
 * caller sends a flat `amount` and billing details but no products — we pick a
 * matching product from the catalogue and discount it down to the amount so the
 * order flows through the normal CMS + Zoho pipeline. See `createExternalOrder`.
 */
export const externalOrderSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  // Some callers send the amount as a string, so coerce.
  amount: z.coerce.number().positive(),
  billing_street: z.string().min(1),
  billing_city: z.string().min(1),
  billing_state: z.string().optional(),
  billing_country: z.string().min(1),
  billing_zip: z.string().min(1),
  billing_phone: z.string().min(1),
  payment_method: z.string().optional(),
  response_type: z.string().optional(),
  utm_source: z.string().optional(),
  academy: z.string().optional(),
  currency: z.string().optional(),
});

export type ExternalOrderPayload = z.infer<typeof externalOrderSchema>;

const countries = countryList().getData();

/**
 * Resolve a billing country to the ISO 3166-1 alpha-2 code the rest of the app
 * uses. Accepts a full name ("Germany") or an existing code ("DE"); falls back
 * to the raw input so a downstream block/validation can still reject it.
 */
const toCountryCode = (input: string): string => {
  const trimmed = input.trim();

  if (trimmed.length === 2) {
    const upper = trimmed.toUpperCase();
    if (countries.some((c) => c.value === upper)) return upper;
  }

  const match = countries.find((c) => c.label.toLowerCase() === trimmed.toLowerCase());
  return match?.value ?? trimmed;
};

type SelectedProduct = { id: string; name: string; price: number; quantity: number };

/**
 * Pick the catalogue product that best fits the requested amount: the cheapest
 * product priced at or above it (so a coupon can bring the total down to the
 * amount exactly). When the amount exceeds every product, fall back to the most
 * expensive product and raise the quantity until it covers the amount. Prices
 * are stored in the base currency (EUR), so `amountBase` must be too.
 */
const selectProductForAmount = async (amountBase: number): Promise<SelectedProduct> => {
  // Cheapest product priced >= amount.
  const aboveUrl = `${SERVER_URL}/api/products?where[price][greater_than_equal]=${amountBase}&sort=price&limit=1`;
  const aboveRes = await fetch(aboveUrl);

  if (aboveRes.ok) {
    const data = await aboveRes.json();
    const doc = data.docs?.[0];
    if (doc) {
      return { id: String(doc.id), name: doc.title, price: doc.price, quantity: 1 };
    }
  }

  // No product reaches the amount — use the most expensive one and bump the
  // quantity so the line subtotal still covers it.
  const topUrl = `${SERVER_URL}/api/products?sort=-price&limit=1`;
  const topRes = await fetch(topUrl);

  if (!topRes.ok) {
    throw new Error(`Failed to load products for amount selection: ${topRes.status}`);
  }

  const topData = await topRes.json();
  const top = topData.docs?.[0];

  if (!top || !top.price) {
    throw new Error('No products available to build the order');
  }

  const quantity = Math.max(1, Math.ceil(amountBase / top.price));
  return { id: String(top.id), name: top.title, price: top.price, quantity };
};

/**
 * Create an order from an external service payload: resolves a customer,
 * matches a product to the requested amount, and pushes the order to the CMS
 * and Zoho through the shared `postOrder` pipeline.
 */
export const createExternalOrder = async (payload: ExternalOrderPayload) => {
  const currency: CurrencyCode = isCurrencyCode(payload.currency ?? '')
    ? (payload.currency as CurrencyCode)
    : BASE_CURRENCY;

  // The catalogue works in the base currency (EUR); convert the requested
  // amount so product matching and the discount are computed consistently.
  const amountBase = convertToBase(payload.amount, currency);

  const product = await selectProductForAmount(amountBase);

  const cart: CartItem[] = [
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: '',
      quantity: product.quantity,
      subtotal: product.price * product.quantity,
    },
  ];

  const countryCode = toCountryCode(payload.billing_country);

  // Trace where this order came from — these aren't dedicated CMS fields.
  const orderNotes = [
    'Order placed via external API.',
    payload.academy ? `Academy: ${payload.academy}` : '',
    payload.billing_state ? `State: ${payload.billing_state}` : '',
    payload.payment_method ? `Payment method: ${payload.payment_method}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const data: CheckoutFormSchema = {
    firstName: payload.first_name,
    lastName: payload.last_name,
    address1: payload.billing_street,
    address2: '',
    city: payload.billing_city,
    country: countryCode,
    zip: payload.billing_zip,
    phone: payload.billing_phone,
    email: payload.email,
    orderNotes,
    termsAndConditions: true,
    refundPolicy: true,
  };

  // `total` is the coupon-adjusted final amount in the base currency. The cart
  // subtotal is >= this, so postOrder/Zoho derive the discount automatically.
  return postOrder(data, amountBase, cart, currency, {
    utmSource: payload.utm_source,
    skipAutoLogin: true,
  });
};
