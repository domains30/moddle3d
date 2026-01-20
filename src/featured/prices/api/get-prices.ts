'use server';

import { SERVER_URL } from '@/shared/config/env';

import type { PricingCategory, PricingItem } from '../model/types';

export const getPricingCategories = async (locale: string): Promise<PricingCategory[]> => {
  const res = await fetch(`${SERVER_URL}/api/pricing-categories?locale=${locale}`);
  const data = await res.json();

  const categories = data.docs.reverse();

  return categories.map(
    (item: {
      id: string;
      title: string;
      description: string;
      slug: string;
      updatedAt: string;
      createdAt: string;
    }) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      slug: item.slug,
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
    })
  );
};

export const getPricingItems = async (
  categoryId: string,
  locale: string
): Promise<PricingItem[]> => {
  const res = await fetch(
    `${SERVER_URL}/api/pricing-packages?populate=*&where[category.id][in]=${categoryId}&locale=${locale}`
  );
  const data = await res.json();

  const items = data.docs.reverse();

  return items.map(
    (item: {
      id: string;
      title: string;
      description: string;
      slug: string;
      category: {
        id: string;
        title: string;
      };
      price: number;
      includes: {
        id: string;
        feature: string;
      }[];
      button_text: string;
      updatedAt: string;
      createdAt: string;
    }) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      slug: item.slug,
      category: item.category,
      price: item.price,
      includes: item.includes.map((include: { id: string; feature: string }) => ({
        id: include.id,
        feature: include.feature,
      })),
      button_text: item.button_text,
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
    })
  );
};
