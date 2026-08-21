/**
 * Generates a complete LLM system prompt from a set of selected smell
 * descriptors.  This replaces the static Modelfile — the prompt now
 * adapts to whatever smells the user has enabled in config.
 *
 * Supports two strategies:
 * - 'standard': Direct classification with a brief evaluation step.
 * - 'chain-of-thought': Forces deep step-by-step reasoning about
 *    async flows, metric values, and dependency chains before emitting
 *    the final classification.
 */

import type { SmellDescriptor } from './catalog.ts';
import type { PromptConfig } from '../config/index.ts';

// ── Strategy dispatcher ──────────────────────────────────────────────

/**
 * Build the system prompt for the requested strategy.
 * Falls back to 'standard' if strategy is unknown.
 */
export function buildPromptForStrategy(
  smells: readonly SmellDescriptor[],
  promptConfig?: PromptConfig,
): string {
  const strategy = promptConfig?.strategy ?? 'standard';

  switch (strategy) {
    case 'chain-of-thought':
      return buildChainOfThoughtPrompt(smells);
    case 'standard':
    default:
      return buildSystemPrompt(smells);
  }
}

// ── Standard prompt ──────────────────────────────────────────────────

/**
 * Build the full system prompt given the smells the user wants to
 * detect.  The output is a single string ready to be sent as the
 * `system` field to any LLM provider.
 */
export function buildSystemPrompt(smells: readonly SmellDescriptor[]): string {
  const smellRules = smells
    .map((s, i) => `${i + 1}. ${s.promptSection}`)
    .join('\n\n');

  const exampleEvaluationLines = smells
    .map((s) => `- ${s.displayName}: <check metric/code> -> [MATCH] or [PASS]`)
    .join('\n');

  return `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.

Your goal is to cross-reference the provided AST JSON metrics with the source code and classify the presence of Test Smells. You must replace human intuition with strict, cold algorithmic rules.

### THE VALID SMELLS & THEIR STRICT ALGORITHMIC TRIGGERS:

${smellRules}

### EXECUTION PROTOCOL (CRITICAL FOR YOUR ACCURACY)

To engage your internal reasoning layers, you MUST answer in two distinct sequential steps:

STEP 1: Write a brief, private step-by-step evaluation testing all smells against the code.
STEP 2: Output a markdown divider \`---\` followed strictly by the final parseable line containing the file name, smells, and a short justification.

Example response structure:

### Algorithmic Evaluation:
${exampleEvaluationLines}

---
FILE: example.spec.ts - SMELLS: ${smells.length > 0 ? smells[0].displayName : 'None'} - JUSTIFICATION: Brief explanation of detected smells.`;
}

// ── Chain-of-Thought prompt ──────────────────────────────────────────

/**
 * Build a Chain-of-Thought (CoT) system prompt that forces the model
 * to reason deeply and sequentially before classifying.
 *
 * Key differences from 'standard':
 * 1. Explicit "think step by step" instruction
 * 2. Requires reasoning about async flows (Promises, callbacks, subscriptions)
 * 3. Demands the model list which metrics it checked and their values
 * 4. Adds a "confidence" qualifier to each smell decision
 */
export function buildChainOfThoughtPrompt(
  smells: readonly SmellDescriptor[],
): string {
  const smellRules = smells
    .map((s, i) => `${i + 1}. ${s.promptSection}`)
    .join('\n\n');

  const smellNames = smells.map((s) => s.displayName).join(', ');

  return `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.

You will receive:
- AST JSON METRICS extracted statically from the test code (may be empty if ablation mode is active)
- CONTEXT about the surrounding test file (imports, setup hooks, shared variables — may be empty)
- The SOURCE CODE of a single \`it()\` / \`test()\` block

### THE VALID SMELLS & THEIR STRICT ALGORITHMIC TRIGGERS:

${smellRules}

### CHAIN-OF-THOUGHT EXECUTION PROTOCOL

You MUST think step by step. Follow this exact sequence:

#### STEP 1 — METRIC ANALYSIS
For each AST metric provided (if any), state its name and value, then explain what that value implies about possible smells. If no metrics are provided, state "No AST metrics available — relying on code analysis only."

#### STEP 2 — CONTEXT ANALYSIS
Examine the imports and describe-block context (if provided). Answer:
- Does the test import external I/O modules (fs, http, DB drivers)? → Relates to Mystery Guest, Resource Optimism
- How many variables are set up in beforeEach/beforeAll? How many does this specific test actually use? → Relates to General Fixture
- Are there async patterns (Promises, async/await, callbacks, subscriptions, timers)? → Consider if error handling or cleanup is adequate

#### STEP 3 — CODE ANALYSIS
Read the test source code carefully. For EACH smell in the catalog (${smellNames}), evaluate:
1. Does the code trigger this smell based on the algorithmic rules?
2. What specific code pattern or metric value triggers or clears it?
3. Confidence: HIGH, MEDIUM, or LOW

#### STEP 4 — FINAL CLASSIFICATION
After completing your reasoning, output a markdown divider \`---\` followed strictly by the final parseable line.

### OUTPUT FORMAT

Your full response must look like this:

**Step 1 — Metrics:** [your metric analysis]
**Step 2 — Context:** [your context analysis]  
**Step 3 — Per-smell evaluation:**
${smells.map((s) => `- ${s.displayName}: [MATCH/PASS] (confidence: HIGH/MEDIUM/LOW) — reason`).join('\n')}

---
FILE: [filename] - SMELLS: [comma-separated list or None] - JUSTIFICATION: [one-sentence summary]

IMPORTANT: The line after \`---\` is machine-parsed. Do NOT deviate from the format: \`FILE: ... - SMELLS: ... - JUSTIFICATION: ...\``;
}
