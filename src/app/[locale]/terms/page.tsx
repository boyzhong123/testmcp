import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { getLocale } from 'next-intl/server';

export default async function TermsPage() {
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
            <h1 className="text-3xl font-semibold tracking-[-0.015em] mb-2">服务条款</h1>
            <p className="text-sm text-muted-foreground mb-10">最后更新：2026 年 1 月 1 日</p>

            <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. 接受条款</h2>
                <p className="leading-relaxed">欢迎使用苏州驰声信息科技有限公司（以下简称"驰声"或"我们"）提供的 Chivox MCP 服务。访问或使用本服务，即表示您同意受本服务条款的约束。如不同意，请勿使用本服务。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. 服务描述</h2>
                <p className="leading-relaxed">Chivox MCP 是驰声提供的语音评测开放平台，通过 Model Context Protocol（MCP）标准协议，为开发者提供考试级语音评测能力接入服务，包括但不限于单词、句子、段落、情景对话等多种题型的发音评分与诊断。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. 账号注册</h2>
                <p className="leading-relaxed">使用本服务需要注册账号。您应当：</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>提供真实、准确、完整的注册信息；</li>
                  <li>妥善保管账号及密码，对账号下所有活动负责；</li>
                  <li>发现账号被未授权使用时，立即通知我们。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. API 使用规范</h2>
                <p className="leading-relaxed">您在使用 API 时，承诺：</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>仅将 API 用于合法目的，不得用于任何违反法律法规的行为；</li>
                  <li>不得对服务发起超出合理范围的请求，不得尝试攻击或破坏服务；</li>
                  <li>不得将 API Key 共享、出售或转让给第三方；</li>
                  <li>遵守请求频率限制及配额规定。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. 知识产权</h2>
                <p className="leading-relaxed">本服务的所有内容，包括但不限于算法、模型、文档、界面设计及商标，均为驰声所有或经授权使用，受中国及国际知识产权法律保护。未经驰声书面许可，您不得复制、修改、分发或创作衍生作品。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. 免责声明</h2>
                <p className="leading-relaxed">在法律允许的最大范围内，驰声不就本服务的可用性、准确性或适用性作出任何明示或暗示的保证。驰声对因使用或无法使用本服务导致的直接或间接损失不承担责任。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. 服务变更与终止</h2>
                <p className="leading-relaxed">我们保留随时修改、暂停或终止服务的权利，并将提前通过平台公告或邮件告知。我们亦有权因违反本条款的行为终止您的账号。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. 适用法律</h2>
                <p className="leading-relaxed">本条款受中华人民共和国法律管辖。因本条款引起的争议，双方应首先协商解决；协商不成的，提交苏州市有管辖权的人民法院诉讼解决。</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. 联系我们</h2>
                <p className="leading-relaxed">如有任何问题，请联系：</p>
                <p className="mt-2">苏州驰声信息科技有限公司<br />邮箱：<a href="mailto:contact@chivox.com" className="text-foreground underline underline-offset-2">contact@chivox.com</a></p>
              </section>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-[-0.015em] mb-2">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-10">Last updated: January 1, 2026</p>

            <div className="prose prose-sm max-w-none text-foreground/80 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">Welcome to Chivox MCP, a service provided by Suzhou Chivox Information Technology Co., Ltd. ("Chivox", "we", or "us"). By accessing or using our service, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p className="leading-relaxed">Chivox MCP is an open speech assessment platform that provides exam-grade speech evaluation capabilities to developers via the Model Context Protocol (MCP) standard, including pronunciation scoring and diagnosis for words, sentences, paragraphs, and dialogues.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">3. Account Registration</h2>
                <p className="leading-relaxed">You must register an account to use this service. You agree to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>Provide accurate and complete registration information;</li>
                  <li>Maintain the security of your account and password;</li>
                  <li>Notify us immediately of any unauthorized account use.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">4. API Usage Policy</h2>
                <p className="leading-relaxed">When using our API, you agree to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1.5">
                  <li>Use the API only for lawful purposes;</li>
                  <li>Not attempt to attack, overload, or disrupt the service;</li>
                  <li>Not share, sell, or transfer your API Key to third parties;</li>
                  <li>Comply with rate limits and quota restrictions.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">5. Intellectual Property</h2>
                <p className="leading-relaxed">All content within the service, including algorithms, models, documentation, interface design, and trademarks, is owned by or licensed to Chivox and protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">6. Disclaimer</h2>
                <p className="leading-relaxed">To the maximum extent permitted by law, Chivox makes no warranties regarding the availability, accuracy, or fitness for a particular purpose of the service. We are not liable for any direct or indirect losses arising from your use or inability to use the service.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">7. Changes and Termination</h2>
                <p className="leading-relaxed">We reserve the right to modify, suspend, or terminate the service at any time with prior notice via platform announcements or email. We may also terminate your account for violations of these terms.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">8. Governing Law</h2>
                <p className="leading-relaxed">These terms are governed by the laws of the People's Republic of China. Disputes shall first be resolved through negotiation; if unsuccessful, they shall be submitted to a court of competent jurisdiction in Suzhou.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact Us</h2>
                <p className="leading-relaxed">For any questions, please contact:</p>
                <p className="mt-2">Suzhou Chivox Information Technology Co., Ltd.<br />Email: <a href="mailto:contact@chivox.com" className="text-foreground underline underline-offset-2">contact@chivox.com</a></p>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
