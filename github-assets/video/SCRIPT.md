# ChivoxMCP 视频介绍脚本（60–90 秒）

用途：用于 GitHub 头图动图、官网推广视频、或产品发布短片。
结构：6 幕，总时长约 75 秒。可直接用 `index.html`（自动播放幻灯片）作为"动态视频"嵌入 README，或照稿录屏制作 MP4。

---

## 场次拆解

| # | 时长 | 画面（Visual） | 中文旁白 | English VO |
|---|------|----------------|----------|------------|
| 1 | 0–10s | Hero 截图 `home.png`，"让语音评测被大模型读懂" 大字浮入 | 语音评测用了十年，AI 却听不懂分数。 | Speech scoring has existed for a decade — but AI still can't read the scores. |
| 2 | 10–22s | 分屏：左边传统 JSON 分数，右边 LLM 诊断文字 | Chivox MCP 把音素级评测，直接翻译成 LLM 能读懂的结构化数据。 | Chivox MCP turns phoneme-level assessment into structured data your LLM understands. |
| 3 | 22–38s | 文档页截图 `docs.png`，高亮 `mcp.json` 配置代码 | 一条 JSON 配置，Cursor、Claude、扣子、豆包——即刻接入。 | One JSON config. Cursor, Claude, Coze, Doubao — instantly connected. |
| 4 | 38–52s | Demo 页截图 `demo.png`，鼠标点击 "开始录音" | 说一句英文，模型立刻给出音素纠音、流利度和个性化练习。 | Speak one sentence — get phoneme correction, fluency and practice back in seconds. |
| 5 | 52–65s | 场景九宫格（雅思 / K12 / 儿童 / 普通话 / 播客 / 赛事…） | 雅思、K12、普通话、赛事、儿童启蒙、播客——一套 MCP，全场景覆盖。 | IELTS, K12, Mandarin, contests, kids, podcasts — one MCP, every scenario. |
| 6 | 65–75s | Plans 截图 `plans.png` → Logo + `chivoxmcp2.netlify.app` | 免费试用，现在就接入。 | Start free — ship today. |

---

## 字幕速查

- 让语音评测被大模型读懂
- Speech Assessment, Readable to LLMs
- 一条 MCP 调用 · One MCP call
- 音素级纠音进模型 · Phoneme-level correction, in-model
- 闭环口语学习链路 · Closed-loop speaking practice
- 一行配置即上线 · Ship with one line of config

---

## 制作方式

### 方式 A：录屏生成 MP4

1. 本机 `npm run dev` 启动站点
2. macOS: `Cmd+Shift+5` 录屏，按上表依次切换页面：`/zh` → `/zh/docs` → `/zh/demo` → `/zh/dashboard/plans`
3. 用 CapCut / 剪映 / DaVinci Resolve 加字幕和 VO，按上表时间对齐

### 方式 B：使用自动播放幻灯片（推荐快速方案）

直接打开本目录下 `index.html`——它会按时间自动切换截图和字幕，相当于一段 75 秒的"网页视频"。

- 全屏后使用 macOS `Cmd+Shift+5`（或 OBS）**录屏**即可导出 MP4
- 或直接把 `index.html` 放到 `gh-pages` 分支作为线上 Demo 视频

### 方式 C：GIF 图用于 README

```bash
# 需要预装 ffmpeg
ffmpeg -i recording.mov -vf "fps=15,scale=800:-1:flags=lanczos" -loop 0 chivoxmcp-intro.gif
```

把 `chivoxmcp-intro.gif` 放到 `github-assets/` 并在 README 顶部引用即可。

---

## 配乐建议

- **风格**：轻科技 / 干净、节奏 100–120 BPM
- **无版权资源**：
  - YouTube Audio Library → "Inspirational Tech"
  - pixabay.com/music → 搜索 "clean tech logo"
  - freepd.com → Scott Buckley / Kevin MacLeod 的 ambient tech 系列
