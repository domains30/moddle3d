import { NextResponse } from 'next/server';

import { EXTERNAL_ORDER_API_KEY } from '@/shared/config/env';

import { createExternalOrder, externalOrderSchema } from '@/featured/cart/api/external-order';

/**
 * Endpoint for an external custom service to place orders. Expects the shared
 * secret in the `x-api-key` header and the order payload as JSON. Creates the
 * order in the CMS and Zoho via the shared order pipeline.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Reject anyone without the shared secret. If the key isn't configured we
  // fail closed rather than accept unauthenticated order creation.
  if (!EXTERNAL_ORDER_API_KEY) {
    console.error('EXTERNAL_ORDER_API_KEY is not configured; rejecting request.');
    return NextResponse.json({ message: 'Endpoint not configured.' }, { status: 503 });
  }

  if (request.headers.get('x-api-key') !== EXTERNAL_ORDER_API_KEY) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = externalOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid payload.', errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const order = await createExternalOrder(parsed.data);
    return NextResponse.json({ message: 'Order created.', order }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to create external order:', errorMessage);
    return NextResponse.json(
      { message: 'Failed to create order.', error: errorMessage },
      { status: 500 }
    );
  }
}
