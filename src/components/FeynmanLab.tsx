import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { FeynmanEvaluation, Flashcard } from '../types';
import { evaluateFeynman } from '../services/api';

interface FeynmanLabProps {
  onAddFlashcardsToDeck?: (cards: Flashcard[]) => void;
  onGoToFlashcards?: () => void;
}

export const FeynmanLab: React.FC<FeynmanLabProps> = ({
  onAddFlashcardsToDeck,
  onGoToFlashcards,
}) => {
  const [topic, setTopic] = useState('Como funciona a Curva de Ebbinghaus e a Repetição Espaçada?');
  const [explanation, setExplanation] = useState(
    'O cérebro esquece as coisas muito rápido se você só lê uma vez. Quando a gente faz revisões ativas em dias estratégicos (tipo 1 dia, 3 dias, 7 dias), a curva do esquecimento fica mais suave e a memória de curto prazo vira memória de longo prazo.'
  );
  const [targetAudience, setTargetAudience] = useState('uma criança curiosa de 10 anos');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<FeynmanEvaluation | null>({
    topic: 'Como funciona a Curva de Ebbinghaus e a Repetição Espaçada?',
    explanation: 'O cérebro esquece as coisas muito rápido se você só lê uma vez. Quando a gente faz revisões ativas em dias estratégicos (tipo 1 dia, 3 dias, 7 dias), a curva do esquecimento fica mais suave e a memória de curto prazo vira memória de longo prazo.',
    score: 88,
    verdict: 'Excelente intuição! O cerne do conceito foi transmitido com naturalidade e clareza.',
    strengths: [
      'Identificou corretamente a velocidade da perda inicial de memória',
      'Explicou a necessidade de revisões intercaladas em intervalos crescentes',
      'Diferenciou memória temporária de memória de longo prazo sem termos complicados'
    ],
    gapsAndJargon: [
      'Poderia especificar o que significa "revisão ativa" (testar a si mesmo em vez de apenas reler)',
      'Faltou citar o papel do esforço mental na retenção'
    ],
    feynmanSimplified: 'Imagine que seu cérebro é uma trilha de mata fechada. Se você passa por ela uma vez só, o mato cresce e a trilha some. Mas se você passa por ela hoje, depois daqui a três dias, e depois semana que vem, a trilha vira uma estrada de asfalto que nunca mais fecha.',
    memorableAnalogy: 'A estrada de terra vs. a estrada asfaltada pelo tráfego constante.',
    reflectiveQuestions: [
      'Por que tentar lembrar sem olhar o livro funciona melhor do que reler com marca-texto?',
      'O que acontece se você esperar um mês inteiro antes da primeira revisão?',
      'Qual a importância de uma boa noite de sono entre cada revisão?'
    ]
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    {
      topic: 'O que é Inflação na Economia?',
      text: 'Inflação é quando as coisas ficam mais caras porque tem muito dinheiro circulando e a moeda perde o valor de compra.',
    },
    {
      topic: 'Como funciona uma API na computação?',
      text: 'Uma API é como um garçom em um restaurante. Você pede a comida (requisição), o garçom leva para a cozinha (servidor), e depois ele traz o prato pronto para a sua mesa (resposta).',
    },
    {
      topic: 'O que é Gravidade segundo Einstein?',
      text: 'Einstein percebeu que a gravidade não é um ímã invisível, mas sim o peso dos planetas afundando o tecido do espaço, como uma bola de boliche em cima de um colchão elástico.',
    }
  ];

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() || !explanation.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await evaluateFeynman(topic, explanation, targetAudience);
      setEvaluation(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Não foi possível avaliar no momento.');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (pTopic: string, pText: string) => {
    setTopic(pTopic);
    setExplanation(pText);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5 text-violet-400" />
            <span>Método do Prêmio Nobel Richard Feynman</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Laboratório Socrático Feynman com IA
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            "Se você não consegue explicar algo de forma simples para uma criança, você não entendeu de verdade."
            Escreva o conceito com as suas palavras e receba feedback em tempo real sobre clareza e jargões.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleEvaluate} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tópico ou Conceito
                </label>
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Teorema de Bayes, Fotossíntese, Recursão..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Para quem você está explicando?
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-violet-500 text-slate-200 text-xs outline-none"
              >
                <option value="uma criança curiosa de 10 anos">Uma criança de 10 anos (Simplicidade Máxima)</option>
                <option value="um amigo leigo de outra área">Um amigo leigo (Clareza Informal)</option>
                <option value="um estudante do ensino médio">Um estudante do ensino médio</option>
                <option value="uma banca avaliadora de concurso">Uma banca de prova técnica (Precisão sem prolixidade)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Sua Explicação com Próprias Palavras
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={6}
                placeholder="Evite copiar e colar do livro. Finja que você está ensinando alguém em uma mesa de café..."
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white text-sm outline-none transition-all placeholder:text-slate-600 leading-relaxed resize-none"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {explanation.length} caracteres digitados
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim() || !explanation.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Avaliando com Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Avaliar Compreensão com IA</span>
                </>
              )}
            </button>
          </form>

          {/* Quick presets */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Exemplos Prontos para Testar:
            </span>
            <div className="space-y-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset.topic, preset.text)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="font-medium truncate">{preset.topic}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Evaluation Output Column */}
        <div className="lg:col-span-7">
          {evaluation ? (
            <div className="space-y-4">
              {/* Score Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Diagnóstico de Clareza Conceitual
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {evaluation.topic}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Pontuação Feynman</span>
                      <span className="text-2xl font-black text-violet-400">{evaluation.score}/100</span>
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-violet-500/30 flex items-center justify-center bg-violet-500/10">
                      <span className="text-base font-extrabold text-white">{evaluation.score}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium text-violet-200 bg-violet-950/30 border border-violet-500/20 p-3 rounded-xl mt-4">
                  💡 {evaluation.verdict}
                </p>

                {/* Strengths & Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Strengths */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Pontos Fortes da Sua Explicação
                    </h4>
                    <ul className="space-y-1.5">
                      {evaluation.strengths.map((item, idx) => (
                        <li key={idx} className="text-xs text-emerald-200/90 flex items-start gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Lacunas & Jargões a Simplificar
                    </h4>
                    <ul className="space-y-1.5">
                      {evaluation.gapsAndJargon.map((item, idx) => (
                        <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Simplified Feynman version & Analogy */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Como Feynman Explicaria (Versão Ultra Didática):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      "{evaluation.feynmanSimplified}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                      Analogia Memorável do Dia a Dia:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      {evaluation.memorableAnalogy}
                    </p>
                  </div>
                </div>

                {/* Reflective Questions */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <HelpCircle className="w-4 h-4 text-violet-400" />
                    3 Perguntas Socráticas para Testar Seu Domínio:
                  </h4>
                  <div className="space-y-2">
                    {evaluation.reflectiveQuestions.map((q, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shortcut to Flashcards */}
                {onGoToFlashcards && (
                  <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={onGoToFlashcards}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-indigo-600/30"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Gerar Flashcards deste Tópico</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <Brain className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-300">
                Aguardando sua explicação
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Preencha o formulário ao lado com um conceito e clique em "Avaliar Compreensão com IA" para receber o relatório cognitivo completo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
