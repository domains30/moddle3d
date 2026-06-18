'use client';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/kit/button/Button';

import styles from './page.module.scss';

export default function ThankYouPage() {
  const t = useTranslations('thankyouPage');
  return (
    <section className={styles.hero}>
      <video
        src="/videos/homeBanner.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={styles.hero__video}
      />
      <div className={styles.hero__overlay} />
      <div className={'_container'}>
        <div className={styles.hero__content}>
          <Image src="/images/thanks.svg" alt="thanks" width={64} height={64} />
          <h1
            dangerouslySetInnerHTML={{
              __html: t('title', {
                fallback: 'Woohoo! Your Order is In!',
              }),
            }}
          />
          <p>
            {t.rich('description', {
              mail: (chunks) => (
                <a
                  href="mailto:info@moddle3d.com"
                  style={{ color: '#2583FF', textDecoration: 'underline' }}
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <Button
            text={t('button', {
              fallback: 'Home',
            })}
            type="link"
            href="/"
          />
        </div>
      </div>
    </section>
  );
}
