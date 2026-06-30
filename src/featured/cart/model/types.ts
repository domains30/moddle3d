/**
 * Which CMS collection a cart line resolves to. Matches the Payload slug so it
 * can be used directly as the `relationTo` of the order's polymorphic
 * `product` relationship. Absent on legacy carts — treat as `'products'`.
 */
export type CartItemType = 'products' | 'pricing-packages';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  subtotal: number;
  type?: CartItemType;
};
