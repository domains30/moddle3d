'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { Minus, Plus, Trash } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/kit/button/Button';
import { Text } from '@/shared/ui/kit/text/Text';
import { Title } from '@/shared/ui/kit/title/Title';

import { useCartStore } from '../../model/store';
import styles from './Cart.module.scss';

export const Cart = () => {
  const { cart, total, decrementQuantity, incrementQuantity, removeFromCart } = useCartStore();
  const t = useTranslations('cart');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className={styles.cart}>
      <video
        src="/videos/cart.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={styles.cart__video}
      />
      <div className={styles.cart__bg}></div>
      <div className={'_container'}>
        {isMounted && cart.length > 0 ? (
          <div className={styles.cart__content}>
            <div className={styles.col1}>
              {cart.map((item) => (
                <div className={styles.item} key={item.id}>
                  <button
                    className={styles.item__remove}
                    onClick={() => removeFromCart(item.id)}
                    aria-label={t('remove', { fallback: 'Remove' })}
                  >
                    <Trash />
                  </button>
                  <div className={styles.item__image}>
                    <Image
                      src={item.image || '/images/pricing.png'}
                      alt={item.name}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className={styles.item__content}>
                    <h3>{item.name}</h3>
                    <p className={styles.price}>
                      {t('price', { fallback: 'Price' })}: <span>€{item.price}</span>
                    </p>
                    <p className={styles.price}>
                      {t('subtotal', { fallback: 'Subtotal' })}: <span>€{item.subtotal}</span>
                    </p>
                    <div className={styles.quantity}>
                      <button onClick={() => decrementQuantity(item.id)}>
                        <Minus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => incrementQuantity(item.id)}>
                        <Plus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.col2}>
              <h4>{t('orderSummary', { fallback: 'Your Order Summary' })}</h4>
              <div className={styles.items}>
                {cart.map((item) => (
                  <div className={styles.item} key={item.id}>
                    <p>
                      {item.name} x {item.quantity}
                    </p>
                    <span>€{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className={styles.total}>
                <p>{t('total', { fallback: 'Total' })}</p>
                <p>€{total}</p>
              </div>
              <Button text={t('checkout', { fallback: 'Checkout' })} type="link" href="/checkout" />
            </div>
          </div>
        ) : (
          <div className={styles.cart__empty}>
            <Title
              title={t('emptyCart', { fallback: 'Oops! Your Cart is a Little Empty...' })}
              tag="h1"
            />
            <Text
              text={t('emptyCartDescription', {
                fallback:
                  'Don’t worry, we’ve got plenty of awesome 3D models waiting for you! Explore our collection and fill your cart with the coolest designs to bring your ideas to life!',
              })}
            />
            <Button
              text={t('exploreCollection', { fallback: 'Start Exploring' })}
              type="link"
              href="/shop"
            />
          </div>
        )}
      </div>
    </section>
  );
};
