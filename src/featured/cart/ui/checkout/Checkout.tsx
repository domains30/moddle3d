'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { convertToBase, formatPrice } from '@/shared/config/currencies';
import { useCountryCode } from '@/shared/lib/hooks/use-country';
import { Button } from '@/shared/ui/kit/button/Button';
import CountrySelect from '@/shared/ui/kit/country-select/CountrySelect';
import { PhoneField } from '@/shared/ui/kit/phone-field';
import { Text } from '@/shared/ui/kit/text/Text';
import { Title } from '@/shared/ui/kit/title/Title';

import { postOrder } from '../../api/post-order';
import { useCheckoutQueryParams } from '../../lib/use-checkout-query-params';
import { type CheckoutFormSchema, checkoutFormSchema } from '../../model/schema';
import { useCartStore } from '../../model/store';
import styles from './Checkout.module.scss';

import { checkEmailExists } from '@/core/user/api/check-email';
import { useUserStore } from '@/core/user/model/user.store';
import { useAuthPopupStore } from '@/featured/auth-popup/store/store';
import { useCurrencyStore } from '@/featured/currency/model/store';
import { CurrencySelect } from '@/featured/currency/ui/CurrencySelect';

/*const getCountryOptionByCode = (code: string) => {
  const countries = countryList().getData();
  return countries.find((country) => country.value === code);
};*/

export const Checkout = () => {
  const { cart, clearCart, total, coupon, utmSource } = useCartStore();
  const { currency } = useCurrencyStore();
  const { user, setUser } = useUserStore();
  const { open: openAuthPopup } = useAuthPopupStore();
  const t = useTranslations('checkout');
  const router = useRouter();

  // Fill the cart / currency / coupon from a deep link such as
  // /checkout/?add-to-cart=56|55&coupon=300eur&currency=EUR&utm_source=test
  useCheckoutQueryParams();

  const [isLoading, setIsLoading] = useState(false);

  const countryCode = useCountryCode();

  // A coupon pins the whole order to a fixed final amount (in its own
  // currency), so convert it back to the base currency the cart works in.
  const effectiveTotal = coupon ? convertToBase(coupon.amount, coupon.currency) : total;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const placeOrder = async (data: CheckoutFormSchema) => {
    try {
      setIsLoading(true);
      const result = await postOrder(data, effectiveTotal, cart, currency, {
        utmSource,
        coupon: coupon?.code,
      });

      // A brand-new guest account is logged in automatically by postOrder.
      if (result?.authUser) {
        setUser(result.authUser);
      }

      setTimeout(() => {
        reset();
        setIsLoading(false);
        router.push('/thankyou');
        setTimeout(() => {
          clearCart();
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutFormSchema) => {
    // If the shopper isn't logged in but the email already belongs to an
    // account, ask them to log in before we place the order.
    if (!user) {
      const exists = await checkEmailExists(data.email);
      if (exists) {
        openAuthPopup({
          email: data.email,
          onSuccess: () => placeOrder(data),
        });
        return;
      }
    }

    await placeOrder(data);
  };

  return (
    <section className={styles.checkout}>
      <div className={styles.cart__bg}></div>
      <div className={'_container'}>
        {cart.length > 0 ? (
          <form className={styles.checkout__content} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.col1}>
              <div className={styles.form}>
                <h4>{t('billingDetails', { fallback: 'Billing Details' })}</h4>

                <div className={`${styles.inputWrapper} ${errors.firstName ? styles.error : ''}`}>
                  {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
                  <input
                    {...register('firstName')}
                    placeholder={t('firstName', {
                      fallback: 'First Name',
                    })}
                  />
                </div>

                <div className={`${styles.inputWrapper} ${errors.lastName ? styles.error : ''}`}>
                  {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
                  <input
                    {...register('lastName')}
                    placeholder={t('lastName', {
                      fallback: 'Last Name',
                    })}
                  />
                </div>

                <div className={styles.divider}></div>

                <div className={`${styles.inputWrapper} ${errors.address1 ? styles.error : ''}`}>
                  {errors.address1 && <p className={styles.error}>{errors.address1.message}</p>}
                  <input
                    {...register('address1')}
                    placeholder={t('address1', {
                      fallback: 'Address line 1',
                    })}
                  />
                </div>

                <div className={`${styles.inputWrapper}  ${errors.address2 ? styles.error : ''}`}>
                  {errors.address2 && <p className={styles.error}>{errors.address2.message}</p>}
                  <input
                    {...register('address2')}
                    placeholder={t('address2', {
                      fallback: 'Address line 2',
                    })}
                  />
                </div>

                <div
                  className={`${styles.inputWrapper} ${styles.third} ${errors.city ? styles.error : ''}`}
                >
                  {errors.city && <p className={styles.error}>{errors.city.message}</p>}
                  <input
                    {...register('city')}
                    placeholder={t('city', {
                      fallback: 'City',
                    })}
                  />
                </div>

                <div
                  className={`${styles.inputWrapper} ${styles.third} ${errors.country ? styles.error : ''}`}
                >
                  {errors.country && <p className={styles.error}>{errors.country.message}</p>}
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => <CountrySelect field={field} />}
                  />
                </div>

                <div
                  className={`${styles.inputWrapper} ${styles.third} ${errors.zip ? styles.error : ''}`}
                >
                  {errors.zip && <p className={styles.error}>{errors.zip.message}</p>}
                  <input
                    {...register('zip')}
                    placeholder={t('zip', {
                      fallback: 'Postal code',
                    })}
                  />
                </div>

                <div className={styles.divider}></div>

                <div className={`${styles.inputWrapper} ${errors.phone ? styles.error : ''}`}>
                  {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => <PhoneField {...field} country={countryCode} />}
                  />
                </div>

                <div className={`${styles.inputWrapper} ${errors.email ? styles.error : ''}`}>
                  {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                  <input
                    {...register('email')}
                    placeholder={t('email', {
                      fallback: 'Email',
                    })}
                  />
                </div>

                <h4>{t('paymentMethod', { fallback: 'Payment method' })}</h4>

                <div className={styles.paymentMethod}>
                  <div>
                    <Image src={'/payment.svg'} alt="payment-method" width={24} height={24} />
                    {t('bankTransfer', {
                      fallback: 'Bank Transfer',
                    })}
                  </div>
                  <p>
                    {t('paymentNote', {
                      fallback:
                        '*After placing an order, you’ll receive an email with payment instructions, including our bank details and a summary of your purchase.',
                    })}
                  </p>
                </div>

                <h4>{t('letUsKnow', { fallback: 'Got a Special Request? Let Us Know!' })}</h4>

                <div
                  className={`${styles.inputWrapper} ${styles.full} ${errors.orderNotes ? styles.error : ''}`}
                >
                  {errors.orderNotes && <p className={styles.error}>{errors.orderNotes.message}</p>}
                  <textarea
                    {...register('orderNotes')}
                    placeholder={t('orderNotes', {
                      fallback:
                        'Is there something extra magical you’d like us to add? Drop your notes here, and we’ll make it happen — no request is too wild!',
                    })}
                  />
                </div>
              </div>
            </div>
            <div className={styles.col2}>
              <div className={styles.inner}>
                <div className={styles.summaryHeader}>
                  <h4>{t('orderSummary', { fallback: 'Your Order Summary' })}</h4>
                  <CurrencySelect />
                </div>
                <div className={styles.items}>
                  {cart.map((item) => (
                    <div className={styles.item} key={item.id}>
                      <p>
                        {item.name} x {item.quantity}
                      </p>
                      <span>{formatPrice(item.subtotal, currency)}</span>
                    </div>
                  ))}
                </div>
                {coupon && (
                  <div className={styles.coupon}>
                    <p>
                      {t('coupon', { fallback: 'Coupon' })}
                      <span className={styles.code}>{coupon.code}</span>
                    </p>
                    <span>-{formatPrice(total - effectiveTotal, currency)}</span>
                  </div>
                )}
                <div className={styles.total}>
                  <p>{t('total', { fallback: 'Total' })}</p>
                  <p>{formatPrice(effectiveTotal, currency)}</p>
                </div>
                <button type="submit" className={styles.submit}>
                  {isLoading
                    ? t('loading', {
                        fallback: 'Loading...',
                      })
                    : t('checkout', {
                        fallback: 'Submit',
                      })}
                </button>

                <div className={styles.agreement}>
                  <div
                    className={`${styles.inputWrapper} ${styles.full} ${errors.termsAndConditions ? styles.error : ''}`}
                  >
                    {errors.termsAndConditions && (
                      <p className={styles.error}>{errors.termsAndConditions.message}</p>
                    )}
                    <label className={styles.agree}>
                      <input {...register('termsAndConditions')} type="checkbox" />
                      <span>
                        {t.rich('termsAndConditions', {
                          link: (chunks) => (
                            <a
                              href="/terms-of-use"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.policyLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {chunks}
                            </a>
                          ),
                        })}
                      </span>
                    </label>
                  </div>

                  <div
                    className={`${styles.inputWrapper} ${styles.full} ${errors.refundPolicy ? styles.error : ''}`}
                  >
                    {errors.refundPolicy && (
                      <p className={styles.error}>{errors.refundPolicy.message}</p>
                    )}
                    <label className={styles.agree}>
                      <input {...register('refundPolicy')} type="checkbox" />
                      <span>
                        {t.rich('refundPolicy', {
                          link: (chunks) => (
                            <a
                              href="/refund-policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.policyLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {chunks}
                            </a>
                          ),
                        })}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.inner}>
                <div className={styles.respect}>
                  <h4>
                    <Image src="/images/shield.svg" alt="respect" width={24} height={24} />
                    <span>
                      {t('safeAndSound', {
                        fallback: 'Your Info, Safe & Sound!',
                      })}
                    </span>
                  </h4>
                  <p>
                    {t('safeAndSoundDescription', {
                      fallback:
                        'We use your details to get your order to you, make your browsing experience smoother, and for other cool stuff outlined in our Privacy Policy. No worries, we’ve got it all covered!',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.checkout__empty}>
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
