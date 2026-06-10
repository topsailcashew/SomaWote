/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cloudTTS, stopCloudTTS, hasCloudTTS } from './cloudVoice';
import { wasmTTS, stopWasmTTS } from './wasmVoice';

let speechMuted = false;

// Circuit breaker: once Intron rejects (e.g. 403 non-integrator account),
// stop trying it for the rest of the session and go straight to Piper.
let cloudBroken = false;

// Android WebView crashes on utterances longer than ~14 seconds of speech.
// At rate 1.0, ~150 words/min ≈ 2.5 words/sec, so ~35 words per chunk is safe.
// Split on sentence boundaries to keep chunks natural.
function chunkText(text: string, maxChars = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if (current.length + s.length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Returns the best available voice AND the correct BCP-47 tag for that voice. */
function pickVoice(
  voices: SpeechSynthesisVoice[],
  lang: 'en' | 'sw'
): { voice: SpeechSynthesisVoice | null; bcp47: string } {
  if (lang === 'sw') {
    const swVoice =
      voices.find(v => v.lang === 'sw-TZ') ??
      voices.find(v => v.lang === 'sw-KE') ??
      voices.find(v => v.lang.startsWith('sw')) ??
      null;
    if (swVoice) return { voice: swVoice, bcp47: swVoice.lang };

    // No native Swahili voice — fall back to English so the browser doesn't silently drop the utterance
    const enVoice =
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ??
      voices.find(v => v.lang.startsWith('en')) ??
      null;
    return { voice: enVoice, bcp47: enVoice?.lang ?? 'en-US' };
  }

  const enVoice =
    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ??
    voices.find(v => v.lang.startsWith('en')) ??
    null;
  return { voice: enVoice, bcp47: enVoice?.lang ?? 'en-US' };
}

function speakChunks(
  chunks: string[],
  rate: number,
  voice: SpeechSynthesisVoice | null,
  bcp47: string
) {
  if (!chunks.length) return;
  const [head, ...tail] = chunks;
  const utterance = new SpeechSynthesisUtterance(head);
  utterance.rate = rate;
  utterance.lang = bcp47;
  if (voice) utterance.voice = voice;
  if (tail.length > 0) utterance.onend = () => speakChunks(tail, rate, voice, bcp47);
  window.speechSynthesis.speak(utterance);
}

export function speakText(
  text: string,
  rate: number = 1.0,
  force: boolean = false,
  lang: 'en' | 'sw' = 'en'
) {
  if (speechMuted && !force) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    stopCloudTTS();
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return;

    // Swahili: no browser ships a native Swahili voice, so Web Speech sounds
    // wrong. Try Intron Sahara-v2 (cloud) → Piper sw_CD (on-device WASM) →
    // Web Speech as last resort.
    if (lang === 'sw') {
      stopWasmTTS();
      if (hasCloudTTS && navigator.onLine && !cloudBroken) {
        cloudTTS(cleanText, 'sw').catch((e) => {
          console.warn('Cloud TTS failed, switching to on-device Piper voice:', e);
          cloudBroken = true;
          wasmTTS(cleanText, 'sw');
        });
      } else {
        wasmTTS(cleanText, 'sw'); // falls back to Web Speech internally on failure
      }
      return;
    }

    speakWebSpeech(cleanText, rate, lang);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

function speakWebSpeech(cleanText: string, rate: number, lang: 'en' | 'sw') {
  try {
    const chunks = chunkText(cleanText);

    const doSpeak = () => {
      const { voice, bcp47 } = pickVoice(window.speechSynthesis.getVoices(), lang);
      speakChunks(chunks, rate, voice, bcp47);
    };

    // Voices may not be loaded yet on first call — use onvoiceschanged as fallback
    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      const prev = window.speechSynthesis.onvoiceschanged;
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = prev ?? null;
        doSpeak();
      };
    }
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  stopCloudTTS();
  stopWasmTTS();
}

export function toggleSpeechMute(mute: boolean) {
  speechMuted = mute;
  if (mute) stopSpeaking();
}
