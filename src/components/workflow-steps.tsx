'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, FileText, MessageSquare, Brain, Waves, Sparkles, Plug, Code2, Rocket } from 'lucide-react';

type TabKey = 'dev' | 'user';

type Step = {
  num: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  role: { label: string; tone: string };
  panel: {
    filename: string;
    content: React.ReactNode;
  };
};

// ─── 开发场景：开发者"做一次"的事 ───
const DEV_STEPS: Step[] = [
  {
    num: '01',
    title: '填一次 MCP 配置',
    desc: '在你的 AI 后端（Dify / Coze / 自研框架）里，填入驰声 MCP 地址和 API Key。大模型启动时会自动发现这些工具。',
    icon: Settings,
    role: { label: '开发者', tone: 'text-sky-400' },
    panel: {
      filename: 'mcp.json',
      content: (
        <>
          <span className="text-zinc-500">{'// 3 行配置，一次填好，永久生效'}</span>{'\n'}
          {'{'}{'\n'}
          {'  '}<span className="text-emerald-400">&quot;mcpServers&quot;</span>: {'{'}{'\n'}
          {'    '}<span className="text-emerald-400">&quot;chivox_voice_eval&quot;</span>: {'{'}{'\n'}
          {'      '}<span className="text-emerald-400">&quot;type&quot;</span>:   <span className="text-amber-300">&quot;streamable-http&quot;</span>,{'\n'}
          {'      '}<span className="text-emerald-400">&quot;url&quot;</span>:    <span className="text-amber-300">&quot;https://speech-eval.site/mcp&quot;</span>,{'\n'}
          {'      '}<span className="text-emerald-400">&quot;apiKey&quot;</span>: <span className="text-amber-300">&quot;sk-••••••••&quot;</span>{'\n'}
          {'    '}{'}'}{'\n'}
          {'  '}{'}'}{'\n'}
          {'}'}
          {'\n\n'}
          <span className="text-zinc-500">{'// ✓ 16 个评测工具自动注册到 LLM'}</span>
        </>
      ),
    },
  },
  {
    num: '02',
    title: '写一段 System Prompt',
    desc: '告诉大模型这些工具什么时候用、返回的数据怎么解读、最后怎么跟用户说话。这是唯一需要"动脑"的地方。',
    icon: FileText,
    role: { label: '开发者', tone: 'text-sky-400' },
    panel: {
      filename: 'system-prompt.md',
      content: (
        <>
          <span className="text-zinc-500">{'// 指引大模型何时调用 + 怎样沟通'}</span>{'\n'}
          {'\n'}
          <span className="text-emerald-400">你是一位英语口语教练。</span>{'\n'}
          {'\n'}
          当用户上传录音时：{'\n'}
          {'  '}<span className="text-violet-400">1.</span> 调用 <span className="text-amber-300">chivox_voice_eval</span> 评分{'\n'}
          {'  '}<span className="text-violet-400">2.</span> 聚焦 <span className="text-rose-400">&lt; 70 分</span> 的音素家族{'\n'}
          {'  '}<span className="text-violet-400">3.</span> 给出 <span className="text-emerald-400">高情商</span> 的练习建议{'\n'}
          {'\n'}
          <span className="text-zinc-500">{'// 风格：鼓励为主、诊断准确、步步渐进'}</span>
        </>
      ),
    },
  },
  {
    num: '03',
    title: '部署 · 收工',
    desc: '保存配置、重启服务。Coze 用户点"测试"；代码框架开发者跑一次调试请求。从此不用再动。',
    icon: Rocket,
    role: { label: '开发者', tone: 'text-sky-400' },
    panel: {
      filename: 'terminal',
      content: (
        <>
          <span className="text-zinc-500">{'// 一次性验证：工具已就绪'}</span>{'\n'}
          {'\n'}
          <span className="text-emerald-400">$</span> dify restart{'\n'}
          <span className="text-zinc-400">[boot]</span> loading mcp servers...{'\n'}
          <span className="text-zinc-400">[mcp ]</span> <span className="text-emerald-400">✓</span> chivox_voice_eval connected{'\n'}
          <span className="text-zinc-400">[mcp ]</span> <span className="text-emerald-400">✓</span> discovered <span className="text-amber-300">16</span> tools{'\n'}
          <span className="text-zinc-400">[mcp ]</span>   · en_word_eval{'\n'}
          <span className="text-zinc-400">[mcp ]</span>   · en_sentence_eval{'\n'}
          <span className="text-zinc-400">[mcp ]</span>   · en_paragraph_eval{'\n'}
          <span className="text-zinc-400">[mcp ]</span>   · cn_aitalk_eval{'\n'}
          <span className="text-zinc-400">[mcp ]</span>   · ...and 12 more{'\n'}
          {'\n'}
          <span className="text-emerald-400">Ready.</span> 开发者部分到此结束。
        </>
      ),
    },
  },
];

// ─── 用户场景：每次用户使用时运行时发生的事 ───
const USER_STEPS: Step[] = [
  {
    num: '01',
    title: '用户发来一段录音',
    desc: '小程序用户朗读完一段自我介绍，发送音频 + 文字请求："帮我听听，发音哪里有问题？"',
    icon: MessageSquare,
    role: { label: '终端用户', tone: 'text-emerald-400' },
    panel: {
      filename: 'user-request.txt',
      content: (
        <>
          <span className="text-zinc-500">{'// 前端 → 大模型的完整上下文'}</span>{'\n'}
          {'\n'}
          <span className="text-violet-400">user</span>:{'\n'}
          {'  '}帮我听听这段自我介绍，{'\n'}
          {'  '}发音哪里有问题？{'\n'}
          {'\n'}
          <span className="text-emerald-400">audio</span>:{'\n'}
          {'  '}<span className="text-amber-300">https://cdn.app.com/u123/intro.mp3</span>{'\n'}
          <span className="text-emerald-400">refText</span>:{'\n'}
          {'  '}<span className="text-amber-300">&quot;Hello, my name is Lucy...&quot;</span>
        </>
      ),
    },
  },
  {
    num: '02',
    title: '大模型按 MCP 调用驰声',
    desc: '大模型意识到自己听不到音频，但它记得配置阶段注册的"语音评测"工具，自动按 MCP 协议发起调用。',
    icon: Plug,
    role: { label: '大模型 → MCP', tone: 'text-amber-300' },
    panel: {
      filename: 'mcp-tools-call.json',
      content: (
        <>
          <span className="text-zinc-500">{'// LLM 自动构造 — 开发者不写一行调用代码'}</span>{'\n'}
          {'{'}{'\n'}
          {'  '}<span className="text-emerald-400">&quot;jsonrpc&quot;</span>: <span className="text-amber-300">&quot;2.0&quot;</span>,{'\n'}
          {'  '}<span className="text-emerald-400">&quot;method&quot;</span>:  <span className="text-amber-300">&quot;tools/call&quot;</span>,{'\n'}
          {'  '}<span className="text-emerald-400">&quot;params&quot;</span>: {'{'}{'\n'}
          {'    '}<span className="text-emerald-400">&quot;name&quot;</span>: <span className="text-amber-300">&quot;en_sentence_eval&quot;</span>,{'\n'}
          {'    '}<span className="text-emerald-400">&quot;arguments&quot;</span>: {'{'}{'\n'}
          {'      '}<span className="text-emerald-400">&quot;audio_url&quot;</span>: <span className="text-amber-300">&quot;https://cdn.../intro.mp3&quot;</span>,{'\n'}
          {'      '}<span className="text-emerald-400">&quot;ref_text&quot;</span>:  <span className="text-amber-300">&quot;Hello, my name is Lucy...&quot;</span>{'\n'}
          {'    '}{'}'}{'\n'}
          {'  '}{'}'}{'\n'}
          {'}'}
          {'\n\n'}
          <span className="text-zinc-500">{'// ↑ 这一步就是 MCP 的全部魔法'}</span>
        </>
      ),
    },
  },
  {
    num: '03',
    title: '驰声考试级打分',
    desc: '驰声评测引擎对音频逐词、逐音素打分，以结构化 JSON 通过 MCP 原路返回给大模型。',
    icon: Waves,
    role: { label: '驰声服务', tone: 'text-rose-300' },
    panel: {
      filename: 'mcp-response.json',
      content: (
        <>
          <span className="text-zinc-500">{'// 驰声评测引擎 → 标准 MCP 响应'}</span>{'\n'}
          {'{'}{'\n'}
          {'  '}<span className="text-emerald-400">&quot;overall&quot;</span>: <span className="text-amber-300">85</span>,{'\n'}
          {'  '}<span className="text-emerald-400">&quot;pron&quot;</span>: {'{'}{'\n'}
          {'    '}<span className="text-emerald-400">&quot;accuracy&quot;</span>:  <span className="text-amber-300">82</span>,{'\n'}
          {'    '}<span className="text-emerald-400">&quot;integrity&quot;</span>: <span className="text-amber-300">95</span>,{'\n'}
          {'    '}<span className="text-emerald-400">&quot;fluency&quot;</span>:   <span className="text-amber-300">88</span>{'\n'}
          {'  '}{'}'},{'\n'}
          {'  '}<span className="text-emerald-400">&quot;details&quot;</span>: [{'\n'}
          {'    '}{'{'} <span className="text-emerald-400">&quot;char&quot;</span>: <span className="text-amber-300">&quot;think&quot;</span>, <span className="text-emerald-400">&quot;score&quot;</span>: <span className="text-amber-300">62</span>,{'\n'}
          {'      '}<span className="text-emerald-400">&quot;dp_type&quot;</span>: <span className="text-rose-400">&quot;mispron&quot;</span>,{'\n'}
          {'      '}<span className="text-emerald-400">&quot;phoneme&quot;</span>:  <span className="text-rose-400">&quot;/θ/&quot;</span> {'}'}{'\n'}
          {'  '}]{'\n'}
          {'}'}
        </>
      ),
    },
  },
  {
    num: '04',
    title: '大模型输出温柔反馈',
    desc: '大模型把冷冰冰的分数翻译成"老师式"的个性化反馈 + 针对性练习，直接展示给用户。',
    icon: Sparkles,
    role: { label: '大模型', tone: 'text-violet-400' },
    panel: {
      filename: 'user-feedback.md',
      content: (
        <>
          <span className="text-zinc-500">{'// LLM 输出 · 可直接渲染给用户'}</span>{'\n'}
          {'\n'}
          <span className="text-emerald-400">## 你的自我介绍很棒！</span>{'\n'}
          {'\n'}
          整体能拿到 <span className="text-amber-300">85 分</span> 哦 🎉{'\n'}
          流利度 <span className="text-amber-300">88</span>，完整度 <span className="text-amber-300">95</span>，都很到位。{'\n'}
          {'\n'}
          <span className="text-emerald-400">## 一个小细节可以优化</span>{'\n'}
          &ldquo;<span className="text-rose-400">think</span>&rdquo; 里的 <span className="text-amber-300">/θ/</span> 音，{'\n'}
          你发成了 /s/，试着把舌尖 <span className="text-emerald-400">轻轻抵在上齿</span>，{'\n'}
          气流从齿缝送出。我们一起练这几个词：{'\n'}
          {'   '}<span className="text-amber-300">think · three · thank · path</span>
        </>
      ),
    },
  },
];

export function WorkflowSteps() {
  const [tab, setTab] = useState<TabKey>('user');
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const steps = tab === 'dev' ? DEV_STEPS : USER_STEPS;

  const switchTo = (index: number) => {
    if (index === active) return;
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayed(index);
      setActive(index);
      setVisible(true);
    }, 200);
  };

  const switchTab = (next: TabKey) => {
    if (next === tab) return;
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTab(next);
      setActive(0);
      setDisplayed(0);
      setVisible(true);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const TAB_META: Record<TabKey, { label: string; hint: string }> = {
    dev: { label: '开发场景', hint: '一次性工作' },
    user: { label: '用户场景', hint: '每次使用发生' },
  };

  const currentStep = steps[displayed];

  return (
    <section
      id="workflow"
      data-fp-section
      className="min-h-screen flex flex-col justify-center py-14 md:py-20 border-t border-border/40 bg-muted/30"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10 items-start max-w-6xl mx-auto">
          {/* Left: header + tabs + steps */}
          <div className="lg:col-span-2">
            <span className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block">How it works</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">一段录音如何变成温柔反馈</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              以「AI 雅思口语陪练」为例。开发者<span className="text-foreground font-medium">只填一次地址</span>，用户<span className="text-foreground font-medium">每次说话都自动被打分 + 给反馈</span>。
            </p>

            {/* ── Tabs ── */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-background/60 border border-border/60 mb-4">
              {(['dev', 'user'] as TabKey[]).map((k) => {
                const isActive = tab === k;
                return (
                  <button
                    key={k}
                    onClick={() => switchTab(k)}
                    className={`relative flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                      isActive
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {k === 'dev' ? <Code2 className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
                    {TAB_META[k].label}
                    <span className={`text-[10px] font-normal ${isActive ? 'text-background/60' : 'text-muted-foreground/60'}`}>
                      · {TAB_META[k].hint}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Steps ── */}
            <div className="space-y-1.5">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = active === i;
                return (
                  <button
                    key={`${tab}-${i}`}
                    onMouseEnter={() => switchTo(i)}
                    onClick={() => switchTo(i)}
                    className={`w-full flex items-start gap-3 text-left rounded-lg px-3 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-background shadow-sm border border-border/60'
                        : 'hover:bg-background/60 border border-transparent'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">{step.num}</span>
                        <h4
                          className={`text-sm font-semibold transition-colors ${
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.title}
                        </h4>
                      </div>
                      <p
                        className={`text-xs leading-relaxed mt-1 transition-colors ${
                          isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* MCP 价值提示 */}
            <div className="mt-4 rounded-lg border border-border/60 bg-background/60 px-4 py-2.5">
              <div className="flex items-start gap-2">
                <Plug className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {tab === 'dev' ? (
                    <>
                      开发者只做左侧这点事，<span className="text-foreground">剩下的都是大模型和 MCP 自动完成</span>。
                    </>
                  ) : (
                    <>
                      用户场景第 <span className="text-foreground font-medium">②</span> 步就是 MCP 的核心魔法 —— <span className="text-foreground">大模型自动选择并调用工具</span>。
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right: dynamic code panel */}
          <div className="lg:col-span-3 rounded-lg border border-border/60 bg-zinc-950 text-zinc-100 overflow-hidden shadow-2xl shadow-black/10 lg:sticky lg:top-24">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className={`ml-3 text-xs text-zinc-500 font-mono transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                {currentStep.panel.filename}
              </span>
              <span
                className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 transition-opacity duration-200 ${currentStep.role.tone} ${
                  visible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {currentStep.role.label}
              </span>
            </div>
            <div className="p-5 min-h-[360px]">
              <pre
                className={`text-sm font-mono leading-relaxed whitespace-pre-wrap transition-all duration-200 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <code>{currentStep.panel.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
