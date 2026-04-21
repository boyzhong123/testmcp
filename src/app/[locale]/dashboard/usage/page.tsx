'use client';

import { useState, useMemo, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { generateDailyUsage, generateToolDistribution, generateUsageRecords } from '@/lib/mock-data';
import { listKeys, type ApiKeyRecord } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

type TimeRange = '7d' | '30d';

export default function UsagePage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '用量统计' : 'Usage',
    subtitle: isZh ? '查看 API 调用情况和使用趋势' : 'View API usage and trends',
    sampleBanner: isZh
      ? '以下数据为示例数据，用量统计接口尚未上线，实际数据将在后续版本中接入。'
      : 'The data below is for illustration only. Usage statistics API is not yet available and will be connected in a future release.',
    all: isZh ? '全部' : 'All',
    monthlyUsage: isZh ? '本月调用量' : 'This Month Calls',
    quota: isZh ? '/ 1,000 配额' : '/ 1,000 quota',
    todayRequests: isZh ? '今日请求' : "Today's Requests",
    errorRate: isZh ? '错误率' : 'Error Rate',
    failedCount: (n: number) => (isZh ? `${n} 次失败` : `${n} failed`),
    timeRange: isZh ? '时间范围' : 'Time Range',
    last7d: isZh ? '近 7 天' : 'Last 7 days',
    last30d: isZh ? '近 30 天' : 'Last 30 days',
    dailyCalls: isZh ? '每日调用量' : 'Daily Calls',
    dist: isZh ? '评测类型分布' : 'Eval Type Distribution',
    times: isZh ? '次' : 'times',
    requestStatus: isZh ? '请求状态' : 'Request Status',
    success: isZh ? '成功' : 'Success',
    failed: isZh ? '失败' : 'Failed',
    records: isZh ? '调用记录' : 'Call Records',
    noRecords: isZh ? '该 Key 暂无调用记录' : 'No records for this key',
    tool: isZh ? '评测类型' : 'Tool',
    score: isZh ? '分数' : 'Score',
    duration: isZh ? '耗时' : 'Duration',
    status: isZh ? '状态' : 'Status',
    time: isZh ? '时间' : 'Time',
  };
  const [range, setRange] = useState<TimeRange>('7d');
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [activeKeyId, setActiveKeyId] = useState<string>('all');

  useEffect(() => {
    listKeys().then(setKeys).catch(() => setKeys([]));
  }, []);

  const dailyData = useMemo(() => generateDailyUsage(range === '7d' ? 7 : 30), [range]);
  const toolDist = useMemo(() => generateToolDistribution(), []);
  const allRecords = useMemo(() => generateUsageRecords(30), []);

  const filteredRecords = activeKeyId === 'all'
    ? allRecords
    : allRecords.filter(r => r.keyId === activeKeyId || r.keyId === String(activeKeyId));

  const scale = activeKeyId === 'all' ? 1 : 0.4 + Math.random() * 0.3;
  const filteredDaily = dailyData.map(d => ({
    ...d,
    calls: activeKeyId === 'all' ? d.calls : Math.round(d.calls * scale),
    errors: activeKeyId === 'all' ? d.errors : Math.round(d.errors * scale),
  }));

  const totalCalls = filteredDaily.reduce((s, d) => s + d.calls, 0);
  const totalErrors = filteredDaily.reduce((s, d) => s + d.errors, 0);
  const todayCalls = filteredDaily[filteredDaily.length - 1]?.calls || 0;
  const errorRate = totalCalls > 0 ? ((totalErrors / totalCalls) * 100).toFixed(2) : '0';
  const maxCalls = Math.max(...filteredDaily.map(d => d.calls), 1);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-[-0.015em] mb-2">{t.title}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t.subtitle}</p>

      {/* Sample data notice */}
      <div className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <svg className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{t.sampleBanner}</p>
      </div>

      {/* Key Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        <TabButton active={activeKeyId === 'all'} onClick={() => setActiveKeyId('all')}>
          {t.all}
        </TabButton>
        {keys.map(k => (
          <TabButton key={k.id} active={activeKeyId === String(k.id)} onClick={() => setActiveKeyId(String(k.id))}>
            {k.name}
            <code className="ml-1.5 text-[10px] opacity-60 font-mono">
              {k.api_key.slice(0, 8)}…
            </code>
          </TabButton>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={BarChart3} label={t.monthlyUsage} value={totalCalls.toLocaleString()} sub={t.quota} />
        <StatCard icon={TrendingUp} label={t.todayRequests} value={todayCalls.toLocaleString()} />
        <StatCard icon={AlertCircle} label={t.errorRate} value={`${errorRate}%`} sub={t.failedCount(totalErrors)} />
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-muted-foreground">{t.timeRange}</span>
        {(['7d', '30d'] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              'h-7 px-3 text-xs font-medium rounded-md transition-colors',
              range === r
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            {r === '7d' ? t.last7d : t.last30d}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl border border-border bg-background p-6 mb-8">
        <h3 className="text-sm font-medium mb-4">{t.dailyCalls}</h3>
        <div className="flex items-end gap-1 h-40">
          {filteredDaily.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                {d.calls}
              </span>
              <div
                className="w-full rounded-t bg-foreground/80 hover:bg-foreground transition-colors min-h-[2px]"
                style={{ height: `${(d.calls / maxCalls) * 100}%` }}
              />
              <span className="text-[9px] text-muted-foreground mt-1 tabular-nums">
                {d.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Tool Distribution */}
        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="text-sm font-medium mb-4">{t.dist}</h3>
          <div className="space-y-3">
            {toolDist.map(item => (
              <div key={item.tool}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{item.toolName}</span>
                  <span className="text-muted-foreground tabular-nums">{item.count} {t.times} ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground/70 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-xl border border-border bg-background p-6">
          <h3 className="text-sm font-medium mb-4">{t.requestStatus}</h3>
          <div className="flex items-center gap-8 mb-4">
            <div>
              <div className="text-2xl font-bold tabular-nums">{totalCalls - totalErrors}</div>
              <div className="text-xs text-muted-foreground">{t.success}</div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums text-destructive">{totalErrors}</div>
              <div className="text-xs text-muted-foreground">{t.failed}</div>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-foreground/70 transition-all"
              style={{ width: `${((totalCalls - totalErrors) / Math.max(totalCalls, 1)) * 100}%` }}
            />
            <div
              className="h-full bg-destructive/60 transition-all"
              style={{ width: `${(totalErrors / Math.max(totalCalls, 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Records Table */}
      <h2 className="text-lg font-semibold tracking-[-0.015em] mb-4">{t.records}</h2>
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.tool}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.score}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.duration}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.status}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.time}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    {t.noRecords}
                  </td>
                </tr>
              ) : (
                filteredRecords.slice(0, 20).map(r => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-4">{r.tool}</td>
                    <td className="py-2.5 px-4 tabular-nums font-mono text-xs">
                      {r.status === 'error' ? '—' : r.score}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground tabular-nums text-xs">
                      {(r.duration / 1000).toFixed(1)}s
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={cn(
                        'inline-block text-[11px] px-2 py-0.5 rounded-md',
                        r.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-destructive/10 text-destructive'
                      )}>
                        {r.status === 'success' ? t.success : t.failed}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleString(isZh ? 'zh-CN' : 'en-US')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}
