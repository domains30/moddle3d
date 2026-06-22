import type { ColumnDef } from '@tanstack/react-table';
import type { useTranslations } from 'next-intl';

import { downloadFile } from '@/shared/lib/utils/download';
import { DownloadIcon } from '@/shared/ui/icons/download';

import { OrderStatus } from '../ui/OrderStatus';
import st from './columns.module.scss';
import type { Order, OrderItem } from './types';

export const getOrdersColumns = (t: ReturnType<typeof useTranslations>): ColumnDef<Order>[] => [
  {
    accessorKey: 'orderId',
    header: () => <p className={st.heading}>{t('orderId', { fallback: 'Order ID' })}</p>,
    cell: (info) => <p className={st.text}>#{info.getValue<string>()}</p>,
  },
  {
    accessorKey: 'items',
    meta: { width: '28%' },
    header: () => (
      <p className={st.heading}>{t('itemPurchased', { fallback: 'Item Purchased' })}</p>
    ),
    cell: (info) => {
      const isCompleted = info.row.original.orderStatus === 'completed';

      return (
        <ul className={st.items}>
          {info.getValue<OrderItem[]>().map((item, index) => (
            <li key={`${item.title}-${index}`} className={st.item}>
              <span className={st.text}>{item.title}</span>
              {isCompleted && item.fileUrl && (
                <button
                  type="button"
                  className={st.itemDownload}
                  title={t('download', { fallback: 'Download' })}
                  onClick={() => downloadFile(item.fileUrl!, item.fileName ?? undefined)}
                >
                  <DownloadIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: 'orderDate',
    header: () => <p className={st.heading}>{t('purchaseDate', { fallback: 'Purchase Date' })}</p>,
    cell: (info) => {
      const date = new Date(info.getValue<string>());
      return <p className={st.text}>{date.toISOString().split('T')[0]}</p>;
    },
  },
  {
    accessorKey: 'price',
    meta: { width: '90px' },
    header: () => <p className={st.heading}>{t('total', { fallback: 'Total' })}</p>,
    cell: (info) => <p className={st.text}>€{info.getValue<number>()}</p>,
  },
  {
    accessorKey: 'paymentMethod',
    header: () => (
      <p className={st.heading}>{t('paymentMethod', { fallback: 'Payment Method' })}</p>
    ),
    cell: () => <p className={st.text}>Bank Transfer</p>,
  },
  {
    accessorKey: 'orderStatus',
    header: () => <p className={st.heading}>{t('orderStatus', { fallback: 'Order Status' })}</p>,
    cell: (info) => <OrderStatus value={info.getValue<string>()} />,
  },
  {
    accessorKey: 'invoiceUrl',
    header: () => <p className={st.heading}>{t('invoice', { fallback: 'Invoice' })}</p>,
    cell: (info) => {
      const url = info.getValue<string>();

      return url ? (
        <button onClick={() => downloadFile(url)}>
          <DownloadIcon />
          <p className={st.download}>{t('download', { fallback: 'Download' })}</p>
        </button>
      ) : (
        <p className={st.text}>{t('notAvailable', { fallback: 'Not Available' })}</p>
      );
    },
  },
];
