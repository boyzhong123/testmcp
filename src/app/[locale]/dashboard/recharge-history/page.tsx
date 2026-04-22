'use client';

import { useLocale } from 'next-intl';
import { History, Rocket, Plus } from 'lucide-react';

export default function RechargeHistoryPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');

  const t = {
    title: isZh ? '充值历史' : 'Recharge History',
    subtitle: isZh
      ? '每位用户的 API Key 额度变更流水：何时、由谁调整了哪个 Key、前后额度对比、变更原因'
      : 'Audit log of API Key quota changes per user: when, by whom, on which key, before / after values, and reason',
    emptyTitle: isZh ? '功能即将上线' : 'Coming Soon',
    emptyDesc: isZh
      ? '充值历史将以流水形式记录每次额度变更：操作时间、操作人、目标 Key、变更前后的总量 / 周期上限、充值数量、备注。接口对接中，上线后可追溯每个 Key 的完整配额轨迹。'
      : 'The recharge history will record every quota change as an audit trail: timestamp, operator, target key, before / after total & period limits, top-up amount, and notes. API integration in progress — stay tuned.',
    cols: {
      time: isZh ? '时间' : 'Time',
      user: isZh ? '账号' : 'User',
      key: isZh ? 'Key 名称' : 'Key',
      delta: isZh ? '额度变更' : 'Quota Change',
      operator: isZh ? '操作人' : 'Operator',
    },
    sample: isZh ? '示例' : 'Sample',
  };

  const sampleRows = [
    { time: '2026/04/22 14:20:33', user: 'tester · newuser1776...@qq.com', key: 'default', delta: '+500', before: '900', after: '1400', operator: 'admin@qq.com' },
    { time: '2026/04/21 10:08:11', user: '232323 · 2333@qq.com', key: 'prod-key', delta: '+1000', before: '0', after: '1000', operator: 'admin@qq.com' },
    { time: '2026/04/19 18:42:05', user: 'zhxshld · 860386404@qq.com', key: 'main', delta: '-200', before: '1200', after: '1000', operator: 'admin@qq.com' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <History className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center text-center mb-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-6">
          <Rocket className="h-10 w-10 text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2">{t.emptyTitle}</h2>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          {t.emptyDesc}
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>{isZh ? '开发中' : 'In Development'}</span>
        </div>
      </div>

      {/* Sample table preview */}
      <div className="rounded-2xl border border-dashed border-border bg-background/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2 bg-muted/30">
          <span className="inline-flex items-center h-5 px-2 text-[10px] font-medium rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            {t.sample}
          </span>
          <span className="text-xs text-muted-foreground">
            {isZh ? '以下为页面上线后将展示的字段示例，数据为占位：' : 'Preview of fields that will be shown once live (placeholder data):'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">{t.cols.time}</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">{t.cols.user}</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">{t.cols.key}</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">{t.cols.delta}</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">{t.cols.operator}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border [&_td]:py-2.5 [&_td]:px-4 [&_td]:text-muted-foreground/80">
              {sampleRows.map((r, i) => {
                const positive = r.delta.startsWith('+');
                return (
                  <tr key={i}>
                    <td className="whitespace-nowrap tabular-nums">{r.time}</td>
                    <td className="whitespace-nowrap">{r.user}</td>
                    <td className="whitespace-nowrap font-mono text-xs">{r.key}</td>
                    <td className="text-right whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 tabular-nums font-medium ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {positive && <Plus className="h-3 w-3" />}
                        {r.delta.replace('+', '')}
                      </span>
                      <span className="ml-2 text-[11px] text-muted-foreground/70 tabular-nums">
                        {r.before} → {r.after}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-xs">{r.operator}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
