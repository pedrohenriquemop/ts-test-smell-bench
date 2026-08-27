# Gap Analysis & Implementation Plan — Research Phases vs Current Bench

## Coverage Assessment

### Fase 1 — Escala Taxonômica e Automação Base ✅ FULLY COVERED

| Requirement                                    | Status | Implementation                                                                                                                                                                                  |
| ---------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Refatoração arquitetural → pipeline end-to-end | ✅     | `src/pipeline/index.ts`, `./bench run`, `./bench tui`                                                                                                                                           |
| ts-morph: novas métricas complementares da AST | ✅     | `importCount`, `setupHookCount`, `beforeEachVarCount`, `externalModuleRefs` in [metric.registry.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/metrics/metric.registry.ts) |
| Novos padrões de Test Smells no pool           | ✅     | 8-smell catalog in [catalog.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/smells/catalog.ts) with dynamic prompt generation                                               |

---

### Fase 2 — Curadoria e Consolidação do Oráculo ⚠️ PARTIALLY COVERED

| Requirement                                    | Status | Gap                                                                                                   |
| ---------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| Submetida a múltiplas LLMs comerciais          | ✅     | Multi-model pipeline (Ollama + Gemini) exists                                                         |
| Estratégia de consenso / votação majoritária   | ❌     | **No consensus module.** Results are stored per-model but never voted on to produce a refined goldset |
| Filtros de alucinação (corrigindo FP/omissões) | ❌     | Same as above — needs a "consensus goldset builder"                                                   |

---

### Fase 3 — Maximização de Contexto ⚠️ PARTIALLY COVERED

| Requirement                                | Status | Gap                                                                                                                                                                   |
| ------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Injetar resumos de arquivos globais        | ✅     | Imports + describe context + setup variables injected into prompt                                                                                                     |
| Chain-of-Thought (CoT) prompting           | ❌     | **Current prompt has a 2-step structure but is NOT true CoT.** No config option to switch strategies. No explicit "reason step by step about async flows" instruction |
| Forçar raciocínio sobre fluxos assíncronos | ❌     | Covered by CoT implementation                                                                                                                                         |

---

### Fase 4 — Ablação e Diversificação ❌ NOT COVERED

| Requirement                                     | Status     | Gap                                                                                                                   |
| ----------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Estudo de Ablação (AST vs modelo não instruído) | ❌         | **No way to toggle off AST metadata or context injection.** Pipeline always sends everything                          |
| Replicar para outros SLMs                       | ✅         | Multi-model config already supports adding any Ollama model                                                           |
| Mensurar latência e generalização               | ✅ Partial | Latency tracked per-response, but **no cross-setup comparison tool** to overlay results from different configurations |

---

## Proposed Changes

Three blocks of work remain. They are relatively self-contained and build on the existing architecture without needing refactors.

---

### Phase A — Prompt Strategy System + Ablation Toggles

This is the highest-impact gap: the ability to switch between prompt strategies (Standard vs CoT) and to toggle AST/context injection on or off via config. This directly serves **Fase 3 (CoT)** and **Fase 4 (Ablation)**.

#### [MODIFY] [config/index.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/config/index.ts)

Add a new `PromptConfig` type to `AppConfig`:

```typescript
export interface PromptConfig {
  /** Prompt strategy: 'standard' or 'chain-of-thought'. Default: 'standard'. */
  strategy: "standard" | "chain-of-thought";

  /** If false, AST metrics are NOT sent to the LLM. Default: true. */
  includeAstMetrics: boolean;

  /** If false, context snippets (imports, describe, setupVars) are NOT sent. Default: true. */
  includeContext: boolean;
}
```

Add `prompt?: PromptConfig` to `AppConfig`. Default to `{ strategy: 'standard', includeAstMetrics: true, includeContext: true }` in `loadConfig`.

#### [MODIFY] [smells/prompt-builder.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/smells/prompt-builder.ts)

Add a `buildChainOfThoughtPrompt(smells)` function alongside the existing `buildSystemPrompt`. The CoT variant:

1. Explicitly instructs the model to "think step by step"
2. Requires reasoning about async flows (Promises, callbacks, subscriptions) before classifying
3. Demands the model list which metrics it checked and why before giving the final answer

Add a top-level `buildPromptForStrategy(smells, strategy)` dispatcher.

#### [MODIFY] [analyzer/index.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/analyzer/index.ts)

Update `runAnalyzer` to accept the new `PromptConfig`:

- When `includeAstMetrics: false`, send an empty `metadata: {}` to the provider instead of the real metrics
- When `includeContext: false`, skip building `contextSnippets`

#### [MODIFY] [pipeline/index.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/pipeline/index.ts)

Update the analyze stage to read `config.prompt` and pass the right strategy to `buildPromptForStrategy`, and pass `promptConfig` down to `runAnalyzer`.

#### Updated Config Example

```json
{
  "prompt": {
    "strategy": "chain-of-thought",
    "includeAstMetrics": true,
    "includeContext": true
  }
}
```

For ablation studies, you'd run the pipeline multiple times with different configs:

- **Full**: `{ "strategy": "standard", "includeAstMetrics": true, "includeContext": true }`
- **No AST**: `{ "strategy": "standard", "includeAstMetrics": false, "includeContext": true }`
- **No Context**: `{ "strategy": "standard", "includeAstMetrics": true, "includeContext": false }`
- **Bare Model**: `{ "strategy": "standard", "includeAstMetrics": false, "includeContext": false }`
- **CoT + Full**: `{ "strategy": "chain-of-thought", "includeAstMetrics": true, "includeContext": true }`

---

### Phase B — Goldset Consensus Builder

This serves **Fase 2**. After running `analyze` with N models, a new `consensus` command takes majority-vote predictions to refine the goldset.

#### [NEW] `src/consensus/index.ts`

Core logic:

1. Load all `comparison_results_v{modelId}.json` files from the output directory
2. For each test file, collect the smells detected by each model
3. Apply **majority voting**: a smell is included in the consensus goldset only if ≥ N/2+1 models detected it
4. Optionally produce a **disagreement report** highlighting files where models strongly disagree (useful for manual review)
5. Output a new `consensus_goldset.txt` in the same format as `run.txt` (so it can be used as `referenceResultsPath`)

#### [NEW] `src/cli/commands/consensus.ts`

CLI command:

```sh
./bench consensus --models llama3-local gemini-flash codellama-7b --threshold 0.5
```

Options:

- `--threshold <0-1>`: Fraction of models that must agree (default: 0.5 = simple majority)
- `--output <path>`: Where to write the consensus goldset (default: `goldset/consensus.txt`)
- `--report`: Also write `consensus_disagreements.json` showing per-file model votes

#### [MODIFY] `src/cli/index.ts`

Register the new `consensus` command.

---

### Phase C — Cross-Setup Comparative Analysis

This serves **Fase 4** and your explicit request to compare results across different experimental setups.

> [!IMPORTANT]
> This requires a naming convention change. Currently, output files are versioned by model ID (`comparison_results_vllama3-local.json`). For ablation, we need a **run tag** that encodes both the model AND the setup variant (e.g., `llama3-local__cot-full` vs `llama3-local__standard-noast`).

#### [MODIFY] [pipeline/index.ts](file:///home/pedro/Desktop/projects/tcc/ts-test-smell-bench/src/pipeline/index.ts)

Update the version tag generation to incorporate prompt config:

```
versionTag = `${modelId}__${strategy}-${astFlag}-${ctxFlag}`
// e.g. "llama3-local__cot-ast-ctx" or "gemini-flash__standard-noast-noctx"
```

#### [NEW] `src/evaluator/compare.ts`

A new `compareSessions` function that:

1. Scans the output directory for all `evaluation_metrics_v*.json` files
2. Parses the run tag to extract model, strategy, and toggle settings
3. Produces a comparison table: rows = smells, columns = `{model}×{setup}`, cells = F1

#### [NEW] `src/cli/commands/compare.ts`

CLI command:

```sh
./bench compare
./bench compare --filter llama3-local   # Only compare runs for this model
./bench compare --metric f1             # Sort by F1 (default)
```

Outputs:

- `cross_setup_comparison.json` — The full matrix
- `cross_setup_comparison.html` — A visual heatmap showing which setup performs best per smell

---

## Open Questions

> [!IMPORTANT]
> **Run tag naming**: Should I generate the version tag automatically from the prompt config (e.g., `llama3-local__cot-ast-ctx`), or do you prefer to set a manual `--tag` flag per run to name experiments yourself? Automatic is less error-prone; manual gives you full control.

> [!IMPORTANT]
> **Consensus threshold**: For the goldset consensus builder, the default is simple majority (>50%). Would you prefer a stricter threshold (e.g., 2/3 agreement) or keep it configurable?

> [!IMPORTANT]
> **CoT output parsing**: Chain-of-Thought prompts produce much more verbose output. The current response parser looks for `FILE: ... - SMELLS: ... - JUSTIFICATION: ...`. For CoT, the model will emit reasoning _before_ the final line. The current regex with the `/s` flag already handles this (it grabs the _last_ match). Should I add any additional parsing logic, or is the current approach sufficient?

## Verification Plan

### Automated Tests

- Run `./bench run --skip-mine --skip-prepare -m llama3-local` with different `prompt` configs and verify output files are created with correct version tags
- Run `./bench consensus --models llama3-local gemini-flash` and verify the consensus goldset is generated
- Run `./bench compare` and verify the comparison JSON and HTML are generated

### Manual Verification

- Ablation: Compare F1 scores across "full", "no-ast", "no-context", and "bare" runs for the same model
- CoT: Inspect raw model responses to confirm the model is actually reasoning step-by-step before classifying
