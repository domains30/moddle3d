'use server';

import { cookies } from 'next/headers';

import { SERVER_URL } from '@/shared/config/env';

import type { Order } from '../model/types';

export const getUserOrders = async (): Promise<Order[]> => {
  const cookieInst = await cookies();

  const user = cookieInst.get('user')?.value;
  const userID = JSON.parse(user ?? '').id;

  const res = await fetch(
    `${process.env.SERVER_URL}/api/orders?where[user.id][in]=${userID}&limit=50`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await res.json();

  return data.docs
    ? data.docs.map(
        (item: {
          orderNumber: string;
          items: {
            product: { title: string };
            file_url?: string | null;
            file_name?: string | null;
          }[];
          total: number;
          createdAt: string;
          status: string;
          invoice: { url: string };
        }) => ({
          orderId: item.orderNumber,
          items: item.items.map((bot) => ({
            title: bot.product.title,
            fileUrl: bot.file_url ?? null,
            fileName: bot.file_name ?? null,
          })),
          price: item.total,
          orderDate: item.createdAt,
          orderStatus: item.status,
          invoiceUrl: item.invoice ? `${SERVER_URL}${item.invoice.url}` : null,
        })
      )
    : [];
};
