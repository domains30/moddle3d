'use client';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

import styles from './Footer.module.scss';

//import { RequestForm } from '@/featured/contact-popup/ui/RequestForm/RequestForm';
//import { ThankyouModal } from '@/featured/contact-popup/ui/ThankyouModal/ThankyouModal';

export const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="footer">
      <div className={'_container'}>
        <div className={styles.footer__top}>
          <Link href="/">
            <Image src="/images/logo.svg" alt="logo" width={125} height={24} />
          </Link>
          <div className={styles.footer__top_links}>
            <div>
              <h3>
                {t('cultureTitle', {
                  fallback: 'Culture',
                })}
              </h3>
              <nav>
                <Link href="/work" className={styles.link}>
                  {t('culture1', {
                    fallback: 'Work',
                  })}
                </Link>
                <Link href="/impact" className={styles.link}>
                  {t('culture2', {
                    fallback: 'Impact',
                  })}
                </Link>
                <Link href="/careers" className={styles.link}>
                  {t('culture3', {
                    fallback: 'Careers',
                  })}
                </Link>
              </nav>
            </div>
            <div>
              <h3>
                {t('offersTitle', {
                  fallback: 'Offers',
                })}
              </h3>
              <nav>
                <Link href="/shop" className={styles.link}>
                  {t('shop', {
                    fallback: 'Shop',
                  })}
                </Link>
                <Link href="/services" className={styles.link}>
                  {t('offers1', {
                    fallback: 'Services',
                  })}
                </Link>
                <Link href="/prices" className={styles.link}>
                  {t('offers2', {
                    fallback: 'Prices',
                  })}
                </Link>
                <Link href="/deals" className={styles.link}>
                  {t('offers3', {
                    fallback: 'Deals',
                  })}
                </Link>
              </nav>
            </div>
            <div>
              <h3>
                {t('connectTitle', {
                  fallback: 'Connect',
                })}
              </h3>
              <nav>
                <Link href="/trends" className={styles.link}>
                  {t('connect1', {
                    fallback: 'Trends',
                  })}
                </Link>
                <Link href="/contacts" className={styles.link}>
                  {t('connect2', {
                    fallback: 'Contacts',
                  })}
                </Link>
              </nav>
            </div>
            <div>
              <h3>
                {t('regulationsTitle', {
                  fallback: 'Regulations',
                })}
              </h3>
              <nav>
                <Link href="/terms-of-use" className={styles.link}>
                  {t('regulations1', {
                    fallback: 'Terms of Use',
                  })}
                </Link>
                <Link href="/privacy-policy" className={styles.link}>
                  {t('regulations2', {
                    fallback: 'Privacy Policy',
                  })}
                </Link>
                <Link href="/cookie-policy" className={styles.link}>
                  {t('regulations3', {
                    fallback: 'Cookie Policy',
                  })}
                </Link>
                <Link href="/refund-policy" className={styles.link}>
                  {t('regulations4', {
                    fallback: 'Refund Policy',
                  })}
                </Link>
              </nav>
            </div>
            <div>
              <h3>
                {t('infoTitle', {
                  fallback: 'Info',
                })}
              </h3>
              <div className={styles.info}>
                {/* <div>
                  <span>
                    {t('infoOfficeTitle', {
                      fallback: 'Office address:',
                    })}
                  </span>
                  <p>
                    {t('infoOfficeAddress', {
                      fallback: 'address',
                    })}
                  </p>
                </div>
                <div>
                  <span>
                    {t('infoRegisteredTitle', {
                      fallback: 'Registered address:',
                    })}
                  </span>
                  <p>
                    {t('infoRegisteredAddress', {
                      fallback: 'address',
                    })}
                  </p>
                </div> */}
                <div>
                  <Link href="mailto:info@moddle3d.com" className={styles.link}>
                    info@moddle3d.com
                  </Link>
                </div>
                {/* <div>
                  <Link href="tel:+1 000 000 000" className={styles.link}>
                    +1 000 000 000
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer__bottom}>
          <p>
            © {year} Moddle sp z o o PL.{' '}
            {t('copyright', {
              fallback: 'All Legal Rights Reserved.',
            })}
          </p>
          {/* <div className={styles.socials}>
            <Link href="#">
              <X />
            </Link>
            <Link href="#">
              <Facebook />
            </Link>
            <Link href="#">
              <Instagram />
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};
