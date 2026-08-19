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
    id: 'assertion-roulette',
    displayName: 'Assertion Roulette',
    description:
      'Multiple assertions in one test without descriptive failure messages.',
    requiredMetrics: ['assertionCount', 'assertionsWithoutMessages'],
    promptSection: `Assertion Roulette
   - TRIGGER: (metrics.assertionCount >= 2) AND (metrics.assertionsWithoutMessages >= 2).
   - REASONING: If there are multiple assertions and they lack custom failure explanation strings (e.g., expect(a, "msg").toBe(b)), failing will be ambiguous.
   - ABSOLUTE GATE: If metrics.assertionCount <= 1, answer PASS (Impossible to be Roulette).`,
  },

  {
    id: 'conditional-test-logic',
    displayName: 'Conditional Test Logic',
    description:
      'Presence of if, for, switch, while, or ternary operators within the test body.',
    requiredMetrics: ['controlFlowCount'],
    promptSection: `Conditional Test Logic
   - TRIGGER: metrics.controlFlowCount >= 1.
   - REASONING: Unit tests must be linear (Arrange -> Act -> Assert). Look inside the test body for 'if (', 'for (', 'switch (', 'while (', or the ternary '? :'.
   - ABSOLUTE GATE: If metrics.controlFlowCount === 0, answer PASS.`,
  },

  {
    id: 'eager-test',
    displayName: 'Eager Test',
    description:
      'A test verifying too many different behaviors or SUT actions in a single block.',
    requiredMetrics: [],
    promptSection: `Eager Test
   - TRIGGER: The test invokes more than one distinct state-changing method / action on the System Under Test (SUT).
   - REASONING: Verifying \`user.setAge()\` AND THEN calling \`user.saveToDb()\` in the same block.
   - FALSE-POSITIVE GUARD: Invoking ONE method (e.g. \`const res = calc()\`) and writing 5 \`expect()\` checks validating \`res.a\`, \`res.b\`, \`res.c\` IS NOT AN EAGER TEST.`,
  },

  {
    id: 'resource-optimism',
    displayName: 'Resource Optimism',
    description:
      'Assuming external resources (API, file system, DB) are always available without error handling.',
    requiredMetrics: [],
    promptSection: `Resource Optimism
   - TRIGGER: The test references external I/O objects (\`fs.\`, \`path.join\`, \`http.\`, \`axios.\`, \`fetch(\`, \`db.\`, \`pool.query\`, \`process.env\`) AND DOES NOT wrap them in a \`try/catch\` block or assert their existence prior to acting.
   - REASONING: Assuming a local file or network exists without handling its potential absence.`,
  },

  {
    id: 'mystery-guest',
    displayName: 'Mystery Guest',
    description:
      'Dependencies on external resources (files, DBs, helpers) not explicitly defined in the test.',
    requiredMetrics: [],
    promptSection: `Mystery Guest
   - TRIGGER: The test relies on variables, mocks, or files instantiated outside the visible test file, making the test unreadable on its own.
   - REASONING: Look for \`JSON.parse(fs.readFileSync('sample.json'))\` or \`import { globalPayload } from './test-helpers'\`. If I cannot see the contents of the test data inside this code block, it is a Mystery Guest.`,
  },

  {
    id: 'general-fixture',
    displayName: 'General Fixture',
    description:
      'Excessive setup in beforeEach/beforeAll where only a fraction is used by the test.',
    requiredMetrics: [],
    promptSection: `General Fixture
   - TRIGGER: The test file sets up broad shared state in \`beforeEach\`/\`beforeAll\`, but this specific test body utilizes less than 50% of those setup variables.
   - REASONING: Loading 5 different database repository mocks in setup, but the test only uses 1.`,
  },

  {
    id: 'magic-number',
    displayName: 'Magic Number',
    description:
      'Raw, unexplained primitive numbers passed directly as behavioral inputs into SUT methods.',
    requiredMetrics: ['hardcodedLiteralCount'],
    promptSection: `Magic Number
   - TRIGGER: Raw, unexplained primitive numbers (e.g., \`42\`, \`86400\`, \`3.14\`) passed directly as behavioral inputs into SUT methods.
   - FALSE-POSITIVE GUARD: Numbers used as expected output matchers (e.g., \`expect(count).toBe(0)\` or \`toBe(1)\`) are SAFE and must NOT be flagged as Magic Numbers.`,
  },

  {
    id: 'hardcoded-literal',
    displayName: 'Hardcoded Literal',
    description:
      'Raw, unexplained domain strings used as behavioral inputs instead of declared constants.',
    requiredMetrics: ['hardcodedLiteralCount'],
    promptSection: `Hardcoded Literal
   - TRIGGER: Raw, unexplained domain strings (e.g., \`"SUPER_ADMIN"\`, \`"http://api.com"\`, \`"./temp.txt"\`) passed directly as behavioral inputs into SUT methods instead of using declared constants.
   - FALSE-POSITIVE GUARD: Strings inside 'expect' matchers (e.g., \`expect(status).toBe("SUCCESS")\`) are SAFE.`,
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
      const known = SMELL_CATALOG.map((s) => s.id).join(', ');
      throw new Error(
        `Unknown smell ID "${id}". Known smells: ${known}`,
      );
    }
    return smell;
  });
}

/** Return all smell IDs in the catalog. */
export function allSmellIds(): string[] {
  return SMELL_CATALOG.map((s) => s.id);
}
