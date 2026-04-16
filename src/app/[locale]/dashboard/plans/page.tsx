'use client';

import { useAuth } from '@/lib/auth-context';
import { PLAN_DETAILS } from '@/lib/mock-data';
import { Link } from '@/i18n/routing';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = ['free', 'pro', 'enterprise'] as const;

export default function PlansPage() {
  const { user } = useAuth();
  const currentPlan = user?.plan || 'free';

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-2">会员套餐</h1>
      <p className="text-sm text-muted-foreground mb-8">选择适合您业务规模的套餐方案</p>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mb-12">
        {plans.map(planKey => {
          const plan = PLAN_DETAILS[planKey];
          const isCurrent = currentPlan === planKey;
          const isPopular = planKey === 'pro';

          return (
            <div
              key={planKey}
              className={cn(
                'relative rounded-xl border p-6 flex flex-col bg-background transition-shadow',
                isPopular ? 'border-foreground border-2 shadow-lg' : 'border-border',
                isCurrent && 'ring-2 ring-foreground/20'
              )}
            >
              {isPopular && (
                <span className="absolute -top-3 left-5 text-xs font-medium bg-foreground text-background px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="h-3 w-3" /> 推荐
                </span>
              )}

              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="mb-5">
                {plan.price === 0 ? (
                  <span className="text-3xl font-bold">免费</span>
                ) : plan.price === -1 ? (
                  <span className="text-3xl font-bold">定制</span>
                ) : (
                  <span>
                    <span className="text-3xl font-bold">¥{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/月</span>
                  </span>
                )}
              </div>

              <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                    <span>
                      <span className="text-foreground font-medium">{f.label}</span>
                      {' '}
                      {f.value}
                    </span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="h-9 flex items-center justify-center text-sm font-medium rounded-lg border border-border bg-muted/50 text-muted-foreground">
                  当前套餐
                </div>
              ) : planKey === 'enterprise' ? (
                <Link
                  href="/contact"
                  className="h-9 flex items-center justify-center text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  联系销售
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className={cn(
                    'h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors',
                    isPopular
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'border border-border hover:bg-muted'
                  )}
                >
                  联系我们升级
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <h2 className="text-lg font-bold tracking-tight mb-4">套餐功能对比</h2>
      <div className="rounded-xl border border-border bg-background overflow-hidden max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">功能</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">开发者</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">专业版</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">企业版</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['月调用量', '1,000 次', '50,000 次', '不限'],
                ['并发数', '2', '10', '50+'],
                ['评测工具', '基础 3 项', '全部 18 项', '全部 + 定制'],
                ['批量评测', '—', '≤20条/批', '≤50条/批'],
                ['LLM 分析 API', '—', '100 次/月', '不限'],
                ['发音对比', '—', '✓', '✓'],
                ['学习进度', '—', '30 天历史', '90 天历史'],
                ['结果缓存', '10 分钟', '1 小时', '自定义'],
                ['优先队列', '—', '✓', '最高优先'],
                ['技术支持', 'GitHub Issue', '邮件 48h', '7×24 专属群'],
                ['SLA', '—', '99.5%', '99.9%+'],
                ['超额计费', '不可超额', '¥0.003/次', '协商'],
              ].map(([feature, ...values], i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-4 font-medium">{feature}</td>
                  {values.map((v, j) => (
                    <td key={j} className="py-2.5 px-4 text-center text-muted-foreground">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
