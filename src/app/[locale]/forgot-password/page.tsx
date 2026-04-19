'use client';

import { Link } from '@/i18n/routing';
import { Mail, AudioWaveform, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');

  const t = {
    title: isZh ? '重置密码' : 'Reset password',
    subtitle: isZh ? '输入您的注册邮箱，我们将发送重置链接' : 'Enter your email and we\'ll send you a reset link',
    email: isZh ? '邮箱' : 'Email',
    emailPlaceholder: 'you@example.com',
    submit: isZh ? '发送重置链接' : 'Send reset link',
    sending: isZh ? '发送中…' : 'Sending…',
    backToLogin: isZh ? '返回登录' : 'Back to login',
    sentTitle: isZh ? '重置邮件已发送' : 'Check your email',
    sentDesc: isZh
      ? '我们已向您的邮箱发送了密码重置链接，请查收并按提示操作。若未收到，请检查垃圾邮件文件夹。'
      : 'We\'ve sent a password reset link to your email. If you don\'t see it, check your spam folder.',
    sentBack: isZh ? '返回登录' : 'Back to login',
    errEmail: isZh ? '请输入有效的邮箱地址' : 'Please enter a valid email address',
  };

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError(t.errEmail);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="h-dvh flex overflow-hidden">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")' }} />
        <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] bg-gradient-to-br from-white/[0.07] via-transparent to-transparent rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-tl from-white/[0.05] via-transparent to-transparent rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        <div className="relative z-10 flex flex-col p-10 xl:p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-white/10">
              <AudioWaveform className="h-4 w-4 text-zinc-950" />
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
            </div>
            <span className="font-bold text-lg tracking-[-0.02em] text-white/90 group-hover:text-white transition-colors flex items-baseline gap-1">
              <span>Chivox</span>
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">MCP</span>
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center py-10 max-w-sm">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/40 mb-5">
              <span className="w-3 h-px bg-white/30" />
              Developer Console
            </span>
            <h1 className="text-[30px] xl:text-[34px] font-semibold tracking-[-0.015em] leading-[1.15] mb-4 text-white/90">
              {isZh ? '找回您的账号' : 'Recover your account'}
            </h1>
            <p className="text-[13px] text-white/50 leading-relaxed">
              {isZh
                ? '输入注册时使用的邮箱，我们会发送一封密码重置邮件。链接有效期为 24 小时。'
                : 'Enter the email you used to register. We\'ll send you a reset link valid for 24 hours.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

        <div className="w-full max-w-[340px] relative z-10">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shadow-sm ring-1 ring-foreground/10">
              <AudioWaveform className="h-4 w-4 text-background" strokeWidth={2.3} />
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <span className="font-bold tracking-[-0.02em] text-lg leading-none flex items-baseline gap-1">
              <span>Chivox</span>
              <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">MCP</span>
            </span>
          </Link>

          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-[22px] font-semibold tracking-[-0.015em] mb-2">{t.sentTitle}</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t.sentDesc}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-foreground text-muted-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.sentBack}
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <h2 className="text-[22px] font-semibold tracking-[-0.015em] mb-1">{t.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{t.subtitle}</p>

              {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder={t.emailPlaceholder}
                      className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-all"
                >
                  {loading ? t.sending : t.submit}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t.backToLogin}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
