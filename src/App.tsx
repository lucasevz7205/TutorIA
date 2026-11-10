/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AnalysisView } from './components/AnalysisView';
import { FeynmanLab } from './components/FeynmanLab';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { CornellView } from './components/CornellView';
import { PomodoroView } from './components/PomodoroView';
import { StatsView } from './components/StatsView';
import { TutorChatView } from './components/TutorChatView';

import { TabType, Deck, QuizQuestion, CornellNote, StudyStats, Flashcard } from './types';
import { 
  initialDecks, 
  initialQuizzes, 
  initialNotes, 
  initialStats, 
  initialProposals 
} from './data/initialData';
import { checkApiHealth } from './services/api';
import { soundEngine } from './services/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tutor');
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuizzes);
  const [notes, setNotes] = useState<CornellNote[]>(initialNotes);
  const [stats, setStats] = useState<StudyStats>(initialStats);
  const [proposals] = useState(initialProposals);

  // Global Pomodoro State (continues running across tabs)
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [cyclesCompleted, setCyclesCompleted] = useState(4);

  // API Health status
  const [apiStatus, setApiStatus] = useState<{ status: string; hasApiKey: boolean }>({
    status: 'checking',
    hasApiKey: false,
  });

  useEffect(() => {
    checkApiHealth().then(res => setApiStatus(res));
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (pomodoroActive && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroActive && pomodoroSeconds === 0) {
      soundEngine.playChime();
      if (pomodoroMode === 'focus') {
        const nextCycles = cyclesCompleted + 1;
        setCyclesCompleted(nextCycles);
        setStats(prev => ({
          ...prev,
          totalFocusMinutes: prev.totalFocusMinutes + 25,
        }));
        if (nextCycles % 4 === 0) {
          setPomodoroMode('longBreak');
          setPomodoroSeconds(15 * 60);
        } else {
          setPomodoroMode('shortBreak');
          setPomodoroSeconds(5 * 60);
        }
      } else {
        setPomodoroMode('focus');
        setPomodoroSeconds(25 * 60);
      }
      setPomodoroActive(false);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroSeconds, pomodoroMode, cyclesCompleted]);

  const handleCardReviewed = () => {
    setStats(prev => ({
      ...prev,
      cardsReviewedToday: prev.cardsReviewedToday + 1,
      totalCardsReviewed: prev.totalCardsReviewed + 1,
    }));
  };

  const handleQuizCompleted = (scorePercentage: number) => {
    setStats(prev => ({
      ...prev,
      quizzesCompleted: prev.quizzesCompleted + 1,
      averageQuizScore: Math.round((prev.averageQuizScore * prev.quizzesCompleted + scorePercentage) / (prev.quizzesCompleted + 1)),
    }));
  };

  const handleFocusMinutesLogged = (minutes: number) => {
    setStats(prev => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + minutes,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
        pomodoroSecondsLeft={pomodoroSeconds}
        pomodoroIsActive={pomodoroActive}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'tutor' && (
          <TutorChatView
            onGoToFlashcards={() => setActiveTab('flashcards')}
            onGoToCornell={() => setActiveTab('cornell')}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisView
            proposals={proposals}
            setActiveTab={setActiveTab}
            apiStatus={apiStatus}
          />
        )}

        {activeTab === 'feynman' && (
          <FeynmanLab
            onGoToFlashcards={() => setActiveTab('flashcards')}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            decks={decks}
            setDecks={setDecks}
            onCardReviewed={handleCardReviewed}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            questions={questions}
            setQuestions={setQuestions}
            onQuizCompleted={handleQuizCompleted}
          />
        )}

        {activeTab === 'cornell' && (
          <CornellView
            notes={notes}
            setNotes={setNotes}
          />
        )}

        {activeTab === 'pomodoro' && (
          <PomodoroView
            secondsLeft={pomodoroSeconds}
            setSecondsLeft={setPomodoroSeconds}
            isActive={pomodoroActive}
            setIsActive={setPomodoroActive}
            mode={pomodoroMode}
            setMode={setPomodoroMode}
            cyclesCompleted={cyclesCompleted}
            setCyclesCompleted={setCyclesCompleted}
            onFocusMinutesLogged={handleFocusMinutesLogged}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView stats={stats} />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OmniStudy AI • Desenvolvido com Google Gemini 3.8 Flash & Ciência Cognitiva</span>
          <span className="text-slate-600">Aprendizagem Acelerada • Repetição Espaçada • Método Feynman</span>
        </div>
      </footer>
    </div>
  );
}
