'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { DocsShell, type NavGroup } from './docs-shell';
import {
  CodeBlock,
  DocSection,
  SubDoc,
  ParamTable,
  Callout,
  FlowStep,
  ToolTable,
} from './docs-shared';
import { DocsEnglishBody } from './docs-content-en';
import {
  BookOpen,
  Code2,
  Zap,
  FileText,
  Terminal,
  Globe,
  Mic,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  Radio,
  FolderOpen,
  Workflow,
  Sparkles,
  Plug,
  Bot,
  Building2,
  Check,
  Sparkle,
  Languages,
  GraduationCap,
  Notebook,
  Gauge,
  ListChecks,
  Network,
} from 'lucide-react';

/* ─── Navigation Structure ─── */

const NAV = [
  { id: 'concept', icon: Workflow, label: 'MCP 工作原理', children: [
    { id: 'why-mcp', label: '为什么需要 MCP' },
    { id: 'scenario-walkthrough', label: '场景走查 · 6 步' },
    { id: 'dev-responsibility', label: '开发者只做两件事' },
    { id: 'integration-paths', label: '三种接入姿势' },
  ]},
  { id: 'architecture', icon: Terminal, label: '架构说明', children: [
    { id: 'arch-overview', label: '两种接入模式总览' },
    { id: 'arch-mcp', label: 'MCP 模式架构' },
    { id: 'arch-rest', label: 'functioncalling 模式架构' },
    { id: 'transport', label: '传输协议对比' },
  ]},
  { id: 'quick-start', icon: Zap, label: '快速开始', children: [
    { id: 'overview', label: '概述' },
    { id: 'requirements', label: '系统要求' },
    { id: 'install', label: '安装方式' },
    { id: 'env-vars', label: '环境变量' },
  ]},
  { id: 'config', icon: Plug, label: '接入 · 直接用（零代码）', children: [
    { id: 'config-cursor', label: 'Cursor' },
    { id: 'config-claude-desktop', label: 'Claude Desktop' },
    { id: 'config-claude-code', label: 'Claude Code' },
    { id: 'config-ai-ide', label: 'Windsurf / Zed / Continue' },
    { id: 'config-coze', label: '扣子（Coze）' },
    { id: 'config-coze-workflow', label: 'Coze 工作流' },
    { id: 'config-ai-workspace', label: 'AI 工作台 · 豆包 / 飞书 / WorkBuddy / 钉钉' },
    { id: 'config-workflow-platforms', label: 'Dify / n8n / Flowise' },
    { id: 'config-other', label: '其他 MCP 客户端' },
  ]},
  { id: 'config-code', icon: Code2, label: '接入 · 编程用 MCP（SDK / 代码）', children: [
    { id: 'code-mcp-sdk', label: '① 官方 MCP 客户端库' },
    { id: 'code-agent-frameworks', label: '② LangChain / Mastra / Agents SDK' },
    { id: 'code-function-calling', label: '③ 直调 chat.completions · 动态 tools' },
    { id: 'code-selfhosted-agent', label: '④ 自研后端 Agent' },
    { id: 'llm-deepseek', label: 'DeepSeek' },
    { id: 'llm-glm', label: 'GLM（智谱）' },
    { id: 'llm-kimi', label: 'KIMI（Moonshot）' },
    { id: 'llm-doubao', label: '豆包 Seed 2.0（火山方舟）' },
    { id: 'llm-openai', label: 'OpenAI（GPT-5.1）' },
    { id: 'llm-claude', label: 'Claude（Anthropic）' },
    { id: 'llm-gemini', label: 'Gemini（Google）' },
    { id: 'llm-comparison', label: '模型对比速查' },
  ]},
  { id: 'config-rest', icon: Network, label: '接入 · 非 MCP 原生 REST（cvx_fc）', children: [
    { id: 'rest-overview', label: 'functioncalling 模式总览' },
    { id: 'rest-catalog', label: '函数目录 · GET /v1/functions' },
    { id: 'rest-oneshot', label: '一次性文件评测' },
    { id: 'rest-streaming', label: '流式评测 · 三步骤' },
    { id: 'rest-examples', label: 'JS / Android 完整示例' },
    { id: 'rest-resume', label: '断线恢复 · 兜底拉取' },
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

const NAV_EN: NavGroup[] = [
  { id: 'concept', icon: Workflow, label: 'How MCP works', children: [
    { id: 'why-mcp', label: 'Why MCP' },
    { id: 'scenario-walkthrough', label: 'Scenario · 6 steps' },
    { id: 'dev-responsibility', label: 'Two developer tasks' },
    { id: 'integration-paths', label: 'Three integration styles' },
  ]},
  { id: 'architecture', icon: Terminal, label: 'Architecture', children: [
    { id: 'arch-overview', label: 'Two integration modes' },
    { id: 'arch-mcp', label: 'MCP mode architecture' },
    { id: 'arch-rest', label: 'Function-calling architecture' },
    { id: 'transport', label: 'Transport comparison' },
  ]},
  { id: 'quick-start', icon: Zap, label: 'Quick start', children: [
    { id: 'overview', label: 'Overview' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'install', label: 'Install' },
    { id: 'env-vars', label: 'Environment' },
  ]},
  { id: 'config', icon: Plug, label: 'Zero-code clients', children: [
    { id: 'config-cursor', label: 'Cursor' },
    { id: 'config-claude-desktop', label: 'Claude Desktop' },
    { id: 'config-claude-code', label: 'Claude Code' },
    { id: 'config-ai-ide', label: 'Windsurf / Zed / Continue' },
    { id: 'config-coze', label: 'Coze' },
    { id: 'config-coze-workflow', label: 'Coze workflows' },
    { id: 'config-ai-workspace', label: 'Enterprise AI workspaces' },
    { id: 'config-workflow-platforms', label: 'Dify / n8n / Flowise' },
    { id: 'config-other', label: 'Other MCP clients' },
  ]},
  { id: 'config-code', icon: Code2, label: 'MCP · SDK / code integration', children: [
    { id: 'code-mcp-sdk', label: '① Official MCP SDK' },
    { id: 'code-agent-frameworks', label: '② Agent frameworks' },
    { id: 'code-function-calling', label: '③ chat.completions · dynamic tools' },
    { id: 'code-selfhosted-agent', label: '④ Custom backend agent' },
    { id: 'llm-deepseek', label: 'DeepSeek' },
    { id: 'llm-glm', label: 'GLM (Zhipu)' },
    { id: 'llm-kimi', label: 'KIMI (Moonshot)' },
    { id: 'llm-doubao', label: 'Doubao Seed 2.0 (Volcano Ark)' },
    { id: 'llm-qwen', label: 'Qwen (Alibaba)' },
    { id: 'llm-openai', label: 'OpenAI (GPT-5.1)' },
    { id: 'llm-claude', label: 'Claude (Anthropic)' },
    { id: 'llm-gemini', label: 'Gemini (Google)' },
    { id: 'llm-comparison', label: 'Model comparison' },
  ]},
  { id: 'config-rest', icon: Network, label: 'Non-MCP REST (cvx_fc)', children: [
    { id: 'rest-overview', label: 'Function-calling overview' },
    { id: 'rest-catalog', label: 'Function catalog · GET /v1/functions' },
    { id: 'rest-oneshot', label: 'One-shot file eval' },
    { id: 'rest-streaming', label: 'Streaming · 3 steps' },
    { id: 'rest-examples', label: 'JS / Android samples' },
    { id: 'rest-resume', label: 'Resume & fallback' },
  ]},
  { id: 'eval-modes', icon: Radio, label: 'Evaluation modes', children: [
    { id: 'stream-eval', label: 'Streaming mic' },
    { id: 'stream-flow', label: 'Streaming flow' },
    { id: 'file-eval', label: 'Audio files' },
  ]},
  { id: 'api-reference', icon: BookOpen, label: 'API reference', children: [
    { id: 'tools-en', label: 'English tools' },
    { id: 'tools-cn', label: 'Chinese tools' },
    { id: 'result-fields', label: 'Result fields' },
    { id: 'error-codes', label: 'Errors' },
  ]},
  { id: 'best-practices', icon: FileText, label: 'Best practices', children: [
    { id: 'prompt-templates', label: 'Prompt templates' },
    { id: 'error-handling', label: 'Errors & retries' },
    { id: 'performance', label: 'Performance' },
  ]},
  { id: 'service-info', icon: Globe, label: 'Service info', children: [
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'limits', label: 'Limits' },
    { id: 'changelog', label: 'Changelog' },
  ]},
];

/* ─── Page（英文 / 中文拆成两个组件，避免切换语言时 Hooks 数量变化导致白屏）─── */

function DocsPageEn() {
  return (
    <DocsShell
      nav={NAV_EN}
      backLabel="Back to Home"
      title="Developer documentation"
      subtitle="Chivox Speech Evaluation MCP · chivox-local-mcp"
    >
      <DocsEnglishBody />
    </DocsShell>
  );
}

function DocsPageZh() {
  return (
    <DocsShell
      nav={NAV}
      backLabel="返回首页"
      title="开发者文档"
      subtitle="驰声语音评测 MCP · chivox-local-mcp"
    >
            {/* ══════ MCP 工作原理 ══════ */}
            <DocSection id="concept" icon={Workflow} title="MCP 工作原理">

              <SubDoc id="why-mcp" title="为什么需要 MCP">
                <p>
                  大模型（GPT / Claude / Gemini / 通义千问 等）本质上是<strong>文字大脑</strong>：它擅长读和写，但天生<strong>听不到</strong>音频、<strong>打不开</strong>你的数据库、<strong>调不通</strong>第三方 API。
                </p>
                <p>
                  <strong>MCP（Model Context Protocol）</strong>是一套由 Anthropic 主导、业界共同推进的开放协议，它像一根"对讲机"：让大模型可以在需要时主动去调用外部能力（工具、数据源、服务），然后把结果接回来继续对话。
                </p>
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-semibold">没有 MCP 的做法</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                      <li>· 研究评测服务的 REST 文档</li>
                      <li>· 自己写鉴权 / 上传 / 轮询代码</li>
                      <li>· 把结果序列化后塞进 prompt</li>
                      <li>· 每换一个大模型都得重写一遍</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border-2 border-foreground/60 p-4 bg-foreground/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-semibold">用驰声 MCP 之后</span>
                    </div>
                    <ul className="text-xs space-y-1.5 leading-relaxed">
                      <li>· 填一行 MCP Server 地址</li>
                      <li>· 大模型自动发现&amp;调用评测工具</li>
                      <li>· 换任何支持 MCP 的大模型都能用</li>
                      <li>· 不写一行调用代码</li>
                    </ul>
                  </div>
                </div>
                <Callout type="info">
                  MCP 让"接入语音评测"从一个"后端工程"变成了一个"配置项"。这也是为什么 Cursor、Claude Desktop、Dify、Coze、字节豆包、飞书智能助手都已经原生支持 MCP。
                </Callout>
              </SubDoc>

              <SubDoc id="scenario-walkthrough" title="场景走查 · 从一段录音到温柔反馈">
                <p>
                  想象一个具体场景：一位开发者用 Claude 做了一款 <strong>「AI 雅思口语陪练」小程序</strong>，接入驰声语音评测 MCP。当用户发来一段录音，整个链路是这样的：
                </p>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-5 my-4 space-y-5">
                  <FlowStep title="1">
                    <p><strong className="text-foreground">配置阶段</strong>（开发者 · 一次性）</p>
                    <p className="text-muted-foreground mt-1">在 AI 后端的配置文件里填一行驰声 MCP Server 地址。大模型启动时自动发现：「我多了一个叫<strong>语音评测</strong>的工具」。</p>
                  </FlowStep>
                  <FlowStep title="2">
                    <p><strong className="text-foreground">接收用户指令</strong>（终端用户）</p>
                    <p className="text-muted-foreground mt-1">小程序用户发来一段自我介绍录音：「帮我听听，发音哪里有问题？」后端把「文字 + 录音链接」打包给大模型。</p>
                  </FlowStep>
                  <FlowStep title="3">
                    <p><strong className="text-foreground">大模型自主思考</strong>（LLM · 最核心的魔法）</p>
                    <div className="text-muted-foreground mt-1 rounded-md bg-background/80 border border-border/40 px-3 py-2 text-xs leading-relaxed">
                      「用户让我听发音。」<br />
                      「但我只是文字大脑，我听不到。」<br />
                      「等等 —— 开发者给了我一个叫 <code className="bg-muted px-1 rounded">chivox_voice_eval</code> 的 MCP 工具！」
                    </div>
                  </FlowStep>
                  <FlowStep title="4">
                    <p><strong className="text-foreground">MCP 协议 · 自动调用</strong>（LLM → 驰声）</p>
                    <p className="text-muted-foreground mt-1">大模型自动按 MCP 标准构造 <code className="bg-muted px-1 rounded text-xs font-mono">tools/call</code> 请求，把录音链接和参考文本发到驰声服务。<span className="text-foreground">开发者不需要写任何调用代码。</span></p>
                  </FlowStep>
                  <FlowStep title="5">
                    <p><strong className="text-foreground">驰声服务处理</strong>（评测引擎）</p>
                    <p className="text-muted-foreground mt-1">驰声对音频进行考试级打分，把结构化结果通过 MCP 原路返回：<code className="bg-muted px-1 rounded text-xs font-mono">overall 85</code>、<code className="bg-muted px-1 rounded text-xs font-mono">/θ/ 音发音错误</code>、<code className="bg-muted px-1 rounded text-xs font-mono">流利度 88</code>。</p>
                  </FlowStep>
                  <FlowStep title="6">
                    <p><strong className="text-foreground">大模型整合并输出反馈</strong>（LLM）</p>
                    <p className="text-muted-foreground mt-1">大模型把冷冰冰的分数翻译成温柔反馈：</p>
                    <div className="text-foreground/80 mt-2 rounded-md bg-background/80 border border-border/40 px-3 py-2 text-xs leading-relaxed italic">
                      「你的自我介绍很棒！综合 85 分 🎉 不过 <strong>think</strong> 这个词的 /θ/ 咬舌音不太标准，我们一起来练一下……」
                    </div>
                  </FlowStep>
                </div>
                <Callout type="tip">
                  <strong>整条链路里，MCP 只出现在 ① 和 ④</strong>：① 让开发者一次性告诉大模型「你多了一个工具」，④ 让大模型可以自动调用它。这两步的标准化，就是 MCP 的全部价值。
                </Callout>
              </SubDoc>

              <SubDoc id="dev-responsibility" title="开发者只做两件事">
                <p>听起来复杂，但对开发者来说只需要两件事：</p>
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  <div className="rounded-lg border border-border/60 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">1</span>
                      <span className="text-sm font-semibold">填一次 MCP 配置</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      在 AI 后端的配置里填入驰声 MCP Server 地址和 API Key，就这一次，以后新加评测能力完全免开发。
                    </p>
                    <CodeBlock filename="mcp-config.json" lang="json">{`{
  "chivox_voice_eval": {
    "type": "streamable-http",
    "url": "https://speech-eval.site/mcp",
    "apiKey": "sk-••••••••••"
  }
}`}</CodeBlock>
                  </div>
                  <div className="rounded-lg border border-border/60 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">2</span>
                      <span className="text-sm font-semibold">写一段 System Prompt</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      告诉大模型这个工具是做什么的、什么时候调用、结果怎么转成用户友好的反馈。
                    </p>
                    <CodeBlock filename="system-prompt.md">{`你是一位英语口语教练。
当用户发来录音时：
1. 调用 chivox_voice_eval 评分
2. 聚焦 <70 分的音素家族
3. 用高情商话术给出练习建议`}</CodeBlock>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  其余所有事情 —— 音频上传、鉴权、工具发现、调用时机、返回格式、结果整合 —— 都由 MCP 协议和大模型自己搞定。
                </p>
              </SubDoc>

              <SubDoc id="integration-paths" title="三种典型接入姿势">
                <p>根据你的技术栈，有三种等价的接入方式，底层都走完全相同的 MCP 协议：</p>

                {/* ── 姿势一：可视化 ── */}
                <div className="rounded-lg border border-border/60 p-5 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-foreground" />
                    <h4 className="text-sm font-semibold">姿势一 · 可视化拖拽（扣子 / Coze / 飞书智能助手）</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    适合产品经理、运营、不写后端代码的开发者。整个过程像在手机上装 App。
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-1 text-sm">
                    <li><strong>找到入口</strong>：在扣子平台的 <strong>「插件 / 工具」</strong> 配置区，点击<strong>「添加 MCP 服务」</strong>。</li>
                    <li><strong>填两个字段</strong>（这也是你未来会从驰声这边拿到的）：
                      <div className="mt-2 overflow-x-auto rounded-lg border border-border/60">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-border/30">
                            <tr><td className="py-2 px-3 font-medium w-32">服务器地址</td><td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td></tr>
                            <tr><td className="py-2 px-3 font-medium">鉴权密钥</td><td className="py-2 px-3 font-mono text-xs">sk-•••••••••• <span className="text-muted-foreground ml-2">（由驰声分配，用于计费与识别）</span></td></tr>
                          </tbody>
                        </table>
                      </div>
                    </li>
                    <li><strong>平台自动发现能力</strong>：扣子会访问你填的地址，读取 MCP Server 自描述的"说明书"。瞬间明白：「这是个语音评测工具，需要传音频，会返发音分」。</li>
                    <li><strong>右侧测试</strong>：在平台的聊天框里发一段语音，大模型就会自动调用工具。<strong>整个过程不需要写一行代码。</strong></li>
                  </ol>
                </div>

                {/* ── 姿势二：代码框架 ── */}
                <div className="rounded-lg border border-border/60 p-5 mt-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="h-4 w-4 text-foreground" />
                    <h4 className="text-sm font-semibold">姿势二 · 代码框架配置（Dify / LangChain / 自研后端）</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    适合做独立 APP / 小程序、用 Dify 或 LangChain 写 Agent 的极客开发者。核心就是往配置文件里加一段 JSON。
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-1 text-sm">
                    <li><strong>打开配置文件</strong>（项目根目录下的 <code className="bg-muted px-1 rounded text-xs font-mono">mcp.json</code> 或框架指定的配置路径）。</li>
                    <li><strong>在 <code className="bg-muted px-1 rounded text-xs font-mono">mcpServers</code> 下增加一个节点</strong>：
                      <CodeBlock filename="mcp.json" lang="json">{`{
  "mcpServers": {
    "chivox_voice_eval": {
      "type": "streamable-http",
      "url": "https://speech-eval.site/mcp",
      "env": {
        "API_KEY": "你的专属密钥"
      }
    }
  }
}`}</CodeBlock>
                    </li>
                    <li><strong>重启后端服务</strong>。大模型的底层调度器会在启动时自动连上驰声 MCP Server，把 16 种评测工具注册成<strong>随时待命</strong>的 tools。</li>
                    <li><strong>触发调用</strong>：用户发来录音后，大模型看到 system prompt 的引导，自动选择合适的工具（单词/句子/段落/半开放）调用。</li>
                  </ol>
                </div>

                {/* ── 姿势三：Function Calling 直连（分 A / B 两种做法） ── */}
                <div className="rounded-lg border border-border/60 p-5 mt-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="h-4 w-4 text-foreground" />
                    <h4 className="text-sm font-semibold">姿势三 · 原生 Function Calling（豆包 / DeepSeek / OpenAI 兼容 API）</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    适合不用任何 Agent 框架、直接调用 LLM API 的后端开发者。豆包 1.5+ / DeepSeek / GPT / Qwen 等模型都走标准 <code className="bg-muted px-1 rounded text-xs font-mono">chat.completions</code> 的 <code className="bg-muted px-1 rounded text-xs font-mono">tools</code> 参数。这里又分 A / B 两种做法，<strong>B 才是生产推荐</strong>。
                  </p>

                  <Callout type="warning">
                    常见疑问：<em>"要不要手写一个 tool 定义？"</em><br />
                    — <strong>姿势一 / 二不用</strong>（Coze、Dify、火山方舟控制台、Claude Desktop 会自动从 MCP Server 拉工具列表）。<br />
                    — <strong>姿势三看你选 A 还是 B</strong>：A 要手写，B 用 MCP 客户端库自动拉。
                  </Callout>

                  {/* ── 3-A：手写 tool schema ── */}
                  <div className="mt-4 rounded-md border border-border/40 bg-muted/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold">3-A · 手写 tool schema（最快验证，不推荐生产）</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">快速 Demo</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                      自己写一段 JSON Schema 告诉豆包"有个工具叫 xxx，参数长这样"，豆包返回 tool_call 后你再手动去调驰声 MCP。<strong>缺点</strong>：驰声有 16 个评测工具，你每加一个题型都要改代码。
                    </p>
                    <CodeBlock filename="3a_hardcode_tool.py" lang="python">{`import os, json
from openai import OpenAI

client = OpenAI(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.getenv('ARK_API_KEY'),
)

# ─── 手写一段 tool schema（不推荐：16 个工具就要写 16 段）───
tools = [{
    "type": "function",
    "function": {
        "name": "en_word_eval",
        "description": "英语单词发音评测。当用户让你评价英语发音并提供录音链接时调用。",
        "parameters": {
            "type": "object",
            "properties": {
                "audio_url":      {"type": "string", "description": "录音 URL"},
                "reference_text": {"type": "string", "description": "参考文本，如 Apple"},
            },
            "required": ["audio_url", "reference_text"]
        }
    }
}]

resp = client.chat.completions.create(
    model="ep-xxx-doubao-tools",
    messages=[
        {"role": "system", "content": "你是英语老师，拿到评测结果后温柔地反馈，不要直接报分数。"},
        {"role": "user",   "content": "老师，我读了 Apple，录音 https://demo.com/u1.mp3"},
    ],
    tools=tools,
    tool_choice="auto",
)

msg = resp.choices[0].message
if msg.tool_calls:
    args = json.loads(msg.tool_calls[0].function.arguments)
    # ↓↓↓ 这里手动调驰声 MCP，再把结果回填给豆包做第二趟 ↓↓↓
    # result = requests.post("https://speech-eval.site/mcp", json={...})`}</CodeBlock>
                  </div>

                  {/* ── 3-B：MCP 自动发现 ── */}
                  <div className="mt-3 rounded-md border border-foreground/30 bg-foreground/[0.03] dark:bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        3-B · 用 MCP 客户端库自动发现 <Sparkles className="h-3 w-3 text-foreground" />
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background">生产推荐</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                      启动时连上驰声 MCP Server，调一次 <code className="bg-muted px-1 rounded">tools/list</code>，把 16 个评测工具自动转成 Function Calling 的 tools 格式。<strong>驰声加新工具，你代码不用改</strong>。这才是 MCP 协议的真正价值。
                    </p>
                    <CodeBlock filename="3b_mcp_autodiscover.py" lang="python">{`import asyncio, os
from openai import AsyncOpenAI
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

client = AsyncOpenAI(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.getenv("ARK_API_KEY"),
)

async def main():
    # ─── 1. 连驰声 MCP Server，自动拉取全部 16 个工具 ───
    async with streamablehttp_client(
        "https://speech-eval.site/mcp",
        headers={"Authorization": f"Bearer {os.getenv('CHIVOX_KEY')}"},
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            mcp_tools = (await session.list_tools()).tools  # ← 一行拿到全部工具

            # ─── 2. MCP schema → OpenAI Function Calling schema ───
            tools = [{
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": t.description,
                    "parameters": t.inputSchema,  # MCP 直接给 JSON Schema
                }
            } for t in mcp_tools]

            # ─── 3. 正常调豆包，tools 由 MCP 动态注入 ───
            resp = await client.chat.completions.create(
                model="ep-xxx-doubao-tools",
                messages=[
                    {"role": "system", "content": "你是英语老师，收到评测结果后温柔反馈。"},
                    {"role": "user",   "content": "老师，我读了 Apple，录音 https://demo.com/u1.mp3"},
                ],
                tools=tools,
                tool_choice="auto",
            )

            # ─── 4. 折返跑：豆包选好工具后，直接走 MCP 调驰声 ───
            msg = resp.choices[0].message
            if msg.tool_calls:
                call = msg.tool_calls[0]
                result = await session.call_tool(
                    call.function.name,
                    arguments=__import__("json").loads(call.function.arguments),
                )
                # 把 result 回填给豆包做第二趟 chat.completions 即可

asyncio.run(main())`}</CodeBlock>
                    <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                      想要更省心？直接用 <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-2">官方 mcp python sdk</a>、<code className="bg-muted px-1 rounded text-xs">mcp-use</code>、<code className="bg-muted px-1 rounded text-xs">openai-agents</code>，或火山官方 <code className="bg-muted px-1 rounded text-xs">Arkitect</code> 高代码 SDK，它们都把上面这段"MCP → Function Calling"的桥接封装好了。
                    </p>
                  </div>
                </div>

                <Callout type="info">
                  三种姿势走的是完全相同的 MCP 协议，能力完全等价。选型建议：<strong>产品经理 / 原型验证用姿势一</strong>（Coze 填表单）；<strong>AI 客户端用户用姿势二</strong>（Cursor / Claude Desktop 填 <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs">mcp.json</code>）；<strong>后端生产服务用姿势三-B</strong>（MCP 客户端库自动发现工具，不要手写 tool schema）。
                </Callout>
              </SubDoc>

            </DocSection>

            {/* ══════ 架构说明 ══════ */}
            <DocSection id="architecture" icon={Terminal} title="架构说明">

              <SubDoc id="arch-overview" title="两种接入模式总览">
                <p>驰声语音评测对外提供<strong>两条并行入口</strong>，底层指向同一个评测引擎，但面向不同的客户端环境，按能力选其一即可：</p>

                <div className="grid md:grid-cols-2 gap-4 my-5">
                  <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <Plug className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      MCP 模式（推荐首选）
                    </p>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      <li>• JSON-RPC 2.0 · Streamable HTTP / stdio</li>
                      <li>• 所有支持 MCP 的 IDE / 桌面 AI / Agent 框架 <strong className="text-foreground">零代码即用</strong></li>
                      <li>• 工具列表自动注入，新增题型<strong className="text-foreground">业务侧不用改</strong></li>
                      <li>• 本地代理 <code className="bg-muted px-1 rounded text-[10px] font-mono">chivox-local-mcp</code> 支持麦克风实时录音</li>
                    </ul>
                    <p className="text-xs mt-2"><strong>典型客户端</strong>：Cursor / Claude Desktop / Coze / Dify / LangChain / 自研后端 Agent</p>
                  </div>
                  <div className="rounded-xl border-2 border-sky-500/40 bg-sky-500/5 p-5">
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <Network className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      functioncalling 模式（非 MCP · cvx_fc）
                    </p>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      <li>• OpenAI function-calling 风格 · 纯 REST + WebSocket</li>
                      <li>• <strong className="text-foreground">不依赖任何 MCP SDK</strong>，普通 HTTP 客户端即可打</li>
                      <li>• 内置 <code className="bg-muted px-1 rounded text-[10px] font-mono">resume_token</code> 断线续播、<code className="bg-muted px-1 rounded text-[10px] font-mono">intermediate</code> 中间结果、<code className="bg-muted px-1 rounded text-[10px] font-mono">backpressure</code> 反压</li>
                      <li>• 为不能 / 不想引入 MCP 的客户端环境保留兜底通道</li>
                    </ul>
                    <p className="text-xs mt-2"><strong>典型客户端</strong>：原生 Android / iOS / Flutter、微信 / 支付宝小程序、老版本 Java / PHP 后端</p>
                  </div>
                </div>

                <p className="font-semibold mt-5">怎么选？</p>
                <div className="overflow-x-auto rounded-lg border border-border/60 my-3">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">你的客户端环境</th>
                      <th className="text-left py-2 px-3 font-medium">建议</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3">Cursor / Claude Desktop / 各类 AI IDE 能装 MCP</td><td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">MCP 模式</td></tr>
                      <tr><td className="py-2 px-3">Python / Node / Java 后端能引入 MCP SDK</td><td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">MCP 模式</td></tr>
                      <tr><td className="py-2 px-3">Coze / Dify / n8n 等可视化平台</td><td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">MCP 模式</td></tr>
                      <tr><td className="py-2 px-3">原生 Android / iOS App，想直接打 HTTP + WS</td><td className="py-2 px-3 text-sky-600 dark:text-sky-400">functioncalling 模式</td></tr>
                      <tr><td className="py-2 px-3">微信 / 支付宝 / 抖音小程序</td><td className="py-2 px-3 text-sky-600 dark:text-sky-400">functioncalling 模式</td></tr>
                      <tr><td className="py-2 px-3">老系统 / 封闭运行时，不想引入 MCP 依赖</td><td className="py-2 px-3 text-sky-600 dark:text-sky-400">functioncalling 模式</td></tr>
                    </tbody>
                  </table>
                </div>
                <Callout type="warning">
                  同一个会话<strong>二选一、不要混用</strong>：MCP 的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/audio/</code> 和 functioncalling 的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/eval/</code> 属于不同的会话 ID 空间。
                </Callout>
              </SubDoc>

              <SubDoc id="arch-mcp" title="MCP 模式 · 数据流与组件">
                <p>MCP 模式下有两种部署形态，底层均走 JSON-RPC 2.0，区别只在客户端离服务端有没有一层本地代理：</p>

                <p className="font-semibold mt-4">形态 A · 远程直连（零代码）</p>
                <p className="text-sm text-muted-foreground">适合 Cursor / Coze / Dify / n8n 等支持 Streamable HTTP 的客户端，<strong>无本地依赖</strong>。</p>
                <div className="flex flex-wrap items-center justify-center gap-4 my-4">
                  <div className="rounded-xl border-2 border-foreground/30 px-5 py-3 text-center min-w-[130px]">
                    <p className="text-xs font-semibold mb-0.5">AI 客户端</p>
                    <p className="text-[11px] text-muted-foreground">Cursor / Coze /<br/>Dify / n8n …</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">Streamable HTTP<br/>JSON-RPC 2.0</p>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 px-5 py-3 text-center min-w-[130px]">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">驰声 MCP Server</p>
                    <p className="text-[11px] text-muted-foreground">/mcp · /ws/audio<br/>评测引擎</p>
                  </div>
                </div>

                <p className="font-semibold mt-5">形态 B · 本地代理（支持麦克风实时录音）</p>
                <p className="text-sm text-muted-foreground">适合 Claude Desktop / Claude Code 等以 stdio 挂载 MCP 的客户端，需要本地实时录音时走这条路径。</p>
                <div className="flex flex-wrap items-center justify-center gap-3 my-4">
                  <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[120px]">
                    <p className="text-xs font-semibold mb-0.5">AI 客户端</p>
                    <p className="text-[11px] text-muted-foreground">Claude Desktop /<br/>Claude Code</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">stdio</p>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 px-4 py-3 text-center min-w-[120px]">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">chivox-local-mcp</p>
                    <p className="text-[11px] text-muted-foreground">本地代理 · SoX 录音</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">HTTP / WS</p>
                  </div>
                  <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[120px]">
                    <p className="text-xs font-semibold mb-0.5">Remote Chivox</p>
                    <p className="text-[11px] text-muted-foreground">MCP Server<br/>评测引擎</p>
                  </div>
                </div>

                <p className="font-semibold mt-5">标准数据流</p>
                <ol className="list-decimal list-inside space-y-1.5 text-sm ml-1">
                  <li><code className="bg-muted px-1 rounded text-xs">initialize</code> → 协商协议版本与能力</li>
                  <li><code className="bg-muted px-1 rounded text-xs">tools/list</code> → 拉取 16 个评测工具的 JSON Schema</li>
                  <li><strong>文件模式</strong>：<code className="bg-muted px-1 rounded text-xs">tools/call</code> → 服务端执行评测 → 返回 JSON-RPC 响应</li>
                  <li><strong>实时模式</strong>：<code className="bg-muted px-1 rounded text-xs">create_stream_session</code> → 走 <code className="bg-muted px-1 rounded text-xs">/ws/audio/{'{session_id}'}</code> 推流 → <code className="bg-muted px-1 rounded text-xs">stream_eval_result</code> 收结构化评分</li>
                </ol>

                <p className="font-semibold mt-6">原始 JSON-RPC 请求示例（自建客户端可直接抄）</p>
                <p className="text-xs text-muted-foreground mb-3">
                  如果你不使用官方 MCP SDK 而是直接通过 <code className="bg-muted px-1 rounded">POST /mcp</code> 自己拼 JSON-RPC 2.0 报文，最小可用的三条请求如下。所有请求均需携带 <code className="bg-muted px-1 rounded text-xs">Authorization: Bearer &lt;your_api_key&gt;</code>。
                </p>

                <p className="text-sm font-semibold mt-4">① 初始化 · <code>initialize</code></p>
                <CodeBlock filename="initialize.json" lang="json">{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "my-client", "version": "1.0.0" }
  }
}`}</CodeBlock>
                <p className="text-xs text-muted-foreground">成功后服务端返回协议版本、服务端能力、服务端信息，此后方可调用其他方法。</p>

                <p className="text-sm font-semibold mt-4">② 拉取工具清单 · <code>tools/list</code></p>
                <CodeBlock filename="tools-list.json" lang="json">{`{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}`}</CodeBlock>
                <p className="text-xs text-muted-foreground">返回全部 16 个评测工具（英 10 + 中 6）+ 2 个流式工具，含名字、描述、参数 JSON Schema。客户端应缓存此响应，后续按需展示 / 桥接给 LLM。</p>

                <p className="text-sm font-semibold mt-4">③ 调用工具 · <code>tools/call</code></p>
                <CodeBlock filename="tools-call.json" lang="json">{`{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "en_word_eval",
    "arguments": {
      "ref_text": "hello",
      "audio_base64": "<base64 encoded audio>",
      "accent": 2,
      "rank": 100
    }
  }
}`}</CodeBlock>
                <p className="text-xs text-muted-foreground">
                  成功响应放在 <code className="bg-muted px-1 rounded">result.content[0].text</code>（JSON 字符串形式，内部就是评测结果结构）；失败则返回 <code className="bg-muted px-1 rounded">error.code</code> + <code className="bg-muted px-1 rounded">error.message</code>。
                </p>

                <Callout type="tip">
                  用 Python / TypeScript 官方 MCP SDK 的用户<strong>不需要关心以上 JSON-RPC 细节</strong>——SDK 已经封装好 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">session.initialize()</code> / <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">session.list_tools()</code> / <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">session.call_tool()</code>。这里仅供裸协议实现或排障时参考。
                </Callout>
              </SubDoc>

              <SubDoc id="arch-rest" title="functioncalling 模式 · 数据流与组件">
                <p>没有代理、没有 SDK，客户端 ↔ 服务端只有两条链路：一条 REST 管会话 / 文件评测，一条 WebSocket 推音频帧。</p>

                <div className="flex flex-wrap items-center justify-center gap-3 my-5">
                  <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[140px]">
                    <p className="text-xs font-semibold mb-0.5">客户端</p>
                    <p className="text-[11px] text-muted-foreground">原生 App / 小程序 /<br/>老版后端 / 纯前端</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">HTTP REST<br/>/v1/call · /v1/functions</p>
                  </div>
                  <div className="rounded-xl border-2 border-sky-500/50 bg-sky-500/5 px-4 py-3 text-center min-w-[140px]">
                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-0.5">cvx_fc 服务</p>
                    <p className="text-[11px] text-muted-foreground">function-calling 网关<br/>评测引擎</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-muted-foreground">⇄</p>
                    <p className="text-[10px] text-muted-foreground">WebSocket<br/>/ws/eval/&#123;id&#125;</p>
                  </div>
                  <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[140px]">
                    <p className="text-xs font-semibold mb-0.5">客户端推流</p>
                    <p className="text-[11px] text-muted-foreground">麦克风 / 分片缓冲</p>
                  </div>
                </div>

                <p className="font-semibold mt-5">三条典型数据流</p>
                <div className="space-y-3 my-3">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-sm font-semibold mb-1.5">a. 一次性文件评测</p>
                    <p className="text-xs text-muted-foreground">POST <code className="bg-muted px-1 rounded">/v1/call</code>（<code className="bg-muted px-1 rounded">audio_url</code> 或 <code className="bg-muted px-1 rounded">audio_base64</code>） → 同步返回评分</p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-sm font-semibold mb-1.5">b. 流式实时评测</p>
                    <p className="text-xs text-muted-foreground">POST <code className="bg-muted px-1 rounded">/v1/call</code> → <code className="bg-muted px-1 rounded">start_stream_eval</code> → 拿 <code className="bg-muted px-1 rounded">ws_url</code> → 连 <code className="bg-muted px-1 rounded">/ws/eval/&#123;id&#125;</code> → 推 PCM → 收 <code className="bg-muted px-1 rounded">intermediate</code> / <code className="bg-muted px-1 rounded">backpressure</code> → 发 <code className="bg-muted px-1 rounded">stop</code> → 收 <code className="bg-muted px-1 rounded">result</code></p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-sm font-semibold mb-1.5">c. 断线恢复 + 兜底拉取</p>
                    <p className="text-xs text-muted-foreground">网络断开 60 秒内 → 用 <code className="bg-muted px-1 rounded">resume_token</code> 重连续播；彻底失败 → POST <code className="bg-muted px-1 rounded">/v1/call</code> → <code className="bg-muted px-1 rounded">get_stream_result</code> 兜底</p>
                  </div>
                </div>

                <p className="font-semibold mt-5">特色能力</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-1">
                  <li><strong>resume_token</strong> — 网络抖动 60 秒内可无缝续播，服务端挂起会话状态</li>
                  <li><strong>intermediate 帧</strong> — 边推边吐部分结果，前端可做实时波形 / 分数涂色</li>
                  <li><strong>backpressure 反馈</strong> — 服务端主动下发 <code className="bg-muted px-1 rounded text-xs">suggested_interval_ms</code>，客户端按建议降速</li>
                  <li><strong>结构化错误码</strong> — <code className="bg-muted px-1 rounded text-xs">SESSION_EXPIRED</code> / <code className="bg-muted px-1 rounded text-xs">INVALID_STATE</code> / … 便于客户端写重试逻辑</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">详细的接入示例见下文 <a href="#config-rest" className="text-blue-600 dark:text-blue-400 hover:underline">「接入 · 非 MCP 原生 REST」</a> 大节。</p>
              </SubDoc>

              <SubDoc id="transport" title="传输协议对比">
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">维度</th>
                      <th className="text-left py-2 px-3 font-medium">MCP 模式</th>
                      <th className="text-left py-2 px-3 font-medium">functioncalling（cvx_fc）</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">协议</td><td className="py-2 px-3">JSON-RPC 2.0</td><td className="py-2 px-3">REST + WebSocket</td></tr>
                      <tr><td className="py-2 px-3 font-medium">入口路径</td><td className="py-2 px-3 font-mono text-xs">POST /mcp</td><td className="py-2 px-3 font-mono text-xs">POST /v1/call</td></tr>
                      <tr><td className="py-2 px-3 font-medium">列出工具</td><td className="py-2 px-3 font-mono text-xs">tools/list</td><td className="py-2 px-3 font-mono text-xs">GET /v1/functions</td></tr>
                      <tr><td className="py-2 px-3 font-medium">调用工具</td><td className="py-2 px-3 font-mono text-xs">tools/call</td><td className="py-2 px-3 font-mono text-xs">POST /v1/call + name</td></tr>
                      <tr><td className="py-2 px-3 font-medium">流式音频 WS</td><td className="py-2 px-3 font-mono text-xs">{'/ws/audio/{session_id}'}</td><td className="py-2 px-3 font-mono text-xs">{'/ws/eval/{session_id}'}</td></tr>
                      <tr><td className="py-2 px-3 font-medium">本地 stdio 代理</td><td className="py-2 px-3">支持（<code className="bg-muted px-1 rounded text-[10px]">chivox-local-mcp</code>）</td><td className="py-2 px-3 text-muted-foreground">不适用</td></tr>
                      <tr><td className="py-2 px-3 font-medium">断线重连</td><td className="py-2 px-3">客户端 SDK 自动重连</td><td className="py-2 px-3">resume_token（60s 挂起）</td></tr>
                      <tr><td className="py-2 px-3 font-medium">中间结果</td><td className="py-2 px-3">stream_eval 回调</td><td className="py-2 px-3">intermediate 帧</td></tr>
                      <tr><td className="py-2 px-3 font-medium">背压反馈</td><td className="py-2 px-3 text-muted-foreground">—</td><td className="py-2 px-3">backpressure 帧</td></tr>
                      <tr><td className="py-2 px-3 font-medium">客户端依赖</td><td className="py-2 px-3">MCP SDK（官方 / 框架）</td><td className="py-2 px-3">仅 HTTP + WS 客户端</td></tr>
                    </tbody>
                  </table>
                </div>
              </SubDoc>
            </DocSection>

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

            {/* ══════ 接入 · 直接用（零代码） ══════ */}
            <DocSection id="config" icon={Plug} title="接入 · 直接用 MCP（零代码）">

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mb-5 text-sm">
                <p className="font-semibold mb-1.5 flex items-center gap-2"><Sparkles className="h-4 w-4" /> 这一类接入的共同特征</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>不用写代码、不用装 SDK，只在客户端的<strong className="text-foreground">「MCP 配置」</strong>或<strong className="text-foreground">「扩展」</strong>里填一段 JSON / URL</li>
                  <li>保存后 LLM 自动发现 16 个评测工具，并在对话 / Agent 中自主调用</li>
                  <li>覆盖 <strong className="text-foreground">IDE 编程助手</strong>、<strong className="text-foreground">桌面 AI 客户端</strong>、<strong className="text-foreground">企业 AI 工作台</strong>、<strong className="text-foreground">可视化 Bot / 工作流平台</strong>四大生态</li>
                </ul>
              </div>


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

              <SubDoc id="config-ai-ide" title="Windsurf / Zed / Continue 等 IDE 编程助手">
                <p>除了 Cursor 和 Claude Code，主流的 AI 编程 IDE 都原生支持 MCP。以下客户端使用<strong>完全一致</strong>的 Streamable HTTP 配置，区别只在配置入口：</p>
                <div className="overflow-x-auto rounded-lg border border-border/60 my-3">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">客户端</th>
                      <th className="text-left py-2 px-3 font-medium">配置入口</th>
                      <th className="text-left py-2 px-3 font-medium">备注</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">Windsurf (Codeium)</td><td className="py-2 px-3 text-xs">Settings → Cascade → MCP Servers</td><td className="py-2 px-3 text-xs text-muted-foreground">直接贴下方 JSON</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Zed</td><td className="py-2 px-3 text-xs"><code className="bg-muted px-1 rounded text-xs font-mono">~/.config/zed/settings.json</code> 的 <code className="bg-muted px-1 rounded text-xs font-mono">context_servers</code></td><td className="py-2 px-3 text-xs text-muted-foreground">Assistant Panel 自动发现</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Continue (VS Code / JetBrains)</td><td className="py-2 px-3 text-xs"><code className="bg-muted px-1 rounded text-xs font-mono">config.yaml</code> 的 <code className="bg-muted px-1 rounded text-xs font-mono">mcpServers</code></td><td className="py-2 px-3 text-xs text-muted-foreground">v0.9+ 支持</td></tr>
                      <tr><td className="py-2 px-3 font-medium">通义灵码 / CodeGeeX / 文心快码</td><td className="py-2 px-3 text-xs">插件设置 → MCP 服务</td><td className="py-2 px-3 text-xs text-muted-foreground">2026 Q1 起陆续支持</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Cline (原 Claude Dev)</td><td className="py-2 px-3 text-xs">MCP Servers 面板 → 编辑配置</td><td className="py-2 px-3 text-xs text-muted-foreground">VS Code 扩展</td></tr>
                    </tbody>
                  </table>
                </div>
                <CodeBlock filename="通用 MCP 配置（复制即用）" lang="json">{`{
  "mcpServers": {
    "chivox-speech-eval": {
      "type": "streamable-http",
      "url": "https://speech-eval.site/mcp"
    }
  }
}`}</CodeBlock>
                <Callout type="tip">所有 IDE 类客户端都走远程 Streamable HTTP，零本地依赖。需要实时录音才需切到 Claude Desktop 的本地代理模式。</Callout>
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

              <SubDoc id="config-ai-workspace" title="AI 工作台 · 豆包 / 飞书智能伙伴 / WorkBuddy / 钉钉 AI">
                <p>这一类是<strong>面向「上班族」的企业 / 日常 AI 助手</strong>，产品形态是个聊天框 + 插件市场 / 扩展面板。接入后，员工在 App 里打字「帮我评一下这段录音」就能自动触发驰声评测，不用写任何代码。</p>

                <div className="grid gap-3 md:grid-cols-2 mt-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2"><Bot className="h-4 w-4 text-amber-500" /> 豆包（Doubao）App / 桌面版</p>
                    <p className="text-xs text-muted-foreground mb-2">字节跳动官方 AI 助手，2026 年起桌面版支持 MCP 扩展。</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>桌面版设置 → <strong>「智能体扩展」</strong> → 添加 MCP 服务</li>
                      <li>类型选 <code className="bg-muted px-1 rounded text-[10px] font-mono">streamable-http</code>，URL 填 <code className="bg-muted px-1 rounded text-[10px] font-mono">https://speech-eval.site/mcp</code></li>
                      <li>对话中直接说「帮我评测」即可自动调用</li>
                    </ol>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2"><Building2 className="h-4 w-4 text-blue-500" /> 飞书智能伙伴（My AI）</p>
                    <p className="text-xs text-muted-foreground mb-2">飞书企业 AI，支持以 MCP / Function Calling 挂载外部工具给团队 Bot。</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>飞书开发者后台 → 创建应用 → <strong>「AI 能力 / 智能伙伴」</strong></li>
                      <li>在「工具」中选 <strong>外部 MCP 服务</strong>，填入上方 URL</li>
                      <li>把智能伙伴拉进群聊，@ 它提交音频即可评测</li>
                    </ol>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /> WorkBuddy / 企业智能助手</p>
                    <p className="text-xs text-muted-foreground mb-2">字节 WorkBuddy、腾讯会议 AI、企业微信智能助手等企业 AI 工作台场景。</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>在工作台的<strong>「技能 / 扩展」</strong>后台新增一个 MCP 连接器</li>
                      <li>传输协议选 Streamable HTTP，地址填 <code className="bg-muted px-1 rounded text-[10px] font-mono">https://speech-eval.site/mcp</code></li>
                      <li>把技能发布到指定部门 / 群组，HR、培训、销售口语陪练场景即可直接用</li>
                    </ol>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2"><Workflow className="h-4 w-4 text-cyan-500" /> 钉钉 AI 助理 / 通义千问 App</p>
                    <p className="text-xs text-muted-foreground mb-2">阿里生态：钉钉 AI 助理支持自定义插件，通义 App 可通过「AI 工具箱」挂载 MCP。</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>钉钉开发者后台 → AI 助理 → <strong>「插件开发 / MCP 接入」</strong></li>
                      <li>选 HTTP Streamable，填入驰声 MCP URL 并开启鉴权（可选）</li>
                      <li>在钉钉群 @AI 助理上传音频，自动返回评测卡片</li>
                    </ol>
                  </div>
                </div>

                <Callout type="tip"><strong>典型场景 · 小龙虾们的共同剧本</strong>：销售口语陪练 → 外语培训 → 主持 / 播音岗位考核 → K12 英语作业批改 → 客服话术复盘。这些「上班族 AI 工作台」接入驰声 MCP 后，员工 / 学员只要对着话筒说话，AI 就能自动打分并给出个性化改进建议，运营 / 培训 / 教研团队零开发即可上线。</Callout>
              </SubDoc>

              <SubDoc id="config-workflow-platforms" title="Dify / n8n / Flowise 等可视化编排">
                <p>如果你需要把语音评测编排进<strong>多步业务流</strong>（例如：学员录音 → 评测 → 生成错题集 → 推送到 CRM），可视化工作流平台比聊天 Bot 更合适。</p>

                <div className="grid gap-3 md:grid-cols-3 mt-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">Dify</p>
                    <p className="text-xs text-muted-foreground mb-2">开源 LLMOps，v0.15+ 原生 MCP 工具。</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>「工具」→「自定义 MCP」→ 填 URL</li>
                      <li>在 Chatflow / Workflow 节点里直接拖用</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">n8n</p>
                    <p className="text-xs text-muted-foreground mb-2">工作流自动化，用 <code className="bg-muted px-1 rounded text-[10px] font-mono">MCP Client</code> 节点。</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>添加 <strong>MCP Client</strong> 节点</li>
                      <li>Transport 选 HTTP Stream，URL 贴驰声地址</li>
                      <li>Tool 下拉自动列出 16 个评测能力</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">Flowise / LangFlow</p>
                    <p className="text-xs text-muted-foreground mb-2">可视化 LangChain Agent 编排。</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>拖出 <strong>MCP Tool</strong> 节点</li>
                      <li>连到 AgentExecutor 即可</li>
                    </ul>
                  </div>
                </div>

                <Callout type="info">可视化平台的好处是<strong>流程可追溯、可回放</strong>，适合教育机构 / 培训部门做批量评测 + 报表导出；缺点是单步延迟略高于直接 MCP 调用，对延迟敏感的交互场景建议用 Cursor / Claude Desktop 直连。</Callout>
              </SubDoc>

              <SubDoc id="config-other" title="其他 MCP 客户端（通用配置）">
                <p>任何遵循 MCP 协议的客户端都可以接入，统一使用以下配置：</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">配置项</th>
                      <th className="text-left py-2 px-3 font-medium">值</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-medium">传输类型</td><td className="py-2 px-3 font-mono text-xs">streamable-http</td></tr>
                      <tr><td className="py-2 px-3 font-medium">URL</td><td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td></tr>
                      <tr><td className="py-2 px-3 font-medium">鉴权（可选）</td><td className="py-2 px-3 font-mono text-xs">Header：<code>Authorization: Bearer &lt;MCP_API_KEY&gt;</code></td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">还没找到你用的客户端？任何支持 <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Model Context Protocol</a> 的终端都通用。找不到入口？下一小节「编程用 MCP」里用 SDK 直接接即可。</p>
              </SubDoc>
            </DocSection>

            {/* ══════ 接入 · 编程用 MCP ══════ */}
            <DocSection id="config-code" icon={Code2} title="接入 · 编程用 MCP（SDK / 代码集成）">

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mb-5 text-sm">
                <p className="font-semibold mb-1.5 flex items-center gap-2"><Terminal className="h-4 w-4" /> 这一类接入的共同特征</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>你在写一段<strong className="text-foreground">真正的后端服务</strong>：一个 Agent Worker、一个 API、一个自动化脚本</li>
                  <li>业务里的「语音评测」是其中一个步骤，需要由代码 <strong className="text-foreground">决定何时调用</strong>、<strong className="text-foreground">如何解析结果</strong></li>
                  <li>四种主流写法：① 官方 MCP 客户端库 → ② Agent 框架自动桥接 → ③ 直调 chat.completions + tools → ④ 把 MCP Client 嵌进业务后端</li>
                  <li>如果客户端环境<strong className="text-foreground">不能引入 MCP SDK</strong>（原生 App / 小程序 / 老系统），请跳转下一大节 <a href="#config-rest" className="text-blue-600 dark:text-blue-400 hover:underline">「接入 · 非 MCP 原生 REST（cvx_fc）」</a></li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">💡 强烈推荐①或②：驰声有 16 个评测工具，<strong className="text-foreground">让 MCP 自动注入 tool schema</strong>，每新增一个题型不用改一行业务代码。</p>
              </div>

              <SubDoc id="code-mcp-sdk" title="① 官方 MCP 客户端库（Python / TypeScript）">
                <p>最底层、也最推荐的方式。由 <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Anthropic 官方维护</a>，一次连接自动拿到全部工具的 JSON Schema，然后交给任意 LLM。</p>

                <p className="font-semibold mt-4">Python：<code className="bg-muted px-1 rounded text-xs font-mono">mcp</code></p>
                <CodeBlock filename="chivox_client.py" lang="python">{`# pip install mcp openai
import asyncio, os
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

MCP_URL = "https://speech-eval.site/mcp"
llm = OpenAI(api_key=os.getenv("DOUBAO_KEY"),
             base_url="https://ark.cn-beijing.volces.com/api/v3")  # 豆包 / DeepSeek / OpenAI 同构

async def main(audio_id: str, ref: str):
    async with streamablehttp_client(MCP_URL) as (reader, writer, _):
        async with ClientSession(reader, writer) as sess:
            await sess.initialize()

            tools = await sess.list_tools()
            openai_tools = [{
                "type": "function",
                "function": {"name": t.name, "description": t.description,
                             "parameters": t.inputSchema},
            } for t in tools.tools]

            resp = llm.chat.completions.create(
                model="doubao-1-5-pro-32k",
                messages=[{"role": "user",
                           "content": f"帮我评测 audioId={audio_id}，参考文本：{ref}"}],
                tools=openai_tools,
            )

            for call in resp.choices[0].message.tool_calls or []:
                result = await sess.call_tool(call.function.name,
                                              arguments=eval(call.function.arguments))
                print(call.function.name, "→", result.content[0].text[:200])

asyncio.run(main("abc123", "I think therefore I am"))`}</CodeBlock>

                <p className="font-semibold mt-4">TypeScript / Node.js：<code className="bg-muted px-1 rounded text-xs font-mono">@modelcontextprotocol/sdk</code></p>
                <CodeBlock filename="chivox-client.ts" lang="typescript">{`// npm i @modelcontextprotocol/sdk openai
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import OpenAI from "openai";

const mcp = new Client({ name: "chivox-biz", version: "1.0.0" });
await mcp.connect(new StreamableHTTPClientTransport(new URL("https://speech-eval.site/mcp")));

const { tools } = await mcp.listTools();
const openai = new OpenAI({ apiKey: process.env.DEEPSEEK_KEY, baseURL: "https://api.deepseek.com/v1" });

const resp = await openai.chat.completions.create({
  model: "deepseek-chat",
  messages: [{ role: "user", content: "评测 audioId=abc123, 参考 I think therefore I am" }],
  tools: tools.map(t => ({ type: "function", function: {
    name: t.name, description: t.description, parameters: t.inputSchema
  }})),
});

for (const call of resp.choices[0].message.tool_calls ?? []) {
  const r = await mcp.callTool({ name: call.function.name,
                                 arguments: JSON.parse(call.function.arguments) });
  console.log(call.function.name, r.content);
}`}</CodeBlock>
                <Callout type="tip">这种写法 <strong>LLM 供应商可换</strong>（豆包 / DeepSeek / GPT / Qwen / Moonshot），<strong>工具自动更新</strong>（驰声新增题型无需改业务代码），适合生产后端。</Callout>
              </SubDoc>

              <SubDoc id="code-agent-frameworks" title="② 用 Agent 框架自动桥接（LangChain / Mastra / Agents SDK）">
                <p>如果项目已经在用 Agent 框架，几行 adapter 就能把驰声 MCP 塞进去，框架本身会接管 tool-calling 循环、重试、日志。</p>

                <div className="grid gap-3 md:grid-cols-2 mt-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">LangChain / LangGraph（Python）</p>
                    <CodeBlock filename="agent.py" lang="python">{`# pip install langchain-mcp-adapters langgraph
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

client = MultiServerMCPClient({
    "chivox": {
        "transport": "streamable_http",
        "url": "https://speech-eval.site/mcp",
    }
})
tools = await client.get_tools()

agent = create_react_agent("openai:gpt-4o-mini", tools)
result = await agent.ainvoke({"messages":
    [("user", "评测 audioId=abc123 参考 think")]})
print(result["messages"][-1].content)`}</CodeBlock>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">Mastra（TypeScript）</p>
                    <CodeBlock filename="mastra-agent.ts" lang="typescript">{`// npm i @mastra/core @mastra/mcp
import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const mcp = new MCPClient({ servers: {
  chivox: { url: new URL("https://speech-eval.site/mcp") }
}});

export const speechCoach = new Agent({
  name: "speech-coach",
  instructions: "你是口语教练，用 chivox 工具评测并给改进建议。",
  model: openai("gpt-4o-mini"),
  tools: await mcp.getTools(),
});`}</CodeBlock>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">OpenAI Agents SDK（Python）</p>
                    <CodeBlock filename="agents_sdk.py" lang="python">{`# pip install openai-agents
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

chivox = MCPServerStreamableHttp(
    params={"url": "https://speech-eval.site/mcp"},
    name="chivox-speech-eval",
)

async with chivox:
    agent = Agent(name="coach",
                  instructions="专业口语教练",
                  mcp_servers=[chivox])
    r = await Runner.run(agent, "评测 audioId=abc123")
    print(r.final_output)`}</CodeBlock>
                  </div>

                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="font-semibold text-sm mb-2">LlamaIndex / AutoGen / CrewAI</p>
                    <p className="text-xs text-muted-foreground mb-2">这些框架都有官方或社区 MCP adapter，用法与上述类似：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li><strong>LlamaIndex</strong>：<code className="bg-muted px-1 rounded text-[10px] font-mono">llama-index-tools-mcp</code></li>
                      <li><strong>AutoGen</strong>：<code className="bg-muted px-1 rounded text-[10px] font-mono">autogen-ext[mcp]</code></li>
                      <li><strong>CrewAI</strong>：<code className="bg-muted px-1 rounded text-[10px] font-mono">crewai-tools</code> 的 MCPServerAdapter</li>
                      <li><strong>Spring AI</strong>（Java）：<code className="bg-muted px-1 rounded text-[10px] font-mono">spring-ai-mcp-client</code></li>
                    </ul>
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="code-function-calling" title="③ 直调 chat.completions · 上传与动态 tools（豆包 / DeepSeek / 等）">
                <p>
                  DeepSeek、GLM（智谱）、KIMI（Moonshot）、豆包（火山方舟）、千帆、DashScope 等若提供 <strong>OpenAI 兼容的 HTTP API</strong>，接入驰声 MCP 的套路一致：用 MCP 客户端拉取工具列表 → 转为{' '}
                  <code className="bg-muted px-1 rounded text-xs font-mono">tools</code> → 模型决策 <code className="bg-muted px-1 rounded text-xs font-mono">tool_calls</code> → MCP 执行并回填 → 再让模型生成诊断话术。
                </p>
                <div className="rounded-lg bg-muted/30 p-5 my-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">① MCP list_tools()</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">② 转 OpenAI tools 格式</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 font-medium">③ LLM 决策 tool_calls</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">④ MCP call_tool()</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">⑤ 评测结果回填 → LLM 诊断</span>
                  </div>
                </div>
                <Callout type="tip">各厂商仅需替换 <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">base_url</code> 与 <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">api_key</code>，驰声 MCP 与 tools 桥接代码可原样复用。</Callout>

                <p className="font-semibold mt-6">先上传音频，拿到 audioId</p>
                <p className="text-sm text-muted-foreground mb-3">文件评测工具通常需要 <code className="bg-muted px-1 rounded text-xs font-mono">audioId</code>（或路径参数，视工具而定）。下面是用 HTTP 上传的最小示例：</p>
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
                <CodeBlock filename="upload.js" lang="javascript">{`const fs = require('fs');

const audioData = fs.readFileSync('audio.mp3');

const res = await fetch('https://speech-eval.site/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'audio/mp3' },
  body: audioData,
});

const result = await res.json();
console.log('audioId:', result.audioId);`}</CodeBlock>

                <p className="font-semibold mt-6">再以豆包为例：MCP 动态 tools + chat.completions 折返跑</p>
                <p>当你用的 LLM SDK <strong>还没有原生 MCP 支持</strong>（比如老版本的火山方舟 / 百度千帆 / 通义 DashScope），退化方案是：用 MCP 客户端<strong>一次性拉到 tool schema</strong>，然后按 OpenAI Function Calling 格式喂给 LLM。</p>
                <CodeBlock filename="doubao_tools.py" lang="python">{`# 适用：豆包（火山方舟）/ DeepSeek / Qwen / Moonshot / GLM 等 OpenAI 兼容 API
# 核心思路：MCP 列工具 → 转 OpenAI tools → LLM 决策 → MCP 执行 → 回填

async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
    async with ClientSession(r, w) as mcp:
        await mcp.initialize()
        tools = (await mcp.list_tools()).tools

        # ① 用 MCP 拉到的 schema 自动转 OpenAI 格式
        oa_tools = [{"type": "function", "function": {
            "name": t.name,
            "description": t.description,
            "parameters": t.inputSchema,
        }} for t in tools]

        # ② 喂给豆包
        messages = [{"role": "user", "content": "评测一下 audioId=abc123"}]
        resp = doubao.chat.completions.create(
            model="doubao-1-5-pro-32k", messages=messages, tools=oa_tools,
        )

        # ③ LLM 回 tool_calls → 折返跑到 MCP 执行
        msg = resp.choices[0].message
        if msg.tool_calls:
            messages.append(msg)
            for c in msg.tool_calls:
                result = await mcp.call_tool(
                    c.function.name, arguments=json.loads(c.function.arguments))
                messages.append({"role": "tool", "tool_call_id": c.id,
                                 "content": result.content[0].text})
            # ④ 再喂一轮，让豆包根据评测结果产出自然语言诊断
            final = doubao.chat.completions.create(
                model="doubao-1-5-pro-32k", messages=messages)
            print(final.choices[0].message.content)`}</CodeBlock>
                <Callout type="warning"><strong>千万别手写 tool schema！</strong>驰声共 <strong>16 个评测工具</strong>（英文 10 + 中文 6），每个工具参数较多，手写既容易错也难维护。一定用 MCP <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">list_tools()</code> 动态拿。</Callout>
              </SubDoc>

              <SubDoc id="code-selfhosted-agent" title="④ 自研后端 Agent（FastAPI / NestJS / Spring）">
                <p>大部分落地场景其实是：<strong>你已有一个业务后端</strong>（教育 SaaS / 培训系统 / 客服平台），只需要新增一个「语音评测」能力。推荐架构：</p>

                <div className="rounded-lg bg-muted/30 p-5 my-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">前端录音 / 上传</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">业务后端</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 font-medium">MCP Client（常驻连接）</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">驰声 MCP</span>
                    <span className="text-muted-foreground">↘</span>
                    <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">LLM（诊断 / 出题）</span>
                  </div>
                </div>

                <p className="font-semibold mt-2">FastAPI 示例（生产最小骨架）</p>
                <CodeBlock filename="app.py" lang="python">{`from fastapi import FastAPI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession
from contextlib import asynccontextmanager

mcp_session: ClientSession | None = None

@asynccontextmanager
async def lifespan(app):
    global mcp_session
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as s:
            await s.initialize()
            mcp_session = s
            yield
    mcp_session = None

app = FastAPI(lifespan=lifespan)

@app.post("/api/evaluate")
async def evaluate(audio_id: str, ref_text: str):
    # 直接选一个最合适的工具执行（不经 LLM，延迟最低）
    r = await mcp_session.call_tool("evaluate_english_sentence",
                                    {"audioId": audio_id, "sentence": ref_text})
    return {"result": r.content[0].text}`}</CodeBlock>

                <Callout type="tip"><strong>关键优化</strong>：① MCP 连接在 lifespan 里做成长连接，不要每次请求都重连；② 对延迟敏感的场景可以「跳过 LLM 直接调 tool」，把 LLM 放到「生成诊断报告」那一步。</Callout>
              </SubDoc>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-4 my-5 text-xs">
                <p className="font-semibold text-sm mb-1.5 flex items-center gap-2"><Sparkles className="h-4 w-4 text-muted-foreground" /> 下面是 ① ～ ④ 中<strong className="text-foreground">第③种「直调 chat.completions」</strong>按主流 LLM 厂商的细化写法</p>
                <p className="text-muted-foreground">各家 SDK / base_url / 鉴权写法略有差别，挑你当前用的那一家看即可；驰声 MCP 侧代码不用改。</p>
              </div>

              <SubDoc id="llm-deepseek" title="DeepSeek">
                <p>
                  DeepSeek 提供与 OpenAI 完全兼容的 API，当前最新模型为 <strong>DeepSeek-V3.2</strong>（2025 年 12 月发布，首个把"思考 + 工具调用"原生融合的模型）。
                  通过 <code className="bg-muted px-1 rounded text-xs font-mono">deepseek-chat</code> 进入<strong>非思考模式</strong>，
                  通过 <code className="bg-muted px-1 rounded text-xs font-mono">deepseek-reasoner</code> 进入<strong>思考模式</strong>，
                  <strong>两种模式均支持 Function Calling</strong>，128K 上下文。
                </p>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">完整示例（Python）</p>
                <CodeBlock filename="deepseek_chivox.py" lang="python">{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# DeepSeek 客户端（OpenAI 兼容）
client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com/v1",
)

async def evaluate_with_deepseek(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()

            # ① 拉取驰声 MCP 工具列表
            tools = (await mcp.list_tools()).tools
            oa_tools = [{"type": "function", "function": {
                "name": t.name,
                "description": t.description,
                "parameters": t.inputSchema,
            }} for t in tools]

            # ② 调用 DeepSeek，让它选择合适的评测工具
            messages = [{"role": "user", "content":
                f"请评测这段英文录音，audioId={audio_id}，参考文本：{ref_text}"}]

            resp = client.chat.completions.create(
                model="deepseek-chat",   # 或 deepseek-reasoner
                messages=messages,
                tools=oa_tools,
            )

            # ③ 执行 tool_calls
            msg = resp.choices[0].message
            if msg.tool_calls:
                messages.append(msg)
                for call in msg.tool_calls:
                    result = await mcp.call_tool(
                        call.function.name,
                        arguments=json.loads(call.function.arguments),
                    )
                    messages.append({
                        "role": "tool",
                        "tool_call_id": call.id,
                        "content": result.content[0].text,
                    })

                # ④ 让 DeepSeek 根据评测结果生成自然语言诊断
                final = client.chat.completions.create(
                    model="deepseek-chat",
                    messages=messages,
                )
                return final.choices[0].message.content

asyncio.run(evaluate_with_deepseek("audio_abc123", "Hello, nice to meet you."))`}</CodeBlock>
                <Callout type="tip">
                  <strong>选型建议（V3.2）：</strong>日常评测诊断用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">deepseek-chat</code>，速度快、token 消耗低；
                  需要深度分析（错误归因 / 个性化练习路径）时用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">deepseek-reasoner</code>，
                  V3.2 起<strong>思考模式也能在思维链中调用工具</strong>，可以一次性完成"调评测 → 思考 → 出诊断"，无需再切回 V3 做工具调用。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-glm" title="GLM（智谱 AI / Z.ai）">
                <p>
                  智谱 AI 当前最新旗舰为 <strong>GLM-5 / GLM-5.1</strong>（2026 年 2 月发布，744B-A40B MoE，200K 上下文，对标 Claude Opus 4.5），
                  以及上一代 <strong>GLM-4.7</strong>、<strong>GLM-4.6</strong>。
                  此外保留 <code className="bg-muted px-1 rounded text-xs font-mono">glm-4-flash</code>（免费快速版）方便开发测试。
                  全部模型支持 OpenAI 兼容接口与原生 <code className="bg-muted px-1 rounded text-xs font-mono">zhipuai</code> SDK，原生 Function Calling。
                </p>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`ZHIPU_API_KEY=xxxxxxxx.xxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">方式一：OpenAI 兼容接口（推荐）</p>
                <CodeBlock filename="glm_chivox.py" lang="python">{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(
    api_key=os.environ["ZHIPU_API_KEY"],
    base_url="https://open.bigmodel.cn/api/paas/v4/",
)

async def evaluate_with_glm(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()
            tools = (await mcp.list_tools()).tools
            oa_tools = [{"type": "function", "function": {
                "name": t.name,
                "description": t.description,
                "parameters": t.inputSchema,
            }} for t in tools]

            messages = [{"role": "user", "content":
                f"请评测这段录音，audioId={audio_id}，参考文本：{ref_text}"}]

            resp = client.chat.completions.create(
                model="glm-4-flash",   # 免费快速版；生产推荐 glm-5 / glm-4.7
                messages=messages,
                tools=oa_tools,
            )

            msg = resp.choices[0].message
            if msg.tool_calls:
                messages.append(msg)
                for call in msg.tool_calls:
                    result = await mcp.call_tool(
                        call.function.name,
                        arguments=json.loads(call.function.arguments),
                    )
                    messages.append({
                        "role": "tool",
                        "tool_call_id": call.id,
                        "content": result.content[0].text,
                    })
                final = client.chat.completions.create(
                    model="glm-4-flash", messages=messages)
                return final.choices[0].message.content

asyncio.run(evaluate_with_glm("audio_abc123", "How are you today?"))`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">方式二：官方 zhipuai SDK</p>
                <CodeBlock filename="glm_sdk.py" lang="python">{`from zhipuai import ZhipuAI

client = ZhipuAI(api_key=os.environ["ZHIPU_API_KEY"])

# 其余逻辑与方式一相同，仅替换 client 实例
resp = client.chat.completions.create(
    model="glm-5",   # 旗舰；也可用 glm-4.7 / glm-4-flash
    messages=messages,
    tools=oa_tools,
)`}</CodeBlock>
                <Callout type="tip">
                  <strong>选型建议：</strong>
                  开发联调用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-4-flash</code>（免费）；
                  在线辅导日常诊断用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-4.7</code> 性价比最高；
                  K12 / 复杂 Agent 编排（多步评测 + 个性化练习路径）用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-5</code> / <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-5.1</code>，
                  200K 上下文、Agent 能力对标 Claude Opus 系列。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-kimi" title="KIMI（Moonshot AI）">
                <p>
                  Moonshot AI 当前最新旗舰是 <strong>Kimi K2.5</strong>（2026 年 1 月 27 日发布，MoE 架构、<strong>256K 上下文</strong>、原生多模态、Agent 集群协作）。
                  另外提供 <code className="bg-muted px-1 rounded text-xs font-mono">kimi-k2-thinking</code>（深度思考）、<code className="bg-muted px-1 rounded text-xs font-mono">kimi-k2-turbo-preview</code>（高速版）。
                  上一代 <code className="bg-muted px-1 rounded text-xs font-mono">moonshot-v1-8k/32k/128k</code> 仍然兼容，但<strong>推荐迁移到 kimi-k2.5</strong>。
                  全部模型 OpenAI 兼容，原生 Function Calling。
                </p>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`MOONSHOT_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">完整示例（Python）</p>
                <CodeBlock filename="kimi_chivox.py" lang="python">{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# 中国大陆用 api.moonshot.cn；海外/国际版用 api.moonshot.ai
client = OpenAI(
    api_key=os.environ["MOONSHOT_API_KEY"],
    base_url="https://api.moonshot.cn/v1",
)

async def evaluate_with_kimi(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()
            tools = (await mcp.list_tools()).tools
            oa_tools = [{"type": "function", "function": {
                "name": t.name,
                "description": t.description,
                "parameters": t.inputSchema,
            }} for t in tools]

            messages = [{"role": "user", "content":
                f"请评测这段英文录音，audioId={audio_id}，参考文本：{ref_text}"}]

            resp = client.chat.completions.create(
                model="kimi-k2.5",   # 旗舰；也可选 kimi-k2-turbo-preview / moonshot-v1-128k
                messages=messages,
                tools=oa_tools,
            )

            msg = resp.choices[0].message
            if msg.tool_calls:
                messages.append(msg)
                for call in msg.tool_calls:
                    result = await mcp.call_tool(
                        call.function.name,
                        arguments=json.loads(call.function.arguments),
                    )
                    messages.append({
                        "role": "tool",
                        "tool_call_id": call.id,
                        "content": result.content[0].text,
                    })
                final = client.chat.completions.create(
                    model="kimi-k2.5", messages=messages)
                return final.choices[0].message.content

asyncio.run(evaluate_with_kimi("audio_abc123", "Nice to meet you."))`}</CodeBlock>
                <Callout type="tip">
                  Kimi K2.5 原生 <strong>256K 上下文 + Agent 集群协作</strong>，特别适合「多轮口语练习 + 历史分析 + 多步评测编排」场景：
                  把用户过去 30 次评测的完整 JSON 全部塞进 messages，让 K2.5 一次性生成跨多次练习的进步报告与个性化练习路径。
                  需要更深推理时使用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">kimi-k2-thinking</code>，
                  追求实时反馈用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">kimi-k2-turbo-preview</code>。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-doubao" title="豆包 Seed 2.0（火山方舟）">
                <p>
                  字节跳动 <strong>豆包 Seed 2.0</strong>（2026 年 2 月发布）是 ByteDance Seed 团队推出的新一代通用大模型，覆盖 Pro / Lite / Mini / Code 多种规格，
                  通过 <strong>火山方舟（Volcano Ark）</strong> 提供 OpenAI 兼容的 <code className="bg-muted px-1 rounded text-xs font-mono">/api/v3/chat/completions</code> 接口，
                  原生支持 <strong>Function Calling、JSON Schema 结构化输出、深度思考（Chain-of-Thought）模式</strong>，
                  接驰声 MCP 几乎无须改动业务代码。
                </p>

                <Callout type="tip">
                  豆包 Seed 2.0 的优势在 <strong>深度思考 + 工具编排</strong>：让模型一次性规划"先调 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">en.sent.score</code>，看完弱项再调 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">en.word.score</code> 进一步定位音素"，
                  适合做"多步评测 + 自动纠音"这类 Agent 场景。
                  默认开启思考模式，可通过 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">{'thinking: { type: "disabled" }'}</code> 关闭以节省时延。
                </Callout>

                <p className="font-semibold mt-4 mb-2">推荐版本</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">model</th>
                      <th className="text-left py-2 px-3 font-medium">规格</th>
                      <th className="text-left py-2 px-3 font-medium">推荐用途</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-pro-260215</td><td className="py-2 px-3">Pro · 旗舰</td><td className="py-2 px-3">多步评测 + 深度诊断 + 复杂 Agent 编排</td></tr>
                      <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-lite-260215</td><td className="py-2 px-3">Lite · 平衡</td><td className="py-2 px-3">在线辅导单轮评测 + 自然语言反馈，性价比首选</td></tr>
                      <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-mini-260215</td><td className="py-2 px-3">Mini · 极小</td><td className="py-2 px-3">高并发 / 边缘部署 / 移动端实时反馈</td></tr>
                      <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-code-preview-260215</td><td className="py-2 px-3">Code · 预览</td><td className="py-2 px-3">代码生成 / 工具编排 DSL，对评测场景非主推</td></tr>
                      <tr><td className="py-2 px-3 font-mono">doubao-seed-1-8-251228</td><td className="py-2 px-3">1.8 · 深度思考</td><td className="py-2 px-3">支持 reasoning_effort 调档（minimal/low/medium/high），上一代深度思考强化版仍可用</td></tr>
                      <tr><td className="py-2 px-3 font-mono">doubao-seed-1-6-251015</td><td className="py-2 px-3">1.6 · 经典</td><td className="py-2 px-3">256K 上下文经典版，已上线项目可继续沿用</td></tr>
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`# 火山方舟控制台 → API Key 管理
ARK_API_KEY=ak-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">完整示例（Python · 动态 tools + 折返跑）</p>
                <CodeBlock filename="doubao_seed20_chivox.py" lang="python">{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# 火山方舟 OpenAI 兼容端点
client = OpenAI(
    api_key=os.environ["ARK_API_KEY"],
    base_url="https://ark.cn-beijing.volces.com/api/v3",
)

MODEL = "doubao-seed-2-0-pro-260215"   # 也可换成 lite / mini

async def evaluate_with_doubao(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()

            # ① 把驰声 16 个评测工具的 schema 动态注入豆包
            tools = (await mcp.list_tools()).tools
            ark_tools = [{
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": t.description,
                    "parameters": t.inputSchema,
                },
            } for t in tools]

            messages = [
                {"role": "system",
                 "content": "你是一位专业的英语口语教练，会主动调用驰声评测工具获取真实分数。"},
                {"role": "user",
                 "content": f"请评测这段录音，audio_id={audio_id}，参考文本：{ref_text}。"
                            f"先做句子级评测，弱项再追加单词级定位。"},
            ]

            # ② 第一轮 —— 让豆包根据 prompt 自主选工具
            resp = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                tools=ark_tools,
                tool_choice="auto",
                # extra_body={"thinking": {"type": "disabled"}},  # 需要时可关思考
            )

            msg = resp.choices[0].message
            messages.append(msg)

            # ③ 折返跑：豆包可能一次发起多个 tool_calls，全部回填
            for call in (msg.tool_calls or []):
                result = await mcp.call_tool(
                    call.function.name,
                    arguments=json.loads(call.function.arguments),
                )
                messages.append({
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": result.content[0].text,
                })

            # ④ 第二轮 —— 让豆包基于真实评测 JSON 输出诊断 / 练习建议
            final = client.chat.completions.create(
                model=MODEL,
                messages=messages,
            )
            return final.choices[0].message.content

print(asyncio.run(evaluate_with_doubao(
    audio_id="audio_abc123",
    ref_text="The quick brown fox jumps over the lazy dog.",
)))`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">深度思考模式（可选）</p>
                <p className="text-sm text-muted-foreground">
                  豆包 Seed 2.0 默认开启 <strong>thinking</strong> 模式，会在内部生成思维链再产出答案，
                  对"多步评测编排 / 复杂诊断"质量明显更好；但会增加 30%~80% 的端到端延迟。
                  在 <code className="bg-muted px-1 rounded text-xs font-mono">extra_body</code> 里可显式控制：
                </p>
                <CodeBlock filename="thinking_mode.py" lang="python">{`# 关闭思考（更快、适合实时反馈）
client.chat.completions.create(
    model="doubao-seed-2-0-lite-260215",
    messages=messages,
    tools=ark_tools,
    extra_body={"thinking": {"type": "disabled"}},
)

# 开启思考（默认，适合 Pro 模型 + 多步 Agent）
client.chat.completions.create(
    model="doubao-seed-2-0-pro-260215",
    messages=messages,
    tools=ark_tools,
    extra_body={"thinking": {"type": "enabled"}},
)`}</CodeBlock>

                <Callout type="info">
                  <strong>选型建议：</strong>
                  课堂 / 培训类一对一辅导用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">doubao-seed-2-0-lite</code> + 关思考；
                  K12 / 考试场景需要"多题型联动 + 升级建议"时用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">doubao-seed-2-0-pro</code> + 开思考；
                  移动端实时口语对话用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">doubao-seed-2-0-mini</code> 控制成本与时延。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-openai" title="OpenAI（GPT-5.1）">
                <p>
                  OpenAI 当前旗舰为 <strong>GPT-5.1</strong>（2025-11-13 发布），<strong>400K 上下文</strong>、128K 最大输出，
                  支持可调推理强度 <code className="bg-muted px-1 rounded text-xs font-mono">reasoning_effort</code>（none / low / medium / high）。
                  另有 <code className="bg-muted px-1 rounded text-xs font-mono">gpt-5.1-chat-latest</code>（ChatGPT 同款，128K 上下文，对话场景更优）和 <code className="bg-muted px-1 rounded text-xs font-mono">gpt-5-mini</code>（性价比版）。
                  全部模型原生支持 Function Calling 与 Structured Outputs。
                </p>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">完整示例（Python · GPT-5.1 + 驰声 MCP）</p>
                <CodeBlock filename="openai_chivox.py" lang="python">{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

async def evaluate_with_gpt(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()
            tools = (await mcp.list_tools()).tools
            oa_tools = [{"type": "function", "function": {
                "name": t.name,
                "description": t.description,
                "parameters": t.inputSchema,
            }} for t in tools]

            messages = [
                {"role": "system",
                 "content": "你是英语口语教练，必须调用驰声评测工具拿真实分数后再回答。"},
                {"role": "user",
                 "content": f"请评测：audioId={audio_id}，参考文本：{ref_text}"},
            ]

            resp = client.chat.completions.create(
                model="gpt-5.1",
                messages=messages,
                tools=oa_tools,
                tool_choice="auto",
                reasoning_effort="medium",   # GPT-5.1 新参数：none / low / medium / high
            )

            msg = resp.choices[0].message
            messages.append(msg)
            for call in (msg.tool_calls or []):
                result = await mcp.call_tool(
                    call.function.name,
                    arguments=json.loads(call.function.arguments),
                )
                messages.append({
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": result.content[0].text,
                })

            final = client.chat.completions.create(
                model="gpt-5.1", messages=messages)
            return final.choices[0].message.content

print(asyncio.run(evaluate_with_gpt(
    "audio_abc123", "The quick brown fox jumps over the lazy dog.")))`}</CodeBlock>
                <Callout type="tip">
                  <strong>选型建议：</strong>
                  评测调用 + 诊断默认用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gpt-5.1</code>（reasoning_effort=&quot;medium&quot;，质量与延迟平衡）；
                  纯对话/课堂讲解用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gpt-5.1-chat-latest</code>；
                  高并发批量评测降本用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gpt-5-mini</code>。
                  深度推理 / 多步 Agent 编排把 reasoning_effort 调到 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">high</code>。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-claude" title="Claude（Anthropic）">
                <p>
                  Anthropic 当前最新为 <strong>Claude Opus 4.7</strong>（旗舰）、<strong>Claude Sonnet 4.6</strong>（平衡）、<strong>Claude Haiku 4.5</strong>（高速）。
                  Claude 用 <strong>Messages API</strong>（与 OpenAI Chat Completions 不同），工具协议是 <code className="bg-muted px-1 rounded text-xs font-mono">tool_use</code> / <code className="bg-muted px-1 rounded text-xs font-mono">tool_result</code> 块结构。
                  支持文本 + 视觉输入，工具 schema 用 <code className="bg-muted px-1 rounded text-xs font-mono">input_schema</code> 字段（与 OpenAI 的 <code className="bg-muted px-1 rounded text-xs font-mono">parameters</code> 等价）。
                </p>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">完整示例（Python · 原生 Anthropic SDK + MCP 工具桥接）</p>
                <CodeBlock filename="claude_chivox.py" lang="python">{`# pip install anthropic mcp
import os, json, asyncio
from anthropic import Anthropic
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

async def evaluate_with_claude(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()

            # 把驰声 MCP 工具转成 Anthropic 风格（用 input_schema 而非 parameters）
            tools = (await mcp.list_tools()).tools
            anth_tools = [{
                "name": t.name,
                "description": t.description,
                "input_schema": t.inputSchema,
            } for t in tools]

            messages = [{"role": "user",
                         "content": f"请评测这段录音 audioId={audio_id}，参考文本：{ref_text}"}]

            # 工具循环：Claude 可能多轮 tool_use，需逐轮回填
            while True:
                resp = client.messages.create(
                    model="claude-opus-4-7",   # 或 claude-sonnet-4-6 / claude-haiku-4-5
                    max_tokens=2048,
                    tools=anth_tools,
                    messages=messages,
                    system="你是专业英语口语教练，必须调用驰声评测工具获取真实分数。",
                )

                # 把整段助手回复（含 tool_use 块）追加进 messages
                messages.append({"role": "assistant", "content": resp.content})

                if resp.stop_reason != "tool_use":
                    # 没有更多工具调用，输出最终诊断
                    return "".join(b.text for b in resp.content if b.type == "text")

                # 提取所有 tool_use 块、并行执行、把 tool_result 回填给 Claude
                tool_results = []
                for block in resp.content:
                    if block.type == "tool_use":
                        result = await mcp.call_tool(block.name, arguments=block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result.content[0].text,
                        })
                messages.append({"role": "user", "content": tool_results})

print(asyncio.run(evaluate_with_claude(
    "audio_abc123", "The quick brown fox jumps over the lazy dog.")))`}</CodeBlock>
                <Callout type="tip">
                  <strong>选型建议：</strong>
                  深度评测诊断 + 复杂 Agent 编排用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">claude-opus-4-7</code>（旗舰，编程/Agent 提升明显）；
                  日常评测 + 性价比首选 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">claude-sonnet-4-6</code>；
                  高并发实时反馈用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">claude-haiku-4-5</code>。
                  Opus 4.5 起新增 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">effort</code> 参数（low/medium/high），medium 即可达到 Sonnet 4.5 同等质量但 token 减少 ~76%。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-gemini" title="Gemini（Google）">
                <p>
                  Google 最新 <strong>Gemini 3 Flash</strong>（<code className="bg-muted px-1 rounded text-xs font-mono">gemini-3-flash-preview</code>，2025-12-17）以 Flash 价位提供 Pro 级推理；
                  另有 <strong>Gemini 3.1 Pro Preview</strong>（旗舰）、<strong>Gemini 3.1 Flash-Lite Preview</strong>。
                  全部支持 Function Calling、并行调用、组合调用，原生多模态，<code className="bg-muted px-1 rounded text-xs font-mono">thinking_level</code> 控制推理深度。
                  推荐用 <strong>OpenAI 兼容端点</strong>，可直接复用 OpenAI SDK 与已有的 MCP 工具桥接代码。
                </p>

                <p className="font-semibold mt-4 mb-2">环境准备</p>
                <CodeBlock filename=".env" lang="bash">{`GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">方式一：OpenAI 兼容端点（推荐，零迁移成本）</p>
                <CodeBlock filename="gemini_openai_compat.py" lang="python">{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# Gemini OpenAI 兼容端点 —— 完全复用 OpenAI SDK
client = OpenAI(
    api_key=os.environ["GEMINI_API_KEY"],
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

async def evaluate_with_gemini(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()
            tools = (await mcp.list_tools()).tools
            oa_tools = [{"type": "function", "function": {
                "name": t.name,
                "description": t.description,
                "parameters": t.inputSchema,
            }} for t in tools]

            messages = [{"role": "user",
                         "content": f"请评测：audioId={audio_id}，参考文本：{ref_text}"}]

            resp = client.chat.completions.create(
                model="gemini-3-flash-preview",   # 或 gemini-3.1-pro-preview
                messages=messages,
                tools=oa_tools,
                tool_choice="auto",
            )
            msg = resp.choices[0].message
            messages.append(msg)
            for call in (msg.tool_calls or []):
                result = await mcp.call_tool(
                    call.function.name,
                    arguments=json.loads(call.function.arguments),
                )
                messages.append({
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": result.content[0].text,
                })

            final = client.chat.completions.create(
                model="gemini-3-flash-preview", messages=messages)
            return final.choices[0].message.content

print(asyncio.run(evaluate_with_gemini(
    "audio_abc123", "The quick brown fox jumps over the lazy dog.")))`}</CodeBlock>

                <p className="font-semibold mt-4 mb-2">方式二：原生 google-genai SDK（thinking_level / 流式工具调用）</p>
                <CodeBlock filename="gemini_native.py" lang="python">{`# pip install google-genai
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# 把 MCP 工具转成 Gemini function_declarations
fn_decls = [{
    "name": t.name,
    "description": t.description,
    "parameters": t.inputSchema,
} for t in tools]

resp = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=f"评测 audioId={audio_id}，参考文本：{ref_text}",
    config=types.GenerateContentConfig(
        tools=[types.Tool(function_declarations=fn_decls)],
        # Gemini 3 起：thinking_level 替代旧的 thinking_budget
        # thinking_level="high",
    ),
)

# tool_call 在 response.candidates[0].content.parts[0].function_call
fc = resp.candidates[0].content.parts[0].function_call
print(f"call: {fc.name}({dict(fc.args)})  id={fc.id}")`}</CodeBlock>
                <Callout type="tip">
                  <strong>选型建议：</strong>
                  日常评测用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gemini-3-flash-preview</code>（速度比 2.5 Pro 快 3 倍、价格 ~$0.50/M 输入），已是 Gemini App 默认；
                  复杂多步 Agent / 编程任务用 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gemini-3.1-pro-preview</code>；
                  超大上下文 + 多模态批处理用同系列的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gemini-3.1-flash-lite-preview</code>。
                </Callout>
                <Callout type="info">
                  <strong>注意：</strong>Gemini 3 起每次 function_call 自动带 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">id</code>，多轮工具调用必须把 id 透传回 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">function_response</code>，否则会被拒绝（OpenAI 兼容端点已自动处理）。
                </Callout>
              </SubDoc>

              <SubDoc id="llm-comparison" title="模型对比速查">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2 pr-4 font-medium">模型</th>
                        <th className="text-left py-2 pr-4 font-medium">推荐版本</th>
                        <th className="text-left py-2 pr-4 font-medium">base_url</th>
                        <th className="text-left py-2 pr-4 font-medium">Function Calling</th>
                        <th className="text-left py-2 font-medium">适合场景</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="py-2 pr-4 font-medium">DeepSeek V3.2 · 非思考</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">deepseek-chat</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.deepseek.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">评测调用 + 诊断，性价比最高</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">DeepSeek V3.2 · 思考</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">deepseek-reasoner</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.deepseek.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持（思考中可调工具）</td>
                        <td className="py-2">深度分析 + 错因归因 + 个性化练习路径</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">GLM-5 · 旗舰</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-5</code> / <code className="bg-muted px-1 rounded font-mono">glm-5.1</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">open.bigmodel.cn/…/v4</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">200K 长上下文 + Agent 编排，复杂诊断</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">GLM-4.7</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-4.7</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">open.bigmodel.cn/…/v4</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">在线辅导日常诊断，性价比首选</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">GLM-4-Flash</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-4-flash</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">open.bigmodel.cn/…/v4</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">免费额度，开发联调</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Kimi K2.5（旗舰）</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">kimi-k2.5</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.moonshot.cn/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">256K + 多模态 + Agent 集群协作</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Kimi K2 Thinking</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">kimi-k2-thinking</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.moonshot.cn/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">多步推理 + 多轮历史进度报告</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Kimi K2 Turbo</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">kimi-k2-turbo-preview</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.moonshot.cn/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">高速响应版，实时反馈</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">豆包 Seed 2.0 Pro</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">doubao-seed-2-0-pro-260215</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">ark.cn-beijing.volces.com/api/v3</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持（含深度思考）</td>
                        <td className="py-2">多步评测编排 + 深度诊断 Agent</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">豆包 Seed 2.0 Lite</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">doubao-seed-2-0-lite-260215</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">ark.cn-beijing.volces.com/api/v3</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">在线辅导 + 单轮诊断，性价比首选</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">豆包 Seed 2.0 Mini</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">doubao-seed-2-0-mini-260215</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">ark.cn-beijing.volces.com/api/v3</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">移动端 / 边缘部署 / 低延迟实时反馈</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">GPT-5.1（旗舰）</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gpt-5.1</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.openai.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持（reasoning_effort 可调）</td>
                        <td className="py-2">400K 上下文 + 深度推理 + 复杂 Agent 编排</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">GPT-5.1 Chat</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gpt-5.1-chat-latest</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.openai.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">ChatGPT 同款，对话 / 课堂讲解</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">GPT-5 mini</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gpt-5-mini</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.openai.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">高并发 / 批量评测降本</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Claude Opus 4.7</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">claude-opus-4-7</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.anthropic.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持（tool_use 协议）</td>
                        <td className="py-2">旗舰，编程 / Agent / 深度诊断</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Claude Sonnet 4.6</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">claude-sonnet-4-6</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.anthropic.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">日常评测 + 性价比首选</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Claude Haiku 4.5</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">claude-haiku-4-5</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">api.anthropic.com/v1</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持</td>
                        <td className="py-2">高并发实时反馈</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Gemini 3 Flash</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gemini-3-flash-preview</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">…/v1beta/openai/</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持（并行 / 组合）</td>
                        <td className="py-2">Pro 级推理 + Flash 价位，Gemini App 默认</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium">Gemini 3.1 Pro Preview</td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gemini-3.1-pro-preview</code></td>
                        <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">…/v1beta/openai/</code></td>
                        <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">✓ 支持（thinking_level 可调）</td>
                        <td className="py-2">复杂多步 Agent + 编程任务</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Callout type="info">
                  除 <strong>Claude</strong> 用 Anthropic 原生 SDK（<code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">anthropic</code> 包，<code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">tool_use</code> / <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">tool_result</code> 协议）外，其余所有模型均可通过 <strong>OpenAI Python SDK</strong>（<code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">openai</code> 包）调用，仅需替换 <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">base_url</code> 与 <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">api_key</code>，驰声 MCP 侧代码<strong>无需改动</strong>。
                </Callout>
              </SubDoc>

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6 text-sm">
                <p className="font-semibold mb-2">方案选型速查</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border/40">
                      <th className="text-left py-2 font-medium">场景</th>
                      <th className="text-left py-2 font-medium">推荐方案</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2">AI 对话 / Copilot 类产品，LLM 供应商可能会换</td><td className="py-2">① 官方 MCP 客户端库</td></tr>
                      <tr><td className="py-2">已有 LangChain / Mastra / Agents SDK 技术栈</td><td className="py-2">② Agent 框架 + adapter</td></tr>
                      <tr><td className="py-2">火山方舟 / 千帆控制台直连，最小侵入</td><td className="py-2">③ chat.completions + tools</td></tr>
                      <tr><td className="py-2">教育 SaaS / 培训 / 客服等业务后端集成</td><td className="py-2">④ 自研后端 Agent</td></tr>
                      <tr><td className="py-2">原生 Android / iOS / 小程序 / 不装 MCP SDK 的老系统</td><td className="py-2"><a href="#config-rest" className="text-blue-600 dark:text-blue-400 hover:underline">→ 走下一大节「非 MCP REST」</a></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DocSection>

            {/* ══════ 接入 · 非 MCP 原生 REST（cvx_fc） ══════ */}
            <DocSection id="config-rest" icon={Network} title="接入 · 非 MCP 原生 REST（cvx_fc）">

              <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 mb-5 text-sm">
                <p className="font-semibold mb-1.5 flex items-center gap-2"><Network className="h-4 w-4 text-sky-600" /> 这一类接入的共同特征</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>客户端环境<strong className="text-foreground">不能 / 不想引入 MCP SDK</strong>：原生 Android / iOS / Flutter、微信 / 支付宝小程序、老版本 Java / PHP / Go 后端</li>
                  <li>希望把驰声当作<strong className="text-foreground">普通 REST + WebSocket</strong>调，不经过 JSON-RPC、不走 stdio 代理</li>
                  <li>内部代号 <code className="bg-muted px-1 rounded text-xs font-mono">cvx_fc</code>（OpenAI function-calling 风格），与 MCP 模式<strong className="text-foreground">指向同一个评测引擎</strong>，两者为并行入口</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">💡 能走 MCP 的一律优先 MCP；仅当客户端限制无法装 SDK 时走本大节。</p>
              </div>

              <SubDoc id="rest-overview" title="functioncalling 模式总览 · 端点与认证">
                <p>
                  驰声在 MCP 之外提供一套 <strong>OpenAI 兼容的 Function Calling 风格 REST API</strong>（内部代号 <code className="bg-muted px-1 rounded text-xs">cvx_fc</code>）。它和 MCP 模式指向<strong>同一个评测引擎</strong>，但协议层走纯 HTTP / WebSocket，<strong>不依赖任何 MCP SDK</strong>。
                </p>

                <Callout type="info">
                  <strong>与 MCP 模式的关系</strong>：MCP 模式（<code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">POST /mcp</code>，JSON-RPC 2.0）和 functioncalling 模式（<code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">POST /v1/call</code>，REST）是<strong>两个并行入口</strong>，功能等价、工具/函数列表基本一致。
                </Callout>

                <p className="font-semibold mt-6">API 端点</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">方法</th>
                      <th className="text-left py-2 px-3 font-medium">路径</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr><td className="py-2 px-3 font-mono text-xs">GET</td><td className="py-2 px-3 font-mono text-xs">/v1/functions</td><td className="py-2 px-3">列出全部可用评测函数（等价 MCP <code className="bg-muted px-1 rounded text-xs">tools/list</code>）</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">POST</td><td className="py-2 px-3 font-mono text-xs">/v1/call</td><td className="py-2 px-3">调用一个评测函数（等价 MCP <code className="bg-muted px-1 rounded text-xs">tools/call</code>）· 同时用于<strong>创建流式会话</strong>和<strong>拉取流式结果</strong></td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">WS</td><td className="py-2 px-3 font-mono text-xs">{'/ws/eval/{session_id}'}</td><td className="py-2 px-3">流式评测音频传输</td></tr>
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold mt-6">认证</p>
                <p>所有请求在 HTTP Header 中携带 API Key：</p>
                <CodeBlock filename="Header" lang="http">{`Authorization: Bearer <your_api_key>`}</CodeBlock>
                <p className="text-xs text-muted-foreground">认证失败返回 <code className="bg-muted px-1 rounded text-xs">401</code>（缺少 Authorization）或 <code className="bg-muted px-1 rounded text-xs">403</code>（Key 无效 / 无权使用该评测类型）。结构化错误码见 <a href="#error-codes" className="text-blue-600 dark:text-blue-400 hover:underline">API 参考 · 错误码</a>。</p>
              </SubDoc>

              <SubDoc id="rest-catalog" title="函数目录 · GET /v1/functions">
                <p>
                  调用 <code className="bg-muted px-1 rounded text-xs">GET /v1/functions</code> 拿到<strong>当前 API Key 已授权</strong>的全部评测函数列表，响应格式与 OpenAI function-calling 的工具清单一致，可以直接喂给大模型作为 <code className="bg-muted px-1 rounded text-xs">tools</code>：
                </p>
                <CodeBlock filename="request" lang="http">{`GET /v1/functions
Authorization: Bearer <api_key>`}</CodeBlock>
                <CodeBlock filename="response.json" lang="json">{`{
  "object": "list",
  "data": [
    {
      "type": "function",
      "function": {
        "name": "en_word_eval",
        "description": "英文单词发音评测，返回总分和每个音标得分。",
        "parameters": {
          "type": "object",
          "properties": {
            "ref_text":     { "type": "string", "description": "参考文本" },
            "audio_base64": { "type": "string", "description": "Base64 编码音频（与 audio_url 二选一）" },
            "audio_url":    { "type": "string", "description": "音频 HTTP(S) URL（与 audio_base64 二选一）" },
            "accent":       { "type": "number", "description": "1=英式 / 2=美式 / 3=不区分（默认）" },
            "rank":         { "type": "number", "description": "评分制：4 或 100（默认）" }
          },
          "required": ["ref_text"]
        }
      }
    }
    /* … 其它函数依此类推 … */
  ]
}`}</CodeBlock>
                <Callout type="tip">
                  这个端点语义等价于 MCP 的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">tools/list</code>，<strong>每个 API Key 可见的函数集合由后台权限决定</strong>——客户端应以实际返回为准，不要在本地硬编码全量 19 个。
                </Callout>

                <p className="font-semibold mt-6">英文评测函数（10 个）</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">函数名</th>
                      <th className="text-left py-2 px-3 font-medium">core_type</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['en_word_eval',           'en.word.score',  '单词发音评测'],
                        ['en_word_correction',     'en.word.pron',   '单词发音纠错'],
                        ['en_phonics_eval',        'en.nsp.score',   '自然拼读评测'],
                        ['en_sentence_eval',       'en.sent.score',  '句子朗读评测'],
                        ['en_sentence_correction', 'en.sent.pron',   '句子发音纠错'],
                        ['en_vocab_eval',          'en.vocabs.pron', '词汇批量评测'],
                        ['en_paragraph_eval',      'en.pred.score',  '段落朗读评测'],
                        ['en_realtime_eval',       'en.rltm.score',  '实时朗读评测'],
                        ['en_choice_eval',         'en.choc.score',  '口语选择题'],
                        ['en_semi_open_eval',      'en.scne.exam',   '半开放题（情景对话等）'],
                      ].map(([fn, ct, desc]) => (
                        <tr key={fn}>
                          <td className="py-2 px-3 font-mono text-xs">{fn}</td>
                          <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{ct}</td>
                          <td className="py-2 px-3">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold mt-6">中文评测函数（6 个）</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">函数名</th>
                      <th className="text-left py-2 px-3 font-medium">core_type</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['cn_word_pinyin_eval', 'cn.word.score',     '拼音 / 汉字发音评测'],
                        ['cn_word_raw_eval',    'cn.word.raw',       '汉字发音评测'],
                        ['cn_sentence_eval',    'cn.sent.raw',       '句子朗读评测'],
                        ['cn_paragraph_eval',   'cn.pred.raw',       '段落朗读评测'],
                        ['cn_rec_eval',         'cn.rec.raw',        '有限分支识别'],
                        ['cn_aitalk_eval',      'cn.recscore.raw',   '口语表达评测（AI Talk）'],
                      ].map(([fn, ct, desc]) => (
                        <tr key={fn}>
                          <td className="py-2 px-3 font-mono text-xs">{fn}</td>
                          <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{ct}</td>
                          <td className="py-2 px-3">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold mt-6">流式评测函数（3 个）</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">函数名</th>
                      <th className="text-left py-2 px-3 font-medium">作用</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="py-2 px-3 font-mono text-xs">start_stream_eval</td>
                        <td className="py-2 px-3">创建流式评测会话，返回 <code className="bg-muted px-1 rounded text-xs">session_id</code> / <code className="bg-muted px-1 rounded text-xs">ws_url</code> / <code className="bg-muted px-1 rounded text-xs">resume_token</code></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono text-xs">get_stream_result</td>
                        <td className="py-2 px-3">兜底拉取：WS 没拿到 <code className="bg-muted px-1 rounded text-xs">result</code> 时，通过 HTTP 把最终评分捞回来</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono text-xs">stream_eval_result</td>
                        <td className="py-2 px-3 text-muted-foreground">（MCP 模式的别名；cvx_fc 模式统一用 <code className="bg-muted px-1 rounded text-xs">get_stream_result</code>）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  📘 每个函数的<strong>业务语义 / 参数 / 返回字段</strong>与 MCP 模式下的同名工具完全一致，可直接参考下文 <a href="#tools-en" className="text-blue-600 dark:text-blue-400 hover:underline">API 参考 · 英文评测工具</a> 与 <a href="#tools-cn" className="text-blue-600 dark:text-blue-400 hover:underline">中文评测工具</a>。
                </p>
              </SubDoc>

              <SubDoc id="rest-oneshot" title="一次性文件评测">
                <p>把完整音频通过 <code className="bg-muted px-1 rounded text-xs">audio_base64</code> 或 <code className="bg-muted px-1 rounded text-xs">audio_url</code> 二选一传给 <code className="bg-muted px-1 rounded text-xs">/v1/call</code>，同步返回评分（与 MCP 模式的 <code className="bg-muted px-1 rounded text-xs">evaluate_english_word</code> 等工具语义等价）：</p>
                <CodeBlock filename="curl · 英文单词" lang="bash">{`curl -X POST http://your-host:8080/v1/call \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "en_word_eval",
    "arguments": {
      "ref_text": "hello",
      "audio_url": "https://example.com/hello.mp3",
      "accent": 2,
      "rank": 100
    }
  }'`}</CodeBlock>
                <p><strong>成功响应：</strong></p>
                <CodeBlock filename="response.json" lang="json">{`{
  "name": "en_word_eval",
  "result": {
    "overall": 85.5,
    "details": { /* 音素 / 韵律 / 流利度等结构与 MCP 模式完全一致 */ }
  }
}`}</CodeBlock>
                <p><strong>失败响应：</strong></p>
                <CodeBlock filename="error.json" lang="json">{`{
  "name": "en_word_eval",
  "error": { "message": "错误描述" }
}`}</CodeBlock>
                <p className="text-xs text-muted-foreground">单次音频 ≤ 50MB，推荐 16 kHz / 单声道 / 16bit。</p>
              </SubDoc>

              <SubDoc id="rest-streaming" title="流式评测 · 三步骤">
                <div className="rounded-lg border border-border/60 bg-muted/10 p-5 space-y-5 my-3">
                  <FlowStep title="1">
                    <p><strong>创建会话</strong>：<code className="bg-muted px-1 rounded text-xs">POST /v1/call</code> 调用 <code className="bg-muted px-1 rounded text-xs">start_stream_eval</code></p>
                    <p className="text-muted-foreground mt-1">响应中拿到 <code className="bg-muted px-1 rounded text-xs">session_id</code> / <code className="bg-muted px-1 rounded text-xs">ws_url</code> / <code className="bg-muted px-1 rounded text-xs">resume_token</code>。</p>
                  </FlowStep>
                  <FlowStep title="2">
                    <p><strong>WebSocket 推送</strong>：连接 <code className="bg-muted px-1 rounded text-xs">ws_url</code>，收到 <code className="bg-muted px-1 rounded text-xs">{`{"type":"ready"}`}</code> 即可开始发<strong>二进制音频帧</strong>。</p>
                    <p className="text-muted-foreground mt-1">边推边收 <code className="bg-muted px-1 rounded text-xs">intermediate</code> 中间结果；结束时发 <code className="bg-muted px-1 rounded text-xs">{`{"type":"stop"}`}</code>，收到 <code className="bg-muted px-1 rounded text-xs">result</code> 即为最终评分。</p>
                  </FlowStep>
                  <FlowStep title="3">
                    <p><strong>兜底拉取（可选）</strong>：如 WS 断开未收到最终 <code className="bg-muted px-1 rounded text-xs">result</code>，可再次 <code className="bg-muted px-1 rounded text-xs">POST /v1/call</code> 调用 <code className="bg-muted px-1 rounded text-xs">get_stream_result</code> 兜底。</p>
                  </FlowStep>
                </div>

                <p className="font-semibold mt-4"><code>start_stream_eval</code> 参数</p>
                <ParamTable params={[
                  { name: 'core_type', type: 'string', required: true, desc: '评测类型，如 en.sent.score / cn.sent.raw（参考上方中英评测工具表）' },
                  { name: 'ref_text', type: 'string', required: true, desc: '参考文本' },
                  { name: 'audio_type', type: 'string', required: false, desc: '音频格式：pcm / wav / mp3（默认 mp3；流式推荐 pcm 省编解码）' },
                  { name: 'sample_rate', type: 'number', required: false, desc: '采样率，默认 16000' },
                  { name: 'channel', type: 'number', required: false, desc: '声道：1=单声道（默认）/ 2=立体声' },
                  { name: 'sample_bytes', type: 'number', required: false, desc: '采样位深，默认 2（16bit）' },
                  { name: 'accent', type: 'number', required: false, desc: '英文口音：1=英式 / 2=美式 / 3=不区分（默认）' },
                  { name: 'age_group', type: 'string', required: false, desc: '中文人群：adult（默认）/ child' },
                  { name: 'rank', type: 'number', required: false, desc: '评分制：4 或 100（默认）' },
                ]} />

                <p className="font-semibold mt-4">WebSocket 帧协议</p>
                <div className="grid sm:grid-cols-2 gap-3 my-3">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs font-semibold mb-2">客户端 → 服务端</p>
                    <ul className="text-xs space-y-1.5 text-muted-foreground leading-relaxed list-none pl-0">
                      <li>• <code className="bg-muted px-1 rounded">Binary</code> — 原始音频帧，连上即可直接发送，无需握手</li>
                      <li>• <code className="bg-muted px-1 rounded">{`{"type":"stop"}`}</code> — 结束录音</li>
                      <li>• <code className="bg-muted px-1 rounded">{`{"type":"ping"}`}</code> — 心跳</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-xs font-semibold mb-2">服务端 → 客户端</p>
                    <ul className="text-xs space-y-1.5 text-muted-foreground leading-relaxed list-none pl-0">
                      <li>• <code className="bg-muted px-1 rounded">ready</code> — 连接就绪，可开始发送音频</li>
                      <li>• <code className="bg-muted px-1 rounded">intermediate</code> — 实时中间结果</li>
                      <li>• <code className="bg-muted px-1 rounded">result</code> — 最终评测结果</li>
                      <li>• <code className="bg-muted px-1 rounded">backpressure</code> — 背压，含 <code className="bg-muted px-1 rounded">suggested_interval_ms</code>，建议降低发送频率</li>
                      <li>• <code className="bg-muted px-1 rounded">error</code> — 错误（含结构化 <code className="bg-muted px-1 rounded">code</code> + <code className="bg-muted px-1 rounded">message</code>，见<a href="#error-codes" className="underline underline-offset-2">错误码</a>一节）</li>
                      <li>• <code className="bg-muted px-1 rounded">pong</code> — 心跳响应</li>
                    </ul>
                  </div>
                </div>
              </SubDoc>

              <SubDoc id="rest-examples" title="JS / Android 完整示例">
                <p className="font-semibold">JavaScript（浏览器 / Node.js）</p>
                <CodeBlock filename="browser-or-node.js" lang="javascript">{`// ① 创建会话
const resp = await fetch('http://your-host:8080/v1/call', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'start_stream_eval',
    arguments: {
      core_type: 'en.sent.score',
      ref_text: 'Hello world',
      audio_type: 'pcm',
      sample_rate: 16000,
    },
  }),
});
const { result } = await resp.json();

// ② WebSocket 推送音频
const ws = new WebSocket(result.ws_url);
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  switch (msg.type) {
    case 'ready':        startRecording(); break;
    case 'intermediate': console.log('部分结果', msg.data); break;
    case 'result':       console.log('最终结果', msg.data); ws.close(); break;
    case 'backpressure': console.warn('降速 ~', msg.suggested_interval_ms, 'ms'); break;
    case 'error':        console.error(msg.code, msg.message); break;
  }
};

function onAudioChunk(pcm) {
  if (ws.readyState === WebSocket.OPEN) ws.send(pcm); // 直接发二进制
}

function stopRecording() {
  ws.send(JSON.stringify({ type: 'stop' }));
}`}</CodeBlock>

                <p className="font-semibold mt-6">Android（OkHttp · Kotlin）</p>
                <CodeBlock filename="AudioEvalClient.kt" lang="kotlin">{`val wsUrl  = "ws://your-host:8080/ws/eval/$sessionId"
val client = OkHttpClient()
val req    = Request.Builder()
    .url(wsUrl)
    .addHeader("Authorization", "Bearer \${apiKey}")
    .build()

val ws = client.newWebSocket(req, object : WebSocketListener() {
    override fun onMessage(ws: WebSocket, text: String) {
        val msg = JSONObject(text)
        when (msg.getString("type")) {
            "ready"        -> startRecording()
            "intermediate" -> updateUI(msg.getJSONObject("data"))
            "result"       -> handleFinalResult(msg.getJSONObject("data"))
            "error"        -> handleError(msg.getString("code"), msg.getString("message"))
        }
    }
})

// 录音回调中发送 PCM 字节
fun onAudioData(pcm: ByteArray) {
    ws.send(ByteString.of(*pcm))
}

fun stop() {
    ws.send("""{"type":"stop"}""")
}`}</CodeBlock>
                <Callout type="tip">iOS / Flutter / 小程序同理，只要平台提供 WebSocket 客户端即可：连接 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">ws_url</code>、把 PCM bytes 发出去、按 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">type</code> 字段解析服务端消息就行。</Callout>
              </SubDoc>

              <SubDoc id="rest-resume" title="断线恢复 · 兜底拉取">
                <p className="font-semibold">resume_token · 60 秒续播</p>
                <p>
                  客户端意外断开时，会话在服务端<strong>挂起 60 秒</strong>；用创建会话拿到的 <code className="bg-muted px-1 rounded text-xs">resume_token</code> 续播即可：
                </p>
                <CodeBlock filename="reconnect" lang="http">{`GET ws://your-host:8080/ws/eval/{session_id}?resume={resume_token}
Authorization: Bearer <your_api_key>`}</CodeBlock>
                <Callout type="tip">
                  重连成功后会收到新的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">ready</code>，继续推送音频即可；服务端会颁发<strong>新的 resume_token</strong>，原 token 立即作废。
                </Callout>

                <p className="font-semibold mt-6">兜底拉取 · get_stream_result</p>
                <p>如果 WS 没能收到最终 <code className="bg-muted px-1 rounded text-xs">result</code>，可主动通过 HTTP 拉取：</p>
                <CodeBlock filename="fallback-result.sh" lang="bash">{`curl -X POST http://your-host:8080/v1/call \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "get_stream_result",
    "arguments": {
      "session_id": "stream-1713340800-a1b2c3",
      "auto_stop": true,
      "timeout": 30
    }
  }'`}</CodeBlock>
                <ParamTable params={[
                  { name: 'session_id', type: 'string', required: true, desc: '由 start_stream_eval 返回的会话 ID' },
                  { name: 'auto_stop', type: 'bool', required: false, desc: '是否自动发送 stop 并等待结果，默认 true' },
                  { name: 'timeout', type: 'number', required: false, desc: '等待秒数，默认 30' },
                ]} />

                <Callout type="warning">
                  functioncalling 模式与 MCP 模式<strong>二选一、不要混用</strong>：同一个会话不要同时走 MCP 的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/audio/</code> 和 cvx_fc 的 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/eval/</code>，两条链路的会话 ID 空间是分开的。
                </Callout>
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
                  ['en_word_eval', '单词评测', '评测 "Hello" 的发音准确度', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.score'],
                  ['en_word_correction', '单词纠音', '检测多读/漏读/错读并给出纠正建议', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.pron'],
                  ['en_vocab_eval', '词语评测', '同时评测多个单词的发音', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.vocabs.pron'],
                  ['en_sentence_eval', '句子评测', '评测整句朗读的准确度与流利度', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.sent.score'],
                  ['en_sentence_correction', '句子纠音', '逐词检测发音问题并给出修正建议', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.sent.pron'],
                  ['en_paragraph_eval', '段落朗读评测', '评测整段英文课文的朗读质量', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.pred.score'],
                  ['en_phonics_eval', '自然拼读评测', '评测 Phonics 拼读规则掌握程度', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.nsp.score'],
                  ['en_choice_eval', '口语选择题', '从预设选项中识别口语回答', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.choc.score'],
                  ['en_semi_open_eval', '半开放题评测', '场景对话等半开放口语题型', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.scne.exam'],
                  ['en_realtime_eval', '实时朗读评测', '实时反馈朗读质量，逐句评分', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.rltm.score'],
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
                  ['cn_word_raw_eval', '单字评测（汉字）', '评测 "中" 的发音', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.pred.raw'],
                  ['cn_word_pinyin_eval', '单字评测（拼音）', '评测 "zhōng" 的发音', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.pred.pny'],
                  ['cn_sentence_eval', '词句评测', '评测 "你好世界" 的朗读', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.sent.score'],
                  ['cn_paragraph_eval', '段落朗读评测', '评测一段中文课文的朗读质量', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.para.score'],
                  ['cn_rec_eval', '有限分支识别评测', '从预设选项中识别用户发音', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.asr.rec'],
                  ['cn_aitalk_eval', 'AI Talk 口语评测', '中文口语对话能力评测', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.aitalk'],
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
                <p className="font-semibold mb-2">常见业务场景</p>
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

                <p className="font-semibold mt-6 mb-2">HTTP 状态码（functioncalling 模式）</p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">状态码</th>
                      <th className="text-left py-2 px-3 font-medium">含义</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['400', '请求格式错误（JSON 缺字段 / 类型错）'],
                        ['401', '未认证（缺少 Authorization 头）'],
                        ['403', '权限不足（API Key 无效或无权使用该评测类型）'],
                        ['404', '会话不存在（session_id 错误或已回收）'],
                        ['409', '会话状态不允许当前操作（如已 stop 后又发音频）'],
                      ].map(([code, desc]) => (
                        <tr key={code}>
                          <td className="py-2 px-3 font-mono text-xs">{code}</td>
                          <td className="py-2 px-3 text-muted-foreground">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold mt-6 mb-2">流式评测结构化错误码</p>
                <p className="text-xs text-muted-foreground mb-2">
                  WebSocket 的 <code className="bg-muted px-1 rounded">error</code> 帧与 <code className="bg-muted px-1 rounded">get_stream_result</code> 的 HTTP 错误体统一使用以下错误码，便于客户端差错分流：
                </p>
                <div className="overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium">错误码</th>
                      <th className="text-left py-2 px-3 font-medium">说明</th>
                      <th className="text-left py-2 px-3 font-medium">建议处理</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {[
                        ['SESSION_NOT_FOUND', '会话不存在', '重新调用 start_stream_eval / create_stream_session 创建'],
                        ['SESSION_EXPIRED', '会话已过期（60s 未续流）', '重新创建会话'],
                        ['INVALID_STATE', '当前状态不允许该操作', '检查调用顺序（例如已 stop 后又发音频）'],
                        ['INVALID_PARAMS', '参数无效', '核对 core_type / ref_text / 采样率等'],
                        ['RESUME_INVALID', 'resume_token 无效或已过期', '重新创建会话（每次重连会颁发新 token）'],
                        ['AUDIO_TOO_LARGE', '单次音频超过 50MB', '压缩或切片后重传'],
                        ['UPSTREAM_CONNECT', '评测引擎连接失败', '稍后重试；持续发生请联系驰声'],
                        ['UPSTREAM_TIMEOUT', '评测超时', '缩短音频 / 检查网络'],
                        ['UPSTREAM_EVAL_ERROR', '评测引擎返回错误', '查看 message 字段细节'],
                        ['CAPACITY_FULL', '并发会话已满', '退避重试或升级配额'],
                      ].map(([code, desc, fix]) => (
                        <tr key={code}>
                          <td className="py-2 px-3 font-mono text-xs">{code}</td>
                          <td className="py-2 px-3 text-muted-foreground">{desc}</td>
                          <td className="py-2 px-3">{fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SubDoc>
            </DocSection>

            {/* ══════ 最佳实践 ══════ */}
            <DocSection id="best-practices" icon={FileText} title="最佳实践">

              <SubDoc id="prompt-templates" title="Prompt 模板">
                <p className="text-sm text-muted-foreground">
                  下面这些模板与{' '}
                  <Link href="/demo" className="underline underline-offset-2">免费体验</Link>{' '}
                  Demo 中实际使用的「教练 Prompt」一脉相承，全部围绕 <strong>角色 / 任务 / 方法 / 输出格式 / 语气</strong> 五段式结构，并使用占位符{' '}
                  <code className="bg-muted px-1 rounded text-xs font-mono">{'{mcp_response}'}</code> 直接拼接 MCP 工具返回的 JSON。
                  推荐在 <code className="bg-muted px-1 rounded text-xs font-mono">system</code> 消息里挂载，再把工具返回原文塞进
                  <code className="bg-muted px-1 rounded text-xs font-mono">user</code> 消息，由 LLM 基于真实分数和音素生成可读诊断 / 练习材料。
                </p>

                <Callout type="tip">
                  <strong>使用建议：</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>把 MCP 工具调用的完整 JSON（含 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">overall / dp_type / phonemes</code> 等字段）原样塞入 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">{'{mcp_response}'}</code>，不要预先做汇总——细节越完整诊断越具体。</li>
                    <li>「诊断」类模板让 LLM 输出 Markdown 给最终用户阅读；「练习」类模板要求 LLM 输出严格 JSON 给前端渲染。两步分开调用，效果远好于一次性混合。</li>
                    <li>题型决定 prompt：单词题用音素级、句子题加韵律、段落题加 chunk / 整体性，半开放题套四维评级。下面按这 6 类分别给出。</li>
                  </ul>
                </Callout>

                {/* ─── A. 诊断类 · 输出 Markdown 给学习者阅读 ─── */}
                <h4 className="text-sm font-semibold mt-6 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> A. 二次诊断 · 输出 Markdown
                </h4>
                <div className="space-y-4">
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Sparkle className="h-4 w-4" /> 1. 单词级 · 音素诊断
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      适用工具：<code className="bg-muted px-1 rounded font-mono">en.word.score</code> / <code className="bg-muted px-1 rounded font-mono">cn.word.raw</code>。围绕 <code className="bg-muted px-1 rounded font-mono">phonemes[].dp_type</code> 找出错读音。
                    </p>
                    <CodeBlock filename="prompt-word-diagnosis.txt">{`你是一位专业的英语发音教练。下面是驰声 MCP（en.word.score）返回的单词级评测数据：
一个目标词、总分与发音分、以及带有 dp_type 的音素数组。

## 任务
为学习者写一份 **可直接阅读** 的发音诊断，每一条都要引用音素分数（写出 IPA 符号）。

## 方法
- 按 dp_type 分组：先看 mispron，再补充 normal 但分数 < 70 的"边缘音"。
- 每个问题音素：① 典型母语干扰 → ② 你听到的声音 → ③ 一条具体的发音修正动作（下颌 / 舌位 / 气流 / 唇形）。
- 重音符号 ˈ 标记的音节，重音错位也要单独列出（即便音素本身分数尚可）。
- 最多列 4 条，按 **影响力从弱到强** 排序。

## 输出
精简 Markdown：可选一句总结 → 编号列表 → 单行 **🎯 优先级** 排序。

## 语气
友善、具体、可执行，不要空喊"加油"。

## MCP 数据
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> 2. 句子级 · 节奏 + 重音诊断
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      适用工具：<code className="bg-muted px-1 rounded font-mono">en.sent.score</code>。开头先给一行"计分牌"，再从 phones → words → prosody。
                    </p>
                    <CodeBlock filename="prompt-sentence-diagnosis.txt">{`你是一位专业的英语口语教练。下面是驰声 MCP（en.sent.score）返回的句子级数据：refText、总分、发音子分（accuracy / integrity / fluency / rhythm）、可选 speed（WPM），以及 details[] 中的逐词得分、dp_type 与可选 phonemes[]。

## 任务
开头给一行紧凑的 **计分牌**（总分 + 各子分 + 速度），再按 **音素 → 词 → 韵律** 顺序展开诊断。

## 检查清单（每项都要覆盖；不适用则写"无明显问题"）
1. **音素级**：每个 score < 70 或 dp_type ≠ normal 的词，展开 phonemes，命名典型错误（如 /ð/ → /d/）并给一条修正动作。
2. **漏读 / 多读**：标注 dp_type=omit / insert，解释如何拉低 integrity。
3. **韵律**：基于 rhythm + 错读词的重音，指出重音错位、陈述句调型平直、断句过多等。
4. **流利度 vs 准确度**：若 fluency 高但 accuracy 低，明确指出，让学习者知道优先改哪一项。

## 输出格式
Markdown 子标题：**Pronunciation / Prosody / Study priority**（最后一行简短排序，按 ROI 从高到低）。

## MCP 数据
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> 3. 段落级 · 音素族归并 + 完整度
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      适用工具：<code className="bg-muted px-1 rounded font-mono">en.pred.score</code>。把同类错音合并为"音素族"，避免逐词复述。
                    </p>
                    <CodeBlock filename="prompt-paragraph-diagnosis.txt">{`你是一位专业的英语口语教练。下面是驰声 MCP（en.pred.score）返回的段落级数据：长 refText、总分、发音子分、可选 speed / integrity，以及大量 details[]（同一个词可能在不同子句中重复出现；空 char + dp_type=omit 表示漏读）。

## 任务
对整段做 **整体诊断**：
(a) 完整度 / 漏读，
(b) 反复出现的 **音素族**，
(c) 节奏与断句，
(d) 各子分之间是否相互印证。

## 检查清单
1. **integrity / dp_type**：列出每个 omit / insert，并给出所在子句；解释长读时为什么虚词容易被吞。
2. **音素聚类**：将弱词按共同音素问题归族（/θ/ 链、/e/ 链、/ɒ/ 等），引用 details 中的实例。
3. **韵律**：结合 rhythm 与标点 —— 短语内停顿过多？子句边界缺失？
4. **整体一致性**：若 fluency 正常但 accuracy 差（或反之），点明并指出对练习设计的影响。

## 输出格式
Markdown 章节：**Summary / Completeness / Pronunciation (families) / Rhythm / Study priorities**（最后一项最多 4 条，按影响力排序）。

## MCP 数据
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" /> 4. 半开放题 · IELTS 风格四维评级
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      适用工具：<code className="bg-muted px-1 rounded font-mono">en.pqan.score</code>。结合学习者 transcript + 四维分数，给出可教学的"升档建议"。
                    </p>
                    <CodeBlock filename="prompt-semi-open.txt">{`你是一位 **IELTS / 课堂口语风格** 的口语教练。下面是驰声 MCP（en.pqan.score）返回的半开放题数据：题目 refText、学习者 transcript、overall、四个维度分（grammar / content / fluency / pron）、speed（WPM）、以及结构化的 issues[] 标记。

## 任务
给出 **基于 rubric 的诊断**：先用一句话给出 0–100 的整体段位估计，再 **逐维度** 解释，并 **引用 transcript 中的短句**（不要复述全文）。最后给 3–5 条 **可执行的"升档建议"**（句型 / 模板，而不是"多练一点"）。

## 权重（要明确告诉学习者）
- **Content ~30%** — 想法深度、举例、具体程度
- **Grammar ~25%** — 句型多样性、主谓一致、从句
- **Fluency ~25%** — 语速、停顿、口头禅、衔接
- **Pronunciation ~20%** — 音素 + 可懂度

## 跨维度检查
- 若 content 最低，先给"展开模板"，不要先抠音素。
- 若 fluency 低 + WPM 低，区分"思考型停顿"与"发音卡顿"。
- 若 pron 标出特定音，绑定到 transcript 里 **真实出现过的词**。

## 输出格式
Markdown：**段位估计** → 紧凑的 **得分表格** → **"To reach the next band"** 编号列表（每条给出可仿写的句型）。

## MCP 数据
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Languages className="h-4 w-4" /> 5. 中文专项 · 声调 / 儿化 / 变调
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      适用工具：<code className="bg-muted px-1 rounded font-mono">cn.word.raw</code> / <code className="bg-muted px-1 rounded font-mono">cn.sent.raw</code> / <code className="bg-muted px-1 rounded font-mono">cn.pred.raw</code>。中文评测最大权重在 **声调**，必须单独检查。
                    </p>
                    <CodeBlock filename="prompt-mandarin-coach.txt">{`你是一位专业的普通话口语教练。下面是驰声 MCP（cn.sent.raw）返回的中文句子评测数据：整句分数 + 逐字 details + 可选 phonemes + 流利 / 节奏分。

## 中文评测的权重
- **声调错误权重最高** —— 声调读错可能直接改变词义
- dp_type=mispron 多来自：声调错、平翘舌混用、前后鼻音混用
- 拼音对、声调错，听感仍是"洋腔洋调"

## 检查清单（缺则写"无明显问题"）
1. **儿化**：phonemes 出现 r(儿化) 或 dp_type 提示时，确认是否被读成"主音节 + 单独儿"两拍。
2. **轻声**：叠词、词缀、句末语气词 —— 第二字应短促轻读，无完整声调曲线。
3. **变调**：三声连读、不 + 后字、一 + 后字，是否符合普通话规则。
4. **节奏**：用 rhythm + 逗号位置，标记停顿过长或过碎，建议 chunk 边界。

## 输出
Markdown 子标题：**总览 / 儿化 / 轻声 / 变调 / 节奏 / 学习优先级**（最后一项 1–3 条，按"听感自然度提升"排序）。

## MCP 数据
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>
                </div>

                {/* ─── B. 练习类 · 输出 JSON 给前端渲染 ─── */}
                <h4 className="text-sm font-semibold mt-7 mb-3 flex items-center gap-2">
                  <Mic className="h-4 w-4" /> B. 微练习生成 · 输出严格 JSON
                </h4>
                <div className="space-y-4">
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <ListChecks className="h-4 w-4" /> 6. 单词 / 句子 · 微练习
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      建议在 <strong>诊断完成后</strong> 第二轮调用：让 LLM 严格按弱项音素生成，避免"通用绕口令包"。
                    </p>
                    <CodeBlock filename="prompt-micro-drills.txt">{`你仍是这位学习者的发音教练。**第二轮诊断已经完成** —— 现在严格基于诊断里点名的弱音素，生成 **1:1 对应** 的微练习（不要给通用题）。

## 输出（仅返回一段合法 JSON 数组，外层不要任何文字）
根节点必须是数组，每个元素含 category（字符串）、icon（单个 emoji）、items（{ "label", "content" } 数组）。
\`\`\`json
[
  { "category": "Phoneme drills", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Awareness",      "icon": "🗣️", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Whole word",     "icon": "📝", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## 规则
- **Phoneme drills**：诊断里每个 mispron 音素至少给一对最小对立对 + 一句短绕口令 / 重复句。
- **Awareness**：当重音偏弱时，给一条 stress / 舌位 / 下颌姿态提示。
- **Whole word**：2–3 句自然句，目标词分别出现在句首 / 句中 / 句末。
- 所有 content 必须可念出声；字符串内不要再嵌套 JSON。

## 上下文
诊断结论：{previous_diagnosis}
原始 MCP：
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Notebook className="h-4 w-4" /> 7. 段落 · Chunk Map + 元认知
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      段落级练习要从"音素"上升到"短语 / 整段 / 元认知录回放"。直接对应 <code className="bg-muted px-1 rounded font-mono">en.pred.score</code> 的诊断结果。
                    </p>
                    <CodeBlock filename="prompt-paragraph-drills.txt">{`你仍是这位学习者的口语教练。**段落级二次诊断** 已经列出了漏读位置和音素族 —— 现在请生成 **整段练习**：把弱音素串成"族"练习、用 chunk map 把虚词粘回短语，并附一条录音 → 回放 → 对照 MCP details 的元认知步骤。

## 输出（仅返回一段合法 JSON 数组）
\`\`\`json
[
  { "category": "Phoneme families", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Chunking",         "icon": "🎵", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Metacognition",    "icon": "🧠", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## 规则
- **Phoneme families**：至少 3 条，按诊断里的音素族（/θ/、/e/、/ɒ/ 等）组织最小对立对 / 词链。
- **Chunking**：① 给一行用 [ ] 和 / 标注的 chunk map（可加大致停顿秒数）；② 给一句"把漏掉的虚词嵌入短语"的练习（不要孤立练）。
- **Metacognition**：一条"录音 → 回放 → 对照 MCP details"的 N 遍练习（N 写明，2–3 之间）。
- 字符串只能是纯展示文本，禁止嵌套 JSON。

## 上下文
诊断结论：{previous_diagnosis}
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>
                </div>

                {/* ─── C. 跨题 / 运营 ─── */}
                <h4 className="text-sm font-semibold mt-7 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> C. 跨题 / 运营
                </h4>
                <div className="space-y-4">
                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Gauge className="h-4 w-4" /> 8. 多日学习报告
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      把过去 N 天的 MCP 评测结果聚合后丢给 LLM，输出适合发给学生 / 家长的周报。
                    </p>
                    <CodeBlock filename="prompt-weekly-report.txt">{`你是一位英语口语学习顾问。下面是这位学习者过去 7 天的驰声 MCP 评测历史（按时间顺序），每条包含题型、coreType、overall、子分、weak_phonemes 摘要。

## 任务
为学习者生成一份 **周报**，目标读者：本人 + 家长 / 老师。
强调 **趋势** 与 **下一步计划**，不要复述每一次具体分数。

## 必须包含
1. **整体趋势**：进步 / 持平 / 退步（一句话 + 简短依据）
2. **维度变化**：accuracy / fluency / rhythm / integrity / speed 任意有数据的维度，给出"本周均分 vs 上周"
3. **本周高光**：分数提升最大的题型 / 音素 / 句型
4. **顽固问题**：连续 3 次以上未达 70 的音素或维度
5. **下周计划**：3 条具体动作（每条对应一个 MCP 工具或一个练习类型）
6. **结尾**：1–2 句鼓励性总结，避免空话

## 风格
- 像一位认真但不啰嗦的私教
- 出现学生姓名时使用占位 {student_name}
- 数字一律保留整数

## 评测历史
\`\`\`json
{history}
\`\`\``}</CodeBlock>
                  </div>

                  <div className="border border-border/60 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <ListChecks className="h-4 w-4" /> 9. 错误归因 · JSON 摘要
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      用于后端聚合 / 数据看板：让 LLM 把一次评测压缩成结构化摘要，方便入库统计。
                    </p>
                    <CodeBlock filename="prompt-error-summary.txt">{`你是一个评测结果归类器。下面是驰声 MCP 一次评测的完整返回。请抽取关键信息并 **仅返回合法 JSON**（不要任何解释文字）。

## Schema
\`\`\`json
{
  "core_type": "string，例如 en.sent.score",
  "overall": 0,
  "sub_scores": { "accuracy": 0, "integrity": 0, "fluency": 0, "rhythm": 0 },
  "weak_phonemes": [
    { "ipa": "string", "avg_score": 0, "occur": 0, "example_word": "string" }
  ],
  "omissions": [{ "after": "string", "missing": "string" }],
  "stress_issues": [{ "word": "string", "expected": "string", "actual": "string" }],
  "primary_issue_tag": "phoneme|stress|fluency|integrity|content|none",
  "next_action_hint": "string，10 字以内，例如 \"练 /θ/ 对立对\""
}
\`\`\`

## 规则
- weak_phonemes 只收 avg_score < 70 的项，最多 5 项，按 occur 降序。
- 不要复述 refText，不要 markdown。
- 字段缺失时使用 null 或空数组，不要省略 key。

## MCP 数据
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
                  </div>
                </div>

                <Callout type="info">
                  <strong>怎么接到 MCP 工具调用？</strong>
                  <br />
                  以「直调 chat.completions + 动态 tools」为例：第一轮 LLM 调出 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">en.sent.score</code> 工具，把工具 result（即 <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">tool</code> 消息内容）原样填入上面任意「诊断」模板的{' '}
                  <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">{'{mcp_response}'}</code>，作为第二轮 user 消息发回；拿到诊断结论再走第三轮，套「微练习」模板得到 JSON。三轮调用即可串起 <strong>评测 → 诊断 → 练习</strong> 全链路。
                </Callout>
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
                      <tr><td className="py-2 px-3 font-mono text-xs">/upload</td><td className="py-2 px-3">POST</td><td className="py-2 px-3">音频文件上传（MCP 模式文件评测使用）</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">/mcp</td><td className="py-2 px-3">POST</td><td className="py-2 px-3">MCP 模式 · JSON-RPC（Streamable HTTP）</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">{'/ws/audio/{session_id}'}</td><td className="py-2 px-3">WS</td><td className="py-2 px-3">MCP 模式 · 流式音频 WebSocket</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">/v1/functions</td><td className="py-2 px-3">GET</td><td className="py-2 px-3">functioncalling 模式 · 列出全部评测函数</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">/v1/call</td><td className="py-2 px-3">POST</td><td className="py-2 px-3">functioncalling 模式 · 一次性评测 / 创建流式会话 / 拉取流式结果</td></tr>
                      <tr><td className="py-2 px-3 font-mono text-xs">{'/ws/eval/{session_id}'}</td><td className="py-2 px-3">WS</td><td className="py-2 px-3">functioncalling 模式 · 流式音频 WebSocket</td></tr>
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
                <p className="text-xs text-muted-foreground mt-3">
                  上表为托管侧<strong>技术默认</strong>；计费与试用/商用<strong>调用配额、并发档位</strong>以{' '}
                  <Link href="/dashboard/plans" className="text-foreground underline underline-offset-2">
                    会员套餐
                  </Link>
                  说明为准，与上表独立。
                </p>
              </SubDoc>
              <SubDoc id="changelog" title="更新日志">
                <Callout type="info">
                  <strong>当前线上版本：v1.0.0</strong>（网站未正式上线）。以下变更项为开发阶段规划记录，以正式发布公告为准。
                </Callout>
                <div className="space-y-3 mt-4">
                  {[
                    { ver: 'v1.0.0', date: 'TBD', desc: '当前线上版本（网站未正式上线）' },
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

    </DocsShell>
  );
}

export default function DocsPage() {
  const locale = useLocale();
  return locale.startsWith('zh') ? <DocsPageZh /> : <DocsPageEn />;
}
