'use client';

import { AudioWaveform } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';

export function LogoLink() {
  const pathname = usePathname();
  const isHome = pathname === '/' || /^\/[a-z]{2}(-[A-Z]{2})?$/.test(pathname);

  if (isHome) {
    // 已在首页：仅滚回顶部，避免触发路由
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2.5 shrink-0"
      >
        <div className="h-8 w-8 rounded-md bg-foreground flex items-center justify-center">
          <AudioWaveform className="h-4.5 w-4.5 text-background" strokeWidth={2.3} />
        </div>
        <span className="font-bold tracking-[-0.01em] text-lg sm:text-xl leading-none">Chivox MCP</span>
      </a>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <div className="h-8 w-8 rounded-md bg-foreground flex items-center justify-center">
        <AudioWaveform className="h-4.5 w-4.5 text-background" strokeWidth={2.3} />
      </div>
      <span className="font-bold tracking-[-0.01em] text-lg sm:text-xl leading-none">Chivox MCP</span>
    </Link>
  );
}
