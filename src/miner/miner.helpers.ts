import {
  CallExpression,
  Node,
  Project,
  SourceFile,
  Statement,
  SyntaxKind,
} from "ts-morph";
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

  // ── Test case extraction ────────────────────────────────────────────

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

      // ── Build skeletal test file (AST-pruned) ─────────────────
      const text = MinerHelpers.buildSkeletalTestFile(sourceFile, testCall);

      // ── Per-test context (kept for manifesto / analyzer) ──────
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

  // ── Skeletal test file builder (AST Pruning) ────────────────────────

  /**
   * Build a valid, AST-pruned TypeScript file containing only:
   *
   *  - All imports from the original source file
   *  - Top-level declarations (variables, helpers, types)
   *  - The full ancestor `describe()` chain (all levels, not just the nearest)
   *  - Setup/teardown hooks and shared variables at each scope level
   *  - The single target `it()`/`test()` block, wrapped with marker comments
   *
   * All sibling tests and non-ancestor describe blocks are removed.
   * The result is a self-contained, readable file suitable for both
   * human evaluators and LLM analysis.
   */
  static buildSkeletalTestFile(
    sourceFile: SourceFile,
    testCall: CallExpression,
  ): string {
    const lines: string[] = [];

    // 1. Imports
    const imports = sourceFile.getImportDeclarations();
    for (const imp of imports) {
      lines.push(imp.getText().trim());
    }
    if (imports.length > 0) lines.push("");

    // 2. Find all ancestor describe calls (outermost first)
    const ancestors = MinerHelpers.findAllAncestorDescribes(testCall);

    // 3. Process file-level statements recursively
    MinerHelpers.processScopeStatements(
      sourceFile.getStatements(),
      ancestors,
      0,
      testCall,
      0,
      lines,
    );

    return lines.join("\n");
  }

  /**
   * Walk up the AST from a test call to find ALL enclosing
   * `describe()` CallExpressions, returned outermost-first.
   */
  private static findAllAncestorDescribes(node: Node): CallExpression[] {
    const result: CallExpression[] = [];
    let current: Node | undefined = node.getParent();
    while (current) {
      if (Node.isCallExpression(current)) {
        const root = MinerHelpers.getRootIdentifierName(
          current.getExpression(),
        );
        if (root === "describe") {
          result.unshift(current); // prepend → outermost first
        }
      }
      current = current.getParent();
    }
    return result;
  }

  /**
   * Recursively process statements at a given scope level.
   *
   * Keeps all statements EXCEPT:
   *  - `it()`/`test()` calls that are NOT the target test
   *  - `describe()` calls that are NOT in the ancestor chain
   *
   * For ancestor describe blocks, reconstructs the describe wrapper and
   * recurses into its body. For the target test, wraps it with marker
   * comments.
   */
  private static processScopeStatements(
    statements: Statement[],
    ancestors: CallExpression[],
    ancestorIdx: number,
    testCall: CallExpression,
    indent: number,
    lines: string[],
  ): void {
    const pad = "  ".repeat(indent);

    for (const stmt of statements) {
      // Skip imports (already emitted at file level)
      if (Node.isImportDeclaration(stmt)) continue;

      // ── Check: does this statement contain the next ancestor describe?
      if (ancestorIdx < ancestors.length) {
        const nextAncestor = ancestors[ancestorIdx];
        if (MinerHelpers.nodeContains(stmt, nextAncestor)) {
          const describeName =
            nextAncestor.getArguments()[0]?.getText() ?? "'unknown'";
          const callback = nextAncestor.getArguments()[1];
          const block = callback?.getDescendantsOfKind(SyntaxKind.Block)[0];

          lines.push("");
          lines.push(`${pad}describe(${describeName}, () => {`);

          if (block) {
            MinerHelpers.processScopeStatements(
              block.getStatements(),
              ancestors,
              ancestorIdx + 1,
              testCall,
              indent + 1,
              lines,
            );
          }

          lines.push(`${pad}});`);
          continue;
        }
      }

      // ── Check: does this statement contain the target test?
      if (MinerHelpers.nodeContains(stmt, testCall)) {
        lines.push("");
        lines.push(
          `${pad}// ── TARGET TEST ─────────────────────────────────`,
        );
        lines.push(MinerHelpers.reindent(testCall.getText(), indent));
        lines.push(
          `${pad}// ── END TARGET TEST ─────────────────────────────`,
        );
        continue;
      }

      // ── Check: is this a sibling it/test/describe call? → skip
      if (Node.isExpressionStatement(stmt)) {
        const expr = stmt.getExpression();
        if (Node.isCallExpression(expr)) {
          const name = MinerHelpers.getRootIdentifierName(
          const rootName = MinerHelpers.getRootIdentifierName(
            expr.getExpression(),
          );
          
          if (
            name === "it" ||
            name === "test" ||
            name === "describe"
            rootName === "it" ||
            rootName === "test" ||
            rootName === "describe"
          ) {
            continue; // sibling test or non-ancestor describe → prune
          }

          // Catch custom test wrappers like concurrentIf()("name", () => {})
          const knownHooks = [
            "beforeEach", "beforeAll", "afterEach", "afterAll",
            "before", "after", "setup", "teardown"
          ];
          
          if (rootName && !knownHooks.includes(rootName)) {
            // If the call contains an ArrowFunction or FunctionExpression,
            // it is very likely a custom test block or describe block.
            const hasFunctionArg = 
              expr.getDescendantsOfKind(SyntaxKind.ArrowFunction).length > 0 ||
              expr.getDescendantsOfKind(SyntaxKind.FunctionExpression).length > 0;
              
            if (hasFunctionArg) {
              continue; // Prune custom test/describe wrappers
            }
          }
        }
      }

      // ── Keep everything else (variables, hooks, helpers, types, etc.)
      lines.push(MinerHelpers.reindent(stmt.getText(), indent));
    }
  }

  /**
   * Check if `outer`'s source range fully contains `inner`'s range.
   */
  private static nodeContains(outer: Node, inner: Node): boolean {
    return (
      outer.getStart() <= inner.getStart() &&
      outer.getEnd() >= inner.getEnd()
    );
  }

  /**
   * Re-indent a block of text to a target indentation level (2 spaces
   * per level).  Strips the existing minimum indentation and replaces
   * it with the target depth.
   */
  private static reindent(text: string, targetIndent: number): string {
    const textLines = text.split("\n");
    if (textLines.length === 0) return "";

    // Find minimum indentation of non-empty lines
    let minIndent = Infinity;
    for (const line of textLines) {
      if (line.trim().length === 0) continue;
      const match = line.match(/^(\s*)/);
      if (match) minIndent = Math.min(minIndent, match[1].length);
    }
    if (minIndent === Infinity) minIndent = 0;

    const pad = "  ".repeat(targetIndent);
    return textLines
      .map((line) => {
        if (line.trim().length === 0) return "";
        return pad + line.slice(minIndent);
      })
      .join("\n");
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

  // ── Describe context extraction (for manifesto) ────────────────────

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
