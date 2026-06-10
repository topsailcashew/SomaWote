/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  BookOpen, 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  Calendar, 
  CheckCircle, 
  Compass, 
  Users, 
  Send, 
  Award,
  ChevronRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { AtHomeActivity, ForumPost, AccessibilityConfig } from '../../types';
import { speakText } from '../../modules/voice/tts';
import { t, tts } from '../../lib/i18n';

interface CaregiverPortalProps {
  config: AccessibilityConfig;
}

// At-Home Literacy & Numeracy Activities
const atHomeActivities: AtHomeActivity[] = [
  {
    id: 'aha-1',
    title: '🥄 Kitchen Counting Sort',
    subject: 'Numeracy',
    description: 'A mathematical sensory game using standard kitchen spoons and small plastic cups. Teaches simple numeric quantities and groups.',
    materialsNeeded: ['3 plastic cups', '10 plastic or metal spoons', 'Large tray'],
    steps: [
      'Sit facing your child at a comfortable height.',
      'Write the numbers 1, 2, and 3 clearly on the cups (or draw corresponding lines/dots).',
      'Explain: "We are organizing our spoons! Can we put 1 spoon in Cup 1?"',
      'Help your child grab and drop spoons, counting "One," "Two," "Three" aloud as they touch the cups.'
    ],
    cognitiveAdaptation: 'If writing numbers is abstract, draw direct colorful dots on the cups instead, or tape physical stickers so they count by touch.',
    physicalAdaptation: 'Use heavy visual contrasting bowls if the child has motor coordination limitations, making it simpler to drop spoons inside without tipping over.'
  },
  {
    id: 'aha-2',
    title: '🔍 Storybook Sight Search',
    subject: 'Literacy',
    description: 'Turn your evening storybook reading into an active spelling adventure! Find short words and celebrate with happy sounds.',
    materialsNeeded: ['Any colorful children storybook', 'Sticky notes or paper scraps'],
    steps: [
      'Pick a book page with large letters.',
      'Write the word "CAT" or "SUN" on a sticky note as a reference.',
      'Ask your child: "Look! Can we find these same letters on this book page?"',
      'Point to letters together, pronouncing their phonetic sounds ("S says sss...").'
    ],
    cognitiveAdaptation: 'Limit search to the starting initials of words if full spelling feels fatiguing. Focus purely on matching "S" for Sun.',
    physicalAdaptation: 'Let the child point with their whole fist, tap with a stick, or simply nod when you point to correct letters.'
  },
  {
    id: 'aha-3',
    title: '🌿 Sensory Letter Shaping',
    subject: 'Literacy',
    description: 'Use sensory elements from the yard to draw letter shapes, stimulating motor pathways and letter recognition.',
    materialsNeeded: ['Dry twigs or leaves', 'Sand tray or flour on a flat baking plate'],
    steps: [
      'Trace the letter "A" or "C" in the sand tray using your finger.',
      'Guide your child to trace their finger over your line, feeling the texture.',
      'Arrange dry twigs to form the letter shape together.'
    ],
    cognitiveAdaptation: 'Have simple shapes ready printed next to the tray to act as a 1-to-1 blueprint guide.',
    physicalAdaptation: 'If fine finger tracing is tough, use a thick sponge or wooden block to drag through the flour together.'
  }
];

// Caregiver Support Forum Topics
const initialPosts: ForumPost[] = [
  {
    id: 'p-strategies-1',
    author: 'Marcus Aurelius Sr.',
    role: 'Caregiver',
    title: 'Visual transition checklist boards to prevent cognitive overlap',
    content: 'We made a custom card routine with drawings of "Spoons (Breakfast)" -> "Backpack (School time)" -> "Book (Word Quest)". Having our 6-year-old physically slide a wooden paper clip on the cards completely reduced transition tantrums! Highly recommended for neurodivergent kids to ease schedule handoffs.',
    category: 'strategies',
    likes: 15,
    commentsCount: 3,
    createdAt: '8 hours ago',
    comments: [
      { id: 'cs-1', author: 'Liam Chen Sr.', role: 'Caregiver', content: 'We built a tactile slider for this and it worked beautifully. It turns scheduling into a small puzzle game!', createdAt: '6 hours ago' },
      { id: 'cs-2', author: 'Sarah Jenkins', role: 'Specialist', content: 'Physical check-offs fulfill the child\'s sense of urgency and closure. Brilliant tactical execution, Marcus!', createdAt: '3 hours ago' }
    ]
  },
  {
    id: 'p-strategies-2',
    author: 'Clara Mercer',
    role: 'Caregiver',
    title: 'The "Cozy Calming Box" sensory decompression station',
    content: 'Whenever my autistic daughter receives sensory overload during reading homework, we take a 5-minute pause in our Decompression Corner. It holds a weighted plushie, noise-reducing earmuffs, and a liquid motion timer. She returns back to Word Quest with restored cognitive confidence.',
    category: 'strategies',
    likes: 22,
    commentsCount: 1,
    createdAt: '1 day ago',
    comments: [
      { id: 'cs-3', author: 'Markus Vance', role: 'Teacher', content: 'Yes! Implementing structured sensory breaks is a cornerstone of inclusive classroom design. Thank you for sharing this parental homework strategy.', createdAt: '18 hours ago' }
    ]
  },
  {
    id: 'p-1',
    author: 'Elena Rostova',
    role: 'Caregiver',
    title: 'Handling math anxiety during early primary additions',
    content: 'My child easily becomes frustrated with written addition symbols (plus, equals). We started replacing written math characters with interactive colored plastic cups, and the visual/physical feedback completely lowered his anxiety! Highly recommend trying "Tactile Counters" before written quizzes.',
    category: 'cognitive',
    likes: 11,
    commentsCount: 2,
    createdAt: '2 days ago',
    comments: [
      { id: 'c1-1', author: 'Markus Vance', role: 'Teacher', content: 'Yes! We see this in the classroom too. Grounding equations with visual apples or sensory circles keeps math concrete. Awesome job Elena!', createdAt: '2 days ago' },
      { id: 'c1-2', author: 'Clara Jenkins', role: 'Specialist', content: 'Fabulous sensory support. Abstract symbols are often cognitive blocks for Down Syndrome and ADHD learners.', createdAt: '1 day ago' }
    ]
  },
  {
    id: 'p-2',
    author: 'Nadia Thorne',
    role: 'Specialist',
    title: 'Tips for using Dyslexia-friendly spacing at home',
    content: 'Always prefer using generous negative space between lines on home tablets. Standard browser configurations let you adjust margins up to 200%. Let the child read using a straight yellow paper ruler below lines to avoid fatigue!',
    category: 'speech',
    likes: 12,
    commentsCount: 1,
    createdAt: '3 days ago',
    comments: [
      { id: 'c2-1', author: 'Liam Chen Sr.', role: 'Caregiver', content: 'Our daughter loved the yellow reading guide line on the tablet! It keeps her eyes from jumping around.', createdAt: '2 days ago' }
    ]
  }
];

export default function CaregiverPortal({ config }: CaregiverPortalProps) {
  const lang = config.lang ?? 'en';
  const [activeSubTab, setActiveSubTab] = useState<'progress' | 'activities' | 'network'>('progress');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(initialPosts);
  
  // Custom interactive comment form states
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  // State to support adding a custom forum thread
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'speech' | 'sensory' | 'motor' | 'cognitive' | 'general' | 'strategies'>('general');
  const [showAddPost, setShowAddPost] = useState(false);

  // States for Forum Search & Filters for Parenting Strategies
  const [searchQueryForum, setSearchQueryForum] = useState('');
  const [categoryFilterForum, setCategoryFilterForum] = useState<'All' | 'speech' | 'sensory' | 'motor' | 'cognitive' | 'general' | 'strategies'>('All');

  // Milestone checklists
  const [schoolMilestones] = useState([
    { title: 'Tapped and counted 5 apples in Numeracy Playground', done: true, points: 'Week 2 Core Math' },
    { title: 'Spelled CAT independently without spelling clues', done: true, points: 'Spelling module 1' },
    { title: 'Completed course: "Intro to Sight Words" with school teacher', done: false, points: 'Literacy pathway' },
    { title: 'Maintained 10-minutes high-focus reading guide session', done: true, points: 'A11y alignment' }
  ]);

  const handleLikePost = (postId: string) => {
    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) {
        speakText(tts.likedPost(lang), config.ttsSpeed, false, lang);
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleAddComment = (e: FormEvent, postId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const customComment = {
          id: `comment-${Date.now()}`,
          author: 'Me (Caregiver)',
          role: 'Caregiver' as const,
          content: newCommentText,
          createdAt: 'Just now'
        };
        speakText(tts.commentPosted(lang), config.ttsSpeed, false, lang);
        return {
          ...p,
          comments: [...p.comments, customComment],
          commentsCount: p.commentsCount + 1
        };
      }
      return p;
    }));
    
    setNewCommentText('');
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const addedPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: 'Me (Caregiver)',
      role: 'Caregiver',
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      likes: 0,
      commentsCount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setForumPosts([addedPost, ...forumPosts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowAddPost(false);
    speakText(tts.questionPublished(lang), config.ttsSpeed, false, lang);
  };

  const getContainerStyles = (color: 'blue' | 'coral' | 'green' | 'yellow' | 'slate' = 'slate') => {
    // Accessibility theme mappings
    if (config.contrastMode === 'high-contrast-dark') {
      return 'bg-black text-yellow-300 border-4 border-yellow-300';
    }
    if (config.contrastMode === 'high-contrast-light') {
      return 'bg-white text-black border-4 border-black';
    }
    if (config.contrastMode === 'soft-pastel') {
      const pastelBg = 
        color === 'blue' ? 'bg-[#E1F5FE]/60' :
        color === 'coral' ? 'bg-[#FFE5E5]/60' :
        color === 'green' ? 'bg-[#EBFDF0]/60' :
        color === 'yellow' ? 'bg-[#FFF9DB]/60' : 'bg-slate-50/40';
      return `${pastelBg} text-slate-800 border-2 border-slate-300`;
    }
    
    // Vibrant Palette Theme standard mapping
    const vibrantBg = 
      color === 'blue' ? 'bg-[#E1F5FE]' :
      color === 'coral' ? 'bg-[#FFE5E5]' :
      color === 'green' ? 'bg-[#EBFDF0]' :
      color === 'yellow' ? 'bg-[#FFF9DB]' : 'bg-white';
    return `${vibrantBg} text-[#2D3436] border-4 border-[#2D3436] shadow-[4px_4px_0px_#2D3436] rounded-[24px]`;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="caregiver-portal-root">
      
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-[24px] bg-[#FFE5E5] border-4 border-[#2D3436] text-[#2D3436] shadow-[6px_6px_0px_#2D3436] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FF6B6B] border-2 border-[#2D3436] rounded-2xl text-4xl shadow-[2.5px_2.5px_0px_#2D3436]">❤️</div>
          <div>
            <h2 className="text-2xl font-black leading-tight">{t('caregiver_portal', lang)}</h2>
            <p className="font-semibold text-xs sm:text-sm text-slate-700">
              Connecting primary classroom milestones with sensory at-home practices, and fostering parent emotional resilience.
            </p>
          </div>
        </div>

        <div className="bg-[#FFF9DB] text-[#2D3436] border-2 border-[#2D3436] px-4 py-2 rounded-xl text-xs font-black shadow-[1.5px_1.5px_0px_#2D3436] flex items-center gap-2">
          <Calendar size={15} />
          <span>Next Week: Guided Phonovisual Activities</span>
        </div>
      </div>

      {/* Internal Menu Toggles */}
      <div className="flex flex-wrap border-b-4 border-[#2D3436] gap-2" id="caregiver-subtabs-nav">
        {[
          { id: 'progress',   label: `🏡 ${t('cp_milestones', lang)}`,  desc: lang === 'sw' ? 'Uratibu wa mtaala' : 'Syllabus alignment' },
          { id: 'activities', label: `🪁 ${t('cp_activities', lang)}`,  desc: lang === 'sw' ? 'Miongozo ya hisi' : 'Tactile guides' },
          { id: 'network',    label: `🤝 ${t('cp_forum', lang)}`,       desc: lang === 'sw' ? 'Mikakati ya wazazi' : 'Parent strategies' }
        ].map((sub) => {
          const isSelected = activeSubTab === sub.id;
          return (
            <button
              id={`caregiver-subtab-btn-${sub.id}`}
              key={sub.id}
              onClick={() => {
                setActiveSubTab(sub.id as any);
                speakText(`${sub.label}`, config.ttsSpeed, false, lang);
              }}
              className={`py-3 px-5 text-xs font-black rounded-t-[18px] transition-all cursor-pointer flex flex-col items-start border-t-4 border-x-4 border-[#2D3436] relative translation-all -mb-1 ${
                isSelected 
                  ? 'bg-[#FFD93D] text-[#2D3436] z-10 translate-y-0 shadow-[0px_4px_0px_#FFD93D]' 
                  : 'bg-white text-slate-600 hover:bg-[#FDFCF0] hover:text-[#2D3436]'
              }`}
            >
              <span>{sub.label}</span>
              <span className={`text-[9px] font-extrabold opacity-75 hidden sm:block ${isSelected ? 'text-[#1B4E8C]' : 'text-slate-400'}`}>
                {sub.desc}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* SUBTAB 1: PROGRESS TRACKER */}
        {activeSubTab === 'progress' && (
          <motion.div
            key="subtab-progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Hand: Simplified school achievements checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 bg-[#FFE5E5] border-4 border-[#2D3436] rounded-[24px] shadow-[4px_4px_0px_#2D3436] text-[#2D3436]">
                <h4 className="font-black text-sm text-[#2D3436] flex items-center gap-2 uppercase tracking-wide">
                  <Award size={18} className="text-[#FF6B6B] stroke-[2.5px]" /> Aligned School Achievements This Week
                </h4>
                <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
                  These represent your child's weekly inclusive lesson milestones recorded by the primary educator. Review tips to practice.
                </p>
              </div>

              <div className="space-y-4" id="caregiver-milestones-list">
                {schoolMilestones.map((ms, i) => (
                  <div 
                    key={i} 
                    className="p-5 rounded-2xl border-4 border-[#2D3436] bg-white text-[#2D3436] flex items-start gap-4 shadow-[3px_3px_0px_#2D3436] hover:translate-y-[-1px] transition-all"
                  >
                    <div className="mt-0.5">
                      {ms.done ? (
                        <span className="w-6 h-6 bg-[#EBFDF0] text-[#1B8C3E] border-2 border-[#2D3436] rounded-full flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#2D3436]">✓</span>
                      ) : (
                        <span className="w-6 h-6 bg-[#FFF9DB] text-[#856404] border-2 border-[#2D3436] rounded-full flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#2D3436] font-mono">⋯</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] bg-[#E1F5FE] border-2 border-[#2D3436] px-2.5 py-0.5 rounded-lg font-black text-[#1B4E8C] shadow-[1px_1px_0px_#2D3436]">{ms.points}</span>
                      <h5 className="font-black text-xs text-[#2D3436] mt-2.5 leading-snug">{ms.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Hand: Family Emotional Guidance Support block */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-[#2D3436] text-white rounded-[24px] space-y-5 shadow-[6px_6px_0px_#2D3436] border-4 border-[#2D3436] text-left">
                <h4 className="font-black text-xs uppercase tracking-widest text-[#FF6B6B] flex items-center gap-1.5 bg-white/5 p-2 rounded-lg border border-white/10">
                  <Heart size={14} className="fill-[#FF6B6B] text-[#FF6B6B]" /> At-Home Family Resilience
                </h4>
                <p className="text-xs font-semibold text-slate-350 leading-relaxed">
                  Supporting a student with developmental or cognitive learning differences requires deep heart and immense patience.
                </p>

                <hr className="border-slate-700" />

                <div className="space-y-4 text-xs font-medium">
                  <div className="flex items-start gap-3">
                    <span className="text-xl leading-none">🌸</span>
                    <p className="text-slate-200 leading-normal">
                      <strong className="text-white block font-bold mb-0.5">Take Sensory Breaks & Rest:</strong> Five minutes of sitting visual quiet with warm teas reduces both parent and child sensory fatigue.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl leading-none">🌟</span>
                    <p className="text-slate-200 leading-normal">
                      <strong className="text-white block font-bold mb-0.5">Celebrate the Process, Not Scores:</strong> Praising spelling efforts ("I love how you tried letter C in cat!") is far healthier than targeting strict accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* SUBTAB 2: SENSORY ACTIVITY PLAYBOOK */}
        {activeSubTab === 'activities' && (
          <motion.div
            key="subtab-activities"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#FFF9DB] border-4 border-[#2D3436] p-6 rounded-[24px] shadow-[4px_4px_0px_#2D3436] text-[#2D3436]">
              <h4 className="font-black text-sm text-[#2D3436] flex items-center gap-2 uppercase tracking-wide">
                <Compass className="text-[#FF6B6B] stroke-[2.5px]" size={20} />
                At-Home Tactile Activities Sandbox
              </h4>
              <p className="text-xs font-semibold text-slate-650 mt-2 leading-relaxed">
                Transform standard laundry sorting or bedtime stories into rich, UDL-compliant learning events. Click an instruction block to vocalize steps!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="caregiver-activities-grid">
              {atHomeActivities.map((act) => (
                <div 
                  key={act.id} 
                  className={`p-6 hover:translate-y-[-2px] transition-all flex flex-col justify-between ${getContainerStyles(act.subject === 'Literacy' ? 'blue' : 'coral')}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-[#2D3436]/10">
                      <span className={`text-[10px] uppercase font-black px-3 py-1 border-2 border-[#2D3436] rounded-full shadow-[1.5px_1.5px_0px_#2D3436] ${
                        act.subject === 'Literacy' ? 'bg-[#E1F5FE] text-[#1B4E8C]' : 'bg-[#FFE5E5] text-[#FF6B6B]'
                      }`}>
                        {act.subject}
                      </span>
                      <button 
                        onClick={() => speakText(`${act.title}. ${act.description}`, config.ttsSpeed, false, lang)}
                        className="p-1.5 border-2 border-[#2D3436] bg-[#FDFCF0] hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer transition-all shadow-[1.5px_1.5px_0px_#2D3436]"
                      >
                        <BookOpen size={14} />
                      </button>
                    </div>

                    <h4 className="font-black text-base text-[#2D3436] leading-snug">{act.title}</h4>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">{act.description}</p>

                    <hr className="border-slate-150" />

                    {/* Hand Materials */}
                    <div>
                      <span className="text-[10px] tracking-wider font-extrabold uppercase text-slate-500 block mb-2">Supplies Needed:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {act.materialsNeeded.map((mat, i) => (
                          <span key={i} className="text-[10px] font-bold bg-[#FDFCF0] border-2 border-[#2D3436] px-2.5 py-1 rounded-lg text-slate-700 shadow-[1px_1px_0px_#2D3436]">
                            • {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Adaptive guidelines */}
                    <div className="space-y-3 pt-2 text-[11px] leading-relaxed">
                      <div className="p-3 bg-[#E1F5FE]/50 rounded-xl border-2 border-[#2D3436] text-[#2D3436] shadow-[1.5px_1.5px_0px_#2D3436]">
                        <strong className="text-[#1B4E8C] font-black uppercase text-[9px] tracking-wide block mb-1">🧠 Cognitive Adaptability</strong>
                        <p className="text-slate-650 font-bold">{act.cognitiveAdaptation}</p>
                      </div>

                      <div className="p-3 bg-[#FFE5E5]/50 rounded-xl border-2 border-[#2D3436] text-[#2D3436] shadow-[1.5px_1.5px_0px_#2D3436]">
                        <strong className="text-[#FF6B6B] font-black uppercase text-[9px] tracking-wide block mb-1">🦾 Physical Adaptability</strong>
                        <p className="text-slate-650 font-bold">{act.physicalAdaptation}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      speakText(`${act.steps[0]}. ${act.steps[1]}`, config.ttsSpeed, true, lang);
                    }}
                    className="w-full mt-5 py-3 bg-[#2D3436] hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-[1px] transition-all"
                  >
                    <span>{t('cp_start_activity', lang)}</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: COMMUNITY NETWORK FORUM */}
        {activeSubTab === 'network' && (
          <motion.div
            key="subtab-network"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header with toggle to write a new post */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-[24px] bg-[#2D3436] text-white shadow-[6px_6px_0px_#2D3436] border-4 border-[#2D3436] text-left">
              <div className="flex items-center gap-3">
                <Users className="text-[#FF6B6B]" size={24} />
                <div>
                  <span className="font-extrabold text-sm sm:text-base block uppercase tracking-wide">Community Support & Peer Strategy Exchange</span>
                  <span className="text-xs text-slate-300 block leading-relaxed font-semibold mt-0.5">Explore proven neurodiverse parenting blueprint guides or pose questions to other families.</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddPost(!showAddPost);
                  speakText(showAddPost ? (lang === 'sw' ? 'Fomu imefungwa' : 'Closed create post form') : (lang === 'sw' ? 'Fomu imefunguliwa. Andika ushauri wako hapa chini!' : 'Opening post form. Type your advice below!'), config.ttsSpeed, false, lang);
                }}
                className="py-2.5 px-4 bg-[#FFD93D] hover:bg-[#f6cd2f] text-[#2D3436] font-black text-xs rounded-xl border-2 border-[#2D3436] cursor-pointer shadow-[2px_2px_0px_#2D3436] active:translate-y-[1px] transition-all flex items-center gap-1.5"
                id="btn-parent-post-toggle"
              >
                <Plus size={14} className="stroke-[2.5px]" />
                <span>{showAddPost ? t('cp_cancel', lang) : t('cp_post_question', lang)}</span>
              </button>
            </div>

            {/* Parenting Strategy blueprints library */}
            <div className="p-6 bg-[#EBFDF0] border-4 border-[#2D3436] rounded-[28px] shadow-[4px_4px_0px_#2D3436] space-y-4 text-left">
              <div className="flex items-center justify-between border-b-2 border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#6BCB77] stroke-[2.5px]" size={18} />
                  <h4 className="font-black text-sm text-[#2D3436] uppercase tracking-wide">Included Parenting Strategy Reference Blueprints</h4>
                </div>
                <span className="text-[10px] font-black uppercase text-[#2D3436] bg-[#FFD93D] border-2 border-[#2D3436] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_#2D3436] hidden sm:block">Easy template</span>
              </div>
              
              <p className="text-xs font-bold text-slate-700 leading-relaxed max-w-2xl">
                Stuck on how to adapt routine studies at home? Explore these vetted methods. Click 
                <strong className="text-emerald-700 font-extrabold"> "💬 Pre-fill Discussion Template" </strong> 
                to automatically load a template in the forum block below!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {[
                  {
                    title: '📋 Visual Checklist Calendars',
                    category: 'strategies',
                    description: 'Interactive checklist routine charts using slider pegs. Minimizes frustration during transition shocks.',
                    benefit: 'Eases daily switch transitions by 80%',
                    postTitle: 'Experimenting with slide-checkpoint checklists',
                    postContent: 'We read about the Visual Checklist Calendar strategy on the support board. Has anyone tested physical slider trackers instead of erasable posters? Our child gets nervous when letters look smudged.',
                  },
                  {
                    title: '🧘 Quiet Sensory Reset Zone',
                    category: 'sensory',
                    description: 'A cozy low-stimulation safety corner holding a 3lb weighted plushie, squeeze toys, and noise-reducing headphones.',
                    benefit: 'Soothes high central-nervous anxiety outbursts',
                    postTitle: 'Success with quiet zones during high-complexity spelling tasks',
                    postContent: 'Our student is sensory-sensitive to unexpected micro-noises at home. We just setup a Cozy Reset Corner. What weighted toys or compression cushions have other caregivers found useful?',
                  },
                  {
                    title: '✍️ Sensory Tracing (Sand Box)',
                    category: 'speech',
                    description: 'Vocalizing letters phonetically while physically spelling them on baking pans filled with flour or dry sand.',
                    benefit: 'Multi-sensory touch triggers motor phonics memories',
                    postTitle: 'Using sandbox letter drawing to solidify literacy',
                    postContent: 'We started testing the Sensory Sandbox tracing strategy for Word Quest level preparation. Do other parents have recommendations on keeping flour contained, or other tactile fillers like chia seeds?',
                  },
                  {
                    title: '⏱️ ADHD Multi-Break Spacers',
                    category: 'cognitive',
                    description: 'Dividing study playbooks into 10-minute sprints followed by 90-second physical jumping-jacks or stretching.',
                    benefit: 'Siphons off hyperactive energy before burnout',
                    postTitle: 'Using micro-stretching breaks to maintain focus',
                    postContent: 'Our child adopted the ADHD Spacer strategy. We break our counting sessions with 90 seconds of trampoline leaps after every 2 answers. What visual timers do you use that don\'t make annoying ticking noises?',
                  }
                ].map((blueprint, index) => (
                  <div key={index} className="p-4 bg-white border-2 border-[#2D3436] rounded-2xl flex flex-col justify-between shadow-[2px_2px_0px_#2D3436] hover:translate-y-[-1px] hover:shadow-[3.5px_3.5px_0px_#2D3436] transition-all">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[13px] text-[#2D3436]">{blueprint.title}</span>
                        <span className="text-[8px] font-black bg-[#E1F5FE] text-[#1B4E8C] border border-[#4A90E2] px-2 py-0.5 rounded-full uppercase">
                          {blueprint.category === 'strategies' ? 'General Plan' : blueprint.category}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-normal">{blueprint.description}</p>
                      <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 bg-[#EBFDF0] px-2 py-0.5 border border-emerald-200 rounded-lg w-max">
                        <span>💡 Benefit:</span> <span>{blueprint.benefit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowAddPost(true);
                        setNewPostTitle(blueprint.postTitle);
                        setNewPostContent(blueprint.postContent);
                        setNewPostCategory(blueprint.category as any);
                        speakText(lang === 'sw' ? `Kiolezo kimepakiwa: ${blueprint.title}. Anza kuandika hapa chini!` : `Loaded template for ${blueprint.title}. Start typing below!`, config.ttsSpeed, false, lang);
                        // Smooth scroll down to the form
                        setTimeout(() => {
                          const formEl = document.getElementById('caregiver-create-post-form');
                          if (formEl) {
                            formEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 120);
                      }}
                      className="mt-3.5 w-full py-1.5 bg-white hover:bg-emerald-50 text-[#2D3436] font-black text-[10px] rounded-xl border border-[#2D3436] cursor-pointer shadow-[1px_1px_0px_#2D3436] active:translate-y-[0.5px] active:shadow-none transition-all flex items-center justify-center gap-1"
                    >
                      <span>💬 Pre-fill Discussion Template</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Create Thread Form */}
            <AnimatePresence>
              {showAddPost && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 border-4 border-[#2D3436] rounded-[24px] bg-white text-[#2D3436] shadow-[4px_4px_0px_#2D3436] space-y-5"
                  id="caregiver-create-post-form"
                >
                  <form onSubmit={handleCreatePost} className="space-y-4 text-left">
                    <h5 className="font-black text-sm border-b pb-2 flex items-center gap-2 text-[#2D3436]">
                      <Plus size={16} /> Describe Your Inclusive Strategy or Question
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-extrabold text-[#2D3436] block mb-1.5">Topic Title / Strategy Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Finding waterproof spelling cards"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-extrabold text-[#2D3436] block mb-1.5">Focus Area Category</label>
                        <select
                          value={newPostCategory}
                          onChange={(e) => setNewPostCategory(e.target.value as any)}
                          className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                        >
                          <option value="strategies">🤝 Inclusive Parenting Strategies</option>
                          <option value="speech">🗣️ Speech Therapy & Phonics</option>
                          <option value="sensory">🎨 Sensory Balance</option>
                          <option value="motor">🦾 Fine Motor Controls</option>
                          <option value="cognitive">🧠 Cognitive / ADHD strategies</option>
                          <option value="general">🌍 General Family Guidelines</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-[#2D3436] block mb-1.5">Your Advice or Inquiry</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detail your story here... what method helped? What did you ask the teacher?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] p-3 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddPost(false);
                          setNewPostTitle('');
                          setNewPostContent('');
                        }}
                        className="py-2.5 px-4 bg-white border-2 border-[#2D3436] rounded-xl font-black text-xs cursor-pointer shadow-[2px_2px_0px_#2D3436]"
                      >
                        {t('cp_cancel', lang)}
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-[#FFD93D] hover:bg-[#ebd052] text-[#2D3436] rounded-xl font-black text-xs cursor-pointer border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436] active:translate-y-[1px] transition-all flex items-center gap-1.5"
                      >
                        <Send size={12} className="stroke-[2.5px]" />
                        <span>{t('cp_submit', lang)}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyword Search & Category Filters */}
            <div className="p-5 bg-white border-4 border-[#2D3436] rounded-[24px] shadow-[4px_4px_0px_#2D3436] text-[#2D3436] space-y-4 text-left">
              <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                <Filter className="text-[#FF6B6B] stroke-[2.5px]" size={16} />
                <span className="font-black text-xs uppercase tracking-wider">Search & Sort Peer Support Board</span>
              </div>

              {/* Text keyword search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 stroke-[2.5px]" size={16} />
                <input
                  type="text"
                  placeholder="Search parenting strategy keywords, active authors, or topics..."
                  value={searchQueryForum}
                  onChange={(e) => setSearchQueryForum(e.target.value)}
                  className="w-full bg-[#FDFCF0] text-[#2D3436] border-2 border-[#2D3436] py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-[#6BCB77] focus:outline-hidden font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                />
              </div>

              {/* Category tags selector tabs */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black text-slate-500 block">Filter discussions by specialty:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'All', label: '🌈 All Threads' },
                    { id: 'strategies', label: '🤝 Parenting Strategies' },
                    { id: 'speech', label: '🗣️ Speech & Phonics' },
                    { id: 'sensory', label: '🎨 Sensory' },
                    { id: 'motor', label: '🦾 Fine Motor' },
                    { id: 'cognitive', label: '🧠 Cognitive / ADHD' },
                    { id: 'general', label: '🌍 General' }
                  ].map((catBadge) => (
                    <button
                      key={catBadge.id}
                      type="button"
                      onClick={() => {
                        setCategoryFilterForum(catBadge.id as any);
                        speakText(catBadge.label, config.ttsSpeed, false, lang);
                      }}
                      className={`px-3 py-1.5 font-black text-[10px] sm:text-[11px] border-2 border-[#2D3436] rounded-xl cursor-pointer shadow-[1.5px_1.5px_0px_#2D3436] transition-all active:translate-y-[1.5px] ${
                        categoryFilterForum === catBadge.id
                          ? 'bg-[#2D3436] text-white shadow-none'
                          : 'bg-white text-[#2D3436] hover:bg-slate-50'
                      }`}
                    >
                      {catBadge.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Forums grid feed */}
            <div className="space-y-6" id="caregiver-forums-feed">
              {(() => {
                // Apply dynamic filters
                const list = forumPosts.filter((post) => {
                  if (categoryFilterForum !== 'All' && post.category !== categoryFilterForum) {
                    return false;
                  }
                  if (searchQueryForum.trim()) {
                    const query = searchQueryForum.toLowerCase();
                    const matchTitle = post.title.toLowerCase().includes(query);
                    const matchContent = post.content.toLowerCase().includes(query);
                    const matchAuthor = post.author.toLowerCase().includes(query);
                    if (!matchTitle && !matchContent && !matchAuthor) {
                      return false;
                    }
                  }
                  return true;
                });

                if (list.length === 0) {
                  return (
                    <div className="p-12 border-4 border-dashed border-[#2D3436]/40 bg-slate-50 text-[#2D3436] rounded-[24px] text-center space-y-3">
                      <span className="text-3xl">💬</span>
                      <h5 className="font-black text-sm">No Strategy Discussions Found</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        No matches were found. Try another search query or set the filter back to "All Threads"!
                      </p>
                    </div>
                  );
                }

                return list.map((post) => (
                  <div 
                    key={post.id} 
                    className="p-6 border-4 border-[#2D3436] bg-white rounded-[24px] space-y-5 shadow-[4px_4px_0px_#2D3436] hover:translate-y-[-1px] transition-all text-left text-[#2D3436]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFD93D] border-2 border-[#2D3436] uppercase rounded-full font-black text-sm text-[#2D3436] flex items-center justify-center shadow-[1.5px_1.5px_0px_#2D3436]">
                          {post.author[0]}
                        </div>
                        <div>
                          <span className="font-black text-sm text-[#2D3436] block">{post.author}</span>
                          <span className="text-[10px] text-[#FF6B6B] bg-[#FFE5E5] border-2 border-[#FF6B6B] px-2.5 py-0.5 rounded-full font-black uppercase mt-1 inline-block">{post.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-extrabold">{post.createdAt}</span>
                    </div>

                    {/* Message body */}
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-wider font-black text-[#4A90E2] uppercase block">
                        {post.category === 'strategies' ? '🤝 Inclusive Parenting Strategy' : `${post.category.toUpperCase()} SUPPORT THREAD`}
                      </span>
                      <h4 className="font-black text-lg text-[#2D3436] leading-snug">{post.title}</h4>
                      <p className="text-xs text-slate-650 leading-relaxed font-bold">"{post.content}"</p>
                    </div>

                    {/* Forum utilities block (Likes and responses accordion click) */}
                    <div className="flex items-center gap-3 text-xs font-black border-t-2 border-slate-100 pt-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1.5 py-2 px-3 hover:bg-[#FFE5E5] border-2 border-transparent hover:border-[#2D3436] rounded-xl text-slate-600 hover:text-[#FF6B6B] cursor-pointer transition-all"
                        aria-label="Like post"
                      >
                        <ThumbsUp size={15} />
                        <span>{post.likes} {t('cp_like', lang)}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePostId(activePostId === post.id ? null : post.id);
                          speakText(lang === 'sw' ? `Inaonyesha majibu ${post.comments.length}.` : `Showing ${post.comments.length} responses.`, config.ttsSpeed, false, lang);
                        }}
                        className="flex items-center gap-1.5 py-2 px-3 hover:bg-[#E1F5FE] border-2 border-transparent hover:border-[#2D3436] rounded-xl text-slate-600 hover:text-[#4A90E2] cursor-pointer transition-all"
                      >
                        <MessageSquare size={15} />
                        <span>{post.comments.length} {t('cp_reply', lang)}</span>
                      </button>
                    </div>

                    {/* Responses block drawer */}
                    {activePostId === post.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t-2 border-slate-200 bg-[#FDFCF0] rounded-2xl p-4 space-y-4 border-2 border-[#2D3436] shadow-[2px_2px_0px_#2D3436]"
                      >
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">Thread Feed:</span>
                        
                        {/* Comments feed list */}
                        <div className="space-y-3 flex flex-col">
                          {post.comments.map((comm) => (
                            <div key={comm.id} className="p-3 bg-white border-2 border-[#2D3436] rounded-xl space-y-1 shadow-[1.5px_1.5px_0px_#2D3436] text-left">
                              <div className="flex items-center justify-between text-[10px] font-black">
                                <span className="text-[#2D3436]">{comm.author} <span className="opacity-75 text-slate-500">({comm.role})</span></span>
                                <span className="text-slate-500 font-extrabold">{comm.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-650 leading-relaxed font-bold">"{comm.content}"</p>
                            </div>
                          ))}
                        </div>

                        {/* Add comments form */}
                        <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Type an encouraging response..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-1 text-xs px-3.5 py-2.5 bg-white border-2 border-[#2D3436] rounded-xl text-[#2D3436] font-bold focus:outline-hidden focus:ring-1 focus:ring-[#6BCB77]"
                          />
                          <button
                            type="submit"
                            className="p-2.5 bg-[#6BCB77] hover:bg-[#5bbf67] text-white font-black text-xs rounded-xl border-2 border-[#2D3436] shadow-[1.5px_1.5px_0px_#2D3436] cursor-pointer transition-all flex items-center justify-center"
                          >
                            <Send size={14} className="stroke-[2.5px]" />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
