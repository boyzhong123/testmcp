'use client';

import { Typewriter } from './typewriter';
import { useTranslations } from 'next-intl';

export function HeroTypewriter() {
  const t = useTranslations('Hero');
  const texts = t.raw('typewriter_lines') as string[];

  return (
    <span
      className="hero-typewriter-gradient inline-block align-baseline"
      style={{
        backgroundImage:
          'linear-gradient(135deg, var(--hero-grad-from) 0%, var(--hero-grad-via) 55%, var(--hero-grad-to) 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      <Typewriter texts={texts} speed={100} deleteSpeed={50} pauseMs={2200} />
    </span>
  );
}
