import { SERVER_URL } from '@/shared/config/env';

import type { Product, ProductCategory } from '../model/types';

export const getCategoryBySlug = async (
  slug: string,
  locale: string
): Promise<ProductCategory | null> => {
  const url = `${SERVER_URL}/api/categories?where[slug][in]=${slug}&locale=${locale}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.docs[0] || null;
};

export const getProductCategories = async (locale: string): Promise<ProductCategory[]> => {
  try {
    const url = `${SERVER_URL}/api/categories?where[id][not_in]=6&locale=${locale}`;

    const res = await fetch(url);

    const data = await res.json();

    const categories = data.docs.reverse();

    return categories.map(
      (item: {
        id: string;
        title: string;
        description: string;
        slug: string;
        subtitle: string;
        seo_title: string;
        seo_description: string;
        image: { url: string } | null;
      }) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        slug: item.slug,
        subtitle: item.subtitle,
        seo_title: item.seo_title,
        seo_description: item.seo_description,
        image: { url: item.image ? `${SERVER_URL}${item.image.url}` : '' },
      })
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getProductById = async (id: string, locale?: string): Promise<Product | null> => {
  try {
    const sanitizedId = encodeURIComponent(String(id).trim());
    const url = `${SERVER_URL}/api/products/${sanitizedId}${locale ? `?locale=${locale}` : ''}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status} for product id: ${id}`);
      return null;
    }

    const item = await res.json();

    return {
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      slug: item.slug,
      category: item.category,
      image: { url: item.image ? `${SERVER_URL}${item.image.url}` : '' },
      price: item.price,
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const getProducts = async (categoryId: string, locale: string): Promise<Product[]> => {
  try {
    const url = `${SERVER_URL}/api/products?populate=*&where[category.id][in]=${categoryId}&locale=${locale}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return data.docs.map(
      (item: {
        id: string;
        title: string;
        excerpt: string;
        slug: string;
        category: { id: string; title: string; slug: string };
        image: { url: string } | null;
        price: number;
      }) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        slug: item.slug,
        category: item.category,
        image: { url: item.image ? `${SERVER_URL}${item.image.url}` : '' },
        price: item.price,
      })
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
