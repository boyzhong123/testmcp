'use client';

import { useState, useEffect, useCallback } from 'react';

const SECTIONS = [
  { id: 'hero', label: '首页' },
  { id: 'features', label: '核心价值' },
  { id: 'dual-mode', label: '双模式评测' },
  { id: 'use-cases', label: 'AI 原生场景' },
  { id: 'use-cases-b', label: '载体嵌入场景' },
  { id: 'workflow', label: '工作流程' },
  { id: 'params', label: '评测参数' },
  { id: 'how-it-works', label: 'LLM 分析' },
  { id: 'demo', label: '在线体验' },
  { id: 'pricing', label: '收费细则' },
  { id: 'faq', label: '常见问题' },
  { id: 'about', label: '关于驰声' },
];

function getInitialActiveIdx() {
  if (typeof window === 'undefined') return 0;
  
  const scrollY = window.scrollY;
  const offsets = SECTIONS.map(s => {
    const el = document.getElementById(s.id);
    return el ? el.offsetTop - 200 : 0;
  });

  let activeIdx = 0;
  for (let i = offsets.length - 1; i >= 0; i--) {
    if (scrollY >= offsets[i]) {
      activeIdx = i;
      break;
    }
  }
  return activeIdx;
}

function getInitialVisible() {
  if (typeof window === 'undefined') return false;
  return window.scrollY > 300;
}

export function ScrollIndicator() {
  const [activeIdx, setActiveIdx] = useState(getInitialActiveIdx);
  const [visible, setVisible] = useState(getInitialVisible);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setVisible(scrollY > 300);

    const offsets = SECTIONS.map(s => {
      const el = document.getElementById(s.id);
      return el ? el.offsetTop - 200 : 0;
    });

    let idx = 0;
    for (let i = offsets.length - 1; i >= 0; i--) {
      if (scrollY >= offsets[i]) {
        idx = i;
        break;
      }
    }
    setActiveIdx(idx);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 64 + 1, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}
    >
      {/* Track container */}
      <div className="relative flex flex-col items-center">
        {/* Dots */}
        <div className="relative flex flex-col items-center gap-4">
          {SECTIONS.map((s, i) => {
            const isActive = activeIdx === i;
            const isHovered = hoverIdx === i;
            
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="group relative flex items-center justify-center w-6 h-6 cursor-pointer"
                aria-label={s.label}
              >
                {/* Mouse icon for active item */}
                {isActive && (
                  <div className="absolute right-full mr-2 flex items-center justify-center text-foreground/40 pointer-events-none">
                    <svg width="18" height="26" viewBox="0 0 18 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="1" width="16" height="24" rx="8" />
                      <g className="animate-arrow-down">
                        <path d="M9 6v6" />
                        <path d="M6 9l3 3 3-3" />
                      </g>
                    </svg>
                  </div>
                )}

                {/* Label on hover */}
                <span
                  className={`absolute right-8 whitespace-nowrap text-[12px] font-medium tracking-wide transition-all duration-300 ${
                    isHovered && !isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-2 pointer-events-none'
                  } text-foreground/70`}
                >
                  {s.label}
                </span>

                {/* Dot */}
                <span className="relative flex items-center justify-center">
                  <span
                    className={`block rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isActive
                        ? 'w-[6px] h-[20px] bg-foreground/60 shadow-sm'
                        : 'w-[6px] h-[6px] bg-foreground/[0.15] group-hover:bg-foreground/40 group-hover:scale-125'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
