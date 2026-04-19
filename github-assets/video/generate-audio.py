#!/usr/bin/env python3
"""
Generate high-quality English voiceover using Microsoft Edge TTS.
Run: python generate-audio.py

12 slides total (~150 seconds)
"""

import asyncio
import edge_tts
import os

# Use Microsoft Edge's high-quality neural voices
# en-US-GuyNeural (male, professional)
# en-US-JennyNeural (female, professional)
# en-US-AriaNeural (female, conversational)
VOICE = "en-US-GuyNeural"  # Professional male voice
RATE = "-15%"  # Slower for clarity (was -20%, slightly faster now for 12 slides)

# English voiceover scripts for each slide (12 total)
SLIDES = [
    # S0: Hook - The Problem
    "Large language models don't understand audio natively. Traditional speech scoring APIs return raw numbers. To turn them into learning feedback, engineers must write a translation layer — for every model.",

    # S1: Solution
    "Chivox MCP wraps phoneme-level assessment into tools your model can call directly. One call, structured diagnosis out. No wrapper code. No prompt engineering.",

    # S2: NEW - Workflow 6 Steps
    "Here's how it works: configure once, then every user recording flows through six steps — from speaking to smart, personalized feedback. The LLM picks the right tool, Chivox scores the audio, and the model generates actionable advice.",

    # S3: Home screenshot
    "Welcome to Chivox MCP. Ten years of exam-grade speech engines, now open via the Model Context Protocol. Trusted by over one hundred million learners worldwide.",

    # S4: Docs screenshot
    "Developer documentation: six steps to integrate, three paths to choose from. Supports Cursor, Claude, Coze, Doubao, Feishu, and all major MCP clients.",

    # S5: NEW - Three Core Values
    "Three core values. First: rich data dimensions — eight main metrics, twenty plus sub-metrics, phoneme-level detail for every sound. Second: LLM deep diagnosis — your model turns raw scores into personalized correction advice. Third: universal compatibility — standard MCP protocol works with any agent framework.",

    # S6: Demo screenshot
    "Try our live demo. Speak one sentence — get phoneme-level scoring, fluency analysis, and personalized practice suggestions in seconds.",

    # S7: NEW - Dual Mode
    "Two evaluation modes to fit your use case. Real-time streaming with under three hundred milliseconds latency — perfect for tutoring apps. Or batch file upload for large-scale content quality control. Seven question types, three input methods, full flexibility.",

    # S8: Scenarios grid
    "One MCP, every scenario. IELTS speaking prep, K-12 curriculum, Mandarin proficiency tests, speech contests, kids phonics, one-on-one tutoring, IM bots, and podcast quality control.",

    # S9: NEW - LLM Deep Analysis Demo
    "See how LLM deep analysis works in three steps. First: the MCP returns raw phoneme data with detailed scores. Second: your LLM diagnoses the specific pronunciation issues — like confusing theta with S. Third: the model automatically generates targeted practice drills. Scores become smart feedback.",

    # S10: Plans screenshot
    "Five pricing tiers: from free starter to enterprise private deployment. Start free, scale when you're ready. All plans include the full sixteen assessment tools.",

    # S11: Outro
    "Get started now. One line of config, instant integration. Visit chivox MCP two dot netlify dot app."
]

async def generate_audio():
    for i, text in enumerate(SLIDES):
        output_file = f"audio/slide{i}.mp3"
        print(f"Generating slide {i}: {text[:50]}...")
        
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(output_file)
        print(f"  -> Saved to {output_file}")
    
    print("\nDone! All 12 audio files generated in ./audio/")

if __name__ == "__main__":
    import os
    os.makedirs("audio", exist_ok=True)
    asyncio.run(generate_audio())
