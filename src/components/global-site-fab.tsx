'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Globe } from 'lucide-react';

/**
 * Floating action button that points overseas developers to the dedicated
 * English landing page at `/global`. Intentionally uses plain <a> rather
 * than next-intl's Link so the target route bypasses locale prefixing.
 *
 * Fades in after initial scroll to avoid competing with the hero's own
 * primary CTAs on first paint.
 */
export function GlobalSiteFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show once user scrolls past the first viewport, or after 1.2s —
    // whichever comes first — so it feels intentional, not pushy.
    const onScroll = () => {
      if (window.scrollY > 120) setVisible(true);
    };
    const t = window.setTimeout(() => setVisible(true), 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <a
      href="/global"
      aria-label="Visit the English developer site"
      className={`group fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/95 backdrop-blur-md pl-3 pr-4 py-2.5 text-xs md:text-sm font-medium text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:-translate-y-[2px] hover:border-foreground/30 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shrink-0">
        <Globe className="h-3.5 w-3.5" />
        <span className="absolute inset-0 rounded-full animate-ping bg-foreground/20" aria-hidden />
      </span>
      <span className="hidden sm:inline leading-none">
        <span className="block font-semibold tracking-tight">English for developers</span>
        <span className="block text-[10.5px] text-muted-foreground mt-0.5 leading-none">
          Built MCP-native · 185 countries
        </span>
      </span>
      <span className="sm:hidden leading-none font-semibold">EN</span>
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all" />
    </a>
  );
}
