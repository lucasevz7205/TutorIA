import React from 'react';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Timer, 
  BarChart3, 
  Cpu, 
  Activity,
  Bot
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  apiStatus: { status: string; hasApiKey: boolean };
  pomodoroSecondsLeft: number;
  pomodoroIsActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  apiStatus,
  pomodoroSecondsLeft,
  pomodoroIsActive,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const navItems = [
    { id: 'tutor' as TabType, label: 'Tutor IA', icon: Bot, highlight: true },
    { id: 'analysis' as TabType, label: 'Análise & Antigravity', icon: Activity },
    { id: 'feynman' as TabType, label: 'Método Feynman', icon: Brain },
    { id: 'flashcards' as TabType, label: 'Flashcards SRS', icon: Layers },
    { id: 'quiz' as TabType, label: 'Simulados IA', icon: CheckCircle2 },
    { id: 'cornell' as TabType, label: 'Caderno Cornell', icon: BookOpen },
    { id: 'pomodoro' as TabType, label: 'Pomodoro & Foco', icon: Timer },
    { id: 'stats' as TabType, label: 'Estatísticas', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('analysis')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  OmniStudy
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Aprendizagem Ativa & Cognição
              </p>
            </div>
          </div>

          {/* Quick status indicators */}
          <div className="flex items-center gap-3">
            {/* Active Pomodoro pill */}
            {pomodoroIsActive && (
              <button
                onClick={() => setActiveTab('pomodoro')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-pulse hover:bg-rose-500/20 transition-colors"
                title="Sessão Pomodoro em andamento"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Foco: {formatTime(pomodoroSecondsLeft)}</span>
              </button>
            )}

            {/* AI Engine Status badge */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                apiStatus.hasApiKey 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
              }`}
              title={apiStatus.hasApiKey ? 'Gemini 3.8 Flash conectado' : 'Modo Demonstração Ativo (Configure em Secrets)'}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Gemini 3.8 Flash:</span>
              <span className="font-bold">{apiStatus.hasApiKey ? 'Online' : 'Ativo'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${apiStatus.hasApiKey ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`}></span>
            </div>
          </div>
        </div>

        {/* Tab navigation bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-900/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? item.highlight 
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-white shadow-sm'
                    : item.highlight
                      ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
