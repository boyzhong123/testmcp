'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from 'next-intl';
import {
  LayoutDashboard, Users, Key, Activity, Zap,
  TrendingUp, TrendingDown, Server, Sparkles, Flame, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminListUsers, type ApiAdminUser } from '@/lib/api';

// ------- Seeded demo generators (stable per render) ------------------------

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDailyCalls(days = 14, baseline = 3200, seed = 42) {
  const rnd = mulberry32(seed);
  const today = new Date();
  const out: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    const weekendDrop = dow === 0 || dow === 6 ? 0.55 : 1;
    const noise = 0.6 + rnd() * 0.8;
    const trend = 1 + ((days - 1 - i) * 0.02);
    const count = Math.round(baseline * weekendDrop * noise * trend);
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}

export default function OverviewPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isAdmin) router.replace('/dashboard/keys');
  }, [user, router]);

  const [users, setUsers] = useState<ApiAdminUser[]>([]);
  useEffect(() => {
    adminListUsers({ page: 1, page_size: 200 })
      .then(d => setUsers(d.users || []))
      .catch(() => setUsers([]));
  }, []);

  const t = {
    title: isZh ? '平台概览' : 'Platform Overview',
    subtitle: isZh
      ? '平台级实时运行状态与核心指标汇总'
      : 'Platform-level runtime status and core metrics',
    demoBanner: isZh
      ? '本页为样例页面：后端尚未提供聚合统计 / 趋势 / 排行接口，以下数据（除"注册用户数"外）均为演示用途。'
      : 'Sample page — the backend does not yet provide aggregation / trend / ranking APIs. All data below (except "registered users") is demo content.',
    sample: isZh ? '样例' : 'Demo',
    kpi: {
      users: isZh ? '注册用户' : 'Registered Users',
      keys: isZh ? 'API Key 总数' : 'Total API Keys',
      active: isZh ? '今日活跃 Key' : 'Active Keys Today',
      calls: isZh ? '今日调用量' : 'Calls Today',
      wowUp: isZh ? '较昨日' : 'vs. yesterday',
    },
    trendTitle: isZh ? '近 14 天全平台调用量' : 'Platform Calls · Last 14 days',
    trendSubtitle: isZh ? '按日聚合' : 'Daily aggregate',
    topKeysTitle: isZh ? 'Top Key 活跃榜' : 'Top Active Keys',
    topKeysSubtitle: isZh ? '按今日调用量排序' : 'By calls today',
    growthTitle: isZh ? '用户增长' : 'User Growth',
    growthSubtitle: isZh ? '近 7 天新注册' : 'New sign-ups · Last 7 days',
    healthTitle: isZh ? '系统健康' : 'System Health',
    healthItems: [
      { label: isZh ? 'API 网关' : 'API Gateway', value: '99.98%', status: 'ok' as const },
      { label: isZh ? '评测引擎' : 'Eval Engine', value: isZh ? '正常' : 'Healthy', status: 'ok' as const },
      { label: isZh ? '鉴权服务' : 'Auth', value: isZh ? '正常' : 'Healthy', status: 'ok' as const },
      { label: isZh ? '平均延迟' : 'Avg Latency', value: '128ms', status: 'warn' as const },
    ],
    announceTitle: isZh ? '近期动态' : 'Recent Activity',
    announcements: [
      { time: '2m', text: isZh ? '新用户 2333@qq.com 注册' : 'New user 2333@qq.com signed up' },
      { time: '18m', text: isZh ? '管理员为 tester 的 default key 充值 +500' : 'Admin topped up tester/default +500' },
      { time: '1h', text: isZh ? 'Key sk-ee89...1482 调用量突破 10,000' : 'Key sk-ee89...1482 hit 10k calls' },
      { time: '3h', text: isZh ? '系统发布 v0.9.2：管理员控制台上线' : 'Release v0.9.2: Admin console deployed' },
    ],
  };

  // --- Metrics (real where possible, otherwise demo) ----------------------
  const totalUsers = users.length;
  const totalKeys = users.reduce((s, u) => s + (u.key_count ?? 0), 0);

  const dailyCalls = useMemo(() => buildDailyCalls(14, 3200, 77), []);
  const todayCalls = dailyCalls[dailyCalls.length - 1]?.count ?? 0;
  const yestCalls = dailyCalls[dailyCalls.length - 2]?.count ?? 1;
  const wowPct = Math.round(((todayCalls - yestCalls) / Math.max(1, yestCalls)) * 100);
  const activeKeysToday = Math.max(1, Math.round(totalKeys * 0.62) || 14);

  const topKeys = useMemo(() => {
    const rnd = mulberry32(9);
    const names = ['prod-main', 'sdk-ios', 'sdk-android', 'web-embed', 'internal-qa', 'sandbox'];
    return names.map((n, i) => ({
      name: n,
      owner: ['tester', '232323', 'zhxshld', 'chenweilin', '管理员', 'tester'][i] || 'user',
      calls: Math.round(800 * (1 - i * 0.13) * (0.7 + rnd() * 0.6)),
    })).sort((a, b) => b.calls - a.calls);
  }, []);
  const topKeysMax = Math.max(...topKeys.map(k => k.calls), 1);

  const growth = useMemo(() => buildDailyCalls(7, 4, 21).map(d => ({ date: d.date, count: Math.max(0, Math.round(d.count)) })), []);
  const growthMax = Math.max(...growth.map(g => g.count), 1);
  const growthTotal = growth.reduce((s, g) => s + g.count, 0);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Demo banner */}
      <div className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">{t.demoBanner}</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Users}
          label={t.kpi.users}
          value={totalUsers.toLocaleString()}
          accent="emerald"
          isDemo={false}
          sampleTag={t.sample}
        />
        <KpiCard
          icon={Key}
          label={t.kpi.keys}
          value={totalKeys.toLocaleString()}
          accent="sky"
          isDemo={false}
          sampleTag={t.sample}
        />
        <KpiCard
          icon={Activity}
          label={t.kpi.active}
          value={activeKeysToday.toLocaleString()}
          accent="indigo"
          isDemo
          sampleTag={t.sample}
        />
        <KpiCard
          icon={Zap}
          label={t.kpi.calls}
          value={todayCalls.toLocaleString()}
          accent="amber"
          isDemo
          sampleTag={t.sample}
          delta={wowPct}
          deltaLabel={t.kpi.wowUp}
        />
      </div>

      {/* Trend chart */}
      <div className="rounded-2xl border border-border bg-background p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{t.trendTitle}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t.trendSubtitle}</p>
          </div>
          <SampleTag label={t.sample} />
        </div>
        <div className="flex items-end gap-1.5 h-48">
          {dailyCalls.map((d, i) => {
            const max = Math.max(...dailyCalls.map(x => x.count), 1);
            const pct = (d.count / max) * 100;
            const isLast = i === dailyCalls.length - 1;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {d.count.toLocaleString()}
                </span>
                <div
                  className={cn(
                    'w-full rounded-t transition-colors min-h-[2px]',
                    isLast
                      ? 'bg-gradient-to-t from-indigo-500 to-sky-400'
                      : 'bg-gradient-to-t from-indigo-500/60 to-sky-400/60 group-hover:from-indigo-500 group-hover:to-sky-400'
                  )}
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[9px] text-muted-foreground tabular-nums">
                  {d.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two column: Top keys + Growth */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 mb-6">
        {/* Top keys */}
        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{t.topKeysTitle}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.topKeysSubtitle}</p>
              </div>
            </div>
            <SampleTag label={t.sample} />
          </div>
          <div className="space-y-3">
            {topKeys.map((k, i) => {
              const pct = (k.calls / topKeysMax) * 100;
              return (
                <div key={k.name} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn(
                        'inline-flex items-center justify-center h-5 w-5 rounded-md text-[10px] font-semibold tabular-nums shrink-0',
                        i === 0 && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                        i === 1 && 'bg-slate-400/15 text-slate-600 dark:text-slate-300',
                        i === 2 && 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
                        i > 2 && 'bg-muted text-muted-foreground',
                      )}>{i + 1}</span>
                      <code className="font-mono text-xs font-medium truncate">{k.name}</code>
                      <span className="text-muted-foreground truncate">· {k.owner}</span>
                    </div>
                    <span className="tabular-nums font-medium shrink-0">{k.calls.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth */}
        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{t.growthTitle}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.growthSubtitle}</p>
              </div>
            </div>
            <SampleTag label={t.sample} />
          </div>

          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight">{growthTotal}</span>
            <span className="text-xs text-muted-foreground">{isZh ? '位新用户' : 'new users'}</span>
          </div>

          <div className="flex items-end gap-1.5 h-24">
            {growth.map(g => {
              const pct = (g.count / growthMax) * 100;
              return (
                <div key={g.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-300 min-h-[2px]"
                    style={{ height: `${pct}%` }}
                    title={`${g.date}: ${g.count}`}
                  />
                  <span className="text-[9px] text-muted-foreground tabular-nums">
                    {g.date.slice(8)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Health + Activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-sky-500" />
              <h3 className="text-sm font-semibold tracking-tight">{t.healthTitle}</h3>
            </div>
            <SampleTag label={t.sample} />
          </div>
          <div className="divide-y divide-border">
            {t.healthItems.map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="flex items-center gap-2">
                  <span className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    item.status === 'ok' ? 'bg-emerald-500' : item.status === 'warn' ? 'bg-amber-500' : 'bg-rose-500'
                  )} />
                  <span className="text-xs font-medium tabular-nums">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              <h3 className="text-sm font-semibold tracking-tight">{t.announceTitle}</h3>
            </div>
            <SampleTag label={t.sample} />
          </div>
          <ul className="space-y-3">
            {t.announcements.map((a, i) => (
              <li key={i} className="flex gap-3 text-xs">
                <span className="shrink-0 w-10 text-right text-[10px] text-muted-foreground tabular-nums pt-0.5">
                  {a.time}
                </span>
                <span className="relative pl-3 flex-1">
                  <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span className="text-foreground/90 leading-relaxed">{a.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function KpiCard({
  icon: Icon, label, value, accent, isDemo, sampleTag, delta, deltaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: 'emerald' | 'sky' | 'indigo' | 'amber';
  isDemo?: boolean;
  sampleTag: string;
  delta?: number;
  deltaLabel?: string;
}) {
  const accentMap = {
    emerald: 'from-emerald-500 to-emerald-400',
    sky: 'from-sky-500 to-sky-400',
    indigo: 'from-indigo-500 to-indigo-400',
    amber: 'from-amber-500 to-amber-400',
  } as const;

  return (
    <div className="relative rounded-2xl border border-border bg-background p-5 overflow-hidden">
      <div className={cn('absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br', accentMap[accent])} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br shadow-sm', accentMap[accent])}>
            <Icon className="h-4 w-4" />
          </div>
          {isDemo && <SampleTag label={sampleTag} />}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight">{value}</span>
          {delta !== undefined && (
            <span className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums',
              delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}>
              {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {delta >= 0 ? '+' : ''}{delta}%
            </span>
          )}
        </div>
        {delta !== undefined && deltaLabel && (
          <p className="text-[10px] text-muted-foreground mt-1">{deltaLabel}</p>
        )}
      </div>
    </div>
  );
}

function SampleTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-[18px] px-1.5 text-[10px] font-medium rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
      {label}
    </span>
  );
}
