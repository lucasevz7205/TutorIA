import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Layers, 
  Trophy, 
  Brain, 
  TrendingUp, 
  CheckCircle2, 
  Award,
  Zap
} from 'lucide-react';
import { StudyStats } from '../types';

interface StatsViewProps {
  stats: StudyStats;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
  const badges = [
    { name: 'Mestre Feynman', desc: '5 conceitos avaliados com clareza >85%', unlocked: true, icon: Brain },
    { name: 'Guerreiro Pomodoro', desc: 'Mais de 400 minutos de foco puro', unlocked: true, icon: Flame },
    { name: 'Evocação Ativa', desc: '100+ revisões de flashcards realizadas', unlocked: true, icon: Layers },
    { name: 'Acerto Crítico', desc: 'Mais de 80% de precisão nos simulados', unlocked: true, icon: Trophy },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Métricas de Aprendizado & Ciência da Memória</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Painel de Retenção & Estatísticas
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Acompanhe o impacto direto da repetição espaçada e do estudo ativo no seu cérebro.
        </p>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sequência Ativa</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.streakDays}</span>
            <span className="text-xs text-amber-400 font-bold">dias seguidos 🔥</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Consistência diária reforça a neuroplasticidade</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tempo em Foco</span>
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{Math.round(stats.totalFocusMinutes / 60)}h</span>
            <span className="text-xs text-indigo-300 font-bold">{stats.totalFocusMinutes % 60}m acumulados</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Medido via ciclos de Pomodoro com áudio</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Flashcards SRS</span>
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalCardsReviewed}</span>
            <span className="text-xs text-cyan-300 font-bold">revisões totais</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{stats.cardsReviewedToday} revisões concluídas hoje</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Média nos Quizzes</span>
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.averageQuizScore}%</span>
            <span className="text-xs text-emerald-300 font-bold">acertos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{stats.quizzesCompleted} simulados respondidos</p>
        </div>
      </div>

      {/* Visual Chart: Ebbinghaus Forgetting Curve vs Spaced Repetition */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Impacto no Cérebro: Curva de Ebbinghaus vs. OmniStudy SRS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualização matemática da retenção de memória após o primeiro estudo
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-0.5 bg-rose-500 inline-block"></span>
              <span>Sem Revisão (Queda de 80%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
              <span>Com Repetição Espaçada (~90% Retenção)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="h-56 sm:h-64 w-full relative pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="600" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="600" y2="65" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="110" x2="600" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
            <line x1="0" y1="155" x2="600" y2="155" stroke="#1e293b" strokeDasharray="3 3" />

            {/* Curve 1: Without review (steep decline) */}
            <path
              d="M 20 20 Q 80 150, 180 170 T 600 185"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />

            {/* Curve 2: With Spaced Repetition (peaks at review intervals) */}
            {/* Day 0 -> Day 1 review (boost back to top) -> Day 3 review -> Day 7 review */}
            <path
              d="M 20 20 
                 Q 80 80, 120 100 
                 L 120 25 
                 Q 180 60, 240 75 
                 L 240 22 
                 Q 360 45, 420 55 
                 L 420 20 
                 Q 520 30, 600 35"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
            />

            {/* Review markers */}
            <circle cx="120" cy="25" r="4.5" fill="#10b981" />
            <circle cx="240" cy="22" r="4.5" fill="#10b981" />
            <circle cx="420" cy="20" r="4.5" fill="#10b981" />
          </svg>

          {/* Time axis labels */}
          <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-2">
            <span>Hora 0 (Aula)</span>
            <span>Dia 1 (1ª Revisão)</span>
            <span>Dia 3 (2ª Revisão)</span>
            <span>Dia 7 (3ª Revisão)</span>
            <span>Dia 30 (Memória Consolidada)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Conclusão prática:</strong> Cada revisão ativa redefine o ponto de partida da curva do esquecimento com uma inclinação muito menor. Três revisões curtas de 5 minutos garantem maior retenção do que 6 horas de estudo corrido antes da prova.
        </div>
      </div>

      {/* Gamification / Badges */}
      <div>
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Conquistas & Selos de Maestria
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
