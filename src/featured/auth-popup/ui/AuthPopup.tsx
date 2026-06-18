'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLenis } from 'lenis/react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuthPopupStore } from '../store/store';
import styles from './AuthPopup.module.scss';

import { login } from '@/core/user/api/login';
import { type LoginSchema, loginSchema } from '@/core/user/model/login.schema';
import { useUserStore } from '@/core/user/model/user.store';

export const AuthPopup = () => {
  const { isOpen, email, onSuccess, close } = useAuthPopupStore();
  const { setUser } = useUserStore();
  const t = useTranslations('authPopup');
  const lenis = useLenis();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
      setValue('email', email);
    } else {
      document.body.style.overflow = 'auto';
      lenis?.start();
      reset();
    }
  }, [isOpen, email, lenis, reset, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await login(data);

      if (res.success) {
        setUser(res.user);
        const callback = onSuccess;
        close();
        callback?.();
      } else {
        toast(
          res.message ?? t('error', { fallback: 'Invalid email or password. Please try again.' })
        );
      }
    } catch {
      toast(t('error', { fallback: 'Invalid email or password. Please try again.' }));
    }
  });

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.open : ''}`}>
      <div className={styles.overlay} onClick={close} />
      <div className={styles.popup}>
        <button type="button" className={styles.close} onClick={close} aria-label="Close">
          ×
        </button>
        <div className={styles.head}>
          <h3>{t('title', { fallback: 'This email already has an account' })}</h3>
          <p>
            {t('description', {
              fallback: 'Please log in to continue with your existing account.',
            })}
          </p>
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <input
              type="email"
              placeholder={t('email', { fallback: 'Email' })}
              {...register('email')}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>
          <div className={styles.field}>
            <input
              type="password"
              placeholder={t('password', { fallback: 'Password' })}
              {...register('password')}
            />
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
          </div>
          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting
              ? t('loggingIn', { fallback: 'Logging in...' })
              : t('login', { fallback: 'Login' })}
          </button>
        </form>
        <p className={styles.footer}>
          <Link href="/forgot-password" onClick={close}>
            {t('forgotPassword', { fallback: 'Forgot Password?' })}
          </Link>
        </p>
      </div>
    </div>
  );
};
