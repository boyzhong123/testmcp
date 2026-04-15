'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
    { q: t('q7'), a: t('a7') },
  ];

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12">
          {t('title')}
        </h2>
        <div className="max-w-3xl">
          {items.map((item, i) => (
            <div key={i} className="border-b border-border/60">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-base font-medium pr-8 group-hover:text-foreground/80 transition-colors">
                  {item.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-muted-foreground text-sm leading-relaxed pr-12">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
