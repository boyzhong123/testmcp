import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navigation');

  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-bold">C</span>
              </div>
              <span className="font-semibold tracking-tight">Chivox MCP</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">{t('product')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">{tNav('features')}</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">{tNav('pricing')}</a></li>
              <li><Link href="/demo" className="hover:text-foreground transition-colors">{tNav('demo')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">{t('support')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-foreground transition-colors">{tNav('docs')}</Link></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">{tNav('faq')}</a></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">{t('company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">{tNav('about')}</a></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">{t('terms')}</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t('copyright', { year: 2026 })}
          </p>
        </div>
        <Link
          href="/internal-plan"
          target="_blank"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border border-border/60 backdrop-blur-sm shadow-sm text-xs text-muted-foreground/60 hover:text-foreground hover:border-border hover:bg-background transition-all duration-300 group"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70 group-hover:bg-amber-400 transition-colors" />
          内部计划
        </Link>
      </div>
    </footer>
  );
}
