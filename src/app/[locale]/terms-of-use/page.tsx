import { getTranslations } from 'next-intl/server';

import { getPolicy } from '@/featured/policies/api/get-policy';
import { ContactInfo } from '@/featured/policies/ui/contact-info';
import { Hero } from '@/featured/policies/ui/hero/Hero';
import { Layout } from '@/featured/policies/ui/layout';
import { PolicyRenderer } from '@/featured/policies/ui/renderer';

export default async function TermsOfUsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const termsOfUse = await getPolicy({ id: '1', locale });

  const t = await getTranslations('termsOfUse');

  return (
    <main>
      <Hero title={termsOfUse.title} lastUpdate="2025-12-19" />
      <Layout>
        <PolicyRenderer content={termsOfUse.content.root.children} />
        <ContactInfo
          title={t('contactTitle', { fallback: 'Contact Information' })}
          description={t('contactDescription', {
            fallback: 'For any questions, contact us at:',
          })}
        />
      </Layout>
    </main>
  );
}
