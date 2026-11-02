/**
 * Master catalog of all known test smells.
 *
 * Each SmellDescriptor contains:
 *  - A stable ID used in config files and result JSON
 *  - A human-readable display name for reports
 *  - A description for documentation
 *  - A `promptSection` that gets injected into the LLM system prompt
 *  - A list of AST metrics the smell depends on
 */

// ── Types ────────────────────────────────────────────────────────────

export interface SmellDescriptor {
  /** Stable kebab-case identifier (e.g. "assertion-roulette"). */
  readonly id: string;

  /** Human-readable name shown in reports (e.g. "Assertion Roulette"). */
  readonly displayName: string;

  /** One-liner for docs / tooltips. */
  readonly description: string;

  /**
   * The algorithmic trigger / rule text injected into the LLM system
   * prompt.  Should be self-contained — the prompt builder concatenates
   * these sections.
   */
  readonly promptSection: string;

  /**
   * Which AST metric names this smell relies on for its trigger rules.
   * Used to validate that the required metrics are enabled in config.
   */
  readonly requiredMetrics: readonly string[];
}

// ── Catalog entries ──────────────────────────────────────────────────

export const SMELL_CATALOG: readonly SmellDescriptor[] = [
  {
    id: "assertion-roulette",
    displayName: "Assertion Roulette",
    description:
      "Multiple assertions in one test without descriptive failure messages.",
    requiredMetrics: ["assertionCount", "assertionsWithoutMessages"],
    promptSection: `Assertion Roulette
   - TRIGGER: (metrics.assertionCount >= 2) AND (metrics.assertionsWithoutMessages >= 2).
   - REASONING: If there are multiple assertions and they lack custom failure explanation strings (e.g., expect(a, "msg").toBe(b)), failing will be ambiguous.
   - ABSOLUTE GATE: If metrics.assertionCount <= 1, answer PASS (Impossible to be Roulette).`,
  },

  {
    id: "conditional-test-logic",
    displayName: "Conditional Test Logic",
    description:
      "Presence of if, for, switch, while, or ternary operators within the test body.",
    requiredMetrics: ["controlFlowCount"],
    promptSection: `Conditional Test Logic
   - TRIGGER: metrics.controlFlowCount >= 1.
   - REASONING: Unit tests must be linear (Arrange -> Act -> Assert). Look inside the test body for 'if (', 'for (', 'switch (', 'while (', or the ternary '? :'.
   - ABSOLUTE GATE: If metrics.controlFlowCount === 0, answer PASS.`,
  },

  {
    id: "eager-test",
    displayName: "Eager Test",
    description:
      "A test verifying too many different behaviors or SUT actions in a single block.",
    requiredMetrics: [],
    promptSection: `Eager Test
   - TRIGGER: The test invokes more than one distinct state-changing method / action on the System Under Test (SUT).
   - REASONING: Verifying \`user.setAge()\` AND THEN calling \`user.saveToDb()\` in the same block.
   - FALSE-POSITIVE GUARD: Invoking ONE method (e.g. \`const res = calc()\`) and writing 5 \`expect()\` checks validating \`res.a\`, \`res.b\`, \`res.c\` IS NOT AN EAGER TEST.`,
  },

  {
    id: "resource-optimism",
    displayName: "Resource Optimism",
    description:
      "Assuming external resources (API, file system, DB) are always available without error handling.",
    requiredMetrics: [],
    promptSection: `Resource Optimism
   - TRIGGER: The test references external I/O objects (\`fs.\`, \`path.join\`, \`http.\`, \`axios.\`, \`fetch(\`, \`db.\`, \`pool.query\`, \`process.env\`) AND DOES NOT wrap them in a \`try/catch\` block or assert their existence prior to acting.
   - REASONING: Assuming a local file or network exists without handling its potential absence.`,
  },

  {
    id: "mystery-guest",
    displayName: "Mystery Guest",
    description:
      "Dependencies on external resources (files, DBs, helpers) not explicitly defined in the test.",
    requiredMetrics: [],
    promptSection: `Mystery Guest
   - TRIGGER: The test relies on variables, mocks, or files instantiated outside the visible test file, making the test unreadable on its own.
   - REASONING: Look for \`JSON.parse(fs.readFileSync('sample.json'))\` or \`import { globalPayload } from './test-helpers'\`. If I cannot see the contents of the test data inside this code block, it is a Mystery Guest.`,
  },

  {
    id: "general-fixture",
    displayName: "General Fixture",
    description:
      "Excessive setup in beforeEach/beforeAll where only a fraction is used by the test.",
    requiredMetrics: [],
    promptSection: `General Fixture
   - TRIGGER: The test file sets up broad shared state in \`beforeEach\`/\`beforeAll\`, but this specific test body utilizes less than 50% of those setup variables.
   - REASONING: Loading 5 different database repository mocks in setup, but the test only uses 1.`,
  },

  {
    id: "magic-number",
    displayName: "Magic Number",
    description:
      "Raw, unexplained primitive numbers passed directly as behavioral inputs into SUT methods.",
    requiredMetrics: ["hardcodedLiteralCount"],
    promptSection: `Magic Number
   - TRIGGER: Raw, unexplained primitive numbers (e.g., \`42\`, \`86400\`, \`3.14\`) passed directly as behavioral inputs into SUT methods.
   - FALSE-POSITIVE GUARD: Numbers used as expected output matchers (e.g., \`expect(count).toBe(0)\` or \`toBe(1)\`) are SAFE and must NOT be flagged as Magic Numbers.,
   - TRIGGER: Raw, unexplained primitive numbers (e.g., \`42\`, \`86400\`, \`3.14\`) passed directly as behavioral inputs or configuration values into SUT methods.
   - FALSE-POSITIVE GUARD: Numbers used only as expected output values in assertions (e.g., \`expect(count).toBe(0)\`, \`toHaveLength(2)\`) or standard array indices/counters (\`0\`, \`1\`) are SAFE and must NOT be flagged.`,
  },

  {
    id: "hardcoded-literal",
    displayName: "Hardcoded Literal",
    description:
      "Raw, unexplained domain strings used as behavioral inputs instead of declared constants.",
    requiredMetrics: ["hardcodedLiteralCount"],
    promptSection: `Hardcoded Literal
   - TRIGGER: Raw, unexplained domain strings (e.g., \`"SUPER_ADMIN"\`, \`"http://api.com"\`, \`"./temp.txt"\`) passed directly as behavioral inputs into SUT methods instead of using declared constants.
   - FALSE-POSITIVE GUARD: Strings inside 'expect' matchers (e.g., \`expect(status).toBe("SUCCESS")\`) are SAFE.,
   - TRIGGER: Raw, unexplained domain/business strings (e.g., \`"SUPER_ADMIN"\`, \`"https://api.domain.com/v1"\`, \`"secret_key_123"\`) passed directly as behavioral inputs or state into SUT methods instead of using declared constants.
   - FALSE-POSITIVE GUARD: Strings inside test titles (\`it("...")\`), strings used strictly as assertion expectations (e.g., \`expect(res).toBe("hello")\`), error message arguments, or standard property keys are SAFE and must NOT be flagged.`,
  },

  {
    id: "sleepy-test",
    displayName: "Sleepy Test",
    description:
      "A test uses explicit time-based waits to synchronize asynchronous behavior.",
    requiredMetrics: [],
    promptSection: `Sleepy Test
   - TRIGGER: The target test uses a fixed delay or explicit sleep (for example, \`setTimeout\`, a \`sleep()\` helper, or \`waitForTimeout()\`) to wait for asynchronous behavior instead of waiting for an observable condition or completion signal.
   - FALSE-POSITIVE GUARD: Do not flag framework-managed condition waits such as \`waitFor\`, or fake-timer advancement used to test timer behavior.`,
  },

  {
    id: "exception-catching-throwing",
    displayName: "Exception Catching Throwing",
    description:
      "A test contains explicit throw or catch logic rather than using declarative exception assertions.",
    requiredMetrics: [],
    promptSection: `Exception Catching Throwing
   - TRIGGER: The target test contains an explicit \`throw\` statement or a \`catch\` clause as part of its test logic, including manual failure signaling after an operation expected to throw.
   - REASONING: Prefer the test framework's declarative exception assertions, such as \`toThrow\`, \`rejects.toThrow\`, or \`assert.throws\`, which report the expected exception directly.`,
  },

  {
    id: "sensitive-equality",
    displayName: "Sensitive Equality",
    description:
      "An assertion compares values through their string representation, making the test sensitive to formatting changes.",
    requiredMetrics: [],
    promptSection: `Sensitive Equality
   - TRIGGER: An assertion compares a value's \`toString()\` result or other stringified representation for equality (for example, \`expect(value.toString()).toBe(expected)\`).
   - REASONING: String representations can change due to formatting or implementation details even when the relevant behavior remains correct. Prefer assertions on the meaningful value or property.`,
  },
] as const;

// ── Lookup helpers ───────────────────────────────────────────────────

const _byId = new Map<string, SmellDescriptor>(
  SMELL_CATALOG.map((s) => [s.id, s]),
);

/** Look up a smell descriptor by its stable ID. */
export function getSmellById(id: string): SmellDescriptor | undefined {
  return _byId.get(id);
}

/**
 * Given a list of enabled smell IDs, return the matching descriptors.
 * Throws if any ID is unknown.
 */
export function resolveSmells(ids: readonly string[]): SmellDescriptor[] {
  return ids.map((id) => {
    const smell = _byId.get(id);
    if (!smell) {
      const known = SMELL_CATALOG.map((s) => s.id).join(", ");
      throw new Error(`Unknown smell ID "${id}". Known smells: ${known}`);
    }
    return smell;
  });
}

/** Return all smell IDs in the catalog. */
export function allSmellIds(): string[] {
  return SMELL_CATALOG.map((s) => s.id);
}

// ── Normalization helpers ─────────────────────────────────────────────

// Map normalized alphanumeric keys to canonical displayName
// e.g. "assertionroulette" -> "Assertion Roulette"
const CANONICAL_BY_KEY = new Map<string, string>();
for (const smell of SMELL_CATALOG) {
  const key = smell.displayName.toLowerCase().replace(/[^a-z0-9]/g, "");
  CANONICAL_BY_KEY.set(key, smell.displayName);
  const idKey = smell.id.toLowerCase().replace(/[^a-z0-9]/g, "");
  CANONICAL_BY_KEY.set(idKey, smell.displayName);
}

/**
 * Normalizes a single raw smell name into its canonical catalog display name.
 * Returns null if the raw string represents "None", a false-positive guard,
 * an empty string, or does not correspond to any known catalog smell.
 */
export function normalizeSmellName(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;

  // Strip brackets, quotes, backticks, asterisks, whitespace
  const s = raw
    .trim()
    .replace(/^[\[\("'`*\s]+|[\]\)"'`*\s]+$/g, "")
    .trim();
  if (!s) return null;

  const lower = s.toLowerCase();

  // Exclude explicit none / pass / guard annotations
  if (
    lower === "none" ||
    lower === "null" ||
    lower === "[]" ||
    lower === "pass" ||
    lower === "safe" ||
    lower.startsWith("false-positive") ||
    lower.startsWith("false positive") ||
    lower.includes("false positive guard") ||
    lower.endsWith(" none") ||
    lower.includes(" none ")
  ) {
    return null;
  }

  // Handle prefix matches with annotations (e.g. "Hardcoded Literal Count = 4", "General Fixture (Potential)")
  if (/^hardcoded\s*literal/i.test(s)) return "Hardcoded Literal";
  if (/^magic\s*number/i.test(s)) return "Magic Number";
  if (/^general\s*fixture/i.test(s)) return "General Fixture";
  if (/^sleepy\s*test/i.test(s)) return "Sleepy Test";
  if (/^eager\s*test/i.test(s)) return "Eager Test";
  if (/^resource\s*optimism/i.test(s)) return "Resource Optimism";
  if (/^assertion\s*roulette/i.test(s)) return "Assertion Roulette";
  if (/^conditional\s*test\s*logic/i.test(s)) return "Conditional Test Logic";
  if (/^exception\s*catching\s*throwing/i.test(s))
    return "Exception Catching Throwing";
  if (/^sensitive\s*equality/i.test(s)) return "Sensitive Equality";
  if (/^mystery\s*guest/i.test(s)) return "Mystery Guest";

  // Alphanumeric lookup (handles PascalCase, camelCase, kebab-case, snake_case)
  const key = lower.replace(/[^a-z0-9]/g, "");
  const found = CANONICAL_BY_KEY.get(key);
  if (found) return found;

  return null;
}

/**
 * Given a raw smell list (array, comma-delimited string, or JSON array string),
 * normalizes and deduplicates all entries, returning strictly canonical
 * display names from SMELL_CATALOG.
 */
export function standardizeSmellList(input: unknown): string[] {
  if (input === null || input === undefined) return [];

  const rawItems: string[] = [];

  if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              rawItems.push(...parsed.map(String));
              continue;
            }
          } catch {
            const inner = trimmed.slice(1, -1);
            rawItems.push(...inner.split(","));
            continue;
          }
        }
        if (trimmed.includes(",") && !trimmed.includes("Count =")) {
          rawItems.push(...trimmed.split(","));
        } else {
          rawItems.push(trimmed);
        }
      }
    }
  } else if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return standardizeSmellList(parsed);
        }
      } catch {
        // Fall back to slice
      }
      const inner = trimmed.slice(1, -1);
      rawItems.push(...inner.split(","));
    } else {
      rawItems.push(...trimmed.split(","));
    }
  }

  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of rawItems) {
    const normalized = normalizeSmellName(raw);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}
