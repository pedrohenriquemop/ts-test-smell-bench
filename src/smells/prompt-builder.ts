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

import type { SmellDescriptor } from "./catalog.ts";
import type { PromptConfig } from "../config/index.ts";

// ── Strategy dispatcher ──────────────────────────────────────────────

/**
 * Build the system prompt for the requested strategy.
 * Falls back to 'standard' if strategy is unknown.
 */
export function buildPromptForStrategy(
  smells: readonly SmellDescriptor[],
  promptConfig?: PromptConfig,
): string {
  const useChainOfThought = promptConfig?.useChainOfThought ?? promptConfig?.strategy === "chain-of-thought";
  return useChainOfThought ? buildChainOfThoughtPrompt(smells) : buildSystemPrompt(smells);
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
    .join("\n\n");

  return `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.

Your goal is to cross-reference the provided AST JSON metrics with the source code and classify the presence of Test Smells. You must replace human intuition with strict, cold algorithmic rules.
### TEST FILE STRUCTURE & CONTEXT:
Each test file provided is a self-contained skeletal TypeScript snippet with two layers:
1. **Fixtures & Context Layer**: File-level imports, ancestor \`describe()\` wrappers, and setup hooks (\`beforeEach\`/\`beforeAll\`) containing shared variables. These provide the context required to evaluate fixture smells (such as General Fixture and Mystery Guest).
2. **Target Test Layer**: The single unit test being evaluated is delimited between \`// ── TARGET TEST ──\` and \`// ── END TARGET TEST ──\`.

Cross-reference the AST METADATA with the target test block and surrounding fixture context.

### THE VALID SMELLS & THEIR STRICT ALGORITHMIC TRIGGERS:

${smellRules}

### OUTPUT FORMAT
Respond with only the final parseable line containing the file name, smells, and a short justification. Do not include analysis, markdown, or any other text.

FILE: example.spec.ts - SMELLS: ${
    smells.length > 0 ? smells[0].displayName : "None"
  } - JUSTIFICATION: Brief explanation of detected smells.`;
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
    .join("\n\n");

  return `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.

You will receive:
- AST JSON METRICS extracted statically from the test code (may be empty if ablation mode is active)
- CONTEXT about the surrounding test file (imports, setup hooks, shared variables — may be empty)
- The SOURCE CODE of a single \`it()\` / \`test()\` block

### THE VALID SMELLS & THEIR STRICT ALGORITHMIC TRIGGERS:

${smellRules}

### REQUIRED OUTPUT FORMAT
Output exactly the following structure, with your actual evaluation in the designated tags and no text outside them. In <thinking>, explain the analysis step by step before deciding. In <classification>, provide only the final parseable result in this format: FILE: [NAME] - SMELLS: [LIST or None] - JUSTIFICATION: [SHORT].

<thinking>
Step 1: Scope & Setup Analysis (Where do variables come from?)
Step 2: Control Flow Analysis (Are there try/catch/if blocks used for test flow or just async fallbacks?)
Step 3: Smell Trigger Validation (Evaluate specific rules)
</thinking>
<classification>
{FINAL_JSON_OR_PARSABLE_FORMAT}
</classification>`;
}
