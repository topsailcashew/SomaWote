/**
 * Prompts the user to download the ~60MB Swahili Piper voice model.
 * Shown once on first launch when offline TTS hasn't been primed yet.
 */
import { useState, useEffect } from 'react';
import { Download, Mic, CheckCircle } from 'lucide-react';
import { preloadVoiceModel, isVoiceModelCached } from '../../modules/voice';
import type { Progress } from '@mintplex-labs/piper-tts-web';

interface Props {
  onDismiss: () => void;
}

export default function VoiceModelDownload({ onDismiss }: Props) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');
  const [percent, setPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    isVoiceModelCached().then((cached) => {
      if (cached) onDismiss();
    });
  }, [onDismiss]);

  async function startDownload() {
    setStatus('downloading');
    setPercent(0);
    try {
      await preloadVoiceModel((p: Progress) => {
        if (p.total > 0) setPercent(Math.round((p.loaded / p.total) * 100));
      });
      setStatus('done');
      setTimeout(onDismiss, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Download failed');
      setStatus('error');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Mic className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Sauti ya Kiswahili</h2>
            <p className="text-xs text-gray-500">Swahili offline voice (~60 MB)</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-5">
          Pakua sauti ya Kiswahili mara moja ili uisome bila mtandao.
          <span className="block text-xs text-gray-400 mt-1">
            Download once to read aloud in Swahili without an internet connection.
          </span>
        </p>

        {status === 'idle' && (
          <button
            onClick={startDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Pakua Sauti / Download Voice
          </button>
        )}

        {status === 'downloading' && (
          <div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-3 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500">{percent}% — Inapakuliwa…</p>
          </div>
        )}

        {status === 'done' && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold py-2">
            <CheckCircle className="w-5 h-5" />
            Imepakiwa! / Downloaded!
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-500 text-sm text-center">
            <p>Hitilafu: {errorMsg}</p>
            <button onClick={() => setStatus('idle')} className="mt-2 underline text-xs">
              Jaribu tena / Retry
            </button>
          </div>
        )}

        {status === 'idle' && (
          <button
            onClick={onDismiss}
            className="w-full mt-3 text-gray-400 hover:text-gray-600 text-sm py-1 transition-colors"
          >
            Baadaye / Later
          </button>
        )}
      </div>
    </div>
  );
}
