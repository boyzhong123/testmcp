#!/usr/bin/env python3
"""
Generate high-quality English voiceover audio using Microsoft Edge TTS.
Run: python generate-audio.py
Output: audio/slide0.mp3 ~ slide7.mp3
"""

import asyncio
import os
import edge_tts

# Voice: Microsoft Edge TTS - en-US-GuyNeural (male, clear, professional)
VOICE = "en-US-GuyNeural"
# Rate: slowed to 85% of the previous -5% setting for better pacing/clarity
RATE = "-19%"

# 8 slides with smooth transitions between each
# Each script includes a transition phrase to connect to the next slide
SLIDES = [
    # S0: ACT 1 - THE PROBLEM
    # Opening hook, sets up the pain point
    """Speech assessment APIs have existed for over twenty years. 
    But here's the problem: they return raw numbers — accuracy 78, fluency 82. 
    To turn these into useful learning feedback, engineers must write a translation layer... 
    for every single model, every single time.
    
    So, what's the solution?""",
    
    # S1: ACT 2 - THE SOLUTION (comparison)
    # Transition from problem to solution
    """This is where Chivox MCP comes in. 
    
    Instead of studying API docs and writing wrapper code, 
    you simply add one MCP server config line. 
    Your LLM auto-discovers sixteen evaluation tools. 
    Phoneme-level results flow directly into context. 
    Zero wrapper code needed.
    
    Let me show you how it works.""",
    
    # S2: ACT 2 - WORKFLOW
    # Transition to show the flow
    """Here's the complete workflow in five simple steps.
    
    First, you configure once — that's your one-time setup. 
    Then, the user speaks or uploads audio. 
    The LLM automatically picks the right evaluation tool. 
    Chivox scores at phoneme level. 
    And finally, the LLM generates personalized feedback with diagnosis and drills.
    
    Now, let's look at what makes this powerful.""",
    
    # S3: ACT 3 - CORE VALUES
    # Transition to capabilities
    """Chivox MCP delivers three core values.
    
    First: rich data. Eight main dimensions plus phoneme-level error typing for every sound.
    
    Second: LLM diagnosis. Your model turns raw scores into actionable correction advice.
    
    Third: universal compatibility. Standard MCP protocol works with GPT, Claude, Gemini, and any AI framework.
    
    And you get flexibility too.""",
    
    # S4: ACT 3 - DUAL MODE
    # Transition to flexibility
    """Two evaluation modes fit different use cases.
    
    Real-time streaming: under three hundred milliseconds latency, perfect for tutoring apps where users need instant feedback.
    
    Or file upload: batch processing for large-scale content quality control. Supports WAV, MP3, and more.
    
    Let me show you a concrete example.""",
    
    # S5: ACT 4 - DEMO
    # Transition to demonstration
    """Here's how it works in practice, in three steps.
    
    Step one: MCP returns raw phoneme scores — overall 78, specific phonemes like theta scoring 45.
    
    Step two: The LLM diagnoses the issue — your theta sounds like S, tongue not between teeth.
    
    Step three: The model generates targeted drills — think, through, three. Practice with these.
    
    This works across many scenarios.""",
    
    # S6: ACT 5 - USE CASES
    # Transition to scenarios
    """One MCP powers every scenario.
    
    IELTS speaking prep. K-12 curriculum. Mandarin proficiency tests. 
    Kids phonics and early learning. One-on-one tutoring. 
    IM bots in Feishu and DingTalk. Podcast quality checking. 
    And the entire developer ecosystem with Dify, n8n, and more.
    
    Ready to get started?""",
    
    # S7: ACT 6 - CTA
    # Closing call to action
    """Getting started is simple. One line of config, instant integration.
    
    Behind this: twenty years of exam-grade speech engines, 
    serving one hundred eighty-five countries, 
    ten billion users, 
    and ninety-five percent alignment with human experts.
    
    Visit chivox M C P two dot netlify dot app. 
    Ship your voice-enabled AI product today."""
]

async def generate_audio():
    os.makedirs("audio", exist_ok=True)
    
    for i, text in enumerate(SLIDES):
        output_file = f"audio/slide{i}.mp3"
        print(f"Generating {output_file}...")
        
        # Clean up the text - remove extra whitespace but keep natural pauses
        clean_text = " ".join(text.split())
        
        communicate = edge_tts.Communicate(clean_text, VOICE, rate=RATE)
        await communicate.save(output_file)
        
        print(f"  ✓ {output_file} done")
    
    print("\n✅ All 8 audio files generated!")
    print("Total slides: 8 (~96 seconds)")

if __name__ == "__main__":
    asyncio.run(generate_audio())
