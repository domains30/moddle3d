import { Suspense } from 'react';

import { Checkout } from '@/featured/cart/ui/checkout/Checkout';

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <Checkout />
    </Suspense>
  );
}
