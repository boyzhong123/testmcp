'use client';

import { Link } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from '@/i18n/routing';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
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
    '支持 18 种评测类型',
    '完整的开发者文档',
    '即时获取 API Key',
  ];

  return (
    <main className="flex-1 flex min-h-screen">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-foreground text-background overflow-hidden">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-[20%] right-[10%] w-[280px] h-[280px] bg-gradient-to-bl from-white/[0.07] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] left-[5%] w-[220px] h-[220px] bg-gradient-to-tr from-white/[0.05] to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center">
              <span className="text-foreground text-sm font-bold">C</span>
            </div>
            <span className="font-semibold tracking-tight">Chivox MCP</span>
          </Link>

          {/* Tagline + Benefits */}
          <div className="max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight leading-tight mb-4">
              开始构建<br />AI 口语教学应用
            </h1>
            <p className="text-sm text-background/60 leading-relaxed mb-8">
              注册后即可获取 API Key，接入语音评测能力，只需几分钟即可上手。
            </p>
            <ul className="space-y-3">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-3 text-sm text-background/80">
                  <span className="h-5 w-5 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof */}
          <div className="text-xs text-background/40">
            已有 200+ 开发者注册使用
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold">C</span>
            </div>
            <span className="font-semibold tracking-tight">Chivox MCP</span>
          </Link>

          <h2 className="text-2xl font-bold tracking-tight mb-1">创建账号</h2>
          <p className="text-sm text-muted-foreground mb-8">免费注册，立即开始</p>

          {error && (
            <div className="mb-5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-2.5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">名称</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="您的名称"
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">密码</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="至少 6 位"
                  className="w-full h-11 pl-10 pr-12 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="再次输入密码"
                  className="w-full h-11 pl-10 pr-12 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-11 text-sm font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  注册中
                </>
              ) : (
                <>
                  创建账号
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground/70 text-center mt-4 leading-relaxed">
            注册即表示您同意我们的<Link href="/" className="text-muted-foreground hover:text-foreground underline underline-offset-2">服务条款</Link>和<Link href="/" className="text-muted-foreground hover:text-foreground underline underline-offset-2">隐私政策</Link>
          </p>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">或</span></div>
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
