'use client';
import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { fadeInUp } from '@/shared/lib/helpers/animations';
import { Button, Label, Text, Title } from '@/shared/ui/kit';

import styles from './OurSolutions.module.scss';

export const OurSolutions = () => {
  const t = useTranslations('ourSolutions');

  return (
    <section className={styles.ourSolutions}>
      <div className={'_container'}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.ourSolutions__content}
        >
          <Title
            title={t('title', {
              fallback: 'Our Solutions',
            })}
          />
          <Label
            text={t('label', {
              fallback: 'We Solve Problems Like Superheroes (Just With Better Gadgets)',
            })}
          />
          <Text
            text={t('description', {
              fallback:
                'No challenge is too big, no model too complex. Whether you need 3D printing models, epic animations, or intuitive UI/UX design, we’ve got the superpowers to turn your dreams into digital reality. We create solutions that aren’t just functional — they’re works of art.',
            })}
          />
        </motion.div>
        <div className={styles.ourSolutions__cards}>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href="/services#3d-modelling">
              <Image src="/images/home/solution1.png" alt="card1" width={491} height={250} />
              <Title
                tag="h3"
                title={t('card1', {
                  fallback: '3D Modelling for Printing',
                })}
              />
              <Label
                text={t('card1Label', {
                  fallback:
                    'From Concept to Reality: <br/>If you can dream it, we can model it. Literally.',
                })}
              />
              <Text
                text={t('card1Text', {
                  fallback:
                    'Our 3D models are more than just designs — they’re high-quality creations ready to be printed in the real world. Whether it’s for prototyping, art, or retail, we build models that are ready for action.',
                })}
              />
            </Link>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href="/services#animation-creation">
              <Image src="/images/home/solution2.png" alt="card2" width={491} height={250} />
              <Title
                tag="h3"
                title={t('card2', {
                  fallback: 'Animation Creation',
                })}
              />
              <Label
                text={t('card2Label', {
                  fallback: 'Lights, Camera, Action... <br/>We Bring the Drama!',
                })}
              />
              <Text
                text={t('card2Text', {
                  fallback:
                    'Need a captivating animation? Whether it’s for marketing, entertainment, or education, we deliver animations that keep people on the edge of their seats. Grab attention, tell stories, and leave an impression with every frame.',
                })}
              />
            </Link>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href="/services#video-production">
              <Image src="/images/home/solution3.png" alt="card3" width={491} height={250} />
              <Title
                tag="h3"
                title={t('card3', {
                  fallback: 'Video Production ',
                })}
              />
              <Label
                text={t('card3Label', {
                  fallback: 'Your Story, <br/>Our Lens',
                })}
              />
              <Text
                text={t('card3Text', {
                  fallback:
                    'From explainer videos to promotional content, we create videos that tell your story in a way that sticks. You think it, we shoot it — bringing your vision into motion with precision and flair.',
                })}
              />
            </Link>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href="/services#ui-ux-design">
              <Image src="/images/home/solution4.png" alt="card3" width={491} height={250} />
              <Title
                tag="h3"
                title={t('card4', {
                  fallback: 'UI/UX',
                })}
              />
              <Label
                text={t('card4Label', {
                  fallback: 'Your Website Deserves to <br/>Look Like a Million Bucks',
                })}
              />
              <Text
                text={t('card4Text', {
                  fallback:
                    'We don’t just design websites; we design experiences. Our UI/UX design process ensures that your users will love navigating your site as much as they love the results. Beautiful, intuitive, and functional, all in one.',
                })}
              />
            </Link>
          </motion.div>
        </div>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.ourSolutions__button}
        >
          <Button
            text={t('button', {
              fallback: 'Get Started with Us',
            })}
            type="link"
            href="/services"
          />
        </motion.div>
      </div>
    </section>
  );
};
