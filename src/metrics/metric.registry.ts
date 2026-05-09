import { Node, SyntaxKind } from "ts-morph";
import type { MetricDescriptor } from "./metric.ts";

export const lineCountMetric: MetricDescriptor<number> = {
  name: "lineCount",
  description:
    "Measures the total number of lines in the test block to help identify oversized, complex, or \"Eager\" tests.",
  extract: (call) =>
    call.getEndLineNumber() - call.getStartLineNumber() + 1,
};

export const assertionCountMetric: MetricDescriptor<number> = {
  name: "assertionCount",
  description:
    "Counts the total number of expect calls; high values often signal the presence of the Assertion Roulette smell.",
  extract: (testCall) => {
    const testBody = testCall.getArguments()[1];
    if (!testBody) return 0;

    return testBody
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((c) => {
        const exp = c.getExpression();
        return Node.isIdentifier(exp) && exp.getText() === "expect";
      }).length;
  },
};

export const assertionsWithoutMessagesMetric: MetricDescriptor<number> = {
  name: "assertionsWithoutMessages",
  description:
    "Identifies assertions lacking custom diagnostic messages, making it harder to pinpoint specific failures in large suites.",
  extract: (testCall) => {
    const testBody = testCall.getArguments()[1];
    if (!testBody) return 0;

    const assertions = testBody
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((c) => c.getExpression().getText() === "expect");

    return assertions.filter((assertion) => {
      const parent = assertion.getParent();
      if (Node.isPropertyAccessExpression(parent)) {
        const matcherCall = parent.getParent();
        if (Node.isCallExpression(matcherCall)) {
          return matcherCall.getArguments().length <= 1;
        }
      }
      return true;
    }).length;
  },
};

export const controlFlowCountMetric: MetricDescriptor<number> = {
  name: "controlFlowCount",
  description:
    "Tracks branching and loops (if, for, switch) to detect the Conditional Test Logic smell, which increases test complexity.",
  extract: (testCall) => {
    const testBody = testCall.getArguments()[1];
    if (!testBody) return 0;

    const kinds = [
      SyntaxKind.IfStatement,
      SyntaxKind.ForStatement,
      SyntaxKind.ForInStatement,
      SyntaxKind.ForOfStatement,
      SyntaxKind.SwitchStatement,
      SyntaxKind.WhileStatement,
      SyntaxKind.DoStatement,
      SyntaxKind.ConditionalExpression,
    ];

    return kinds.reduce(
      (acc, kind) => acc + testBody.getDescendantsOfKind(kind).length,
      0,
    );
  },
};

export const conjunctionsInNameMetric: MetricDescriptor<boolean> = {
  name: "hasConjunctionsInName",
  description:
    'Checks for words like "and" or "with" in the title, signaling that a single test might be verifying multiple behaviors.',
  extract: (testCall) => {
    const firstArg = testCall.getArguments()[0];
    if (
      !Node.isStringLiteral(firstArg) &&
      !Node.isNoSubstitutionTemplateLiteral(firstArg)
    ) {
      return false;
    }
    const name = firstArg.getLiteralText().toLowerCase();
    const conjunctions = [" and ", " or ", " & ", " also ", " with "];
    return conjunctions.some((c) => name.includes(c));
  },
};

export const distinctMatchersMetric: MetricDescriptor<number> = {
  name: "distinctMatchersCount",
  description:
    "Calculates the variety of matchers used (e.g., toBe, toMatch); high diversity can indicate a lack of test cohesion and focus.",
  extract: (testCall) => {
    const testBody = testCall.getArguments()[1];
    if (!testBody) return 0;

    const matchers = testBody
      .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
      .filter((p) => p.getExpression().getText() === "expect")
      .map((p) => p.getName());

    return new Set(matchers).size;
  },
};

export const hardcodedLiteralCountMetric: MetricDescriptor<number> = {
  name: "hardcodedLiteralCount",
  description:
    'Tallies raw strings and numbers, highlighting potential "Magic Numbers" or high coupling with specific data values.',
  extract: (testCall) => {
    const testBody = testCall.getArguments()[1];
    if (!testBody) return 0;

    return (
      testBody.getDescendantsOfKind(SyntaxKind.StringLiteral).length +
      testBody.getDescendantsOfKind(SyntaxKind.NumericLiteral).length
    );
  },
};

export const DEFAULT_METRICS = [
  lineCountMetric,
  assertionCountMetric,
  assertionsWithoutMessagesMetric,
  controlFlowCountMetric,
  conjunctionsInNameMetric,
  distinctMatchersMetric,
  hardcodedLiteralCountMetric,
] as const;
