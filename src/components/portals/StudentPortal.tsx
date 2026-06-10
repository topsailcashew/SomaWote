/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AccessibilityConfig } from '../../types';
import { speakText, stopSpeaking } from '../../modules/voice/tts';
import { t, tts } from '../../lib/i18n';
import { 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  Award, 
  Smile, 
  ArrowLeft,
  BookOpen,
  Apple,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface StudentPortalProps {
  config: AccessibilityConfig;
}

// Simple and highly positive structured data for Literacy Adventure
interface LiteracyItem {
  id: string;
  word: string; // e.g. "CAT"
  phrases: string[]; // ['C for Cup', 'A for Apple', 'T for Toy']
  hint: string;
  icon: string; // emoji or simple letter representation
  themeColor: string; // pleasant pastel theme
}

const literacyAdventures: LiteracyItem[] = [
  {
    id: 'lit-1',
    word: 'CAT',
    phrases: ['c says kuh', 'a says ah', 't says tuh'],
    hint: 'A small fluffy pet that says meow!',
    icon: '🐱',
    themeColor: 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200'
  },
  {
    id: 'lit-2',
    word: 'SUN',
    phrases: ['s says sss', 'u says uh', 'n says nnn'],
    hint: 'A bright hot yellow circle in the sky!',
    icon: '☀️',
    themeColor: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200'
  },
  {
    id: 'lit-3',
    word: 'FROG',
    phrases: ['f says fff', 'r says rrr', 'o says ahh', 'g says guh'],
    hint: 'A green animal that jumps high in ponds!',
    icon: '🐸',
    themeColor: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-200'
  },
  {
    id: 'lit-4',
    word: 'TREE',
    phrases: ['t says tuh', 'r says rrr', 'ee says eee'],
    hint: 'A tall green plant with thick brown branches!',
    icon: '🌳',
    themeColor: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200'
  }
];

// Simple structured data for Numeracy activities
interface NumeracyItem {
  id: string;
  operand1: number;
  operand2: number;
  operator: '+';
  itemsType: string;
  emoji: string;
  options: number[];
  answer: number;
  themeColor: string;
}

const numeracyAdventures: NumeracyItem[] = [
  {
    id: 'num-1',
    operand1: 3,
    operand2: 2,
    operator: '+',
    itemsType: 'Apples',
    emoji: '🍎',
    options: [4, 5, 6],
    answer: 5,
    themeColor: 'bg-red-50 hover:bg-red-150 border-red-200 text-red-700'
  },
  {
    id: 'num-2',
    operand1: 4,
    operand2: 3,
    operator: '+',
    itemsType: 'Stars',
    emoji: '⭐',
    options: [6, 7, 8],
    answer: 7,
    themeColor: 'bg-amber-50 hover:bg-amber-150 border-amber-200 text-amber-700'
  },
  {
    id: 'num-3',
    operand1: 2,
    operand2: 2,
    operator: '+',
    itemsType: 'Frogs',
    emoji: '🐸',
    options: [3, 4, 5],
    answer: 4,
    themeColor: 'bg-green-50 hover:bg-green-150 border-green-200 text-green-700'
  }
];

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  criteria: string;
  color: string;
}

export const STUDENT_BADGES: Badge[] = [
  {
    id: 'phonics-master',
    title: 'Phonics Master',
    emoji: '🗣️',
    description: 'Mastered standard letter configurations and phonetic sounds of the alphabet!',
    criteria: 'Spelled a word correctly in Word Quest Adventure',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'number-explorer',
    title: 'Number Explorer',
    emoji: '🧮',
    description: 'Explored standard visual groupings to calculate visual additions!',
    criteria: 'Completed an addition challenge in Counting Playground',
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  },
  {
    id: 'star-seeker',
    title: 'Star Seeker',
    emoji: '⭐',
    description: 'Gathered a radiant collection of stars aligning with early milestone exercises.',
    criteria: 'Accumulated 5 or more total gold stars',
    color: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    id: 'phonics-explorer',
    title: 'Phonics Explorer',
    emoji: '🎓',
    description: 'Embarking on early literacy trails and learning phonetic sounds.',
    criteria: 'Selected the Word Quest Adventure map',
    color: 'bg-sky-100 text-sky-900 border-sky-300'
  },
  {
    id: 'syllabi-hero',
    title: 'Syllabus Hero',
    emoji: '🏆',
    description: 'Possesses top computational power and high-focus spelling capacity.',
    criteria: 'Accumulated 15 or more total gold stars',
    color: 'bg-rose-100 text-rose-900 border-rose-300'
  }
];

export default function StudentPortal({ config }: StudentPortalProps) {
  const lang = config.lang ?? 'en';
  const [activeTab, setActiveTab] = useState<'menu' | 'literacy' | 'numeracy'>('menu');
  
  // Literacy Game States
  const [litIndex, setLitIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [litSuccess, setLitSuccess] = useState(false);
  
  // Numeracy Game States
  const [numIndex, setNumIndex] = useState(0);
  const [selectedNumAnswer, setSelectedNumAnswer] = useState<number | null>(null);
  const [numSuccess, setNumSuccess] = useState(false);
  const [ballsTapped, setBallsTapped] = useState<Record<string, boolean>>({});

  // Achievements
  const [savedStars, setSavedStars] = useState(() => {
    try {
      const saved = localStorage.getItem('inclusive_student_stars');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Digital badges rewards states
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('inclusive_student_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<Badge | null>(null);

  const unlockBadge = (badgeId: string) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeId)) return prev;
      const next = [...prev, badgeId];
      try {
        localStorage.setItem('inclusive_student_badges', JSON.stringify(next));
      } catch (err) {
        console.error('Badge storage error:', err);
      }
      
      const badgeObj = STUDENT_BADGES.find(b => b.id === badgeId);
      if (badgeObj) {
        speakText(tts.badgeEarned(lang, badgeObj.title, badgeObj.criteria), config.ttsSpeed, false, lang);
        setRecentUnlockedBadge(badgeObj);
      }
      return next;
    });
  };

  const saveStarsCount = (count: number) => {
    setSavedStars(count);
    localStorage.setItem('inclusive_student_stars', count.toString());
    
    // Check stars milestones dynamically
    if (count >= 5) {
      unlockBadge('star-seeker');
    }
    if (count >= 15) {
      unlockBadge('syllabi-hero');
    }
  };

  // Sync saved badges with stars count on mount/boot
  useEffect(() => {
    if (savedStars >= 5) {
      setUnlockedBadges(prev => prev.includes('star-seeker') ? prev : [...prev, 'star-seeker']);
    }
    if (savedStars >= 15) {
      setUnlockedBadges(prev => prev.includes('syllabi-hero') ? prev : [...prev, 'syllabi-hero']);
    }
  }, [savedStars]);

  // Helper styles based on accessibility config
  const getContainerStyles = (themeMode?: 'blue' | 'coral' | 'green' | 'yellow') => {
    if (config.contrastMode === 'high-contrast-dark') {
      return 'bg-black text-yellow-300 border-yellow-300 border-2';
    }
    if (config.contrastMode === 'high-contrast-light') {
      return 'bg-white text-black border-black border-4';
    }
    if (config.contrastMode === 'soft-pastel') {
      return 'bg-amber-50/70 text-slate-800 border-orange-200 border';
    }
    if (themeMode === 'blue') {
      return 'bg-white text-[#2D3436] border-4 border-[#4A90E2] shadow-[8px_8px_0px_#4A90E2] rounded-[32px]';
    }
    if (themeMode === 'coral') {
      return 'bg-white text-[#2D3436] border-4 border-[#FF6B6B] shadow-[8px_8px_0px_#FF6B6B] rounded-[32px]';
    }
    if (themeMode === 'green') {
      return 'bg-white text-[#2D3436] border-4 border-[#6BCB77] shadow-[8px_8px_0px_#6BCB77] rounded-[32px]';
    }
    if (themeMode === 'yellow') {
      return 'bg-white text-[#2D3436] border-4 border-[#FFD93D] shadow-[8px_8px_0px_#FFD93D] rounded-[32px]';
    }
    return 'bg-white text-[#2D3436] border-4 border-[#2D3436] shadow-[8px_8px_0px_#2D3436] rounded-[32px]';
  };

  const getTextSizeClass = (type: 'heading' | 'subheading' | 'body' | 'button') => {
    if (type === 'heading') {
      if (config.textSize === 'large') return 'text-3xl md:text-4xl';
      if (config.textSize === 'extra-large') return 'text-4xl md:text-5xl';
      return 'text-2xl md:text-3xl';
    }
    if (type === 'subheading') {
      if (config.textSize === 'large') return 'text-xl md:text-2xl';
      if (config.textSize === 'extra-large') return 'text-2xl md:text-3xl';
      return 'text-lg md:text-xl';
    }
    if (type === 'button') {
      if (config.textSize === 'large') return 'text-lg py-4 px-6';
      if (config.textSize === 'extra-large') return 'text-xl py-5 px-8';
      return 'text-sm py-2.5 px-4';
    }
    // Body Text
    if (config.textSize === 'large') return 'text-lg md:text-xl leading-relaxed';
    if (config.textSize === 'extra-large') return 'text-xl md:text-2xl leading-loose';
    return 'text-sm md:text-base leading-relaxed';
  };

  const getFontFamilyClass = () => {
    if (config.fontFamily === 'dyslexic') return 'font-dyslexic';
    if (config.fontFamily === 'mono') return 'font-mono tracking-tight';
    return 'font-sans';
  };

  // Speaks description automatically on tab load if TTS enabled
  useEffect(() => {
    if (activeTab === 'menu') {
      speakText(tts.welcomeBack(lang), config.ttsSpeed, false, lang);
    } else if (activeTab === 'literacy') {
      const current = literacyAdventures[litIndex];
      speakText(tts.spellingIntro(lang, litIndex + 1, current.hint), config.ttsSpeed, false, lang);
      // Unlock phonics explorer for starting literacy paths
      unlockBadge('phonics-explorer');
    } else if (activeTab === 'numeracy') {
      const current = numeracyAdventures[numIndex];
      speakText(tts.countingIntro(lang, numIndex + 1), config.ttsSpeed, false, lang);
    }
  }, [activeTab]);

  // Handle literacy letter typing click
  const handleLetterClick = (letter: string) => {
    const currentWord = literacyAdventures[litIndex].word;
    const targetLetter = currentWord[typedLetters.length];
    
    if (letter === targetLetter) {
      const nextTyped = [...typedLetters, letter];
      setTypedLetters(nextTyped);
      
      // Speak letter phonics
      const phoneSpec = literacyAdventures[litIndex].phrases[typedLetters.length] || `the letter ${letter}`;
      speakText(tts.letterSound(lang, letter, phoneSpec), config.ttsSpeed, false, lang);

      if (nextTyped.join('') === currentWord) {
        setLitSuccess(true);
        const newStars = savedStars + 2;
        saveStarsCount(newStars);
        speakText(tts.wordComplete(lang, currentWord), config.ttsSpeed, false, lang);
        // Unlock Phonics Master badge
        unlockBadge('phonics-master');
      }
    } else {
      speakText(tts.wrongLetter(lang, letter, targetLetter), config.ttsSpeed, false, lang);
    }
  };

  // Numeracy answer logic
  const handleNumeracyAnswer = (option: number) => {
    const current = numeracyAdventures[numIndex];
    setSelectedNumAnswer(option);
    if (option === current.answer) {
      setNumSuccess(true);
      const newStars = savedStars + 2;
      saveStarsCount(newStars);
      speakText(tts.countCorrect(lang, current.operand1, current.operand2, current.answer), config.ttsSpeed, false, lang);
      // Unlock Number Explorer badge
      unlockBadge('number-explorer');
    } else {
      speakText(tts.countWrong(lang), config.ttsSpeed, false, lang);
    }
  };

  const resetLiteracy = () => {
    setTypedLetters([]);
    setLitSuccess(false);
    const current = literacyAdventures[litIndex];
    speakText(tts.tryAgainSpell(lang, litIndex + 1, current.hint), config.ttsSpeed, false, lang);
  };

  const nextLiteracy = () => {
    const nextIdx = (litIndex + 1) % literacyAdventures.length;
    setLitIndex(nextIdx);
    setTypedLetters([]);
    setLitSuccess(false);
    const current = literacyAdventures[nextIdx];
    speakText(tts.nextLevel(lang, nextIdx + 1, current.hint), config.ttsSpeed, false, lang);
  };

  const resetNumeracy = () => {
    setSelectedNumAnswer(null);
    setNumSuccess(false);
    setBallsTapped({});
    speakText(tts.retryCount(lang), config.ttsSpeed, false, lang);
  };

  const nextNumeracy = () => {
    const nextIdx = (numIndex + 1) % numeracyAdventures.length;
    setNumIndex(nextIdx);
    setSelectedNumAnswer(null);
    setNumSuccess(false);
    setBallsTapped({});
    const current = numeracyAdventures[nextIdx];
    speakText(tts.nextCount(lang, current.operand1, current.operand2), config.ttsSpeed, false, lang);
  };

  const tapBall = (id: string, indexStr: string) => {
    setBallsTapped(prev => ({ ...prev, [id]: !prev[id] }));
    speakText(indexStr, config.ttsSpeed, false, lang);
  };

  return (
    <div className={`space-y-8 ${getFontFamilyClass()}`} id="student-portal-root">
      {/* Top Banner section styled as a chunky neo-brutalist banner card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-[32px] bg-gradient-to-r from-[#4A90E2] to-[#6BCB77] text-white border-4 border-[#2D3436] shadow-[8px_8px_0px_#2D3436]">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 bg-[#FFD93D] border-3 border-[#2D3436] text-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0px_#2D3436]">🎒</div>
          <div>
            <h2 className={`${getTextSizeClass('heading')} font-black tracking-tight leading-none text-white`}>
              The Learner Portal
            </h2>
            <p className="opacity-95 font-bold text-xs sm:text-sm mt-1.5">
              Fun tactile spelling and numeracy adventures aligned with standard primary curriculum guidelines.
            </p>
          </div>
        </div>

        {/* Big accessible gold star stats */}
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => speakText(tts.starsCount(lang, savedStars), config.ttsSpeed, true, lang)}
          className="flex items-center gap-3 bg-[#FFD93D] text-[#2D3436] border-4 border-[#2D3436] font-black px-6 py-3.5 rounded-2xl shadow-[4px_4px_0px_#2D3436] cursor-pointer"
          aria-label={`Your total score: ${savedStars} gold stars.`}
        >
          <Award className="text-[#856404] animate-bounce" size={24} />
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider block font-black text-[#856404]">{t('sp_your_stars', lang)}</span>
            <span className="text-2xl font-black">{savedStars} ★</span>
          </div>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: MENU */}
        {activeTab === 'menu' && (
          <motion.div
            key="menu-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Literacy Pathway Card */}
            <div 
              className={`p-8 cursor-pointer transform transition-all flex flex-col justify-between min-h-[320px] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px_#4A90E2] ${getContainerStyles('blue')}`}
              onClick={() => setActiveTab('literacy')}
              onMouseEnter={() => config.ttsEnabled && speakText(tts.wordQuestCard(lang), config.ttsSpeed, false, lang)}
              id="lit-pathway-card"
            >
              <div>
                <div className="w-16 h-16 bg-[#E1F5FE] text-[#4A90E2] border-2 border-[#2D3436] rounded-2xl flex items-center justify-center font-black mb-6 shadow-[3px_3px_0px_#2D3436]">
                  <BookOpen size={32} className="stroke-[2.5px]" />
                </div>
                <h3 className={`${getTextSizeClass('subheading')} font-black text-[#2D3436] mb-3`}>
                  ✏️ {t('sp_word_quest', lang)}
                </h3>
                <p className={`${getTextSizeClass('body')} text-[#636E72] font-semibold leading-relaxed mb-6`}>
                  {t('sp_word_quest_desc', lang)}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100 mt-4">
                <span className="text-xs font-black text-[#4A90E2] uppercase tracking-widest bg-[#E1F5FE] border-2 border-[#4A90E2] px-4 py-1.5 rounded-full">{t('tp_literacy', lang)}</span>
                <span className="p-2 bg-[#4A90E2] text-white rounded-full border-2 border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]">
                  <ArrowRight size={20} className="stroke-[3px]" />
                </span>
              </div>
            </div>

            {/* Numeracy Pathway Card */}
            <div 
              className={`p-8 cursor-pointer transform transition-all flex flex-col justify-between min-h-[320px] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[12px_12px_0px_#FF6B6B] ${getContainerStyles('coral')}`}
              onClick={() => setActiveTab('numeracy')}
              onMouseEnter={() => config.ttsEnabled && speakText(tts.countingCard(lang), config.ttsSpeed, false, lang)}
              id="num-pathway-card"
            >
              <div>
                <div className="w-16 h-16 bg-[#FFE5E5] text-[#FF6B6B] border-2 border-[#2D3436] rounded-2xl flex items-center justify-center font-black mb-6 shadow-[3px_3px_0px_#2D3436]">
                  <Apple size={32} className="stroke-[2.5px]" />
                </div>
                <h3 className={`${getTextSizeClass('subheading')} font-black text-[#2D3436] mb-3`}>
                  🧮 {t('sp_counting', lang)}
                </h3>
                <p className={`${getTextSizeClass('body')} text-[#636E72] font-semibold leading-relaxed mb-6`}>
                  {t('sp_counting_desc', lang)}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100 mt-4">
                <span className="text-xs font-black text-[#FF6B6B] uppercase tracking-widest bg-[#FFE5E5] border-2 border-[#FF6B6B] px-4 py-1.5 rounded-full">{t('tp_numeracy', lang)}</span>
                <span className="p-2 bg-[#FF6B6B] text-white rounded-full border-2 border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]">
                  <ArrowRight size={20} className="stroke-[3px]" />
                </span>
              </div>
            </div>

            {/* Prize Cabinet Section */}
            <div className="md:col-span-2 p-6 border-4 border-[#2D3436] bg-amber-50 rounded-[32px] shadow-[4px_4px_0px_#2D3436] text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-orange-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="text-amber-600 stroke-[2.5px]" size={22} id="chest-award-icon" />
                  <h3 className={`${getTextSizeClass('subheading')} font-black text-[#2D3436]`}>My Digital Achievement Cabinet</h3>
                </div>
                <span className="text-[10px] font-black uppercase text-[#2D3436] bg-[#FFD93D] border-2 border-[#2D3436] px-3 py-1 rounded-xl shadow-[1.5px_1.5px_0px_#2D3436]">
                  {unlockedBadges.length} / {STUDENT_BADGES.length} {t('sp_badges', lang)}
                </span>
              </div>
              
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                Complete daily spelling and math quests to unlock and fill your cabinet! Tap on any badge to hear its special story out loud.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                {STUDENT_BADGES.map((badge) => {
                  const isUnlocked = unlockedBadges.includes(badge.id);
                  return (
                    <motion.button
                      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                      whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                      key={badge.id}
                      onClick={() => {
                        const message = isUnlocked
                          ? `You unlocked the ${badge.title} badge! ${badge.description}`
                          : `Locked badge. ${badge.criteria}. Keep playing to earn this!`;
                        speakText(message, config.ttsSpeed, true, lang);
                      }}
                      className={`p-4 border-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                        isUnlocked
                          ? `${badge.color} border-[#2D3436] shadow-[3px_3px_0px_#2D3436] cursor-pointer`
                          : 'bg-slate-100 text-slate-400 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] mb-2">
                        {isUnlocked ? badge.emoji : '❓'}
                      </div>
                      <div>
                        <span className="font-extrabold text-[12px] block leading-tight text-[#2D3436]">{badge.title}</span>
                        <span className="text-[9px] font-bold text-slate-500 mt-1 block">
                          {isUnlocked ? 'Unlocked! 🎉' : 'Locked'}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LITERACY ADVENTURE */}
        {activeTab === 'literacy' && (
          <motion.div
            key="literacy-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-8 shadow-sm border ${getContainerStyles('blue')}`}
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b-2 border-slate-100">
              <button
                onClick={() => setActiveTab('menu')}
                className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-black bg-white text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#2D3436] cursor-pointer active:translate-y-[1px]"
                aria-label="Back to main student options"
              >
                <ArrowLeft size={16} className="stroke-[2.5px]" />
                <span>Choose Game</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wide">Adventure Level</span>
                <span className="px-4 py-1.5 bg-[#E1F5FE] text-[#4A90E2] border-2 border-[#2D3436] font-black rounded-lg text-sm shadow-[2px_2px_0px_#2D3436]">
                  {litIndex + 1} / {literacyAdventures.length}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Word Hint & Vocal Speaker */}
              <div className="md:col-span-4 text-center space-y-5">
                <motion.div 
                  className="mx-auto w-32 h-32 rounded-[24px] bg-[#FDFCF0] border-4 border-[#2D3436] shadow-[6px_6px_0px_#2D3436] flex items-center justify-center text-7xl select-none"
                  animate={{ scale: litSuccess ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: litSuccess ? 2 : 0 }}
                >
                  {literacyAdventures[litIndex].icon}
                </motion.div>
                
                <h3 
                  onClick={() => speakText(literacyAdventures[litIndex].hint, config.ttsSpeed, true, lang)}
                  className={`font-black cursor-pointer text-[#2D3436] hover:text-[#4A90E2] p-3.5 bg-white border-2 border-[#2D3436] rounded-2xl inline-flex items-center gap-2 shadow-[2px_2px_0px_#2D3436] hover:translate-y-[-1px] transition-all ${getTextSizeClass('body')}`}
                >
                  <Volume2 size={18} className="text-[#6BCB77] stroke-[2.5px] animate-pulse" />
                  <span>Hear Clue: "{literacyAdventures[litIndex].hint}"</span>
                </h3>
              </div>

              {/* Right Column: Interaction Sandbox */}
              <div className="md:col-span-8 space-y-8">
                {/* Word Spells Target Boxes */}
                <div className="flex flex-wrap justify-center gap-4">
                  {literacyAdventures[litIndex].word.split('').map((letter, idx) => {
                    const isRevealed = idx < typedLetters.length;
                    return (
                      <div
                        key={`spell-${idx}`}
                        className={`w-16 h-20 md:w-20 md:h-24 rounded-2xl flex flex-col justify-center items-center border-4 transition-all ${
                          isRevealed 
                            ? 'bg-[#E1F5FE] border-[#4A90E2] text-[#4A90E2] shadow-[3px_3px_0px_#2D3436]' 
                            : 'bg-slate-55 border-dashed border-[#2D3436] text-slate-400'
                        }`}
                      >
                        <span className="text-4xl md:text-5xl font-black">{isRevealed ? letter : '?'}</span>
                        <span className="text-[10px] tracking-widest uppercase opacity-75 font-black mt-1">Box {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Keyboard letter blocks to pick */}
                <div className="space-y-4">
                  <div className={`text-center font-black text-xs uppercase tracking-widest text-[#2D3436] ${getTextSizeClass('body')}`}>
                    Find and Tap the Next Letter!
                  </div>
                  
                  {/* Letters choice row */}
                  <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                    {/* Generates keyboard dynamically */}
                    {['C', 'A', 'T', 'S', 'U', 'N', 'F', 'R', 'O', 'G', 'E'].map((letter, idx) => {
                      const word = literacyAdventures[litIndex].word;
                      const nextTargetLetter = word[typedLetters.length];
                      const isTarget = letter === nextTargetLetter;
                      
                      return (
                        <button
                          key={`keyboard-${letter}-${idx}`}
                          onClick={() => handleLetterClick(letter)}
                          className="w-12 h-12 md:w-14 md:h-14 font-black flex items-center justify-center rounded-2xl shadow-[3px_3px_0px_#2D3436] border-2 border-[#2D3436] bg-white text-[#2D3436] text-lg md:text-xl hover:bg-[#FDFCF0] hover:translate-y-[-1px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_#2D3436] transition-all cursor-pointer"
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Action Utilities */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    onClick={resetLiteracy}
                    className="flex items-center gap-2 py-3 px-5 rounded-2xl border-2 border-[#2D3436] bg-white text-[#2D3436] shadow-[2px_2px_0px_#2D3436] text-xs font-black cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    <RotateCcw size={15} className="stroke-[2.5px]" />
                    <span>Start Again</span>
                  </button>
                  {litSuccess && (
                    <button
                      onClick={nextLiteracy}
                      className="flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-[#4A90E2] border-2 border-[#2D3436] text-white shadow-[4px_4px_0px_#1B4E8C] text-xs font-black cursor-pointer transition-all animate-bounce"
                    >
                      <span>Next Adventure Level</span>
                      <ArrowRight size={15} className="stroke-[2.5px]" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Level Complete Sparks */}
            <AnimatePresence>
              {litSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-8 p-6 rounded-[24px] bg-[#E1F5FE] border-4 border-[#4A90E2] shadow-[6px_6px_0px_#4A90E2] text-center text-[#2D3436]"
                >
                  <p className="text-xl font-black flex items-center justify-center gap-2">
                    <Sparkles className="text-amber-500 animate-spin" size={24} />
                    Amazing Work! You Spelled "{literacyAdventures[litIndex].word}"!
                  </p>
                  <p className="text-xs font-bold text-[#636E72] mt-1.5 opacity-90">
                    You've proved spelling capacity! Try the next word challenge above to gain more rewards.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 3: NUMERACY PLAYGROUND */}
        {activeTab === 'numeracy' && (
          <motion.div
            key="numeracy-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-8 shadow-sm border ${getContainerStyles('coral')}`}
          >
            {/* Header toolbar */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b-2 border-slate-100">
              <button
                onClick={() => setActiveTab('menu')}
                className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-black bg-white text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#2D3436] cursor-pointer mb-0.5 active:translate-y-[1px]"
                aria-label="Back to primary options"
              >
                <ArrowLeft size={16} className="stroke-[2.5px]" />
                <span>Choose Game</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wide">Problem Level</span>
                <span className="px-4 py-1.5 bg-[#FFE5E5] text-[#FF6B6B] border-2 border-[#2D3436] font-black rounded-lg text-sm shadow-[2px_2px_0px_#2D3436]">
                  {numIndex + 1} / {numeracyAdventures.length}
                </span>
              </div>
            </div>

            {/* Core Interaction equation block */}
            <div className="space-y-8">
              {/* Question Headline */}
              <div className="text-center">
                <h3 className={`${getTextSizeClass('subheading')} font-black text-[#2D3436]`}>
                  {t('sp_count_question', lang)} ({numeracyAdventures[numIndex].itemsType})
                </h3>
                <p className="text-xs font-black text-slate-500 mt-1 uppercase tracking-wider">
                  💡 Hint: Tap on each shape to count it out loud!
                </p>
              </div>

              {/* Graphical Equation Box */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 rounded-[24px] bg-[#FDFCF0] border-4 border-[#2D3436] shadow-[6px_6px_0px_#2D3436]">
                
                {/* Visual Block A */}
                <div className="flex flex-col items-center">
                  <div className="font-black text-xs text-[#2D3436] uppercase tracking-wider mb-2.5 bg-[#FFE5E5] px-3 py-1 border-2 border-[#2D3436] rounded-lg shadow-[1px_1px_0px_#2D3436]">Group 1 ({numeracyAdventures[numIndex].operand1})</div>
                  <div className="flex flex-wrap justify-center gap-2.5 max-w-[150px]">
                    {Array.from({ length: numeracyAdventures[numIndex].operand1 }).map((_, i) => {
                      const ballId = `op1-${i}`;
                      const isTapped = ballsTapped[ballId];
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.85 }}
                          onClick={() => tapBall(ballId, `${i+1}!`)}
                          key={ballId}
                          className={`w-14 h-14 rounded-full cursor-pointer text-2xl flex items-center justify-center transition-all ${
                            isTapped 
                              ? 'bg-[#FFBB00] text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436]' 
                              : 'bg-white hover:bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436]'
                          }`}
                        >
                          {numeracyAdventures[numIndex].emoji}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Mathematical Operator Sign */}
                <div className="text-3xl font-black text-[#2D3436] bg-[#FFE5E5] px-5 py-2.5 border-2 border-[#2D3436] rounded-xl shadow-[3px_3px_0px_#2D3436] select-none">+</div>

                {/* Visual Block B */}
                <div className="flex flex-col items-center">
                  <div className="font-black text-xs text-[#2D3436] uppercase tracking-wider mb-2.5 bg-[#FFE5E5] px-3 py-1 border-2 border-[#2D3436] rounded-lg shadow-[1px_1px_0px_#2D3436]">Group 2 ({numeracyAdventures[numIndex].operand2})</div>
                  <div className="flex flex-wrap justify-center gap-2.5 max-w-[150px]">
                    {Array.from({ length: numeracyAdventures[numIndex].operand2 }).map((_, i) => {
                      const ballId = `op2-${i}`;
                      const isTapped = ballsTapped[ballId];
                      const overallNum = numeracyAdventures[numIndex].operand1 + i + 1;
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.85 }}
                          onClick={() => tapBall(ballId, `${overallNum}!`)}
                          key={ballId}
                          className={`w-14 h-14 rounded-full cursor-pointer text-2xl flex items-center justify-center transition-all ${
                            isTapped 
                              ? 'bg-[#FFBB00] text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436]' 
                              : 'bg-white hover:bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436]'
                          }`}
                        >
                          {numeracyAdventures[numIndex].emoji}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Number answer picks */}
              <div className="space-y-4 max-w-sm mx-auto">
                <div className="text-center font-black text-xs uppercase tracking-widest text-[#2D3436] leading-none">
                  Choose the Correct Answer Block
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {numeracyAdventures[numIndex].options.map((option) => {
                    const isSelected = selectedNumAnswer === option;
                    const isRight = option === numeracyAdventures[numIndex].answer;
                    
                    let bgBtn = 'bg-white text-[#2D3436] border-2 border-[#2D3436] shadow-[3px_3px_0px_#2D3436] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#2D3436] active:translate-y-[1px]';
                    if (isSelected) {
                      bgBtn = isRight 
                        ? 'bg-[#6BCB77] text-white border-2 border-[#2D3436] shadow-[3px_3px_0px_#2D3436]' 
                        : 'bg-[#FF6B6B] text-white border-2 border-[#2D3436] shadow-[3px_3px_0px_#2D3436]';
                    }
                    if (config.contrastMode === 'high-contrast-dark') {
                      bgBtn = isSelected 
                        ? (isRight ? 'bg-yellow-300 text-black border-2 border-white' : 'bg-black text-red-500 border-2 border-red-500')
                        : 'bg-black text-yellow-300 border-2 border-yellow-300';
                    } else if (config.contrastMode === 'high-contrast-light') {
                      bgBtn = isSelected
                        ? (isRight ? 'bg-black text-white border-2 border-black font-black' : 'bg-white text-black line-through border-2 border-black')
                        : 'bg-white text-black border-2 border-black';
                    }

                    return (
                      <button
                        key={`num-opt-${option}`}
                        onClick={() => handleNumeracyAnswer(option)}
                        className={`py-4 rounded-2xl font-black text-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${bgBtn}`}
                        aria-label={`Option ${option}`}
                      >
                        <span>{option}</span>
                        {isSelected && isRight && <CheckCircle2 size={16} className="mt-1 text-white stroke-[2.5px]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Utilities */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={resetNumeracy}
                  className="flex items-center gap-2 py-3 px-5 rounded-2xl border-2 border-[#2D3436] bg-white text-[#2D3436] shadow-[2px_2px_0px_#2D3436] text-xs font-black cursor-pointer transition-all hover:translate-y-[-1px]"
                >
                  <RotateCcw size={15} className="stroke-[2.5px]" />
                  <span>Count Again</span>
                </button>
                {numSuccess && (
                  <button
                    onClick={nextNumeracy}
                    className="flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-[#FF6B6B] border-2 border-[#2D3436] text-white shadow-[4px_4px_0px_#8C1B1B] text-xs font-black cursor-pointer transition-all animate-bounce"
                  >
                    <span>{t('sp_next', lang)}</span>
                    <ArrowRight size={15} className="stroke-[2.5px]" />
                  </button>
                )}
              </div>
            </div>

            {/* Answer completion details banner */}
            <AnimatePresence>
              {numSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-8 p-6 rounded-[24px] bg-[#FFE5E5] border-4 border-[#FF6B6B] shadow-[6px_6px_0px_#FF6B6B] text-center text-[#2D3436]"
                >
                  <p className="text-xl font-black flex items-center justify-center gap-2">
                    <Smile className="text-amber-600 animate-spin" size={24} />
                    Bravo! You found the correct formula.
                  </p>
                  <p className="text-xs font-bold text-[#636E72] mt-1.5 opacity-90">
                    {numeracyAdventures[numIndex].operand1} {numeracyAdventures[numIndex].operator} {numeracyAdventures[numIndex].operand2} equals {numeracyAdventures[numIndex].answer}! Excellent focus.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Badge Congratulation Celebration Modal */}
      <AnimatePresence>
        {recentUnlockedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setRecentUnlockedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.82, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.82, y: 40 }}
              className="p-8 max-w-md w-full bg-white border-4 border-[#2D3436] rounded-[36px] shadow-[8px_8px_0px_rgba(0,0,0,0.8)] text-center space-y-6 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti simulation bubbles */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-[#6BCB77]" />
              
              <div className="relative pt-4 space-y-2">
                <span className="text-6xl animate-bounce tracking-widest block filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)]">🎉 {recentUnlockedBadge.emoji} 🎉</span>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border-2 border-emerald-300 shadow-[1px_1px_rgba(0,0,0,0.1)] inline-block tracking-widest">
                  Badge Unlocked!
                </span>
                <h3 className="text-2xl font-black text-[#2D3436] leading-tight block uppercase tracking-tight">
                  {recentUnlockedBadge.title}
                </h3>
              </div>

              <div className="p-4 bg-amber-50/70 border-2 border-amber-200 rounded-2xl">
                <p className="text-xs text-slate-700 font-extrabold leading-relaxed">
                  "{recentUnlockedBadge.description}"
                </p>
                <div className="mt-2.5 text-[9px] font-black text-[#2D3436] bg-[#FFD93D] border-2 border-[#2D3436] py-1 px-3.5 rounded-full inline-block uppercase shadow-[1px_1px_0px_rgba(0,0,0,0.1)]">
                  Unlocked by: {recentUnlockedBadge.criteria}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    speakText(tts.badgeCongrats(lang, recentUnlockedBadge.title), config.ttsSpeed, true, lang);
                  }}
                  className="w-full py-2.5 bg-[#FFD93D] hover:bg-[#ebd052] font-black text-xs text-[#2D3436] rounded-xl border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] cursor-pointer transition-all active:translate-y-[1px] flex items-center justify-center gap-1.5"
                >
                  🔊 Hear Celebration Message
                </button>
                
                <button
                  type="button"
                  onClick={() => setRecentUnlockedBadge(null)}
                  className="w-full py-2 bg-white hover:bg-slate-50 font-black text-xs text-slate-700 rounded-xl border-2 border-[#2D3436] cursor-pointer transition-all"
                >
                  Awesome, Close!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
