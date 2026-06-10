/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessibilityConfig } from '../../types';
import { Type, Eye, Volume2, VolumeX, Sliders, Heading1, Sparkles, Mic } from 'lucide-react';
import { speakText } from '../../modules/voice/tts';
import { t } from '../../lib/i18n';

interface AccessibilityToolbarProps {
  config: AccessibilityConfig;
  onChange: (newConfig: AccessibilityConfig) => void;
}

export default function AccessibilityToolbar({ config, onChange }: AccessibilityToolbarProps) {
  const lang = config.lang ?? 'en';

  const toggleTextSize = () => {
    const sizes: ('normal' | 'large' | 'extra-large')[] = ['normal', 'large', 'extra-large'];
    const nextSize = sizes[(sizes.indexOf(config.textSize) + 1) % sizes.length];
    const map = { normal: t('tts_size_normal', lang), large: t('tts_size_large', lang), 'extra-large': t('tts_size_xl', lang) };
    speakText(map[nextSize], config.ttsSpeed, true, lang);
    onChange({ ...config, textSize: nextSize });
  };

  const toggleFont = () => {
    const fonts: ('sans' | 'mono' | 'dyslexic')[] = ['sans', 'dyslexic', 'mono'];
    const nextFont = fonts[(fonts.indexOf(config.fontFamily) + 1) % fonts.length];
    const map = { sans: t('tts_font_sans', lang), dyslexic: t('tts_font_dyslexic', lang), mono: t('tts_font_mono', lang) };
    speakText(map[nextFont], config.ttsSpeed, true, lang);
    onChange({ ...config, fontFamily: nextFont });
  };

  const toggleContrast = () => {
    const modes: ('normal' | 'high-contrast-light' | 'high-contrast-dark' | 'soft-pastel')[] =
      ['normal', 'high-contrast-light', 'high-contrast-dark', 'soft-pastel'];
    const nextMode = modes[(modes.indexOf(config.contrastMode) + 1) % modes.length];
    const map = {
      normal: t('tts_theme_normal', lang),
      'high-contrast-light': t('tts_theme_light', lang),
      'high-contrast-dark': t('tts_theme_dark', lang),
      'soft-pastel': t('tts_theme_pastel', lang),
    };
    speakText(map[nextMode], config.ttsSpeed, true, lang);
    onChange({ ...config, contrastMode: nextMode });
  };

  const toggleTts = () => {
    const next = !config.ttsEnabled;
    speakText(next ? t('tts_voice_on', lang) : t('tts_voice_off', lang), config.ttsSpeed, true, lang);
    onChange({ ...config, ttsEnabled: next });
  };

  const toggleReadingGuide = () => {
    const next = !config.readingGuide;
    speakText(next ? t('tts_ruler_on', lang) : t('tts_ruler_off', lang), config.ttsSpeed, true, lang);
    onChange({ ...config, readingGuide: next });
  };

  const cycleVoice = () => {
    const modes: AccessibilityConfig['ttsVoice'][] = ['auto', 'cloud', 'wasm', 'browser'];
    const next = modes[(modes.indexOf(config.ttsVoice ?? 'auto') + 1) % modes.length];
    const labelKey = `tts_voice_${next}` as Parameters<typeof t>[0];
    speakText(t(labelKey, lang), config.ttsSpeed, true, lang);
    onChange({ ...config, ttsVoice: next });
  };

  const increaseSpeechSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const idx = speeds.indexOf(config.ttsSpeed);
    const nextSpeed = speeds[(idx + 1) % speeds.length];
    speakText(`${t('speed', lang)} ${nextSpeed}x`, nextSpeed, true, lang);
    onChange({ ...config, ttsSpeed: nextSpeed });
  };

  const toggleLang = () => {
    const next: 'en' | 'sw' = lang === 'en' ? 'sw' : 'en';
    speakText(next === 'sw' ? t('tts_lang_sw', next) : t('tts_lang_en', next), config.ttsSpeed, true, next);
    onChange({ ...config, lang: next });
  };

  const fontLabel = config.fontFamily === 'sans' ? 'Inter' : config.fontFamily === 'dyslexic' ? 'Lexend' : 'Mono';
  const contrastLabel =
    config.contrastMode === 'normal' ? t('normal', lang) :
    config.contrastMode === 'soft-pastel' ? t('sensory', lang) : t('contrast', lang);

  return (
    <div
      className={`p-4 rounded-[24px] mb-8 transition-all duration-300 border-4 ${
        config.contrastMode === 'high-contrast-dark'
          ? 'bg-black text-yellow-300 border-yellow-300 shadow-[6px_6px_0px_#000]'
          : config.contrastMode === 'high-contrast-light'
          ? 'bg-white text-black border-black border-4 shadow-[6px_6px_0px_#000]'
          : config.contrastMode === 'soft-pastel'
          ? 'bg-amber-50/90 text-slate-800 border-orange-200'
          : 'bg-white text-[#2D3436] border-[#6BCB77] shadow-[6px_6px_0px_#6BCB77]'
      }`}
      id="a11y-toolbar-container"
    >
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">

        {/* Left label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6BCB77] text-white rounded-xl flex items-center justify-center border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436]">
            <Sliders size={20} className="stroke-[2.5px] text-white" />
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-wider block text-[#6BCB77] leading-none">
              {t('a11y_section_label', lang)}
            </span>
            <span className="text-sm font-bold text-[#2D3436] block mt-1">
              {t('a11y_section_desc', lang)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">

          {/* Language toggle */}
          <button
            id="btn-lang-toggle"
            onClick={toggleLang}
            title={t('language', lang)}
            className="py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-2 border-[#2D3436] bg-white hover:bg-slate-50 text-gray-700 shadow-[2px_2px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <span className="text-base leading-none">{lang === 'en' ? '🇬🇧' : '🇹🇿'}</span>
            <span className="uppercase font-extrabold">{lang === 'en' ? 'EN' : 'SW'}</span>
          </button>

          {/* TTS toggle */}
          <button
            id="btn-tts-toggle"
            onClick={toggleTts}
            onMouseEnter={() => config.ttsEnabled && speakText(t('voice_guide', lang), config.ttsSpeed, false, lang)}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-2 border-[#2D3436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2D3436] ${
              config.ttsEnabled
                ? 'bg-[#6BCB77] text-white shadow-[2px_2px_0px_#2D3436]'
                : 'bg-white hover:bg-slate-50 text-gray-700 shadow-[2px_2px_0px_#2D3436]'
            }`}
          >
            {config.ttsEnabled ? <Volume2 size={15} className="stroke-[2.5px]" /> : <VolumeX size={15} className="stroke-[2.5px]" />}
            <span>{t('voice_guide', lang)}: {config.ttsEnabled ? t('on', lang) : t('off', lang)}</span>
          </button>

          {/* Speech speed (visible only when TTS on) */}
          {config.ttsEnabled && (
            <button
              id="btn-tts-speed"
              onClick={increaseSpeechSpeed}
              className="py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-white hover:bg-slate-50 border-2 border-[#2D3436] text-gray-700 shadow-[2px_2px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <span>{t('speed', lang)}: {config.ttsSpeed}x</span>
            </button>
          )}

          {/* Voice engine picker (visible only when TTS on) */}
          {config.ttsEnabled && (
            <button
              id="btn-tts-voice"
              onClick={cycleVoice}
              title={lang === 'sw' ? 'Badilisha injini ya sauti' : 'Switch voice engine'}
              className="py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-white hover:bg-slate-50 border-2 border-[#2D3436] text-gray-700 shadow-[2px_2px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Mic size={13} className="stroke-[2.5px] text-purple-600" />
              <span>
                {lang === 'sw' ? 'Sauti' : 'Voice'}:{' '}
                <span className="font-extrabold uppercase text-purple-700">
                  {config.ttsVoice === 'cloud'   ? (lang === 'sw' ? 'Wingu' : 'Cloud')
                  : config.ttsVoice === 'wasm'   ? 'Piper'
                  : config.ttsVoice === 'browser' ? (lang === 'sw' ? 'Kivinjari' : 'Browser')
                  : (lang === 'sw' ? 'Otomatiki' : 'Auto')}
                </span>
              </span>
            </button>
          )}

          {/* Reading ruler */}
          <button
            id="btn-reading-guide-toggle"
            onClick={toggleReadingGuide}
            onMouseEnter={() => config.ttsEnabled && speakText(t('reading_ruler', lang), config.ttsSpeed, false, lang)}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-2 border-[#2D3436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2D3436] ${
              config.readingGuide
                ? 'bg-[#FFD93D] text-[#856404] shadow-[2px_2px_0px_#2D3436]'
                : 'bg-white hover:bg-slate-50 text-gray-700 shadow-[2px_2px_0px_#2D3436]'
            }`}
          >
            <Eye size={15} className="stroke-[2.5px]" />
            <span>{t('reading_ruler', lang)}: {config.readingGuide ? t('on', lang) : t('off', lang)}</span>
          </button>

          {/* Text size */}
          <button
            id="btn-scale-text-toggle"
            onClick={toggleTextSize}
            onMouseEnter={() => config.ttsEnabled && speakText(t('text_size', lang), config.ttsSpeed, false, lang)}
            className="py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-white hover:bg-slate-50 text-gray-700 border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Type size={15} className="stroke-[2.5px]" />
            <span>
              {t('text_size', lang)}: <span className="font-extrabold underline uppercase text-indigo-700">
                {config.textSize === 'normal' ? t('normal', lang) : config.textSize === 'large' ? (lang === 'sw' ? 'KUBWA' : 'LARGE') : (lang === 'sw' ? 'KUBWA SANA' : 'X-LARGE')}
              </span>
            </span>
          </button>

          {/* Font */}
          <button
            id="btn-font-profile-toggle"
            onClick={toggleFont}
            onMouseEnter={() => config.ttsEnabled && speakText(t('font', lang), config.ttsSpeed, false, lang)}
            className="py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-white hover:bg-slate-50 text-gray-700 border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Heading1 size={15} className="stroke-[2.5px]" />
            <span>{t('font', lang)}: <span className="font-extrabold underline uppercase text-teal-700">{fontLabel}</span></span>
          </button>

          {/* Color / contrast */}
          <button
            id="btn-contrast-mode-toggle"
            onClick={toggleContrast}
            onMouseEnter={() => config.ttsEnabled && speakText(t('color_support', lang), config.ttsSpeed, false, lang)}
            className="py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-white hover:bg-slate-50 text-gray-700 border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Sparkles size={15} className="text-[#FFD93D] stroke-[2.5px]" />
            <span>{t('color_support', lang)}: <span className="font-extrabold underline uppercase text-[#FF6B6B]">{contrastLabel}</span></span>
          </button>

        </div>
      </div>
    </div>
  );
}
