# 🛸 OmniStudy AI — Blueprint de Integração & Matriz para Antigravity Agent

Este documento serve como especificação técnica executável para o **Antigravity Agent** (`antigravity-preview-09-2026`) aplicar melhorias contínuas, testes automatizados e evolução da plataforma de estudo ativo.

---

## 1. Visão Geral da Arquitetura

* **Runtime**: Node.js (Express full-stack) + React 19 + TypeScript 7.
* **Server Entry Point**: `/server.ts` executado via `tsx` (porta 3000).
* **Vite Dev Server**: Montado via `vite.middlewares` no Express em modo SPA.
* **Motor Cognitivo de IA**: Google Gemini SDK (`@google/genai` >= 2.4.0) rodando exclusivamente no servidor (proteção de chaves).
* **Áudio Procedural**: Web Audio API nativo (`/src/services/sound.ts`) sintetizando ruído branco, chuva e ondas alfa sem arquivos externos.

---

## 2. Matriz de Prospectivas & Instruções para Antigravity

A tabela abaixo descreve as melhorias, sua fundamentação cognitiva e o script de execução para o Antigravity implementar:

```json
{
  "system_target": "OmniStudy AI - Active Learning Platform",
  "version": "2.0.0",
  "antigravity_tasks": [
    {
      "id": "TASK-01",
      "name": "Tutor Socrático Conversacional com Histórico",
      "priority": "P0 - Core",
      "status": "IMPLEMENTED",
      "endpoint": "/api/gemini/tutor-chat",
      "cognitive_model": "Socratic Method & Guided Inquiry",
      "instructions_for_antigravity": "Orquestrar sessões multi-turn onde o modelo não entrega respostas mastigadas. Usa prompts socráticos para guiar a auto-descoberta."
    },
    {
      "id": "TASK-02",
      "name": "Avaliação Feynman de Compreensão Conceitual",
      "priority": "P0 - Core",
      "status": "IMPLEMENTED",
      "endpoint": "/api/gemini/feynman-evaluate",
      "cognitive_model": "Richard Feynman 4-Step Technique",
      "instructions_for_antigravity": "Recebe o texto com as palavras do aluno, gera nota 0-100, detecta jargões desnecessários e gera analogia do dia a dia."
    },
    {
      "id": "TASK-03",
      "name": "Algoritmo de Repetição Espaçada (SRS / SM-2)",
      "priority": "P0 - Core",
      "status": "IMPLEMENTED",
      "endpoint": "/api/gemini/generate-flashcards",
      "cognitive_model": "Ebbinghaus Forgetting Curve & Active Recall",
      "instructions_for_antigravity": "Gera baralhos estruturados com pergunta, resposta concisa e dica mnemônica visual."
    },
    {
      "id": "TASK-04",
      "name": "Caderno Hierárquico Método Cornell",
      "priority": "P1 - High",
      "status": "IMPLEMENTED",
      "endpoint": "/api/gemini/summarize-cornell",
      "cognitive_model": "Cornell University 3-Zone Note Taking",
      "instructions_for_antigravity": "Transforma anotações desorganizadas em Cues (pistas), Notes (tópicos limpos) e Summary (resumo executivo)."
    },
    {
      "id": "TASK-05",
      "name": "Pomodoro com Síntese Procedural Web Audio",
      "priority": "P1 - High",
      "status": "IMPLEMENTED",
      "cognitive_model": "Ultradian Rhythm (25/5/15) & Alpha Wave Focus",
      "instructions_for_antigravity": "Gera sons de chuva, ondas alfa (10Hz de diferença estéreo) e ruído branco nativamente no navegador."
    },
    {
      "id": "TASK-06",
      "name": "Visão Multimodal para Fotos de Cadernos & Lousa",
      "priority": "P2 - Next Step",
      "status": "READY_TO_ACTIVATE",
      "target_model": "gemini-3.8-flash",
      "instructions_for_antigravity": "Adicionar rota /api/gemini/multimodal-scan aceitando base64 de imagem para digitalizar exercícios e gráficos manuscritos."
    },
    {
      "id": "TASK-07",
      "name": "Arguição por Voz em Tempo Real (Gemini Live API)",
      "priority": "P3 - Advanced",
      "status": "PLANNED",
      "target_model": "gemini-3.8-live",
      "instructions_for_antigravity": "Implementar WebSocket bridge para streaming PCM 16kHz/24kHz e simular banca oral com o estudante."
    }
  ]
}
```

---

## 3. Endpoints e Contratos de API da Aplicação

### 1. `POST /api/gemini/tutor-chat`
* **Entrada**:
  ```json
  {
    "messages": [
      { "role": "user", "text": "O que é o Teorema de Bayes?" }
    ],
    "mode": "socratic | exam | simple | challenge",
    "subject": "Probabilidade e Estatística"
  }
  ```
* **Retorno**:
  ```json
  {
    "reply": "Texto formatado em markdown com pergunta reflexiva ao final."
  }
  ```

### 2. `POST /api/gemini/feynman-evaluate`
* **Entrada**:
  ```json
  {
    "topic": "Fotossíntese",
    "explanation": "Plantas transformam luz em glicose.",
    "targetAudience": "uma criança curiosa de 10 anos"
  }
  ```
* **Retorno**:
  ```json
  {
    "score": 85,
    "verdict": "Boa síntese, faltou citar o oxigênio.",
    "strengths": ["Objetivo"],
    "gapsAndJargon": ["Faltou explicar a clorofila"],
    "feynmanSimplified": "A planta é uma fábrica...",
    "memorableAnalogy": "Cozinhar com luz solar",
    "reflectiveQuestions": ["O que acontece à noite?"]
  }
  ```

### 3. `POST /api/gemini/generate-flashcards`
* **Entrada**:
  ```json
  {
    "topic": "Direito Constitucional",
    "text": "Art. 5º da CF...",
    "count": 6,
    "difficulty": "médio"
  }
  ```
* **Retorno**:
  ```json
  {
    "flashcards": [
      {
        "question": "O que é o princípio da isonomia?",
        "answer": "Tratar igualmente os iguais e desigualmente os desiguais...",
        "category": "Direitos Fundamentais",
        "mnemonicHint": "Balança da justiça balanceada"
      }
    ]
  }
  ```

---

## 4. Como Executar no Antigravity Agent

No ambiente do Antigravity, execute:
1. Instalação e verificação de dependências:
   ```bash
   npm run build
   ```
2. Inicialização do servidor full-stack:
   ```bash
   npm run dev
   ```
3. Teste do health-check:
   ```bash
   curl http://localhost:3000/api/health
   ```
