'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen, Code2, Zap, FileText, Copy, Check, Terminal, Globe, Mic, MessageSquare, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-200"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ filename, lang, children }: { filename?: string; lang?: string; children: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-zinc-950 text-zinc-100 overflow-hidden my-4 relative">
      {filename && (
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] text-xs text-zinc-500 font-mono">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2">{filename}</span>
          {lang && <span className="ml-auto text-zinc-600">{lang}</span>}
        </div>
      )}
      <CopyButton text={children.trim()} />
      <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto"><code>{children.trim()}</code></pre>
    </div>
  );
}

function DocSection({ id, icon: Icon, title, children }: { id: string; icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/40">
        <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-foreground/90 space-y-6">
        {children}
      </div>
    </section>
  );
}

function SubDoc({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 mb-10">
      <h3 className="text-base font-semibold mb-3">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; desc: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border/40 bg-muted/30">
          <th className="text-left py-2 px-3 font-medium">参数</th>
          <th className="text-left py-2 px-3 font-medium">类型</th>
          <th className="text-left py-2 px-3 font-medium">必填</th>
          <th className="text-left py-2 px-3 font-medium">说明</th>
        </tr></thead>
        <tbody className="divide-y divide-border/30">
          {params.map(p => (
            <tr key={p.name}>
              <td className="py-2 px-3 font-mono text-xs">{p.name}</td>
              <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{p.type}</td>
              <td className="py-2 px-3">{p.required ? <span className="text-emerald-600">✓</span> : <span className="text-muted-foreground">—</span>}</td>
              <td className="py-2 px-3 text-muted-foreground">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200',
    warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200',
    tip: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200',
  };
  const icons = { info: Globe, warning: AlertTriangle, tip: Lightbulb };
  const Ic = icons[type];
  return (
    <div className={`flex gap-3 rounded-lg border p-4 text-sm ${styles[type]}`}>
      <Ic className="h-4 w-4 mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

const NAV = [
  { id: 'quick-start', icon: Zap, label: '快速开始', children: [
    { id: 'overview', label: '概述' },
    { id: 'mcp-config', label: 'MCP 配置' },
    { id: 'upload-audio', label: '上传音频' },
    { id: 'first-eval', label: '第一次评测' },
  ]},
  { id: 'api-reference', icon: BookOpen, label: 'API 参考', children: [
    { id: 'audio-upload-api', label: '音频上传 API' },
    { id: 'eval-tools', label: '评测工具总览' },
    { id: 'tool-english-word', label: 'evaluate_english_word' },
    { id: 'tool-english-sentence', label: 'evaluate_english_sentence' },
    { id: 'tool-english-paragraph', label: 'evaluate_english_paragraph' },
    { id: 'tool-english-word-pron', label: 'evaluate_english_word_pron' },
    { id: 'tool-english-sentence-pron', label: 'evaluate_english_sentence_pron' },
    { id: 'tool-english-phonics', label: 'evaluate_english_phonics' },
    { id: 'tool-chinese', label: 'evaluate_chinese' },
    { id: 'result-fields', label: '评测结果字段' },
    { id: 'error-codes', label: '错误码' },
  ]},
  { id: 'integration', icon: Code2, label: '集成指南', children: [
    { id: 'config-cursor', label: 'Cursor 配置' },
    { id: 'config-claude', label: 'Claude Desktop 配置' },
    { id: 'config-other', label: '豆包 / 钉钉 / 其他' },
    { id: 'code-python', label: 'Python 示例' },
    { id: 'code-javascript', label: 'JavaScript 示例' },
  ]},
  { id: 'best-practices', icon: FileText, label: '最佳实践', children: [
    { id: 'prompt-templates', label: 'Prompt 模板' },
    { id: 'error-handling', label: '错误处理' },
    { id: 'performance', label: '性能优化' },
  ]},
];

export default function DocsPage() {
  const [, setActiveSection] = useState('quick-start');

  return (
    <main className="flex-1">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">开发者文档</h1>
        <p className="text-muted-foreground mb-10">驰声语音评测 MCP · v2.3.0</p>

        <div className="flex gap-10">
          {/* Sidebar */}
          <nav className="hidden lg:block w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
            {NAV.map(group => (
              <div key={group.id} className="mb-5">
                <a
                  href={`#${group.id}`}
                  onClick={() => setActiveSection(group.id)}
                  className="flex items-center gap-2 text-sm font-semibold mb-1.5 hover:text-foreground transition-colors"
                >
                  <group.icon className="h-4 w-4 text-muted-foreground" />
                  {group.label}
                </a>
                <ul className="ml-6 space-y-1 border-l border-border/40 pl-3">
                  {group.children.map(child => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors block py-0.5 truncate"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-3xl">

            {/* ══════ 快速开始 ══════ */}
            <DocSection id="quick-start" icon={Zap} title="快速开始">

              <SubDoc id="overview" title="概述">
                <p><strong>chivox-speech-eval</strong> 是一个基于 MCP（Model Context Protocol）的语音评测服务器，为 AI 助手提供驰声中英文语音评测能力。</p>
                <p>MCP 是 AI 助手与外部工具/服务通信的标准化协议。通过 MCP，AI 可以直接调用专业工具，无需用户手动复制粘贴数据。</p>
                <Callout type="info">当前版本 v2.3.0，服务端点：<code className="bg-black/5 px-1 rounded text-xs font-mono">https://speech-eval.site</code></Callout>
                <p><strong>工作流程：</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>用户上传音频 → <code className="bg-muted px-1 rounded text-xs font-mono">POST /upload</code> → 获得 audioId</li>
                  <li>AI 调用评测 → <code className="bg-muted px-1 rounded text-xs font-mono">evaluate_xxx(audioId, text)</code> → 获得评测结果</li>
                  <li>音频自动删除（评测完成或 5 分钟后过期）</li>
                </ol>
              </SubDoc>

              <SubDoc id="mcp-config" title="MCP 配置">
                <p>在你的 AI 客户端中添加以下 MCP 服务器配置：</p>
                <CodeBlock filename="MCP 配置" lang="json">{`{
  "name": "chivox-speech-eval",
  "type": "streamable-http",
  "url": "https://speech-eval.site/mcp"
}`}</CodeBlock>
                <Callout type="tip">所有支持 MCP 的客户端（Cursor、Claude Desktop、豆包、钉钉等）均使用以上配置，仅 UI 入口不同。详见下方集成指南。</Callout>
              </SubDoc>

              <SubDoc id="upload-audio" title="上传音频">
                <p>评测前需先上传音频文件，获取 <code className="bg-muted px-1 rounded text-xs font-mono">audioId</code>。</p>
                <CodeBlock filename="Terminal" lang="bash">{`curl -X POST https://speech-eval.site/upload \\
  -H "Content-Type: audio/mp3" \\
  --data-binary @audio.mp3`}</CodeBlock>
                <p>返回示例：</p>
                <CodeBlock filename="response.json" lang="json">{`{
  "audioId": "audio_1234567890_abc123",
  "size": 38528,
  "compressed": false,
  "expiresIn": "5 分钟"
}`}</CodeBlock>
                <Callout type="warning">音频上传后 <strong>5 分钟内</strong>有效，评测完成后会自动删除。请在上传后尽快进行评测。</Callout>
                <p><strong>支持的音频格式：</strong>mp3, wav, ogg, m4a, aac, pcm</p>
                <p><strong>限制：</strong>单文件最大 50MB，大于 500KB 的文件自动压缩为 16kHz / 单声道 / 32kbps。</p>
              </SubDoc>

              <SubDoc id="first-eval" title="第一次评测">
                <p>上传音频获得 <code className="bg-muted px-1 rounded text-xs font-mono">audioId</code> 后，告诉 AI 你要评测的内容，AI 会自动调用相应工具。</p>
                <div className="rounded-lg border border-border/60 p-4 bg-muted/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">你</div>
                    <p className="text-sm">请帮我评测这个音频的英文句子发音，参考文本是 &quot;The quick brown fox jumps over the lazy dog.&quot;</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-xs font-bold shrink-0">AI</div>
                    <div className="text-sm space-y-1">
                      <p>正在调用 <code className="bg-muted px-1 rounded text-xs font-mono">evaluate_english_sentence</code> ...</p>
                      <p>评测完成！总分 <strong>82</strong>，准确度 <strong>78</strong>，流利度 <strong>85</strong>。</p>
                    </div>
                  </div>
                </div>
              </SubDoc>
            </DocSection>

            {/* ══════ API 参考 ══════ */}
            <DocSection id="api-reference" icon={BookOpen} title="API 参考">

              <SubDoc id="audio-upload-api" title="音频上传 API">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">POST</span>
                  <code className="text-sm font-mono">https://speech-eval.site/upload</code>
                </div>
                <ParamTable params={[
                  { name: 'Content-Type', type: 'header', required: true, desc: '音频 MIME 类型，如 audio/mp3, audio/wav' },
                  { name: 'Body', type: 'binary', required: true, desc: '音频文件二进制数据' },
                ]} />
                <p className="mt-3"><strong>响应字段：</strong></p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频唯一标识，后续评测时使用' },
                  { name: 'size', type: 'number', required: true, desc: '文件大小（字节）' },
                  { name: 'compressed', type: 'boolean', required: true, desc: '是否经过自动压缩' },
                  { name: 'expiresIn', type: 'string', required: true, desc: '过期时间描述' },
                ]} />
              </SubDoc>

              <SubDoc id="eval-tools" title="评测工具总览">
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">工具名</th>
                      <th className="text-left py-2 px-3 font-medium">功能</th>
                      <th className="text-left py-2 px-3 font-medium">题型 ID</th>
                      <th className="text-left py-2 px-3 font-medium">最大时长</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['evaluate_english_word','英文单词评测','en.word.score','< 20秒'],
                        ['evaluate_english_sentence','英文句子评测','en.sent.score','≤ 40秒'],
                        ['evaluate_english_paragraph','英文段落评测','en.pred.score','≤ 300秒'],
                        ['evaluate_english_word_pron','英文单词纠音','en.word.pron','< 20秒'],
                        ['evaluate_english_sentence_pron','英文句子纠音','en.sent.pron','≤ 40秒'],
                        ['evaluate_english_phonics','自然拼读评测','en.nsp.score','< 20秒'],
                        ['evaluate_chinese','中文评测','cn.word/sent.score','< 60秒'],
                      ].map(([tool,fn,id,dur]) => (
                        <tr key={tool}>
                          <td className="py-2 px-3 font-mono text-xs"><a href={`#tool-${tool.replace('evaluate_','').replace(/_/g,'-')}`} className="text-blue-600 hover:underline">{tool}</a></td>
                          <td className="py-2 px-3">{fn}</td>
                          <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{id}</td>
                          <td className="py-2 px-3">{dur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubDoc>

              {/* 每个评测工具 */}
              <SubDoc id="tool-english-word" title="evaluate_english_word">
                <p>评测英文单词的发音质量。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID（从上传获得）' },
                  { name: 'word', type: 'string', required: true, desc: '要评测的单词' },
                  { name: 'accent', type: 'string', required: false, desc: '口音：british / american（默认）' },
                ]} />
                <p><strong>示例对话：</strong></p>
                <CodeBlock filename="AI 调用">{`evaluate_english_word(
  audioId = "audio_xxx",
  word = "magnificent",
  accent = "american"
)`}</CodeBlock>
              </SubDoc>

              <SubDoc id="tool-english-sentence" title="evaluate_english_sentence">
                <p>评测英文句子的发音质量，包括流利度、准确度等。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID' },
                  { name: 'sentence', type: 'string', required: true, desc: '要评测的句子' },
                  { name: 'accent', type: 'string', required: false, desc: '口音：british / american' },
                ]} />
                <CodeBlock filename="AI 调用">{`evaluate_english_sentence(
  audioId = "audio_xxx",
  sentence = "The quick brown fox jumps over the lazy dog."
)`}</CodeBlock>
              </SubDoc>

              <SubDoc id="tool-english-paragraph" title="evaluate_english_paragraph">
                <p>评测英文段落的整体发音质量。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID' },
                  { name: 'paragraph', type: 'string', required: true, desc: '要评测的段落' },
                  { name: 'accent', type: 'string', required: false, desc: '口音：british / american' },
                ]} />
              </SubDoc>

              <SubDoc id="tool-english-word-pron" title="evaluate_english_word_pron">
                <p>英文单词纠音，可检测多读、漏读、错读。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID' },
                  { name: 'word', type: 'string', required: true, desc: '要评测的单词' },
                  { name: 'accent', type: 'string', required: false, desc: '口音' },
                ]} />
                <Callout type="tip">纠音工具会返回详细的音素级错误信息，包括多读（insertion）、漏读（deletion）、错读（substitution）的具体位置。</Callout>
              </SubDoc>

              <SubDoc id="tool-english-sentence-pron" title="evaluate_english_sentence_pron">
                <p>英文句子纠音，检测句子中每个单词的发音问题。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID' },
                  { name: 'sentence', type: 'string', required: true, desc: '要评测的句子' },
                  { name: 'accent', type: 'string', required: false, desc: '口音' },
                ]} />
              </SubDoc>

              <SubDoc id="tool-english-phonics" title="evaluate_english_phonics">
                <p>自然拼读评测，适用于拼读规则练习场景。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID' },
                  { name: 'word', type: 'string', required: true, desc: '要拼读的内容' },
                ]} />
              </SubDoc>

              <SubDoc id="tool-chinese" title="evaluate_chinese">
                <p>评测中文发音，自动识别词语/句子模式。</p>
                <ParamTable params={[
                  { name: 'audioId', type: 'string', required: true, desc: '音频 ID' },
                  { name: 'text', type: 'string', required: true, desc: '要评测的中文内容' },
                ]} />
                <Callout type="info">自动识别模式：≤ 10 个字符使用词语模式，{'>'}10 个字符使用句子模式。</Callout>
                <CodeBlock filename="AI 调用">{`evaluate_chinese(
  audioId = "audio_xxx",
  text = "你好，世界"
)`}</CodeBlock>
              </SubDoc>

              <SubDoc id="result-fields" title="评测结果字段">
                <p>所有评测工具返回统一的结果结构：</p>
                <CodeBlock filename="result.json" lang="json">{`{
  "overall": 85,
  "accuracy": 82,
  "pron": 88,
  "fluency": {
    "overall": 78,
    "speed": 65,
    "pause": 2
  },
  "details": [
    { "char": "hello", "score": 85 },
    { "char": "world", "score": 82 }
  ]
}`}</CodeBlock>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">字段</th>
                      <th className="text-left py-2 px-3 font-medium">范围</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['overall','0-100','总分，综合语音质量评分'],
                        ['accuracy','0-100','准确度，音素级别的发音准确率'],
                        ['pron','0-100','发音分，整体发音质量'],
                        ['fluency.overall','0-100','流利度，语流的自然度与平滑度'],
                        ['fluency.speed','0-100','语速，每分钟词/音节计量'],
                        ['fluency.pause','number','停顿次数，不自然停顿检测'],
                        ['details','array','逐词/逐字评分详情'],
                      ].map(([field,range,desc])=>(
                        <tr key={field}>
                          <td className="py-2 px-3 font-mono text-xs">{field}</td>
                          <td className="py-2 px-3 text-muted-foreground">{range}</td>
                          <td className="py-2 px-3">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubDoc>

              <SubDoc id="error-codes" title="错误码">
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">场景</th>
                      <th className="text-left py-2 px-3 font-medium">原因</th>
                      <th className="text-left py-2 px-3 font-medium">解决方式</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['音频 ID 无效或已过期','音频上传后 5 分钟内有效，评测完成后自动删除','重新上传音频'],
                        ['服务器繁忙，排队已满','当前请求过多','稍后重试'],
                        ['存储空间已满','服务器临时音频存储已满','稍后重试，系统会自动清理'],
                        ['音频格式不支持','上传了不支持的文件类型','使用 mp3/wav/ogg/m4a/aac/pcm'],
                        ['音频时长超限','音频时长超过该题型最大限制','裁剪音频后重试'],
                      ].map(([scene,reason,fix])=>(
                        <tr key={scene}>
                          <td className="py-2 px-3 font-medium">{scene}</td>
                          <td className="py-2 px-3 text-muted-foreground">{reason}</td>
                          <td className="py-2 px-3">{fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubDoc>
            </DocSection>

            {/* ══════ 集成指南 ══════ */}
            <DocSection id="integration" icon={Code2} title="集成指南">

              <SubDoc id="config-cursor" title="Cursor 配置">
                <ol className="list-decimal list-inside space-y-2 ml-1">
                  <li>打开 Cursor 设置（<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Cmd + ,</kbd>）</li>
                  <li>左侧选择 <strong>MCP</strong>（或搜索 &quot;MCP&quot;）</li>
                  <li>点击 <strong>Add new MCP server</strong></li>
                  <li>填写配置：</li>
                </ol>
                <CodeBlock filename="Cursor MCP 配置" lang="json">{`{
  "name": "chivox-speech-eval",
  "type": "streamable-http",
  "url": "https://speech-eval.site/mcp"
}`}</CodeBlock>
                <ol className="list-decimal list-inside space-y-1 ml-1" start={5}>
                  <li>点击 <strong>Save</strong> 保存</li>
                  <li>在对话中输入「帮我评测这段英文发音」即可触发</li>
                </ol>
              </SubDoc>

              <SubDoc id="config-claude" title="Claude Desktop 配置">
                <p>编辑配置文件：</p>
                <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                  <li>macOS：<code className="bg-muted px-1 rounded text-xs font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
                  <li>Windows：<code className="bg-muted px-1 rounded text-xs font-mono">%APPDATA%\Claude\claude_desktop_config.json</code></li>
                </ul>
                <CodeBlock filename="claude_desktop_config.json" lang="json">{`{
  "mcpServers": {
    "chivox-speech-eval": {
      "type": "streamable-http",
      "url": "https://speech-eval.site/mcp"
    }
  }
}`}</CodeBlock>
              </SubDoc>

              <SubDoc id="config-other" title="豆包 / 钉钉 / 其他">
                <p>参照各自的 MCP 配置界面，添加以下配置：</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">配置项</th>
                      <th className="text-left py-2 px-3 font-medium">值</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">类型</td><td className="py-2 px-3 font-mono text-xs">streamable-http</td></tr>
                      <tr><td className="py-2 px-3 font-medium">URL</td><td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td></tr>
                    </tbody>
                  </table>
                </div>
                <Callout type="info">现已支持 HTTPS，可安全用于各类 AI 平台。</Callout>
              </SubDoc>

              <SubDoc id="code-python" title="Python 示例">
                <p>使用 Python requests 库上传音频并获取 audioId：</p>
                <CodeBlock filename="upload.py" lang="python">{`import requests

with open('audio.mp3', 'rb') as f:
    r = requests.post(
        'https://speech-eval.site/upload',
        data=f,
        headers={'Content-Type': 'audio/mp3'}
    )

result = r.json()
print(f"audioId: {result['audioId']}")
print(f"size: {result['size']} bytes")
print(f"expires: {result['expiresIn']}")`}</CodeBlock>
              </SubDoc>

              <SubDoc id="code-javascript" title="JavaScript 示例">
                <p>使用 Node.js 上传音频：</p>
                <CodeBlock filename="upload.js" lang="javascript">{`const fs = require('fs');
const https = require('https');

const audioData = fs.readFileSync('audio.mp3');

const req = https.request({
  hostname: 'speech-eval.site',
  port: 443,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'audio/mp3',
    'Content-Length': audioData.length
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log('audioId:', result.audioId);
  });
});

req.write(audioData);
req.end();`}</CodeBlock>
              </SubDoc>
            </DocSection>

            {/* ══════ 最佳实践 ══════ */}
            <DocSection id="best-practices" icon={FileText} title="最佳实践">

              <SubDoc id="prompt-templates" title="Prompt 模板">
                <p>以下是推荐的 Prompt 模板，帮助你引导 LLM 对评测结果进行深度分析：</p>

                <div className="space-y-4 mt-4">
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> 模板 1：发音诊断</p>
                    <CodeBlock filename="prompt-diagnosis.txt">{`你是一位专业的英语口语教练。请根据以下 MCP 评测结果分析学生的发音表现：

评测结果：{evaluation_result}

请按以下格式输出：
1. 总体评价（一句话）
2. 优势项（准确度/流利度等 >80 分的指标）
3. 弱项分析（<70 分的指标，定位到具体音素）
4. 针对性练习建议（2-3 条具体可操作的建议）`}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Mic className="h-4 w-4" /> 模板 2：练习生成</p>
                    <CodeBlock filename="prompt-practice.txt">{`根据以下弱项列表，为学生生成针对性的口语练习材料：

弱项：{weak_points}

请生成：
1. 3 个绕口令（专门针对弱项音素）
2. 5 个包含目标音素的常用短句（标注重音和连读）
3. 1 段跟读练习段落（50-80 词，高频使用目标音素）`}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> 模板 3：学习报告</p>
                    <CodeBlock filename="prompt-report.txt">{`你是一位数据分析师，请根据学生近 7 天的评测历史生成学习报告：

评测历史：{history}

报告要求：
1. 整体趋势（进步/持平/退步）
2. 各维度变化（准确度、流利度、语速）
3. 本周最大进步项
4. 下周重点练习建议
5. 鼓励性总结（保持学习动力）`}</CodeBlock>
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="error-handling" title="错误处理">
                <p>推荐的错误处理策略：</p>
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>音频过期：</strong>评测前检查 audioId 是否仍有效。如果返回「已过期」，提示用户重新上传。建议在上传后 3 分钟内完成评测。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>服务繁忙：</strong>遇到排队满时，使用指数退避策略重试（1s → 2s → 4s），最多 3 次。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>音频质量差：</strong>建议在上传前在客户端进行基本的音频质量检查（静音检测、时长检测），减少无效调用。</span>
                  </li>
                </ul>
              </SubDoc>

              <SubDoc id="performance" title="性能优化">
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>音频压缩：</strong>上传前在客户端将音频转为 16kHz 单声道 mp3 格式，可减少 60-80% 的上传体积和评测延迟。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>避免重复评测：</strong>对相同音频 + 参考文本的组合做客户端缓存，避免重复调用消耗配额。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>选择合适的工具：</strong>单词评测比句子评测快 3-5 倍。如果只需要单词级别的分数，不要用句子评测工具。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>批量场景：</strong>如果需要同时评测多段音频（如班级考试），建议使用批量评测接口（即将上线），避免并发限制。</span>
                  </li>
                </ul>
              </SubDoc>
            </DocSection>

            {/* ══════ 服务信息 ══════ */}
            <DocSection id="service-info" icon={Terminal} title="服务信息">
              <SubDoc id="endpoints" title="服务端点">
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">端点</th>
                      <th className="text-left py-2 px-3 font-medium">方法</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-mono text-xs">/upload</td><td className="py-2 px-3">POST</td><td className="py-2 px-3">音频文件上传</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">/mcp</td><td className="py-2 px-3">POST</td><td className="py-2 px-3">MCP JSON-RPC 接口</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">/health</td><td className="py-2 px-3">GET</td><td className="py-2 px-3">健康检查</td></tr>
                    </tbody>
                  </table>
                </div>
              </SubDoc>
              <SubDoc id="limits" title="服务限制">
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">配置项</th>
                      <th className="text-left py-2 px-3 font-medium">默认值</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['存储限制','500MB','最大音频存储空间'],
                        ['最大排队','10','等待处理的请求数'],
                        ['最大并发','3','同时处理的评测数'],
                        ['音频有效期','5 分钟','上传后未评测自动过期'],
                        ['文件大小限制','50MB','单个音频文件最大'],
                      ].map(([k,v,d])=>(
                        <tr key={k}><td className="py-2 px-3 font-medium">{k}</td><td className="py-2 px-3 font-mono text-xs">{v}</td><td className="py-2 px-3 text-muted-foreground">{d}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubDoc>
              <SubDoc id="changelog" title="更新日志">
                <div className="space-y-3">
                  {[
                    { ver: 'v2.3.0', date: '2026-03-25', desc: '支持 HTTPS，域名 speech-eval.site' },
                    { ver: 'v2.2.0', date: '2026-03-24', desc: '添加 MCP 配置指南（Cursor / Claude Desktop）' },
                    { ver: 'v2.1.0', date: '2026-03-24', desc: '简化上传流程，统一使用 HTTP API' },
                    { ver: 'v2.0.0', date: '2026-03-24', desc: '初始版本，支持多种评测类型' },
                  ].map(l => (
                    <div key={l.ver} className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold bg-muted px-2 py-0.5 rounded shrink-0">{l.ver}</span>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{l.date}</span>
                      <span className="text-sm">{l.desc}</span>
                    </div>
                  ))}
                </div>
              </SubDoc>
            </DocSection>

          </div>
        </div>
      </div>
    </main>
  );
}
