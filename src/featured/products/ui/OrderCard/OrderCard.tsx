'use client';

import { useTranslations } from 'next-intl';

import { downloadFile } from '@/shared/lib/utils/download';
import { DownloadIcon } from '@/shared/ui/icons/download';

import stItems from '../../model/columns.module.scss';
import type { Order } from '../../model/types';
import { OrderStatus } from '../OrderStatus';
import st from './OrderCard.module.scss';

export const OrderCard = ({ orderDate, invoiceUrl, items, orderId, price, orderStatus }: Order) => {
  const date = new Date(orderDate);

  const isCompleted = orderStatus === 'completed';

  const t = useTranslations('orderHistory');

  return (
    <section className={st.card}>
      <div className={st.section}>
        <p className={stItems.heading}>{t('orderId', { fallback: 'Order ID' })}</p>
        <p className={stItems.text}>{orderId}</p>
      </div>
      <span className={st.divider} />
      <div className={st.section}>
        <p className={stItems.heading}>{t('itemPurchased', { fallback: 'Item Purchased' })}</p>
        <ul className={stItems.items}>
          {items.map((item, index) => (
            <li key={`${item.title}-${index}`} className={stItems.item}>
              <span className={stItems.text}>{item.title}</span>
              {isCompleted && item.fileUrl && (
                <button
                  type="button"
                  className={stItems.itemDownload}
                  title={t('download', { fallback: 'Download' })}
                  onClick={() => downloadFile(item.fileUrl!, item.fileName ?? undefined)}
                >
                  <DownloadIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <span className={st.divider} />
      <div className={st.section}>
        <p className={stItems.heading}>{t('purchaseDate', { fallback: 'Purchase Date' })}</p>
        <p className={stItems.text}>{date.toISOString().split('T')[0]}</p>
      </div>
      <span className={st.divider} />
      <div className={st.section}>
        <p className={stItems.heading}>{t('total', { fallback: 'Total' })}</p>
        <p className={stItems.text}>{price}</p>
      </div>
      <span className={st.divider} />
      <div className={st.section}>
        <p className={stItems.heading}>{t('paymentMethod', { fallback: 'Payment Method' })}</p>
        <p className={stItems.text}>Bank Transfer</p>
      </div>
      <span className={st.divider} />
      <div className={st.section}>
        <p className={stItems.heading}>{t('orderStatus', { fallback: 'Order Status' })}</p>
        <OrderStatus value={orderStatus} />
      </div>
      <span className={st.divider} />
      <div className={st.section}>
        <p className={stItems.heading}>{t('invoice', { fallback: 'Invoice' })}</p>
        {invoiceUrl ? (
          <button onClick={() => downloadFile(invoiceUrl)}>
            <DownloadIcon />
            <p className={stItems.download}>{t('download', { fallback: 'Download' })}</p>
          </button>
        ) : (
          <p className={stItems.text}>{t('notAvailable', { fallback: 'Not Available' })}</p>
        )}
      </div>
    </section>
  );
};
