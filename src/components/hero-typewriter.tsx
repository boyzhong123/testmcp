'use client';

import { Typewriter } from './typewriter';
import { useTranslations } from 'next-intl';

export function HeroTypewriter() {
  const t = useTranslations('Hero');
  const texts = t.raw('typewriter_lines') as string[];

  return (
    <span className="bg-gradient-to-r from-foreground via-foreground/70 to-muted-foreground bg-clip-text text-transparent">
      <Typewriter texts={texts} speed={100} deleteSpeed={50} pauseMs={2200} />
    </span>
  );
}
