'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import { ContactForm } from './contact-form';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-xl shadow-2xl border border-border/60 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h2 className="text-lg font-semibold">
            {isZh ? '申请 DEMO 体验' : 'Request Demo'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground mb-5">
            {isZh
              ? '填写以下信息，我们的销售团队会尽快与您联系。'
              : 'Fill in the form below and our sales team will contact you shortly.'}
          </p>
          <ContactForm
            source={isZh ? '首页申请DEMO' : 'Homepage Demo Request'}
            variant="compact"
            onSuccess={() => {
              setTimeout(onClose, 2000);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// 用于触发弹窗的按钮组件
interface DemoRequestButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function DemoRequestButton({ className, children }: DemoRequestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isZh = locale.startsWith('zh');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children || (isZh ? '申请 DEMO 体验' : 'Request Demo')}
      </button>
      <DemoRequestModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
