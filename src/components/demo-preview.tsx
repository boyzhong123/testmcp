'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Mic, Sparkles, Zap, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type QKey = 'word' | 'sent' | 'para' | 'semi';

interface ScoreCell { label: string; value: number; tone: 'amber' | 'emerald' }
interface ChipCell { ok: boolean; text: string }

interface PreviewData {
  urlHash: string;
  kicker: string;
  text: React.ReactNode;
  scores: ScoreCell[];
  chips: ChipCell[];
  practiceLabel: string;
  practice: string;
  audioCur: string;
  audioTotal: string;
  audioProgress: number;
}

const TABS: { k: QKey; label: string; sub: string }[] = [
  { k: 'word', label: '单词题',    sub: 'en.word.score' },
  { k: 'sent', label: '句子题',    sub: 'en.sent.score' },
  { k: 'para', label: '段落题',    sub: 'en.pred.score' },
  { k: 'semi', label: '半开放题',  sub: 'en.semi' },
];

const DATA: Record<QKey, PreviewData> = {
  word: {
    urlHash: 'word',
    kicker: 'Reference Word · 单词题',
    text: (
      <>
        <span className="bg-rose-500/15 text-rose-700 dark:text-rose-300 px-0.5 rounded border-b border-rose-500/40">unique</span>
        <span className="ml-2 font-mono text-xs text-muted-foreground">/juːˈniːk/</span>
      </>
    ),
    scores: [
      { label: '总分',    value: 82,  tone: 'amber'   },
      { label: '准确度',  value: 78,  tone: 'amber'   },
      { label: '音素',    value: 85,  tone: 'emerald' },
      { label: '完整度',  value: 100, tone: 'emerald' },
    ],
    chips: [
      { ok: false, text: '⚠ /juː/ 唇形偏扁' },
      { ok: false, text: '⚠ 第二音节重音弱' },
      { ok: true,  text: '✓ /niː/ 准确' },
      { ok: true,  text: '✓ 尾辅音 /k/ 清晰' },
    ],
    practiceLabel: 'LLM 生成 · 单词纠音',
    practice: '"跟读 3 遍：先把 /j/ 舌位抬起、再圆唇送气 /uː/ → YOU-niːk，重音落在第二音节..."',
    audioCur: '0:02',
    audioTotal: '0:03',
    audioProgress: 0.82,
  },
  sent: {
    urlHash: 'sentence',
    kicker: 'Reference Sentence · 句子题',
    text: (
      <>
        She sells <span className="bg-rose-500/15 text-rose-700 dark:text-rose-300 px-0.5 rounded border-b border-rose-500/40">seashells</span> by the <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 px-0.5 rounded border-b border-amber-500/40">seashore</span>.
      </>
    ),
    scores: [
      { label: '总分',    value: 74, tone: 'amber'   },
      { label: '准确度',  value: 70, tone: 'amber'   },
      { label: '流利度',  value: 80, tone: 'amber'   },
      { label: '语速',    value: 92, tone: 'emerald' },
    ],
    chips: [
      { ok: false, text: '⚠ /ʃ/ 发成了 /s/' },
      { ok: false, text: '⚠ seashore 词中停顿' },
      { ok: true,  text: '✓ 语速合宜' },
      { ok: true,  text: '✓ 尾音自然下落' },
    ],
    practiceLabel: 'LLM 生成 · 句子纠音',
    practice: '"练 /ʃ/：舌尖抬起不触齿 — SHE-sells SHE-shells by the SHE-shore，慢读 5 遍体会送气..."',
    audioCur: '0:04',
    audioTotal: '0:05',
    audioProgress: 0.65,
  },
  para: {
    urlHash: 'paragraph',
    kicker: 'Reference Text · 段落题',
    text: (
      <>
        The boy who had <span className="bg-rose-500/15 text-rose-700 dark:text-rose-300 px-0.5 rounded border-b border-rose-500/40">thought</span> about the <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 px-0.5 rounded border-b border-amber-500/40">unique</span> opportunity stood still, watching the sunset paint the sky in shades of gold.
      </>
    ),
    scores: [
      { label: '总分',    value: 78, tone: 'amber'   },
      { label: '准确度',  value: 72, tone: 'amber'   },
      { label: '流利度',  value: 85, tone: 'emerald' },
      { label: '完整度',  value: 96, tone: 'emerald' },
    ],
    chips: [
      { ok: false, text: '⚠ /θ/ 咬舌音缺失' },
      { ok: false, text: '⚠ unique 重音错位' },
      { ok: true,  text: '✓ 连读流畅' },
      { ok: true,  text: '✓ 语速合宜' },
    ],
    practiceLabel: 'LLM 生成 · 练习建议',
    practice: '"针对 /θ/ 咬舌音，试试绕口令：The thirty-three thieves thought they thrilled the throne throughout Thursday..."',
    audioCur: '0:08',
    audioTotal: '0:12',
    audioProgress: 0.7,
  },
  semi: {
    urlHash: 'semi-open',
    kicker: 'Prompt · 半开放题',
    text: (
      <>
        <span className="text-muted-foreground">&ldquo;Tell me about your favorite </span>
        <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 px-0.5 rounded">weekend activity</span>
        <span className="text-muted-foreground">&rdquo;</span>
      </>
    ),
    scores: [
      { label: '内容',    value: 68, tone: 'amber'   },
      { label: '词汇',    value: 72, tone: 'amber'   },
      { label: '语法',    value: 80, tone: 'emerald' },
      { label: '发音',    value: 76, tone: 'amber'   },
    ],
    chips: [
      { ok: false, text: '⚠ 语义展开不足（仅 1 句）' },
      { ok: false, text: '⚠ 连词重复使用 "and"' },
      { ok: true,  text: '✓ 时态一致' },
      { ok: true,  text: '✓ 发音整体清晰' },
    ],
    practiceLabel: 'LLM 生成 · 内容拓展',
    practice: '"试着扩展成 3 句：① 做什么 → ② 为什么喜欢 → ③ 举一个具体例子，连词可换成 because / so that / for example..."',
    audioCur: '0:14',
    audioTotal: '0:22',
    audioProgress: 0.64,
  },
};

export function DemoPreview() {
  const [active, setActive] = useState<QKey>('para');
  const data = DATA[active];

  const BAR_COUNT = 44;
  const playedUpTo = Math.floor(BAR_COUNT * data.audioProgress);

  return (
    <>
      {/* 主体 · 左叙事 / 右浏览器 Mock */}
      <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* ── 左：题型切换 + 亮点 + CTA ── */}
        <div className="lg:col-span-5 flex flex-col">
          {/* 4 题型 tab 按钮（真·可点击） */}
          <div className="mb-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Question Types · 点击切换预览</div>
            <div className="flex flex-wrap gap-2" role="tablist">
              {TABS.map((t) => {
                const isActive = active === t.k;
                return (
                  <button
                    key={t.k}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(t.k)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all cursor-pointer',
                      isActive
                        ? 'border-foreground bg-foreground text-background shadow-md'
                        : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                    )}
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="opacity-70 font-mono text-[10px]">{t.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 capability rows */}
          <div className="space-y-4 mb-7 flex-1">
            {[
              { icon: Mic,       title: '真实 API 响应',    desc: '每个字段都来自驰声生产接口，不是 mock 出来糊弄人的数据' },
              { icon: Sparkles,  title: 'LLM Prompt 可复制', desc: '附完整 System Prompt 与输出样本，复制即可用到你的应用里' },
              { icon: Zap,       title: '30 秒看完全流程',   desc: '点进去不用登录、不用连麦，立刻看到评测 → 诊断 → 练习闭环' },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg border border-border/60 bg-background flex items-center justify-center shrink-0">
                  <b.icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{b.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/demo?type=${active}`}
              className="group inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all gap-2 shadow-lg shadow-foreground/10 hover:-translate-y-0.5"
            >
              立即体验 Demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium rounded-full border border-border hover:bg-muted/50 transition-colors gap-2"
            >
              看看我们的三大价值 <ArrowRight className="h-3.5 w-3.5 rotate-90" />
            </a>
          </div>
        </div>

        {/* ── 右：浏览器 Mock · 按 active 动态切换 ── */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-border/60 bg-background shadow-xl shadow-black/5 overflow-hidden">
            {/* 浏览器顶栏 */}
            <div className="h-9 border-b border-border/60 bg-muted/40 flex items-center px-3 gap-2">
              <div className="flex gap-1.5 shrink-0">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-5 max-w-[260px] w-full rounded-full bg-background border border-border/60 px-3 flex items-center justify-center text-[10px] text-muted-foreground font-mono truncate">
                  speech-eval.site/demo · {data.urlHash}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </div>
            </div>

            {/* 内容（随 active 变） · 带淡入动画 */}
            <div key={active} className="p-5 space-y-4 animate-in fade-in-0 slide-in-from-right-2 duration-300">
              {/* 1. 参考文本 */}
              <div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-1.5">{data.kicker}</div>
                <div className="text-sm leading-relaxed">{data.text}</div>
              </div>

              {/* 2. 波形 + 播放条 */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-background"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <div className="flex-1 flex items-center gap-[2px] h-8">
                    {Array.from({ length: BAR_COUNT }).map((_, i) => {
                      const h = 18 + Math.abs(Math.sin(i / 2.3) * 50) + Math.abs(Math.cos(i / 3.7) * 25);
                      const played = i < playedUpTo;
                      return (
                        <div
                          key={i}
                          className={cn('flex-1 rounded-full transition-colors', played ? 'bg-foreground' : 'bg-foreground/20')}
                          style={{ height: `${Math.min(h, 100)}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono tabular-nums shrink-0">
                    {data.audioCur} / {data.audioTotal}
                  </div>
                </div>
              </div>

              {/* 3. 4 维得分卡 */}
              <div className="grid grid-cols-4 gap-2">
                {data.scores.map((s) => (
                  <div key={s.label} className="rounded-lg border border-border/40 bg-background p-2 text-center">
                    <div className={cn(
                      'text-lg font-bold tabular-nums',
                      s.tone === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    )}>
                      {s.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* 4. LLM 诊断 chips */}
              <div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">LLM 诊断 · 次生分析</div>
                <div className="flex flex-wrap gap-1.5">
                  {data.chips.map((c, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-xs border rounded px-2 py-0.5',
                        c.ok
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                      )}
                    >
                      {c.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. 练习建议 */}
              <div className="rounded-lg bg-foreground/[0.03] border border-dashed border-border/60 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-foreground" />
                  <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{data.practiceLabel}</span>
                </div>
                <div className="text-xs text-muted-foreground italic leading-relaxed">{data.practice}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部特性 strip */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm p-3">
          {[
            '无需注册 · 无需连麦',
            '4 种真实题型覆盖',
            'LLM Prompt 可复制',
            '30 秒看完全流程',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5">
              <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
