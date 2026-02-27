import { getTranslations } from 'next-intl/server';

import { getPolicy } from '@/featured/policies/api/get-policy';
import { ContactInfo } from '@/featured/policies/ui/contact-info';
import { Hero } from '@/featured/policies/ui/hero/Hero';
import { Layout } from '@/featured/policies/ui/layout';
import { PolicyRenderer } from '@/featured/policies/ui/renderer';

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const refundPolicy = await getPolicy({ id: '4', locale });

  const t = await getTranslations('refundPolicy');

  return (
    <main>
      <Hero title={refundPolicy.title} />
      <Layout>
        <PolicyRenderer content={refundPolicy.content.root.children} />
        <ContactInfo title={t('contactTitle', { fallback: 'Contact Information' })} />
      </Layout>
    </main>
  );
}
