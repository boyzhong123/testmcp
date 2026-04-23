'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Gauge,
  Gift,
  Key,
  PiggyBank,
  Plus,
  Receipt,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMockAuth } from '../../_lib/mock-auth';
import {
  formatCents,
  formatDate,
  getAccountCallsThisMonth,
  getAccountSavingsThisMonthCents,
  getAccountSpendThisMonthCents,
  getKeyBalanceCents,
  getKeyUsageSummary,
  getSpendLimit,
  getStarterKey,
  getTransactions,
  keyLast4,
  listPaidKeys,
  type ApiKey,
  type Transaction,
} from '../../_lib/mock-store';
import { useMockStore } from '../../_lib/use-mock-store';
import { StripeCheckoutModal } from '../../_components/stripe-checkout-modal';
import { StatCard } from '../../_components/stat-card';
import { useLang } from '../../_lib/use-lang';

export default function OverviewPage() {
  const { user } = useMockAuth();
  const { t, tx, lang } = useLang();
  const calls = useMockStore(getAccountCallsThisMonth, 0);
  const spend = useMockStore(getAccountSpendThisMonthCents, 0);
  const savings = useMockStore(getAccountSavingsThisMonthCents, 0);
  const starter = useMockStore(() => getStarterKey() ?? null, null);
  const paidKeys = useMockStore(listPaidKeys, [] as ApiKey[]);
  const transactions = useMockStore(getTransactions, [] as Transaction[]);
  const spendLimit = useMockStore(getSpendLimit, {
    monthlyCapCents: 5000_00,
    resetDay: 1,
    warnAtPercents: [50, 75, 90],
  });

  const [addCreditsOpen, setAddCreditsOpen] = useState(false);
  const [addCreditsKeyId, setAddCreditsKeyId] = useState<string | null>(null);
  const openAddCreditsFor = (kid?: string) => {
    setAddCreditsKeyId(kid ?? null);
    setAddCreditsOpen(true);
  };

  const activePaidKeys = paidKeys.filter((k) => k.status === 'active');
  const recent = transactions.slice(0, 5);
  const starterExhausted =
    !!starter && starter.freeTotalUsed >= starter.freeTotalLimit;
  const hasFundedPaid = activePaidKeys.some(
    (k) => getKeyBalanceCents(k) > 0,
  );
  const limitUsedPct = Math.min(
    100,
    (spend / Math.max(1, spendLimit.monthlyCapCents)) * 100,
  );

  // Rank paid keys by lifetime call volume for the "most active" section.
  const rankedPaidKeys = activePaidKeys
    .map((k) => ({ key: k, summary: getKeyUsageSummary(k.id) }))
    .sort((a, b) => b.summary.calls - a.summary.calls)
    .slice(0, 3);

  return (
    <div className="space-y-6" translate="no" lang="en">
      <div>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] mt-0.5">
          {t(
            `Welcome back${user ? `, ${user.name.split(' ')[0]}` : ''}.`,
            `欢迎回来${user ? `，${user.name.split(' ')[0]}` : ''}。`,
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t(
            "Here's a snapshot of your Chivox MCP workspace — 1 free starter key + pay-as-you-go on paid keys.",
            '你的 Chivox MCP 工作区概览 — 1 把免费 Starter Key + 付费 Key 按用量计费。',
          )}
        </p>
      </div>

      {/* Starter exhausted upgrade banner — only when the starter key is used
           up AND the account has no funded paid key to fall back to. Skips
           rendering if the user is already on paid workloads. */}
      {starterExhausted && !hasFundedPaid && (
        <StarterExhaustedBanner
          onAddCredits={(kid) => openAddCreditsFor(kid)}
          firstPaidKey={activePaidKeys[0]}
        />
      )}

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Activity}
          label={t('Calls this month', '本月调用次数')}
          value={calls.toLocaleString('en-US')}
          sub={t(
            `${activePaidKeys.length} active paid key${activePaidKeys.length === 1 ? '' : 's'} + 1 starter`,
            `${activePaidKeys.length} 把付费 Key + 1 把 Starter`,
          )}
          href="/dev-en/dashboard/usage"
          cta={t('View usage', '查看用量')}
        />
        <StatCard
          icon={DollarSign}
          label={t('Spend this month', '本月消费')}
          value={formatCents(spend)}
          sub={t('Net cost · deducted from paid key credits', '净消费 · 从付费 Key 余额扣除')}
          href="/dev-en/dashboard/billing"
          cta={t('Open billing', '打开账单')}
        />
        <StatCard
          icon={PiggyBank}
          label={t('Savings this month', '本月优惠')}
          value={formatCents(savings)}
          sub={t('Volume discounts applied automatically', '批量折扣自动应用')}
          href="/dev-en/dashboard/billing/rates"
          cta={t('See tiers', '查看阶梯价')}
          tone="emerald"
        />
        <StatCard
          icon={Gauge}
          label={t('Spend limit used', '支出上限已用')}
          value={`${limitUsedPct.toFixed(1)}%`}
          sub={`${formatCents(spend)} / ${formatCents(spendLimit.monthlyCapCents)}`}
          href="/dev-en/dashboard/billing?edit=spend-limit#spend-limit"
          cta={t('Adjust limit', '调整上限')}
          progressPct={limitUsedPct}
          progressColor={
            limitUsedPct >= 90
              ? 'bg-red-500'
              : limitUsedPct >= 75
                ? 'bg-amber-500'
                : 'bg-foreground'
          }
        />
      </div>

      {/* Starter key strip — ambient reminder the freebie is there. */}
      {starter && (
        <StarterKeyStrip apiKey={starter} />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Paid keys list */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-background p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">{tx('Your most active paid keys')}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {tx('Balance, spend cap and low-balance alerts at a glance.')}
              </p>
            </div>
            <Link
              href="/dev-en/dashboard/keys"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {tx('All keys')} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {rankedPaidKeys.length === 0 ? (
            <div className="text-center py-10 rounded-lg border border-dashed border-border">
              <Key className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">{tx('No paid keys yet')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {tx("You're fine on the starter key. When you need more, create a paid key.")}
              </p>
              <Link
                href="/dev-en/dashboard/keys"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline underline-offset-4"
              >
                {tx('Create a paid key')} <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {rankedPaidKeys.map(({ key, summary }) => {
                const balance = getKeyBalanceCents(key);
                const totalLoaded = key.paidCreditsCents;
                const paidPct =
                  totalLoaded > 0
                    ? Math.min(
                        100,
                        (key.paidCreditsUsedCents / totalLoaded) * 100,
                      )
                    : 0;
                const needsCredits = totalLoaded === 0 || balance === 0;
                return (
                  <li
                    key={key.id}
                    className="rounded-lg border border-border px-4 py-3 flex items-center gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">
                          {key.name}
                        </span>
                        <code className="font-mono text-[11px] text-muted-foreground">
                          {keyLast4(key.secret)}
                        </code>
                        <span
                          className={cn(
                            'text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded',
                            key.env === 'production'
                              ? 'bg-foreground/[0.04] text-foreground border border-border'
                              : 'bg-muted text-muted-foreground border border-border',
                          )}
                        >
                          {tx(key.env === 'production' ? 'Prod' : 'Dev')}
                        </span>
                        {needsCredits && (
                          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            {tx('Needs credits')}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        {totalLoaded > 0 ? (
                          <BalanceBar
                            label={tx('Credits remaining')}
                            text={`${formatCents(balance)} ${t('of', '/')} ${formatCents(totalLoaded)}`}
                            pct={paidPct}
                          />
                        ) : (
                          <div className="text-[11px] text-muted-foreground">
                            {tx('No credits loaded — add some to activate this key.')}
                          </div>
                        )}
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                          {key.spendCapCents !== null && key.spendCapCents > 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {t(`Cap ${formatCents(key.spendCapCents)}/mo`, `上限 ${formatCents(key.spendCapCents)}/月`)}
                            </span>
                          ) : null}
                          {key.lowBalanceAlert?.enabled ? (
                            <span className="inline-flex items-center gap-1">
                              <Bell className="h-3 w-3" />
                              {t('Alert ≤', '提醒 ≤')}{' '}
                              {formatCents(key.lowBalanceAlert.thresholdCents)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">{tx('Lifetime')}</div>
                      <div className="text-sm font-semibold tabular-nums">
                        {summary.calls.toLocaleString('en-US')}
                      </div>
                      <button
                        type="button"
                        onClick={() => openAddCreditsFor(key.id)}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline underline-offset-4"
                      >
                        <Plus className="h-3 w-3" /> {tx('Credits')}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">{tx('Recent activity')}</h2>
            <Link
              href="/dev-en/dashboard/billing/history"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {tx('View all')} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {tx('No activity yet. Add credits to a key to see them here.')}
            </p>
          ) : (
            <ul className="space-y-3">
              {recent.map((t) => {
                const isCard = t.kind === 'card-added';
                return (
                  <li key={t.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-7 w-7 shrink-0 rounded-md flex items-center justify-center',
                        isCard
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                      )}
                    >
                      {isCard ? (
                        <CreditCard className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">
                        {t.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(t.createdAt)}
                      </p>
                    </div>
                    {!isCard && (
                      <span className="text-xs font-semibold tabular-nums">
                        +{formatCents(t.amountCents)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">{tx('Quick actions')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tx('Common next steps for pay-as-you-go teams.')}
            </p>
          </div>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/dev-en/dashboard/keys"
            title={tx('Create paid key')}
            desc={tx('Spin up a scoped paid key under any project.')}
            icon={Key}
          />
          <QuickAction
            onClick={() => openAddCreditsFor()}
            title={tx('Add credits')}
            desc={tx('Pick a project + key, top up with Stripe.')}
            icon={DollarSign}
          />
          <QuickAction
            href="/dev-en/dashboard/billing#spend-limit"
            title={tx('Review billing')}
            desc={tx('Spend, limit, credit balances per key.')}
            icon={Receipt}
          />
          <QuickAction
            href="/en/docs"
            title={tx('Read the docs')}
            desc={tx('MCP spec, quickstarts, error codes.')}
            icon={BookOpen}
          />
        </div>
      </div>

      {/* Bottom row: pricing quick nav */}
      <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>
            {tx('Need to review rates? Check')}{' '}
            <Link
              href="/dev-en/dashboard/billing/rates"
              className="underline underline-offset-4 text-foreground"
            >
              {tx('pay-as-you-go pricing')}
            </Link>{' '}
            {tx('— volume discounts apply automatically.')}
          </span>
        </div>
        <Link
          href="/dev-en/dashboard/billing/rates"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline underline-offset-4"
        >
          {tx('See pricing')} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <StripeCheckoutModal
        open={addCreditsOpen}
        onClose={() => setAddCreditsOpen(false)}
        mode="add-credits"
        keyId={addCreditsKeyId ?? undefined}
      />
    </div>
  );
}

/**
 * High-contrast upgrade banner shown when the Starter key has burned through
 * all 900 lifetime calls and the account has no funded paid key to fall back
 * to. The CTA branches: if a paid key exists we open the Add-credits modal on
 * that key; otherwise we deep-link to the Keys page to create one.
 */
function StarterExhaustedBanner({
  onAddCredits,
  firstPaidKey,
}: {
  onAddCredits: (keyId?: string) => void;
  firstPaidKey?: ApiKey;
}) {
  const { t, tx } = useLang();
  return (
    <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/[0.07] via-amber-500/[0.04] to-background p-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="h-10 w-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold">
                {tx('Your Starter key is used up')}
              </h3>
              <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                {t('0 / 900 left', '剩余 0 / 900')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tx('The 900 free lifetime calls on your Starter key are now spent. To keep your integrations running, fund a paid key — no subscription, just pay per 1,000 calls with volume discounts.')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {firstPaidKey ? (
            <button
              type="button"
              onClick={() => onAddCredits(firstPaidKey.id)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-background text-sm font-semibold hover:brightness-110"
            >
              <CreditCard className="h-4 w-4" />
              {tx('Add credits')}
            </button>
          ) : (
            <Link
              href="/dev-en/dashboard/keys#create-paid-key"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-foreground text-background text-sm font-semibold hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              {tx('Create paid key')}
            </Link>
          )}
          <Link
            href="/dev-en/dashboard/billing/rates"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-background hover:bg-muted/50 text-sm font-medium"
          >
            {tx('View pricing')}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Thin highlight strip for the starter key. Keeps the freebie visible
 * without dominating the layout. Tap-target links to the Keys page where
 * the full starter card lives.
 */
function StarterKeyStrip({ apiKey }: { apiKey: ApiKey }) {
  const { tx } = useLang();
  const dailyPct = Math.min(
    100,
    (apiKey.freeDailyUsed / Math.max(1, apiKey.freeDailyLimit)) * 100,
  );
  const totalPct = Math.min(
    100,
    (apiKey.freeTotalUsed / Math.max(1, apiKey.freeTotalLimit)) * 100,
  );
  const exhausted = apiKey.freeTotalUsed >= apiKey.freeTotalLimit;
  return (
    <Link
      href="/dev-en/dashboard/keys"
      className="block rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-background hover:from-emerald-500/[0.07] transition-colors"
    >
      <div className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{tx('Starter key')}</span>
              {exhausted ? (
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {tx('Exhausted')}
                </span>
              ) : (
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  {tx('Free · complimentary')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {tx('Included with your account · 30/day · 900 lifetime')}
            </p>
          </div>
        </div>

        <div className="flex-1 min-w-[200px] grid grid-cols-2 gap-4 max-w-lg">
          <MiniQuota
            label={tx('Today')}
            used={apiKey.freeDailyUsed}
            limit={apiKey.freeDailyLimit}
            pct={dailyPct}
          />
          <MiniQuota
            label={tx('Lifetime')}
            used={apiKey.freeTotalUsed}
            limit={apiKey.freeTotalLimit}
            pct={totalPct}
          />
        </div>

        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

function MiniQuota({
  label,
  used,
  limit,
  pct,
}: {
  label: string;
  used: number;
  limit: number;
  pct: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[10px]">
        <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        <span className="tabular-nums text-muted-foreground">
          <span className="font-semibold text-foreground">
            {used.toLocaleString()}
          </span>{' '}
          / {limit.toLocaleString()}
        </span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full transition-all',
            pct >= 90 ? 'bg-amber-500' : 'bg-emerald-500/80',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BalanceBar({
  label,
  text,
  pct,
  className,
}: {
  label: string;
  text: string;
  pct: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{text}</span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full',
            pct >= 90 ? 'bg-amber-500' : 'bg-foreground/70',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  onClick,
  title,
  desc,
  icon: Icon,
  external,
}: {
  href?: string;
  onClick?: () => void;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {desc}
        </p>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
    </div>
  );
  const cls =
    'group rounded-lg border border-border bg-muted/30 hover:bg-muted/50 p-3.5 transition-colors text-left';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {content}
      </button>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href!} className={cls}>
      {content}
    </Link>
  );
}
