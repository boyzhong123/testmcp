'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Eye, EyeOff, Copy, Pencil, RefreshCw, Trash2, X, Check } from 'lucide-react';
import { EVAL_TYPES } from '@/lib/mock-data';
import {
  type ApiKeyRecord,
  type ApiCoreType,
  listKeys,
  createKey as apiCreateKey,
  revealKey as apiRevealKey,
  resetKey as apiResetKey,
  toggleKey as apiToggleKey,
  deleteKey as apiDeleteKey,
  listCoreTypes,
  updateKeyCoreTypes,
} from '@/lib/api';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function KeysPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? 'API Key 管理' : 'API Key Management',
    createKey: isZh ? '创建 Key' : 'Create Key',
    name: isZh ? '名称' : 'Name',
    apiKey: 'API Key',
    status: isZh ? '状态' : 'Status',
    evalTypes: isZh ? '评测类型' : 'Eval Types',
    createdAt: isZh ? '创建时间' : 'Created At',
    actions: isZh ? '操作' : 'Actions',
    noData: isZh ? '暂无 API Key，点击上方按钮创建' : 'No API keys yet, click above to create one',
    hide: isZh ? '隐藏' : 'Hide',
    show: isZh ? '显示' : 'Show',
    copy: isZh ? '复制' : 'Copy',
    regenerate: isZh ? '重置' : 'Reset',
    confirm: isZh ? '确认' : 'Confirm',
    cancel: isZh ? '取消' : 'Cancel',
    delete: isZh ? '删除' : 'Delete',
    loading: isZh ? '加载中…' : 'Loading…',
    loadFail: isZh ? '加载失败' : 'Failed to load',
    confirmReset: isZh ? '重置后旧 Key 立即失效，确定继续？' : 'Resetting invalidates the old key immediately. Continue?',
    confirmDeleteTitle: isZh ? '删除 Key' : 'Delete Key',
    confirmDeleteDesc: isZh ? '删除后无法恢复，确认删除该 Key？' : 'This action cannot be undone. Delete this key?',
    confirmResetTitle: isZh ? '重置 Key' : 'Reset Key',
    confirmResetDesc: isZh ? '重置后旧 Key 立即失效，确定继续？' : 'Resetting invalidates the old key immediately. Continue?',
  };

  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editKey, setEditKey] = useState<ApiKeyRecord | null>(null);
  const [revealed, setRevealed] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

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
      setRevealed(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
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

  async function resetKey(id: number) {
    setBusyId(id);
    try {
      const updated = await apiResetKey(id);
      setKeys(prev => prev.map(k => k.id === id ? updated : k));
      setRevealed(prev => ({ ...prev, [id]: updated.api_key }));
      setResetConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  }

  function handleCoreTypesUpdated(id: number, core_types: string[]) {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, core_types } : k));
    setEditKey(null);
  }

  function handleCreated(newKey: ApiKeyRecord) {
    setKeys(prev => [newKey, ...prev]);
    setRevealed(prev => ({ ...prev, [newKey.id]: newKey.api_key }));
    setShowCreate(false);
  }

  const evalTypeMap = Object.fromEntries(EVAL_TYPES.map(t => [t.id, t.name]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-[-0.015em]">{t.title}</h1>
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
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.evalTypes}</th>
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
                  return (
                    <tr
                      key={k.id}
                      className={cn('hover:bg-muted/20 transition-colors', !k.enabled && 'bg-muted/20 opacity-60')}
                    >
                      <td className="py-3.5 px-4 font-medium">{k.name}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-muted-foreground">{displayKey}</code>
                          <button
                            onClick={() => toggleReveal(k.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title={isRevealed ? t.hide : t.show}
                          >
                            {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => copyKey(k.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title={t.copy}
                          >
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
                          <span
                            className={cn(
                              'inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform',
                              k.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
                            )}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {k.core_types.map(ct => (
                            <span
                              key={ct}
                              title={evalTypeMap[ct] || ct}
                              className="inline-block whitespace-nowrap text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60"
                            >
                              <span className="sm:hidden">{(evalTypeMap[ct] || ct).slice(0, 3)}</span>
                              <span className="hidden sm:inline">{evalTypeMap[ct] || ct}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs whitespace-nowrap">
                        {k.created_at}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditKey(k)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title={isZh ? '编辑权限' : 'Edit permissions'}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setResetConfirm(k.id)}
                            disabled={busyId === k.id}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                            title={t.regenerate}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(k.id)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title={t.delete}
                          >
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
        <CreateKeyModal
          locale={locale}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreated}
        />
      )}

      {editKey && (
        <EditCoreTypesModal
          locale={locale}
          keyRecord={editKey}
          onClose={() => setEditKey(null)}
          onSaved={handleCoreTypesUpdated}
        />
      )}

      {deleteConfirm !== null && (
        <ConfirmActionModal
          title={t.confirmDeleteTitle}
          description={t.confirmDeleteDesc}
          confirmText={t.confirm}
          cancelText={t.cancel}
          danger
          loading={busyId === deleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => deleteKey(deleteConfirm)}
        />
      )}

      {resetConfirm !== null && (
        <ConfirmActionModal
          title={t.confirmResetTitle}
          description={t.confirmResetDesc}
          confirmText={t.confirm}
          cancelText={t.cancel}
          loading={busyId === resetConfirm}
          onCancel={() => setResetConfirm(null)}
          onConfirm={() => resetKey(resetConfirm)}
        />
      )}
    </div>
  );
}

function EditCoreTypesModal({
  locale,
  keyRecord,
  onClose,
  onSaved,
}: {
  locale: string;
  keyRecord: ApiKeyRecord;
  onClose: () => void;
  onSaved: (id: number, core_types: string[]) => void;
}) {
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '编辑评测权限' : 'Edit Permissions',
    subtitle: isZh ? '选择该 Key 可调用的评测类型' : 'Select which eval types this key can use',
    evalTypes: isZh ? '评测类型' : 'Eval Types',
    selectAll: isZh ? '全选全部' : 'Select all',
    englishZone: isZh ? '英文评测' : 'English eval',
    chineseZone: isZh ? '中文评测' : 'Chinese eval',
    selectEnglish: isZh ? '全选英文' : 'Select English',
    selectChinese: isZh ? '全选中文' : 'Select Chinese',
    selectedCount: (n: number, total: number) => (isZh ? `已选 ${n}/${total}` : `${n}/${total} selected`),
    cancel: isZh ? '取消' : 'Cancel',
    save: isZh ? '保存' : 'Save',
    saving: isZh ? '保存中…' : 'Saving…',
    errTypes: isZh ? '请至少选择一种评测类型' : 'Please select at least one eval type',
  };

  const [selected, setSelected] = useState<Set<string>>(new Set(keyRecord.core_types));
  const [options, setOptions] = useState<ApiCoreType[]>(
    EVAL_TYPES.map(e => ({ value: e.id, label: e.name })),
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const selectEnRef = useRef<HTMLInputElement | null>(null);
  const selectCnRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    listCoreTypes()
      .then(list => { if (list.length) setOptions(list); })
      .catch(() => {});
  }, []);

  const allValues = useMemo(() => options.map(opt => opt.value), [options]);
  const enValues = useMemo(
    () => options.filter(opt => opt.value.startsWith('en.')).map(opt => opt.value),
    [options],
  );
  const cnValues = useMemo(
    () => options.filter(opt => opt.value.startsWith('cn.')).map(opt => opt.value),
    [options],
  );

  function getGroupState(values: string[]) {
    if (values.length === 0) return { checked: false, indeterminate: false };
    const selectedCount = values.filter(v => selected.has(v)).length;
    return {
      checked: selectedCount > 0 && selectedCount === values.length,
      indeterminate: selectedCount > 0 && selectedCount < values.length,
    };
  }

  const allState = getGroupState(allValues);
  const enState = getGroupState(enValues);
  const cnState = getGroupState(cnValues);
  const selectedEnCount = enValues.filter(v => selected.has(v)).length;
  const selectedCnCount = cnValues.filter(v => selected.has(v)).length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = allState.indeterminate;
    if (selectEnRef.current) selectEnRef.current.indeterminate = enState.indeterminate;
    if (selectCnRef.current) selectCnRef.current.indeterminate = cnState.indeterminate;
  }, [allState.indeterminate, enState.indeterminate, cnState.indeterminate]);

  function toggleType(value: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }

  function toggleGroup(values: string[], checked: boolean) {
    setSelected(prev => {
      const next = new Set(prev);
      values.forEach(value => {
        if (checked) next.add(value);
        else next.delete(value);
      });
      return next;
    });
    setError('');
  }

  async function handleSave() {
    if (selected.size === 0) { setError(t.errTypes); return; }
    setSubmitting(true);
    try {
      const newTypes = Array.from(selected);
      await updateKeyCoreTypes(keyRecord.id, newTypes);
      onSaved(keyRecord.id, newTypes);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background rounded-xl border border-border shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          <span className="font-medium text-foreground">{keyRecord.name}</span>
          {' · '}
          {t.subtitle}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allState.checked}
                onChange={(e) => toggleGroup(allValues, e.target.checked)}
                className="h-4 w-4 rounded border-border accent-foreground"
              />
              <span>{t.selectAll}</span>
            </label>
            <span className="text-xs text-muted-foreground">{t.selectedCount(selected.size, allValues.length)}</span>
          </div>

          <section className="rounded-xl border border-border bg-background p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{t.englishZone}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.selectedCount(selectedEnCount, enValues.length)}</p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                <input
                  ref={selectEnRef}
                  type="checkbox"
                  checked={enState.checked}
                  onChange={(e) => toggleGroup(enValues, e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-foreground"
                />
                <span>{t.selectEnglish}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.filter(opt => opt.value.startsWith('en.')).map(opt => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors',
                    selected.has(opt.value)
                      ? 'border-foreground/30 bg-muted/50'
                      : 'border-border hover:border-border/80 hover:bg-muted/20'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(opt.value)}
                    onChange={() => { toggleType(opt.value); setError(''); }}
                    className="h-4 w-4 rounded border-border accent-foreground"
                  />
                  <span className="whitespace-nowrap text-[11px] sm:text-xs" title={opt.label}>
                    <span className="sm:hidden">{opt.label.slice(0, 3)}</span>
                    <span className="hidden sm:inline">{opt.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{t.chineseZone}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.selectedCount(selectedCnCount, cnValues.length)}</p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                <input
                  ref={selectCnRef}
                  type="checkbox"
                  checked={cnState.checked}
                  onChange={(e) => toggleGroup(cnValues, e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-foreground"
                />
                <span>{t.selectChinese}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.filter(opt => opt.value.startsWith('cn.')).map(opt => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors',
                    selected.has(opt.value)
                      ? 'border-foreground/30 bg-muted/50'
                      : 'border-border hover:border-border/80 hover:bg-muted/20'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(opt.value)}
                    onChange={() => { toggleType(opt.value); setError(''); }}
                    className="h-4 w-4 rounded border-border accent-foreground"
                  />
                  <span className="whitespace-nowrap text-[11px] sm:text-xs" title={opt.label}>
                    <span className="sm:hidden">{opt.label.slice(0, 3)}</span>
                    <span className="hidden sm:inline">{opt.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
          <div className="grid grid-cols-2 gap-2">
            {options.filter(opt => !opt.value.startsWith('en.') && !opt.value.startsWith('cn.')).map(opt => (
              <label
                key={opt.value}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors',
                  selected.has(opt.value)
                    ? 'border-foreground/30 bg-muted/50'
                    : 'border-border hover:border-border/80 hover:bg-muted/20'
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.has(opt.value)}
                  onChange={() => { toggleType(opt.value); setError(''); }}
                  className="h-4 w-4 rounded border-border accent-foreground"
                />
                <span className="whitespace-nowrap text-[11px] sm:text-xs" title={opt.label}>
                  <span className="sm:hidden">{opt.label.slice(0, 3)}</span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="h-9 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {submitting ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateKeyModal({
  locale,
  onClose,
  onCreate,
}: {
  locale: string;
  onClose: () => void;
  onCreate: (key: ApiKeyRecord) => void;
}) {
  const isZh = locale.startsWith('zh');
  const t = {
    title: isZh ? '创建 API Key' : 'Create API Key',
    name: isZh ? '名称' : 'Name',
    namePlaceholder: isZh ? '用于标识该 Key 的备注名' : 'A display name for this key',
    evalTypes: isZh ? '评测类型' : 'Eval Types',
    selectAll: isZh ? '全选全部' : 'Select all',
    englishZone: isZh ? '英文评测' : 'English eval',
    chineseZone: isZh ? '中文评测' : 'Chinese eval',
    selectEnglish: isZh ? '全选英文' : 'Select English',
    selectChinese: isZh ? '全选中文' : 'Select Chinese',
    selectedCount: (n: number, total: number) => (isZh ? `已选 ${n}/${total}` : `${n}/${total} selected`),
    cancel: isZh ? '取消' : 'Cancel',
    create: isZh ? '创建' : 'Create',
    creating: isZh ? '创建中…' : 'Creating…',
    errName: isZh ? '请输入名称' : 'Please enter a name',
    errTypes: isZh ? '请至少选择一种评测类型' : 'Please select at least one eval type',
  };
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState<ApiCoreType[]>(
    EVAL_TYPES.map(e => ({ value: e.id, label: e.name })),
  );
  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const selectEnRef = useRef<HTMLInputElement | null>(null);
  const selectCnRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    listCoreTypes()
      .then(list => { if (list.length) setOptions(list); })
      .catch(() => { /* fall back to EVAL_TYPES */ });
  }, []);

  const allValues = useMemo(() => options.map(opt => opt.value), [options]);
  const enValues = useMemo(
    () => options.filter(opt => opt.value.startsWith('en.')).map(opt => opt.value),
    [options],
  );
  const cnValues = useMemo(
    () => options.filter(opt => opt.value.startsWith('cn.')).map(opt => opt.value),
    [options],
  );

  function getGroupState(values: string[]) {
    if (values.length === 0) return { checked: false, indeterminate: false };
    const selectedCount = values.filter(v => selected.has(v)).length;
    return {
      checked: selectedCount > 0 && selectedCount === values.length,
      indeterminate: selectedCount > 0 && selectedCount < values.length,
    };
  }

  const allState = getGroupState(allValues);
  const enState = getGroupState(enValues);
  const cnState = getGroupState(cnValues);
  const selectedEnCount = enValues.filter(v => selected.has(v)).length;
  const selectedCnCount = cnValues.filter(v => selected.has(v)).length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = allState.indeterminate;
    if (selectEnRef.current) selectEnRef.current.indeterminate = enState.indeterminate;
    if (selectCnRef.current) selectCnRef.current.indeterminate = cnState.indeterminate;
  }, [allState.indeterminate, enState.indeterminate, cnState.indeterminate]);

  function toggleType(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleGroup(values: string[], checked: boolean) {
    setSelected(prev => {
      const next = new Set(prev);
      values.forEach(value => {
        if (checked) next.add(value);
        else next.delete(value);
      });
      return next;
    });
    setError('');
  }

  async function handleCreate() {
    if (!name.trim()) { setError(t.errName); return; }
    if (selected.size === 0) { setError(t.errTypes); return; }
    setSubmitting(true);
    try {
      const created = await apiCreateKey({ name: name.trim(), core_types: Array.from(selected) });
      onCreate(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background rounded-xl border border-border shadow-xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="text-sm font-medium mb-1.5 block">{t.name}</label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder={t.namePlaceholder}
            className="w-full h-10 px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors placeholder:text-muted-foreground"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-3 block">{t.evalTypes}</label>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allState.checked}
                  onChange={(e) => toggleGroup(allValues, e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-foreground"
                />
                <span>{t.selectAll}</span>
              </label>
              <span className="text-xs text-muted-foreground">{t.selectedCount(selected.size, allValues.length)}</span>
            </div>

            <section className="rounded-xl border border-border bg-background p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">{t.englishZone}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.selectedCount(selectedEnCount, enValues.length)}</p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  <input
                    ref={selectEnRef}
                    type="checkbox"
                    checked={enState.checked}
                    onChange={(e) => toggleGroup(enValues, e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-foreground"
                  />
                  <span>{t.selectEnglish}</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.filter(opt => opt.value.startsWith('en.')).map(opt => (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors',
                      selected.has(opt.value)
                        ? 'border-foreground/30 bg-muted/50'
                        : 'border-border hover:border-border/80 hover:bg-muted/20'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(opt.value)}
                      onChange={() => { toggleType(opt.value); setError(''); }}
                      className="h-4 w-4 rounded border-border accent-foreground"
                    />
                    <span className="whitespace-nowrap text-[11px] sm:text-xs" title={opt.label}>
                      <span className="sm:hidden">{opt.label.slice(0, 3)}</span>
                      <span className="hidden sm:inline">{opt.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-background p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">{t.chineseZone}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.selectedCount(selectedCnCount, cnValues.length)}</p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  <input
                    ref={selectCnRef}
                    type="checkbox"
                    checked={cnState.checked}
                    onChange={(e) => toggleGroup(cnValues, e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-foreground"
                  />
                  <span>{t.selectChinese}</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.filter(opt => opt.value.startsWith('cn.')).map(opt => (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors',
                      selected.has(opt.value)
                        ? 'border-foreground/30 bg-muted/50'
                        : 'border-border hover:border-border/80 hover:bg-muted/20'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(opt.value)}
                      onChange={() => { toggleType(opt.value); setError(''); }}
                      className="h-4 w-4 rounded border-border accent-foreground"
                    />
                    <span className="whitespace-nowrap text-[11px] sm:text-xs" title={opt.label}>
                      <span className="sm:hidden">{opt.label.slice(0, 3)}</span>
                      <span className="hidden sm:inline">{opt.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="h-9 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {submitting ? t.creating : t.create}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmActionModal({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  loading,
  danger = false,
}: {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-background rounded-xl border border-border shadow-xl p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6">{description}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'h-9 px-4 text-sm font-medium rounded-lg text-background transition-colors disabled:opacity-50',
              danger ? 'bg-destructive hover:bg-destructive/90' : 'bg-foreground hover:bg-foreground/90'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
