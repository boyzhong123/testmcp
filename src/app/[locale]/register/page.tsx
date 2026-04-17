'use client';

import { Link } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from '@/i18n/routing';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, AudioWaveform } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('请输入名称'); return; }
    if (!email.trim()) { setError('请输入邮箱'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('请输入有效的邮箱地址'); return; }
    if (password.length < 6) { setError('密码至少 6 位'); return; }
    if (password !== confirmPassword) { setError('两次输入的密码不一致'); return; }

    setLoading(true);
    try {
      const ok = await register(name, email, password);
      if (ok) router.push('/dashboard/keys');
    } catch {
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  }

  const benefits = [
    '每月 1,000 次免费 API 调用',
    '支持 16 种评测工具',
    '完整的开发者文档',
    '即时获取 API Key',
  ];

  const inputCls = "w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/40";
  const inputWithBtnCls = "w-full h-10 pl-9 pr-10 text-sm rounded-lg border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/40";

  return (
    <main className="h-dvh flex overflow-hidden">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")' }} />
        <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-bl from-white/[0.06] via-transparent to-transparent rounded-full blur-[100px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent rounded-full blur-[80px]" />
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
              开始构建<br />AI 口语教学应用
            </h1>
            <p className="text-[13px] text-white/50 leading-relaxed mb-6">
              注册后即可获取 API Key，接入语音评测能力，只需几分钟即可上手。
            </p>
            <ul className="space-y-2.5">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-2.5 text-[13px] text-white/70">
                  <span className="h-4.5 w-4.5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-white/30">
            已有 200+ 开发者注册使用
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

        <div className="w-full max-w-[340px] relative z-10">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <AudioWaveform className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="font-semibold tracking-tight">Chivox MCP</span>
          </Link>

          <h2 className="text-[22px] font-bold tracking-tight mb-1">创建账号</h2>
          <p className="text-sm text-muted-foreground mb-5">免费注册，立即开始</p>

          {error && (
            <div className="mb-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">名称</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="您的名称" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="至少 6 位"
                    className={inputWithBtnCls}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">确认密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="再次输入"
                    className={inputWithBtnCls}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                    {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-10 text-sm font-semibold rounded-lg bg-foreground text-background shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 !mt-4"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  注册中
                </>
              ) : (
                <>
                  创建账号
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-muted-foreground/50 text-center mt-3 leading-relaxed">
            注册即表示您同意<Link href="/" className="text-muted-foreground/70 hover:text-foreground underline underline-offset-2">服务条款</Link>和<Link href="/" className="text-muted-foreground/70 hover:text-foreground underline underline-offset-2">隐私政策</Link>
          </p>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-[11px] text-muted-foreground/60">或</span></div>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            已有账号？{' '}
            <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
