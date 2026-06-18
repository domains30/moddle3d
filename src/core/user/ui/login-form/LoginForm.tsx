'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Btn } from '@/shared/ui/kit/btn';
import { TextField } from '@/shared/ui/kit/text-field';
import { Url } from '@/shared/ui/kit/url';

import st from './LoginForm.module.scss';

import { login } from '@/core/user/api/login';
import { loginSchema } from '@/core/user/model/login.schema';

export const LoginForm = () => {
  const router = useRouter();

  const t = useTranslations('loginForm');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const res = await login(data);

    if (res.success) {
      router.push('/account');
    } else {
      toast(
        res.message ?? t('error', { fallback: 'Something went wrong. Please try again later.' })
      );
    }
  });

  return (
    <form className={st.layout} onSubmit={onSubmit}>
      <section className={st.content}>
        <h1>{t('title', { fallback: 'Welcome Back, Creator!' })}</h1>
        <p>
          {t('description', {
            fallback:
              'Ready to jump back into the world of 3D magic? Just pop in your username, email, and password to get started! Forgot your password? No worries, just hit “Forgot Password?” and we’ll help you out!',
          })}
        </p>
      </section>
      <section className={st.fields}>
        <TextField placeholder={t('email', { fallback: 'Email' })} {...register('email')} />
        <div className={st.pairLayout}>
          <TextField
            placeholder={t('password', { fallback: 'Password' })}
            {...register('password')}
          />
          <Url className={st.ml} href="/forgot-password">
            {t('forgotPassword', { fallback: 'Forgot Password?' })}
          </Url>
        </div>
      </section>
      <Btn type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting
          ? t('loggingIn', { fallback: 'Logging in...' })
          : t('login', { fallback: 'Login' })}
      </Btn>
    </form>
  );
};
