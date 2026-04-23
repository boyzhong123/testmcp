'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Mail } from 'lucide-react';
import { DemoRequestModal } from './demo-request-modal';

export function PricingContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  const zhEn = (zh: string, en: string) => (isZh ? zh : en);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors w-full"
      >
        <Mail className="h-4 w-4" />
        {zhEn('申请 DEMO 体验', 'Request Demo')}
      </button>

      <DemoRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
