import { convertFromBase, type CurrencyCode } from '@/shared/config/currencies';
import { SITE_URL, ZOHO_ENABLED } from '@/shared/config/env';

import type { CheckoutFormSchema } from '../../model/schema';
import type { CartItem } from '../../model/types';
import { zohoCreate, zohoSearchId } from './client';

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Zoho CRM datetime wants `YYYY-MM-DDTHH:mm:ss+00:00`, not the `.sssZ` form. */
const zohoDate = (d: Date) => `${d.toISOString().split('.')[0]}+00:00`;

type SyncParams = {
  data: CheckoutFormSchema;
  cart: CartItem[];
  /** Final order total in the base currency (already coupon-adjusted). */
  total: number;
  currency: CurrencyCode;
  orderNumber: string;
  utmSource?: string | null;
  coupon?: string | null;
  /** FingerprintJS Pro device visitor ID (fraud signal). */
  deviceFingerprint?: string | null;
};

/** Find a Zoho Contact by email, or create one. Returns the contact id. */
const upsertContact = async (data: CheckoutFormSchema): Promise<string> => {
  const existing = await zohoSearchId('Contacts', 'Email', data.email);
  if (existing) return existing;

  return zohoCreate('Contacts', {
    First_Name: data.firstName,
    Last_Name: data.lastName,
    Email: data.email,
    Phone: data.phone,
  });
};

/** Find a Zoho Product by `Product_Code` (MDL-{id}), or create it. */
const upsertProduct = async (item: CartItem): Promise<string> => {
  const code = `MDL-${item.id}`;
  const existing = await zohoSearchId('Products', 'Product_Code', code);
  if (existing) return existing;

  return zohoCreate('Products', {
    Product_Name: item.name,
    Product_Code: code,
    Unit_Price: item.price,
  });
};

/**
 * Push a completed checkout order into Zoho CRM as a Sales_Order (with its
 * Contact, Products and line items). Idempotent on `orderNumber`.
 *
 * Totals: line prices and the order total are sent in the order currency.
 * Grand_Total in Zoho is a read-only formula `Sub_Total - Abs(Discount)`, so we
 * drive the final total through the order-level `Discount` field.
 *
 * Returns the new Sales_Order id, or null when sync is disabled/skipped.
 */
export const syncOrderToZoho = async (params: SyncParams): Promise<string | null> => {
  if (!ZOHO_ENABLED) return null;

  const { data, cart, total, currency, orderNumber, utmSource, coupon, deviceFingerprint } = params;

  // Idempotency: don't create a duplicate if this order was already pushed.
  const already = await zohoSearchId('Sales_Orders', 'Order_ID_in_WP', orderNumber);
  if (already) return already;

  const contactId = await upsertContact(data);

  const orderedItems = await Promise.all(
    cart.map(async (item) => {
      const productId = await upsertProduct(item);
      return {
        Product_Name: { id: productId },
        Quantity: item.quantity,
        List_Price: convertFromBase(item.price, currency),
      };
    })
  );

  // Sub_Total as Zoho computes it (sum of qty x rounded list price), then the
  // discount needed so Grand_Total = the coupon-adjusted total.
  const subTotal = round2(
    cart.reduce((sum, item) => sum + convertFromBase(item.price, currency) * item.quantity, 0)
  );
  const finalTotal = convertFromBase(total, currency);
  const discount = Math.max(0, round2(subTotal - finalTotal));

  const billingStreet = [data.address1, data.address2].filter(Boolean).join(', ');

  const order: Record<string, unknown> = {
    Subject: `${orderNumber} - ${data.firstName} ${data.lastName}`,
    Contact_Name: { id: contactId },
    Status: 'Created',
    Payment_Method_new: 'Wire Transfer',
    Sale_Site: `${SITE_URL.replace(/\/$/, '')}/`,
    Email: data.email,
    Date_and_Time_of_Order: zohoDate(new Date()),
    Currency: currency,
    Billing_Street: billingStreet,
    Billing_City: data.city,
    Billing_Code: data.zip,
    Billing_Country: data.country,
    Order_ID_in_WP: orderNumber,
    Discount: discount,
    Ordered_Items: orderedItems,
  };

  if (utmSource) order.UTM_Source = utmSource;
  if (coupon) order.Code_Coupon = coupon;
  if (deviceFingerprint) order.Device_fingerprint = deviceFingerprint;

  return zohoCreate('Sales_Orders', order);
};
