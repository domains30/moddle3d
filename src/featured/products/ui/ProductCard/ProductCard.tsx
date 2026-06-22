'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { notifySuccess } from '@/shared/lib/utils/notify';
import { ActiveFavoriteIcon, FavoriteIcon } from '@/shared/ui/icons/favorite';
import { Plus } from '@/shared/ui/icons/plus';
import { Text, Title } from '@/shared/ui/kit';

import type { Product } from '../../model/types';
import styles from './ProductCard.module.scss';

import { useCartStore } from '@/featured/cart/model/store';
import { addToWishlist } from '@/featured/wishlist/api/add-to-wishlist';
import { removeFromWishlist } from '@/featured/wishlist/api/remove-from-wishlist';
import { useWishlistStore } from '@/featured/wishlist/model/wishlist.store';

export const ProductCard = ({ id, title, image, excerpt, price, category, slug }: Product) => {
  const { addToCart, setTotal, total, setIsCartFilled } = useCartStore();
  const router = useRouter();
  const { wishlist, setWishlist } = useWishlistStore();

  const t = useTranslations('wishlist');

  const isInWishlist = wishlist.some((item) => item.id === id);

  const handleAddToCart = () => {
    addToCart({
      id: id,
      name: title,
      price,
      image: image.url,
      quantity: 1,
      subtotal: price,
    });
    setTotal(total + price);
    setIsCartFilled(true);
    router.push('/checkout');
  };

  const addToWishlistHandle = (item: Product) => {
    const { success, newWishlist } = addToWishlist(item);

    if (success) {
      setWishlist(newWishlist);
      notifySuccess(t('addedToWishlist', { fallback: 'Product added to wishlist' }));
    }
  };

  const removeFromWishlistHandle = (id: string) => {
    const { success, newWishlist } = removeFromWishlist(id);

    if (success) {
      setWishlist(newWishlist);
      notifySuccess(t('removedFromWishlist', { fallback: 'Product removed from wishlist' }));
    }
  };

  return (
    <div className={styles.productCard}>
      <button
        className={styles.favorite}
        onClick={() =>
          isInWishlist
            ? removeFromWishlistHandle(id)
            : addToWishlistHandle({ id, slug, category, title, image, excerpt, price })
        }
      >
        {isInWishlist ? <ActiveFavoriteIcon /> : <FavoriteIcon />}
      </button>
      <div className={styles.top}>
        <Image src={image.url} alt={title} width={230} height={230} quality={100} />
        <div>
          <Title title={title} tag="h3" />
          <Text text={excerpt} />
        </div>
      </div>
      <div className={styles.bottom}>
        <h4>€{price}</h4>
        <button onClick={handleAddToCart}>
          <Plus />
        </button>
      </div>
    </div>
  );
};
