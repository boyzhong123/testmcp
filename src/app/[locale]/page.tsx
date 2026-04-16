import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Target, BarChart3, AudioWaveform, Timer, PauseCircle, Link2, Volume2, Database, Check, ArrowUpRight, Sparkles, ScanSearch, Workflow, ExternalLink, BookOpen } from 'lucide-react';
import { FAQ } from '@/components/faq';
import { WorkflowSteps } from '@/components/workflow-steps';
import { HeroTypewriter } from '@/components/hero-typewriter';
import { ScrollIndicator } from '@/components/scroll-indicator';
import { FadeUp, StaggerContainer, StaggerItem, CountUp, HoverCard, IconWrap } from '@/components/animated-section';

export default async function HomePage() {
  const locale = await getLocale();
  const tHero = await getTranslations('Hero');
  const tFeatures = await getTranslations('Features');
  const tValue = await getTranslations('Value');
  const tAdvanced = await getTranslations('Advanced');
  const tPricing = await getTranslations('Pricing');
  const tAbout = await getTranslations('About');

  const features = [
    { icon: BarChart3, title: tFeatures('overall'), desc: tFeatures('overall_desc') },
    { icon: Target, title: tFeatures('accuracy'), desc: tFeatures('accuracy_desc') },
    { icon: AudioWaveform, title: tFeatures('fluency'), desc: tFeatures('fluency_desc') },
    { icon: Timer, title: tFeatures('speed'), desc: tFeatures('speed_desc') },
    { icon: PauseCircle, title: tFeatures('pause'), desc: tFeatures('pause_desc') },
    { icon: Link2, title: tFeatures('linking'), desc: tFeatures('linking_desc') },
    { icon: Volume2, title: tFeatures('stress'), desc: tFeatures('stress_desc') },
    { icon: Database, title: tFeatures('metadata'), desc: tFeatures('metadata_desc') },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <ScrollIndicator />

      {/* ━━━ Hero ━━━ */}
      <section id="hero" className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-muted/80 to-transparent rounded-full blur-3xl opacity-50" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          {/* Radial dots */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
          {/* Decorative gradient orbs */}
          <div className="absolute top-20 left-[15%] w-[300px] h-[300px] bg-gradient-to-br from-blue-400/10 to-purple-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-[250px] h-[250px] bg-gradient-to-tl from-emerald-400/8 to-cyan-400/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <FadeUp delay={0}>
            <span className="inline-block text-xs tracking-widest uppercase text-muted-foreground border border-border/60 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              {tHero('badge')}
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 max-w-3xl">
              {tHero('title_line1')}<br />
              <HeroTypewriter locale={locale} />
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
              {tHero('description')}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex items-center gap-3">
              {/* 主按钮：磨砂黑底 + 微光边框 + 内发光 */}
              <Link
                href="/demo"
                className="group relative inline-flex items-center justify-center h-11 px-7 text-sm font-semibold rounded-xl overflow-hidden gap-2
                  bg-foreground text-background
                  shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset,0_-1px_0_0_rgba(0,0,0,0.3)_inset,0_4px_16px_rgba(0,0,0,0.22)]
                  hover:shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_-1px_0_0_rgba(0,0,0,0.3)_inset,0_8px_24px_rgba(0,0,0,0.3)]
                  hover:-translate-y-[2px] active:translate-y-0
                  transition-all duration-200"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tHero('cta_primary')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                {/* 顶部高光条 */}
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Link>

              {/* 次按钮：玻璃质感 + 细边框 */}
              <Link
                href="/docs"
                className="group inline-flex items-center justify-center gap-2 h-11 px-7 text-sm font-medium rounded-xl
                  border border-border/70 bg-background/60 backdrop-blur-md
                  hover:border-foreground/25 hover:bg-background/90
                  shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_0_0_rgba(255,255,255,0.6)_inset]
                  hover:shadow-[0_2px_8px_rgba(0,0,0,0.1),0_1px_0_0_rgba(255,255,255,0.6)_inset]
                  hover:-translate-y-[2px] active:translate-y-0
                  transition-all duration-200 text-foreground/80 hover:text-foreground"
              >
                <BookOpen className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                {tHero('cta_secondary')}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ 三大核心价值 ━━━ */}
      <section id="features" className="py-20 md:py-28 border-t border-border/40">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">三大核心价值</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">从多维数据到智能教学，一站式语音评测 AI 解决方案</p>
          </FadeUp>
          <StaggerContainer className="grid lg:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-xl overflow-hidden max-w-5xl mx-auto">
            {[
              {
                icon: Sparkles,
                color: 'text-foreground bg-muted',
                title: tFeatures('title'),
                desc: tFeatures('description'),
                points: [tFeatures('overall'), tFeatures('accuracy'), tFeatures('fluency'), tFeatures('stress'), tFeatures('linking'), tFeatures('pause')],
              },
              {
                icon: ScanSearch,
                color: 'text-foreground bg-muted',
                title: tValue('title'),
                desc: tValue('description'),
                points: [tValue('demo_point1'), tValue('demo_point2'), tValue('demo_point3')],
              },
              {
                icon: Workflow,
                color: 'text-foreground bg-muted',
                title: tAdvanced('title'),
                desc: tAdvanced('description'),
                points: [tAdvanced('card1_title'), tAdvanced('card2_title'), tAdvanced('card3_title')],
              },
            ].map((card, i) => (
              <StaggerItem key={i} className="bg-background p-8 md:p-10 flex flex-col group hover:bg-muted/20 transition-colors duration-300">
                <IconWrap className={`h-10 w-10 rounded-lg flex items-center justify-center mb-6 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </IconWrap>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{card.desc}</p>
                <ul className="mt-auto space-y-2">
                  {card.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ━━━ 工作流程: 动态步骤 ━━━ */}
      <WorkflowSteps />

      {/* ━━━ 全部参数展示 ━━━ */}
      <section id="params" className="py-20 md:py-28 border-t border-border/40">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{tFeatures('all_params_title')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">{tFeatures('all_params_desc')}</p>
          </FadeUp>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden max-w-5xl mx-auto" staggerDelay={0.07}>
            {features.map((f, i) => (
              <StaggerItem key={i}>
                <HoverCard className="bg-background p-6 flex flex-col gap-3 cursor-default h-full">
                  <IconWrap className="w-fit">
                    <f.icon className="h-5 w-5 text-muted-foreground" />
                  </IconWrap>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ━━━ LLM 深度分析演示 ━━━ */}
      <section id="how-it-works" className="py-20 md:py-28 border-t border-border/40 bg-zinc-950 text-zinc-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{tValue('demo_title')}</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">{tValue('demo_desc')}</p>
              <ul className="space-y-4 mb-8">
                {[tValue('demo_point1'), tValue('demo_point2'), tValue('demo_point3')].map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-300">{p}</span>
                  </li>
                ))}
              </ul>
              <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-50 hover:underline underline-offset-4">
                {tAdvanced('cta')} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="text-xs text-zinc-500 font-mono mb-3">MCP Assessment Output</div>
                <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
{`{
  "overall": 72,
  "accuracy": 65,
  "fluency": 85,
  "speed": 130,
  "weak_phonemes": ["θ", "r", "ɪ"],
  "stress_issues": ["record", "present"],
  "pause_count": 3,
  "linking_score": 78
}`}
                </pre>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                <div className="text-xs text-emerald-400 font-mono mb-3">LLM Teaching Response</div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {tValue('demo_llm_response')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 在线体验 CTA ━━━ */}
      <section id="demo" className="py-20 md:py-28 border-t border-border/40">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-background via-muted/30 to-muted/60 max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-foreground/[0.03] to-transparent rounded-full blur-2xl" />
            <div className="relative grid lg:grid-cols-2 gap-10 p-8 md:p-12 lg:p-16 items-center">
              <div>
                <span className="inline-block text-xs tracking-widest uppercase text-muted-foreground mb-4">Interactive Demo</span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  亲自体验完整工作流
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                  无需注册，一键模拟从语音评测到 LLM 深度分析、个性化练习生成的完整闭环。
                </p>
                <Link href="/demo" className="group inline-flex items-center justify-center h-12 px-8 text-sm font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 gap-2 shadow-lg shadow-foreground/10 hover:shadow-xl hover:-translate-y-0.5">
                  立即体验 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: '语音评测',
                    desc: 'MCP 返回总分、准确度、流利度等 6 项核心指标',
                    preview: (
                      <div className="flex items-center gap-3 mt-2">
                        {[
                          { label: '总分', value: 78, color: 'text-amber-600' },
                          { label: '准确度', value: 72, color: 'text-amber-600' },
                          { label: '流利度', value: 85, color: 'text-emerald-600' },
                        ].map((s, i) => (
                          <div key={i} className="bg-muted/60 rounded-md px-3 py-1.5 text-center min-w-[60px]">
                            <div className={`text-sm font-bold tabular-nums ${s.color}`}>{s.value}</div>
                            <div className="text-[10px] text-muted-foreground">{s.label}</div>
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground">…</span>
                      </div>
                    ),
                  },
                  {
                    step: '02',
                    title: '深度分析',
                    desc: 'LLM 定位音素弱项，逐条给出诊断',
                    preview: (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 rounded px-2 py-0.5 font-medium">⚠ /θ/</span>
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 rounded px-2 py-0.5 font-medium">⚠ 重音</span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded px-2 py-0.5 font-medium">✓ 连读</span>
                      </div>
                    ),
                  },
                  {
                    step: '03',
                    title: '练习建议',
                    desc: 'AI 生成绕口令、跟读标注、提分路线',
                    preview: (
                      <div className="mt-2 bg-muted/60 rounded-md px-3 py-2 text-xs text-muted-foreground italic truncate">
                        &quot;The thirty-three thieves thought they thrilled...&quot;
                      </div>
                    ),
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/40 p-4 hover:border-border/80 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-bold">{item.step}</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                      {item.preview}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Pricing ━━━ */}
      <section id="pricing" className="py-20 md:py-28 border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{tPricing('title')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">{tPricing('description')}</p>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" staggerDelay={0.12}>
            <StaggerItem>
              <HoverCard className="border border-border/60 rounded-lg p-6 bg-background flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-1">{tPricing('free_title')}</h3>
                <p className="text-xs text-muted-foreground mb-5">{tPricing('free_desc')}</p>
                <div className="text-3xl font-bold mb-6">{tPricing('free_price')}</div>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('free_f1')}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('free_f2')}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('free_f3')}</li>
                </ul>
                <Link href="/login" className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md border border-border hover:bg-muted transition-colors w-full">{tPricing('free_cta')}</Link>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="border-2 border-foreground rounded-lg p-6 bg-background flex flex-col relative h-full">
                <span className="absolute -top-3 left-5 text-xs font-medium bg-foreground text-background px-2.5 py-0.5 rounded-full">{tPricing('pro_badge')}</span>
                <h3 className="text-lg font-semibold mb-1">{tPricing('pro_title')}</h3>
                <p className="text-xs text-muted-foreground mb-5">{tPricing('pro_desc')}</p>
                <div className="text-3xl font-bold mb-6">{tPricing('pro_price')}<span className="text-sm text-muted-foreground font-normal">{tPricing('pro_unit')}</span></div>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('pro_f1')}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('pro_f2')}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('pro_f3')}</li>
                </ul>
                <Link href="/login" className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors w-full">{tPricing('pro_cta')}</Link>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard className="border border-border/60 rounded-lg p-6 bg-background flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-1">{tPricing('enterprise_title')}</h3>
                <p className="text-xs text-muted-foreground mb-5">{tPricing('enterprise_desc')}</p>
                <div className="text-3xl font-bold mb-6">{tPricing('enterprise_price')}</div>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('enterprise_f1')}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('enterprise_f2')}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-foreground" />{tPricing('enterprise_f3')}</li>
                </ul>
                <Link href="/contact" className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md border border-border hover:bg-muted transition-colors w-full">{tPricing('enterprise_cta')}</Link>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <div className="border-t border-border/40">
        <FAQ />
      </div>

      {/* ━━━ About ━━━ */}
      <section id="about" className="py-20 md:py-28 border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{tAbout('title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-10">{tAbout('description')}</p>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-10" staggerDelay={0.15}>
              <StaggerItem>
                <div className="text-3xl font-bold tracking-tight">
                  <CountUp value={10} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{tAbout('stat1_label')}</div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-3xl font-bold tracking-tight">
                  <CountUp value={20} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{tAbout('stat2_label')}</div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-3xl font-bold tracking-tight">
                  <CountUp value={99} suffix="%" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{tAbout('stat3_label')}</div>
              </StaggerItem>
            </StaggerContainer>

            <FadeUp delay={0.3}>
              <a
                href="https://www.chivox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-full border border-border/80 hover:border-foreground/40 hover:bg-muted/50 transition-all duration-300"
              >
                访问驰声官网 <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </FadeUp>
          </div>
        </div>
      </section>
    </main>
  );
}
