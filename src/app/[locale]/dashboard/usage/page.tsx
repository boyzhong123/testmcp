'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, TrendingUp, Layers, Activity } from 'lucide-react';
import { listKeys, getKeyUsage, type ApiKeyRecord, type ApiKeyUsage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function UsagePage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '用量统计' : 'Usage',
    subtitle: isZh ? '查看 API 调用情况和使用趋势（实时数据）' : 'Real-time API usage and trends',
    all: isZh ? '全部' : 'All',
    totalUsed: isZh ? '累计调用' : 'Total Calls',
    periodUsed: isZh ? '本周期调用' : 'Period Calls',
    remaining: isZh ? '剩余额度' : 'Remaining',
    noQuota: isZh ? '无配额' : 'No quota',
    dailyCalls: isZh ? '近 30 天每日调用量' : 'Daily Calls (last 30 days)',
    loadingKeys: isZh ? '加载中…' : 'Loading…',
    selectKey: isZh ? '请选择一个 Key 查看用量详情' : 'Select a key to view usage details',
    noKeys: isZh ? '暂无 API Key' : 'No API keys yet',
    loadError: isZh ? '加载失败' : 'Failed to load',
    totalLimit: isZh ? '总量上限' : 'Total Limit',
    periodLimit: isZh ? '周期上限' : 'Period Limit',
    daily: isZh ? '每日' : 'Daily',
    monthly: isZh ? '每月' : 'Monthly',
    times: isZh ? '次' : 'calls',
    allKeysTotal: isZh ? '所有 Key 累计' : 'All Keys Total',
    noUsageData: isZh ? '该 Key 暂未产生调用' : 'No calls recorded yet',
    noUsageHint: isZh
      ? '一旦你的应用使用该 Key 发起调用，这里会实时展示每日调用量。'
      : 'Once this key starts receiving requests, daily breakdown will appear here in real time.',
    today: isZh ? '今日' : 'Today',
    periodCalls: isZh ? '周期调用' : 'Period',
  };

  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [activeKeyId, setActiveKeyId] = useState<number | null>(null);
  const [usage, setUsage] = useState<ApiKeyUsage | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState('');

  useEffect(() => {
    listKeys()
      .then(data => {
        setKeys(data);
        if (data.length > 0) setActiveKeyId(data[0].id);
      })
      .catch(() => setKeys([]))
      .finally(() => setKeysLoading(false));
  }, []);

  const fetchUsage = useCallback(async (id: number) => {
    setUsageLoading(true);
    setUsageError('');
    setUsage(null);
    try {
      const data = await getKeyUsage(id);
      setUsage(data);
    } catch (err) {
      setUsageError(err instanceof Error ? err.message : String(err));
    } finally {
      setUsageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeKeyId !== null) fetchUsage(activeKeyId);
  }, [activeKeyId, fetchUsage]);

  const activeKey = keys.find(k => k.id === activeKeyId);

  // 汇总所有 Key 的调用数据
  const { allTotalUsed, allPeriodUsed } = useMemo(() => {
    let total = 0, period = 0;
    for (const k of keys) {
      total += k.total_used ?? 0;
      period += k.period_used ?? 0;
    }
    return { allTotalUsed: total, allPeriodUsed: period };
  }, [keys]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const dailyBreakdown = usage?.daily_breakdown ?? [];
  const maxCalls = dailyBreakdown.length > 0
    ? Math.max(...dailyBreakdown.map(d => d.count), 1)
    : 1;
  const hasDailyData = dailyBreakdown.some(d => d.count > 0);

  // 约定：limit === 0 表示 "无配额（禁用）"，不是 "不限"。
  const totalNoQuota = usage?.total_limit === 0;
  const periodNoQuota = usage?.period_limit === 0;
  const totalRemaining = usage && !totalNoQuota
    ? Math.max(0, usage.total_limit - usage.total_used)
    : null;
  const periodRemaining = usage && !periodNoQuota
    ? Math.max(0, usage.period_limit - usage.period_used)
    : null;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-[-0.015em] mb-2">{t.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t.subtitle}</p>

      {/* Key Tabs */}
      {keysLoading ? (
        <div className="text-sm text-muted-foreground mb-6">{t.loadingKeys}</div>
      ) : (
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {keys.length === 0 ? (
            <span className="text-sm text-muted-foreground">{t.noKeys}</span>
          ) : keys.map(k => (
            <TabButton key={k.id} active={activeKeyId === k.id} onClick={() => setActiveKeyId(k.id)}>
              {k.name}
              <code className="ml-1.5 text-[10px] opacity-60 font-mono">{k.api_key.slice(0, 8)}…</code>
            </TabButton>
          ))}
        </div>
      )}

      {/* All-keys summary (shown when multiple keys exist) */}
      {keys.length > 1 && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-border bg-muted/20 text-sm flex flex-wrap items-center gap-6">
          <span className="text-muted-foreground">{t.allKeysTotal}</span>
          <span>{t.totalUsed}：<strong className="tabular-nums">{allTotalUsed.toLocaleString()}</strong></span>
          <span>{t.periodUsed}：<strong className="tabular-nums">{allPeriodUsed.toLocaleString()}</strong></span>
        </div>
      )}

      {/* Per-key usage */}
      {usageError && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-2.5">
          {t.loadError}: {usageError}
        </div>
      )}

      {usageLoading && (
        <div className="py-12 text-center text-muted-foreground text-sm">{t.loadingKeys}</div>
      )}

      {!usageLoading && usage && activeKey && (
        <>
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={BarChart3}
              label={t.totalUsed}
              value={usage.total_used.toLocaleString()}
              sub={totalNoQuota
                ? `/ 0 · ${t.noQuota}`
                : `/ ${usage.total_limit.toLocaleString()} ${t.times}`}
              pct={totalNoQuota ? -1 : Math.round((usage.total_used / usage.total_limit) * 100)}
            />
            <StatCard
              icon={TrendingUp}
              label={`${usage.period_type === 'monthly' ? t.monthly : t.daily}${t.periodUsed}`}
              value={usage.period_used.toLocaleString()}
              sub={periodNoQuota
                ? `/ 0 · ${t.noQuota}`
                : `/ ${usage.period_limit.toLocaleString()} ${t.times}`}
              pct={periodNoQuota ? -1 : Math.round((usage.period_used / usage.period_limit) * 100)}
            />
            <StatCard
              icon={Layers}
              label={t.remaining}
              value={totalNoQuota
                ? t.noQuota
                : (totalRemaining ?? 0).toLocaleString()}
              sub={periodNoQuota
                ? (isZh ? '周期无配额' : 'period: none')
                : periodRemaining !== null
                  ? `${isZh ? '周期剩余' : 'period left'} ${periodRemaining.toLocaleString()}`
                  : undefined}
            />
          </div>

          {/* Daily breakdown bar chart */}
          <div className="rounded-xl border border-border bg-background p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                {t.dailyCalls}
              </h3>
            </div>
            {hasDailyData ? (
              <div className="flex items-end gap-1 h-40">
                {dailyBreakdown.map((d, i) => {
                  const isToday = d.date === todayStr;
                  const pct = (d.count / maxCalls) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <div className="bg-foreground text-background text-[10px] px-2 py-1 rounded whitespace-nowrap tabular-nums">
                          {d.date} · {d.count}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-full rounded-t transition-colors min-h-[2px]',
                          isToday
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-foreground/70 hover:bg-foreground'
                        )}
                        style={{ height: `${pct}%` }}
                      />
                      <span className={cn(
                        'text-[9px] mt-1 tabular-nums',
                        isToday ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
                      )}>
                        {d.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center px-4">
                <Activity className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">{t.noUsageData}</p>
                <p className="text-xs text-muted-foreground/70 mt-1 max-w-sm">{t.noUsageHint}</p>
              </div>
            )}
          </div>
        </>
      )}

      {!usageLoading && !usage && !usageError && keys.length > 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">{t.selectKey}</div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center h-8 px-3.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
      )}
    >
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, sub, pct }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub?: string; pct?: number;
}) {
  const warn = pct !== undefined && pct >= 80;
  return (
    <div className="relative rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn('text-2xl font-bold tabular-nums', warn && 'text-amber-600 dark:text-amber-400')}>{value}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      {pct !== undefined && pct >= 0 && (
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              warn ? 'bg-amber-500' : 'bg-foreground/60'
            )}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
