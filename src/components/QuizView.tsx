import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Trophy, 
  Clock, 
  HelpCircle, 
  BookOpen, 
  RotateCcw,
  AlertCircle,
  X
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { generateAiQuiz } from '../services/api';

interface QuizViewProps {
  questions: QuizQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  onQuizCompleted: (scorePercentage: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  setQuestions,
  onQuizCompleted,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // AI Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [aiLevel, setAiLevel] = useState('intermediário');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return; // Locked once confirmed
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });
      const pct = Math.round((correct / questions.length) * 100);
      onQuizCompleted(pct);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const handleGenerateAiQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setGenerating(true);
    setAiError(null);

    try {
      const newQuestions = await generateAiQuiz(aiTopic, aiCount, aiLevel);
      if (newQuestions.length === 0) throw new Error('Nenhuma questão gerada.');

      setQuestions(newQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation(false);
      setQuizFinished(false);
      setShowAiModal(false);
      setAiTopic('');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Erro ao gerar simulado com Gemini.');
    } finally {
      setGenerating(false);
    }
  };

  // Score calculation for finish screen
  const correctCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
  const scorePercent = Math.round((correctCount / (questions.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulados & Avaliação Formativa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Simulados & Quizzes com IA
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Questões objetivas com feedback didático imediato e diagnóstico de erro.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Gerar Simulado com IA</span>
        </button>
      </div>

      {!quizFinished && currentQuestion ? (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Questão {currentIndex + 1} de {questions.length}</span>
              <span>Conceito: <span className="text-indigo-400">{currentQuestion.keyConcept}</span></span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const answered = showExplanation;

                let btnStyles = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

                if (answered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-500/10';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                  } else {
                    btnStyles = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyles = 'bg-indigo-950/40 border-indigo-500 text-white';
                }

                const letter = ['A', 'B', 'C', 'D'][idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${btnStyles}`}
                  >
                    <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      answered && isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : answered && isSelected && !isCorrect
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {answered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Justificativa Pedagógica & Resolução:
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado do Simulado'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : quizFinished ? (
        /* Results Screen */
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 animate-fadeIn shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[2px] mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white">Simulado Concluído!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Avaliação de desempenho cognitivo com base no gabarito
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Pontuação</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">{scorePercent}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Acertos</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{correctCount}/{questions.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Retenção Estimada</span>
              <p className="text-2xl font-black text-cyan-400 mt-1">{scorePercent >= 70 ? 'Alta' : 'Revisar'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 text-left border border-slate-800/80 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Conceitos Abordados neste Simulado:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    selectedAnswers[idx] === q.correctIndex
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  }`}
                >
                  {q.keyConcept}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refazer Este Simulado</span>
            </button>
            <button
              onClick={() => setShowAiModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Novo Simulado com IA</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* AI Quiz Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Criar Simulado com IA</h3>
                <p className="text-xs text-slate-400">Questões inéditas calibradas pelo Gemini 3.8 Flash</p>
              </div>
            </div>

            <form onSubmit={handleGenerateAiQuiz} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Matéria ou Assunto do Exame
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Fisiologia Renal, História do Brasil Colônia, TypeScript Avançado..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Número de Questões
                  </label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value={3}>3 Questões (Check rápido)</option>
                    <option value={5}>5 Questões (Padrão)</option>
                    <option value={8}>8 Questões (Prova completa)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Nível de Dificuldade
                  </label>
                  <select
                    value={aiLevel}
                    onChange={(e) => setAiLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="iniciante">Iniciante / Fundamentos</option>
                    <option value="intermediário">Intermediário</option>
                    <option value="avançado">Avançado / Concurso Público</option>
                  </select>
                </div>
              </div>

              {aiError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {aiError}
                </div>
              )}

              <button
                type="submit"
                disabled={generating || !aiTopic.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Elaborando Questões com Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Iniciar Simulado Inédito</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
