/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'student' | 'teacher' | 'caregiver' | 'none';

export interface AccessibilityConfig {
  textSize: 'normal' | 'large' | 'extra-large';
  fontFamily: 'sans' | 'mono' | 'dyslexic';
  contrastMode: 'normal' | 'high-contrast-light' | 'high-contrast-dark' | 'soft-pastel';
  ttsEnabled: boolean;
  ttsSpeed: number; // 0.75, 1, 1.25, 1.5
  readingGuide: boolean;
  lang: 'en' | 'sw';
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  primaryNeed: string;
  accommodations: string[];
  literacyProgress: number; // 0 to 100
  numeracyProgress: number; // 0 to 100
  recentActivity: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'literacy' | 'numeracy' | 'udl' | 'advocacy';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  modules: {
    title: string;
    content: string;
    completed: boolean;
  }[];
  completed: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  role: 'Teacher' | 'Caregiver' | 'Specialist';
  title: string;
  content: string;
  category: 'speech' | 'sensory' | 'motor' | 'cognitive' | 'general' | 'strategies';
  likes: number;
  commentsCount: number;
  createdAt: string;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  author: string;
  role: 'Teacher' | 'Caregiver' | 'Specialist';
  content: string;
  createdAt: string;
}

export interface AtHomeActivity {
  id: string;
  title: string;
  subject: 'Literacy' | 'Numeracy';
  description: string;
  materialsNeeded: string[];
  steps: string[];
  cognitiveAdaptation: string;
  physicalAdaptation: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: 'Literacy' | 'Numeracy';
  grade: string;
  objective: string;
  standardProcedure: string;
  visualAccommodation: string;
  auditoryAccommodation: string;
  cognitiveAccommodation: string;
  physicalAccommodation: string;
  isCustomTask?: boolean;
}
