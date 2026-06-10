/**
 * On-device Swahili TTS via Piper ONNX model (sw_CD-lanfrica-medium).
 *
 * Uses @mintplex-labs/piper-tts-web which bundles:
 *   - onnxruntime-web for ONNX inference
 *   - espeak-ng phonemizer compiled to WASM
 *
 * The ~60MB voice model is downloaded once from HuggingFace and stored in
 * the browser's Origin Private File System (OPFS) — subsequent calls are
 * fully offline, zero data cost.
 *
 * WASM runtime files are served locally from /piper/ so they are available
 * after the service worker caches them on first load.
 */

import { TtsSession } from '@mintplex-labs/piper-tts-web';
import type { Progress } from '@mintplex-labs/piper-tts-web';

export const SWAHILI_VOICE_ID = 'sw_CD-lanfrica-medium';

// Local paths — served from public/piper/, cached by the service worker.
const LOCAL_WASM_PATHS = {
  onnxWasm: '/piper/',
  piperData: '/piper/piper_phonemize.data',
  piperWasm: '/piper/piper_phonemize.wasm',
};

let _session: TtsSession | null = null;

// Playback management — lets a new utterance cancel an in-flight one
let currentAudio: HTMLAudioElement | null = null;
let generation = 0;

export function stopWasmTTS() {
  generation++;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

async function getSession(onProgress?: (p: Progress) => void): Promise<TtsSession> {
  if (_session?.ready) return _session;
  _session = await TtsSession.create({
    voiceId: SWAHILI_VOICE_ID,
    wasmPaths: LOCAL_WASM_PATHS,
    progress: onProgress,
    logger: (msg) => console.debug('[piper]', msg),
  });
  return _session;
}

/**
 * Synthesize text to audio and play it. Falls back to Web Speech API if the
 * Piper session fails to initialise (e.g. OPFS not yet populated).
 */
export async function wasmTTS(
  text: string,
  _lang: 'sw' | 'en' = 'sw',
  onProgress?: (p: Progress) => void,
): Promise<void> {
  const myGeneration = ++generation;
  try {
    const session = await getSession(onProgress);
    const wav = await session.predict(text);
    if (myGeneration !== generation) return; // superseded by a newer utterance
    await playBlob(wav);
  } catch (err) {
    console.warn('[piper] inference failed, falling back to Web Speech:', err);
    if (myGeneration === generation) await webSpeechFallback(text);
  }
}

/**
 * Pre-download the Swahili voice model and cache it in OPFS.
 * Call this once on first launch (with a progress UI) so offline use works.
 */
export async function preloadVoiceModel(onProgress?: (p: Progress) => void): Promise<void> {
  const { stored, download } = await import('@mintplex-labs/piper-tts-web');
  const cachedModels = await stored();
  if (cachedModels.includes(SWAHILI_VOICE_ID)) return; // already cached
  await download(SWAHILI_VOICE_ID, onProgress);
}

/** Check whether the model is already stored in OPFS. */
export async function isVoiceModelCached(): Promise<boolean> {
  const { stored } = await import('@mintplex-labs/piper-tts-web');
  const cachedModels = await stored();
  return cachedModels.includes(SWAHILI_VOICE_ID);
}

function playBlob(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    audio.play().catch(reject);
  });
}

function webSpeechFallback(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) return reject(new Error('No TTS available'));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sw-TZ';
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}
