'use client';

import { useState, useMemo } from 'react';
import { Receipt, Calculator, CreditCard, Plus, Zap, Headphones } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { generateBillingRecords, calculateCost, PLAN_DETAILS } from '@/lib/mock-data';
import { useLocale } from 'next-intl';

export default function BillingPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '费用账单' : 'Billing',
    subtitle: isZh ? '查看账单明细和费用预估' : 'View billing details and estimates',
    sampleBanner: isZh
      ? '以下数据为示例数据，账单接口尚未上线，实际账单将在后续版本中接入。'
      : 'The data below is for illustration only. Billing APIs are not yet available and will be connected in a future release.',
    currentPlan: isZh ? '当前套餐' : 'Current Plan',
    free: isZh ? '免费' : 'Free',
    custom: isZh ? '定制报价' : 'Custom quote',
    perMonth: isZh ? '/月' : '/mo',
    monthlyCost: isZh ? '本月费用' : 'This Month Cost',
    overageCalls: isZh ? '超额调用' : 'Overage Calls',
    billedAt: isZh ? '按 ¥0.003/次计费' : 'Billed at ¥0.003/call',
    calcTitle: isZh ? '费用计算器' : 'Cost Calculator',
    calcDesc: isZh ? '输入预计月调用量，查看推荐套餐和费用预估' : 'Estimate plan and monthly cost by expected calls',
    inputPlaceholder: isZh ? '输入预计月调用量' : 'Enter expected monthly calls',
    callsPerMonth: isZh ? '次/月' : 'calls/mo',
    recPlan: isZh ? '推荐方案' : 'Recommended Plan',
    planFee: isZh ? '套餐费用' : 'Plan Fee',
    overage: isZh ? '超额' : 'Overage',
    estimatedTotal: isZh ? '预估总费用' : 'Estimated Total',
    history: isZh ? '充值记录' : 'Recharge History',
    historyDesc: isZh
      ? '管理员为该账号各 API Key 调整额度的明细（以下为示例数据，后续将接入真实流水）'
      : 'Quota adjustments made by admins for this account\'s API keys (sample data below; real records coming soon).',
    colTime: isZh ? '充值时间' : 'Time',
    colKey: isZh ? 'API Key' : 'API Key',
    colDelta: isZh ? '追加额度' : 'Added',
    colAfter: isZh ? '充值后总量' : 'Total after',
    colOperator: isZh ? '操作人' : 'Operator',
    colStatus: isZh ? '状态' : 'Status',
    ok: isZh ? '成功' : 'Success',
    sample: isZh ? '示例' : 'Sample',
    needQuota: isZh ? '需要充值更多额度？' : 'Need more quota?',
    needQuotaDesc: isZh ? '联系客服可为指定 Key 追加调用次数' : 'Contact support to add calls to a specific key',
    contactSupport: isZh ? '联系客服充值' : 'Contact support',
  };

  const rechargeSamples = [
    { time: '2026/04/22 14:20', keyName: 'default', delta: 500, after: 1400, operator: 'admin@chivox.com' },
    { time: '2026/04/12 09:15', keyName: 'prod-main', delta: 1000, after: 1900, operator: 'admin@chivox.com' },
    { time: '2026/03/28 17:02', keyName: 'default', delta: 300, after: 900, operator: 'admin@chivox.com' },
    { time: '2026/03/10 11:40', keyName: 'sandbox', delta: 200, after: 600, operator: 'admin@chivox.com' },
  ];
  const { user } = useAuth();
  const billingRecords = useMemo(() => generateBillingRecords(), []);
  const currentPlan = PLAN_DETAILS[user?.plan || 'free'];
  const currentBill = billingRecords[0];

  const [calcInput, setCalcInput] = useState('');
  const calcResult = useMemo(() => {
    const num = parseInt(calcInput);
    if (isNaN(num) || num < 0) return null;
    return calculateCost(num);
  }, [calcInput]);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-[-0.015em] mb-2">{t.title}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t.subtitle}</p>

      {/* Sample data notice */}
      <div className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <svg className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8.898.566a1 1 0 0 0-1.796 0l-6.5 13A1 1 0 0 0 1.5 15h13a1 1 0 0 0 .898-1.434zM8 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 5m0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
        </svg>
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">{t.sampleBanner}</p>
      </div>

      {/* Current Month Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-medium">{t.currentPlan}</span>
          </div>
          <div className="text-lg font-semibold">{currentPlan.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {currentPlan.price === 0 ? t.free : currentPlan.price === -1 ? t.custom : `¥${currentPlan.price}${t.perMonth}`}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Receipt className="h-4 w-4" />
            <span className="text-xs font-medium">{t.monthlyCost}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums">¥{currentBill?.total.toFixed(2) || '0.00'}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isZh ? '套餐' : 'Plan'} ¥{currentBill?.planFee.toFixed(2) || '0.00'} + {isZh ? '超额' : 'Overage'} ¥{currentBill?.extraFee.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calculator className="h-4 w-4" />
            <span className="text-xs font-medium">{t.overageCalls}</span>
          </div>
          <div className="text-2xl font-bold tabular-nums">{currentBill?.extraCalls.toLocaleString() || 0}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{t.billedAt}</div>
        </div>
      </div>

      {/* Cost Calculator */}
      <div className="rounded-xl border border-border bg-background p-6 mb-8 max-w-2xl">
        <h2 className="text-lg font-semibold tracking-[-0.015em] mb-1">{t.calcTitle}</h2>
        <p className="text-sm text-muted-foreground mb-5">{t.calcDesc}</p>

        <div className="flex items-center gap-3 mb-5">
          <input
            type="number"
            value={calcInput}
            onChange={e => setCalcInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            min={0}
            className="flex-1 h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors placeholder:text-muted-foreground tabular-nums"
          />
          <span className="text-sm text-muted-foreground shrink-0">{t.callsPerMonth}</span>
        </div>

        {calcResult && (
          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.recPlan}</span>
              <span className="font-medium">{calcResult.plan}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.planFee}</span>
              <span className="tabular-nums">¥{calcResult.planFee.toFixed(2)}</span>
            </div>
            {calcResult.extraCalls > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.overage} {calcResult.extraCalls.toLocaleString()} {isZh ? '次' : 'calls'}</span>
                <span className="tabular-nums">¥{calcResult.extraFee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2.5 flex items-center justify-between text-sm font-bold">
              <span>{t.estimatedTotal}</span>
              <span className="tabular-nums">¥{calcResult.total.toFixed(2)}{t.perMonth}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">{calcResult.recommendation}</p>
          </div>
        )}
      </div>

      {/* Recharge History */}
      <div className="flex items-baseline justify-between mb-2 max-w-4xl">
        <h2 className="text-lg font-semibold tracking-[-0.015em]">{t.history}</h2>
        <span className="inline-flex items-center h-[18px] px-1.5 text-[10px] font-medium rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
          {t.sample}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4 max-w-4xl">{t.historyDesc}</p>

      <div className="rounded-xl border border-dashed border-border bg-background overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.colTime}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.colKey}</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">{t.colDelta}</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">{t.colAfter}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.colOperator}</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">{t.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rechargeSamples.map((r, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium tabular-nums whitespace-nowrap">{r.time}</td>
                  <td className="py-2.5 px-4">
                    <code className="text-xs font-mono text-muted-foreground">{r.keyName}</code>
                  </td>
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      <Plus className="h-3 w-3" />
                      {r.delta.toLocaleString()}
                    </span>
                    <span className="ml-1 text-[10px] text-muted-foreground">{isZh ? '次' : 'calls'}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums whitespace-nowrap">
                    {r.after.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {r.operator}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Zap className="h-2.5 w-2.5" />
                      {t.ok}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact support CTA */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/10 px-5 py-4 max-w-4xl">
        <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
          <Headphones className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{t.needQuota}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t.needQuotaDesc}</p>
        </div>
        <a
          href="mailto:sales@chivox.com"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors whitespace-nowrap shrink-0"
        >
          {t.contactSupport}
        </a>
      </div>
    </div>
  );
}
