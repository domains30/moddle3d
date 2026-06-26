import { Inter } from 'next/font/google';
import Script from 'next/script';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from 'sonner';

import { Footer, Header, Preloader } from '@/shared/ui/components';
import { CookiePopup } from '@/shared/ui/components/cookie-popup';

import '@/shared/lib/styles/null.scss';
import '@/shared/lib/styles/base.scss';

import { AuthPopup } from '@/featured/auth-popup/ui/AuthPopup';
import { ThanksPopup } from '@/featured/thanks-popup/ui/ThanksPopup';
import { WishlistProvider } from '@/featured/wishlist/ui/wishlist-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Moddle 3D | Unleash Your Creativity with 3D Modeling, Animation & More',
  description:
    'Welcome to Moddle 3D, where we turn your creative ideas into reality! Explore our 3D models, animations, and UI/UX design solutions designed to make your projects stand out.',
  openGraph: {
    title: 'Moddle 3D | Unleash Your Creativity with 3D Modeling, Animation & More',
    description:
      'Welcome to Moddle 3D, where we turn your creative ideas into reality! Explore our 3D models, animations, and UI/UX design solutions designed to make your projects stand out.',
    images: 'https://moddle3d.com/images/meta.png',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={inter.variable}>
        {/* Zoho PageSense (A/B testing + heatmaps). Loaded as early as possible
            to minimize variant flicker (FOOC) on A/B tests. */}
        <Script
          id="zoho-pagesense"
          strategy="beforeInteractive"
          src="https://cdn.pagesense.io/js/tradeprof/2e00290ee5cf46eca518371b0d4f50d2.js"
        />
        {/* Zoho SalesIQ chat. The inline init must define $zoho before the widget
            script runs (afterInteractive runs before the lazyOnload widget), and
            the widget itself is deferred to idle to keep it off the critical path. */}
        <Script id="zsiqscript-init" strategy="afterInteractive">
          {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
        </Script>
        <Script
          id="zsiqscript"
          strategy="lazyOnload"
          src="https://salesiq.zohopublic.com/widget?wc=siqc105027e833add45ba01b86ce425fc9ae22bc4a14ab250d8fb993b721bb17f61"
        />
        <GoogleAnalytics gaId="G-0V7LP0EY91" />
        <NextIntlClientProvider>
          <WishlistProvider>
            <Header />
            {children}
            <Footer />
            <ThanksPopup />
            <AuthPopup />
            <Toaster />
            <Preloader />
            <CookiePopup />
          </WishlistProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
