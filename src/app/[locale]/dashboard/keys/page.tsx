'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, EyeOff, Copy, RefreshCw, Trash2, X, Check, Info, AlertTriangle, Sparkles, Lock, Headphones, ArrowRight } from 'lucide-react';
import { SALES_CHAT_URL } from '@/lib/links';
import {
  type ApiKeyRecord,
  listKeys,
  createKey as apiCreateKey,
  revealKey as apiRevealKey,
  resetKey as apiResetKey,
  toggleKey as apiToggleKey,
  deleteKey as apiDeleteKey,
  maskApiKey,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return dateStr;
  }
}
import { useAuth } from '@/lib/auth-context';
import { useRouter } from '@/i18n/routing';

export default function KeysPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.isAdmin ?? false;

  const t = {
    title: isZh ? 'API Key 管理' : 'API Key Management',
    subtitle: isZh
      ? '创建后请立即复制完整 Key，之后仅显示脱敏值'
      : 'Copy the full key on creation — afterwards only a masked value is shown',
    createKey: isZh ? '创建 Key' : 'Create Key',
    name: isZh ? '名称' : 'Name',
    status: isZh ? '状态' : 'Status',
    usage: isZh ? '用量 / 额度' : 'Usage / Quota',
    createdAt: isZh ? '创建时间' : 'Created At',
    actions: isZh ? '操作' : 'Actions',
    noData: isZh ? '暂无 API Key，点击上方按钮创建' : 'No API keys yet, click above to create one',
    unlimited: isZh ? '不限' : 'Unlimited',
    noQuota: isZh ? '无配额' : 'No quota',
    noQuotaHint: isZh
      ? '该 Key 暂无可用配额，请联系管理员分配额度后再使用'
      : 'This key has no quota — please ask an admin to allocate before using',
    hide: isZh ? '隐藏' : 'Hide',
    show: isZh ? '显示' : 'Show',
    copy: isZh ? '复制' : 'Copy',
    regenerate: isZh ? '重置' : 'Reset',
    confirm: isZh ? '确认' : 'Confirm',
    cancel: isZh ? '取消' : 'Cancel',
    delete: isZh ? '删除' : 'Delete',
    loading: isZh ? '加载中…' : 'Loading…',
    loadFail: isZh ? '加载失败' : 'Failed to load',
    confirmDeleteTitle: isZh ? '删除 Key' : 'Delete Key',
    confirmDeleteDesc: isZh ? '删除后无法恢复，确认删除该 Key？' : 'This action cannot be undone. Delete this key?',
    confirmResetTitle: isZh ? '重置 Key' : 'Reset Key',
    confirmResetDesc: isZh ? '重置后旧 Key 立即失效，确定继续？' : 'Resetting invalidates the old key immediately. Continue?',
    quotaRulesTitle: isZh ? '配额规则' : 'Quota rules',
    quotaRule1Title: isZh ? '首个 Key · 免费配额' : 'First key · Free quota',
    quotaRule1Body: isZh ? '每日 30 次 / 总量 900 次，创建后立即生效' : '30 / day · 900 total, active immediately on creation',
    quotaRule2Title: isZh ? '后续 Key · 初始无配额' : 'Additional keys · No quota',
    quotaRule2Body: isZh ? '新建的其他 Key 默认不携带额度，需由管理员分配' : 'Additional keys start with 0 quota — an admin must allocate',
    quotaRule3Title: isZh ? '用户端 · 无法修改限额' : 'Limits are read-only',
    quotaRule3Body: isZh ? '出于安全与计费需要，配额仅可由管理员调整' : 'For security and billing reasons, only admins can adjust',
    contactTitle: isZh ? '需要更多配额？' : 'Need more quota?',
    contactDesc: isZh
      ? '联系客服可为指定 Key 充值额度或升级套餐，7×12 小时在线响应。'
      : 'Reach out to support to top up a specific key or upgrade your plan. 7×12h online.',
    contactCta: isZh ? '联系客服充值' : 'Contact support',
  };

  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (isAdmin) router.replace('/dashboard/admin');
  }, [isAdmin, router]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await listKeys();
      setKeys(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function toggleEnabled(id: number) {
    setBusyId(id);
    try {
      const updated = await apiToggleKey(id);
      setKeys(prev => prev.map(k => k.id === id ? { ...k, enabled: updated.enabled } : k));
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  async function toggleReveal(id: number) {
    if (revealed[id]) {
      setRevealed(prev => { const next = { ...prev }; delete next[id]; return next; });
      return;
    }
    try {
      const full = await apiRevealKey(id);
      setRevealed(prev => ({ ...prev, [id]: full }));
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  async function copyKey(id: number) {
    let value = revealed[id];
    if (!value) {
      try { value = await apiRevealKey(id); } catch (err) {
        alert(err instanceof Error ? err.message : String(err));
        return;
      }
    }
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function deleteKey(id: number) {
    setBusyId(id);
    try {
      await apiDeleteKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  async function doResetKey(id: number) {
    setBusyId(id);
    try {
      const updated = await apiResetKey(id);
      setKeys(prev => prev.map(k => k.id === id ? { ...k, ...updated, api_key: maskApiKey(updated.api_key) } : k));
      // 重置后默认仍以省略号展示，用户需要完整 key 时可点眼睛图标或复制按钮按需拉取
      setRevealed(prev => { const next = { ...prev }; delete next[id]; return next; });
      setResetConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  function handleCreated(newKey: ApiKeyRecord) {
    setKeys(prev => [{ ...newKey, api_key: maskApiKey(newKey.api_key) }, ...prev]);
    setShowCreate(false);
  }

  if (isAdmin) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold tracking-[-0.015em]">{t.title}</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{t.subtitle}</p>

      {/* Quota rules card */}
      <div className="mb-6 rounded-2xl border border-border bg-gradient-to-br from-muted/30 via-background to-background overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border/60">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold tracking-tight">{t.quotaRulesTitle}</p>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
          <QuotaRule
            icon={Sparkles}
            tone="emerald"
            title={t.quotaRule1Title}
            body={t.quotaRule1Body}
          />
          <QuotaRule
            icon={AlertTriangle}
            tone="amber"
            title={t.quotaRule2Title}
            body={t.quotaRule2Body}
          />
          <QuotaRule
            icon={Lock}
            tone="slate"
            title={t.quotaRule3Title}
            body={t.quotaRule3Body}
          />
        </div>

        {/* Contact support CTA */}
        <div className="relative px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border-t border-blue-500/20 bg-gradient-to-r from-blue-500/[0.09] via-indigo-500/[0.06] to-transparent dark:from-blue-400/[0.12] dark:via-indigo-400/[0.08]">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/30 ring-2 ring-background">
              <Headphones className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-950 dark:text-blue-100">{t.contactTitle}</p>
              <p className="text-xs text-blue-900/70 dark:text-blue-200/70 mt-0.5 leading-relaxed">{t.contactDesc}</p>
            </div>
          </div>
          <a
            href={SALES_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-medium rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-sm shadow-blue-500/30 transition-all whitespace-nowrap self-start sm:self-auto"
          >
            {t.contactCta}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors mb-6"
      >
        <Plus className="h-4 w-4" />
        {t.createKey}
      </button>

      {loadError && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-2.5">
          {t.loadFail}: {loadError}
        </div>
      )}

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.name}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">API Key</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.status}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.usage}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.createdAt}</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">{t.loading}</td></tr>
              ) : keys.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">{t.noData}</td></tr>
              ) : (
                keys.map(k => {
                  const displayKey = revealed[k.id] || k.api_key;
                  const isRevealed = !!revealed[k.id];
                  const totalLimit = k.total_limit ?? 0;
                  const totalUsed = k.total_used ?? 0;
                  const periodLimit = k.period_limit ?? 0;
                  const periodUsed = k.period_used ?? 0;
                  const hasNoQuota = totalLimit === 0 && periodLimit === 0;
                  const totalPct = totalLimit > 0 ? Math.min(100, Math.round((totalUsed / totalLimit) * 100)) : -1;
                  const periodPct = periodLimit > 0 ? Math.min(100, Math.round((periodUsed / periodLimit) * 100)) : -1;
                  const isNearLimit = totalPct >= 80 || periodPct >= 80;
                  return (
                    <tr
                      key={k.id}
                      className={cn(
                        'transition-colors',
                        !k.enabled && 'opacity-50',
                        hasNoQuota
                          ? 'bg-rose-50/60 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                          : isNearLimit
                            ? 'bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/70 dark:hover:bg-amber-950/20'
                            : 'hover:bg-muted/20'
                      )}
                    >
                      <td className="py-3.5 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'shrink-0 w-1 h-8 rounded-full',
                            hasNoQuota
                              ? 'bg-rose-400'
                              : isNearLimit
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                          )} />
                          {k.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-muted-foreground">{displayKey}</code>
                          <button onClick={() => toggleReveal(k.id)} className="text-muted-foreground hover:text-foreground transition-colors" title={isRevealed ? t.hide : t.show}>
                            {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={() => copyKey(k.id)} className="text-muted-foreground hover:text-foreground transition-colors" title={t.copy}>
                            {copiedId === k.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          disabled={busyId === k.id}
                          onClick={() => toggleEnabled(k.id)}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50',
                            k.enabled ? 'bg-foreground' : 'bg-muted-foreground/30'
                          )}
                        >
                          <span className={cn(
                            'inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform',
                            k.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
                          )} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 min-w-[180px]">
                        {hasNoQuota ? (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                              <span className="font-semibold text-rose-600 dark:text-rose-400">{t.noQuota}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-snug max-w-[180px]">
                              {t.noQuotaHint}
                            </div>
                            <a
                              href={SALES_CHAT_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 h-6 px-2 text-[10px] font-medium rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors whitespace-nowrap w-fit"
                            >
                              <Headphones className="h-3 w-3" />
                              {isZh ? '联系客服充值' : 'Contact support'}
                            </a>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <UsageBar
                              label={isZh ? '总量' : 'Total'}
                              used={totalUsed}
                              limit={totalLimit}
                              pct={totalPct}
                              unlimited={t.unlimited}
                              warn={totalPct >= 80}
                            />
                            <UsageBar
                              label={k.period_type === 'monthly' ? (isZh ? '月' : 'Mon') : (isZh ? '日' : 'Day')}
                              used={periodUsed}
                              limit={periodLimit}
                              pct={periodPct}
                              unlimited={t.unlimited}
                              warn={periodPct >= 80}
                            />
                            {isNearLimit && (
                              <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                                {isZh ? '⚠ 额度即将用尽' : '⚠ Quota almost full'}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs whitespace-nowrap">{formatDateTime(k.created_at)}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setResetConfirm(k.id)} disabled={busyId === k.id} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50" title={t.regenerate}>
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(k.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title={t.delete}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateKeyModal locale={locale} onClose={() => setShowCreate(false)} onCreate={handleCreated} />
      )}
      {deleteConfirm !== null && (
        <ConfirmActionModal
          title={t.confirmDeleteTitle} description={t.confirmDeleteDesc}
          confirmText={t.confirm} cancelText={t.cancel} danger
          loading={busyId === deleteConfirm}
          onCancel={() => setDeleteConfirm(null)} onConfirm={() => deleteKey(deleteConfirm)}
        />
      )}
      {resetConfirm !== null && (
        <ConfirmActionModal
          title={t.confirmResetTitle} description={t.confirmResetDesc}
          confirmText={t.confirm} cancelText={t.cancel}
          loading={busyId === resetConfirm}
          onCancel={() => setResetConfirm(null)} onConfirm={() => doResetKey(resetConfirm)}
        />
      )}
    </div>
  );
}

function UsageBar({ label, used, limit, pct, unlimited, warn }: {
  label: string; used: number; limit: number; pct: number; unlimited: string; warn: boolean;
}) {
  const barColor = pct >= 90
    ? 'bg-rose-500'
    : pct >= 80
      ? 'bg-amber-500'
      : pct >= 50
        ? 'bg-sky-500'
        : 'bg-emerald-500';

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-muted-foreground w-5 shrink-0">{label}</span>
      {pct >= 0 ? (
        <div className="flex-1 flex items-center gap-1.5 min-w-0">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[60px]">
            <div
              className={cn('h-full rounded-full transition-all', barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={cn(
            'text-[10px] tabular-nums whitespace-nowrap shrink-0',
            warn ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-muted-foreground'
          )}>
            {used.toLocaleString()} / {limit.toLocaleString()}
          </span>
        </div>
      ) : (
        <span className="text-[10px] text-muted-foreground tabular-nums">{used} / <span className="opacity-50">{unlimited}</span></span>
      )}
    </div>
  );
}

function CreateKeyModal({
  locale, onClose, onCreate,
}: {
  locale: string; onClose: () => void; onCreate: (key: ApiKeyRecord) => void;
}) {
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '创建 API Key' : 'Create API Key',
    name: isZh ? '名称' : 'Name',
    namePlaceholder: isZh ? '用于标识该 Key 的备注名' : 'A display name for this key',
    quotaTitle: isZh ? '配额自动分配' : 'Quota auto-assignment',
    quotaBody: isZh
      ? '首个 Key：每日 30 次 / 总量 900 次。后续新建的 Key 初始无配额，需联系管理员分配。'
      : 'First key: 30 / day · 900 total. Additional keys start with no quota and require admin allocation.',
    cancel: isZh ? '取消' : 'Cancel',
    create: isZh ? '创建' : 'Create',
    creating: isZh ? '创建中…' : 'Creating…',
    errName: isZh ? '请输入名称' : 'Please enter a name',
  };

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    if (!name.trim()) { setError(t.errName); return; }
    setSubmitting(true);
    try {
      const created = await apiCreateKey({ name: name.trim() });
      onCreate(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell onClose={onClose} title={t.title}>
      {error && <ErrorBanner msg={error} />}
      <div className="mb-5">
        <label className="text-sm font-medium mb-1.5 block">{t.name}</label>
        <input
          type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
          placeholder={t.namePlaceholder}
          autoFocus
          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-6 rounded-xl border border-border bg-muted/20 p-4 flex gap-3">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">{t.quotaTitle}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.quotaBody}</p>
        </div>
      </div>

      <ModalActions
        onCancel={onClose} onConfirm={handleCreate}
        cancelText={t.cancel} confirmText={submitting ? t.creating : t.create}
        disabled={submitting}
      />
    </ModalShell>
  );
}

function ConfirmActionModal({ title, description, confirmText, cancelText, onConfirm, onCancel, loading, danger = false }: {
  title: string; description: string; confirmText: string; cancelText: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean; danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-background rounded-xl border border-border shadow-xl p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6">{description}</p>
        <ModalActions onCancel={onCancel} onConfirm={onConfirm} cancelText={cancelText} confirmText={confirmText} disabled={loading} danger={danger} />
      </div>
    </div>
  );
}

function ModalShell({ children, onClose, title, subtitle }: {
  children: React.ReactNode; onClose: () => void; title: string; subtitle?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background rounded-xl border border-border shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-2.5">{msg}</div>
  );
}

function ModalActions({ onCancel, onConfirm, cancelText, confirmText, disabled, danger = false }: {
  onCancel: () => void; onConfirm: () => void; cancelText: string; confirmText: string; disabled?: boolean; danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button onClick={onCancel} className="h-9 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors">{cancelText}</button>
      <button onClick={onConfirm} disabled={disabled}
        className={cn('h-9 px-4 text-sm font-medium rounded-lg text-background transition-colors disabled:opacity-50',
          danger ? 'bg-destructive hover:bg-destructive/90' : 'bg-foreground hover:bg-foreground/90')}>
        {confirmText}
      </button>
    </div>
  );
}

function QuotaRule({ icon: Icon, tone, title, body }: {
  icon: React.ComponentType<{ className?: string }>;
  tone: 'emerald' | 'amber' | 'slate';
  title: string;
  body: string;
}) {
  const toneStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-slate-500/20',
  }[tone];

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={cn('inline-flex items-center justify-center h-6 w-6 rounded-md', toneStyles)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-semibold tracking-tight">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-8">{body}</p>
    </div>
  );
}
