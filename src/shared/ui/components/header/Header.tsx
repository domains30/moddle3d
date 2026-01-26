'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLenis } from 'lenis/react';
import { useTranslations } from 'next-intl';

import { cookies } from '@/shared/lib/utils/cookie';
import { BurgerMenu, Cart, Facebook, FilledCartIcon, Linkedin, X } from '@/shared/ui/icons';

import { LangSwitcher } from '../lang-switcher/LangSwitcher';
import styles from './Header.module.scss';

import { useUserStore } from '@/core/user/model/user.store';
import { UserBadge } from '@/core/user/ui/user-badge';
import { useCartStore } from '@/featured/cart/model/store';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, setUser } = useUserStore();

  const pathname = usePathname();
  const lenis = useLenis();

  const t = useTranslations('header');

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedUser = cookies.get('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
  }, [setUser]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = 'auto';
      lenis?.start();
    }
  }, [isMobileMenuOpen, lenis]);

  const { isCartFilled } = useCartStore();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.bg}>
          <div className="_container">
            <div className={styles.header__top}>
              <div className={styles.header__top_row}>
                <div className={styles.socials}>
                  <Link href="https://x.com/Moddle3D" target="_blank" rel="noopener noreferrer">
                    <X />
                  </Link>
                  <Link
                    href="https://www.facebook.com/moddle3d/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/moddle3d"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin />
                  </Link>
                </div>
                <div className={styles.contacts}>
                  <Link href="mailto:info@moddle3d.com" className={styles.link}>
                    info@moddle3d.com
                  </Link>
                  <Link href="tel:+48732143539" className={styles.link}>
                    +48732143539
                  </Link>
                  <LangSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.header__main}>
          <div className={'_container'}>
            <div className={styles.header__main_row}>
              <Link href="/" className={styles.header__logo}>
                <Image src="/images/logo.svg" alt="DreamArt 3D" width={125} height={24} />
              </Link>
              <nav className={styles.nav}>
                <Link href="/" className={styles.link}>
                  {t('home', { fallback: 'Home' })}
                </Link>
                <Link href="/shop" className={styles.link}>
                  {t('shop', { fallback: 'Shop' })}
                </Link>
                <Link href="/work" className={styles.link}>
                  {t('work', { fallback: 'Work' })}
                </Link>
                <Link href="/services" className={styles.link}>
                  {t('services', { fallback: 'Services' })}
                </Link>
                <Link href="/impact" className={styles.link}>
                  {t('impact', { fallback: 'Impact' })}
                </Link>
                <Link href="/prices" className={styles.link}>
                  {t('prices', { fallback: 'Prices' })}
                </Link>
                <Link href="/deals" className={styles.link}>
                  {t('deals', { fallback: 'Deals' })}
                </Link>
                <Link href="/trends" className={styles.link}>
                  {t('trends', { fallback: 'Trends' })}
                </Link>
                <Link href="/careers" className={styles.link}>
                  {t('careers', { fallback: 'Careers' })}
                </Link>
                <Link href="/contacts" className={styles.link}>
                  {t('contacts', { fallback: 'Contacts' })}
                </Link>
              </nav>
              <div className={styles.actions}>
                <Link href="/cart" className={styles.cart}>
                  {isCartFilled ? <FilledCartIcon /> : <Cart />}
                </Link>
                {user ? (
                  <span className={styles.badgeWrapper}>
                    <UserBadge firstName={user.firstName} />
                  </span>
                ) : (
                  <>
                    <Link href="/login" className={styles.login}>
                      {t('login', { fallback: 'Login' })}
                    </Link>
                    <Link href="/registration" className={styles.signup}>
                      {t('signup', { fallback: 'Sign Up' })}
                    </Link>
                  </>
                )}
                <span
                  className={styles.burger}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <BurgerMenu />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
        <nav className={styles.nav}>
          <Link href="/">{t('home', { fallback: 'Home' })}</Link>
          <Link href="/shop">{t('shop', { fallback: 'Shop' })}</Link>
          <Link href="/work">{t('work', { fallback: 'Work' })}</Link>
          <Link href="/services">{t('services', { fallback: 'Services' })}</Link>
          <Link href="/impact">{t('impact', { fallback: 'Impact' })}</Link>
          <Link href="/prices">{t('prices', { fallback: 'Prices' })}</Link>
          <Link href="/deals">{t('deals', { fallback: 'Deals' })}</Link>
          <Link href="/trends">{t('trends', { fallback: 'Trends' })}</Link>
          <Link href="/careers">{t('careers', { fallback: 'Careers' })}</Link>
          <Link href="/contacts">{t('contacts', { fallback: 'Contacts' })}</Link>
        </nav>
        {user?.firstName ? (
          <div className={styles.userWrapperMob}>
            <UserBadge firstName={user.firstName} />
          </div>
        ) : (
          <div className={styles.actions}>
            <Link href="/login" className={styles.loginMobile}>
              {t('login', { fallback: 'Login' })}
            </Link>
            <Link href="/registration" className={styles.signupMobile}>
              {t('signup', { fallback: 'Sign Up' })}
            </Link>
          </div>
        )}
        <div className={styles.bottom}>
          <div className={styles.socials}>
            <Link href="https://x.com/Moddle3D" target="_blank" rel="noopener noreferrer">
              <X />
            </Link>
            <Link
              href="https://www.facebook.com/moddle3d/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </Link>
            <Link
              href="https://www.linkedin.com/company/moddle3d"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
            </Link>
          </div>
          <div className={styles.contacts}>
            <Link href="mailto:info@moddle3d.com">info@moddle3d.com</Link>
            {/* <Link href="tel:+1 000 000 000">+1 000 000 000</Link> */}
          </div>
          <LangSwitcher />
        </div>
      </div>
    </>
  );
};
