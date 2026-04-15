'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft, Loader2, Play, BrainCircuit, BookOpen, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Phase = 'idle' | 'assessing' | 'scores' | 'analyzing' | 'analysis' | 'generating' | 'practice';

const SCORES = {
  overall: 78,
  accuracy: 72,
  fluency: 85,
  speed: 130,
  stress: 68,
  linking: 75,
};

const SCORE_LABELS: Record<string, string> = {
  overall: '总分',
  accuracy: '准确度',
  fluency: '流利度',
  speed: '语速',
  stress: '重弱读',
  linking: '连读',
};

const ANALYSIS_LINES = [
  { type: 'heading', text: '音素级诊断' },
  { type: 'weak', label: '/θ/ (th)', detail: '被替换为 /s/，出现在 "the" 中，建议舌尖抵上齿' },
  { type: 'weak', label: '/ɒ/ (o)', detail: '"fox" 中元音偏扁，需加大口腔开合度' },
  { type: 'ok', label: '/dʒ/ (j)', detail: '"jumps" 发音准确' },
  { type: 'heading', text: '韵律分析' },
  { type: 'weak', label: '重音偏移', detail: '"over" 重音落在第二音节，应在第一音节' },
  { type: 'ok', label: '连读', detail: '"jumps over" 衔接自然，过渡流畅' },
  { type: 'weak', label: '尾部降调不足', detail: '陈述句末 "dog" 语调应更明显下降' },
];

const PRACTICE_ITEMS = [
  {
    category: '音素矫正',
    icon: '🎯',
    exercises: [
      { label: '/θ/ 专项绕口令', content: 'The thirty-three thieves thought that they thrilled the throne throughout Thursday.' },
      { label: '/ɒ/ 元音对比', content: 'The fox in the box got lots of socks from the shop on the block.' },
    ],
  },
  {
    category: '韵律训练',
    icon: '🎵',
    exercises: [
      { label: '重音标注跟读', content: 'The \'quick \'brown \'fox \'jumps \'over the \'lazy \'dog.（加粗为重音词）' },
      { label: '语调模仿', content: '模仿示范音频，注意句末降调 ↘ 的幅度和节奏' },
    ],
  },
  {
    category: '综合提升',
    icon: '📈',
    exercises: [
      { label: '限时朗读挑战', content: '在 4 秒内自然读完全句，保持 120-140 wpm 语速' },
      { label: '录音对比', content: '录制自己的朗读，与示范音频逐词对比，关注 the/fox/over 三处' },
    ],
  },
];

function AnimatedScore({ target, label }: { target: number; label: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const color = target >= 80 ? 'text-emerald-600' : target >= 70 ? 'text-amber-600' : 'text-rose-500';

  return (
    <div className="bg-background p-4 flex flex-col items-center">
      <span className={`text-2xl font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

function TypewriterText({ lines }: { lines: typeof ANALYSIS_LINES }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount < lines.length) {
      const delay = lines[visibleCount]?.type === 'heading' ? 400 : 250;
      const timer = setTimeout(() => setVisibleCount(v => v + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, lines]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  return (
    <div ref={containerRef} className="space-y-2 max-h-[360px] overflow-y-auto">
      {lines.slice(0, visibleCount).map((line, i) => (
        <div
          key={i}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {line.type === 'heading' ? (
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2 first:mt-0">{line.text}</h4>
          ) : (
            <div className={`flex gap-3 items-start rounded-md px-3 py-2 text-sm ${
              line.type === 'weak' ? 'bg-rose-50 border border-rose-100' : 'bg-emerald-50 border border-emerald-100'
            }`}>
              <span className={`shrink-0 font-mono text-xs font-semibold mt-0.5 ${
                line.type === 'weak' ? 'text-rose-500' : 'text-emerald-500'
              }`}>{line.type === 'weak' ? '⚠' : '✓'}</span>
              <div>
                <span className="font-medium">{line.label}</span>
                <span className="text-muted-foreground ml-1.5">— {line.detail}</span>
              </div>
            </div>
          )}
        </div>
      ))}
      {visibleCount < lines.length && (
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs py-1">
          <Loader2 className="h-3 w-3 animate-spin" /> 分析中...
        </div>
      )}
    </div>
  );
}

export default function DemoPage() {
  const [text] = useState('The quick brown fox jumps over the lazy dog.');
  const [phase, setPhase] = useState<Phase>('idle');

  function handleDemo() {
    setPhase('assessing');
    setTimeout(() => setPhase('scores'), 2000);
  }

  function handleAnalyze() {
    setPhase('analyzing');
    setTimeout(() => setPhase('analysis'), 600);
  }

  function handlePractice() {
    setPhase('generating');
    setTimeout(() => setPhase('practice'), 800);
  }

  function handleReset() {
    setPhase('idle');
  }

  return (
    <main className="flex-1">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">在线体验</h1>
        <p className="text-muted-foreground mb-12 max-w-lg">
          体验驰声 MCP 的完整工作流程：语音评测 → LLM 深度分析 → 个性化练习建议。
        </p>

        <div className="max-w-3xl">
          {/* Progress indicator */}
          <div className="flex items-center gap-0 mb-10">
            {[
              { label: '语音评测', active: phase !== 'idle' },
              { label: '深度分析', active: ['analysis', 'analyzing', 'generating', 'practice'].includes(phase) },
              { label: '练习建议', active: phase === 'practice' || phase === 'generating' },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && (
                  <div className={`w-12 md:w-20 h-px transition-colors duration-500 ${step.active ? 'bg-foreground' : 'bg-border'}`} />
                )}
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                    step.active ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Text to read */}
          <div className="border border-border/60 rounded-lg p-6 mb-6">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">请朗读以下文本 / Read the text below</p>
            <p className="text-lg font-medium leading-relaxed">{text}</p>
          </div>

          {/* Action button */}
          {phase === 'idle' && (
            <button
              onClick={handleDemo}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors mb-8"
            >
              <Play className="h-4 w-4" /> 模拟评测
            </button>
          )}

          {phase === 'assessing' && (
            <button disabled className="inline-flex items-center justify-center gap-2 h-12 px-8 text-sm font-medium rounded-lg bg-foreground text-background opacity-50 cursor-not-allowed mb-8">
              <Loader2 className="h-4 w-4 animate-spin" /> 评测中...
            </button>
          )}

          {/* === Phase 1: Scores === */}
          {(phase === 'scores' || phase === 'analyzing' || phase === 'analysis' || phase === 'generating' || phase === 'practice') && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Step 1 · 评测结果</h3>
                  <span className="text-xs text-muted-foreground">MCP 返回 6 项核心指标</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-border/40">
                  {Object.entries(SCORES).map(([key, value]) => (
                    <AnimatedScore key={key} target={value} label={SCORE_LABELS[key] || key} />
                  ))}
                </div>
              </div>

              {phase === 'scores' && (
                <button
                  onClick={handleAnalyze}
                  className="mt-4 inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  <BrainCircuit className="h-4 w-4" /> 开始深度分析
                </button>
              )}
            </div>
          )}

          {/* === Phase 2: Deep Analysis === */}
          {phase === 'analyzing' && (
            <div className="mb-6">
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Step 2 · LLM 正在分析...
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          )}

          {(phase === 'analysis' || phase === 'generating' || phase === 'practice') && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Step 2 · 深度分析</h3>
                  <span className="text-xs text-muted-foreground">LLM 基于 MCP 数据诊断</span>
                </div>
                <div className="p-6">
                  <TypewriterText lines={ANALYSIS_LINES} />
                </div>
                <div className="px-6 py-3 border-t border-border/40 bg-zinc-950 text-zinc-400">
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                    <span className="text-zinc-600">{'// LLM Prompt 片段'}</span>{'\n'}
                    <span className="text-emerald-400">system</span>: &quot;你是一位专业英语语音教练。请分析以下 MCP 评测数据...&quot;{'\n'}
                    <span className="text-emerald-400">user</span>: {'{'} overall: 78, accuracy: 72, weak_phonemes: [&quot;θ&quot;, &quot;ɒ&quot;] {'}'}
                  </pre>
                </div>
              </div>

              {phase === 'analysis' && (
                <button
                  onClick={handlePractice}
                  className="mt-4 inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  <BookOpen className="h-4 w-4" /> 生成练习建议
                </button>
              )}
            </div>
          )}

          {/* === Phase 3: Practice Suggestions === */}
          {phase === 'generating' && (
            <div className="mb-6">
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Step 3 · 正在生成练习方案...
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3 mb-3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          )}

          {phase === 'practice' && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border border-border/60 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Step 3 · 个性化练习建议</h3>
                  <span className="text-xs text-muted-foreground">LLM 智能生成</span>
                </div>
                <div className="divide-y divide-border/40">
                  {PRACTICE_ITEMS.map((group, gi) => (
                    <div key={gi} className="p-6">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                        <span>{group.icon}</span> {group.category}
                      </h4>
                      <div className="space-y-3">
                        {group.exercises.map((ex, ei) => (
                          <div key={ei} className="bg-muted/40 rounded-lg p-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{ex.label}</p>
                            <p className="text-sm leading-relaxed">{ex.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 text-sm font-medium rounded-lg border border-border/60 hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-4 w-4" /> 重新体验
                </button>
                <p className="text-xs text-muted-foreground">
                  以上为模拟演示。实际接入后，所有分析和建议由 LLM 基于 MCP 实时评测数据动态生成。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
