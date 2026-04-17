import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Target, BarChart3, AudioWaveform, Timer, ShieldCheck, Music2, ScanLine, Ruler, Check, ArrowUpRight, Sparkles, ScanSearch, Workflow, ExternalLink, BookOpen, Mic, FileAudio, Radio, Zap, Bot, Podcast, Network, MessagesSquare, Languages } from 'lucide-react';
import { FAQ } from '@/components/faq';
import { WorkflowSteps } from '@/components/workflow-steps';
import { HeroTypewriter } from '@/components/hero-typewriter';
import { ScrollIndicator } from '@/components/scroll-indicator';
import { FadeUp, StaggerContainer, StaggerItem, CountUp, HoverCard, IconWrap } from '@/components/animated-section';
import { FullPageScroll } from '@/components/fullpage-scroll';
import { ParamsShowcase } from '@/components/params-showcase';
import { DemoPreview } from '@/components/demo-preview';
import { cn } from '@/lib/utils';

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
    { icon: ShieldCheck, title: tFeatures('integrity'), desc: tFeatures('integrity_desc') },
    { icon: AudioWaveform, title: tFeatures('fluency'), desc: tFeatures('fluency_desc') },
    { icon: Music2, title: tFeatures('rhythm'), desc: tFeatures('rhythm_desc') },
    { icon: Timer, title: tFeatures('speed'), desc: tFeatures('speed_desc') },
    { icon: ScanLine, title: tFeatures('diagnostics'), desc: tFeatures('diagnostics_desc') },
    { icon: Ruler, title: tFeatures('phoneme'), desc: tFeatures('phoneme_desc') },
  ];

  return (
    <main className="flex-1 flex flex-col">
      <ScrollIndicator />
      <FullPageScroll />

      {/* ━━━ Hero ━━━ */}
      <section id="hero" data-fp-section className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-16 pb-16">
        {/* ─── Background layers (bottom to top) ─── */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* L1 · 纯色底 (适应 light / dark) */}
          <div className="absolute inset-0 bg-background" />

          {/* L2 · 网格（径向 mask，中心清晰，四周淡出） */}
          <div
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)',
            }}
          />

          {/* L3 · 声波同心圆 · 左上 */}
          <svg
            className="absolute top-[8%] left-[3%] w-[340px] h-[340px] opacity-[0.08] dark:opacity-[0.12] text-foreground"
            viewBox="0 0 400 400" fill="none"
            aria-hidden
          >
            {[60, 110, 160, 210, 260].map((r, i) => (
              <circle
                key={r}
                cx="200" cy="200" r={r}
                stroke="currentColor"
                strokeWidth={i === 1 || i === 3 ? '1.2' : '0.6'}
                strokeDasharray={i % 2 === 0 ? '0' : '3 5'}
              />
            ))}
            <circle cx="200" cy="200" r="6" fill="currentColor" opacity="0.6" />
          </svg>

          {/* L4 · 声波同心圆 · 右下 */}
          <svg
            className="absolute bottom-[6%] right-[4%] w-[280px] h-[280px] opacity-[0.07] dark:opacity-[0.1] text-foreground"
            viewBox="0 0 400 400" fill="none"
            aria-hidden
          >
            {[70, 130, 190, 250].map((r, i) => (
              <circle
                key={r}
                cx="200" cy="200" r={r}
                stroke="currentColor"
                strokeWidth={i === 1 ? '1.2' : '0.6'}
                strokeDasharray={i % 2 === 1 ? '0' : '2 6'}
              />
            ))}
          </svg>

          {/* L5 · 顶部中心柔光（让 H1 有聚焦感） */}
          <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-3xl opacity-60 dark:opacity-40"
            style={{
              background:
                'radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%), radial-gradient(closest-side, rgba(0,0,0,0.04), transparent 70%)',
            }}
          />

          {/* L6 · 装饰性波形 · 横向细长，贴近中线下方 */}
          <svg
            className="absolute left-1/2 top-[56%] -translate-x-1/2 w-[1200px] h-[140px] opacity-[0.06] dark:opacity-[0.1] text-foreground"
            viewBox="0 0 1200 140" fill="none"
            aria-hidden
          >
            <path
              d="M0 70 Q 100 30 200 70 T 400 70 T 600 70 T 800 70 T 1000 70 T 1200 70"
              stroke="currentColor" strokeWidth="1" fill="none"
            />
            <path
              d="M0 70 Q 75 100 150 70 T 300 70 T 450 70 T 600 70 T 750 70 T 900 70 T 1050 70 T 1200 70"
              stroke="currentColor" strokeWidth="0.7" fill="none" strokeDasharray="4 6"
            />
          </svg>

          {/* L7 · 灰色径向辉光（替代原蓝紫绿球） */}
          <div className="absolute top-[18%] left-[12%] w-[320px] h-[320px] rounded-full blur-3xl bg-foreground/[0.04] dark:bg-foreground/[0.06]" />
          <div className="absolute bottom-[12%] right-[16%] w-[280px] h-[280px] rounded-full blur-3xl bg-foreground/[0.03] dark:bg-foreground/[0.05]" />

          {/* L8 · 底部 fade（向下屏 subtly 过渡） */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background" />

          {/* L9 · 极轻 noise 纹理，加质感 */}
          <div
            className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
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
                className="group relative inline-flex items-center justify-center h-11 px-7 text-sm font-semibold rounded-lg overflow-hidden gap-2
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
                className="group inline-flex items-center justify-center gap-2 h-11 px-7 text-sm font-medium rounded-lg
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

          <FadeUp delay={0.45} className="mt-16 w-full max-w-4xl">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/80 text-center mb-5">
              Trusted by
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
              {[
                { value: 10, suffix: '+ 年', label: '引擎研发积累' },
                { value: 1, suffix: '亿+', label: '已服务学习者' },
                { value: 95, suffix: '%+', label: '与专家评分一致' },
                { value: 100, suffix: '+', label: '接入企业客户' },
              ].map((m) => (
                <div key={m.label} className="bg-background/70 backdrop-blur-sm px-4 py-4 text-center">
                  <div className="text-xl md:text-2xl font-bold tracking-tight tabular-nums">
                    <CountUp value={m.value} suffix={m.suffix} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ 在线体验 CTA ━━━ */}
      <section id="demo" data-fp-section className="relative overflow-hidden min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40 bg-gradient-to-b from-muted/10 via-background to-muted/10">
        {/* 背景光晕 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[480px] h-[480px] rounded-full bg-foreground/[0.03] blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-[480px] h-[480px] rounded-full bg-foreground/[0.03] blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          {/* 标题 */}
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Interactive Demo · 零门槛试用</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              一眼看懂驰声能做什么 <span className="text-muted-foreground font-normal">· 评测 → 诊断 → 练习</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              无需注册、无需付费。4 种题型、8 个评分字段、LLM 二次 / 三次分析，全部走真实 API 响应。
            </p>
          </FadeUp>

          <DemoPreview />
        </div>
      </section>

      {/* ━━━ 三大核心价值 ━━━ */}
      <section id="features" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Product Value</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">三大核心价值</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">从细颗粒度评分数据，到 LLM 语义深度分析，再到全场景一键落地 —— 一条协议打通 AI 听说能力栈。</p>
          </FadeUp>

          <StaggerContainer className="grid lg:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-xl overflow-hidden max-w-6xl mx-auto">

            {/* ── Card 01 · 评分字段 ── */}
            <StaggerItem className="bg-background p-6 md:p-7 flex flex-col group hover:bg-muted/10 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <IconWrap className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-foreground" />
                </IconWrap>
                <span className="text-[11px] font-mono text-muted-foreground/60 tracking-wider">01</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{tFeatures('title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                四大主维度（Accuracy · Integrity · Fluency · Rhythm）+ 音素级对齐 + 错误类型分类，考试级颗粒度直送 LLM。
              </p>

              {/* 真实返回片段 */}
              <div className="rounded-md border border-border/50 bg-zinc-950 text-zinc-200 overflow-hidden mb-4">
                <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">MCP Response (partial)</span>
                  <span className="text-[9px] text-emerald-400/80 font-mono">live</span>
                </div>
                <pre className="text-[11px] font-mono p-3 leading-relaxed">{`{
  "overall": `}<span className="text-amber-300">72</span>{`,
  "pron": {
    "accuracy":  `}<span className="text-amber-300">65</span>{`,
    "integrity": `}<span className="text-amber-300">95</span>{`,
    "fluency":   `}<span className="text-amber-300">85</span>{`,
    "rhythm":    `}<span className="text-amber-300">70</span>{`
  }
}`}</pre>
              </div>

              {/* dp_type 分类条 */}
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-1.5">错误类型分类 · dp_type</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { l: 'normal', c: 'border-border/60 bg-muted text-muted-foreground' },
                    { l: 'mispron', c: 'border-rose-200 bg-rose-50 text-rose-600' },
                    { l: 'omit', c: 'border-amber-200 bg-amber-50 text-amber-700' },
                    { l: 'insert', c: 'border-violet-200 bg-violet-50 text-violet-700' },
                  ].map((b) => (
                    <span key={b.l} className={`px-2 py-0.5 rounded border text-[10px] font-mono ${b.c}`}>
                      {b.l}
                    </span>
                  ))}
                </div>
              </div>

              {/* 覆盖维度 chips */}
              <div className="mt-auto grid grid-cols-2 gap-1.5">
                {[
                  tFeatures('accuracy'),
                  tFeatures('integrity'),
                  tFeatures('fluency'),
                  tFeatures('rhythm'),
                  tFeatures('diagnostics'),
                  tFeatures('phoneme'),
                ].map((p, j) => (
                  <div key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-foreground shrink-0" />
                    <span className="truncate">{p}</span>
                  </div>
                ))}
              </div>
            </StaggerItem>

            {/* ── Card 02 · LLM 二次分析 ── */}
            <StaggerItem className="bg-background p-6 md:p-7 flex flex-col group hover:bg-muted/10 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <IconWrap className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <ScanSearch className="h-5 w-5 text-foreground" />
                </IconWrap>
                <span className="text-[11px] font-mono text-muted-foreground/60 tracking-wider">02</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{tValue('title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                开发者用一段 Prompt 就能把 MCP 结构化数据变成教学级诊断报告。驰声提供可复用的 Prompt Skill 模板。
              </p>

              {/* Prompt → Output mini flow */}
              <div className="space-y-2 mb-4">
                <div className="rounded-md border border-border/50 bg-zinc-950 text-zinc-300 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-zinc-500 font-mono">System Prompt · Skill</span>
                  </div>
                  <pre className="text-[11px] font-mono p-3 leading-relaxed whitespace-pre-wrap">{`按 dp_type 分组错误，聚焦
score < 70 的音素，给
口型纠正 + 学习优先级。`}</pre>
                </div>

                <div className="flex justify-center">
                  <span className="text-muted-foreground/40 text-xs">↓</span>
                </div>

                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.04] p-3">
                  <div className="text-[10px] font-mono text-emerald-600 mb-1.5">LLM Response</div>
                  <p className="text-xs text-foreground leading-relaxed">
                    /ð/ 被发成 /z/ → 舌尖轻抵上齿；/ɒ/ 开口度不足 → 张大下颌。优先练 /ð/，英语高频。
                  </p>
                </div>
              </div>

              {/* 可用模型 */}
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-1.5">兼容主流 LLM</div>
                <div className="flex flex-wrap gap-1.5">
                  {['GPT-4', 'Claude 3.5', 'Gemini', 'Qwen', 'DeepSeek', 'GLM-4'].map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded border border-border/60 bg-muted/40 text-[10px] font-mono text-muted-foreground">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <ul className="mt-auto space-y-1.5">
                {['音素弱项精准定位 → 纠音建议', '考试档位估计 + 下一档需要补什么', '按学生画像生成个性化练习'].map((p, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                    <Check className="h-3 w-3 text-foreground shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* ── Card 03 · 全场景接入 ── */}
            <StaggerItem className="bg-background p-6 md:p-7 flex flex-col group hover:bg-muted/10 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <IconWrap className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Workflow className="h-5 w-5 text-foreground" />
                </IconWrap>
                <span className="text-[11px] font-mono text-muted-foreground/60 tracking-wider">03</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{tAdvanced('title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                基于 MCP 标准协议，任意支持 MCP 的 AI 客户端一行配置即刻获得考试级语音评测能力，无需封装 SDK。
              </p>

              {/* MCP 配置代码片段 */}
              <div className="rounded-md border border-border/50 bg-zinc-950 text-zinc-200 overflow-hidden mb-4">
                <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">~/.cursor/mcp.json</span>
                  <span className="text-[9px] text-zinc-500 font-mono">1-line</span>
                </div>
                <pre className="text-[11px] font-mono p-3 leading-relaxed">{`{
  "mcpServers": {
    "chivox": {
      "command": `}<span className="text-emerald-300">{'"npx"'}</span>{`,
      "args": [`}<span className="text-emerald-300">{'"@chivox/mcp"'}</span>{`]
    }
  }
}`}</pre>
              </div>

              {/* 客户端 grid */}
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-1.5">支持客户端 · 已验证</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Cursor', '扣子 Coze', 'Dify', 'Claude Desktop', '豆包', '飞书', '钉钉', '企业微信', 'LangChain'].map((c) => (
                    <div key={c} className="px-1.5 py-1 rounded border border-border/60 bg-muted/30 text-[10px] text-center truncate">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <ul className="mt-auto space-y-1.5">
                {[tAdvanced('card1_title'), tAdvanced('card2_title'), tAdvanced('card3_title')].map((p, j) => (
                  <li key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-foreground shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </StaggerContainer>

          <FadeUp delay={0.3} className="mt-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground rounded-lg border border-dashed border-border/60 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
                <span>三层能力都能被 LLM 以 MCP 工具的方式直接调用</span>
              </div>
              <div className="hidden md:flex items-center gap-4 font-mono text-[11px]">
                <span className="text-muted-foreground/70">mcp.call(<span className="text-foreground">assess_speech</span>)</span>
                <span className="text-muted-foreground/50">→</span>
                <span className="text-muted-foreground/70">mcp.call(<span className="text-foreground">analyze_weakness</span>)</span>
                <span className="text-muted-foreground/50">→</span>
                <span className="text-muted-foreground/70">mcp.call(<span className="text-foreground">gen_exercise</span>)</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ 边录边评 · 双模式评测 ━━━ */}
      <section id="dual-mode" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Dual Mode</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">边录边评 · 双模式评测</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">流式实时评测 + 音频文件评测，覆盖从交互口语练习到批量质检的全部链路</p>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FadeUp>
              <HoverCard className="rounded-xl border border-border/60 p-8 h-full flex flex-col bg-background">
                <div className="flex items-center gap-3 mb-4">
                  <IconWrap className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                    <Radio className="h-5 w-5 text-foreground" />
                  </IconWrap>
                  <h3 className="text-lg font-bold">实时录音评测</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">通过本地麦克风采集语音，音频以 WebSocket 流式推送到评测引擎。无需生成中间文件，录完即出分，适合交互式口语练习。</p>
                <div className="mt-auto space-y-5">
                  <div className="rounded-lg bg-muted/30 p-4">
                    <p className="text-xs font-semibold mb-3 text-muted-foreground">评测流程</p>
                    <div className="space-y-3">
                      {[
                        { step: '1', icon: Mic, text: '创建流式会话，指定评测类型与参考文本' },
                        { step: '2', icon: Radio, text: '开始录音，音频实时推送至云端评测引擎' },
                        { step: '3', icon: Zap, text: '停止录音，即刻获得多维评分结果' },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <span className="h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">{item.step}</span>
                          <div className="flex items-center gap-2 text-sm">
                            <item.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{item.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['延迟降低 30-50%，体验更流畅', '无需管理音频文件', '支持断线自动重连'].map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-foreground shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </HoverCard>
            </FadeUp>
            <FadeUp>
              <HoverCard className="rounded-xl border border-border/60 p-8 h-full flex flex-col bg-background">
                <div className="flex items-center gap-3 mb-4">
                  <IconWrap className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                    <FileAudio className="h-5 w-5 text-foreground" />
                  </IconWrap>
                  <h3 className="text-lg font-bold">音频文件评测</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">支持本地文件路径、Base64 编码、URL 三种输入方式。传入路径即可评测，代理自动处理编码和上传，适合批量处理场景。</p>
                <div className="mt-auto space-y-5">
                  <div className="rounded-lg bg-muted/30 p-4">
                    <p className="text-xs font-semibold mb-3 text-muted-foreground">三种输入方式</p>
                    <div className="space-y-2">
                      {[
                        { label: 'audio_file_path', desc: '本地路径，最便捷' },
                        { label: 'audio_base64', desc: 'Base64 编码数据' },
                        { label: 'audio_url', desc: '远程 URL 地址' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm">
                          <code className="text-xs font-mono bg-background px-2 py-0.5 rounded border border-border/40">{item.label}</code>
                          <span className="text-muted-foreground text-xs">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['支持 mp3/wav/ogg/m4a/aac/pcm', '大文件自动压缩', '适合批量评测与回放分析'].map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-foreground shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </HoverCard>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="mt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden text-center">
              {[
                { k: '延迟', v: '30-50%↓', hint: '相比传统回传评测' },
                { k: '音频格式', v: '6 种', hint: 'mp3 / wav / m4a ...' },
                { k: '输入方式', v: '3 种', hint: '路径 / Base64 / URL' },
                { k: '自动重连', v: '断线续录', hint: '弱网场景友好' },
              ].map((m) => (
                <div key={m.k} className="bg-background px-3 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{m.k}</div>
                  <div className="text-base font-bold tracking-tight mt-1">{m.v}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.hint}</div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.4} className="mt-5 max-w-4xl mx-auto">
            <div className="rounded-lg border border-border/60 bg-background px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 shrink-0">题型能力覆盖</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {[
                  { label: '单词', hint: 'word' },
                  { label: '句子', hint: 'sent' },
                  { label: '段落', hint: 'para' },
                  { label: '半开放题', hint: '5 维评分' },
                  { label: '开放题', hint: '看图说话 / 作文' },
                  { label: '自由识别', hint: '实时 ASR + 标点' },
                  { label: 'AI Talk', hint: '人机对话' },
                ].map((t) => (
                  <span key={t.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border/50 text-xs">
                    <span className="font-medium">{t.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{t.hint}</span>
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ 全部参数展示 ━━━ */}
      <section id="params" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Assessment Parameters</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{tFeatures('all_params_title')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">{tFeatures('all_params_desc')}</p>
          </FadeUp>

          <ParamsShowcase />

          <FadeUp delay={0.4} className="mt-4 max-w-6xl mx-auto text-center">
            <p className="text-[11px] text-muted-foreground/70">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                悬停左侧任意字段，右侧 JSON 中对应位置会实时高亮
              </span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ LLM 深度分析演示 ━━━ */}
      <section id="how-it-works" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40 bg-zinc-950 text-zinc-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-zinc-500 mb-3">Deep Analysis</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{tValue('demo_title')}</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">{tValue('demo_desc')}</p>
              <ul className="space-y-3 mb-8">
                {[tValue('demo_point1'), tValue('demo_point2'), tValue('demo_point3')].map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-300">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 py-3 px-4 rounded-lg border border-white/[0.08] bg-white/[0.03] mb-8">
                <div className="flex -space-x-2">
                  {['bg-emerald-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400'].map((c, i) => (
                    <div key={i} className={`h-6 w-6 rounded-full ${c} border-2 border-zinc-950`} />
                  ))}
                </div>
                <div className="text-xs text-zinc-400">兼容 <span className="text-zinc-200">GPT · Claude · Gemini · Qwen</span> 等主流 LLM</div>
              </div>

              <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-50 hover:underline underline-offset-4">
                {tAdvanced('cta')} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-zinc-500 font-mono">① MCP Assessment Output</div>
                  <div className="text-[10px] text-zinc-600 font-mono">structured_json</div>
                </div>
                <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
{`{
  "overall": 72,
  "pron": { "accuracy": 65, "integrity": 95, "fluency": 85, "rhythm": 70 },
  "details": [
    { "char": "record", "score": 58, "dp_type": "mispron",
      "phonemes": [{ "char": "r", "score": 45, "dp_type": "mispron" }] }
  ]
}`}
                </pre>
              </div>

              <div className="flex items-center justify-center py-0.5">
                <div className="h-3 w-px bg-white/10" />
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-emerald-400 font-mono">② LLM Teaching Response</div>
                  <div className="text-[10px] text-emerald-500/60 font-mono">natural_language</div>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {tValue('demo_llm_response')}
                </p>
              </div>

              <div className="flex items-center justify-center py-0.5">
                <div className="h-3 w-px bg-white/10" />
              </div>

              <div className="rounded-lg border border-violet-400/20 bg-violet-400/[0.04] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-violet-300 font-mono">③ Auto-Generated Exercise</div>
                  <div className="text-[10px] text-violet-300/60 font-mono">practice_loop</div>
                </div>
                <div className="text-sm text-zinc-200 font-medium mb-2 leading-relaxed">
                  &quot;Thirty-three thieves thought they thrilled the throne throughout Thursday.&quot;
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded px-2 py-0.5 text-zinc-400">🎯 /θ/ × 6</span>
                  <span className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded px-2 py-0.5 text-zinc-400">🎯 /r/ × 3</span>
                  <span className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded px-2 py-0.5 text-zinc-400">⏱ 预计 1.5 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 工作流程: 动态步骤 ━━━ */}
      <WorkflowSteps />

      {/* ━━━ 场景 A · AI 原生场景 ━━━ */}
      <section id="use-cases" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Scenarios · 01 / 02</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">AI 原生场景 · 让任意 Agent 都会听会说</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              驰声评分引擎与人工专家一致性 95%+，这份考试级能力通过 MCP 走进每个 AI 产品里。LLM 只要调用一次，就多了一只"听得懂人说话"的耳朵。
            </p>
          </FadeUp>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={0.08}>
            {[
              {
                icon: Bot,
                image: '/scene-tutor.png',
                tag: 'AI 口语私教 · 24h 陪练',
                title: '让 Claude / GPT 变成你的私人口语教练',
                desc: '用户一句"陪我练 5 分钟口语"，Agent 自动出题 → 听录音 → 评分 → 解释弱项 → 再出一题，对话本身就是评测。',
                bullets: ['对话式练习，无感评测', '个性化难度自适应', '定位具体音素 / 重音 / 停顿'],
              },
              {
                icon: BookOpen,
                image: '/scene-kids.png',
                tag: '儿童启蒙 · AI 伴读',
                title: '给绘本、点读笔、陪伴机器人装上"耳朵"',
                desc: '孩子对着智能硬件朗读，设备通过 MCP 调用评测引擎，LLM 实时给出趣味化纠音，家长同步拿到学情报告。',
                bullets: ['自然拼读 / 单词 / 句子评测', 'AI 生成儿童向奖励反馈', '支持硬件 + 云端混合部署'],
              },
              {
                icon: Network,
                image: '/scene-ecosystem.png',
                tag: '开发者 / Agent 生态',
                title: '一行 MCP 配置，任意 AI 工具秒获评测能力',
                desc: 'Cursor、Claude Desktop、扣子、Dify、豆包…… 任何支持 MCP 的客户端即插即用，AI Agent 瞬间拥有语音评测超能力。',
                bullets: ['stdio / Streamable HTTP 双协议', '16 种评测工具开箱即用', '与 LLM 原生工具调用融合'],
              },
            ].map((s) => (
              <StaggerItem key={s.title}>
                <HoverCard className="group rounded-xl border border-border/60 bg-background overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#fafafa] dark:bg-zinc-900 border-b border-border/40">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:invert"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-background/90 backdrop-blur-sm border border-border/60 rounded px-2 py-1 text-foreground/80">
                        <s.icon className="h-3 w-3" />
                        {s.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-base md:text-lg font-bold mb-2 leading-snug">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                    <ul className="mt-auto space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp delay={0.2} className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
              95%+ 与专家一致性
            </div>
            <span className="h-3 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
              教育部考试中心实测通过
            </div>
            <span className="h-3 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
              服务学习者 1 亿+
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ 场景 B · 嵌入你熟悉的载体 ━━━ */}
      <section id="use-cases-b" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Scenarios · 02 / 02</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">嵌入你熟悉的载体 · 零改造接入</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              不用从零搭 App、不用改造现有系统。在 IM、内容生产工具、出海产品里，一条 MCP 调用让"听说能力"融进工作流里，用户零学习成本就能拥有。
            </p>
          </FadeUp>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={0.08}>
            {[
              {
                icon: MessagesSquare,
                image: '/scene-im.png',
                tag: 'IM 协同 · 飞书 / 钉钉 / 企微',
                title: '把整个教学闭环搬进一条群聊',
                desc: '老师 @机器人发布任务，学生长按一条语音就提交，机器人秒出评分 + 错音高亮。班级 = 群，IM 账号即身份。',
                bullets: ['免 App / 免 H5 / 免账号', '作业下发 · 提交 · 批量统计', '天然多租户，班级即聊天室'],
              },
              {
                icon: Podcast,
                image: '/scene-podcast.png',
                tag: '内容创作 · 智能质检',
                title: '播客 / 短视频 / 有声书的 AI 质检助理',
                desc: '创作者录完一段，让 AI 检查吐字清晰度、语速、情感、停顿位置，自动标出需重录的时间点并给出优化建议。',
                bullets: ['精准定位需重录片段', '吐字 / 节奏 / 情感多维分析', '无缝嵌入剪映 / Audition 流程'],
              },
              {
                icon: Languages,
                image: '/scene-chinese.png',
                tag: '出海 App · 老外学中文',
                title: '让海外用户跟 AI 老师练一口地道中文',
                desc: '驰声中文引擎独有的声调 / 轻声 / 儿化 / 变调精细检测，让海外 App 里的中文口语教学真正"能听懂 · 能纠音"。',
                bullets: ['声调 · 儿化 · 变调精细识别', '汉字 / 拼音双路径评测', '词汇量等级与 HSK 对齐'],
              },
            ].map((s) => (
              <StaggerItem key={s.title}>
                <HoverCard className="group rounded-xl border border-border/60 bg-background overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[2/1] w-full overflow-hidden bg-[#fafafa] dark:bg-zinc-900 border-b border-border/40">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:invert"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-background/90 backdrop-blur-sm border border-border/60 rounded px-2 py-1 text-foreground/80">
                        <s.icon className="h-3 w-3" />
                        {s.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-base md:text-lg font-bold mb-2 leading-snug">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                    <ul className="mt-auto space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp delay={0.2} className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline underline-offset-4"
            >
              聊聊你的场景，我们一起把它跑通
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ Pricing ━━━ */}
      <section id="pricing" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-6">
          <FadeUp className="text-center mb-10">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Pricing</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{tPricing('title')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              按 <span className="text-foreground font-medium">调用量</span> + <span className="text-foreground font-medium">并发数</span> 阶梯计费，用得越多单价越低。具体报价请联系销售获取。
            </p>
          </FadeUp>

          <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* ── 左：阶梯价示意 ── */}
            <FadeUp className="lg:col-span-3">
              <div className="rounded-2xl border border-border/60 bg-background p-6 md:p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Tiered Pricing</div>
                    <h3 className="text-lg font-semibold">阶梯价模型示意</h3>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border/60 rounded-full px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
                    单价随调用量递减
                  </div>
                </div>

                {/* 示意图：阶梯柱状（纯示意，不显示具体数量） */}
                <div className="flex items-stretch justify-between gap-3 md:gap-5 h-52 md:h-60">
                  {[
                    { h: 92, label: '起步档', tone: 'bg-foreground' },
                    { h: 74, label: '标准档', tone: 'bg-foreground/75' },
                    { h: 58, label: '成长档', tone: 'bg-foreground/55' },
                    { h: 42, label: '规模档', tone: 'bg-foreground/35' },
                    { h: 28, label: '企业档', tone: 'bg-foreground/20' },
                  ].map((t) => (
                    <div key={t.label} className="flex-1 flex flex-col items-center min-w-0">
                      <div className="w-full flex-1 flex items-end justify-center pb-1.5">
                        <div
                          className={cn('w-full rounded-t-md transition-all', t.tone)}
                          style={{ height: `${t.h}%` }}
                        />
                      </div>
                      <div className="w-full border-t border-border/60 pt-2 text-center">
                        <div className="text-[11px] font-medium text-muted-foreground">{t.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* X 轴示意：调用量递增 */}
                <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                  <span>调用量 / 并发 小</span>
                  <div className="flex-1 mx-3 relative h-px bg-border/60">
                    <span className="absolute -right-0.5 -top-1 text-muted-foreground/70">▸</span>
                  </div>
                  <span>调用量 / 并发 大</span>
                </div>
                <div className="text-[11px] text-muted-foreground text-center mt-3 mb-6">
                  ↑ 柱高仅代表相对单价示意，具体阶梯与折扣以销售报价为准
                </div>

                {/* 分隔 */}
                <div className="h-px bg-border/60 my-5" />

                {/* 计费要点 */}
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { k: '调用量', v: '按每次成功评测计费，失败请求不扣量' },
                    { k: '并发数', v: '可单独购买加并发包，平滑应对流量高峰' },
                    { k: '阶梯递减', v: '每上一档单价自动下调，无需重新签约' },
                    { k: '免费额度', v: '注册即送试用次数，产品验证零门槛' },
                  ].map((r) => (
                    <div key={r.k} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{r.k}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{r.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* ── 右：在线咨询 + 小程序 ── */}
            <FadeUp delay={0.15} className="lg:col-span-2">
              <div className="rounded-2xl border border-border/60 bg-background p-6 md:p-7 h-full flex flex-col">
                <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Contact Sales</div>
                <h3 className="text-lg font-semibold mb-2">获取专属报价</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  告诉我们你的业务场景、预估调用量和并发需求，销售会在 1 个工作日内提供精准阶梯报价与 PoC 支持。
                </p>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors w-full"
                >
                  在线咨询销售 <ArrowUpRight className="h-4 w-4" />
                </Link>

                <a
                  href="mailto:sales@chivox.com"
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium rounded-lg border border-border hover:bg-muted/60 transition-colors w-full mt-2.5"
                >
                  发送邮件 · sales@chivox.com
                </a>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-[11px] text-muted-foreground">或扫码</span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative shrink-0 rounded-lg border border-border/60 overflow-hidden bg-white p-1.5">
                    <Image
                      src="/wechat-qr.png"
                      alt="驰声微信小程序"
                      width={104}
                      height={104}
                      unoptimized
                      className="h-[104px] w-[104px] object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium mb-1">微信扫码</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      了解更多驰声技术，<br />体验小程序评测 Demo。
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="mt-8 max-w-6xl mx-auto">
            <div className="rounded-lg border border-border/60 bg-background/60 backdrop-blur-sm px-6 py-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3 text-center">所有方案均包含</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  { icon: Check, text: 'MCP 标准协议接入' },
                  { icon: Check, text: '中 / 英双语评测' },
                  { icon: Check, text: '流式 + 文件双模式' },
                  { icon: Check, text: '20+ 细粒度评分维度' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-muted-foreground">
                    <item.icon className="h-3.5 w-3.5 text-foreground shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <div data-fp-section className="min-h-screen flex flex-col justify-center border-t border-border/40">
        <FAQ />
      </div>

      {/* ━━━ About ━━━ */}
      <section id="about" data-fp-section className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <FadeUp className="text-center mb-12">
              <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">About Chivox</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{tAbout('title')}</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">{tAbout('description')}</p>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-xl overflow-hidden max-w-3xl mx-auto mb-10" staggerDelay={0.12}>
              <StaggerItem className="bg-background/80 backdrop-blur-sm px-4 py-6 text-center">
                <div className="text-3xl md:text-4xl font-bold tracking-tight">
                  <CountUp value={10} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">{tAbout('stat1_label')}</div>
              </StaggerItem>
              <StaggerItem className="bg-background/80 backdrop-blur-sm px-4 py-6 text-center">
                <div className="text-3xl md:text-4xl font-bold tracking-tight">
                  <CountUp value={20} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">{tAbout('stat2_label')}</div>
              </StaggerItem>
              <StaggerItem className="bg-background/80 backdrop-blur-sm px-4 py-6 text-center">
                <div className="text-3xl md:text-4xl font-bold tracking-tight">
                  <CountUp value={99} suffix="%" />
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">{tAbout('stat3_label')}</div>
              </StaggerItem>
            </StaggerContainer>

            {/* 里程碑时间线 */}
            <FadeUp delay={0.2} className="mb-10">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-5 text-center">Milestones</div>
              <div className="relative">
                <div className="absolute left-0 right-0 top-3 h-px bg-border/60 hidden md:block" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {[
                    { year: '2011', label: '驰声创立，专注语音评测' },
                    { year: '2015', label: '入选教育部考试中心白名单' },
                    { year: '2019', label: '全球学习者突破 1 亿' },
                    { year: '2023', label: '接入 GPT，启动 LLM 语义分析' },
                    { year: '2025', label: '开源 Chivox MCP Server' },
                  ].map((m) => (
                    <div key={m.year} className="flex flex-col items-center text-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground relative z-10 mb-4 ring-4 ring-muted/30" />
                      <div className="text-sm font-bold tracking-tight mb-1">{m.year}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* CTA + 外链 */}
            <FadeUp delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all"
              >
                开始接入 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://www.chivox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-full border border-border/80 hover:border-foreground/40 hover:bg-background transition-all"
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
