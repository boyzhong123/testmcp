'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen, Code2, Zap, FileText, Copy, Check, Terminal, Globe, Mic, MessageSquare, BarChart3, AlertTriangle, Lightbulb, Radio, FolderOpen, Settings } from 'lucide-react';

/* ─── Reusable Components ─── */

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
      <div className="text-sm leading-relaxed text-foreground/90 space-y-6">{children}</div>
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
              <td className="py-2 px-3">{p.required ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-muted-foreground">—</span>}</td>
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

function FlowStep({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{title}</div>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

function ToolTable({ tools }: { tools: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border/40 bg-muted/30">
          <th className="text-left py-2 px-3 font-medium">工具名</th>
          <th className="text-left py-2 px-3 font-medium">功能</th>
          <th className="text-left py-2 px-3 font-medium">典型场景</th>
        </tr></thead>
        <tbody className="divide-y divide-border/30">
          {tools.map(([name, desc, scene]) => (
            <tr key={name}>
              <td className="py-2 px-3 font-mono text-xs">{name}</td>
              <td className="py-2 px-3">{desc}</td>
              <td className="py-2 px-3 text-muted-foreground">{scene}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Navigation Structure ─── */

const NAV = [
  { id: 'quick-start', icon: Zap, label: '快速开始', children: [
    { id: 'overview', label: '概述' },
    { id: 'requirements', label: '系统要求' },
    { id: 'install', label: '安装方式' },
    { id: 'env-vars', label: '环境变量' },
  ]},
  { id: 'config', icon: Settings, label: '接入配置', children: [
    { id: 'config-cursor', label: 'Cursor' },
    { id: 'config-claude-desktop', label: 'Claude Desktop' },
    { id: 'config-claude-code', label: 'Claude Code' },
    { id: 'config-coze', label: '扣子（Coze）' },
    { id: 'config-coze-workflow', label: 'Coze 工作流接入' },
    { id: 'config-other', label: '豆包 / 钉钉 / 其他' },
  ]},
  { id: 'eval-modes', icon: Radio, label: '评测模式', children: [
    { id: 'stream-eval', label: '实时录音评测' },
    { id: 'stream-flow', label: '流式评测流程' },
    { id: 'file-eval', label: '音频文件评测' },
  ]},
  { id: 'api-reference', icon: BookOpen, label: 'API 参考', children: [
    { id: 'tools-en', label: '英文评测工具' },
    { id: 'tools-cn', label: '中文评测工具' },
    { id: 'result-fields', label: '评测结果字段' },
    { id: 'error-codes', label: '错误码' },
  ]},
  { id: 'architecture', icon: Terminal, label: '架构说明', children: [
    { id: 'arch-diagram', label: '架构图' },
    { id: 'transport', label: '传输协议' },
  ]},
  { id: 'integration', icon: Code2, label: '示例代码', children: [
    { id: 'code-python', label: 'Python' },
    { id: 'code-javascript', label: 'JavaScript' },
  ]},
  { id: 'best-practices', icon: FileText, label: '最佳实践', children: [
    { id: 'prompt-templates', label: 'Prompt 模板' },
    { id: 'error-handling', label: '错误处理' },
    { id: 'performance', label: '性能优化' },
  ]},
  { id: 'service-info', icon: Globe, label: '服务信息', children: [
    { id: 'endpoints', label: '服务端点' },
    { id: 'limits', label: '服务限制' },
    { id: 'changelog', label: '更新日志' },
  ]},
];

/* ─── Page ─── */

export default function DocsPage() {
  const [, setActiveSection] = useState('quick-start');

  return (
    <main className="flex-1">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">开发者文档</h1>
        <p className="text-muted-foreground mb-10">驰声语音评测 MCP · chivox-local-mcp</p>

        <div className="flex gap-10">
          {/* Sidebar */}
          <nav className="hidden lg:block w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
            {NAV.map(group => (
              <div key={group.id} className="mb-5">
                <a href={`#${group.id}`} onClick={() => setActiveSection(group.id)} className="flex items-center gap-2 text-sm font-semibold mb-1.5 hover:text-foreground transition-colors">
                  <group.icon className="h-4 w-4 text-muted-foreground" />
                  {group.label}
                </a>
                <ul className="ml-6 space-y-1 border-l border-border/40 pl-3">
                  {group.children.map(child => (
                    <li key={child.id}>
                      <a href={`#${child.id}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors block py-0.5 truncate">{child.label}</a>
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
                <p><strong>chivox-local-mcp</strong> 是驰声语音评测的 MCP 本地代理，通过 <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Model Context Protocol</a> 将远程驰声评测服务桥接到本地，让 AI 助手（Claude Desktop、Claude Code、Cursor 等）直接调用语音评测能力。</p>
                <p>它支持两种评测模式，覆盖从即时交互到批量处理的全部场景：</p>
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-semibold">实时录音评测</span>
                    </div>
                    <p className="text-xs text-muted-foreground">通过麦克风边录边评，音频以 WebSocket 流式推送，无需生成中间文件，延迟更低、体验更佳。</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderOpen className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-semibold">音频文件评测</span>
                    </div>
                    <p className="text-xs text-muted-foreground">支持本地文件路径、Base64 编码、URL 三种输入，适合已有音频的批量评测场景。</p>
                  </div>
                </div>
                <Callout type="info">当前支持 <strong>16 种评测工具</strong>：英文 10 种（单词、句子、段落、纠音、自然拼读、口语选择、半开放题等）+ 中文 6 种（汉字、拼音、词句、段落、有限分支、AI Talk）。</Callout>
              </SubDoc>

              <SubDoc id="requirements" title="系统要求">
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">依赖</th>
                      <th className="text-left py-2 px-3 font-medium">版本</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-semibold">Node.js</td><td className="py-2 px-3 font-mono text-xs">{'>'}= 18</td><td className="py-2 px-3 text-muted-foreground">运行时必须</td></tr>
                      <tr><td className="py-2 px-3 font-semibold">SoX</td><td className="py-2 px-3 font-mono text-xs">any</td><td className="py-2 px-3 text-muted-foreground">仅实时录音功能需要（处理麦克风音频流）</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">安装 SoX（仅在使用实时录音时需要）：</p>
                <CodeBlock filename="Terminal" lang="bash">{`# macOS
brew install sox

# Ubuntu / Debian
sudo apt-get install sox`}</CodeBlock>
              </SubDoc>

              <SubDoc id="install" title="安装方式">
                <p><strong>方式一：npm 全局安装</strong>（推荐）</p>
                <CodeBlock filename="Terminal" lang="bash">{`npm install -g chivox-local-mcp`}</CodeBlock>

                <p><strong>方式二：npx 免安装运行</strong></p>
                <CodeBlock filename="Terminal" lang="bash">{`MCP_REMOTE_URL=http://your-server:8080 npx chivox-local-mcp`}</CodeBlock>

                <p><strong>方式三：从源码构建</strong></p>
                <CodeBlock filename="Terminal" lang="bash">{`git clone https://git.chivox.com/CLOUD_DEV/cvx_local_mcp.git
cd cvx_local_mcp
bash scripts/build.sh`}</CodeBlock>
              </SubDoc>

              <SubDoc id="env-vars" title="环境变量">
                <ParamTable params={[
                  { name: 'MCP_REMOTE_URL', type: 'string', required: true, desc: '远程驰声 MCP 服务地址，如 http://your-server:8080' },
                  { name: 'MCP_API_KEY', type: 'string', required: false, desc: 'API 认证密钥（如已配置鉴权则必填）' },
                ]} />
              </SubDoc>
            </DocSection>

            {/* ══════ 接入配置 ══════ */}
            <DocSection id="config" icon={Settings} title="接入配置">

              <SubDoc id="config-cursor" title="Cursor 配置">
                <ol className="list-decimal list-inside space-y-2 ml-1">
                  <li>打开 Cursor 设置（<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Cmd + ,</kbd>）</li>
                  <li>左侧选择 <strong>MCP</strong>（或搜索 &quot;MCP&quot;）</li>
                  <li>点击 <strong>Add new MCP server</strong></li>
                  <li>填写配置并保存：</li>
                </ol>
                <CodeBlock filename="Cursor MCP 配置" lang="json">{`{
  "name": "chivox-speech-eval",
  "type": "streamable-http",
  "url": "https://speech-eval.site/mcp"
}`}</CodeBlock>
                <Callout type="tip">Cursor 使用远程 Streamable HTTP 模式直连，无需安装本地代理。如需实时录音功能，请使用下方 Claude Desktop 的本地代理配置。</Callout>
              </SubDoc>

              <SubDoc id="config-claude-desktop" title="Claude Desktop 配置">
                <p>编辑配置文件（macOS：<code className="bg-muted px-1 rounded text-xs font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>）：</p>
                <CodeBlock filename="claude_desktop_config.json" lang="json">{`{
  "mcpServers": {
    "chivox": {
      "command": "chivox-local-mcp",
      "env": {
        "MCP_REMOTE_URL": "http://your-server:8080",
        "MCP_API_KEY": "your-api-key"
      }
    }
  }
}`}</CodeBlock>
                <p>如果是从源码构建：</p>
                <CodeBlock filename="claude_desktop_config.json" lang="json">{`{
  "mcpServers": {
    "chivox": {
      "command": "node",
      "args": ["/path/to/cvx_local_mcp/dist/index.js"],
      "env": {
        "MCP_REMOTE_URL": "http://your-server:8080"
      }
    }
  }
}`}</CodeBlock>
                <Callout type="info">Claude Desktop 使用本地代理模式（stdio），支持实时录音评测。本地代理会自动桥接远程服务。</Callout>
              </SubDoc>

              <SubDoc id="config-claude-code" title="Claude Code 配置">
                <CodeBlock filename="Terminal" lang="bash">{`# npm 全局安装后
claude mcp add chivox -- env MCP_REMOTE_URL=http://your-server:8080 chivox-local-mcp

# 源码构建后
claude mcp add chivox -- env MCP_REMOTE_URL=http://your-server:8080 node /path/to/cvx_local_mcp/dist/index.js`}</CodeBlock>
              </SubDoc>

              <SubDoc id="config-coze" title="扣子（Coze）配置">
                <p><a href="https://www.coze.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">扣子（Coze）</a>是字节跳动推出的 AI 应用开发平台，支持通过 MCP 扩展为 Agent 赋予外部工具能力。接入驰声语音评测后，你可以构建口语练习 Bot、发音诊断助手等应用。</p>
                <p className="font-semibold mt-4">方式一：扣子空间 MCP 扩展（推荐）</p>
                <ol className="list-decimal list-inside space-y-2 ml-1">
                  <li>打开 <a href="https://space.coze.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">扣子空间</a>（space.coze.cn）</li>
                  <li>在对话框下方点击 <strong>「添加扩展」</strong></li>
                  <li>选择 <strong>「自定义」</strong> 标签，点击添加新的 MCP 服务</li>
                  <li>填入以下配置信息：</li>
                </ol>
                <div className="overflow-x-auto rounded-lg border border-border/60 my-3">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">配置项</th>
                      <th className="text-left py-2 px-3 font-medium">值</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">名称</td><td className="py-2 px-3 font-mono text-xs">chivox-speech-eval</td></tr>
                      <tr><td className="py-2 px-3 font-medium">传输类型</td><td className="py-2 px-3 font-mono text-xs">streamable-http</td></tr>
                      <tr><td className="py-2 px-3 font-medium">URL</td><td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td></tr>
                    </tbody>
                  </table>
                </div>
                <ol className="list-decimal list-inside space-y-1 ml-1" start={5}>
                  <li>保存后，在对话中输入 <strong>「帮我评测这段英文发音」</strong> 即可触发 Agent 调用</li>
                </ol>
                <Callout type="tip">添加 MCP 扩展后，扣子空间的 Agent 会自动识别并调用评测工具。你可以在 Agent 的思考过程中看到具体的工具调用细节。</Callout>

                <p className="font-semibold mt-6">方式二：在 Coze 开发平台的 Bot 中使用</p>
                <ol className="list-decimal list-inside space-y-2 ml-1">
                  <li>进入 <a href="https://www.coze.cn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Coze 开发平台</a>，创建或编辑 Bot</li>
                  <li>在 Bot 的 <strong>「插件」</strong> 或 <strong>「工具」</strong> 面板中，添加 MCP 工具</li>
                  <li>选择 <strong>Streamable HTTP</strong> 类型，填入 URL：<code className="bg-muted px-1 rounded text-xs font-mono">https://speech-eval.site/mcp</code></li>
                  <li>Bot 将自动发现所有可用的评测工具（如 <code className="bg-muted px-1 rounded text-xs font-mono">evaluate_english_word</code> 等）</li>
                  <li>在 Bot 的人设提示词中，添加语音评测相关的引导语</li>
                </ol>
                <CodeBlock filename="Bot 人设提示词示例">{`你是一位专业的英语口语教练。当用户上传音频并请求评测时：
1. 使用 evaluate_english_word / evaluate_english_sentence 等工具进行评测
2. 根据评测结果（overall、accuracy、fluency 等分数）给出专业分析
3. 针对得分较低的维度提供具体改进建议
4. 鼓励用户持续练习`}</CodeBlock>
              </SubDoc>

              <SubDoc id="config-coze-workflow" title="Coze 工作流接入">
                <p>如果你需要在 Coze 工作流中集成语音评测能力，可以通过 <strong>HTTP Request 节点</strong>调用评测 API：</p>

                <p className="font-semibold mt-4">步骤 1：上传音频</p>
                <p>在工作流中添加一个 HTTP Request 节点，配置如下：</p>
                <div className="overflow-x-auto rounded-lg border border-border/60 my-3">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">配置项</th>
                      <th className="text-left py-2 px-3 font-medium">值</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">方法</td><td className="py-2 px-3 font-mono text-xs">POST</td></tr>
                      <tr><td className="py-2 px-3 font-medium">URL</td><td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/upload</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Content-Type</td><td className="py-2 px-3 font-mono text-xs">audio/mp3</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Body</td><td className="py-2 px-3 text-muted-foreground">音频文件二进制数据</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>响应中获取 <code className="bg-muted px-1 rounded text-xs font-mono">{'{{audioId}}'}</code>，传递给下一步。</p>

                <p className="font-semibold mt-4">步骤 2：调用评测</p>
                <p>添加第二个 HTTP Request 节点，通过 MCP 接口调用评测工具：</p>
                <CodeBlock filename="HTTP Request Body" lang="json">{`{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "evaluate_english_sentence",
    "arguments": {
      "audioId": "{{audioId}}",
      "sentence": "{{ref_text}}"
    }
  },
  "id": 1
}`}</CodeBlock>

                <p className="font-semibold mt-4">步骤 3：处理结果</p>
                <p>评测结果通过 JSON 格式返回，可使用 Coze 的 <strong>代码节点</strong> 或 <strong>LLM 节点</strong> 对结果进行解析和二次处理（如生成学习建议、计算进步趋势等）。</p>

                <Callout type="info">工作流方式适合需要固定流程的场景（如批量评测、定时任务、与其他系统联动）。如果是交互式场景，推荐使用上方的 MCP 扩展方式，Agent 会自动选择合适的工具。</Callout>

                <div className="rounded-lg bg-muted/30 p-5 mt-4">
                  <p className="text-xs font-semibold mb-3">完整工作流示意</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">用户输入音频</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">HTTP: 上传音频</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">HTTP: 调用评测</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">LLM: 分析结果</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">输出反馈</span>
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="config-other" title="豆包 / 钉钉 / 其他 MCP 客户端">
                <p>支持 MCP 的客户端均可接入，统一使用以下配置：</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">配置项</th>
                      <th className="text-left py-2 px-3 font-medium">值</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">传输类型</td><td className="py-2 px-3 font-mono text-xs">streamable-http</td></tr>
                      <tr><td className="py-2 px-3 font-medium">URL</td><td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td></tr>
                    </tbody>
                  </table>
                </div>
              </SubDoc>
            </DocSection>

            {/* ══════ 评测模式 ══════ */}
            <DocSection id="eval-modes" icon={Radio} title="评测模式">

              <SubDoc id="stream-eval" title="实时录音评测（边录边评）">
                <p>通过本地麦克风实时录音，音频以 WebSocket 流式推送到评测服务，<strong>无需生成中间文件</strong>。这是最灵活、延迟最低的评测方式，特别适合交互式口语练习场景。</p>
                <Callout type="tip">实时录音评测需要安装 <strong>SoX</strong> 并使用本地代理模式（Claude Desktop / Claude Code）。Cursor 等远程直连模式暂不支持实时录音。</Callout>

                <p className="font-semibold mt-4">需要按顺序调用三个工具：</p>

                <div className="mt-3 space-y-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">create_stream_session</code> — 创建流式评测会话</p>
                    <ParamTable params={[
                      { name: 'core_type', type: 'string', required: true, desc: '评测类型，如 en.word.score、en.sent.score、cn.sent.raw' },
                      { name: 'ref_text', type: 'string', required: true, desc: '评测参考文本' },
                      { name: 'audio_type', type: 'string', required: false, desc: '音频格式，默认 mp3' },
                      { name: 'sample_rate', type: 'number', required: false, desc: '采样率，默认 16000' },
                      { name: 'rank', type: 'number', required: false, desc: '评分制：4 或 100，默认 100' },
                    ]} />
                    <p className="text-xs text-muted-foreground mt-2">返回 <code className="bg-muted px-1 rounded text-xs">session_id</code>，后续步骤需使用。</p>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">start_recording</code> — 开始麦克风录音</p>
                    <ParamTable params={[
                      { name: 'session_id', type: 'string', required: true, desc: '来自 create_stream_session 的会话 ID' },
                      { name: 'chunk_size', type: 'number', required: false, desc: '音频块大小（bytes），默认 3200' },
                      { name: 'chunk_interval_ms', type: 'number', required: false, desc: '推送间隔（ms），默认 100' },
                    ]} />
                    <p className="text-xs text-muted-foreground mt-2">调用后自动启动麦克风，音频通过 WebSocket 实时推送到评测服务。</p>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2"><code className="bg-muted px-1.5 py-0.5 rounded text-xs">stop_recording</code> — 停止录音并获取结果</p>
                    <ParamTable params={[
                      { name: 'session_id', type: 'string', required: true, desc: '会话 ID' },
                      { name: 'timeout', type: 'number', required: false, desc: '等待评测结果超时秒数，默认 30' },
                    ]} />
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="stream-flow" title="流式评测完整流程">
                <div className="rounded-lg border border-border/60 p-5 bg-muted/10 space-y-5">
                  <FlowStep title="1">
                    <p><strong>用户：</strong>&quot;请评测我的英文发音，文本是 Hello&quot;</p>
                    <p className="text-muted-foreground mt-1">AI 调用 <code className="bg-muted px-1 rounded text-xs font-mono">create_stream_session(core_type=&quot;en.word.score&quot;, ref_text=&quot;Hello&quot;)</code></p>
                    <p className="text-muted-foreground">→ 获得 <code className="bg-muted px-1 rounded text-xs font-mono">session_id</code></p>
                  </FlowStep>
                  <FlowStep title="2">
                    <p>AI 调用 <code className="bg-muted px-1 rounded text-xs font-mono">start_recording(session_id=xxx)</code></p>
                    <p className="text-muted-foreground mt-1">麦克风开始录音，音频通过 WebSocket 实时推送到评测服务</p>
                  </FlowStep>
                  <FlowStep title="3">
                    <p><strong>用户</strong>说完后告知 AI &quot;结束&quot;</p>
                    <p className="text-muted-foreground mt-1">AI 调用 <code className="bg-muted px-1 rounded text-xs font-mono">stop_recording(session_id=xxx)</code></p>
                    <p className="text-muted-foreground">→ 返回评测结果（总分、准确度、流利度、音素得分等）</p>
                  </FlowStep>
                </div>
              </SubDoc>

              <SubDoc id="file-eval" title="音频文件评测">
                <p>适用于已有音频文件的评测场景，支持三种输入方式：</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">参数</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                      <th className="text-left py-2 px-3 font-medium">适用场景</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-mono text-xs">audio_file_path</td><td className="py-2 px-3">本地文件路径</td><td className="py-2 px-3 text-muted-foreground">代理自动读取并转为 Base64，最便捷</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">audio_base64</td><td className="py-2 px-3">Base64 编码数据</td><td className="py-2 px-3 text-muted-foreground">已有编码数据时使用</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">audio_url</td><td className="py-2 px-3">音频文件 URL</td><td className="py-2 px-3 text-muted-foreground">音频托管在云存储时使用</td></tr>
                    </tbody>
                  </table>
                </div>
                <Callout type="tip">推荐使用 <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs">audio_file_path</code>，只需传入本地文件路径，代理会自动处理编码和上传。</Callout>
                <p><strong>支持的音频格式：</strong>mp3, wav, ogg, m4a, aac, pcm</p>
                <p><strong>限制：</strong>单文件最大 50MB，大于 500KB 的文件自动压缩为 16kHz / 单声道 / 32kbps。</p>
              </SubDoc>
            </DocSection>

            {/* ══════ API 参考 ══════ */}
            <DocSection id="api-reference" icon={BookOpen} title="API 参考">

              <SubDoc id="tools-en" title="英文评测工具（10 种）">
                <ToolTable tools={[
                  ['en_word_eval', '单词评测', '评测 "Hello" 的发音准确度'],
                  ['en_word_correction', '单词纠音', '检测多读/漏读/错读并给出纠正建议'],
                  ['en_vocab_eval', '词语评测', '同时评测多个单词的发音'],
                  ['en_sentence_eval', '句子评测', '评测整句朗读的准确度与流利度'],
                  ['en_sentence_correction', '句子纠音', '逐词检测发音问题并给出修正建议'],
                  ['en_paragraph_eval', '段落朗读评测', '评测整段英文课文的朗读质量'],
                  ['en_phonics_eval', '自然拼读评测', '评测 Phonics 拼读规则掌握程度'],
                  ['en_choice_eval', '口语选择题', '从预设选项中识别口语回答'],
                  ['en_semi_open_eval', '半开放题评测', '场景对话等半开放口语题型'],
                  ['en_realtime_eval', '实时朗读评测', '实时反馈朗读质量，逐句评分'],
                ]} />

                <p className="mt-4"><strong>通用参数：</strong>所有英文评测工具均支持以下参数。</p>
                <ParamTable params={[
                  { name: 'ref_text', type: 'string', required: true, desc: '评测参考文本' },
                  { name: 'audio_file_path', type: 'string', required: false, desc: '本地音频文件路径（三选一）' },
                  { name: 'audio_base64', type: 'string', required: false, desc: 'Base64 编码的音频数据（三选一）' },
                  { name: 'audio_url', type: 'string', required: false, desc: '音频文件 URL（三选一）' },
                  { name: 'accent', type: 'string', required: false, desc: '口音：british / american（默认）' },
                ]} />
              </SubDoc>

              <SubDoc id="tools-cn" title="中文评测工具（6 种）">
                <ToolTable tools={[
                  ['cn_word_raw_eval', '单字评测（汉字）', '评测 "中" 的发音'],
                  ['cn_word_pinyin_eval', '单字评测（拼音）', '评测 "zhōng" 的发音'],
                  ['cn_sentence_eval', '词句评测', '评测 "你好世界" 的朗读'],
                  ['cn_paragraph_eval', '段落朗读评测', '评测一段中文课文的朗读质量'],
                  ['cn_rec_eval', '有限分支识别评测', '从预设选项中识别用户发音'],
                  ['cn_aitalk_eval', 'AI Talk 口语评测', '中文口语对话能力评测'],
                ]} />

                <p className="mt-4"><strong>通用参数：</strong></p>
                <ParamTable params={[
                  { name: 'ref_text', type: 'string', required: true, desc: '评测参考文本（汉字或拼音）' },
                  { name: 'audio_file_path', type: 'string', required: false, desc: '本地音频文件路径（三选一）' },
                  { name: 'audio_base64', type: 'string', required: false, desc: 'Base64 编码的音频数据（三选一）' },
                  { name: 'audio_url', type: 'string', required: false, desc: '音频文件 URL（三选一）' },
                ]} />
              </SubDoc>

              <SubDoc id="result-fields" title="评测结果字段">
                <p>所有评测工具返回统一的结构化结果：</p>
                <CodeBlock filename="result.json" lang="json">{`{
  "overall": 85,
  "accuracy": 82,
  "pron": 88,
  "fluency": {
    "overall": 78,
    "speed": 65,
    "pause": 2
  },
  "integrity": 95,
  "details": [
    {
      "char": "hello",
      "score": 85,
      "phone": [
        { "phoneme": "h", "score": 90 },
        { "phoneme": "ɛ", "score": 82 },
        { "phoneme": "l", "score": 88 },
        { "phoneme": "oʊ", "score": 80 }
      ]
    }
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
                        ['overall', '0–100', '综合总分，反映整体语音质量'],
                        ['accuracy', '0–100', '准确度，音素级别的发音准确率'],
                        ['pron', '0–100', '发音得分，整体发音质量评价'],
                        ['fluency.overall', '0–100', '流利度，语流的自然度与平滑度'],
                        ['fluency.speed', '0–100', '语速得分，每分钟词/音节计量'],
                        ['fluency.pause', 'number', '不自然停顿次数'],
                        ['integrity', '0–100', '完整度，是否完整朗读了参考文本'],
                        ['details[].phone[]', 'array', '每个音素的独立评分，可定位具体弱项'],
                        ['details[].stress[]', 'array', '重音得分，检测重弱读是否正确'],
                      ].map(([field, range, desc]) => (
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
                        ['音频 ID 无效或已过期', '音频上传后 5 分钟内有效，评测完成后自动删除', '重新上传音频'],
                        ['服务器繁忙', '当前请求过多，排队已满', '稍后重试，使用指数退避策略'],
                        ['存储空间已满', '服务器临时音频存储已满', '稍后重试，系统会自动清理'],
                        ['音频格式不支持', '上传了不支持的文件类型', '使用 mp3/wav/ogg/m4a/aac/pcm'],
                        ['音频时长超限', '超过该题型最大时长限制', '裁剪音频后重试'],
                        ['WebSocket 连接断开', '网络不稳定导致流式连接中断', '代理会自动重连，如持续失败请检查网络'],
                      ].map(([scene, reason, fix]) => (
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

            {/* ══════ 架构说明 ══════ */}
            <DocSection id="architecture" icon={Terminal} title="架构说明">

              <SubDoc id="arch-diagram" title="系统架构">
                <div className="flex flex-wrap items-center justify-center gap-4 my-6">
                  <div className="rounded-xl border-2 border-foreground/30 px-6 py-4 text-center min-w-[140px]">
                    <p className="text-xs font-semibold mb-1">AI 客户端</p>
                    <p className="text-[11px] text-muted-foreground">Claude Desktop<br/>Claude Code<br/>Cursor</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">stdio</p>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 px-6 py-4 text-center min-w-[140px]">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">chivox-local-mcp</p>
                    <p className="text-[11px] text-muted-foreground">本地代理<br/>SoX 录音</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">HTTP / WS</p>
                  </div>
                  <div className="rounded-xl border-2 border-foreground/30 px-6 py-4 text-center min-w-[140px]">
                    <p className="text-xs font-semibold mb-1">Remote Chivox</p>
                    <p className="text-[11px] text-muted-foreground">MCP Server<br/>评测引擎</p>
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="transport" title="传输协议">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>stdio</strong> — AI 客户端通过标准输入输出与本地代理通信，这是 MCP 的标准传输方式</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>HTTP</strong> — 音频文件评测工具通过 HTTP 代理到远程服务，适用于非流式场景</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span><strong>WebSocket</strong> — 实时录音音频通过 WebSocket 流式推送，支持断线自动重连</span>
                  </li>
                </ul>
              </SubDoc>
            </DocSection>

            {/* ══════ 示例代码 ══════ */}
            <DocSection id="integration" icon={Code2} title="示例代码">

              <SubDoc id="code-python" title="Python 上传音频">
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

              <SubDoc id="code-javascript" title="JavaScript 上传音频">
                <CodeBlock filename="upload.js" lang="javascript">{`const fs = require('fs');

const audioData = fs.readFileSync('audio.mp3');

const res = await fetch('https://speech-eval.site/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'audio/mp3' },
  body: audioData,
});

const result = await res.json();
console.log('audioId:', result.audioId);`}</CodeBlock>
              </SubDoc>
            </DocSection>

            {/* ══════ 最佳实践 ══════ */}
            <DocSection id="best-practices" icon={FileText} title="最佳实践">

              <SubDoc id="prompt-templates" title="Prompt 模板">
                <p>以下模板帮助你引导 LLM 对评测结果进行深度分析：</p>
                <div className="space-y-4 mt-4">
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4" /> 发音诊断</p>
                    <CodeBlock filename="prompt-diagnosis.txt">{`你是一位专业的英语口语教练。请根据以下 MCP 评测结果分析学生的发音表现：

评测结果：{evaluation_result}

请按以下格式输出：
1. 总体评价（一句话）
2. 优势项（>80 分的指标）
3. 弱项分析（<70 分的指标，定位到具体音素）
4. 针对性练习建议（2-3 条可操作的建议）`}</CodeBlock>
                  </div>
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><Mic className="h-4 w-4" /> 练习生成</p>
                    <CodeBlock filename="prompt-practice.txt">{`根据以下弱项列表，为学生生成针对性的口语练习材料：

弱项：{weak_points}

请生成：
1. 3 个绕口令（专门针对弱项音素）
2. 5 个包含目标音素的常用短句（标注重音和连读）
3. 1 段跟读练习段落（50-80 词）`}</CodeBlock>
                  </div>
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> 学习报告</p>
                    <CodeBlock filename="prompt-report.txt">{`请根据学生近 7 天的评测历史生成学习报告：

评测历史：{history}

报告要求：
1. 整体趋势（进步/持平/退步）
2. 各维度变化（准确度、流利度、语速）
3. 本周最大进步项
4. 下周重点练习建议
5. 鼓励性总结`}</CodeBlock>
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="error-handling" title="错误处理">
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>音频过期：</strong>上传后 5 分钟内有效。建议在上传后 3 分钟内完成评测。</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>服务繁忙：</strong>使用指数退避策略重试（1s → 2s → 4s），最多 3 次。</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>录音中断：</strong>WebSocket 断线后代理会自动重连。如持续失败，检查网络连接和 SoX 安装。</span></li>
                </ul>
              </SubDoc>

              <SubDoc id="performance" title="性能优化">
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>优先使用流式评测：</strong>实时录音模式跳过了文件上传环节，端到端延迟比文件评测低 30-50%。</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>音频压缩：</strong>文件评测时，上传前将音频转为 16kHz 单声道 mp3，可减少 60-80% 的上传体积。</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>选择合适的工具：</strong>单词评测比段落评测快 3-5 倍。如只需单词级分数，不要用句子评测。</span></li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" /><span><strong>本地文件路径最便捷：</strong>使用 <code className="bg-muted px-1 rounded text-xs">audio_file_path</code> 参数传入本地路径，代理自动处理编码，无需手动转 Base64。</span></li>
                </ul>
              </SubDoc>
            </DocSection>

            {/* ══════ 服务信息 ══════ */}
            <DocSection id="service-info" icon={Globe} title="服务信息">
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
                      <tr><td className="py-2 px-3 font-mono text-xs">/mcp</td><td className="py-2 px-3">POST</td><td className="py-2 px-3">MCP JSON-RPC 接口（Streamable HTTP）</td></tr>
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
                        ['存储限制', '500MB', '最大音频存储空间'],
                        ['最大排队', '10', '等待处理的请求数'],
                        ['最大并发', '3', '同时处理的评测数'],
                        ['音频有效期', '5 分钟', '上传后未评测自动过期'],
                        ['文件大小限制', '50MB', '单个音频文件最大'],
                      ].map(([k, v, d]) => (
                        <tr key={k}><td className="py-2 px-3 font-medium">{k}</td><td className="py-2 px-3 font-mono text-xs">{v}</td><td className="py-2 px-3 text-muted-foreground">{d}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubDoc>
              <SubDoc id="changelog" title="更新日志">
                <div className="space-y-3">
                  {[
                    { ver: 'v3.0.0', date: '2026-04-16', desc: '新增本地代理模式，支持实时录音流式评测，工具扩展至 16 种' },
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
