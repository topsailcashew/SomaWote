/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  CheckCircle, 
  MessageSquare, 
  Sliders, 
  ArrowRight, 
  TrendingUp, 
  Award,
  BookMarked,
  FileCheck,
  Send,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { StudentProfile, Course, LessonPlan, AccessibilityConfig } from '../../types';
import { speakText } from '../../modules/voice/tts';
import { t, tts } from '../../lib/i18n';
import EngagementChart from '../charts/EngagementChart';

interface TeacherPortalProps {
  config: AccessibilityConfig;
}

// Initial Simulated Student Profiles
const initialStudents: StudentProfile[] = [
  {
    id: 's-1',
    name: 'Sophia Vance',
    age: 7,
    primaryNeed: 'Dyslexia & Phonic Fatigue',
    accommodations: ['Lexend High-legibility font', 'Reading Guide Ruler helper', 'Audio phoneme descriptions'],
    literacyProgress: 84,
    numeracyProgress: 68,
    recentActivity: 'Completed CAT Spelling level in 4 attempts'
  },
  {
    id: 's-2',
    name: 'Liam Chen',
    age: 8,
    primaryNeed: 'Low Vision / Auditory Preference',
    accommodations: ['Text-To-Speech Narrator', 'High Contrast Mode', 'Double sized buttons'],
    literacyProgress: 52,
    numeracyProgress: 76,
    recentActivity: 'Counted 5 Apples in Addition task with voice reader active'
  },
  {
    id: 's-3',
    name: 'Maya Patel',
    age: 7,
    primaryNeed: 'Autism Spectrum (Sensory Sensitivity)',
    accommodations: ['Soft Pastel anti-glare color palette', 'Predictable linear layout', 'No sudden loud chimes'],
    literacyProgress: 75,
    numeracyProgress: 92,
    recentActivity: 'Successfully completed Level 3 Counting with zero assistance'
  },
  {
    id: 's-4',
    name: 'Lucas Brady',
    age: 9,
    primaryNeed: 'Fine Motor / Physical Delay',
    accommodations: ['Massive Touch targets', 'Slower interaction speed window', 'No click-dragging tasks'],
    literacyProgress: 68,
    numeracyProgress: 62,
    recentActivity: 'Reviewed week 2 numerals with Caregiver guidelines'
  }
];

// Professional Capacity-Building Courses
const initialCourses: Course[] = [
  {
    id: 'c-1',
    title: 'Universal Design for Learning (UDL) Basics',
    category: 'udl',
    duration: '15 mins',
    difficulty: 'Beginner',
    description: 'Learn the core three pillars of UDL: Multiple means of Engagement, Representation, and Action & Expression, specifically applied to primary schools.',
    completed: false,
    modules: [
      { title: 'The Three Core Principles of UDL', content: 'Modern neuroscience teaches us that students possess diverse learning styles. UDL outlines: 1. engagement (captivate through child interests), 2. representation (present information via visuals, text, and rich speech), and 3. action/expression (let learners show knowledge through tapping, speaking, or drawing).', completed: true },
      { title: 'Creating Flexible Visual Class Environments', content: 'Ensure all texts have high readability contrast. Do not group files into deep nested digital pathways; keep navigation flat. Introduce tactile or physical models representing abstract numerical formulas.', completed: false },
      { title: 'Simple Accommodations Matrix', content: 'Always pair your reading prompts with standard voice recordings. Allow students with speech differences to use alternative communication logs, tablets, or visual cards to express answers.', completed: false }
    ]
  },
  {
    id: 'c-2',
    title: 'Phonemic Play for Early Dyslexic Readers',
    category: 'literacy',
    duration: '10 mins',
    difficulty: 'Intermediate',
    description: 'Practical tactics to bypass decoding fatigue by integrating tactile and phonics-guided games in early spelling curriculum.',
    completed: false,
    modules: [
      { title: 'Decoding Blockages and Font Spacing', content: 'Children with dyslexia frequently find letters blending visually on screens. Utilizing heavily weighted letters (like Lexend font) aids the brain in fixing characters in space, reducing reading stress.', completed: false },
      { title: 'Vocal Reinforcement Methodologies', content: 'Instruct the student to hear, say, and form phonetic components before standard writing, allowing auditory cues to support retention.', completed: false }
    ]
  },
  {
    id: 'c-3',
    title: 'Remediating Dyscalculia using Tactile Math',
    category: 'numeracy',
    duration: '12 mins',
    difficulty: 'Intermediate',
    description: 'Build robust numeracy foundations using touch indicators, sensory apples, and visual equations rather than plain numerical text.',
    completed: false,
    modules: [
      { title: 'Tactile Representation vs Abstract Formulas', content: 'Abstract math symbols (+, -, =) can cause high anxiety. By pairing operations with sensory spheres that kids can tap and tally, the child absorbs actual numeric quantities instead of meaningless glyphs.', completed: false },
      { title: 'Cognitive Number line methods', content: 'Build linear interactive sliders where kids move an animal forward and backward to experience counting steps firsthand.', completed: false }
    ]
  }
];

// Sample pre-modeled Lesson Plans that teachers can dynamically download or adapt
const samplePlans: LessonPlan[] = [
  {
    id: 'lp-1',
    title: 'Sight Words: Consonants Match',
    subject: 'Literacy',
    grade: 'Primary Grade 1-2',
    objective: 'Identify and formulate short vowel-consonant combinations (e.g. CAT, SUN) independently using alternative feedback mechanisms.',
    standardProcedure: 'Present five visual flashcards to the classroom. Guide students to pronounce each starting consonant phonetically and spell the corresponding animal name.',
    visualAccommodation: 'Use bold yellow-on-black symbols or 200% scalable typography. Introduce physical model blocks for non-tablet learners.',
    auditoryAccommodation: 'Support with TTS voicing. Each letter speaks its name and phonetic sound once hovered or selected.',
    cognitiveAccommodation: 'Simplify selections to a limited set of distractions to prevent cognitive processing overload.',
    physicalAccommodation: 'Enforce massive click targets (48px+) and disable any timer pressures or rapid double-click demands.'
  },
  {
    id: 'lp-2',
    title: 'Tactile Additions: Sums up to 10',
    subject: 'Numeracy',
    grade: 'Primary Grade 2',
    objective: 'Decompose single digitals and solve simple operations (e.g. 5 + 3 = 8) using physical visual counting counters and voice tallies.',
    standardProcedure: 'Write numeral formulas on the dry-erase board. Have the class count dry-erase dashes and write the final sums in their notebooks.',
    visualAccommodation: 'Color-code numbers (e.g., Red for active calculation, Blue for final sums) and provide 3D visual count blocks with crisp outlines.',
    auditoryAccommodation: 'Ensure children can hear each counted block spoken out loud automatically upon contact.',
    cognitiveAccommodation: 'Divide equations into small sensory groupings (e.g. circles of 2 and 3) instead of large single numbers.',
    physicalAccommodation: 'Integrate flat keyboard tapping blocks or full tablet touch buttons to accommodate children with physical motor fatigue.'
  }
];

export default function TeacherPortal({ config }: TeacherPortalProps) {
  const lang = config.lang ?? 'en';
  // Navigation tabs inside Teacher portal
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'courses' | 'planner' | 'caregivers'>('roster');
  
  // States info
  const [students, setStudents] = useState<StudentProfile[]>(initialStudents);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [plans, setPlans] = useState<LessonPlan[]>(samplePlans);

  // States for Search & Filters in methodology library
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Literacy' | 'Numeracy'>('All');
  const [accFilter, setAccFilter] = useState<'All' | 'Visual' | 'Auditory' | 'Cognitive' | 'Physical'>('All');

  // Derived state to filter lesson plans under Methodology Library
  const filteredPlans = plans.filter(plan => {
    if (subjectFilter !== 'All' && plan.subject !== subjectFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = plan.title.toLowerCase().includes(query);
      const matchObjective = plan.objective.toLowerCase().includes(query);
      const matchStandard = plan.standardProcedure.toLowerCase().includes(query);
      const matchVisual = plan.visualAccommodation.toLowerCase().includes(query);
      const matchAuditory = plan.auditoryAccommodation.toLowerCase().includes(query);
      const matchCognitive = plan.cognitiveAccommodation.toLowerCase().includes(query);
      const matchPhysical = plan.physicalAccommodation.toLowerCase().includes(query);

      if (
        !matchTitle && 
        !matchObjective && 
        !matchStandard && 
        !matchVisual && 
        !matchAuditory && 
        !matchCognitive && 
        !matchPhysical
      ) {
        return false;
      }
    }

    return true;
  });
  
  // Forms for adapting lessons
  const [customObjective, setCustomObjective] = useState('');
  const [customSubject, setCustomSubject] = useState<'Literacy' | 'Numeracy'>('Literacy');
  const [customTitle, setCustomTitle] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);

  // Caregiver messages state
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcements, setAnnouncements] = useState<string[]>([
    "Dear parents, we successfully set up the Lexend font sizing on Sophia's device. Her spelling resilience increased by 30% this week!",
    "Caregivers, for this weekend's tactile mathematics, try utilizing three physical cups and five dry beans to mimic our at-home additions activity."
  ]);

  // Handle adaptation generator
  const handleGenerateAdaptation = (e: FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customObjective) {
      alert('Please fill in a lesson title and objective!');
      return;
    }

    // Creative adaptation auto-generation logic
    const modelPlan: LessonPlan = {
      id: `lp-custom-${Date.now()}`,
      title: customTitle,
      subject: customSubject,
      grade: 'Primary School (Adapted Class)',
      objective: customObjective,
      standardProcedure: `Present the central concept of ${customTitle} to the classroom. Perform a short guided demonstration and ask students to perform task worksheets.`,
      visualAccommodation: `Provide large physical print options of all worksheets. Ensure high-contrast elements (Minimum 7:1 contrast ratio). Use the Lexend font profile dynamically.`,
      auditoryAccommodation: `Enable rich TTS system support on task blocks. Implement voice recorder options for assignments to minimize written-word anxiety.`,
      cognitiveAccommodation: `Chunk instructions into single simple step checklists. Supply tactile icons representing ${customTitle} (e.g. physical toys or shape visualizers). Eliminate unnecessary background graphics.`,
      physicalAccommodation: `Construct large, easy-to-click buttons on assistive tablets. Allow alternative keyboard arrows mappings instead of precise mouse drag-and-drop operations.`
    };

    setGeneratedPlan(modelPlan);
    setPlans([modelPlan, ...plans]);
    speakText(tts.planGenerated(lang, customTitle), config.ttsSpeed, false, lang);
  };

  // Completed module tick handler
  const toggleModuleCheck = (courseId: string, moduleIdx: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedModules = [...c.modules];
        updatedModules[moduleIdx] = {
          ...updatedModules[moduleIdx],
          completed: !updatedModules[moduleIdx].completed
        };
        // Check if all are completed
        const isAllComplete = updatedModules.every(mod => mod.completed);
        return {
          ...c,
          modules: updatedModules,
          completed: isAllComplete
        };
      }
      return c;
    }));
    speakText(tts.progressCounted(lang), config.ttsSpeed, false, lang);
  };

  const handleSendAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) return;
    setAnnouncements([announcementMsg, ...announcements]);
    setAnnouncementMsg('');
    speakText(tts.announcementSent(lang), config.ttsSpeed, false, lang);
  };

  // Styles utility
  const getContainerStyles = (themeMode?: 'green' | 'blue' | 'yellow' | 'coral') => {
    if (config.contrastMode === 'high-contrast-dark') return 'bg-black text-yellow-300 border-yellow-300 border-2';
    if (config.contrastMode === 'high-contrast-light') return 'bg-white text-black border-black border-4';
    if (config.contrastMode === 'soft-pastel') return 'bg-emerald-50/40 text-slate-800 border-emerald-100 border';
    
    if (themeMode === 'green') return 'bg-white text-[#2D3436] border-4 border-[#6BCB77] shadow-[8px_8px_0px_#6BCB77] rounded-[32px]';
    if (themeMode === 'blue') return 'bg-white text-[#2D3436] border-4 border-[#4A90E2] shadow-[8px_8px_0px_#4A90E2] rounded-[32px]';
    if (themeMode === 'yellow') return 'bg-white text-[#2D3436] border-4 border-[#FFD93D] shadow-[8px_8px_0px_#FFD93D] rounded-[32px]';
    if (themeMode === 'coral') return 'bg-white text-[#2D3436] border-4 border-[#FF6B6B] shadow-[8px_8px_0px_#FF6B6B] rounded-[32px]';
    return 'bg-white text-[#2D3436] border-4 border-[#2D3436] shadow-[8px_8px_0px_#2D3436] rounded-[32px]';
  };

  return (
    <div className="space-y-8" id="teacher-portal-root">
      {/* Portal Hero Banner */}
      <div className="p-6 rounded-[32px] bg-gradient-to-r from-[#6BCB77] to-[#4A90E2] text-white border-4 border-[#2D3436] shadow-[8px_8px_0px_#2D3436] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 bg-[#FFD93D] border-3 border-[#2D3436] text-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[3px_3px_0px_#2D3436]">👩‍🏫</div>
          <div>
            <h2 className="text-2xl font-black leading-none text-white">{t('teacher_portal', lang)}</h2>
            <p className="opacity-95 font-bold text-xs sm:text-sm mt-1.5">
              Empowering teachers to track inclusive milestones, study UDL methodology, and generate custom adapted content.
            </p>
          </div>
        </div>

        {/* Current statistics */}
        <div className="flex items-center gap-2 bg-[#FFD93D] text-[#2D3436] border-3 border-[#2D3436] px-5 py-2.5 rounded-2xl text-xs font-black shadow-[3px_3px_0px_#2D3436]">
          <TrendingUp size={15} className="stroke-[2.5px]" />
          <span>Active Inclusivity Rating: 94%</span>
        </div>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2" id="teacher-subtabs-nav">
        {[
          { id: 'roster',     label: `📊 ${t('tp_students', lang)}`,     desc: lang === 'sw' ? 'Fuatilia maendeleo' : 'Observe literacy/numeracy', theme: 'blue' },
          { id: 'courses',    label: `🎓 ${t('tp_courses', lang)}`,      desc: lang === 'sw' ? 'Jenga uwezo' : 'Build capacity', theme: 'green' },
          { id: 'planner',    label: `🛠️ ${t('tp_lesson_plans', lang)}`, desc: lang === 'sw' ? 'Tengeneza karatasi' : 'Generate worksheets', theme: 'coral' },
          { id: 'caregivers', label: `💬 ${t('tp_announcements', lang)}`, desc: lang === 'sw' ? 'Tuma vidokezo' : 'Send family tips', theme: 'yellow' }
        ].map((subTab) => {
          const isSelected = activeSubTab === subTab.id;
          return (
            <button
              id={`subtab-btn-${subTab.id}`}
              key={subTab.id}
              onClick={() => {
                setActiveSubTab(subTab.id as any);
                speakText(subTab.label, config.ttsSpeed, false, lang);
              }}
              className={`py-3 px-5 rounded-2xl font-black text-xs flex flex-col items-start border-2 border-[#2D3436] active:translate-y-[1px] cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-[#2D3436] text-white shadow-[2px_2px_0px_rgba(0,0,0,0.15)]' 
                  : 'bg-white text-[#2D3436] shadow-[2.5px_2.5px_0px_#2D3436] hover:translate-y-[-1px] hover:bg-[#FDFCF0]'
              }`}
            >
              <span>{subTab.label}</span>
              <span className={`text-[9px] font-bold block mt-0.5 ${isSelected ? 'text-[#6BCB77]' : 'text-slate-500'}`}>
                {subTab.desc}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* SUBTAB 1: ROSTER & DASHBOARD */}
        {activeSubTab === 'roster' && (
          <motion.div
            key="subtab-roster"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Overview Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: lang === 'sw' ? 'Orodha ya Darasa' : 'Primary Roster', val: '4 Learners', sub: lang === 'sw' ? 'Wasifu wa Msaada' : 'Assigned Assistive profiles', border: 'border-[#4A90E2]', shadow: 'shadow-[4px_4px_0px_#4A90E2]', icon: '👥' },
                { label: lang === 'sw' ? `Wastani wa ${t('tp_literacy',lang)}` : 'Avg Literacy Score', val: '69%', sub: lang === 'sw' ? 'Lengo: 75% mwisho wa muhula' : 'Target: 75% by term end', border: 'border-[#6BCB77]', shadow: 'shadow-[4px_4px_0px_#6BCB77]', icon: '📘' },
                { label: lang === 'sw' ? `Wastani wa ${t('tp_numeracy',lang)}` : 'Avg Numeracy Score', val: '74%', sub: lang === 'sw' ? 'Moduli za kujifunza kwa kugusa' : 'Tactile learning modules', border: 'border-[#FF6B6B]', shadow: 'shadow-[4px_4px_0px_#FF6B6B]', icon: '🧮' },
                { label: lang === 'sw' ? 'Marekebisho Yanayotumika' : 'Accommodations Active', val: '9 Filters', sub: lang === 'sw' ? 'Fonti na msomaji wa sauti' : 'Applying fonts, voice context', border: 'border-[#FFD93D]', shadow: 'shadow-[4px_4px_0px_#FFD93D]', icon: '⚙️' }
              ].map((m, i) => (
                <div key={i} className={`p-5 rounded-[24px] border-4 text-left bg-white text-[#2D3436] transition-all ${m.border} ${m.shadow}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] tracking-wider uppercase font-black text-slate-500">{m.label}</span>
                    <span className="text-sm">{m.icon}</span>
                  </div>
                  <div className="text-2xl font-black mt-1.5">{m.val}</div>
                  <span className="text-[10px] font-bold text-slate-600 mt-1 block leading-tight">{m.sub}</span>
                </div>
              ))}
            </div>

            {/* Visual D3 Progress Chart Section */}
            <EngagementChart />

            {/* In-depth Interactive Profile cards list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="teacher-student-roster-list">
              {students.map((student) => (
                <div 
                  key={student.id} 
                  className={`p-6 transition-all space-y-5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_#4A90E2] ${getContainerStyles('blue')}`}
                >
                  {/* Student Title and Condition info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-lg text-[#2D3436]">{student.name}</h4>
                      <p className="text-xs text-[#4A90E2] font-black mt-1">
                        🧬 {student.primaryNeed} • Age {student.age}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-[#2D3436] bg-[#E1F5FE] border-2 border-[#2D3436] px-2.5 py-1 rounded-lg">ID: {student.id}</span>
                  </div>

                  <hr className="border-t-2 border-slate-100" />

                  {/* Accessible Graphics (SVG Native Charts) */}
                  <div className="space-y-4">
                    <span className="text-[10px] tracking-wider font-black uppercase text-slate-500 block">Progress Visualizer</span>
                    
                    {/* Progress Bar 1: Literacy */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#2D3436] font-black flex items-center gap-1">📘 Literacy Skills</span>
                        <span className="text-[#4A90E2] font-black">{student.literacyProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-150 h-5 rounded-full border-2 border-[#2D3436] overflow-hidden flex">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${student.literacyProgress}%` }}
                          transition={{ duration: 1 }}
                          className="bg-[#4A90E2] h-full"
                        />
                      </div>
                    </div>

                    {/* Progress Bar 2: Numeracy */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#2D3436] font-black flex items-center gap-1">🧮 Numeracy Skills</span>
                        <span className="text-[#FF6B6B] font-black">{student.numeracyProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-150 h-5 rounded-full border-2 border-[#2D3436] overflow-hidden flex">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${student.numeracyProgress}%` }}
                          transition={{ duration: 1 }}
                          className="bg-[#FF6B6B] h-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Accommodations Active Tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-wider font-black uppercase text-slate-500 block">Active Device Toggles</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.accommodations.map((acc, index) => (
                        <span 
                          key={index} 
                          className="text-[10px] font-extrabold text-[#2D3436] bg-[#FDFCF0] border-2 border-[#2D3436] px-3 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_#2D3436]"
                        >
                          ✓ {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Live Activity Feed */}
                  <div className="p-4 bg-slate-55 rounded-2xl border-2 border-[#2D3436] flex items-start gap-2.5">
                    <span className="text-base">🕒</span>
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-500 block">Recent Milestone</span>
                      <span className="text-xs font-bold text-slate-700 leading-tight block mt-0.5">{student.recentActivity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: TRAINING & RESOURCES */}
        {activeSubTab === 'courses' && (
          <motion.div
            key="subtab-courses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#E1F5FE] border-4 border-[#2D3436] p-6 rounded-[24px] shadow-[4px_4px_0px_#2D3436] text-[#2D3436]">
              <h3 className="font-black text-lg text-[#2D3436] flex items-center gap-2">
                <GraduationCap className="text-[#4A90E2] stroke-[2.5px]" size={22} />
                Educator Capacity Building: Micro-Lessons
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
                Empower your skills to teach inclusively. Complete interactive micro-courses to understand research-backed tactics for early primary students with special needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left & Middle Column: Available courses */}
              <div className="lg:col-span-2 space-y-6">
                {courses.map((course) => {
                  const percentComplete = Math.round(
                    (course.modules.filter(m => m.completed).length / course.modules.length) * 100
                  );
                  const isCurActive = activeCourseId === course.id;

                  return (
                    <div 
                      key={course.id}
                      className={`p-6 transition-all ${
                        isCurActive ? getContainerStyles('green') : getContainerStyles()
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-slate-100">
                        <div>
                          <span className={`text-[10px] uppercase font-black px-3 py-1 border-2 border-[#2D3436] rounded-full shadow-[1.5px_1.5px_0px_#2D3436] ${
                            course.category === 'udl' ? 'bg-[#E1F5FE] text-[#1B4E8C]' :
                            course.category === 'literacy' ? 'bg-[#FFE5E5] text-[#FF6B6B]' : 'bg-[#FFF3CD] text-[#856404]'
                          }`}>
                            {course.category.toUpperCase()} • {course.difficulty}
                          </span>
                          <h4 className="font-black text-lg text-[#2D3436] mt-3.5 leading-snug">{course.title}</h4>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-black text-slate-55 block">Duration: {course.duration}</span>
                          <span className="text-sm font-black text-[#6BCB77] block mt-0.5">{percentComplete}% Done</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-600 py-4 leading-relaxed">{course.description}</p>

                      {/* Progress Bar indicator */}
                      <div className="w-full bg-slate-150 h-4 border-2 border-[#2D3436] rounded-full overflow-hidden mb-5 flex">
                        <div className="bg-[#6BCB77] h-full" style={{ width: `${percentComplete}%` }} />
                      </div>

                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setActiveCourseId(isCurActive ? null : course.id);
                            speakText(course.title, config.ttsSpeed, false, lang);
                          }}
                          className="py-2.5 px-4 bg-[#2D3436] text-white hover:bg-slate-800 text-xs font-black rounded-xl border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-[1px] active:shadow-[1px_1px_0px_#2D3436] cursor-pointer transition-all"
                        >
                          {isCurActive ? (lang === 'sw' ? 'Funga Moduli' : 'Collapse Modules') : t('tp_view_modules', lang)}
                        </button>
                        {course.completed && (
                          <span className="text-xs font-black text-[#2D3436] bg-[#FFD93D] border-2 border-[#2D3436] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#2D3436]">
                            ★ Completed Stamp Earned
                          </span>
                        )}
                      </div>

                      {/* Course Modules drawer */}
                      {isCurActive && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-6 border-t-2 border-slate-200 space-y-4"
                        >
                          <span className="text-[10px] tracking-wider font-black text-slate-500 uppercase block">Interactive Step Checklist:</span>
                          {course.modules.map((mod, index) => (
                            <div 
                              key={index} 
                              className={`p-4 rounded-2xl border-2 border-[#2D3436] flex items-start gap-3.5 transition-all shadow-[2px_2px_0px_#2D3436] ${
                                mod.completed ? 'bg-[#EBFDF0]' : 'bg-[#FDFCF0]'
                              }`}
                            >
                              <input 
                                type="checkbox"
                                checked={mod.completed}
                                onChange={() => toggleModuleCheck(course.id, index)}
                                className="w-5 h-5 rounded-md mt-0.5 border-2 border-[#2D3436] focus:ring-0 checked:bg-[#6BCB77] accent-[#6BCB77] cursor-pointer"
                                id={`chk-course-${course.id}-${index}`}
                              />
                              <div>
                                <h5 className="font-extrabold text-xs text-[#2D3436]">{index + 1}. {mod.title}</h5>
                                <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">{mod.content}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Capacity Status badging */}
              <div className="space-y-6">
                <div className="p-6 rounded-[24px] bg-[#2D3436] text-white space-y-5 text-left shadow-[6px_6px_0px_#2D3436] border-4 border-[#2D3436]">
                  <h4 className="font-black text-sm tracking-wide text-[#FFD93D] flex items-center gap-1.5 uppercase">
                    <Award size={18} className="stroke-[2.5px]" /> My Certifications
                  </h4>
                  <p className="text-xs font-semibold text-slate-350 leading-relaxed">
                    Earn professional inclusion stamps to share with your primary school inspection board.
                  </p>

                  <div className="space-y-3.5">
                    <div className="p-4 bg-white/5 rounded-xl border-2 border-slate-700 flex items-center gap-3">
                      <div className="text-2xl">🛡️</div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider block text-slate-400 uppercase">Universal UDL Specialist</span>
                        <span className="text-xs font-bold text-slate-200">Earned in Jan 2026</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl border-2 border-slate-700 flex items-center gap-3 opacity-60">
                      <div className="text-2xl">📙</div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider block text-slate-400 uppercase">Literacy Accommodation Seal</span>
                        <span className="text-xs font-bold text-slate-300">1 module remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Downloads */}
                <div className="p-6 rounded-[24px] bg-white border-4 border-[#2D3436] shadow-[6px_6px_0px_#2D3436] text-[#2D3436] space-y-5 text-left">
                  <h4 className="font-black text-sm text-[#2D3436] flex items-center gap-1.5 uppercase">
                    <BookMarked size={18} className="text-slate-600 stroke-[2.5px]" /> Print Guides
                  </h4>
                  <ul className="text-xs space-y-3 font-semibold">
                    {[
                      { t: "Visual aids printable card sheet", s: "2.4 MB • PDF" },
                      { t: "Dyscalculia physical play math rules", s: "1.1 MB • DOCX" },
                      { t: "Parent weekly milestone questionnaire", s: "850 KB • PDF" }
                    ].map((idx, i) => (
                      <li key={i} className="p-3 border-2 border-[#2D3436] hover:bg-[#FDFCF0] rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#2D3436]">
                        <div>
                          <span className="block text-slate-800 font-bold">{idx.t}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{idx.s}</span>
                        </div>
                        <Download size={15} className="text-[#6BCB77] stroke-[3px]" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: LESSON PLANNER & ADAPTOR */}
        {activeSubTab === 'planner' && (
          <motion.div
            key="subtab-planner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Split layout: Custom adapting tool & Sample Plans selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form to adapt custom lesson */}
              <div className="lg:col-span-5 p-6 rounded-[24px] bg-white border-4 border-[#2D3436] shadow-[6px_6px_0px_#2D3436] text-[#2D3436] space-y-5">
                <div className="border-b-2 border-slate-100 pb-3">
                  <h4 className="font-black text-sm text-[#2D3436] uppercase tracking-wide flex items-center gap-1.5">
                    <Sliders size={18} className="text-[#4A90E2] stroke-[2.5px]" /> Lesson Adaptation Engine
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1 leading-normal">
                    Input standard curriculum criteria to instantly generate a comprehensive accessibility profile.
                  </p>
                </div>

                <form onSubmit={handleGenerateAdaptation} className="space-y-4" id="frm-lesson-adaptor">
                  <div>
                    <label className="text-xs font-extrabold text-slate-600 block mb-1.5">Subject Matter</label>
                    <select
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value as any)}
                      className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                    >
                      <option value="Literacy">📘 {t('tp_literacy', lang)} & {lang === 'sw' ? 'Tahajia' : 'Spelling'}</option>
                      <option value="Numeracy">🧮 {t('tp_numeracy', lang)} & {lang === 'sw' ? 'Kuhesabu' : 'Counting'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2D3436] block mb-1.5">Lesson Topic / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Rhyming Words with -AT"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#2D3436] block mb-1.5">Target Core Objective</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Students must identify words ending with -AT like BAT, RAT and match them with simple graphics."
                      value={customObjective}
                      onChange={(e) => setCustomObjective(e.target.value)}
                      className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#6BCB77] hover:bg-[#5bbf67] text-white rounded-xl font-black text-xs cursor-pointer hover:translate-y-[-1px] transition-all border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-[1px] auto-cols-max flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={15} className="stroke-[2.5px]" />
                    <span>{t('tp_generate_plan', lang)}</span>
                  </button>
                </form>
              </div>

              {/* View/Print adapted plans database */}
              <div className="lg:col-span-7 space-y-6">
                {/* Search & Filter methodology panel */}
                <div className="p-5 bg-[#FDFCF0] border-4 border-[#2D3436] rounded-[24px] shadow-[4px_4px_0px_#2D3436] text-[#2D3436] space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b-2 border-slate-150 pb-2">
                    <Filter className="text-[#4A90E2] stroke-[2.5px]" size={16} />
                    <span className="font-black text-xs uppercase tracking-wider">Search & Filter Methodology Library</span>
                  </div>

                  {/* Text keyword search */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 stroke-[2.5px]" size={16} />
                    <input
                      type="text"
                      placeholder={lang === 'sw' ? 'Tafuta masharti, mada, malengo au marekebisho...' : 'Search key terms, topics, standard objectives or accommodations...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white text-[#2D3436] border-2 border-[#2D3436] py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subject filter tabs */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-500 block">Classroom Curriculum Type:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(['All', 'Literacy', 'Numeracy'] as const).map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setSubjectFilter(sub);
                              speakText(sub, config.ttsSpeed, false, lang);
                            }}
                            className={`px-3 py-1.5 font-black text-[11px] border-2 border-[#2D3436] rounded-xl cursor-pointer shadow-[1.5px_1.5px_0px_#2D3436] transition-all active:translate-y-[1.5px] ${
                              subjectFilter === sub
                                ? 'bg-[#2D3436] text-white shadow-none'
                                : 'bg-white text-[#2D3436] hover:bg-slate-50'
                            }`}
                          >
                            {sub === 'All' ? `🌈 ${t('tp_all', lang)}` : sub === 'Literacy' ? `📘 ${t('tp_literacy', lang)}` : `🧮 ${t('tp_numeracy', lang)}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation filters */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-500 block">Active Accommodation Focus:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(['All', 'Visual', 'Auditory', 'Cognitive', 'Physical'] as const).map((acc) => (
                          <button
                            key={acc}
                            type="button"
                            onClick={() => {
                              setAccFilter(acc);
                              speakText(acc, config.ttsSpeed, false, lang);
                            }}
                            className={`px-2.5 py-1.5 font-black text-[10px] border-2 border-[#2D3436] rounded-xl cursor-pointer shadow-[1.5px_1.5px_0px_#2D3436] transition-all active:translate-y-[1.5px] ${
                              accFilter === acc
                                ? 'bg-[#FFD93D] text-[#2D3436] shadow-none border-[#2D3436]'
                                : 'bg-white text-[#2D3436] hover:bg-slate-50'
                            }`}
                          >
                            {acc === 'All' ? '⚙️ All' : acc === 'Visual' ? '👁️ Visual' : acc === 'Auditory' ? '🔊 Auditory' : acc === 'Cognitive' ? '🧠 Cognitive' : '🦾 Motor'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Methodology Results ({filteredPlans.length})</span>
                  <span className="text-xs font-black text-[#4A90E2] bg-[#E1F5FE] border-2 border-[#4A90E2] px-3 py-1 rounded-lg">Showing {filteredPlans.length} plans</span>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1" id="adapted-plans-list">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => (
                      <div key={plan.id} className="p-6 border-4 border-[#2D3436] rounded-[24px] bg-white space-y-5 shadow-[4px_4px_0px_#2D3436] text-left">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`text-[10px] font-black px-3 py-1 border-2 border-[#2D3436] rounded-full uppercase ${
                              plan.subject === 'Literacy' ? 'bg-[#E1F5FE] text-[#1B4E8C]' : 'bg-[#FFE5E5] text-[#FF6B6B]'
                            }`}>
                              {plan.subject} • {plan.grade}
                            </span>
                            <h4 className="font-extrabold text-base text-[#2D3436] mt-3">{plan.title}</h4>
                          </div>
                          <button 
                            onClick={() => {
                              speakText(plan.objective, config.ttsSpeed, false, lang);
                            }}
                            className="p-2 border-2 border-[#2D3436] bg-[#FDFCF0] hover:bg-slate-50 hover:text-indigo-600 rounded-xl text-slate-600 cursor-pointer transition-all shadow-[1.5px_1.5px_0px_#2D3436]"
                            title="Vocalize core objectives"
                          >
                            <BookOpen size={16} />
                          </button>
                        </div>

                        <div className="text-xs space-y-2">
                          <p className="text-slate-700 leading-relaxed"><strong className="text-[#2D3436] font-black">Objective:</strong> {plan.objective}</p>
                          <p className="text-slate-600 leading-relaxed"><strong className="text-[#2D3436] font-black">Classroom Instructions:</strong> {plan.standardProcedure}</p>
                        </div>

                        {/* Accommodations Grid Matrix with visual focus overlays based on active need filters */}
                        <div className="p-4 bg-[#FDFCF0] rounded-2xl border-2 border-[#2D3436] shadow-[2.5px_2.5px_0px_#2D3436] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                          <div className={`p-2.5 rounded-xl transition-all ${
                            accFilter === 'Visual' 
                              ? 'bg-[#E1F5FE] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] scale-[1.02]' 
                              : 'border-2 border-transparent'
                          }`}>
                            <span className="font-black text-[#4A90E2] uppercase text-[9px] tracking-wide block">👁️ Visual Adaptations</span>
                            <p className="text-slate-600 leading-normal font-semibold mt-1">{plan.visualAccommodation}</p>
                          </div>

                          <div className={`p-2.5 rounded-xl transition-all ${
                            accFilter === 'Auditory' 
                              ? 'bg-[#FFF9DB] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] scale-[1.02]' 
                              : 'border-2 border-transparent'
                          }`}>
                            <span className="font-black text-[#FFBB00] uppercase text-[9px] tracking-wide block">🔊 Auditory Adaptations</span>
                            <p className="text-slate-600 leading-normal font-semibold mt-1">{plan.auditoryAccommodation}</p>
                          </div>

                          <div className={`p-2.5 rounded-xl transition-all ${
                            accFilter === 'Cognitive' 
                              ? 'bg-[#F3E5F5] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] scale-[1.02]' 
                              : 'border-2 border-transparent'
                          }`}>
                            <span className="font-black text-[#8E44AD] uppercase text-[9px] tracking-wide block">🧠 Cognitive Adaptations</span>
                            <p className="text-slate-600 leading-normal font-semibold mt-1">{plan.cognitiveAccommodation}</p>
                          </div>

                          <div className={`p-2.5 rounded-xl transition-all ${
                            accFilter === 'Physical' 
                              ? 'bg-[#FFE5E5] border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] scale-[1.02]' 
                              : 'border-2 border-transparent'
                          }`}>
                            <span className="font-black text-[#FF6B6B] uppercase text-[9px] tracking-wide block">🦾 Physical Adaptations</span>
                            <p className="text-slate-600 leading-normal font-semibold mt-1">{plan.physicalAccommodation}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 border-4 border-dashed border-[#2D3436]/40 bg-slate-50 text-[#2D3436] rounded-[24px] text-center space-y-3">
                      <span className="text-3xl">🧩</span>
                      <h5 className="font-black text-sm">No Matching Lesson Plans Found</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        We couldn't locate designs matching your spelling or term. Refine your query or check filters!
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* SUBTAB 4: CAREGIVER LINK */}
        {activeSubTab === 'caregivers' && (
          <motion.div
            key="subtab-caregivers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Post new parent announcements */}
              <div className="lg:col-span-6 p-6 rounded-[24px] bg-white border-4 border-[#2D3436] shadow-[6px_6px_0px_#2D3436] text-[#2D3436] space-y-5">
                <div className="border-b-2 border-slate-100 pb-3">
                  <h4 className="font-black text-[#2D3436] flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#6BCB77] stroke-[2.5px]" />
                    {lang === 'sw' ? 'Tuma Matangazo kwa Familia' : 'Dispatch Classroom Bulletins to Families'}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-1">
                    Build parent/caregiver confidence by sending tips, progress indicators, or home activity checklists directly.
                  </p>
                </div>

                <form onSubmit={handleSendAnnouncement} className="space-y-4" id="frm-announcement">
                  <textarea
                    rows={4}
                    value={announcementMsg}
                    onChange={(e) => setAnnouncementMsg(e.target.value)}
                    placeholder="e.g. Parents, for Maya's sensory balance this week, try counting 4 red spoons during breakfast..."
                    className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-[#6BCB77] hover:bg-[#5bbf67] text-white rounded-xl text-xs font-black cursor-pointer hover:translate-y-[-1px] transition-all border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-[1px] flex items-center gap-1.5"
                  >
                    <span>{t('tp_send', lang)}</span>
                    <Send size={12} className="stroke-[2.5px]" />
                  </button>
                </form>
              </div>

              {/* Right Column: Active stream feed */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">{lang === 'sw' ? 'Mtiririko wa Mawasiliano na Familia' : 'Family Communication Feed'}</span>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1" id="announcements-feed">
                  {announcements.map((bullet, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border-4 border-[#2D3436] bg-white text-[#2D3436] shadow-[3px_3px_0px_#2D3436] space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black">
                        <span className="text-[#4A90E2] bg-[#E1F5FE] border-2 border-[#4A90E2] px-3 py-1 rounded-full uppercase">✓ SENT TO ALL CAREGIVERS</span>
                        <span className="text-slate-500">Just now</span>
                      </div>
                      <p className="text-xs text-slate-705 leading-relaxed font-bold">"{bullet}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
