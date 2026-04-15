'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Zap, BrainCircuit, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';

const icons = [Mic, Zap, BrainCircuit, GraduationCap];

export function WorkflowSteps() {
  const t = useTranslations('Value');
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

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

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const steps = [
    { num: '01', title: t('step1_title'), desc: t('step1_desc') },
    { num: '02', title: t('step2_title'), desc: t('step2_desc') },
    { num: '03', title: t('step3_title'), desc: t('step3_desc') },
    { num: '04', title: t('step4_title'), desc: t('step4_desc') },
  ];

  const panels = [
    // Step 1: 语音输入
    {
      filename: 'audio-input.ts',
      content: (
        <>
          <span className="text-zinc-500">{'// Record & send audio to MCP'}</span>{'\n'}
          <span className="text-violet-400">const</span> recorder = <span className="text-violet-400">new</span> <span className="text-amber-300">MediaRecorder</span>(stream);{'\n'}
          {'\n'}
          recorder.<span className="text-emerald-400">ondataavailable</span> = (e) ={'>'} {'{'}{'\n'}
          {'  '}<span className="text-violet-400">const</span> audioBlob = e.data;{'\n'}
          {'  '}mcpClient.<span className="text-emerald-400">send</span>({'{'}{'\n'}
          {'    '}tool: <span className="text-amber-300">"assess_speech"</span>,{'\n'}
          {'    '}params: {'{'}{'\n'}
          {'      '}audio: audioBlob,{'\n'}
          {'      '}refText: <span className="text-amber-300">"Hello world"</span>,{'\n'}
          {'      '}lang: <span className="text-amber-300">"en"</span>{'\n'}
          {'    '}{'}'}{'\n'}
          {'  '}{'}'});{'\n'}
          {'}'};
        </>
      ),
    },
    // Step 2: 多维评测
    {
      filename: 'assessment-output.json',
      content: (
        <>
          <span className="text-zinc-500">{'// MCP returns structured data'}</span>{'\n'}
          {'{'}{'\n'}
          {'  '}<span className="text-emerald-400">"overall"</span>: <span className="text-amber-300">72</span>,{'\n'}
          {'  '}<span className="text-emerald-400">"accuracy"</span>: <span className="text-amber-300">65</span>,{'\n'}
          {'  '}<span className="text-emerald-400">"fluency"</span>: <span className="text-amber-300">85</span>,{'\n'}
          {'  '}<span className="text-emerald-400">"speed"</span>: <span className="text-amber-300">130</span>,{'\n'}
          {'  '}<span className="text-emerald-400">"weak_phonemes"</span>: [<span className="text-amber-300">"θ"</span>, <span className="text-amber-300">"r"</span>],{'\n'}
          {'  '}<span className="text-emerald-400">"stress_issues"</span>: [<span className="text-amber-300">"record"</span>],{'\n'}
          {'  '}<span className="text-emerald-400">"pause_count"</span>: <span className="text-amber-300">3</span>,{'\n'}
          {'  '}<span className="text-emerald-400">"linking_score"</span>: <span className="text-amber-300">78</span>{'\n'}
          {'}'}
        </>
      ),
    },
    // Step 3: LLM 分析
    {
      filename: 'llm-prompt.ts',
      content: (
        <>
          <span className="text-zinc-500">{'// Feed MCP data to LLM'}</span>{'\n'}
          <span className="text-violet-400">const</span> response = <span className="text-violet-400">await</span> llm.<span className="text-emerald-400">chat</span>({'{'}{'\n'}
          {'  '}model: <span className="text-amber-300">"gpt-4"</span>,{'\n'}
          {'  '}messages: [{'\n'}
          {'    '}{'{'}{'\n'}
          {'      '}role: <span className="text-amber-300">"system"</span>,{'\n'}
          {'      '}content: <span className="text-amber-300">`You are an English tutor.</span>{'\n'}
          <span className="text-amber-300">{'        '}Analyze the speech data and</span>{'\n'}
          <span className="text-amber-300">{'        '}give corrective feedback.`</span>{'\n'}
          {'    '}{'}'},{'\n'}
          {'    '}{'{'} role: <span className="text-amber-300">"user"</span>, content: mcpData {'}'}{'\n'}
          {'  '}]{'\n'}
          {'}'});
        </>
      ),
    },
    // Step 4: 教学闭环
    {
      filename: 'teaching-output.md',
      content: (
        <>
          <span className="text-zinc-500">{'// LLM generates personalized feedback'}</span>{'\n'}
          {'\n'}
          <span className="text-emerald-400">## Diagnosis</span>{'\n'}
          Fluency: <span className="text-amber-300">Excellent (85/100)</span>{'\n'}
          Accuracy: <span className="text-rose-400">Needs work (65/100)</span>{'\n'}
          {'\n'}
          <span className="text-emerald-400">## Weak Points</span>{'\n'}
          - /θ/ → often replaced with /s/{'\n'}
          - /r/ → tongue position too far back{'\n'}
          {'\n'}
          <span className="text-emerald-400">## Practice</span>{'\n'}
          <span className="text-amber-300">"Thirty-three thieves thought</span>{'\n'}
          <span className="text-amber-300">{'  '}they thrilled the throne."</span>
        </>
      ),
    },
  ];

  return (
    <section id="workflow" className="py-20 md:py-28 border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: steps */}
          <div>
            <span className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block">{t('label')}</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t('step_section_title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-10">{t('step_section_desc')}</p>
            <div className="space-y-1">
              {steps.map((step, i) => {
                const Icon = icons[i];
                const isActive = active === i;
                return (
                  <button
                    key={i}
                    onMouseEnter={() => switchTo(i)}
                    onClick={() => switchTo(i)}
                    className={`w-full flex items-start gap-4 text-left rounded-lg px-4 py-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-background shadow-sm border border-border/60'
                        : 'hover:bg-background/60 border border-transparent'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{step.num}</span>
                        <h4 className={`text-sm font-semibold transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</h4>
                      </div>
                      <p className={`text-xs leading-relaxed mt-0.5 transition-colors ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>{step.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: dynamic code panel */}
          <div className="rounded-lg border border-border/60 bg-zinc-950 text-zinc-100 overflow-hidden shadow-2xl shadow-black/10 lg:sticky lg:top-24">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className={`ml-3 text-xs text-zinc-500 font-mono transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>{panels[displayed].filename}</span>
            </div>
            <div className="p-5 min-h-[320px]">
              <pre className={`text-sm font-mono leading-relaxed whitespace-pre-wrap transition-all duration-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <code>{panels[displayed].content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
