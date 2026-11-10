export type TabType = 
  | 'tutor'
  | 'analysis' 
  | 'feynman' 
  | 'flashcards' 
  | 'quiz' 
  | 'cornell' 
  | 'pomodoro' 
  | 'stats';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  mnemonicHint?: string;
  difficulty: 'easy' | 'good' | 'hard' | 'again';
  reviewsCount: number;
  nextReviewDate: string; // ISO date
  lastReviewedDate?: string;
}

export interface Deck {
  id: string;
  title: string;
  category: string;
  description: string;
  color: string;
  cards: Flashcard[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyConcept: string;
  userAnswer?: number;
}

export interface FeynmanEvaluation {
  topic: string;
  explanation: string;
  score: number;
  verdict: string;
  strengths: string[];
  gapsAndJargon: string[];
  feynmanSimplified: string;
  memorableAnalogy: string;
  reflectiveQuestions: string[];
}

export interface CornellNote {
  id: string;
  title: string;
  subject: string;
  date: string;
  cues: string[];
  notes: string;
  summary: string;
  actionItems: string[];
}

export interface StudyStats {
  streakDays: number;
  totalFocusMinutes: number;
  cardsReviewedToday: number;
  totalCardsReviewed: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  feynmanSessionsCount: number;
}

export interface ImprovementProposal {
  id: string;
  title: string;
  category: 'Cognitive' | 'AI & Gemini' | 'Productivity' | 'UX & Mobile';
  description: string;
  impact: 'Alto' | 'Muito Alto' | 'Transformador';
  status: 'Implementado no App' | 'Pronto para Ativar' | 'Planejado';
  details: string[];
}
