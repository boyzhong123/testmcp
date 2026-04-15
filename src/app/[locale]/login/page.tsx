'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('登录功能即将上线 / Login coming soon');
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">C</span>
          </div>
          <span className="font-semibold tracking-tight">Chivox MCP</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-1">登录 / Log In</h1>
        <p className="text-sm text-muted-foreground mb-8">输入您的账号信息以继续</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium mb-1.5 block">邮箱 / Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-10 px-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium mb-1.5 block">密码 / Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            登录 / Log In
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          还没有账号？ <Link href="/contact" className="text-foreground hover:underline underline-offset-4">联系我们</Link>
        </p>
      </div>
    </main>
  );
}
