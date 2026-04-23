'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { useLocale } from 'next-intl';
import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  const locale = useLocale();
  const isZh = locale.startsWith('zh');
  return (
    <main className="flex-1">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> {isZh ? '返回首页' : 'Back to Home'}
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.015em] mb-3">{isZh ? '联系我们' : 'Contact Us'}</h1>
        <p className="text-muted-foreground mb-12 max-w-lg">
          {isZh ? '无论是企业合作还是技术咨询，我们期待与您对话。' : 'For business collaboration or technical consulting, we would love to talk.'}
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-3xl">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-1">{isZh ? '邮箱 / Email' : 'Email'}</h3>
                <a href="mailto:sales@chivox.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  sales@chivox.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-1">{isZh ? '电话 / Phone' : 'Phone'}</h3>
                <a href="tel:0512-62729761" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  0512-62729761
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-1">{isZh ? '地址 / Address' : 'Address'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isZh ? '苏州工业园区金鸡湖大道人工智能产业园C1-801' : 'C1-801, AI Industrial Park, Jinji Lake Avenue, Suzhou Industrial Park, China'}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-border/60 rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4">{isZh ? '发送消息' : 'Send a Message'}</h3>
            <ContactForm
              source={isZh ? '联系我们页面' : 'Contact Page'}
              showEmail
              showMessage
            />
          </div>
        </div>
      </div>
    </main>
  );
}
