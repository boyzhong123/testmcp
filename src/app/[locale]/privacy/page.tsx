import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { getLocale } from 'next-intl/server';

export default async function PrivacyPage() {
  const locale = await getLocale();
  const isZh = locale.startsWith('zh');

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-3.5 w-3.5" />
          {isZh ? '返回首页' : 'Back to home'}
        </Link>

        {isZh ? (
          <>
            <h1 className="text-3xl font-semibold tracking-[-0.015em] mb-2">隐私政策</h1>
            <p className="text-sm text-muted-foreground mb-10">最后更新：2026 年 1 月 1 日</p>

            <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. 概述</h2>
                <p className="leading-relaxed">苏州驰声信息科技有限公司（以下简称"驰声"）深知隐私对您的重要性。本隐私政策说明我们在您使用 Chivox MCP 服务时如何收集、使用和保护您的个人信息。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. 我们收集的信息</h2>
                <p className="leading-relaxed">我们可能收集以下类型的信息：</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li><strong>账号信息：</strong>注册时提供的姓名、邮箱地址；</li>
                  <li><strong>使用数据：</strong>API 调用记录、请求量、错误日志等服务使用数据；</li>
                  <li><strong>设备信息：</strong>浏览器类型、操作系统、IP 地址等技术信息；</li>
                  <li><strong>音频数据：</strong>通过 API 提交的语音评测音频（仅用于评测处理，不作其他用途）。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. 信息的使用</h2>
                <p className="leading-relaxed">我们使用收集的信息用于：</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>提供、维护和改善 Chivox MCP 服务；</li>
                  <li>处理您的 API 请求并返回评测结果；</li>
                  <li>发送服务通知、账单信息及技术支持消息；</li>
                  <li>检测和防范欺诈或滥用行为；</li>
                  <li>遵守法律法规要求。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. 信息共享</h2>
                <p className="leading-relaxed">我们不会出售您的个人信息。在以下情况下，我们可能与第三方共享信息：</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>经您明确同意；</li>
                  <li>为提供服务而委托的技术服务商（受保密协议约束）；</li>
                  <li>法律要求或政府机关依法调取。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. 数据安全</h2>
                <p className="leading-relaxed">我们采用行业标准的安全措施保护您的数据，包括 HTTPS 加密传输、数据库访问控制及定期安全审计。但请注意，互联网传输本身存在固有风险，我们无法保证绝对安全。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. 数据保留</h2>
                <p className="leading-relaxed">我们在提供服务期间保留您的账号信息。音频数据在评测处理完成后不超过 24 小时内删除，不作永久存储。您可随时通过联系我们申请删除账号及相关数据。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Cookie</h2>
                <p className="leading-relaxed">我们使用必要的 Cookie 维持登录状态和基本功能。您可通过浏览器设置管理 Cookie，但禁用可能影响部分功能的正常使用。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. 您的权利</h2>
                <p className="leading-relaxed">依据适用法律，您有权：访问、更正或删除您的个人信息；撤回对非必要数据处理的同意；向主管部门投诉。如需行使上述权利，请通过下方联系方式与我们联系。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. 未成年人</h2>
                <p className="leading-relaxed">本服务面向开发者，不针对 18 岁以下未成年人。如我们发现误收集了未成年人信息，将立即删除。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">10. 联系我们</h2>
                <p className="leading-relaxed">如对本隐私政策有任何疑问，请联系：</p>
                <p className="mt-2">苏州驰声信息科技有限公司<br />邮箱：<a href="mailto:contact@chivox.com" className="text-foreground underline underline-offset-2">contact@chivox.com</a></p>
              </section>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-[-0.015em] mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: January 1, 2026</p>

            <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Overview</h2>
                <p className="leading-relaxed">Suzhou Chivox Information Technology Co., Ltd. ("Chivox") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use the Chivox MCP service.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li><strong>Account information:</strong> Name and email address provided during registration;</li>
                  <li><strong>Usage data:</strong> API call logs, request counts, and error logs;</li>
                  <li><strong>Device information:</strong> Browser type, OS, and IP address;</li>
                  <li><strong>Audio data:</strong> Speech submitted via API for assessment (used solely for evaluation).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Information</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>Provide, maintain, and improve the Chivox MCP service;</li>
                  <li>Process API requests and return assessment results;</li>
                  <li>Send service notices, billing info, and technical support messages;</li>
                  <li>Detect and prevent fraud or abuse;</li>
                  <li>Comply with legal obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. Information Sharing</h2>
                <p className="leading-relaxed">We do not sell your personal information. We may share information with third parties only with your consent, with service providers bound by confidentiality agreements, or when required by law.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Security</h2>
                <p className="leading-relaxed">We use industry-standard security measures including HTTPS encryption, database access controls, and regular security audits. However, no internet transmission is completely secure.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Retention</h2>
                <p className="leading-relaxed">We retain account information while you use the service. Audio data is deleted within 24 hours after evaluation. You may request deletion of your account and data at any time.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Cookies</h2>
                <p className="leading-relaxed">We use essential cookies to maintain login sessions and basic functionality. You may manage cookies through your browser settings, though disabling them may affect some features.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. Your Rights</h2>
                <p className="leading-relaxed">You have the right to access, correct, or delete your personal information; withdraw consent for non-essential data processing; and file complaints with supervisory authorities. Contact us to exercise these rights.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. Minors</h2>
                <p className="leading-relaxed">This service is intended for developers and not directed at anyone under 18. If we discover we have inadvertently collected information from a minor, we will delete it immediately.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact Us</h2>
                <p className="leading-relaxed">For questions about this Privacy Policy, please contact:</p>
                <p className="mt-2">Suzhou Chivox Information Technology Co., Ltd.<br />Email: <a href="mailto:contact@chivox.com" className="text-foreground underline underline-offset-2">contact@chivox.com</a></p>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
