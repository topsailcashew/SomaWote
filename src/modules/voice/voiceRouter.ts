/**
 * Selects cloud TTS when online, falls back to WASM/Piper when offline.
 */
import { cloudTTS } from './cloudVoice';
import { wasmTTS } from './wasmVoice';

export async function voiceRouter(text: string, lang: 'sw' | 'en' = 'sw'): Promise<void> {
  if (navigator.onLine) {
    return cloudTTS(text, lang);
  }
  return wasmTTS(text, lang);
}
