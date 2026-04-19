'use client';

import { usePathname } from '@/i18n/routing';
import { Navigation } from './navigation';
import { Footer } from './footer';

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuth = pathname === '/login' || pathname === '/register';
  /** 文档页自身高度已接近视口（内部滚动），外层再 flex-1 会把主区域撑满视口，在页脚前形成大块留白 */
  const isDocs = pathname.includes('/docs');

  if (isDashboard || isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <div className={isDocs ? 'w-full min-w-0' : 'flex-1'}>{children}</div>
      <Footer />
    </>
  );
}
