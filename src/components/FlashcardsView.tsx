import React, { useState } from 'react';
import { 
  Layers, 
  RotateCw, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  RefreshCw,
  FolderPlus,
  BookOpen,
  Trash2,
  X
} from 'lucide-react';
import { Deck, Flashcard } from '../types';
import { generateAiFlashcards } from '../services/api';

interface FlashcardsViewProps {
  decks: Deck[];
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  onCardReviewed: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  decks,
  setDecks,
  onCardReviewed,
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // AI Generator Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiText, setAiText] = useState('');
  const [aiCount, setAiCount] = useState(6);
  const [aiDifficulty, setAiDifficulty] = useState('médio');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual Card Modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newHint, setNewHint] = useState('');

  const currentDeck = decks.find(d => d.id === selectedDeckId) || decks[0];
  const currentCard = currentDeck?.cards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentCardIndex < (currentDeck?.cards.length || 0) - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex((currentDeck?.cards.length || 1) - 1);
    }
  };

  const handleRate = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    // Calculate next review interval in days
    const daysMap = { again: 1, hard: 3, good: 7, easy: 14 };
    const days = daysMap[difficulty];
    const nextDate = new Date(Date.now() + days * 86400000).toISOString();

    // Update state
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id !== currentDeck.id) return deck;
      return {
        ...deck,
        cards: deck.cards.map((c, idx) => {
          if (idx !== currentCardIndex) return c;
          return {
            ...c,
            difficulty,
            reviewsCount: c.reviewsCount + 1,
            nextReviewDate: nextDate,
            lastReviewedDate: new Date().toISOString()
          };
        })
      };
    }));

    onCardReviewed();
    handleNext();
  };

  const handleGenerateAiDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setGenerating(true);
    setAiError(null);

    try {
      const generatedCards = await generateAiFlashcards(aiTopic, aiText, aiCount, aiDifficulty);
      if (generatedCards.length === 0) {
        throw new Error('Nenhum flashcard gerado.');
      }

      const newDeckId = `deck-${Date.now()}`;
      const newDeck: Deck = {
        id: newDeckId,
        title: aiTopic,
        category: 'Gerado com IA',
        description: `Baralho focado em ${aiTopic} com ${generatedCards.length} cartões de evocação ativa.`,
        color: 'from-purple-600 to-indigo-600',
        cards: generatedCards.map((c, i) => ({
          id: `card-ai-${Date.now()}-${i}`,
          question: c.question,
          answer: c.answer,
          category: c.category || aiTopic,
          mnemonicHint: c.mnemonicHint,
          difficulty: 'good',
          reviewsCount: 0,
          nextReviewDate: new Date().toISOString(),
        }))
      };

      setDecks(prev => [newDeck, ...prev]);
      setSelectedDeckId(newDeckId);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowAiModal(false);
      setAiTopic('');
      setAiText('');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Erro ao gerar baralho com Gemini.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddManualCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim() || !currentDeck) return;

    const newCard: Flashcard = {
      id: `card-manual-${Date.now()}`,
      question: newQuestion,
      answer: newAnswer,
      category: newCategory || currentDeck.category,
      mnemonicHint: newHint || undefined,
      difficulty: 'good',
      reviewsCount: 0,
      nextReviewDate: new Date().toISOString(),
    };

    setDecks(prev => prev.map(d => {
      if (d.id !== currentDeck.id) return d;
      return {
        ...d,
        cards: [...d.cards, newCard]
      };
    }));

    setShowManualModal(false);
    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('');
    setNewHint('');
  };

  const handleDeleteDeck = (deckId: string) => {
    if (decks.length <= 1) return;
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (selectedDeckId === deckId) {
      setSelectedDeckId(decks.find(d => d.id !== deckId)?.id || '');
      setCurrentCardIndex(0);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Controls & Deck Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Repetição Espaçada & Evocação Ativa (Active Recall)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Flashcards com Algoritmo SRS
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Gire o cartão para testar sua memória antes de olhar a resposta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Gerar Baralho com IA</span>
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cartão</span>
          </button>
        </div>
      </div>

      {/* Decks carousel tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {decks.map(deck => (
          <div
            key={deck.id}
            onClick={() => {
              setSelectedDeckId(deck.id);
              setCurrentCardIndex(0);
              setIsFlipped(false);
              setShowHint(false);
            }}
            className={`cursor-pointer px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-3 whitespace-nowrap ${
              selectedDeckId === deck.id
                ? 'bg-slate-800 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>{deck.title}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-[10px] text-slate-400">
              {deck.cards.length}
            </span>
            {decks.length > 1 && selectedDeckId === deck.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDeck(deck.id);
                }}
                className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                title="Excluir baralho"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Flashcard Area */}
      {currentCard ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Progress counter */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-medium">
            <span>
              Cartão <strong className="text-white">{currentCardIndex + 1}</strong> de {currentDeck.cards.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
              {currentCard.category}
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div 
            onClick={handleFlip}
            className="perspective-1000 w-full min-h-[320px] sm:min-h-[360px] cursor-pointer group"
          >
            <div 
              className={`relative w-full h-full min-h-[320px] sm:min-h-[360px] rounded-2xl transition-transform duration-500 transform-style-3d shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD (Question) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 group-hover:border-indigo-500/50 p-6 sm:p-8 flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Pergunta / Estímulo
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Clique para virar
                  </span>
                </div>

                <div className="my-auto py-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed text-center">
                    {currentCard.question}
                  </h3>
                </div>

                <div>
                  {currentCard.mnemonicHint && (
                    <div className="mt-2">
                      {showHint ? (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-amber-300">Dica Mnemônica:</span>
                            <span>{currentCard.mnemonicHint}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 mx-auto py-1 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Ver Dica Mnemônica</span>
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-[11px] text-center text-slate-500 mt-3">
                    Tente lembrar ativamente da resposta antes de revelar
                  </p>
                </div>
              </div>

              {/* BACK OF CARD (Answer) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resposta & Conceito Central
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    Revisões: {currentCard.reviewsCount}
                  </span>
                </div>

                <div className="my-auto py-4">
                  <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed text-center">
                    {currentCard.answer}
                  </p>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Avalie seu nível de retenção abaixo para agendar a próxima revisão
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Prev, Flip, Next & SRS Evaluation */}
          {isFlipped ? (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center block">
                Como foi a recuperação da memória? (Algoritmo SRS)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate('again')}
                  className="py-3 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span>Errei</span>
                  <span className="text-[10px] text-rose-400/80 font-normal">Rever em 1d</span>
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="py-3 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span>Difícil</span>
                  <span className="text-[10px] text-amber-400/80 font-normal">Rever em 3d</span>
                </button>
                <button
                  onClick={() => handleRate('good')}
                  className="py-3 px-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span>Bom</span>
                  <span className="text-[10px] text-indigo-400/80 font-normal">Rever em 7d</span>
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="py-3 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex flex-col items-center gap-0.5 transition-all cursor-pointer"
                >
                  <span>Fácil</span>
                  <span className="text-[10px] text-emerald-400/80 font-normal">Rever em 14d</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Cartão anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleFlip}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-indigo-400" />
                <span>Virar Cartão (Espaço)</span>
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Próximo cartão"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-6">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhum cartão neste baralho</h3>
          <p className="text-xs text-slate-400 mt-1">Crie um novo cartão ou gere com IA.</p>
        </div>
      )}

      {/* MODAL: AI Flashcards Generator */}
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
                <h3 className="text-lg font-bold text-white">Gerar Baralho com IA</h3>
                <p className="text-xs text-slate-400">Gemini 3.8 Flash cria cartões otimizados para memorização</p>
              </div>
            </div>

            <form onSubmit={handleGenerateAiDeck} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Tema ou Disciplina
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Farmacologia Básica, Direito Constitucional, Inglês para Viagem..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Texto Base (Opcional - Cole artigos, resumos ou capítulos)
                </label>
                <textarea
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  rows={3}
                  placeholder="Cole trechos de livros, apostilas ou anotações para gerar perguntas precisas..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Quantidade
                  </label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value={4}>4 Cartões (Rápido)</option>
                    <option value={6}>6 Cartões (Padrão)</option>
                    <option value={10}>10 Cartões (Aprofundado)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Dificuldade
                  </label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                  >
                    <option value="fácil">Fundamentos / Fácil</option>
                    <option value="médio">Intermediário</option>
                    <option value="avançado">Avançado / Concurso</option>
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
                    <span>Criando Baralho com Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Baralho Completo</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Manual Card */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowManualModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Adicionar Cartão Manual</h3>

            <form onSubmit={handleAddManualCard} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Pergunta (Frente)
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={2}
                  placeholder="Qual é a pergunta ou desafio?"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Resposta (Verso)
                </label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={3}
                  placeholder="Resposta explicativa e direta..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Ex: Conceito Geral"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Dica Mnemônica (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Gatilho mental..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all mt-2 cursor-pointer"
              >
                Salvar Cartão no Baralho
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
