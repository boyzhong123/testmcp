'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import { Key, BarChart3, Receipt, CreditCard, LogOut, Menu, X, AudioWaveform, ShieldCheck, Users, History, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

export function DashboardSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const { user, logout } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  type NavItem = { href: string; icon: React.ComponentType<{ className?: string }>; label: string; highlight?: boolean };

  const userNavItems: NavItem[] = [
    { href: '/dashboard/keys', icon: Key, label: isZh ? 'API Key 管理' : 'API Key Management' },
    { href: '/dashboard/plans', icon: CreditCard, label: isZh ? '会员套餐' : 'Plans' },
    { href: '/dashboard/usage', icon: BarChart3, label: isZh ? '用量统计' : 'Usage' },
    { href: '/dashboard/billing', icon: Receipt, label: isZh ? '费用账单' : 'Billing' },
  ];

  const adminNavItems: NavItem[] = [
    { href: '/dashboard/admin', icon: Users, label: isZh ? '用户与配额' : 'Users & Quota', highlight: true },
    { href: '/dashboard/overview', icon: LayoutDashboard, label: isZh ? '平台概览' : 'Platform Overview' },
    { href: '/dashboard/recharge-history', icon: History, label: isZh ? '充值历史' : 'Recharge History' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-60 bg-foreground text-background flex flex-col transition-transform duration-200 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-background/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-md bg-background flex items-center justify-center">
              <AudioWaveform className="h-4 w-4 text-foreground" strokeWidth={2.25} />
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-foreground" />
            </div>
            <span className="font-semibold tracking-[-0.02em] text-sm flex items-baseline gap-1">
              <span>Chivox</span>
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">MCP</span>
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-background/60 hover:text-background transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Admin badge */}
        {isAdmin && (
          <div className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-amber-300">{isZh ? '超级管理员' : 'Super Admin'}</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const highlight = 'highlight' in item && item.highlight;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-background/15 text-background font-medium'
                    : highlight
                      ? 'text-amber-300 hover:text-amber-200 hover:bg-background/10'
                      : 'text-background/60 hover:text-background hover:bg-background/10'
                )}
              >
                <item.icon className={cn('h-4 w-4 shrink-0', highlight && !isActive && 'text-amber-400')} />
                {item.label}
                {highlight && !isActive && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-medium">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-background/10 p-4">
          {user && (
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  {isAdmin && <ShieldCheck className="h-3 w-3 text-amber-400 shrink-0" />}
                </div>
                <p className="text-xs text-background/50 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-background/50 hover:text-background hover:bg-background/10 transition-colors"
                title={isZh ? '退出登录' : 'Log out'}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
