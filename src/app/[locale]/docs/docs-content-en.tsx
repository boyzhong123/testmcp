'use client';

/**
 * Full English developer documentation (structure & anchor ids mirror the Chinese page).
 */
import { Link } from '@/i18n/routing';
import {
  BookOpen,
  Code2,
  Zap,
  FileText,
  Check,
  Terminal,
  Mic,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  Radio,
  FolderOpen,
  Workflow,
  Sparkles,
  Plug,
  Globe,
  Sparkle,
  Languages,
  GraduationCap,
  Notebook,
  Gauge,
  ListChecks,
} from 'lucide-react';

import {
  CodeBlock,
  DocSection,
  SubDoc,
  ParamTable,
  Callout,
  FlowStep,
  ToolTable,
} from './docs-shared';

export function DocsEnglishBody() {
  const L: 'en' = 'en';
  return (
    <>
      <ConceptSection L={L} />
      <ArchitectureSection L={L} />
      <DocsEnglishBodyRest L={L} />
    </>
  );
}

function ArchitectureSection({ L }: { L: 'en' }) {
  return (
    <DocSection id="architecture" icon={Terminal} title="Architecture">
      <SubDoc id="arch-diagram" title="System diagram">
        <p className="text-sm text-muted-foreground mb-4">
          Desktop assistants talk to a <strong>local proxy</strong> over stdio; the proxy bridges HTTP/WebSocket to the hosted MCP + scoring engine. Remote-only IDEs use Streamable HTTP directly to{' '}
          <code className="bg-muted px-1 rounded text-xs font-mono">/mcp</code> without the local binary.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 my-6">
          <div className="rounded-xl border-2 border-foreground/30 px-6 py-4 text-center min-w-[140px]">
            <p className="text-xs font-semibold mb-1">AI client</p>
            <p className="text-[11px] text-muted-foreground">
              Claude Desktop
              <br />
              Claude Code
              <br />
              Cursor
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">stdio</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 px-6 py-4 text-center min-w-[140px]">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">chivox-local-mcp</p>
            <p className="text-[11px] text-muted-foreground">
              Local proxy
              <br />
              SoX capture
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">HTTP / WS</p>
          </div>
          <div className="rounded-xl border-2 border-foreground/30 px-6 py-4 text-center min-w-[140px]">
            <p className="text-xs font-semibold mb-1">Remote Chivox</p>
            <p className="text-[11px] text-muted-foreground">
              MCP server
              <br />
              Scoring engine
            </p>
          </div>
        </div>
      </SubDoc>
      <SubDoc id="transport" title="Transports">
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
            <span>
              <strong>stdio</strong> — default for Claude Desktop / local proxies; MCP messages framed over stdin/stdout.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
            <span>
              <strong>HTTP</strong> — file uploads and MCP JSON-RPC over Streamable HTTP for IDE and workflow hosts.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
            <span>
              <strong>WebSocket</strong> — streaming microphone audio with automatic reconnect for live sessions.
            </span>
          </li>
        </ul>
      </SubDoc>
    </DocSection>
  );
}

function ConceptSection({ L }: { L: 'en' }) {
  return (
    <DocSection id="concept" icon={Workflow} title="How MCP works">
        <SubDoc id="why-mcp" title="Why MCP">
          <p>
            Large language models (GPT, Claude, Gemini, Qwen, …) are fundamentally <strong>text brains</strong>: they
            excel at reading and writing, but they cannot <strong>hear</strong> audio, <strong>open</strong> your
            database, or <strong>call</strong> third-party APIs on their own.
          </p>
          <p>
            <strong>Model Context Protocol (MCP)</strong> is an open standard (led by Anthropic, adopted across the
            industry). It is like a walkie-talkie: the model can invoke external tools, data sources, and services when
            needed, then continue the conversation with the results.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-semibold">Without MCP</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <li>· Read REST docs for the scoring service</li>
                <li>· Hand-write auth, upload, polling</li>
                <li>· Serialize results into prompts manually</li>
                <li>· Repeat for every new model provider</li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-foreground/60 p-4 bg-foreground/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-foreground" />
                <span className="text-sm font-semibold">With Chivox MCP</span>
              </div>
              <ul className="text-xs space-y-1.5 leading-relaxed">
                <li>· Paste one MCP server URL</li>
                <li>· The model discovers &amp; calls scoring tools</li>
                <li>· Works with any MCP-capable assistant</li>
                <li>· No custom integration code for the happy path</li>
              </ul>
            </div>
          </div>
          <Callout type="info">
            MCP turns “wire up speech scoring” from a backend project into a <strong>configuration task</strong>. That
            is why Cursor, Claude Desktop, Dify, Coze, Doubao, Feishu assistants, and others ship MCP support.
          </Callout>
        </SubDoc>

        <SubDoc id="scenario-walkthrough" title="Scenario walkthrough · six steps">
          <p>
            Picture an <strong>IELTS speaking coach mini-app</strong> built on Claude with Chivox MCP. When a user sends
            a recording, the flow looks like this:
          </p>
          <div className="rounded-lg border border-border/60 bg-muted/20 p-5 my-4 space-y-5">
            <FlowStep title="1">
              <p>
                <strong className="text-foreground">Configure once</strong> (developer)
              </p>
              <p className="text-muted-foreground mt-1">
                Add the Chivox MCP server URL. On startup the model learns there is a new <strong>speech evaluation</strong>{' '}
                tool.
              </p>
            </FlowStep>
            <FlowStep title="2">
              <p>
                <strong className="text-foreground">User message</strong>
              </p>
              <p className="text-muted-foreground mt-1">
                The user uploads a self-introduction clip and asks: “Where is my pronunciation weak?” The backend
                forwards text + audio reference to the model.
              </p>
            </FlowStep>
            <FlowStep title="3">
              <p>
                <strong className="text-foreground">Model reasoning</strong>
              </p>
              <div className="text-muted-foreground mt-1 rounded-md bg-background/80 border border-border/40 px-3 py-2 text-xs leading-relaxed">
                “The user wants pronunciation feedback.”
                <br />
                “I cannot hear audio directly.”
                <br />
                “I have an MCP tool named <code className="bg-muted px-1 rounded">chivox_voice_eval</code>.”
              </div>
            </FlowStep>
            <FlowStep title="4">
              <p>
                <strong className="text-foreground">MCP tool call</strong>
              </p>
              <p className="text-muted-foreground mt-1">
                The model issues a standard <code className="bg-muted px-1 rounded text-xs font-mono">tools/call</code>{' '}
                with the audio reference and reference text. <span className="text-foreground">You do not hand-write RPC code.</span>
              </p>
            </FlowStep>
            <FlowStep title="5">
              <p>
                <strong className="text-foreground">Chivox scoring</strong>
              </p>
              <p className="text-muted-foreground mt-1">
                The engine returns structured scores: overall, phoneme issues, fluency, and more — back through MCP.
              </p>
            </FlowStep>
            <FlowStep title="6">
              <p>
                <strong className="text-foreground">Natural-language feedback</strong>
              </p>
              <p className="text-muted-foreground mt-1">The model turns numbers into coaching text for the learner.</p>
            </FlowStep>
          </div>
          <Callout type="tip">
            MCP matters at <strong>① configuration</strong> and <strong>④ automatic invocation</strong>: expose tools
            once, call them through a standard protocol.
          </Callout>
        </SubDoc>

        <SubDoc id="dev-responsibility" title="Two jobs for developers">
          <p>In practice you only need to:</p>
          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-lg border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-sm font-semibold">Configure MCP once</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Add server URL and API key. New scoring capabilities appear without redeploying your app.
              </p>
              <CodeBlock filename="mcp-config.json" lang="json" locale={L}>{`{
  "chivox_voice_eval": {
    "type": "streamable-http",
    "url": "https://speech-eval.site/mcp",
    "apiKey": "sk-••••••••••"
  }
}`}</CodeBlock>
            </div>
            <div className="rounded-lg border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-sm font-semibold">Write system guidance</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Tell the model what the tool does, when to call it, and how to phrase feedback for users.
              </p>
              <CodeBlock filename="system-prompt.md" locale={L}>{`You are an English speaking coach.
When the user sends audio:
1. Call chivox_voice_eval
2. Focus on phoneme families below 70
3. Give kind, actionable drills`}</CodeBlock>
            </div>
          </div>
          <p className="text-muted-foreground">
            Uploads, auth, discovery, invocation timing, and response shaping are handled by MCP runtimes and the model —
            not bespoke glue code for every integration.
          </p>
        </SubDoc>

        <SubDoc id="integration-paths" title="Three equivalent integration styles">
          <p>Pick the path that matches your stack. Under the hood everything speaks the same MCP protocol.</p>

          <div className="rounded-lg border border-border/60 p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-foreground" />
              <h4 className="text-sm font-semibold">1 · No-code consoles (Coze, Feishu, …)</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Best for PMs and operators. Add an MCP server in the platform UI, paste URL + key, test in chat.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-1 text-sm">
              <li>Open the MCP / extensions panel.</li>
              <li>
                Create a Streamable HTTP endpoint:
                <div className="mt-2 overflow-x-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="py-2 px-3 font-medium w-36">URL</td>
                        <td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">API key</td>
                        <td className="py-2 px-3 font-mono text-xs">
                          sk-•••••••••• <span className="text-muted-foreground ml-2">(billing / tenant id)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
              <li>The console pulls <code className="bg-muted px-1 rounded text-xs">tools/list</code> and exposes tools to the bot.</li>
            </ol>
          </div>

          <div className="rounded-lg border border-border/60 p-5 mt-3">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="h-4 w-4 text-foreground" />
              <h4 className="text-sm font-semibold">2 · IDE / agent frameworks</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Add a block to <code className="bg-muted px-1 rounded text-xs font-mono">mcp.json</code> (or equivalent) so
              Cursor, Claude Code, Dify, LangChain, etc. load tools at startup.
            </p>
            <CodeBlock filename="mcp.json" lang="json" locale={L}>{`{
  "mcpServers": {
    "chivox_voice_eval": {
      "type": "streamable-http",
      "url": "https://speech-eval.site/mcp",
      "env": { "API_KEY": "your-key" }
    }
  }
}`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-border/60 p-5 mt-3">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="h-4 w-4 text-foreground" />
              <h4 className="text-sm font-semibold">3 · Function calling with MCP discovery</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              For OpenAI-compatible APIs (Doubao, DeepSeek, GPT, Qwen, …), fetch tool schemas from MCP instead of
              hand-maintaining JSON Schema for all <strong>16 tools</strong> (10 English + 6 Chinese).
            </p>
            <Callout type="warning">
              Coze / Dify / Claude Desktop usually auto-import tools. For raw <code className="bg-muted px-1 rounded text-xs">chat.completions</code>, prefer{' '}
              <strong>MCP list_tools → OpenAI tools[]</strong> instead of maintaining schemas by hand.
            </Callout>
            <CodeBlock filename="3b_mcp_autodiscover.py" lang="python" locale={L}>{`import asyncio, os
from openai import AsyncOpenAI
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

client = AsyncOpenAI(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.getenv("ARK_API_KEY"),
)

async def main():
    async with streamablehttp_client(
        "https://speech-eval.site/mcp",
        headers={"Authorization": f"Bearer {os.getenv('CHIVOX_KEY')}"},
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            mcp_tools = (await session.list_tools()).tools

            tools = [{
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": t.description,
                    "parameters": t.inputSchema,
                }
            } for t in mcp_tools]

            resp = await client.chat.completions.create(
                model="ep-xxx-doubao-tools",
                messages=[
                    {"role": "system", "content": "You are a coach; give gentle feedback."},
                    {"role": "user", "content": "Score my Apple clip: https://demo.com/u1.mp3"},
                ],
                tools=tools,
                tool_choice="auto",
            )
            # execute tool_calls via session.call_tool, then second LLM pass…

asyncio.run(main())`}</CodeBlock>
            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
              Use the official{' '}
              <a href="https://github.com/modelcontextprotocol/python-sdk" className="underline underline-offset-2" target="_blank" rel="noreferrer">
                MCP Python SDK
              </a>
              , <code className="bg-muted px-1 rounded text-xs">mcp-use</code>, or vendor SDKs that wrap the same bridge.
            </p>
          </div>

          <Callout type="info">
            All three paths are capability-equivalent. Choose <strong>①</strong> for fastest demos, <strong>②</strong> for
            desktop assistants, <strong>③-B (dynamic tools)</strong> for production backends talking to OpenAI-compatible APIs.
          </Callout>
        </SubDoc>
    </DocSection>
  );
}

function DocsEnglishBodyRest({ L }: { L: 'en' }) {
  return (
    <>
      <DocSection id="quick-start" icon={Zap} title="Quick start">
        <SubDoc id="overview" title="Overview">
          <p>
            <strong>chivox-local-mcp</strong> is a local MCP proxy for Chivox speech scoring. It bridges the hosted
            scoring service to assistants such as Claude Desktop, Claude Code, and Cursor via{' '}
            <a
              href="https://modelcontextprotocol.io/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Model Context Protocol
            </a>
            .
          </p>
          <p>Two evaluation modes cover interactive and batch workflows:</p>
          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-foreground" />
                <span className="text-sm font-semibold">Streaming microphone</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Audio flows over WebSocket while you speak — no intermediate file, lowest latency for tutoring UX.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="h-4 w-4 text-foreground" />
                <span className="text-sm font-semibold">File upload</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Local path, Base64, or URL — ideal for batch jobs and async pipelines.
              </p>
            </div>
          </div>
          <Callout type="info">
            The public catalog includes <strong>16 tools</strong>: 10 English tasks (word, sentence, paragraph, correction,
            phonics, multiple-choice, semi-open, realtime, …) and 6 Chinese tasks (character, pinyin, sentence, paragraph,
            constrained recognition, AI Talk).
          </Callout>
        </SubDoc>

        <SubDoc id="requirements" title="Requirements">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left py-2 px-3 font-medium">Dependency</th>
                  <th className="text-left py-2 px-3 font-medium">Version</th>
                  <th className="text-left py-2 px-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-2 px-3 font-semibold">Node.js</td>
                  <td className="py-2 px-3 font-mono text-xs">{'>='} 18</td>
                  <td className="py-2 px-3 text-muted-foreground">Required at runtime</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">SoX</td>
                  <td className="py-2 px-3 font-mono text-xs">any</td>
                  <td className="py-2 px-3 text-muted-foreground">Only for live microphone capture</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">Install SoX when you need streaming capture:</p>
          <CodeBlock filename="Terminal" lang="bash" locale={L}>{`# macOS
brew install sox

# Ubuntu / Debian
sudo apt-get install sox`}</CodeBlock>
        </SubDoc>

        <SubDoc id="install" title="Install">
          <p>
            <strong>Option A — global npm</strong> (recommended)
          </p>
          <CodeBlock filename="Terminal" lang="bash" locale={L}>{`npm install -g chivox-local-mcp`}</CodeBlock>
          <p>
            <strong>Option B — npx</strong>
          </p>
          <CodeBlock filename="Terminal" lang="bash" locale={L}>{`MCP_REMOTE_URL=http://your-server:8080 npx chivox-local-mcp`}</CodeBlock>
          <p>
            <strong>Option C — build from source</strong>
          </p>
          <CodeBlock filename="Terminal" lang="bash" locale={L}>{`git clone https://git.chivox.com/CLOUD_DEV/cvx_local_mcp.git
cd cvx_local_mcp
bash scripts/build.sh`}</CodeBlock>
        </SubDoc>

        <SubDoc id="env-vars" title="Environment variables">
          <ParamTable
            locale="en"
            params={[
              {
                name: 'MCP_REMOTE_URL',
                type: 'string',
                required: true,
                desc: 'Remote Chivox MCP endpoint, e.g. http://your-server:8080',
              },
              {
                name: 'MCP_API_KEY',
                type: 'string',
                required: false,
                desc: 'API key when the deployment enforces authentication',
              },
            ]}
          />
        </SubDoc>
      </DocSection>

      <DocSection id="config" icon={Plug} title="Zero-code clients (paste MCP config)">
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mb-5 text-sm">
          <p className="font-semibold mb-1.5 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> What these setups share
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>No SDK import — paste JSON / URL into the client&apos;s MCP panel.</li>
            <li>After saving, the LLM discovers all scoring tools automatically.</li>
            <li>
              Covers <strong className="text-foreground">IDE copilots</strong>, <strong className="text-foreground">desktop assistants</strong>,{' '}
              <strong className="text-foreground">enterprise AI workspaces</strong>, and <strong className="text-foreground">workflow builders</strong>.
            </li>
          </ul>
        </div>

        <SubDoc id="config-cursor" title="Cursor">
          <ol className="list-decimal list-inside space-y-2 ml-1">
            <li>
              Open Cursor settings (<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Cmd + ,</kbd>)
            </li>
            <li>
              Choose <strong>MCP</strong>
            </li>
            <li>
              Click <strong>Add new MCP server</strong>
            </li>
          </ol>
          <CodeBlock filename="Cursor MCP" lang="json" locale={L}>{`{
  "name": "chivox-speech-eval",
  "type": "streamable-http",
  "url": "https://speech-eval.site/mcp"
}`}</CodeBlock>
          <Callout type="tip">
            Cursor uses remote Streamable HTTP — no local binary. For microphone streaming, run the local proxy via Claude
            Desktop instead.
          </Callout>
        </SubDoc>

        <SubDoc id="config-claude-desktop" title="Claude Desktop">
          <p>
            Edit{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">
              ~/Library/Application Support/Claude/claude_desktop_config.json
            </code>{' '}
            on macOS:
          </p>
          <CodeBlock filename="claude_desktop_config.json" lang="json" locale={L}>{`{
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
          <Callout type="info">
            Claude Desktop uses stdio to talk to the local proxy, which bridges streaming audio to the remote engine.
          </Callout>
        </SubDoc>

        <SubDoc id="config-claude-code" title="Claude Code">
          <CodeBlock filename="Terminal" lang="bash" locale={L}>{`claude mcp add chivox -- env MCP_REMOTE_URL=http://your-server:8080 chivox-local-mcp`}</CodeBlock>
        </SubDoc>

        <SubDoc id="config-ai-ide" title="Windsurf / Zed / Continue">
          <p>Use the same Streamable HTTP JSON as Cursor; only the settings location differs.</p>
          <CodeBlock filename="mcp.json" lang="json" locale={L}>{`{
  "mcpServers": {
    "chivox-speech-eval": {
      "type": "streamable-http",
      "url": "https://speech-eval.site/mcp"
    }
  }
}`}</CodeBlock>
        </SubDoc>

        <SubDoc id="config-coze" title="Coze">
          <p>
            In <a href="https://www.coze.cn/" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer">Coze</a>, add a custom MCP extension with transport <code className="bg-muted px-1 rounded text-xs">streamable-http</code> and URL{' '}
            <code className="bg-muted px-1 rounded text-xs">https://speech-eval.site/mcp</code>. After saving, bots can call scoring tools from prompts.
          </p>
        </SubDoc>

        <SubDoc id="config-coze-workflow" title="Coze workflows">
          <p>
            Use an HTTP node to POST audio to <code className="bg-muted px-1 rounded text-xs">https://speech-eval.site/upload</code>, then call MCP JSON-RPC with the returned{' '}
            <code className="bg-muted px-1 rounded text-xs">audioId</code>.
          </p>
        </SubDoc>

        <SubDoc id="config-ai-workspace" title="Enterprise AI workspaces">
          <p>
            Doubao, Feishu My AI, DingTalk assistants, and similar products expose MCP or OpenAPI bridges. Register{' '}
            <code className="bg-muted px-1 rounded text-xs">https://speech-eval.site/mcp</code> in the admin console, map it to a skill, and publish to your org.
          </p>
        </SubDoc>

        <SubDoc id="config-workflow-platforms" title="Dify / n8n / Flowise">
          <p>
            Add an MCP client node, point it at the same URL, and drag tool calls into LangChain / n8n graphs for batch scoring + reporting.
          </p>
        </SubDoc>

        <SubDoc id="config-other" title="Other MCP clients">
          <p>Any MCP-compatible host can use:</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left py-2 px-3 font-medium">Field</th>
                  <th className="text-left py-2 px-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-3 font-medium">Transport</td>
                  <td className="py-2 px-3 font-mono text-xs">streamable-http</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">URL</td>
                  <td className="py-2 px-3 font-mono text-xs">https://speech-eval.site/mcp</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Auth (optional)</td>
                  <td className="py-2 px-3 font-mono text-xs">Authorization: Bearer &lt;MCP_API_KEY&gt;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubDoc>
      </DocSection>

      <DocSection id="config-code" icon={Code2} title="Programmatic integration (SDKs & code)">
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mb-5 text-sm">
          <p className="font-semibold mb-1.5 flex items-center gap-2">
            <Terminal className="h-4 w-4" /> Typical traits
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>You own a backend service, worker, or script.</li>
            <li>Your code decides when to call scoring and how to interpret JSON.</li>
            <li>Preferred paths: official MCP SDK → agent adapters → raw chat.completions with dynamic tools.</li>
            <li>
              The catalog exposes <strong className="text-foreground">16 tools</strong> total — always hydrate definitions via{' '}
              <code className="bg-muted px-1 rounded text-xs font-mono">list_tools</code>, never copy-paste sixteen schemas by hand.
            </li>
          </ul>
        </div>

        <SubDoc id="code-mcp-sdk" title="Official MCP client (Python / TypeScript)">
          <p>
            Connect once, call <code className="bg-muted px-1 rounded text-xs">list_tools</code>, forward schemas to any LLM. Example (Python):
          </p>
          <CodeBlock filename="chivox_client.py" lang="python" locale={L}>{`# pip install mcp openai
import asyncio, os
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

MCP_URL = "https://speech-eval.site/mcp"
llm = OpenAI(api_key=os.getenv("DOUBAO_KEY"),
             base_url="https://ark.cn-beijing.volces.com/api/v3")

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
                           "content": f"Score audioId={audio_id}, reference: {ref}"}],
                tools=openai_tools,
            )
            # handle tool_calls → sess.call_tool → second LLM pass

asyncio.run(main("abc123", "I think therefore I am"))`}</CodeBlock>
        </SubDoc>

        <SubDoc id="code-agent-frameworks" title="LangChain / Mastra / Agents SDK">
          <p>
            Point any MCP-aware adapter at <code className="bg-muted px-1 rounded text-xs">https://speech-eval.site/mcp</code> (Streamable HTTP). The framework keeps the tool loop: discovery →{' '}
            <code className="bg-muted px-1 rounded text-xs">tool_calls</code> → execution → follow-up messages.
          </p>
          <div className="grid gap-3 md:grid-cols-2 mt-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2">LangChain / LangGraph</p>
              <CodeBlock filename="agent.py" lang="python" locale={L}>{`# pip install langchain-mcp-adapters langgraph
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
    [("user", "Score audioId=abc123 ref: think")]})
print(result["messages"][-1].content)`}</CodeBlock>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2">Mastra</p>
              <CodeBlock filename="mastra-agent.ts" lang="typescript" locale={L}>{`import { MCPClient } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const mcp = new MCPClient({ servers: {
  chivox: { url: new URL("https://speech-eval.site/mcp") }
}});

export const speechCoach = new Agent({
  name: "speech-coach",
  instructions: "Use Chivox tools to score speech and give feedback.",
  model: openai("gpt-4o-mini"),
  tools: await mcp.getTools(),
});`}</CodeBlock>
            </div>
            <div className="rounded-lg border border-border/60 p-4 md:col-span-2">
              <p className="font-semibold text-sm mb-2">OpenAI Agents SDK (Python)</p>
              <CodeBlock filename="agents_sdk.py" lang="python" locale={L}>{`# pip install openai-agents
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

chivox = MCPServerStreamableHttp(
    params={"url": "https://speech-eval.site/mcp"},
    name="chivox-speech-eval",
)

async with chivox:
    agent = Agent(name="coach",
                  instructions="Professional speaking coach",
                  mcp_servers=[chivox])
    r = await Runner.run(agent, "Score audioId=abc123")
    print(r.final_output)`}</CodeBlock>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            LlamaIndex (<code className="bg-muted px-1 rounded text-[10px]">llama-index-tools-mcp</code>), AutoGen, CrewAI, and Spring AI ship similar bridges — same URL, same <strong>16 tools</strong> (10 English + 6 Chinese).
          </p>
        </SubDoc>

        <SubDoc id="code-function-calling" title="chat.completions · upload & dynamic tools">
          <p>
            Vendors such as DeepSeek, Zhipu GLM, Moonshot KIMI, Doubao (Volcengine), Qwen, and Baidu expose <strong>OpenAI-compatible</strong> endpoints. The flow is always:{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">list_tools</code> → map to OpenAI <code className="bg-muted px-1 rounded text-xs font-mono">tools</code> → model returns{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">tool_calls</code> → <code className="bg-muted px-1 rounded text-xs font-mono">call_tool</code> → feed results back for a second completion.
          </p>
          <div className="rounded-lg bg-muted/30 p-5 my-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">① list_tools</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">② map to tools[]</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 font-medium">③ tool_calls</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">④ call_tool</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">⑤ coaching text</span>
            </div>
          </div>
          <Callout type="tip">Swap only <code className="bg-muted px-1 rounded text-xs font-mono">base_url</code> and API keys — Chivox MCP code stays identical.</Callout>

          <p className="font-semibold mt-6">Upload audio and obtain audioId</p>
          <p className="text-sm text-muted-foreground mb-3">Most scoring tools expect an uploaded clip reference. Minimal HTTP upload:</p>
          <CodeBlock filename="upload.py" lang="python" locale={L}>{`import requests

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
          <CodeBlock filename="upload.js" lang="javascript" locale={L}>{`const fs = require('fs');
const audioData = fs.readFileSync('audio.mp3');
const res = await fetch('https://speech-eval.site/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'audio/mp3' },
  body: audioData,
});
const result = await res.json();
console.log('audioId:', result.audioId);`}</CodeBlock>

          <p className="font-semibold mt-6">Example: Doubao + MCP tool loop</p>
          <p className="text-sm text-muted-foreground mb-3">
            When the hosted LLM has no native MCP runtime, pull schemas once and pass them through <code className="bg-muted px-1 rounded text-xs font-mono">chat.completions</code>.
          </p>
          <CodeBlock filename="doubao_tools.py" lang="python" locale={L}>{`# Doubao / DeepSeek / Qwen / Moonshot / GLM — OpenAI-compatible
import json
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession
# doubao = OpenAI(base_url="https://ark.cn-beijing.volces.com/api/v3", api_key=os.getenv("ARK_API_KEY"))

async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
    async with ClientSession(r, w) as mcp:
        await mcp.initialize()
        tools = (await mcp.list_tools()).tools
        oa_tools = [{"type": "function", "function": {
            "name": t.name,
            "description": t.description,
            "parameters": t.inputSchema,
        }} for t in tools]
        messages = [{"role": "user", "content": "Score audioId=abc123"}]
        resp = doubao.chat.completions.create(
            model="doubao-1-5-pro-32k", messages=messages, tools=oa_tools,
        )
        msg = resp.choices[0].message
        if msg.tool_calls:
            messages.append(msg)
            for c in msg.tool_calls:
                result = await mcp.call_tool(
                    c.function.name, arguments=json.loads(c.function.arguments))
                messages.append({"role": "tool", "tool_call_id": c.id,
                                 "content": result.content[0].text})
            final = doubao.chat.completions.create(
                model="doubao-1-5-pro-32k", messages=messages)
            print(final.choices[0].message.content)`}</CodeBlock>
          <Callout type="warning">
            Never hand-author all <strong>16 tool</strong> schemas (10 English + 6 Chinese). Always hydrate from{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">list_tools()</code>.
          </Callout>
        </SubDoc>

        <SubDoc id="llm-deepseek" title="DeepSeek">
          <p>
            Use <code className="bg-muted px-1 rounded text-xs font-mono">deepseek-chat</code> (V3) for tool calling;{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">deepseek-reasoner</code> (R1) has no function-calling — chain V3 for tools, then R1 for analysis if needed.
          </p>
          <CodeBlock filename="deepseek_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com",
)

async def run(audio_id: str, ref_text: str):
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
                f"Score this clip audioId={audio_id}, reference: {ref_text}"}]
            resp = client.chat.completions.create(
                model="deepseek-chat", messages=messages, tools=oa_tools)
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
                    model="deepseek-chat", messages=messages)
                return final.choices[0].message.content

asyncio.run(run("audio_abc123", "Hello, nice to meet you."))`}</CodeBlock>
        </SubDoc>

        <SubDoc id="llm-glm" title="GLM (Zhipu)">
          <p>OpenAI-compatible base URL: <code className="bg-muted px-1 rounded text-xs font-mono">https://open.bigmodel.cn/api/paas/v4/</code></p>
          <CodeBlock filename="glm_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(
    api_key=os.environ["ZHIPU_API_KEY"],
    base_url="https://open.bigmodel.cn/api/paas/v4/",
)

async def run(audio_id: str, ref_text: str):
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
                f"Score audioId={audio_id}, reference: {ref_text}"}]
            resp = client.chat.completions.create(
                model="glm-4-flash", messages=messages, tools=oa_tools)
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

asyncio.run(run("audio_abc123", "How are you today?"))`}</CodeBlock>
        </SubDoc>

        <SubDoc id="llm-kimi" title="KIMI (Moonshot)">
          <p>
            Base URL <code className="bg-muted px-1 rounded text-xs font-mono">https://api.moonshot.cn/v1</code> — pick 8k / 32k / 128k models for long coaching histories.
          </p>
          <CodeBlock filename="kimi_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(
    api_key=os.environ["MOONSHOT_API_KEY"],
    base_url="https://api.moonshot.cn/v1",
)

async def run(audio_id: str, ref_text: str):
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
                f"Score English audioId={audio_id}, reference: {ref_text}"}]
            resp = client.chat.completions.create(
                model="moonshot-v1-8k", messages=messages, tools=oa_tools)
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
                    model="moonshot-v1-8k", messages=messages)
                return final.choices[0].message.content

asyncio.run(run("audio_abc123", "Nice to meet you."))`}</CodeBlock>
        </SubDoc>

        <SubDoc id="llm-doubao" title="Doubao Seed 2.0 (Volcano Ark)">
          <p>
            ByteDance&apos;s <strong>Doubao Seed 2.0</strong> family (released Feb 2026) ships Pro / Lite / Mini / Code variants on <strong>Volcano Ark</strong>, all behind an OpenAI-compatible{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">/api/v3/chat/completions</code> endpoint with native <strong>function calling, JSON Schema structured output, and chain-of-thought thinking mode</strong>.
            Plugging it into Chivox MCP follows the exact same dynamic-tools pattern as DeepSeek / GLM / KIMI.
          </p>

          <Callout type="tip">
            Seed 2.0 shines at <strong>multi-step tool orchestration</strong>: the model can plan &quot;first call <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">en.sent.score</code>, then drill weak words with <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">en.word.score</code>&quot; in a single turn — a great fit for &quot;evaluate → diagnose → re-test&quot; agent loops.
            Thinking mode is on by default; disable it with <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">{'thinking: { type: "disabled" }'}</code> when latency matters.
          </Callout>

          <p className="font-semibold mt-4 mb-2">Recommended variants</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">model id</th>
                <th className="text-left py-2 px-3 font-medium">tier</th>
                <th className="text-left py-2 px-3 font-medium">use case</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-pro-260215</td><td className="py-2 px-3">Pro · flagship</td><td className="py-2 px-3">Multi-step evaluation orchestration + deep diagnosis agents</td></tr>
                <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-lite-260215</td><td className="py-2 px-3">Lite · balanced</td><td className="py-2 px-3">Online tutoring single-turn diagnosis — best price / quality</td></tr>
                <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-mini-260215</td><td className="py-2 px-3">Mini · compact</td><td className="py-2 px-3">High-concurrency / mobile / edge — low-latency feedback</td></tr>
                <tr><td className="py-2 px-3 font-mono">doubao-seed-2-0-code-preview-260215</td><td className="py-2 px-3">Code · preview</td><td className="py-2 px-3">Code generation / tool DSL — not the primary speech pick</td></tr>
              </tbody>
            </table>
          </div>

          <p className="font-semibold mt-4 mb-2">Environment</p>
          <CodeBlock filename=".env" lang="bash" locale={L}>{`# Volcano Ark console → API key management
ARK_API_KEY=ak-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

          <p className="font-semibold mt-4 mb-2">Full example (Python · dynamic tools + tool-call loop)</p>
          <CodeBlock filename="doubao_seed20_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# Volcano Ark OpenAI-compatible endpoint
client = OpenAI(
    api_key=os.environ["ARK_API_KEY"],
    base_url="https://ark.cn-beijing.volces.com/api/v3",
)

MODEL = "doubao-seed-2-0-pro-260215"   # or lite / mini

async def evaluate_with_doubao(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()

            # 1. Inject all 16 Chivox tool schemas dynamically
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
                 "content": "You are a professional English speaking coach who actively calls Chivox evaluation tools to read real scores."},
                {"role": "user",
                 "content": f"Evaluate this recording. audio_id={audio_id}, refText: {ref_text}. "
                            f"Run sentence-level scoring first; if any word is weak, follow up with word-level."},
            ]

            # 2. Round 1 — let Doubao pick tools
            resp = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                tools=ark_tools,
                tool_choice="auto",
                # extra_body={"thinking": {"type": "disabled"}},  # toggle off for low latency
            )

            msg = resp.choices[0].message
            messages.append(msg)

            # 3. Tool-call loop — Doubao may emit multiple tool_calls per turn
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

            # 4. Round 2 — Doubao reads the real evaluation JSON and produces coaching prose
            final = client.chat.completions.create(
                model=MODEL,
                messages=messages,
            )
            return final.choices[0].message.content

print(asyncio.run(evaluate_with_doubao(
    audio_id="audio_abc123",
    ref_text="The quick brown fox jumps over the lazy dog.",
)))`}</CodeBlock>

          <p className="font-semibold mt-4 mb-2">Thinking mode (optional)</p>
          <p className="text-sm text-muted-foreground">
            Seed 2.0 enables <strong>thinking</strong> by default — chain-of-thought before answer — which clearly improves multi-step orchestration but adds 30%–80% latency.
            Toggle it via <code className="bg-muted px-1 rounded text-xs font-mono">extra_body</code>:
          </p>
          <CodeBlock filename="thinking_mode.py" lang="python" locale={L}>{`# Disable thinking — faster, ideal for live feedback
client.chat.completions.create(
    model="doubao-seed-2-0-lite-260215",
    messages=messages,
    tools=ark_tools,
    extra_body={"thinking": {"type": "disabled"}},
)

# Enable thinking — default; ideal for Pro + multi-step agents
client.chat.completions.create(
    model="doubao-seed-2-0-pro-260215",
    messages=messages,
    tools=ark_tools,
    extra_body={"thinking": {"type": "enabled"}},
)`}</CodeBlock>

          <Callout type="info">
            <strong>Picking a variant:</strong> use <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">doubao-seed-2-0-lite</code> with thinking off for 1-on-1 tutoring;
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">doubao-seed-2-0-pro</code> with thinking on for K12 / exam prep that needs multi-task coordination + level-up suggestions;
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">doubao-seed-2-0-mini</code> for mobile / real-time conversational scoring.
          </Callout>
        </SubDoc>

        <SubDoc id="llm-comparison" title="Model comparison">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 pr-4 font-medium">Model</th>
                  <th className="text-left py-2 pr-4 font-medium">Suggested id</th>
                  <th className="text-left py-2 pr-4 font-medium">Function calling</th>
                  <th className="text-left py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-2 pr-4 font-medium">DeepSeek V3</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">deepseek-chat</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Best default for tool + diagnosis loop</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">DeepSeek R1</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">deepseek-reasoner</code></td>
                  <td className="py-2 pr-4 text-rose-500">No</td>
                  <td className="py-2">Reasoning-only — run tools on V3 first</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GLM-4-Flash</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-4-flash</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Fast / economical for dev</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">KIMI 128k</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">moonshot-v1-128k</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Long history &amp; progress reports</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Doubao Seed 2.0 Pro</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">doubao-seed-2-0-pro-260215</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes (thinking)</td>
                  <td className="py-2">Multi-step tool orchestration &amp; deep diagnosis</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Doubao Seed 2.0 Lite</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">doubao-seed-2-0-lite-260215</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Online tutoring · best price/quality</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Doubao Seed 2.0 Mini</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">doubao-seed-2-0-mini-260215</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Mobile / edge — low-latency live feedback</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubDoc>

        <SubDoc id="code-selfhosted-agent" title="Custom backend (FastAPI / Nest / Spring)">
          <p>
            Most production setups already have an app server — add a <strong>long-lived</strong> MCP session in the process lifespan, call tools directly when latency matters, and only then involve an LLM for natural-language coaching.
          </p>
          <div className="rounded-lg bg-muted/30 p-5 my-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">Client upload</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">Your API</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 font-medium">MCP session</span>
              <span className="text-muted-foreground">→</span>
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">Chivox</span>
              <span className="text-muted-foreground">↘</span>
              <span className="px-3 py-1.5 rounded-md bg-background border border-border/60 font-medium">LLM (optional)</span>
            </div>
          </div>
          <CodeBlock filename="app.py" lang="python" locale={L}>{`from fastapi import FastAPI
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
    r = await mcp_session.call_tool(
        "evaluate_english_sentence",
        {"audioId": audio_id, "sentence": ref_text},
    )
    return {"result": r.content[0].text}`}</CodeBlock>
          <Callout type="tip">
            Reuse one MCP connection per worker — do not reconnect per request. Skip the LLM entirely for raw scoring APIs if you only need JSON.
          </Callout>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-4 text-sm">
            <p className="font-semibold mb-2">Quick selection</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
              <li>Swappable LLM vendors → official MCP SDK path above.</li>
              <li>LangChain / Mastra / Agents SDK → use framework adapters.</li>
              <li>Console-only OpenAI-compatible APIs → chat.completions section + vendor snippets.</li>
              <li>Education SaaS backend → lifespan-hooked MCP client + optional LLM pass.</li>
            </ul>
          </div>
        </SubDoc>
      </DocSection>

      <DocSection id="eval-modes" icon={Radio} title="Evaluation modes">
        <SubDoc id="stream-eval" title="Streaming microphone">
          <p>
            Call <code className="bg-muted px-1 rounded text-xs">create_stream_session</code>, then <code className="bg-muted px-1 rounded text-xs">start_recording</code>, then{' '}
            <code className="bg-muted px-1 rounded text-xs">stop_recording</code>. Requires SoX and a local stdio proxy.
          </p>
          <ParamTable
            locale="en"
            params={[
              { name: 'core_type', type: 'string', required: true, desc: 'e.g. en.word.score, cn.sent.raw' },
              { name: 'ref_text', type: 'string', required: true, desc: 'Reference transcript' },
            ]}
          />
        </SubDoc>

        <SubDoc id="stream-flow" title="End-to-end streaming flow">
          <div className="rounded-lg border border-border/60 p-5 bg-muted/10 space-y-5">
            <FlowStep title="1">
              <p>
                <strong>User:</strong> “Please score my pronunciation for the word Hello.”
              </p>
              <p className="text-muted-foreground mt-1">
                The model calls{' '}
                <code className="bg-muted px-1 rounded text-xs font-mono">create_stream_session(core_type=&quot;en.word.score&quot;, ref_text=&quot;Hello&quot;)</code> and receives a{' '}
                <code className="bg-muted px-1 rounded text-xs font-mono">session_id</code>.
              </p>
            </FlowStep>
            <FlowStep title="2">
              <p>
                The model calls <code className="bg-muted px-1 rounded text-xs font-mono">start_recording(session_id)</code>.
              </p>
              <p className="text-muted-foreground mt-1">Microphone audio streams over WebSocket to the scorer.</p>
            </FlowStep>
            <FlowStep title="3">
              <p>
                <strong>User</strong> says “stop” (or equivalent). The model calls{' '}
                <code className="bg-muted px-1 rounded text-xs font-mono">stop_recording(session_id)</code>.
              </p>
              <p className="text-muted-foreground mt-1">Structured scores (overall, phones, fluency, …) return through MCP.</p>
            </FlowStep>
          </div>
        </SubDoc>

        <SubDoc id="file-eval" title="Audio file evaluation">
          <p>Provide <code className="bg-muted px-1 rounded text-xs">audio_file_path</code>, <code className="bg-muted px-1 rounded text-xs">audio_base64</code>, or <code className="bg-muted px-1 rounded text-xs">audio_url</code>.</p>
          <Callout type="tip">Prefer local file paths — the proxy handles encoding.</Callout>
          <p className="text-sm mt-3">
            <strong>Formats:</strong> mp3, wav, ogg, m4a, aac, pcm. <strong>Limits:</strong> up to 50MB per file; files larger than ~500KB may be transcoded to 16 kHz mono for transport.
          </p>
        </SubDoc>
      </DocSection>

      <DocSection id="api-reference" icon={BookOpen} title="API reference">
        <SubDoc id="tools-en" title="English tools (10)">
          <ToolTable
            locale="en"
            tools={[
              ['en_word_eval', 'Word scoring', 'Single-word pronunciation'],
              ['en_word_correction', 'Word correction', 'Detect omissions/extra/wrong phones'],
              ['en_vocab_eval', 'Vocabulary scoring', 'Multiple words in one clip'],
              ['en_sentence_eval', 'Sentence scoring', 'Accuracy + fluency'],
              ['en_sentence_correction', 'Sentence correction', 'Per-word feedback'],
              ['en_paragraph_eval', 'Paragraph read-aloud', 'Long passage quality'],
              ['en_phonics_eval', 'Phonics scoring', 'Letter-sound rules'],
              ['en_choice_eval', 'Oral multiple choice', 'Constrained answers'],
              ['en_semi_open_eval', 'Semi-open prompt', 'Scenario speaking'],
              ['en_realtime_eval', 'Realtime read-aloud', 'Streaming feedback'],
            ]}
          />
        </SubDoc>

        <SubDoc id="tools-cn" title="Chinese tools (6)">
          <ToolTable
            locale="en"
            tools={[
              ['cn_word_raw_eval', 'Character scoring', 'Hanzi pronunciation'],
              ['cn_word_pinyin_eval', 'Pinyin scoring', 'Syllable-level'],
              ['cn_sentence_eval', 'Phrase scoring', 'Short utterances'],
              ['cn_paragraph_eval', 'Paragraph scoring', 'Long text'],
              ['cn_rec_eval', 'Constrained recognition', 'Pick-one answers'],
              ['cn_aitalk_eval', 'AI Talk scoring', 'Open dialog evaluation'],
            ]}
          />
        </SubDoc>

        <SubDoc id="result-fields" title="Result fields">
          <CodeBlock filename="result.json" lang="json" locale={L}>{`{
  "overall": 85,
  "accuracy": 82,
  "pron": 88,
  "fluency": { "overall": 78, "speed": 65, "pause": 2 },
  "integrity": 95,
  "details": [
    {
      "char": "hello",
      "score": 85,
      "phone": [
        { "phoneme": "h", "score": 90 },
        { "phoneme": "ɛ", "score": 82 }
      ]
    }
  ]
}`}</CodeBlock>
        </SubDoc>

        <SubDoc id="error-codes" title="Error handling">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left py-2 px-3 font-medium">Symptom</th>
                  <th className="text-left py-2 px-3 font-medium">Mitigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-2 px-3">Invalid or expired audio id</td>
                  <td className="py-2 px-3">Re-upload; IDs expire ~5 minutes after upload.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Server busy</td>
                  <td className="py-2 px-3">Retry with exponential backoff.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">WebSocket disconnect</td>
                  <td className="py-2 px-3">Proxy reconnects automatically; check network if persistent.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubDoc>
      </DocSection>

      <DocSection id="best-practices" icon={FileText} title="Best practices">
        <SubDoc id="prompt-templates" title="Prompt templates">
          <p className="text-sm text-muted-foreground">
            These templates mirror the coaching prompts used inside the{' '}
            <Link href="/demo" className="underline underline-offset-2">live demo</Link>. They follow the same five-part structure —{' '}
            <strong>persona / task / method / output format / tone</strong> — and pipe MCP tool results into the model via the placeholder{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">{'{mcp_response}'}</code>. Mount them as the <code className="bg-muted px-1 rounded text-xs font-mono">system</code> message, then pass the raw tool JSON in the <code className="bg-muted px-1 rounded text-xs font-mono">user</code> turn.
          </p>

          <Callout type="tip">
            <strong>How to use:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Inject the <em>full</em> MCP JSON (with <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">overall / dp_type / phonemes</code> etc.) as <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">{'{mcp_response}'}</code>. Pre-summarising loses the very details the coach needs.</li>
              <li><strong>Diagnosis</strong> templates ask the LLM for Markdown for the learner; <strong>drill</strong> templates ask for strict JSON the UI can render. Keep them in two separate calls — far better than mixing both jobs.</li>
              <li>Pick the template that matches the question type: word → phoneme drills, sentence → add prosody, paragraph → add chunking, semi-open → 4-axis rubric, Mandarin → tone / erhua / sandhi.</li>
            </ul>
          </Callout>

          {/* ─── A. Diagnosis · Markdown for learners ─── */}
          <h4 className="text-sm font-semibold mt-6 mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> A. Second-pass diagnosis · Markdown
          </h4>
          <div className="space-y-4">
            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Sparkle className="h-4 w-4" /> 1. Word · phoneme diagnosis
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Tools: <code className="bg-muted px-1 rounded font-mono">en.word.score</code> / <code className="bg-muted px-1 rounded font-mono">cn.word.raw</code>. Lean on <code className="bg-muted px-1 rounded font-mono">phonemes[].dp_type</code> to find mispronounced phones.
              </p>
              <CodeBlock filename="prompt-word-diagnosis.txt" locale={L}>{`You are a professional English pronunciation coach. Below is **word-level** exam-grade data from the Chivox MCP API (en.word.score): one headword, overall + pron scores, and a phoneme array with per-phoneme score and dp_type.

## Task
Write a **learner-facing** diagnosis of this single word. Tie every claim to phoneme scores (cite IPA symbols).

## Method
- Group phonemes by dp_type; treat **mispron** first, then borderline **normal** scores below 70 if they explain the word score.
- For each problem phoneme: typical L1 interference, what it sounds like now, one concrete articulation fix (jaw, tongue, airstream, lip rounding).
- Respect lexical stress (ˈ): mis-stress counts as a rhythm issue even when individual phones look fine.
- Cap at four numbered issues, ordered weakest → strongest impact on intelligibility.

## Output
Short Markdown: optional one-line summary, then numbered items, then a single-line **🎯 Priority** ranking.

## Tone
Friendly, concrete, actionable — no empty cheerleading.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>

            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> 2. Sentence · prosody + stress
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Tools: <code className="bg-muted px-1 rounded font-mono">en.sent.score</code>. Open with a compact scoreboard, then walk phones → words → prosody.
              </p>
              <CodeBlock filename="prompt-sentence-diagnosis.txt" locale={L}>{`You are a professional English pronunciation coach. Below is **sentence-level** exam-grade data from Chivox MCP (en.sent.score): refText, overall, pron sub-scores (accuracy / integrity / fluency / rhythm), optional speed (WPM), and details[] with per-token scores, dp_type and optional phonemes[].

## Task
Open with a compact **scoreboard line** (overall + sub-scores + speed if present), then move from **phones → words → prosody**.

## Checklist (cover each; say "none material" if not applicable)
1. **Segmental**: for each token with score < 70 or dp_type ≠ normal, open phonemes when present; name the likely error (e.g. /ð/ realised as /d/) and one fix.
2. **Omissions / insertions**: flag dp_type omit / insert and how they affect integrity.
3. **Prosody**: use rhythm + stressed syllables in mispronounced words — misplaced lexical stress, flat declarative intonation, choppy chunking.
4. **Fluency vs accuracy**: if fluency is high but accuracy low, say so explicitly so the learner knows what to prioritise.

## Output format
Markdown subheads such as **Pronunciation**, **Prosody**, **Study priority** (one short ranked line, highest ROI first).

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>

            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4" /> 3. Paragraph · phoneme families + integrity
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Tools: <code className="bg-muted px-1 rounded font-mono">en.pred.score</code>. Cluster recurring errors into "phoneme families" instead of replaying every word.
              </p>
              <CodeBlock filename="prompt-paragraph-diagnosis.txt" locale={L}>{`You are a professional English pronunciation coach. Below is **paragraph-level** data from Chivox MCP (en.pred.score): long refText, overall, pron sub-scores, optional speed / integrity, and many details[] rows (tokens may repeat across clauses; some rows may be empty char for omit).

## Task
Diagnose the **whole passage in context**:
(a) completeness / skipping,
(b) recurring **phoneme families**,
(c) rhythm & chunking,
(d) how sub-scores agree or disagree.

## Checklist
1. **Integrity / dp_type**: list every omit / insert with clause context; explain why function words disappear in long reads.
2. **Segmental clusters**: group weak tokens by shared phoneme issue (/θ/ chain, /e/ chain, /ɒ/, weak stress on ˈe…); cite example words from details.
3. **Prosody**: use rhythm + punctuation — flag over-pausing inside phrases, or missing boundaries before new clauses.
4. **Global coherence**: if fluency looks fine but accuracy is weak (or vice versa), call it out and say what that implies for practice design.

## Output format
Markdown sections such as **Summary**, **Completeness**, **Pronunciation (families)**, **Rhythm**, **Study priorities** (≤ 4 bullets, most impactful first).

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>

            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> 4. Semi-open · IELTS-style 4-axis rubric
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Tools: <code className="bg-muted px-1 rounded font-mono">en.pqan.score</code>. Combine learner transcript + 4 sub-scores into a band estimate plus next-band upgrades.
              </p>
              <CodeBlock filename="prompt-semi-open.txt" locale={L}>{`You are an **IELTS-style / classroom speaking** coach. Below is **semi-open** data from Chivox MCP (en.pqan.score): prompt refText, learner transcript, overall, four rubric scores (grammar / content / fluency / pron), speed (WPM if present), and structured issues[] flags.

## Task
Give a **rubric-grounded** diagnosis: estimate a 0–100 overall band in plain language, then explain **each dimension** with **quoted snippets** from the transcript (short phrases, not the whole text). End with **3–5 concrete upgrades** to reach the **next band** (sentence stems / patterns, not vague "practice more").

## Weights (communicate these to the learner)
- Content ~30% — idea depth, elaboration, specificity
- Grammar ~25% — range, agreement, subordination
- Fluency ~25% — pace, pausing, fillers, cohesion
- Pronunciation ~20% — segmentals + intelligibility

## Cross-dimension checks
- If content is the lowest score, prioritise elaboration templates before micro-pron drills.
- If fluency lags with low WPM, separate planning pauses from articulation issues.
- If pron flags specific phones, tie them to actual words in the transcript.

## Output format
Markdown: **Band estimate**, a compact **score table**, then **"To reach the next band"** with numbered pattern upgrades.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>

            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Languages className="h-4 w-4" /> 5. Mandarin · tone / erhua / sandhi
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Tools: <code className="bg-muted px-1 rounded font-mono">cn.word.raw</code> / <code className="bg-muted px-1 rounded font-mono">cn.sent.raw</code> / <code className="bg-muted px-1 rounded font-mono">cn.pred.raw</code>. Tone errors carry the highest weight and need a dedicated pass.
              </p>
              <CodeBlock filename="prompt-mandarin-coach.txt" locale={L}>{`You are a professional Mandarin speaking coach. Below is sentence-level data from Chivox MCP (cn.sent.raw): whole-sentence scores plus per-character details, optional phonemes, and fluency / rhythm fields.

## What matters in Chinese evaluation
- Tone errors carry the highest weight — wrong tone can change meaning.
- dp_type=mispron often comes from wrong tone, retroflex vs alveolar mix-ups, or front / back nasal confusion.
- Correct pinyin with wrong tone still sounds like a "foreign accent".

## Checklist (say "none notable" if absent)
1. **Erhua**: when phonemes include r(儿化), confirm the syllable is read as one beat (mǎr), not "main syllable + separate 儿".
2. **Neutral tone**: reduplications, suffixes, sentence-final particles — second syllable short, light, no full tone contour.
3. **Sandhi**: 3rd-tone chains, 不 / 一 + following tone — match Standard Mandarin rules.
4. **Prosody**: use rhythm + comma positions to flag pauses that are too long or too choppy; suggest chunk boundaries.

## Output
Markdown subheads: **Summary / Erhua / Neutral tone / Sandhi / Rhythm / Study priorities** (1–3 bullets, biggest impact on natural Mandarin first).

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>
          </div>

          {/* ─── B. Drills · strict JSON for the UI ─── */}
          <h4 className="text-sm font-semibold mt-7 mb-3 flex items-center gap-2">
            <Mic className="h-4 w-4" /> B. Micro-drills · strict JSON
          </h4>
          <div className="space-y-4">
            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> 6. Word / sentence drills
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Run as the <strong>second pass</strong>, after the diagnosis exists, so the model targets only the named weaknesses — no generic packs.
              </p>
              <CodeBlock filename="prompt-micro-drills.txt" locale={L}>{`You are still the same learner's coach. The **second-pass diagnosis** already lists weak phonemes — generate **micro-drills** that map 1:1 to those weaknesses (no generic packs).

## Output JSON (single valid JSON array only; no prose outside it)
Root must be an array of objects, each with category (string), icon (one emoji), and items (array of { "label", "content" }):
\`\`\`json
[
  { "category": "Phoneme drills", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Awareness",      "icon": "🗣️", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Whole word",     "icon": "📝", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## Rules
- **Phoneme drills**: for each mispron phoneme from the diagnosis, at least one minimal pair or near-minimal pair AND one short tongue-twister or repetition line.
- **Awareness**: one item that targets stress or jaw / tongue posture if stress was weak.
- **Whole word**: 2–3 natural sentences that include the headword in different positions (initial / medial / final).
- All content strings must be speakable aloud; no nested JSON inside strings.

## Context
Previous diagnosis: {previous_diagnosis}
Raw MCP:
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>

            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Notebook className="h-4 w-4" /> 7. Paragraph · chunk map + metacognition
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Lift drills from "phone" to "phrase / passage / record-replay loop". Pairs naturally with diagnosis #3.
              </p>
              <CodeBlock filename="prompt-paragraph-drills.txt" locale={L}>{`You are still the same learner's coach. The **second-pass paragraph diagnosis** already names omission spots and phoneme families — build **passage-length** practice that chains those families instead of isolated minimal pairs only.

## Task
Return drills that move sound → phrase → paragraph: family chains, **chunk maps** that glue weak function words, and a **metacognitive** record–replay step.

## Output JSON (single valid JSON array only; no prose outside it)
\`\`\`json
[
  { "category": "Phoneme families", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Chunking",         "icon": "🎵", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Metacognition",    "icon": "🧠", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## Rules
- **Phoneme families**: at least three items total, grouping minimal pairs / word chains that reuse the diagnosed families (/θ/, /e/, /ɒ/…).
- **Chunking**: include one bracketed chunk map of the passage (use [ ] and / // with rough pause hints in seconds) and one item that targets any omitted preposition / function word by embedding it inside a phrase (not drilling it alone).
- **Metacognition**: one item that prescribes record → replay → compare to MCP details for N passes (N explicit, 2–3).
- All strings are plain display text; no nested JSON.

## Context
Previous diagnosis: {previous_diagnosis}
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>
          </div>

          {/* ─── C. Cross-session ─── */}
          <h4 className="text-sm font-semibold mt-7 mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> C. Cross-session
          </h4>
          <div className="space-y-4">
            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Gauge className="h-4 w-4" /> 8. Weekly report
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Aggregate the past N days of MCP results before sending; let the LLM produce a report that students or parents can read.
              </p>
              <CodeBlock filename="prompt-weekly-report.txt" locale={L}>{`You are an English speaking learning advisor. Below are the last 7 days of Chivox MCP evaluation history for this learner (chronological). Each item carries question type, coreType, overall, sub-scores, and a weak_phonemes summary.

## Task
Produce a **weekly report** for the learner + parent / teacher. Emphasise **trend** and **next steps**, not a play-by-play of every score.

## Must include
1. **Overall trend**: improved / flat / regressed (one sentence + brief evidence)
2. **Dimension deltas**: any of accuracy / fluency / rhythm / integrity / speed with data — "this week avg vs last week"
3. **Highlights**: question type / phoneme / sentence pattern with the biggest jump
4. **Sticky issues**: any phoneme or dimension that stayed below 70 for ≥ 3 sessions
5. **Next week plan**: 3 concrete actions (each tied to one MCP tool or drill type)
6. **Closing**: 1–2 lines of genuine encouragement — no platitudes

## Style
- A focused but warm private tutor's voice
- Use the placeholder {student_name} for the learner's name
- Round all numbers to integers

## History
\`\`\`json
{history}
\`\`\``}</CodeBlock>
            </div>

            <div className="border border-border/60 rounded-lg p-4">
              <p className="font-semibold text-sm mb-1 flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> 9. Error attribution · JSON summary
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                For backend aggregation / dashboards: have the LLM compress one MCP response into a structured row that's easy to store and chart.
              </p>
              <CodeBlock filename="prompt-error-summary.txt" locale={L}>{`You are an evaluation-result classifier. Below is one full MCP response. Extract the key signals and **return ONLY valid JSON** (no surrounding prose).

## Schema
\`\`\`json
{
  "core_type": "string, e.g. en.sent.score",
  "overall": 0,
  "sub_scores": { "accuracy": 0, "integrity": 0, "fluency": 0, "rhythm": 0 },
  "weak_phonemes": [
    { "ipa": "string", "avg_score": 0, "occur": 0, "example_word": "string" }
  ],
  "omissions": [{ "after": "string", "missing": "string" }],
  "stress_issues": [{ "word": "string", "expected": "string", "actual": "string" }],
  "primary_issue_tag": "phoneme|stress|fluency|integrity|content|none",
  "next_action_hint": "string, ≤10 words, e.g. \\"drill /θ/ minimal pairs\\""
}
\`\`\`

## Rules
- weak_phonemes: only avg_score < 70, max 5 items, ordered by occur desc.
- Do not echo refText, no markdown.
- Use null or empty arrays for missing fields; never drop a key.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``}</CodeBlock>
            </div>
          </div>

          <Callout type="info">
            <strong>How does this hook into MCP tool calls?</strong>
            <br />
            Using direct <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">chat.completions</code> + dynamic tools as an example: round 1 the LLM picks <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">en.sent.score</code>; you take that tool message verbatim and slot it into any <em>diagnosis</em> template above as <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">{'{mcp_response}'}</code>, send it as the next user turn, then pass that diagnosis into a <em>drills</em> template for the third turn. Three calls give you the full <strong>evaluate → diagnose → practice</strong> loop.
          </Callout>
        </SubDoc>

        <SubDoc id="error-handling" title="Errors & retries">
          <ul className="space-y-3 mt-2">
            <li>
              Treat uploads as short-lived — score within a few minutes.
            </li>
            <li>
              Back off exponentially on 5xx / busy signals.
            </li>
          </ul>
        </SubDoc>

        <SubDoc id="performance" title="Performance">
          <ul className="space-y-3 mt-2">
            <li>Streaming avoids file upload latency for interactive tutoring.</li>
            <li>Compress to 16 kHz mono mp3 before large uploads.</li>
            <li>Pick the smallest tool that answers your product question (word vs paragraph).</li>
          </ul>
        </SubDoc>
      </DocSection>

      <DocSection id="service-info" icon={Globe} title="Service information">
        <SubDoc id="endpoints" title="Endpoints">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left py-2 px-3 font-medium">Path</th>
                  <th className="text-left py-2 px-3 font-medium">Method</th>
                  <th className="text-left py-2 px-3 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">/upload</td>
                  <td className="py-2 px-3">POST</td>
                  <td className="py-2 px-3">Audio upload</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">/mcp</td>
                  <td className="py-2 px-3">POST</td>
                  <td className="py-2 px-3">MCP JSON-RPC (Streamable HTTP)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">/health</td>
                  <td className="py-2 px-3">GET</td>
                  <td className="py-2 px-3">Health check</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubDoc>

        <SubDoc id="limits" title="Limits">
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left py-2 px-3 font-medium">Item</th>
                  <th className="text-left py-2 px-3 font-medium">Default</th>
                  <th className="text-left py-2 px-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ['Scratch storage', '500MB', 'Temporary audio cache'],
                  ['Queue depth', '10', 'Pending jobs'],
                  ['Concurrency', '3', 'Parallel scoring workers'],
                  ['Audio TTL', '5 min', 'Expires if not scored'],
                  ['Max upload', '50MB', 'Per file'],
                ].map(([k, v, d]) => (
                  <tr key={k as string}>
                    <td className="py-2 px-3 font-medium">{k}</td>
                    <td className="py-2 px-3 font-mono text-xs">{v}</td>
                    <td className="py-2 px-3 text-muted-foreground">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            These defaults describe <strong>technical</strong> guardrails on the hosted endpoint. <strong>Billing quotas</strong> (trial credits, concurrency tiers, call volume) follow the{' '}
            <Link href="/dashboard/plans" className="text-foreground underline underline-offset-2">
              Membership plans
            </Link>{' '}
            page — the two are independent dimensions.
          </p>
        </SubDoc>

        <SubDoc id="changelog" title="Changelog">
          <Callout type="info">
            <strong>Current deployed version:</strong> v1.0.0 (site not officially launched yet). Entries below are development-stage notes until public release.
          </Callout>
          <div className="space-y-3 mt-4">
            {[
              { ver: 'v1.0.0', date: 'TBD', desc: 'Current deployed version (site not officially launched)' },
            ].map((l) => (
              <div key={l.ver} className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold bg-muted px-2 py-0.5 rounded shrink-0">{l.ver}</span>
                <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{l.date}</span>
                <span className="text-sm">{l.desc}</span>
              </div>
            ))}
          </div>
        </SubDoc>
      </DocSection>
    </>
  );
}
