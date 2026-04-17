import type { QType, Sample } from './demo-sample-types';

export const SAMPLES_EN: Record<QType, Sample> = {
  word: {
    kind: 'pron',
    label: 'Word',
    desc: 'Word · phoneme-level scoring',
    apiTag: 'en.word.score',
    refText: 'particular',
    overall: 58,
    scores: { accuracy: 45, integrity: 100, fluency: 100 },
    details: [
      {
        char: 'particular',
        score: 45,
        dp_type: 'mispron',
        phonemes: [
          { char: 'p', score: 92, dp_type: 'normal' },
          { char: 'ə', score: 60, dp_type: 'normal' },
          { char: 'ˈt', score: 40, dp_type: 'mispron' },
          { char: 'ɪ', score: 35, dp_type: 'mispron' },
          { char: 'k', score: 90, dp_type: 'normal' },
          { char: 'j', score: 55, dp_type: 'mispron' },
          { char: 'ʊ', score: 48, dp_type: 'mispron' },
          { char: 'l', score: 85, dp_type: 'normal' },
          { char: 'ə', score: 70, dp_type: 'normal' },
          { char: 'r', score: 62, dp_type: 'normal' },
        ],
      },
    ],
    analysisPrompt: `You are a professional English pronunciation coach. Below is **word-level** exam-grade data from the Chivox MCP API (en.word.score): one headword, overall + pron scores, and a phoneme array with per-phoneme score and dp_type.

## Task
Write a **learner-facing** diagnosis of this single word. Tie every claim to phoneme scores (cite symbols). Assume the learner can read IPA-lite labels in the payload.

## Method
- Group phonemes by **dp_type**; treat **mispron** first, then borderline **normal** scores below 70 if they explain the word score.
- For each problem phoneme: **typical L1 interference**, **what it sounds like now**, **one concrete articulation fix** (jaw, tongue, airstream, lip rounding).
- Respect **lexical stress** if marked (e.g. ˈ): mis-stress counts as a rhythm issue even when individual phones look fine.
- Cap at **four** numbered issues, ordered **weakest → strongest** impact on intelligibility.

## Output shape
Short Markdown: optional one-line summary, then numbered items, then a single-line **🎯 Priority** ranking.

## Tone
Friendly, concrete, actionable — no empty cheerleading.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``,
    analysisOutput: `The hardest parts of "particular" are the middle syllable /tɪk/ and the /jʊ/ glide. Fix in this order:

① /ˈtɪ/ (stressed syllable) — scores 40/35. You reduced it toward /tə/, losing stress. Stretch /ɪ/: p-ə-ˈTEE-k-... until the stress lands.

② /jʊ/ — scores 55/48. The tongue does not approach the palate before /ʊ/, so it sounds like /ə/. Compare "use /juːz/" vs "us /ʌs/".

③ First /ə/ — score 60. Jaw is tight; relax it.

🎯 Priority: ˈtɪ > jʊ > ə₁`,
    practicePrompt: `You are still the same learner's coach. The **second-pass diagnosis** already lists weak phonemes — generate **micro-drills** that map 1:1 to those weaknesses (no generic packs).

## Output JSON (single valid JSON array only; no prose outside it)
Root must be an **array** of objects, each with **category** (string), **icon** (one emoji), and **items** (array of { "label", "content" }):
\`\`\`json
[
  { "category": "Phoneme drills", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Awareness", "icon": "🗣️", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Whole word", "icon": "📝", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## Rules
- **Phoneme drills**: for each **mispron** phoneme from the diagnosis, at least **one** minimal pair or near-minimal pair **and** one short tongue-twister or repetition line that reuses the sound.
- **Awareness**: one item that targets **stress** or **jaw/tongue posture** if stress was weak.
- **Whole word**: **2–3** natural sentences that include the headword in different positions (initial / medial / final).
- All **content** strings must be speakable aloud; no nested JSON inside strings.
`,
    practice: [
      {
        category: 'Phoneme drills',
        icon: '🎯',
        items: [
          { label: '/ɪ/ vs /i:/ minimal pairs', content: 'sit / seat · bit / beat · pick / peak (short vowel first, then long)' },
          { label: '/jʊ/ glide', content: 'pure · cure · mature · furious (tongue to palate, then glide)' },
        ],
      },
      {
        category: 'Awareness',
        icon: '🗣️',
        items: [
          { label: 'Stress check', content: 'Mirror-read par-TIC-u-lar; feel the second syllable open widest' },
        ],
      },
      {
        category: 'Whole word',
        icon: '📝',
        items: [
          { label: 'Sentence 1', content: 'Are you looking for anything in particular?' },
          { label: 'Sentence 2', content: 'This particular issue needs our attention.' },
        ],
      },
    ],
  },

  sentence: {
    kind: 'pron',
    label: 'Sentence',
    desc: 'Sentence · word + phoneme level',
    apiTag: 'en.sent.score',
    refText: 'The quick brown fox jumps over the lazy dog.',
    overall: 72,
    scores: { accuracy: 65, integrity: 95, fluency: 85, rhythm: 70 },
    speed: 130,
    details: [
      {
        char: 'The',
        score: 55,
        dp_type: 'mispron',
        phonemes: [
          { char: 'ð', score: 32, dp_type: 'mispron' },
          { char: 'ə', score: 78, dp_type: 'normal' },
        ],
      },
      { char: 'quick', score: 88, dp_type: 'normal' },
      { char: 'brown', score: 82, dp_type: 'normal' },
      {
        char: 'fox',
        score: 62,
        dp_type: 'mispron',
        phonemes: [
          { char: 'f', score: 90, dp_type: 'normal' },
          { char: 'ɒ', score: 45, dp_type: 'mispron' },
          { char: 'k', score: 85, dp_type: 'normal' },
          { char: 's', score: 88, dp_type: 'normal' },
        ],
      },
      { char: 'jumps', score: 90, dp_type: 'normal' },
      {
        char: 'over',
        score: 66,
        dp_type: 'mispron',
        phonemes: [
          { char: 'ˈoʊ', score: 48, dp_type: 'mispron' },
          { char: 'v', score: 88, dp_type: 'normal' },
          { char: 'ə', score: 72, dp_type: 'normal' },
          { char: 'r', score: 70, dp_type: 'normal' },
        ],
      },
      { char: 'the', score: 58, dp_type: 'mispron' },
      { char: 'lazy', score: 85, dp_type: 'normal' },
      { char: 'dog', score: 80, dp_type: 'normal' },
    ],
    analysisPrompt: `You are a professional English pronunciation coach. Below is **sentence-level** exam-grade data from Chivox MCP (en.sent.score): refText, overall, pron sub-scores (accuracy, integrity, fluency, rhythm), optional **speed** (e.g. WPM), and **details[]** with per-token scores, dp_type, and optional phonemes[].

## Task
Produce a **structured, learner-readable** diagnosis of this single sentence. Open with a compact **scoreboard line** (overall + sub-scores + speed if present), then move from **phones → words → prosody**.

## Checklist (cover each; say "none material" if not applicable)
1. **Segmental**: for each token with score under 70 or dp_type not "normal", open **phonemes** when present; name the likely error (e.g. /ð/ realized as /d/) and one fix.
2. **Omissions / insertions**: flag dp_type **omit** / **insert** and how they affect integrity.
3. **Prosody**: use **rhythm** + stressed syllables in mispronounced words — misplaced lexical stress, flat intonation on declaratives, choppy chunking.
4. **Fluency vs accuracy**: if fluency is high but accuracy low, say so explicitly (helps learners prioritize).

## Output format
Use Markdown subheads such as **Pronunciation**, **Prosody**, **Study priority** (one short ranked line, highest ROI first).

## Tone
Like a human coach: concrete, non-jargony where possible, actionable.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``,
    analysisOutput: `🎙️ Overall 72 · integrity 95 (almost full read) · fluency 85 · accuracy 65 (main issue) · rhythm 70.

Pronunciation (phoneme level)
① /ð/ in "the" — often realized as /z/ or /d/. Light bite: tongue tip to lower front teeth, air through the gap.

② /ɒ/ in "fox" — score 45. Open your jaw; it sounds like /ʌ/. Think "ah-oh" transition.

③ /oʊ/ in "over" — start from /o/, not /ə/. Lengthen: "OH-ver".

Prosody
④ Stress on "over" should be on the first syllable; rhythm 70 is dragged down here.
⑤ Declarative sentence: fall on "dog" ↘; your pitch is a bit flat.

🎯 Priority: /ð/ > /ɒ/ > "over" stress. /ð/ is high-frequency — best ROI.`,
    practicePrompt: `You are still the same learner's coach. A **second-pass diagnosis** already exists for this sentence — design drills **only from weaknesses it names** (specific phonemes, words, and prosody flags).

## Task
Emit **sentence-level** practice: phoneme contrast + shadowing + a timed challenge that references the learner's current pace from MCP **speed** when available.

## Output JSON (single valid JSON array only; no prose outside it)
Each element: **category** (string), **icon** (one emoji), **items** (array of { "label", "content" }). Use **three** top-level categories for a stable UI:
\`\`\`json
[
  { "category": "Phoneme drills", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Prosody", "icon": "🎵", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Challenge", "icon": "📈", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## Rules
- **Phoneme drills**: for each **mispron** phoneme called out in the diagnosis, include **at least** one minimal-pair or near-pair line **and** one short tongue-twister or dense repetition line.
- **Prosody**: one shadowing line with **CAPS** for lexical stress and a **↘** or **↗** cue on the clause that needs clearer intonation.
- **Challenge**: one **timed read** of the same refText (or a shortened variant) with a WPM target ±5–10 of the reported speed, plus one success criterion (e.g. "keep /ð/ audible").
- Keep every **content** string plain text suitable for on-screen display.
`,
    practice: [
      {
        category: 'Phoneme drills',
        icon: '🎯',
        items: [
          {
            label: '/θ /ð/ tongue twister',
            content: 'The thirty-three thieves thought that they thrilled the throne throughout Thursday.',
          },
          { label: '/ɒ/ vs /ʌ/', content: 'fox / fux · cot / cut · pot / putt (wider jaw for /ɒ/)' },
        ],
      },
      {
        category: 'Prosody',
        icon: '🎵',
        items: [
          {
            label: 'Stress-marked shadowing',
            content: "The 'quick 'brown 'fox 'jumps 'OVER the 'lazy 'DOG↘ (CAPS = stress, ↘ fall)",
          },
        ],
      },
      {
        category: 'Challenge',
        icon: '📈',
        items: [
          {
            label: 'Timed read',
            content: 'Read the line in ~3.8s, target ~135 WPM (vs 130 now), keep /ð/ clear',
          },
        ],
      },
    ],
  },

  paragraph: {
    kind: 'pron',
    label: 'Paragraph',
    desc: 'Paragraph · discourse + rhythm',
    apiTag: 'en.pred.score',
    refText:
      'Every morning, I wake up at seven and make myself a quick breakfast. After that, I walk along the river to the office, watching the boats pass by. The fresh air really helps me focus and think through the day ahead. Sometimes I stop at a small coffee shop to grab a flat white before I arrive. By then, I feel energized and ready to tackle whatever comes my way.',
    overall: 74,
    scores: { accuracy: 72, integrity: 86, fluency: 78, rhythm: 73 },
    speed: 132,
    details: [
      { char: 'Every', score: 86, dp_type: 'normal' },
      { char: 'morning', score: 80, dp_type: 'normal' },
      { char: 'I', score: 88, dp_type: 'normal' },
      { char: 'wake', score: 82, dp_type: 'normal' },
      { char: 'up', score: 85, dp_type: 'normal' },
      { char: 'at', score: 84, dp_type: 'normal' },
      {
        char: 'seven',
        score: 66,
        dp_type: 'mispron',
        phonemes: [
          { char: 's', score: 90, dp_type: 'normal' },
          { char: 'ˈe', score: 58, dp_type: 'mispron' },
          { char: 'v', score: 82, dp_type: 'normal' },
          { char: 'ə', score: 60, dp_type: 'mispron' },
          { char: 'n', score: 88, dp_type: 'normal' },
        ],
      },
      { char: 'and', score: 78, dp_type: 'normal' },
      { char: 'make', score: 84, dp_type: 'normal' },
      { char: 'myself', score: 80, dp_type: 'normal' },
      { char: 'a', score: 82, dp_type: 'normal' },
      { char: 'quick', score: 86, dp_type: 'normal' },
      {
        char: 'breakfast',
        score: 58,
        dp_type: 'mispron',
        phonemes: [
          { char: 'ˈb', score: 82, dp_type: 'normal' },
          { char: 'r', score: 60, dp_type: 'normal' },
          { char: 'e', score: 45, dp_type: 'mispron' },
          { char: 'k', score: 88, dp_type: 'normal' },
          { char: 'f', score: 42, dp_type: 'mispron' },
          { char: 'ə', score: 70, dp_type: 'normal' },
          { char: 's', score: 84, dp_type: 'normal' },
          { char: 't', score: 86, dp_type: 'normal' },
        ],
      },
      { char: 'After', score: 82, dp_type: 'normal' },
      { char: 'that', score: 78, dp_type: 'normal' },
      { char: 'I', score: 90, dp_type: 'normal' },
      { char: 'walk', score: 82, dp_type: 'normal' },
      { char: '', score: 0, dp_type: 'omit' },
      { char: 'the', score: 70, dp_type: 'normal' },
      { char: 'river', score: 88, dp_type: 'normal' },
      { char: 'to', score: 84, dp_type: 'normal' },
      { char: 'the', score: 72, dp_type: 'normal' },
      { char: 'office', score: 80, dp_type: 'normal' },
      { char: 'watching', score: 83, dp_type: 'normal' },
      { char: 'the', score: 74, dp_type: 'normal' },
      { char: 'boats', score: 82, dp_type: 'normal' },
      { char: 'pass', score: 80, dp_type: 'normal' },
      { char: 'by', score: 86, dp_type: 'normal' },
      { char: 'The', score: 72, dp_type: 'normal' },
      { char: 'fresh', score: 86, dp_type: 'normal' },
      { char: 'air', score: 84, dp_type: 'normal' },
      { char: 'really', score: 74, dp_type: 'normal' },
      { char: 'helps', score: 82, dp_type: 'normal' },
      { char: 'me', score: 88, dp_type: 'normal' },
      { char: 'focus', score: 85, dp_type: 'normal' },
      { char: 'and', score: 80, dp_type: 'normal' },
      {
        char: 'think',
        score: 62,
        dp_type: 'mispron',
        phonemes: [
          { char: 'θ', score: 48, dp_type: 'mispron' },
          { char: 'ɪ', score: 80, dp_type: 'normal' },
          { char: 'ŋ', score: 78, dp_type: 'normal' },
          { char: 'k', score: 86, dp_type: 'normal' },
        ],
      },
      {
        char: 'through',
        score: 60,
        dp_type: 'mispron',
        phonemes: [
          { char: 'θ', score: 45, dp_type: 'mispron' },
          { char: 'r', score: 72, dp_type: 'normal' },
          { char: 'uː', score: 82, dp_type: 'normal' },
        ],
      },
      { char: 'the', score: 70, dp_type: 'normal' },
      { char: 'day', score: 88, dp_type: 'normal' },
      { char: 'ahead', score: 82, dp_type: 'normal' },
      { char: 'Sometimes', score: 78, dp_type: 'normal' },
      { char: 'I', score: 88, dp_type: 'normal' },
      { char: 'stop', score: 86, dp_type: 'normal' },
      { char: 'at', score: 84, dp_type: 'normal' },
      { char: 'a', score: 82, dp_type: 'normal' },
      { char: 'small', score: 84, dp_type: 'normal' },
      {
        char: 'coffee',
        score: 64,
        dp_type: 'mispron',
        phonemes: [
          { char: 'k', score: 88, dp_type: 'normal' },
          { char: 'ˈɒ', score: 50, dp_type: 'mispron' },
          { char: 'f', score: 82, dp_type: 'normal' },
          { char: 'i', score: 78, dp_type: 'normal' },
        ],
      },
      { char: 'shop', score: 80, dp_type: 'normal' },
      { char: 'to', score: 84, dp_type: 'normal' },
      { char: 'grab', score: 82, dp_type: 'normal' },
      { char: 'a', score: 80, dp_type: 'normal' },
      { char: 'flat', score: 82, dp_type: 'normal' },
      { char: 'white', score: 85, dp_type: 'normal' },
      { char: 'before', score: 82, dp_type: 'normal' },
      { char: 'I', score: 88, dp_type: 'normal' },
      { char: 'arrive', score: 80, dp_type: 'normal' },
      { char: 'By', score: 86, dp_type: 'normal' },
      { char: 'then', score: 78, dp_type: 'normal' },
      { char: 'I', score: 88, dp_type: 'normal' },
      { char: 'feel', score: 84, dp_type: 'normal' },
      {
        char: 'energized',
        score: 68,
        dp_type: 'mispron',
        phonemes: [
          { char: 'ˈe', score: 58, dp_type: 'mispron' },
          { char: 'n', score: 82, dp_type: 'normal' },
          { char: 'ə', score: 72, dp_type: 'normal' },
          { char: 'dʒ', score: 84, dp_type: 'normal' },
          { char: 'aɪ', score: 78, dp_type: 'normal' },
          { char: 'z', score: 80, dp_type: 'normal' },
          { char: 'd', score: 82, dp_type: 'normal' },
        ],
      },
      { char: 'and', score: 80, dp_type: 'normal' },
      { char: 'ready', score: 84, dp_type: 'normal' },
      { char: 'to', score: 86, dp_type: 'normal' },
      { char: 'tackle', score: 80, dp_type: 'normal' },
      {
        char: 'whatever',
        score: 70,
        dp_type: 'mispron',
        phonemes: [
          { char: 'w', score: 82, dp_type: 'normal' },
          { char: 'ɒ', score: 68, dp_type: 'normal' },
          { char: 't', score: 84, dp_type: 'normal' },
          { char: 'ˈe', score: 60, dp_type: 'mispron' },
          { char: 'v', score: 80, dp_type: 'normal' },
          { char: 'ə', score: 72, dp_type: 'normal' },
        ],
      },
      { char: 'comes', score: 82, dp_type: 'normal' },
      { char: 'my', score: 88, dp_type: 'normal' },
      { char: 'way', score: 86, dp_type: 'normal' },
    ],
    analysisPrompt: `You are a professional English pronunciation coach. Below is **paragraph-level** data from Chivox MCP (en.pred.score): long refText, overall, pron sub-scores, optional **speed**, **integrity**, and many **details[]** rows (tokens may repeat across clauses; some rows may be empty char for **omit**).

## Task
Diagnose the **whole passage in context**: (a) completeness / skipping, (b) recurring **phoneme families**, (c) rhythm & chunking, (d) how sub-scores agree or disagree.

## Checklist
1. **Integrity / dp_type**: list every **omit** / **insert** with clause context; explain why function words disappear in long reads.
2. **Segmental clusters**: group weak tokens by shared phoneme issue (/θ/ chain, /e/ chain, /ɒ/, weak stress on ˈe, etc.); cite example words from details.
3. **Prosody**: use **rhythm** + punctuation — flag over-pausing inside phrases, or missing boundaries before new clauses.
4. **Global coherence**: if **fluency** looks fine but **accuracy** is weak (or vice versa), call it out and say what that implies for practice design.

## Output format
Markdown sections such as **Summary**, **Completeness**, **Pronunciation (families)**, **Rhythm**, **Study priorities** (≤4 bullets, most impactful first).

## Tone
Exam-aware but supportive; every bullet should suggest **what to rehearse next**.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``,
    analysisOutput: `Overall 74 — main tension between accuracy 72 and integrity 86: scattered phoneme issues plus one clear omission.

Completeness
⚠ "along" is missing after "walk" — weak prepositions are often swallowed; dp_type=omit catches this.

Pronunciation (families)
① /θ/: "think", "through" — both weak; tongue not at teeth.
② /e/: "breakfast", "seven", "energized", "whatever" — /e/ toward /æ/ or weak stress.
③ /ɒ/: "coffee" — jaw not open enough.

Rhythm
rhythm 73; commas ~0.3s, periods ~0.5s. Chunk "along the river" as one phrase.

Priority
1) Stabilize /e/ and /ɒ/
2) /θ/ (high frequency)
3) Prepositions inside chunks, not isolated pauses
4) Polish prosody last`,
    practicePrompt: `You are still the same learner's coach. The **second-pass paragraph diagnosis** already names omission spots and phoneme families — build **passage-length** practice that chains those families instead of isolated minimal pairs only.

## Task
Return drills that move **sound → phrase → paragraph**: family chains, **chunk maps** that glue weak function words, and a **metacognitive** record–replay step.

## Output JSON (single valid JSON array only; no prose outside it)
Each element: **category**, **icon** (one emoji), **items** (array of { "label", "content" }). Default to **three** categories:
\`\`\`json
[
  { "category": "Phoneme families", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Chunking", "icon": "🎵", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Metacognition", "icon": "🧠", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## Rules
- **Phoneme families**: at least **three items** total across the category, grouping minimal pairs / word chains that reuse the diagnosed families (/θ/, /e/, /ɒ/, etc.).
- **Chunking**: include one **bracketed chunk map** of the passage (use [ ] and / or // with rough pause hints in seconds) and one item that **targets any omitted preposition / function word** by embedding it inside a phrase (not drilling it alone).
- **Metacognition**: one item that prescribes **record → replay → compare to MCP details** for N passes (N explicit, 2–3).
- All strings are plain display text; no nested JSON.
`,
    practice: [
      {
        category: 'Phoneme families',
        icon: '🎯',
        items: [
          {
            label: '/e/ chain',
            content: 'bed · red · said · breakfast · seven · energy · whatever',
          },
          {
            label: '/θ/ minimal pairs',
            content: 'think / sink · through / true · thin / sin',
          },
          {
            label: '/ɒ/',
            content: 'coffee · office · stop · shop',
          },
        ],
      },
      {
        category: 'Chunking',
        icon: '🎵',
        items: [
          {
            label: 'Chunk map',
            content: '[Every morning] / [I wake up at seven] … // [I walk along the river] / [to the office]',
          },
          {
            label: 'Prepositions',
            content: 'Glue "along the river", "through the day", "by then" — no pause on each word',
          },
        ],
      },
      {
        category: 'Metacognition',
        icon: '🧠',
        items: [
          {
            label: 'Record & replay',
            content: 'Read 3×; each time mark omissions/errors you hear, then compare to MCP details',
          },
        ],
      },
    ],
  },

  semiopen: {
    kind: 'semi',
    label: 'Semi-open',
    desc: 'Semi-open · English only',
    apiTag: 'en.pqan.score',
    refText: 'Topic: Describe your daily morning routine.',
    transcript:
      'Usually I wake up at seven, and then I eat breakfast quickly. After that I walk to work. I like the fresh air in the morning.',
    overall: 71,
    scores: { grammar: 78, content: 62, fluency: 75, pron: 72 },
    speed: 118,
    issues: [
      { level: 'warn', label: 'Thin content', detail: 'Only four ideas (wake, breakfast, walk, air) — no why, feeling, or contrast' },
      { level: 'warn', label: 'Simple syntax', detail: 'All simple SVO; no subordination or richer connectors' },
      { level: 'ok', label: 'Coherence', detail: '"and then", "After that" keep time order clear' },
      { level: 'warn', label: '/θ/ vs /r/', detail: '/r/ in "morning" / "fresh" drifts toward /w/' },
    ],
    analysisPrompt: `You are an **IELTS-style / classroom speaking** coach. Below is **semi-open** data from Chivox MCP (en.pqan.score): prompt refText, learner **transcript**, **overall**, four rubric scores (**grammar**, **content**, **fluency**, **pron**), **speed** (WPM if present), and structured **issues[]** flags.

## Task
Give a **rubric-grounded** diagnosis: estimate a **0–100** overall band in plain language, then explain **each dimension** with **quoted snippets** from the transcript (short phrases, not the whole text). End with **3–5 concrete upgrades** to reach the **next band** (sentence stems / patterns, not vague "practice more").

## Weights (communicate these to the learner)
- **Content ~30%** — idea depth, elaboration, specificity
- **Grammar ~25%** — range, agreement, subordination
- **Fluency ~25%** — pace, pausing, fillers, cohesion
- **Pronunciation ~20%** — segmentals + intelligibility

## Cross-dimension checks
- If **content** is the lowest score, prioritize **elaboration templates** before micro-pron drills.
- If **fluency** lags with low WPM, separate **planning pauses** from **articulation issues**.
- If **pron** flags specific phones, tie them to **actual words** in the transcript.

## Output format
Markdown: **Band estimate**, a compact **score table**, then **"To reach the next band"** with numbered pattern upgrades.

## MCP payload
\`\`\`json
{mcp_response}
\`\`\``,
    analysisOutput: `🎯 Total 71/100 · mid band (late B1 / early B2).

| Dim | Score | Issue |
|-----|-------|-------|
| Content | 62 | Four points only; no why or feeling |
| Fluency | 75 | 118 WPM, many pauses |
| Grammar | 78 | Simple sentences only |
| Pron | 72 | /r/ toward /w/ |

To reach 80+
① Add a reason clause (+grammar)
"I walk to work **because it helps me wake up**, **even though it takes longer**."

② Add feeling (+content)
"...the fresh air, **which makes me feel ready for the day**."

③ Reduce fillers (+fluency)
Replace "and then" with "Once I've had breakfast, I walk to work."`,
    practicePrompt: `You are still the same learner's coach. The **second-pass semi-open diagnosis** already names weak dimensions and example transcript spots — generate **targeted rehearsal** that forces the learner to use **new syntax + richer content + clearer pron** in one loop.

## Task
Output **four practice blocks** (grammar, content expansion, pronunciation, recording) as JSON categories that an app can render directly.

## Output JSON (single valid JSON array only; no prose outside it)
\`\`\`json
[
  { "category": "Grammar", "icon": "📐", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Content", "icon": "💡", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Pronunciation", "icon": "🎯", "items": [ { "label": "…", "content": "…" } ] },
  { "category": "Recording", "icon": "🎙️", "items": [ { "label": "…", "content": "…" } ] }
]
\`\`\`

## Rules
- **Grammar**: supply **2–3 reusable clause frames** (e.g. because / although / once / which) and require the learner to **rewrite two original simple clauses** using them.
- **Content**: include an **AREA-style** expansion recipe (Answer → Reason → Example → Alternative) with one worked micro-example tied to the topic.
- **Pronunciation**: **only** phones or clusters explicitly criticized in the diagnosis; add **4–6** drill words drawn from safe vocabulary.
- **Recording**: one **timed re-record** spec (minimum duration, minimum subordinate clauses, keyword quotas) so progress is measurable.
- Plain text only inside **content** fields.
`,
    practice: [
      {
        category: 'Grammar',
        icon: '📐',
        items: [
          {
            label: 'Clause templates',
            content: 'because / since · although / even though · while / when · which/that — try one per sentence',
          },
        ],
      },
      {
        category: 'Content',
        icon: '💡',
        items: [
          {
            label: 'AREA',
            content: 'Answer → Reason → Example → Alternative; expand each of the four ideas',
          },
        ],
      },
      {
        category: 'Pronunciation',
        icon: '🎯',
        items: [
          { label: '/r/ posture', content: 'red · write · really · refresh — curl tongue, don’t round lips' },
        ],
      },
      {
        category: 'Recording',
        icon: '🎙️',
        items: [
          { label: '60s challenge', content: 'Record ≥60s with ≥2 subordinate clauses and 2× feel/make/because' },
        ],
      },
    ],
  },
};
