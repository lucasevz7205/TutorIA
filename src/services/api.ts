import { FeynmanEvaluation, Flashcard, QuizQuestion, CornellNote } from '../types';

export async function checkApiHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Falha no status');
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function sendTutorMessage(
  messages: Array<{ role: 'user' | 'model'; text: string }>,
  mode = 'socratic',
  subject = 'Geral'
): Promise<string> {
  const res = await fetch('/api/gemini/tutor-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, mode, subject }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.reply;
}

export async function evaluateFeynman(
  topic: string,
  explanation: string,
  targetAudience = 'criança de 10 anos'
): Promise<FeynmanEvaluation> {
  const res = await fetch('/api/gemini/feynman-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, explanation, targetAudience }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${res.status}`);
  }

  return res.json();
}

export async function generateAiFlashcards(
  topic: string,
  text: string,
  count = 6,
  difficulty = 'médio'
): Promise<Array<{ question: string; answer: string; category: string; mnemonicHint: string }>> {
  const res = await fetch('/api/gemini/generate-flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, text, count, difficulty }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.flashcards || [];
}

export async function generateAiQuiz(
  topic: string,
  count = 5,
  level = 'intermediário'
): Promise<QuizQuestion[]> {
  const res = await fetch('/api/gemini/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, count, level }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${res.status}`);
  }

  const data = await res.json();
  return (data.questions || []).map((q: any, idx: number) => ({
    id: `quiz-q-${Date.now()}-${idx}`,
    ...q,
  }));
}

export async function summarizeCornell(rawNotes: string, topic: string): Promise<Omit<CornellNote, 'id' | 'date'>> {
  const res = await fetch('/api/gemini/summarize-cornell', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawNotes, topic }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${res.status}`);
  }

  const data = await res.json();
  return {
    title: data.topic || topic || 'Nota de Estudo',
    subject: topic || 'Geral',
    cues: data.cues || [],
    notes: data.notes || '',
    summary: data.summary || '',
    actionItems: data.actionItems || [],
  };
}
