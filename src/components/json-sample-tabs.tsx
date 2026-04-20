'use client';

import { useState } from 'react';

const EN_SAMPLE = `{
  "overall": 72,
  "pron": { "accuracy": 65, "integrity": 95, "fluency": 85, "rhythm": 70 },
  "fluency": { "overall": 85, "pause": 12, "speed": 132 },
  "audio_quality": { "snr": 22.0, "clip": 0, "volume": 2514 },
  "details": [
    { "word": "record", "score": 58, "dp_type": "mispron",
      "start": 1100, "end": 1680,
      "stress": { "ref": 2, "score": 45 },
      "accent": "us",
      "phonemes": [
        { "ipa": "ɹ", "score": 45, "dp_type": "mispron" },
        { "ipa": "ɪ", "score": 78, "dp_type": "normal"  }
      ] },
    { "word": "think", "score": 62, "dp_type": "mispron",
      "start": 2400, "end": 2910, "liaison": "none",
      "phonemes": [
        { "ipa": "θ", "score": 42, "dp_type": "mispron" },
        { "ipa": "ŋk","score": 78, "dp_type": "normal" }
      ] }
  ]
}`;

const CN_SAMPLE = `{
  "overall": 82,
  "pron": { "accuracy": 80, "integrity": 100, "fluency": 86, "tone": 76 },
  "details": [
    { "char": "好", "pinyin": "hao3", "score": 62, "dp_type": "wrong_tone",
      "start": 820, "end": 1240,
      "tone": { "ref": 3, "detected": 4, "score": 40,
                "confidence": [2, 5, 10, 28, 55] },
      "phonemes": [
        { "ipa": "x",  "score": 92, "dp_type": "normal" },
        { "ipa": "au", "score": 70, "dp_type": "normal" }
      ] }
  ]
}`;

export function JsonSampleTabs({
  isZh,
  cardTitle,
}: {
  isZh: boolean;
  cardTitle: string;
}) {
  const [lang, setLang] = useState<'en' | 'cn'>('en');
  const sample = lang === 'en' ? EN_SAMPLE : CN_SAMPLE;

  const tabs: { key: 'en' | 'cn'; flag: string; label: string }[] = [
    { key: 'en', flag: '🇬🇧', label: isZh ? '英文引擎' : 'English' },
    { key: 'cn', flag: '🇨🇳', label: isZh ? '中文引擎' : 'Chinese' },
  ];

  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="text-xs text-zinc-500 font-mono">{cardTitle}</div>
        <div className="flex items-center gap-1">
          {tabs.map((t) => {
            const active = lang === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setLang(t.key)}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md transition-colors duration-150 ${
                  active
                    ? 'bg-white/[0.08] text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                }`}
              >
                <span className="mr-1">{t.flag}</span>
                {t.label}
              </button>
            );
          })}
          <span className="ml-2 text-[10px] text-zinc-600 font-mono hidden sm:inline">structured_json</span>
        </div>
      </div>
      <pre className="text-[10.5px] sm:text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-words overflow-x-auto max-w-full transition-opacity duration-150">
        {sample}
      </pre>
    </div>
  );
}
