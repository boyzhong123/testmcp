'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocale } from 'next-intl';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const label = isDark
    ? (isZh ? '切换为浅色模式' : 'Switch to light mode')
    : (isZh ? '切换为深色模式' : 'Switch to dark mode');

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        <Sun className="h-4 w-4 hidden dark:block" />
        <Moon className="h-4 w-4 block dark:hidden" />
      </TooltipTrigger>
      <TooltipContent suppressHydrationWarning>{label}</TooltipContent>
    </Tooltip>
  );
}
