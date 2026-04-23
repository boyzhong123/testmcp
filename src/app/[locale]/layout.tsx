import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/lib/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConditionalShell } from '@/components/conditional-shell';
import { RouteProgress } from '@/components/route-progress';
import { HtmlLangSync } from '@/components/html-lang-sync';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <TooltipProvider delay={300}>
      <AuthProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <HtmlLangSync lang={locale} />
          <RouteProgress />
          <ConditionalShell>{children}</ConditionalShell>
        </NextIntlClientProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}
