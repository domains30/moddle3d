'use client';
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button, Label, Text, Title } from '@/shared/ui/kit';

import { getProducts } from '../../api/products';
import type { Product, ProductCategory } from '../../model/types';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './FeaturedCategory.module.scss';

export const FeaturedCategories = ({ category }: { category: ProductCategory }) => {
  const t = useTranslations('featuredCategory');
  const { title, description, subtitle } = category;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const fetchProducts = async () => {
      const items = await getProducts(category.id, locale);
      setProducts(items);
      setIsLoading(false);
    };
    fetchProducts();
  }, [category.id, locale]);

  return (
    <section className={styles.featuredCategory}>
      <div className={'_container'}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.featuredCategory__top}
        >
          <Label text={subtitle} />
          <Title title={title} className={styles.featuredCategory__title} />
          <Text text={description} className={styles.featuredCategory__description} />
        </motion.div>
        <div>
          {isLoading ? (
            <div className={styles.skeletons}>
              {[...Array(4)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className={styles.featuredCategory__products}>
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>

        <div className={styles.featuredCategory__bottom}>
          <Button
            text={t('viewAll', { fallback: 'Explore' })}
            type="link"
            href={`/shop/${category.slug}`}
          />
        </div>
      </div>
    </section>
  );
};

const ProductSkeleton = () => <div className={styles.skeleton}></div>;
