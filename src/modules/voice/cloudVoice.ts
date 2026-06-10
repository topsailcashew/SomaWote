/**
 * Sovereign cloud TTS — Intron Health Sahara-v2.
 *
 * Intron has a live API with native Swahili support and handles Swahili–English
 * code-switching. Sign up at https://voice.intron.io → Developers tab.
 *
 * MsingiAI Sauti has no hosted API yet (training-only project as of 2025);
 * the hook below is reserved for when they ship one.
 *
 * The Intron TTS endpoint accepts ≤100 chars per request, so long text is split
 * at sentence/word boundaries and played sequentially.
 */

const INTRON_API_KEY = (import.meta as any).env?.VITE_INTRON_API_KEY as string | undefined;
const INTRON_TTS_URL = 'https://infer.voice.intron.io/tts/v1/generate';

// Intron hard-limits at 100 chars per request.
function splitForIntron(text: string): string[] {
  const chunks: string[] = [];
  // Split on sentence boundaries first
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  for (const sentence of sentences) {
    if (sentence.length <= 100) {
      chunks.push(sentence.trim());
    } else {
      // Fall back to word-boundary splitting
      const words = sentence.split(' ');
      let current = '';
      for (const word of words) {
        if ((current + ' ' + word).trim().length > 100) {
          if (current) chunks.push(current.trim());
          current = word;
        } else {
          current = current ? `${current} ${word}` : word;
        }
      }
      if (current) chunks.push(current.trim());
    }
  }
  return chunks.filter(Boolean);
}

async function intronTTSChunk(
  text: string,
  lang: 'sw' | 'en',
): Promise<void> {
  const res = await fetch(INTRON_TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${INTRON_API_KEY}`,
    },
    body: JSON.stringify({
      text,
      voice_language: lang === 'sw' ? 'swahili' : 'en',
      voice_accent: lang === 'sw' ? 'swahili' : 'en',
      voice_gender: 'female',
      output_audio_format: 'wav',
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Intron TTS ${res.status}: ${err}`);
  }

  const json = await res.json() as {
    data: { audio_path: string };
    status: string;
  };

  const audioUrl = json.data?.audio_path;
  if (!audioUrl) throw new Error('Intron TTS: no audio_path in response');

  await playUrl(audioUrl);
}

function playUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);
    audio.play().catch(reject);
  });
}

function webSpeechFallback(text: string, lang: 'sw' | 'en'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) return reject(new Error('No TTS available'));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'sw' ? 'sw-TZ' : 'en-US';
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

export async function cloudTTS(text: string, lang: 'sw' | 'en' = 'sw'): Promise<void> {
  // --- MsingiAI Sauti hook (reserved — no hosted API available yet) ---
  // const MSINGI_KEY = (import.meta as any).env?.VITE_MSINGI_API_KEY;
  // if (MSINGI_KEY) { ... }

  // --- Intron Health Sahara-v2 ---
  if (INTRON_API_KEY) {
    const chunks = splitForIntron(text);
    for (const chunk of chunks) {
      await intronTTSChunk(chunk, lang); // sequential — plays each chunk before fetching next
    }
    return;
  }

  // No key configured — fall back to Web Speech API
  await webSpeechFallback(text, lang);
}

export async function cloudASR(_audioBlob: Blob, _lang: 'sw' | 'en' = 'sw'): Promise<string> {
  // Intron STT: POST https://infer.voice.intron.io/stt/v1/upload (sync)
  // Wire up when VITE_INTRON_API_KEY is available and STT is needed.
  throw new Error('Cloud ASR not yet configured');
}
