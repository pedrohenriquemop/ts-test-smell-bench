import type { SmellDescriptor } from "./catalog.ts";
import type { PromptConfig } from "../config/index.ts";

function buildSmellRules(
  smells: readonly SmellDescriptor[],
  includeAstMetrics: boolean,
): string {
  return smells
    .map((smell, index) => {
      if (includeAstMetrics) return `${index + 1}. ${smell.promptSection}`;

      // AST ablation: drop the rule lines that reference metrics.
      const sourceRules = smell.promptSection
        .split("\n")
        .filter((line) => !/metrics\s*\./i.test(line))
        .join("\n")
        .trim();
      return `${index + 1}. ${smell.displayName}\n   - Evaluate from the visible test source and supplied context only; do not infer or refer to AST metric values.${sourceRules && sourceRules !== smell.displayName ? `\n${sourceRules.replace(smell.displayName, "").trim()}` : ""}`;
    })
    .join("\n\n");
}

/** System prompt listing the trigger rules of the enabled smells. */
export function buildSystemPrompt(
  smells: readonly SmellDescriptor[],
  prompt: PromptConfig,
): string {
  return prompt.useChainOfThought
    ? buildChainOfThoughtPrompt(smells, prompt.includeAstMetrics)
    : buildStandardPrompt(smells, prompt.includeAstMetrics);
}

function buildStandardPrompt(
  smells: readonly SmellDescriptor[],
  includeAstMetrics: boolean,
): string {
  const smellRules = buildSmellRules(smells, includeAstMetrics);

  return `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.

Your goal is to classify the presence of Test Smells from the test source${includeAstMetrics ? " and provided AST JSON metrics" : ""}. You must replace human intuition with strict, cold algorithmic rules.
### TEST FILE STRUCTURE & CONTEXT:
Each test file provided is a self-contained skeletal TypeScript snippet with two layers:
1. **Fixtures & Context Layer**: File-level imports, ancestor \`describe()\` wrappers, and setup hooks (\`beforeEach\`/\`beforeAll\`) containing shared variables. These provide the context required to evaluate fixture smells (such as General Fixture and Mystery Guest).
2. **Target Test Layer**: The single unit test being evaluated is delimited between \`// ── TARGET TEST ──\` and \`// ── END TARGET TEST ──\`.

${includeAstMetrics ? "Cross-reference the AST METADATA with the target test block and surrounding fixture context." : "Use the target test block and surrounding fixture context only. No AST metadata is provided."}

### THE VALID SMELLS & THEIR STRICT ALGORITHMIC TRIGGERS:

${smellRules}

### OUTPUT FORMAT — MUST FOLLOW EXACTLY
Return exactly one line in this format. Replace the example filename with the exact test filename supplied in the input. In SMELLS, write only exact display names from the valid-smell list above, separated by commas; write None when there are no matches.

FILE: example.spec.ts - SMELLS: ${
    smells.length > 0 ? smells[0].displayName : "None"
  } - JUSTIFICATION: Brief explanation of detected smells.

Do not use bullets, numbering, brackets, quotes, JSON, code fences, extra fields, line breaks, or text before or after this line. Keep JUSTIFICATION on the same line and concise. Never output a smell that is not in the valid-smell list. This format is mandatory for every model and every test.`;
}

/** Asks for reasoning inside <thinking> before a <classification> line. */
function buildChainOfThoughtPrompt(
  smells: readonly SmellDescriptor[],
  includeAstMetrics: boolean,
): string {
  const smellRules = buildSmellRules(smells, includeAstMetrics);

  return `You are an expert Static Analysis & Software Quality Engine acting as a deterministic Oracular Classifier for TypeScript Test Smells.

You will receive:
${includeAstMetrics ? "- AST JSON METRICS extracted statically from the test code" : "- Use only the source code and any provided context; no AST metrics are available."}
- CONTEXT about the surrounding test file (imports, setup hooks, shared variables — may be empty)
- The SOURCE CODE of a single \`it()\` / \`test()\` block

### THE VALID SMELLS & THEIR STRICT ALGORITHMIC TRIGGERS:

${smellRules}

### REQUIRED OUTPUT FORMAT — MUST FOLLOW EXACTLY
Return exactly these two tagged blocks, with no text before or after them. Put reasoning only inside <thinking>. Inside <classification>, return exactly one line in this format: FILE: [exact input filename] - SMELLS: [exact valid-smell display names separated by commas, or None] - JUSTIFICATION: [brief explanation]. Do not put reasoning, markdown, JSON, brackets around the smell list, or any additional text inside <classification>. Never output a smell that is not in the valid-smell list. The classification line is consumed by an automated parser, so preserve the labels, order, separators, and single-line structure exactly.

<thinking>
Step 1: Scope & Setup Analysis (Where do variables come from?)
Step 2: Control Flow Analysis (Are there try/catch/if blocks used for test flow or just async fallbacks?)
Step 3: Smell Trigger Validation (Evaluate specific rules)
</thinking>
<classification>
FILE: example.spec.ts - SMELLS: None - JUSTIFICATION: No listed smells detected.
</classification>`;
}
