'use client';

import st from './Hero.module.scss';

export const Hero = ({ title }: { title: string }) => {
  return (
    <header className={st.layout}>
      <div className={st.content}>
        <h1>{title}</h1>
      </div>
    </header>
  );
};
