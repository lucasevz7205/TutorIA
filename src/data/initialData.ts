import { Deck, ImprovementProposal, CornellNote, QuizQuestion, StudyStats } from '../types';

export const initialProposals: ImprovementProposal[] = [
  {
    id: 'tutor-ai',
    title: 'Tutor Socrático Conversacional de Aprendizagem Ativa',
    category: 'AI & Gemini',
    description: 'Mentor conversacional inteligente que não entrega respostas prontas, mas guia o raciocínio com perguntas reflexivas, analogias e checagem de premissas.',
    impact: 'Transformador',
    status: 'Implementado no App',
    details: [
      'Multi-turn conversacional com contexto pedagógico contínuo',
      '4 modos adaptativos: Socrático, Simplificador Feynman, Exame/Concurso e Desafio',
      'Sugestões rápidas de prompts para desbloqueio cognitivo',
      'Alinhado à especificação de agentes Antigravity'
    ]
  },
  {
    id: 'feynman-ai',
    title: 'Diagnóstico Conceitual Método Feynman com IA',
    category: 'AI & Gemini',
    description: 'Diagnóstico cognitivo em tempo real da explicação do aluno. A IA pontua a clareza, detecta termos vazios/jargões e gera analogias práticas personalizadas.',
    impact: 'Transformador',
    status: 'Implementado no App',
    details: [
      'Análise de complexidade lexical e didática',
      'Detecção automática de "ilusão de competência"',
      'Geração de analogias do cotidiano para fixar conceitos abstratos',
      'Perguntas reflexivas socráticas de acompanhamento'
    ]
  },
  {
    id: 'spaced-repetition',
    title: 'Repetição Espaçada Inteligente (Algoritmo SRS)',
    category: 'Cognitive',
    description: 'Agendamento de revisões baseado na curva do esquecimento de Ebbinghaus e intervalos adaptativos com base na facilidade de evocação (Active Recall).',
    impact: 'Transformador',
    status: 'Implementado no App',
    details: [
      'Classificação em 4 níveis: Errei (1 dia), Difícil (3 dias), Bom (7 dias), Fácil (14 dias)',
      'Flip 3D dinâmico com dicas mnemônicas e gatilhos mentais',
      'Gerador automático de baralhos completos a partir de PDFs, artigos ou temas livres via Gemini 3.8 Flash'
    ]
  },
  {
    id: 'quiz-generator',
    title: 'Gerador Instantâneo de Simulados & Provas',
    category: 'AI & Gemini',
    description: 'Geração sob demanda de questões inéditas de múltipla escolha com distratores pedagogicamente calibrados e justificativa teórica por alternativa.',
    impact: 'Muito Alto',
    status: 'Implementado no App',
    details: [
      'Geração de 4 alternativas com apenas 1 correta',
      'Feedback explicativo instantâneo pós-resposta',
      'Marcação de conceitos teóricos fundamentais para reforço posterior'
    ]
  },
  {
    id: 'cornell-summarizer',
    title: 'Caderno Estruturado Método Cornell',
    category: 'Cognitive',
    description: 'Separação consagrada entre anotações de aula, pistas de recuperação na coluna lateral e síntese executiva no rodapé, com transformação de rascunhos por IA.',
    impact: 'Alto',
    status: 'Implementado no App',
    details: [
      'Organização automática de notas desordenadas em tópicos limpos',
      'Extração de pistas de teste (Cues) para revisão ativa',
      'Lista de próximos passos práticos de estudo'
    ]
  },
  {
    id: 'binaural-pomodoro',
    title: 'Pomodoro de Foco Profundo com Áudio Procedural',
    category: 'Productivity',
    description: 'Temporizador de ciclos de foco (25/5 min) sincronizado com gerador de áudio sintetizado em tempo real no navegador (chuva, ruído branco e ondas alfa) sem ruídos de anúncios.',
    impact: 'Muito Alto',
    status: 'Implementado no App',
    details: [
      'Sintetizador Web Audio API puro, sem requisições de MP3 externas',
      'Sinos harmônicos suaves no término de cada ciclo',
      'Controle integrado de tarefas e metas imediatas da sessão'
    ]
  },
  {
    id: 'gamification-retention',
    title: 'Painel de Retenção & Análise da Curva do Esquecimento',
    category: 'UX & Mobile',
    description: 'Métricas visuais de constância: sequência diária (streak), projeção da retenção ao longo do tempo e tópicos dominados vs. tópicos em zona de risco.',
    impact: 'Alto',
    status: 'Implementado no App',
    details: [
      'Cálculo visual de probabilidade de retenção de memória',
      'Registro diário de minutos de foco acumulados',
      'Alerta de cartões prontos para revisão hoje'
    ]
  },
  {
    id: 'multimodal-vision',
    title: 'Processamento Multimodal de Imagens & Questões (Foto da Lousa/Livro)',
    category: 'AI & Gemini',
    description: 'Capacidade do Gemini de receber fotos tiradas da câmera (exercícios de matemática, esquemas visuais, páginas de apostilas) e convertê-los em flashcards e explicações.',
    impact: 'Transformador',
    status: 'Pronto para Ativar',
    details: [
      'OCR e compreensão conceitual direta de esquemas e fórmulas manuscritas',
      'Geração de perguntas específicas baseadas na foto enviada'
    ]
  },
  {
    id: 'audio-voice-tutor',
    title: 'Tutor de Voz em Tempo Real (Live API Gemini)',
    category: 'AI & Gemini',
    description: 'Conversação falada bidirecional com baixa latência usando a Live API, onde o aluno conversa e debate matérias como se estivesse com um professor particular.',
    impact: 'Transformador',
    status: 'Planejado',
    details: [
      'Streaming bidirecional de áudio com interrupção natural',
      'Treinamento para arguições orais e bancas de concurso'
    ]
  }
];

export const initialDecks: Deck[] = [
  {
    id: 'deck-neuro',
    title: 'Neurociência & Aprendizado Acelerado',
    category: 'Ciência Cognitiva',
    description: 'Como o cérebro consolida memórias, combate o esquecimento e ativa o modo difuso.',
    color: 'from-violet-600 to-indigo-600',
    cards: [
      {
        id: 'card-1',
        question: 'O que caracteriza a Curva do Esquecimento de Hermann Ebbinghaus?',
        answer: 'Mostra que perdemos até 70% das informações novas nas primeiras 24 horas caso não ocorram revisões ativas espaçadas.',
        category: 'Memória',
        mnemonicHint: 'Lembre-se: sem revisão, a memória desaba como um tobogã no primeiro dia.',
        difficulty: 'good',
        reviewsCount: 3,
        nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      },
      {
        id: 'card-2',
        question: 'Qual a diferença entre Modo Focado e Modo Difuso descrita pela Dra. Barbara Oakley?',
        answer: 'O Modo Focado concentra atenção concentrada em caminhos neurais conhecidos. O Modo Difuso permite conexões relaxadas e criativas entre áreas distantes do cérebro.',
        category: 'Foco Mental',
        mnemonicHint: 'Lanterna de facho estreito (Focado) vs. Luz de teto que ilumina o quarto todo (Difuso).',
        difficulty: 'easy',
        reviewsCount: 5,
        nextReviewDate: new Date(Date.now() + 86400000 * 6).toISOString(),
      },
      {
        id: 'card-3',
        question: 'Por que o "Active Recall" (evocação ativa) supera a releitura passiva em testes de retenção a longo prazo?',
        answer: 'Porque forçar o cérebro a recuperar a informação do zero fortalece a bainha de mielina e os circuitos sinápticos, transformando a memória de trabalho em memória de longo prazo.',
        category: 'Técnicas de Estudo',
        mnemonicHint: 'Ler é como ver alguém fazer musculação; evocar é levantar o peso você mesmo.',
        difficulty: 'good',
        reviewsCount: 2,
        nextReviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      },
      {
        id: 'card-4',
        question: 'O que é o efeito de Prática Intercalada (Interleaving)?',
        answer: 'Alternar entre matérias ou tipos diferentes de problemas na mesma sessão, forçando o cérebro a identificar qual estratégia usar, ao invés de repetir cegamente um único padrão.',
        category: 'Metodologia',
        mnemonicHint: 'Em vez de chutar 50 pênaltis seguidos, treine passe, cabeceio e drible alternados.',
        difficulty: 'hard',
        reviewsCount: 1,
        nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
      }
    ]
  },
  {
    id: 'deck-tech',
    title: 'Arquitetura de Software & Algoritmos',
    category: 'Engenharia de Software',
    description: 'Complexidade de tempo, princípios SOLID, padrões distribuídos e bancos de dados.',
    color: 'from-cyan-600 to-blue-600',
    cards: [
      {
        id: 'card-t1',
        question: 'O que significa a complexidade O(log n) em termos práticos?',
        answer: 'Significa que o tempo de execução cresce proporcionalmente ao logaritmo do número de itens. Dobrar a base de dados adiciona apenas uma operação a mais (ex: Busca Binária).',
        category: 'Big-O',
        mnemonicHint: 'Corta a lista ao meio a cada passo, como procurar uma palavra no dicionário.',
        difficulty: 'good',
        reviewsCount: 4,
        nextReviewDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      },
      {
        id: 'card-t2',
        question: 'Qual é o princípio de Inversão de Dependência (D do SOLID)?',
        answer: 'Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações/interfaces. Abstrações não dependem de detalhes.',
        category: 'SOLID',
        mnemonicHint: 'Você não solda o cabo da lâmpada direto na fiação da parede; usa uma tomada padronizada.',
        difficulty: 'hard',
        reviewsCount: 2,
        nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
      }
    ]
  }
];

export const initialQuizzes: QuizQuestion[] = [
  {
    id: 'quiz-1',
    question: 'Qual dos métodos abaixo comprovadamente produz a maior taxa de retenção de memória a longo prazo segundo experimentos de psicologia cognitiva?',
    options: [
      'Releitura sublinhada com marca-texto colorido',
      'Testagem prática frequente com evocação ativa (Testing Effect)',
      'Resumo corrido de páginas inteiras durante a aula',
      'Leitura auditiva repetida sem pausas'
    ],
    correctIndex: 1,
    explanation: 'Estudos de Roediger & Karpicke (2006) demonstraram que testes de recuperação ativa produzem até 3x mais retenção duradoura do que múltiplas sessões de releitura e marcação.',
    keyConcept: 'Testing Effect & Active Recall'
  },
  {
    id: 'quiz-2',
    question: 'Na Técnica Feynman de aprendizado, qual é o sinal clássico de que você realmente domina um conteúdo?',
    options: [
      'Conseguir citar termos técnicos e jargões formais sem hesitação',
      'Explicar o conceito para uma criança de 10 anos usando analogias simples e linguagem comum',
      'Ter decorado todas as fórmulas e definições do livro',
      'Escrever um texto de mais de 10 páginas sobre o assunto'
    ],
    correctIndex: 1,
    explanation: 'Richard Feynman defendia que se você não consegue explicar um tópico de forma simples sem recorrer a jargões complicados, você não entendeu verdadeiramente o núcleo do conceito.',
    keyConcept: 'Técnica Feynman & Clareza Conceitual'
  },
  {
    id: 'quiz-3',
    question: 'Qual é o principal propósito da coluna esquerda (Cues / Pistas) no Método Cornell de anotações?',
    options: [
      'Servir de rascunho para desenhos livres e rabiscos',
      'Conter perguntas reflexivas e palavras-chave para autoavaliação com a folha dobrada',
      'Anotar a bibliografia completa e números de página',
      'Registrar o horário exato de cada anotação'
    ],
    correctIndex: 1,
    explanation: 'Ao dobrar a folha cobrindo o bloco principal, o estudante olha apenas as pistas e perguntas da esquerda para testar se consegue evocar as respostas mentalmente.',
    keyConcept: 'Método Cornell & Estrutura de Revisão'
  }
];

export const initialNotes: CornellNote[] = [
  {
    id: 'note-1',
    title: 'Pilares da Consolidação de Memória de Longo Prazo',
    subject: 'Neurociência',
    date: 'Hoje',
    cues: [
      'Papel do sono REM e NREM na fixação',
      'Por que a releitura causa ilusão de ótica mental?',
      'Qual o intervalo ideal para a 1ª revisão?'
    ],
    notes: `• O cérebro faz a triagem das informações diárias durante o sono profundo (ondas lentas), transferindo dados do hipocampo para o córtex frontal.
• Releitura passiva ativa apenas o reconhecimento (familiaridade visual), criando a "ilusão de competência" (pensar que sabe porque o texto parece familiar).
• A primeira revisão deve ocorrer entre 12h e 24h após o primeiro contato, pois é o período de maior queda na curva de Ebbinghaus.
• A prática intercalada reduz o piloto automático do cérebro e melhora o julgamento de estratégias.`,
    summary: 'A consolidação efetiva exige teste ativo antes de 24h e sono reparador. Releitura apenas engana o cérebro com falsa sensação de familiaridade.',
    actionItems: [
      'Criar 5 flashcards sobre o mecanismo do hipocampo',
      'Realizar uma sessão de 25 min com Pomodoro antes de dormir',
      'Testar explicação Feynman sobre plasticidade sináptica'
    ]
  }
];

export const initialStats: StudyStats = {
  streakDays: 7,
  totalFocusMinutes: 480,
  cardsReviewedToday: 14,
  totalCardsReviewed: 168,
  quizzesCompleted: 12,
  averageQuizScore: 88,
  feynmanSessionsCount: 5
};
