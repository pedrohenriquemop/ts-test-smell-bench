# ts-test-smell-bench

**ts-test-smell-bench** é uma ferramenta CLI avançada projetada para minerar, preparar, analisar e avaliar testes em TypeScript. O objetivo principal é automatizar a detecção de *test smells* utilizando modelos de linguagem (LLMs), permitindo a comparação e o benchmarking entre diferentes provedores (como Ollama local e Google Gemini).

---

## 🚀 Guia Rápido (Quick Start)

### 1. Instalação
O projeto utiliza Node.js e requer a instalação das dependências via NPM. O executor padrão é o `tsx` (substituto moderno do `ts-node`).

```sh
npm install
```

### 2. Configuração de Ambiente
Para buscar repositórios no GitHub (Mineração) ou utilizar o Google Gemini, configure suas chaves de API:

```sh
cp .env.example .env
```
Edite o arquivo `.env`:
- `GITHUB_TOKEN`: Necessário para o comando `mine` não esbarrar nos limites de taxa (rate limits) da API do GitHub.
- `GEMINI_API_KEY`: Necessário se você quiser usar o modelo Gemini. (Obtenha em [Google AI Studio](https://aistudio.google.com/apikey)).

### 3. Executando o Pipeline (TUI)
A maneira mais fácil de usar a ferramenta é através da Interface de Terminal (TUI) interativa:

```sh
./bench tui
```
Na TUI, você pode:
- Selecionar quais modelos (ex: Llama3, Gemini) você quer rodar.
- Selecionar quais etapas do pipeline (Mine, Prepare, Analyze, Evaluate) serão executadas.
- Acompanhar os logs de execução e ver os resultados (F1-Score) ao final.

---

## 🏗️ O Pipeline de 4 Etapas

A arquitetura do projeto foi dividida em 4 etapas lógicas que podem ser executadas juntas (via `tui` ou `run`) ou separadamente.

### 1. Mine (Mineração)
Busca repositórios populares em TypeScript no GitHub e procura por arquivos de teste (`.test.ts`, `.spec.ts`).
- **O que faz:** Extrai cada bloco `it()` ou `test()` individualmente.
- **Contexto Avançado:** Também extrai os imports do arquivo e as declarações/hooks (`beforeEach`, `beforeAll`) do bloco `describe` pai, fornecendo contexto vital para o LLM entender *smells* como *Mystery Guest* ou *General Fixture*.
- **Saída:** Arquivos TypeScript individuais no diretório `tests/` e um `manifesto_tests.json` com métricas estáticas de AST (quantidade de asserts, linhas, variáveis de setup, etc).

### 2. Prepare (Preparação do Dataset)
Fatia os testes minerados em lotes menores para facilitar a criação manual de um *Goldset* (gabarito).
- **Saída:** Amostras organizadas no diretório configurado (ex: `out/dataset/`).

### 3. Analyze (Análise com LLMs)
A etapa principal. Injeta os testes (com seu contexto completo e métricas AST) no *system prompt* configurado e envia para o(s) LLM(s).
- O *prompt* é **montado dinamicamente** baseado nos *smells* que você habilitou no arquivo de configuração.
- Suporta múltiplos modelos em sequência.

### 4. Evaluate (Avaliação)
Compara os *smells* detectados pelos LLMs contra os *smells* reais presentes no arquivo de referência (Goldset).
- **Saída:** Gera métricas detalhadas (Verdadeiros Positivos, Falsos Negativos, Recall, Precision e F1-Score).
- Gera relatórios HTML interativos e gráficos em PNG (Bar Chart e Radar Chart).
- Cria um `cross_model_summary.json` comparando o F1-Score de todos os modelos testados lado a lado.

---

## ⚙️ Guia de Configuração

O comportamento inteiro do bench é ditado pelo arquivo `ts-test-smell-bench.config.json`. 

### Exemplo Completo de Configuração

```json
{
  "miner": {
    "minStars": 200,             // Filtra repositórios com menos de 200 estrelas
    "language": "typescript",
    "maxRepos": 100,
    "maxFilesPerRepo": 100,
    "globalFileLimit": 1000,     // Para a mineração após 1000 testes extraídos
    "cooldownMs": 500,           // Pausa entre requisições ao GitHub
    "outputDir": "./tests",
    "heuristics": {
      "minLines": 10,            // Descarta testes com menos de 10 linhas
      "minAssertions": 0
    }
  },
  "dataset": {
    "sampleSize": 50,            // Tamanho do lote de preparação
    "outputDir": "./out/dataset",
    "manifestPath": "./manifesto_tests.json"
  },
  "models": [
    {
      "id": "llama3-local",
      "provider": "ollama",
      "model": "llama3",
      "baseUrl": "http://localhost:11434/api/generate",
      "temperature": 0.0
    },
    {
      "id": "gemini-flash",
      "provider": "gemini",
      "model": "gemini-2.5-flash-preview-04-17",
      "apiKey": "$GEMINI_API_KEY", // Lê da variável de ambiente no .env
      "temperature": 0.0
    }
  ],
  "smells": {
    "enabled": [
      "assertion-roulette",
      "conditional-test-logic",
      "eager-test",
      "mystery-guest",
      "resource-optimism",
      "general-fixture",
      "hardcoded-literal",
      "magic-number"
    ]
  },
  "analyzer": {
    "numTests": 50,                             // Quantos testes do manifesto processar
    "manifestPath": "./manifesto_tests.json",
    "testsDir": "./tests",
    "referenceResultsPath": "./goldset/run.txt", // Onde está o seu Goldset (gabarito)
    "outputDir": "./out/analysis"                // Destino dos resultados e gráficos
  }
}
```

### Provedores Suportados (Models)
A lista `"models"` suporta diferentes provedores de IA:
1. **Ollama**: Requer que você tenha o Ollama rodando localmente (ex: `ollama run llama3`). Informe a URL base.
2. **Gemini**: Utiliza a API REST oficial do Google AI Studio. Certifique-se de referenciar a chave de API (ex: `"$GEMINI_API_KEY"`).

---

## 🧬 Catálogo de Test Smells

Os LLMs são instruídos apenas sobre os *smells* listados no array `"smells.enabled"`. Atualmente, o sistema suporta:

1. `assertion-roulette`: Múltiplos asserts sem mensagens de falha descritivas.
2. `conditional-test-logic`: Uso de controle de fluxo (if, switch, for) dentro de um teste.
3. `eager-test`: O teste verifica funcionalidades demais ao mesmo tempo.
4. `mystery-guest`: O teste depende de recursos externos ocultos (arquivos, DBs) não definidos no setup.
5. `resource-optimism`: O teste lida com IO externo presumindo que sempre estará disponível.
6. `general-fixture`: O setup inicializa muitas variáveis, mas o teste usa apenas algumas.
7. `hardcoded-literal`: Uso de literais mágicas dentro da lógica do teste.
8. `magic-number`: Uso de números não explicados ao invés de constantes.

---

## 💻 CLI Headless (Modo Comando)

Se você preferir rodar a ferramenta em scripts CI/CD ou não quiser usar a interface TUI, pode invocar os comandos individuais. Todos os comandos aceitam a flag `-c` ou `--config` para apontar para um arquivo JSON diferente.

### Orquestrador Completo
```sh
./bench run [opções]
```
**Opções:**
- `--skip-mine`, `--skip-prepare`, `--skip-analyze`, `--skip-evaluate`: Pula a etapa correspondente.
- `-m, --models <ids...>`: Roda apenas modelos específicos da config (ex: `./bench run -m gemini-flash`).

### Comandos Individuais
```sh
# Apenas baixar e extrair testes do GitHub
./bench mine --output ./minha_pasta_testes

# Apenas criar lotes do dataset
./bench prepare --sample-size 100

# Rodar a análise com LLM (utiliza a config para saber qual modelo)
./bench analyze

# Gerar gráficos HTML/PNG baseados na última análise
./bench evaluate
```

---

## 📂 Estrutura de Saída (Output)

Após uma execução completa do pipeline, a pasta de saída (configurada em `analyzer.outputDir`) conterá:

- `comparison_results_v[ID_DO_MODELO].json`: Os *smells* detectados e a justificativa exata retornada pelo LLM.
- `evaluation_metrics_v[ID_DO_MODELO].json`: A matriz de confusão e métricas em formato JSON.
- `report_v[ID_DO_MODELO].html`: Dashboard visual para análise humana.
- `metrics_bar_chart_v[ID_DO_MODELO].png` e `metrics_radar_chart_...`: Gráficos exportados automaticamente para uso em artigos ou apresentações acadêmicas.
- `cross_model_summary.json`: Um sumário caso múltiplos modelos tenham sido executados, lado a lado.
