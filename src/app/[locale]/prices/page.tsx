import type { Metadata } from 'next';

import { PriceList, PricesHero, PricingCategory } from './components';

import { getPricingCategories } from '@/featured/prices/api/get-prices';
import { RequestPackagePopup } from '@/featured/request-package-popup/ui/RequestPackagePopup';
import { ThanksPopup } from '@/featured/thanks-popup/ui/ThanksPopup';

export const metadata: Metadata = {
  title: 'Moddle 3D Pricing | Affordable Packages for 3D Models, Animations, and More',
  description:
    'Discover our competitive pricing for 3D modeling, animation creation, UI/UX design, and video production. We offer flexible packages to suit your project needs.',
  openGraph: {
    title: 'Moddle 3D Pricing | Affordable Packages for 3D Models, Animations, and More',
    description:
      'Discover our competitive pricing for 3D modeling, animation creation, UI/UX design, and video production. We offer flexible packages to suit your project needs.',
    images: 'https://moddle3d.com/images/meta.png',
  },
};

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const categories = await getPricingCategories(locale);

  return (
    <>
      <PricesHero />
      {categories.map((category) => (
        <PricingCategory key={category.id} category={category} locale={locale} />
      ))}
      <PriceList />
      <RequestPackagePopup />
      <ThanksPopup />
    </>
  );
}
