'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  AudioWaveform,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Gauge,
  Key,
  Loader2,
  Mail,
  MessageSquareText,
  Sparkles,
  Terminal,
  Waves,
  Languages,
  Bot,
  Baby,
  GraduationCap,
  Globe2,
  Zap,
  Mic2,
  ShieldCheck,
  Lightbulb,
  Play,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeUp, StaggerContainer, StaggerItem, CountUp } from '@/components/animated-section';
import {
  sendGlobalContactEmail,
  type GlobalContactFormData,
  type GlobalContactUseCase,
} from '@/app/actions/send-global-contact';

/* ─────────────────────────────────────────────────────────────
 * Standalone English landing for overseas developers.
 *
 * Design intent:
 *  • First fold = what it does + how to plug it in, in one screen.
 *  • Content is dev-first: code, JSON, numbers; marketing copy kept minimal.
 *  • Visuals drawn directly in JSX (waveform, score meter, phoneme chips,
 *    tone chart) so the page ships fast with no extra assets.
 *  • Aesthetic borrowed from tavily.com — neutral palette, quiet dividers,
 *    generous spacing, cards over gradients.
 * ────────────────────────────────────────────────────────── */

const MCP_CLIENTS = [
  'Cursor',
  'Claude Desktop',
  'Cline',
  'Windsurf',
  'Zed',
  'LangChain',
  'LlamaIndex',
  'OpenAI Agents SDK',
];

/* ── code snippets for the hero's right card ─────────────── */
const INSTALL_TABS = [
  {
    id: 'cursor',
    label: 'Cursor',
    filename: '~/.cursor/mcp.json',
    code: `{
  "mcpServers": {
    "chivox": {
      "command": "npx",
      "args": ["-y", "@chivox/mcp"],
      "env": { "CHIVOX_API_KEY": "sk_live_..." }
    }
  }
}`,
  },
  {
    id: 'claude',
    label: 'Claude Desktop',
    filename: 'claude_desktop_config.json',
    code: `{
  "mcpServers": {
    "chivox": {
      "command": "npx",
      "args": ["-y", "@chivox/mcp"],
      "env": { "CHIVOX_API_KEY": "sk_live_..." }
    }
  }
}`,
  },
  {
    id: 'node',
    label: 'Node.js',
    filename: 'agent.ts',
    code: `import { Client } from '@modelcontextprotocol/sdk/client';

const chivox = await Client.connect({ name: 'chivox' });

const result = await chivox.callTool('assess_speech', {
  language: 'en-US',
  reference_text: 'The weather is gorgeous today.',
  audio_file_path: './take-01.wav',
});`,
  },
  {
    id: 'python',
    label: 'Python',
    filename: 'agent.py',
    code: `from mcp import Client

async with Client("chivox") as chivox:
    result = await chivox.call_tool(
        "assess_speech",
        language="zh-CN",
        reference_text="你好，今天天气很好",
        audio_file_path="./greeting.wav",
    )`,
  },
];

/* ── core capability cards (What can this MCP do?) ───────── */
type CapabilityVisual = 'meters' | 'bilingual' | 'dialogue' | 'target';
type CapabilityTone = 'emerald' | 'sky' | 'violet' | 'amber';

const CORE_CAPABILITIES: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  chips: string[];
  tone: CapabilityTone;
  visual: CapabilityVisual;
}[] = [
  {
    icon: Mic2,
    eyebrow: 'assess',
    title: 'Score a learner\u2019s speech',
    body:
      'Stream mic audio or post a file. Get overall / accuracy / integrity / fluency / rhythm scores, plus word and phoneme-level diagnostics.',
    chips: ['overall', 'accuracy', 'fluency', 'rhythm', 'phoneme'],
    tone: 'emerald',
    visual: 'meters',
  },
  {
    icon: Languages,
    eyebrow: 'languages',
    title: 'Mandarin &amp; English, natively',
    body:
      'Tones, pinyin, neutral tone, erhua, tone sandhi for Chinese. Stress, rhythm, CEFR-aligned scoring for English. One flag switches between them.',
    chips: ['zh-CN', 'en-US', 'pinyin', 'tones', 'CEFR'],
    tone: 'sky',
    visual: 'bilingual',
  },
  {
    icon: MessageSquareText,
    eyebrow: 'converse',
    title: 'Score free-flow dialogue',
    body:
      'Open-ended AI-talk evaluation returns 5-dimensional scores on fluency, content, grammar, accuracy and rhythm — ready for the next LLM turn.',
    chips: ['AI-talk', 'open-question', '5-dim', 'streaming'],
    tone: 'violet',
    visual: 'dialogue',
  },
  {
    icon: Sparkles,
    eyebrow: 'drill',
    title: 'Personalize the next practice',
    body:
      'Feed the JSON straight to GPT / Claude / Gemini. Use the shipped prompt-skill to generate targeted drills for weak phonemes or tones.',
    chips: ['GPT', 'Claude', 'Gemini', 'Qwen', 'DeepSeek'],
    tone: 'amber',
    visual: 'target',
  },
];

const CAPABILITY_TONE: Record<CapabilityTone, {
  accent: string;
  iconBg: string;
  iconColor: string;
  eyebrow: string;
  glow: string;
  ring: string;
}> = {
  emerald: {
    accent: 'from-emerald-400/70 via-emerald-500/50 to-transparent',
    iconBg: 'bg-emerald-500/10 border-emerald-500/25',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
    eyebrow: 'text-emerald-700/80 dark:text-emerald-300/80',
    glow: 'from-emerald-400/25',
    ring: 'hover:ring-emerald-500/30',
  },
  sky: {
    accent: 'from-sky-400/70 via-sky-500/50 to-transparent',
    iconBg: 'bg-sky-500/10 border-sky-500/25',
    iconColor: 'text-sky-700 dark:text-sky-300',
    eyebrow: 'text-sky-700/80 dark:text-sky-300/80',
    glow: 'from-sky-400/25',
    ring: 'hover:ring-sky-500/30',
  },
  violet: {
    accent: 'from-violet-400/70 via-violet-500/50 to-transparent',
    iconBg: 'bg-violet-500/10 border-violet-500/25',
    iconColor: 'text-violet-700 dark:text-violet-300',
    eyebrow: 'text-violet-700/80 dark:text-violet-300/80',
    glow: 'from-violet-400/25',
    ring: 'hover:ring-violet-500/30',
  },
  amber: {
    accent: 'from-amber-400/80 via-amber-500/50 to-transparent',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
    iconColor: 'text-amber-700 dark:text-amber-300',
    eyebrow: 'text-amber-700/80 dark:text-amber-300/80',
    glow: 'from-amber-400/25',
    ring: 'hover:ring-amber-500/30',
  },
};

/* ── use-case cards, each with a colorful inline illustration ─── */
type UseCaseArt =
  | 'mandarin'
  | 'english'
  | 'kids'
  | 'podcast'
  | 'voice'
  | 'ecosystem';

const USE_CASES: {
  art: UseCaseArt;
  tag: string;
  title: string;
  body: string;
}[] = [
  {
    art: 'mandarin',
    tag: 'Mandarin Coach',
    title: 'Ship a tireless Beijing-accent Mandarin coach',
    body:
      'Phoneme + tone + sandhi scoring in one payload. Your agent explains why <span class="font-zh">睡觉</span> drifted into <span class="font-zh">水饺</span>, drills the tone pair, and tracks mastery session over session — built for the 25M+ global Mandarin learners your competitors can&rsquo;t serve on Whisper.',
  },
  {
    art: 'voice',
    tag: 'AI Interviewer',
    title: 'Score candidate speech, not just transcripts',
    body:
      'Screen English fluency, pronunciation confidence and rhythm at scale. Your LLM reasons over numbers, not vibes — explainable rubrics every HR team will trust.',
  },
  {
    art: 'podcast',
    tag: 'Contact Center QA',
    title: 'Agent training &amp; call-script compliance',
    body:
      'Evaluate standard-phrase delivery, articulation, pacing and keyword hits for call-center reps. Flag exactly which second drifted off-script and auto-generate coaching drills.',
  },
  {
    art: 'ecosystem',
    tag: 'Serious Games &amp; XR',
    title: 'Voice-gated NPCs and pronunciation-powered gameplay',
    body:
      'Players unlock spells, dialogues or levels by saying the phrase correctly. Get a pass/fail plus the exact phoneme that missed, at <300 ms p95 — fast enough for real-time game loops.',
  },
];

/* ── benchmarks ──────────────────────────────────────────── */
const BENCHMARK_TABS = [
  {
    id: 'correlation',
    label: 'Expert correlation',
    metric: '95%+',
    metricLabel: 'agreement with human experts',
    body:
      'Scores align with certified human expert rubrics at 95%+ correlation. Validated by national standardized speaking tests in 100+ cities.',
    chart: 'correlation',
  },
  {
    id: 'latency',
    label: 'Latency',
    metric: '<300ms',
    metricLabel: 'p50 streaming response',
    body:
      'Streaming WebSocket sessions return multi-dimensional scores in a few hundred milliseconds after end-of-speech. Perfect for real-time tutoring UX.',
    chart: 'latency',
  },
  {
    id: 'coverage',
    label: 'Coverage',
    metric: '7 task types',
    metricLabel: 'word · sentence · paragraph · semi-open · open · free · AI-talk',
    body:
      'One integration covers every stage of your learner journey — from single-word phonics to open-ended conversation.',
    chart: 'coverage',
  },
  {
    id: 'scale',
    label: 'Scale',
    metric: '9.2B+',
    metricLabel: 'evaluations per year · 185 countries',
    body:
      'Production traffic serving ministries, test centers, and consumer apps, with 99.99% uptime SLA on enterprise plans.',
    chart: 'scale',
  },
];

/* ── FAQ ─────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'How fast can I integrate?',
    a: 'Minutes. Drop one object into your MCP client config, set the API key, and your agent can call `assess_speech` as a tool. No SDK wrappers, no ML setup.',
  },
  {
    q: 'Which languages are supported?',
    a: 'Mandarin Chinese and English are first-class, both with phoneme-level scoring. Chinese includes dedicated handling for tones, pinyin, neutral tone, erhua and tone sandhi. English includes CEFR-aligned scoring with stress and rhythm diagnostics.',
  },
  {
    q: 'Which MCP clients work?',
    a: 'Cursor, Claude Desktop, Cline, Windsurf, Zed, and any other MCP-compatible client. Also works as a tool inside LangChain, LlamaIndex and the OpenAI Agents SDK via the MCP adapter.',
  },
  {
    q: 'Can I stream audio in real time?',
    a: 'Yes. A WebSocket streaming session accepts mic audio frames and returns scores within a few hundred milliseconds of end-of-speech. File evaluation supports mp3 / wav / m4a / ogg / aac / pcm.',
  },
  {
    q: 'How accurate is the scoring?',
    a: 'The underlying engine has 95%+ correlation with human expert rubrics, validated by national standardized tests used across 100+ cities, with 9.2B+ evaluations per year.',
  },
  {
    q: 'What does it cost?',
    a: 'Free credits on signup. Tiered pricing scales with usage — higher volumes get lower unit prices. Contact sales for enterprise SLAs.',
  },
];

export default function GlobalLandingPage() {
  const [installTab, setInstallTab] = useState(INSTALL_TABS[0].id);
  const [benchmark, setBenchmark] = useState(BENCHMARK_TABS[0].id);

  const activeInstall = INSTALL_TABS.find((t) => t.id === installTab) ?? INSTALL_TABS[0];
  const activeBench = BENCHMARK_TABS.find((t) => t.id === benchmark) ?? BENCHMARK_TABS[0];

  return (
    <main className="flex-1 flex flex-col relative">
      {/* shared warm ambient — matches /global/demo's AmbientBackdrop so the
          landing + playground read as one continuous cream surface. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 560px at 10% -10%, #ecfdf5 0%, transparent 55%),' +
              'radial-gradient(900px 520px at 95% 10%, #fef3c7 0%, transparent 55%),' +
              'radial-gradient(800px 520px at 50% 110%, #fde2e4 0%, transparent 60%),' +
              '#fbf6e9',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 25%, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 25%, black 30%, transparent 80%)',
          }}
        />
      </div>
      <TopNav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * HERO — "What it does" on the left, "how to plug it in" on the right.
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden border-b border-[#e9e2d2]/70">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 30%, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 30%, black 30%, transparent 80%)',
            }}
          />
          {/* soft colored halos */}
          <div className="absolute -top-40 left-[-8%] w-[620px] h-[620px] rounded-full blur-3xl bg-gradient-to-br from-emerald-300/30 via-sky-300/15 to-transparent" />
          <div className="absolute top-[-10%] right-[-8%] w-[680px] h-[560px] rounded-full blur-3xl bg-gradient-to-bl from-violet-300/25 via-rose-200/20 to-transparent" />
          {/* brand waveform — very subtle, drifts behind text */}
          <HeroWaveGlyph />
        </div>

        <div className="container mx-auto px-5 sm:px-7 lg:px-10 pt-8 pb-12 md:pt-10 md:pb-16 max-w-7xl 2xl:max-w-[min(100%,90rem)]">
          {/* ── two-column hero: text · ear illustration ── */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7">
              <FadeUp>
                <span className="inline-flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-[11px] font-medium bg-white/70 backdrop-blur-md border border-zinc-900/[0.08] text-foreground/80 mb-8 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.10)]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
                    live
                  </span>
                  The listening layer for voice-native agents
                </span>
              </FadeUp>

              <FadeUp delay={0.06}>
                <h1
                  className="text-crisp text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[1.1] mb-9"
                  style={{
                    fontWeight: 680,
                    letterSpacing: '-0.045em',
                    fontFeatureSettings: '"ss01" 1, "cv11" 1',
                  }}
                >
                  {/* line 1 */}
                  <span className="block text-zinc-900">Your agent can hear them.</span>

                  {/* line 2 — heavy sans + emerald highlighter swipe on "grade" */}
                  <span
                    className="block text-zinc-900 mt-3"
                    style={{ fontWeight: 900, letterSpacing: '-0.045em' }}
                  >
                    Now it can{' '}
                    <span className="relative inline-block">
                      {/* highlighter swipe — sits behind the word */}
                      <span
                        aria-hidden
                        className="absolute pointer-events-none"
                        style={{
                          left: '-0.08em',
                          right: '-0.08em',
                          top: '54%',
                          bottom: '8%',
                          background:
                            'linear-gradient(100deg, rgba(110,231,183,0.55), rgba(52,211,153,0.72))',
                          borderRadius: '6px',
                          transform: 'skewX(-6deg)',
                          zIndex: 0,
                        }}
                      />
                      <span className="relative z-10">grade</span>
                    </span>{' '}
                    them.
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.14}>
                <p className="text-[15.5px] md:text-[17px] text-muted-foreground leading-relaxed max-w-2xl mb-8">
                  Chivox MCP turns raw speech into a{' '}
                  <strong className="text-foreground/90 font-semibold">dense, agent-ready payload</strong>{' '}
                  &mdash; phoneme scores, stress, tone, fluency, audio quality &mdash; all in one MCP
                  call, any LLM. The listening layer under every voice-native agent you&rsquo;re about to ship.
                </p>
              </FadeUp>

              {/* CTA row — left-aligned */}
              <FadeUp delay={0.2}>
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <Link
                    href="/dev-en/login"
                    className="group inline-flex items-center gap-2 h-11 pl-5 pr-2 text-sm font-semibold rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]"
                  >
                    Start free
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                  <Link
                    href="/global/demo"
                    className="group relative inline-flex items-center gap-2 h-11 pl-4 pr-2 text-sm font-semibold rounded-full border border-emerald-500/35 bg-white/70 text-emerald-800 backdrop-blur-sm shadow-[0_8px_22px_-12px_rgba(16,185,129,0.55)] hover:border-emerald-500/60 hover:bg-white hover:-translate-y-px hover:shadow-[0_12px_28px_-12px_rgba(16,185,129,0.7)] transition-all duration-200"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                        <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping" aria-hidden />
                        <Play className="relative h-2.5 w-2.5 fill-emerald-700 text-emerald-700" strokeWidth={0} />
                      </span>
                      See it run
                    </span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 group-hover:bg-emerald-500/25 group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </FadeUp>

              {/* 3-value benefit strip */}
              <FadeUp delay={0.26}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Waves,
                      title: 'Deep linguistic understanding',
                      sub: 'Go beyond transcripts.',
                      bg: 'bg-emerald-500/10',
                      fg: 'text-emerald-600',
                    },
                    {
                      icon: ShieldCheck,
                      title: 'Enterprise-ready',
                      sub: 'Secure. Scalable. Reliable.',
                      bg: 'bg-sky-500/10',
                      fg: 'text-sky-600',
                    },
                    {
                      icon: Zap,
                      title: 'Real-time intelligence',
                      sub: 'React in the moment.',
                      bg: 'bg-amber-500/10',
                      fg: 'text-amber-600',
                    },
                  ].map((v) => (
                    <div key={v.title} className="flex items-start gap-2.5">
                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${v.bg}`}>
                        <v.icon className={`h-4 w-4 ${v.fg}`} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold tracking-[-0.005em] text-foreground leading-tight">
                          {v.title}
                        </div>
                        <div className="text-[12px] text-muted-foreground mt-0.5">{v.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* RIGHT COLUMN — custom ear illustration */}
            <FadeUp delay={0.1} className="lg:col-span-5">
              <div className="relative aspect-[420/500] w-full max-w-[min(100%,640px)] ml-auto select-none pointer-events-none">
                <HeroEarArt />
              </div>
            </FadeUp>
          </div>

          {/* prominent install terminal — centered below, spans content width */}
          <FadeUp delay={0.32}>
            <div className="mt-12 md:mt-14">
              <HeroInstallPill />
            </div>
          </FadeUp>

          {/* deep-dive carousel — below the fold */}
          <FadeUp delay={0.4}>
            <div className="mt-20 max-w-6xl xl:max-w-7xl mx-auto">
              <HeroCarousel />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * CORE CAPABILITIES — what the MCP can do, in 4 tiles
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-16 md:py-20 border-b border-[#e9e2d2]/70">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp className="mb-10 text-center max-w-2xl mx-auto">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">/what-it-does</div>
            <h2 className="heading-display text-3xl md:text-4xl tracking-[-0.02em] mb-3">
              The listening layer, as four MCP tools
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Twenty years of pronunciation-assessment R&amp;D, exposed as a structured payload your LLM
              can reason over. Drop into LangChain, LlamaIndex, the OpenAI Agents SDK or any custom loop —
              skip the months of DSP work.
            </p>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 gap-4">
            {CORE_CAPABILITIES.map((c) => {
              const tone = CAPABILITY_TONE[c.tone];
              return (
                <StaggerItem key={c.eyebrow}>
                  <div
                    className={`group relative glass-card h-full p-5 md:p-6 flex flex-col sm:flex-row gap-5 overflow-hidden transition-all duration-300 hover:-translate-y-[2px] ring-1 ring-transparent ${tone.ring}`}
                  >
                    {/* colored corner glow */}
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full blur-3xl bg-gradient-to-br ${tone.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    {/* accent strip */}
                    <div
                      aria-hidden
                      className={`absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-gradient-to-b ${tone.accent}`}
                    />

                    {/* LEFT — compact visual preview */}
                    <div className="sm:w-[190px] sm:shrink-0 self-start">
                      <CapabilityVisual id={c.visual} />
                    </div>

                    {/* RIGHT — header + body + chips */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`h-8 w-8 rounded-lg border ${tone.iconBg} flex items-center justify-center`}>
                          <c.icon className={`h-4 w-4 ${tone.iconColor}`} />
                        </div>
                        <span className={`text-[10.5px] font-mono tracking-wide uppercase ${tone.eyebrow}`}>
                          /{c.eyebrow}
                        </span>
                      </div>

                      <h3
                        className="text-[17px] font-semibold tracking-[-0.01em] mb-1.5"
                        dangerouslySetInnerHTML={{ __html: c.title }}
                      />
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{c.body}</p>

                      <div className="mt-auto flex flex-wrap gap-1.5">
                        {c.chips.map((chip) => (
                          <span
                            key={chip}
                            className="inline-flex items-center rounded-md border border-zinc-900/[0.08] bg-white/60 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-mono text-foreground/70"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * QUICKSTART — 3 steps, dead simple
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="quickstart" className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp className="mb-12 text-center">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">/quickstart</div>
            <h2 className="heading-display text-3xl md:text-4xl tracking-[-0.02em] mb-3">
              Production-ready in 3 steps
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Watch it run. Paste config → server connects → your LLM calls a tool and gets structured scores back.
            </p>
            <div className="mt-4 flex items-center justify-center">
              <Link
                href="/global/docs#quickstart"
                className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-800 hover:text-emerald-900 transition-colors"
              >
                Full docs &amp; API reference
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </FadeUp>

          <QuickstartDemo
            installTab={installTab}
            setInstallTab={setInstallTab}
            activeInstall={activeInstall}
          />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * THREE-STAGE PIPELINE — why MCP, not just another eval API
       * (MOVED up: platform claim must precede the Mandarin proof.)
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="reasoning-engine-trigger" className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeUp className="mb-8 max-w-3xl">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
              /reasoning-engine-trigger
            </div>
            <h2 className="heading-display text-3xl md:text-[42px] tracking-[-0.02em] mb-3 leading-[1.1]">
              It&apos;s not just a score.
              <br />
              <span className="text-muted-foreground/90">It&apos;s a reasoning engine trigger.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You saw how simple the integration is. Now look at what actually comes back. The MCP response
              is a <strong className="text-foreground/90">wide JSON surface</strong>: not only overall and{' '}
              <span className="font-mono text-foreground/80">pron.*</span> sub-scores, but fluency (WPM, pauses),{' '}
              <span className="font-mono text-foreground/80">audio_quality</span> (SNR, clip, level), and a{' '}
              <span className="font-mono text-foreground/80">details[]</span> array where each word or character carries millisecond
              windows, <span className="font-mono text-foreground/80">dp_type</span>, stress, liaison, <span className="font-mono text-foreground/80">phonemes[]</span> with IPA, plus Mandarin{' '}
              <span className="font-mono text-foreground/80">tone</span> objects and confidence distributions. That density is what lets an LLM do secondary diagnosis and
              tertiary profiling &mdash; not a one-number API.
            </p>
          </FadeUp>

          <PayloadFieldStrip />

          <PipelineStages />

          {/* concrete code proof — the Aha moment */}
          <div className="mt-14">
            <FadeUp>
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-violet-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  Live demo
                </span>
                <span className="text-[12.5px] text-muted-foreground">
                  Watch pass ② run. <span className="text-foreground/85">A Mandarin payload in</span> — a
                  textbook-grade diagnosis out, streamed by o1-mini.
                </span>
              </div>
            </FadeUp>
            <ReasoningDemo />
          </div>

          <FadeUp delay={0.3}>
            <ul className="mt-10 grid md:grid-cols-3 gap-3 text-[13px] leading-relaxed">
              {[
                {
                  t: 'Secondary · Pattern mining',
                  b: 'Agent surfaces session-level regularities: "unvoiced consonants failing 3 sessions in a row." No rule engine — pure LLM reasoning over dense data.',
                },
                {
                  t: 'Tertiary · Student profiling',
                  b: 'Stack sessions in any vector DB or row store. Your agent plots learning curves and predicts next-exam CEFR / HSK band.',
                },
                {
                  t: 'Combo · Diagnose + prescribe',
                  b: 'Chain Chivox MCP with O1 / Sonnet 3.5 / Gemini 2 for a world-class diagnosis-to-prescription loop, out of the box.',
                },
              ].map((c) => (
                <li
                  key={c.t}
                  className="flex gap-3 rounded-xl border border-zinc-900/[0.08] bg-white/55 backdrop-blur-sm px-4 py-3.5"
                >
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                  <div>
                    <div className="font-semibold tracking-tight mb-0.5">{c.t}</div>
                    <div className="text-muted-foreground">{c.b}</div>
                  </div>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * MANDARIN DEPTH — concrete proof the payload resolves the
       * hardest acoustic signals. Technical proof, not market sell.
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="mandarin-moat"
        className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70 scroll-mt-24"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp className="mb-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
              <span>/payload-depth</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[9px] font-mono text-rose-600 dark:text-rose-400 normal-case tracking-normal">
                <span className="h-1 w-1 rounded-full bg-rose-500" />
                Depth proof
              </span>
            </div>
            <h2 className="heading-display text-3xl md:text-[42px] tracking-[-0.02em] mb-3 leading-[1.1]">
              Mandarin is where the payload proves itself.
              <br />
              <span className="text-muted-foreground/90">If it resolves tonal sandhi, it resolves anything.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Four tones, sandhi, erhua, retroflex &mdash; the acoustic edge cases that kill generic STT.
              Chivox MCP returns tone objects, confidence distributions and per-phoneme windows on top of
              the same <span className="font-mono text-foreground/80">pron.*</span> /{' '}
              <span className="font-mono text-foreground/80">details[]</span> shape every other language ships.
              Here&rsquo;s the signal your agent actually sees.
            </p>
          </FadeUp>

          {/* ── coverage proof strip — capability chips, no market TAM ── */}
          <FadeUp delay={0.06}>
            <div className="mb-8 rounded-xl border border-rose-500/15 bg-gradient-to-r from-rose-50/70 via-amber-50/50 to-rose-50/30 px-4 md:px-5 py-3.5 flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <Globe2 className="h-3.5 w-3.5 text-rose-600" />
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose-700/90">
                  Coverage
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 flex-1 min-w-0">
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="heading-display text-[17px] md:text-[19px] tabular-nums tracking-[-0.02em] text-rose-700">
                    HSK 1-9
                  </span>
                  <span className="text-[12.5px] text-foreground/75">
                    lexical ladder covered
                  </span>
                </span>
                <span className="hidden md:inline-block h-3 w-px bg-rose-500/25" />
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="heading-display text-[17px] md:text-[19px] tabular-nums tracking-[-0.02em] text-rose-700">
                    5 tones
                  </span>
                  <span className="text-[12.5px] text-foreground/75">
                    + sandhi + erhua resolved
                  </span>
                </span>
                <span className="hidden md:inline-block h-3 w-px bg-rose-500/25" />
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="heading-display text-[17px] md:text-[19px] tabular-nums tracking-[-0.02em] text-rose-700">
                    95%+
                  </span>
                  <span className="text-[12.5px] text-foreground/75">
                    agreement with human raters
                  </span>
                </span>
              </div>
              <div className="shrink-0 inline-flex items-center gap-1.5 text-[12.5px] italic text-foreground/80">
                <ArrowRight className="h-3.5 w-3.5 text-rose-600" />
                Same payload shape, hardest signal.
              </div>
            </div>
          </FadeUp>

          {/* condensed feature chip row */}
          <FadeUp delay={0.08}>
            <div className="mb-8 flex flex-wrap gap-2">
              {[
                '4 tones + T5',
                'Tone sandhi',
                'Erhua · 儿化音',
                'Pinyin align',
                'Code-switch zh ↔ en',
                'HSK 1-9',
              ].map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/20 bg-rose-500/[0.06] px-2.5 py-1 text-[11.5px] font-mono text-rose-700 dark:text-rose-300"
                >
                  <span className="h-1 w-1 rounded-full bg-rose-500" />
                  {f}
                </span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <TonePanel />
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-6 rounded-xl border border-zinc-900/[0.08] bg-white/55 backdrop-blur-sm p-5 md:p-6">
              <div className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-muted-foreground mb-2">
                Code-switching · cross-lingual scoring
              </div>
              <p className="text-[13.5px] text-foreground/80 leading-relaxed">
                Score a heritage speaker mid-sentence as they flip between languages &mdash;{' '}
                <span className="italic">
                  &ldquo;I told her <span className="font-zh">我下周回家</span> and she was thrilled.&rdquo;
                </span>{' '}
                Returns separate EN / zh sub-scores plus a blended fluency index. Same payload contract,
                two languages interleaved.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div className="mt-6 text-[12.5px] text-muted-foreground">
              Looking to ship a Mandarin coach on top of this?{' '}
              <a
                href="#use-cases"
                className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-medium transition-colors"
              >
                See the build-a-tutor use case
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * USE CASES — with real imagery
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="use-cases" className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp className="mb-12 max-w-2xl">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">/use-cases</div>
            <h2 className="heading-display text-3xl md:text-4xl tracking-[-0.02em] mb-3">
              Built for what developers actually ship
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tutors, coaches, companions, QA tooling — pick the scenario that\u2019s yours and see how the
              agent loop looks in practice.
            </p>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((u) => (
              <StaggerItem key={u.tag}>
                <div className="group rounded-2xl border border-zinc-900/[0.08] bg-white/80 backdrop-blur-sm overflow-hidden h-full flex flex-col hover:border-zinc-900/25 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] transition-all duration-300">
                  <div className="relative aspect-[16/10] w-full border-b border-zinc-900/[0.06] overflow-hidden">
                    <UseCaseArtwork id={u.art} />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3
                      className="text-[15px] font-semibold tracking-[-0.01em] mb-2 leading-snug"
                      dangerouslySetInnerHTML={{ __html: u.title }}
                    />
                    <p
                      className="text-[13px] text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: u.body }}
                    />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * BENCHMARKS — quiet cards with inline micro-charts
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70 warm-card-bleed">
        <div className="container mx-auto px-6 max-w-6xl relative">
          <FadeUp className="mb-10">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">/benchmarks</div>
            <h2 className="heading-display text-3xl md:text-4xl tracking-[-0.02em] mb-3">
              Speech scoring driven by research
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              The engine behind Chivox MCP is 20 years of R&amp;D in pronunciation assessment. Here\u2019s how it
              holds up in production.
            </p>
          </FadeUp>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {BENCHMARK_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBenchmark(t.id)}
                    className={`relative text-left px-4 py-3 rounded-lg text-sm whitespace-nowrap transition-all ${
                      t.id === benchmark
                        ? 'bg-background text-foreground border border-border/60 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/60 border border-transparent'
                    }`}
                  >
                    <span className="font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-border/60 bg-background p-7 md:p-9 h-full">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-5">
                  <div>
                    <div className="text-5xl md:text-6xl heading-display tracking-[-0.03em] leading-none mb-2">
                      {activeBench.metric}
                    </div>
                    <div className="text-sm text-muted-foreground">{activeBench.metricLabel}</div>
                  </div>
                  <BenchmarkMicroChart id={activeBench.chart} />
                </div>
                <div className="h-px bg-border/60 my-5" />
                <p className="text-foreground/85 leading-relaxed">{activeBench.body}</p>
              </div>
            </div>
          </div>

          <StaggerContainer className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 9.2, suffix: 'B+', label: 'evaluations per year' },
              { value: 95, suffix: '%+', label: 'correlation with human experts' },
              { value: 185, suffix: '', label: 'countries & regions' },
              { value: 20, suffix: ' yrs', label: 'in speech AI research' },
            ].map((s) => (
              <StaggerItem key={s.label}>
                <div className="glass-card px-5 py-6 text-center">
                  <div className="text-2xl md:text-3xl heading-display tracking-[-0.02em] tabular-nums">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* trust bullets — lifted from the old Trust section */}
          <FadeUp delay={0.15}>
            <div className="mt-8 grid md:grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                'Validated by national testing centers for standardized speaking exams',
                '14+ granted patents in speech assessment',
                '99.99% uptime SLA for enterprise deployments',
                'GDPR-friendly data handling for EU markets',
              ].map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-[13px] text-foreground/80">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * FAQ
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70">
        <div className="container mx-auto px-6 max-w-4xl">
          <FadeUp className="mb-10 text-center">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">/faq</div>
            <h2 className="heading-display text-3xl md:text-4xl tracking-[-0.02em]">
              Frequently asked questions
            </h2>
          </FadeUp>

          <div className="divide-y divide-border/60 border-y border-border/60">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="text-base font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                    {f.q}
                  </span>
                  <span className="h-6 w-6 rounded-full border border-border/60 flex items-center justify-center shrink-0 text-muted-foreground group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * RUNTIME — the day-2 stuff ops teams ask about.
       * Absorbs the old compliance strip (stateless/GDPR) into the
       * 6-tile grid so privacy is one of the runtime signals, not
       * a separate footer note.
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="runtime"
        className="relative py-20 md:py-24 border-b border-[#e9e2d2]/70 scroll-mt-24"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <FadeUp className="mb-10 max-w-2xl">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">/runtime</div>
            <h2 className="heading-display text-3xl md:text-4xl tracking-[-0.02em] mb-3 leading-[1.1]">
              Built like infrastructure you can bet a launch on.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Chivox MCP is not a Saturday demo. Keys, budgets, alerts, uptime &mdash; the day-2 stuff
              your ops team asks about before signing. Everything visible in the dashboard, scriptable
              via API.
            </p>
          </FadeUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                icon: Key,
                eyebrow: 'keys',
                title: 'Starter key → paid key',
                body:
                  'Free credits on signup. Flip to paid without re-integrating — same endpoint, same JSON. Keys scoped per environment, rotated from the dashboard.',
                chip: 'Free → paid · no migration',
                tone: 'emerald',
              },
              {
                icon: Gauge,
                eyebrow: 'budgets',
                title: 'Spend caps you can trust',
                body:
                  'Hard monthly ceilings per key. When the cap is hit, calls return a structured 429 — your agent can surface billing state to users instead of failing opaquely.',
                chip: 'Hard cap · structured 429',
                tone: 'amber',
              },
              {
                icon: Bell,
                eyebrow: 'alerts',
                title: 'Low-balance alerts',
                body:
                  'Email notifications at 80% / 90% / 100% of spend or credit balance. Webhook delivery available for Slack, PagerDuty, or internal billing systems.',
                chip: '80 · 90 · 100% thresholds',
                tone: 'rose',
              },
              {
                icon: BarChart3,
                eyebrow: 'observability',
                title: 'Usage visibility',
                body:
                  'Per-key usage, latency percentiles, tool breakdown, error reasons — live in dashboard, exportable via API. Debug integrations without opening a ticket.',
                chip: 'Dashboard + export API',
                tone: 'sky',
              },
              {
                icon: Zap,
                eyebrow: 'privacy',
                title: 'Stateless streaming',
                body:
                  'Audio scored in-memory, never stockpiled, never used for training. You own the data — JSON out, zero audio copies. GDPR · CCPA · SOC 2 aligned.',
                chip: 'TTL: 0s · GDPR · CCPA · SOC 2',
                tone: 'violet',
              },
              {
                icon: Activity,
                eyebrow: 'scale',
                title: 'Production-ready runtime',
                body:
                  '9.2B+ evaluations per year, p50 240 ms, 99.95% uptime SLA on enterprise tier. Same payload whether you wire it into GPT-4o, Claude 3.5 or Gemini 2.0.',
                chip: '9.2B/yr · p50 240 ms · 99.95% SLA',
                tone: 'indigo',
              },
            ].map((tile) => {
              const toneMap: Record<
                string,
                { iconBg: string; iconFg: string; eyebrow: string; chipBorder: string }
              > = {
                emerald: {
                  iconBg: 'bg-emerald-500/10',
                  iconFg: 'text-emerald-700',
                  eyebrow: 'text-emerald-700',
                  chipBorder: 'border-emerald-500/25 bg-emerald-500/[0.05] text-emerald-800',
                },
                amber: {
                  iconBg: 'bg-amber-500/10',
                  iconFg: 'text-amber-700',
                  eyebrow: 'text-amber-700',
                  chipBorder: 'border-amber-500/25 bg-amber-500/[0.05] text-amber-800',
                },
                rose: {
                  iconBg: 'bg-rose-500/10',
                  iconFg: 'text-rose-700',
                  eyebrow: 'text-rose-700',
                  chipBorder: 'border-rose-500/25 bg-rose-500/[0.05] text-rose-800',
                },
                sky: {
                  iconBg: 'bg-sky-500/10',
                  iconFg: 'text-sky-700',
                  eyebrow: 'text-sky-700',
                  chipBorder: 'border-sky-500/25 bg-sky-500/[0.05] text-sky-800',
                },
                violet: {
                  iconBg: 'bg-violet-500/10',
                  iconFg: 'text-violet-700',
                  eyebrow: 'text-violet-700',
                  chipBorder: 'border-violet-500/25 bg-violet-500/[0.05] text-violet-800',
                },
                indigo: {
                  iconBg: 'bg-indigo-500/10',
                  iconFg: 'text-indigo-700',
                  eyebrow: 'text-indigo-700',
                  chipBorder: 'border-indigo-500/25 bg-indigo-500/[0.05] text-indigo-800',
                },
              };
              const t = toneMap[tile.tone];
              return (
                <StaggerItem key={tile.title}>
                  <div className="group relative h-full rounded-2xl border border-zinc-900/[0.08] bg-white/70 backdrop-blur-md p-5 md:p-6 hover:-translate-y-[2px] hover:border-zinc-900/[0.15] hover:shadow-[0_18px_48px_-24px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className={`h-9 w-9 rounded-lg ${t.iconBg} inline-flex items-center justify-center`}
                      >
                        <tile.icon className={`h-4 w-4 ${t.iconFg}`} />
                      </div>
                      <span
                        className={`text-[10.5px] font-mono tracking-wide uppercase ${t.eyebrow}`}
                      >
                        /{tile.eyebrow}
                      </span>
                    </div>
                    <h3 className="text-[16.5px] font-semibold tracking-[-0.01em] mb-2 text-zinc-900">
                      {tile.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                      {tile.body}
                    </p>
                    <span
                      className={`mt-auto self-start inline-flex items-center rounded-md border px-2 py-0.5 text-[10.5px] font-mono ${t.chipBorder}`}
                    >
                      {tile.chip}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* closing rail — quiet summary line */}
          <FadeUp delay={0.2}>
            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12.5px] text-muted-foreground border-t border-zinc-900/[0.06] pt-5">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse" />
                Production traffic right now &mdash; check the{' '}
                <Link
                  href="/global/docs#changelog"
                  className="text-emerald-800 hover:text-emerald-900 font-medium inline-flex items-center gap-0.5"
                >
                  status &amp; changelog
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </span>
              <span className="font-mono text-[11.5px]">
                One payload shape · every model · every runtime
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       * CTA
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="warm-card px-8 py-16 md:px-14 md:py-20 text-center">
            <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-emerald-700 mb-3">
              Ready to wire it up?
            </div>
            <h2 className="heading-display text-3xl md:text-[44px] tracking-[-0.025em] mb-4 leading-[1.1]">
              Same payload. Your agent. Your production loop.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-base md:text-[17px] max-w-2xl mx-auto">
              Drop Chivox MCP into Cursor, Claude Desktop, or any agent SDK. One{' '}
              <code className="font-mono text-[13px] px-1.5 py-0.5 rounded bg-zinc-900/[0.06] text-foreground/90">
                npx
              </code>{' '}
              and you&rsquo;re reading the same JSON you just saw above.
            </p>
            <p className="text-[13px] text-muted-foreground/85 mb-8 max-w-2xl mx-auto font-mono tracking-tight">
              Starter key free &middot; spend caps &middot; low-balance alerts &middot; zero audio retention
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a
                href="#quickstart"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-full gap-2 bg-zinc-900 text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] hover:-translate-y-[2px] transition-all duration-200"
              >
                <Terminal className="h-4 w-4 opacity-80" />
                See quickstart
              </a>
              <Link
                href="/global/docs"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-full gap-2 border border-emerald-500/35 bg-white/75 text-emerald-800 backdrop-blur-sm hover:border-emerald-500/60 hover:bg-white hover:-translate-y-[2px] transition-all duration-200 shadow-[0_8px_22px_-12px_rgba(16,185,129,0.55)]"
              >
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Link>
              <Link
                href="/dev-en/login"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-full gap-1.5 border border-zinc-900/15 bg-white/70 backdrop-blur-sm hover:border-zinc-900/40 hover:bg-white transition-all duration-200"
              >
                Get your API key
                <ArrowUpRight className="h-4 w-4 opacity-60" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-full gap-1.5 text-zinc-700 hover:text-zinc-900 transition-colors"
              >
                <Mail className="h-4 w-4 opacity-70" />
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      <SiteFooter />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  CONTACT — warm-card block with an English lead-capture form.
 *  Posts to `sendGlobalContactEmail` (server action) which routes
 *  the lead into the same SMTP inbox as the Chinese homepage.
 * ═══════════════════════════════════════════════════════════ */
function ContactSection() {
  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 border-t border-[#e9e2d2]/70 scroll-mt-28"
      style={{
        background:
          'linear-gradient(to bottom, rgba(251,246,233,0) 0%, rgba(16,185,129,0.05) 40%, rgba(245,158,11,0.04) 100%)',
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── LEFT · pitch + direct-mail fallback ─────────── */}
          <div className="lg:col-span-5">
            <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-emerald-700 mb-3">
              /contact
            </div>
            <h2 className="heading-display text-3xl md:text-[40px] tracking-[-0.025em] leading-[1.08] mb-5">
              Let&rsquo;s build your voice agent together.
            </h2>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-md">
              Tell us what you&rsquo;re building. We&rsquo;ll reply within one business day with
              pilot credits, pricing, or a deployment plan — whichever you need first.
            </p>

            <ul className="space-y-3.5 mb-8">
              {[
                {
                  title: 'Enterprise pricing & self-hosted deployments',
                  body: 'Volume tiers, VPC install, SLAs, and on-prem engines for regulated buyers.',
                },
                {
                  title: 'Missing a language or dialect?',
                  body: 'We train new acoustic models on request. Send us your target accent.',
                },
                {
                  title: 'Pilot credits for evaluation teams',
                  body: 'Free benchmark run on your own audio, with a side-by-side report.',
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div
                    className="mt-[6px] h-5 w-5 shrink-0 rounded-full bg-emerald-500/15 text-emerald-700 inline-flex items-center justify-center"
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-[14.5px] font-semibold text-zinc-900 tracking-[-0.005em]">
                      {item.title}
                    </div>
                    <div className="text-[13px] text-muted-foreground leading-relaxed">
                      {item.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-zinc-900/[0.08] bg-white/55 backdrop-blur-sm p-4">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Prefer plain email?
              </div>
              <div className="flex flex-col sm:flex-row gap-3 text-[13.5px]">
                <a
                  href="mailto:dev@chivox.com?subject=Chivox%20MCP%20-%20Developer%20question"
                  className="inline-flex items-center gap-2 text-zinc-900 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-medium">dev@chivox.com</span>
                  <span className="text-muted-foreground">· developers</span>
                </a>
                <a
                  href="mailto:sales@chivox.com?subject=Chivox%20MCP%20-%20Enterprise%20inquiry"
                  className="inline-flex items-center gap-2 text-zinc-900 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <span className="font-medium">sales@chivox.com</span>
                  <span className="text-muted-foreground">· enterprise</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT · form card ───────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="warm-card p-6 md:p-8">
              <GlobalContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const USE_CASE_OPTIONS: Array<{ value: GlobalContactUseCase; label: string }> = [
  { value: 'language-learning', label: 'Language learning' },
  { value: 'serious-games', label: 'Serious games / consumer' },
  { value: 'accessibility', label: 'Accessibility / speech therapy' },
  { value: 'enterprise-training', label: 'Enterprise training & L&D' },
  { value: 'research', label: 'Research / academic' },
  { value: 'other', label: 'Other' },
];

function GlobalContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<GlobalContactFormData>({
    company: '',
    name: '',
    email: '',
    useCase: undefined,
    message: '',
    source: '/global#contact',
  });

  const inputClass =
    'w-full h-11 px-3.5 text-[14px] rounded-lg border border-zinc-900/[0.12] bg-white/70 backdrop-blur-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 transition-all disabled:opacity-60';

  const labelClass = 'block text-[12.5px] font-medium text-zinc-800 mb-1.5 tracking-[-0.005em]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorMsg('');
    startTransition(async () => {
      const result = await sendGlobalContactEmail(form);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Submission failed. Please try again.');
      }
    });
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-700 inline-flex items-center justify-center mb-4">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="heading-display text-xl md:text-2xl tracking-[-0.015em] text-zinc-900 mb-2">
          Thanks — your note is in.
        </h3>
        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm mb-6">
          We&rsquo;ll get back within one business day. For anything urgent, email{' '}
          <a
            href="mailto:dev@chivox.com"
            className="text-emerald-700 underline underline-offset-2 hover:no-underline"
          >
            dev@chivox.com
          </a>{' '}
          directly.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setForm({
              company: '',
              name: '',
              email: '',
              useCase: undefined,
              message: '',
              source: '/global#contact',
            });
          }}
          className="text-[13px] font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2 hover:no-underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-1">
        <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-emerald-700 mb-1.5">
          /get-in-touch
        </div>
        <h3 className="heading-display text-xl md:text-[22px] tracking-[-0.01em] text-zinc-900">
          Tell us what you&rsquo;re building.
        </h3>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 text-rose-800 text-[13px] border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3.5">
        <div>
          <label className={labelClass} htmlFor="contact-company">
            Company <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Inc."
            className={inputClass}
            disabled={isPending}
            autoComplete="organization"
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-name">
            Your name <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
            className={inputClass}
            disabled={isPending}
            autoComplete="name"
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-email">
          Work email <span className="text-rose-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="jane@acme.com"
          className={inputClass}
          disabled={isPending}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-usecase">
          What are you building?{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <select
          id="contact-usecase"
          value={form.useCase ?? ''}
          onChange={(e) =>
            setForm({
              ...form,
              useCase: (e.target.value || undefined) as GlobalContactUseCase | undefined,
            })
          }
          className={cn(inputClass, 'appearance-none pr-10 cursor-pointer')}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2352525b' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
          }}
          disabled={isPending}
        >
          <option value="">Select a use case…</option>
          {USE_CASE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-message">
          Anything we should know?{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message ?? ''}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Audio volumes, target languages, deployment region, timelines…"
          rows={4}
          className="w-full px-3.5 py-2.5 text-[14px] rounded-lg border border-zinc-900/[0.12] bg-white/70 backdrop-blur-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 transition-all resize-none disabled:opacity-60"
          disabled={isPending}
          maxLength={4000}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 text-[14px] font-semibold rounded-full bg-zinc-900 text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)] hover:-translate-y-[1px] disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="h-4 w-4 opacity-90" />
            </>
          )}
        </button>
        <p className="text-[11.5px] text-muted-foreground leading-relaxed md:flex-1 md:min-w-0 md:max-w-[28rem]">
          By submitting this form you agree to receive a reply from the Chivox MCP team. We
          don&rsquo;t share your email with third parties.
        </p>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  VISUAL COMPONENTS (drawn inline so no extra assets are needed)
 * ═══════════════════════════════════════════════════════════ */

/** Representative `en.sent.score`-style payload — matches README field groups
 *  (pron · fluency metrics · audio_quality · details[] with stress, liaison, phonemes, ms range). */
const SAMPLE_MCP_RICH_JSON = `{
  "overall": 84,
  "pron": { "accuracy": 82, "integrity": 95, "fluency": 88, "rhythm": 79 },
  "fluency": { "overall": 85, "pause": 3, "speed": 128 },
  "audio_quality": { "snr": 24.1, "clip": 0, "volume": 2402 },
  "details": [
    {
      "word": "gorgeous",
      "score": 71, "dp_type": "mispron",
      "start": 420, "end": 980,
      "stress": { "ref": 1, "score": 62 },
      "liaison": "none",
      "phonemes": [
        { "ipa": "ɡ", "score": 92, "dp_type": "normal" },
        { "ipa": "ɔː", "score": 64, "dp_type": "mispron" }
      ]
    }
  ]
}`;

/** Hero slide ④ — same schema story as README, English “think” row + nested pron/audio. */
const HERO_SLIDE_REASONING_JSON = `{
  "overall": 48,
  "pron": { "accuracy": 44, "integrity": 90, "fluency": 72, "rhythm": 65 },
  "fluency": { "pause": 2, "speed": 118 },
  "audio_quality": { "snr": 19.2, "clip": 0 },
  "details": [
    {
      "word": "think",
      "score": 48, "dp_type": "mispron",
      "start": 2400, "end": 2910,
      "liaison": "none",
      "phonemes": [
        { "ipa": "θ", "score": 35, "dp_type": "mispron" },
        { "ipa": "ɪ", "score": 88, "dp_type": "normal" }
      ],
      "phoneme_error": { "expected": "/θ/", "actual": "/s/" }
    }
  ]
}`;

/* ── Quickstart demo — types config, boots server, runs tool ─
 * A single looping timeline that makes integration feel live:
 *   phase 0  →  JSON config is typed into the editor
 *   phase 1  →  `npx -y @chivox/mcp` boots, ✓ connected
 *   phase 2  →  LLM issues assess_speech(...) tool call
 *   phase 3  →  server streams structured scores back
 * Left-side step cards highlight in sync with the current phase so
 * the eye tracks "what's happening" without reading a single word.
 * ────────────────────────────────────────────────────────── */
type InstallTab = { id: string; label: string; filename: string; code: string };
function QuickstartDemo({
  installTab,
  setInstallTab,
  activeInstall,
}: {
  installTab: string;
  setInstallTab: (v: string) => void;
  activeInstall: InstallTab;
}) {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);
  const [responseChars, setResponseChars] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const code = activeInstall.code;

  const RESPONSE = useMemo(() => SAMPLE_MCP_RICH_JSON, []);

  /* restart the timeline whenever the tab changes */
  useEffect(() => {
    setPhase(0);
    setTyped(0);
    setResponseChars(0);
  }, [installTab]);

  /* timeline driver */
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setTyped(code.length);
      setResponseChars(RESPONSE.length);
      setPhase(3);
      return;
    }

    // pause auto-advance while a step is being hovered/focused
    if (hoverStep !== null) return;

    let cancelled = false;

    if (phase === 0) {
      // type config char-by-char
      if (typed >= code.length) {
        const t = setTimeout(() => !cancelled && setPhase(1), 500);
        return () => {
          cancelled = true;
          clearTimeout(t);
        };
      }
      const t = setTimeout(() => {
        if (!cancelled) setTyped((n) => Math.min(code.length, n + (code[n] === '\n' ? 1 : 2)));
      }, 18);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    if (phase === 1) {
      const t = setTimeout(() => !cancelled && setPhase(2), 1100);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    if (phase === 2) {
      const t = setTimeout(() => !cancelled && setPhase(3), 900);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    if (phase === 3) {
      if (responseChars >= RESPONSE.length) {
        // loop
        const t = setTimeout(() => {
          if (cancelled) return;
          setTyped(0);
          setResponseChars(0);
          setPhase(0);
        }, 2600);
        return () => {
          cancelled = true;
          clearTimeout(t);
        };
      }
      const t = setTimeout(() => {
        if (!cancelled) setResponseChars((n) => Math.min(RESPONSE.length, n + 5));
      }, 12);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }
  }, [phase, typed, responseChars, code, RESPONSE, hoverStep]);

  /* ── derive a "display snapshot" ──────────────────────────────
   * When the user hovers/focuses a step card on the left, force
   * the right panel to render that step's canonical state instead
   * of whatever the auto-advance is currently on. On leave, the
   * live state is restored untouched (no jarring rewind).
   * ─────────────────────────────────────────────────────────── */
  const snapshot = (() => {
    if (hoverStep === 0) {
      // "Grab an API key" — the terminal hasn't been spun up yet. Preview
      // the full config you'll paste once you have the key. phase = -1 hides
      // every terminal line (no forever-spinning boot spinner).
      return { phase: -1, typed: code.length, responseChars: 0, activeStep: 0 };
    }
    if (hoverStep === 1) {
      return { phase: 1, typed: code.length, responseChars: 0, activeStep: 1 };
    }
    if (hoverStep === 2) {
      return { phase: 3, typed: code.length, responseChars: RESPONSE.length, activeStep: 2 };
    }
    return {
      phase,
      typed,
      responseChars,
      activeStep: phase === 0 ? 1 : phase >= 2 ? 2 : 1,
    };
  })();

  const dPhase = snapshot.phase;
  const dTyped = snapshot.typed;
  const dResponseChars = snapshot.responseChars;
  const activeStep = snapshot.activeStep;

  const steps = [
    {
      n: '01',
      title: 'Grab an API key',
      body: 'Sign up, confirm your email, copy the key. Free trial credits included.',
      cta: { label: 'Get a key', href: '/en/register' },
      done: true,
    },
    {
      n: '02',
      title: 'Add one block to your MCP config',
      body: 'Paste the snippet into Cursor, Claude Desktop, or your custom agent — pick a tab on the right.',
      done: dPhase >= 1,
    },
    {
      n: '03',
      title: 'Call a tool from your LLM',
      body: 'Hand your model the audio. It gets back nested JSON: pron sub-scores, fluency + WPM, audio SNR, and details[] with ms ranges, stress, liaison and per-phoneme rows.',
      cta: { label: 'API reference', href: '/global/docs' },
      done: dPhase >= 3 && dResponseChars >= RESPONSE.length,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-stretch">
      {/* ─── LEFT: steps, live-highlighted ─── */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        {steps.map((s, i) => {
          const active = i === activeStep && !s.done;
          const isHovered = hoverStep === i;
          return (
            <div
              key={s.n}
              onMouseEnter={() => setHoverStep(i)}
              onMouseLeave={() => setHoverStep(null)}
              onFocus={() => setHoverStep(i)}
              onBlur={() => setHoverStep(null)}
              tabIndex={0}
              role="button"
              aria-label={`Preview step ${s.n}: ${s.title}`}
              className={`group relative rounded-xl border bg-background p-5 flex gap-4 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 hover:-translate-y-px hover:border-emerald-400/60 hover:shadow-[0_10px_30px_-18px_rgba(16,185,129,0.55)] ${
                isHovered
                  ? 'border-emerald-400/80 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]'
                  : active
                  ? 'border-emerald-400/70 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
                  : s.done
                  ? 'border-border/60'
                  : 'border-border/60'
              }`}
            >
              {/* pulsing rail on the active step */}
              {active && (
                <span className="pointer-events-none absolute -left-px top-3 bottom-3 w-[2px] rounded-full bg-emerald-400/80 animate-pulse" />
              )}
              <div
                className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center font-mono text-sm font-semibold transition-colors ${
                  s.done
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'bg-foreground text-background'
                    : 'bg-foreground/90 text-background'
                }`}
              >
                {s.done ? <Check className="h-4 w-4" strokeWidth={3} /> : s.n}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold tracking-[-0.01em] mb-1 flex items-center gap-2">
                  {s.title}
                  {active && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      running
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                {s.cta ? (
                  <Link
                    href={s.cta.href}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline underline-offset-4"
                  >
                    {s.cta.label} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* ─── Interactive demo CTA — routes to /global/demo (Western-dev showcase) ─── */}
        <Link
          href="/global/demo"
          className="group relative mt-2 rounded-2xl overflow-hidden text-left transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 shadow-[0_18px_50px_-24px_rgba(16,185,129,0.55)] hover:shadow-[0_24px_60px_-20px_rgba(16,185,129,0.7)]"
        >
          {/* solid colorful body */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600"
          />
          {/* soft texture overlay */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
            style={{
              backgroundImage:
                'radial-gradient(600px 220px at 85% -10%, rgba(253,230,138,0.9), transparent 55%),' +
                'radial-gradient(500px 260px at 5% 110%, rgba(134,239,172,0.8), transparent 55%)',
            }}
          />
          {/* grid micro texture */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <span className="relative p-5 md:p-6 flex gap-4 items-start">
            <span className="shrink-0 h-12 w-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-[0_10px_24px_-6px_rgba(0,0,0,0.35)] ring-1 ring-white/50 group-hover:scale-105 transition-transform">
              <Play className="h-5 w-5 fill-emerald-600" strokeWidth={0} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.16em] text-white mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
                Live playground · no mic
              </span>
              <span className="block text-[17px] md:text-[18px] font-bold tracking-[-0.015em] text-white mb-1 leading-tight">
                Run a real Mandarin + English demo
              </span>
              <span className="block text-[13px] text-emerald-50/90 leading-relaxed">
                Watch raw JSON → teacher diagnosis → auto-generated drill. No signup, no setup.
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                Open the playground
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25 group-hover:bg-white/40 group-hover:translate-x-0.5 transition-all">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </span>
            </span>
          </span>
        </Link>
      </div>

      {/* ─── RIGHT: live editor + terminal ─── */}
      <div className="lg:col-span-7 min-w-0">
        <div className="glass-card-dark text-zinc-200 overflow-hidden h-full flex flex-col">
          {/* tab strip */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
            <div
              className="flex flex-wrap min-w-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {INSTALL_TABS.map((t) => {
                const isActive = t.id === installTab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInstallTab(t.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-2.5 text-[11.5px] font-mono whitespace-nowrap transition-all ${
                      isActive
                        ? 'text-white font-semibold bg-white/[0.08]'
                        : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                          : 'bg-zinc-500'
                      }`}
                    />
                    {t.label}
                    {isActive && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-2 right-2 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.55)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 px-3 shrink-0">
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[10.5px] font-mono text-zinc-500 tracking-wider">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    dPhase === 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                {activeInstall.filename}
              </span>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-2 py-1 text-[11px] font-mono text-zinc-300 transition-colors"
                aria-label="Copy config"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* code viewport — typed config */}
          <pre className="text-[12.5px] leading-[1.7] font-mono p-6 whitespace-pre overflow-hidden min-h-[190px]">
            {code.slice(0, dTyped)}
            {dPhase === 0 && hoverStep === null && (
              <span className="inline-block w-[7px] h-[1.1em] translate-y-[2px] bg-emerald-400/90 animate-pulse align-middle" />
            )}
          </pre>

          {/* live terminal transcript — hidden while previewing step 1
               (no server has been spun up yet, so nothing to show) */}
          <div
            className="border-t border-white/[0.08] bg-black/30 backdrop-blur-sm px-5 py-4 font-mono text-[11.5px] leading-[1.7] text-zinc-300 space-y-1 min-h-[130px]"
            style={dPhase < 0 ? { display: 'none' } : undefined}
          >
            {/* boot line */}
            <TerminalLine
              visible={dPhase >= 0}
              prefix="$"
              prefixClass="text-zinc-500"
              running={dPhase === 0 || dPhase === 1}
              done={dPhase >= 2}
            >
              <span className="text-zinc-100">npx</span>
              <span className="text-zinc-400"> -y @chivox/mcp</span>
              {dPhase === 1 && (
                <span className="ml-2 text-emerald-400">✓ connected · 4 tools registered</span>
              )}
              {dPhase >= 2 && (
                <span className="ml-2 text-emerald-400">✓ ready</span>
              )}
            </TerminalLine>

            {/* LLM call */}
            <TerminalLine
              visible={dPhase >= 2}
              prefix="→"
              prefixClass="text-sky-400"
              running={dPhase === 2}
              done={dPhase >= 3}
            >
              <span className="text-sky-300">llm.tool_call</span>
              <span className="text-zinc-500">(</span>
              <span className="text-zinc-100">&quot;assess_speech&quot;</span>
              <span className="text-zinc-500">, </span>
              <span className="text-zinc-400">{'{ language: "en-US", audio_file_path: "./take-01.wav" }'}</span>
              <span className="text-zinc-500">)</span>
            </TerminalLine>

            {/* response stream */}
            {dPhase >= 3 && (
              <div className="pt-1">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">←</span>
                  <pre className="font-mono text-[11.5px] leading-[1.65] text-emerald-200/90 whitespace-pre overflow-hidden">
                    {RESPONSE.slice(0, dResponseChars)}
                    {dResponseChars < RESPONSE.length && hoverStep === null && (
                      <span className="inline-block w-[6px] h-[0.95em] translate-y-[1px] bg-emerald-300/80 animate-pulse align-middle" />
                    )}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalLine({
  visible,
  prefix,
  prefixClass,
  running,
  done,
  children,
}: {
  visible: boolean;
  prefix: string;
  prefixClass?: string;
  running?: boolean;
  done?: boolean;
  children: React.ReactNode;
}) {
  if (!visible) return null;
  return (
    <div className="flex items-start gap-2 qd-line-in">
      <span className={`shrink-0 ${prefixClass ?? 'text-zinc-500'}`}>{prefix}</span>
      <div className="flex-1 min-w-0 flex items-start gap-2 flex-wrap">
        <div className="min-w-0">{children}</div>
        {running && <Spinner />}
        {done && !running && <Check className="h-3 w-3 text-emerald-400 mt-0.5" />}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-flex items-center">
      <svg className="h-3 w-3 animate-spin text-emerald-400" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}


/* ── Reasoning demo — the Aha moment ─────────────────────────
 * Shows concretely how a developer piggy-backs on the rich
 * Chivox payload to drive two more LLM turns:
 *   Pass ②  LLM reads the phoneme matrix → teacher-style diagnosis
 *   Pass ③  LLM turns the diagnosis into a Mandarin tongue-twister
 *            that targets exactly the failing phonemes
 * Left pane = input (Chivox JSON + system prompt).
 * Right pane = streamed LLM output.
 * ────────────────────────────────────────────────────────── */
const REASONING_TABS = [
  { id: 'diagnose', label: 'Pass ② · Diagnose' },
  { id: 'drill', label: 'Pass ③ · Generate drill' },
] as const;

type ReasoningTabId = (typeof REASONING_TABS)[number]['id'];

const REASONING_INPUT: Record<ReasoningTabId, string> = {
  diagnose: `// pass 2 — feed the phonetic matrix to your LLM
const diag = await openai.chat.completions.create({
  model: "o1-mini",
  messages: [{
    role: "system",
    content:
      "You are a Mandarin pronunciation coach. " +
      "Given the Chivox MCP assessment payload, identify " +
      "the learner's 3 most impactful issues. Be concrete."
  }, {
    role: "user",
    content: JSON.stringify(assessment)
    // ↓ the payload Chivox MCP just returned (same wide schema as
    // English: pron, fluency, audio_quality, details[]; zh adds tone maps)
    // { "pron":{...,"tone":76}, "details":[
    //     { "char":"上","pinyin":"shang4","tone":{"ref":4,"detected":3,"score":58,"confidence":[...]}}
    // ] }
  }]
});`,
  drill: `// pass 3 — turn the diagnosis into a targeted practice
const drill = await openai.chat.completions.create({
  model: "claude-3-5-sonnet",
  messages: [{
    role: "system",
    content:
      "You're a Mandarin coach. Given the diagnosis below, " +
      "generate ONE tongue-twister (绕口令) that forces the " +
      "learner to repeat the failing phonemes + tones at " +
      "least 3× each. Include pinyin + English gloss."
  }, {
    role: "user",
    content: diagnosis
    // ↓ pass 2's diagnosis text, e.g.:
    // "Key issue: retroflex /sh/ collapses to /s/
    //  on 上. Tone 3 sandhi on 你好 is not applied.
    //  Target: /sh/ + T3-T3 combos."
  }]
});`,
};

const REASONING_OUTPUT: Record<ReasoningTabId, string> = {
  diagnose: `# Diagnosis

**1. Retroflex /sh/ is softening.**
On 上 (shàng, T4) the initial /ʂ/ came out closer
to a flat /s/. Score 58. Tip: curl the tongue
tip back and up — think "dr" in "drop".

**2. Tone 3 + Tone 3 sandhi not applied.**
你好 was read as T3 + T3 instead of T2 + T3.
This is the #1 textbook-to-speech gap.

**3. Overall tone 3 is shallow.**
Your T3 dips (hǎo, hǎi) don't reach the low
register — they sound like T2 halfway.`,
  drill: `## Drill · tongue-twister

**四是四，十是十，十四是十四，
四十是四十 —— 十四不要说四十。**

sì shì sì, shí shì shí,
shí sì shì shí sì, sì shí shì sì shí ——
shí sì bú yào shuō sì shí.

> Four is four, ten is ten, fourteen is fourteen,
> forty is forty — don't say "forty" for "fourteen".

**Targets:**
• /ʂ/ × 6 (shì, shí, shuō)
• /s/ × 6  (sì) — force the contrast
• T2 ↔ T4 minimal pair (shí ↔ sì)
• Bù → Bú sandhi × 1 (不要)

⏱ 45 s · repeat 3× · record and compare to
the reference MCP score.`,
};

function ReasoningDemo() {
  const [tab, setTab] = useState<ReasoningTabId>('diagnose');
  const [typed, setTyped] = useState(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const output = REASONING_OUTPUT[tab];
  const input = REASONING_INPUT[tab];

  useEffect(() => {
    setTyped(0);
  }, [tab]);

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setTyped(output.length);
      return;
    }
    if (typed >= output.length) return;
    const t = setTimeout(() => setTyped((n) => Math.min(output.length, n + 4)), 18);
    return () => clearTimeout(t);
  }, [typed, output]);

  return (
    <FadeUp>
      <div className="glass-card overflow-hidden relative">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-900/[0.06] bg-white/30 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <span className="text-[13px] font-semibold tracking-[-0.005em] text-foreground">
              How an LLM reasons over a Chivox payload
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 text-[10px] font-mono text-rose-700 dark:text-rose-400">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              中文 · 你好 / 上海
            </span>
          </div>
          <div className="flex rounded-md border border-border/60 bg-background p-0.5 self-start sm:self-auto">
            {REASONING_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1 text-[11px] font-mono rounded-[5px] transition-colors whitespace-nowrap ${
                  t.id === tab
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 relative">
          {/* divider arrow on lg+ */}
          <div
            aria-hidden
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white border border-violet-500/30 shadow-[0_6px_20px_-8px_rgba(139,92,246,0.35)]"
          >
            <ArrowRight className="h-4 w-4 text-violet-600" />
          </div>

          {/* INPUT — what you send */}
          <div
            className="relative border-b lg:border-b-0 lg:border-r border-zinc-900/[0.06]"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(253,247,234,0.35) 50%, rgba(255,255,255,0.5) 100%)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900/[0.08] bg-white/40 backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono text-zinc-700 tracking-wide">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-zinc-900 text-white text-[9px] font-bold">
                  IN
                </span>
                You send — Chivox payload + 1-line prompt
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {tab === 'diagnose' ? 'diagnose.ts' : 'drill.ts'}
              </span>
            </div>
            <pre className="text-[11.5px] leading-[1.6] font-mono p-5 whitespace-pre overflow-x-auto max-h-[420px] text-zinc-800">
              <code>{input}</code>
            </pre>
          </div>

          {/* OUTPUT — what the LLM writes back */}
          <div className="relative bg-gradient-to-br from-violet-500/[0.05] via-background to-background">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-white/40 backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono text-zinc-700 tracking-wide">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-violet-600 text-white text-[9px] font-bold">
                  OUT
                </span>
                LLM writes — {tab === 'diagnose' ? 'diagnosis' : 'drill plan'} ({tab === 'diagnose' ? 'o1-mini' : 'claude-3.5-sonnet'})
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {typed >= output.length ? 'done' : 'thinking…'}
              </span>
            </div>
            <pre className="text-[12.5px] leading-[1.7] font-mono p-5 whitespace-pre-wrap text-foreground/85 max-h-[420px] overflow-auto">
              {output.slice(0, typed)}
              {typed < output.length && (
                <span className="inline-block w-[6px] h-[0.95em] translate-y-[1px] bg-violet-400 animate-pulse align-middle" />
              )}
            </pre>
          </div>
        </div>

        {/* footer note */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-t border-border/60 bg-muted/40 text-[11px] text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span>
            The <strong className="text-foreground/85 font-semibold">same payload</strong> plugs into{' '}
            <code className="font-mono text-foreground/80">o1</code>,{' '}
            <code className="font-mono text-foreground/80">claude-3.5-sonnet</code>,{' '}
            <code className="font-mono text-foreground/80">gemini-2.0-pro</code>,{' '}
            <code className="font-mono text-foreground/80">qwen-max</code>,{' '}
            <code className="font-mono text-foreground/80">deepseek-v3</code> — any model that reads JSON.
          </span>
        </div>
      </div>
    </FadeUp>
  );
}

/* ── Field overview — one screenful listing what “rich payload” means ─ */
function PayloadFieldStrip() {
  return (
    <div className="mb-10 md:mb-12 rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-500/[0.05] via-white/85 to-amber-500/[0.04] p-4 md:p-6 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-violet-700 mb-1">Dense metadata · one response</p>
          <p className="text-[15px] font-semibold text-foreground tracking-tight">Structured for LLM reasoning, not a leaderboard cell</p>
        </div>
        <span className="shrink-0 self-start text-[10px] font-mono text-muted-foreground border border-dashed border-violet-300/50 rounded-md px-2 py-0.5">
          en + zh code paths
        </span>
      </div>
      <ul className="grid sm:grid-cols-2 gap-2.5 text-[12.5px] leading-snug">
        {[
          {
            k: 'Session + audio QA',
            v: 'overall · refText / session id · audio_quality: snr, clip, volume (UGC & mic checks)',
          },
          {
            k: 'pron + fluency blocks',
            v: 'accuracy, integrity, fluency, rhythm; tone row for Chinese; WPM, pause count, broader fluency',
          },
          {
            k: 'details[] entries',
            v: 'per word or 汉字: start/end ms, dp_type, stress, liaison, char-level tone + confidence[], phonemes[] with IPA & scores',
          },
          {
            k: 'Error hooks',
            v: 'phoneme_error, omissions, affricate quality — the signals agents turn into feedback without custom DSP',
          },
        ].map((row) => (
          <li key={row.k} className="rounded-xl border border-zinc-900/[0.08] bg-white/75 px-3 py-2.5">
            <div className="font-mono text-[11px] text-violet-800 mb-0.5">{row.k}</div>
            <div className="text-muted-foreground">{row.v}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Three-pass pipeline: assess → diagnose → drill ──────────
 * The differentiator. Most eval APIs stop at pass ①. Chivox
 * MCP hands the downstream LLM everything it needs to run
 * passes ② and ③ as just-more-tool-turns. This card makes the
 * handoff visible: raw JSON flows into a natural-language
 * diagnosis, which flows into a targeted drill plan.
 * ────────────────────────────────────────────────────────── */
function PipelineStages() {
  return (
    <div className="relative">
      {/* connecting line on md+ */}
      <div
        aria-hidden
        className="hidden md:block absolute top-[88px] left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-sky-400/0"
      />

      {/* ─── Stages ─── */}
      <StaggerContainer className="grid md:grid-cols-3 gap-5 md:gap-4">
        <StaggerItem>
          <StageCard
            tone="emerald"
            num="01"
            runner="Chivox MCP"
            runnerKind="tool"
            title="Assess"
            sub="Audio in → structured scores out"
            inLabel="audio_file_path"
            outLabel="scores.json"
          >
            <pre className="font-mono text-[10px] leading-[1.5] text-zinc-700 dark:text-zinc-300 whitespace-pre overflow-x-auto max-h-[200px] overflow-y-auto">
              {SAMPLE_MCP_RICH_JSON}
            </pre>
          </StageCard>
        </StaggerItem>

        {/* ─── Stage ② diagnose ─── */}
        <StaggerItem>
          <StageCard
            tone="sky"
            num="02"
            runner="Your LLM · pass 1"
            runnerKind="llm"
            title="Diagnose"
            sub="Scores → teacher-style feedback"
            inLabel="scores.json"
            outLabel="diagnosis.md"
          >
            <div className="font-sans text-[12.5px] leading-[1.6] text-zinc-700 dark:text-zinc-200 space-y-2">
              <p>
                <span className="font-semibold">Fluency (88)</span> is strong &mdash; good rhythm and chunking.
              </p>
              <p>
                The weak spot is <span className="font-semibold text-rose-500">/ɔː/</span> in{' '}
                <span className="font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded px-1">gorgeous</span>
                : lips aren&apos;t rounded enough, coming out closer to /ɒ/.
              </p>
              <p className="text-muted-foreground text-[11.5px]">
                Also review <span className="font-mono">/dʒ/</span> affricate &mdash; stop-to-fricative transition is too soft.
              </p>
            </div>
          </StageCard>
        </StaggerItem>

        {/* ─── Stage ③ drill ─── */}
        <StaggerItem>
          <StageCard
            tone="violet"
            num="03"
            runner="Your LLM · pass 2"
            runnerKind="llm"
            title="Drill"
            sub="Diagnosis → personalized practice"
            inLabel="diagnosis.md"
            outLabel="practice.json"
          >
            <div className="space-y-2.5">
              <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-2.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
                  /ɔː/ minimal pairs
                </div>
                <div className="font-mono text-[12px] text-zinc-800 dark:text-zinc-200">
                  caught · cot · bought · pot
                </div>
              </div>
              <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-2.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
                  Shadow read · 2×
                </div>
                <div className="text-[12px] text-zinc-700 dark:text-zinc-300 italic">
                  &ldquo;The gorgeous storm poured all morning.&rdquo;
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  3 tasks
                </span>
                <span>·</span>
                <span>~90s</span>
                <span>·</span>
                <span>targets 2 phonemes</span>
              </div>
            </div>
          </StageCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}

function StageCard({
  tone,
  num,
  runner,
  runnerKind,
  title,
  sub,
  inLabel,
  outLabel,
  children,
}: {
  tone: 'emerald' | 'sky' | 'violet';
  num: string;
  runner: string;
  runnerKind: 'tool' | 'llm';
  title: string;
  sub: string;
  inLabel: string;
  outLabel: string;
  children: React.ReactNode;
}) {
  const toneMap = {
    emerald: {
      dot: 'bg-emerald-500',
      chip: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      num: 'bg-emerald-500 text-white',
      runnerPill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    },
    sky: {
      dot: 'bg-sky-500',
      chip: 'text-sky-700 dark:text-sky-400 bg-sky-500/10 border-sky-500/30',
      num: 'bg-sky-500 text-white',
      runnerPill: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
    },
    violet: {
      dot: 'bg-violet-500',
      chip: 'text-violet-700 dark:text-violet-400 bg-violet-500/10 border-violet-500/30',
      num: 'bg-violet-500 text-white',
      runnerPill: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
    },
  }[tone];

  return (
    <div className="relative h-full glass-card overflow-hidden hover:border-foreground/20 transition-colors">
      {/* header */}
      <div className="p-5 border-b border-zinc-900/[0.08]">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`h-9 w-9 rounded-lg ${toneMap.num} flex items-center justify-center font-mono text-sm font-semibold`}
          >
            {num}
          </div>
          <div>
            <div className="text-[10.5px] tracking-[0.18em] uppercase text-muted-foreground font-mono">
              Pass {num.replace(/^0/, '')}
            </div>
            <h3 className="text-lg font-semibold tracking-[-0.01em]">{title}</h3>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{sub}</p>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-mono ${toneMap.runnerPill}`}
        >
          {runnerKind === 'tool' ? (
            <Terminal className="h-3 w-3" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {runner}
        </div>
      </div>

      {/* payload preview */}
      <div className="p-5 min-h-[180px] bg-white/20 backdrop-blur-sm">{children}</div>

      {/* in/out signature */}
      <div className="px-5 py-3 border-t border-zinc-900/[0.08] bg-white/30 backdrop-blur-sm flex items-center justify-between text-[10.5px] font-mono">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="text-muted-foreground/60">in</span>
          <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${toneMap.chip}`}>
            <span className={`h-1 w-1 rounded-full ${toneMap.dot}`} />
            {inLabel}
          </span>
        </span>
        <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="text-muted-foreground/60">out</span>
          <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${toneMap.chip}`}>
            <span className={`h-1 w-1 rounded-full ${toneMap.dot}`} />
            {outLabel}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 *  CAPABILITY VISUALS — small illustrative blocks per card
 * ────────────────────────────────────────────────────────── */
function CapabilityVisual({ id }: { id: CapabilityVisual }) {
  if (id === 'meters') return <CapVisualMeters />;
  if (id === 'bilingual') return <CapVisualBilingual />;
  if (id === 'dialogue') return <CapVisualDialogue />;
  return <CapVisualTarget />;
}

/* 01 · assess — 4 scoring meters (Tavily-ish slim bars) */
function CapVisualMeters() {
  const rows = [
    { k: 'overall', v: 84, c: 'from-emerald-400 to-emerald-500' },
    { k: 'accuracy', v: 78, c: 'from-emerald-400 to-teal-500' },
    { k: 'fluency', v: 88, c: 'from-emerald-400 to-emerald-500' },
    { k: 'rhythm', v: 73, c: 'from-amber-400 to-amber-500' },
  ];
  return (
    <div className="rounded-xl border border-zinc-900/[0.06] bg-white/50 backdrop-blur-sm p-3.5 flex flex-col gap-1.5">
      {rows.map((r) => (
        <div key={r.k} className="flex items-center gap-3">
          <span className="w-[70px] text-[10.5px] font-mono text-muted-foreground">{r.k}</span>
          <div className="relative flex-1 h-1.5 rounded-full bg-zinc-900/[0.06] overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${r.c}`}
              style={{ width: `${r.v}%` }}
            />
          </div>
          <span className="w-7 text-right text-[11px] font-mono tabular-nums text-foreground/80">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/* 02 · languages — CN / EN toggle with pinyin + tone lines */
function CapVisualBilingual() {
  return (
    <div className="rounded-xl border border-zinc-900/[0.06] bg-white/50 backdrop-blur-sm p-3.5">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10.5px] font-mono text-rose-700">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> zh-CN
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10.5px] font-mono text-sky-700">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> en-US
        </span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">one flag</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-2.5 py-2">
          <div className="flex items-baseline gap-2">
            <span className="font-zh text-lg text-rose-800">你好</span>
            <span className="font-pinyin text-[11.5px] text-rose-700">nǐ hǎo</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-rose-600">
            <svg width="34" height="8" viewBox="0 0 34 8"><path d="M1 6 Q 5 6, 9 3 T 17 1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M18 6 Q 22 6, 26 3 T 33 1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            <span className="text-[9.5px] font-mono ml-1 text-rose-600/70">tones · pinyin · erhua</span>
          </div>
        </div>
        <div className="rounded-lg border border-sky-500/20 bg-sky-500/[0.04] px-2.5 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-sky-900">Hello</span>
            <span className="font-mono text-[11px] text-sky-700">/həˈloʊ/</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sky-600">
            <span className="inline-flex h-1 w-4 bg-sky-400 rounded" />
            <span className="inline-flex h-1 w-2 bg-sky-300 rounded" />
            <span className="inline-flex h-1 w-3 bg-sky-400 rounded" />
            <span className="text-[9.5px] font-mono ml-1 text-sky-600/70">stress · CEFR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 03 · converse — 3 chat bubbles with a tiny waveform */
function CapVisualDialogue() {
  return (
    <div className="rounded-xl border border-zinc-900/[0.06] bg-white/50 backdrop-blur-sm p-3.5 flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <span className="h-6 w-6 shrink-0 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-700 text-[10px] font-mono flex items-center justify-center">AI</span>
        <div className="rounded-lg rounded-tl-sm border border-violet-500/20 bg-violet-500/[0.05] px-2.5 py-1.5 text-[11.5px] text-foreground/85 max-w-[70%]">
          Describe your hometown in three sentences.
        </div>
      </div>
      <div className="flex items-start gap-2 justify-end">
        <div className="rounded-lg rounded-tr-sm border border-zinc-900/[0.08] bg-white/70 px-2.5 py-1.5 max-w-[80%]">
          <div className="flex items-end gap-[2px] h-3.5">
            {[0.4, 0.8, 0.5, 1, 0.7, 0.9, 0.4, 0.7, 0.55, 0.85, 0.6, 0.3, 0.9, 0.5].map((h, i) => (
              <span
                key={i}
                className="inline-block w-[2.5px] rounded-[1.5px] bg-gradient-to-t from-violet-400/50 to-violet-500"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-1 text-[10px] font-mono text-muted-foreground">user · 00:14</div>
        </div>
        <span className="h-6 w-6 shrink-0 rounded-full bg-zinc-900/[0.06] border border-zinc-900/10 text-zinc-700 text-[10px] font-mono flex items-center justify-center">U</span>
      </div>
      <div className="mt-0.5 flex flex-wrap gap-1">
        {['fluency 82', 'content 76', 'grammar 88', 'accuracy 79', 'rhythm 81'].map((s) => (
          <span key={s} className="inline-flex items-center rounded-md border border-violet-500/25 bg-violet-500/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-violet-700">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 04 · drill — bullseye + LLM chip row */
function CapVisualTarget() {
  return (
    <div className="rounded-xl border border-zinc-900/[0.06] bg-white/50 backdrop-blur-sm p-3.5 flex items-center gap-4">
      {/* bullseye */}
      <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
        <defs>
          <radialGradient id="capTarget" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="36" cy="36" r="34" fill="url(#capTarget)" />
        <circle cx="36" cy="36" r="28" fill="none" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="36" cy="36" r="20" fill="none" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="36" cy="36" r="12" fill="none" stroke="#f59e0b" strokeOpacity="0.7" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="4" fill="#f59e0b" />
        {/* arrow */}
        <line x1="62" y1="12" x2="40" y2="34" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="36,36 42,32 40,34" fill="#18181b" />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="text-[10.5px] font-mono uppercase tracking-wider text-amber-700/90 mb-1.5">
          personalized drill
        </div>
        <div className="text-[12.5px] font-mono text-foreground/85 truncate">
          <span className="text-rose-600">/θ/</span> minimal pairs · <span className="text-muted-foreground">think · sink · thank · sank</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {['GPT', 'Claude', 'Gemini', 'Qwen'].map((m) => (
            <span key={m} className="inline-flex items-center rounded-md border border-zinc-900/[0.08] bg-white/70 px-1.5 py-0.5 text-[10px] font-mono text-foreground/70">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 *  HERO EQ GLYPH — tiny animated equaliser bars flanking
 *  the italic "the ears of a" line. Uses the `wave-bar`
 *  keyframe already defined in globals.css.
 * ────────────────────────────────────────────────────────── */
function HeroEqGlyph({ side }: { side: 'left' | 'right' }) {
  const heights = side === 'left' ? [0.45, 0.7, 0.95, 0.7, 0.45] : [0.45, 0.7, 0.95, 0.7, 0.45];
  const delays = side === 'left'
    ? ['0s', '0.12s', '0.24s', '0.36s', '0.48s']
    : ['0.48s', '0.36s', '0.24s', '0.12s', '0s'];
  return (
    <span
      aria-hidden
      className={`hidden md:inline-flex align-middle ${side === 'left' ? 'mr-3' : 'ml-3'} translate-y-[-0.08em] gap-[3px] items-end h-[0.5em]`}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-full bg-gradient-to-b from-emerald-500 to-teal-600"
          style={{
            height: `${h * 100}%`,
            transformOrigin: 'bottom',
            animation: `wave-bar 1.1s ease-in-out ${delays[i]} infinite`,
          }}
        />
      ))}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
 *  HERO EAR ART — animated two-act linguistics illustration.
 *
 *  Act 1 (CN, ~0–5.5s)  : Mandarin pitch-contour tracing for
 *                          nǐ-hǎo, tone-sandhi rule detected
 *                          (T3 + T3 → T2 + T3).
 *  Act 2 (EN, ~5.5–10.5s): Phoneme-level scoring of "think"
 *                          with 4 outcomes — /θ/ mispronounced
 *                          (heard /s/), /ɪ/ good, /ŋ/ weak,
 *                          /k/ dropped — then corrected.
 *
 *  CSS lives in globals.css (`.hero-ear-art`); inline SVG <style> is unreliable
 *  in some bundlers. Honours prefers-reduced-motion.
 * ────────────────────────────────────────────────────────── */

function HeroEarArt() {
  const pinyinStyle = {
    fontFamily:
      'var(--font-hero-serif, "Fraunces", "Instrument Serif", Georgia, serif)',
    fontStyle: 'italic' as const,
    fontWeight: 500,
    letterSpacing: '0.01em',
  };
  const serifStyle = {
    fontFamily: 'var(--font-hero-serif, "Fraunces", Georgia, serif)',
  };

  return (
    <svg
      viewBox="0 0 420 500"
      role="img"
      aria-label="Mandarin pitch contour and English phoneme-diagnosis — the listening layer for voice-native agents"
      className="hero-ear-art w-full h-full"
    >
      <defs>
        <radialGradient id="hh-halo" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#ecfdf5" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hh-hanzi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="hh-think" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="hh-curve" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="55%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="hh-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="hh-bar-bad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <filter id="hh-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* shared backdrop */}
      <ellipse cx="210" cy="240" rx="200" ry="210" fill="url(#hh-halo)" />

      {/* shared 5-line pitch grid */}
      <g opacity="0.7">
        <line x1="50" x2="370" y1="120" y2="120" stroke="#a7f3d0" strokeWidth="0.6" />
        <line x1="50" x2="370" y1="160" y2="160" stroke="#a7f3d0" strokeWidth="0.6" />
        <line x1="50" x2="370" y1="200" y2="200" stroke="#10b981" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="50" x2="370" y1="240" y2="240" stroke="#a7f3d0" strokeWidth="0.6" />
        <line x1="50" x2="370" y1="280" y2="280" stroke="#a7f3d0" strokeWidth="0.6" />
      </g>
      <g opacity="0.55" fontFamily="var(--font-geist-mono, ui-monospace)" fontSize="9" fill="#047857">
        <text x="38" y="123" textAnchor="end">5</text>
        <text x="38" y="163" textAnchor="end">4</text>
        <text x="38" y="203" textAnchor="end">3</text>
        <text x="38" y="243" textAnchor="end">2</text>
        <text x="38" y="283" textAnchor="end">1</text>
      </g>

      {/* ░░░░░ CN SCENE ░░░░░ */}
      <g className="cn-scene">
        <text
          x="210" y="345" textAnchor="middle" fontSize="220" fontWeight="700"
          fill="url(#hh-hanzi)"
          style={{
            fontFamily:
              '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          你好
        </text>

        {/* ghost / ideal curves */}
        <path
          d="M 70 200 C 95 230, 120 278, 135 280 S 165 200, 180 160"
          fill="none" stroke="#6ee7b7" strokeWidth="2"
          strokeDasharray="3 4" strokeLinecap="round" opacity="0.55"
        />
        <path
          d="M 240 200 C 265 230, 290 278, 305 280 S 335 200, 350 160"
          fill="none" stroke="#6ee7b7" strokeWidth="2"
          strokeDasharray="3 4" strokeLinecap="round" opacity="0.55"
        />

        {/* animated tracers */}
        <g filter="url(#hh-glow)">
          <path
            className="cn-trace cn-trace-1"
            d="M 70 200 C 95 230, 120 278, 135 280 S 165 200, 180 160"
            fill="none" stroke="url(#hh-curve)" strokeWidth="2.6"
            strokeLinecap="round" strokeLinejoin="round" pathLength={100}
          />
          <path
            className="cn-trace cn-trace-2"
            d="M 240 200 C 265 230, 290 278, 305 280 S 335 200, 350 160"
            fill="none" stroke="url(#hh-curve)" strokeWidth="2.6"
            strokeLinecap="round" strokeLinejoin="round" pathLength={100}
          />
        </g>

        {/* dip markers */}
        <g>
          <circle cx="70" cy="200" r="3.2" fill="#059669" />
          <circle className="cn-pulse cn-pulse-1" cx="135" cy="280" r="4" fill="#ffffff" stroke="#059669" strokeWidth="2" />
          <circle cx="180" cy="160" r="3.2" fill="#059669" />
          <circle cx="240" cy="200" r="3.2" fill="#059669" />
          <circle className="cn-pulse cn-pulse-2" cx="305" cy="280" r="4" fill="#ffffff" stroke="#059669" strokeWidth="2" />
          <circle cx="350" cy="160" r="3.2" fill="#059669" />
        </g>

        {/* tone tags */}
        <g fontFamily="var(--font-geist-mono, ui-monospace)" fontSize="10">
          <g>
            <rect x="105" y="92" width="54" height="20" rx="10" fill="#ffffff" stroke="#10b981" strokeOpacity="0.35" />
            <text x="132" y="106" textAnchor="middle" fill="#047857" fontWeight="600">
              T3 ✓
            </text>
          </g>
          <g>
            <rect x="275" y="92" width="54" height="20" rx="10" fill="#ffffff" stroke="#10b981" strokeOpacity="0.35" />
            <text x="302" y="106" textAnchor="middle" fill="#047857" fontWeight="600">
              T3 ✓
            </text>
          </g>
        </g>

        {/* pinyin */}
        <text x="125" y="315" textAnchor="middle" fontSize="28" fill="#065f46" className="font-pinyin" style={pinyinStyle}>
          nǐ
        </text>
        <text x="295" y="315" textAnchor="middle" fontSize="28" fill="#065f46" className="font-pinyin" style={pinyinStyle}>
          hǎo
        </text>

        {/* bottom: tone-sandhi rule */}
        <line x1="70" x2="350" y1="360" y2="360" stroke="#10b981" strokeOpacity="0.25" strokeDasharray="2 3" />
        <text
          x="210" y="390" textAnchor="middle" fontSize="15" fontWeight="600" fill="#065f46"
          fontFamily="var(--font-geist-mono, ui-monospace)" letterSpacing="0.06em"
        >
          T3 + T3 → T2 + T3
        </text>
        <text
          x="210" y="409" textAnchor="middle" fontSize="10" fill="#047857" opacity="0.7"
          fontFamily="var(--font-geist-mono, ui-monospace)" letterSpacing="0.14em"
        >
          TONE SANDHI · DETECTED
        </text>

        {/* teacher score badge */}
        <g transform="translate(352 70)">
          <circle r="22" fill="#ffffff" stroke="#f43f5e" strokeOpacity="0.55" strokeWidth="1.2" />
          <text textAnchor="middle" y="-3" fontSize="9" fill="#be123c"
                fontFamily="var(--font-geist-mono, ui-monospace)" letterSpacing="0.1em">
            SCORE
          </text>
          <text textAnchor="middle" y="13" fontSize="16" fontWeight="700" fill="#be123c" style={serifStyle}>
            92
          </text>
        </g>
      </g>

      {/* ░░░░░ EN SCENE — diagnosis + correction ░░░░░ */}
      <g className="en-scene">
        <text
          x="210" y="330" textAnchor="middle" fontSize="180" fontWeight="500" fill="url(#hh-think)"
          style={{ ...serifStyle, fontStyle: 'italic', letterSpacing: '-0.015em' }}
        >
          think
        </text>

        {/* top column tags */}
        <g fontFamily="var(--font-geist-mono, ui-monospace)" fontSize="10">
          <rect x="70" y="56" width="62" height="20" rx="10" fill="#ffffff" stroke="#10b981" strokeOpacity="0.28" />
          <text x="101" y="70" textAnchor="middle" fill="#047857" fontWeight="600">PHONEME</text>
          <rect x="240" y="56" width="68" height="20" rx="10" fill="#ffffff" stroke="#10b981" strokeOpacity="0.28" />
          <text x="274" y="70" textAnchor="middle" fill="#047857" fontWeight="600">ACCURACY</text>
        </g>

        {/* score bars */}
        <rect className="en-bar en-bar-theta-init" x="82"  y="120" width="24" height="160" rx="3" fill="url(#hh-bar-bad)" />
        <rect className="en-bar en-bar-theta-fix"  x="82"  y="120" width="24" height="160" rx="3" fill="url(#hh-bar)" />
        <rect className="en-bar en-bar-i"          x="162" y="120" width="24" height="160" rx="3" fill="url(#hh-bar)" />
        <rect className="en-bar en-bar-ng-init"    x="242" y="120" width="24" height="160" rx="3" fill="#f59e0b" />
        <rect className="en-bar en-bar-ng-fix"     x="242" y="120" width="24" height="160" rx="3" fill="url(#hh-bar)" />
        <g className="en-bar-k-ghost">
          <rect
            x="322" y="120" width="24" height="160" rx="3"
            fill="#fff1f2" fillOpacity="0.4"
            stroke="#f43f5e" strokeOpacity="0.55"
            strokeWidth="1.2" strokeDasharray="3 3"
          />
          <line x1="322" x2="346" y1="278" y2="278" stroke="#f43f5e" strokeWidth="2" />
        </g>
        <rect className="en-bar en-bar-k-fix" x="322" y="120" width="24" height="160" rx="3" fill="url(#hh-bar)" />

        {/* diagnostic labels */}
        <g className="en-label-bad" fontFamily="var(--font-geist-mono, ui-monospace)" fontWeight="700">
          <text x="94"  y="105" textAnchor="middle" fontSize="9"  fill="#be123c" letterSpacing="0.14em">HEARD</text>
          <text x="94"  y="120" textAnchor="middle" fontSize="13" fill="#be123c" style={serifStyle}>/s/</text>
          <text x="254" y="162" textAnchor="middle" fontSize="9"  fill="#b45309" letterSpacing="0.18em">WEAK</text>
          <text x="334" y="105" textAnchor="middle" fontSize="9"  fill="#be123c" letterSpacing="0.16em">DROPPED</text>
          <text x="334" y="120" textAnchor="middle" fontSize="13" fill="#be123c" style={serifStyle}>—</text>
        </g>

        {/* phoneme chips — outer <g> carries the static translate,
            inner animated <g> is free to apply CSS translateY without
            clobbering the position. */}
        <g fontFamily="var(--font-geist-mono, ui-monospace)" fontSize="13" fontWeight="600">
          {/* /θ/ chip */}
          <g transform="translate(94 298)">
            <g className="en-chip en-chip-0">
              <g className="en-state-init">
                <rect x="-22" y="0" width="44" height="22" rx="11" fill="#fff1f2" stroke="#f43f5e" strokeOpacity="0.55" />
                <text x="0" y="15" textAnchor="middle" fill="#be123c">/s/</text>
              </g>
              <g className="en-state-fix">
                <rect x="-22" y="0" width="44" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" strokeOpacity="0.6" />
                <text x="0" y="15" textAnchor="middle" fill="#047857">/θ/</text>
              </g>
            </g>
          </g>
          {/* /ɪ/ chip — always good */}
          <g transform="translate(174 298)">
            <g className="en-chip en-chip-1">
              <rect x="-22" y="0" width="44" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" strokeOpacity="0.55" />
              <text x="-3" y="15" textAnchor="middle" fill="#047857">/ɪ/</text>
              <text x="14" y="15" textAnchor="middle" fill="#10b981" fontSize="11">✓</text>
            </g>
          </g>
          {/* /ŋ/ chip */}
          <g transform="translate(254 298)">
            <g className="en-chip en-chip-2">
              <g className="en-state-init">
                <rect x="-22" y="0" width="44" height="22" rx="11" fill="#fffbeb" stroke="#f59e0b" strokeOpacity="0.6" />
                <text x="0" y="15" textAnchor="middle" fill="#b45309">/ŋ/</text>
              </g>
              <g className="en-state-fix">
                <rect x="-22" y="0" width="44" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" strokeOpacity="0.6" />
                <text x="0" y="15" textAnchor="middle" fill="#047857">/ŋ/</text>
              </g>
            </g>
          </g>
          {/* /k/ chip */}
          <g transform="translate(334 298)">
            <g className="en-chip en-chip-3">
              <g className="en-state-init">
                <rect x="-22" y="0" width="44" height="22" rx="11" fill="#fff1f2" fillOpacity="0.4" stroke="#f43f5e" strokeOpacity="0.6" strokeDasharray="3 3" />
                <text x="0" y="15" textAnchor="middle" fill="#be123c" opacity="0.8">/k/</text>
              </g>
              <g className="en-state-fix">
                <rect x="-22" y="0" width="44" height="22" rx="11" fill="#ecfdf5" stroke="#10b981" strokeOpacity="0.6" />
                <text x="0" y="15" textAnchor="middle" fill="#047857">/k/</text>
              </g>
            </g>
          </g>
        </g>

        {/* correction arrows */}
        <g fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={30}>
          <g className="en-arrow en-arrow-1">
            <path d="M 60 250 C 60 270, 85 282, 94 280" />
            <path d="M 90 277 L 94 280 L 91 283" />
          </g>
          <g className="en-arrow en-arrow-2">
            <path d="M 220 250 C 230 274, 245 282, 254 280" />
            <path d="M 250 277 L 254 280 L 251 283" />
          </g>
          <g className="en-arrow en-arrow-3">
            <path d="M 380 250 C 370 272, 345 282, 334 280" />
            <path d="M 337 277 L 334 280 L 336 283" />
          </g>
        </g>

        {/* bottom caption swap */}
        <line x1="70" x2="350" y1="360" y2="360" stroke="#10b981" strokeOpacity="0.25" strokeDasharray="2 3" />
        <g className="en-cap-bad" fontFamily="var(--font-geist-mono, ui-monospace)">
          <text x="210" y="390" textAnchor="middle" fontSize="15" fontWeight="700" fill="#be123c" letterSpacing="0.06em">
            3 ISSUES · DETECTED
          </text>
          <text x="210" y="409" textAnchor="middle" fontSize="10" fill="#b91c1c" opacity="0.85" letterSpacing="0.14em">
            MISSING · WEAK · MISPRONOUNCED
          </text>
        </g>
        <g className="en-cap-good" fontFamily="var(--font-geist-mono, ui-monospace)">
          <text x="210" y="390" textAnchor="middle" fontSize="15" fontWeight="700" fill="#065f46" letterSpacing="0.06em">
            ALL CORRECTED
          </text>
          <text x="210" y="409" textAnchor="middle" fontSize="10" fill="#047857" opacity="0.85" letterSpacing="0.14em">
            PHONEME DIAGNOSIS · SUPERVISED
          </text>
        </g>

        {/* score badge 58 → 92 */}
        <g transform="translate(352 70)">
          <circle r="22" fill="#ffffff" stroke="#10b981" strokeOpacity="0.5" strokeWidth="1.2" />
          <text textAnchor="middle" y="-3" fontSize="9" fill="#047857"
                fontFamily="var(--font-geist-mono, ui-monospace)" letterSpacing="0.1em">
            SCORE
          </text>
          <text className="en-score-bad"  textAnchor="middle" y="13" fontSize="16" fontWeight="700" fill="#be123c" style={serifStyle}>58</text>
          <text className="en-score-good" textAnchor="middle" y="13" fontSize="16" fontWeight="700" fill="#047857" style={serifStyle}>92</text>
        </g>
      </g>

      {/* scattered decorative dots */}
      <g fill="#10b981" opacity="0.35">
        <circle cx="46" cy="78" r="1.6" />
        <circle cx="388" cy="130" r="1.2" />
        <circle cx="30" cy="330" r="1.4" />
        <circle cx="400" cy="370" r="1.6" />
        <circle cx="60" cy="440" r="1.2" />
      </g>
      {/* outer dashed ring */}
      <circle cx="210" cy="240" r="200" fill="none" stroke="#10b981" strokeOpacity="0.08" strokeDasharray="2 6" />
    </svg>
  );
}



/* ──────────────────────────────────────────────────────────
 *  HERO WAVEFORM GLYPH — faint brand motif behind the headline
 * ────────────────────────────────────────────────────────── */
function HeroWaveGlyph() {
  // deterministic bars
  const bars = Array.from({ length: 32 }).map((_, i) => {
    const t = i / 31;
    return 0.2 + 0.8 * Math.abs(Math.sin(t * Math.PI * 2.6) * Math.cos(t * Math.PI + 0.7));
  });
  return (
    <svg
      aria-hidden
      className="absolute left-[-40px] top-[64%] w-[260px] h-[90px] opacity-[0.35] hidden md:block"
      viewBox="0 0 260 90"
      fill="none"
    >
      <defs>
        <linearGradient id="heroWave" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {bars.map((h, i) => {
        const x = i * 8;
        const barH = h * 60;
        const y = (90 - barH) / 2;
        return (
          <rect
            key={i}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            width={3}
            height={barH.toFixed(2)}
            rx={1.5}
            fill="url(#heroWave)"
          />
        );
      })}
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
 *  HERO CAROUSEL — 3 highlights, auto-rotating
 *    01 Instant setup       · 60-second config
 *    02 Mandarin moat       · tone-level precision
 *    03 Fuel for reasoning  · phoneme-level JSON → LLM
 * ────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 'setup',
    label: 'One MCP integration',
    chip: 'npx · 60 s',
    tone: 'emerald',
    headline: 'One MCP, wired into every agent runtime.',
    sub: 'Four tools. Claude, Cursor, Cline, LangChain, any custom loop — zero audio plumbing.',
  },
  {
    id: 'phoneme',
    label: 'Raw speech → diagnosis',
    chip: 'Beyond STT',
    tone: 'violet',
    headline: 'Raw audio in. Structured diagnosis out.',
    sub: 'Per-phoneme accuracy, stress, liaison, ms-level windows — the signal an LLM needs to reason, not just transcribe.',
  },
  {
    id: 'mandarin',
    label: 'Proof of payload depth',
    chip: 'Hardest acoustic signal',
    tone: 'rose',
    headline: 'If it resolves tonal sandhi, it resolves anything.',
    sub: 'Tone, sandhi, erhua, retroflex — the acoustic edge cases generic STT flatlines on. Same payload shape as every other language.',
  },
  {
    id: 'reasoning',
    label: 'A reasoning payload',
    chip: 'Not a leaderboard cell',
    tone: 'amber',
    headline: 'A payload your LLM can reason over — not a score.',
    sub: 'Dozens of top-level and per-token fields: pron, fluency, audio_quality, details[] with stress, liaison, ms ranges, phonemes and tone objects.',
  },
] as const;

type HeroSlideId = (typeof HERO_SLIDES)[number]['id'];

/* Install terminal — the 60-second "just copy this" CTA.
 * Given a full chrome, emerald "ready" indicator, and click-to-copy
 * feedback so it reads as "a real, runnable thing" instead of decoration. */
function HeroInstallPill() {
  const [copied, setCopied] = useState(false);
  const cmd = 'npx -y @chivox/mcp';

  const onCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="mx-auto max-w-5xl mb-12">
      {/* label row */}
      <div className="flex items-center justify-center gap-2 mb-2.5 text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-mono normal-case tracking-wider text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
          60-second install
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="normal-case tracking-normal text-[12px] text-muted-foreground">
          Copy → paste → your agent hears.
        </span>
      </div>

      {/* terminal card with gradient glow */}
      <div className="relative group">
        {/* soft colored glow that lights up on hover */}
        <div
          aria-hidden
          className="absolute -inset-[2px] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(16,185,129,0.35), rgba(56,189,248,0.2) 40%, rgba(16,185,129,0.35))',
          }}
        />

        <div className="relative rounded-2xl border border-zinc-900/[0.1] bg-white/75 backdrop-blur-xl overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18),inset_0_1px_0_0_rgba(255,255,255,0.6)]">
          {/* chrome bar */}
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-900/[0.07] bg-gradient-to-b from-white/80 to-zinc-50/60">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <span className="text-[10.5px] font-mono text-zinc-500 tracking-tight">
              terminal · zsh
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-emerald-700">
              ready
            </span>
          </div>

          {/* command row */}
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy install command"
            className="w-full flex items-center gap-2 px-4 py-4 text-left group/cmd focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <span className="text-emerald-600 font-mono text-[15px] md:text-base shrink-0 select-none">
              $
            </span>
            <code className="flex-1 whitespace-nowrap overflow-x-auto font-mono text-[15px] md:text-base font-medium text-zinc-900 tracking-tight">
              {cmd}
            </code>
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-semibold transition-all duration-200 shrink-0 ${
                copied
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700'
                  : 'border-zinc-900/10 bg-white text-zinc-700 group-hover/cmd:border-zinc-900/25 group-hover/cmd:text-zinc-900'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* sub-caption — the three clients it works with */}
      <div className="mt-3 text-center text-[11.5px] text-muted-foreground">
        Works with <span className="font-medium text-foreground/85">Claude Desktop</span>,{' '}
        <span className="font-medium text-foreground/85">Cursor</span>,{' '}
        <span className="font-medium text-foreground/85">Cline</span> &amp; any MCP client.
      </div>
    </div>
  );
}

/** Time between auto-advances; progress bar uses the same duration. */
const HERO_CAROUSEL_MS = 3500;

function HeroCarousel() {
  const [active, setActive] = useState<HeroSlideId>('mandarin');
  const [reduceMotion, setReduceMotion] = useState(false);

  // Progress is intentionally NOT React state — writing it every frame via
  // setState would re-render the entire carousel (including all slide
  // children) 60×/s, which is what caused the visible "freeze" stutters
  // under load. Instead we mutate a ref and write transform directly to
  // the DOM. React only owns the rare slide change.
  const progressRef = useRef(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  const writeBar = (v: number) => {
    const el = barRef.current;
    if (el) el.style.transform = `scaleX(${reduceMotion ? 0 : v})`;
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Reset progress whenever the active slide changes (manual click or auto).
  useEffect(() => {
    progressRef.current = 0;
    writeBar(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduceMotion]);

  // One rAF loop for the lifetime of the component. It reads `pausedRef`
  // so mouse hover/leave doesn't tear the loop down — no cleanup thrash,
  // no missed frames, no drift.
  useEffect(() => {
    if (reduceMotion) {
      writeBar(0);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Backgrounded tabs can deliver huge dt spikes; clamp so a wake-up
      // doesn't fling the bar a full slide forward.
      const dt = Math.min(100, now - last);
      last = now;
      if (!pausedRef.current) {
        const next = Math.min(1, progressRef.current + dt / HERO_CAROUSEL_MS);
        progressRef.current = next;
        writeBar(next);
        if (next >= 1) {
          progressRef.current = 0;
          writeBar(0);
          setActive((cur) => {
            const i = HERO_SLIDES.findIndex((s) => s.id === cur);
            return HERO_SLIDES[(i + 1) % HERO_SLIDES.length].id;
          });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const activeIdx = HERO_SLIDES.findIndex((s) => s.id === active);

  // position relative to active: 0 = center, -1 = prev (left peek),
  // +1 = next (right peek), 2 = parked out of view.
  const positionFor = (idx: number): -1 | 0 | 1 | 2 => {
    const n = HERO_SLIDES.length;
    const d = ((idx - activeIdx) % n + n) % n;
    if (d === 0) return 0;
    if (d === 1) return 1;
    if (d === n - 1) return -1;
    return 2;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="absolute -inset-4 rounded-3xl bg-foreground/[0.04] blur-2xl pointer-events-none" />

      {/* coverflow stage */}
      <div className="relative h-[460px] md:h-[500px]">
        {HERO_SLIDES.map((slide, i) => {
          const pos = positionFor(i);
          const isActive = pos === 0;
          const isParked = pos === 2;
          const transform =
            pos === 0
              ? 'translate(-50%, 0) scale(1)'
              : pos === -1
              ? 'translate(-112%, 4%) scale(0.74)'
              : pos === 1
              ? 'translate(12%, 4%) scale(0.74)'
              : 'translate(-50%, 6%) scale(0.6)'; // parked

          return (
            <div
              key={slide.id}
              role={isActive || isParked ? undefined : 'button'}
              tabIndex={isActive || isParked ? -1 : 0}
              aria-hidden={isParked || undefined}
              aria-label={isActive || isParked ? undefined : `Show slide ${slide.label}`}
              onClick={isActive || isParked ? undefined : () => setActive(slide.id)}
              onKeyDown={
                isActive || isParked
                  ? undefined
                  : (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActive(slide.id);
                      }
                    }
              }
              className={`absolute left-1/2 top-0 w-[min(100%,680px)] origin-top transition-all duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                isActive
                  ? 'z-20 opacity-100 pointer-events-auto cursor-default'
                  : isParked
                  ? 'z-0 opacity-0 pointer-events-none'
                  : 'z-10 opacity-55 hover:opacity-80 cursor-pointer'
              }`}
              style={{
                transform,
                filter: isActive ? undefined : 'blur(0.5px) saturate(0.92)',
              }}
            >
              <HeroSlideCard slide={slide} isActive={isActive} />
            </div>
          );
        })}
      </div>

      {/* footer — auto-advance progress + slogan + slide nav */}
      <div className="mt-1 max-w-[720px] mx-auto px-1">
        <div className="mb-3 h-1 w-full rounded-full bg-foreground/[0.07] overflow-hidden" aria-hidden>
          <div
            ref={barRef}
            className="h-full w-full origin-left rounded-full will-change-transform"
            style={{
              transform: `scaleX(${reduceMotion ? 0 : 0})`,
              background:
                'linear-gradient(90deg, #10b981 0%, #34d399 50%, #fbbf24 100%)',
            }}
          />
        </div>
        <div className="relative min-h-[76px]">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.id}
              aria-hidden={i !== activeIdx}
              className={`absolute inset-0 transition-all duration-500 ease-out ${
                i === activeIdx
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-1 pointer-events-none'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[12px] font-mono font-semibold ${
                    s.tone === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/25'
                      : s.tone === 'rose'
                      ? 'bg-rose-500/10 text-rose-700 border border-rose-500/25'
                      : s.tone === 'amber'
                      ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                      : 'bg-violet-500/10 text-violet-700 border border-violet-500/25'
                  }`}
                >
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[22px] md:text-[26px] font-semibold tracking-[-0.02em] leading-[1.2] text-foreground">
                    {s.headline}
                  </div>
                  <div className="mt-1 text-[14px] md:text-[15px] text-muted-foreground leading-snug">
                    {s.sub}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          {HERO_SLIDES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              aria-label={`Show slide ${s.label}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === active
                  ? 'w-6 bg-foreground'
                  : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSlideCard({
  slide,
  isActive = false,
}: {
  slide: (typeof HERO_SLIDES)[number];
  isActive?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-[0_24px_80px_-24px_rgba(0,0,0,0.22)] ${
        isActive
          ? 'bg-white border-zinc-900/[0.1]'
          : 'glass-card'
      }`}
    >
      {/* window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900/[0.08] bg-white/40 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="text-[11px] font-mono text-muted-foreground tracking-tight">
          chivox ·{' '}
          {slide.id === 'setup'
            ? 'mcp.config'
            : slide.id === 'mandarin'
            ? 'assess.mandarin'
            : slide.id === 'phoneme'
            ? 'phoneme.diagnose'
            : 'agent.reasoning'}
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
            slide.tone === 'emerald'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : slide.tone === 'rose'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
              : slide.tone === 'amber'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'
              : 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300'
          }`}
        >
          {slide.chip}
        </span>
      </div>

      {/* viewport */}
      <div className="relative min-h-[360px] md:min-h-[400px]">
        {slide.id === 'setup' && <HeroSlideSetup />}
        {slide.id === 'mandarin' && <HeroSlideMandarin />}
        {slide.id === 'phoneme' && <HeroSlidePhoneme />}
        {slide.id === 'reasoning' && <HeroSlideReasoning />}
      </div>
    </div>
  );
}

/* Slide 01 — Instant setup: minimal config + tools registered */
function HeroSlideSetup() {
  return (
    <div className="h-full p-5 md:p-6 flex flex-col gap-4">
      <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        claude_desktop_config.json
      </div>
      <pre className="flex-1 rounded-xl border border-zinc-900/[0.08] bg-white/50 backdrop-blur-sm p-4 font-mono text-[12.5px] leading-[1.7] whitespace-pre text-zinc-800 overflow-hidden">
<span className="text-zinc-500">{`// drop in, connect.`}</span>{`
`}<span className="text-zinc-700">{`{`}</span>{`
  `}<span className="text-sky-700">{`"mcpServers"`}</span><span className="text-zinc-500">{`: {`}</span>{`
    `}<span className="text-emerald-700">{`"chivox"`}</span><span className="text-zinc-500">{`: {`}</span>{`
      `}<span className="text-sky-700">{`"command"`}</span><span className="text-zinc-500">{`: `}</span><span className="text-amber-700">{`"npx"`}</span><span className="text-zinc-500">{`,`}</span>{`
      `}<span className="text-sky-700">{`"args"`}</span><span className="text-zinc-500">{`: [`}</span><span className="text-amber-700">{`"-y"`}</span><span className="text-zinc-500">{`, `}</span><span className="text-amber-700">{`"@chivox/mcp"`}</span><span className="text-zinc-500">{`]`}</span>{`
    `}<span className="text-zinc-500">{`}`}</span>{`
  `}<span className="text-zinc-500">{`}`}</span>{`
`}<span className="text-zinc-700">{`}`}</span>
      </pre>
      <div className="rounded-lg border border-zinc-900/[0.08] bg-white/50 backdrop-blur-sm px-3 py-2 flex items-center gap-2 font-mono text-[11.5px]">
        <Terminal className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-zinc-500">$</span>
        <span className="text-zinc-800">npx -y @chivox/mcp</span>
        <span className="ml-auto inline-flex items-center gap-1 text-emerald-700">
          <Check className="h-3 w-3" strokeWidth={3} /> 4 tools registered
        </span>
      </div>
    </div>
  );
}

/* Slide 02 — Mandarin moat: pitch-contour visualization.
 * Hero visual is an F0 trace plot. Text annotations sit at
 * the top and bottom; the "generic-STT mishears it as 睡觉"
 * fact becomes a small side-note rather than a competing
 * red box. Conveys "we see pitch, not just phonemes". */
function HeroSlideMandarin() {
  // Pitch plot layout (viewBox 0-360 × 0-150)
  //   y=10  → high (5)
  //   y=140 → low  (1)
  const y = (v: number) => 10 + ((5 - v) * 130) / 4; // v ∈ [1..5]

  return (
    <div className="h-full p-5 md:p-6 flex flex-col gap-4 relative">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          pitch trace · F0 contour
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          locked to tone
        </span>
      </div>

      {/* Target word, big and quiet */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="font-zh text-[44px] leading-none tracking-tight text-zinc-900">水饺</span>
          <div className="flex flex-col">
            <span className="font-pinyin text-[15px] text-zinc-700">shuǐ jiǎo</span>
            <span className="text-[10.5px] font-mono text-zinc-500">= dumplings</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">target tones</div>
          <div className="font-mono text-[13px] text-zinc-800 tabular-nums">T3 + T3</div>
          <div className="text-[10px] font-mono text-emerald-700">→ sandhi: T2 + T3</div>
        </div>
      </div>

      {/* Pitch-contour plot */}
      <div className="relative rounded-xl border border-zinc-900/[0.08] bg-gradient-to-br from-white/70 via-white/50 to-emerald-50/40 backdrop-blur-sm px-3 pt-3 pb-2">
        <svg viewBox="0 0 360 150" className="w-full h-[150px]" aria-hidden>
          <defs>
            <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="55%" stopColor="#10b981" />
              <stop offset="55%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* gridlines — tone levels 1..5 */}
          {[1, 2, 3, 4, 5].map((lvl) => (
            <g key={lvl}>
              <line x1="24" x2="348" y1={y(lvl)} y2={y(lvl)} stroke="rgba(24,24,27,0.06)" strokeWidth="1" />
              <text x="10" y={y(lvl) + 3} fontSize="8" fontFamily="ui-monospace, monospace" fill="rgba(24,24,27,0.35)">
                {lvl}
              </text>
            </g>
          ))}

          {/* syllable dividers */}
          <line x1="184" x2="184" y1="10" y2="140" stroke="rgba(24,24,27,0.08)" strokeDasharray="3 3" />

          {/* Actual (produced) contour — solid emerald */}
          {/* shuǐ → rises 3→5 (sandhi T2), jiǎo → 2-1-4 dip-rise (T3) */}
          <path
            d="M 30 90  C 70 88, 110 48, 170 18
               L 184 18
               M 198 62  C 230 62, 246 138, 268 134
               C 290 130, 310 90, 340 28"
            fill="none"
            stroke="url(#traceGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Citation (target) contour — dashed, light */}
          {/* Both syllables drawn as full T3 (2-1-4) to show what citation would be */}
          <path
            d="M 30 62  C 60 130, 110 138, 140 90  C 158 66, 172 30, 184 22
               M 198 62  C 228 130, 260 138, 290 90  C 308 66, 322 30, 336 22"
            fill="none"
            stroke="rgba(16,185,129,0.35)"
            strokeWidth="1.4"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />

          {/* syllable labels */}
          <text x="100" y="145" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="rgba(16,185,129,0.85)" textAnchor="middle">
            shuǐ · rising
          </text>
          <text x="265" y="145" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="rgba(16,185,129,0.85)" textAnchor="middle">
            jiǎo · dip–rise
          </text>

          {/* end dot */}
          <circle cx="340" cy="28" r="3.5" fill="#059669" />
          <circle cx="340" cy="28" r="6" fill="#10b981" opacity="0.18" />
        </svg>

        {/* legend */}
        <div className="flex items-center gap-3 px-1 pt-1 text-[10px] font-mono text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 rounded-full bg-emerald-600" />
            produced
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 rounded-full border-t border-dashed border-emerald-500/60" />
            citation
          </span>
          <span className="ml-auto">F0 · 5-level Chao</span>
        </div>
      </div>

      {/* generic-STT side-note — deliberately small, so the plot stays king */}
      <div className="rounded-lg border border-zinc-900/[0.06] bg-white/50 px-3 py-2 flex items-center gap-2.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
          generic STT
        </span>
        <span className="text-[12px] text-zinc-600">
          heard <span className="font-zh text-zinc-800">睡觉</span>{' '}
          <span className="font-pinyin">(shuì jiào · sleep)</span>
        </span>
        <span className="ml-auto text-[10px] font-mono text-rose-500">✕ tone miss</span>
      </div>

      <div className="text-[11px] text-zinc-500 leading-relaxed">
        Catches tones, erhua, neutral tone &amp; sandhi — the difference between{' '}
        <span className="font-pinyin text-zinc-700">mā</span> (mom) and{' '}
        <span className="font-pinyin text-zinc-700">mǎ</span> (horse).
      </div>
    </div>
  );
}

/* Slide 03 — Reasoning-ready payload: JSON → agent reply */
/* ── Hero slide 3 — phoneme-level diagnostics.
 *    What the listening layer actually *hears* — per-phoneme
 *    accuracy bars plus supra-segmental cues (stress, liaison,
 *    intonation). Intentionally granular; no prose.
 * ───────────────────────────────────────────────────────── */
function HeroSlidePhoneme() {
  const phones: Array<{
    ipa: string;
    v: number;
    status: 'ok' | 'weak' | 'bad' | 'dropped';
    note?: string;
  }> = [
    { ipa: '/θ/', v: 35, status: 'bad', note: 'heard /s/' },
    { ipa: '/ɪ/', v: 92, status: 'ok' },
    { ipa: '/ŋ/', v: 54, status: 'weak', note: 'weak release' },
    { ipa: '/k/', v: 0,  status: 'dropped', note: 'dropped' },
  ];
  const barCls = (s: (typeof phones)[number]['status']) =>
    s === 'ok'      ? 'bg-gradient-to-t from-emerald-400 to-emerald-600'
    : s === 'weak'  ? 'bg-gradient-to-t from-amber-300 to-amber-500'
    : s === 'bad'   ? 'bg-gradient-to-t from-rose-400 to-rose-600'
    :                 'bg-transparent border border-dashed border-rose-400';
  const chipCls = (s: (typeof phones)[number]['status']) =>
    s === 'ok'      ? 'bg-emerald-50 text-emerald-700 border-emerald-500/30'
    : s === 'weak'  ? 'bg-amber-50 text-amber-700 border-amber-500/40'
    :                 'bg-rose-50 text-rose-700 border-rose-500/30';
  return (
    <div className="h-full p-5 md:p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>word · <span className="font-mono normal-case tracking-normal text-foreground/85">think</span></span>
        <span className="font-mono text-[11px] normal-case tracking-normal">/θɪŋk/</span>
      </div>

      {/* phoneme grid */}
      <div className="rounded-xl border border-zinc-900/[0.08] bg-white/60 backdrop-blur-sm p-4">
        <div className="grid grid-cols-4 gap-3">
          {phones.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {/* bar */}
              <div className="relative h-[90px] w-full flex items-end">
                <div className="absolute inset-x-0 top-0 h-px bg-zinc-900/[0.06]" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-zinc-900/[0.04]" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-zinc-900/[0.06]" />
                <div
                  className={`mx-auto w-7 rounded-t-[4px] ${barCls(p.status)}`}
                  style={{ height: `${Math.max(p.v, p.status === 'dropped' ? 100 : 0)}%`, minHeight: p.status === 'dropped' ? '100%' : '4px' }}
                />
              </div>
              {/* phoneme label */}
              <div
                className="font-mono text-[13px] font-semibold tabular-nums"
                style={{ fontFamily: 'var(--font-hero-serif, "Fraunces", Georgia, serif)' }}
              >
                {p.ipa}
              </div>
              {/* score / note */}
              <div className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${chipCls(p.status)}`}>
                {p.status === 'dropped' ? '—' : `${p.v}%`}
              </div>
              <div className="min-h-[14px] text-[10px] font-mono text-muted-foreground text-center">
                {p.note ?? '\u00A0'}
              </div>
            </div>
          ))}
        </div>

        {/* supra-segmental strip */}
        <div className="mt-4 pt-3 border-t border-zinc-900/[0.06] grid grid-cols-3 gap-2 text-[11px] font-mono">
          <SupraCell label="STRESS"     state="ok"   value="syllable 1 · ok" />
          <SupraCell label="LIAISON"    state="ok"   value="n/a · ok" />
          <SupraCell label="INTONATION" state="ok"   value="↘ falling · ok" />
        </div>
      </div>

      {/* footer caption */}
      <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.06] to-white/40 backdrop-blur-sm px-3.5 py-2.5 flex items-center gap-2.5">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-700">
          <Waves className="h-3.5 w-3.5" />
        </span>
        <p className="text-[12px] leading-[1.5] text-foreground/85">
          <span className="font-mono font-semibold text-violet-700">60+ phonemes</span> scored for accuracy, stress
          and intonation — not a single opaque number.
        </p>
      </div>
    </div>
  );
}

function SupraCell({
  label,
  state,
  value,
}: {
  label: string;
  state: 'ok' | 'warn' | 'bad';
  value: string;
}) {
  const cls =
    state === 'ok'
      ? 'text-emerald-700 before:bg-emerald-500'
      : state === 'warn'
      ? 'text-amber-700 before:bg-amber-500'
      : 'text-rose-700 before:bg-rose-500';
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className={`inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-[10px] ${cls} before:inline-block before:h-1.5 before:w-1.5 before:rounded-full`}>
        {label}
      </span>
      <span className="text-[11px] text-foreground/80 truncate">{value}</span>
    </div>
  );
}

function HeroSlideReasoning() {
  return (
    <div className="h-full p-5 md:p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>full matrix → agent reasoning</span>
        <span className="font-mono normal-case tracking-normal text-amber-700">not one score</span>
      </div>
      <pre className="rounded-xl border border-zinc-900/[0.08] bg-white/55 backdrop-blur-sm p-3 font-mono text-[10.5px] sm:text-[11px] leading-[1.5] whitespace-pre text-zinc-800 max-h-[min(200px,38vh)] overflow-auto">
        {HERO_SLIDE_REASONING_JSON}
      </pre>

      <div className="flex items-center justify-center text-muted-foreground/60">
        <ArrowRight className="h-4 w-4 rotate-90" />
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.07] to-white/40 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-700">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700">
              Agent reply · auto-generated
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
            o1 · Sonnet · Gemini
          </span>
        </div>
        <p className="text-[13px] leading-[1.55] text-foreground/85">
          &ldquo;I noticed you pronounced <strong>think</strong> as <em>sink</em>. Place your tongue between your teeth for the{' '}
          <code className="font-mono text-[12px] px-1 py-0.5 rounded bg-white/60 border border-zinc-900/[0.06]">/θ/</code>{' '}
          sound. Try: <em>&ldquo;Thirty thirsty thinkers thought&hellip;&rdquo;</em>&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ── Hero product card — audio → Chivox MCP → JSON scores ─ */
function HeroProductCard() {
  // Deterministic-ish waveform bars so every render looks the same.
  const bars = Array.from({ length: 56 }).map((_, i) => {
    const x = i / 55;
    const h = 0.18 + 0.82 * Math.abs(Math.sin(x * Math.PI * 3) * Math.sin(x * Math.PI + 1.1));
    return Math.max(0.1, Math.min(1, h));
  });

  return (
    <div className="relative">
      {/* decorative glow */}
      <div className="absolute -inset-4 rounded-3xl bg-foreground/[0.04] blur-2xl pointer-events-none" />

      <div className="relative glass-card overflow-hidden shadow-[0_24px_80px_-24px_rgba(0,0,0,0.18)]">
        {/* faux window chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900/[0.08] bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="text-[11px] font-mono text-muted-foreground">chivox · assess_speech</div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">live</span>
        </div>

        {/* input row — waveform + reference text */}
        <div className="p-5 md:p-6 border-b border-border/60">
          <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
            input · audio
          </div>
          <div
            className="rounded-xl px-4 py-4 overflow-hidden border border-zinc-900/[0.08]"
            style={{
              background:
                'linear-gradient(135deg, rgba(24,24,27,0.82) 0%, rgba(39,39,42,0.68) 50%, rgba(24,24,27,0.82) 100%)',
              backdropFilter: 'blur(16px) saturate(140%)',
              WebkitBackdropFilter: 'blur(16px) saturate(140%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px -12px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-end gap-[3px] h-14">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="inline-block w-[4px] rounded-[2px] bg-gradient-to-t from-emerald-400/40 via-emerald-300/80 to-emerald-200"
                  style={{
                    height: `${(h * 100).toFixed(2)}%`,
                    animation: `wave-bar 1.2s ease-in-out ${i * 25}ms infinite`,
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>00:00.00</span>
              <span className="text-zinc-500">recording · 16kHz mono</span>
              <span>00:02.34</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-mono text-muted-foreground">reference_text:</span>
            <span className="text-foreground/90">&quot;The weather is absolutely gorgeous today.&quot;</span>
          </div>
        </div>

        {/* output row — structured scores */}
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              output · json
            </div>
            <span className="text-[10.5px] font-mono text-muted-foreground">latency · 187 ms</span>
          </div>

          {/* 4 score meters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {[
              { k: 'overall', v: 82 },
              { k: 'accuracy', v: 78 },
              { k: 'fluency', v: 84 },
              { k: 'rhythm', v: 80 },
            ].map((s) => (
              <ScoreMeter key={s.k} label={s.k} value={s.v} />
            ))}
          </div>

          {/* phoneme row */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              words · per-phoneme diagnostics
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <WordChip word="The" tone="ok" />
              <WordChip word="weather" tone="ok" />
              <WordChip word="is" tone="ok" />
              <WordChip word="absolutely" tone="warn" score={63} />
              <WordChip word="gorgeous" tone="bad" score={44} />
              <WordChip word="today" tone="ok" />
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-mono text-foreground/80">gorgeous</span>{' '}
              · <span className="font-mono text-rose-500">/ˈɡɔːrdʒəs/</span> → realized as{' '}
              <span className="font-mono text-rose-500">/ˈɡɔːrʒəs/</span>. Land the{' '}
              <span className="font-mono text-foreground">/d/</span> stop before the{' '}
              <span className="font-mono text-foreground">/ʒ/</span> fricative.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreMeter({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const color =
    pct >= 80 ? 'bg-emerald-500' : pct >= 65 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2.5">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[10.5px] font-mono text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums">{pct}</span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-[width] duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WordChip({ word, tone, score }: { word: string; tone: 'ok' | 'warn' | 'bad'; score?: number }) {
  const styles: Record<string, string> = {
    ok: 'border-border/60 bg-background text-foreground/80',
    warn: 'border-amber-300/70 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
    bad: 'border-rose-300/70 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${styles[tone]}`}
    >
      {word}
      {score !== undefined ? (
        <span className="text-[9.5px] opacity-80 tabular-nums">· {score}</span>
      ) : null}
    </span>
  );
}

/* ── Phoneme breakdown panel (English) ──────────────────── */
function PhonemePanel() {
  const phonemes = [
    { p: 'ɡ', score: 82 },
    { p: 'ɔː', score: 74 },
    { p: 'dʒ', score: 44 },
    { p: 'ə', score: 88 },
    { p: 's', score: 91 },
  ];
  return (
    <div className="relative rounded-2xl border border-border/60 bg-background p-6 md:p-7 h-full overflow-hidden">
      {/* subtle accent */}
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/70 bg-indigo-50/70 dark:bg-indigo-500/10 dark:border-indigo-500/30 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300 tracking-wide uppercase mb-2">
            English · phoneme alignment
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.015em] leading-tight">
            &ldquo;gorgeous&rdquo;
          </h3>
          <div className="mt-1 font-mono text-sm text-muted-foreground">/ˈɡɔːdʒəs/</div>
        </div>
        <ScoreBadge value={63} label="word score" />
      </div>

      <div className="space-y-2.5">
        {phonemes.map((ph) => {
          const tone = ph.score >= 80 ? 'ok' : ph.score >= 65 ? 'warn' : 'bad';
          const badge = {
            ok: 'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30',
            warn: 'border-amber-200/70 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
            bad: 'border-rose-300/70 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
          }[tone];
          const bar = {
            ok: 'bg-emerald-500',
            warn: 'bg-amber-500',
            bad: 'bg-rose-500',
          }[tone];
          return (
            <div key={ph.p} className="flex items-center gap-3">
              <code
                className={`shrink-0 min-w-[64px] text-center rounded-md border px-2 py-1.5 font-mono text-[13px] ${badge}`}
              >
                /{ph.p}/
              </code>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar} transition-[width] duration-700`}
                  style={{ width: `${ph.score}%` }}
                />
              </div>
              <div className="w-10 text-right text-sm font-semibold tabular-nums">{ph.score}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-indigo-200/60 bg-indigo-50/50 dark:bg-indigo-500/[0.06] dark:border-indigo-500/25 p-3.5 text-xs leading-relaxed">
        <span className="font-semibold text-indigo-800 dark:text-indigo-200">LLM hint · </span>
        <span className="text-foreground/85">
          /dʒ/ collapsed to a plain /ʒ/ — the stop onset was lost. Land the stop before the fricative — drill
          {' '}
          <em className="not-italic font-medium text-foreground">judge</em>,{' '}
          <em className="not-italic font-medium text-foreground">badge</em>,{' '}
          <em className="not-italic font-medium text-foreground">gorgeous</em>.
        </span>
      </div>
    </div>
  );
}

/* ── Tone panel (Mandarin) ─────────────────────────────── */
function TonePanel() {
  // Canonical pinyin pitch contours in a 24×24 grid (y inverted so top = high pitch).
  const CONTOURS: Record<number, string> = {
    1: 'M2 6 L22 6',
    2: 'M2 18 Q12 18 22 6',
    3: 'M2 10 L8 20 L16 18 L22 10',
    4: 'M2 6 L22 20',
  };
  // Per-tone accent color so the sentence strip reads at a glance.
  const TONE_COLOR: Record<number, { ink: string; bg: string; chip: string }> = {
    1: {
      ink: 'text-rose-600 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      chip: 'border-rose-200/70 text-rose-700 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30',
    },
    2: {
      ink: 'text-amber-600 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      chip: 'border-amber-200/70 text-amber-800 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
    },
    3: {
      ink: 'text-sky-600 dark:text-sky-300',
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      chip: 'border-sky-200/70 text-sky-700 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
    },
    4: {
      ink: 'text-violet-600 dark:text-violet-300',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      chip: 'border-violet-200/70 text-violet-700 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30',
    },
  };

  const syllables: {
    hanzi: string;
    pinyin: string;
    tone: 1 | 2 | 3 | 4;
    score: number;
    ok: boolean;
  }[] = [
    { hanzi: '你', pinyin: 'nǐ', tone: 3, score: 85, ok: true },
    { hanzi: '好', pinyin: 'hǎo', tone: 3, score: 72, ok: true },
    { hanzi: '今', pinyin: 'jīn', tone: 1, score: 88, ok: true },
    { hanzi: '天', pinyin: 'tiān', tone: 1, score: 88, ok: true },
    { hanzi: '天', pinyin: 'tiān', tone: 1, score: 58, ok: false },
    { hanzi: '气', pinyin: 'qì', tone: 4, score: 91, ok: true },
  ];

  return (
    <div className="relative rounded-2xl border border-border/60 bg-background p-6 md:p-7 h-full overflow-hidden">
      {/* subtle accent */}
      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-rose-400/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50/70 dark:bg-rose-500/10 dark:border-rose-500/30 px-2 py-0.5 text-[10px] font-medium text-rose-700 dark:text-rose-300 tracking-wide uppercase mb-2">
            Mandarin · tone accuracy
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.015em] leading-tight font-zh">
            你好，今天天气……
          </h3>
          <div className="mt-1 text-sm text-muted-foreground font-pinyin">
            nǐ hǎo, jīn tiān tiān qì
          </div>
        </div>
        <ScoreBadge value={78} label="sentence score" tone="rose" />
      </div>

      {/* sentence strip: big hanzi, pinyin, tone glyph, score */}
      <div className="grid grid-cols-6 gap-1.5">
        {syllables.map((s, idx) => {
          const c = TONE_COLOR[s.tone];
          return (
            <div
              key={idx}
              className={`relative rounded-xl border p-2.5 flex flex-col items-center text-center ${
                s.ok
                  ? 'border-border/60 bg-muted/25'
                  : 'border-rose-300/70 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/35'
              }`}
            >
              {/* hanzi */}
              <div className="font-zh text-3xl md:text-[30px] leading-none font-medium tracking-tight">
                {s.hanzi}
              </div>
              {/* pinyin */}
              <div className={`font-pinyin text-[13px] mt-1.5 leading-[1.35] ${c.ink}`}>
                {s.pinyin}
              </div>
              {/* tone contour glyph */}
              <div className={`mt-2 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-mono ${c.chip}`}>
                <svg viewBox="0 0 24 24" className="h-3 w-3.5">
                  <path
                    d={CONTOURS[s.tone]}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                T{s.tone}
              </div>
              {/* score bar */}
              <div className="mt-2 w-full h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    s.score >= 80
                      ? 'bg-emerald-500'
                      : s.score >= 65
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] font-semibold tabular-nums">{s.score}</div>
            </div>
          );
        })}
      </div>

      {/* tone legend */}
      <div className="mt-5 flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">tones</span>
        {[1, 2, 3, 4].map((t) => {
          const c = TONE_COLOR[t as 1 | 2 | 3 | 4];
          return (
            <span key={t} className={`inline-flex items-center gap-1 ${c.ink}`}>
              <svg viewBox="0 0 24 24" className="h-3 w-4">
                <path
                  d={CONTOURS[t]}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-mono">T{t}</span>
            </span>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-rose-200/60 bg-rose-50/50 dark:bg-rose-500/[0.06] dark:border-rose-500/25 p-3.5 text-xs leading-relaxed">
        <span className="font-semibold text-rose-800 dark:text-rose-200">LLM hint · </span>
        <span className="text-foreground/85">
          second <em className="not-italic font-medium font-zh text-foreground">天</em>{' '}
          <span className="font-pinyin">(tiān)</span> collapsed into T4. Keep the pitch high and steady —
          it&rsquo;s a T1.
        </span>
      </div>
    </div>
  );
}

/* ── Reusable: big score badge (top-right of panels) ────── */
function ScoreBadge({
  value,
  label,
  tone = 'indigo',
}: {
  value: number;
  label: string;
  tone?: 'indigo' | 'rose';
}) {
  const bg =
    tone === 'rose'
      ? 'from-rose-500 to-orange-500'
      : 'from-indigo-500 to-violet-500';
  return (
    <div className="text-right">
      <div
        className={`inline-flex items-baseline gap-1 bg-gradient-to-br ${bg} bg-clip-text text-transparent`}
      >
        <span className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      <div className="text-[10.5px] text-muted-foreground -mt-0.5">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  USE-CASE ARTWORK — inline colorful SVGs, Tavily-style
 * ═══════════════════════════════════════════════════════════ */
function UseCaseArtwork({ id }: { id: UseCaseArt }) {
  switch (id) {
    case 'mandarin':
      return <ArtMandarin />;
    case 'english':
      return <ArtEnglish />;
    case 'kids':
      return <ArtKids />;
    case 'podcast':
      return <ArtPodcast />;
    case 'voice':
      return <ArtVoice />;
    case 'ecosystem':
      return <ArtEcosystem />;
  }
}

/* ── AI Mandarin Tutor · 红橙渐变 + 大 汉字 + 声调轮廓 ───── */
function ArtMandarin() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-amber-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(244,63,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-rose-200/50 blur-3xl" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-zh text-rose-400/35 text-[120px] md:text-[140px] font-semibold leading-none"
          style={{ letterSpacing: '-0.04em' }}
        >
          语
        </span>
      </div>

      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        <g stroke="rgb(225,29,72)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55">
          <path d="M20 40 L110 40" />
          <path d="M20 150 Q65 150 110 70" />
          <path d="M210 60 L240 130 L280 120 L310 80" />
          <path d="M210 40 L310 130" />
        </g>
      </svg>

      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        {[
          { t: 'nǐ', k: 'T3' },
          { t: 'hǎo', k: 'T3' },
          { t: 'jīn', k: 'T1' },
        ].map((p) => (
          <span
            key={p.t}
            className="rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-pinyin text-rose-700 border border-rose-200 shadow-sm flex items-center gap-1"
          >
            {p.t}
            <span className="font-mono text-[9px] text-rose-500/80">{p.k}</span>
          </span>
        ))}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-rose-700 border border-rose-200 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        tone score · 88
      </div>
    </div>
  );
}

/* ── English Conversation Partner · 蓝紫渐变 + chat + wave ── */
function ArtEnglish() {
  const bars = Array.from({ length: 40 }).map((_, i) =>
    Math.max(0.25, Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.23 + 1)) + 0.2),
  );
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute -top-10 right-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

      {/* chat bubbles */}
      <div className="absolute top-4 left-4 rounded-xl bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[11px] text-indigo-800 shadow-md border border-white/70 max-w-[60%]">
        How would you pronounce <em className="not-italic font-semibold">gorgeous</em>?
      </div>
      <div className="absolute top-[55%] right-3 rounded-xl bg-indigo-950/70 backdrop-blur-sm px-2.5 py-1.5 text-[11px] text-white shadow-md border border-white/20">
        GPT · you said /gor-ʒuːs/
      </div>

      {/* waveform */}
      <svg viewBox="0 0 320 60" className="absolute bottom-3 left-3 right-3 w-[calc(100%-1.5rem)] h-12">
        {bars.map((h, i) => {
          const x = Number(((i / bars.length) * 320).toFixed(2));
          const barH = Number((h * 50).toFixed(2));
          const y = Number((30 - barH / 2).toFixed(2));
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="4"
              height={barH}
              rx="1.5"
              fill="white"
              opacity={0.85}
            />
          );
        })}
      </svg>

      {/* score chip */}
      <div className="absolute bottom-16 right-3 inline-flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-indigo-700 border border-white/70 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        fluency · 82
      </div>
    </div>
  );
}

/* ── Kids' Reading Coach · 粉-桃渐变 + 星星 + 书 + phonics ─── */
function ArtKids() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-fuchsia-400 to-rose-300 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1.2px, transparent 1.2px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-yellow-200/40 blur-2xl" />

      {/* book */}
      <svg viewBox="0 0 200 120" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%]">
        <defs>
          <linearGradient id="bookPage" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fff0f6" />
          </linearGradient>
        </defs>
        <path
          d="M100 20 C70 10 40 12 20 22 L20 100 C40 90 70 92 100 100 C130 92 160 90 180 100 L180 22 C160 12 130 10 100 20 Z"
          fill="url(#bookPage)"
          stroke="white"
          strokeWidth="2"
          opacity="0.95"
        />
        <line x1="100" y1="20" x2="100" y2="100" stroke="#f9a8d4" strokeWidth="1.5" />
        {/* text lines */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line x1="30" y1={40 + i * 16} x2="90" y2={40 + i * 16} stroke="#f472b6" strokeWidth="2" opacity="0.65" />
            <line x1="110" y1={40 + i * 16} x2="170" y2={40 + i * 16} stroke="#f472b6" strokeWidth="2" opacity={i === 1 ? 0.3 : 0.65} />
          </g>
        ))}
      </svg>

      {/* stars */}
      {[
        { cx: 30, cy: 30, r: 5 },
        { cx: 290, cy: 40, r: 7 },
        { cx: 40, cy: 150, r: 6 },
        { cx: 280, cy: 160, r: 4 },
      ].map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute text-yellow-300"
          style={{ left: s.cx, top: s.cy, width: s.r * 3, height: s.r * 3 }}
        >
          <path
            d="M12 2 L14.5 9 L22 9.5 L16 14 L18 22 L12 17.5 L6 22 L8 14 L2 9.5 L9.5 9 Z"
            fill="currentColor"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      ))}

      {/* phonics badges */}
      <div className="absolute bottom-3 left-3 flex gap-1.5">
        {['/æ/', '/t/', '/s/'].map((p) => (
          <span
            key={p}
            className="rounded-md bg-white/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono text-fuchsia-700 border border-white/60 shadow-sm"
          >
            {p}
          </span>
        ))}
      </div>
      <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono text-rose-600 border border-white/70 shadow-sm">
        ⭐ 5 / 5
      </div>
    </div>
  );
}

/* ── Content QA · 青/绿渐变 + 波形 + 时间轴 + retake 标记 ── */
function ArtPodcast() {
  const bars = Array.from({ length: 60 }).map((_, i) =>
    Math.abs(Math.sin(i * 0.35) * Math.cos(i * 0.7 + 2)) + 0.15,
  );
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -bottom-12 right-10 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />

      <svg viewBox="0 0 320 100" className="absolute inset-x-4 top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] h-24">
        {bars.map((h, i) => {
          const x = Number(((i / bars.length) * 320).toFixed(2));
          const barH = Number((h * 80).toFixed(2));
          const y = Number((50 - barH / 2).toFixed(2));
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="3.5"
              height={barH}
              rx="1.5"
              fill="rgb(5,150,105)"
              opacity={i >= 28 && i <= 36 ? 0.22 : 0.65}
            />
          );
        })}
        <rect x={146} y={10} width="44" height="80" rx="4" fill="rgba(5,150,105,0.08)" stroke="rgb(5,150,105)" strokeOpacity="0.55" strokeDasharray="3 3" />
        <text x={168} y={8} textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fill="rgb(6,95,70)">
          retake
        </text>
      </svg>

      <div className="absolute bottom-3 inset-x-3 flex justify-between text-[10px] font-mono text-emerald-800">
        <span>00:00</span>
        <span className="text-emerald-600/60">·</span>
        <span className="bg-white/80 rounded px-1.5 py-0.5 border border-emerald-200">01:24 retake</span>
        <span className="text-emerald-600/60">·</span>
        <span>02:48</span>
      </div>

      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-emerald-700 border border-emerald-200 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        AI QA · live
      </div>
    </div>
  );
}

/* ── Voice Agents · 紫渐变 + IM 聊天线程 + 语音消息 ──────── */
function ArtVoice() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-sky-50 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: 'radial-gradient(rgba(139,92,246,0.10) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl" />

      <div className="absolute inset-0 p-5 flex flex-col gap-2 justify-center">
        <div className="flex items-center gap-2 max-w-[82%]">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-300 to-violet-400 shrink-0 shadow-sm" />
          <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 flex items-center gap-2 shadow-sm border border-violet-100">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-600" fill="currentColor">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
            <div className="flex items-end gap-0.5 h-4">
              {[4, 8, 12, 10, 14, 8, 6, 10, 5].map((h, i) => (
                <span key={i} className="w-0.5 rounded-full bg-violet-500" style={{ height: `${h}px` }} />
              ))}
            </div>
            <span className="text-[10px] font-mono text-violet-700">0:06</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 max-w-[90%] ml-auto">
          <div className="rounded-2xl rounded-br-sm bg-violet-900/92 backdrop-blur-sm px-3 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-[11px] text-white/95">Scored</span>
            <span className="rounded-md bg-emerald-400/25 text-emerald-100 px-1.5 py-0.5 text-[10px] font-mono">overall 84</span>
            <span className="rounded-md bg-amber-400/25 text-amber-100 px-1.5 py-0.5 text-[10px] font-mono">fluency 78</span>
          </div>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 shrink-0 shadow-sm flex items-center justify-center text-[10px] font-bold text-white">
            ai
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-[70%]">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-300 to-violet-400 shrink-0 shadow-sm" />
          <div className="rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 shadow-sm border border-violet-100 text-[11px] text-violet-800">
            Try it again, focus on /θ/
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-violet-700 border border-violet-200 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        voice · live
      </div>
    </div>
  );
}

/* ── Dev Ecosystem · 绿渐变 + 中心节点 + 客户端星环 ──────── */
function ArtEcosystem() {
  const NODES = [
    { label: 'Cursor', angle: -90 },
    { label: 'Claude', angle: -30 },
    { label: 'Cline', angle: 30 },
    { label: 'LangChain', angle: 90 },
    { label: 'Zed', angle: 150 },
    { label: 'Dify', angle: 210 },
  ];
  const rx = 110;
  const ry = 58;
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-emerald-50 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        <ellipse cx="160" cy="90" rx={rx + 10} ry={ry + 10} stroke="rgb(14,165,233)" strokeOpacity="0.25" strokeDasharray="3 5" fill="none" />
        <ellipse cx="160" cy="90" rx={rx - 20} ry={ry - 14} stroke="rgb(14,165,233)" strokeOpacity="0.18" strokeDasharray="2 4" fill="none" />

        {NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 160 + Math.cos(rad) * rx;
          const y = 90 + Math.sin(rad) * ry;
          return (
            <line
              key={n.label}
              x1="160"
              y1="90"
              x2={x}
              y2={y}
              stroke="rgb(14,165,233)"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
          );
        })}

        <circle cx="160" cy="90" r="24" fill="white" stroke="rgb(14,165,233)" strokeOpacity="0.35" />
        <text
          x="160"
          y="94"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#0369a1"
          fontFamily="ui-sans-serif, system-ui"
        >
          chivox
        </text>

        {NODES.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 160 + Math.cos(rad) * rx;
          const y = 90 + Math.sin(rad) * ry;
          return (
            <g key={n.label}>
              <circle cx={x} cy={y} r="4" fill="rgb(14,165,233)" />
              <rect
                x={x - 30}
                y={y + 8}
                width="60"
                height="16"
                rx="5"
                fill="white"
                stroke="rgb(14,165,233)"
                strokeOpacity="0.25"
              />
              <text
                x={x}
                y={y + 19}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui"
                fill="#0369a1"
                fontWeight="600"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-mono text-sky-700 border border-sky-200 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        MCP · 1 config
      </div>
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-sky-700/80">
        + LlamaIndex · OpenAI Agents SDK
      </div>
    </div>
  );
}

/* ── Micro-charts for benchmark tabs ───────────────────── */
function BenchmarkMicroChart({ id }: { id: string }) {
  // All charts share a single axis colour + emerald/amber/sky palette so
  // they feel related to the rest of the landing page, while each tab still
  // gets its own distinctive visual identity.
  const axis = 'rgba(15, 23, 42, 0.18)';

  if (id === 'correlation') {
    return (
      <svg viewBox="0 0 180 96" className="w-48 h-24">
        <defs>
          <linearGradient id="corr-trend" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <radialGradient id="corr-dot" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <line x1="0" y1="86" x2="180" y2="86" stroke={axis} />
        <line x1="12" y1="90" x2="12" y2="6" stroke={axis} />
        {Array.from({ length: 42 }).map((_, i) => {
          const x = 12 + (i / 41) * 158;
          const base = (i / 41) * 72 + 4;
          const jitter = (Math.sin(i * 1.7) + 1) * 3.4;
          const y = 84 - (base + jitter);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.2"
              fill="url(#corr-dot)"
              opacity="0.9"
            />
          );
        })}
        <line
          x1="12"
          y1="78"
          x2="170"
          y2="10"
          stroke="url(#corr-trend)"
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <text x="170" y="18" textAnchor="end" fontSize="8" fill="#059669" fontWeight={600}>
          r ≈ 0.95
        </text>
      </svg>
    );
  }

  if (id === 'latency') {
    const bars = [18, 26, 40, 58, 88, 62, 44, 30, 22, 18];
    return (
      <svg viewBox="0 0 180 96" className="w-48 h-24">
        <defs>
          <linearGradient id="lat-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="55%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <line x1="0" y1="86" x2="180" y2="86" stroke={axis} />
        {bars.map((b, i) => {
          const x = 12 + i * 16;
          const peak = i === 4;
          return (
            <g key={i}>
              <rect
                x={x}
                y={86 - b}
                width="10"
                height={b}
                rx="3"
                fill="url(#lat-grad)"
                opacity={0.55 + (b / 100) * 0.45}
              />
              {peak && (
                <circle cx={x + 5} cy={86 - b - 4} r="2" fill="#fbbf24" />
              )}
            </g>
          );
        })}
        <text x="172" y="14" textAnchor="end" fontSize="8" fill="#0369a1" fontWeight={600}>
          p50 · 240 ms
        </text>
      </svg>
    );
  }

  if (id === 'coverage') {
    // One hue per task type — a compact rainbow walks from cool to warm,
    // so "7 task types" reads at a glance as a spectrum of capability.
    const items: Array<{ l: string; c: string }> = [
      { l: 'word', c: '#6366f1' },   // indigo
      { l: 'sent', c: '#3b82f6' },   // blue
      { l: 'para', c: '#0ea5e9' },   // sky
      { l: 'semi', c: '#10b981' },   // emerald
      { l: 'open', c: '#22c55e' },   // green
      { l: 'free', c: '#fbbf24' },   // amber
      { l: 'talk', c: '#f43f5e' },   // rose
    ];
    return (
      <svg viewBox="0 0 180 96" className="w-48 h-24">
        {items.map((it, i) => {
          const cx = 14 + i * 24;
          return (
            <g key={it.l}>
              <circle cx={cx} cy="40" r="12" fill={it.c} opacity="0.18" />
              <circle cx={cx} cy="40" r="8" fill={it.c} />
              <text
                x={cx}
                y="78"
                textAnchor="middle"
                fontSize="8"
                fill="#0f172a"
                opacity="0.65"
                fontFamily="ui-monospace, monospace"
              >
                {it.l}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // scale — growth curve with emerald fill and an amber "now" marker
  return (
    <svg viewBox="0 0 180 96" className="w-48 h-24">
      <defs>
        <linearGradient id="scale-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="scale-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <line x1="0" y1="86" x2="180" y2="86" stroke={axis} />
      <path
        d="M6 78 Q44 72 80 62 T138 30 T174 8 L174 86 L6 86 Z"
        fill="url(#scale-fill)"
      />
      <path
        d="M6 78 Q44 72 80 62 T138 30 T174 8"
        stroke="url(#scale-stroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="174" cy="8" r="3.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
      <text x="168" y="22" textAnchor="end" fontSize="8" fill="#b45309" fontWeight={600}>
        9.2B / yr
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  NAV + FOOTER
 * ═══════════════════════════════════════════════════════════ */

/** Brand lockup — same as `src/components/logo-link.tsx` (main Chivox product). */
function ChivoxMcpBrand({ className, onWarm = false }: { className?: string; onWarm?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5 shrink-0', className)}>
      <span className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center shadow-sm ring-1 ring-zinc-900/10">
        <AudioWaveform className="h-[18px] w-[18px] text-[#fbf6e9]" strokeWidth={2.3} />
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2',
            onWarm ? 'ring-[#fbf6e9]' : 'ring-background',
          )}
        />
      </span>
      <span className="font-bold tracking-[-0.02em] text-lg leading-none flex items-baseline gap-1">
        <span className={onWarm ? 'text-zinc-900' : 'text-foreground'}>Chivox</span>
        <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
          MCP
        </span>
      </span>
    </span>
  );
}

type NavItem = {
  href: string;
  label: string;
  /** If true, this item navigates to another page instead of scrolling to an in-page section. */
  external?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { href: '#quickstart', label: 'Quickstart' },
  { href: '#reasoning-engine-trigger', label: 'Reasoning' },
  { href: '#mandarin-moat', label: 'Mandarin' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '#runtime', label: 'Runtime' },
  { href: '/global/docs', label: 'Docs', external: true },
  { href: '#contact', label: 'Contact' },
] as const;

function TopNav() {
  // Scroll-linked pill: three visible reactions to page scroll —
  //   1) width/height contracts,
  //   2) surface becomes more opaque + shadow deepens,
  //   3) a thin emerald progress bar below fills with scroll %.
  // Plus: the currently visible section gets an active pill + dot.
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.filter((i) => !i.external && i.href.startsWith('#')).map(
      (i) => i.href.slice(1),
    );
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div aria-hidden className="h-[84px] shrink-0" />
      <header className="fixed inset-x-0 top-0 z-40 w-full pointer-events-none">
        <div className="mx-auto px-3 sm:px-4 pt-3 pointer-events-auto">
          <div
            className={cn(
              'mx-auto flex items-center gap-3 rounded-full border',
              'transition-[max-width,height,padding,background-color,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]',
              scrolled
                ? 'h-[58px] max-w-[min(calc(100%-0.5rem),76rem)] pl-4 pr-1.5 border-zinc-900/[0.08]'
                : 'h-[68px] max-w-[min(calc(100%-0.5rem),92rem)] pl-5 pr-2 border-white/60',
            )}
            style={{
              backgroundColor: scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.36)',
              backdropFilter: scrolled
                ? 'blur(28px) saturate(200%)'
                : 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: scrolled
                ? 'blur(28px) saturate(200%)'
                : 'blur(18px) saturate(160%)',
              boxShadow: scrolled
                ? 'inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(24,24,27,0.05), 0 22px 50px -22px rgba(24,24,27,0.32), 0 4px 12px -6px rgba(24,24,27,0.12)'
                : 'inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 0 rgba(24,24,27,0.03), 0 16px 36px -20px rgba(24,24,27,0.18), 0 3px 10px -8px rgba(24,24,27,0.06)',
            }}
          >
            <Link
              href="/global"
              className="shrink-0 rounded-lg outline-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-400/40"
              aria-label="Chivox MCP home"
            >
              <ChivoxMcpBrand />
            </Link>

            <nav
              className="hidden md:flex items-center justify-end flex-1 min-w-0 gap-0.5 lg:gap-1 text-[13.5px] font-medium tracking-[-0.005em] text-zinc-700"
              aria-label="Page sections"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = !item.external && active === item.href;
                const commonClass = cn(
                  'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all duration-300',
                  isActive
                    ? 'text-zinc-900 bg-gradient-to-b from-emerald-50 to-white shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]'
                    : 'hover:text-zinc-900 hover:bg-zinc-900/[0.04]',
                );

                if (item.external) {
                  return (
                    <Link key={item.href} href={item.href} className={commonClass}>
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={commonClass}
                  >
                    {isActive && (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:text-zinc-900 hover:bg-zinc-900/[0.04] transition-colors"
              >
                GitHub
                <ArrowUpRight className="h-3.5 w-3.5 opacity-55" />
              </a>
            </nav>

            <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
              <Link
                href="/dev-en/login"
                className={cn(
                  'inline-flex items-center gap-1.5 pl-4 pr-3.5 text-sm font-semibold rounded-full bg-zinc-900 text-zinc-50 hover:-translate-y-px transition-all duration-300',
                  scrolled
                    ? 'h-9 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)]'
                    : 'h-10 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)]',
                )}
              >
                Sign in
                <ArrowRight className="h-3.5 w-3.5 opacity-90" />
              </Link>
            </div>

            {/* scroll progress — emerald hairline across the bottom edge */}
            <div
              aria-hidden
              className="absolute left-4 right-4 bottom-0 h-[2px] rounded-full overflow-hidden"
              style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 300ms ease' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background:
                    'linear-gradient(90deg, #10b981 0%, #34d399 50%, #fbbf24 100%)',
                  transition: 'width 120ms linear',
                }}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{
        background:
          'linear-gradient(to bottom right, rgba(16,185,129,0.10) 0%, rgba(245,158,11,0.06) 55%, rgba(255,255,255,0.35) 100%)',
        borderTop: '1px solid rgba(16,185,129,0.22)',
      }}
    >
      {/* emerald top rule */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
        }}
      />

      <div className="container mx-auto px-6 py-14 md:py-16 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* ─── LEFT: brand · stay-connected · email ─── */}
          <div className="lg:col-span-7">
            <Link
              href="/global"
              className="inline-block mb-6 rounded-lg outline-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-400/30"
              aria-label="Chivox MCP"
            >
              <ChivoxMcpBrand onWarm />
            </Link>

            <div className="text-[13.5px] font-medium text-zinc-800 mb-4">Stay connected with us</div>

            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <SocialIcon label="X / Twitter" href="https://x.com/">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M17.6 3h3.3l-7.2 8.3L22 21h-6.6l-5.2-6.7L4.3 21H1l7.8-8.9L1 3h6.8l4.7 6.2L17.6 3zm-1.1 16h1.8L7.6 5H5.6l10.9 14z" fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn" href="https://linkedin.com/">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M4.98 3.5A2.5 2.5 0 1 1 4.97 8.5a2.5 2.5 0 0 1 .01-5zM3 9.5h4v11H3v-11zm6 0h3.8v1.5h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.7 5 6.2v5.3h-4v-4.7c0-1.1 0-2.6-1.6-2.6-1.6 0-1.8 1.2-1.8 2.5v4.8H9v-11z" fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon label="GitHub" href="https://github.com/">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon label="YouTube" href="https://youtube.com/">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" fill="currentColor" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Discord" href="https://discord.com/">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M19.7 4.9A17 17 0 0 0 15.4 3.5a.1.1 0 0 0-.1 0c-.2.3-.4.7-.6 1.1a16 16 0 0 0-4.6 0c-.2-.4-.4-.8-.6-1.1a.1.1 0 0 0-.1 0A17 17 0 0 0 5 4.9a.1.1 0 0 0 0 0A17 17 0 0 0 2 14.7a.1.1 0 0 0 0 .1 17 17 0 0 0 5 2.6.1.1 0 0 0 .1 0c.4-.5.7-1 1-1.6a.1.1 0 0 0-.1-.2 12 12 0 0 1-1.7-.8.1.1 0 0 1 0-.2l.3-.2a.1.1 0 0 1 .1 0 12 12 0 0 0 10.5 0 .1.1 0 0 1 .1 0l.3.2a.1.1 0 0 1 0 .2 11 11 0 0 1-1.6.8.1.1 0 0 0-.1.2c.3.6.6 1.1 1 1.6a.1.1 0 0 0 .1 0 17 17 0 0 0 5-2.6.1.1 0 0 0 0-.1 17 17 0 0 0-3-9.8.1.1 0 0 0 0 0zM8.7 13.2c-1 0-1.8-1-1.8-2.1s.8-2.1 1.8-2.1 1.8 1 1.8 2.1-.8 2.1-1.8 2.1zm6.6 0c-1 0-1.8-1-1.8-2.1s.8-2.1 1.8-2.1 1.8 1 1.8 2.1-.8 2.1-1.8 2.1z" fill="currentColor" />
                </svg>
              </SocialIcon>

              {/* email pill */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/60 backdrop-blur-sm pl-4 pr-1 py-1 hover:border-emerald-500/45 transition-colors"
              >
                <input
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  className="bg-transparent outline-none text-[13px] text-zinc-900 placeholder:text-zinc-500 w-28 sm:w-40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="h-7 w-7 rounded-full bg-zinc-900 text-white inline-flex items-center justify-center hover:bg-zinc-700 transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            <p className="text-[11.5px] text-zinc-600 leading-relaxed max-w-md">
              By submitting your email, you agree to receive occasional product updates from the
              Chivox MCP team. No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* ─── RIGHT: minimal developer links ─── */}
          <div className="lg:col-span-5 lg:pl-6">
            <div className="text-[13.5px] font-medium text-zinc-800 mb-4">Developers</div>
            <ul className="flex flex-col gap-3 text-[14px] text-zinc-700">
              <li>
                <Link href="#quickstart" className="hover:text-zinc-900 transition-colors">
                  Quickstart
                </Link>
              </li>
              <li>
                <Link href="#mandarin-moat" className="hover:text-zinc-900 transition-colors">
                  Mandarin moat
                </Link>
              </li>
              <li>
                <Link href="#reasoning-engine-trigger" className="hover:text-zinc-900 transition-colors">
                  Agent reasoning
                </Link>
              </li>
              <li>
                <Link href="/global/docs" className="hover:text-zinc-900 transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/global#contact" className="hover:text-zinc-900 transition-colors">
                  Contact sales
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── BOTTOM STRIP ─── */}
        <div className="mt-14 pt-5 border-t border-zinc-900/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-zinc-600">
          <span>Built by speech scientists. Trusted by 10k+ voice-AI builders.</span>
          <span>©{year} Chivox Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="h-8 w-8 rounded-full border border-zinc-900/20 text-zinc-700 hover:text-zinc-900 hover:border-zinc-900/50 bg-transparent inline-flex items-center justify-center transition-colors"
    >
      {children}
    </a>
  );
}

/* ── client logos (inline SVG brand marks) ──────────────────
 * Simplified, monochrome-ready glyphs. Not official artwork — shipped
 * inline to avoid third-party asset dependencies and keep page weight
 * low. Hover lifts opacity to give the row a subtle "live" feel.
 * ────────────────────────────────────────────────────────── */
function ClientLogo({ name }: { name: string }) {
  return (
    <span
      className="group inline-flex items-center gap-2.5 text-foreground/70 hover:text-foreground transition-colors"
      title={name}
    >
      <span className="h-7 w-7 flex items-center justify-center shrink-0">
        <LogoMark name={name} />
      </span>
      <span className="text-[16px] md:text-[17px] font-semibold tracking-tight whitespace-nowrap">
        {name}
      </span>
    </span>
  );
}

function LogoMark({ name }: { name: string }) {
  const s = 'h-[26px] w-[26px]';
  switch (name) {
    case 'Cursor':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden>
          <path d="M4 3l16 9-7.2 2.1L10.5 21 4 3z" fill="currentColor" />
        </svg>
      );
    case 'Claude Desktop':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden>
          <path
            d="M7.6 17.5l3.2-8.3h1.4l3.2 8.3h-1.6l-.8-2.2h-3l-.8 2.2H7.6zm2.8-3.4h2.2l-1.1-3.2-1.1 3.2z"
            fill="currentColor"
          />
          <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case 'Cline':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden>
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 10l2.4 2L7 14M11.5 14.5h5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Windsurf':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M2 9c2.5-2 5-2 7.5 0s5 2 7.5 0 5-2 5-2" />
          <path d="M2 14c2.5-2 5-2 7.5 0s5 2 7.5 0 5-2 5-2" />
          <path d="M2 19c2.5-2 5-2 7.5 0s5 2 7.5 0 5-2 5-2" />
        </svg>
      );
    case 'Zed':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden>
          <path
            d="M5 5h14v2.5l-9.3 9h9.3V19H5v-2.5l9.3-9H5V5z"
            fill="currentColor"
          />
        </svg>
      );
    case 'LangChain':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <rect x="3.5" y="8" width="8" height="8" rx="4" />
          <rect x="12.5" y="8" width="8" height="8" rx="4" />
          <path d="M9 12h6" />
        </svg>
      );
    case 'LlamaIndex':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden>
          <path
            d="M6 20c-.2-4 .6-7 2.5-9 1.6-1.7 3.4-2 4.8-2 .8 0 1.7.1 2.4.5.4-.6 1-1 1.7-1 1 0 1.8.8 1.8 1.8 0 .7-.4 1.3-1 1.6.2.6.3 1.2.3 1.8 0 3.8-3 7-7.4 7H6z"
            fill="currentColor"
          />
          <circle cx="17.2" cy="10.2" r="0.6" fill="#fff" />
        </svg>
      );
    case 'OpenAI Agents SDK':
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3.2a4 4 0 013.6 2.2 4 4 0 013.1 6 4 4 0 01-1.5 5.5 4 4 0 01-5.2 2.9A4 4 0 018.4 18a4 4 0 01-3.1-6 4 4 0 011.5-5.5A4 4 0 0112 3.2z" />
          <path d="M12 8.5v7M8.8 10.2l6.4 3.6M8.8 13.8l6.4-3.6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={s} aria-hidden>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      );
  }
}

/* Suppress unused-import lint for icons kept for potential future sections. */
void Bot;
void Baby;
void GraduationCap;
void Globe2;
