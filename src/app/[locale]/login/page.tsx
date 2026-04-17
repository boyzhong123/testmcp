'use client';

import { Link } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from '@/i18n/routing';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AudioWaveform } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('请输入邮箱'); return; }
    if (!password.trim()) { setError('请输入密码'); return; }

    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) router.push('/dashboard/keys');
    } catch {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-dvh flex overflow-hidden">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-zinc-950 text-white overflow-hidden">
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")' }} />
        {/* Gradient mesh */}
        <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] bg-gradient-to-br from-white/[0.07] via-transparent to-transparent rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-tl from-white/[0.05] via-transparent to-transparent rounded-full blur-[80px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-white/10">
              <AudioWaveform className="h-4 w-4 text-zinc-950" />
            </div>
            <span className="font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">Chivox MCP</span>
          </Link>

          <div className="max-w-xs">
            <h1 className="text-[28px] font-bold tracking-tight leading-[1.2] mb-3">
              让语音评测<br />接入大模型
            </h1>
            <p className="text-[13px] text-white/50 leading-relaxed">
              驰声 MCP 将语音评测的高颗粒度元数据以标准协议输出，使 LLM 能够理解、分析并生成个性化的口语教学反馈。
            </p>
          </div>

          <div className="flex gap-8">
            {[
              { value: '16', label: '种评测工具' },
              { value: '20+', label: '评测维度' },
              { value: '99%', label: '服务可用率' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-xl font-bold tabular-nums text-white/90">{s.value}</div>
                <div className="text-[11px] text-white/35 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-background relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

        <div className="w-full max-w-[340px] relative z-10">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <AudioWaveform className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Chivox MCP</span>
          </Link>

          <h2 className="text-[22px] font-bold tracking-tight mb-1">欢迎回来</h2>
          <p className="text-sm text-muted-foreground mb-6">登录您的开发者账号</p>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">密码</label>
                <button type="button" className="text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors">
                  忘记密码？
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-10 text-sm rounded-lg border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-10 text-sm font-semibold rounded-lg bg-foreground text-background shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 !mt-5"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  登录中
                </>
              ) : (
                <>
                  登 录
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-[11px] text-muted-foreground/60">或</span></div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            还没有账号？{' '}
            <Link href="/register" className="text-foreground font-medium hover:underline underline-offset-4">
              创建免费账号
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
