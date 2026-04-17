import { AudioWaveform } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navigation');

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left · Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
              <AudioWaveform className="h-3.5 w-3.5 text-background" strokeWidth={2.25} />
            </div>
            <span className="font-semibold tracking-tight text-sm">Chivox MCP</span>
          </Link>

          {/* Middle · Links */}
          <nav className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition-colors">{tNav('docs')}</Link>
            <Link href="/demo" className="hover:text-foreground transition-colors">{tNav('demo')}</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">{t('contact')}</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">{t('terms')}</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">{t('privacy')}</Link>
          </nav>

          {/* Right · Copyright */}
          <p className="text-xs text-muted-foreground/80">
            {t('copyright', { year: 2026 })}
          </p>
        </div>
      </div>
    </footer>
  );
}
