export interface SmellDescriptor {
  /** Stable kebab-case identifier used in config files. */
  readonly id: string;
  /** Name used in prompts, goldsets and reports. */
  readonly displayName: string;
  readonly description: string;
  /** Trigger rules injected into the system prompt, starting with the display name. */
  readonly promptSection: string;
  /** AST metrics referenced by the trigger rules. */
  readonly requiredMetrics: readonly string[];
}

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
   - TRIGGER: The test performs an actual network, disk, or database I/O call (\`fs.readFile\`, \`fs.writeFile\` and other \`fs.*\` reads/writes, \`fetch(\`, \`axios.\`, \`http.\`/\`https.\` requests, \`db.\`, \`pool.query\`) AND DOES NOT wrap it in a \`try/catch\` block or check the resource's existence (e.g. \`fs.existsSync\`) prior to acting.
   - FALSE-POSITIVE GUARD: \`path.join\`, \`path.resolve\`, and other \`path.*\` helpers are in-memory string formatting, NOT I/O, and must NOT be flagged. Reading \`process.env\` is an in-memory lookup, NOT I/O, and must NOT be flagged.
   - REASONING: Assuming a local file, network, or database exists without handling its potential absence.`,
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
    requiredMetrics: ["setupHookCount", "beforeEachVarCount"],
    promptSection: `General Fixture
   - TRIGGER: The test file sets up broad shared state in \`beforeEach\`/\`beforeAll\`, but this specific test body utilizes less than 50% of those setup variables.
   - REASONING: Loading 5 different database repository mocks in setup, but the test only uses 1.
   - ABSOLUTE GATE: If metrics.setupHookCount === 0 OR metrics.beforeEachVarCount === 0, answer PASS (Impossible to have a General Fixture without a populated beforeEach/beforeAll hook).`,
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
   - TRIGGER: Any \`.toString()\` or \`JSON.stringify()\` call appearing inside the argument of an \`expect()\`/\`assert()\` (either side of the comparison, e.g. \`expect(value.toString()).toBe(...)\` or \`expect(x).toBe(value.toString())\`) is an UNCONDITIONAL MATCH. Do not evaluate developer intent, readability, or whether the comparison "looks reasonable" — the syntactic pattern alone is sufficient.
   - REASONING: String representations can change due to formatting or implementation details even when the relevant behavior remains correct. Prefer assertions on the meaningful value or property.`,
  },
] as const;

const SMELLS_BY_ID = new Map(SMELL_CATALOG.map((s) => [s.id, s]));

/** Throws if any ID is not in the catalog. */
export function resolveSmells(ids: readonly string[]): SmellDescriptor[] {
  return ids.map((id) => {
    const smell = SMELLS_BY_ID.get(id);
    if (!smell) {
      const known = SMELL_CATALOG.map((s) => s.id).join(", ");
      throw new Error(`Unknown smell ID "${id}". Known smells: ${known}`);
    }
    return smell;
  });
}

export function allSmellIds(): string[] {
  return SMELL_CATALOG.map((s) => s.id);
}

// ── Normalization ────────────────────────────────────────────────────

const alphanumericKey = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

/** "assertionroulette" / "assertion-roulette" key → "Assertion Roulette". */
const DISPLAY_NAME_BY_KEY = new Map(
  SMELL_CATALOG.flatMap((s) => [
    [alphanumericKey(s.displayName), s.displayName],
    [alphanumericKey(s.id), s.displayName],
  ]),
);

/** Matches a name followed by annotations, e.g. "General Fixture (Potential)". */
const DISPLAY_NAME_PREFIXES = SMELL_CATALOG.map((s) => ({
  pattern: new RegExp(`^${s.displayName.split(" ").join("\\s*")}`, "i"),
  displayName: s.displayName,
}));

/**
 * Maps a raw smell label to its catalog display name. Returns null for
 * "None", false-positive-guard annotations, and unknown names.
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

  const prefixed = DISPLAY_NAME_PREFIXES.find(({ pattern }) => pattern.test(s));
  if (prefixed) return prefixed.displayName;

  // PascalCase, camelCase, kebab-case, snake_case.
  return DISPLAY_NAME_BY_KEY.get(alphanumericKey(s)) ?? null;
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
