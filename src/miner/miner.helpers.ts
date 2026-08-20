import { CallExpression, Node, Project, SourceFile, SyntaxKind } from "ts-morph";
import {
  DEFAULT_METRICS,
  metricsRecord,
  fileMetricsRecord,
} from "../metrics/metric.helpers.ts";
import type { MetricDescriptor } from "../metrics/metric.ts";
import type { ExtractedTestCase } from "../types.ts";

export class MinerHelpers {
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static sanitizePathSegment(s: string, maxLen = 64): string {
    const cleaned = s
      .replace(/[/\\?*:|"<>]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, maxLen);
    return cleaned || "unnamed";
  }

  static extractTestCasesFromSource(
    content: string,
    virtualFilename = "tests.ts",
    metrics: readonly MetricDescriptor<unknown>[] = DEFAULT_METRICS,
  ): ExtractedTestCase[] {
    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile(virtualFilename, content, {
      overwrite: true,
    });

    // ── File-level context (computed once) ──────────────────────
    const imports = MinerHelpers.extractImports(sourceFile);
    const fileLevelMetrics = fileMetricsRecord(sourceFile);

    const tests: ExtractedTestCase[] = [];
    const testCalls = sourceFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((call) => MinerHelpers.isItOrTestCall(call));

    for (const testCall of testCalls) {
      const args = testCall.getArguments();
      const testName =
        args[0]?.getText().replace(/^["']|["']$/g, "") || "unknown";
      const testBody = args[1];
      if (!testBody) continue;

      const text = testCall.getText();

      // ── Per-test context ──────────────────────────────────────
      const describeContext = MinerHelpers.extractDescribeContext(testCall);
      const setupVariables = MinerHelpers.extractSetupVariables(testCall);

      // Merge per-test metrics with file-level metrics
      const testMetrics = {
        ...metricsRecord(testCall, metrics),
        ...fileLevelMetrics,
      };

      tests.push({
        text,
        testName,
        metrics: testMetrics,
        describeContext,
        imports,
        setupVariables,
      });
    }

    return tests;
  }

  // ── Import extraction ──────────────────────────────────────────────

  /**
   * Extract all import declaration texts from the source file.
   */
  private static extractImports(sourceFile: SourceFile): string[] {
    return sourceFile
      .getImportDeclarations()
      .map((imp) => imp.getText().trim());
  }

  // ── Describe context extraction ────────────────────────────────────

  /**
   * Walk up from the test call to find the nearest enclosing
   * `describe()` block.  Extract its setup hooks (beforeEach,
   * beforeAll, afterEach, afterAll) and top-level variable
   * declarations — but NOT other `it()`/`test()` bodies (to keep
   * the context focused and compact).
   */
  private static extractDescribeContext(testCall: CallExpression): string {
    const describeCall = MinerHelpers.findEnclosingDescribe(testCall);
    if (!describeCall) return "";

    const describeBody = describeCall.getArguments()[1];
    if (!describeBody) return "";

    const parts: string[] = [];

    // Get the describe name for context
    const describeName = describeCall.getArguments()[0];
    if (describeName) {
      parts.push(`describe(${describeName.getText()}, () => {`);
    }

    // Walk direct children of the describe body's block
    const block = describeBody.getDescendantsOfKind(SyntaxKind.Block)[0];
    if (!block) return "";

    for (const stmt of block.getStatements()) {
      // Include variable declarations (let, const, var at describe scope)
      if (Node.isVariableStatement(stmt)) {
        parts.push(`  ${stmt.getText()}`);
        continue;
      }

      // Include setup/teardown hooks
      if (Node.isExpressionStatement(stmt)) {
        const expr = stmt.getExpression();
        if (Node.isCallExpression(expr)) {
          const hookName = MinerHelpers.getRootIdentifierName(
            expr.getExpression(),
          );
          if (
            hookName &&
            ["beforeEach", "beforeAll", "afterEach", "afterAll"].includes(
              hookName,
            )
          ) {
            parts.push(`  ${stmt.getText()}`);
          }
        }
      }
    }

    if (parts.length <= 1) return ""; // only the describe header, no useful context

    parts.push("});");
    return parts.join("\n");
  }

  // ── Setup variable extraction ──────────────────────────────────────

  /**
   * Extract variable names declared or assigned in the nearest
   * beforeEach/beforeAll hooks (relative to the test call).
   */
  private static extractSetupVariables(testCall: CallExpression): string[] {
    const describeCall = MinerHelpers.findEnclosingDescribe(testCall);
    if (!describeCall) return [];

    const describeBody = describeCall.getArguments()[1];
    if (!describeBody) return [];

    const hookNames = ["beforeEach", "beforeAll"];
    const hookCalls = describeBody
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((call) => {
        const root = MinerHelpers.getRootIdentifierName(call.getExpression());
        return root !== undefined && hookNames.includes(root);
      });

    const varNames = new Set<string>();

    for (const hook of hookCalls) {
      const body = hook.getArguments()[0];
      if (!body) continue;

      // Variable declarations inside the hook
      for (const decl of body.getDescendantsOfKind(
        SyntaxKind.VariableDeclaration,
      )) {
        varNames.add(decl.getName());
      }

      // Assignments to outer-scope variables (e.g. `myVar = new Foo()`)
      for (const bin of body.getDescendantsOfKind(
        SyntaxKind.BinaryExpression,
      )) {
        if (bin.getOperatorToken().getText() === "=") {
          const left = bin.getLeft();
          if (Node.isIdentifier(left)) {
            varNames.add(left.getText());
          }
        }
      }
    }

    return Array.from(varNames);
  }

  // ── AST navigation helpers ─────────────────────────────────────────

  /**
   * Walk up the AST from a test call to find the nearest enclosing
   * `describe()` CallExpression.
   */
  private static findEnclosingDescribe(
    node: Node,
  ): CallExpression | undefined {
    let current: Node | undefined = node.getParent();
    while (current) {
      if (Node.isCallExpression(current)) {
        const root = MinerHelpers.getRootIdentifierName(
          current.getExpression(),
        );
        if (root === "describe") return current;
      }
      current = current.getParent();
    }
    return undefined;
  }

  private static getRootIdentifierName(expr: Node): string | undefined {
    if (Node.isIdentifier(expr)) return expr.getText();
    if (Node.isPropertyAccessExpression(expr))
      return MinerHelpers.getRootIdentifierName(expr.getExpression());
    return undefined;
  }

  private static isItOrTestCall(call: CallExpression): boolean {
    const root = MinerHelpers.getRootIdentifierName(call.getExpression());
    return root === "it" || root === "test";
  }
}
