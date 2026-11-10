import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, TabType } from '../types';
import { sendTutorMessage } from '../services/api';

interface TutorChatViewProps {
  onGoToFlashcards?: () => void;
  onGoToCornell?: () => void;
}

export const TutorChatView: React.FC<TutorChatViewProps> = ({
  onGoToFlashcards,
  onGoToCornell,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Olá! Sou o seu **Tutor Socrático de IA**. 

Meu objetivo não é apenas te dar respostas prontas, mas te guiar pelo raciocínio, identificar lacunas conceituais e garantir que o conhecimento se fixe na sua memória de longo prazo.

Qual tema ou dúvida você gostaria de desbravar hoje?`,
      timestamp: 'Agora',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [subject, setSubject] = useState('Ciência da Aprendizagem');
  const [mode, setMode] = useState<'socratic' | 'exam' | 'simple' | 'challenge'>('socratic');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    { label: '🎯 Teste meu conhecimento', prompt: `Me faça 3 perguntas provocativas sobre ${subject} para testar minha retenção ativa.` },
    { label: '💡 Crie uma analogia simples', prompt: `Qual é a melhor analogia do mundo real para entender o cerne de ${subject}?` },
    { label: '⚠️ Principais armadilhas', prompt: `Quais são os erros conceituais e pegadinhas mais comuns que as pessoas cometem em ${subject}?` },
    { label: '🗺️ Trilha de domínio', prompt: `Divida ${subject} em 4 etapas lógicas para eu dominar do zero ao avançado.` },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      // Send message history formatted for backend
      const history = newMessages.map(m => ({
        role: m.role,
        text: m.text,
      }));

      const replyText = await sendTutorMessage(history, mode, subject);

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        text: `⚠️ Ops, ocorreu uma oscilação na resposta da IA: ${err.message || 'Tente novamente em instantes'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversa reiniciada. Em qual tópico de **${subject}** vamos focar agora?`,
        timestamp: 'Agora',
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tutor Cognitivo Dedicado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tutor de Aprendizagem Ativa com IA
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Interaja com um mentor socrático que desafia seu raciocínio, esclarece dúvidas e consolida a memória.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onGoToFlashcards && (
            <button
              onClick={onGoToFlashcards}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Flashcards</span>
            </button>
          )}
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1.5 transition-all"
            title="Limpar histórico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Chat</span>
          </button>
        </div>
      </div>

      {/* Tutor Configuration Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Disciplina / Foco:
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Farmacologia, Cálculo, Filosofia..."
            className="w-full max-w-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'socratic', label: 'Socrático', icon: HelpCircle },
            { id: 'simple', label: 'Feynman', icon: Sparkles },
            { id: 'exam', label: 'Banca/Exame', icon: CheckCircle2 },
            { id: 'challenge', label: 'Desafio', icon: Flame },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[1px] flex-shrink-0 mt-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  isBot
                    ? 'bg-slate-950/90 border border-slate-800 text-slate-100 shadow-md'
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                }`}>
                  <div className="whitespace-pre-line break-words">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white flex items-center gap-1"
                      title="Copiar texto"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[1px] flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>O Tutor IA está formulando o raciocínio socrático...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/70 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Sugestões Rápidas:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(qp.prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Converse com o tutor sobre ${subject}... (Pressione Enter)`}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white text-xs sm:text-sm outline-none placeholder:text-slate-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
