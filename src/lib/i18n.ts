/**
 * Flat translation dictionary — English and Swahili (Kiswahili).
 * Keys are snake_case identifiers. Add new keys to both locales in sync.
 */

export type Lang = 'en' | 'sw';

const translations = {
  // ── App / Header ────────────────────────────────────────────────────────────
  app_name:             { en: 'SomaWote',                              sw: 'SomaWote' },
  app_tagline:          { en: 'Inclusive Learning Support',            sw: 'Msaada wa Kujifunza kwa Wote' },
  primary_sync_badge:   { en: 'Primary Education Sync',                sw: 'Uratibu wa Elimu ya Msingi' },
  return_hub:           { en: 'Return To Hub Launcher',                sw: 'Rudi Ukurasa Mkuu' },
  level_badge:          { en: 'Primary Level Support System',          sw: 'Mfumo wa Msaada wa Shule ya Msingi' },

  // ── Landing page ────────────────────────────────────────────────────────────
  landing_title:        { en: 'Inclusive Primary Education Platform',  sw: 'Jukwaa la Elimu ya Msingi kwa Wote' },
  landing_subtitle:     {
    en: 'Serving visually, cognitively, and physically diverse learners in Literacy and Numeracy foundations. Discover tailored tools configured to bring students, educators, and families under one cohesive roadmap.',
    sw: 'Kusaidia wanafunzi wenye mahitaji ya maono, akili, na mwili katika misingi ya Kusoma na Hesabu. Gundua zana zilizoundwa kuleta wanafunzi, walimu, na familia pamoja katika njia moja.',
  },

  // ── Portal cards ────────────────────────────────────────────────────────────
  student_portal:       { en: 'Student Portal',                        sw: 'Mlango wa Mwanafunzi' },
  student_desc:         {
    en: 'Spelling adventures, counting playgrounds, massive touch interfaces, and fully guided text-to-speech tasks.',
    sw: 'Michezo ya tahajia, uwanja wa kuhesabu, vifungo vikubwa vya kugusa, na kazi za kusomwa kwa sauti.',
  },
  student_label:        { en: 'A11y Learner Door',                     sw: 'Mlango wa Mwanafunzi' },
  teacher_portal:       { en: 'Educator Portal',                       sw: 'Mlango wa Mwalimu' },
  teacher_desc:         {
    en: 'Observe student tracking, study Universal Design for Learning (UDL), and instantly adapt worksheets.',
    sw: 'Fuatilia maendeleo ya wanafunzi, jifunza Muundo wa Kujifunza kwa Wote (UDL), na kubadilisha karatasi mara moja.',
  },
  teacher_label:        { en: 'Educator Hub',                          sw: 'Kitovu cha Mwalimu' },
  caregiver_portal:     { en: 'Caregiver Portal',                      sw: 'Mlango wa Mlezi' },
  caregiver_desc:       {
    en: 'Review school milestones, explore at-home sensory activity playbooks, and connect with peer groups.',
    sw: 'Angalia mafanikio ya shule, gundua shughuli za hisi nyumbani, na unganika na vikundi vya wenzako.',
  },
  caregiver_label:      { en: 'Home Support',                          sw: 'Msaada wa Nyumbani' },

  // ── Pedagogical footer box ──────────────────────────────────────────────────
  pedagogy_title:       { en: 'Pedagogical Core Alignment',            sw: 'Msingi wa Ualimu' },
  pedagogy_desc:        {
    en: 'SomaWote aligns with standard Primary School guidelines in Literacy (spelling patterns, word combinations, phonics sounds decoding) and Numeracy (numeric quantities, tactile counters, algebraic aggregates as requested by curriculum frameworks).',
    sw: 'SomaWote inazingatia miongozo ya Shule ya Msingi katika Kusoma (mifumo ya tahajia, michanganyiko ya maneno, ufafanuzi wa sauti za fonetiki) na Hesabu (idadi, vihesabio vya kugusa, jumla kama inavyohitajika na mitaala).',
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer:               {
    en: 'SomaWote Platform for Inclusive Primary School Support © 2026. Ready for classroom deployment.',
    sw: 'Jukwaa la SomaWote kwa Msaada wa Shule ya Msingi © 2026. Tayari kwa matumizi darasani.',
  },

  // ── Accessibility toolbar ───────────────────────────────────────────────────
  a11y_section_label:   { en: 'Universal support controls',            sw: 'Vidhibiti vya Msaada' },
  a11y_section_desc:    {
    en: 'Tweak this screen so it matches your unique learning style! Spacing, reading guide, and narrator.',
    sw: 'Rekebisha skrini ili ilingane na mtindo wako wa kujifunza! Nafasi, mstari wa kusoma, na msomaji.',
  },
  voice_guide:          { en: 'Voice Guide',                           sw: 'Msomaji wa Sauti' },
  on:                   { en: 'ON',                                    sw: 'WASHA' },
  off:                  { en: 'OFF',                                   sw: 'ZIMA' },
  reading_ruler:        { en: 'Reading Ruler',                         sw: 'Mstari wa Kusoma' },
  text_size:            { en: 'Text Size',                             sw: 'Ukubwa wa Maandishi' },
  font:                 { en: 'Font',                                  sw: 'Fonti' },
  color_support:        { en: 'Color Support',                         sw: 'Rangi za Msaada' },
  speed:                { en: 'Speed',                                 sw: 'Kasi' },
  normal:               { en: 'NORMAL',                                sw: 'KAWAIDA' },
  contrast:             { en: 'CONTRAST',                              sw: 'TOFAUTI' },
  sensory:              { en: 'SENSORY',                               sw: 'HISI' },
  language:             { en: 'Language',                              sw: 'Lugha' },

  // ── TTS announcement strings ─────────────────────────────────────────────────
  tts_welcome:          {
    en: 'Welcome to the Inclusive Learning Support Platform, assisting primary students with disabilities, educators, and caregivers in literacy and numeracy. Tap one of the three center cards to enter your specific support doorway!',
    sw: 'Karibu kwenye Jukwaa la Msaada wa Kujifunza kwa Wote, linalosaidia wanafunzi wa msingi wenye ulemavu, walimu, na walezi katika kusoma na hesabu. Gonga moja ya kadi tatu za katikati kuingia mlangoni mwako wa msaada!',
  },
  tts_enter_student:    {
    en: 'Entering the Student Learner Portal. Let us play and learn spelling or numbers together!',
    sw: 'Unaingia Mlango wa Mwanafunzi. Hebu tucheze na kujifunza tahajia au nambari pamoja!',
  },
  tts_enter_teacher:    {
    en: 'Entering the Educator Capacity Portal. Review student indicators, take micro courses, and print adapted sheets.',
    sw: 'Unaingia Mlango wa Mwalimu. Angalia viashiria vya wanafunzi, chukua kozi fupi, na chapisha karatasi zilizobadilishwa.',
  },
  tts_enter_caregiver:  {
    en: 'Entering the Caregiver Portal. Access weekly homework tips, review milestones, and connect with peer groups.',
    sw: 'Unaingia Mlango wa Mlezi. Pata vidokezo vya kazi za nyumbani, angalia mafanikio, na unganike na vikundi.',
  },
  tts_return_home:      {
    en: 'Returning back to the master landing page.',
    sw: 'Inarudi kwenye ukurasa mkuu.',
  },
  tts_voice_on:         {
    en: 'Audio reading voice is now active. Hover or click card titles to hear them!',
    sw: 'Msomaji wa sauti umewashwa. Sogesha au gonga vichwa vya kadi kuvisikiliza!',
  },
  tts_voice_off:        { en: 'Audio voice deactivated',               sw: 'Msomaji wa sauti umezimwa' },
  tts_voice_auto:       { en: 'Voice: Auto',                           sw: 'Sauti: Otomatiki' },
  tts_voice_cloud:      { en: 'Voice: Cloud (Intron)',                 sw: 'Sauti: Wingu (Intron)' },
  tts_voice_wasm:       { en: 'Voice: On-device (Piper)',              sw: 'Sauti: Kifaani (Piper)' },
  tts_voice_browser:    { en: 'Voice: Browser',                       sw: 'Sauti: Kivinjari' },
  tts_ruler_on:         {
    en: 'Reading guide ruler active. Use your cursor to guide your reading eyes!',
    sw: 'Mstari wa kusoma umewashwa. Tumia kishale chako kuongoza macho yako ya kusoma!',
  },
  tts_ruler_off:        { en: 'Reading guide ruler off',               sw: 'Mstari wa kusoma umezimwa' },
  tts_size_normal:      { en: 'Text size set to regular',              sw: 'Ukubwa wa maandishi umewekwa kawaida' },
  tts_size_large:       { en: 'Text size set to large',                sw: 'Ukubwa wa maandishi umewekwa mkubwa' },
  tts_size_xl:          { en: 'Text size set to extra large',          sw: 'Ukubwa wa maandishi umewekwa mkubwa sana' },
  tts_font_sans:        { en: 'Font changed to standard clean letters', sw: 'Fonti imebadilishwa kuwa herufi safi za kawaida' },
  tts_font_dyslexic:    { en: 'Font changed to Lexend, designed for reading comfort', sw: 'Fonti imebadilishwa kuwa Lexend, iliyoundwa kwa urahisi wa kusoma' },
  tts_font_mono:        { en: 'Font changed to JetBrains clear numbers', sw: 'Fonti imebadilishwa kuwa JetBrains kwa nambari wazi' },
  tts_theme_normal:     { en: 'Theme color set to standard green and blue dashboard', sw: 'Rangi ya mandhari imewekwa kuwa kijani na buluu ya kawaida' },
  tts_theme_light:      { en: 'Theme color set to high contrast white and black', sw: 'Rangi ya mandhari imewekwa kuwa nyeupe na nyeusi yenye utofauti mkubwa' },
  tts_theme_dark:       { en: 'Theme color set to high contrast black and yellow', sw: 'Rangi ya mandhari imewekwa kuwa nyeusi na njano yenye utofauti mkubwa' },
  tts_theme_pastel:     { en: 'Theme color set to warm, anti-glare pastel, designed for sensory comfort', sw: 'Rangi ya mandhari imewekwa kuwa pastel ya joto, iliyoundwa kwa starehe ya hisi' },
  tts_lang_en:          { en: 'Language switched to English',          sw: 'Lugha imebadilishwa kuwa Kiingereza' },
  tts_lang_sw:          { en: 'Language switched to Swahili',          sw: 'Lugha imebadilishwa kuwa Kiswahili' },

  // ── Student portal ───────────────────────────────────────────────────────────
  sp_welcome_back:      { en: 'Welcome back!',                         sw: 'Karibu tena!' },
  sp_choose_path:       { en: 'Choose a learning path',                sw: 'Chagua njia ya kujifunza' },
  sp_word_quest:        { en: 'Word Quest',                            sw: 'Mchezo wa Maneno' },
  sp_word_quest_desc:   { en: 'Read and spell cool words!',            sw: 'Soma na taja tahajia ya maneno!' },
  sp_counting:          { en: 'Counting Playground',                   sw: 'Uwanja wa Kuhesabu' },
  sp_counting_desc:     { en: 'Add apples, frogs and stars!',          sw: 'Jumlisha matofaa, vyura na nyota!' },
  sp_stars:             { en: 'gold stars',                            sw: 'nyota za dhahabu' },
  sp_your_stars:        { en: 'Your Stars',                            sw: 'Nyota Zako' },
  sp_badges:            { en: 'Badges',                                sw: 'Beji' },
  sp_progress:          { en: 'Progress',                              sw: 'Maendeleo' },
  sp_next:              { en: 'Next',                                  sw: 'Inayofuata' },
  sp_try_again:         { en: 'Try Again',                             sw: 'Jaribu Tena' },
  sp_back:              { en: 'Back',                                  sw: 'Rudi' },
  sp_level:             { en: 'Level',                                 sw: 'Kiwango' },
  sp_spell_it:          { en: 'Spell It!',                             sw: 'Taja Tahajia!' },
  sp_tap_hint:          { en: 'Tap to hear the hint',                  sw: 'Gonga kusikia kidokezo' },
  sp_correct:           { en: 'Correct!',                              sw: 'Sahihi!' },
  sp_incorrect:         { en: 'Not quite — try again!',                sw: 'Si sahihi — jaribu tena!' },
  sp_literacy_title:    { en: 'Spelling Adventure',                    sw: 'Safari ya Tahajia' },
  sp_numeracy_title:    { en: 'Counting Playground',                   sw: 'Uwanja wa Kuhesabu' },
  sp_count_question:    { en: 'How many in total?',                    sw: 'Jumla ni ngapi?' },
  sp_pick_answer:       { en: 'Pick your answer',                      sw: 'Chagua jibu lako' },
  sp_earned_badge:      { en: 'You earned a badge!',                   sw: 'Umepata beji!' },
  sp_milestones:        { en: 'Milestones',                            sw: 'Mafanikio' },

  // ── Teacher portal ───────────────────────────────────────────────────────────
  tp_title:             { en: 'Educator Capacity Hub',                 sw: 'Kitovu cha Uwezo wa Mwalimu' },
  tp_students:          { en: 'Students',                              sw: 'Wanafunzi' },
  tp_courses:           { en: 'Courses',                               sw: 'Kozi' },
  tp_lesson_plans:      { en: 'Lesson Plans',                          sw: 'Mipango ya Masomo' },
  tp_announcements:     { en: 'Announcements',                         sw: 'Matangazo' },
  tp_progress:          { en: 'Progress',                              sw: 'Maendeleo' },
  tp_literacy:          { en: 'Literacy',                              sw: 'Kusoma' },
  tp_numeracy:          { en: 'Numeracy',                              sw: 'Hesabu' },
  tp_generate_plan:     { en: 'Generate Adapted Plan',                 sw: 'Tengeneza Mpango Uliorekebishwa' },
  tp_send:              { en: 'Send',                                  sw: 'Tuma' },
  tp_search:            { en: 'Search...',                             sw: 'Tafuta...' },
  tp_filter:            { en: 'Filter',                                sw: 'Chuja' },
  tp_all:               { en: 'All',                                   sw: 'Yote' },
  tp_view_modules:      { en: 'View Modules',                          sw: 'Angalia Moduli' },
  tp_download:          { en: 'Download',                              sw: 'Pakua' },
  tp_completed:         { en: 'Completed',                             sw: 'Imekamilika' },
  tp_in_progress:       { en: 'In Progress',                           sw: 'Inaendelea' },

  // ── Caregiver portal ─────────────────────────────────────────────────────────
  cp_title:             { en: 'Caregiver Support Hub',                 sw: 'Kitovu cha Msaada wa Mlezi' },
  cp_activities:        { en: 'At-Home Activities',                    sw: 'Shughuli za Nyumbani' },
  cp_milestones:        { en: 'Milestones',                            sw: 'Mafanikio' },
  cp_forum:             { en: 'Peer Forum',                            sw: 'Jukwaa la Wenzangu' },
  cp_resources:         { en: 'Resources',                             sw: 'Rasilimali' },
  cp_post_question:     { en: 'Post a Question',                       sw: 'Uliza Swali' },
  cp_like:              { en: 'Like',                                  sw: 'Penda' },
  cp_reply:             { en: 'Reply',                                 sw: 'Jibu' },
  cp_submit:            { en: 'Submit',                                sw: 'Wasilisha' },
  cp_cancel:            { en: 'Cancel',                                sw: 'Ghairi' },
  cp_steps:             { en: 'Steps',                                 sw: 'Hatua' },
  cp_materials:         { en: 'Materials needed',                      sw: 'Vifaa vinavyohitajika' },
  cp_adaptation_cog:    { en: 'Cognitive adaptation',                  sw: 'Urekebisho wa Akili' },
  cp_adaptation_phys:   { en: 'Physical adaptation',                   sw: 'Urekebisho wa Kimwili' },
  cp_start_activity:    { en: 'Start Activity',                        sw: 'Anza Shughuli' },
  cp_weekly_tip:        { en: 'Weekly Tip',                            sw: 'Kidokezo cha Wiki' },
} as const;

export type TranslationKey = keyof typeof translations;

/** Returns a translation string for the given key and language. */
export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang] ?? translations[key]['en'];
}

// ── Dynamic TTS helpers (portal game strings) ────────────────────────────────

export const tts = {
  // Student portal — gameplay
  welcomeBack: (lang: Lang) =>
    lang === 'sw'
      ? 'Karibu tena! Chagua njia ya kujifunza. Kitabu cha Bluu kwa Tahajia, Tofaa la Machungwa kwa Kuhesabu!'
      : 'Welcome back! Choose a learning pathway. Blue Book for Spelling Adventure, Orange Apple for Counting Playground!',

  spellingIntro: (lang: Lang, level: number, hint: string) =>
    lang === 'sw'
      ? `Safari ya Tahajia! Kiwango ${level}. Tafuta herufi za kuandika neno la: ${hint}`
      : `Spelling Adventure! Level ${level}. Find the letters to spell the word for ${hint}`,

  countingIntro: (lang: Lang, q: number) =>
    lang === 'sw'
      ? `Uwanja wa Kuhesabu! Swali ${q}. Hebu tuhesabu pamoja! Hesabu maumbo kupata jibu.`
      : `Counting Playground! Question ${q}. Let us add together! Count the shapes to find the answer.`,

  letterSound: (lang: Lang, letter: string, phonetic: string) =>
    lang === 'sw' ? `${letter}! ${phonetic}` : `${letter}! ${phonetic}`,

  wordComplete: (lang: Lang, word: string) =>
    lang === 'sw'
      ? `Hongera! Umekamilisha neno ${word}! Umepata nyota 2 za bonasi.`
      : `Fantastic spelling! You completed the word ${word}! You earned 2 bonus stars.`,

  wrongLetter: (lang: Lang, typed: string, target: string) =>
    lang === 'sw'
      ? `Hiyo ni ${typed}. Tafuta ${target}!`
      : `That is ${typed}. Try looking for ${target}!`,

  countCorrect: (lang: Lang, a: number, b: number, ans: number) =>
    lang === 'sw'
      ? `Sahihi kabisa! ${a} jumlisha ${b} ni ${ans}! Kuhesabu vizuri! Umepata nyota 2.`
      : `Spot on! ${a} plus ${b} equals ${ans}! Brilliant counting! You earned 2 gold stars.`,

  countWrong: (lang: Lang) =>
    lang === 'sw'
      ? 'Jibu si sahihi. Hebu gusa kila tofaa au nyota kuzihesabu na kupata jumla.'
      : 'Incorrect count. Let us try touching each apple or star to count them and find the total.',

  tryAgainSpell: (lang: Lang, level: number, hint: string) =>
    lang === 'sw'
      ? `Hebu tuandike tena. Kiwango ${level}. Tafuta herufi za: ${hint}`
      : `Let us spell it again. Level ${level}. Find the letters for ${hint}`,

  nextLevel: (lang: Lang, level: number, hint: string) =>
    lang === 'sw'
      ? `Tunasogea kiwango ${level}. Kidokezo: ${hint}`
      : `Moving to Level ${level}. Hint: ${hint}`,

  retryCount: (lang: Lang) =>
    lang === 'sw'
      ? 'Hebu tuhesabu tena! Gonga maumbo hapa chini, kisha chagua nambari sahihi.'
      : 'Let us recount the problem! Tap the shapes below, then choose the correct number.',

  nextCount: (lang: Lang, a: number, b: number) =>
    lang === 'sw'
      ? `Swali jipya. Hebu tuongeze ${a} na ${b}`
      : `Next question. Let us add ${a} plus ${b}`,

  starsCount: (lang: Lang, n: number) =>
    lang === 'sw'
      ? `Una nyota ${n} za dhahabu! Endelea kuchunguza kupata zaidi!`
      : `You currently have ${n} gold stars! Keep exploring to earn more!`,

  badgeEarned: (lang: Lang, title: string, criteria: string) =>
    lang === 'sw'
      ? `Hongera! Umepata beji mpya: ${title}! ${criteria}`
      : `Hooray! You earned a new digital badge: ${title}! ${criteria}`,

  badgeCongrats: (lang: Lang, title: string) =>
    lang === 'sw'
      ? `Hongera tena kwa kupata ${title}! Endelea kufanya kazi nzuri!`
      : `Congratulations again on unlocking ${title}! Keep up the amazing work!`,

  wordQuestCard: (lang: Lang) =>
    lang === 'sw'
      ? 'Mchezo wa Maneno. Soma na taja tahajia ya maneno ya kuvutia!'
      : 'Word Quest. Read and spell cool words!',

  countingCard: (lang: Lang) =>
    lang === 'sw'
      ? 'Uwanja wa Kuhesabu. Jumlisha matofaa, vyura na nyota!'
      : 'Counting Playground. Add apples, frogs and stars!',

  // Teacher portal
  planGenerated: (lang: Lang, title: string) =>
    lang === 'sw'
      ? `Mpango uliorekebishwa umetengenezwa na kuhifadhiwa: ${title}! Angalia matokeo hapa chini.`
      : `Successfully generated and saved adapted plan: ${title}! Check your adapter results below.`,

  progressCounted: (lang: Lang) =>
    lang === 'sw' ? 'Maendeleo yamehesabiwa!' : 'Module progress counted!',

  announcementSent: (lang: Lang) =>
    lang === 'sw'
      ? 'Tangazo limetumwa kwa mafanikio kwa milango ya Walezi!'
      : 'Announcement dispatched safely to Caregiver portals!',

  // Caregiver portal
  likedPost: (lang: Lang) =>
    lang === 'sw' ? 'Umependa chapisho hili!' : 'Liked this support post!',

  commentPosted: (lang: Lang) =>
    lang === 'sw' ? 'Maoni yamechapishwa kwenye uzi!' : 'Comment posted to thread!',

  questionPublished: (lang: Lang) =>
    lang === 'sw'
      ? 'Swali lako limechapishwa kwenye mfumo wa walezi wenzako!'
      : 'Published your support question to the peer caregiver system!',
};
