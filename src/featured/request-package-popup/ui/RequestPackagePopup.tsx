'use client';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { useCountryCode } from '@/shared/lib/hooks/use-country';
import { CloseIcon } from '@/shared/ui/icons';
import { Title } from '@/shared/ui/kit';
import { PhoneField } from '@/shared/ui/kit/phone-field';

import { sendRequestPackageForm } from '../api/send-request-form';
import { type RequestFormSchema, requestFormSchema } from '../model/schema';
import { useRequestPackagePopupStore } from '../model/store';
import styles from './RequestPackagePopup.module.scss';

import { useThanksPopupStore } from '@/featured/thanks-popup/store/store';

export const RequestPackagePopup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('packageRequestForm');
  const { setIsOpen } = useThanksPopupStore();
  const { isOpen, setIsPopupOpen, package: packageName } = useRequestPackagePopupStore();

  const countryCode = useCountryCode();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
  });

  const onSubmit = async (data: RequestFormSchema) => {
    try {
      setIsLoading(true);

      const dataToSend = {
        ...data,
        packageName: packageName || '',
      };

      await sendRequestPackageForm(dataToSend);

      setTimeout(() => {
        reset();
        setIsLoading(false);
        setIsPopupOpen(false);
        setIsOpen(true);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`${styles.requestPackagePopupWrapper} ${isOpen ? styles.open : ''}`}>
      <div className={styles.overlay} onClick={() => setIsPopupOpen(false)} />
      <div className={styles.requestPackagePopup}>
        <Title title={packageName} tag="h3" />
        <span className={styles.close} onClick={() => setIsPopupOpen(false)}>
          <CloseIcon />
        </span>

        <form className={styles.requestForm} onSubmit={handleSubmit(onSubmit)}>
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
          <div className={`${styles.inputWrapper} ${errors.email ? styles.error : ''}`}>
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            <input
              {...register('email')}
              placeholder={t('email', {
                fallback: 'Email',
              })}
            />
          </div>
          <div className={`${styles.inputWrapper} ${errors.phone ? styles.error : ''}`}>
            {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => <PhoneField {...field} country={countryCode} />}
            />
          </div>
          <div
            className={`${styles.inputWrapper} ${styles.full} ${errors.message ? styles.error : ''}`}
          >
            {errors.message && <p className={styles.error}>{errors.message.message}</p>}
            <textarea
              {...register('message')}
              placeholder={t('message', {
                fallback: 'Project Details',
              })}
            />
          </div>

          <button type="submit" className={styles.submit}>
            {isLoading
              ? t('loading', {
                  fallback: 'Loading...',
                })
              : t('submit', {
                  fallback: 'Claim Your Creative Power!',
                })}
          </button>

          {/*isSuccess && (
        <p className={styles.success}>
          {t('success', {
            fallback: 'Request sent successfully',
          })}
        </p>
      )*/}
        </form>
      </div>
    </div>
  );
};
