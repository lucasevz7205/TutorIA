import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Gemini SDK Server-side Initialization
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to call Gemini with retry and fallback across supported flash models
async function generateContentWithRetry(ai: GoogleGenAI, params: any) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const isTransient = msg.includes('503') || msg.includes('429') || msg.includes('high demand') || msg.includes('RESOURCE_EXHAUSTED');
        if (isTransient) {
          // Wait briefly before retry
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
          continue;
        }
        // Non-transient error, try next model or throw
        break;
      }
    }
  }
  throw lastError || new Error('Falha ao processar com os modelos disponíveis.');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 0. Interactive AI Tutor (Socratic & Active Learning)
  app.post('/api/gemini/tutor-chat', async (req, res) => {
    try {
      const { messages = [], mode = 'socratic', subject = 'Geral' } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Lista de mensagens é obrigatória.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: 'Chave GEMINI_API_KEY não configurada.' });
      }

      const modeInstructions: Record<string, string> = {
        socratic: 'Você é um Tutor Socrático de Aprendizagem Ativa. Não dê respostas diretas ou prontas; em vez disso, faça perguntas reflexivas, divida problemas complexos em pequenos degraus e guie o aluno a raciocinar por conta própria.',
        exam: 'Você é um examinador rigoroso de provas e bancas técnicas. Avalie a precisão conceitual do aluno, aponte ambiguidades na resposta dele e forneça a fundamentação teórica completa com terminologia precisa.',
        simple: 'Você é um professor ultra didático especialista na técnica Feynman. Use analogias marcantes do cotidiano, elimine jargões vazios e explique as coisas de forma tão cristalina que uma criança de 10 anos entenderia de primeira.',
        challenge: 'Você é um debatedor acadêmico. Desafie o estudante com contraexemplos, casos-limite e cenários reais para testar se ele realmente domina as nuances do assunto.',
      };

      const systemInstruction = `${modeInstructions[mode] || modeInstructions.socratic}
Tema/Disciplina em estudo: "${subject}".
Regras fundamentais de tutoria:
1. Responda em Português com tom empático, motivador e focado em fixação duradoura.
2. Use formatação Markdown limpa com tópicos para clareza visual.
3. Termine sempre cada intervenção com uma pergunta socrática provocativa ou um mini-desafio para o aluno exercitar a evocação ativa (Active Recall).`;

      const contents = messages.map((m: any) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await generateContentWithRetry(ai, {
        contents,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        reply: response.text || 'Entendi sua dúvida. Como você explicaria o primeiro passo para resolver isso?',
      });
    } catch (err: any) {
      console.error('Erro no Tutor IA:', err);
      return res.status(500).json({ error: err.message || 'Erro ao processar tutoria com Gemini.' });
    }
  });

  // 1. Feynman Technique Evaluator
  app.post('/api/gemini/feynman-evaluate', async (req, res) => {
    try {
      const { topic, explanation, targetAudience = 'criança de 10 anos' } = req.body;
      if (!topic || !explanation) {
        return res.status(400).json({ error: 'Tópico e explicação são obrigatórios.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'Chave GEMINI_API_KEY não configurada no servidor. Verifique o painel Secrets.',
        });
      }

      const prompt = `Você é um tutor especialista na Técnica Feynman de aprendizado acelerado.
O estudante está tentando explicar o seguinte tópico com suas próprias palavras para uma "${targetAudience}".

Tópico: "${topic}"
Explicação do estudante:
"${explanation}"

Avalie com rigor científico e empatia pedagógica:
1. Uma pontuação de clareza de 0 a 100.
2. Pontos fortes da explicação do estudante.
3. Lacunas de conhecimento, termos excessivamente técnicos/jargões ou imprecisões conceituais identificadas.
4. Uma explicação ultra didática e simplificada do mesmo conceito usando a regra de ouro de Feynman (sem jargões, intuitiva).
5. Uma analogia do mundo real marcante e inesquecível.
6. 3 perguntas reflexivas para o estudante aprofundar seu entendimento.

Responda em formato JSON estrito conforme o schema. Responda em Português.`;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: 'Nota de clareza de 0 a 100' },
              verdict: { type: Type.STRING, description: 'Frase resumida do diagnóstico' },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Pontos positivos da explicação',
              },
              gapsAndJargon: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lacunas conceituais e jargões a simplificar',
              },
              feynmanSimplified: {
                type: Type.STRING,
                description: 'Explicação didática simplificada sem jargões',
              },
              memorableAnalogy: {
                type: Type.STRING,
                description: 'Analogia memorável do dia a dia',
              },
              reflectiveQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 perguntas para testar a retenção profunda',
              },
            },
            required: ['score', 'verdict', 'strengths', 'gapsAndJargon', 'feynmanSimplified', 'memorableAnalogy', 'reflectiveQuestions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Erro na avaliação Feynman:', err);
      return res.status(500).json({ error: err.message || 'Falha ao processar com Gemini.' });
    }
  });

  // 2. Flashcards Generator
  app.post('/api/gemini/generate-flashcards', async (req, res) => {
    try {
      const { topic, text = '', count = 6, difficulty = 'médio' } = req.body;
      if (!topic && !text) {
        return res.status(400).json({ error: 'Informe um tópico ou texto base para os flashcards.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: 'Chave GEMINI_API_KEY não configurada.' });
      }

      const prompt = `Gere exatamente ${count} flashcards de alta qualidade para memorização ativa (Active Recall) e Repetição Espaçada sobre o tema "${topic || 'Texto fornecido'}".
Dificuldade desejada: ${difficulty}.
${text ? `Texto de referência fornecido pelo estudante:\n"""${text}"""` : ''}

Diretrizes para flashcards eficazes:
- Pergunta objetiva, instigante e focada em um único fato ou mecanismo.
- Resposta concisa e direta, destacando o cerne do conceito.
- Uma dica mnemônica inteligente ou gatilho mental para facilitar a memorização.
- Uma categoria/subtópico.

Responda em JSON em Português.`;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: 'Pergunta ou estímulo do flashcard' },
                answer: { type: Type.STRING, description: 'Resposta explicativa e direta' },
                category: { type: Type.STRING, description: 'Subcategoria do tema' },
                mnemonicHint: { type: Type.STRING, description: 'Dica mnemônica ou gatilho visual' },
              },
              required: ['question', 'answer', 'category', 'mnemonicHint'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ flashcards: parsed });
    } catch (err: any) {
      console.error('Erro gerando flashcards:', err);
      return res.status(500).json({ error: err.message || 'Erro ao gerar flashcards.' });
    }
  });

  // 3. Quiz & Simulado Generator
  app.post('/api/gemini/generate-quiz', async (req, res) => {
    try {
      const { topic, count = 5, level = 'intermediário' } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Tópico do simulado é obrigatório.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: 'Chave GEMINI_API_KEY não configurada.' });
      }

      const prompt = `Crie um simulado com ${count} questões de múltipla escolha inéditas e de alto padrão (estilo vestibulares/concursos/exames técnicos) sobre "${topic}".
Nível: ${level}.
Cada questão deve ter exatamente 4 opções de resposta (A, B, C, D).
Apenas uma deve ser a correta.
Forneça a explicação detalhada do porquê a alternativa correta é a certa e o erro conceitual das opções falsas mais comuns.

Responda estritamente em JSON no schema solicitado em Português.`;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: 'Enunciado da questão' },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Quatro alternativas de resposta',
                },
                correctIndex: { type: Type.INTEGER, description: 'Índice de 0 a 3 da alternativa correta' },
                explanation: { type: Type.STRING, description: 'Justificativa didática completa' },
                keyConcept: { type: Type.STRING, description: 'Conceito teórico central avaliado' },
              },
              required: ['question', 'options', 'correctIndex', 'explanation', 'keyConcept'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ questions: parsed });
    } catch (err: any) {
      console.error('Erro ao gerar quiz:', err);
      return res.status(500).json({ error: err.message || 'Erro ao gerar simulado.' });
    }
  });

  // 4. Cornell Note Summarizer
  app.post('/api/gemini/summarize-cornell', async (req, res) => {
    try {
      const { rawNotes, topic } = req.body;
      if (!rawNotes) {
        return res.status(400).json({ error: 'As notas brutas são necessárias.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: 'Chave GEMINI_API_KEY não configurada.' });
      }

      const prompt = `Transforme as anotações brutas a seguir no formato do consagrado Método Cornell de anotações eficientes.
Tópico: "${topic || 'Anotação de Estudo'}"
Notas brutas:
"""${rawNotes}"""

Gere:
1. "cues": Lista de palavras-chave, pistas de memória e perguntas de gatilho para a coluna esquerda.
2. "notes": Notas organizadas, hierárquicas e limpas com tópicos com marcadores.
3. "summary": Um resumo executivo denso de 2 a 3 frases no rodapé.
4. "actionItems": 2 a 4 ações práticas de fixação ou exercícios recomendados.

Responda em formato JSON em Português.`;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              cues: { type: Type.ARRAY, items: { type: Type.STRING } },
              notes: { type: Type.STRING },
              summary: { type: Type.STRING },
              actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['topic', 'cues', 'notes', 'summary', 'actionItems'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Erro na sumarização Cornell:', err);
      return res.status(500).json({ error: err.message || 'Erro ao processar anotações.' });
    }
  });

  // 5. Intelligent Study Plan
  app.post('/api/gemini/study-plan', async (req, res) => {
    try {
      const { subject, daysAvailable = 30, hoursPerDay = 2, currentLevel = 'Iniciante', goal = 'Dominar para exame' } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: 'Chave GEMINI_API_KEY não configurada.' });
      }

      const prompt = `Crie um cronograma estratégico de estudos baseado em Repetição Espaçada e Prática Intercalada.
Disciplina/Objetivo: "${subject}"
Dias disponíveis: ${daysAvailable} dias
Horas por dia: ${hoursPerDay}h
Nível atual: ${currentLevel}
Meta: ${goal}

Estruture um cronograma faseado em 4 semanas ou blocos, com marcos de revisão espaçada e técnicas ativas. Responda em JSON em Português.`;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING, description: 'Estratégia geral' },
              totalHoursEstimated: { type: Type.INTEGER },
              phases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseName: { type: Type.STRING },
                    focus: { type: Type.STRING },
                    weeklyMilestone: { type: Type.STRING },
                    recommendedTechnique: { type: Type.STRING },
                    keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['phaseName', 'focus', 'weeklyMilestone', 'recommendedTechnique', 'keyTopics'],
                },
              },
              topStudyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['overview', 'totalHoursEstimated', 'phases', 'topStudyTips'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Erro ao gerar plano:', err);
      return res.status(500).json({ error: err.message || 'Erro ao gerar plano de estudos.' });
    }
  });

  // Frontend Serving (Vite middleware in dev, dist in prod)
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor OmniStudy rodando em http://localhost:${PORT} (Modo: ${isProd ? 'Produção' : 'Desenvolvimento'})`);
  });
}

startServer().catch((err) => {
  console.error('Erro crítico ao iniciar servidor:', err);
  process.exit(1);
});
