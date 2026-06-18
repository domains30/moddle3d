'use client';
import { useState } from 'react';
import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import ReCaptcha from 'react-google-recaptcha';
import { Controller, useForm } from 'react-hook-form';

import { useCountryCode } from '@/shared/lib/hooks/use-country';
import { PhoneField } from '@/shared/ui/kit/phone-field';

import { sendContactForm } from '../api/send-contact-form';
import { type RequestFormSchema, requestFormSchema } from '../model/schema';
import styles from './RequestForm.module.scss';

import { useThanksPopupStore } from '@/featured/thanks-popup/store/store';

export const RequestForm = ({ submitLabel }: { submitLabel?: string }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReCaptchaVerified, setIsReCaptchaVerified] = useState(false);

  const t = useTranslations('requestForm');
  const { setIsOpen } = useThanksPopupStore();

  const countryCode = useCountryCode();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
  });

  const onSubmit = async (data: RequestFormSchema) => {
    try {
      await sendContactForm(data);
      setIsSuccess(true);
      setIsOpen(true);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onReCaptchaChange = (token: string | null) => {
    if (token) {
      setIsReCaptchaVerified(true);
    }
  };

  return (
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
            fallback: 'Message',
          })}
        />
      </div>

      <div className={`${styles.inputWrapper} ${styles.full} ${errors.agree ? styles.error : ''}`}>
        {errors.agree && <p className={styles.error}>{errors.agree.message}</p>}
        <label className={styles.agree}>
          <input {...register('agree')} type="checkbox" />
          <span>
            {t.rich('agree', {
              terms: (chunks) => (
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
              privacy: (chunks) => (
                <a
                  href="/privacy-policy"
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

      <button
        type="submit"
        className={styles.submit}
        disabled={!isReCaptchaVerified || isSubmitting}
      >
        {isSubmitting
          ? t('loading', {
              fallback: 'Loading...',
            })
          : (submitLabel ??
            t('submit', {
              fallback: 'Grab the Offer Before It Vanishes',
            }))}
      </button>
      <ReCaptcha
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
        onChange={onReCaptchaChange}
      />
      <div className={styles.respect}>
        <Image src="/images/shield.svg" alt="respect" width={24} height={24} />
        <span
          dangerouslySetInnerHTML={{
            __html: t('agreement', {
              fallback: 'We respect your privacy. <br/>Your information will never be shared.',
            }),
          }}
        />
      </div>

      {isSuccess && (
        <p className={styles.success}>
          {t('success', {
            fallback: 'Request sent successfully',
          })}
        </p>
      )}
    </form>
  );
};
