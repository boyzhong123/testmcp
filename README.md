<p align="center">
  <a href="github-assets/video/index.html?play=1">
    <img src="github-assets/video-cover.jpg" alt="▶ Watch Chivox MCP Demo" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://chivoxmcp2.netlify.app">
    <img src="https://img.shields.io/badge/🌐_官网_Website-chivoxmcp2.netlify.app-2563EB?style=for-the-badge&logoColor=white" alt="Website" />
  </a>
  &nbsp;&nbsp;
  <a href="https://chivoxmcp2.netlify.app/zh/docs">
    <img src="https://img.shields.io/badge/📖_文档_Docs-Read_Now-10B981?style=for-the-badge" alt="Docs" />
  </a>
  &nbsp;&nbsp;
  <a href="https://chivoxmcp2.netlify.app/zh/demo">
    <img src="https://img.shields.io/badge/🎬_Demo-Try_Live-7C3AED?style=for-the-badge" alt="Demo" />
  </a>
</p>

<h1 align="center">
  <img src="github-assets/logo.png" alt="Chivox MCP" height="48" />
</h1>

<p align="center">
  <strong>让语音评测被大模型读懂</strong><br>
  <em>Exam-grade phoneme-level speech assessment, delivered as Model Context Protocol tools</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/release-v1.0.0-111827?style=flat-square" />
  <img src="https://img.shields.io/badge/license-Apache--2.0-111827?style=flat-square" />
  <img src="https://img.shields.io/badge/MCP-ready-10B981?style=flat-square" />
  <img src="https://img.shields.io/badge/tools-16_tools-7C3AED?style=flat-square" />
  <img src="https://img.shields.io/badge/ISO_27001-certified-2563EB?style=flat-square" />
</p>

---

## 📌 这是什么？

本仓库是 **驰声 Chivox MCP 官方网站**（[chivoxmcp2.netlify.app](https://chivoxmcp2.netlify.app)）的源代码，基于 Next.js 16 + Tailwind CSS 4 + next-intl 构建，支持中英双语。

**Chivox MCP** 把驰声深耕十余年的 **考试级语音评测引擎**，封装为标准 [Model Context Protocol](https://modelcontextprotocol.io) 工具集——一条 MCP 调用，LLM 就能直接拿到 **音素级** 评测数据，自动输出诊断、纠音与个性化练习，无需 SDK 封装、无需翻译层。

> **One MCP call. Phoneme-level results. No SDK wrapping. No translation layer.**

---

## 💡 产品亮点一览

| 维度 | 说明 |
|------|------|
| 🎯 **音素级诊断** | 逐音素打分、时间戳、置信度，自动识别 `normal / omit / insert / mispron` 四类错误 |
| 📊 **多维度评分** | 总分 · 准确度 · 完整度 · 流利度 · 韵律度 · 语速（WPM/SPM）等 20+ 参数 |
| 📚 **考试级精度** | 对齐雅思、TOEFL、K12 中高考、普通话水平测试等真实考试引擎 |
| 🤖 **LLM 原生 JSON** | GPT · Claude · Gemini · 豆包 · DeepSeek · 通义千问 直接消费，无需再解析 |
| ⚡ **实时 + 批量** | 流式边读边反馈 + 音频文件批量处理两种模式可选 |
| 🔄 **教学闭环** | 评测 → LLM 诊断 → 自动生成纠音练习 / 绕口令 / 学习路径 |
| 🔒 **企业级安全** | 全链路 HTTPS/TLS 1.2+，音频即时销毁；ISO 27001 + 等保三级，支持私有化部署 |

---

## 🚀 接入方式：普通人 vs 开发者

**不同人群有不同的"最快路径"。** 无论哪条路，底层走的是**完全相同的 MCP 协议**，能力等价——只是入口不同。

### 🧑‍💼 Part A · 普通人 / 非技术用户（零代码，3 分钟）

> **适合：** 产品经理、运营、教研、培训主管、老师、学生……任何不写代码的人。<br>
> **核心动作：** 在常用的 AI 客户端 / 工作台里"填一段 URL"，保存即用。

#### 🅰️ 姿势一：IDE / 桌面 AI 客户端（Cursor · Claude Desktop · Windsurf · Zed · Continue · Cline …）

最快的方式。以 **Cursor** 为例：

1. 打开 Cursor → `Cmd + ,` → 搜索 **MCP** → 点 **Add new MCP server**
2. 粘贴下面这段 JSON、保存：

```jsonc
{
  "name": "chivox-speech-eval",
  "type": "streamable-http",
  "url": "https://speech-eval.site/mcp"
}
```

3. 重启客户端，在聊天框里说一句：**「帮我评测这段英文发音」**，Cursor 会自动调用工具输出诊断。

> Claude Desktop / Windsurf / Zed / Continue / Cline 等客户端**用同一段配置**，只是入口分别在各自的 `mcp.json` / `settings.json` / Cascade 面板里。

#### 🅱️ 姿势二：可视化 Agent 平台（扣子 Coze · 豆包 · 飞书智能伙伴 · 钉钉 AI 助理 · WorkBuddy …）

像安装手机 App 一样拖拽配置，不用写任何代码。以 **扣子（Coze）** 为例：

1. 打开 [扣子空间](https://space.coze.cn/) 或 Coze 开发平台的 Bot 编辑页
2. 在对话框下方点 **「添加扩展」** → **「自定义」** → 新建 MCP 服务
3. 填入：

   | 配置项 | 值 |
   |--------|------|
   | 名称 | `chivox-speech-eval` |
   | 传输类型 | `streamable-http` |
   | URL | `https://speech-eval.site/mcp` |

4. 保存；对 Agent 说「帮我评测这段发音」即可自动调用。

> 豆包桌面版、飞书智能伙伴、钉钉 AI 助理、通义千问 App、腾讯会议 AI、企业微信智能助手 …… 所有这类**企业 / 日常 AI 工作台**都支持这个流程，入口分别在各自的「智能体扩展 / 插件 / AI 工具箱」。

#### 🅲 姿势三：可视化工作流（Dify · n8n · Flowise · LangFlow · Coze 工作流）

适合想把评测编排进 **多步业务流** 的教研 / 运营团队（例：学员录音 → 评测 → 错题集 → 推送到 CRM）。

1. 在 Dify「工具」→「自定义 MCP」、n8n 的 **MCP Client** 节点、Flowise 的 **MCP Tool** 节点中
2. Transport 选 **HTTP Stream / Streamable HTTP**，URL 填 `https://speech-eval.site/mcp`
3. 保存后，16 个评测工具会以下拉选项自动出现在节点里，**拖线连上就能跑**

> 优势：流程可追溯、可回放、支持批量；适合机构做考评报表与数据归集。

👉 [免费获取 API Key](https://chivoxmcp2.netlify.app/zh/dashboard/keys) · [完整零代码接入文档](https://chivoxmcp2.netlify.app/zh/docs#config)

---

### 👨‍💻 Part B · 开发者（代码接入，10 分钟上线）

> **核心心智模型：** 开发者只做两件事 ——
> **① 在后端填一次 MCP 配置** · **② 写一段 System Prompt**。<br>
> 其它所有事情（音频上传、鉴权、工具发现、调用时机、返回格式、结果整合）都由 MCP 协议 + 大模型自动完成。

#### 🅳 姿势四：Agent 框架 / SDK（LangChain · Mastra · AutoGen · CrewAI · LlamaIndex · Spring AI · openai-agents …）

适合用主流 Agent 框架构建独立 APP / 小程序的开发者。在框架的 `mcp.json` 里加一个节点即可：

```jsonc
{
  "mcpServers": {
    "chivox_voice_eval": {
      "type": "streamable-http",
      "url": "https://speech-eval.site/mcp",
      "env": {
        "API_KEY": "你的专属密钥"
      }
    }
  }
}
```

重启服务后，**16 个评测工具会自动注册** 成 LLM 随时可调的 tools；驰声后续新增工具你**一行代码都不用改**。

| 框架 | 接入方式 |
|------|----------|
| **LangChain / LlamaIndex** | `MCPToolkit` 插件 |
| **Mastra** | MCP plugin config |
| **AutoGen / CrewAI** | MCP tool adapter |
| **openai-agents / mcp-use** | 原生支持 |
| **Spring AI**（Java） | MCP starter |

#### 🅴 姿势五：原生 Function Calling（DeepSeek · 豆包 · OpenAI · Claude · Gemini · GLM · KIMI · Qwen）

不使用任何 Agent 框架，直接调 LLM API 的后端同学。**强烈推荐用 MCP 客户端库自动发现工具**（驰声加新工具，你的代码无需修改）：

```python
import asyncio, os, json
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
                    {"role": "system", "content": "你是英语老师，收到评测结果后温柔反馈。"},
                    {"role": "user",   "content": "我读了 Apple，录音 https://demo.com/u1.mp3"},
                ],
                tools=tools,
                tool_choice="auto",
            )

            msg = resp.choices[0].message
            if msg.tool_calls:
                call = msg.tool_calls[0]
                result = await session.call_tool(
                    call.function.name,
                    arguments=json.loads(call.function.arguments),
                )

asyncio.run(main())
```

> 若想更省心，直接用 [官方 MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)、`mcp-use`、`openai-agents`、火山 `Arkitect`，它们把"MCP → Function Calling"的桥接完全封装好了。

👉 [完整开发者文档与示例代码](https://chivoxmcp2.netlify.app/zh/docs#config-code)

---

### 📋 一图看懂怎么选

| 你是谁 / 场景 | 推荐姿势 | 写代码吗？ |
|----------------|----------|-----------|
| 产品经理 / 运营，想快速验证想法 | 🅱️ 扣子 / 飞书智能伙伴 | ❌ 不用 |
| 老师 / 教研，需要批量评测 + 报表 | 🅲 Dify / n8n 工作流 | ❌ 不用 |
| 程序员日常用 Cursor / Claude Desktop | 🅰️ IDE 客户端 `mcp.json` | ❌ 不用 |
| 做 AI APP / 小程序，用 Agent 框架 | 🅳 LangChain / Mastra MCP 插件 | ✅ 少量 |
| 做高并发后端，直接调 LLM API | 🅴 MCP 客户端库 + Function Calling | ✅ 生产级 |

---

## 🛠 MCP 工具能力（16 个）

### 英文评测（10）

| 工具 | 用途 |
|------|------|
| `en_word_eval` | 单词发音评测（准确度 + 音素级） |
| `en_word_correction` | 单词纠音（漏读/多读/错读检测） |
| `en_vocab_eval` | 多单词词汇表评测 |
| `en_sentence_eval` | 句子准确度与流利度评测 |
| `en_sentence_correction` | 逐词错误检测 + 纠音建议 |
| `en_paragraph_eval` | 段落朗读综合评测 |
| `en_phonics_eval` | 自然拼读规则掌握度评测 |
| `en_choice_eval` | 口头选择题识别（预设选项） |
| `en_semi_open_eval` | 半开放对话 / 情景口语评测 |
| `en_realtime_eval` | 实时朗读逐句反馈 |

### 中文评测（6）

| 工具 | 用途 |
|------|------|
| `cn_word_raw_eval` | 汉字发音评测 |
| `cn_word_pinyin_eval` | 拼音发音评测 |
| `cn_sentence_eval` | 词语 / 句子朗读评测 |
| `cn_paragraph_eval` | 段落朗读综合评测 |
| `cn_rec_eval` | 有限分支识别（预设选项） |
| `cn_aitalk_eval` | 中文口语对话能力评测 |

### 统一返回结构（节选）

```jsonc
{
  "overall": 88,          // 综合分
  "accuracy": 91,         // 准确度
  "fluency": 85,          // 流利度
  "integrity": 90,        // 完整度
  "details": [
    {
      "phone": "th",
      "score": 72,
      "dp_type": "mispron",   // normal | omit | insert | mispron
      "begin_time": 0.24,
      "end_time": 0.38
    }
  ]
}
```

> 音频输入支持三种方式：`audio_file_path` · `audio_base64` · `audio_url`

---

## 🎯 典型落地场景

| 教育 | 企业 | 内容 / 硬件 |
|------|------|-------------|
| 🎓 雅思 / TOEFL 口语备考 | 👩‍🏫 企业英语培训 | 🎙️ 播客 / 有声书质检 |
| 📚 K12 中英课堂听说 | 🤖 客服坐席话术打分 | 🧒 儿童启蒙点读机 |
| 🇨🇳 普通话水平测试 | 💬 IM 练口 chatbot | 🧩 开发者生态集成 |
| 🏆 演讲赛事自动评分 | 🏢 多语种员工能力盘点 | 🚗 车载语音练习 |

---

## 🧭 工作流程（从音频到教学反馈，4 步闭环）

1. **语音输入** — 用户朗读指定文本，音频经 MCP 服务实时处理
2. **多维评测** — 返回准确度、流利度、重弱读、韵律等 20+ 维参数
3. **LLM 分析** — 大模型消费结构化评测数据，结合 Prompt 生成诊断报告
4. **教学闭环** — 输出纠音建议、跟读素材与个性化学习路径

演示效果可在 [在线 Demo](https://chivoxmcp2.netlify.app/zh/demo) 直接体验（无需注册）。

---

## 💳 定价与套餐

| 套餐 | 适用场景 |
|------|----------|
| **Starter**（免费） | 原型验证 · 个人体验 |
| **Standard** | 商业生产环境 |
| **Growth** | 流量增长 · 首档折扣 |
| **Scale** | 高并发 · 更大折扣 |
| **Enterprise** | 私有化部署 · 定制 SLA · 7×24 支持 |

→ [查看套餐详情](https://chivoxmcp2.netlify.app/zh/dashboard/plans)

---

## 📸 产品截图

<table>
  <tr>
    <td align="center"><b>首页</b><br><img src="github-assets/screenshots/home.png" width="400"/></td>
    <td align="center"><b>开发者文档</b><br><img src="github-assets/screenshots/docs.png" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>在线 Demo</b><br><img src="github-assets/screenshots/demo.png" width="400"/></td>
    <td align="center"><b>定价套餐</b><br><img src="github-assets/screenshots/plans.png" width="400"/></td>
  </tr>
</table>

---

## 🧩 关于本网站（开发者信息）

本仓库是上述产品的 **官方网站代码**，非 MCP 服务端本体。网站基于以下技术：

- **框架**：Next.js 16（App Router）+ React 19
- **样式**：Tailwind CSS 4 + shadcn/ui + framer-motion
- **国际化**：next-intl（中英双语）
- **部署**：Netlify（站点：`chivoxmcp2`）

### 本地开发

```bash
npm install
npm run dev
```

浏览器打开 <http://localhost:3000> 即可预览。

### 生产部署

```bash
netlify deploy --prod --build
```

> 部署细节、分支策略与版本打标请参考仓库内 `AGENTS.md`。

---

## 🏢 关于驰声

苏州驰声信息科技有限公司专注于智能语音评测技术研发，深耕教育科技领域多年：

- **14** 项业界首发技术
- **13** 年中高考实践经验
- **100+** 城市考试系统适配

我们致力于将先进的语音识别与评测能力通过标准化协议输出，让每一位开发者都能轻松构建专业的语音教学应用。

---

<div align="center">

由 <b>驰声科技 Chivox</b> 出品 · Apache-2.0 License<br>
<a href="https://chivoxmcp2.netlify.app"><b>chivoxmcp2.netlify.app</b></a> · v1.0.0

</div>
