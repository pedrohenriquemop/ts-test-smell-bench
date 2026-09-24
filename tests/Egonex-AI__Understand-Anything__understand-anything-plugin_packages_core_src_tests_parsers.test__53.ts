import { describe, it, expect } from "vitest";
import { MarkdownParser } from "../plugins/parsers/markdown-parser.js";
import { YAMLConfigParser } from "../plugins/parsers/yaml-parser.js";
import { JSONConfigParser, stripJsoncSyntax } from "../plugins/parsers/json-parser.js";
import { TOMLParser } from "../plugins/parsers/toml-parser.js";
import { EnvParser } from "../plugins/parsers/env-parser.js";
import { DockerfileParser } from "../plugins/parsers/dockerfile-parser.js";
import { SQLParser } from "../plugins/parsers/sql-parser.js";
import { GraphQLParser } from "../plugins/parsers/graphql-parser.js";
import { ProtobufParser } from "../plugins/parsers/protobuf-parser.js";
import { TerraformParser } from "../plugins/parsers/terraform-parser.js";
import { MakefileParser } from "../plugins/parsers/makefile-parser.js";
import { ShellParser } from "../plugins/parsers/shell-parser.js";
import { registerAllParsers } from "../plugins/parsers/index.js";
import { PluginRegistry } from "../plugins/registry.js";


describe("ShellParser edge cases", () => {
  const parser = new ShellParser();

  // ── TARGET TEST ─────────────────────────────────
  it("rejects function-like patterns that lack an opening brace", () => {
      // Regression: pre-2.6.2 the regex matched `name() echo hi` (POSIX
      // one-liner) and `usage()` strings appearing in heredocs as if they
      // were function definitions.
      const content = [
        "name() echo hi",
        "say_usage() # comment, no brace",
        "real_func() {",
        "  echo real",
        "}",
      ].join("\n");
      const result = parser.analyzeFile("script.sh", content);
      expect(result.functions.map((f) => f.name)).toEqual(["real_func"]);
    })
  // ── END TARGET TEST ─────────────────────────────
});