import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Timer, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Flame, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Compass, 
  Zap,
  Bot,
  FileCode,
  Copy,
  Check,
  Download,
  X
} from 'lucide-react';
import { ImprovementProposal, TabType } from '../types';
import antigravitySpec from '../antigravity-spec.json';

interface AnalysisViewProps {
  proposals: ImprovementProposal[];
  setActiveTab: (tab: TabType) => void;
  apiStatus: { status: string; hasApiKey: boolean };
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  proposals,
  setActiveTab,
  apiStatus,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAntigravityModal, setShowAntigravityModal] = useState(false);
  const [modalTab, setModalTab] = useState<'blueprint' | 'json' | 'cli'>('blueprint');
  const [copied, setCopied] = useState(false);

  const filteredProposals = selectedCategory === 'all' 
    ? proposals 
    : proposals.filter(p => p.category === selectedCategory);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'AI & Gemini': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      case 'Cognitive': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Productivity': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'UX & Mobile': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'Transformador':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1"><Flame className="w-3 h-3 text-pink-400" /> Impacto {impact}</span>;
      case 'Muito Alto':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-indigo-400" /> Impacto {impact}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">{impact}</span>;
    }
  };

  const getActionForProposal = (id: string): TabType | null => {
    if (id === 'tutor-ai') return 'tutor';
    if (id === 'feynman-ai') return 'feynman';
    if (id === 'spaced-repetition') return 'flashcards';
    if (id === 'quiz-generator') return 'quiz';
    if (id === 'cornell-summarizer') return 'cornell';
    if (id === 'binaural-pomodoro') return 'pomodoro';
    if (id === 'gamification-retention') return 'stats';
    return null;
  };

  const jsonString = JSON.stringify(antigravitySpec, null, 2);

  const blueprintMarkdown = `# 🛸 OmniStudy AI — Blueprint de Integração Antigravity

Runtime: Node.js (Express Full-Stack) + React 19 + TypeScript 7
Modelo Base: Gemini 3.8 Flash (Server-Side @google/genai)
Endpoint Tutor: POST /api/gemini/tutor-chat
Endpoint Feynman: POST /api/gemini/feynman-evaluate
Endpoint Flashcards SRS: POST /api/gemini/generate-flashcards
Endpoint Cornell Notes: POST /api/gemini/summarize-cornell

Matriz de Execução no Antigravity Agent:
1. npm run build
2. npm run dev
3. Executar chamadas nos endpoints /api/gemini/* para orquestração socrática.`;

  const handleCopyCurrent = () => {
    const textToCopy = modalTab === 'json' ? jsonString : modalTab === 'blueprint' ? blueprintMarkdown : 'npm run build && npm run dev';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'antigravity-spec.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Banner / Executive Diagnosis */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Diagnóstico & Matriz Antigravity</span>
            </span>

            <button
              onClick={() => setShowAntigravityModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-200 text-xs font-bold transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-violet-400" />
              <span>Exportar Blueprint para Antigravity</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Análise Estratégica & Matriz de Evolução
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            O aplicativo foi transformado em uma suíte de alta performance cognitiva. O <strong className="text-indigo-300">Tutor Socrático de IA</strong> está 
            totalmente integrado no backend, e a <strong className="text-cyan-300">matriz de prospectivas</strong> está exportável para execução direta no Antigravity Agent.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 font-medium">Tutor Cognitivo</span>
              <p className="text-sm font-bold text-white mt-1">Socrático Ativo</p>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Integrado ao App
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 font-medium">Motor de Inteligência</span>
              <p className="text-sm font-bold text-white mt-1">Gemini 3.8 Flash</p>
              <span className="text-[11px] text-indigo-400 flex items-center gap-1 mt-0.5">
                <Cpu className="w-3 h-3" /> Multi-turn & Fallbacks
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 font-medium">Metodologias</span>
              <p className="text-sm font-bold text-white mt-1">4 Métodos Centrais</p>
              <span className="text-[11px] text-cyan-400 flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3" /> Feynman, SRS, Cornell, Foco
              </span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 font-medium">Compatibilidade</span>
              <p className="text-sm font-bold text-white mt-1">Antigravity Agent</p>
              <span className="text-[11px] text-violet-400 flex items-center gap-1 mt-0.5">
                <FileCode className="w-3 h-3" /> Blueprint & Spec Prontos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Primary Card: AI TUTOR */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bot className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                Recurso Principal Integrado
              </span>
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Operacional
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Tutor Socrático de IA para Tutoriar o Aluno
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Integrado com contexto contínuo, 4 modos adaptativos (Socrático, Feynman, Exame e Desafio) e estímulos de reflexão para que o aluno construa o próprio entendimento sem respostas prontas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('tutor')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-start md:self-center transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Abrir Sessão com o Tutor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Pillars Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Ecossistema de Aprendizagem Ativa Operacional
            </h2>
            <p className="text-sm text-slate-400">
              Módulos construídos e integrados ao backend:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Feynman */}
          <div 
            onClick={() => setActiveTab('feynman')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-violet-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                Laboratório Feynman
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Diagnóstico de jargões, pontuação de clareza (0-100) e geração de analogias intuitivas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-violet-400">
              <span>Testar Diagnóstico</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Flashcards SRS */}
          <div 
            onClick={() => setActiveTab('flashcards')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Flashcards & SRS 3D
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Repetição espaçada com cartões 3D giratórios e gerador instantâneo via Gemini.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>Abrir Baralhos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Quiz IA */}
          <div 
            onClick={() => setActiveTab('quiz')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Simulados & Quizzes
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Questões inéditas com justificativa detalhada para opções corretas e distratores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Fazer Simulado</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Pomodoro com Áudio */}
          <div 
            onClick={() => setActiveTab('pomodoro')}
            className="group cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-rose-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                Pomodoro & Áudio
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Temporizador com áudio procedural (chuva, ondas alfa, ruído branco) via Web Audio API.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>Iniciar Foco</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Catalog of Improvement Proposals & Roadmap */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Matriz de Prospectivas & Evolução do Código
            </h2>
            <p className="text-sm text-slate-400">
              Tarefas estruturadas e prontas para orquestração:
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'AI & Gemini', 'Cognitive', 'Productivity', 'UX & Mobile'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Todos os Recursos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProposals.map((proposal) => {
            const actionTab = getActionForProposal(proposal.id);
            return (
              <div 
                key={proposal.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCategoryColor(proposal.category)}`}>
                      {proposal.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {getImpactBadge(proposal.impact)}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">
                    {proposal.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {proposal.description}
                  </p>

                  <div className="mt-3.5 space-y-1.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Capacidades & Especificação:
                    </span>
                    {proposal.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                    proposal.status === 'Implementado no App' 
                      ? 'text-emerald-400' 
                      : proposal.status === 'Pronto para Ativar' 
                      ? 'text-indigo-400' 
                      : 'text-amber-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      proposal.status === 'Implementado no App' ? 'bg-emerald-400' : 'bg-indigo-400'
                    }`}></span>
                    {proposal.status}
                  </span>

                  {actionTab ? (
                    <button
                      onClick={() => setActiveTab(actionTab)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-indigo-500/30"
                    >
                      <span>Abrir Módulo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Disponível na matriz
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export to Antigravity Modal */}
      {showAntigravityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col animate-fadeIn">
            <button
              onClick={() => setShowAntigravityModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Exportar Matriz & Blueprint para Antigravity
                </h3>
                <p className="text-xs text-slate-400">
                  Especificação formatada para o agente autônomo executar e aplicar melhorias
                </p>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
              <button
                onClick={() => setModalTab('blueprint')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalTab === 'blueprint'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Blueprint Markdown (Documento)
              </button>
              <button
                onClick={() => setModalTab('json')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalTab === 'json'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Matriz JSON (Machine Readable)
              </button>
              <button
                onClick={() => setModalTab('cli')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalTab === 'cli'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Comandos de Teste
              </button>
            </div>

            {/* Code Output Box */}
            <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed max-h-[380px]">
              <pre className="whitespace-pre-wrap">
                {modalTab === 'blueprint' && blueprintMarkdown}
                {modalTab === 'json' && jsonString}
                {modalTab === 'cli' && `# Testar saúde do servidor:
curl http://localhost:3000/api/health

# Testar Tutor Socrático:
curl -X POST http://localhost:3000/api/gemini/tutor-chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","text":"Explique a teoria da relatividade"}],"mode":"socratic"}'`}
              </pre>
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Arquivos no projeto: <code className="text-indigo-400">/ANTIGRAVITY_BLUEPRINT.md</code> e <code className="text-indigo-400">/src/antigravity-spec.json</code>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar JSON</span>
                </button>

                <button
                  onClick={handleCopyCurrent}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar para Área de Transferência</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
