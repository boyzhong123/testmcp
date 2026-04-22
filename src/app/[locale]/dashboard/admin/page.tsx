'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/lib/auth-context';
import {
  adminListUsers,
  adminListUserKeys,
  adminUpdateKeyLimits,
  adminGetKeyUsage,
  type ApiAdminUser,
  type ApiKeyRecord,
  type ApiKeyUsage,
} from '@/lib/api';
import {
  ShieldCheck, Zap, Users, Search, RefreshCw, X, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle2, Settings2, BarChart3, ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

const FETCH_SIZE = 200;  // 一次性拉取所有用户，客户端做搜索+筛选+分页
const LIST_PAGE_SIZE = 10; // 每页展示条数

export default function AdminPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.isAdmin) router.replace('/dashboard/keys');
  }, [user, router]);

  // ---------- User list ----------
  const [users, setUsers] = useState<ApiAdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'hasKey' | 'noKey' | 'active'>('all');
  const [listPage, setListPage] = useState(1);

  // ---------- Selected user + keys ----------
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userKeys, setUserKeys] = useState<ApiKeyRecord[]>([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysError, setKeysError] = useState('');

  // ---------- Per-key expanded usage ----------
  const [expandedKeyId, setExpandedKeyId] = useState<number | null>(null);
  const [usageMap, setUsageMap] = useState<Record<number, ApiKeyUsage | null>>({});
  const [usageLoading, setUsageLoading] = useState<Record<number, boolean>>({});

  // ---------- Modals ----------
  const [rechargeTarget, setRechargeTarget] = useState<ApiKeyRecord | null>(null);
  const [editLimitsTarget, setEditLimitsTarget] = useState<ApiKeyRecord | null>(null);

  const selectedUser = users.find(u => u.id === selectedUserId) ?? null;

  const refreshUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const data = await adminListUsers({ page: 1, page_size: FETCH_SIZE });
      setUsers(data.users || []);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : String(err));
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => { refreshUsers(); }, [refreshUsers]);

  const refreshUserKeys = useCallback(async (userId: number) => {
    setKeysLoading(true);
    setKeysError('');
    setExpandedKeyId(null);
    setUsageMap({});
    try {
      const keys = await adminListUserKeys(userId);
      setUserKeys(keys);
    } catch (err) {
      setKeysError(err instanceof Error ? err.message : String(err));
      setUserKeys([]);
    } finally {
      setKeysLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUserId !== null) refreshUserKeys(selectedUserId);
    else { setUserKeys([]); setExpandedKeyId(null); }
  }, [selectedUserId, refreshUserKeys]);

  async function toggleExpandKey(id: number) {
    if (expandedKeyId === id) { setExpandedKeyId(null); return; }
    setExpandedKeyId(id);
    if (usageMap[id] !== undefined) return;
    setUsageLoading(prev => ({ ...prev, [id]: true }));
    try {
      const usage = await adminGetKeyUsage(id);
      setUsageMap(prev => ({ ...prev, [id]: usage }));
    } catch {
      setUsageMap(prev => ({ ...prev, [id]: null }));
    } finally {
      setUsageLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  const filteredUsers = useMemo(() => {
    // 只展示普通用户：管理员不需要配额 / 充值
    let list = users.filter(u => u.role !== 'admin');

    // 分类筛选
    if (planFilter === 'hasKey') list = list.filter(u => (u.key_count ?? 0) > 0);
    else if (planFilter === 'noKey') list = list.filter(u => (u.key_count ?? 0) === 0);
    else if (planFilter === 'active') list = list.filter(u => (u.total_used ?? 0) > 0);

    // 关键词搜索（全量）
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(u =>
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q)
    );
    return list;
  }, [users, search, planFilter]);

  // 重置列表页至第 1 页（当筛选或搜索变化时）
  useEffect(() => { setListPage(1); }, [search, planFilter]);

  const totalListPages = Math.max(1, Math.ceil(filteredUsers.length / LIST_PAGE_SIZE));
  const pagedUsers = useMemo(() => {
    const start = (listPage - 1) * LIST_PAGE_SIZE;
    return filteredUsers.slice(start, start + LIST_PAGE_SIZE);
  }, [filteredUsers, listPage]);

  // 各分类用户数（始终基于全量普通用户，不受搜索影响）
  const regularUsers = useMemo(() => users.filter(u => u.role !== 'admin'), [users]);
  const filterCounts = useMemo(() => ({
    all: regularUsers.length,
    hasKey: regularUsers.filter(u => (u.key_count ?? 0) > 0).length,
    noKey: regularUsers.filter(u => (u.key_count ?? 0) === 0).length,
    active: regularUsers.filter(u => (u.total_used ?? 0) > 0).length,
  }), [regularUsers]);

  if (!user?.isAdmin) return null;

  function onKeyUpdated(keyId: number, patch: Partial<ApiKeyRecord>) {
    setUserKeys(prev => prev.map(k => k.id === keyId ? { ...k, ...patch } : k));
    // Invalidate cached usage (limits changed)
    setUsageMap(prev => { const n = { ...prev }; delete n[keyId]; return n; });
  }

  const t = {
    title: isZh ? '管理员控制台' : 'Admin Console',
    subtitle: isZh
      ? '查看所有用户 → 点选用户 → 管理其每个 API Key 的额度与充值'
      : 'Browse users → pick one → manage each API key\'s quota & recharge',
    refresh: isZh ? '刷新' : 'Refresh',
    usersSection: isZh ? '用户列表' : 'Users',
    total: isZh ? '共' : 'Total',
    peopleUnit: isZh ? '位' : '',
    page: isZh ? '第' : 'Page',
    of: isZh ? '/' : '/',
    pageUnit: isZh ? '页' : '',
    searchPlaceholder: isZh ? '按邮箱 / 名称搜索…' : 'Search by email / name…',
    loading: isZh ? '加载中…' : 'Loading…',
    emptyUsers: isZh ? '暂无用户' : 'No users',
    emptyMatch: isZh ? '没有匹配的用户' : 'No matching users',
    filterAll: isZh ? '全部' : 'All',
    filterHasKey: isZh ? '有 Key' : 'Has Keys',
    filterNoKey: isZh ? '无 Key' : 'No Keys',
    filterActive: isZh ? '活跃' : 'Active',
    filterActiveHint: isZh ? '有过调用记录' : 'Has API calls',
    pageOf: (cur: number, tot: number) => isZh ? `${cur} / ${tot} 页` : `${cur} / ${tot}`,
    keyCount: isZh ? '个 Key' : 'keys',
    totalUsedLabel: isZh ? '累计调用' : 'Total used',
    pickUserHint: isZh
      ? '从左侧选择一位用户，查看并管理其 API Key'
      : 'Pick a user on the left to view and manage their API keys',
    keysForUser: isZh ? '的 API Key' : 'API Keys',
    keyCountText: (n: number) => isZh ? `共 ${n} 个` : `${n} keys`,
    emptyKeys: isZh ? '该用户暂无 API Key' : 'This user has no API keys',
    noQuota: isZh ? '无配额' : 'No quota',
    recharge: isZh ? '充值' : 'Recharge',
    editLimits: isZh ? '编辑限额' : 'Edit limits',
    viewUsage: isZh ? '查看用量' : 'Usage',
    chipTotalTooltip: (used: number, limit: number, pct: number) =>
      isZh
        ? `总量上限 ${limit.toLocaleString()} 次\n已用 ${used.toLocaleString()} 次（${pct}%）`
        : `Total limit: ${limit.toLocaleString()} calls\nUsed: ${used.toLocaleString()} (${pct}%)`,
    chipPeriodTooltip: (used: number, limit: number, pct: number, type: string) =>
      isZh
        ? `${type}上限 ${limit.toLocaleString()} 次\n本周期已用 ${used.toLocaleString()} 次（${pct}%）`
        : `${type} limit: ${limit.toLocaleString()} calls\nPeriod used: ${used.toLocaleString()} (${pct}%)`,
    chipNoQuotaTooltip: isZh ? '该 Key 暂无可用额度，点击「充值」按钮为其分配配额' : 'No quota allocated — click Recharge to top up this key',
    daily: isZh ? '日' : 'Day',
    monthly: isZh ? '月' : 'Mo',
    unlimited: isZh ? '不限' : 'Unlimited',
    prevPage: isZh ? '上一页' : 'Prev',
    nextPage: isZh ? '下一页' : 'Next',
  };

  return (
    <div className="max-w-6xl">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.015em]">{t.title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t.subtitle}</p>
        </div>
        <button
          onClick={() => refreshUsers()}
          className="ml-auto h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={t.refresh}
        >
          <RefreshCw className={cn('h-3.5 w-3.5', usersLoading && 'animate-spin')} />
        </button>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-5">
        {/* Users panel */}
        <section className="rounded-xl border border-border bg-background flex flex-col max-h-[calc(100dvh-180px)]">
          <div className="px-4 pt-4 pb-3 border-b border-border space-y-2.5">
            {/* Header row */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">{t.usersSection}</h2>
              <span className="text-xs text-muted-foreground ml-auto">
                {t.total} {filteredUsers.length} {t.peopleUnit}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-9 pl-8 pr-8 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-foreground/30 transition-colors placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 -mx-0.5 px-0.5">
              {(
                [
                  { key: 'all', label: t.filterAll, count: filterCounts.all },
                  { key: 'hasKey', label: t.filterHasKey, count: filterCounts.hasKey },
                  { key: 'noKey', label: t.filterNoKey, count: filterCounts.noKey },
                  { key: 'active', label: t.filterActive, count: filterCounts.active },
                ] as const
              ).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setPlanFilter(tab.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors',
                    planFilter === tab.key
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    'inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-sm text-[10px] tabular-nums',
                    planFilter === tab.key
                      ? 'bg-background/20 text-background'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {usersError ? (
              <div className="px-4 py-6 text-sm text-destructive">{usersError}</div>
            ) : usersLoading ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">{t.loading}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                {regularUsers.length === 0 ? t.emptyUsers : t.emptyMatch}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pagedUsers.map(u => {
                  const active = u.id === selectedUserId;
                  const hasActivity = (u.total_used ?? 0) > 0;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={cn(
                        'relative w-full text-left pl-5 pr-4 py-3 transition-all',
                        active
                          ? 'bg-gradient-to-r from-primary/10 via-primary/[0.04] to-transparent shadow-[inset_0_0_0_1px] shadow-primary/20'
                          : 'hover:bg-muted/40'
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                      )}
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn(
                          'text-sm truncate',
                          active ? 'font-semibold text-foreground' : 'font-medium'
                        )}>
                          {u.name}
                        </span>
                        {hasActivity && (
                          <span className="inline-flex items-center h-4 px-1.5 text-[9px] rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap">
                            {t.filterActive}
                          </span>
                        )}
                        {(u.key_count ?? 0) === 0 && (
                          <span className="inline-flex items-center h-4 px-1.5 text-[9px] rounded-full bg-muted text-muted-foreground font-semibold whitespace-nowrap">
                            {t.filterNoKey}
                          </span>
                        )}
                        {active && (
                          <ChevronRight className="ml-auto h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      <div className={cn(
                        'text-xs truncate',
                        active ? 'text-foreground/70' : 'text-muted-foreground'
                      )}>
                        {u.email}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                        <span><span className="tabular-nums font-medium">{u.key_count}</span> {t.keyCount}</span>
                        <span>·</span>
                        <span>
                          {t.totalUsedLabel}: <span className="tabular-nums font-medium">{u.total_used.toLocaleString()}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="border-t border-border px-3 py-2 flex items-center justify-between">
            <button
              disabled={listPage <= 1}
              onClick={() => setListPage(p => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 h-7 px-2 rounded-md hover:bg-muted disabled:opacity-30 transition-colors text-muted-foreground text-xs"
            >
              <ChevronLeft className="h-3 w-3" /> {t.prevPage}
            </button>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {t.pageOf(listPage, totalListPages)}
            </span>
            <button
              disabled={listPage >= totalListPages}
              onClick={() => setListPage(p => Math.min(totalListPages, p + 1))}
              className="inline-flex items-center gap-1 h-7 px-2 rounded-md hover:bg-muted disabled:opacity-30 transition-colors text-muted-foreground text-xs"
            >
              {t.nextPage} <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </section>

        {/* Keys panel */}
        <section>
          {!selectedUser ? (
            <div className="rounded-xl border border-dashed border-border py-20 text-center">
              <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t.pickUserHint}</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold truncate">
                    {selectedUser.name} · {selectedUser.email}
                    {selectedUser.role === 'admin' && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold align-middle">
                        <Shield className="h-2.5 w-2.5" /> admin
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t.keyCountText(userKeys.length)}
                  </p>
                </div>
                <button
                  onClick={() => selectedUserId && refreshUserKeys(selectedUserId)}
                  className="ml-auto h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={t.refresh}
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', keysLoading && 'animate-spin')} />
                </button>
              </div>

              {keysError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm px-4 py-3">{keysError}</div>
              ) : keysLoading ? (
                <div className="rounded-xl border border-border bg-background py-12 text-center text-sm text-muted-foreground">{t.loading}</div>
              ) : userKeys.length === 0 ? (
                <div className="rounded-xl border border-border bg-background py-12 text-center text-sm text-muted-foreground">{t.emptyKeys}</div>
              ) : (
                <div className="rounded-xl border border-border bg-background overflow-hidden divide-y divide-border">
                  {userKeys.map(k => {
                    const isExpanded = expandedKeyId === k.id;
                    const loadingUsage = !!usageLoading[k.id];
                    const usage = usageMap[k.id];
                    const totalLimit = k.total_limit ?? 0;
                    const totalUsed = k.total_used ?? 0;
                    const periodLimit = k.period_limit ?? 0;
                    const periodUsed = k.period_used ?? 0;
                    const noQuota = totalLimit === 0 && periodLimit === 0;
                    const totalPct = totalLimit > 0 ? Math.min(100, Math.round((totalUsed / totalLimit) * 100)) : 0;
                    const periodPct = periodLimit > 0 ? Math.min(100, Math.round((periodUsed / periodLimit) * 100)) : 0;
                    const nearLimit = !noQuota && (totalPct >= 80 || periodPct >= 80);

                    return (
                      <div key={k.id} className={cn(
                        'border-l-4 transition-colors',
                        noQuota
                          ? 'border-l-rose-400 bg-rose-50/40 dark:bg-rose-950/10'
                          : nearLimit
                            ? 'border-l-amber-400 bg-amber-50/20 dark:bg-amber-950/10'
                            : 'border-l-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/5'
                      )}>
                        <div className="flex items-center gap-3 px-4 py-3.5">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">#{k.id}</span>

                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpandKey(k.id)}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium truncate">{k.name}</span>
                              <span className={cn(
                                'text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0',
                                k.enabled
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-muted text-muted-foreground'
                              )}>
                                {k.enabled ? (isZh ? '启用' : 'Active') : (isZh ? '禁用' : 'Off')}
                              </span>
                              {noQuota ? (
                                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold shrink-0">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                                  {t.noQuota}
                                </span>
                              ) : nearLimit ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium shrink-0">
                                  {isZh ? '⚠ 额度告急' : '⚠ Low quota'}
                                </span>
                              ) : null}
                            </div>
                            <code className="text-[10px] text-muted-foreground font-mono">
                              {k.api_key}
                            </code>
                          </div>

                          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                            {noQuota ? (
                              <span className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                                {isZh ? '无配额' : 'No quota'}
                              </span>
                            ) : (
                              <>
                                <MiniQuotaBar
                                  label={isZh ? '总' : 'Total'}
                                  used={totalUsed}
                                  limit={totalLimit}
                                  pct={totalPct}
                                  tooltip={t.chipTotalTooltip(totalUsed, totalLimit, totalPct)}
                                />
                                <MiniQuotaBar
                                  label={k.period_type === 'monthly' ? t.monthly : t.daily}
                                  used={periodUsed}
                                  limit={periodLimit}
                                  pct={periodPct}
                                  tooltip={t.chipPeriodTooltip(
                                    periodUsed, periodLimit, periodPct,
                                    k.period_type === 'monthly' ? (isZh ? '月' : 'Monthly') : (isZh ? '日' : 'Daily'),
                                  )}
                                />
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => setRechargeTarget(k)}
                            className="shrink-0 h-8 px-3 flex items-center gap-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-200 dark:border-amber-800 transition-colors"
                            title={t.recharge}
                          >
                            <Zap className="h-3 w-3" />
                            {t.recharge}
                          </button>

                          <button
                            onClick={() => setEditLimitsTarget(k)}
                            className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title={t.editLimits}
                          >
                            <Settings2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => toggleExpandKey(k.id)}
                            className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title={t.viewUsage}
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-border/50 bg-muted/5">
                            {loadingUsage ? (
                              <p className="text-xs text-muted-foreground py-6 text-center">{t.loading}</p>
                            ) : usage ? (
                              <div className="px-5 py-4">
                                {/* KPI 行 */}
                                <div className="grid grid-cols-4 gap-3 mb-5">
                                  {[
                                    {
                                      label: isZh ? '累计调用' : 'Total used',
                                      value: usage.total_used.toLocaleString(),
                                      sub: `/ ${usage.total_limit === 0 ? (isZh ? '无配额' : 'no quota') : usage.total_limit.toLocaleString()}`,
                                      pct: usage.total_limit > 0 ? Math.round((usage.total_used / usage.total_limit) * 100) : -1,
                                    },
                                    {
                                      label: usage.period_type === 'monthly' ? (isZh ? '本月调用' : 'Month') : (isZh ? '今日调用' : 'Today'),
                                      value: usage.period_used.toLocaleString(),
                                      sub: `/ ${usage.period_limit === 0 ? (isZh ? '无配额' : 'no quota') : usage.period_limit.toLocaleString()}`,
                                      pct: usage.period_limit > 0 ? Math.round((usage.period_used / usage.period_limit) * 100) : -1,
                                    },
                                    {
                                      label: isZh ? '总量剩余' : 'Remaining',
                                      value: usage.total_limit === 0 ? '—' : Math.max(0, usage.total_limit - usage.total_used).toLocaleString(),
                                      sub: usage.total_limit > 0 ? `${Math.round(((usage.total_limit - usage.total_used) / usage.total_limit) * 100)}%` : '',
                                      pct: -1,
                                    },
                                    {
                                      label: isZh ? '有记录天数' : 'Active days',
                                      value: usage.daily_breakdown.filter(d => d.count > 0).length.toString(),
                                      sub: `/ ${usage.daily_breakdown.length}`,
                                      pct: -1,
                                    },
                                  ].map((item, i) => (
                                    <div key={i} className="rounded-lg bg-background border border-border/60 px-3 py-2.5">
                                      <p className="text-[10px] text-muted-foreground mb-1">{item.label}</p>
                                      <div className="flex items-baseline gap-1">
                                        <span className={cn(
                                          'text-lg font-bold tabular-nums',
                                          item.pct >= 80 && 'text-amber-600 dark:text-amber-400'
                                        )}>{item.value}</span>
                                        {item.sub && <span className="text-[10px] text-muted-foreground">{item.sub}</span>}
                                      </div>
                                      {item.pct >= 0 && (
                                        <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                                          <div
                                            className={cn(
                                              'h-full rounded-full',
                                              item.pct >= 90 ? 'bg-rose-500'
                                                : item.pct >= 80 ? 'bg-amber-500'
                                                  : 'bg-emerald-500'
                                            )}
                                            style={{ width: `${Math.min(item.pct, 100)}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* 每日调用柱图 */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-[11px] font-medium text-muted-foreground">
                                      {isZh ? '每日调用量' : 'Daily calls'}
                                      {usage.daily_breakdown.length > 0 && (
                                        <span className="ml-1.5 opacity-60">
                                          {usage.daily_breakdown[0]?.date} ~ {usage.daily_breakdown[usage.daily_breakdown.length - 1]?.date}
                                        </span>
                                      )}
                                    </p>
                                    {usage.daily_breakdown.length > 0 && (
                                      <span className="text-[10px] text-muted-foreground">
                                        {isZh ? '峰值' : 'Peak'}: {Math.max(...usage.daily_breakdown.map(d => d.count)).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  {usage.daily_breakdown.length === 0 ? (
                                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">
                                      {isZh ? '暂无调用记录' : 'No call records yet'}
                                    </div>
                                  ) : (
                                    <div className="flex items-end gap-1 h-28">
                                      {usage.daily_breakdown.slice(-30).map(d => {
                                        const max = Math.max(...usage.daily_breakdown.map(x => x.count), 1);
                                        const pct = (d.count / max) * 100;
                                        const isToday = d.date === new Date().toISOString().slice(0, 10);
                                        return (
                                          <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group min-w-0">
                                            <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                                              {d.count}
                                            </span>
                                            <div
                                              className={cn(
                                                'w-full rounded-t transition-colors min-h-[2px]',
                                                isToday
                                                  ? 'bg-indigo-500 hover:bg-indigo-400'
                                                  : 'bg-sky-500/70 hover:bg-sky-500'
                                              )}
                                              style={{ height: `${pct}%` }}
                                              title={`${d.date}: ${d.count}`}
                                            />
                                            <span className="text-[8px] text-muted-foreground tabular-nums hidden sm:block">
                                              {d.date.slice(5)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  {usage.daily_breakdown.length > 0 && (
                                    <p className="mt-2 text-[10px] text-muted-foreground text-right">
                                      {isZh ? '今日柱为蓝紫色，hover 查看具体数值' : 'Today\'s bar is indigo; hover bars for exact counts'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground px-5 py-4">{isZh ? '暂无数据' : 'No data'}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {rechargeTarget && (
        <RechargeModal
          locale={locale}
          keyRecord={rechargeTarget}
          onClose={() => setRechargeTarget(null)}
          onDone={(patch) => { onKeyUpdated(rechargeTarget.id, patch); setRechargeTarget(null); }}
        />
      )}
      {editLimitsTarget && (
        <EditLimitsModal
          locale={locale}
          keyRecord={editLimitsTarget}
          onClose={() => setEditLimitsTarget(null)}
          onDone={(patch) => { onKeyUpdated(editLimitsTarget.id, patch); setEditLimitsTarget(null); }}
        />
      )}
    </div>
  );
}

// ---------- Small UI bits ----------

function UsageChip({ label, used, limit, tooltip }: {
  label: string; used: number; limit: number; tooltip?: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : -1;
  const noQuota = limit === 0;
  return (
    <div className="relative group text-right cursor-default">
      <div className="text-[10px] opacity-60 mb-0.5">{label}</div>
      <span className={cn(
        'font-medium tabular-nums',
        noQuota && 'text-amber-600 dark:text-amber-400',
        !noQuota && pct >= 80 && 'text-amber-600 dark:text-amber-400'
      )}>
        {used.toLocaleString()}
        <span className="opacity-50">/{noQuota ? '0' : limit.toLocaleString()}</span>
      </span>
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 z-20
          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-150 ease-out">
          <div className="bg-foreground text-background text-[11px] leading-relaxed
            px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap max-w-[200px] text-right">
            {tooltip}
          </div>
          <div className="absolute right-3 top-full w-0 h-0
            border-x-4 border-x-transparent border-t-4 border-t-foreground" />
        </div>
      )}
    </div>
  );
}

function UsageBar({ label, used, limit, unlimited: _unlimited }: { label: string; used: number; limit: number; unlimited: string }) {
  void _unlimited;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : -1;
  const warn = pct >= 80;
  const noQuota = limit === 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          'tabular-nums font-medium',
          noQuota && 'text-amber-600 dark:text-amber-400',
          !noQuota && warn && 'text-amber-600 dark:text-amber-400'
        )}>
          {used.toLocaleString()} / {noQuota ? '0' : limit.toLocaleString()}
          {pct >= 0 && <span className="ml-1 opacity-60">({pct}%)</span>}
        </span>
      </div>
      {pct >= 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full', warn ? 'bg-amber-500' : 'bg-foreground/50')} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

// ---------- Recharge modal: adds N calls to total_limit (admin-only) ----------

function RechargeModal({ locale, keyRecord, onClose, onDone }: {
  locale: string;
  keyRecord: ApiKeyRecord;
  onClose: () => void;
  onDone: (patch: Partial<ApiKeyRecord>) => void;
}) {
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '充值' : 'Recharge',
    subtitle: isZh ? '追加可用次数至该 Key 的总量上限' : 'Add calls to this key\'s total limit',
    currentTotal: isZh ? '当前总量上限' : 'Current total limit',
    noQuota: isZh ? '0（无配额）' : '0 (no quota)',
    amount: isZh ? '追加次数（≥ 1）' : 'Amount (≥ 1)',
    after: isZh ? '充值后' : 'After',
    period: isZh ? '周期上限保持不变' : 'Period limit unchanged',
    cancel: isZh ? '取消' : 'Cancel',
    confirm: isZh ? '确认充值' : 'Confirm',
    confirming: isZh ? '充值中…' : 'Processing…',
    errAmount: isZh ? '请输入有效的追加次数（≥1）' : 'Please enter a valid amount (≥1)',
    success: (n: number) => isZh ? `已追加 ${n} 次` : `Added ${n} calls`,
  };

  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const amountNum = parseInt(amount) || 0;
  const currentTotal = keyRecord.total_limit ?? 0;
  const afterTotal = currentTotal + amountNum;
  // 兼容老数据：period_type 可能为空字符串，统一 fallback 到 'daily'，
  // 避免把空串传给后端触发 required 校验。
  const periodType: 'daily' | 'monthly' =
    keyRecord.period_type === 'monthly' ? 'monthly' : 'daily';
  const periodLimit = keyRecord.period_limit ?? 0;

  async function submit() {
    if (amountNum < 1) { setMsg({ type: 'err', text: t.errAmount }); return; }
    setSubmitting(true);
    setMsg(null);
    try {
      await adminUpdateKeyLimits(keyRecord.id, {
        total_limit: afterTotal,
        period_limit: periodLimit,
        period_type: periodType,
      });
      onDone({ total_limit: afterTotal, period_limit: periodLimit, period_type: periodType });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : String(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell onClose={onClose} title={t.title} subtitle={`${keyRecord.name} · ${t.subtitle}`}>
      <div className="mb-4 px-4 py-3 rounded-lg bg-muted/40 border border-border text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-muted-foreground">{t.currentTotal}：</span>
        <span className={cn(
          'font-medium tabular-nums',
          currentTotal === 0 && 'text-amber-600 dark:text-amber-400'
        )}>
          {currentTotal === 0 ? t.noQuota : currentTotal.toLocaleString()}
        </span>
        {amountNum >= 1 && (
          <span className="text-emerald-600 dark:text-emerald-400 text-xs">
            → {afterTotal.toLocaleString()} (+{amountNum.toLocaleString()})
          </span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground mb-4">{t.period}</p>
      <div className="mb-5">
        <label className="text-xs font-medium mb-1.5 block">{t.amount}</label>
        <input
          type="number" min={1}
          value={amount}
          onChange={e => { setAmount(e.target.value); setMsg(null); }}
          placeholder="e.g. 1000"
          autoFocus
          className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors tabular-nums placeholder:text-muted-foreground"
        />
      </div>

      {msg && (
        <div className={cn(
          'mb-4 flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs',
          msg.type === 'ok'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        )}>
          {msg.type === 'ok'
            ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            : <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button onClick={onClose} className="h-9 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors">
          {t.cancel}
        </button>
        <button onClick={submit} disabled={submitting}
          className="h-9 px-4 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5" />
          {submitting ? t.confirming : t.confirm}
        </button>
      </div>
    </ModalShell>
  );
}

// ---------- Edit Limits modal: full control over total/period/type ----------

function EditLimitsModal({ locale, keyRecord, onClose, onDone }: {
  locale: string;
  keyRecord: ApiKeyRecord;
  onClose: () => void;
  onDone: (patch: Partial<ApiKeyRecord>) => void;
}) {
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '编辑限额' : 'Edit Limits',
    subtitle: isZh ? '配置该 Key 的调用次数上限' : 'Configure call quota for this key',
    totalLimit: isZh ? '总量上限（次）' : 'Total Limit (calls)',
    periodLimit: isZh ? '周期上限（次）' : 'Period Limit (calls)',
    periodType: isZh ? '周期类型' : 'Period Type',
    daily: isZh ? '每日' : 'Daily',
    monthly: isZh ? '每月' : 'Monthly',
    zeroHint: isZh ? '0 表示无配额，该 Key 将无法调用' : '0 means no quota — this key cannot be used',
    cancel: isZh ? '取消' : 'Cancel',
    save: isZh ? '保存' : 'Save',
    saving: isZh ? '保存中…' : 'Saving…',
  };

  const [totalLimit, setTotalLimit] = useState(String(keyRecord.total_limit ?? 0));
  const [periodLimit, setPeriodLimit] = useState(String(keyRecord.period_limit ?? 0));
  const [periodType, setPeriodType] = useState<'daily' | 'monthly'>(
    keyRecord.period_type === 'monthly' ? 'monthly' : 'daily'
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function save() {
    const total = Math.max(0, parseInt(totalLimit) || 0);
    const period = Math.max(0, parseInt(periodLimit) || 0);
    setSubmitting(true);
    setError('');
    try {
      await adminUpdateKeyLimits(keyRecord.id, { total_limit: total, period_limit: period, period_type: periodType });
      onDone({ total_limit: total, period_limit: period, period_type: periodType });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell onClose={onClose} title={t.title} subtitle={`${keyRecord.name} · ${t.subtitle}`}>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-2.5">{error}</div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-1.5 block">{t.totalLimit}</label>
          <input
            type="number" min={0}
            value={totalLimit}
            onChange={e => { setTotalLimit(e.target.value); setError(''); }}
            className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors tabular-nums"
          />
          <p className="text-[11px] text-muted-foreground mt-1">{t.zeroHint}</p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">{t.periodLimit}</label>
          <input
            type="number" min={0}
            value={periodLimit}
            onChange={e => { setPeriodLimit(e.target.value); setError(''); }}
            className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors tabular-nums"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">{t.periodType}</label>
          <div className="flex gap-2">
            {(['daily', 'monthly'] as const).map(v => (
              <button
                key={v}
                onClick={() => setPeriodType(v)}
                className={cn(
                  'h-9 px-4 text-sm rounded-lg border transition-colors',
                  periodType === v ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
                )}
              >
                {v === 'daily' ? t.daily : t.monthly}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={onClose} className="h-9 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors">
          {t.cancel}
        </button>
        <button onClick={save} disabled={submitting}
          className="h-9 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50">
          {submitting ? t.saving : t.save}
        </button>
      </div>
    </ModalShell>
  );
}

// ---------- Mini quota progress bar (admin key list) ----------

function MiniQuotaBar({ label, used, limit, pct, tooltip }: {
  label: string; used: number; limit: number; pct: number; tooltip?: string;
}) {
  const warn = pct >= 80;
  const barColor = pct >= 90
    ? 'bg-rose-500'
    : pct >= 80
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="relative group cursor-default w-20">
      <div className="flex items-center justify-between mb-1 text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('tabular-nums font-medium', warn && 'text-amber-600 dark:text-amber-400')}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="text-[9px] text-muted-foreground mt-0.5 tabular-nums">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </div>
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 z-20
          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-150 ease-out">
          <div className="bg-foreground text-background text-[11px] leading-relaxed
            px-2.5 py-1.5 rounded-lg shadow-lg whitespace-pre-line max-w-[200px]">
            {tooltip}
          </div>
          <div className="absolute right-4 top-full w-0 h-0
            border-x-4 border-x-transparent border-t-4 border-t-foreground" />
        </div>
      )}
    </div>
  );
}

// ---------- Shared modal shell ----------

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
