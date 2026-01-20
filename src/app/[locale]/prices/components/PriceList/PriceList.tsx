'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button, Label, Text, Title } from '@/shared/ui/kit';

import styles from './PriceList.module.scss';

export const PriceList = () => {
  const t = useTranslations('priceList');

  return (
    <section className={styles.priceList}>
      <div className={'_container'}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.priceList__content}
        >
          <video
            src="/videos/prices/priceList.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.priceList__video}
          />
          <div className={styles.priceList__overlay} />
          <Title
            title={t('title', {
              fallback: 'Get the Full Picture',
            })}
          />
          <Label
            text={t('label', {
              fallback: 'Download Our Complete Price List',
            })}
          />
          <Text
            text={t('description', {
              fallback:
                'We know you want all the details, and we’re happy to provide! Download our full price list to see all our packages, services, and prices in one easy-to-read PDF. Whether you’re just browsing or ready to get started, it’s the perfect way to find the package that works best for you.',
            })}
          />
          <Button
            text={t('button', {
              fallback: 'Download Full Price List',
            })}
            type="link"
            href="/price-list.pdf"
            target="_blank"
          />
        </motion.div>
      </div>
    </section>
  );
};
