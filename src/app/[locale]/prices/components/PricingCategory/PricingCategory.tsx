'use client';

import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { Navigation } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { ArrowLeftIcon, ArrowRightIcon } from '@/shared/ui/icons';
import { Text, Title } from '@/shared/ui/kit';

import { PricingItem } from '../PricingItem/PricingItem';
import styles from './PricingCategory.module.scss';

import 'swiper/css';
import { getPricingItems } from '@/featured/prices/api/get-prices';
import type {
  PricingCategory as PricingCategoryType,
  PricingItem as PricingItemType,
} from '@/featured/prices/model/types';

const PricingItemSkeleton = () => <div className={styles.skeleton}></div>;

export const PricingCategory = ({
  category,
  locale,
}: {
  category: PricingCategoryType;
  locale: string;
}) => {
  const { title, description } = category;
  const [items, setItems] = useState<PricingItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const swiper = useRef<SwiperRef>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await getPricingItems(category.id, locale);
      setItems(items);
      setIsLoading(false);
    };
    fetchItems();
  }, [category.id]);

  const swiperConfig = {
    modules: [Navigation],
    spaceBetween: 32,
    slidesPerView: 3.5,
    loop: false,
    navigation: false,
    pagination: { clickable: true },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 2.8,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 3.5,
        spaceBetween: 24,
      },
    },
  };

  return (
    <section className={styles.category}>
      <div className={'_container'}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.category__top}
        >
          <Title title={title} className={styles.category__title} />
          <Text text={description} className={styles.category__description} />
        </motion.div>
      </div>

      <div className={styles.category__slider}>
        {isLoading ? (
          <div className={styles.skeletons}>
            {[...Array(3)].map((_, index) => (
              <PricingItemSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <Swiper {...swiperConfig} ref={swiper} className={styles.swiper}>
              {items.map((item) => (
                <SwiperSlide key={item.id} className={styles.swiperSlide}>
                  <PricingItem {...item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => swiper.current?.swiper.slidePrev()}>
          <ArrowLeftIcon />
        </button>
        <button className={styles.button} onClick={() => swiper.current?.swiper.slideNext()}>
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
};
