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
  Network,
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
  void L;
  return (
    <DocSection id="architecture" icon={Terminal} title="Architecture">
      <SubDoc id="arch-overview" title="Two integration modes at a glance">
        <p>Chivox exposes <strong>two parallel front doors</strong> to the same scoring engine, so pick whichever fits your client runtime:</p>

        <div className="grid md:grid-cols-2 gap-4 my-5">
          <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <Plug className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              MCP mode (preferred)
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• JSON-RPC 2.0 over Streamable HTTP / stdio</li>
              <li>• <strong className="text-foreground">Zero-code</strong> drop-in for any MCP-aware IDE / desktop AI / agent framework</li>
              <li>• Tool list auto-injected — adding new eval types requires no business-side change</li>
              <li>• Local proxy <code className="bg-muted px-1 rounded text-[10px] font-mono">chivox-local-mcp</code> enables microphone streaming</li>
            </ul>
            <p className="text-xs mt-2"><strong>Typical clients</strong>: Cursor / Claude Desktop / Coze / Dify / LangChain / custom backend agents</p>
          </div>
          <div className="rounded-xl border-2 border-sky-500/40 bg-sky-500/5 p-5">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <Network className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              Function-calling mode (non-MCP · cvx_fc)
            </p>
            <ul className="text-xs space-y-1.5 text-muted-foreground">
              <li>• OpenAI function-calling style — plain REST + WebSocket</li>
              <li>• <strong className="text-foreground">No MCP SDK required</strong>, any HTTP/WS client works</li>
              <li>• Built-in <code className="bg-muted px-1 rounded text-[10px] font-mono">resume_token</code>, <code className="bg-muted px-1 rounded text-[10px] font-mono">intermediate</code> results, <code className="bg-muted px-1 rounded text-[10px] font-mono">backpressure</code> frames</li>
              <li>• Fallback channel for runtimes that can't load MCP libraries</li>
            </ul>
            <p className="text-xs mt-2"><strong>Typical clients</strong>: native Android / iOS / Flutter, WeChat / Alipay mini-programs, legacy Java / PHP backends</p>
          </div>
        </div>

        <p className="font-semibold mt-5">Which one should I pick?</p>
        <div className="overflow-x-auto rounded-lg border border-border/60 my-3">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border/40 bg-muted/30">
              <th className="text-left py-2 px-3 font-medium">Your client environment</th>
              <th className="text-left py-2 px-3 font-medium">Recommendation</th>
            </tr></thead>
            <tbody className="divide-y divide-border/30">
              <tr><td className="py-2 px-3">Cursor / Claude Desktop / AI IDE that accepts MCP</td><td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">MCP mode</td></tr>
              <tr><td className="py-2 px-3">Python / Node / Java backend able to pull MCP SDK</td><td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">MCP mode</td></tr>
              <tr><td className="py-2 px-3">Coze / Dify / n8n visual platforms</td><td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">MCP mode</td></tr>
              <tr><td className="py-2 px-3">Native Android / iOS app that wants raw HTTP + WS</td><td className="py-2 px-3 text-sky-600 dark:text-sky-400">Function-calling mode</td></tr>
              <tr><td className="py-2 px-3">WeChat / Alipay / Douyin mini-programs</td><td className="py-2 px-3 text-sky-600 dark:text-sky-400">Function-calling mode</td></tr>
              <tr><td className="py-2 px-3">Legacy / sandboxed runtime that can't add MCP deps</td><td className="py-2 px-3 text-sky-600 dark:text-sky-400">Function-calling mode</td></tr>
            </tbody>
          </table>
        </div>
        <Callout type="warning">
          Pick <strong>exactly one</strong> per session — the MCP <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/audio/</code> and function-calling <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/eval/</code> endpoints live in different session-ID namespaces.
        </Callout>
      </SubDoc>

      <SubDoc id="arch-mcp" title="MCP mode · components & data flow">
        <p>MCP mode has two deployment shapes — both speak JSON-RPC 2.0, the only difference is whether there's a local proxy between client and server:</p>

        <p className="font-semibold mt-4">Shape A · Remote direct (zero-code)</p>
        <p className="text-sm text-muted-foreground">For Cursor / Coze / Dify / n8n and any other Streamable HTTP-aware client. <strong>No local dependency.</strong></p>
        <div className="flex flex-wrap items-center justify-center gap-4 my-4">
          <div className="rounded-xl border-2 border-foreground/30 px-5 py-3 text-center min-w-[130px]">
            <p className="text-xs font-semibold mb-0.5">AI client</p>
            <p className="text-[11px] text-muted-foreground">Cursor / Coze /<br/>Dify / n8n …</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">Streamable HTTP<br/>JSON-RPC 2.0</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 px-5 py-3 text-center min-w-[130px]">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">Chivox MCP server</p>
            <p className="text-[11px] text-muted-foreground">/mcp · /ws/audio<br/>scoring engine</p>
          </div>
        </div>

        <p className="font-semibold mt-5">Shape B · Local proxy (microphone streaming)</p>
        <p className="text-sm text-muted-foreground">For Claude Desktop / Claude Code and any stdio-based MCP host that needs live mic capture.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 my-4">
          <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[120px]">
            <p className="text-xs font-semibold mb-0.5">AI client</p>
            <p className="text-[11px] text-muted-foreground">Claude Desktop /<br/>Claude Code</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">stdio</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 px-4 py-3 text-center min-w-[120px]">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">chivox-local-mcp</p>
            <p className="text-[11px] text-muted-foreground">local proxy · SoX capture</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">HTTP / WS</p>
          </div>
          <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[120px]">
            <p className="text-xs font-semibold mb-0.5">Remote Chivox</p>
            <p className="text-[11px] text-muted-foreground">MCP server<br/>scoring engine</p>
          </div>
        </div>

        <p className="font-semibold mt-5">Standard data flow</p>
        <ol className="list-decimal list-inside space-y-1.5 text-sm ml-1">
          <li><code className="bg-muted px-1 rounded text-xs">initialize</code> → negotiate protocol version &amp; capabilities</li>
          <li><code className="bg-muted px-1 rounded text-xs">tools/list</code> → fetch the JSON Schema of all 16 evaluation tools</li>
          <li><strong>File mode</strong>: <code className="bg-muted px-1 rounded text-xs">tools/call</code> → server runs evaluation → JSON-RPC response</li>
          <li><strong>Streaming mode</strong>: <code className="bg-muted px-1 rounded text-xs">create_stream_session</code> → push PCM over <code className="bg-muted px-1 rounded text-xs">/ws/audio/{'{session_id}'}</code> → receive <code className="bg-muted px-1 rounded text-xs">stream_eval_result</code></li>
        </ol>

        <p className="font-semibold mt-6">Raw JSON-RPC requests (copy-paste for custom clients)</p>
        <p className="text-xs text-muted-foreground mb-3">
          If you don&apos;t use the official MCP SDK and instead hand-craft JSON-RPC 2.0 frames against <code className="bg-muted px-1 rounded">POST /mcp</code>, here&apos;s the minimal three-step handshake. Every request must carry <code className="bg-muted px-1 rounded text-xs">Authorization: Bearer &lt;your_api_key&gt;</code>.
        </p>

        <p className="text-sm font-semibold mt-4">① Initialize · <code>initialize</code></p>
        <CodeBlock filename="initialize.json" lang="json" locale={L}>{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "my-client", "version": "1.0.0" }
  }
}`}</CodeBlock>
        <p className="text-xs text-muted-foreground">On success the server returns its protocol version, server capabilities, and server info; only then may you call other methods.</p>

        <p className="text-sm font-semibold mt-4">② Fetch the tool catalog · <code>tools/list</code></p>
        <CodeBlock filename="tools-list.json" lang="json" locale={L}>{`{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}`}</CodeBlock>
        <p className="text-xs text-muted-foreground">Returns all 16 evaluation tools (EN 10 + CN 6) plus the 2 streaming tools, each with a name, description, and parameter JSON Schema. Cache the response on the client, then render / bridge it to your LLM as needed.</p>

        <p className="text-sm font-semibold mt-4">③ Invoke a tool · <code>tools/call</code></p>
        <CodeBlock filename="tools-call.json" lang="json" locale={L}>{`{
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
          Success payload lives in <code className="bg-muted px-1 rounded">result.content[0].text</code> (a JSON string whose contents match the evaluation-result schema); failures surface as <code className="bg-muted px-1 rounded">error.code</code> + <code className="bg-muted px-1 rounded">error.message</code>.
        </p>

        <Callout type="tip">
          Users of the official Python / TypeScript MCP SDK <strong>do not need to touch any of this</strong> — the SDK wraps <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">session.initialize()</code> / <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">session.list_tools()</code> / <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">session.call_tool()</code>. This section is only for bare-protocol implementors and debugging.
        </Callout>
      </SubDoc>

      <SubDoc id="arch-rest" title="Function-calling mode · components & data flow">
        <p>No proxy, no SDK — just two links between client and server: REST for session/file control, WebSocket for audio frames.</p>

        <div className="flex flex-wrap items-center justify-center gap-3 my-5">
          <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[140px]">
            <p className="text-xs font-semibold mb-0.5">Client</p>
            <p className="text-[11px] text-muted-foreground">Native app / mini-program /<br/>legacy backend / pure web</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">HTTP REST<br/>/v1/call · /v1/functions</p>
          </div>
          <div className="rounded-xl border-2 border-sky-500/50 bg-sky-500/5 px-4 py-3 text-center min-w-[140px]">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-0.5">cvx_fc gateway</p>
            <p className="text-[11px] text-muted-foreground">function-calling API<br/>scoring engine</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-muted-foreground">⇄</p>
            <p className="text-[10px] text-muted-foreground">WebSocket<br/>/ws/eval/&#123;id&#125;</p>
          </div>
          <div className="rounded-xl border-2 border-foreground/30 px-4 py-3 text-center min-w-[140px]">
            <p className="text-xs font-semibold mb-0.5">Client (streaming)</p>
            <p className="text-[11px] text-muted-foreground">microphone / chunk buffer</p>
          </div>
        </div>

        <p className="font-semibold mt-5">Three typical flows</p>
        <div className="space-y-3 my-3">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm font-semibold mb-1.5">a. One-shot file eval</p>
            <p className="text-xs text-muted-foreground">POST <code className="bg-muted px-1 rounded">/v1/call</code> (<code className="bg-muted px-1 rounded">audio_url</code> or <code className="bg-muted px-1 rounded">audio_base64</code>) → synchronous score</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm font-semibold mb-1.5">b. Streaming eval</p>
            <p className="text-xs text-muted-foreground">POST <code className="bg-muted px-1 rounded">/v1/call</code> → <code className="bg-muted px-1 rounded">start_stream_eval</code> → open <code className="bg-muted px-1 rounded">/ws/eval/&#123;id&#125;</code> → push PCM → receive <code className="bg-muted px-1 rounded">intermediate</code> / <code className="bg-muted px-1 rounded">backpressure</code> → send <code className="bg-muted px-1 rounded">stop</code> → receive <code className="bg-muted px-1 rounded">result</code></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm font-semibold mb-1.5">c. Resume &amp; fallback</p>
            <p className="text-xs text-muted-foreground">Network glitch within 60s → reconnect with <code className="bg-muted px-1 rounded">resume_token</code>; unrecoverable → POST <code className="bg-muted px-1 rounded">/v1/call</code> → <code className="bg-muted px-1 rounded">get_stream_result</code></p>
          </div>
        </div>

        <p className="font-semibold mt-5">Distinctive capabilities</p>
        <ul className="list-disc list-inside space-y-1 text-sm ml-1">
          <li><strong>resume_token</strong> — seamless resume within 60s; server keeps session state warm</li>
          <li><strong>intermediate frames</strong> — partial results streamed as audio flows, great for live waveform / score colouring</li>
          <li><strong>backpressure feedback</strong> — server broadcasts <code className="bg-muted px-1 rounded text-xs">suggested_interval_ms</code> and the client slows down accordingly</li>
          <li><strong>structured error codes</strong> — <code className="bg-muted px-1 rounded text-xs">SESSION_EXPIRED</code> / <code className="bg-muted px-1 rounded text-xs">INVALID_STATE</code> / … for deterministic retry logic</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3">Full usage examples live in the <a href="#config-rest" className="text-blue-600 dark:text-blue-400 hover:underline">Non-MCP REST (cvx_fc)</a> section below.</p>
      </SubDoc>

      <SubDoc id="transport" title="Transport comparison">
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/40 bg-muted/30">
              <th className="text-left py-2 px-3 font-medium">Dimension</th>
              <th className="text-left py-2 px-3 font-medium">MCP mode</th>
              <th className="text-left py-2 px-3 font-medium">Function-calling (cvx_fc)</th>
            </tr></thead>
            <tbody className="divide-y divide-border/30">
              <tr><td className="py-2 px-3 font-medium">Protocol</td><td className="py-2 px-3">JSON-RPC 2.0</td><td className="py-2 px-3">REST + WebSocket</td></tr>
              <tr><td className="py-2 px-3 font-medium">Entry path</td><td className="py-2 px-3 font-mono text-xs">POST /mcp</td><td className="py-2 px-3 font-mono text-xs">POST /v1/call</td></tr>
              <tr><td className="py-2 px-3 font-medium">List tools</td><td className="py-2 px-3 font-mono text-xs">tools/list</td><td className="py-2 px-3 font-mono text-xs">GET /v1/functions</td></tr>
              <tr><td className="py-2 px-3 font-medium">Call tool</td><td className="py-2 px-3 font-mono text-xs">tools/call</td><td className="py-2 px-3 font-mono text-xs">POST /v1/call + name</td></tr>
              <tr><td className="py-2 px-3 font-medium">Streaming WS</td><td className="py-2 px-3 font-mono text-xs">{'/ws/audio/{session_id}'}</td><td className="py-2 px-3 font-mono text-xs">{'/ws/eval/{session_id}'}</td></tr>
              <tr><td className="py-2 px-3 font-medium">Local stdio proxy</td><td className="py-2 px-3">yes (<code className="bg-muted px-1 rounded text-[10px]">chivox-local-mcp</code>)</td><td className="py-2 px-3 text-muted-foreground">n/a</td></tr>
              <tr><td className="py-2 px-3 font-medium">Reconnect</td><td className="py-2 px-3">SDK auto-reconnect</td><td className="py-2 px-3">resume_token (60s suspend)</td></tr>
              <tr><td className="py-2 px-3 font-medium">Intermediate results</td><td className="py-2 px-3">stream_eval callback</td><td className="py-2 px-3">intermediate frames</td></tr>
              <tr><td className="py-2 px-3 font-medium">Backpressure feedback</td><td className="py-2 px-3 text-muted-foreground">—</td><td className="py-2 px-3">backpressure frames</td></tr>
              <tr><td className="py-2 px-3 font-medium">Client dependency</td><td className="py-2 px-3">MCP SDK (official / framework)</td><td className="py-2 px-3">any HTTP + WS client</td></tr>
            </tbody>
          </table>
        </div>
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
            <li>Four main paths: ① official MCP SDK → ② agent adapters → ③ raw chat.completions with dynamic tools → ④ embedding an MCP client inside your service.</li>
            <li>If your runtime cannot load an MCP SDK (native apps, mini-programs, sandboxed legacy stacks), skip ahead to the <a href="#config-rest" className="text-blue-600 dark:text-blue-400 hover:underline">Non-MCP REST (cvx_fc)</a> section.</li>
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

        <SubDoc id="code-selfhosted-agent" title="④ Custom backend (FastAPI / Nest / Spring)">
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
        </SubDoc>

        <div className="rounded-lg border border-border/60 bg-muted/20 p-4 my-5 text-xs">
          <p className="font-semibold text-sm mb-1.5 flex items-center gap-2"><Sparkles className="h-4 w-4 text-muted-foreground" /> The sections below drill into path <strong className="text-foreground">③ (chat.completions)</strong> per LLM vendor</p>
          <p className="text-muted-foreground">Pick the vendor you use today — SDK / base_url / auth differ slightly, but the Chivox MCP side stays identical.</p>
        </div>

        <SubDoc id="llm-deepseek" title="DeepSeek">
          <p>
            Latest model is <strong>DeepSeek-V3.2</strong> (Dec 2025) — the first model to natively fuse <em>thinking + tool use</em>.
            Use <code className="bg-muted px-1 rounded text-xs font-mono">deepseek-chat</code> for non-thinking mode and{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">deepseek-reasoner</code> for thinking mode — <strong>both support function calling</strong> with a 128K context.
          </p>
          <CodeBlock filename="deepseek_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com/v1",
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

        <SubDoc id="llm-glm" title="GLM (Zhipu / Z.ai)">
          <p>
            Latest flagships are <strong>GLM-5</strong> and <strong>GLM-5.1</strong> (Feb 2026, 744B-A40B MoE, 200K context, on par with Claude Opus 4.5),
            with <code className="bg-muted px-1 rounded text-xs font-mono">glm-4.7</code> / <code className="bg-muted px-1 rounded text-xs font-mono">glm-4.6</code> still available
            and <code className="bg-muted px-1 rounded text-xs font-mono">glm-4-flash</code> kept as the free dev tier.
            OpenAI-compatible base URL: <code className="bg-muted px-1 rounded text-xs font-mono">https://open.bigmodel.cn/api/paas/v4/</code>.
          </p>
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
                model="glm-4-flash",   # free dev tier; production: glm-5 / glm-4.7
                messages=messages, tools=oa_tools)
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
          <Callout type="tip">
            Use <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-4-flash</code> (free) for dev,
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-4.7</code> for everyday tutoring diagnosis,
            and <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-5</code> / <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">glm-5.1</code>
            for K12 / multi-step agentic orchestration with 200K context.
          </Callout>
        </SubDoc>

        <SubDoc id="llm-kimi" title="KIMI (Moonshot)">
          <p>
            Latest flagship is <strong>Kimi K2.5</strong> (Jan 27, 2026) — MoE, <strong>256K context</strong>, native multimodal, agent-cluster collaboration.
            Variants: <code className="bg-muted px-1 rounded text-xs font-mono">kimi-k2.5</code>, <code className="bg-muted px-1 rounded text-xs font-mono">kimi-k2-thinking</code>, <code className="bg-muted px-1 rounded text-xs font-mono">kimi-k2-turbo-preview</code>.
            Legacy <code className="bg-muted px-1 rounded text-xs font-mono">moonshot-v1-8k/32k/128k</code> still works but the <strong>K2.5 family is recommended</strong>.
            Base URL: <code className="bg-muted px-1 rounded text-xs font-mono">https://api.moonshot.cn/v1</code> (China) or <code className="bg-muted px-1 rounded text-xs font-mono">https://api.moonshot.ai/v1</code> (global).
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
                model="kimi-k2.5",   # flagship; or kimi-k2-turbo-preview / moonshot-v1-128k
                messages=messages, tools=oa_tools)
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

asyncio.run(run("audio_abc123", "Nice to meet you."))`}</CodeBlock>
          <Callout type="tip">
            K2.5&apos;s 256K context + agent-cluster mode shines for &quot;multi-session history + multi-step orchestration&quot;: stuff 30 past evaluation JSONs into messages and let it produce a cross-session progress report.
            Use <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">kimi-k2-thinking</code> for deeper reasoning,
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">kimi-k2-turbo-preview</code> for low-latency live feedback.
          </Callout>
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
                <tr><td className="py-2 px-3 font-mono">doubao-seed-1-8-251228</td><td className="py-2 px-3">1.8 · deep thinking</td><td className="py-2 px-3">Tunable reasoning_effort (minimal/low/medium/high), previous-gen still active</td></tr>
                <tr><td className="py-2 px-3 font-mono">doubao-seed-1-6-251015</td><td className="py-2 px-3">1.6 · classic</td><td className="py-2 px-3">256K context classic — keep using for already-shipped projects</td></tr>
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

        <SubDoc id="llm-qwen" title="Qwen (Alibaba Model Studio / DashScope)">
          <p>
            Alibaba&apos;s <strong>Qwen 3.6</strong> series (Apr 2026) is the latest — flagship <code className="bg-muted px-1 rounded text-xs font-mono">qwen3.6-plus</code>,
            fast tier <code className="bg-muted px-1 rounded text-xs font-mono">qwen3.6-flash</code>, and the open-weight MoE <code className="bg-muted px-1 rounded text-xs font-mono">qwen3.6-35b-a3b</code>.
            Older aliases <code className="bg-muted px-1 rounded text-xs font-mono">qwen-max</code> / <code className="bg-muted px-1 rounded text-xs font-mono">qwen-plus</code> still resolve.
            Served via <strong>Model Studio</strong> with OpenAI-compatible endpoints:
            <code className="bg-muted px-1 rounded text-xs font-mono">https://dashscope.aliyuncs.com/compatible-mode/v1</code> (China Beijing),{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">https://dashscope-intl.aliyuncs.com/compatible-mode/v1</code> (Singapore),{' '}
            <code className="bg-muted px-1 rounded text-xs font-mono">https://dashscope-us.aliyuncs.com/compatible-mode/v1</code> (US Virginia).
          </p>
          <CodeBlock filename="qwen_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = OpenAI(
    api_key=os.environ["DASHSCOPE_API_KEY"],
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
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
                model="qwen3.6-plus",   # flagship; or qwen3.6-flash / qwen-long
                messages=messages, tools=oa_tools)
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
                    model="qwen3.6-plus", messages=messages)
                return final.choices[0].message.content

asyncio.run(run("audio_abc123", "The weather is nice today."))`}</CodeBlock>
          <Callout type="tip">
            Recommended: <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">qwen3.6-plus</code> (flagship, agentic coding &amp; reasoning),{' '}
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">qwen3.6-flash</code> (fast / cheap),{' '}
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">qwen3-max</code> (previous flagship), and{' '}
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">qwen-long</code> (1M context).
            All support function calling; pass <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">extra_body=&#123;&quot;preserve_thinking&quot;: True&#125;</code> to keep thought history across agent turns.
          </Callout>
        </SubDoc>

        <SubDoc id="llm-openai" title="OpenAI (GPT-5.1)">
          <p>
            OpenAI&apos;s flagship is <strong>GPT-5.1</strong> (released 2025-11-13) — <strong>400K context</strong>, 128K max output, with a configurable
            <code className="bg-muted px-1 rounded text-xs font-mono">reasoning_effort</code> parameter (none / low / medium / high).
            Also available: <code className="bg-muted px-1 rounded text-xs font-mono">gpt-5.1-chat-latest</code> (the snapshot ChatGPT uses, 128K context, optimised for chat) and <code className="bg-muted px-1 rounded text-xs font-mono">gpt-5-mini</code> (cost-efficient).
            All natively support Function Calling and Structured Outputs.
          </p>

          <p className="font-semibold mt-4 mb-2">Environment</p>
          <CodeBlock filename=".env" lang="bash" locale={L}>{`OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

          <p className="font-semibold mt-4 mb-2">Full example (Python · GPT-5.1 + Chivox MCP)</p>
          <CodeBlock filename="openai_chivox.py" lang="python" locale={L}>{`import os, json, asyncio
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
                 "content": "You are an English speaking coach. Always call the Chivox eval tool first to get real scores."},
                {"role": "user",
                 "content": f"Score this take. audioId={audio_id}, reference: {ref_text}"},
            ]

            resp = client.chat.completions.create(
                model="gpt-5.1",
                messages=messages,
                tools=oa_tools,
                tool_choice="auto",
                reasoning_effort="medium",   # GPT-5.1 only: none / low / medium / high
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
            <strong>Picking a variant:</strong>
            default to <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gpt-5.1</code> with reasoning_effort=&quot;medium&quot; for tool + diagnosis loops;
            use <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gpt-5.1-chat-latest</code> for pure conversational coaching;
            switch to <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gpt-5-mini</code> for high-volume / batch scoring;
            crank reasoning_effort to <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">high</code> for deep multi-step agent planning.
          </Callout>
        </SubDoc>

        <SubDoc id="llm-claude" title="Claude (Anthropic)">
          <p>
            Anthropic&apos;s current flagship is <strong>Claude Opus 4.7</strong>, with <strong>Claude Sonnet 4.6</strong> (balanced) and <strong>Claude Haiku 4.5</strong> (fast).
            Claude uses the <strong>Messages API</strong> (different from OpenAI Chat Completions) and a <code className="bg-muted px-1 rounded text-xs font-mono">tool_use</code> / <code className="bg-muted px-1 rounded text-xs font-mono">tool_result</code> block protocol.
            Tool schemas use the <code className="bg-muted px-1 rounded text-xs font-mono">input_schema</code> field (equivalent to OpenAI&apos;s <code className="bg-muted px-1 rounded text-xs font-mono">parameters</code>).
            Opus 4.5+ adds a new <code className="bg-muted px-1 rounded text-xs font-mono">effort</code> control (low/medium/high) — medium gets you Sonnet 4.5 quality with ~76% fewer tokens.
          </p>

          <p className="font-semibold mt-4 mb-2">Environment</p>
          <CodeBlock filename=".env" lang="bash" locale={L}>{`ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

          <p className="font-semibold mt-4 mb-2">Full example (Python · native Anthropic SDK + MCP bridge)</p>
          <CodeBlock filename="claude_chivox.py" lang="python" locale={L}>{`# pip install anthropic mcp
import os, json, asyncio
from anthropic import Anthropic
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

async def evaluate_with_claude(audio_id: str, ref_text: str):
    async with streamablehttp_client("https://speech-eval.site/mcp") as (r, w, _):
        async with ClientSession(r, w) as mcp:
            await mcp.initialize()

            # Convert MCP tools to Anthropic shape (uses input_schema, not parameters)
            tools = (await mcp.list_tools()).tools
            anth_tools = [{
                "name": t.name,
                "description": t.description,
                "input_schema": t.inputSchema,
            } for t in tools]

            messages = [{"role": "user",
                         "content": f"Score this take: audioId={audio_id}, reference: {ref_text}"}]

            # Tool loop — Claude may emit multiple tool_use blocks across turns
            while True:
                resp = client.messages.create(
                    model="claude-opus-4-7",   # or claude-sonnet-4-6 / claude-haiku-4-5
                    max_tokens=2048,
                    tools=anth_tools,
                    messages=messages,
                    system="You are an English speaking coach. Always call the Chivox eval tool first.",
                )

                # Append the full assistant turn (including tool_use blocks)
                messages.append({"role": "assistant", "content": resp.content})

                if resp.stop_reason != "tool_use":
                    return "".join(b.text for b in resp.content if b.type == "text")

                # Extract every tool_use block, run it, return tool_result
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
            <strong>Picking a variant:</strong>
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">claude-opus-4-7</code> for deep diagnosis &amp; complex agent orchestration (step-change in agentic coding over 4.6);
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">claude-sonnet-4-6</code> for daily tool + diagnosis loop (best price/quality);
            <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">claude-haiku-4-5</code> for high-throughput live feedback.
            Claude is also natively available on AWS Bedrock and Google Vertex AI if you need data residency.
          </Callout>
        </SubDoc>

        <SubDoc id="llm-gemini" title="Gemini (Google)">
          <p>
            Google&apos;s newest is <strong>Gemini 3 Flash</strong> (<code className="bg-muted px-1 rounded text-xs font-mono">gemini-3-flash-preview</code>, Dec 17 2025) — Pro-grade reasoning at Flash latency / cost.
            Also available: <strong>Gemini 3.1 Pro Preview</strong> (frontier flagship) and <strong>Gemini 3.1 Flash-Lite Preview</strong>.
            All support Function Calling, parallel/compositional calls, and a new <code className="bg-muted px-1 rounded text-xs font-mono">thinking_level</code> parameter.
            We recommend the <strong>OpenAI-compatible endpoint</strong> so you can reuse your existing OpenAI SDK + MCP bridge code with zero rewrites.
          </p>

          <p className="font-semibold mt-4 mb-2">Environment</p>
          <CodeBlock filename=".env" lang="bash" locale={L}>{`GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxx
CHIVOX_APP_KEY=your_chivox_app_key
CHIVOX_SECRET_KEY=your_chivox_secret_key`}</CodeBlock>

          <p className="font-semibold mt-4 mb-2">Option 1 — OpenAI-compatible endpoint (recommended, zero migration cost)</p>
          <CodeBlock filename="gemini_openai_compat.py" lang="python" locale={L}>{`import os, json, asyncio
from openai import OpenAI
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

# Gemini OpenAI-compatible endpoint — full OpenAI SDK reuse
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
                         "content": f"Score audioId={audio_id}, reference: {ref_text}"}]

            resp = client.chat.completions.create(
                model="gemini-3-flash-preview",   # or gemini-3.1-pro-preview
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

          <p className="font-semibold mt-4 mb-2">Option 2 — Native google-genai SDK (thinking_level / streaming function calls)</p>
          <CodeBlock filename="gemini_native.py" lang="python" locale={L}>{`# pip install google-genai
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Convert MCP tools to Gemini function_declarations
fn_decls = [{
    "name": t.name,
    "description": t.description,
    "parameters": t.inputSchema,
} for t in tools]

resp = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents=f"Score audioId={audio_id}, reference: {ref_text}",
    config=types.GenerateContentConfig(
        tools=[types.Tool(function_declarations=fn_decls)],
        # Gemini 3+: thinking_level replaces the older thinking_budget
        # thinking_level="high",
    ),
)

# Tool call lives in response.candidates[0].content.parts[0].function_call
fc = resp.candidates[0].content.parts[0].function_call
print(f"call: {fc.name}({dict(fc.args)})  id={fc.id}")`}</CodeBlock>
          <Callout type="tip">
            <strong>Picking a variant:</strong>
            default to <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gemini-3-flash-preview</code> (3× faster than 2.5 Pro at ~$0.50/M input — already the default in the Gemini app);
            use <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gemini-3.1-pro-preview</code> for complex multi-step agents and coding;
            pick <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">gemini-3.1-flash-lite-preview</code> for the cheapest large-context multimodal batches.
          </Callout>
          <Callout type="info">
            <strong>Note:</strong> from Gemini 3 onward every <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">function_call</code> carries a unique <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">id</code>; you must echo it back in the <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">function_response</code> for multi-turn tool use, or the request is rejected. The OpenAI-compatible endpoint handles this automatically.
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
                  <td className="py-2 pr-4 font-medium">DeepSeek V3.2 · non-thinking</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">deepseek-chat</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Best default for tool + diagnosis loop</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">DeepSeek V3.2 · thinking</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">deepseek-reasoner</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes (in chain-of-thought)</td>
                  <td className="py-2">Deep analysis + error attribution</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GLM-5 · flagship</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-5</code> / <code className="bg-muted px-1 rounded font-mono">glm-5.1</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">200K context + agentic orchestration</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GLM-4.7</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-4.7</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Best price/quality for daily diagnosis</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GLM-4-Flash</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">glm-4-flash</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Free dev tier</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Kimi K2.5</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">kimi-k2.5</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">256K + multimodal + agent cluster</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Kimi K2 Thinking</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">kimi-k2-thinking</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Multi-step reasoning + progress reports</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Kimi K2 Turbo</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">kimi-k2-turbo-preview</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Low-latency live feedback</td>
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
                <tr>
                  <td className="py-2 pr-4 font-medium">Qwen 3.6 Plus</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">qwen3.6-plus</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Alibaba flagship — agentic coding &amp; reasoning</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Qwen 3.6 Flash</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">qwen3.6-flash</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Fast / cheap balanced tier</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GPT-5.1 (flagship)</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gpt-5.1</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes (reasoning_effort)</td>
                  <td className="py-2">400K context + deep reasoning + complex agents</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GPT-5.1 Chat</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gpt-5.1-chat-latest</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">ChatGPT snapshot — conversational coaching</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">GPT-5 mini</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gpt-5-mini</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">High-volume / batch scoring</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Claude Opus 4.7</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">claude-opus-4-7</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes (tool_use)</td>
                  <td className="py-2">Anthropic flagship — agentic coding &amp; deep diagnosis</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Claude Sonnet 4.6</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">claude-sonnet-4-6</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">Best price/quality for daily diagnosis loop</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Claude Haiku 4.5</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">claude-haiku-4-5</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes</td>
                  <td className="py-2">High-throughput live feedback</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Gemini 3 Flash</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gemini-3-flash-preview</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes (parallel / compositional)</td>
                  <td className="py-2">Pro-grade reasoning at Flash latency / price</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Gemini 3.1 Pro Preview</td>
                  <td className="py-2 pr-4"><code className="bg-muted px-1 rounded font-mono">gemini-3.1-pro-preview</code></td>
                  <td className="py-2 pr-4 text-emerald-600 dark:text-emerald-400">Yes (thinking_level)</td>
                  <td className="py-2">Frontier flagship for complex multi-step agents</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout type="info">
            Every model except <strong>Claude</strong> (which uses Anthropic&apos;s native SDK with the <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">tool_use</code> / <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">tool_result</code> protocol) can be called through the <strong>OpenAI Python SDK</strong> by swapping <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">base_url</code> + <code className="bg-black/5 dark:bg-white/10 px-1 rounded text-xs font-mono">api_key</code> — no changes needed on the Chivox MCP side.
          </Callout>
        </SubDoc>

      </DocSection>

      <DocSection id="config-rest" icon={Network} title="Non-MCP REST (cvx_fc)">

        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 mb-5 text-sm">
          <p className="font-semibold mb-1.5 flex items-center gap-2"><Network className="h-4 w-4 text-sky-600" /> When this section applies</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Your client <strong className="text-foreground">cannot (or will not) pull in an MCP SDK</strong>: native Android / iOS / Flutter, WeChat / Alipay mini-programs, legacy Java / PHP / Go backends</li>
            <li>You want to treat Chivox as a <strong className="text-foreground">plain REST + WebSocket</strong> service — no JSON-RPC, no stdio proxy</li>
            <li>Internal codename <code className="bg-muted px-1 rounded text-xs font-mono">cvx_fc</code> (OpenAI function-calling style). It targets the <strong className="text-foreground">same evaluation engine</strong> as MCP — they are two parallel entry points</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Rule of thumb: always prefer MCP; drop down to this section only when your client genuinely cannot host an MCP SDK.</p>
        </div>

        <SubDoc id="rest-overview" title="Function-calling overview · endpoints & auth">
          <p>
            Alongside MCP, Chivox exposes an <strong>OpenAI-compatible Function-calling REST API</strong> (internal name <code className="bg-muted px-1 rounded text-xs">cvx_fc</code>). It hits the <strong>same scoring engine</strong> as MCP mode, but speaks pure HTTP / WebSocket with <strong>zero MCP dependencies</strong>.
          </p>

          <Callout type="info">
            <strong>Relationship to MCP mode:</strong> MCP (<code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">POST /mcp</code>, JSON-RPC 2.0) and function-calling (<code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs font-mono">POST /v1/call</code>, REST) are <strong>two parallel entry points</strong> with equivalent capabilities and essentially identical tool/function catalogs.
          </Callout>

          <p className="font-semibold mt-6">API endpoints</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Method</th>
                <th className="text-left py-2 px-3 font-medium">Path</th>
                <th className="text-left py-2 px-3 font-medium">Purpose</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                <tr><td className="py-2 px-3 font-mono text-xs">GET</td><td className="py-2 px-3 font-mono text-xs">/v1/functions</td><td className="py-2 px-3">List all available evaluation functions (equivalent to MCP <code className="bg-muted px-1 rounded text-xs">tools/list</code>)</td></tr>
                <tr><td className="py-2 px-3 font-mono text-xs">POST</td><td className="py-2 px-3 font-mono text-xs">/v1/call</td><td className="py-2 px-3">Invoke a function (equivalent to MCP <code className="bg-muted px-1 rounded text-xs">tools/call</code>) · also used to <strong>create streaming sessions</strong> and <strong>fetch streaming results</strong></td></tr>
                <tr><td className="py-2 px-3 font-mono text-xs">WS</td><td className="py-2 px-3 font-mono text-xs">{'/ws/eval/{session_id}'}</td><td className="py-2 px-3">Streaming audio WebSocket</td></tr>
              </tbody>
            </table>
          </div>

          <p className="font-semibold mt-6">Authentication</p>
          <p>Every request carries the API key via the HTTP header:</p>
          <CodeBlock filename="Header" lang="http" locale={L}>{`Authorization: Bearer <your_api_key>`}</CodeBlock>
          <p className="text-xs text-muted-foreground">Auth failures return <code className="bg-muted px-1 rounded text-xs">401</code> (missing header) or <code className="bg-muted px-1 rounded text-xs">403</code> (invalid key / not entitled). Structured error codes: see <a href="#error-codes" className="text-blue-600 dark:text-blue-400 hover:underline">API reference · error codes</a>.</p>
        </SubDoc>

        <SubDoc id="rest-catalog" title="Function catalog · GET /v1/functions">
          <p>
            Hit <code className="bg-muted px-1 rounded text-xs">GET /v1/functions</code> to fetch every evaluation function <strong>your API key is entitled to</strong>. The response is shaped like an OpenAI function-calling tools catalog, so you can feed it directly into an LLM&apos;s <code className="bg-muted px-1 rounded text-xs">tools</code> argument:
          </p>
          <CodeBlock filename="request" lang="http" locale={L}>{`GET /v1/functions
Authorization: Bearer <api_key>`}</CodeBlock>
          <CodeBlock filename="response.json" lang="json" locale={L}>{`{
  "object": "list",
  "data": [
    {
      "type": "function",
      "function": {
        "name": "en_word_eval",
        "description": "English word pronunciation eval; returns overall score and per-phoneme scores.",
        "parameters": {
          "type": "object",
          "properties": {
            "ref_text":     { "type": "string", "description": "Reference text" },
            "audio_base64": { "type": "string", "description": "Base64-encoded audio (either this or audio_url)" },
            "audio_url":    { "type": "string", "description": "HTTP(S) URL of audio (either this or audio_base64)" },
            "accent":       { "type": "number", "description": "1 = British / 2 = American / 3 = any (default)" },
            "rank":         { "type": "number", "description": "Scoring scale: 4 or 100 (default)" }
          },
          "required": ["ref_text"]
        }
      }
    }
    /* … more functions … */
  ]
}`}</CodeBlock>
          <Callout type="tip">
            This endpoint is semantically equivalent to MCP&apos;s <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">tools/list</code>. <strong>Each API key sees only the functions it&apos;s entitled to</strong> — rely on the live response rather than hard-coding all 19 functions on the client.
          </Callout>

          <p className="font-semibold mt-6">English evaluation functions (10)</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Function</th>
                <th className="text-left py-2 px-3 font-medium">core_type</th>
                <th className="text-left py-2 px-3 font-medium">Purpose</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ['en_word_eval',           'en.word.score',  'Word pronunciation'],
                  ['en_word_correction',     'en.word.pron',   'Word-level pronunciation correction'],
                  ['en_phonics_eval',        'en.nsp.score',   'Phonics evaluation'],
                  ['en_sentence_eval',       'en.sent.score',  'Sentence reading'],
                  ['en_sentence_correction', 'en.sent.pron',   'Sentence-level pronunciation correction'],
                  ['en_vocab_eval',          'en.vocabs.pron', 'Batch vocabulary'],
                  ['en_paragraph_eval',      'en.pred.score',  'Paragraph reading'],
                  ['en_realtime_eval',       'en.rltm.score',  'Real-time reading'],
                  ['en_choice_eval',         'en.choc.score',  'Spoken multiple-choice'],
                  ['en_semi_open_eval',      'en.scne.exam',   'Semi-open (scenario dialogue, etc.)'],
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

          <p className="font-semibold mt-6">Chinese evaluation functions (6)</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Function</th>
                <th className="text-left py-2 px-3 font-medium">core_type</th>
                <th className="text-left py-2 px-3 font-medium">Purpose</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ['cn_word_pinyin_eval', 'cn.word.score',   'Pinyin / character pronunciation'],
                  ['cn_word_raw_eval',    'cn.word.raw',     'Character pronunciation'],
                  ['cn_sentence_eval',    'cn.sent.raw',     'Sentence reading'],
                  ['cn_paragraph_eval',   'cn.pred.raw',     'Paragraph reading'],
                  ['cn_rec_eval',         'cn.rec.raw',      'Bounded-branch recognition'],
                  ['cn_aitalk_eval',      'cn.recscore.raw', 'Spoken expression (AI Talk)'],
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

          <p className="font-semibold mt-6">Streaming functions (3)</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Function</th>
                <th className="text-left py-2 px-3 font-medium">Role</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">start_stream_eval</td>
                  <td className="py-2 px-3">Create a streaming session; returns <code className="bg-muted px-1 rounded text-xs">session_id</code> / <code className="bg-muted px-1 rounded text-xs">ws_url</code> / <code className="bg-muted px-1 rounded text-xs">resume_token</code></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">get_stream_result</td>
                  <td className="py-2 px-3">Fallback fetch: when the WS didn&apos;t deliver <code className="bg-muted px-1 rounded text-xs">result</code>, pull the final score via HTTP</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">stream_eval_result</td>
                  <td className="py-2 px-3 text-muted-foreground">(MCP-side alias; cvx_fc clients use <code className="bg-muted px-1 rounded text-xs">get_stream_result</code>)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Each function&apos;s <strong>business semantics / parameters / response fields</strong> are identical to its same-named MCP tool — refer to <a href="#tools-en" className="text-blue-600 dark:text-blue-400 hover:underline">API reference · English tools</a> and <a href="#tools-cn" className="text-blue-600 dark:text-blue-400 hover:underline">Chinese tools</a> below.
          </p>
        </SubDoc>

        <SubDoc id="rest-oneshot" title="One-shot file evaluation">
          <p>Pass the complete audio via <code className="bg-muted px-1 rounded text-xs">audio_base64</code> or <code className="bg-muted px-1 rounded text-xs">audio_url</code> (either/or) to <code className="bg-muted px-1 rounded text-xs">/v1/call</code>, and the score returns synchronously (semantically equivalent to MCP tools such as <code className="bg-muted px-1 rounded text-xs">evaluate_english_word</code>):</p>
          <CodeBlock filename="curl · English word" lang="bash" locale={L}>{`curl -X POST http://your-host:8080/v1/call \\
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
          <p><strong>Success:</strong></p>
          <CodeBlock filename="response.json" lang="json" locale={L}>{`{
  "name": "en_word_eval",
  "result": {
    "overall": 85.5,
    "details": { /* phonemes / prosody / fluency — identical schema to MCP mode */ }
  }
}`}</CodeBlock>
          <p><strong>Failure:</strong></p>
          <CodeBlock filename="error.json" lang="json" locale={L}>{`{
  "name": "en_word_eval",
  "error": { "message": "human-readable description" }
}`}</CodeBlock>
          <p className="text-xs text-muted-foreground">Single audio payload ≤ 50MB. Recommended: 16 kHz / mono / 16-bit.</p>
        </SubDoc>

        <SubDoc id="rest-streaming" title="Streaming evaluation · 3 steps">
          <div className="rounded-lg border border-border/60 bg-muted/10 p-5 space-y-5 my-3">
            <FlowStep title="1">
              <p><strong>Create session:</strong> <code className="bg-muted px-1 rounded text-xs">POST /v1/call</code> with function name <code className="bg-muted px-1 rounded text-xs">start_stream_eval</code></p>
              <p className="text-muted-foreground mt-1">Response returns <code className="bg-muted px-1 rounded text-xs">session_id</code> / <code className="bg-muted px-1 rounded text-xs">ws_url</code> / <code className="bg-muted px-1 rounded text-xs">resume_token</code>.</p>
            </FlowStep>
            <FlowStep title="2">
              <p><strong>WebSocket push:</strong> connect <code className="bg-muted px-1 rounded text-xs">ws_url</code>, wait for <code className="bg-muted px-1 rounded text-xs">{`{"type":"ready"}`}</code>, then push <strong>binary audio frames</strong>.</p>
              <p className="text-muted-foreground mt-1">You receive <code className="bg-muted px-1 rounded text-xs">intermediate</code> partials while streaming; send <code className="bg-muted px-1 rounded text-xs">{`{"type":"stop"}`}</code> at the end and catch the final <code className="bg-muted px-1 rounded text-xs">result</code>.</p>
            </FlowStep>
            <FlowStep title="3">
              <p><strong>Fallback fetch (optional):</strong> if the WS dropped before the <code className="bg-muted px-1 rounded text-xs">result</code> arrived, call <code className="bg-muted px-1 rounded text-xs">POST /v1/call</code> again with <code className="bg-muted px-1 rounded text-xs">get_stream_result</code>.</p>
            </FlowStep>
          </div>

          <p className="font-semibold mt-4"><code>start_stream_eval</code> parameters</p>
          <ParamTable locale="en" params={[
            { name: 'core_type', type: 'string', required: true, desc: 'Scoring type, e.g. en.sent.score / cn.sent.raw (see English & Chinese tool tables above)' },
            { name: 'ref_text', type: 'string', required: true, desc: 'Reference text' },
            { name: 'audio_type', type: 'string', required: false, desc: 'Audio format: pcm / wav / mp3 (default mp3; pcm recommended for streaming to skip codec overhead)' },
            { name: 'sample_rate', type: 'number', required: false, desc: 'Sample rate, default 16000' },
            { name: 'channel', type: 'number', required: false, desc: '1 = mono (default) / 2 = stereo' },
            { name: 'sample_bytes', type: 'number', required: false, desc: 'Bytes per sample, default 2 (16-bit)' },
            { name: 'accent', type: 'number', required: false, desc: 'English accent: 1 = British / 2 = American / 3 = any (default)' },
            { name: 'age_group', type: 'string', required: false, desc: 'Chinese cohort: adult (default) / child' },
            { name: 'rank', type: 'number', required: false, desc: 'Scoring scale: 4 or 100 (default)' },
          ]} />

          <p className="font-semibold mt-4">WebSocket frame protocol</p>
          <div className="grid sm:grid-cols-2 gap-3 my-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold mb-2">Client → Server</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground leading-relaxed list-none pl-0">
                <li>• <code className="bg-muted px-1 rounded">Binary</code> — raw audio frames; no handshake, start sending once open</li>
                <li>• <code className="bg-muted px-1 rounded">{`{"type":"stop"}`}</code> — end recording</li>
                <li>• <code className="bg-muted px-1 rounded">{`{"type":"ping"}`}</code> — keepalive</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold mb-2">Server → Client</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground leading-relaxed list-none pl-0">
                <li>• <code className="bg-muted px-1 rounded">ready</code> — connection is live; begin sending audio</li>
                <li>• <code className="bg-muted px-1 rounded">intermediate</code> — partial results in real time</li>
                <li>• <code className="bg-muted px-1 rounded">result</code> — final scoring result</li>
                <li>• <code className="bg-muted px-1 rounded">backpressure</code> — slow down; payload carries <code className="bg-muted px-1 rounded">suggested_interval_ms</code></li>
                <li>• <code className="bg-muted px-1 rounded">error</code> — structured <code className="bg-muted px-1 rounded">code</code> + <code className="bg-muted px-1 rounded">message</code> (see <a href="#error-codes" className="underline underline-offset-2">error codes</a>)</li>
                <li>• <code className="bg-muted px-1 rounded">pong</code> — keepalive reply</li>
              </ul>
            </div>
          </div>
        </SubDoc>

        <SubDoc id="rest-examples" title="JS / Android full examples">
          <p className="font-semibold">JavaScript (browser / Node.js)</p>
          <CodeBlock filename="browser-or-node.js" lang="javascript" locale={L}>{`// 1. Create session
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

// 2. WebSocket: push audio
const ws = new WebSocket(result.ws_url);
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  switch (msg.type) {
    case 'ready':        startRecording(); break;
    case 'intermediate': console.log('partial', msg.data); break;
    case 'result':       console.log('final', msg.data); ws.close(); break;
    case 'backpressure': console.warn('slow down ~', msg.suggested_interval_ms, 'ms'); break;
    case 'error':        console.error(msg.code, msg.message); break;
  }
};

function onAudioChunk(pcm) {
  if (ws.readyState === WebSocket.OPEN) ws.send(pcm); // raw binary
}

function stopRecording() {
  ws.send(JSON.stringify({ type: 'stop' }));
}`}</CodeBlock>

          <p className="font-semibold mt-6">Android (OkHttp · Kotlin)</p>
          <CodeBlock filename="AudioEvalClient.kt" lang="kotlin" locale={L}>{`val wsUrl  = "ws://your-host:8080/ws/eval/$sessionId"
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

// Forward PCM bytes from your recorder
fun onAudioData(pcm: ByteArray) {
    ws.send(ByteString.of(*pcm))
}

fun stop() {
    ws.send("""{"type":"stop"}""")
}`}</CodeBlock>
          <Callout type="tip">iOS / Flutter / mini-programs work the same way: as long as the platform ships a WebSocket client, connect to <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">ws_url</code>, stream PCM bytes, and route server messages by the <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">type</code> field.</Callout>
        </SubDoc>

        <SubDoc id="rest-resume" title="Reconnect & fallback fetch">
          <p className="font-semibold">resume_token · 60-second reconnect window</p>
          <p>
            When the client disconnects unexpectedly, the session is <strong>parked for 60 seconds</strong> on the server; reconnect with the <code className="bg-muted px-1 rounded text-xs">resume_token</code> returned at session creation:
          </p>
          <CodeBlock filename="reconnect" lang="http" locale={L}>{`GET ws://your-host:8080/ws/eval/{session_id}?resume={resume_token}
Authorization: Bearer <your_api_key>`}</CodeBlock>
          <Callout type="tip">
            A successful resume yields a fresh <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">ready</code> — keep streaming audio. The server issues a <strong>new resume_token</strong> and invalidates the old one immediately.
          </Callout>

          <p className="font-semibold mt-6">Fallback fetch · get_stream_result</p>
          <p>If the final <code className="bg-muted px-1 rounded text-xs">result</code> never arrived over WS, fetch it over HTTP:</p>
          <CodeBlock filename="fallback-result.sh" lang="bash" locale={L}>{`curl -X POST http://your-host:8080/v1/call \\
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
          <ParamTable locale="en" params={[
            { name: 'session_id', type: 'string', required: true, desc: 'Session ID returned by start_stream_eval' },
            { name: 'auto_stop', type: 'bool', required: false, desc: 'Auto-send stop and wait for the result (default true)' },
            { name: 'timeout', type: 'number', required: false, desc: 'Wait timeout in seconds (default 30)' },
          ]} />

          <Callout type="warning">
            Function-calling mode and MCP mode are <strong>mutually exclusive per session</strong> — do not mix MCP <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/audio/</code> and cvx_fc <code className="bg-white/40 dark:bg-black/30 px-1 rounded text-xs">/ws/eval/</code> against the same session; the two paths have separate session-ID namespaces.
          </Callout>
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
              ['en_word_eval', 'Word scoring', 'Single-word pronunciation', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.score'],
              ['en_word_correction', 'Word correction', 'Detect omissions/extra/wrong phones', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.pron'],
              ['en_vocab_eval', 'Vocabulary scoring', 'Multiple words in one clip', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.vocabs.pron'],
              ['en_sentence_eval', 'Sentence scoring', 'Accuracy + fluency', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.sent.score'],
              ['en_sentence_correction', 'Sentence correction', 'Per-word feedback', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.sent.pron'],
              ['en_paragraph_eval', 'Paragraph read-aloud', 'Long passage quality', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.pred.score'],
              ['en_phonics_eval', 'Phonics scoring', 'Letter-sound rules', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.nsp.score'],
              ['en_choice_eval', 'Oral multiple choice', 'Constrained answers', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.choc.score'],
              ['en_semi_open_eval', 'Semi-open prompt', 'Scenario speaking', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.scne.exam'],
              ['en_realtime_eval', 'Realtime read-aloud', 'Streaming feedback', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.rltm.score'],
            ]}
          />
        </SubDoc>

        <SubDoc id="tools-cn" title="Chinese tools (6)">
          <ToolTable
            locale="en"
            tools={[
              ['cn_word_raw_eval', 'Character scoring', 'Hanzi pronunciation', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.pred.raw'],
              ['cn_word_pinyin_eval', 'Pinyin scoring', 'Syllable-level', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.pred.pny'],
              ['cn_sentence_eval', 'Phrase scoring', 'Short utterances', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.sent.score'],
              ['cn_paragraph_eval', 'Paragraph scoring', 'Long text', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.para.score'],
              ['cn_rec_eval', 'Constrained recognition', 'Pick-one answers', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.asr.rec'],
              ['cn_aitalk_eval', 'AI Talk scoring', 'Open dialog evaluation', 'https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/Chinese/cn.aitalk'],
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
          <p className="font-semibold mb-2">Common symptoms</p>
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

          <p className="font-semibold mt-6 mb-2">HTTP status codes (function-calling mode)</p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium">Meaning</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ['400', 'Malformed request (missing fields / wrong types)'],
                  ['401', 'Unauthenticated (missing Authorization header)'],
                  ['403', 'Forbidden (invalid key or no permission for the requested core_type)'],
                  ['404', 'Session not found (wrong or already-reaped session_id)'],
                  ['409', 'Invalid state for current operation (e.g. audio sent after stop)'],
                ].map(([code, desc]) => (
                  <tr key={code as string}>
                    <td className="py-2 px-3 font-mono text-xs">{code}</td>
                    <td className="py-2 px-3 text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-semibold mt-6 mb-2">Structured streaming error codes</p>
          <p className="text-xs text-muted-foreground mb-2">
            WebSocket <code className="bg-muted px-1 rounded">error</code> frames and the error payload of <code className="bg-muted px-1 rounded">get_stream_result</code> share the same set of codes, making it easy to dispatch client-side handling:
          </p>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Code</th>
                <th className="text-left py-2 px-3 font-medium">Meaning</th>
                <th className="text-left py-2 px-3 font-medium">Suggested action</th>
              </tr></thead>
              <tbody className="divide-y divide-border/30">
                {[
                  ['SESSION_NOT_FOUND', 'Session does not exist', 'Recreate with start_stream_eval / create_stream_session'],
                  ['SESSION_EXPIRED', 'Session expired (idle > 60s)', 'Recreate session'],
                  ['INVALID_STATE', 'Operation not allowed in current state', 'Check call order (e.g. audio after stop)'],
                  ['INVALID_PARAMS', 'Invalid parameters', 'Check core_type / ref_text / sample rate'],
                  ['RESUME_INVALID', 'resume_token invalid or expired', 'Recreate session (each resume issues a fresh token)'],
                  ['AUDIO_TOO_LARGE', 'Audio payload exceeds 50MB', 'Compress or segment before retry'],
                  ['UPSTREAM_CONNECT', 'Scoring engine unreachable', 'Retry later; contact Chivox if persistent'],
                  ['UPSTREAM_TIMEOUT', 'Scoring engine timed out', 'Shorten audio / check network'],
                  ['UPSTREAM_EVAL_ERROR', 'Scoring engine returned an error', 'Inspect the message field'],
                  ['CAPACITY_FULL', 'Concurrent session quota exceeded', 'Back off and retry, or upgrade quota'],
                ].map(([code, desc, fix]) => (
                  <tr key={code as string}>
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
                  <td className="py-2 px-3">Audio upload (used by MCP-mode file evaluation)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">/mcp</td>
                  <td className="py-2 px-3">POST</td>
                  <td className="py-2 px-3">MCP mode · JSON-RPC (Streamable HTTP)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">{'/ws/audio/{session_id}'}</td>
                  <td className="py-2 px-3">WS</td>
                  <td className="py-2 px-3">MCP mode · streaming audio WebSocket</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">/v1/functions</td>
                  <td className="py-2 px-3">GET</td>
                  <td className="py-2 px-3">Function-calling mode · list all scoring functions</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">/v1/call</td>
                  <td className="py-2 px-3">POST</td>
                  <td className="py-2 px-3">Function-calling mode · one-shot eval / create stream session / fetch stream result</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">{'/ws/eval/{session_id}'}</td>
                  <td className="py-2 px-3">WS</td>
                  <td className="py-2 px-3">Function-calling mode · streaming audio WebSocket</td>
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
