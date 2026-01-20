'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Text, Title } from '@/shared/ui/kit';

import styles from './GetInTouch.module.scss';

import { RequestForm } from '@/featured/request-form/ui/RequestForm';

export const GetInTouch = () => {
  const t = useTranslations('getInTouch');

  return (
    <section className={styles.getInTouch}>
      <div className={'_container'}>
        <div className={styles.getInTouch__content}>
          <div className={styles.wrapper}>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={styles.left}
            >
              <div className={styles.top}>
                <Title
                  title={t('title', {
                    fallback: 'Get in Touch: Let’s Make Something Incredible!',
                  })}
                  className={'alignLeft'}
                />
                <Text
                  text={t('description', {
                    fallback:
                      'Got a question, a project idea, or need a custom quote? Don’t be shy — we’re all ears! At Moddle 3D, we believe every great project begins with a conversation. Reach out to us and let’s turn your wildest ideas into digital masterpieces!',
                  })}
                  className={'alignLeft'}
                />
              </div>
            </motion.div>
            <div className={styles.details}>
              <Title
                title={t('detailsTitle', {
                  fallback: 'How to Reach Us',
                })}
                tag={'h3'}
                className={'alignLeft'}
              />
              <div className={styles.addressWrapper}>
                <div>
                  <Link href="tel:+48732143539" className={styles.contactWrapper}>
                    <Image src="/images/phone.svg" alt="phone" width={20} height={20} />
                    <span className={styles.contact}>+48732143539</span>
                  </Link>
                </div>
                <div>
                  <Link href="mailto:info@moddle3d.com" className={styles.contactWrapper}>
                    <Image src="/images/email.svg" alt="email" width={20} height={20} />
                    <span className={styles.contact}>info@moddle3d.com</span>
                  </Link>
                </div>
                <div className={styles.addressItem}>
                  <p className={styles.contactWrapper}>
                    <Image src="/images/registered.svg" alt="registered" width={20} height={20} />
                    <span className={styles.contact}>
                      {t('registeredAddress', {
                        fallback: 'Hoza Street 86/210, 00-682 Warsaw, Poland',
                      })}
                    </span>
                  </p>
                  <div className={styles.map}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.0242593003413!2d21.0038845762096!3d52.224777058045625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecd7524a26f99%3A0x8eea62459eb593d!2sHo%C5%BCa%2086%2C%2000-682%20Warszawa%2C%20Poland!5e0!3m2!1sen!2sua!4v1768565349847!5m2!1sen!2sua"
                      width="600"
                      height="150"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
                {/* <div>
                <p>
                  <Image src="/images/office.svg" alt="office" width={20} height={20} />
                  <span>[Office Address]</span>
                </p>
                <div className={styles.map}>
                  <Image src="/images/map-tmp.png" alt="map" width={256} height={150} />
                </div>
              </div> */}
                {/*  */}
              </div>
            </div>
            {/* <div className={styles.socials}>
              <Title
                title={t('socialsTitle', {
                  fallback: 'Stay Social',
                })}
                tag={'h3'}
                className={'alignLeft'}
              />
              <Text
                text={t('socialsDescription', {
                  fallback:
                    'We’re always creating, and we want you to be part of it! Follow us on social media for the latest on our projects, industry trends, and some serious creative inspo. Get involved, stay updated, and let’s start something amazing!',
                })}
                className={'alignLeft'}
              />
              <div>
                <Link href="#">
                  <X />
                </Link>
                <Link href="#">
                  <Facebook />
                </Link>
                <Link href="#">
                  <Instagram />
                </Link>
              </div>
            </div>
          </motion.div> */}
          </div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={styles.right}
          >
            <Title
              title={t('title2', {
                fallback: 'Ready to Make Some Magic Happen?',
              })}
              className={'alignLeft'}
            />
            <Text
              text={t('description2', {
                fallback:
                  'Got a project waiting to be brought to life? Or maybe you’re just craving to start something new and exciting? We’ve got you covered! Let’s team up and turn your ideas into digital masterpieces that’ll leave a lasting impression.',
              })}
              className={'alignLeft'}
            />
            <RequestForm submitLabel={t('submit', { fallback: 'Start the Project Today' })} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
