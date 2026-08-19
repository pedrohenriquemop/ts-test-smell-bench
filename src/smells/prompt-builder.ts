/**
 * Generates a complete LLM system prompt from a set of selected smell
 * descriptors.  This replaces the static Modelfile — the prompt now
 * adapts to whatever smells the user has enabled in config.
 */

import type { SmellDescriptor } from './catalog.ts';

// ── Prompt assembly ──────────────────────────────────────────────────

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
