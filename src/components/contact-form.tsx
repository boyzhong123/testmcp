'use client';

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { sendContactEmail, type ContactFormData } from '@/app/actions/send-contact-email';

interface ContactFormProps {
  source?: string;
  variant?: 'default' | 'compact' | 'modal';
  showEmail?: boolean;
  showMessage?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ContactForm({
  source,
  variant = 'default',
  showEmail = false,
  showMessage = false,
  onSuccess,
  onClose,
}: ContactFormProps) {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const t = (zh: string, en: string) => (isZh ? zh : en);

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<ContactFormData>({
    company: '',
    name: '',
    phone: '',
    email: '',
    message: '',
    source: source || (isZh ? '官网咨询' : 'Website Inquiry'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMsg('');

    startTransition(async () => {
      const result = await sendContactEmail(formData);
      if (result.success) {
        setStatus('success');
        setFormData({
          company: '',
          name: '',
          phone: '',
          email: '',
          message: '',
          source: formData.source,
        });
        onSuccess?.();
      } else {
        setStatus('error');
        setErrorMsg(result.error || t('提交失败，请重试', 'Submission failed, please try again'));
      }
    });
  };

  const handleReset = () => {
    setFormData({
      company: '',
      name: '',
      phone: '',
      email: '',
      message: '',
      source: formData.source,
    });
    setStatus('idle');
    setErrorMsg('');
  };

  const inputClass =
    'w-full h-10 px-3 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const labelClass = 'block text-sm font-medium mb-1.5';

  if (status === 'success' && variant !== 'modal') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('提交成功', 'Submitted Successfully')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('我们会尽快与您联系', 'We will contact you shortly')}
        </p>
        <button
          onClick={handleReset}
          className="text-sm text-foreground underline underline-offset-2 hover:no-underline"
        >
          {t('继续提交', 'Submit Another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {variant === 'modal' && onClose && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">{t('申请 DEMO 体验', 'Request Demo')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {status === 'success' && variant === 'modal' && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm mb-4">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{t('提交成功！我们会尽快与您联系', 'Success! We will contact you shortly')}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className={labelClass}>
          {t('公司', 'Company')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder={t('请输入公司名称', 'Enter company name')}
          className={inputClass}
          disabled={isPending}
          required
        />
      </div>

      <div>
        <label className={labelClass}>
          {t('姓名', 'Name')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('请输入您的姓名', 'Enter your name')}
          className={inputClass}
          disabled={isPending}
          required
        />
      </div>

      <div>
        <label className={labelClass}>
          {t('手机号码', 'Phone')} <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder={t('请输入手机号码', 'Enter phone number')}
          className={inputClass}
          disabled={isPending}
          required
        />
      </div>

      {showEmail && (
        <div>
          <label className={labelClass}>{t('邮箱', 'Email')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t('请输入邮箱（选填）', 'Enter email (optional)')}
            className={inputClass}
            disabled={isPending}
          />
        </div>
      )}

      {showMessage && (
        <div>
          <label className={labelClass}>{t('留言', 'Message')}</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('请输入您的需求或问题（选填）', 'Enter your needs or questions (optional)')}
            rows={4}
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-foreground/30 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
          />
        </div>
      )}

      <div className={variant === 'compact' ? 'flex gap-2' : 'flex gap-3'}>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 h-10 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('提交中...', 'Submitting...')}
            </>
          ) : (
            t('提交', 'Submit')
          )}
        </button>
        {variant !== 'compact' && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="h-10 px-4 text-sm font-medium rounded-md border border-border hover:bg-muted/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('重置', 'Reset')}
          </button>
        )}
      </div>
    </form>
  );
}
