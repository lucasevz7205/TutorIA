import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  ListChecks, 
  RefreshCw,
  X
} from 'lucide-react';
import { CornellNote } from '../types';
import { summarizeCornell } from '../services/api';

interface CornellViewProps {
  notes: CornellNote[];
  setNotes: React.Dispatch<React.SetStateAction<CornellNote[]>>;
}

export const CornellView: React.FC<CornellViewProps> = ({
  notes,
  setNotes,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [showAiModal, setShowAiModal] = useState(false);
  const [rawText, setRawText] = useState('');
  const [rawTopic, setRawTopic] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const currentNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const handleCreateEmptyNote = () => {
    const newNote: CornellNote = {
      id: `note-${Date.now()}`,
      title: 'Nova Nota de Estudo',
      subject: 'Geral',
      date: 'Hoje',
      cues: [
        'Qual o objetivo principal desta aula?',
        'Conceito 1 em uma palavra',
        'Pergunta de prova prevista'
      ],
      notes: `• Escreva suas notas de aula principais aqui.
• Use tópicos e marcadores simples.
• Evite frases longas e frouxas.`,
      summary: 'Resumo rápido em duas frases do que você aprendeu nesta sessão.',
      actionItems: ['Resolver 3 exercícios', 'Criar 2 flashcards']
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(notes.find(n => n.id !== id)?.id || '');
    }
  };

  const handleAiSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setSummarizing(true);
    setSummaryError(null);

    try {
      const result = await summarizeCornell(rawText, rawTopic || 'Resumo de Aula');
      const newNote: CornellNote = {
        id: `note-ai-${Date.now()}`,
        title: result.title,
        subject: result.subject,
        date: 'Hoje',
        cues: result.cues,
        notes: result.notes,
        summary: result.summary,
        actionItems: result.actionItems,
      };

      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      setShowAiModal(false);
      setRawText('');
      setRawTopic('');
    } catch (err: any) {
      console.error(err);
      setSummaryError(err.message || 'Erro ao organizar anotações com Gemini.');
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span>Método da Universidade Cornell</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Caderno de Anotações Estruturado
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Pistas de evocação à esquerda, notas hierárquicas no centro e síntese executiva no rodapé.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Aprimorar Rascunho com IA</span>
          </button>
          <button
            onClick={handleCreateEmptyNote}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Nota</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notes list sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Minhas Anotações ({notes.length})
          </span>
          <div className="space-y-2">
            {notes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                  selectedNoteId === note.id
                    ? 'bg-slate-800/90 border-violet-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {note.subject}
                    </span>
                    <span className="text-[11px] text-slate-500">{note.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {note.summary}
                  </p>
                </div>

                {notes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Excluir nota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cornell Notebook Paper Sheet */}
        <div className="lg:col-span-8">
          {currentNote ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Title strip */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">
                    {currentNote.subject} • {currentNote.date}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {currentNote.title}
                  </h3>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Estrutura 30% / 70% Cornell
                </div>
              </div>

              {/* Cornell 2-Column Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
                {/* Column 1: Cues / Pistas (Left 35%) */}
                <div className="md:col-span-4 p-5 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/30 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Pistas & Perguntas (Cues)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Cubra a coluna da direita e tente responder a cada item apenas olhando estas palavras:
                  </p>
                  <div className="space-y-2 pt-1">
                    {currentNote.cues.map((cue, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-cyan-200 font-medium leading-relaxed">
                        • {cue}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Notes / Anotações Principais (Right 65%) */}
                <div className="md:col-span-8 p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                    <span>Notas de Aula & Conceitos Principais</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line pt-1 font-normal">
                    {currentNote.notes}
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Executive Summary & Action Items */}
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resumo Executivo (Síntese das Ideias-Chave):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{currentNote.summary}"
                  </p>
                </div>

                {currentNote.actionItems && currentNote.actionItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <ListChecks className="w-3.5 h-3.5" />
                      Ações Práticas de Fixação:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentNote.actionItems.map((act, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                          ✓ {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* AI Cornell Summarizer Modal */}
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
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Organizar com IA (Cornell)</h3>
                <p className="text-xs text-slate-400">Cole anotações soltas e a IA estrutura o caderno</p>
              </div>
            </div>

            <form onSubmit={handleAiSummarize} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Tema da Aula ou Reunião
                </label>
                <input
                  type="text"
                  value={rawTopic}
                  onChange={(e) => setRawTopic(e.target.value)}
                  placeholder="Ex: Farmacologia Clínica, Revolução Industrial, Machine Learning..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Anotações Brutas / Transcrição
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={6}
                  placeholder="Cole aqui suas anotações desorganizadas, transcrição de áudio ou pontos da palestra..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-violet-500 resize-none leading-relaxed placeholder:text-slate-600"
                  required
                />
              </div>

              {summaryError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {summaryError}
                </div>
              )}

              <button
                type="submit"
                disabled={summarizing || !rawText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {summarizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Formatando com Método Cornell...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Transformar em Nota Cornell</span>
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
