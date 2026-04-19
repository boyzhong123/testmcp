'use client';

import { useTranslations, useLocale } from 'next-intl';

const CURRENT_YEAR = 2026;

export function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const year = CURRENT_YEAR;

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-6 py-6 flex flex-col items-center gap-2 text-xs text-muted-foreground/70">
        <p>{t('copyright', { year })}</p>
        {isZh && (
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
            <a
              href="https://beian.miit.gov.cn/#/Integrated/lawStatute"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              苏ICP备14027754号-1
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png" alt="公安备案" width="14" height="14" className="shrink-0" />
              苏公网安备 32059002001977号
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
