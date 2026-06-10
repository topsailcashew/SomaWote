/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AccessibilityConfig, Role } from './types';
import { speakText, stopSpeaking, toggleSpeechMute, setVoiceMode } from './modules/voice/tts';
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar';
import VoiceModelDownload from './components/voice/VoiceModelDownload';
import StudentPortal from './components/portals/StudentPortal';
import TeacherPortal from './components/portals/TeacherPortal';
import CaregiverPortal from './components/portals/CaregiverPortal';
import { t } from './lib/i18n';
import { Heart, BookOpen, GraduationCap, Users, ChevronRight, Accessibility, Home } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<Role>('none');
  const [mouseY, setMouseY] = useState(0);
  const [showVoiceDownload, setShowVoiceDownload] = useState(false);

  // Global Accessibility Config state
  const [config, setConfig] = useState<AccessibilityConfig>(() => {
    try {
      const saved = localStorage.getItem('inclusive_platform_config');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed ?? {
        textSize: 'normal',
        fontFamily: 'sans',
        contrastMode: 'normal',
        ttsEnabled: false,
        ttsSpeed: 1.0,
        readingGuide: false,
        lang: 'en',
        ttsVoice: 'auto',
      };
    } catch {
      return {
        textSize: 'normal',
        fontFamily: 'sans',
        contrastMode: 'normal',
        ttsEnabled: false,
        ttsSpeed: 1.0,
        readingGuide: false,
        lang: 'en' as const,
        ttsVoice: 'auto' as const,
      };
    }
  });

  // Save config state modifications
  useEffect(() => {
    try {
      localStorage.setItem('inclusive_platform_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save configuration state', e);
    }
  }, [config]);

  const lang = config.lang ?? 'en';

  // Assistive Reading Guide Ruler coordinate update listener
  useEffect(() => {
    if (!config.readingGuide) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config.readingGuide]);

  // Keep the module-level speechMuted flag in sync with config.ttsEnabled
  useEffect(() => {
    toggleSpeechMute(!config.ttsEnabled);
  }, [config.ttsEnabled]);

  // Sync voice mode preference to the TTS module
  useEffect(() => {
    setVoiceMode(config.ttsVoice ?? 'auto');
  }, [config.ttsVoice]);

  // Master Welcome speech narrator greeting (only when TTS is enabled)
  useEffect(() => {
    if (config.ttsEnabled && role === 'none') {
      speakText(t('tts_welcome', lang), config.ttsSpeed, false, lang);
    }
  }, [role, lang, config.ttsEnabled]);

  // Handle role selection click
  const selectRole = (selectedRole: Role) => {
    setRole(selectedRole);
    const announcements: Record<Role, string> = {
      student:   t('tts_enter_student', lang),
      teacher:   t('tts_enter_teacher', lang),
      caregiver: t('tts_enter_caregiver', lang),
      none:      t('tts_return_home', lang),
    };
    speakText(announcements[selectedRole], config.ttsSpeed, true, lang);
  };

  // Contrast theme class picker
  const getThemeClass = () => {
    if (config.contrastMode === 'high-contrast-dark') {
      return 'bg-black text-yellow-300 min-h-screen';
    }
    if (config.contrastMode === 'high-contrast-light') {
      return 'bg-white text-black min-h-screen border-black';
    }
    if (config.contrastMode === 'soft-pastel') {
      return 'bg-[#F4EFEB] text-slate-800 min-h-screen';
    }
    return 'bg-[#FDFCF0] text-[#2D3436] min-h-screen';
  };

  const getContainerPaddingClass = () => {
    return 'max-w-7xl mx-auto px-6 py-8 md:py-12';
  };

  const getFontFamilyClass = () => {
    if (config.fontFamily === 'dyslexic') return 'font-dyslexic';
    if (config.fontFamily === 'mono') return 'font-mono';
    return 'font-sans';
  };

  const getTypographySizeClass = (element: 'title' | 'subtitle' | 'paragraph') => {
    if (element === 'title') {
      if (config.textSize === 'large') return 'text-4xl md:text-5xl';
      if (config.textSize === 'extra-large') return 'text-5xl md:text-7xl';
      return 'text-3xl md:text-5.5xl';
    }
    if (element === 'subtitle') {
      if (config.textSize === 'large') return 'text-2xl';
      if (config.textSize === 'extra-large') return 'text-3xl';
      return 'text-xl md:text-2xl';
    }
    // Paragraph Body Text Size Customizer
    if (config.textSize === 'large') return 'text-lg md:text-xl leading-relaxed';
    if (config.textSize === 'extra-large') return 'text-xl md:text-2xl leading-loose';
    return 'text-sm md:text-base leading-relaxed';
  };

  return (
    <div className={`${getThemeClass()} ${getFontFamilyClass()} transition-colors duration-300 relative select-none`} id="inclusive-app-root">
      
      {/* Dyslexia alignment guide ruler */}
      {config.readingGuide && (
        <div 
          className="fixed left-0 right-0 h-6 reading-guide-line pointer-events-none transition-all duration-75"
          style={{ top: `${mouseY - 12}px` }}
        />
      )}

      {/* Primary header branding bar with Vibrant Yellow bottom border */}
      <header className="border-b-4 border-[#FFD93D] bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Platform Identity styled using a solid high-contrast blue brick */}
          <div 
            onClick={() => selectRole('none')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-[#4A90E2] text-white rounded-2xl flex items-center justify-center font-black border-2 border-[#2D3436] shadow-[3px_3px_0px_#2D3436] transition-transform group-hover:translate-y-[-1px]">
              <Accessibility size={24} className="animate-spin-slow text-white" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight text-[#2D3436] leading-none block">
                Soma<span className="text-[#4A90E2]">Wote</span>
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#6BCB77] block mt-0.5">
                {t('app_tagline', lang)}
              </span>
            </div>
          </div>

          {/* Quick Hub Navigation & Switcher */}
          <div className="flex items-center gap-3">
            {role !== 'none' && (
              <button
                id="btn-return-home"
                onClick={() => selectRole('none')}
                className="py-2 px-4 rounded-xl bg-white hover:bg-[#F1F2F6] text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#2D3436] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2D3436]"
              >
                <Home size={14} className="stroke-[3px]" />
                <span>{t('return_hub', lang)}</span>
              </button>
            )}
            <div className="text-xs font-black text-[#856404] bg-[#FFD93D] border-2 border-[#2D3436] px-4 py-2 rounded-full shadow-[2px_2px_0px_#2D3436]">
              {t('primary_sync_badge', lang)}
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Area */}
      <main className={getContainerPaddingClass()}>
        
        {/* Floating / Expanded Universal Accessibility Options Toolbar */}
        <AccessibilityToolbar
          config={config}
          onChange={(next) => {
            // First time TTS is turned on, prompt to download the offline voice model
            if (next.ttsEnabled && !config.ttsEnabled) setShowVoiceDownload(true);
            setConfig(next);
          }}
        />
        {showVoiceDownload && (
          <VoiceModelDownload onDismiss={() => setShowVoiceDownload(false)} />
        )}

        <AnimatePresence mode="wait">
          
          {/* LANDING SCREEN (When Role === 'none') */}
          {role === 'none' && (
            <motion.div
              key="landing-launcher"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              
              {/* Mission statement description layout */}
              <div className="text-center max-w-3xl mx-auto space-y-5">
                <span className="px-4 py-1.5 bg-[#FFD93D] text-[#856404] font-black text-xs uppercase tracking-widest rounded-full border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] inline-block mb-2">
                  {t('level_badge', lang)}
                </span>
                <h1 className={`${getTypographySizeClass('title')} font-black text-[#2D3436] tracking-tight leading-none`}>
                  {t('landing_title', lang)}
                </h1>
                <p className={`${getTypographySizeClass('paragraph')} text-[#636E72] leading-relaxed font-bold`}>
                  {t('landing_subtitle', lang)}
                </p>
              </div>

              {/* Grid 3 Portal Launchers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="platforms-roles-grid">
                
                {/* 1. Student Door with high contrast blue border & offset shadow */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectRole('student')}
                  onMouseEnter={() => config.ttsEnabled && speakText(t('student_portal', lang) + '. ' + t('student_desc', lang), config.ttsSpeed, false, lang)}
                  className="p-8 rounded-[32px] bg-white border-4 border-[#4A90E2] shadow-[8px_8px_0px_#4A90E2] hover:shadow-[12px_12px_0px_#4A90E2] cursor-pointer transition-all flex flex-col justify-between hover:translate-x-[-3px] hover:translate-y-[-3px]"
                  id="launcher-student"
                >
                  <div className="space-y-5">
                    <div className="w-14 h-14 bg-[#E1F5FE] text-[#4A90E2] rounded-2xl flex items-center justify-center font-black border-2 border-[#2D3436]">
                      <BookOpen size={28} className="stroke-[2.5px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className={`${getTypographySizeClass('subtitle')} font-black text-[#2D3436]`}>
                        {t('student_portal', lang)}
                      </h2>
                      <p className={`${getTypographySizeClass('paragraph')} text-[#636E72] leading-snug font-medium`}>
                        {t('student_desc', lang)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100 mt-6">
                    <span className="text-xs font-black text-[#4A90E2] uppercase tracking-widest">{t('student_label', lang)}</span>
                    <ChevronRight size={18} className="text-[#2D3436] stroke-[3px]" />
                  </div>
                </motion.div>

                {/* 2. Educator Door with high contrast green border & offset shadow */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectRole('teacher')}
                  onMouseEnter={() => config.ttsEnabled && speakText(t('teacher_portal', lang) + '. ' + t('teacher_desc', lang), config.ttsSpeed, false, lang)}
                  className="p-8 rounded-[32px] bg-white border-4 border-[#6BCB77] shadow-[8px_8px_0px_#6BCB77] hover:shadow-[12px_12px_0px_#6BCB77] cursor-pointer transition-all flex flex-col justify-between hover:translate-x-[-3px] hover:translate-y-[-3px]"
                  id="launcher-teacher"
                >
                  <div className="space-y-5">
                    <div className="w-14 h-14 bg-[#F1F9F1] text-[#6BCB77] rounded-2xl flex items-center justify-center font-black border-2 border-[#2D3436]">
                      <GraduationCap size={28} className="stroke-[2.5px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className={`${getTypographySizeClass('subtitle')} font-black text-[#2D3436]`}>
                        {t('teacher_portal', lang)}
                      </h2>
                      <p className={`${getTypographySizeClass('paragraph')} text-[#636E72] leading-snug font-medium`}>
                        {t('teacher_desc', lang)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100 mt-6">
                    <span className="text-xs font-black text-[#6BCB77] uppercase tracking-widest">{t('teacher_label', lang)}</span>
                    <ChevronRight size={18} className="text-[#2D3436] stroke-[3px]" />
                  </div>
                </motion.div>

                {/* 3. Caregiver Door with high contrast coral border & offset shadow */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectRole('caregiver')}
                  onMouseEnter={() => config.ttsEnabled && speakText(t('caregiver_portal', lang) + '. ' + t('caregiver_desc', lang), config.ttsSpeed, false, lang)}
                  className="p-8 rounded-[32px] bg-white border-4 border-[#FF6B6B] shadow-[8px_8px_0px_#FF6B6B] hover:shadow-[12px_12px_0px_#FF6B6B] cursor-pointer transition-all flex flex-col justify-between hover:translate-x-[-3px] hover:translate-y-[-3px]"
                  id="launcher-caregiver"
                >
                  <div className="space-y-5">
                    <div className="w-14 h-14 bg-[#FFE5E5] text-[#FF6B6B] rounded-2xl flex items-center justify-center font-black border-2 border-[#2D3436]">
                      <Users size={28} className="stroke-[2.5px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className={`${getTypographySizeClass('subtitle')} font-black text-[#2D3436]`}>
                        {t('caregiver_portal', lang)}
                      </h2>
                      <p className={`${getTypographySizeClass('paragraph')} text-[#636E72] leading-snug font-medium`}>
                        {t('caregiver_desc', lang)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100 mt-6">
                    <span className="text-xs font-black text-[#FF6B6B] uppercase tracking-widest">{t('caregiver_label', lang)}</span>
                    <ChevronRight size={18} className="text-[#2D3436] stroke-[3px]" />
                  </div>
                </motion.div>

              </div>

              {/* Platform value and educational standard checklist overview */}
              <div className="p-6 bg-white border-4 border-[#2D3436] rounded-3xl shadow-[6px_6px_0px_#2D3436] flex flex-col sm:flex-row items-center gap-4" id="standard-info-box">
                <div className="p-3 bg-[#FFD93D] border-2 border-[#2D3436] rounded-xl text-[#2D3436]">
                  <Heart size={24} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#2D3436] text-base leading-none">{t('pedagogy_title', lang)}</h4>
                  <p className="text-xs text-[#636E72] font-semibold leading-relaxed mt-1.5">
                    {t('pedagogy_desc', lang)}
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* PORTALS ENTRY WRAPPERS */}
          {role === 'student' && <StudentPortal config={config} />}
          {role === 'teacher' && <TeacherPortal config={config} />}
          {role === 'caregiver' && <CaregiverPortal config={config} />}

        </AnimatePresence>
      </main>

      {/* Global simple footer with thick charcoal border style */}
      <footer className="mt-24 border-t-4 border-[#2D3436] py-10 bg-white text-center text-xs font-black text-[#636E72]">
        <p>{t('footer', lang)}</p>
      </footer>
    </div>
  );
}

